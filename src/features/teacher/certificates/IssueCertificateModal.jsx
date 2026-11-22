import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Award, Search, X, Check, UserCheck, Users, AlertCircle, Loader2 } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { teacherApi } from '../../../services/teacherApi';
import { HONORS_PRESETS } from './certificateHelpers';

export const IssueCertificateModal = ({
  courses,
  onIssueSingle,
  onIssueBulk,
  onClose,
  lang,
  isRtl,
  isMobile,
}) => {
  const isAr = lang === 'ar';
  const defaultCourse = courses[0] || null;
  const defaultCourseId = defaultCourse ? String(defaultCourse.uuid || defaultCourse.id) : '';
  const defaultCourseTitle = defaultCourse
    ? defaultCourse.titleAr || defaultCourse.title_ar || defaultCourse.title || ''
    : '';

  const [mode, setMode] = useState('single'); // 'single' | 'bulk'
  const [studentQuery, setStudentQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [isSearching, setIsSearching] = useState(true);
  const seqRef = useRef(0);

  // Single-mode selected student or manual entry
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [manualNameAr, setManualNameAr] = useState('');
  const [manualGradeAr, setManualGradeAr] = useState(defaultCourse?.gradeAr || 'الصف الثالث الثانوي');

  // Bulk-mode selected students map: { [id]: { student, gradePercent } }
  const [bulkSelected, setBulkSelected] = useState({});

  // Shared certificate metadata
  const [selectedCourseId, setSelectedCourseId] = useState(defaultCourseId);
  const [customCourseName, setCustomCourseName] = useState(defaultCourseTitle);
  const [gradePercent, setGradePercent] = useState('98');
  const [honorsPreset, setHonorsPreset] = useState(HONORS_PRESETS[0].ar);
  const [customHonorsTitle, setCustomHonorsTitle] = useState('');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Debounced live backend student search
  useEffect(() => {
    const seq = ++seqRef.current;
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await teacherApi.roster.searchStudents(studentQuery.trim());
        if (seq !== seqRef.current) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        setStudents(list);
      } catch {
        if (seq !== seqRef.current) return;
        setStudents([]);
      } finally {
        if (seq === seqRef.current) {
          setIsSearching(false);
        }
      }
    }, studentQuery ? 300 : 0);

    return () => clearTimeout(timer);
  }, [studentQuery]);

  const activeCourse = useMemo(() => {
    return courses.find((c) => String(c.uuid || c.id) === String(selectedCourseId)) || null;
  }, [courses, selectedCourseId]);

  const effectiveCourseName = activeCourse
    ? activeCourse.titleAr || activeCourse.title_ar || activeCourse.title
    : customCourseName.trim();

  const effectiveHonorsAr = honorsPreset === '__custom__' ? customHonorsTitle.trim() : honorsPreset;
  const effectiveHonorsEn =
    HONORS_PRESETS.find((p) => p.ar === honorsPreset)?.en || 'Certificate of Academic Excellence';

  const bulkList = useMemo(() => Object.values(bulkSelected), [bulkSelected]);

  const handleToggleBulkStudent = (st) => {
    const key = String(st.id);
    setBulkSelected((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = {
          student: st,
          gradePercent: Number(gradePercent) || 98,
        };
      }
      return next;
    });
  };

  const handleBulkScoreChange = (key, val) => {
    setBulkSelected((prev) => {
      if (!prev[key]) return prev;
      return {
        ...prev,
        [key]: { ...prev[key], gradePercent: val },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!effectiveCourseName) {
      setError(isAr ? 'يرجى اختيار مقرر دراسي أو إدخال اسم المقرر.' : 'Please select or enter a course name.');
      return;
    }

    if (!effectiveHonorsAr) {
      setError(isAr ? 'يرجى تحديد نوع التقدير أو عنوان الشهادة.' : 'Please specify the honors title.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'single') {
        const studentNameAr = (selectedStudent?.nameAr || selectedStudent?.name || manualNameAr).trim();
        if (!studentNameAr) {
          setError(isAr ? 'يرجى اختيار طالب من القائمة أو كتابة اسمه.' : 'Please select a student or enter a student name.');
          setIsSubmitting(false);
          return;
        }
        const scoreNum = Number(gradePercent);
        if (Number.isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
          setError(isAr ? 'يجب أن تكون الدرجة المئوية بين 0 و 100.' : 'Score must be between 0 and 100.');
          setIsSubmitting(false);
          return;
        }

        await onIssueSingle({
          student_id: selectedStudent?.id ? String(selectedStudent.id) : null,
          course_id: activeCourse ? String(activeCourse.uuid || activeCourse.id) : undefined,
          student_name_ar: studentNameAr,
          student_name_en: selectedStudent?.nameEn || studentNameAr,
          student_email: selectedStudent?.email || undefined,
          student_phone: selectedStudent?.phone || undefined,
          course_name_ar: effectiveCourseName,
          course_name_en: activeCourse?.titleEn || undefined,
          grade_ar: selectedStudent?.gradeAr || manualGradeAr || activeCourse?.gradeAr || 'الصف الثالث الثانوي',
          grade_percent: scoreNum,
          honors_title_ar: effectiveHonorsAr,
          honors_title_en: effectiveHonorsEn,
          issue_date: issueDate || undefined,
        });
      } else {
        if (bulkList.length === 0) {
          setError(isAr ? 'يرجى تحديد طالب واحد على الأقل للإصدار الجماعي.' : 'Please select at least one student for bulk issue.');
          setIsSubmitting(false);
          return;
        }

        const studentsPayload = bulkList.map(({ student, gradePercent: gp }) => {
          const scoreNum = Math.min(100, Math.max(0, Number(gp) || 0));
          const nameAr = student.nameAr || student.name || 'طالب';
          return {
            student_id: student.id ? String(student.id) : null,
            student_name_ar: nameAr,
            student_name_en: student.nameEn || nameAr,
            student_email: student.email || undefined,
            student_phone: student.phone || undefined,
            grade_ar: student.gradeAr || activeCourse?.gradeAr || 'الصف الثالث الثانوي',
            grade_percent: scoreNum,
          };
        });

        await onIssueBulk({
          course_id: activeCourse ? String(activeCourse.uuid || activeCourse.id) : undefined,
          course_name_ar: effectiveCourseName,
          course_name_en: activeCourse?.titleEn || undefined,
          grade_ar: activeCourse?.gradeAr || 'الصف الثالث الثانوي',
          honors_title_ar: effectiveHonorsAr,
          honors_title_en: effectiveHonorsEn,
          issue_date: issueDate || undefined,
          students: studentsPayload,
        });
      }
    } catch (err) {
      setError(
        err?.message ||
          (isAr
            ? 'تعذر إصدار الشهادة. يرجى التحقق من البيانات والمحاولة مرة أخرى.'
            : 'Failed to issue certificate. Please verify details and try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={() => { if (!isSubmitting) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 25, 53, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
        zIndex: 1100,
        backdropFilter: 'blur(6px)',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '22px',
          width: '100%',
          maxWidth: '580px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: isMobile ? '18px 15px' : '24px 26px',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '17.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'إصدار شهادة تقدير معتمدة' : 'Issue Certified Certificate'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Tabs: Single vs Bulk */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            padding: '4px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            marginBottom: '16px',
          }}
        >
          <button
            type="button"
            onClick={() => { setMode('single'); setError(''); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: mode === 'single' ? 'var(--primary)' : 'transparent',
              color: mode === 'single' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <UserCheck size={14} />
            <span>{isAr ? 'شهادة فردية' : 'Single Certificate'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('bulk'); setError(''); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: mode === 'bulk' ? 'var(--primary)' : 'transparent',
              color: mode === 'bulk' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Users size={14} />
            <span>
              {isAr
                ? `إصدار جماعي ${bulkList.length > 0 ? `(${bulkList.length})` : ''}`
                : `Bulk Issue ${bulkList.length > 0 ? `(${bulkList.length})` : ''}`}
            </span>
          </button>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '10px',
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Student Search & Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {mode === 'single'
                ? isAr
                  ? 'اختيار الطالب (أو اكتب اسمه يدوياً بالأسفل)'
                  : 'Select Student (or type name manually below)'
                : isAr
                  ? 'حدد الطلاب المراد إصدار شهادات لهم دفعة واحدة'
                  : 'Select Multiple Students for Bulk Issuance'}
            </label>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 11px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                marginBottom: '8px',
              }}
            >
              <Search size={14} color="var(--text-secondary)" />
              <input
                type="text"
                value={studentQuery}
                onChange={(e) => setStudentQuery(e.target.value)}
                placeholder={isAr ? 'ابحث باسم الطالب أو كوده أو بريده...' : 'Search by name, code, or email...'}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  width: '100%',
                  fontFamily: 'inherit',
                }}
              />
              {studentQuery && (
                <button
                  type="button"
                  onClick={() => setStudentQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div
              style={{
                maxHeight: '175px',
                overflowY: 'auto',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                backgroundColor: 'var(--bg-subtle)',
              }}
            >
              {isSearching ? (
                <div style={{ padding: '18px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {isAr ? 'جاري البحث عن الطلاب...' : 'Searching students...'}
                </div>
              ) : students.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {isAr ? 'لا توجد نتائج مطابقة.' : 'No matching students found.'}
                </div>
              ) : (
                students.map((st) => {
                  const key = String(st.id);
                  const displayName = st.nameAr || st.name || 'طالب';
                  const isSelected =
                    mode === 'single'
                      ? String(selectedStudent?.id || '') === key
                      : Boolean(bulkSelected[key]);

                  return (
                    <div
                      key={key}
                      onClick={() => {
                        if (mode === 'single') {
                          setSelectedStudent(st);
                          setManualNameAr(displayName);
                          if (st.gradeAr) setManualGradeAr(st.gradeAr);
                        } else {
                          handleToggleBulkStudent(st);
                        }
                      }}
                      style={{
                        padding: '7px 10px',
                        borderRadius: '9px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.1)' : 'var(--bg-surface)',
                        border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                        <Avatar src={st.avatar} name={displayName} size={32} />
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '12.5px',
                              fontWeight: isSelected ? '800' : '700',
                              color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {displayName}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {[st.studentCode, st.phone || st.email].filter(Boolean).join(' • ')}
                          </div>
                        </div>
                      </div>

                      {mode === 'bulk' && isSelected ? (
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step="0.5"
                          value={bulkSelected[key].gradePercent}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleBulkScoreChange(key, e.target.value)}
                          title={isAr ? 'نسبة الطالب (%)' : 'Student score (%)'}
                          style={{
                            width: '68px',
                            padding: '4px 6px',
                            borderRadius: '7px',
                            border: '1px solid var(--primary)',
                            backgroundColor: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            fontWeight: '800',
                            textAlign: 'center',
                          }}
                        />
                      ) : (
                        isSelected && (
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--primary)',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {mode === 'single' && (
              <div style={{ marginTop: '8px' }}>
                <input
                  type="text"
                  value={manualNameAr}
                  onChange={(e) => {
                    setManualNameAr(e.target.value);
                    if (selectedStudent && e.target.value !== (selectedStudent.nameAr || selectedStudent.name)) {
                      setSelectedStudent(null);
                    }
                  }}
                  placeholder={isAr ? 'اسم الطالب كما سيظهر على الشهادة *' : 'Student name on certificate *'}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
              </div>
            )}
          </div>

          {/* Course & Score */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                {isAr ? 'المقرر الدراسي' : 'Course'} *
              </label>
              {courses.length > 0 ? (
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '11px',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                >
                  {courses.map((c) => {
                    const id = String(c.uuid || c.id);
                    return (
                      <option key={id} value={id}>
                        {c.titleAr || c.title_ar || c.title}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <div>
                  <input
                    type="text"
                    required
                    value={customCourseName}
                    onChange={(e) => setCustomCourseName(e.target.value)}
                    placeholder={isAr ? 'اكتب اسم المقرر الدراسي...' : 'Enter course name...'}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '11px',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: '700',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  />
                  <Link to="/teacher/courses" style={{ fontSize: '11px', color: 'var(--primary)', display: 'inline-block', marginTop: '4px' }}>
                    {isAr ? 'أو أنشئ مقرر جديد من صفحة المقررات ←' : 'Or create a course first →'}
                  </Link>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                {mode === 'single'
                  ? isAr
                    ? 'الدرجة المئوية (%)'
                    : 'Score (%)'
                  : isAr
                    ? 'النسبة الافتراضية (%)'
                    : 'Default Score (%)'}{' '}
                *
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step="0.5"
                required
                value={gradePercent}
                onChange={(e) => setGradePercent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '11px',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Honors Title & Issue Date */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                {isAr ? 'نوع التقدير واللقب الشرفي' : 'Honors Title'} *
              </label>
              <select
                value={honorsPreset}
                onChange={(e) => setHonorsPreset(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '11px',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              >
                {HONORS_PRESETS.map((p) => (
                  <option key={p.ar} value={p.ar}>
                    {isAr ? p.ar : p.en}
                  </option>
                ))}
                <option value="__custom__">{isAr ? 'عنوان مخصص آخر...' : 'Custom title...'}</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                {isAr ? 'تاريخ الإصدار' : 'Issue Date'}
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8.5px 12px',
                  borderRadius: '11px',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {honorsPreset === '__custom__' && (
            <input
              type="text"
              required
              maxLength={255}
              value={customHonorsTitle}
              onChange={(e) => setCustomHonorsTitle(e.target.value)}
              placeholder={isAr ? 'اكتب عنوان الشهادة المخصص...' : 'Enter custom honors title...'}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '11px',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '700',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 22px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: '13px',
                cursor: isSubmitting ? 'wait' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: 'var(--shadow-primary)',
              }}
            >
              {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Award size={15} />}
              <span>
                {isSubmitting
                  ? isAr
                    ? 'جاري الإصدار...'
                    : 'Issuing...'
                  : mode === 'bulk'
                    ? isAr
                      ? `إصدار ${bulkList.length} شهادة`
                      : `Issue ${bulkList.length} Certificates`
                    : isAr
                      ? 'إصدار واعتماد الشهادة'
                      : 'Issue & Certify'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueCertificateModal;
