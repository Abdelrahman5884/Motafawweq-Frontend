import React from 'react';
import { BookOpen, GraduationCap, ClipboardCheck, Flame } from 'lucide-react';
import { formatLiveDuration } from '../../../utils';

const formatArabicDaysUnit = (days) => {
  const n = Math.max(0, Math.floor(Number(days) || 0));
  if (n === 1) return 'يوم';
  if (n === 2) return 'يومان';
  if (n >= 3 && n <= 10) return 'أيام';
  return 'يوماً';
};

export const DashboardKpis = ({
  student,
  lang,
  isDark,
  themeAccent,
  isTrackingTime = false
}) => {
  const examsSolved = Number(student.examsCompletedCount || 0);
  const fullMarkCount = Number(student.fullMarkExamsCount || 0);
  const topScoreRate = examsSolved > 0 ? Math.round((fullMarkCount / examsSolved) * 100) : 0;

  const completedLessons = Number(student.completedLessonsCount || 0);
  const totalLessons = Number(student.totalEnrolledLessons || 0);
  const lessonProgressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const streakDays = Number(student.streakDays || 0);
  const longestStreak = Math.max(streakDays, Number(student.longestStreakDays || 0));
  const streakWasReset = Boolean(student.streakWasReset);
  const batchRank = student.batchRank ? `#${student.batchRank}` : '--';

  const studySecondsToday = Math.max(0, Number(student.studySecondsToday ?? (Number(student.studyMinutesToday || 0) * 60)));
  const studyMinutesToday = Math.floor(studySecondsToday / 60);
  const liveClockText = formatLiveDuration(studySecondsToday);

  return (
    <div className="executive-kpi-grid">
      {/* Card 1: Combined Exams & Full Marks (امتحانات تم حلها + الدرجة النهائية) */}
      <div className="executive-kpi-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="executive-icon-box" style={{ background: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.12)', color: themeAccent }}>
            <ClipboardCheck size={19} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
            {lang === 'ar' ? `معدل تميز ${topScoreRate}%` : `${topScoreRate}% Top Score`}
          </span>
        </div>
        <div>
          <div className="executive-dual-stat">
            <div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
                {examsSolved}
              </div>
              <div className="executive-kpi-sub" style={{ marginTop: '3px' }}>
                {lang === 'ar' ? 'امتحانات تم حلها' : 'Exams Solved'}
              </div>
            </div>

            <div className="executive-dual-stat-divider" style={{ width: '1px', height: '36px', background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)', margin: '0 16px' }} />

            <div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#10B981', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
                {fullMarkCount}
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
            {lang === 'ar' ? `تقدم ${lessonProgressPct}%` : `${lessonProgressPct}% Progress`}
          </span>
        </div>
        <div>
          <div className="executive-kpi-val">
            <span>{completedLessons}</span>
            <span style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text-muted)', marginInlineStart: '4px' }}>
              / {totalLessons}
            </span>
          </div>
          <div className="executive-kpi-sub">
            {lang === 'ar' ? 'حصص تمت مذاكرتها' : 'Lessons Studied'}
          </div>
        </div>
      </div>

      {/* Card 3: Daily Consecutive Streak (أيام الاستمرار والستريك) */}
      <div className="executive-kpi-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div
            className="executive-icon-box"
            style={{
              background: streakDays > 0 ? 'rgba(249, 115, 22, 0.14)' : 'rgba(148, 163, 184, 0.12)',
              color: streakDays > 0 ? '#F97316' : 'var(--text-muted)',
              boxShadow: streakDays > 0 ? '0 0 14px rgba(249, 115, 22, 0.18)' : 'none'
            }}
          >
            <Flame size={19} fill={streakDays > 0 ? 'rgba(249, 115, 22, 0.25)' : 'none'} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#EA580C', background: 'rgba(249, 115, 22, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
            {lang === 'ar' ? `أطول سلسلة: ${longestStreak} ${formatArabicDaysUnit(longestStreak)}` : `Longest: ${longestStreak}d`}
          </span>
        </div>
        <div>
          <div className="executive-kpi-val" style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
            <span>{streakDays}</span>
            <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>
              {lang === 'ar' ? formatArabicDaysUnit(streakDays) : (streakDays === 1 ? 'Day' : 'Days')}
            </span>
          </div>
          <div className="executive-kpi-sub" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', flexWrap: 'wrap' }}>
            <span>
              {streakWasReset
                ? (lang === 'ar' ? 'بدأت سلسلة جديدة اليوم' : 'New streak started today')
                : (lang === 'ar' ? 'أيام الاستمرار والستريك' : 'Consecutive Study Days')}
            </span>
            {streakDays > 0 && (
              <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#10B981' }}>
                {lang === 'ar' ? 'نشط اليوم' : 'Active today'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card 4: Dual Metric (Live Today's Platform Time + Batch Rank) */}
      <div className="executive-kpi-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="executive-icon-box" style={{ background: 'rgba(96, 165, 250, 0.12)', color: '#3B82F6' }}>
            <GraduationCap size={19} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
            {`${Number(student.xp || 0)} XP`}
          </span>
        </div>
        <div>
          <div className="executive-dual-stat">
            <div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                <span>{studyMinutesToday}</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>
                  {lang === 'ar' ? 'د' : 'm'}
                </span>
              </div>
              <div className="executive-kpi-sub" style={{ marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span>{lang === 'ar' ? 'وقت المنصة اليوم' : "Today's Time"}</span>
                <span
                  dir="ltr"
                  title={lang === 'ar' ? 'العداد يحسب وقت فتحك للمنصة اليوم لحظة بلحظة' : 'Live platform active time today'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10.5px',
                    fontWeight: '700',
                    fontFamily: 'var(--font-heading), monospace',
                    color: isTrackingTime ? '#10B981' : 'var(--text-muted)',
                    background: isTrackingTime ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                    padding: '1px 6px',
                    borderRadius: '999px'
                  }}
                >
                  <span
                    className={isTrackingTime ? 'live-time-dot' : undefined}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isTrackingTime ? '#10B981' : '#94A3B8',
                      display: 'inline-block'
                    }}
                  />
                  {liveClockText}
                </span>
              </div>
            </div>

            <div className="executive-dual-stat-divider" style={{ width: '1px', height: '36px', background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)', margin: '0 16px' }} />

            <div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: themeAccent, lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
                {batchRank}
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
