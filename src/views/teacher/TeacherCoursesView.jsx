import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { TEACHER_COURSES } from '../../data/teacherData';
import { 
  BookOpen, 
  Plus, 
  Users, 
  Star, 
  Clock, 
  Search, 
  Layers, 
  DollarSign, 
  ChevronLeft,
  X,
  PlayCircle,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export const TeacherCoursesView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  const [courses, setCourses] = useState(TEACHER_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Course Form state
  const [newTitle, setNewTitle] = useState('');
  const [newStage, setNewStage] = useState('sec');
  const [newGrade, setNewGrade] = useState('الصف الثالث الثانوي');
  const [newPrice, setNewPrice] = useState('350');
  const [newDesc, setNewDesc] = useState('');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = !searchQuery || 
      course.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.gradeAr.includes(searchQuery);
    const matchesStage = stageFilter === 'all' || course.stageId === stageFilter;
    return matchesSearch && matchesStage;
  });

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const newCourseObj = {
      id: `course-${Date.now()}`,
      title: newTitle,
      titleAr: newTitle,
      stage: newStage === 'sec' ? 'المرحلة الثانوية' : 'المرحلة الإعدادية',
      stageId: newStage,
      gradeAr: newGrade,
      subjectAr: 'الأحياء',
      cover: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80',
      priceEgp: Number(newPrice) || 300,
      studentsCount: 0,
      rating: 5.0,
      lessonsCount: 1,
      hoursTotal: '2 ساعة',
      status: 'published',
      completionRate: 100,
      revenueEgp: 0,
      descriptionAr: newDesc || 'مقرر تعليمي جديد تم إنشاؤه عبر منصة متفوق.'
    };

    setCourses([newCourseObj, ...courses]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '32px 24px 80px',
      fontFamily: 'var(--font-arabic)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              color: 'var(--primary)',
              fontSize: '11px',
              fontWeight: '800'
            }}>
              <BookOpen size={13} />
              <span>{lang === 'ar' ? 'المناهج والكورسات الأكاديمية' : 'Curriculum & Courses'}</span>
            </span>
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            {lang === 'ar' ? 'إدارة المقررات والمناهج والدروس' : 'Course & Curriculum Management'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            {lang === 'ar' 
              ? 'إنشاء ومتابعة الكورسات، الحصص المسجلة، الفصول، ومذكرات الـ PDF للطلاب' 
              : 'Manage courses, recorded sessions, curriculum modules, and student notes'}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            fontSize: '13.5px',
            fontWeight: '800',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(21, 136, 199, 0.3)',
            transition: 'all 0.15s ease'
          }}
        >
          <Plus size={16} />
          <span>{lang === 'ar' ? 'إنشاء كورس جديد' : 'New Course'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '12px 18px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        {/* Stage Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', labelAr: 'جميع المراحل', labelEn: 'All Stages' },
            { id: 'sec', labelAr: 'المرحلة الثانوية', labelEn: 'Secondary' },
            { id: 'prep', labelAr: 'المرحلة الإعدادية', labelEn: 'Preparatory' }
          ].map(stage => (
            <button
              key={stage.id}
              onClick={() => setStageFilter(stage.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: stageFilter === stage.id ? '800' : '600',
                border: stageFilter === stage.id ? '1px solid var(--primary)' : '1px solid transparent',
                backgroundColor: stageFilter === stage.id ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                color: stageFilter === stage.id ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {lang === 'ar' ? stage.labelAr : stage.labelEn}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-main)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '6px 12px',
          width: '280px'
        }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'بحث في أسماء الكورسات...' : 'Search courses...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              width: '100%',
              fontFamily: 'inherit'
            }}
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        {filteredCourses.map(course => (
          <div
            key={course.id}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xs)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            {/* Course Image Header */}
            <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
              <img
                src={course.cover}
                alt={course.titleAr}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)'
              }} />

              {/* Badges on Cover */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                gap: '6px'
              }}>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(0,0,0,0.65)',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: '700',
                  backdropFilter: 'blur(4px)'
                }}>
                  {course.stage}
                </span>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(21, 136, 199, 0.85)',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: '700',
                  backdropFilter: 'blur(4px)'
                }}>
                  {course.gradeAr}
                </span>
              </div>

              {/* Price Tag */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.9)',
                color: '#FFFFFF',
                padding: '3px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '900',
                backdropFilter: 'blur(4px)'
              }}>
                {course.priceEgp} ج.م / شهر
              </div>
            </div>

            {/* Course Content Info */}
            <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{
                  fontSize: '15.5px',
                  fontWeight: '900',
                  color: 'var(--text-primary)',
                  margin: '0 0 8px',
                  lineHeight: 1.4
                }}>
                  {course.titleAr}
                </h3>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  margin: '0 0 14px',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {course.descriptionAr}
                </p>
              </div>

              {/* Stats Bar */}
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {course.studentsCount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                      {lang === 'ar' ? 'طالب مشترك' : 'Students'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {course.lessonsCount}
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                      {lang === 'ar' ? 'حصة مسجلة' : 'Lessons'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                      <Star size={12} fill="#F59E0B" />
                      <span>{course.rating}</span>
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                      {lang === 'ar' ? 'التقييم' : 'Rating'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => navigate('/teacher/workspace')}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)',
                      border: '1px solid rgba(21, 136, 199, 0.25)',
                      color: 'var(--primary)',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Layers size={14} />
                    <span>{lang === 'ar' ? 'خريطة الحصص' : 'Lessons Map'}</span>
                  </button>

                  <button
                    onClick={() => navigate('/teacher/studio')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <PlayCircle size={14} />
                    <span>{lang === 'ar' ? 'تسجيل حصة' : 'Record'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create New Course Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '540px',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  {lang === 'ar' ? 'إنشاء كورس أو مقرر جديد' : 'Create New Course'}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'عنوان المقرر أو الكورس:' : 'Course Title:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: ماستر كلاس التنسيق الهرموني والاتزان' : 'e.g. Masterclass in Genetics'}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'المرحلة الدراسية:' : 'Stage:'}
                  </label>
                  <select
                    value={newStage}
                    onChange={(e) => {
                      setNewStage(e.target.value);
                      setNewGrade(e.target.value === 'sec' ? 'الصف الثالث الثانوي' : 'الصف الثالث الإعدادي');
                    }}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  >
                    <option value="sec">{lang === 'ar' ? 'المرحلة الثانوية' : 'Secondary'}</option>
                    <option value="prep">{lang === 'ar' ? 'المرحلة الإعدادية' : 'Preparatory'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'الصف الدراسي:' : 'Grade:'}
                  </label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  >
                    {newStage === 'sec' ? (
                      <>
                        <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                        <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                        <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                      </>
                    ) : (
                      <>
                        <option value="الصف الأول الإعدادي">الصف الأول الإعدادي</option>
                        <option value="الصف الثاني الإعدادي">الصف الثاني الإعدادي</option>
                        <option value="الصف الثالث الإعدادي">الصف الثالث الإعدادي</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'سعر الاشتراك الشهري (ج.م):' : 'Monthly Price (EGP):'}
                </label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'وصف المقرر ومخرجات التعلم:' : 'Description:'}
                </label>
                <textarea
                  rows="3"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder={lang === 'ar' ? 'اكتب نبذة عن الكورس والوحدات التي يشملها...' : 'Brief summary of the course...'}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(21, 136, 199, 0.3)'
                  }}
                >
                  {lang === 'ar' ? 'حفظ ونشر المقرر' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCoursesView;
