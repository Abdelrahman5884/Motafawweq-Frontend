import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Clock,
  Copy,
  DollarSign,
  GraduationCap,
  Layers,
  Pencil,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { formatTimeTo12h } from './centerGroupsUtils';

export const CenterGroupsListSection = ({
  groups = [],
  groupsMeta = null,
  enrolledStudents = {},
  pendingStudents = {},
  branches = [],
  rooms = [],
  centerNameAr = '',
  loadingGroups = false,
  onRefresh,
  onOpenAddCohort,
  onOpenEditCohort,
  onDeleteCohort,
  onOpenGroupStudents,
  onRegenerateJoinCode,
  lang = 'ar',
  isRtl = true,
}) => {
  const isAr = lang === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedTeacher, setSelectedTeacher] = useState('ALL');
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [regeneratingId, setRegeneratingId] = useState(null);

  const handleCopyCode = (code, id, e) => {
    if (e) e.stopPropagation();
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleRegenCode = async (groupId, e) => {
    if (e) e.stopPropagation();
    if (!onRegenerateJoinCode || regeneratingId) return;
    setRegeneratingId(groupId);
    try {
      await onRegenerateJoinCode(groupId);
    } finally {
      setRegeneratingId(null);
    }
  };

  const totalEnrolledAllGroups = groups.reduce(
    (acc, g) => acc + (enrolledStudents[g.id]?.length ?? g.enrolledCount ?? 0),
    0
  );

  const totalPendingAllGroups = groups.reduce(
    (acc, g) => acc + (pendingStudents[g.id]?.length ?? g.pendingCount ?? 0),
    0
  );

  const totalCenterCapacity = rooms.reduce(
    (acc, r) => acc + (Number.parseInt(r.capacity, 10) || 0),
    0
  );

  const occupiedHallsCount =
    rooms.length > 0
      ? Math.min(
          rooms.length,
          new Set(
            groups
              .map((g) => g.roomId || g.hallName)
              .filter(Boolean)
          ).size
        )
      : new Set(groups.map((g) => g.hallName).filter(Boolean)).size;

  const avgAttendanceRate = Number(groupsMeta?.averageAttendanceRate ?? 0);

  const allSubjects = Array.from(new Set(groups.map((g) => g.subjectAr).filter(Boolean)));
  const allTeachers = Array.from(new Set(groups.map((g) => g.teacherNameAr).filter(Boolean)));

  const filteredGroups = groups.filter((g) => {
    const q = searchTerm.trim().toLowerCase();
    const matchSearch =
      !q ||
      (g.nameAr || '').toLowerCase().includes(q) ||
      (g.teacherNameAr || '').toLowerCase().includes(q) ||
      (g.subjectAr || '').toLowerCase().includes(q) ||
      (g.joinCode || '').toLowerCase().includes(q) ||
      (g.hallName || '').toLowerCase().includes(q);

    const matchBranch =
      selectedBranch === 'ALL' ||
      g.branchId === selectedBranch ||
      g.centerName === selectedBranch;
    const matchSubject = selectedSubject === 'ALL' || g.subjectAr === selectedSubject;
    const matchTeacher = selectedTeacher === 'ALL' || g.teacherNameAr === selectedTeacher;

    return matchSearch && matchBranch && matchSubject && matchTeacher;
  });

  const hasActiveFilters =
    Boolean(searchTerm.trim()) ||
    selectedBranch !== 'ALL' ||
    selectedSubject !== 'ALL' ||
    selectedTeacher !== 'ALL';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBranch('ALL');
    setSelectedSubject('ALL');
    setSelectedTeacher('ALL');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Executive Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          backgroundColor: 'var(--bg-surface-elevated)',
          padding: '20px 24px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #0EA5E9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
              boxShadow: '0 8px 20px rgba(21, 136, 199, 0.22)',
            }}
          >
            <Layers size={25} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: '800',
                  color: 'var(--primary)',
                }}
              >
                {centerNameAr || (isAr ? 'إدارة المجموعات الدراسية' : 'Center Academic Management')}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: 'var(--success, #10B981)',
                  fontWeight: '800',
                }}
              >
                {groups.length} {isAr ? 'مجموعات نشطة' : 'Active Cohorts'}
              </span>
            </div>
            <h1
              style={{
                fontSize: '20px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                margin: '4px 0 0 0',
                fontFamily: 'var(--font-heading), var(--font-arabic)',
              }}
            >
              {isAr
                ? 'المجموعات والصفوف الدراسية وإدارة الباركود'
                : 'Cohorts, Rooms & Barcode Attendance'}
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={loadingGroups}
              style={{
                height: '40px',
                padding: '0 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: loadingGroups ? 'wait' : 'pointer',
              }}
            >
              <RefreshCw
                size={14}
                color="var(--primary)"
                style={{ animation: loadingGroups ? 'spin 1s linear infinite' : 'none' }}
              />
              <span>{isAr ? 'تحديث' : 'Refresh'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAddCohort}
            style={{
              height: '40px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(21, 136, 199, 0.25)',
            }}
          >
            <Plus size={17} />
            <span>{isAr ? 'إنشاء مجموعة جديدة' : 'Create Cohort'}</span>
          </button>
        </div>
      </div>

      {/* 4 Live KPI Summary Cards (Zero Static Numbers) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 235px), 1fr))',
          gap: '16px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            padding: '18px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
              {isAr ? 'إجمالي المجموعات' : 'Total Cohorts'}
            </span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <Layers size={17} />
            </div>
          </div>
          <div style={{ fontSize: '25px', fontWeight: '900', color: 'var(--text-primary)' }}>
            {groups.length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isAr
              ? `${allSubjects.length} مواد • ${allTeachers.length} معلمين`
              : `${allSubjects.length} subjects • ${allTeachers.length} teachers`}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            padding: '18px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
              {isAr ? 'إجمالي الطلاب المقيدين' : 'Enrolled Students'}
            </span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success, #10B981)',
              }}
            >
              <GraduationCap size={18} />
            </div>
          </div>
          <div style={{ fontSize: '25px', fontWeight: '900', color: 'var(--text-primary)' }}>
            {totalEnrolledAllGroups.toLocaleString()}{' '}
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'طالب' : 'students'}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isAr ? 'مقيدين رسمياً ببطاقات باركود نشطة' : 'Enrolled with active barcode IDs'}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            padding: '18px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
              {isAr ? 'القاعات المشغولة حالياً' : 'Halls In Use'}
            </span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <Building2 size={17} />
            </div>
          </div>
          <div style={{ fontSize: '25px', fontWeight: '900', color: 'var(--text-primary)' }}>
            {occupiedHallsCount}{' '}
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? `من إجمالي ${rooms.length} قاعة` : `of ${rooms.length} halls`}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isAr
              ? `السعة الاستيعابية للقاعات: ${totalCenterCapacity.toLocaleString()} مقعد`
              : `Total halls capacity: ${totalCenterCapacity.toLocaleString()} seats`}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            padding: '18px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
              {isAr ? 'معدل الحضور والطلبات' : 'Attendance & Requests'}
            </span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success, #10B981)',
              }}
            >
              <QrCode size={17} />
            </div>
          </div>
          <div style={{ fontSize: '25px', fontWeight: '900', color: 'var(--success, #10B981)' }}>
            {avgAttendanceRate}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {totalPendingAllGroups > 0
              ? isAr
                ? `${totalPendingAllGroups} طلب انضمام معلق بانتظار القبول`
                : `${totalPendingAllGroups} pending join request(s)`
              : isAr
              ? 'لا توجد طلبات انضمام معلقة حالياً'
              : 'No pending join requests'}
          </div>
        </div>
      </div>

      {/* Catalog Container */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '22px 24px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        {/* Filter Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <h2 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {isAr
                ? 'دليل مجموعات السنتر — اختر مجموعة لإدارة طلابها والباركود'
                : 'Center Cohorts Directory'}
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px', display: 'block' }}>
              {isAr
                ? 'اضغط على أي مجموعة لفتح سجل الطلاب، قبول طلبات الانضمام، ومسح باركود الحضور'
                : 'Select any cohort to open its student roster and live barcode attendance scanner'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={isAr ? 'بحث باسم المجموعة، المدرس، الكود...' : 'Search cohort, teacher, code...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  height: '38px',
                  padding: '0 12px 0 34px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  width: '220px',
                  fontWeight: '600',
                }}
              />
              <Search size={14} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
            </div>

            {branches.length > 0 && (
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                style={{
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <option value="ALL">{isAr ? 'كل الفروع' : 'All Branches'}</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nameAr}
                  </option>
                ))}
              </select>
            )}

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{
                height: '38px',
                padding: '0 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">{isAr ? 'كل المواد' : 'All Subjects'}</option>
              {allSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              style={{
                height: '38px',
                padding: '0 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">{isAr ? 'كل المعلمين' : 'All Teachers'}</option>
              {allTeachers.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Empty State or Groups Grid */}
        {groups.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px dashed var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <Layers size={26} />
            </div>
            <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px' }}>
              {isAr ? 'لا توجد مجموعات دراسية مسجلة في السنتر حتى الآن' : 'No study cohorts created yet'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 18px', lineHeight: 1.5 }}>
              {isAr
                ? 'ابدأ بإنشاء أول مجموعة دراسية، وحدد القاعة والمعلم والمواعيد الأسبوعية لتفعيل نظام الحضور والباركود الذكي.'
                : 'Create your first study group with room, teacher, and weekly sessions to start enrolling students.'}
            </p>
            <button
              type="button"
              onClick={onOpenAddCohort}
              style={{
                padding: '11px 22px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Plus size={16} />
              <span>{isAr ? '+ إنشاء أول مجموعة دراسية' : '+ Create First Cohort'}</span>
            </button>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {isAr ? 'لا توجد مجموعات تطابق معايير البحث الحالية' : 'No cohorts match the current filters'}
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                style={{
                  marginTop: '8px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--primary)',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
              gap: '18px',
            }}
          >
            {filteredGroups.map((group) => {
              const groupEnrolledCount = enrolledStudents[group.id]
                ? enrolledStudents[group.id].length
                : group.enrolledCount ?? 0;
              const groupPendingCount = pendingStudents[group.id]
                ? pendingStudents[group.id].length
                : group.pendingCount ?? 0;

              const room = rooms.find(
                (r) =>
                  r.id === group.roomId ||
                  r.nameAr === group.hallName ||
                  r.id === group.hallName
              ) || {
                nameAr: group.hallName || 'القاعة الرئيسية',
                capacity: group.maxStudents || 50,
              };
              const maxCap =
                Number.parseInt(group.maxStudents, 10) ||
                Number.parseInt(room.capacity, 10) ||
                50;
              const groupSlots = group.scheduleSlots || group.slots || [];

              return (
                <div
                  key={group.id}
                  onClick={() => onOpenGroupStudents(group.id)}
                  className="center-interactive-card"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-subtle)',
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <div>
                    {/* Top Row: Subject, Join Code, Regenerate, Edit, Delete */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        marginBottom: '12px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'rgba(21, 136, 199, 0.1)',
                            color: 'var(--primary)',
                            fontWeight: '800',
                            border: '1px solid rgba(21, 136, 199, 0.2)',
                          }}
                        >
                          {group.subjectAr}
                        </span>
                        {group.gradeAr && (
                          <span
                            style={{
                              fontSize: '10.5px',
                              padding: '3px 8px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: 'var(--bg-app)',
                              color: 'var(--text-secondary)',
                              fontWeight: '700',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            {group.gradeAr}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {group.joinCode && (
                          <button
                            type="button"
                            onClick={(e) => handleCopyCode(group.joinCode, group.id, e)}
                            title={isAr ? 'اضغط لنسخ كود المجموعة' : 'Copy Join Code'}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                              fontWeight: '800',
                              fontFamily: 'monospace',
                              backgroundColor: 'var(--bg-app)',
                              padding: '4px 8px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                            }}
                          >
                            <span>{group.joinCode}</span>
                            {copiedCodeId === group.id ? (
                              <Check size={12} color="var(--success)" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        )}

                        {onRegenerateJoinCode && (
                          <button
                            type="button"
                            onClick={(e) => handleRegenCode(group.id, e)}
                            disabled={regeneratingId === group.id}
                            title={isAr ? 'تجديد كود الانضمام' : 'Regenerate Join Code'}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '28px',
                              height: '28px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-app)',
                              color: 'var(--text-secondary)',
                              cursor: regeneratingId === group.id ? 'wait' : 'pointer',
                            }}
                          >
                            <RefreshCw
                              size={12}
                              style={{
                                animation:
                                  regeneratingId === group.id ? 'spin 1s linear infinite' : 'none',
                              }}
                            />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => onOpenEditCohort(group, e)}
                          title={isAr ? 'تعديل بيانات المجموعة' : 'Edit Cohort'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-app)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                          }}
                        >
                          <Pencil size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCohort(group);
                          }}
                          title={isAr ? 'حذف المجموعة' : 'Delete Cohort'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-app)',
                            color: 'var(--danger, #EF4444)',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: '900',
                        color: 'var(--text-primary)',
                        margin: '0 0 8px 0',
                        lineHeight: 1.4,
                      }}
                    >
                      {group.nameAr}
                    </h3>

                    {/* Teacher & Price Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        marginBottom: '12px',
                      }}
                    >
                      <span>
                        {isAr ? 'المعلم:' : 'Teacher:'}{' '}
                        <strong style={{ color: 'var(--text-primary)', fontWeight: '800' }}>
                          {group.teacherNameAr || (isAr ? 'غير محدد' : 'Unassigned')}
                        </strong>
                      </span>

                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          color: 'var(--success, #10B981)',
                        }}
                      >
                        <DollarSign size={12} />
                        <span>
                          {Number(group.priceEgp ?? 0).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                        </span>
                      </span>
                    </div>

                    {/* Hall Badge */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        backgroundColor: 'var(--bg-app)',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building2 size={15} color="var(--primary)" />
                        <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                          {room.nameAr}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)' }}>
                        {isAr ? `سعة ${room.capacity} مقعد` : `${room.capacity} seats`}
                      </span>
                    </div>

                    {/* Weekly Sessions */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {isAr ? 'المواعيد الأسبوعية:' : 'Weekly Schedule:'}
                      </div>
                      {groupSlots.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {groupSlots.map((slot, sIdx) => (
                            <div
                              key={slot.id || sIdx}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '11px',
                                backgroundColor: 'rgba(21, 136, 199, 0.08)',
                                color: 'var(--primary)',
                                padding: '4px 8px',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: '700',
                                border: '1px solid rgba(21, 136, 199, 0.16)',
                              }}
                            >
                              <Clock size={11} />
                              <span>
                                {slot.dayAr || slot.day}: {formatTimeTo12h(slot.startTime, isAr)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                          <Clock size={12} />
                          <span>{group.scheduleAr || (isAr ? 'غير محدد' : 'Not scheduled')}</span>
                        </div>
                      )}
                    </div>

                    {/* Enrolled & Pending Summary */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--bg-app)',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={15} color="var(--primary)" />
                        <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                          {isAr ? 'الطلاب المقيدون:' : 'Enrolled:'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {groupPendingCount > 0 && (
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: '800',
                              padding: '2px 7px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: 'rgba(245, 158, 11, 0.15)',
                              color: '#D97706',
                            }}
                          >
                            +{groupPendingCount} {isAr ? 'معلق' : 'pending'}
                          </span>
                        )}
                        <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--primary)' }}>
                          {groupEnrolledCount} / {maxCap} {isAr ? 'طالب' : 'students'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenGroupStudents(group.id);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>
                      {isAr
                        ? 'عرض طلاب المجموعة وإدارة الباركود'
                        : 'Manage Roster & Barcode Attendance'}
                    </span>
                    {isRtl ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
