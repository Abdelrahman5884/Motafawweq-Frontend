import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services/studentApi';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Target,
  Sparkles,
} from 'lucide-react';
import {
  SPage,
  SPageHeader,
  SCard,
  SButton,
  SStatBlock,
  SIconBox,
  SBadge,
  S,
} from '../../components/student/ui';
import {
  SubjectPerformanceGrid,
  WeeklyPerformanceChart,
} from '../../features/student/analytics';

export const StudentAnalyticsView = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const [student, setStudent] = useState({
    overallGpa: '0%',
    studyHours: 0,
    completedLessonsCount: 0,
    totalEnrolledLessons: 0,
    gradedExamsCount: 0,
  });
  const [subjectAverages, setSubjectAverages] = useState([]);
  const [weakAreas, setWeakAreas] = useState([]);
  const [weeklyScores, setWeeklyScores] = useState([]);

  useEffect(() => {
    let mounted = true;
    studentApi.dashboard.analytics()
      .then((res) => {
        if (!mounted) return;
        const d = res?.data || {};
        setStudent({
          overallGpa: `${Number(d.avgExamScorePercent || 0)}%`,
          studyHours: Number(d.studyHours || 0),
          completedLessonsCount: Number(d.completedLessonsCount || 0),
          totalEnrolledLessons: Number(d.totalEnrolledLessons || d.completedLessonsCount || 0),
          gradedExamsCount: Number(d.gradedExamsCount || 0),
        });
        setSubjectAverages(Array.isArray(d.subjectAverages) ? d.subjectAverages : []);
        setWeakAreas(Array.isArray(d.weakAreas) ? d.weakAreas : []);
        const recent = Array.isArray(d.recentExamPerformances) ? d.recentExamPerformances : [];
        setWeeklyScores(
          recent.map((r, i) => ({
            week: r.examTitleAr || (isAr ? `امتحان ${i + 1}` : `Exam ${i + 1}`),
            score: Math.round(Number(r.percentage || 0)),
          }))
        );
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [isAr]);

  const maxScore = weeklyScores.length > 0 ? Math.max(...weeklyScores.map((w) => w.score), 1) : 100;

  return (
    <SPage>
      <SPageHeader
        title={isAr ? 'مستواي' : 'My Level'}
        subtitle={isAr ? 'متابعة التقدم الدراسي والأداء في المواد' : 'Track your academic progress and performance'}
      />

      {/* Stats row */}
      <SCard style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '20px',
        }}>
          <SStatBlock
            icon={<Award size={18} />}
            value={student.overallGpa}
            label={isAr ? 'المعدل العام' : 'Overall GPA'}
            color={S.success}
          />
          <SStatBlock
            icon={<Clock size={18} />}
            value={`${student.studyHours}${isAr ? 'س' : 'h'}`}
            label={isAr ? 'ساعات الدراسة' : 'Study hours'}
            color={S.primary}
          />
          <SStatBlock
            icon={<CheckCircle2 size={18} />}
            value={student.completedLessonsCount}
            label={isAr ? 'حصة مكتملة' : 'Lessons done'}
            color={S.primary}
          />
          <SStatBlock
            icon={<Target size={18} />}
            value={`${student.gradedExamsCount}`}
            label={isAr ? 'اختبار مكتمل' : 'Exams done'}
            color={S.warning}
          />
        </div>
      </SCard>

      {/* Subject performance breakdown */}
      <SubjectPerformanceGrid subjectAverages={subjectAverages} lang={lang} />

      {/* Weekly performance chart */}
      <WeeklyPerformanceChart weeklyScores={weeklyScores} maxScore={maxScore} lang={lang} />

      {/* Weak areas warning card with direct AI coach trigger */}
      <SCard>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SIconBox icon={<AlertTriangle size={18} />} color={S.danger} />
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: S.textPrimary, margin: 0 }}>
              {isAr ? 'نقاط تحتاج مراجعة' : 'Areas needing review'}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <SButton
              variant="primary"
              size="sm"
              onClick={() => navigate('/student/weak-areas')}
            >
              <Sparkles size={13} />
              <span>{isAr ? 'تشخيص وخطة AI' : 'AI Coach Plan'}</span>
            </SButton>
            <SButton
              variant="subtle"
              size="sm"
              onClick={() => navigate('/student/revision')}
            >
              {isAr ? 'بنك الأخطاء' : 'Mistake Bank'}
            </SButton>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {weakAreas.map((area, i) => (
            <div
              key={`${area.topicAr || 'area'}-${i}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: S.radiusMd,
                backgroundColor: S.bgSubtle,
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
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
                <div style={{ fontSize: '11px', color: S.textMuted }}>{isAr ? 'إتقان' : 'Mastery'}</div>
              </div>
            </div>
          ))}
          {weakAreas.length === 0 && (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: S.textSecondary, fontSize: '13.5px', fontWeight: '700' }}>
              {isAr ? 'لا توجد نقاط ضعف مسجلة حالياً.' : 'No weak areas recorded at the moment.'}
            </div>
          )}
        </div>
      </SCard>
    </SPage>
  );
};
