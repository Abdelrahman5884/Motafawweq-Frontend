import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { COURSES_CATALOG, MINISTRY_CURRICULUM } from '../../data/studentData';
import {
  Search,
  BookOpen,
  Clock,
  CheckCircle2,
  Play,
  FileText,
  X,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Download,
  Check,
  Award,
  Video,
  Layers,
  ChevronLeft,
  Users
} from 'lucide-react';
import { SPage } from '../../components/student/ui';

export const StudentCoursesView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  // Category Tab: 'ministry' (مقررات وزارة التربية والتعليم) | 'teachers' (حصص وكورسات المعلمين)
  const [activeCategory, setActiveCategory] = useState('ministry');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurriculumModal, setSelectedCurriculumModal] = useState(null);

  // Local state for enrolled courses
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const initial = {};
    COURSES_CATALOG.forEach(c => {
      if (c.isEnrolled) initial[c.id] = true;
    });
    return initial;
  });

  const [enrollToast, setEnrollToast] = useState(null);

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

    setEnrollToast(course.titleAr);
    setTimeout(() => {
      setEnrollToast(null);
    }, 4000);
  };

  // Filter Ministry curriculum
  const filteredMinistry = MINISTRY_CURRICULUM.filter(item => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      item.titleAr.toLowerCase().includes(q) ||
      item.subjectAr.toLowerCase().includes(q) ||
      item.gradeAr.toLowerCase().includes(q)
    );
  });

  // Filter Teacher courses
  const filteredTeacherCourses = COURSES_CATALOG.filter(course => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      course.titleAr.toLowerCase().includes(q) ||
      course.subjectAr.toLowerCase().includes(q) ||
      course.teacher.nameAr.toLowerCase().includes(q)
    );
  });

  return (
    <SPage maxWidth={1120}>
      {/* Subtle & Calm Styles */}
      <style>{`
        @keyframes tabFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .clean-course-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .clean-course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
          border-color: var(--border-medium);
        }
        .clean-btn {
          transition: all 0.15s ease;
        }
        .clean-btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .clean-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'var(--font-arabic, sans-serif)' }}>
        
        {/* Toast Notification */}
        {enrollToast && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            padding: '12px 22px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.35)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13.5px',
            fontWeight: '700',
            animation: 'modalFadeIn 0.2s ease'
          }}>
            <CheckCircle2 size={18} />
            <span>تم التسجيل بنجاح في: {enrollToast}</span>
          </div>
        )}

        {/* Clean Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              letterSpacing: '-0.01em'
            }}>
              {lang === 'ar' ? 'المقررات الدراسية' : 'Curriculum & Courses'}
            </h1>
            <p style={{
              fontSize: '13.5px',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.5
            }}>
              {lang === 'ar'
                ? 'مناهج وزارة التربية والتعليم الرسمية، وباقات وحصص كبار معلمي الجمهورية'
                : 'Official Ministry of Education curriculum and top registered teacher courses'}
            </p>
          </div>

          {/* Quick Search */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '320px'
          }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                insetInlineStart: '12px',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث في المقرارات أو المعلمين...' : 'Search curriculum or teacher...'}
              style={{
                width: '100%',
                height: '40px',
                paddingInlineStart: '36px',
                paddingInlineEnd: searchQuery ? '32px' : '12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'var(--font-arabic)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  insetInlineEnd: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ── Calm Category Segment Switcher ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-subtle)',
          padding: '4px',
          borderRadius: '14px',
          width: 'fit-content',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveCategory('ministry')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 20px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeCategory === 'ministry' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: activeCategory === 'ministry' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: activeCategory === 'ministry' ? '800' : '600',
              fontSize: '13.5px',
              cursor: 'pointer',
              boxShadow: activeCategory === 'ministry' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <GraduationCap size={16} color={activeCategory === 'ministry' ? 'var(--primary)' : 'var(--text-muted)'} />
            <span>{lang === 'ar' ? 'مقررات وزارة التربية والتعليم' : 'Ministry Curriculum'}</span>
            <span style={{
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '6px',
              backgroundColor: activeCategory === 'ministry' ? 'var(--primary-surface)' : 'var(--bg-hover)',
              color: activeCategory === 'ministry' ? 'var(--primary)' : 'var(--text-muted)'
            }}>
              {MINISTRY_CURRICULUM.length}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('teachers')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 20px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeCategory === 'teachers' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: activeCategory === 'teachers' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: activeCategory === 'teachers' ? '800' : '600',
              fontSize: '13.5px',
              cursor: 'pointer',
              boxShadow: activeCategory === 'teachers' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Users size={16} color={activeCategory === 'teachers' ? 'var(--primary)' : 'var(--text-muted)'} />
            <span>{lang === 'ar' ? 'حصص وكورسات المعلمين' : 'Teacher Courses'}</span>
            <span style={{
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '6px',
              backgroundColor: activeCategory === 'teachers' ? 'var(--primary-surface)' : 'var(--bg-hover)',
              color: activeCategory === 'teachers' ? 'var(--primary)' : 'var(--text-muted)'
            }}>
              {COURSES_CATALOG.length}
            </span>
          </button>
        </div>

        {/* =========================================================================
            SECTION 1: مقررات وزارة التربية والتعليم (MINISTRY CURRICULUM)
           ========================================================================= */}
        {activeCategory === 'ministry' && (
          <div style={{ animation: 'tabFadeIn 0.22s ease-out' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '20px'
            }}>
              {filteredMinistry.map((item) => (
                <div
                  key={item.id}
                  className="clean-course-card"
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '20px',
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div>
                    {/* Top Row: Subject & Source */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        padding: '3px 10px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        {item.subjectAr}
                      </span>

                      <span style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        color: '#059669',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}>
                        معتمد وزارياً
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '17px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      margin: '0 0 6px 0',
                      lineHeight: 1.45
                    }}>
                      {item.titleAr}
                    </h3>

                    {/* Grade Track */}
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      marginBottom: '14px'
                    }}>
                      {item.gradeAr}
                    </div>

                    {/* Current Unit */}
                    <div style={{
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      marginBottom: '16px',
                      lineHeight: 1.4
                    }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '2px' }}>الوحدة الحالية:</div>
                      <strong>{item.activeUnitAr}</strong>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: '18px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        color: 'var(--text-secondary)',
                        marginBottom: '6px'
                      }}>
                        <span>إنجاز المنهج الدراسي</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{item.progressPercent}%</strong>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg-subtle)',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${item.progressPercent}%`,
                          height: '100%',
                          borderRadius: '6px',
                          backgroundColor: 'var(--primary)',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>

                    {/* Curriculum Specs */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      marginBottom: '18px'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Layers size={13} color="var(--text-muted)" />
                        {item.unitsCount} وحدات
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FileText size={13} color="var(--text-muted)" />
                        {item.chaptersCount} درساً
                      </span>
                      <span>•</span>
                      <span>بنك أسئلة الوزارة</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate('/student/lesson')}
                      className="clean-btn"
                      style={{
                        flex: 1,
                        padding: '11px 16px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(108, 77, 255, 0.25)'
                      }}
                    >
                      <Play size={14} fill="#FFFFFF" />
                      <span>{lang === 'ar' ? 'متابعة المذاكرة' : 'Continue'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedCurriculumModal(item)}
                      style={{
                        padding: '11px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {lang === 'ar' ? 'كتاب الوزارة' : 'Textbook'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 2: كورسات وحصص المعلمين (TEACHER COURSES)
           ========================================================================= */}
        {activeCategory === 'teachers' && (
          <div style={{ animation: 'tabFadeIn 0.22s ease-out' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '20px'
            }}>
              {filteredTeacherCourses.map((course) => {
                const isEnrolled = !!enrolledCourses[course.id];

                return (
                  <div
                    key={course.id}
                    className="clean-course-card"
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '20px',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    <div>
                      {/* Top Row: Subject & Enrollment status */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px'
                      }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          padding: '3px 10px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-subtle)'
                        }}>
                          {course.subjectAr}
                        </span>

                        {isEnrolled ? (
                          <span style={{
                            fontSize: '11.5px',
                            fontWeight: '700',
                            color: '#059669',
                            backgroundColor: 'rgba(16, 185, 129, 0.08)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Check size={12} />
                            <span>مشترك به</span>
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '11.5px',
                            fontWeight: '600',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'var(--bg-subtle)',
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}>
                            {course.priceEgp} ج.م
                          </span>
                        )}
                      </div>

                      {/* Course Title */}
                      <h3 style={{
                        fontSize: '16.5px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        margin: '0 0 10px 0',
                        lineHeight: 1.45,
                        minHeight: '44px'
                      }}>
                        {course.titleAr}
                      </h3>

                      {/* Teacher Row */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '16px',
                        paddingBottom: '12px',
                        borderBottom: '1px solid var(--border-subtle)'
                      }}>
                        <img
                          src={course.teacher.avatar}
                          alt={course.teacher.nameAr}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                            {course.teacher.nameAr}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {course.teacher.titleAr}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar if enrolled */}
                      {isEnrolled && (
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '11.5px',
                            fontWeight: '700',
                            color: 'var(--text-secondary)',
                            marginBottom: '6px'
                          }}>
                            <span>تقدمك في الحصص</span>
                            <strong style={{ color: 'var(--text-primary)' }}>{course.progressPercent}%</strong>
                          </div>
                          <div style={{
                            width: '100%',
                            height: '6px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-subtle)',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${course.progressPercent}%`,
                              height: '100%',
                              borderRadius: '6px',
                              backgroundColor: 'var(--primary)',
                              transition: 'width 0.5s ease'
                            }} />
                          </div>
                        </div>
                      )}

                      {/* Course Specs */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        marginBottom: '18px'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Video size={13} color="var(--text-muted)" />
                          {course.lessonsCount} حصة
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} color="var(--text-muted)" />
                          {course.durationHours}
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ★ {course.rating}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isEnrolled ? (
                        <button
                          onClick={() => navigate('/student/lesson')}
                          className="clean-btn"
                          style={{
                            width: '100%',
                            padding: '11px 16px',
                            borderRadius: '12px',
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 8px rgba(108, 77, 255, 0.25)'
                          }}
                        >
                          <Play size={14} fill="#FFFFFF" />
                          <span>{lang === 'ar' ? 'متابعة الحصة الآن' : 'Continue Lesson'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course)}
                          className="clean-btn"
                          style={{
                            width: '100%',
                            padding: '11px 16px',
                            borderRadius: '12px',
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '13px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>{lang === 'ar' ? `الاشتراك بالكورس (${course.priceEgp} ج.م)` : 'Enroll in Course'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            CLEAN MODAL: MINISTRY TEXTBOOK & TOPICS PREVIEW
           ========================================================================= */}
        {selectedCurriculumModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: '20px',
              maxWidth: '480px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18)',
              position: 'relative',
              animation: 'modalFadeIn 0.2s ease-out'
            }}>
              {/* Close */}
              <button
                onClick={() => setSelectedCurriculumModal(null)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  left: isRtl ? '18px' : 'auto',
                  right: isRtl ? 'auto' : '18px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>

              <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                {selectedCurriculumModal.sourceAr}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                {selectedCurriculumModal.titleAr}
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
                {selectedCurriculumModal.gradeAr}
              </p>

              {/* Topics List */}
              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '14px',
                padding: '14px',
                marginBottom: '18px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
                  الأبواب والوحدات المقررة رسمياً:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedCurriculumModal.topics.map((t, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'var(--primary)',
                        flexShrink: 0
                      }}>
                        {idx + 1}
                      </span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => setSelectedCurriculumModal(null)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  إغلاق
                </button>
                <button
                  onClick={() => {
                    setSelectedCurriculumModal(null);
                    navigate('/student/lesson');
                  }}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(108, 77, 255, 0.3)'
                  }}
                >
                  بدء مذاكرة المنهج
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SPage>
  );
};
