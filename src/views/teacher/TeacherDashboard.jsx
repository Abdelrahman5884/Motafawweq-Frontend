import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_LESSON } from '../../data/mockData';
import {
  TeacherWelcomeBanner,
  TeacherStatCards,
  RecentProcessedLessons,
  ActiveClassesList
} from '../../features/teacher/dashboard';
import {
  BookOpen,
  ClipboardList,
  FileText,
  Trophy,
  TrendingUp,
  Award,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

export const TeacherDashboard = () => {
  const { navigate, currentUser } = useAuth();
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

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

  const quickNavCards = [
    {
      id: 'courses',
      titleAr: 'المقررات والمناهج',
      titleEn: 'Courses & Curriculum',
      descAr: '4 مقررات نشطة • 4,120 طالباً',
      descEn: '4 active courses • 4,120 enrolled',
      icon: BookOpen,
      color: '#0066CC',
      bgColor: 'rgba(0, 102, 204, 0.1)',
      target: 'teacher-courses'
    },
    {
      id: 'exams',
      titleAr: 'بنك الأسئلة والامتحانات',
      titleEn: 'Question Bank & Exams',
      descAr: '320 سؤالاً • بابل شيت والـ AI',
      descEn: '320 items • Bubble sheets & AI',
      icon: ClipboardList,
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      target: 'teacher-exams'
    },
    {
      id: 'homework',
      titleAr: 'تصحيح الواجبات',
      titleEn: 'Homework & Grading',
      descAr: '470 تسليماً بانتظار التقييم',
      descEn: '470 submissions pending review',
      icon: FileText,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      target: 'teacher-homework'
    },
    {
      id: 'league',
      titleAr: 'دوري الكورس والتحدي',
      titleEn: 'Course League Arena',
      descAr: 'الموسم 2026 • الجولة 4',
      descEn: 'Season 2026 • Round 4',
      icon: Trophy,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      target: 'teacher-league'
    },
    {
      id: 'analytics',
      titleAr: 'التحليلات وتشخيص الضعف',
      titleEn: 'Analytics & Diagnostics',
      descAr: '3 طلاب بحاجة لتدخل عاجل',
      descEn: '3 at-risk students alert',
      icon: TrendingUp,
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      target: 'teacher-analytics'
    },
    {
      id: 'certificates',
      titleAr: 'الشهادات المعتمدة',
      titleEn: 'Certified Certificates',
      descAr: '184 شهادة تفوق موثقة',
      descEn: '184 verified honors issued',
      icon: Award,
      color: '#D97706',
      bgColor: 'rgba(217, 119, 6, 0.1)',
      target: 'teacher-certificates'
    }
  ];

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '36px 24px 80px',
      fontFamily: 'var(--font-arabic)'
    }}>
      {/* Top Welcome Banner */}
      <TeacherWelcomeBanner
        currentUser={currentUser}
        lang={lang}
        onRecordNewLesson={() => navigate('recording-studio')}
      />

      {/* Attention / Urgent Action Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '14px 20px',
        borderRadius: '16px',
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.08)' : '#FEF2F2',
        border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.25)' : '#FEE2E2'}`,
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertTriangle size={16} />
          </div>
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'تنبيه أكاديمي: 3 طلاب في حاجة لتدخل ومتابعة الغياب والدرجات' : 'Academic Alert: 3 students at-risk require attendance and grade intervention'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'يمكنك إرسال تنبيه مباشر لأولياء أمورهم من لوحة تشخيص الضعف.' : 'Send direct notifications to parents from the diagnostic radar.'}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('teacher-analytics')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '10px',
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer'
          }}
        >
          <span>{lang === 'ar' ? 'فتح رادار التدخل' : 'Open Radar'}</span>
          {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
        </button>
      </div>

      {/* 4 Stat Cards */}
      <TeacherStatCards lang={lang} />

      {/* Quick Nav Command Dock */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: '0 0 4px 0'
            }}>
              {lang === 'ar' ? 'محطات التحكم وإدارة الفصول' : 'Teacher Command Center'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              {lang === 'ar' ? 'الوصول السريع لكافة أدوات التدريس وبنك الأسئلة والتقييم والدوريات' : 'Fast access to curriculum, exams, league, homework desk, and analytics'}
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px'
        }}>
          {quickNavCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => navigate(card.target)}
                style={{
                  padding: '18px 16px',
                  borderRadius: '16px',
                  backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = card.color;
                  e.currentTarget.style.boxShadow = `0 8px 20px ${card.bgColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isDark ? 'var(--border-subtle)' : '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)';
                }}
              >
                <div>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: card.bgColor,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px'
                  }}>
                    <Icon size={19} />
                  </div>
                  <h3 style={{
                    fontSize: '14.5px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    margin: '0 0 4px 0'
                  }}>
                    {lang === 'ar' ? card.titleAr : card.titleEn}
                  </h3>
                  <p style={{
                    fontSize: '11.5px',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {lang === 'ar' ? card.descAr : card.descEn}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11.5px',
                  fontWeight: '800',
                  color: card.color,
                  marginTop: '14px'
                }}>
                  <span>{lang === 'ar' ? 'دخول' : 'Access'}</span>
                  {isRtl ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Lessons & Groups */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        {/* Left Column: Recent Processed Lessons */}
        <RecentProcessedLessons
          lessons={lessons}
          lang={lang}
          isRtl={isRtl}
          onOpenLesson={(id) => navigate('lesson-workspace', { lessonId: id })}
        />

        {/* Right Column: Active Groups & Classes */}
        <ActiveClassesList
          lang={lang}
          onOpenClasses={() => navigate('classes')}
        />
      </div>
    </div>
  );
};
