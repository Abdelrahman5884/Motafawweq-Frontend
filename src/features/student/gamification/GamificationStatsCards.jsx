import React from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  BookOpen, 
  Flame 
} from 'lucide-react';

export const GamificationStatsCards = ({ lang = 'ar' }) => {
  const stats = [
    {
      id: 'exams-solved',
      titleAr: 'امتحانات تم حلها',
      titleEn: 'Exams Solved',
      value: '24',
      subAr: 'شاملة كويزات وبنوك الأسئلة',
      subEn: 'Quizzes & question banks',
      icon: ClipboardCheck,
      badgeAr: '+4 هذا الأسبوع'
    },
    {
      id: 'full-marks',
      titleAr: 'امتحانات بالدرجة النهائية (Full Mark)',
      titleEn: '100% Full Mark Exams',
      value: '18',
      subAr: 'تقفيل كامل بدون أي خطأ',
      subEn: 'Perfect scores achieved',
      icon: CheckCircle2,
      badgeAr: 'معدل تميز 75%'
    },
    {
      id: 'lessons-studied',
      titleAr: 'حصص تمت مذاكرتها',
      titleEn: 'Lessons Studied',
      value: '42',
      subAr: 'من أصل 68 حصة مسجلة',
      subEn: 'Of 68 total enrolled lessons',
      icon: BookOpen,
      badgeAr: 'تقدم 62%'
    },
    {
      id: 'streak-days',
      titleAr: 'أيام الاستمرار والاستريك',
      titleEn: 'Current Study Streak',
      value: '16',
      unitAr: 'يوماً',
      unitEn: 'days',
      subAr: 'مذاكرة يومية دون انقطاع',
      subEn: 'Consecutive study days',
      icon: Flame,
      badgeAr: 'أطول سلسلة: 28 يوم'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
      marginBottom: '26px'
    }}>
      {stats.map((item) => {
        const IconComponent = item.icon;
        return (
          <div
            key={item.id}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IconComponent size={19} color="var(--primary)" />
              </div>

              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-main)',
                padding: '3px 8px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}>
                {item.badgeAr}
              </span>
            </div>

            <div>
              <div style={{
                fontSize: '24px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'baseline',
                gap: '6px'
              }}>
                <span>{item.value}</span>
                {item.unitAr && (
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? item.unitAr : item.unitEn}
                  </span>
                )}
              </div>

              <div style={{
                fontSize: '13px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                marginTop: '4px',
                fontFamily: 'var(--font-arabic)'
              }}>
                {lang === 'ar' ? item.titleAr : item.titleEn}
              </div>

              <div style={{
                fontSize: '11.5px',
                color: 'var(--text-secondary)',
                marginTop: '3px',
                fontFamily: 'var(--font-arabic)'
              }}>
                {lang === 'ar' ? item.subAr : item.subEn}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GamificationStatsCards;
