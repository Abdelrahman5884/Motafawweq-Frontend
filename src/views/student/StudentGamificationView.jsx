import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services/studentApi';
import {
  StudyActivityHeatmap,
  WeeklyChallenges,
  GamificationLeaguesHistory
} from '../../features/student/gamification';

export const StudentGamificationView = () => {
  const { lang } = useLanguage();
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    let mounted = true;
    studentApi.gamification.challenges()
      .then((res) => {
        if (!mounted) return;
        setChallenges(Array.isArray(res?.data) ? res.data : []);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

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
          {lang === 'ar' ? 'متابعة سجل الترتيب في الدوريات والبطولات التنافسية، وخريطة المذاكرة والتحديات الأسبوعية' : 'Track your tournament standings, league rankings, study habits, and weekly challenges'}
        </p>
      </div>

      {/* 1. First Section: Teacher Leagues & Past Leagues Archive with Championship Background */}
      <GamificationLeaguesHistory lang={lang} />

      {/* 2. Study Activity Heatmap (Daily Commitment) */}
      <StudyActivityHeatmap lang={lang} />

      {/* 3. Real Platform Weekly Challenges */}
      <WeeklyChallenges challenges={challenges} lang={lang} />
    </div>
  );
};
