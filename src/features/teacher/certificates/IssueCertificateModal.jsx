import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Search,
  X,
  Check,
  UserCheck,
  Users,
  AlertCircle,
  Loader2,
  Trophy,
  BookOpenCheck,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { teacherApi } from '../../../services/teacherApi';
import { HONORS_PRESETS } from './certificateHelpers';

const TYPE_DEFAULT_HONORS = {
  general: 'شهادة تميز وتفوق بالدرجة النهائية (Full Mark)',
  course_completion: 'شهادة إتمام الكورس بمرتبة الشرف',
  league: 'شهادة صدارة وبطل الدوري الأكاديمي',
};

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

  const [certificateType, setCertificateType] = useState('general'); // 'general' | 'course_completion' | 'league'
  const [mode, setMode] = useState('single'); // 'single' | 'bulk'
  const [studentQuery, setStudentQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [isSearching, setIsSearching] = useState(true);
  const seqRef = useRef(0);

  // Eligibility context from backend (concluded leagues + per-student 100% course completion)
  const [eligibilityCtx, setEligibilityCtx] = useState({ leagues: [], courseCompletion: null });
  const [loadingEligibility, setLoadingEligibility] = useState(true);
  const [selectedLeagueId, setSelectedLeagueId] = useState('');

  // Single-mode selected student or manual entry (manual entry allowed only in 'general')
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [manualNameAr, setManualNameAr] = useState('');
  const [manualGradeAr, setManualGradeAr] = useState(defaultCourse?.gradeAr || 'الصف الثالث الثانوي');

  // Bulk-mode selected students map: { [id]: { student, gradePercent } }
  const [bulkSelected, setBulkSelected] = useState({});

  // Shared certificate metadata
  const [selectedCourseId, setSelectedCourseId] = useState(defaultCourseId);
  const [customCourseName, setCustomCourseName] = useState(defaultCourseTitle);
  const [gradePercent, setGradePercent] = useState('98');
  const [honorsPreset, setHonorsPreset] = useState(TYPE_DEFAULT_HONORS.general);
  const [customHonorsTitle, setCustomHonorsTitle] = useState('');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch live eligibility context whenever selectedCourseId changes
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setLoadingEligibility(true);
      teacherApi.certificates
        .getEligibilityContext(selectedCourseId)
        .then((res) => {
          if (!active) return;
          const data = res?.data || { leagues: [], courseCompletion: null };
          setEligibilityCtx(data);
        })
        .catch(() => {
          if (!active) return;
          setEligibilityCtx({ leagues: [], courseCompletion: null });
        })
        .finally(() => {
          if (active) setLoadingEligibility(false);
        });
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [selectedCourseId]);

  // Debounced live backend student search (for 'general' & 'course_completion')
  useEffect(() => {
    if (certificateType === 'league') return undefined;
    const seq = ++seqRef.current;
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await teacherApi.roster.searchStudents(studentQuery.trim());
        if (seq !== seqRef.current) return;
        setStudents(Array.isArray(res?.data) ? res.data : []);
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
  }, [studentQuery, certificateType]);

  const activeCourse = useMemo(() => {
    return courses.find((c) => String(c.uuid || c.id) === String(selectedCourseId)) || null;
  }, [courses, selectedCourseId]);

  const allLeagues = useMemo(
    () => (Array.isArray(eligibilityCtx?.leagues) ? eligibilityCtx.leagues : []),
    [eligibilityCtx]
  );

  const concludedLeagues = useMemo(
    () => allLeagues.filter((l) => l.isConcluded),
    [allLeagues]
  );

  const activeLeague = useMemo(() => {
    if (concludedLeagues.length === 0) return null;
    return concludedLeagues.find((l) => l.id === selectedLeagueId) || concludedLeagues[0];
  }, [concludedLeagues, selectedLeagueId]);

  // Student candidates list depending on certificateType
  const displayedStudents = useMemo(() => {
    if (certificateType === 'league') {
      const participants = Array.isArray(activeLeague?.participants) ? activeLeague.participants : [];
      const q = studentQuery.trim().toLowerCase();
      return participants
        .map((p) => ({
          id: p.studentId,
          nameAr: p.nameAr,
          name: p.nameAr,
          avatar: p.avatar,
          email: p.email,
          phone: p.phone,
          studentCode: p.studentCode,
          leagueRank: p.rank,
          leagueScore: p.score,
        }))
        .filter((st) => {
          if (!q) return true;
          return (
            String(st.nameAr || '').toLowerCase().includes(q) ||
            String(st.studentCode || '').toLowerCase().includes(q)
          );
        });
    }
    return students;
  }, [certificateType, activeLeague, studentQuery, students]);

  const courseCompletionInfo = eligibilityCtx?.courseCompletion || null;
  const totalPublishedLessons = Number(courseCompletionInfo?.totalPublishedLessons ?? 0);
  const completionByStudent = courseCompletionInfo?.byStudent || {};

  const getStudentCourseProgress = (studentId) => {
    const entry = completionByStudent[String(studentId)];
    if (entry) return entry;
    return {
      completedLessons: 0,
      totalLessons: totalPublishedLessons,
      percent: 0,
      eligible: false,
    };
  };

  const handleCertificateTypeChange = (nextType) => {
    setCertificateType(nextType);
    setSelectedStudent(null);
    setManualNameAr('');
    setBulkSelected({});
    setStudentQuery('');
    setError('');
    setHonorsPreset(TYPE_DEFAULT_HONORS[nextType]);
    if (nextType === 'league') {
      setGradePercent('100');
    }
  };

  const effectiveCourseName =
    certificateType === 'league'
      ? activeLeague?.titleAr || ''
      : activeCourse
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

  const isLeagueBlocked = certificateType === 'league' && concludedLeagues.length === 0;
  const isCourseEmptyBlocked =
    certificateType === 'course_completion' && !loadingEligibility && totalPublishedLessons === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (certificateType === 'league') {
      if (!activeLeague) {
        setError(
          isAr
            ? 'لا يمكن إصدار شهادة الدوري قبل انتهاء موعد الدوري أو إعلان تتويجه وإيقافه أولاً.'
            : 'League certificates require a concluded or crowned league.'
        );
        return;
      }
    } else if (!effectiveCourseName) {
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
      const sharedCourseId =
        certificateType === 'league'
          ? activeLeague?.courseId || undefined
          : activeCourse
            ? String(activeCourse.uuid || activeCourse.id)
            : undefined;

      if (mode === 'single') {
        const studentNameAr = (
          selectedStudent?.nameAr ||
          selectedStudent?.name ||
          (certificateType === 'general' ? manualNameAr : '')
        ).trim();

        if (!studentNameAr) {
          setError(
            certificateType === 'course_completion'
              ? isAr
                ? 'يرجى اختيار طالب أتم 100% من حصص المقرر.'
                : 'Please select a student who completed 100% of the course.'
              : certificateType === 'league'
                ? isAr
                  ? 'يرجى اختيار أحد أبطال الدوري المنتهي من القائمة.'
                  : 'Please select a participant from the concluded league.'
                : isAr
                  ? 'يرجى اختيار طالب من القائمة أو كتابة اسمه.'
                  : 'Please select or enter a student name.'
          );
          setIsSubmitting(false);
          return;
        }

        if (certificateType === 'course_completion') {
          const prog = getStudentCourseProgress(selectedStudent?.id);
          if (!prog.eligible) {
            setError(
              isAr
                ? `لا يمكن إصدار شهادة إتمام الكورس لهذا الطالب قبل إكمال 100% من الحصص (المكتمل حالياً: ${prog.percent}%).`
                : `Student must complete 100% of lessons (currently ${prog.percent}%).`
            );
            setIsSubmitting(false);
            return;
          }
        }

        const scoreNum = Number(gradePercent);
        if (Number.isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
          setError(isAr ? 'يجب أن تكون الدرجة المئوية بين 0 و 100.' : 'Score must be between 0 and 100.');
          setIsSubmitting(false);
          return;
        }

        await onIssueSingle({
          certificate_type: certificateType,
          league_id: certificateType === 'league' ? activeLeague?.id : undefined,
          student_id: selectedStudent?.id ? String(selectedStudent.id) : null,
          course_id: sharedCourseId,
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
          setError(isAr ? 'يرجى تحديد طالب واحد على الأقل للإصدار الجماعي.' : 'Please select at least one student.');
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
          certificate_type: certificateType,
          league_id: certificateType === 'league' ? activeLeague?.id : undefined,
          course_id: sharedCourseId,
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
            ? 'تعذر إصدار الشهادة. يرجى التحقق من استيفاء الشروط والمحاولة مرة أخرى.'
            : 'Failed to issue certificate. Please verify requirements.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const honorsOptions = useMemo(() => {
    if (certificateType === 'league') {
      return HONORS_PRESETS.filter((p) => p.ar.includes('الدوري'));
    }
    if (certificateType === 'course_completion') {
      return HONORS_PRESETS.filter((p) => p.ar.includes('إتمام'));
    }
    return HONORS_PRESETS.filter((p) => !p.ar.includes('الدوري') && !p.ar.includes('إتمام'));
  }, [certificateType]);

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
          maxWidth: '610px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: isMobile ? '18px 15px' : '24px 26px',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
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

        {/* Step 0: Certificate Type Selector (Enforces exact platform rules) */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {isAr ? 'نوع الشهادة:' : 'Certificate Track:'}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '7px' }}>
            {[
              { id: 'general', labelAr: 'تقدير وتفوق عام', labelEn: 'General Honor', Icon: Sparkles },
              { id: 'course_completion', labelAr: 'إتمام الكورس (100%)', labelEn: 'Course Completion', Icon: BookOpenCheck },
              { id: 'league', labelAr: 'أبطال الدوري', labelEn: 'League Champions', Icon: Trophy },
            ].map((item) => {
              const active = certificateType === item.id;
              const ItemIcon = item.Icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleCertificateTypeChange(item.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '9px 10px',
                    borderRadius: '11px',
                    border: active ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    backgroundColor: active ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                    color: active ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                  }}
                >
                  <ItemIcon size={14} />
                  <span>{isAr ? item.labelAr : item.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Single vs Bulk Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            padding: '4px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            marginBottom: '14px',
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
              padding: '7px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: mode === 'single' ? 'var(--primary)' : 'transparent',
              color: mode === 'single' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px',
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
              padding: '7px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: mode === 'bulk' ? 'var(--primary)' : 'transparent',
              color: mode === 'bulk' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px',
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
          {/* Context-specific Selector: Concluded League OR Course */}
          {certificateType === 'league' ? (
            loadingEligibility ? (
              <div style={{ padding: '14px', textAlign: 'center', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                {isAr ? 'جاري التحقق من الدوريات المنتهية والمتوّجة...' : 'Checking concluded leagues...'}
              </div>
            ) : concludedLeagues.length === 0 ? (
              <div
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1.5px solid rgba(245, 158, 11, 0.35)',
                  color: '#B45309',
                  fontSize: '12.5px',
                  lineHeight: 1.65,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: '900', marginBottom: '4px' }}>
                  <Lock size={15} />
                  <span>
                    {isAr
                      ? 'لا يمكن إصدار أو إعلان شهادة الدوري الآن'
                      : 'League certificates are currently locked'}
                  </span>
                </div>
                <div>
                  {isAr
                    ? 'يجب أولاً انتهاء مدة الدوري أو قيامك بإعلان «تتويج الدوري» وإيقافه نهائياً من صفحة الدوري قبل إصدار شهادات الأوائل.'
                    : 'A league must either finish its scheduled end date or be officially crowned & stopped before issuing league certificates.'}
                </div>
                <Link
                  to="/teacher/league"
                  onClick={onClose}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    marginTop: '10px',
                    padding: '7px 14px',
                    borderRadius: '9px',
                    backgroundColor: '#D97706',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '800',
                    textDecoration: 'none',
                  }}
                >
                  <Trophy size={13} />
                  <span>{isAr ? 'الانتقال لصفحة الدوري لإعلان التتويج' : 'Go to Leagues to Crown Winners'}</span>
                </Link>
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  {isAr ? 'اختر الدوري المنتهي / المتوّج:' : 'Select Concluded / Crowned League:'} *
                </label>
                <select
                  value={activeLeague?.id || ''}
                  onChange={(e) => {
                    setSelectedLeagueId(e.target.value);
                    setSelectedStudent(null);
                    setBulkSelected({});
                  }}
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
                  {concludedLeagues.map((lg) => (
                    <option key={lg.id} value={lg.id}>
                      {lg.titleAr} ({lg.isCrowned ? (isAr ? 'تم التتويج' : 'Crowned') : (isAr ? 'منتهي' : 'Ended')} • {lg.totalCompetitors} {isAr ? 'متنافس' : 'competitors'})
                    </option>
                  ))}
                </select>
              </div>
            )
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  {isAr ? 'المقرر الدراسي' : 'Course'} *
                </label>
                {courses.length > 0 ? (
                  <select
                    value={selectedCourseId}
                    onChange={(e) => {
                      setSelectedCourseId(e.target.value);
                      if (certificateType === 'course_completion') {
                        setSelectedStudent(null);
                        setBulkSelected({});
                      }
                    }}
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
          )}

          {/* Rule Reminder Banner for Course Completion (100%) */}
          {certificateType === 'course_completion' && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '11px',
                backgroundColor: isCourseEmptyBlocked ? 'rgba(239, 68, 68, 0.08)' : 'rgba(21, 136, 199, 0.08)',
                border: `1px solid ${isCourseEmptyBlocked ? 'rgba(239, 68, 68, 0.3)' : 'rgba(21, 136, 199, 0.25)'}`,
                fontSize: '12px',
                fontWeight: '700',
                color: isCourseEmptyBlocked ? '#EF4444' : 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <BookOpenCheck size={16} style={{ flexShrink: 0 }} />
              <span>
                {isCourseEmptyBlocked
                  ? isAr
                    ? 'هذا المقرر لا يحتوي على حصص منشورة بعد؛ يجب نشر حصص المقرر وإتمام الطالب 100% منها.'
                    : 'This course has no published lessons yet.'
                  : isAr
                    ? `شهادة إتمام الكورس متاحة فقط للطلاب الذين أتموا 100% من الحصص المنشورة (${totalPublishedLessons} حصة).`
                    : `Course completion certificates require 100% completion of all ${totalPublishedLessons} published lessons.`}
              </span>
            </div>
          )}

          {/* Student Search & Picker (hidden when league track is blocked) */}
          {!isLeagueBlocked && (
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {certificateType === 'league'
                  ? isAr
                    ? 'اختر من أبطال الدوري النهائيين:'
                    : 'Select from Final League Standings:'
                  : certificateType === 'course_completion'
                    ? isAr
                      ? 'اختر الطالب (المتاح فقط من أتم 100% من الكورس):'
                      : 'Select Student (100% completion required):'
                    : mode === 'single'
                      ? isAr
                        ? 'اختيار الطالب (أو اكتب اسمه يدوياً بالأسفل)'
                        : 'Select Student (or type name manually below)'
                      : isAr
                        ? 'حدد الطلاب المراد إصدار شهادات لهم دفعة واحدة'
                        : 'Select Multiple Students'}
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
                  placeholder={isAr ? 'ابحث باسم الطالب أو كوده...' : 'Search by name or code...'}
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
                {certificateType !== 'league' && isSearching ? (
                  <div style={{ padding: '18px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {isAr ? 'جاري البحث عن الطلاب...' : 'Searching students...'}
                  </div>
                ) : displayedStudents.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {isAr ? 'لا توجد نتائج مطابقة.' : 'No matching students found.'}
                  </div>
                ) : (
                  displayedStudents.map((st) => {
                    const key = String(st.id);
                    const displayName = st.nameAr || st.name || 'طالب';
                    const progress =
                      certificateType === 'course_completion'
                        ? getStudentCourseProgress(st.id)
                        : null;
                    const isLockedByCompletion =
                      certificateType === 'course_completion' && !progress?.eligible;
                    const isSelected =
                      mode === 'single'
                        ? String(selectedStudent?.id || '') === key
                        : Boolean(bulkSelected[key]);

                    return (
                      <div
                        key={key}
                        onClick={() => {
                          if (isLockedByCompletion) return;
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
                          cursor: isLockedByCompletion ? 'not-allowed' : 'pointer',
                          opacity: isLockedByCompletion ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.1)' : 'var(--bg-surface)',
                          border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                          {certificateType === 'league' && st.leagueRank && (
                            <span
                              style={{
                                minWidth: '26px',
                                height: '24px',
                                borderRadius: '6px',
                                backgroundColor: st.leagueRank <= 3 ? '#F59E0B' : 'var(--bg-subtle)',
                                color: st.leagueRank <= 3 ? '#FFFFFF' : 'var(--text-secondary)',
                                fontSize: '11px',
                                fontWeight: '900',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0 4px',
                                flexShrink: 0,
                              }}
                            >
                              #{st.leagueRank}
                            </span>
                          )}
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
                              {certificateType === 'league'
                                ? `${Number(st.leagueScore || 0).toLocaleString()} XP`
                                : [st.studentCode, st.phone || st.email].filter(Boolean).join(' • ')}
                            </div>
                          </div>
                        </div>

                        {certificateType === 'course_completion' && progress && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '7px',
                              backgroundColor: progress.eligible
                                ? 'rgba(16, 185, 129, 0.12)'
                                : 'rgba(148, 163, 184, 0.16)',
                              color: progress.eligible ? '#10B981' : 'var(--text-muted)',
                              fontSize: '11px',
                              fontWeight: '800',
                              flexShrink: 0,
                            }}
                          >
                            {!progress.eligible && <Lock size={11} />}
                            <span>
                              {progress.completedLessons}/{progress.totalLessons} ({progress.percent}%)
                            </span>
                          </span>
                        )}

                        {mode === 'bulk' && isSelected ? (
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step="0.5"
                            value={bulkSelected[key].gradePercent}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleBulkScoreChange(key, e.target.value)}
                            style={{
                              width: '66px',
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

              {mode === 'single' && certificateType === 'general' && (
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
          )}

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
                {honorsOptions.map((p) => (
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
              disabled={isSubmitting || isLeagueBlocked || isCourseEmptyBlocked}
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
                cursor: isSubmitting ? 'wait' : isLeagueBlocked || isCourseEmptyBlocked ? 'not-allowed' : 'pointer',
                opacity: isSubmitting || isLeagueBlocked || isCourseEmptyBlocked ? 0.55 : 1,
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
