import React, { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { generateActivityStreakGrid } from '../../../data/studentData';

export const StudyActivityHeatmap = ({ lang }) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate 52 weeks GitHub-style activity matrix
  const streakWeeks = useMemo(() => generateActivityStreakGrid(), []);

  // Intensity color mapper for cohesive platform theme
  const getSquareColor = (level) => {
    switch (level) {
      case 0: return 'var(--bg-subtle)';
      case 1: return 'rgba(16, 185, 129, 0.22)';
      case 2: return 'rgba(16, 185, 129, 0.48)';
      case 3: return 'rgba(16, 185, 129, 0.75)';
      case 4: return 'var(--primary)';
      default: return 'var(--bg-subtle)';
    }
  };

  const months = lang === 'ar' 
    ? ['أكتوبر', 'نوفمبر', 'ديسمبر', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر']
    : ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '20px',
      padding: '22px 24px',
      marginBottom: '26px',
      boxShadow: 'var(--shadow-xs)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-arabic)' }}>
            {lang === 'ar' ? 'سجل الالتزام والنشاط اليومي' : 'Daily Activity & Study Streak'}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
          <span>{lang === 'ar' ? 'أقل نشاطاً' : 'Less'}</span>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(16, 185, 129, 0.22)' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(16, 185, 129, 0.48)' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(16, 185, 129, 0.75)' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--primary)' }} />
          <span>{lang === 'ar' ? 'أكثر نشاطاً' : 'More'}</span>
        </div>
      </div>

      {/* The 52-Week Grid with Months on Top & Days on Side */}
      <div style={{
        overflowX: 'auto',
        paddingBottom: '8px'
      }}>
        {/* Months Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: 'max-content',
          minWidth: '780px',
          paddingInlineStart: '32px',
          marginBottom: '6px',
          fontSize: '11px',
          color: 'var(--text-muted)'
        }}>
          {months.map((m, i) => (
            <span key={i} style={{ flex: 1, textAlign: 'center' }}>{m}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', width: 'max-content' }}>
          {/* Day of Week Labels */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: 'var(--text-muted)',
            paddingTop: '2px',
            paddingBottom: '4px',
            userSelect: 'none',
            lineHeight: 1
          }}>
            <span>{lang === 'ar' ? 'أحد' : 'Sun'}</span>
            <span>{lang === 'ar' ? 'ثلاثاء' : 'Tue'}</span>
            <span>{lang === 'ar' ? 'خميس' : 'Thu'}</span>
          </div>

          {/* Squares Grid */}
          <div style={{
            display: 'flex',
            gap: '3px'
          }}>
            {streakWeeks.map((week, wIdx) => (
              <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    style={{
                      width: '12.5px',
                      height: '12.5px',
                      borderRadius: '3px',
                      backgroundColor: getSquareColor(day.level),
                      border: '1px solid rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                      transition: 'transform 0.1s ease'
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hovered Day Tooltip Bar */}
      <div style={{
        marginTop: '12px',
        padding: '9px 14px',
        borderRadius: '10px',
        backgroundColor: 'var(--bg-main)',
        border: '1px solid var(--border-subtle)',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        minHeight: '36px',
        display: 'flex',
        alignItems: 'center'
      }}>
        {hoveredDay ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={14} color="var(--primary)" />
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>{hoveredDay.date} ({hoveredDay.dayName}):</strong>{' '}
              {hoveredDay.minutes > 0 ? `${hoveredDay.minutes} دقيقة مذاكرة • ${hoveredDay.quizzes} اختبارات مكتملة` : 'لا يوجد نشاط مسجل في هذا اليوم'}
            </span>
          </div>
        ) : (
          <span>{lang === 'ar' ? 'مرر مؤشر الماوس فوق أي مربع لرؤية تفاصيل مذاكرتك واختباراتك في ذلك اليوم.' : 'Hover over any square to see your daily study details.'}</span>
        )}
      </div>
    </div>
  );
};
