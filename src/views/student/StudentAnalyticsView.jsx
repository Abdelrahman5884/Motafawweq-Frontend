import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services/studentApi';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Target
} from 'lucide-react';
import {
  SPage,
  SPageHeader,
  SCard,
  SButton,
  SStatBlock,
  SIconBox,
  SBadge,
  S
} from '../../components/student/ui';
import {
  SubjectPerformanceGrid,
  WeeklyPerformanceChart
} from '../../features/student/analytics';

export const StudentAnalyticsView = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [student, setStudent] = useState({
    overallGpa: '0%',
    studyMinutesToday: 0,
    completedLessonsCount: 0,
    totalEnrolledLessons: 0
  });
  const [subjectAverages] = useState([]);
  const [weakAreas] = useState([]);
  const [weeklyScores, setWeeklyScores] = useState([]);

  useEffect(() => {
    let mounted = true;
    studentApi.dashboard.analytics()
      .then((res) => {
        if (!mounted) return;
        const d = res?.data || {};
        setStudent({
          overallGpa: `${Number(d.avgExamScorePercent || 0)}%`,
          studyMinutesToday: 0,
          completedLessonsCount: Number(d.completedLessonsCount || 0),
          totalEnrolledLessons: Number(d.completedLessonsCount || 0)
        });
        const recent = Array.isArray(d.recentExamPerformances) ? d.recentExamPerformances : [];
        setWeeklyScores(recent.map((r, i) => ({
          week: r.examTitleAr || `امتحان ${i + 1}`,
          score: Math.round(Number(r.percentage || 0))
        })));
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const maxScore = weeklyScores.length > 0 ? Math.max(...weeklyScores.map(w => w.score), 1) : 100;

  return (
    <SPage>
      <SPageHeader
        title={lang === 'ar' ? 'مستواي' : 'My Level'}
        subtitle={lang === 'ar' ? 'متابعة التقدم الدراسي والأداء في المواد' : 'Track your academic progress and performance'}
      />

      {/* Stats row */}
      <SCard style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '20px'
        }}>
          <SStatBlock
            icon={<Award size={18} />}
            value={student.overallGpa}
            label={lang === 'ar' ? 'المعدل العام' : 'Overall GPA'}
            color={S.success}
          />
          <SStatBlock
            icon={<Clock size={18} />}
            value={`${Math.round(student.studyMinutesToday * 30 / 60)}س`}
            label={lang === 'ar' ? 'ساعات الدراسة' : 'Study hours'}
            color={S.primary}
          />
          <SStatBlock
            icon={<CheckCircle2 size={18} />}
            value={student.completedLessonsCount}
            label={lang === 'ar' ? 'حصة مكتملة' : 'Lessons done'}
            color={S.primary}
          />
          <SStatBlock
            icon={<Target size={18} />}
            value={`${student.examStreak}`}
            label={lang === 'ar' ? 'اختبار مكتمل' : 'Exams done'}
            color={S.warning}
          />
        </div>
      </SCard>

      {/* Subject performance breakdown */}
      <SubjectPerformanceGrid subjectAverages={subjectAverages} lang={lang} />

      {/* Weekly performance chart */}
      <WeeklyPerformanceChart weeklyScores={weeklyScores} maxScore={maxScore} lang={lang} />

      {/* Weak areas warning card */}
      <SCard>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SIconBox icon={<AlertTriangle size={18} />} color={S.danger} />
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: S.textPrimary, margin: 0 }}>
              {lang === 'ar' ? 'نقاط تحتاج مراجعة' : 'Areas needing review'}
            </h3>
          </div>
          <SButton
            variant="subtle"
            size="sm"
            onClick={() => navigate('/student/revision')}
          >
            {lang === 'ar' ? 'عرض الكل' : 'View all'}
          </SButton>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {weakAreas.map((area, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: S.radiusMd,
                backgroundColor: S.bgSubtle,
                gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: S.textPrimary }}>
                    {area.topicAr}
                  </span>
                  <SBadge color={S.primary} style={{ fontSize: '10.5px' }}>
                    {area.subjectAr}
                  </SBadge>
                </div>
                <p style={{ fontSize: '12px', color: S.textSecondary, margin: 0, lineHeight: 1.5 }}>
                  {area.adviceAr}
                </p>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: S.danger }}>
                  {area.mastery}%
                </span>
                <div style={{ fontSize: '11px', color: S.textMuted }}>إتقان</div>
              </div>
            </div>
          ))}
          {weakAreas.length === 0 && (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: S.textSecondary, fontSize: '13.5px', fontWeight: '700' }}>
              {lang === 'ar' ? 'لا توجد نقاط ضعف مسجلة حالياً.' : 'No weak areas recorded at the moment.'}
            </div>
          )}
        </div>
      </SCard>
    </SPage>
  );
};
