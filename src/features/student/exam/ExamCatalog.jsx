import React, { useEffect } from 'react';
import {
  Clock,
  FileText,
  Award,
  Play,
  AlertCircle,
  X,
  EyeOff,
  CheckCircle2,
  Search,
  RefreshCw,
  Eye,
  Lock,
  Landmark,
  GraduationCap,
  RotateCcw,
} from 'lucide-react';
import { formatExamTimer } from './useExam';

export const ExamCatalog = ({
  examsList = [],
  filteredExams = [],
  loadingExams = false,
  examsError = null,
  actionError = null,
  onClearActionError,
  onRetry,
  sourceFilter = 'all',
  setSourceFilter,
  sourceCounts = { all: 0, ministry: 0, teachers: 0 },
  selectedMinistryGrade = '',
  setSelectedMinistryGrade,
  resolvedMinistryGrade = '',
  availableMinistryGrades = [],
  tabCounts,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  handleRequestStartExam,
  handleRetakeMinistryExam,
  pendingExam,
  setPendingExam,
  pendingRetake = false,
  isStartingExam = false,
  loadingResultId = '',
  handleConfirmStart,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';

  useEffect(() => {
    if (!pendingExam) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !isStartingExam) setPendingExam(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [pendingExam, isStartingExam, setPendingExam]);

  const filterTabs = [
    { id: 'all', ar: 'الكل', en: 'All', count: tabCounts.totalCount },
    { id: 'ready', ar: 'متاحة الآن', en: 'Available', count: tabCounts.readyCount },
    { id: 'in_progress', ar: 'قيد الحل', en: 'In Progress', count: tabCounts.inProgressCount },
    { id: 'completed', ar: 'مكتملة', en: 'Completed', count: tabCounts.completedCount },
    { id: 'closed', ar: 'مغلقة / قادمة', en: 'Closed / Upcoming', count: tabCounts.closedCount },
  ];

  const hasFilters = statusFilter !== 'all' || searchQuery.trim().length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div
        style={{
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            letterSpacing: '-0.01em',
          }}
        >
          {isAr ? 'الامتحانات والاختبارات' : 'Exams & Assessments'}
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          {isAr
            ? 'اختر امتحانات معلميك أو تدرّب على نماذج واختبارات وزارة التربية والتعليم الاسترشادية بالتصحيح الفوري'
            : 'Take teacher exams or practice with official Egyptian Ministry of Education guided exams with instant grading'}
        </p>
      </div>

      {/* Source Switcher: All | Ministry of Education Guided Exams | Teacher Exams + Grade Filter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div
          role="tablist"
          aria-label={isAr ? 'مصدر الامتحانات' : 'Exam source'}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '6px',
            backgroundColor: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: '14px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {[
            { id: 'all', ar: 'جميع الاختبارات', en: 'All Exams', count: sourceCounts.all },
            { id: 'ministry', ar: 'اختبارات وزارة التربية والتعليم', en: 'Ministry Guided Exams', count: sourceCounts.ministry, icon: Landmark, highlight: true },
            { id: 'teachers', ar: 'امتحانات المعلمين', en: 'Teacher Exams', count: sourceCounts.teachers, icon: GraduationCap },
          ].map((src) => {
            const active = sourceFilter === src.id;
            const SrcIcon = src.icon;
            return (
              <button
                key={src.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSourceFilter?.(src.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: active ? 'var(--bg-surface-elevated)' : 'transparent',
                  color: active
                    ? src.highlight
                      ? '#059669'
                      : 'var(--text-primary)'
                    : 'var(--text-secondary)',
                  fontWeight: active ? '800' : '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: active ? 'var(--shadow-xs)' : 'none',
                }}
              >
                {SrcIcon && <SrcIcon size={14} />}
                <span>{isAr ? src.ar : src.en}</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '1px 7px',
                    borderRadius: '999px',
                    backgroundColor: active
                      ? src.highlight
                        ? 'rgba(5, 150, 105, 0.14)'
                        : 'var(--primary-surface)'
                      : 'var(--bg-hover)',
                    color: active
                      ? src.highlight
                        ? '#059669'
                        : 'var(--primary)'
                      : 'var(--text-muted)',
                  }}
                >
                  {src.count}
                </span>
              </button>
            );
          })}
        </div>

        {(sourceFilter === 'all' || sourceFilter === 'ministry') && availableMinistryGrades.length > 0 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Landmark size={14} color="#059669" />
            <select
              value={selectedMinistryGrade || resolvedMinistryGrade}
              onChange={(e) => setSelectedMinistryGrade?.(e.target.value)}
              aria-label={isAr ? 'الصف الدراسي لاختبارات الوزارة' : 'Ministry exams grade'}
              style={{
                padding: '7px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">{isAr ? 'الوزارة: جميع الصفوف' : 'MOE: All Grades'}</option>
              {availableMinistryGrades.map((g) => (
                <option key={g} value={g}>
                  {isAr ? `الوزارة: ${g}` : `MOE: ${g}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Error Alerts */}
      {(examsError || actionError) && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: '14px',
            backgroundColor: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            color: '#DC2626',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px', fontWeight: '700', overflowWrap: 'anywhere' }}>
              {actionError || examsError}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {examsError && (
              <button
                type="button"
                onClick={onRetry}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(220, 38, 38, 0.35)',
                  backgroundColor: 'var(--bg-surface)',
                  color: '#DC2626',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={13} />
                <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
              </button>
            )}
            {actionError && (
              <button
                type="button"
                onClick={onClearActionError}
                aria-label="Dismiss"
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#DC2626',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter Tabs + Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div
          role="tablist"
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '4px',
            backgroundColor: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: '13px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {filterTabs.map((t) => {
            const active = statusFilter === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStatusFilter(t.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: active ? 'var(--bg-surface-elevated)' : 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: active ? '800' : '600',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  boxShadow: active ? 'var(--shadow-xs)' : 'none',
                }}
              >
                <span>{isAr ? t.ar : t.en}</span>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: '800',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    backgroundColor: active ? 'var(--primary-surface)' : 'var(--bg-hover)',
                    color: active ? 'var(--primary)' : 'var(--text-muted)',
                  }}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              insetInlineStart: '11px',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث في الامتحانات أو المعلم...' : 'Search exams or teacher...'}
            style={{
              width: '100%',
              height: '38px',
              paddingInlineStart: '34px',
              paddingInlineEnd: searchQuery ? '30px' : '12px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label={isAr ? 'مسح البحث' : 'Clear search'}
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                insetInlineEnd: '8px',
                border: 'none',
                background: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeletons / Empty States / Exam Cards Grid */}
      {loadingExams ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 310px), 1fr))',
            gap: '20px',
          }}
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '22px',
                minHeight: '240px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ height: '20px', width: '42%', borderRadius: '7px', backgroundColor: 'var(--bg-subtle)' }} />
              <div style={{ height: '26px', width: '85%', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)' }} />
              <div style={{ height: '74px', width: '100%', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)' }} />
              <div style={{ height: '42px', width: '100%', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', marginTop: 'auto' }} />
            </div>
          ))}
        </div>
      ) : filteredExams.length === 0 ? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px dashed var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          <FileText size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {examsList.length === 0
              ? isAr
                ? 'لا توجد امتحانات منشورة حالياً'
                : 'No Exams Available Yet'
              : isAr
                ? 'لا توجد امتحانات مطابقة للبحث أو الفلتر'
                : 'No Matching Exams Found'}
          </div>
          <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: hasFilters ? '16px' : 0 }}>
            {examsList.length === 0
              ? isAr
                ? 'ستظهر هنا الامتحانات والاختبارات المقررة لك من معلميك بمجرد نشرها.'
                : 'Exams assigned by your teachers will appear here once published.'
              : isAr
                ? 'جرّب تغيير البحث أو عرض جميع الامتحانات.'
                : 'Try adjusting your search or resetting filters.'}
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                setSearchQuery('');
              }}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--primary)',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'عرض جميع الامتحانات' : 'Reset Filters'}
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 310px), 1fr))',
            gap: '20px',
          }}
        >
          {filteredExams.map((exam) => {
            const isReady = exam.status === 'ready';
            const isInProgress = exam.status === 'in_progress';
            const isGraded = exam.status === 'graded';
            const isSubmitted = exam.status === 'submitted';
            const isUpcoming = exam.status === 'upcoming';
            const isLoadingThisResult = loadingResultId === exam.id;

            return (
              <div
                key={exam.id}
                className="clean-exam-card"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: isInProgress
                    ? '1.5px solid #D97706'
                    : isGraded
                      ? '1px solid rgba(5, 150, 105, 0.35)'
                      : '1px solid var(--border-subtle)',
                  borderTop: exam.isMinistry ? '3px solid #059669' : undefined,
                  borderRadius: '20px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-xs)',
                  minWidth: 0,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  {/* Top Row: Subject & Explicit Status Pill */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      flexWrap: 'wrap',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', maxWidth: '68%' }}>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: '700',
                          padding: '3px 10px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-subtle)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {isAr ? exam.subjectAr : exam.subjectEn || exam.subjectAr}
                      </span>
                      {exam.isMinistry && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '10.5px',
                            fontWeight: '800',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            backgroundColor: 'rgba(5, 150, 105, 0.1)',
                            color: '#059669',
                          }}
                        >
                          <Landmark size={11} />
                          <span>{isAr ? 'الوزارة' : 'MOE'}</span>
                        </span>
                      )}
                    </div>

                    {isReady && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          color: '#059669',
                          backgroundColor: 'rgba(5, 150, 105, 0.12)',
                          padding: '3px 9px',
                          borderRadius: '999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: '#059669',
                            animation: 'softPulse 2s infinite ease-in-out',
                          }}
                        />
                        <span>{isAr ? 'متاح الآن' : 'Available'}</span>
                      </span>
                    )}

                    {isInProgress && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          color: '#D97706',
                          backgroundColor: 'rgba(245, 158, 11, 0.14)',
                          padding: '3px 9px',
                          borderRadius: '999px',
                        }}
                      >
                        {isAr ? 'قيد الحل الآن' : 'In Progress'}
                      </span>
                    )}

                    {isGraded && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          color: exam.showResults ? (exam.isPassed ? '#059669' : '#DC2626') : 'var(--primary)',
                          backgroundColor: exam.showResults
                            ? exam.isPassed
                              ? 'rgba(5, 150, 105, 0.12)'
                              : 'rgba(220, 38, 38, 0.12)'
                            : 'var(--primary-surface)',
                          padding: '3px 9px',
                          borderRadius: '999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <CheckCircle2 size={12} />
                        <span>
                          {exam.showResults && exam.percentage !== null
                            ? `${Math.round(exam.percentage)}%`
                            : isAr
                              ? 'تم التسليم'
                              : 'Submitted'}
                        </span>
                      </span>
                    )}

                    {isSubmitted && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          color: '#7C3AED',
                          backgroundColor: 'rgba(124, 58, 237, 0.12)',
                          padding: '3px 9px',
                          borderRadius: '999px',
                        }}
                      >
                        {isAr ? 'قيد تصحيح المعلم' : 'Pending Grading'}
                      </span>
                    )}

                    {(isUpcoming || exam.status === 'closed') && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          color: 'var(--text-muted)',
                          backgroundColor: 'var(--bg-subtle)',
                          padding: '3px 9px',
                          borderRadius: '999px',
                        }}
                      >
                        {isUpcoming
                          ? isAr
                            ? 'قادم قريباً'
                            : 'Upcoming'
                          : isAr
                            ? 'مغلق'
                            : 'Closed'}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    title={exam.titleAr}
                    style={{
                      fontSize: '16px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      margin: '0 0 6px 0',
                      lineHeight: 1.45,
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {isAr ? exam.titleAr : exam.titleEn || exam.titleAr}
                  </h3>

                  {/* Teacher / Ministry Source & Exam Type */}
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    {exam.isMinistry
                      ? `${isAr ? exam.sourceAr : exam.sourceEn}${exam.gradeAr ? ` • ${exam.gradeAr}` : ''}`
                      : `${exam.teacherNameAr || (isAr ? 'معلم المادة' : 'Instructor')} • ${
                          exam.isBubbleSheet
                            ? isAr
                              ? 'بابل شيت رسمي'
                              : 'Bubble Sheet'
                            : isAr
                              ? 'امتحان إلكتروني'
                              : 'Online Exam'
                        }`}
                  </div>

                  {/* Specs Grid */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="var(--primary)" />
                      <span>
                        {exam.durationMinutes} {isAr ? 'دقيقة' : 'min'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={14} color="var(--text-muted)" />
                      <span>
                        {exam.questionsCount} {isAr ? 'سؤال' : 'Q'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Award size={14} color="var(--text-muted)" />
                      <span>
                        {exam.maxScore} {isAr ? 'درجة' : 'pts'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} color="var(--text-muted)" />
                      <span>
                        {isAr ? `النجاح: ${exam.passScore}` : `Pass: ${exam.passScore}`}
                      </span>
                    </div>
                  </div>

                  {/* Score bar if graded & visible */}
                  {isGraded && exam.showResults && exam.score !== null && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        backgroundColor: exam.isPassed ? 'rgba(5, 150, 105, 0.08)' : 'rgba(220, 38, 38, 0.08)',
                        border: `1px solid ${exam.isPassed ? 'rgba(5, 150, 105, 0.25)' : 'rgba(220, 38, 38, 0.25)'}`,
                        fontSize: '12px',
                        fontWeight: '800',
                        color: exam.isPassed ? '#059669' : '#DC2626',
                        marginBottom: '14px',
                      }}
                    >
                      <span>{isAr ? 'درجتك:' : 'Your Score:'}</span>
                      <span>
                        {exam.score} / {exam.maxScore} ({Math.round(exam.percentage || 0)}%)
                      </span>
                    </div>
                  )}

                  {isInProgress && exam.remainingSeconds !== null && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 12px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        color: '#D97706',
                        fontSize: '12px',
                        fontWeight: '800',
                        marginBottom: '14px',
                      }}
                    >
                      <span>{isAr ? 'الوقت المتبقي:' : 'Time Remaining:'}</span>
                      <span dir="ltr">{formatExamTimer(exam.remainingSeconds)}</span>
                    </div>
                  )}

                  {!exam.showResults && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        color: 'var(--text-muted)',
                        backgroundColor: 'var(--bg-subtle)',
                        padding: '6px 10px',
                        borderRadius: '10px',
                        marginBottom: '14px',
                        border: '1px dashed var(--border-subtle)',
                      }}
                    >
                      <EyeOff size={13} color="var(--text-muted)" />
                      <span>
                        {isAr ? 'النتيجة محجوبة مؤقتاً بقرار المعلم' : 'Results hidden by teacher'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div>
                  {isReady ? (
                    <button
                      type="button"
                      onClick={() => handleRequestStartExam(exam)}
                      className="clean-btn"
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '13.5px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 10px rgba(21, 136, 199, 0.25)',
                      }}
                    >
                      <Play size={14} fill="#FFFFFF" />
                      <span>{isAr ? 'بدء الامتحان الآن' : 'Start Exam'}</span>
                    </button>
                  ) : isInProgress ? (
                    <button
                      type="button"
                      disabled={isStartingExam}
                      onClick={() => handleRequestStartExam(exam)}
                      className="clean-btn"
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        borderRadius: '12px',
                        backgroundColor: '#D97706',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '13.5px',
                        fontWeight: '800',
                        cursor: isStartingExam ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <Play size={14} fill="#FFFFFF" />
                      <span>
                        {isStartingExam
                          ? isAr
                            ? 'جاري استئناف الامتحان...'
                            : 'Resuming...'
                          : isAr
                            ? 'استكمال الامتحان الآن'
                            : 'Resume Exam'}
                      </span>
                    </button>
                  ) : isGraded || isSubmitted ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        disabled={isLoadingThisResult}
                        onClick={() => handleRequestStartExam(exam)}
                        className="clean-btn"
                        style={{
                          flex: 1,
                          padding: '11px 14px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--primary)',
                          border: '1px solid rgba(21, 136, 199, 0.35)',
                          fontSize: '12.5px',
                          fontWeight: '800',
                          cursor: isLoadingThisResult ? 'wait' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <Eye size={14} />
                        <span>
                          {isLoadingThisResult
                            ? isAr
                              ? 'جاري التحميل...'
                              : 'Loading...'
                            : isGraded && exam.showResults
                              ? isAr
                                ? 'عرض النتيجة والمراجعة'
                                : 'View Result'
                              : isAr
                                ? 'عرض حالة التسليم'
                                : 'View Status'}
                        </span>
                      </button>

                      {exam.isMinistry && exam.canRetake && (
                        <button
                          type="button"
                          onClick={() => handleRetakeMinistryExam?.(exam)}
                          className="clean-btn"
                          title={isAr ? 'إعادة حل النموذج للتدريب' : 'Retake practice exam'}
                          style={{
                            padding: '11px 12px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(5, 150, 105, 0.1)',
                            color: '#059669',
                            border: '1px solid rgba(5, 150, 105, 0.35)',
                            fontSize: '12.5px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <RotateCcw size={13} />
                          <span>{isAr ? 'إعادة التدريب' : 'Retake'}</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Lock size={13} />
                      <span>
                        {isUpcoming
                          ? isAr
                            ? `يبدأ في موعده${exam.date ? ` (${exam.date})` : ''}`
                            : `Scheduled${exam.date ? ` (${exam.date})` : ''}`
                          : isAr
                            ? 'الامتحان مغلق حالياً'
                            : 'Exam Closed'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pre-Exam Instructions & Confirmation Modal */}
      {pendingExam && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => !isStartingExam && setPendingExam(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 37, 78, 0.55)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: '24px',
              maxWidth: '480px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.2)',
              animation: 'modalFadeIn 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: pendingExam.isMinistry ? '#059669' : 'var(--primary)' }}>
                {pendingExam.isMinistry ? <Landmark size={19} /> : <AlertCircle size={20} />}
                <span style={{ fontSize: '12.5px', fontWeight: '800' }}>
                  {pendingExam.isMinistry
                    ? pendingRetake
                      ? isAr
                        ? 'إعادة التدريب على نموذج الوزارة الاسترشادي'
                        : 'Retake Official MOE Practice Exam'
                      : isAr
                        ? 'نموذج استرشادي — وزارة التربية والتعليم'
                        : 'Official MOE Guided Practice Exam'
                    : isAr
                      ? 'تعليمات ما قبل البدء'
                      : 'Exam Guidelines'}
                </span>
              </div>
              <button
                type="button"
                disabled={isStartingExam}
                onClick={() => setPendingExam(null)}
                aria-label={isAr ? 'إغلاق' : 'Close'}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              {pendingExam.titleAr}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 14px 0', lineHeight: 1.6 }}>
              {isAr
                ? `مدة الامتحان ${pendingExam.durationMinutes} دقيقة وعدد أسئلته ${pendingExam.questionsCount} سؤال. بمجرد البدء يعمل العداد الزمني على السيرفر ولا يمكن إيقافه، ويُرجى عدم مغادرة نافذة الامتحان.`
                : `Duration is ${pendingExam.durationMinutes} min with ${pendingExam.questionsCount} questions. Once started, the server timer cannot be paused.`}
            </p>

            {!pendingExam.showResults && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  color: '#D97706',
                  fontSize: '12px',
                  fontWeight: '700',
                  marginBottom: '16px',
                }}
              >
                <EyeOff size={16} style={{ flexShrink: 0 }} />
                <span>
                  {isAr
                    ? 'تنبيه: نتيجة هذا الاختبار محجوبة مؤقتاً بقرار المعلم وسيتم إعلانها لاحقاً.'
                    : 'Notice: Results will be released later by the teacher.'}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                disabled={isStartingExam}
                onClick={() => setPendingExam(null)}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                disabled={isStartingExam}
                onClick={handleConfirmStart}
                style={{
                  flex: 2,
                  padding: '11px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13.5px',
                  cursor: isStartingExam ? 'wait' : 'pointer',
                  opacity: isStartingExam ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 10px rgba(21, 136, 199, 0.25)',
                }}
              >
                <Play size={14} fill="#FFFFFF" />
                <span>
                  {isStartingExam
                    ? isAr
                      ? 'جاري تجهيز الامتحان...'
                      : 'Starting...'
                    : isAr
                      ? 'تأكيد وبدء الامتحان'
                      : 'Confirm & Begin'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
