import React, { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { generateActivityStreakGrid } from '../../../data/studentData';

export const StudyActivityHeatmap = ({ lang }) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate 52 weeks GitHub-style activity matrix
  const streakWeeks = useMemo(() => generateActivityStreakGrid(), []);

  // Intensity color mapper for GitHub squares
  const getSquareColor = (level) => {
    switch (level) {
      case 0: return 'var(--bg-subtle)';
      case 1: return '#86EFAC';
      case 2: return '#4ADE80';
      case 3: return '#22C55E';
      case 4: return '#15803D';
      default: return 'var(--bg-subtle)';
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1.5px solid var(--border-medium)',
      borderRadius: '24px',
      padding: '24px',
      marginBottom: '28px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="var(--success)" />
          <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'سجل الالتزام الدراسي (Study Activity Heatmap) بنمط GitHub' : 'Study Activity Matrix (GitHub Style)'}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>أقل</span>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--bg-subtle)' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#86EFAC' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#4ADE80' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#22C55E' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#15803D' }} />
          <span>أكثر</span>
        </div>
      </div>

      {/* The 52-Week Grid */}
      <div style={{
        overflowX: 'auto',
        paddingBottom: '10px'
      }}>
        <div style={{
          display: 'flex',
          gap: '3px',
          width: 'max-content'
        }}>
          {streakWeeks.map((week, wIdx) => (
            <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  style={{
                    width: '13px',
                    height: '13px',
                    borderRadius: '3px',
                    backgroundColor: getSquareColor(day.level),
                    border: '1px solid rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease'
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hovered Day Tooltip Bar */}
      <div style={{
        marginTop: '12px',
        padding: '8px 14px',
        borderRadius: '10px',
        backgroundColor: 'var(--bg-subtle)',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        minHeight: '36px',
        display: 'flex',
        alignItems: 'center'
      }}>
        {hoveredDay ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="var(--primary)" />
            <span><strong>{hoveredDay.date} ({hoveredDay.dayName}):</strong> {hoveredDay.minutes > 0 ? `${hoveredDay.minutes} دقيقة مذاكرة • ${hoveredDay.quizzes} اختبارات مكتملة` : 'لا يوجد نشاط مسجل في هذا اليوم'}</span>
          </div>
        ) : (
          <span>مرر مؤشر الماوس فوق أي مربع لرؤية تفاصيل مذاكرتك واختباراتك في ذلك اليوم.</span>
        )}
      </div>
    </div>
  );
};
