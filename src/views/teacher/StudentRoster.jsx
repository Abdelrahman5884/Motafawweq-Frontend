import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  ArrowRight,
  BookOpen,
  Calendar,
  MapPin,
  Search,
  X,
  UserPlus,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Plus,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { useGroups } from '../../context/GroupsContext';
import {
  RosterTable,
  PendingStudentsTable,
  InviteStudentModal,
  QuickAttendanceBar,
} from '../../features/teacher/roster';

function getLocalTodayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const StudentRoster = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const {
    groups,
    loadingGroups,
    groupsError,
    refreshGroups,
    activeGroupId,
    setActiveGroupId,
    getActiveGroup,
    enrolledStudents,
    pendingStudents,
    rosterStats,
    loadingRoster,
    rosterError,
    fetchGroupRoster,
    showToast,
  } = useGroups();

  const [isMobile, setIsMobile] = useState(
    () => (typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false)
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const [activeTab, setActiveTab] = useState('enrolled'); // 'enrolled' | 'pending'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'top' | 'attention' | 'present' | 'absent'
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const todayStr = useMemo(() => getLocalTodayIso(), []);
  const [attendanceDate, setAttendanceDate] = useState(() => getLocalTodayIso());

  const breadcrumbs = useMemo(
    () => [
      {
        labelAr: activeTab === 'pending' ? 'طلبات الانضمام' : 'الطلاب المقيدون',
        labelEn: activeTab === 'pending' ? 'Pending Requests' : 'Enrolled Students',
        onClick: () => setActiveTab('enrolled'),
      },
    ],
    [activeTab]
  );
  useSetBreadcrumbs(breadcrumbs);

  const activeGroup = getActiveGroup();
  const activeId = activeGroup?.id || activeGroupId || '';

  const currentEnrolled = useMemo(
    () => (activeId && Array.isArray(enrolledStudents[activeId]) ? enrolledStudents[activeId] : []),
    [activeId, enrolledStudents]
  );
  const currentPending = useMemo(
    () => (activeId && Array.isArray(pendingStudents[activeId]) ? pendingStudents[activeId] : []),
    [activeId, pendingStudents]
  );

  const matchesSearch = (s, q) => {
    if (!q) return true;
    return (
      String(s.nameAr || '').toLowerCase().includes(q) ||
      String(s.name || '').toLowerCase().includes(q) ||
      String(s.studentCode || '').toLowerCase().includes(q) ||
      String(s.phone || '').toLowerCase().includes(q) ||
      String(s.email || '').toLowerCase().includes(q) ||
      String(s.parentNameAr || '').toLowerCase().includes(q) ||
      String(s.parentPhone || '').toLowerCase().includes(q) ||
      String(s.studentBarcode || '').toLowerCase().includes(q)
    );
  };

  const filteredEnrolled = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return currentEnrolled.filter((s) => {
      if (!matchesSearch(s, q)) return false;
      const st = s.status || s.academicStatus || 'Good';
      if (statusFilter === 'top') return st === 'Top 1%' || st === 'Excellence';
      if (statusFilter === 'attention') return st === 'Needs Support';
      if (statusFilter === 'present') {
        return s.todayAttendanceStatus === 'present' || s.todayAttendanceStatus === 'late';
      }
      if (statusFilter === 'absent') {
        return s.todayAttendanceStatus !== 'present' && s.todayAttendanceStatus !== 'late';
      }
      return true;
    });
  }, [currentEnrolled, searchQuery, statusFilter]);

  const handleChangeAttendanceDate = (nextDate) => {
    setAttendanceDate(nextDate);
    if (activeId) {
      fetchGroupRoster(activeId, nextDate);
    }
  };

  const filteredPending = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return currentPending.filter((s) => matchesSearch(s, q));
  }, [currentPending, searchQuery]);

  const handleCopyJoinCode = () => {
    if (!activeGroup?.joinCode) return;
    navigator.clipboard?.writeText(activeGroup.joinCode).catch(() => {});
    setCopiedCode(true);
    showToast(isAr ? `تم نسخ كود المجموعة: ${activeGroup.joinCode}` : `Copied code: ${activeGroup.joinCode}`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isCapacityFull =
    activeGroup && Number(activeGroup.maxStudents || 0) > 0 && currentEnrolled.length >= Number(activeGroup.maxStudents);

  const summaryStats = useMemo(() => {
    const apiStats = activeId ? rosterStats?.[activeId] : null;
    const totalEnrolled = currentEnrolled.length;
    const avgAttendance =
      apiStats && typeof apiStats.avgAttendanceRate === 'number'
        ? apiStats.avgAttendanceRate
        : totalEnrolled > 0
          ? Math.round(currentEnrolled.reduce((acc, s) => acc + Number(s.attendanceRate ?? 0), 0) / totalEnrolled)
          : 0;
    const topCount = currentEnrolled.filter((s) => {
      const st = s.status || s.academicStatus;
      return st === 'Top 1%' || st === 'Excellence';
    }).length;
    const attentionCount = currentEnrolled.filter((s) => (s.status || s.academicStatus) === 'Needs Support').length;
    return {
      totalEnrolled,
      pendingCount: currentPending.length,
      avgAttendance,
      topCount,
      attentionCount,
    };
  }, [activeId, rosterStats, currentEnrolled, currentPending]);

  return (
    <div
      style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: isMobile ? '16px 14px 60px' : '26px 24px 80px',
        fontFamily: 'var(--font-arabic)',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Top Bar: Back + Group Switcher + Refresh */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/teacher/classes')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          <ArrowRight size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
          <span>{isAr ? 'العودة للمجموعات والقاعات' : 'Back to Cohorts'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {groups.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'المجموعة:' : 'Cohort:'}
              </span>
              <select
                value={activeGroup?.id || ''}
                onChange={(e) => {
                  const nextId = e.target.value;
                  setActiveGroupId(nextId);
                  setSearchQuery('');
                  setStatusFilter('all');
                  if (attendanceDate !== todayStr) {
                    setAttendanceDate(todayStr);
                  }
                }}
                style={{
                  padding: '7px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  fontFamily: 'inherit',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {isAr ? g.nameAr : g.nameEn || g.nameAr}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeId && (
            <button
              type="button"
              disabled={loadingRoster}
              onClick={() => fetchGroupRoster(activeId, attendanceDate)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 12px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: loadingRoster ? 'wait' : 'pointer',
              }}
            >
              <RefreshCw size={13} className={loadingRoster ? 'animate-spin' : ''} />
              <span>{isAr ? 'تحديث' : 'Refresh'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading / Error / Empty Groups States */}
      {loadingGroups ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '18px',
            border: '1px solid var(--border-subtle)',
            padding: '48px 20px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '13.5px',
            fontWeight: '700',
          }}
        >
          {isAr ? 'جاري تحميل المجموعات وسجل الطلاب...' : 'Loading study groups and roster...'}
        </div>
      ) : groupsError ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '18px',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            padding: '36px 20px',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={30} color="#EF4444" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
            {groupsError}
          </div>
          <button
            type="button"
            onClick={refreshGroups}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        </div>
      ) : !activeGroup ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1.5px dashed var(--border-medium)',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <Users size={38} color="var(--primary)" style={{ marginBottom: '10px', opacity: 0.7 }} />
          <h2 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 8px' }}>
            {isAr ? 'لا توجد مجموعات دراسية بعد' : 'No Study Groups Yet'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 auto 18px', maxWidth: '440px', lineHeight: 1.6 }}>
            {isAr
              ? 'أنشئ أول مجموعة دراسية من صفحة المجموعات والقاعات لتتمكن من استقبال طلبات انضمام الطلاب وإدارة سجلهم.'
              : 'Create your first study group to manage enrolled students and join requests.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/teacher/classes')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Plus size={15} />
            <span>{isAr ? 'إنشاء مجموعة دراسية' : 'Create Study Group'}</span>
          </button>
        </div>
      ) : (
        <>
          {/* Group Header Banner */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              padding: isMobile ? '18px 16px' : '22px 26px',
              marginBottom: '22px',
              boxShadow: 'var(--shadow-xs)',
              display: 'flex',
              alignItems: isMobile ? 'stretch' : 'center',
              justifyContent: 'space-between',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(21, 136, 199, 0.12)',
                    color: 'var(--primary)',
                    fontSize: '11.5px',
                    fontWeight: '800',
                  }}
                >
                  <BookOpen size={13} />
                  <span>{isAr ? activeGroup.subjectAr : activeGroup.subjectEn || activeGroup.subjectAr}</span>
                </span>

                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {isAr ? activeGroup.gradeAr : activeGroup.gradeEn || activeGroup.gradeAr}
                </span>

                {activeGroup.joinCode && (
                  <button
                    type="button"
                    onClick={handleCopyJoinCode}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11.5px',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: copiedCode ? '#10B981' : 'var(--primary)',
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{isAr ? `كود: ${activeGroup.joinCode}` : `Code: ${activeGroup.joinCode}`}</span>
                    {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                )}

                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: '800',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: isCapacityFull ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                    color: isCapacityFull ? '#EF4444' : '#10B981',
                  }}
                >
                  {currentEnrolled.length} / {activeGroup.maxStudents || 50} {isAr ? 'طالب' : 'students'}
                </span>
              </div>

              <h1
                style={{
                  fontSize: isMobile ? '19px' : '23px',
                  fontWeight: '900',
                  color: 'var(--text-primary)',
                  margin: '0 0 8px 0',
                }}
              >
                {isAr
                  ? `سجل طلاب: ${activeGroup.nameAr}`
                  : `Cohort Roster: ${activeGroup.nameEn || activeGroup.nameAr}`}
              </h1>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '12.5px',
                  color: 'var(--text-secondary)',
                  flexWrap: 'wrap',
                }}
              >
                {activeGroup.scheduleAr && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={14} color="var(--primary)" />
                    <span>{isAr ? activeGroup.scheduleAr : activeGroup.scheduleEn || activeGroup.scheduleAr}</span>
                  </div>
                )}
                {activeGroup.centerName && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} color="var(--primary)" />
                    <span>{activeGroup.centerName}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInviteModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                padding: '10px 18px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-primary)',
                flexShrink: 0,
              }}
            >
              <UserPlus size={15} />
              <span>{isAr ? 'دعوة / إضافة طالب' : 'Invite Student'}</span>
            </button>
          </div>

          {/* Cohort KPI Summary Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div
              onClick={() => { setActiveTab('enrolled'); setStatusFilter('all'); }}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '14px 16px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {isAr ? 'الطلاب المقيدون' : 'Enrolled'}
                </span>
                <Users size={15} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '21px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {summaryStats.totalEnrolled}
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginInlineStart: '4px' }}>
                  / {activeGroup.maxStudents || 50}
                </span>
              </div>
            </div>

            <div
              onClick={() => setActiveTab('pending')}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: summaryStats.pendingCount > 0 ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '14px 16px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {isAr ? 'طلبات معلقة' : 'Pending'}
                </span>
                <Clock size={15} color={summaryStats.pendingCount > 0 ? '#D97706' : 'var(--text-muted)'} />
              </div>
              <div style={{ fontSize: '21px', fontWeight: '900', color: summaryStats.pendingCount > 0 ? '#D97706' : 'var(--text-primary)' }}>
                {summaryStats.pendingCount}
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {isAr ? 'متوسط الحضور' : 'Avg Attendance'}
                </span>
                <CheckCircle2 size={15} color="#10B981" />
              </div>
              <div style={{ fontSize: '21px', fontWeight: '900', color: '#10B981' }}>
                {summaryStats.totalEnrolled > 0 ? `${summaryStats.avgAttendance}%` : '—'}
              </div>
            </div>

            <div
              onClick={() => {
                setActiveTab('enrolled');
                setStatusFilter(summaryStats.attentionCount > 0 ? 'attention' : 'top');
              }}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '14px 16px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {isAr ? 'المتفوقون / متابعة' : 'Top / Support'}
                </span>
                <Award size={15} color="#D97706" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', fontSize: '20px', fontWeight: '900' }}>
                <span style={{ color: '#10B981' }}>{summaryStats.topCount}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>/</span>
                <span style={{ color: summaryStats.attentionCount > 0 ? '#EF4444' : 'var(--text-muted)' }}>
                  {summaryStats.attentionCount}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs, Status Filter & Search Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '18px',
            }}
          >
            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-surface)',
                padding: '4px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                width: isMobile ? '100%' : 'auto',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('enrolled')}
                style={{
                  flex: isMobile ? 1 : 'initial',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  padding: '8px 16px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: activeTab === 'enrolled' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'enrolled' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                <Users size={14} />
                <span>{isAr ? 'الطلاب المقيدون' : 'Active Students'}</span>
                <span
                  style={{
                    padding: '1px 6px',
                    borderRadius: '6px',
                    backgroundColor: activeTab === 'enrolled' ? 'rgba(255,255,255,0.25)' : 'var(--bg-subtle)',
                    color: activeTab === 'enrolled' ? '#FFFFFF' : 'var(--primary)',
                    fontSize: '11px',
                    fontWeight: '900',
                  }}
                >
                  {currentEnrolled.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                style={{
                  flex: isMobile ? 1 : 'initial',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  padding: '8px 16px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: activeTab === 'pending' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'pending' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                <Clock size={14} />
                <span>{isAr ? 'طلبات الانضمام والدعوات' : 'Pending & Invites'}</span>
                <span
                  style={{
                    padding: '1px 6px',
                    borderRadius: '6px',
                    backgroundColor:
                      activeTab === 'pending'
                        ? 'rgba(255,255,255,0.25)'
                        : currentPending.length > 0
                          ? 'rgba(245, 158, 11, 0.16)'
                          : 'var(--bg-subtle)',
                    color:
                      activeTab === 'pending'
                        ? '#FFFFFF'
                        : currentPending.length > 0
                          ? '#D97706'
                          : 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: '900',
                  }}
                >
                  {currentPending.length}
                </span>
              </button>
            </div>

            {/* Search + Academic Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: '1 1 260px', justifyContent: 'flex-end' }}>
              {activeTab === 'enrolled' && (
                <div
                  style={{
                    display: 'inline-flex',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '3px',
                    gap: '2px',
                  }}
                >
                  {[
                    { id: 'all', label: isAr ? 'الكل' : 'All' },
                    { id: 'present', label: isAr ? 'حاضر' : 'Present' },
                    { id: 'absent', label: isAr ? 'غير حاضر' : 'Not Present' },
                    { id: 'top', label: isAr ? 'المتفوقون' : 'Top' },
                    { id: 'attention', label: isAr ? 'يحتاج متابعة' : 'Needs Support' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setStatusFilter(f.id)}
                      style={{
                        border: 'none',
                        borderRadius: '7px',
                        padding: '5px 10px',
                        fontSize: '11.5px',
                        fontWeight: statusFilter === f.id ? '800' : '600',
                        backgroundColor: statusFilter === f.id ? 'var(--primary)' : 'transparent',
                        color: statusFilter === f.id ? '#FFFFFF' : 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '11px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  flex: '1 1 220px',
                  maxWidth: isMobile ? '100%' : '340px',
                }}
              >
                <Search size={15} color="var(--text-secondary)" />
                <input
                  type="text"
                  placeholder={isAr ? 'ابحث بالاسم أو الكود أو الهاتف...' : 'Search name, code, or phone...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '12.5px',
                    color: 'var(--text-primary)',
                    width: '100%',
                    fontFamily: 'inherit',
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Roster Error / Loading / Tables */}
          {rosterError ? (
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                padding: '32px 20px',
                textAlign: 'center',
              }}
            >
              <AlertCircle size={28} color="#EF4444" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
                {rosterError}
              </div>
              <button
                type="button"
                onClick={() => fetchGroupRoster(activeId, attendanceDate)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إعادة التحميل' : 'Retry'}
              </button>
            </div>
          ) : loadingRoster && currentEnrolled.length === 0 && currentPending.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                padding: '44px 20px',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: '700',
              }}
            >
              {isAr ? 'جاري تحميل قائمة طلاب المجموعة...' : 'Loading cohort students...'}
            </div>
          ) : activeTab === 'enrolled' ? (
            <>
              {currentEnrolled.length > 0 && (
                <QuickAttendanceBar
                  groupId={activeId}
                  students={currentEnrolled}
                  attendanceDate={attendanceDate}
                  todayStr={todayStr}
                  onChangeDate={handleChangeAttendanceDate}
                  lang={lang}
                  isRtl={isRtl}
                  isMobile={isMobile}
                />
              )}
              <RosterTable
                groupId={activeId}
                students={filteredEnrolled}
                attendanceDate={attendanceDate}
                hasFilters={Boolean(searchQuery.trim() || statusFilter !== 'all')}
                lang={lang}
                isRtl={isRtl}
                isMobile={isMobile}
                onOpenInviteModal={() => setInviteModalOpen(true)}
                onResetFilters={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              />
            </>
          ) : (
            <PendingStudentsTable
              groupId={activeId}
              pendingStudents={filteredPending}
              joinCode={activeGroup.joinCode}
              lang={lang}
              isRtl={isRtl}
              isMobile={isMobile}
              onOpenInviteModal={() => setInviteModalOpen(true)}
            />
          )}

          <InviteStudentModal
            isOpen={inviteModalOpen}
            groupId={activeId}
            groupName={isAr ? activeGroup.nameAr : activeGroup.nameEn || activeGroup.nameAr}
            lang={lang}
            isRtl={isRtl}
            onClose={() => setInviteModalOpen(false)}
            onInvited={() => setActiveTab('pending')}
          />
        </>
      )}
    </div>
  );
};
