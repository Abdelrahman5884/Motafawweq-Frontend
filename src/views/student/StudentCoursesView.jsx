import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { SUBJECTS_LIST, COURSES_CATALOG } from '../../data/studentData';
import {
  Search,
  BookOpen,
  Star,
  Clock,
  CheckCircle2,
  Play,
  FileText,
  X,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Filter,
  Check,
  Award,
  Video,
  FileDown,
  Layers,
  HelpCircle,
  TrendingUp,
  Flame
} from 'lucide-react';
import { SPage } from '../../components/student/ui';

export const StudentCoursesView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  // Active filters
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'enrolled' | 'available' | 'top_rated'
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);
  const [modalActiveTab, setModalActiveTab] = useState('syllabus'); // 'syllabus' | 'about'

  // Local state for enrolled courses to support instant enrollment (US-18)
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const initial = {};
    COURSES_CATALOG.forEach(c => {
      if (c.isEnrolled) initial[c.id] = true;
    });
    return initial;
  });

  // Toast feedback state
  const [enrollToast, setEnrollToast] = useState(null);

  // US-18: One-Click Course Enrollment Flow with Celebration
  const handleEnroll = (course) => {
    setEnrolledCourses(prev => ({ ...prev, [course.id]: true }));
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 }
      });
    } catch (e) {
      // ignore
    }

    setEnrollToast({
      titleAr: course.titleAr,
      titleEn: course.title,
      subjectAr: course.subjectAr
    });

    setTimeout(() => {
      setEnrollToast(null);
    }, 4500);

    if (selectedCourseModal?.id === course.id) {
      setSelectedCourseModal(prev => ({ ...prev, isEnrolled: true }));
    }
  };

  // US-16: Real-time multi-criteria filtering (search, subject, enrollment status)
  const filteredCourses = COURSES_CATALOG.filter(course => {
    // Subject filter (US-14)
    const matchesSubject = selectedSubject === 'all' || course.subjectId === selectedSubject;

    // Search query (US-16)
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      course.titleAr.toLowerCase().includes(q) ||
      course.title.toLowerCase().includes(q) ||
      course.teacher.nameAr.toLowerCase().includes(q) ||
      course.teacher.name.toLowerCase().includes(q) ||
      course.subjectAr.toLowerCase().includes(q) ||
      (course.tags && course.tags.some(t => t.toLowerCase().includes(q)));

    // Status filter
    const isEnrolled = !!enrolledCourses[course.id];
    let matchesStatus = true;
    if (statusFilter === 'enrolled') matchesStatus = isEnrolled;
    if (statusFilter === 'available') matchesStatus = !isEnrolled;
    if (statusFilter === 'top_rated') matchesStatus = course.rating >= 4.93;

    return matchesSubject && matchesSearch && matchesStatus;
  });

  // Calculate course counts per subject
  const getSubjectCount = (subjectId) => {
    if (subjectId === 'all') return COURSES_CATALOG.length;
    return COURSES_CATALOG.filter(c => c.subjectId === subjectId).length;
  };

  // Generate a rich, realistic syllabus for course details modal (US-17)
  const getCourseSyllabus = (course) => {
    return [
      {
        chapterNumber: 1,
        titleAr: 'الوحدة الأولى: البنية التأسيسية ومخرجات التعلم الأساسية',
        lessons: [
          { id: 1, titleAr: 'مقدمة شاملة وخريطة المفاهيم الأساسية', duration: '28 دقيقة', hasVideo: true, hasPdf: true, hasQuiz: false, isPreview: true },
          { id: 2, titleAr: 'الآليات الدقيقة وتفسير التجارب العلمية', duration: '42 دقيقة', hasVideo: true, hasPdf: true, hasQuiz: true, isPreview: false },
          { id: 3, titleAr: 'العلاقات الرياضية والبيانية في المنهج', duration: '35 دقيقة', hasVideo: true, hasPdf: true, hasQuiz: true, isPreview: false }
        ]
      },
      {
        chapterNumber: 2,
        titleAr: 'الوحدة الثانية: تطبيقات مستويات التفكير العليا وبنك الأسئلة',
        lessons: [
          { id: 4, titleAr: 'حل وتفكيك أفكار بنك المعرفة وأسئلة الوزارة', duration: '48 دقيقة', hasVideo: true, hasPdf: true, hasQuiz: true, isPreview: false },
          { id: 5, titleAr: 'ورشة عمل البابل شيت والتدريب على الاختبارات المقالية', duration: '55 دقيقة', hasVideo: true, hasPdf: true, hasQuiz: true, isPreview: false }
        ]
      }
    ];
  };

  return (
    <SPage maxWidth={1240}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* ── Toast Notification for Successful Enrollment ── */}
        {enrollToast && (
          <div style={{
            position: 'fixed',
            bottom: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            fontWeight: '700',
            fontFamily: 'var(--font-arabic)',
            animation: 'fadeInArea 0.25s ease'
          }}>
            <CheckCircle2 size={20} />
            <span>
              {lang === 'ar'
                ? `مبروك! تم تسجيلك بنجاح في ${enrollToast.titleAr}. يمكنك الآن بدء المذاكرة!`
                : `Successfully enrolled in ${enrollToast.titleEn}!`
              }
            </span>
            <button
              onClick={() => navigate('/student/lesson')}
              style={{
                background: '#FFFFFF',
                color: '#065F46',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                marginInlineStart: '8px'
              }}
            >
              {lang === 'ar' ? 'بدء الحصة الآن' : 'Start Lesson'}
            </button>
          </div>
        )}

        {/* ── Header Row (US-14 / US-15 Intro) ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '26px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: 0,
              fontFamily: 'var(--font-heading), var(--font-arabic)',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>{lang === 'ar' ? 'اكتشاف الكورسات والحصص' : 'Course Discovery'}</span>
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              margin: '4px 0 0',
              fontWeight: '400'
            }}>
              {lang === 'ar'
                ? 'تصفح مناهج الصف الثالث الثانوي وتعلّم مع نخبة كبار معلمي الجمهورية.'
                : 'Browse 3rd Secondary curriculum and learn from top elite instructors.'
              }
            </p>
          </div>

          {/* Quick Enrolled Stats Banner */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(2, 132, 199, 0.08)',
            border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(2, 132, 199, 0.2)'}`,
            padding: '8px 16px',
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} style={{ color: isDark ? '#38BDF8' : '#0284C7' }} />
              <span style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#38BDF8' : '#0284C7' }}>
                {Object.keys(enrolledCourses).length} {lang === 'ar' ? 'كورسات مسجلة' : 'Enrolled Courses'}
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              {COURSES_CATALOG.length} {lang === 'ar' ? 'كورس متاح' : 'Available'}
            </span>
          </div>
        </div>

        {/* ── US-16: Search Bar & Quick Status Filter Tabs ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '16px 20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            {/* Search Input Box */}
            <div style={{
              position: 'relative',
              flex: 1,
              minWidth: '280px',
              maxWidth: '560px'
            }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  insetInlineStart: '14px',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث باسم الكورس، المعلم، المادة، أو الكلمات المفتاحية...' : 'Search course, teacher, or subject...'}
                style={{
                  width: '100%',
                  height: '44px',
                  paddingInlineStart: '42px',
                  paddingInlineEnd: searchQuery ? '38px' : '14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  background: isDark ? '#0A0F1D' : '#F8FAFC',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  fontFamily: 'var(--font-arabic)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = isDark ? '#38BDF8' : '#0284C7'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    insetInlineEnd: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={lang === 'ar' ? 'مسح البحث' : 'Clear search'}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Quick Status Filter Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', labelAr: 'جميع الكورسات', labelEn: 'All' },
                { id: 'enrolled', labelAr: 'كورساتي المسجلة', labelEn: 'Enrolled' },
                { id: 'available', labelAr: 'متاح للاشتراك', labelEn: 'Available' },
                { id: 'top_rated', labelAr: 'الأعلى تقييماً ★', labelEn: 'Top Rated ★' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  style={{
                    background: statusFilter === tab.id
                      ? (isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.12)')
                      : 'transparent',
                    color: statusFilter === tab.id
                      ? (isDark ? '#38BDF8' : '#0284C7')
                      : 'var(--text-secondary)',
                    border: `1px solid ${statusFilter === tab.id ? (isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.35)') : 'var(--border-subtle)'}`,
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '12.5px',
                    fontWeight: statusFilter === tab.id ? '700' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    minHeight: '38px'
                  }}
                >
                  {lang === 'ar' ? tab.labelAr : tab.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* ── US-14: Subject Filter Chips ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '12px'
          }}>
            <button
              onClick={() => setSelectedSubject('all')}
              className="executive-chip"
              style={{
                background: selectedSubject === 'all'
                  ? (isDark ? '#38BDF8' : '#0284C7')
                  : 'var(--bg-subtle)',
                color: selectedSubject === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
                border: selectedSubject === 'all' ? 'none' : '1px solid var(--border-subtle)'
              }}
            >
              <span>{lang === 'ar' ? 'جميع المواد' : 'All Subjects'}</span>
              <span style={{
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '99px',
                background: selectedSubject === 'all' ? 'rgba(0,0,0,0.2)' : 'var(--border-subtle)'
              }}>
                {getSubjectCount('all')}
              </span>
            </button>

            {SUBJECTS_LIST.map(sub => {
              const isSelected = selectedSubject === sub.id;
              const count = getSubjectCount(sub.id);
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub.id)}
                  className="executive-chip"
                  style={{
                    background: isSelected
                      ? sub.color
                      : isDark ? 'rgba(255, 255, 255, 0.04)' : 'var(--bg-subtle)',
                    color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                    border: `1px solid ${isSelected ? sub.color : 'var(--border-subtle)'}`
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isSelected ? '#FFFFFF' : sub.color }} />
                  <span>{lang === 'ar' ? sub.nameAr : sub.name}</span>
                  <span style={{
                    fontSize: '11px',
                    padding: '1px 6px',
                    borderRadius: '99px',
                    background: isSelected ? 'rgba(0,0,0,0.2)' : 'var(--border-subtle)'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Courses Count & Active Query Indicator ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
          color: 'var(--text-secondary)'
        }}>
          <div>
            {lang === 'ar' ? 'عرض' : 'Showing'} <strong style={{ color: 'var(--text-primary)' }}>{filteredCourses.length}</strong> {lang === 'ar' ? 'كورس متاح' : 'courses'}
            {selectedSubject !== 'all' && (
              <span style={{ marginInlineStart: '6px' }}>
                في مادة <strong style={{ color: isDark ? '#38BDF8' : '#0284C7' }}>{SUBJECTS_LIST.find(s => s.id === selectedSubject)?.nameAr}</strong>
              </span>
            )}
          </div>

          {(searchQuery || selectedSubject !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubject('all');
                setStatusFilter('all');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: isDark ? '#38BDF8' : '#0284C7',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{lang === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset filters'}</span>
            </button>
          )}
        </div>

        {/* ── US-15: Courses Grid ── */}
        {filteredCourses.length === 0 ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            background: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(56, 189, 248, 0.1)',
              color: isDark ? '#38BDF8' : '#0284C7',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <BookOpen size={26} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px' }}>
              {lang === 'ar' ? 'لم يتم العثور على كورسات مطابقة' : 'No matching courses found'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 16px' }}>
              {lang === 'ar' ? 'جرب البحث باسم مادة أخرى أو مسح شريط البحث لعرض كافة الكورسات المتاحة.' : 'Try changing your search query or reset filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubject('all');
                setStatusFilter('all');
              }}
              style={{
                background: isDark ? '#38BDF8' : '#0284C7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {lang === 'ar' ? 'عرض كافة الكورسات' : 'Show all courses'}
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
            gap: '20px'
          }}>
            {filteredCourses.map(course => {
              const isEnrolled = !!enrolledCourses[course.id];
              return (
                <div key={course.id} className="executive-course-card">
                  {/* Cover Image & Overlay */}
                  <div className="executive-course-cover">
                    <img src={course.cover} alt={course.titleAr} />
                    <div className="executive-course-cover-overlay" />

                    {/* Top Badges */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      insetInlineStart: '12px',
                      insetInlineEnd: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      pointerEvents: 'none'
                    }}>
                      {/* Subject Tag */}
                      <span style={{
                        background: 'rgba(10, 15, 29, 0.85)',
                        backdropFilter: 'blur(4px)',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 9px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.15)'
                      }}>
                        {course.subjectAr}
                      </span>

                      {/* Enrolled Status Badge */}
                      {isEnrolled ? (
                        <span style={{
                          background: '#10B981',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                        }}>
                          <CheckCircle2 size={12} />
                          <span>{lang === 'ar' ? 'أنت مسجل' : 'Enrolled'}</span>
                        </span>
                      ) : (
                        <span style={{
                          background: 'rgba(56, 189, 248, 0.9)',
                          color: '#0A0F1D',
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 9px',
                          borderRadius: '6px'
                        }}>
                          {lang === 'ar' ? 'متاح للتسجيل' : 'Available'}
                        </span>
                      )}
                    </div>

                    {/* Instructor on Cover */}
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      insetInlineStart: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <img
                        src={course.teacher.avatar}
                        alt={course.teacher.nameAr}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #FFFFFF'
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.2 }}>
                          {course.teacher.nameAr}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)' }}>
                          {course.teacher.titleAr.split(' ومؤلفة')[0]}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div style={{
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    gap: '12px'
                  }}>
                    {/* Course Title */}
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      margin: 0,
                      lineHeight: 1.45,
                      minHeight: '44px'
                    }}>
                      {course.titleAr}
                    </h3>

                    {/* Metadata Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BookOpen size={13} style={{ color: isDark ? '#38BDF8' : '#0284C7' }} />
                        <span>{course.lessonsCount} {lang === 'ar' ? 'حصة' : 'lessons'}</span>
                      </span>

                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>{course.durationHours}</span>
                      </span>

                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={13} fill="#F5A623" color="#F5A623" />
                        <strong style={{ color: 'var(--text-primary)' }}>{course.rating}</strong>
                        <span style={{ color: 'var(--text-muted)' }}>({course.reviewsCount})</span>
                      </span>

                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>{course.teacher.studentsCount.toLocaleString()}</span>
                      </span>
                    </div>

                    {/* Enrolled Progress Bar */}
                    {isEnrolled && (
                      <div style={{
                        background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.03)',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'نسبة تقدمك في المنهج' : 'Course Progress'}</span>
                          <strong style={{ color: '#10B981' }}>{course.progressPercent}%</strong>
                        </div>
                        <div style={{ height: '5px', background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ width: `${course.progressPercent}%`, height: '100%', background: '#10B981', borderRadius: '99px' }} />
                        </div>
                      </div>
                    )}

                    {/* Card Footer: Price & Action Buttons */}
                    <div style={{
                      marginTop: 'auto',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {isEnrolled ? (lang === 'ar' ? 'الاشتراك' : 'Status') : (lang === 'ar' ? 'سعر الكورس' : 'Price')}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {isEnrolled ? (
                            <span style={{ color: '#10B981', fontSize: '14px' }}>{lang === 'ar' ? 'اشتراك نشط' : 'Active'}</span>
                          ) : (
                            <>
                              {course.priceEgp} <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* US-17: View Course Details Button */}
                        <button
                          onClick={() => {
                            setSelectedCourseModal(course);
                            setModalActiveTab('syllabus');
                          }}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '12.5px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = isDark ? '#38BDF8' : '#0284C7'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                        >
                          {lang === 'ar' ? 'تفاصيل' : 'Details'}
                        </button>

                        {/* US-18: Instant Enroll or Resume Button */}
                        {isEnrolled ? (
                          <button
                            onClick={() => navigate(`/student/lesson?course=${course.id}`)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: isDark ? '#38BDF8' : '#0284C7',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 14px',
                              fontSize: '12.5px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              boxShadow: `0 4px 12px ${isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(2, 132, 199, 0.25)'}`,
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <Play size={13} fill="#FFFFFF" />
                            <span>{lang === 'ar' ? 'متابعة' : 'Resume'}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEnroll(course)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#10B981',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 14px',
                              fontSize: '12.5px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <CheckCircle2 size={13} />
                            <span>{lang === 'ar' ? 'تسجيل' : 'Enroll'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            US-17: عرض تفاصيل الكورس (Course Details & Curriculum Modal)
            ══════════════════════════════════════════════════════════════════════ */}
        {selectedCourseModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '20px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Close Button */}
              <button
                onClick={() => setSelectedCourseModal(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  insetInlineEnd: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  zIndex: 20
                }}
              >
                <X size={16} />
              </button>

              {/* Modal Hero Cover */}
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img
                  src={selectedCourseModal.cover}
                  alt={selectedCourseModal.titleAr}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(14, 23, 38, 0.95) 0%, rgba(14, 23, 38, 0.3) 100%)'
                }} />

                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  insetInlineStart: '20px',
                  insetInlineEnd: '20px'
                }}>
                  <span style={{
                    backgroundColor: '#38BDF8',
                    color: '#0A0F1D',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    display: 'inline-block',
                    marginBottom: '6px'
                  }}>
                    {selectedCourseModal.subjectAr}
                  </span>
                  <h2 style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#FFFFFF',
                    margin: 0,
                    lineHeight: 1.35
                  }}>
                    {selectedCourseModal.titleAr}
                  </h2>
                </div>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Instructor Card */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={selectedCourseModal.teacher.avatar}
                      alt={selectedCourseModal.teacher.nameAr}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                    />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {selectedCourseModal.teacher.nameAr}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        {selectedCourseModal.teacher.titleAr}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F5A623', fontWeight: '700' }}>
                      <Star size={13} fill="#F5A623" />
                      <span>{selectedCourseModal.teacher.rating}</span>
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {selectedCourseModal.teacher.studentsCount.toLocaleString()} {lang === 'ar' ? 'طالب' : 'students'}
                    </span>
                  </div>
                </div>

                {/* Tabs Selector: Syllabus (فهرس الحصص) vs About (عن الكورس) */}
                <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  <button
                    onClick={() => setModalActiveTab('syllabus')}
                    style={{
                      background: modalActiveTab === 'syllabus' ? (isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.12)') : 'transparent',
                      color: modalActiveTab === 'syllabus' ? (isDark ? '#38BDF8' : '#0284C7') : 'var(--text-secondary)',
                      border: `1px solid ${modalActiveTab === 'syllabus' ? (isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.35)') : 'transparent'}`,
                      borderRadius: '8px',
                      padding: '7px 14px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {lang === 'ar' ? 'فهرس الحصص والفصول' : 'Course Syllabus'}
                  </button>

                  <button
                    onClick={() => setModalActiveTab('about')}
                    style={{
                      background: modalActiveTab === 'about' ? (isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.12)') : 'transparent',
                      color: modalActiveTab === 'about' ? (isDark ? '#38BDF8' : '#0284C7') : 'var(--text-secondary)',
                      border: `1px solid ${modalActiveTab === 'about' ? (isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.35)') : 'transparent'}`,
                      borderRadius: '8px',
                      padding: '7px 14px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {lang === 'ar' ? 'عن الكورس ومخرجات التعلم' : 'About Course'}
                  </button>
                </div>

                {/* Tab 1: Syllabus Content */}
                {modalActiveTab === 'syllabus' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {getCourseSyllabus(selectedCourseModal).map((chapter, idx) => (
                      <div key={idx} style={{
                        borderRadius: '12px',
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          padding: '10px 14px',
                          background: 'var(--bg-subtle)',
                          fontSize: '13px',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <Layers size={15} style={{ color: isDark ? '#38BDF8' : '#0284C7' }} />
                          <span>{chapter.titleAr}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {chapter.lessons.map(lesson => (
                            <div
                              key={lesson.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px 14px',
                                borderTop: '1px solid var(--border-subtle)',
                                fontSize: '12.5px',
                                background: 'var(--bg-surface)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  background: 'var(--bg-subtle)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  color: 'var(--text-secondary)'
                                }}>
                                  {lesson.id}
                                </div>
                                <div>
                                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                                    {lesson.titleAr}
                                  </div>
                                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                                    <span>{lesson.duration}</span>
                                    {lesson.hasVideo && <span>• فيديو 4K</span>}
                                    {lesson.hasPdf && <span>• ملزمة PDF</span>}
                                    {lesson.hasQuiz && <span>• كويز تفاعلي</span>}
                                  </div>
                                </div>
                              </div>

                              {lesson.isPreview ? (
                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  color: '#10B981',
                                  background: 'rgba(16, 185, 129, 0.12)',
                                  padding: '2px 8px',
                                  borderRadius: '6px'
                                }}>
                                  {lang === 'ar' ? 'معاينة مجانية' : 'Free Preview'}
                                </span>
                              ) : (
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                  {enrolledCourses[selectedCourseModal.id] ? (lang === 'ar' ? 'متاح الآن' : 'Available') : (lang === 'ar' ? 'يتطلب التسجيل' : 'Locked')}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 2: About & Outcomes Content */}
                {modalActiveTab === 'about' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <p style={{
                      fontSize: '13.5px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      margin: 0
                    }}>
                      {selectedCourseModal.descriptionAr}
                    </p>

                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {lang === 'ar' ? 'ماذا ستتعلم في هذا الكورس؟' : 'What you will learn:'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {[
                          'إتقان مخرجات التعلم وفهم أدق التفاصيل في منهج الثانوية العامة.',
                          'التدريب على حل أحدث أفكار امتحانات الأعوام السابقة ونماذج الوزارة الاسترشادية.',
                          'حل أسئلة البابل شيت بنظام الاستبعاد وإدارة وقت الامتحان بكفاءة.',
                          'ملازم وملخصات خرائط ذهنية PDF حصرية جاهزة للطباعة مع كل حصة.'
                        ].map((point, pIdx) => (
                          <div key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                            <Check size={14} style={{ color: '#10B981', flexShrink: 0, marginTop: '3px' }} />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats Summary Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  {[
                    { label: lang === 'ar' ? 'عدد الحصص' : 'Lessons', val: `${selectedCourseModal.lessonsCount} حصة` },
                    { label: lang === 'ar' ? 'ساعات الشرح' : 'Hours', val: selectedCourseModal.durationHours },
                    { label: lang === 'ar' ? 'ملفات مرفقة' : 'Files', val: `${selectedCourseModal.attachmentsCount} ملف` },
                    { label: lang === 'ar' ? 'التقييم العام' : 'Rating', val: `${selectedCourseModal.rating} ★` }
                  ].map((s, sIdx) => (
                    <div key={sIdx} style={{
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'var(--bg-subtle)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.label}</div>
                      <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>{s.val}</div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Modal Sticky Bottom Action Footer */}
              <div style={{
                marginTop: 'auto',
                padding: '16px 20px',
                borderTop: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                borderRadius: '0 0 20px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    {enrolledCourses[selectedCourseModal.id] ? (lang === 'ar' ? 'حالة الاشتراك' : 'Status') : (lang === 'ar' ? 'السعر الشامل' : 'Total Price')}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {enrolledCourses[selectedCourseModal.id] ? (
                      <span style={{ color: '#10B981', fontSize: '15px' }}>{lang === 'ar' ? 'أنت مسجل في الكورس' : 'Enrolled'}</span>
                    ) : (
                      <>
                        {selectedCourseModal.priceEgp} <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                      </>
                    )}
                  </div>
                </div>

                {enrolledCourses[selectedCourseModal.id] ? (
                  <button
                    onClick={() => {
                      setSelectedCourseModal(null);
                      navigate(`/student/lesson?course=${selectedCourseModal.id}`);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: isDark ? '#38BDF8' : '#0284C7',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 20px',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: `0 4px 16px ${isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.25)'}`
                    }}
                  >
                    <Play size={16} fill="#FFFFFF" />
                    <span>{lang === 'ar' ? 'الانتقال إلى مشغل الحصة' : 'Go to Lesson Player'}</span>
                    {isRtl ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(selectedCourseModal)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 22px',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{lang === 'ar' ? 'التسجيل في الكورس الآن' : 'Enroll Now'}</span>
                    {isRtl ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </SPage>
  );
};
