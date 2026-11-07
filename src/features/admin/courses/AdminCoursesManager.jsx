import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { MOCK_ADMIN_COURSES } from '../../../data/mockAdminData';
import {
  BookOpen,
  Search,
  Star,
  Users,
  CheckCircle,
  Eye,
  EyeOff,
  Plus,
  Sparkles,
  Layers,
  GraduationCap,
  Clock,
  ShieldAlert,
  X
} from 'lucide-react';

export const AdminCoursesManager = () => {
  const { lang, isRtl } = useLanguage();
  const [courses, setCourses] = useState(MOCK_ADMIN_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTogglePublish = (id) => {
    setCourses(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'published' ? 'review' : 'published';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
    showToast(lang === 'ar' ? 'تم تحديث حالة نشر المقرر التعليمي' : 'Course publish status updated');
  };

  const handleToggleFeatured = (id) => {
    setCourses(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, isFeatured: !c.isFeatured };
      }
      return c;
    }));
    showToast(lang === 'ar' ? 'تم تحديث ظهور المقرر في متجر المنصة الرئيسي' : 'Featured status updated');
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = stageFilter === 'all' || c.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: isRtl ? '24px' : 'auto',
          right: isRtl ? 'auto' : '24px',
          backgroundColor: 'var(--color-brand-dark)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: '600'
        }}>
          <CheckCircle size={18} color="var(--primary-light)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Search */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 260px', maxWidth: '380px' }}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث باسم المقرر، المادة، أو اسم المعلم...' : 'Search course, subject, or teacher...'}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px'
            }}
          />
        </div>

        {/* Stage Filter */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', labelAr: 'كل المراحل', labelEn: 'All Stages' },
            { id: 'الصف الثالث الثانوي', labelAr: 'الصف الثالث الثانوي', labelEn: '3rd Secondary' },
            { id: 'الصف الثاني الثانوي', labelAr: 'الصف الثاني الثانوي', labelEn: '2nd Secondary' },
            { id: 'الصف الأول الثانوي', labelAr: 'الصف الأول الثانوي', labelEn: '1st Secondary' }
          ].map(stage => {
            const isSelected = stageFilter === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setStageFilter(stage.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                  color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: isSelected ? '700' : '500',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? stage.labelAr : stage.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '18px' }}>
        {filteredCourses.map(course => {
          const isPublished = course.status === 'published';
          return (
            <div
              key={course.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '18px',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(21, 136, 199, 0.1)',
                    color: 'var(--primary)',
                    fontSize: '11px',
                    fontWeight: '700',
                    marginBottom: '6px'
                  }}>
                    {(lang === 'ar' ? (course.stageAr || course.stage) : (course.stageEn || course.stage))} • {(lang === 'ar' ? (course.subjectAr || course.subject) : (course.subjectEn || course.subject))}
                  </span>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                    {lang === 'ar' ? (course.titleAr || course.title) : (course.titleEn || course.title)}
                  </h3>
                </div>

                <span style={{
                  padding: '4px 8px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '700',
                  backgroundColor: isPublished ? 'rgba(21, 136, 199, 0.12)' : 'rgba(92, 182, 219, 0.15)',
                  color: isPublished ? 'var(--primary)' : 'var(--text-secondary)'
                }}>
                  {isPublished ? (lang === 'ar' ? 'منشور' : 'Published') : (lang === 'ar' ? 'قيد المراجعة' : 'Review')}
                </span>
              </div>

              {/* Instructor & Lectures */}
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'المعلم: ' : 'Instructor: '}{lang === 'ar' ? (course.instructorAr || course.instructor) : (course.instructorEn || course.instructor)}
                </span>
                <span>{course.totalLectures} {lang === 'ar' ? 'حصة ومحاضرة' : 'Lectures'}</span>
              </div>

              {/* Metrics */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontWeight: '700' }}>
                  <Users size={14} color="var(--primary)" />
                  <span>{course.enrolled} {lang === 'ar' ? 'طالب مسجل' : 'Students'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EAB308', fontWeight: '700' }}>
                  <Star size={14} fill="#EAB308" />
                  <span>{course.rating}</span>
                </div>
                <div style={{ fontWeight: '800', color: 'var(--primary)' }}>
                  {course.priceEgp} {lang === 'ar' ? 'ج.م / شهر' : 'EGP / month'}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <button
                  onClick={() => handleToggleFeatured(course.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: course.isFeatured ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: course.isFeatured ? 'rgba(21, 136, 199, 0.1)' : 'transparent',
                    color: course.isFeatured ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <Sparkles size={13} />
                  <span>{course.isFeatured ? (lang === 'ar' ? 'مميز في المتجر' : 'Featured') : (lang === 'ar' ? 'تمييز في المتجر' : 'Feature')}</span>
                </button>

                <button
                  onClick={() => handleTogglePublish(course.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'transparent',
                    color: isPublished ? 'var(--color-danger)' : 'var(--color-success)',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {isPublished ? (lang === 'ar' ? 'إلغاء النشر' : 'Unpublish') : (lang === 'ar' ? 'اعتماد ونشر' : 'Publish')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

