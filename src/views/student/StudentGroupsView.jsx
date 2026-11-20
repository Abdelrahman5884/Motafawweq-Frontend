import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useGroups } from '../../context/GroupsContext';
import { useAuth } from '../../context/AuthContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { copyTextToClipboard, extractGroupJoinCode } from '../../utils';
import {
  Building2,
  BookOpen,
  Calendar,
  MapPin,
  Coins,
  QrCode,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  UserCheck,
  Copy,
  Check,
  LogOut,
  AlertCircle,
  RefreshCw,
  CreditCard,
  KeyRound,
  X
} from 'lucide-react';
import { ClassQrModal } from '../../features/teacher/classes/ClassQrModal';
import { StudentWeeklySchedule } from '../../features/student/schedule';
import { StudentCenterQrPassModal } from '../../components/student/StudentCenterQrPassModal';

export const StudentGroupsView = ({ defaultTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';
  const { currentUser } = useAuth();
  const {
    groups,
    loadingGroups,
    groupsError,
    refreshGroups,
    studentJoinByCode,
    studentLeaveGroup,
    studentStudySessions
  } = useGroups();

  const routeTab = useMemo(() => {
    if (defaultTab === 'schedule' || location.pathname.includes('/schedule') || searchParams.get('tab') === 'schedule') {
      return 'schedule';
    }
    return 'groups';
  }, [defaultTab, location.pathname, searchParams]);

  const [activeTab, setActiveTab] = useState(routeTab);
  const [lastRouteTab, setLastRouteTab] = useState(routeTab);
  if (routeTab !== lastRouteTab) {
    setLastRouteTab(routeTab);
    setActiveTab(routeTab);
  }

  // Pre-fill group join code when opened from a scanned QR URL (/join-group/:code -> ?joinCode=...)
  const joinCodeParam = searchParams.get('joinCode') || '';
  const [inputCode, setInputCode] = useState(() => extractGroupJoinCode(joinCodeParam));
  const [lastJoinParam, setLastJoinParam] = useState(joinCodeParam);
  if (joinCodeParam && joinCodeParam !== lastJoinParam) {
    setLastJoinParam(joinCodeParam);
    const cleaned = extractGroupJoinCode(joinCodeParam);
    if (cleaned) {
      setInputCode(cleaned);
      setActiveTab('groups');
    }
  }
  const [isJoining, setIsJoining] = useState(false);
  const [joinResult, setJoinResult] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'enrolled' | 'pending'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedGroupId, setCopiedGroupId] = useState('');

  const [selectedGroupForQr, setSelectedGroupForQr] = useState(null);
  const [isCenterQrPassOpen, setIsCenterQrPassOpen] = useState(false);
  const [passInitialGroupId, setPassInitialGroupId] = useState('all');

  const [leaveTargetGroup, setLeaveTargetGroup] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (joinCodeParam) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('joinCode');
      setSearchParams(nextParams, { replace: true });
    }
  }, [joinCodeParam, searchParams, setSearchParams]);

  const studentNameAr = currentUser?.nameAr || currentUser?.name || '';
  const studentPhone = currentUser?.phone || '';

  // Authoritative student groups list from backend (uses explicit enrollmentStatus)
  const studentGroups = useMemo(() => {
    return (groups || [])
      .map((g) => ({
        ...g,
        isEnrolled: g.enrollmentStatus === 'enrolled',
        isPending: g.enrollmentStatus === 'pending'
      }))
      .filter((g) => g.isEnrolled || g.isPending);
  }, [groups]);

  const enrolledCount = useMemo(
    () => studentGroups.filter((g) => g.isEnrolled).length,
    [studentGroups]
  );
  const pendingCount = useMemo(
    () => studentGroups.filter((g) => g.isPending).length,
    [studentGroups]
  );
  const avgAttendanceRate = useMemo(() => {
    const enrolled = studentGroups.filter((g) => g.isEnrolled);
    if (enrolled.length === 0) return 100;
    const sum = enrolled.reduce((acc, g) => acc + Number(g.attendanceRate ?? 100), 0);
    return Math.round(sum / enrolled.length);
  }, [studentGroups]);

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return studentGroups.filter((g) => {
      if (statusFilter === 'enrolled' && !g.isEnrolled) return false;
      if (statusFilter === 'pending' && !g.isPending) return false;
      if (!q) return true;
      return (
        (g.nameAr || '').toLowerCase().includes(q) ||
        (g.nameEn || '').toLowerCase().includes(q) ||
        (g.subjectAr || '').toLowerCase().includes(q) ||
        (g.teacherName || '').toLowerCase().includes(q) ||
        (g.centerName || '').toLowerCase().includes(q) ||
        (g.joinCode || '').toLowerCase().includes(q)
      );
    });
  }, [studentGroups, statusFilter, searchQuery]);

  // Today's session calculation
  const todayDayKey = useMemo(() => {
    const dayNum = new Date().getDay();
    const map = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return map[dayNum] || 'tuesday';
  }, []);

  const todaySessionsCount = useMemo(() => {
    let centerCount = 0;
    studentGroups.forEach((g) => {
      const slots = g.scheduleSlots || [];
      centerCount += slots.filter((s) => (s.day || '').toLowerCase() === todayDayKey).length;
    });
    const studyCount = (studentStudySessions || []).filter(
      (s) => (s.day || '').toLowerCase() === todayDayKey && !s.isCompleted
    ).length;
    return centerCount + studyCount;
  }, [studentGroups, studentStudySessions, todayDayKey]);

  useSetBreadcrumbs(
    activeTab === 'schedule'
      ? [
          {
            labelAr: 'جدول المواعيد والمذاكرة الأسبوعي',
            labelEn: 'Weekly Schedule & Study Plan',
            onClick: () => {
              setActiveTab('schedule');
              navigate('/student/schedule');
            }
          }
        ]
      : []
  );

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    const cleaned = extractGroupJoinCode(inputCode);
    if (!cleaned || isJoining) return;

    setIsJoining(true);
    setJoinResult(null);
    try {
      const res = await studentJoinByCode(cleaned, {
        nameAr: studentNameAr,
        name: currentUser?.name || studentNameAr,
        phone: studentPhone,
        parentNameAr: currentUser?.parentNameAr || '',
        parentPhone: currentUser?.parentPhone || ''
      });
      setJoinResult(res);
      if (res?.success) {
        setInputCode('');
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleCopyGroupCode = async (group) => {
    if (!group?.joinCode) return;
    const ok = await copyTextToClipboard(group.joinCode);
    if (ok) {
      setCopiedGroupId(group.id);
      window.setTimeout(() => setCopiedGroupId(''), 2000);
    }
  };

  const handleConfirmLeaveGroup = async () => {
    if (!leaveTargetGroup || isLeaving) return;
    setIsLeaving(true);
    try {
      const res = await studentLeaveGroup(leaveTargetGroup.id);
      if (res?.success) {
        setLeaveTargetGroup(null);
      }
    } finally {
      setIsLeaving(false);
    }
  };

  const openPassForGroup = (groupId = 'all') => {
    setPassInitialGroupId(groupId);
    setIsCenterQrPassOpen(true);
  };

  return (
    <div style={{
      maxWidth: activeTab === 'schedule' ? '1280px' : '1120px',
      margin: '0 auto',
      padding: '28px 20px 80px',
      fontFamily: 'var(--font-arabic)',
      direction: isRtl ? 'rtl' : 'ltr',
      transition: 'max-width 0.2s ease'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '900',
          color: 'var(--text-primary)',
          margin: '0 0 6px 0',
          letterSpacing: '-0.3px'
        }}>
          {activeTab === 'schedule'
            ? (isAr ? 'جدول المواعيد الأسبوعي وتنظيم المذاكرة' : 'Weekly Schedule & Study Plan')
            : (isAr ? 'مجموعاتي الدراسية ومجموعات السنتر' : 'My Study Groups & Cohorts')}
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          {activeTab === 'schedule'
            ? (isAr
                ? 'متابعة مواعيد حصصك وقاعات السنتر مع معلميك، تنظيم جلسات المذاكرة الشخصية، وتدوين الملاحظات اليومية'
                : 'Track your center classes, organize personal study sessions, and manage daily notes')
            : (isAr
                ? 'متابعة المجموعات والقاعات المسجل بها مع معلميك، مواعيد الحصص، الانضمام بكود المجموعة، وطباعة بطاقة السنتر الذكية'
                : 'Track your enrolled cohorts, join via group code, and print your smart center student pass')}
        </p>
      </div>

      {/* Tab Switcher & Smart Center Pass Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {/* Tab Switcher Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'var(--bg-subtle)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          width: 'fit-content'
        }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('groups');
              navigate('/student/groups', { replace: true });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: activeTab === 'groups' ? '800' : '600',
              backgroundColor: activeTab === 'groups' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'groups' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'groups' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Building2 size={16} />
            <span>{isAr ? 'المجموعات والقاعات المسجل بها' : 'Enrolled Cohorts'}</span>
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: activeTab === 'groups' ? 'rgba(21, 136, 199, 0.12)' : 'var(--border-subtle)',
              color: activeTab === 'groups' ? 'var(--primary)' : 'var(--text-secondary)'
            }}>
              {studentGroups.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('schedule');
              navigate('/student/schedule', { replace: true });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: activeTab === 'schedule' ? '800' : '600',
              backgroundColor: activeTab === 'schedule' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'schedule' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'schedule' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Calendar size={16} />
            <span>{isAr ? 'جدول المواعيد والمذاكرة الأسبوعي' : 'Weekly Schedule'}</span>
            {todaySessionsCount > 0 ? (
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: 'rgba(21, 136, 199, 0.15)',
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                {isAr ? `${todaySessionsCount} اليوم` : `${todaySessionsCount} Today`}
              </span>
            ) : (
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981'
              }}>
                {isAr ? 'محدث' : 'Active'}
              </span>
            )}
          </button>
        </div>

        {/* Smart Student Pass Button */}
        <button
          type="button"
          onClick={() => openPassForGroup('all')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #06254E 0%, #1588C7 100%)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(21, 136, 199, 0.28)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
        >
          <CreditCard size={16} />
          <span>{isAr ? 'بطاقة حضور السنتر الذكية (QR & طباعة)' : 'Smart Center Pass (QR & Print)'}</span>
        </button>
      </div>

      {/* API Error Alert with Retry */}
      {groupsError && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '14px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: '700'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={17} />
            <span>{groupsError}</span>
          </div>
          <button
            type="button"
            onClick={refreshGroups}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#EF4444',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} />
            <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        </div>
      )}

      {/* Tab Body */}
      {activeTab === 'schedule' ? (
        <StudentWeeklySchedule
          onSwitchToGroups={() => {
            setActiveTab('groups');
            navigate('/student/groups', { replace: true });
          }}
        />
      ) : (
        <>
          {/* Quick Summary KPI Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
            gap: '12px',
            marginBottom: '22px'
          }}>
            {[
              {
                label: isAr ? 'المجموعات المفعّلة' : 'Active Cohorts',
                value: enrolledCount,
                color: '#1588C7',
                bg: 'rgba(21, 136, 199, 0.12)',
                icon: UserCheck
              },
              {
                label: isAr ? 'طلبات قيد المراجعة' : 'Pending Approval',
                value: pendingCount,
                color: '#F59E0B',
                bg: 'rgba(245, 158, 11, 0.12)',
                icon: Clock
              },
              {
                label: isAr ? 'مواعيد وحصص اليوم' : "Today's Sessions",
                value: todaySessionsCount,
                color: '#6366F1',
                bg: 'rgba(99, 102, 241, 0.12)',
                icon: Calendar
              },
              {
                label: isAr ? 'متوسط نسبة الحضور' : 'Attendance Rate',
                value: `${avgAttendanceRate}%`,
                color: '#10B981',
                bg: 'rgba(16, 185, 129, 0.12)',
                icon: CheckCircle2
              }
            ].map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: stat.bg,
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComp size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Join Group Input Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '18px',
            border: '1px solid var(--border-subtle)',
            padding: '20px 24px',
            marginBottom: '26px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} color="var(--primary)" />
                <h2 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {isAr ? 'الانضمام إلى مجموعة دراسية بكود أو رابط باركود' : 'Join a Study Group via Code or QR Link'}
                </h2>
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>
                {isAr ? 'يدعم إدخال الكود مباشرة أو لصق رابط QR المجموعة' : 'Supports raw group code or full QR link'}
              </span>
            </div>

            <form
              onSubmit={handleJoinSubmit}
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                alignItems: 'stretch'
              }}
            >
              <input
                type="text"
                dir="ltr"
                placeholder={isAr ? 'أدخل كود المجموعة (مثال: GRP-7492 أو BIO-DK-2026)...' : 'Enter group code (e.g. GRP-7492)...'}
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  setJoinResult(null);
                }}
                style={{
                  flex: '1 1 260px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  fontFamily: 'monospace',
                  letterSpacing: '0.8px',
                  outline: 'none'
                }}
              />

              <button
                type="submit"
                disabled={!inputCode.trim() || isJoining}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '11px 22px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: (!inputCode.trim() || isJoining) ? 'var(--text-muted)' : 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: (!inputCode.trim() || isJoining) ? 'not-allowed' : 'pointer',
                  opacity: (!inputCode.trim() || isJoining) ? 0.65 : 1,
                  boxShadow: inputCode.trim() && !isJoining ? '0 4px 12px var(--primary-glow)' : 'none'
                }}
              >
                <Plus size={15} />
                <span>{isJoining ? (isAr ? 'جاري الإرسال...' : 'Submitting...') : (isAr ? 'انضمام للمجموعة' : 'Join Cohort')}</span>
              </button>
            </form>

            {/* Join Result Feedback */}
            {joinResult && (
              <div style={{
                marginTop: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: joinResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${joinResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                color: joinResult.success ? '#10B981' : '#EF4444',
                fontSize: '12.5px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {joinResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>
                    {joinResult.success
                      ? (joinResult.message || (isAr ? 'تم إرسال طلب الانضمام بنجاح! بانتظار موافقة المعلم.' : 'Join request sent successfully!'))
                      : (joinResult.error || joinResult.message)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setJoinResult(null)}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Section Title + Search & Status Filter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <h2 style={{
              fontSize: '17px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {isAr ? 'المجموعات التي تدرس بها حالياً' : 'Your Enrolled Cohorts'}
            </h2>

            {studentGroups.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '6px 10px'
                }}>
                  <Search size={14} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder={isAr ? 'بحث باسم المجموعة أو الكود...' : 'Search by name or code...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      outline: 'none',
                      width: '165px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{
                  display: 'inline-flex',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '3px',
                  borderRadius: '9px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  {[
                    { id: 'all', ar: 'الكل', en: 'All' },
                    { id: 'enrolled', ar: 'مقيد', en: 'Active' },
                    { id: 'pending', ar: 'انتظار', en: 'Pending' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setStatusFilter(f.id)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: statusFilter === f.id ? 'var(--bg-surface)' : 'transparent',
                        color: statusFilter === f.id ? 'var(--primary)' : 'var(--text-secondary)',
                        fontSize: '11.5px',
                        fontWeight: statusFilter === f.id ? '800' : '600',
                        cursor: 'pointer'
                      }}
                    >
                      {isAr ? f.ar : f.en}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Groups Grid / Skeleton / Empty States */}
          {loadingGroups ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '20px'
            }}>
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  className="executive-skeleton"
                  style={{
                    height: '240px',
                    borderRadius: '18px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)'
                  }}
                />
              ))}
            </div>
          ) : studentGroups.length === 0 ? (
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              padding: '44px 20px',
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}>
              <Building2 size={38} color="var(--primary)" style={{ margin: '0 auto 10px', opacity: 0.65 }} />
              <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                {isAr ? 'لم تنضم إلى أي مجموعة سنتر بعد' : 'Not joined to any cohort yet'}
              </h3>
              <p style={{ fontSize: '12.5px', margin: 0 }}>
                {isAr
                  ? 'احصل على كود المجموعة من معلمك أو امسح باركود المجموعة للانضمام فوراً'
                  : 'Enter your teacher group code above to request enrollment'}
              </p>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px dashed var(--border-subtle)',
              padding: '32px 20px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700'
            }}>
              {isAr ? 'لا توجد مجموعات تطابق معايير البحث الحالية.' : 'No cohorts match your current filter.'}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '20px'
            }}>
              {filteredGroups.map((g) => {
                const isCopied = copiedGroupId === g.id;
                const priceDisplay = Number(g.priceEgp || 0) > 0
                  ? `${g.priceEgp} ${isAr ? 'ج.م / شهرياً' : 'EGP / mo'}`
                  : (isAr ? 'مجانية' : 'Free');

                return (
                  <div
                    key={g.id}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '18px',
                      border: '1px solid var(--border-subtle)',
                      padding: '22px',
                      boxShadow: 'var(--shadow-xs)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '16px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      {/* Status Badge & Quick QR Trigger */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          backgroundColor: g.isEnrolled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          color: g.isEnrolled ? '#10B981' : '#D97706',
                          border: `1px solid ${g.isEnrolled ? 'rgba(16, 185, 129, 0.28)' : 'rgba(245, 158, 11, 0.28)'}`,
                          fontSize: '11px',
                          fontWeight: '800'
                        }}>
                          {g.isEnrolled ? <UserCheck size={12} /> : <Clock size={12} />}
                          <span>
                            {g.isEnrolled
                              ? (isAr ? 'مقيد ومعتمد في المجموعة' : 'Active Enrolled')
                              : (isAr ? 'طلب انضمام قيد الانتظار' : 'Pending Approval')}
                          </span>
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {g.isEnrolled && (
                            <button
                              type="button"
                              onClick={() => openPassForGroup(g.id)}
                              title={isAr ? 'فتح بطاقة الحضور لهذه المجموعة' : 'Open Student Pass for this group'}
                              style={{
                                border: '1px solid rgba(21, 136, 199, 0.25)',
                                background: 'rgba(21, 136, 199, 0.08)',
                                borderRadius: '8px',
                                padding: '5px 8px',
                                cursor: 'pointer',
                                color: 'var(--primary)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11px',
                                fontWeight: '800'
                              }}
                            >
                              <CreditCard size={13} />
                              <span>{isAr ? 'بطاقتي' : 'Pass'}</span>
                            </button>
                          )}

                          {g.joinCode && (
                            <button
                              type="button"
                              onClick={() => setSelectedGroupForQr(g)}
                              title={isAr ? 'عرض باركود الانضمام للمجموعة' : 'Show Group Join QR'}
                              style={{
                                border: '1px solid var(--border-subtle)',
                                background: 'var(--bg-subtle)',
                                borderRadius: '8px',
                                padding: '6px',
                                cursor: 'pointer',
                                color: 'var(--text-secondary)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <QrCode size={15} />
                            </button>
                          )}
                        </div>
                      </div>

                      <h3 style={{
                        fontSize: '16.5px',
                        fontWeight: '900',
                        color: 'var(--text-primary)',
                        margin: '0 0 8px 0',
                        lineHeight: 1.35
                      }}>
                        {isAr ? g.nameAr : (g.nameEn || g.nameAr)}
                      </h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 9px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--primary-surface)',
                          color: 'var(--primary)',
                          fontSize: '11.5px',
                          fontWeight: '800'
                        }}>
                          <BookOpen size={12} />
                          <span>{isAr ? g.subjectAr : (g.subjectEn || g.subjectAr)}</span>
                        </span>

                        {g.isEnrolled && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            color: '#10B981',
                            fontSize: '11px',
                            fontWeight: '800'
                          }}>
                            <CheckCircle2 size={11} />
                            <span>{isAr ? `حضور ${g.attendanceRate ?? 100}%` : `${g.attendanceRate ?? 100}% Att.`}</span>
                          </span>
                        )}
                      </div>

                      {/* Group Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                        {(g.teacherNameAr || g.teacherName) && (
                          <div>
                            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                              {isAr ? `المعلم: ${g.teacherNameAr || g.teacherName}` : `Teacher: ${g.teacherNameEn || g.teacherName}`}
                            </span>
                          </div>
                        )}

                        {(g.scheduleAr || g.scheduleEn) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
                            <span>{isAr ? g.scheduleAr : (g.scheduleEn || g.scheduleAr)}</span>
                          </div>
                        )}

                        {g.centerName && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
                            <span>
                              {g.centerName}{g.hallName ? ` — ${g.hallName}` : ''}
                            </span>
                          </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Coins size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
                          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                            {priceDisplay}
                          </span>
                        </div>

                        {g.isEnrolled && g.studentPasscode && (
                          <div style={{
                            marginTop: '4px',
                            padding: '7px 10px',
                            borderRadius: '9px',
                            backgroundColor: 'var(--bg-subtle)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '11.5px'
                          }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                              <KeyRound size={12} color="var(--primary)" />
                              {isAr ? 'كود مرور الحضور (PIN):' : 'Attendance PIN:'}
                            </span>
                            <span dir="ltr" style={{ fontFamily: 'monospace', fontWeight: '900', color: 'var(--primary)', letterSpacing: '1.5px' }}>
                              {g.studentPasscode}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer: Real Group Join Code + Copy + Leave/Cancel */}
                    <div style={{
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                          {isAr ? 'كود المجموعة:' : 'Group Code:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyGroupCode(g)}
                          disabled={!g.joinCode}
                          title={isAr ? 'اضغط لنسخ كود المجموعة' : 'Click to copy group code'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 9px',
                            borderRadius: '7px',
                            border: '1px dashed rgba(21, 136, 199, 0.45)',
                            backgroundColor: 'var(--primary-surface)',
                            color: 'var(--primary)',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            fontWeight: '900',
                            letterSpacing: '0.7px',
                            cursor: g.joinCode ? 'pointer' : 'default'
                          }}
                        >
                          <span dir="ltr">{g.joinCode || '—'}</span>
                          {g.joinCode && (isCopied ? <Check size={12} color="#10B981" /> : <Copy size={12} />)}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setLeaveTargetGroup(g)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          backgroundColor: 'rgba(239, 68, 68, 0.06)',
                          color: '#EF4444',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        <LogOut size={12} />
                        <span>
                          {g.isPending
                            ? (isAr ? 'إلغاء الطلب' : 'Cancel Request')
                            : (isAr ? 'مغادرة' : 'Leave')}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Confirm Leave / Cancel Request Modal */}
      {leaveTargetGroup && (
        <div
          onClick={() => !isLeaving && setLeaveTargetGroup(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(4, 20, 44, 0.72)',
            backdropFilter: 'blur(6px)',
            zIndex: 10002,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '18px',
              border: '1px solid var(--border-subtle)',
              maxWidth: '420px',
              width: '100%',
              padding: '22px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.35)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <LogOut size={18} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {leaveTargetGroup.isPending
                  ? (isAr ? 'تأكيد إلغاء طلب الانضمام' : 'Cancel Join Request?')
                  : (isAr ? 'تأكيد مغادرة المجموعة' : 'Leave Study Group?')}
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 18px 0' }}>
              {leaveTargetGroup.isPending
                ? (isAr
                    ? `هل أنت متأكد من إلغاء طلب انضمامك إلى «${leaveTargetGroup.nameAr}»؟ يمكنك إعادة إرسال الطلب لاحقاً بنفس الكود.`
                    : `Cancel your pending join request for "${leaveTargetGroup.nameEn || leaveTargetGroup.nameAr}"?`)
                : (isAr
                    ? `هل أنت متأكد من مغادرة مجموعة «${leaveTargetGroup.nameAr}»؟ ستختفي مواعيدها من جدولك الأسبوعي.`
                    : `Are you sure you want to leave "${leaveTargetGroup.nameEn || leaveTargetGroup.nameAr}"? Its slots will be removed from your schedule.`)}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                disabled={isLeaving}
                onClick={() => setLeaveTargetGroup(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {isAr ? 'تراجع' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={isLeaving}
                onClick={handleConfirmLeaveGroup}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: isLeaving ? 'wait' : 'pointer',
                  opacity: isLeaving ? 0.7 : 1
                }}
              >
                {isLeaving
                  ? (isAr ? 'جاري التنفيذ...' : 'Processing...')
                  : (leaveTargetGroup.isPending ? (isAr ? 'إلغاء الطلب' : 'Cancel Request') : (isAr ? 'تأكيد المغادرة' : 'Leave Group'))}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal for Selected Group */}
      <ClassQrModal
        showQrModal={Boolean(selectedGroupForQr)}
        selectedClass={selectedGroupForQr}
        lang={lang}
        onClose={() => setSelectedGroupForQr(null)}
      />

      {/* Student Center Digital & Printable Smart Pass Modal */}
      <StudentCenterQrPassModal
        isOpen={isCenterQrPassOpen}
        onClose={() => setIsCenterQrPassOpen(false)}
        initialGroupId={passInitialGroupId}
        studentInfo={{
          name: studentNameAr,
          phone: studentPhone,
          code: currentUser?.studentCode || currentUser?.student_code || '',
          grade: currentUser?.grade || ''
        }}
      />
    </div>
  );
};
