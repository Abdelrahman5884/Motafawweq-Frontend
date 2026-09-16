import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON } from '../../data/mockData';
import { 
  Flame, 
  Award, 
  BookOpen, 
  Sparkles, 
  Clock, 
  Play, 
  ArrowRight, 
  AlertTriangle,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const StudentDashboard = () => {
  const { navigate, currentUser } = useAuth();
  const { lang, isRtl } = useLanguage();

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '36px 24px 80px'
    }}>
      {/* Top Banner with Streak & XP */}
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
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #06B6D4'
            }}
          />
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
              {lang === 'ar' ? `أهلاً بك، يا بطل! 👋` : `Welcome, Omar! 👋`}
            </h1>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? currentUser.roleLabelAr : currentUser.roleLabel} • {currentUser.center}
            </div>
          </div>
        </div>

        {/* Gamification Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Streak Counter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A'
          }}>
            <Flame size={20} color="#F59E0B" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '900', color: '#B45309', lineHeight: 1 }}>
                14 {lang === 'ar' ? 'يوماً متتالياً' : 'Days'}
              </div>
              <div style={{ fontSize: '10px', color: '#D97706', fontWeight: '700' }}>
                {lang === 'ar' ? 'حماسك مشتعل 🔥' : 'On Fire 🔥'}
              </div>
            </div>
          </div>

          {/* XP Points */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-surface)',
            border: '1px solid var(--primary-light)'
          }}>
            <Award size={20} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--primary)', lineHeight: 1 }}>
                2,450 XP
              </div>
              <div style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '700' }}>
                {lang === 'ar' ? 'المستوى 8 (متفوق)' : 'Level 8 (Scholar)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent AI Weak Area Alert */}
      <div style={{
        backgroundColor: '#FEF2F2',
        border: '1.5px solid #FCA5A5',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 22px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#EF4444'
          }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#991B1B' }}>
              {lang === 'ar' ? 'تنبيه ذكاء اصطناعي: نقطة تحتاج مراجعة قبل امتحان الأحد' : 'AI Alert: Concept Needs Quick Review'}
            </div>
            <div style={{ fontSize: '12.5px', color: '#7F1D1D', marginTop: '2px' }}>
              {lang === 'ar'
                ? 'نسبة استيعابك في "مركبا الطاقة التثبيتية NADPH و ATP" هي 64%. استمع إلى 3 دقائق شرح وحل 5 أسئلة.'
                : 'Your mastery in "NADPH & ATP Synthesis" is 64%. Review 3 minutes of lecture audio.'}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('weak-areas')}
          style={{
            padding: '9px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
          }}
        >
          {lang === 'ar' ? 'حل التدريب المركز (5 أسئلة)' : 'Review Concept'}
        </button>
      </div>

      {/* Continue Learning Card (Flagship Lesson) */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1.5px solid var(--primary)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        marginBottom: '32px',
        boxShadow: '0 8px 24px rgba(108, 77, 255, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)'
            }}>
              {lang === 'ar' ? 'متابعة المذاكرة' : 'Continue Studying'}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              • {lang === 'ar' ? 'د. سلمى السيد' : 'Dr. Salma'}
            </span>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            {lang === 'ar' ? MOCK_LESSON.titleAr : MOCK_LESSON.title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <span>{lang === 'ar' ? 'وصلت إلى دقيقة: 05:20 (التفاعلات الضوئية)' : 'Left off at 05:20 (Light Reactions)'}</span>
            <span>• 14 {lang === 'ar' ? 'مفهوماً' : 'concepts'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('lesson-study')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(108, 77, 255, 0.35)'
            }}
          >
            <Play size={16} fill="#FFFFFF" />
            <span>{lang === 'ar' ? 'استكمال المذاكرة وسماع الشرح' : 'Resume Lesson Room'}</span>
          </button>

          <button
            onClick={() => navigate('take-exam')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 20px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={16} color="var(--primary)" />
            <span>{lang === 'ar' ? 'بدء الامتحان' : 'Take Exam'}</span>
          </button>
        </div>
      </div>

      {/* Enrolled Courses & Upcoming Sessions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
            {lang === 'ar' ? 'مجموعاتي الدراسية المسجل بها' : 'My Enrolled Classes'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'الأحياء - سنتر الدقي (قاعة النخبة)' : 'Biology - Dokki Elite Hall'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', marginTop: '2px' }}>
                {lang === 'ar' ? 'د. سلمى السيد • الأحد 4:00 عصراً' : 'Dr. Salma • Sun 4:00 PM'}
              </div>
            </div>

            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'الفيزياء الحديثة - سنتر مدينة نصر' : 'Physics - Nasr City Hall'}
              </div>
              <div style={{ fontSize: '12px', color: '#06B6D4', fontWeight: '600', marginTop: '2px' }}>
                {lang === 'ar' ? 'د. هاني الشناوي • الثلاثاء 6:00 مساءً' : 'Dr. Hany • Tue 6:00 PM'}
              </div>
            </div>
          </div>
        </div>

        {/* Next Exams */}
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
            {lang === 'ar' ? 'الامتحانات الأسبوعية القادمة' : 'Upcoming Weekly Exams'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'امتحان البناء الضوئي الشامل' : 'Photosynthesis Comprehensive Test'}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  {lang === 'ar' ? '15 سؤالاً • 25 دقيقة • إلكتروني' : '15 Qs • 25 Mins • Online'}
                </div>
              </div>
              <button
                onClick={() => navigate('take-exam')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'ابدأ الآن' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
