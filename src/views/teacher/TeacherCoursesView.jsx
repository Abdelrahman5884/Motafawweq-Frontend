import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { teacherApi } from '../../services/teacherApi';
import { 
  BookOpen, 
  Plus, 
  Users, 
  Clock, 
  Search, 
  Layers, 
  PlayCircle,
  X,
  FileText,
  Trash2,
  AlertTriangle,
  Edit3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const TeacherCoursesView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';

  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live courses on mount
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    teacherApi.courses.list()
      .then((res) => {
        if (mounted && res?.data && Array.isArray(res.data)) {
          const mapped = res.data.map((c) => {
            const rawPrice = c.priceEgp !== undefined && c.priceEgp !== null ? c.priceEgp : c.price_egp;
            const parsedPrice = rawPrice !== undefined && rawPrice !== null && !isNaN(Number(rawPrice)) ? Number(rawPrice) : 0;
            return {
              id: c.uuid || c.id,
              uuid: c.uuid || c.id,
              title: c.titleAr || c.title_ar || c.title,
              titleAr: c.titleAr || c.title_ar || c.title,
              stage: c.stageType === 'prep' || c.stage_type === 'prep' ? 'المرحلة الإعدادية' : 'المرحلة الثانوية',
              stageId: c.stageType || c.stage_type || 'sec',
              gradeAr: c.gradeAr || c.grade_ar || 'الصف الثالث الثانوي',
              subjectAr: c.subjectAr || c.subject_ar || 'الأحياء',
              cover: c.coverImageUrl || c.cover || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80',
              priceEgp: parsedPrice,
              studentsCount: c.enrolledStudentsCount || c.studentsCount || 0,
              rating: Number(c.rating) || 4.9,
              lessonsCount: c.lessonsCount || c.lessons_count || 0,
              hoursTotal: c.durationFormatted || c.hoursTotal || '10 ساعات',
              status: c.status || 'published',
              completionRate: 85,
              revenueEgp: parsedPrice * (c.enrolledStudentsCount || 0),
              descriptionAr: c.descriptionAr || c.description_ar || 'مقرر دراسي معتمد على منصة متفوق.'
            };
          });
          setCourses(mapped);
        }
      })
      .catch((err) => {
        console.warn('Teacher courses load error:', err);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  // Delete Course Confirmation Dialog state
  const [deleteCourseDialog, setDeleteCourseDialog] = useState({
    isOpen: false,
    id: null,
    title: ''
  });

  const promptDeleteCourse = (courseId, courseTitle, e) => {
    if (e) e.stopPropagation();
    setDeleteCourseDialog({
      isOpen: true,
      id: courseId,
      title: courseTitle
    });
  };

  const handleConfirmDeleteCourse = async () => {
    const courseId = deleteCourseDialog.id;
    const courseObj = courses.find(c => c.id === courseId);
    if (courseObj?.uuid) {
      try {
        await teacherApi.courses.delete(courseObj.uuid);
      } catch (err) {
        console.error('Failed to delete course:', err);
      }
    }
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setDeleteCourseDialog({ isOpen: false, id: null, title: '' });
  };

  // Expanded descriptions toggle state
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const toggleDescription = (courseId, e) => {
    if (e) e.stopPropagation();
    setExpandedDescriptions(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  // Edit Course Modal state
  const [editingCourse, setEditingCourse] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    stage: 'sec',
    grade: 'الصف الثالث الثانوي',
    subject: 'الأحياء',
    price: '0',
    description: '',
    hours: '28 ساعة',
    lessonsCount: '14'
  });

  const handleOpenEditCourse = (course, e) => {
    if (e) e.stopPropagation();
    setEditingCourse(course);
    setEditForm({
      title: course.titleAr || course.title || '',
      stage: course.stageId || (course.stage === 'المرحلة الإعدادية' ? 'prep' : 'sec'),
      grade: course.gradeAr || 'الصف الثالث الثانوي',
      subject: course.subjectAr || 'الأحياء',
      price: String(course.priceEgp !== undefined && course.priceEgp !== null ? course.priceEgp : 0),
      description: course.descriptionAr || '',
      hours: course.hoursTotal || '20 ساعة',
      lessonsCount: String(course.lessonsCount || 1)
    });
  };

  const handleSaveEditCourse = async (e) => {
    e.preventDefault();
    if (!editingCourse || !editForm.title.trim()) return;

    const parsedPrice = editForm.price === '' ? 0 : Math.max(0, Number(editForm.price) || 0);

    try {
      if (editingCourse.uuid) {
        await teacherApi.courses.update(editingCourse.uuid, {
          title_ar: editForm.title.trim(),
          stage_type: editForm.stage,
          grade_ar: editForm.grade,
          price_egp: parsedPrice,
          description_ar: editForm.description.trim() || undefined,
        });
      }

      setCourses(prev => prev.map(c => {
        if (c.id === editingCourse.id) {
          return {
            ...c,
            title: editForm.title,
            titleAr: editForm.title,
            stage: editForm.stage === 'sec' ? 'المرحلة الثانوية' : 'المرحلة الإعدادية',
            stageId: editForm.stage,
            gradeAr: editForm.grade,
            subjectAr: editForm.subject,
            priceEgp: parsedPrice,
            revenueEgp: parsedPrice * (c.studentsCount || 0),
            descriptionAr: editForm.description,
            hoursTotal: editForm.hours || c.hoursTotal,
            lessonsCount: Number(editForm.lessonsCount) || c.lessonsCount
          };
        }
        return c;
      }));

      setEditingCourse(null);
    } catch (err) {
      console.error('Failed to update course:', err);
      alert(isAr ? (err.message || 'فشل تحديث بيانات الكورس') : (err.message || 'Failed to update course'));
    }
  };

  // New Course Form state
  const [newTitle, setNewTitle] = useState('');
  const [newStage, setNewStage] = useState('sec');
  const [newGrade, setNewGrade] = useState('الصف الثالث الثانوي');
  const [newPrice, setNewPrice] = useState('0');
  const [newDesc, setNewDesc] = useState('');

  const filteredCourses = courses.filter(course => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      (course.titleAr && course.titleAr.toLowerCase().includes(query)) ||
      (course.title && course.title.toLowerCase().includes(query)) ||
      (course.gradeAr && course.gradeAr.includes(query)) ||
      (course.subjectAr && course.subjectAr.includes(query))
    );
  });

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parsedNewPrice = newPrice === '' ? 0 : Math.max(0, Number(newPrice) || 0);

    try {
      const res = await teacherApi.courses.create({
        title_ar: newTitle.trim(),
        stage_type: newStage,
        grade_ar: newGrade,
        subject_ar: 'الأحياء',
        price_egp: parsedNewPrice,
        description_ar: newDesc.trim() || undefined,
        status: 'published',
      });

      const c = res.data;
      const rawPrice = c.priceEgp !== undefined && c.priceEgp !== null ? c.priceEgp : c.price_egp;
      const finalPrice = rawPrice !== undefined && rawPrice !== null && !isNaN(Number(rawPrice)) ? Number(rawPrice) : parsedNewPrice;

      const newCourseObj = {
        id: c.uuid || c.id || `course-${Date.now()}`,
        uuid: c.uuid,
        title: c.titleAr || c.title_ar || newTitle,
        titleAr: c.titleAr || c.title_ar || newTitle,
        stage: newStage === 'sec' ? 'المرحلة الثانوية' : 'المرحلة الإعدادية',
        stageId: newStage,
        gradeAr: newGrade,
        subjectAr: 'الأحياء',
        cover: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80',
        priceEgp: finalPrice,
        studentsCount: 0,
        lessonsCount: 0,
        hoursTotal: '0 ساعة',
        status: 'published',
        completionRate: 0,
        revenueEgp: 0,
        descriptionAr: newDesc || 'مقرر تعليمي جديد تم إنشاؤه عبر منصة متفوق.'
      };

      setCourses(prev => [newCourseObj, ...prev]);
      setShowCreateModal(false);
      setNewTitle('');
      setNewPrice('0');
      setNewDesc('');
    } catch (err) {
      console.error('Failed to create course:', err);
      alert(isAr ? (err.message || 'فشل إنشاء الكورس') : (err.message || 'Failed to create course'));
    }
  };

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '28px 24px 110px',
      fontFamily: 'var(--font-arabic)',
      boxSizing: 'border-box'
    }}>
      {/* ── TOP HEADER ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(0, 102, 204, 0.15)' : 'rgba(0, 102, 204, 0.08)',
              color: 'var(--primary)',
              fontSize: '11.5px',
              fontWeight: '800'
            }}>
              <BookOpen size={13} />
              <span>{isAr ? 'المناهج والمقررات الأكاديمية' : 'Curriculum & Courses'}</span>
            </span>
          </div>

          <h1 style={{
            fontSize: '22px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: 0,
            fontFamily: 'var(--font-heading), var(--font-arabic)'
          }}>
            {isAr ? 'إدارة المقررات والمناهج والدروس' : 'Course & Curriculum Management'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            {isAr 
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
            borderRadius: '10px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '800',
            border: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.92'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <Plus size={16} />
          <span>{isAr ? 'إنشاء كورس جديد' : 'New Course'}</span>
        </button>
      </div>

      {/* ── CLEAN SEARCH BAR (Stage filter buttons completely removed as requested) ── */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '14px 18px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Search Input Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '8px 14px',
          flex: 1,
          minWidth: '220px',
          maxWidth: '480px'
        }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder={isAr ? 'بحث في أسماء الكورسات والمراحل...' : 'Search courses by title or grade...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '13px',
              width: '100%',
              fontFamily: 'inherit'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 0
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Counter Badge */}
        <span style={{
          fontSize: '12px',
          fontWeight: '700',
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--bg-subtle)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          {isAr
            ? `إجمالي المقررات: ${filteredCourses.length} كورس`
            : `${filteredCourses.length} Courses available`}
        </span>
      </div>

      {/* ── COURSES GRID (Cards with NO covers, NO rating, matching platform design) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: '18px'
      }}>
        {filteredCourses.map(course => (
          <div
            key={course.id}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xs)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
            }}
          >
            <div>
              {/* Card Header: Subject Tag + Grade Tag + Price Tag (In place of image cover) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    color: 'var(--primary)',
                    border: '1px solid rgba(0, 102, 204, 0.2)'
                  }}>
                    {course.subjectAr || (isAr ? 'الأحياء' : 'Biology')}
                  </span>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {course.gradeAr}
                  </span>
                </div>

                {/* Price Tag Badge + Edit & Delete Course Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: '800',
                    padding: '3px 9px',
                    borderRadius: '6px',
                    backgroundColor: Number(course.priceEgp) === 0
                      ? (isDark ? 'rgba(16, 185, 129, 0.22)' : '#D1FAE5')
                      : (isDark ? 'rgba(16, 185, 129, 0.12)' : '#ECFDF5'),
                    color: Number(course.priceEgp) === 0 ? (isDark ? '#34D399' : '#047857') : 'var(--success)',
                    border: `1px solid ${Number(course.priceEgp) === 0 ? (isDark ? 'rgba(16, 185, 129, 0.5)' : '#6EE7B7') : (isDark ? 'rgba(16, 185, 129, 0.25)' : '#A7F3D0')}`
                  }}>
                    {Number(course.priceEgp) === 0 ? (isAr ? 'مجاني' : 'Free') : `${course.priceEgp} ${isAr ? 'ج.م / شهر' : 'EGP/mo'}`}
                  </span>

                  {/* Edit Course Button */}
                  <button
                    type="button"
                    onClick={(e) => handleOpenEditCourse(course, e)}
                    title={isAr ? 'تعديل بيانات الكورس' : 'Edit Course'}
                    style={{
                      padding: '4px 6px',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--primary)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.backgroundColor = isDark ? 'rgba(0, 102, 204, 0.15)' : 'rgba(0, 102, 204, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Edit3 size={13} />
                  </button>

                  {/* Delete Course Button */}
                  <button
                    type="button"
                    onClick={(e) => promptDeleteCourse(course.id, isAr ? (course.titleAr || course.title) : course.title, e)}
                    title={isAr ? 'حذف الكورس' : 'Delete Course'}
                    style={{
                      padding: '4px 6px',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#EF4444';
                      e.currentTarget.style.borderColor = '#FCA5A5';
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Course Title */}
              <h2 style={{
                fontSize: '15.5px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                margin: '0 0 8px',
                lineHeight: 1.4,
                fontFamily: 'var(--font-heading), var(--font-arabic)'
              }}>
                {isAr ? course.titleAr : course.title}
              </h2>

              {/* Course Description with Expand / Collapse on Click */}
              {(() => {
                const isExpanded = !!expandedDescriptions[course.id];
                return (
                  <div
                    onClick={(e) => toggleDescription(course.id, e)}
                    style={{
                      margin: '0 0 16px',
                      padding: isExpanded ? '8px 10px' : '4px 0',
                      borderRadius: '8px',
                      backgroundColor: isExpanded ? 'var(--bg-subtle)' : 'transparent',
                      border: isExpanded ? '1px dashed var(--border-subtle)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    title={isExpanded ? (isAr ? 'اضغط لتصغير الوصف' : 'Click to collapse') : (isAr ? 'اضغط لقراءة الوصف كاملاً' : 'Click to read full description')}
                  >
                    <p style={{
                      fontSize: '12px',
                      color: isExpanded ? 'var(--text-primary)' : 'var(--text-secondary)',
                      margin: 0,
                      lineHeight: 1.6,
                      ...(isExpanded ? {} : {
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }),
                      transition: 'all 0.2s ease',
                      wordBreak: 'break-word'
                    }}>
                      {course.descriptionAr}
                    </p>

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: '800',
                      color: 'var(--primary)',
                      marginTop: '4px'
                    }}>
                      {isExpanded ? (
                        <>
                          <ChevronUp size={12} />
                          <span>{isAr ? 'عرض أقل' : 'Show less'}</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown size={12} />
                          <span>{isAr ? 'عرض المزيد...' : 'Show more...'}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div>
              {/* Clean Stats Bar (Rating removed completely as requested) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                padding: '10px 8px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '900',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {course.studentsCount ? course.studentsCount.toLocaleString() : '0'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {isAr ? 'طالب مشترك' : 'Students'}
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '900',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {course.lessonsCount}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {isAr ? 'حصة مسجلة' : 'Lessons'}
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '900',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {course.hoursTotal || (isAr ? '20 ساعة' : '20 hrs')}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {isAr ? 'ساعات الشرح' : 'Total Hours'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={() => navigate('/teacher/workspace')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 102, 204, 0.08)',
                    border: '1px solid rgba(0, 102, 204, 0.22)',
                    color: 'var(--primary)',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 102, 204, 0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 102, 204, 0.08)'}
                >
                  <Layers size={13} />
                  <span>{isAr ? 'خريطة الحصص' : 'Lessons Map'}</span>
                </button>

                <button
                  onClick={() => navigate('/teacher/studio')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                >
                  <PlayCircle size={13} />
                  <span>{isAr ? 'تسجيل حصة' : 'Record'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CREATE NEW COURSE MODAL ── */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: '520px',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  {isAr ? 'إنشاء كورس أو مقرر جديد' : 'Create New Course'}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {isAr ? 'عنوان المقرر أو الكورس:' : 'Course Title:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: ماستر كلاس التنسيق الهرموني والاتزان' : 'e.g. Masterclass in Genetics'}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {isAr ? 'المرحلة الدراسية:' : 'Stage:'}
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
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="sec">{isAr ? 'المرحلة الثانوية' : 'Secondary'}</option>
                    <option value="prep">{isAr ? 'المرحلة الإعدادية' : 'Preparatory'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {isAr ? 'الصف الدراسي:' : 'Grade:'}
                  </label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                    {isAr ? 'سعر الاشتراك الشهري (ج.م):' : 'Monthly Price (EGP):'}
                  </label>
                  <label style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: Number(newPrice) === 0 ? 'var(--success)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}>
                    <input
                      type="checkbox"
                      checked={Number(newPrice) === 0}
                      onChange={(e) => setNewPrice(e.target.checked ? '0' : '350')}
                      style={{ accentColor: 'var(--success)', cursor: 'pointer', width: '15px', height: '15px' }}
                    />
                    {isAr ? 'كورس مجاني (0 ج.م)' : 'Free Course (0 EGP)'}
                  </label>
                </div>
                <input
                  type="number"
                  min="0"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder={isAr ? 'أدخل 0 لكورس مجاني' : '0 for free'}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${Number(newPrice) === 0 ? 'var(--success)' : 'var(--border-subtle)'}`,
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {Number(newPrice) === 0 && (
                  <span style={{ fontSize: '11.5px', color: 'var(--success)', fontWeight: '700', marginTop: '5px', display: 'inline-block' }}>
                    {isAr ? '✓ هذا الكورس سيكون مجانياً ومتاحاً لجميع الطلاب دون رسوم' : '✓ This course will be free for all students'}
                  </span>
                )}
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {isAr ? 'وصف المقرر ومخرجات التعلم:' : 'Description:'}
                </label>
                <textarea
                  rows="3"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder={isAr ? 'اكتب نبذة عن الكورس والوحدات التي يشملها...' : 'Brief summary of the course...'}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {isAr ? 'حفظ ونشر المقرر' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT COURSE MODAL ── */}
      {editingCourse && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingCourse(null);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(3px)'
          }}
        >
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  {isAr ? 'تعديل بيانات الكورس' : 'Edit Course Details'}
                </h3>
              </div>
              <button
                onClick={() => setEditingCourse(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditCourse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {isAr ? 'عنوان المقرر أو الكورس:' : 'Course Title:'}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {isAr ? 'المرحلة الدراسية:' : 'Stage:'}
                  </label>
                  <select
                    value={editForm.stage}
                    onChange={(e) => {
                      const nextStage = e.target.value;
                      setEditForm(prev => ({
                        ...prev,
                        stage: nextStage,
                        grade: nextStage === 'sec' ? 'الصف الثالث الثانوي' : 'الصف الثالث الإعدادي'
                      }));
                    }}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="sec">{isAr ? 'المرحلة الثانوية' : 'Secondary'}</option>
                    <option value="prep">{isAr ? 'المرحلة الإعدادية' : 'Preparatory'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {isAr ? 'الصف الدراسي:' : 'Grade:'}
                  </label>
                  <select
                    value={editForm.grade}
                    onChange={(e) => setEditForm(prev => ({ ...prev, grade: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    {editForm.stage === 'sec' ? (
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {isAr ? 'المادة الدراسية:' : 'Subject:'}
                  </label>
                  <input
                    type="text"
                    value={editForm.subject}
                    onChange={(e) => setEditForm(prev => ({ ...prev, subject: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                      {isAr ? 'السعر (ج.م):' : 'Price (EGP):'}
                    </label>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: Number(editForm.price) === 0 ? 'var(--success)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}>
                      <input
                        type="checkbox"
                        checked={Number(editForm.price) === 0}
                        onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.checked ? '0' : '350' }))}
                        style={{ accentColor: 'var(--success)', cursor: 'pointer', width: '14px', height: '14px' }}
                      />
                      {isAr ? 'مجاني (0)' : 'Free (0)'}
                    </label>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={editForm.price}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder={isAr ? 'أدخل 0 لكورس مجاني' : '0 for free'}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${Number(editForm.price) === 0 ? 'var(--success)' : 'var(--border-subtle)'}`,
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  {Number(editForm.price) === 0 && (
                    <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '700', marginTop: '4px', display: 'inline-block' }}>
                      {isAr ? '✓ كورس مجاني' : '✓ Free Course'}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {isAr ? 'عدد الحصص المسجلة:' : 'Lessons Count:'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.lessonsCount}
                    onChange={(e) => setEditForm(prev => ({ ...prev, lessonsCount: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {isAr ? 'إجمالي ساعات الشرح:' : 'Total Hours:'}
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 28 ساعة"
                    value={editForm.hours}
                    onChange={(e) => setEditForm(prev => ({ ...prev, hours: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {isAr ? 'وصف المقرر ومخرجات التعلم:' : 'Description:'}
                </label>
                <textarea
                  rows="4"
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={isAr ? 'اكتب نبذة عن الكورس والوحدات التي يشملها...' : 'Brief summary of the course...'}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {isAr ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE COURSE MODAL ── */}
      {deleteCourseDialog.isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '380px',
            padding: '22px',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              color: '#EF4444'
            }}>
              <AlertTriangle size={22} />
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>
              {isAr ? 'تأكيد حذف المقرر الدراسي' : 'Confirm Delete Course'}
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.5 }}>
              {isAr
                ? `هل أنت متأكد من رغبتك في حذف مقرر "${deleteCourseDialog.title}"؟ سيتم إزالته من قائمة الكورسات نهائياً.`
                : `Are you sure you want to delete course "${deleteCourseDialog.title}"?`}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteCourseDialog({ isOpen: false, id: null, title: '' })}
                style={{
                  padding: '9px',
                  borderRadius: '7px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteCourse}
                style={{
                  padding: '9px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                }}
              >
                {isAr ? 'نعم، حذف الكورس' : 'Delete Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCoursesView;
