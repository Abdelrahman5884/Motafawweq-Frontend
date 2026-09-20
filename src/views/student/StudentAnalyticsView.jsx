import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { STUDENT_PROFILE } from '../../data/studentData';
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
  const student = STUDENT_PROFILE;

  const subjectAverages = [
    { subjectAr: 'الأحياء', avg: 96, testsCount: 8, lessonsDone: 14, lessonsTotal: 18 },
    { subjectAr: 'الفيزياء', avg: 88, testsCount: 6, lessonsDone: 11, lessonsTotal: 22 },
    { subjectAr: 'الكيمياء', avg: 91, testsCount: 5, lessonsDone: 8, lessonsTotal: 16 },
    { subjectAr: 'اللغة العربية', avg: 98, testsCount: 7, lessonsDone: 20, lessonsTotal: 24 },
  ];

  const weakAreas = [
    {
      topicAr: 'دورة كالفن وتفاعلات الستروما',
      subjectAr: 'الأحياء',
      mastery: 64,
      adviceAr: 'راجع الأسئلة من بنك الأخطاء وأعد سماع شرح الدقائق الأخيرة من الحصة.'
    },
    {
      topicAr: 'قانون كيرشوف والدوائر المغلقة',
      subjectAr: 'الفيزياء',
      mastery: 71,
      adviceAr: 'راجع تطبيق قاعدة الإشارات على المسارات المغلقة قبل الامتحان.'
    },
  ];

  const weeklyScores = [
    { week: 'الأسبوع 1', score: 82 },
    { week: 'الأسبوع 2', score: 86 },
    { week: 'الأسبوع 3', score: 91 },
    { week: 'الأسبوع 4', score: 89 },
    { week: 'الأسبوع 5', score: 96 },
  ];

  const maxScore = Math.max(...weeklyScores.map(w => w.score));

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
        </div>
      </SCard>
    </SPage>
  );
};
