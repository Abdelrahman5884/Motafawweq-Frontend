import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Search, 
  Star, 
  MapPin, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Filter
} from 'lucide-react';

export const MarketplacePage = () => {
  const { navigate, switchRole } = useAuth();
  const { lang, isRtl } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const teachers = [
    {
      id: 'tch-salma',
      name: 'Dr. Salma El-Sayed',
      nameAr: 'د. سلمى السيد',
      subject: 'Biology',
      subjectAr: 'الأحياء - الثانوية العامة',
      grade: '3rd Secondary',
      gradeAr: 'الصف الثالث الثانوي',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      rating: 4.96,
      reviewsCount: 420,
      studentsCount: 3840,
      city: 'Cairo & Giza (Dokki)',
      cityAr: 'القاهرة والجيزة (الدقي والمهندسين)',
      priceEgp: 250,
      tag: lang === 'ar' ? 'الأعلى تقييماً في الأحياء' : 'Top Rated Biology Tutor',
      featured: true,
      hasDemoLesson: true
    },
    {
      id: 'tch-hany',
      name: 'Dr. Hany El-Shennawy',
      nameAr: 'د. هاني الشناوي',
      subject: 'Physics',
      subjectAr: 'الفيزياء الحديثة والكلاسيكية',
      grade: '3rd Secondary',
      gradeAr: 'الصف الثالث الثانوي',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 4.92,
      reviewsCount: 380,
      studentsCount: 2950,
      city: 'Alexandria (Smouha)',
      cityAr: 'الإسكندرية (سموحة ولوران)',
      priceEgp: 280,
      tag: lang === 'ar' ? 'مؤلف سلسلة العملاق' : 'Renowned Physics Lecturer'
    },
    {
      id: 'tch-rady',
      name: 'Mr. Mahmoud Rady',
      nameAr: 'أ. محمود راضي',
      subject: 'Chemistry',
      subjectAr: 'الكيمياء العضوية والكهربية',
      grade: '3rd Secondary',
      gradeAr: 'الصف الثالث الثانوي',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 4.88,
      reviewsCount: 290,
      studentsCount: 2150,
      city: 'Nasr City & Heliopolis',
      cityAr: 'مدينة نصر ومصر الجديدة',
      priceEgp: 240,
      tag: lang === 'ar' ? 'خبير الكيمياء العضوية' : 'Organic Chemistry Specialist'
    },
    {
      id: 'tch-adel',
      name: 'Eng. Ahmed Adel',
      nameAr: 'م. أحمد عادل',
      subject: 'Pure & Applied Math',
      subjectAr: 'الرياضيات البحتة والتطبيقية',
      grade: '2nd & 3rd Secondary',
      gradeAr: 'الصف الثاني والثالث الثانوي',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      rating: 4.94,
      reviewsCount: 310,
      studentsCount: 1980,
      city: 'Mansoura & Online',
      cityAr: 'المنصورة وسناتر الأونلاين',
      priceEgp: 220,
      tag: lang === 'ar' ? 'حلول ذكية للتفاضل والتكامل' : 'Calculus Master'
    }
  ];

  const filteredTeachers = teachers.filter(tch => {
    const matchesSubject = selectedSubject === 'all' || tch.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesQuery = !searchQuery || 
      tch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tch.nameAr.includes(searchQuery) ||
      tch.subjectAr.includes(searchQuery);
    return matchesSubject && matchesQuery;
  });

  return (
    <div style={{
      maxWidth: 'var(--max-content-width)',
      margin: '0 auto',
      padding: '50px 24px 100px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
        }}>
          {lang === 'ar' ? 'سوق نخبة معلمي الثانوية العامة 🇪🇬' : 'Top Verified Egyptian Tutors'}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          {lang === 'ar' 
            ? 'تصفح كبار المعلمين المعتمدين، جرب عينة من خرائطهم المعرفية وحصصهم المسجلة، وانضم لمجموعاتهم حضورياً أو أونلاين.'
            : 'Explore top teachers, preview their interactive lesson knowledge maps, and book seats in halls or online.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '32px',
        backgroundColor: 'var(--bg-surface-elevated)',
        padding: '16px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-medium)'
      }}>
        {/* Search */}
        <div style={{
          flex: 1,
          minWidth: '220px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-subtle)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'ابحث باسم المدرس، المادة، أو المحافظة...' : 'Search by tutor name, subject, or city...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '13px',
              color: 'var(--text-primary)',
              width: '100%',
              fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-latin)'
            }}
          />
        </div>

        {/* Subject Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {[
            { id: 'all', label: lang === 'ar' ? 'جميع المواد' : 'All Subjects' },
            { id: 'biology', label: lang === 'ar' ? 'أحياء' : 'Biology' },
            { id: 'physics', label: lang === 'ar' ? 'فيزياء' : 'Physics' },
            { id: 'chemistry', label: lang === 'ar' ? 'كيمياء' : 'Chemistry' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setSelectedSubject(btn.id)}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: selectedSubject === btn.id ? 'var(--primary)' : 'var(--bg-subtle)',
                color: selectedSubject === btn.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {filteredTeachers.map(tch => (
          <div
            key={tch.id}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: tch.featured ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div>
              {/* Avatar & Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <img
                  src={tch.avatar}
                  alt={tch.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--primary-light)'
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      {lang === 'ar' ? tch.nameAr : tch.name}
                    </h3>
                    <CheckCircle2 size={16} color="var(--primary)" />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', marginTop: '2px' }}>
                    {lang === 'ar' ? tch.subjectAr : tch.subject}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {lang === 'ar' ? tch.gradeAr : tch.grade}
                  </div>
                </div>
              </div>

              {/* Tag pill */}
              <div style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                fontSize: '11px',
                fontWeight: '700',
                marginBottom: '16px'
              }}>
                {tch.tag}
              </div>

              {/* Key Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{tch.rating}</span>
                  <span>({tch.reviewsCount} {lang === 'ar' ? 'تقييم طالب' : 'reviews'})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={14} color="var(--text-muted)" />
                  <span>{tch.studentsCount.toLocaleString()} {lang === 'ar' ? 'طالب مسجل' : 'students enrolled'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="var(--text-muted)" />
                  <span>{lang === 'ar' ? tch.cityAr : tch.city}</span>
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div style={{
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  {lang === 'ar' ? 'الاشتراك الشهري' : 'Monthly Fee'}
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {tch.priceEgp} <span style={{ fontSize: '12px', fontWeight: '600' }}>{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  switchRole('teacher');
                  navigate('lesson-workspace');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <span>{lang === 'ar' ? 'معاينة الحصص' : 'Preview Lessons'}</span>
                <ArrowRight size={13} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
