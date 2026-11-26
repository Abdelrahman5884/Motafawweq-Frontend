import React from 'react';
import {
  Bell,
  Clock,
  AlertCircle,
  BookOpen,
  FileText,
  Award,
  CreditCard,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { ParentAvatar } from './ParentAvatar';
import { ChildSessionAndFeedback } from './ChildSessionAndFeedback';

export const ParentOverviewTab = ({
  activeChild,
  childDashboard,
  lang,
  isRtl,
  onNavigateTab,
}) => {
  if (!activeChild) return null;

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const courses = childDashboard?.courses?.items || [];
  const avgCourseProgress = Number(childDashboard?.courses?.summary?.avgProgress ?? 0);
  const hwSummary = childDashboard?.homework?.summary || { total: 0, pending: 0, overdue: 0, graded: 0 };
  const finSummary = childDashboard?.financials?.summary || { totalPaidEgp: 0, dueAmountEgp: 0 };
  const latestExam = activeChild.latestExam || childDashboard?.exams?.items?.[0] || null;
  const latestAttendance = activeChild.latestAttendance || childDashboard?.attendance?.items?.[0] || null;
  const recentAlerts = activeChild.recentAlerts || [];

  const highlightCards = [
    {
      key: 'courses',
      icon: BookOpen,
      accent: 'var(--primary)',
      bg: 'rgba(21, 136, 199, 0.1)',
      label: lang === 'ar' ? 'المقررات والمجموعات' : 'Courses & Groups',
      value: courses.length,
      meta: courses.length > 0
        ? (lang === 'ar' ? `متوسط التقدم ${avgCourseProgress}%` : `Avg progress ${avgCourseProgress}%`)
        : (lang === 'ar' ? 'لا توجد مقررات نشطة' : 'No active courses'),
    },
    {
      key: 'homework',
      icon: FileText,
      accent: hwSummary.overdue > 0 ? '#DC2626' : hwSummary.pending > 0 ? '#D97706' : 'var(--success, #16A34A)',
      bg: hwSummary.overdue > 0
        ? 'rgba(239, 68, 68, 0.1)'
        : hwSummary.pending > 0
        ? 'rgba(245, 158, 11, 0.12)'
        : 'rgba(22, 163, 74, 0.1)',
      label: lang === 'ar' ? 'الواجبات' : 'Homework',
      value: hwSummary.pending > 0
        ? (lang === 'ar' ? `${hwSummary.pending} قيد التسليم` : `${hwSummary.pending} pending`)
        : (lang === 'ar' ? `${hwSummary.graded} مصحّح` : `${hwSummary.graded} graded`),
      meta: hwSummary.overdue > 0
        ? (lang === 'ar' ? `${hwSummary.overdue} متأخر عن الموعد` : `${hwSummary.overdue} overdue`)
        : (lang === 'ar' ? `إجمالي ${hwSummary.total} واجب` : `${hwSummary.total} total`),
    },
    {
      key: 'exams',
      icon: Award,
      accent: latestExam?.isPassed === false ? '#DC2626' : 'var(--success, #16A34A)',
      bg: latestExam?.isPassed === false ? 'rgba(239, 68, 68, 0.1)' : 'rgba(22, 163, 74, 0.1)',
      label: lang === 'ar' ? 'أحدث اختبار' : 'Latest Exam',
      value: latestExam
        ? (latestExam.score !== null && latestExam.score !== undefined
            ? `${latestExam.score}/${latestExam.maxScore}`
            : (lang === 'ar' ? 'قيد التصحيح' : 'Pending'))
        : '—',
      meta: latestExam
        ? (latestExam.subjectAr || latestExam.titleAr)
        : (lang === 'ar' ? 'لا توجد اختبارات بعد' : 'No exams yet'),
    },
    {
      key: 'financials',
      icon: CreditCard,
      accent: Number(finSummary.dueAmountEgp || 0) > 0 ? '#DC2626' : 'var(--primary)',
      bg: Number(finSummary.dueAmountEgp || 0) > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(21, 136, 199, 0.1)',
      label: lang === 'ar' ? 'الوضع المالي' : 'Tuition Status',
      value: Number(finSummary.dueAmountEgp || 0) > 0
        ? `${Number(finSummary.dueAmountEgp).toLocaleString()} ${lang === 'ar' ? 'ج.م' : 'EGP'}`
        : (lang === 'ar' ? 'لا توجد متأخرات' : 'Up to date'),
      meta: Number(finSummary.dueAmountEgp || 0) > 0
        ? (lang === 'ar' ? 'مستحق السداد' : 'Balance due')
        : (lang === 'ar'
            ? `إجمالي المسدد: ${Number(finSummary.totalPaidEgp || 0).toLocaleString()} ج.م`
            : `Total paid: ${Number(finSummary.totalPaidEgp || 0).toLocaleString()} EGP`),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Actionable Quick Highlights Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
      }}>
        {highlightCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => onNavigateTab(card.key)}
              style={{
                textAlign: isRtl ? 'right' : 'left',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '16px 18px',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: card.bg,
                  color: card.accent,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={17} />
                </span>
                <ArrowIcon size={14} color="var(--text-secondary)" />
              </div>
              <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {card.label}
              </div>
              <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {card.value}
              </div>
              <div style={{
                fontSize: '11.5px',
                fontWeight: '600',
                color: card.accent,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {card.meta}
              </div>
            </button>
          );
        })}
      </div>

      {/* Upcoming Session & Latest Teacher Feedback */}
      <ChildSessionAndFeedback activeChild={activeChild} lang={lang} />

      {/* Latest Gate Check-in Notification */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'آخر تسجيل حضور بالسنتر' : 'Latest Gate Check-in'}
            </h3>
          </div>
          {latestAttendance && (
            <span style={{
              fontSize: '11px',
              padding: '3px 9px',
              borderRadius: '99px',
              backgroundColor: latestAttendance.status === 'present'
                ? 'rgba(22, 163, 74, 0.12)'
                : latestAttendance.status === 'absent'
                ? 'rgba(239, 68, 68, 0.12)'
                : 'rgba(245, 158, 11, 0.12)',
              color: latestAttendance.status === 'present'
                ? 'var(--color-success, #16A34A)'
                : latestAttendance.status === 'absent'
                ? '#DC2626'
                : '#D97706',
              fontWeight: '700',
            }}>
              {lang === 'ar' ? latestAttendance.statusAr : latestAttendance.statusEn}
            </span>
          )}
        </div>

        {latestAttendance ? (
          <div style={{
            padding: '15px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? latestAttendance.subjectAr : latestAttendance.subjectEn}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                {latestAttendance.roomAr} • {lang === 'ar' ? latestAttendance.dateAr : latestAttendance.date}
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-surface)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}>
              <Clock size={14} color="var(--primary)" />
              <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? latestAttendance.scanTime : latestAttendance.scanTimeEn}
              </span>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '6px 0' }}>
            {lang === 'ar' ? 'لا توجد سجلات حضور مسجلة لهذا الطالب حتى الآن.' : 'No attendance records logged yet.'}
          </div>
        )}
      </div>

      {/* Recent Center Absence Alerts */}
      {recentAlerts.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 'var(--radius-xl)',
          padding: '18px 20px',
        }}>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#B45309', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{lang === 'ar' ? 'تنبيهات السنتر الأخيرة' : 'Recent Center Alerts'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentAlerts.map((alertItem) => (
              <div key={alertItem.id} style={{ fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                <strong>{alertItem.date || ''}</strong> {alertItem.groupNameAr ? `(${alertItem.groupNameAr}) — ` : ''}
                {alertItem.messageAr}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Enrolled Courses Row */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'المقررات والمجموعات الحالية' : 'Current Courses & Groups'}
          </h3>
          <button
            type="button"
            onClick={() => onNavigateTab('courses')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>{lang === 'ar' ? 'عرض الكل' : 'View all'}</span>
            <ArrowIcon size={14} />
          </button>
        </div>

        {courses.length === 0 ? (
          <div style={{
            padding: '28px 20px',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px dashed var(--border-medium)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '600',
          }}>
            {lang === 'ar' ? 'لا توجد مقررات أو مجموعات مسجل بها الطالب بعد.' : 'No enrolled courses or study groups yet.'}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {courses.slice(0, 4).map((course) => (
              <div
                key={course.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <ParentAvatar src={course.teacherAvatar} name={course.teacherNameAr} size={40} />
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{
                      fontSize: '14.5px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {lang === 'ar' ? course.nameAr : course.name}
                    </h4>
                    <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700', marginTop: '2px' }}>
                      {lang === 'ar' ? course.teacherNameAr : course.teacherName}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>{lang === 'ar' ? 'الإنجاز:' : 'Progress:'}</span>
                    <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{course.progress}%</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '99px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                    <div style={{ width: `${course.progress}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '99px' }} />
                  </div>
                </div>

                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {lang === 'ar' ? 'آخر تحديث:' : 'Latest:'}{' '}
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                    {lang === 'ar' ? course.lastLessonAr : course.lastLesson}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
