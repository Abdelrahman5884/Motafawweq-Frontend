import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { STUDENT_PROFILE } from '../../data/studentData';
import {
  GamificationHero,
  StudyActivityHeatmap,
  BadgesShowcase,
  WeeklyChallenges
} from '../../features/student/gamification';

export const StudentGamificationView = () => {
  const { lang } = useLanguage();
  const student = STUDENT_PROFILE;

  // Weekly challenges (US-88)
  const challenges = [
    { id: 'ch-1', titleAr: 'تحدي عبقري الأحياء: حل 3 كويزات بدرجة 90%+', progress: '2 / 3', completed: false, xpReward: 250 },
    { id: 'ch-2', titleAr: 'تحدي الالتزام الأسبوعي: 5 أيام متتالية مذاكرة', progress: '5 / 5', completed: true, xpReward: 300 },
    { id: 'ch-3', titleAr: 'تحدي بنك الأخطاء: تصحيح 5 مفاهيم من بنك الأخطاء', progress: '3 / 5', completed: false, xpReward: 200 }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '28px 20px 80px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'نظام التحفيز وسجل الاستريك (Gamification & Streak)' : 'Gamification & Study Streak'}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          {lang === 'ar' ? 'سجل نشاطك الدراسي السنوي بنمط جيت هاب، شارات التميز، والتحديات الأسبوعية' : 'GitHub-style activity heatmap, badges, XP levels & weekly challenges'}
        </p>
      </div>

      {/* Level & XP Progression Hero */}
      <GamificationHero student={student} />

      {/* GitHub-Style Study Activity Heatmap */}
      <StudyActivityHeatmap lang={lang} />

      {/* Badges Showcase Grid */}
      <BadgesShowcase lang={lang} />

      {/* Weekly Challenges */}
      <WeeklyChallenges challenges={challenges} lang={lang} />
    </div>
  );
};
