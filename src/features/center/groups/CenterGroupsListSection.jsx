import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  Clock,
  Copy,
  GraduationCap,
  Layers,
  Pencil,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { SBadge, SButton, SCard, SPageHeader } from '../../../components/student/ui';
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
  onOpenSchedule,
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
    setTimeout(() => setCopiedCodeId(null), 1800);
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

  const metrics = useMemo(() => {
    const totalEnrolled = groups.reduce(
      (acc, g) => acc + (enrolledStudents[g.id]?.length ?? g.enrolledCount ?? 0),
      0
    );
    const totalPending = groups.reduce(
      (acc, g) => acc + (pendingStudents[g.id]?.length ?? g.pendingCount ?? 0),
      0
    );
    const totalCapacity = rooms.reduce(
      (acc, r) => acc + (Number.parseInt(r.capacity, 10) || 0),
      0
    );
    const occupiedHallsCount =
      rooms.length > 0
        ? Math.min(
            rooms.length,
            new Set(groups.map((g) => g.roomId || g.hallName).filter(Boolean)).size
          )
        : new Set(groups.map((g) => g.hallName).filter(Boolean)).size;
    const avgAttendanceRate = Number(groupsMeta?.averageAttendanceRate ?? 0);

    return {
      totalEnrolled,
      totalPending,
      totalCapacity,
      occupiedHallsCount,
      avgAttendanceRate,
    };
  }, [groups, enrolledStudents, pendingStudents, rooms, groupsMeta]);

  const allSubjects = useMemo(
    () => Array.from(new Set(groups.map((g) => g.subjectAr).filter(Boolean))),
    [groups]
  );
  const allTeachers = useMemo(
    () => Array.from(new Set(groups.map((g) => g.teacherNameAr).filter(Boolean))),
    [groups]
  );

  const filteredGroups = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return groups.filter((g) => {
      const matchSearch =
        !q ||
        (g.nameAr || '').toLowerCase().includes(q) ||
        (g.teacherNameAr || '').toLowerCase().includes(q) ||
        (g.subjectAr || '').toLowerCase().includes(q) ||
        (g.gradeAr || '').toLowerCase().includes(q) ||
        (g.joinCode || '').toLowerCase().includes(q) ||
        (g.hallName || '').toLowerCase().includes(q);

      const matchBranch =
        selectedBranch === 'ALL' ||
        String(g.branchId || '') === String(selectedBranch) ||
        g.centerName === selectedBranch;
      const matchSubject = selectedSubject === 'ALL' || g.subjectAr === selectedSubject;
      const matchTeacher = selectedTeacher === 'ALL' || g.teacherNameAr === selectedTeacher;

      return matchSearch && matchBranch && matchSubject && matchTeacher;
    });
  }, [groups, searchTerm, selectedBranch, selectedSubject, selectedTeacher]);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── 1. Unified Page Header ── */}
      <SPageHeader
        title={isAr ? 'المجموعات والصفوف الدراسية' : 'Study Cohorts & Classes'}
        subtitle={
          isAr
            ? `إدارة مجموعات «${centerNameAr}»، سجل الطلاب، أكواد الانضمام، والحضور الفوري بالباركود.`
            : `Manage cohorts, student rosters, join codes, and instant barcode attendance.`
        }
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {onRefresh && (
              <SButton
                variant="ghost"
                size="sm"
                icon={<RefreshCw size={14} className={loadingGroups ? 'animate-spin' : ''} />}
                onClick={onRefresh}
                disabled={loadingGroups}
              >
                {isAr ? 'تحديث' : 'Refresh'}
              </SButton>
            )}

            {onOpenSchedule && (
              <SButton
                variant="secondary"
                size="sm"
                icon={<Calendar size={14} />}
                onClick={onOpenSchedule}
              >
                {isAr ? 'الجدول الأسبوعي' : 'Weekly Schedule'}
              </SButton>
            )}

            <SButton
              variant="primary"
              size="sm"
              icon={<Plus size={15} />}
              onClick={onOpenAddCohort}
            >
              {isAr ? 'إنشاء مجموعة جديدة' : 'Create Cohort'}
            </SButton>
          </div>
        }
      />

      {/* ── 2. 4 Live KPI Cards ── */}
      <div className="cg-kpi-grid">
        <div className="cg-kpi-card">
          <div
            className="cg-kpi-icon"
            style={{ backgroundColor: 'var(--primary-surface)', color: 'var(--primary)' }}
          >
            <Layers size={21} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'المجموعات النشطة' : 'Active Cohorts'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
              {groups.length}{' '}
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {isAr ? 'مجموعة' : 'cohorts'}
              </span>
            </div>
          </div>
        </div>

        <div className="cg-kpi-card">
          <div
            className="cg-kpi-icon"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--success, #10B981)' }}
          >
            <Users size={21} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'إجمالي الطلاب المقيدين' : 'Enrolled Students'}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {metrics.totalEnrolled.toLocaleString()}
              </span>
              {metrics.totalPending > 0 && (
                <SBadge tone="warning" size="sm">
                  +{metrics.totalPending} {isAr ? 'معلق' : 'pending'}
                </SBadge>
              )}
            </div>
          </div>
        </div>

        <div className="cg-kpi-card">
          <div
            className="cg-kpi-icon"
            style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6' }}
          >
            <Building2 size={21} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'القاعات المشغولة' : 'Occupied Rooms'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
              {metrics.occupiedHallsCount}{' '}
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                / {rooms.length || metrics.occupiedHallsCount} ({metrics.totalCapacity} {isAr ? 'مقعد' : 'seats'})
              </span>
            </div>
          </div>
        </div>

        <div className="cg-kpi-card">
          <div
            className="cg-kpi-icon"
            style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#D97706' }}
          >
            <QrCode size={21} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'متوسط الحضور المسجل' : 'Avg. Attendance Rate'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary)', marginTop: '2px' }}>
              {metrics.avgAttendanceRate}%
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. RTL-Safe Search & Filters Toolbar ── */}
      {groups.length > 0 && (
        <div className="cg-toolbar">
          <div className="cg-search-wrap">
            <Search size={15} className="cg-search-icon" />
            <input
              type="text"
              className="cg-search-input"
              placeholder={
                isAr
                  ? 'ابحث باسم المجموعة أو المعلم أو المادة أو الكود...'
                  : 'Search cohort, teacher, subject, or join code...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {branches.length > 1 && (
              <select
                aria-label={isAr ? 'الفرع' : 'Branch'}
                className="cg-select"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="ALL">{isAr ? 'جميع الفروع' : 'All Branches'}</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nameAr}
                  </option>
                ))}
              </select>
            )}

            {allSubjects.length > 0 && (
              <select
                aria-label={isAr ? 'المادة' : 'Subject'}
                className="cg-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="ALL">{isAr ? 'جميع المواد' : 'All Subjects'}</option>
                {allSubjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}

            {allTeachers.length > 0 && (
              <select
                aria-label={isAr ? 'المعلم' : 'Teacher'}
                className="cg-select"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                <option value="ALL">{isAr ? 'جميع المعلمين' : 'All Teachers'}</option>
                {allTeachers.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}

            {hasActiveFilters && (
              <SButton variant="ghost" size="sm" icon={<X size={13} />} onClick={resetFilters}>
                {isAr ? 'مسح الفلاتر' : 'Clear'}
              </SButton>
            )}
          </div>
        </div>
      )}

      {/* ── 4. Cohorts Catalog Grid (Teacher ClassCard Style) ── */}
      {loadingGroups && groups.length === 0 ? (
        <SCard padding="lg">
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)', fontSize: '13.5px', fontWeight: '700' }}>
            {isAr ? 'جاري تحميل المجموعات الدراسية...' : 'Loading cohorts...'}
          </div>
        </SCard>
      ) : groups.length === 0 ? (
        <SCard padding="lg">
          <div style={{ textAlign: 'center', padding: '36px 16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'var(--primary-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                margin: '0 auto 14px',
              }}
            >
              <Layers size={27} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 8px' }}>
              {isAr ? 'لا توجد مجموعات دراسية مضافة بعد' : 'No study cohorts created yet'}
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                maxWidth: '430px',
                margin: '0 auto 18px',
                lineHeight: 1.6,
              }}
            >
              {isAr
                ? 'ابدأ بإنشاء أول مجموعة دراسية واربطها بالقاعة والمعلم لتفعيل سجل الطلاب وماسح الباركود.'
                : 'Create your first cohort and assign a classroom and teacher to manage students and barcode attendance.'}
            </p>
            <SButton variant="primary" size="md" icon={<Plus size={15} />} onClick={onOpenAddCohort}>
              {isAr ? 'إنشاء أول مجموعة' : 'Create First Cohort'}
            </SButton>
          </div>
        </SCard>
      ) : filteredGroups.length === 0 ? (
        <SCard padding="lg">
          <div style={{ textAlign: 'center', padding: '28px 16px' }}>
            <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {isAr ? 'لا توجد مجموعات تطابق معايير البحث الحالية' : 'No cohorts match your filters'}
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              {isAr ? 'جرّب تعديل كلمات البحث أو إعادة تعيين الفلاتر.' : 'Try adjusting search terms or clearing active filters.'}
            </p>
            <SButton variant="secondary" size="sm" onClick={resetFilters}>
              {isAr ? 'إعادة عرض كل المجموعات' : 'Show All Cohorts'}
            </SButton>
          </div>
        </SCard>
      ) : (
        <div className="cg-grid">
          {filteredGroups.map((group) => {
            const room = rooms.find(
              (r) =>
                String(r.id) === String(group.roomId) ||
                r.nameAr === group.hallName ||
                String(r.id) === String(group.hallName)
            ) || {
              nameAr: group.hallName || (isAr ? 'القاعة الرئيسية' : 'Main Hall'),
              capacity: group.maxStudents || 50,
            };

            const groupEnrolledCount =
              enrolledStudents[group.id]?.length ?? group.enrolledCount ?? 0;
            const groupPendingCount =
              pendingStudents[group.id]?.length ?? group.pendingCount ?? 0;
            const maxCap = Math.max(1, Number(group.maxStudents || room.capacity) || 50);
            const fillPct = Math.min(100, Math.round((groupEnrolledCount / maxCap) * 100));
            const fillColor =
              fillPct >= 95
                ? 'var(--danger, #EF4444)'
                : fillPct >= 80
                  ? '#F59E0B'
                  : 'var(--primary)';
            const groupSlots = group.scheduleSlots || group.slots || [];

            return (
              <div
                key={group.id}
                className="cg-cohort-card"
                onClick={() => onOpenGroupStudents?.(group.id)}
              >
                <div>
                  {/* Top Row: Subject/Grade Badges + Quick Actions */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {group.subjectAr && (
                        <SBadge tone="primary" size="sm">
                          {group.subjectAr}
                        </SBadge>
                      )}
                      {group.gradeAr && (
                        <SBadge tone="neutral" size="sm">
                          {group.gradeAr}
                        </SBadge>
                      )}
                    </div>

                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="cg-icon-btn"
                        onClick={(e) => onOpenEditCohort?.(group, e)}
                        title={isAr ? 'تعديل المجموعة' : 'Edit Cohort'}
                      >
                        <Pencil size={13} />
                      </button>

                      <button
                        type="button"
                        className="cg-icon-btn danger"
                        onClick={() => onDeleteCohort?.(group)}
                        title={isAr ? 'حذف المجموعة' : 'Delete Cohort'}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Cohort Title */}
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '900',
                      color: 'var(--text-primary)',
                      margin: '0 0 8px',
                      lineHeight: 1.4,
                    }}
                  >
                    {isAr ? group.nameAr : group.nameEn || group.nameAr}
                  </h3>

                  {/* Teacher + Tuition + Join Code */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      marginBottom: '12px',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <GraduationCap size={14} color="var(--primary)" />
                      <strong style={{ color: 'var(--text-primary)', fontWeight: '800' }}>
                        {group.teacherNameAr || (isAr ? 'معلم السنتر' : 'Center Teacher')}
                      </strong>
                    </span>

                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '900',
                        color: 'var(--success, #10B981)',
                      }}
                    >
                      {Number(group.priceEgp ?? 0).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                    </span>
                  </div>

                  {/* Hall + Join Code Compact Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      padding: '9px 12px',
                      borderRadius: '11px',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '12px',
                      fontSize: '12px',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      <Building2 size={14} color="var(--primary)" />
                      <span>{room.nameAr}</span>
                    </span>

                    {group.joinCode && (
                      <div
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(group.joinCode, group.id, e)}
                          title={isAr ? 'نسخ كود الانضمام' : 'Copy join code'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-surface)',
                            color:
                              copiedCodeId === group.id
                                ? 'var(--success, #10B981)'
                                : 'var(--text-secondary)',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            fontWeight: '800',
                            cursor: 'pointer',
                          }}
                        >
                          {copiedCodeId === group.id ? <Check size={11} /> : <Copy size={11} />}
                          <span>{group.joinCode}</span>
                        </button>

                        {onRegenerateJoinCode && (
                          <button
                            type="button"
                            disabled={regeneratingId === group.id}
                            onClick={(e) => handleRegenCode(group.id, e)}
                            title={isAr ? 'توليد كود جديد' : 'Regenerate code'}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-surface)',
                              color: 'var(--primary)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: regeneratingId === group.id ? 'wait' : 'pointer',
                            }}
                          >
                            <RefreshCw
                              size={11}
                              className={regeneratingId === group.id ? 'animate-spin' : ''}
                            />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Weekly Schedule Pills */}
                  <div style={{ marginBottom: '12px' }}>
                    {groupSlots.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {groupSlots.map((slot, sIdx) => (
                          <span
                            key={slot.id || sIdx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                              fontWeight: '800',
                              padding: '4px 8px',
                              borderRadius: '7px',
                              backgroundColor: 'var(--primary-surface)',
                              color: 'var(--primary)',
                            }}
                          >
                            <Clock size={11} />
                            <span>
                              {slot.dayAr || slot.day}: {formatTimeTo12h(slot.startTime, isAr)}
                            </span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        <Clock size={12} />
                        <span>{group.scheduleAr || (isAr ? 'المواعيد غير محددة' : 'Not scheduled')}</span>
                      </div>
                    )}
                  </div>

                  {/* Capacity & Enrollment Progress */}
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: '11px',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        marginBottom: '6px',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                        <Users size={13} color="var(--primary)" />
                        <span>{isAr ? 'المقيدون:' : 'Enrolled:'}</span>
                      </span>

                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {groupPendingCount > 0 && (
                          <SBadge tone="warning" size="sm">
                            +{groupPendingCount} {isAr ? 'معلق' : 'pending'}
                          </SBadge>
                        )}
                        <span style={{ fontSize: '12.5px', fontWeight: '900', color: fillColor }}>
                          {groupEnrolledCount} / {maxCap}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        height: '5px',
                        width: '100%',
                        borderRadius: '999px',
                        backgroundColor: 'var(--bg-subtle)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${fillPct}%`,
                          backgroundColor: fillColor,
                          borderRadius: '999px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Footer Action */}
                <SButton
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenGroupStudents?.(group.id);
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span>{isAr ? 'سجل الطلاب وإدارة الباركود' : 'Manage Roster & Barcode'}</span>
                    {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </span>
                </SButton>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
