import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { STUDENT_PROFILE } from '../../data/studentData';
import {
  GamificationHero,
  StudyActivityHeatmap,
  BadgesShowcase,
  WeeklyChallenges,
  GamificationStatsCards,
  GamificationLeaguesHistory
} from '../../features/student/gamification';

export const StudentGamificationView = () => {
  const { lang } = useLanguage();
  const student = STUDENT_PROFILE;

  // Weekly challenges
  const challenges = [
    { id: 'ch-1', titleAr: 'تحدي عبقري الأحياء: حل 3 كويزات بدرجة 90%+', progress: '2 / 3', completed: false, xpReward: 250 },
    { id: 'ch-2', titleAr: 'تحدي الالتزام الأسبوعي: 5 أيام متتالية مذاكرة', progress: '5 / 5', completed: true, xpReward: 300 },
    { id: 'ch-3', titleAr: 'تحدي بنك الأخطاء: تصحيح 5 مفاهيم من بنك الأخطاء', progress: '3 / 5', completed: false, xpReward: 200 }
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
          {lang === 'ar' ? 'متابعة إحصائيات المذاكرة والامتحانات، شارات التميز، وسجل الترتيب في الدوريات' : 'Track your study statistics, perfect scores, badges, and league rankings'}
        </p>
      </div>

      {/* 1. Study Metrics Stats Cards: Exams solved, Full Marks, Lessons studied, Streak */}
      <GamificationStatsCards lang={lang} />

      {/* 2. Level & XP Progression Hero */}
      <GamificationHero student={student} />

      {/* 3. Study Activity Heatmap */}
      <StudyActivityHeatmap lang={lang} />

      {/* 4. Teacher Leagues & Past Leagues Archive */}
      <GamificationLeaguesHistory lang={lang} />

      {/* 5. Badges Showcase Grid */}
      <BadgesShowcase lang={lang} />

      {/* 6. Weekly Challenges */}
      <WeeklyChallenges challenges={challenges} lang={lang} />
    </div>
  );
};
