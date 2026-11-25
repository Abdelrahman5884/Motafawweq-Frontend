import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, X, AlertCircle } from 'lucide-react';
import { LEAGUE_DURATION_OPTIONS, DEFAULT_SCORING_RULES } from './leagueConstants';

export const StartLeagueModal = ({
  courses,
  groups,
  onSubmit,
  onClose,
  lang,
  isRtl,
  isMobile,
}) => {
  const isAr = lang === 'ar';
  const defaultCourseId = courses[0]?.uuid || courses[0]?.id || '';

  const [courseId, setCourseId] = useState(defaultCourseId);
  const [groupMode, setGroupMode] = useState('all'); // 'all' | 'single'
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [duration, setDuration] = useState('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedCourse = useMemo(() => {
    return courses.find((c) => String(c.uuid || c.id) === String(courseId)) || courses[0] || null;
  }, [courses, courseId]);

  const courseGroups = useMemo(() => {
    if (!selectedCourse) return groups;
    const cUuid = String(selectedCourse.uuid || '');
    const cId = String(selectedCourse.id || '');
    const matched = groups.filter(
      (g) => !g.courseId || String(g.courseId) === cUuid || String(g.courseId) === cId
    );
    return matched.length > 0 ? matched : groups;
  }, [groups, selectedCourse]);

  const activeSelectedGroupId = useMemo(() => {
    if (groupMode !== 'single') return '';
    const valid = courseGroups.some((g) => String(g.uuid || g.id) === String(selectedGroupId));
    if (valid) return selectedGroupId;
    return courseGroups[0]?.uuid || courseGroups[0]?.id || '';
  }, [groupMode, courseGroups, selectedGroupId]);

  const defaultTitle = useMemo(() => {
    const courseName = selectedCourse?.titleAr || selectedCourse?.title || (isAr ? 'الكورس' : 'Course');
    return isAr ? `دوري ${courseName}` : `${courseName} League`;
  }, [selectedCourse, isAr]);

  const effectiveTitle = customTitle.trim() || defaultTitle;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const targetCourseId = selectedCourse?.uuid || selectedCourse?.id;
    if (!targetCourseId) {
      setError(isAr ? 'يرجى إنشاء مقرر دراسي أولاً قبل بدء الدوري.' : 'Please create a course first.');
      return;
    }

    if (groupMode === 'single' && !activeSelectedGroupId) {
      setError(isAr ? 'لا توجد مجموعات مسجلة للاختيار منها. اختر "كل المجموعات".' : 'No study group available. Choose "All Groups".');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit({
        course_id: targetCourseId,
        study_group_id: groupMode === 'single' ? activeSelectedGroupId : null,
        title_ar: effectiveTitle,
        duration,
      });
    } catch (err) {
      setError(err?.message || (isAr ? 'تعذر إنشاء الدوري. يرجى المحاولة مرة أخرى.' : 'Failed to create league.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '530px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: isMobile ? '20px 16px' : '26px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trophy size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? 'بدء دوري تنافسي جديد' : 'Launch New League'}
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>
                {isAr ? 'حدد الكورس والمجموعة المستهدفة ومدة المنافسة' : 'Configure course, target cohort, and duration'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '11px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '12.5px',
              fontWeight: '700',
              marginBottom: '14px',
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 1. Course */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {isAr ? '١. الكورس والمادة المستهدفة:' : '1. Target Course:'}
            </label>
            {courses.length === 0 ? (
              <div
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#EF4444',
                  fontSize: '12px',
                  fontWeight: '700',
                }}
              >
                {isAr
                  ? 'لم تقم بإنشاء أي مقرر دراسي بعد. يجب إنشاء كورس أولاً لتنظيم الدوري.'
                  : 'No courses found. Please create a course first.'}
                <div style={{ marginTop: '8px' }}>
                  <Link to="/teacher/courses" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                    {isAr ? 'الانتقال لصفحة المقررات لإنشاء كورس الآن ←' : 'Go to Courses page →'}
                  </Link>
                </div>
              </div>
            ) : (
              <select
                value={selectedCourse?.uuid || selectedCourse?.id || ''}
                onChange={(e) => {
                  setCourseId(e.target.value);
                  setSelectedGroupId('');
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  outline: 'none',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                {courses.map((c) => {
                  const cId = c.uuid || c.id;
                  const count = Number(c.studentsCount ?? c.totalStudents ?? 0);
                  return (
                    <option key={cId} value={cId}>
                      {c.titleAr || c.title} ({count.toLocaleString()} {isAr ? 'طالب' : 'students'})
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {/* 2. Target Scope */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {isAr ? '٢. نطاق الطلاب المشاركين:' : '2. Participating Scope:'}
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button
                type="button"
                onClick={() => setGroupMode('all')}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '10px',
                  border: groupMode === 'all' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                  backgroundColor: groupMode === 'all' ? 'rgba(21, 136, 199, 0.1)' : 'var(--bg-subtle)',
                  color: groupMode === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'كل مجموعات الكورس (دوري موحد)' : 'All Course Groups'}
              </button>

              <button
                type="button"
                onClick={() => setGroupMode('single')}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '10px',
                  border: groupMode === 'single' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                  backgroundColor: groupMode === 'single' ? 'rgba(21, 136, 199, 0.1)' : 'var(--bg-subtle)',
                  color: groupMode === 'single' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'مجموعة دراسية محددة' : 'Specific Study Group'}
              </button>
            </div>

            {groupMode === 'single' && (
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '7px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                }}
              >
                {courseGroups.length === 0 ? (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {isAr ? 'لا توجد مجموعات مسجلة لهذا الكورس بعد.' : 'No study groups for this course yet.'}
                  </span>
                ) : (
                  courseGroups.map((g) => {
                    const gId = g.uuid || g.id;
                    const checked = String(activeSelectedGroupId) === String(gId);
                    const count = Number(g.studentCount ?? g.enrolledCount ?? 0);
                    return (
                      <label
                        key={gId}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px' }}
                      >
                        <input
                          type="radio"
                          name="league_study_group"
                          checked={checked}
                          onChange={() => setSelectedGroupId(gId)}
                        />
                        <span style={{ fontWeight: checked ? '800' : '600', color: 'var(--text-primary)' }}>
                          {g.nameAr || g.name} ({count} {isAr ? 'طالب' : 'students'})
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* 3. Editable League Title */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
              {isAr ? '٣. اسم الدوري:' : '3. League Title:'}
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder={defaultTitle}
              maxLength={250}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontWeight: '700',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          {/* 4. Duration */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {isAr ? '٤. مدة المنافسة:' : '4. Competition Duration:'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '7px' }}>
              {LEAGUE_DURATION_OPTIONS.map((d) => {
                const selected = duration === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDuration(d.id)}
                    style={{
                      padding: '9px 10px',
                      borderRadius: '10px',
                      border: selected ? '1.5px solid var(--primary)' : '1px solid var(--border-medium)',
                      backgroundColor: selected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                      color: selected ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    {isAr ? d.labelAr : d.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Official Rules Summary */}
          <div
            style={{
              padding: '11px 13px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '18px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
              {isAr ? 'قواعد الاحتساب الرسمية (تبدأ نقاط الجميع من 0):' : 'Official Scoring Rules (All students start fresh at 0 XP):'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              {DEFAULT_SCORING_RULES.map((r) => (
                <div key={r.id}>
                  • <strong style={{ color: 'var(--text-primary)' }}>{isAr ? r.titleAr : r.titleEn}:</strong>{' '}
                  {isAr ? r.pointsLabelAr : r.pointsLabelEn}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '12.5px',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting || courses.length === 0}
              style={{
                padding: '9px 20px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: '13px',
                border: 'none',
                cursor: isSubmitting ? 'wait' : 'pointer',
                opacity: isSubmitting || courses.length === 0 ? 0.65 : 1,
                boxShadow: '0 4px 14px rgba(21, 136, 199, 0.35)',
              }}
            >
              {isSubmitting
                ? (isAr ? 'جاري البدء...' : 'Starting...')
                : (isAr ? 'بدء الدوري الآن' : 'Start League')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartLeagueModal;
