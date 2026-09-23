import React from 'react';
import { BookOpen, GraduationCap, ClipboardCheck, Flame } from 'lucide-react';

export const DashboardKpis = ({ student, lang, isDark, themeAccent }) => {
  return (
    <div className="executive-kpi-grid">
      {/* Card 1: Combined Exams & Full Marks (امتحانات تم حلها + الدرجة النهائية) */}
      <div className="executive-kpi-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="executive-icon-box" style={{ background: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.12)', color: themeAccent }}>
            <ClipboardCheck size={19} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
            {lang === 'ar' ? 'معدل تميز 75%' : '75% Top Score'}
          </span>
        </div>
        <div>
          <div className="executive-dual-stat">
            <div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
                24
              </div>
              <div className="executive-kpi-sub" style={{ marginTop: '3px' }}>
                {lang === 'ar' ? 'امتحانات تم حلها' : 'Exams Solved'}
              </div>
            </div>

            <div className="executive-dual-stat-divider" style={{ width: '1px', height: '36px', background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)', margin: '0 16px' }} />

            <div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#10B981', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
                18
              </div>
              <div className="executive-kpi-sub" style={{ marginTop: '3px' }}>
                {lang === 'ar' ? 'فول مارك (100%)' : 'Full Mark (100%)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Lessons Studied (حصص تمت مذاكرتها) */}
      <div className="executive-kpi-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="executive-icon-box" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366F1' }}>
            <BookOpen size={19} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#6366F1', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
            {lang === 'ar' ? 'تقدم 62%' : '62% Progress'}
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
            {lang === 'ar' ? 'حصص تمت مذاكرتها' : 'Lessons Studied'}
          </div>
        </div>
      </div>

      {/* Card 3: Streak & Persistence Days (أيام الاستمرار والستريك) */}
      <div className="executive-kpi-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="executive-icon-box" style={{ background: 'rgba(249, 115, 22, 0.12)', color: '#F97316' }}>
            <Flame size={19} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#EA580C', background: 'rgba(249, 115, 22, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
            {lang === 'ar' ? 'أطول سلسلة: 28 يوم' : 'Longest: 28d'}
          </span>
        </div>
        <div>
          <div className="executive-kpi-val">
            <span>{student.streakDays}</span>
            <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-muted)', marginInlineStart: '6px' }}>
              {lang === 'ar' ? 'يوماً' : 'Days'}
            </span>
          </div>
          <div className="executive-kpi-sub">
            {lang === 'ar' ? 'أيام الاستمرار والستريك' : 'Consecutive Study Days'}
          </div>
        </div>
      </div>

      {/* Card 4: Dual Metric (Today's Study + Batch Rank) */}
      <div className="executive-kpi-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="executive-icon-box" style={{ background: 'rgba(96, 165, 250, 0.12)', color: '#3B82F6' }}>
            <GraduationCap size={19} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
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
