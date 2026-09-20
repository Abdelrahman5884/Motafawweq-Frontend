import React from 'react';
import { BookOpen, TrendingUp, Calendar, GraduationCap } from 'lucide-react';

export const DashboardKpis = ({ student, lang, isDark, themeAccent }) => {
  return (
    <div className="executive-kpi-grid">
      {/* Card 1: Completed Lessons */}
      <div className="executive-kpi-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="executive-icon-box" style={{ background: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.12)', color: themeAccent }}>
            <BookOpen size={19} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
            {lang === 'ar' ? '+3 هذا الأسبوع' : '+3 this week'}
          </span>
        </div>
        <div>
          <div className="executive-kpi-val">
            <span>{student.completedLessonsCount}</span>
            <span style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text-muted)', marginInlineStart: '4px' }}>
              / {student.totalEnrolledLessons}
            </span>
          </div>
          <div className="executive-kpi-sub">
            {lang === 'ar' ? 'الحصص المكتملة' : 'Completed Lessons'}
          </div>
        </div>
      </div>

      {/* Card 2: Overall GPA */}
      <div className="executive-kpi-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="executive-icon-box" style={{ background: 'rgba(52, 211, 153, 0.12)', color: '#10B981' }}>
            <TrendingUp size={19} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
            {lang === 'ar' ? '+2.4% نمو' : '+2.4% growth'}
          </span>
        </div>
        <div>
          <div className="executive-kpi-val" style={{ color: '#10B981' }}>
            {student.overallGpa}
          </div>
          <div className="executive-kpi-sub">
            {lang === 'ar' ? 'المعدل العام التراكمي' : 'Cumulative GPA'}
          </div>
        </div>
      </div>

      {/* Card 3: Streak Days */}
      <div className="executive-kpi-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="executive-icon-box" style={{ background: 'rgba(21, 136, 199, 0.12)', color: 'var(--primary)' }}>
            <Calendar size={19} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--primary)', background: 'rgba(21, 136, 199, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
            {lang === 'ar' ? 'التزام نشط' : 'Active Streak'}
          </span>
        </div>
        <div>
          <div className="executive-kpi-val">
            <span>{student.streakDays}</span>
            <span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-muted)', marginInlineStart: '6px' }}>
              {lang === 'ar' ? 'يوماً متتالياً' : 'Days'}
            </span>
          </div>
          <div className="executive-kpi-sub">
            {lang === 'ar' ? 'سلسلة المذاكرة المتتالية' : 'Consecutive Study Days'}
          </div>
        </div>
      </div>

      {/* Card 4: Dual Metric (Today's Study + Batch Rank) */}
      <div className="executive-kpi-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="executive-icon-box" style={{ background: 'rgba(96, 165, 250, 0.12)', color: '#3B82F6' }}>
            <GraduationCap size={19} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
            {lang === 'ar' ? 'دوري النخبة' : 'Elite League'}
          </span>
        </div>
        <div>
          <div className="executive-dual-stat">
            <div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
                {student.studyMinutesToday}
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginInlineStart: '3px' }}>
                  {lang === 'ar' ? 'د' : 'm'}
                </span>
              </div>
              <div className="executive-kpi-sub" style={{ marginTop: '3px' }}>
                {lang === 'ar' ? 'مذاكرة اليوم' : "Today's Study"}
              </div>
            </div>

            <div className="executive-dual-stat-divider" style={{ width: '1px', height: '36px', background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)', margin: '0 20px' }} />

            <div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: themeAccent, lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
                #2
              </div>
              <div className="executive-kpi-sub" style={{ marginTop: '3px' }}>
                {lang === 'ar' ? 'ترتيب الدفعة' : 'Batch Rank'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
