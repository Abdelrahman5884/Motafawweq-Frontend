import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON } from '../../data/mockData';
import {
  TeacherWelcomeBanner,
  TeacherStatCards,
  RecentProcessedLessons,
  ActiveClassesList
} from '../../features/teacher/dashboard';

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
      <TeacherWelcomeBanner
        currentUser={currentUser}
        lang={lang}
        onRecordNewLesson={() => navigate('recording-studio')}
      />

      {/* 4 Stat Cards */}
      <TeacherStatCards lang={lang} />

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
