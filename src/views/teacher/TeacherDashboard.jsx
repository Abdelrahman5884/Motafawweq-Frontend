import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON, MOCK_CLASSES, MOCK_TEACHER_EARNINGS } from '../../data/mockData';
import { 
  Sparkles, 
  Mic, 
  Users, 
  DollarSign, 
  BookOpen, 
  ArrowRight, 
  Play, 
  Calendar, 
  Share2, 
  Award,
  Clock
} from 'lucide-react';

export const TeacherDashboard = () => {
  const { navigate, currentUser } = useAuth();
  const { lang, isRtl } = useLanguage();

  const lessons = [
    MOCK_LESSON,
    {
      id: 'les-bio-302',
      title: 'Cellular Respiration & Krebs Cycle',
      titleAr: 'التنفس الخلوي الهوائي ودورة كريبس',
      subjectAr: 'الأحياء - الثانوية العامة',
      durationFormatted: '54:10',
      recordedDate: '2026-09-08',
      stats: { conceptsCount: 16, completionRate: 91, avgQuizScore: 82.0 }
    },
    {
      id: 'les-bio-303',
      title: 'Molecular Genetics & DNA Replication',
      titleAr: 'البيولوجيا الجزيئية وتضاعف الحمض النووي DNA',
      subjectAr: 'الأحياء - الثانوية العامة',
      durationFormatted: '1:12:00',
      recordedDate: '2026-09-02',
      stats: { conceptsCount: 22, completionRate: 78, avgQuizScore: 79.5 }
    }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '36px 24px 80px'
    }}>
      {/* Top Welcome Banner */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--primary-light)'
            }}
          />
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
              {lang === 'ar' ? `مرحباً بكِ، ${currentUser.nameAr}` : `Welcome back, ${currentUser.name}`}
            </h1>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? currentUser.roleLabelAr : currentUser.roleLabel} • {currentUser.center}
            </div>
          </div>
        </div>

        {/* Studio CTA Button */}
        <button
          onClick={() => navigate('recording-studio')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 24px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(108, 77, 255, 0.35)',
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Mic size={18} />
          <span>{lang === 'ar' ? '+ تسجيل حصة جديدة' : '+ Record New Lesson'}</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px',
        marginBottom: '36px'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600' }}>{lang === 'ar' ? 'إجمالي الأرباح (سبتمبر)' : 'Monthly Revenue'}</span>
            <DollarSign size={18} color="#10B981" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            {MOCK_TEACHER_EARNINGS.totalRevenueEgp.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: '600' }}>{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#10B981', fontWeight: '600', marginTop: '4px' }}>
            +18.4% {lang === 'ar' ? 'عن الشهر الماضي' : 'vs last month'}
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600' }}>{lang === 'ar' ? 'إجمالي الطلاب المسجلين' : 'Total Students'}</span>
            <Users size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            3,840
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {lang === 'ar' ? 'في 3 سناتر ومجموعات الأونلاين' : 'Across 3 centers & online'}
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600' }}>{lang === 'ar' ? 'رصيد الذكاء الاصطناعي' : 'AI Minutes Quota'}</span>
            <Sparkles size={18} color="#06B6D4" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            184 <span style={{ fontSize: '14px', fontWeight: '600' }}>/ 300 {lang === 'ar' ? 'دقيقة' : 'min'}</span>
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--primary)', fontWeight: '600', marginTop: '4px' }}>
            {lang === 'ar' ? 'باقة المعلم المحترف نشطة' : 'Teacher Pro Active'}
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600' }}>{lang === 'ar' ? 'متوسط استيعاب الدفعة' : 'Class Mastery Avg'}</span>
            <Award size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#F59E0B', fontFamily: 'var(--font-heading)' }}>
            84.5%
          </div>
          <div style={{ fontSize: '11.5px', color: '#10B981', fontWeight: '600', marginTop: '4px' }}>
            {lang === 'ar' ? 'أعلى من متوسط المحافظة (76%)' : 'Above state avg (76%)'}
          </div>
        </div>
      </div>

      {/* Main Grid: Lessons & Groups */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        {/* Left Column: Recent Processed Lessons */}
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'الحصص المعالجة مؤخراً' : 'Recent Processed Lessons'}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {lessons.length} {lang === 'ar' ? 'حصص نشطة' : 'Lessons'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {lessons.map(les => (
              <div
                key={les.id}
                onClick={() => navigate('lesson-workspace', { lessonId: les.id })}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease, background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? les.titleAr : les.title}
                  </span>
                  <ArrowRight size={15} color="var(--primary)" style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} color="var(--text-muted)" />
                    <span>{les.durationFormatted}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Share2 size={13} color="var(--primary)" />
                    <span>{les.stats.conceptsCount} {lang === 'ar' ? 'مفهوم' : 'concepts'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Award size={13} color="#10B981" />
                    <span>{les.stats.completionRate}% {lang === 'ar' ? 'إكمال' : 'completion'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Groups & Classes */}
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'المجموعات والقاعات النشطة' : 'Active Classes & Cohorts'}
            </h3>
            <button
              onClick={() => navigate('classes')}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {lang === 'ar' ? 'عرض الكل' : 'View All'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MOCK_CLASSES.map(cls => (
              <div
                key={cls.id}
                onClick={() => navigate('classes')}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? cls.nameAr : cls.name}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--primary-surface)',
                    color: 'var(--primary)'
                  }}>
                    {cls.joinCode}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span>{lang === 'ar' ? cls.scheduleAr : cls.schedule}</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {cls.enrolledStudents} / {cls.capacity} {lang === 'ar' ? 'طالب' : 'students'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
