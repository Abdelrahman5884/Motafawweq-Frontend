import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  STUDENT_PROFILE,
  TODAY_TASKS,
  UPCOMING_EXAMS,
  COURSES_CATALOG,
  MISTAKE_BANK
} from '../../data/studentData';
import {
  Play,
  BookOpen,
  FileText,
  ClipboardList,
  RotateCcw,
  Calendar,
  Mic,
  ChevronLeft,
  Clock,
  AlertCircle,
  Trophy,
  Flame
} from 'lucide-react';
import {
  SPage,
  SPageHeader,
  SSection,
  SCard,
  SPrimaryCard,
  SRowItem,
  SBadge,
  SStatusBadge,
  SProgress,
  SButton,
  STextLink,
  SStatBlock,
  SIconBox,
  SDivider,
  SEmptyState
} from '../../components/student/ui';
import { StudentFutureFeaturesModal } from '../../components/student/StudentFutureFeaturesModal';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const student = STUDENT_PROFILE;
  const [futureModalOpen, setFutureModalOpen] = useState(false);
  const [futureModalTab, setFutureModalTab] = useState('live');

  const activeCourse = COURSES_CATALOG[0]; // last studied course
  const mistakesCount = MISTAKE_BANK.filter(m => !m.solvedCorrectlyNow).length;

  // Subject progress data derived from enrolled courses
  const subjectProgress = COURSES_CATALOG.filter(c => c.isEnrolled).map(c => ({
    name: c.subjectAr,
    pct: c.progressPercent
  }));

  // Task type metadata
  const taskMeta = {
    lesson:   { icon: <Play size={16} />,       color: '#6C4BFF', bg: '#F0EEFF' },
    homework: { icon: <FileText size={16} />,    color: '#F25C5C', bg: '#FFF0F0' },
    quiz:     { icon: <ClipboardList size={16} />, color: '#F5A623', bg: '#FFF8EC' },
    exam:     { icon: <AlertCircle size={16} />, color: '#F25C5C', bg: '#FFF0F0' },
  };

  const taskActionLabel = {
    lesson:   lang === 'ar' ? 'أكمل' : 'Continue',
    homework: lang === 'ar' ? 'حل' : 'Solve',
    quiz:     lang === 'ar' ? 'ابدأ' : 'Start',
    exam:     lang === 'ar' ? 'دخول' : 'Enter',
  };

  // Upcoming items (nearest exam + nearest homework)
  const nearestExam = UPCOMING_EXAMS[0];
  const nearestHomework = (MISTAKE_BANK.length > 0) ? null : null;

  return (
    <SPage>
      {/* ── Page Header: greeting + key stats ─────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0,
            fontFamily: 'var(--font-arabic)'
          }}>
            {lang === 'ar' ? `مرحبًا، ${student.nameAr.split(' ')[0]}` : `Hello, ${student.name.split(' ')[0]}`}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '3px 0 0', fontWeight: '400', fontFamily: 'var(--font-arabic)' }}>
            {student.gradeNameAr} — {student.trackAr}
          </p>
        </div>

        {/* Streak + XP pills — compact, secondary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 10px', borderRadius: '99px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)'
          }}>
            <Flame size={13} color="#F5A623" />
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {student.streakDays} {lang === 'ar' ? 'يوم' : 'days'}
            </span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 10px', borderRadius: '99px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)'
          }}>
            <Trophy size={13} color="#6C4BFF" />
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {student.xp.toLocaleString()} XP
            </span>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: Continue Learning — PRIMARY, DOMINANT ─────────── */}
      <div style={{ marginBottom: '28px' }}>
        <SPrimaryCard>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            {/* Left: lesson info */}
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <SIconBox
                  icon={<BookOpen size={16} />}
                  size={32}
                  color="#6C4BFF"
                  bg="#F0EEFF"
                />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '400', fontFamily: 'var(--font-arabic)' }}>
                    {activeCourse.subjectAr} — {activeCourse.teacher.nameAr}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6C4BFF', fontWeight: '600', fontFamily: 'var(--font-arabic)' }}>
                    {lang === 'ar' ? 'أكمل من حيث توقفت' : 'Continue Learning'}
                  </div>
                </div>
              </div>

              <h2 style={{
                fontSize: '17px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: '0 0 12px',
                lineHeight: 1.4,
                fontFamily: 'var(--font-arabic)'
              }}>
                {activeCourse.lastLessonTitleAr}
              </h2>

              {/* Progress */}
              <SProgress
                value={activeCourse.progressPercent}
                label={lang === 'ar' ? `توقفت عند الدقيقة ${activeCourse.lastLessonTimeFormatted}` : `Left at ${activeCourse.lastLessonTimeFormatted}`}
                style={{ maxWidth: '380px', marginBottom: '16px' }}
              />

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <SButton
                  onClick={() => navigate('/student/lesson')}
                  icon={<Play size={15} fill="#fff" />}
                >
                  {lang === 'ar' ? 'أكمل الدرس' : 'Continue Lesson'}
                </SButton>
                <SButton
                  onClick={() => navigate('/student/courses')}
                  variant="ghost"
                >
                  {lang === 'ar' ? 'عرض تفاصيل الدرس' : 'Lesson Details'}
                </SButton>
              </div>
            </div>

            {/* Right: compact stats */}
            <div style={{
              display: 'flex',
              gap: '24px',
              flexShrink: 0,
              alignItems: 'flex-start',
              flexWrap: 'wrap'
            }}>
              <SStatBlock
                value={`${student.completedLessonsCount}/${student.totalEnrolledLessons}`}
                label={lang === 'ar' ? 'حصة مكتملة' : 'Lessons done'}
                color="var(--text-primary)"
              />
              <SStatBlock
                value={student.overallGpa}
                label={lang === 'ar' ? 'المعدل العام' : 'GPA'}
                color="#14B87A"
              />
              <SStatBlock
                value={`${student.studyMinutesToday}د`}
                label={lang === 'ar' ? 'مذاكرة اليوم' : 'Today'}
                color="#6C4BFF"
              />
            </div>
          </div>
        </SPrimaryCard>
      </div>

      {/* ── SECTION 2: Today's Tasks + Upcoming — 2 columns ─────────── */}
      <div className="s-grid-2col" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '28px'
      }}>
        {/* Today's Tasks */}
        <SCard padding={0} style={{ overflow: 'hidden' }}>
          <div style={{
            padding: '16px 16px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#6C4BFF" />
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-arabic)' }}>
                {lang === 'ar' ? 'مهام اليوم' : "Today's Tasks"}
              </span>
            </div>
            <SBadge variant="primary" size="xs">{TODAY_TASKS.length}</SBadge>
          </div>
          <SDivider />
          <div style={{ padding: '8px 0' }}>
            {TODAY_TASKS.length === 0 ? (
              <SEmptyState
                icon={<ClipboardList size={20} />}
                title={lang === 'ar' ? 'لا توجد مهام اليوم' : 'No tasks today'}
              />
            ) : (
              TODAY_TASKS.map((task, i) => {
                const meta = taskMeta[task.type] || taskMeta.lesson;
                return (
                  <div key={task.id}>
                    <div
                      onClick={() => navigate(task.actionRoute)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.12s ease'
                      }}
                      className="s-row-clickable"
                    >
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '8px',
                        backgroundColor: meta.bg, color: meta.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {meta.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '13px', fontWeight: '500',
                          color: 'var(--text-primary)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          fontFamily: 'var(--font-arabic)'
                        }}>
                          {task.titleAr}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {task.subjectAr} · {task.deadline}
                        </div>
                      </div>
                      <SBadge variant={task.priority === 'urgent' ? 'error' : task.priority === 'high' ? 'warning' : 'default'} size="xs">
                        {taskActionLabel[task.type]}
                      </SBadge>
                    </div>
                    {i < TODAY_TASKS.length - 1 && <SDivider />}
                  </div>
                );
              })
            )}
          </div>
        </SCard>

        {/* Upcoming */}
        <SCard padding={0} style={{ overflow: 'hidden' }}>
          <div style={{
            padding: '16px 16px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#F5A623" />
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-arabic)' }}>
                {lang === 'ar' ? 'الاختبارات القادمة' : 'Upcoming'}
              </span>
            </div>
            <STextLink onClick={() => navigate('/student/exam')}>
              {lang === 'ar' ? 'عرض الكل' : 'See all'}
            </STextLink>
          </div>
          <SDivider />
          <div style={{ padding: '8px 0' }}>
            {UPCOMING_EXAMS.length === 0 ? (
              <SEmptyState
                icon={<Calendar size={20} />}
                title={lang === 'ar' ? 'لا توجد اختبارات قادمة' : 'No upcoming exams'}
              />
            ) : (
              UPCOMING_EXAMS.map((exam, i) => (
                <div key={exam.id}>
                  <div
                    onClick={() => navigate('/student/exam')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 16px', cursor: 'pointer'
                    }}
                    className="s-row-clickable"
                  >
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '8px',
                      backgroundColor: '#FFF8EC', color: '#F5A623',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <AlertCircle size={15} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        fontFamily: 'var(--font-arabic)'
                      }}>
                        {exam.titleAr}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {exam.subjectAr} · {exam.date} · {exam.durationMinutes}{lang === 'ar' ? 'د' : 'min'}
                      </div>
                    </div>
                    <SStatusBadge status={exam.status} />
                  </div>
                  {i < UPCOMING_EXAMS.length - 1 && <SDivider />}
                </div>
              ))
            )}
          </div>
        </SCard>
      </div>

      {/* ── SECTION 3: Subject Progress ───────────────────────────────── */}
      <SSection
        title={lang === 'ar' ? 'التقدم في المواد' : 'Subject Progress'}
        action={<STextLink onClick={() => navigate('/student/analytics')}>{lang === 'ar' ? 'التفاصيل' : 'Details'}</STextLink>}
      >
        <SCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {subjectProgress.map((s, i) => (
              <SProgress
                key={i}
                label={s.name}
                value={s.pct}
                color={s.pct >= 80 ? '#14B87A' : s.pct >= 60 ? '#6C4BFF' : '#F5A623'}
                height={5}
              />
            ))}
          </div>
        </SCard>
      </SSection>

      {/* ── SECTION 4: Review Needed ──────────────────────────────────── */}
      {mistakesCount > 0 && (
        <SSection
          title={lang === 'ar' ? 'يحتاج إلى مراجعة' : 'Review Needed'}
          action={<STextLink onClick={() => navigate('/student/revision')}>{lang === 'ar' ? 'عرض الكل' : 'See all'}</STextLink>}
        >
          <SCard padding={0} style={{ overflow: 'hidden' }}>
            {MISTAKE_BANK.filter(m => !m.solvedCorrectlyNow).slice(0, 3).map((m, i, arr) => (
              <div key={m.id}>
                <div
                  onClick={() => navigate('/student/revision')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 16px', cursor: 'pointer'
                  }}
                  className="s-row-clickable"
                >
                  <SIconBox icon={<RotateCcw size={15} />} size={30} color="#F25C5C" bg="#FFF0F0" radius={7} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-arabic)'
                    }}>
                      {m.questionAr || m.topicAr || `سؤال ${i + 1}`}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {m.subjectAr} · {lang === 'ar' ? 'إجابة خاطئة' : 'Incorrect answer'}
                    </div>
                  </div>
                  <SButton size="sm" variant="subtle" onClick={(e) => { e.stopPropagation(); navigate('/student/revision'); }}>
                    {lang === 'ar' ? 'مراجعة' : 'Review'}
                  </SButton>
                </div>
                {i < arr.length - 1 && <SDivider />}
              </div>
            ))}
          </SCard>
        </SSection>
      )}

      {/* ── SECTION 5: Lecture Conversion — Professional CTA ─────────── */}
      <SSection>
        <SCard
          onClick={() => navigate('/student/smart-lecture')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <SIconBox
              icon={<Mic size={18} />}
              size={42}
              color="#6C4BFF"
              bg="#F0EEFF"
              radius={10}
            />
            <div>
              <div style={{
                fontSize: '15px', fontWeight: '600',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-arabic)'
              }}>
                {lang === 'ar' ? 'تحويل المحاضرة' : 'Lecture Conversion'}
              </div>
              <div style={{
                fontSize: '12px', color: 'var(--text-secondary)',
                marginTop: '2px', maxWidth: '340px',
                lineHeight: 1.5, fontFamily: 'var(--font-arabic)'
              }}>
                {lang === 'ar'
                  ? 'حوّل تسجيل المحاضرة إلى نص منظم وخريطة للمحتوى وأسئلة للمراجعة.'
                  : 'Convert a lecture recording into organized notes, a content map, and review questions.'}
              </div>
            </div>
          </div>
          <SButton
            onClick={() => navigate('/student/smart-lecture')}
            variant="subtle"
          >
            {lang === 'ar' ? 'إضافة محاضرة' : 'Add Lecture'}
          </SButton>
        </SCard>
      </SSection>

      {/* Future features modal */}
      <StudentFutureFeaturesModal
        isOpen={futureModalOpen}
        defaultTab={futureModalTab}
        onClose={() => setFutureModalOpen(false)}
      />
    </SPage>
  );
};
