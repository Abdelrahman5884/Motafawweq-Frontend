import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  StudyActivityHeatmap,
  WeeklyChallenges,
  GamificationStatsCards,
  GamificationLeaguesHistory
} from '../../features/student/gamification';

export const StudentGamificationView = () => {
  const { lang } = useLanguage();

  // Real, platform-specific weekly challenges
  const challenges = [
    { 
      id: 'ch-1', 
      titleAr: 'حل 5 كويزات في مادة الأحياء', 
      descAr: 'تمارين تفاعلية من كورس د. سلمى السيد بنظام البابل شيت',
      current: 4,
      target: 5,
      completed: false, 
      xpReward: 250,
      link: '/student/quiz'
    },
    { 
      id: 'ch-2', 
      titleAr: 'تقفيل امتحان شامل في مادة الفيزياء (100%)', 
      descAr: 'الحصول على الدرجة النهائية في اختبار دوائر كيرشوف',
      current: 1,
      target: 1,
      completed: true, 
      xpReward: 350,
      link: '/student/exam'
    },
    { 
      id: 'ch-3', 
      titleAr: 'مذاكرة 4 حصص من الكورسات المسجلة', 
      descAr: 'إكمال مشاهدة وتلخيص الحصص على المنصة هذا الأسبوع',
      current: 3,
      target: 4,
      completed: false, 
      xpReward: 300,
      link: '/student/courses'
    },
    { 
      id: 'ch-4', 
      titleAr: 'تصحيح 5 أسئلة من بنك الأخطاء', 
      descAr: 'إعادة حل وتثبيت المفاهيم التي تم التعثر فيها سابقاً',
      current: 3,
      target: 5,
      completed: false, 
      xpReward: 200,
      link: '/student/weak-areas'
    }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '28px 20px 80px',
      fontFamily: 'var(--font-arabic)'
    }}>
      {/* Calm Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'لوحة إنجازاتي وجوائز التفوق' : 'My Achievements & Honors'}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          {lang === 'ar' ? 'متابعة إحصائيات المذاكرة والامتحانات، وسجل الترتيب في الدوريات والتحديات الأسبوعية' : 'Track your study statistics, exams, league rankings, and weekly challenges'}
        </p>
      </div>

      {/* 1. Study Metrics Stats Cards: Exams solved, Full Marks, Lessons studied, Streak */}
      <GamificationStatsCards lang={lang} />

      {/* 2. Study Activity Heatmap (Daily Commitment) */}
      <StudyActivityHeatmap lang={lang} />

      {/* 3. Teacher Leagues & Past Leagues Archive */}
      <GamificationLeaguesHistory lang={lang} />

      {/* 4. Real Platform Weekly Challenges */}
      <WeeklyChallenges challenges={challenges} lang={lang} />
    </div>
  );
};
