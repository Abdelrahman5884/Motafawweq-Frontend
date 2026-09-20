import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ChildSwitcher,
  ChildSummaryCard,
  ChildSessionAndFeedback
} from '../../features/parent';

export const ParentDashboard = () => {
  const { lang, isRtl } = useLanguage();
  const [selectedChild, setSelectedChild] = useState('child-omar');

  const children = [
    {
      id: 'child-omar',
      name: 'Omar Tarek El-Kady',
      nameAr: 'عمر طارق القاضي',
      grade: '3rd Secondary (Thanawya Amma)',
      gradeAr: 'الصف الثالث الثانوي (شعبة علمي علوم)',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      attendanceRate: 96.5,
      avgQuizScore: 89.0,
      streakDays: 14,
      nextSession: 'Sunday 4:00 PM - Biology (Dr. Salma)',
      nextSessionAr: 'الأحد 4:00 عصراً - أحياء (د. سلمى السيد)',
      teacherNotes: 'Omar shows exceptional grasp in Cell Biology. Needs slight revision on Calvin Cycle calculations.',
      teacherNotesAr: 'عمر ممتاز جداً ومتفاعل في القاعة. مطلوب منه مراجعة حسابات الطاقة في دورة كالفن فقط.'
    },
    {
      id: 'child-sarah',
      name: 'Sarah Tarek El-Kady',
      nameAr: 'سارة طارق القاضي',
      grade: '1st Prep',
      gradeAr: 'الصف الأول الإعدادي',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      attendanceRate: 98.0,
      avgQuizScore: 94.5,
      streakDays: 19,
      nextSession: 'Monday 5:00 PM - Science',
      nextSessionAr: 'الإثنين 5:00 مساءً - علوم',
      teacherNotes: 'Top of her class this week in Matter & Structure quiz!',
      teacherNotesAr: 'الأولى على مجموعتها هذا الأسبوع في كويز تركيب المادة!'
    }
  ];

  const activeChild = children.find(c => c.id === selectedChild) || children[0];

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '36px 24px 80px'
    }}>
      {/* Header with Child Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 4px 0',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
          }}>
            {lang === 'ar' ? 'بوابة ولي الأمر للمتابعة والتقارير' : 'Parent Monitoring Portal'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            {lang === 'ar' ? 'متابعة لحظية لحضور وغياب الأبناء في السنتر ونتائج امتحاناتهم' : 'Real-time attendance checks, weekly quiz grades, and direct teacher communications'}
          </p>
        </div>

        {/* Child Switcher Pills */}
        <ChildSwitcher
          children={children}
          selectedChild={selectedChild}
          onSelectChild={setSelectedChild}
          lang={lang}
        />
      </div>

      {/* Child Summary Card */}
      <ChildSummaryCard
        activeChild={activeChild}
        lang={lang}
        isRtl={isRtl}
      />

      {/* Next Session & Teacher Notes */}
      <ChildSessionAndFeedback
        activeChild={activeChild}
        lang={lang}
      />
    </div>
  );
};
