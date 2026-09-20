import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { COURSES_CATALOG, MINISTRY_CURRICULUM } from '../../data/studentData';
import {
  Search,
  CheckCircle2,
  X,
  GraduationCap,
  Users
} from 'lucide-react';
import { SPage } from '../../components/student/ui';
import {
  MinistryCurriculumCard,
  TeacherCourseCard,
  CurriculumDetailModal
} from '../../features/student/courses';

export const StudentCoursesView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();

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
      <style>{`
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
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
            backgroundColor: 'var(--success)',
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

        {/* Calm Category Segment Switcher */}
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

        {/* SECTION 1: مقررات وزارة التربية والتعليم */}
        {activeCategory === 'ministry' && (
          <div style={{ animation: 'tabFadeIn 0.22s ease-out' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '20px'
            }}>
              {filteredMinistry.map((item) => (
                <MinistryCurriculumCard
                  key={item.id}
                  item={item}
                  lang={lang}
                  onContinue={() => navigate('/student/lesson')}
                  onOpenModal={(item) => setSelectedCurriculumModal(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: كورسات وحصص المعلمين */}
        {activeCategory === 'teachers' && (
          <div style={{ animation: 'tabFadeIn 0.22s ease-out' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '20px'
            }}>
              {filteredTeacherCourses.map((course) => (
                <TeacherCourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={!!enrolledCourses[course.id]}
                  lang={lang}
                  onContinue={() => navigate('/student/lesson')}
                  onEnroll={() => handleEnroll(course)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Clean Modal: Ministry Textbook & Topics */}
        {selectedCurriculumModal && (
          <CurriculumDetailModal
            item={selectedCurriculumModal}
            isRtl={isRtl}
            onClose={() => setSelectedCurriculumModal(null)}
            onStartLesson={() => navigate('/student/lesson')}
          />
        )}
      </div>
    </SPage>
  );
};
