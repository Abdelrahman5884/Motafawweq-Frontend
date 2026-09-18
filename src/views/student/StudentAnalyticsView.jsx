import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { STUDENT_PROFILE, COURSES_CATALOG } from '../../data/studentData';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Award,
  Target
} from 'lucide-react';
import {
  SPage,
  SPageHeader,
  SSection,
  SCard,
  SProgress,
  SButton,
  SStatBlock,
  SIconBox,
  SBadge,
  SDivider,
  S
} from '../../components/student/ui';

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

      {/* Subject progress */}
      <SSection title={lang === 'ar' ? 'التقدم في المواد' : 'Subject Progress'}>
        <SCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {subjectAverages.map((s, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', fontFamily: 'var(--font-arabic)' }}>
                    {s.subjectAr}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {s.lessonsDone}/{s.lessonsTotal} {lang === 'ar' ? 'حصة' : 'lessons'}
                    </span>
                    <SBadge variant={s.avg >= 90 ? 'success' : s.avg >= 75 ? 'primary' : 'warning'} size="xs">
                      {s.avg}%
                    </SBadge>
                  </div>
                </div>
                <SProgress
                  value={s.lessonsDone}
                  max={s.lessonsTotal}
                  showPercent={false}
                  color={s.avg >= 90 ? S.success : s.avg >= 75 ? S.primary : S.warning}
                  height={5}
                />
              </div>
            ))}
          </div>
        </SCard>
      </SSection>

      {/* Weekly score progression — simple bar chart */}
      <SSection title={lang === 'ar' ? 'تطور الدرجات الأسبوعي' : 'Weekly Score Trend'}>
        <SCard>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '100px' }}>
            {weeklyScores.map((w, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: '600', color: w.score === maxScore ? S.success : 'var(--text-secondary)' }}>
                  {w.score}%
                </span>
                <div style={{
                  width: '100%', borderRadius: '4px 4px 0 0',
                  backgroundColor: w.score === maxScore ? S.success : S.primary,
                  opacity: 0.8,
                  height: `${(w.score / 100) * 72}px`,
                  transition: 'height 0.4s ease'
                }} />
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-arabic)' }}>
                  {w.week.replace('الأسبوع ', 'أ')}
                </span>
              </div>
            ))}
          </div>
        </SCard>
      </SSection>

      {/* Weak areas */}
      <SSection title={lang === 'ar' ? 'يحتاج إلى مراجعة' : 'Review Needed'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {weakAreas.map((area, i) => (
            <SCard key={i}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <SIconBox icon={<AlertTriangle size={16} />} size={34} color={S.warning} bg={S.warningLight} radius={8} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-arabic)' }}>
                      {area.topicAr}
                    </div>
                    <SBadge variant="warning" size="xs">{area.mastery}% {lang === 'ar' ? 'إتقان' : 'mastery'}</SBadge>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'var(--font-arabic)' }}>
                    {area.subjectAr}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '10px', fontFamily: 'var(--font-arabic)' }}>
                    {area.adviceAr}
                  </div>
                  <SProgress value={area.mastery} height={4} color={S.warning} showPercent={false} />
                </div>
                <SButton size="sm" variant="ghost" onClick={() => navigate('/student/revision')}>
                  {lang === 'ar' ? 'مراجعة' : 'Review'}
                </SButton>
              </div>
            </SCard>
          ))}
        </div>
      </SSection>
    </SPage>
  );
};
