import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { SUBJECTS_LIST, COURSES_CATALOG } from '../../data/studentData';
import confetti from 'canvas-confetti';
import {
  Search,
  BookOpen,
  Star,
  Clock,
  CheckCircle2,
  Play,
  FileText,
  X,
  Users
} from 'lucide-react';
import {
  SPage,
  SPageHeader,
  SCard,
  SBadge,
  SProgress,
  SButton,
  SEmptyState,
  SDivider,
  S
} from '../../components/student/ui';

export const StudentCoursesView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();

  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const initial = {};
    COURSES_CATALOG.forEach(c => { if (c.isEnrolled) initial[c.id] = true; });
    return initial;
  });
  const [enrollToast, setEnrollToast] = useState(null);

  const filteredCourses = COURSES_CATALOG.filter(c => {
    const matchesSubject = selectedSubject === 'all' || c.subjectId === selectedSubject;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query ||
      c.titleAr.toLowerCase().includes(query) ||
      c.teacher.nameAr.toLowerCase().includes(query) ||
      c.subjectAr.toLowerCase().includes(query);
    return matchesSubject && matchesSearch;
  });

  const handleEnroll = (course) => {
    setEnrolledCourses(prev => ({ ...prev, [course.id]: true }));
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setEnrollToast(course.subjectAr);
    setTimeout(() => setEnrollToast(null), 3500);
    if (selectedCourseModal?.id === course.id) {
      setSelectedCourseModal(prev => ({ ...prev, isEnrolled: true }));
    }
  };

  return (
    <SPage>
      {/* Toast */}
      {enrollToast && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: S.success, color: '#fff',
          padding: '11px 20px', borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(20,184,122,0.3)',
          zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '13px', fontWeight: '600', fontFamily: 'var(--font-arabic)'
        }}>
          <CheckCircle2 size={16} />
          {lang === 'ar' ? `تم التسجيل في ${enrollToast}` : 'Enrolled successfully'}
        </div>
      )}

      {/* Page header */}
      <SPageHeader
        title={lang === 'ar' ? 'حصصي والكورسات' : 'My Courses'}
        subtitle={lang === 'ar' ? 'تصفح المواد الدراسية وتابع تقدمك' : 'Browse subjects and track your progress'}
      />

      {/* Search + Filters */}
      <div style={{ marginBottom: '20px' }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px', padding: '8px 14px',
          marginBottom: '14px', maxWidth: '400px'
        }}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'ابحث بالمادة أو اسم المعلم...' : 'Search by subject or teacher...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              border: 'none', background: 'transparent', outline: 'none',
              color: 'var(--text-primary)', fontSize: '13px', width: '100%',
              fontFamily: 'var(--font-arabic)'
            }}
          />
          {searchQuery && (
            <X size={14} color="var(--text-secondary)" style={{ cursor: 'pointer', flexShrink: 0 }}
              onClick={() => setSearchQuery('')} />
          )}
        </div>

        {/* Subject filter chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => setSelectedSubject('all')}
            style={{
              padding: '6px 14px', borderRadius: '99px',
              border: `1px solid ${selectedSubject === 'all' ? S.primary : 'var(--border-subtle)'}`,
              backgroundColor: selectedSubject === 'all' ? S.primary : 'var(--bg-surface)',
              color: selectedSubject === 'all' ? '#fff' : 'var(--text-secondary)',
              fontSize: '12px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.15s ease', fontFamily: 'var(--font-arabic)'
            }}
          >
            {lang === 'ar' ? 'جميع المواد' : 'All Subjects'}
          </button>
          {SUBJECTS_LIST.map(sub => {
            const isSelected = selectedSubject === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id)}
                style={{
                  padding: '6px 14px', borderRadius: '99px',
                  border: `1px solid ${isSelected ? sub.color : 'var(--border-subtle)'}`,
                  backgroundColor: isSelected ? `${sub.color}18` : 'var(--bg-surface)',
                  color: isSelected ? sub.color : 'var(--text-secondary)',
                  fontSize: '12px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease', fontFamily: 'var(--font-arabic)'
                }}
              >
                {sub.nameAr}
              </button>
            );
          })}
        </div>
      </div>

      {/* Count */}
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', fontFamily: 'var(--font-arabic)' }}>
        {filteredCourses.length} {lang === 'ar' ? 'كورس' : 'courses'}
      </div>

      {/* Course grid */}
      {filteredCourses.length === 0 ? (
        <SEmptyState
          icon={<BookOpen size={22} />}
          title={lang === 'ar' ? 'لا توجد كورسات مطابقة' : 'No courses found'}
          description={lang === 'ar' ? 'جرب تغيير المادة أو كلمة البحث' : 'Try changing the subject or search term'}
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {filteredCourses.map(course => {
            const isEnrolled = !!enrolledCourses[course.id];
            return (
              <SCard key={course.id} padding={0} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {/* Cover */}
                <div style={{ position: 'relative', height: '150px', overflow: 'hidden' }}>
                  <img src={course.cover} alt={course.titleAr}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)'
                  }} />
                  {/* Subject badge */}
                  <span style={{
                    position: 'absolute', top: '10px',
                    right: isRtl ? '10px' : 'auto', left: isRtl ? 'auto' : '10px',
                    backgroundColor: 'rgba(0,0,0,0.65)', color: '#fff',
                    fontSize: '11px', fontWeight: '500', padding: '3px 8px', borderRadius: '6px',
                    fontFamily: 'var(--font-arabic)'
                  }}>
                    {course.subjectAr}
                  </span>
                  {/* Enrolled badge */}
                  {isEnrolled && (
                    <span style={{
                      position: 'absolute', top: '10px',
                      left: isRtl ? '10px' : 'auto', right: isRtl ? 'auto' : '10px',
                      backgroundColor: S.success, color: '#fff',
                      fontSize: '11px', fontWeight: '500', padding: '3px 8px', borderRadius: '6px',
                      display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-arabic)'
                    }}>
                      <CheckCircle2 size={11} />
                      {lang === 'ar' ? 'مسجل' : 'Enrolled'}
                    </span>
                  )}
                  {/* Teacher on cover */}
                  <div style={{
                    position: 'absolute', bottom: '8px',
                    right: isRtl ? '12px' : 'auto', left: isRtl ? 'auto' : '12px',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    <img src={course.teacher.avatar} alt={course.teacher.nameAr}
                      style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #fff' }} />
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#fff', fontFamily: 'var(--font-arabic)' }}>
                      {course.teacher.nameAr}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{
                    fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)',
                    lineHeight: 1.4, fontFamily: 'var(--font-arabic)'
                  }}>
                    {course.titleAr}
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <BookOpen size={12} /> {course.lessonsCount} {lang === 'ar' ? 'حصة' : 'lessons'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={12} fill="#F5A623" color="#F5A623" /> {course.rating}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Users size={12} /> {course.teacher.studentsCount.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress if enrolled */}
                  {isEnrolled && course.progressPercent > 0 && (
                    <SProgress value={course.progressPercent} showPercent height={4} color={S.success} />
                  )}

                  {/* Footer */}
                  <SDivider style={{ marginTop: 'auto' }} />
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', paddingTop: '4px'
                  }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {course.priceEgp} <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '400' }}>
                        {lang === 'ar' ? 'ج.م' : 'EGP'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <SButton size="sm" variant="ghost" onClick={() => setSelectedCourseModal(course)}>
                        {lang === 'ar' ? 'تفاصيل' : 'Details'}
                      </SButton>
                      {isEnrolled ? (
                        <SButton size="sm" icon={<Play size={13} fill="#fff" />} onClick={() => navigate('/student/lesson')}>
                          {lang === 'ar' ? 'متابعة' : 'Resume'}
                        </SButton>
                      ) : (
                        <SButton size="sm" variant="success" onClick={() => handleEnroll(course)}>
                          {lang === 'ar' ? 'تسجيل' : 'Enroll'}
                        </SButton>
                      )}
                    </div>
                  </div>
                </div>
              </SCard>
            );
          })}
        </div>
      )}

      {/* Course Details Modal */}
      {selectedCourseModal && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)', borderRadius: '20px',
            maxWidth: '600px', width: '100%', maxHeight: '88vh', overflowY: 'auto',
            padding: '24px', position: 'relative',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <button
              onClick={() => setSelectedCourseModal(null)}
              style={{
                position: 'absolute', top: '16px',
                left: isRtl ? '16px' : 'auto', right: isRtl ? 'auto' : '16px',
                width: '30px', height: '30px', borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)'
              }}
            >
              <X size={15} />
            </button>

            <SBadge variant="primary" size="xs" style={{ marginBottom: '8px' }}>
              {selectedCourseModal.subjectAr}
            </SBadge>
            <h2 style={{
              fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)',
              margin: '8px 0 16px', lineHeight: 1.4, fontFamily: 'var(--font-arabic)'
            }}>
              {selectedCourseModal.titleAr}
            </h2>

            {/* Teacher */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 14px', borderRadius: '10px',
              backgroundColor: 'var(--bg-subtle)', marginBottom: '16px'
            }}>
              <img src={selectedCourseModal.teacher.avatar} alt=""
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-arabic)' }}>
                  {selectedCourseModal.teacher.nameAr}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'var(--font-arabic)' }}>
                  {selectedCourseModal.teacher.titleAr}
                </div>
                <div style={{ fontSize: '11px', color: '#F5A623', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={11} fill="#F5A623" color="#F5A623" />
                  {selectedCourseModal.teacher.rating} · {selectedCourseModal.teacher.studentsCount.toLocaleString()} {lang === 'ar' ? 'طالب' : 'students'}
                </div>
              </div>
            </div>

            <p style={{
              fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7,
              marginBottom: '16px', fontFamily: 'var(--font-arabic)'
            }}>
              {selectedCourseModal.descriptionAr}
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              {[
                { icon: <BookOpen size={14} />, text: `${selectedCourseModal.lessonsCount} ${lang === 'ar' ? 'حصة' : 'lessons'}` },
                { icon: <FileText size={14} />, text: `${selectedCourseModal.attachmentsCount} ${lang === 'ar' ? 'ملف مرفق' : 'files'}` },
                { icon: <Clock size={14} />, text: selectedCourseModal.durationHours },
                { icon: <Star size={14} color="#F5A623" fill="#F5A623" />, text: `${selectedCourseModal.rating} (${selectedCourseModal.reviewsCount})` },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 12px', borderRadius: '8px',
                  backgroundColor: 'var(--bg-subtle)',
                  fontSize: '12px', color: 'var(--text-primary)',
                  fontFamily: 'var(--font-arabic)'
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            <SDivider style={{ marginBottom: '16px' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'سعر الكورس' : 'Course price'}</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {selectedCourseModal.priceEgp} <span style={{ fontSize: '12px', fontWeight: '400' }}>{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                </div>
              </div>
              {enrolledCourses[selectedCourseModal.id] ? (
                <SButton icon={<Play size={15} fill="#fff" />} onClick={() => { setSelectedCourseModal(null); navigate('/student/lesson'); }}>
                  {lang === 'ar' ? 'الدخول للحصة' : 'Go to Lesson'}
                </SButton>
              ) : (
                <SButton variant="success" onClick={() => handleEnroll(selectedCourseModal)}>
                  {lang === 'ar' ? 'التسجيل في الكورس' : 'Enroll Now'}
                </SButton>
              )}
            </div>
          </div>
        </div>
      )}
    </SPage>
  );
};
