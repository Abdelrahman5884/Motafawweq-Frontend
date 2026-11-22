import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import {
  Search,
  CheckCircle2,
  X,
  Layers,
  AlertCircle,
  RefreshCw,
  ArrowUpDown,
  Users,
  Sparkles,
  Landmark,
  GraduationCap,
} from 'lucide-react';
import { SPage } from '../../components/student/ui';
import {
  MinistryCurriculumCard,
  TeacherCourseCard,
  CurriculumDetailModal,
  CourseEnrollModal,
  useStudentCourses,
} from '../../features/student/courses';

export const StudentCoursesView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [selectedCurriculumCode, setSelectedCurriculumCode] = useState('');

  const {
    coursesCatalog,
    filteredCourses,
    loadingCourses,
    coursesError,
    ministryCurricula,
    filteredMinistryCurricula,
    loadingMinistry,
    ministryError,
    selectedMinistryGrade,
    setSelectedMinistryGrade,
    resolvedMinistryGrade,
    availableMinistryGrades,
    toggleMinistryUnit,
    togglingUnitKey,
    refreshCourses,
    stats,
    subjectOptions,
    activeTab,
    setActiveTab,
    selectedSubject,
    setSelectedSubject,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    hasActiveFilters,
    resetFilters,
    enrollTargetCourse,
    setEnrollTargetCourse,
    submitEnrollment,
    toast,
  } = useStudentCourses(lang);

  const selectedCurriculumModal = useMemo(
    () => ministryCurricula.find((item) => item.code === selectedCurriculumCode) || null,
    [ministryCurricula, selectedCurriculumCode]
  );

  const breadcrumbs = useMemo(
    () => [
      {
        labelAr: 'المقررات الدراسية',
        labelEn: 'Courses & Curriculum',
      },
    ],
    []
  );
  useSetBreadcrumbs(breadcrumbs);

  const handleOpenCourse = useCallback(
    (course) => {
      if (course.nextLessonId) {
        navigate(
          `/student/lesson?id=${encodeURIComponent(course.nextLessonId)}&courseId=${encodeURIComponent(course.id)}`
        );
      } else {
        navigate(`/student/lesson?courseId=${encodeURIComponent(course.id)}`);
      }
    },
    [navigate]
  );

  const handleTakeMinistryExam = useCallback(
    (item) => {
      if (item?.examCode) {
        navigate(`/student/exam?source=ministry&examCode=${encodeURIComponent(item.examCode)}`);
      } else {
        navigate('/student/exam?source=ministry');
      }
    },
    [navigate]
  );

  const tabs = useMemo(
    () => [
      { id: 'all', ar: 'الكل', en: 'All', count: stats.totalCount },
      { id: 'ministry', ar: 'مقررات وزارة التربية والتعليم', en: 'Ministry Curricula', count: stats.ministryCount, highlight: true },
      { id: 'enrolled', ar: 'مقرراتي المسجّلة', en: 'My Enrolled', count: stats.enrolledCount },
      { id: 'pending', ar: 'قيد المراجعة', en: 'Pending', count: stats.pendingCount },
      { id: 'discover', ar: 'استكشاف الكورسات', en: 'Discover', count: stats.discoverCount },
    ],
    [stats.totalCount, stats.ministryCount, stats.enrolledCount, stats.pendingCount, stats.discoverCount]
  );

  const showMinistrySection = activeTab === 'all' || activeTab === 'ministry';
  const showTeacherSection = activeTab !== 'ministry';
  const combinedError = coursesError || ministryError;
  const isInitialLoading = (showTeacherSection && loadingCourses) || (activeTab === 'ministry' && loadingMinistry);

  return (
    <SPage maxWidth={1180}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
          fontFamily: 'var(--font-arabic, sans-serif)',
          minWidth: 0,
        }}
      >
        {/* Toast Feedback Banner */}
        {toast && (
          <div
            role="status"
            aria-live="polite"
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: 'min(92vw, 500px)',
              backgroundColor: toast.type === 'warning' ? '#B45309' : '#059669',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: '12px',
              boxShadow: '0 12px 32px rgba(4, 25, 53, 0.3)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              fontWeight: '700',
              lineHeight: 1.5,
              overflowWrap: 'anywhere',
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{toast.message}</span>
          </div>
        )}

        {/* Header + Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            paddingBottom: '18px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                margin: '0 0 6px 0',
                letterSpacing: '-0.01em',
              }}
            >
              {isAr ? 'المقررات الدراسية والكورسات' : 'Courses & Ministry Curricula'}
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {isAr
                ? 'تابع مقررات وزارة التربية والتعليم المعتمدة وكورسات معلميك المسجّلة في مكان واحد'
                : 'Follow official Ministry of Education curricula alongside your enrolled teacher courses'}
            </p>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '330px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                insetInlineStart: '12px',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAr ? 'بحث في مقررات الوزارة أو الكورسات أو المعلمين...' : 'Search Ministry curricula, courses, teachers...'
              }
              style={{
                width: '100%',
                height: '42px',
                paddingInlineStart: '38px',
                paddingInlineEnd: searchQuery ? '34px' : '12px',
                borderRadius: '11px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                fontSize: '13px',
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
                  insetInlineEnd: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'inline-flex',
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Error Alert with Retry */}
        {combinedError && (
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
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: '#DC2626',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={18} />
              <span style={{ fontSize: '13px', fontWeight: '700' }}>{combinedError}</span>
            </div>
            <button
              type="button"
              onClick={refreshCourses}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
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
          </div>
        )}

        {/* Filter Tabs + Sort Dropdown */}
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
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedSubject('all');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                    color: isActive
                      ? tab.highlight
                        ? '#059669'
                        : 'var(--text-primary)'
                      : 'var(--text-secondary)',
                    fontWeight: isActive ? '800' : '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                  }}
                >
                  {tab.highlight && <Landmark size={14} />}
                  <span>{isAr ? tab.ar : tab.en}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '1px 7px',
                      borderRadius: '999px',
                      backgroundColor: isActive
                        ? tab.highlight
                          ? 'rgba(5, 150, 105, 0.14)'
                          : 'var(--primary-surface)'
                        : 'var(--bg-hover)',
                      color: isActive
                        ? tab.highlight
                          ? '#059669'
                          : 'var(--primary)'
                        : 'var(--text-muted)',
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={14} color="var(--text-muted)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label={isAr ? 'ترتيب المقررات' : 'Sort courses'}
              style={{
                padding: '8px 12px',
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
              <option value="smart">{isAr ? 'الترتيب الافتراضي (مسجّلة أولاً)' : 'Recommended'}</option>
              <option value="progress">{isAr ? 'الأعلى إنجازاً' : 'Highest Progress'}</option>
              <option value="lessons">{isAr ? 'الأكثر حصصاً' : 'Most Lessons'}</option>
              <option value="price_asc">{isAr ? 'الأقل سعراً' : 'Lowest Price'}</option>
            </select>
          </div>
        </div>

        {/* Dynamic Subject Filter Chips */}
        {subjectOptions.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '800',
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Layers size={13} />
              {isAr ? 'المادة:' : 'Subject:'}
            </span>
            <button
              type="button"
              onClick={() => setSelectedSubject('all')}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: `1px solid ${selectedSubject === 'all' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                backgroundColor: selectedSubject === 'all' ? 'var(--primary-surface)' : 'var(--bg-surface)',
                color: selectedSubject === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'جميع المواد' : 'All Subjects'}
            </button>
            {subjectOptions.map((subj) => {
              const active = selectedSubject === subj.ar;
              return (
                <button
                  key={subj.ar}
                  type="button"
                  onClick={() => setSelectedSubject(subj.ar)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '999px',
                    border: `1px solid ${active ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    backgroundColor: active ? 'var(--primary-surface)' : 'var(--bg-surface)',
                    color: active ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {isAr ? subj.ar : subj.en}
                </button>
              );
            })}
          </div>
        )}

        {/* Loading Skeleton */}
        {isInitialLoading ? (
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
                  minHeight: '260px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ height: '22px', width: '40%', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)' }} />
                <div style={{ height: '26px', width: '85%', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)' }} />
                <div style={{ height: '16px', width: '60%', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)', opacity: 0.7 }} />
                <div style={{ height: '42px', width: '100%', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', marginTop: 'auto' }} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* ══════ 1. Teacher Courses Section ══════ */}
            {showTeacherSection && (
              <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {activeTab === 'all' && filteredCourses.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <GraduationCap size={18} color="var(--primary)" />
                      <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
                        {isAr ? 'كورسات وحصص المعلمين' : 'Teacher Courses'}
                      </h2>
                    </div>
                  </div>
                )}

                {filteredCourses.length > 0 ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 310px), 1fr))',
                      gap: '20px',
                    }}
                  >
                    {filteredCourses.map((course) => (
                      <TeacherCourseCard
                        key={course.id}
                        course={course}
                        isEnrolled={course.isEnrolled}
                        isPending={course.isPending}
                        lang={lang}
                        onContinue={() => handleOpenCourse(course)}
                        onEnroll={() => setEnrollTargetCourse(course)}
                        onViewBilling={() => navigate('/student/billing')}
                      />
                    ))}
                  </div>
                ) : activeTab !== 'all' ? (
                  <div
                    style={{
                      padding: '44px 24px',
                      textAlign: 'center',
                      borderRadius: '20px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px dashed var(--border-subtle)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {coursesCatalog.length === 0 ? (
                      <>
                        <Users size={38} color="var(--primary)" style={{ marginBottom: '12px', opacity: 0.7 }} />
                        <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                          {isAr ? 'لا توجد كورسات معلمين منشورة حالياً' : 'No Published Teacher Courses Yet'}
                        </div>
                        <div style={{ fontSize: '13.5px', marginBottom: '18px' }}>
                          {isAr
                            ? 'انضم إلى مجموعة دراسية بكود معلمك لتظهر مقرراته وحصصه مباشرة هنا.'
                            : 'Join a study group with your teacher code to access courses here.'}
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate('/student/groups')}
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
                          <Sparkles size={15} />
                          <span>{isAr ? 'الانضمام بكود المجموعة' : 'Join Group by Code'}</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Search size={34} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
                        <div style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                          {isAr ? 'لا توجد كورسات مطابقة للبحث أو الفلتر' : 'No Matching Courses Found'}
                        </div>
                        {hasActiveFilters && (
                          <button
                            type="button"
                            onClick={resetFilters}
                            style={{
                              marginTop: '10px',
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
                            {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ) : null}
              </section>
            )}

            {/* ══════ 2. Official Ministry of Education Curricula Section ══════ */}
            {showMinistrySection && (
              <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    paddingTop: activeTab === 'all' && filteredCourses.length > 0 ? '10px' : 0,
                    borderTop: activeTab === 'all' && filteredCourses.length > 0 ? '1px solid var(--border-subtle)' : 'none',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <Landmark size={18} color="#059669" />
                      <h2 style={{ margin: 0, fontSize: '17.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
                        {isAr ? 'مقررات وزارة التربية والتعليم المعتمدة' : 'Ministry of Education Official Curricula'}
                      </h2>
                      {resolvedMinistryGrade && resolvedMinistryGrade !== 'all' && (
                        <span
                          style={{
                            fontSize: '11.5px',
                            fontWeight: '800',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            backgroundColor: 'rgba(5, 150, 105, 0.1)',
                            color: '#059669',
                          }}
                        >
                          {resolvedMinistryGrade}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      {isAr
                        ? 'تصفّح وحدات المنهج الرسمي، سجّل تقدمك في كل وحدة، وحل نماذج اختبارات الوزارة الاسترشادية.'
                        : 'Track your progress across official units, access MOE textbooks, and practice with guided Ministry exams.'}
                    </p>
                  </div>

                  {/* Grade Selector for Ministry Curricula */}
                  {availableMinistryGrades.length > 0 && (
                    <select
                      value={selectedMinistryGrade || resolvedMinistryGrade}
                      onChange={(e) => {
                        setSelectedMinistryGrade(e.target.value);
                        setSelectedSubject('all');
                      }}
                      aria-label={isAr ? 'اختيار الصف الدراسي لمقررات الوزارة' : 'Select grade for Ministry curricula'}
                      style={{
                        padding: '8px 12px',
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
                      <option value="all">{isAr ? 'جميع الصفوف الدراسية' : 'All Grades'}</option>
                      {availableMinistryGrades.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {loadingMinistry ? (
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
                        }}
                      />
                    ))}
                  </div>
                ) : filteredMinistryCurricula.length === 0 ? (
                  <div
                    style={{
                      padding: '40px 24px',
                      textAlign: 'center',
                      borderRadius: '20px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px dashed var(--border-subtle)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <Search size={32} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
                    <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                      {isAr ? 'لا توجد مقررات وزارية مطابقة للبحث' : 'No Matching Ministry Curricula'}
                    </div>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        style={{
                          marginTop: '8px',
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
                        {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
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
                    {filteredMinistryCurricula.map((item) => (
                      <MinistryCurriculumCard
                        key={item.code}
                        item={item}
                        lang={lang}
                        onOpenModal={(curr) => setSelectedCurriculumCode(curr.code)}
                        onTakeMinistryExam={handleTakeMinistryExam}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {/* Official Ministry Curriculum Units & Textbook Modal */}
        <CurriculumDetailModal
          item={selectedCurriculumModal}
          lang={lang}
          isRtl={isRtl}
          onClose={() => setSelectedCurriculumCode('')}
          onToggleUnit={toggleMinistryUnit}
          togglingUnitKey={togglingUnitKey}
          onTakeMinistryExam={handleTakeMinistryExam}
        />

        {/* Enrollment & Coupon Checkout Modal */}
        {enrollTargetCourse && (
          <CourseEnrollModal
            course={enrollTargetCourse}
            lang={lang}
            onClose={() => setEnrollTargetCourse(null)}
            onSubmitEnrollment={submitEnrollment}
          />
        )}
      </div>
    </SPage>
  );
};
