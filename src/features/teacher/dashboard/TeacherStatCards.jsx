import React from 'react';
import { DollarSign, Users, BookOpen, Award, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const BADGE_STYLES = {
  positive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    color: 'var(--success)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
  },
  warning: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    color: '#D97706',
    border: '1px solid rgba(245, 158, 11, 0.28)',
  },
  neutral: {
    backgroundColor: 'var(--bg-subtle)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-subtle)',
  },
};

export const TeacherStatCards = ({ lang, stats }) => {
  const { navigate } = useAuth();
  const isAr = lang === 'ar';

  const revenueEgp = Number(stats?.revenueEgp || 0);
  const confirmedPaymentsCount = Number(stats?.confirmedPaymentsCount || 0);
  const pendingPaymentsCount = Number(stats?.pendingPaymentsCount || 0);
  const isConfirmedRevenue = stats?.revenueSource === 'confirmed_payments';

  const totalStudents = Number(stats?.totalStudents || 0);
  const maxStudents = stats?.maxStudents ?? null;
  const activeGroupsCount = Number(stats?.activeGroupsCount || 0);

  const activeCoursesCount = Number(stats?.activeCoursesCount || 0);
  const maxCourses = stats?.maxCourses ?? null;
  const totalLessonsCount = Number(stats?.totalLessonsCount || 0);

  const pendingGradingCount = Number(stats?.pendingGradingCount || 0);
  const pendingHomeworkCount = Number(stats?.pendingHomeworkCount || 0);
  const pendingExamCount = Number(stats?.pendingExamCount || 0);

  const revenueBadge = pendingPaymentsCount > 0
    ? {
        label: isAr ? `${pendingPaymentsCount} قيد المراجعة` : `${pendingPaymentsCount} pending`,
        type: 'warning',
      }
    : confirmedPaymentsCount > 0
      ? {
          label: isAr ? `${confirmedPaymentsCount} دفعة مؤكدة` : `${confirmedPaymentsCount} confirmed`,
          type: 'positive',
        }
      : {
          label: isAr ? 'محدّث' : 'Live',
          type: 'neutral',
        };

  const studentsBadge = maxStudents
    ? `${totalStudents} / ${maxStudents}`
    : isAr
      ? `${activeGroupsCount} مجموعة`
      : `${activeGroupsCount} groups`;

  const coursesBadge = maxCourses
    ? (isAr ? `${activeCoursesCount} / ${maxCourses} مقرر` : `${activeCoursesCount} / ${maxCourses} courses`)
    : (isAr ? `${activeCoursesCount} مقرر (مفتوح)` : `${activeCoursesCount} courses`);

  const gradingRoute = pendingHomeworkCount === 0 && pendingExamCount > 0
    ? '/teacher/exams'
    : '/teacher/homework';

  const indicators = [
    {
      id: 'revenue',
      title: isAr ? 'إجمالي الأرباح' : 'Total Revenue',
      subtitle: isConfirmedRevenue
        ? (isAr ? 'المدفوعات المؤكدة' : 'Confirmed direct payments')
        : (isAr ? 'تقدير اشتراكات المجموعات' : 'Estimated group tuition'),
      value: `${revenueEgp.toLocaleString()} ${isAr ? 'ج.م' : 'EGP'}`,
      badge: revenueBadge.label,
      badgeType: revenueBadge.type,
      note: isConfirmedRevenue
        ? (isAr ? 'صافي التحويلات المؤكدة بالمحفظة' : 'Verified wallet transfers')
        : (isAr ? 'وفق عدد الطلاب وأسعار المجموعات' : 'Based on active group pricing'),
      icon: DollarSign,
      actionLabel: isAr ? 'تفاصيل المالية' : 'Financials',
      route: '/teacher/financials',
    },
    {
      id: 'students',
      title: isAr ? 'إجمالي الطلاب المسجلين' : 'Enrolled Students',
      subtitle: isAr ? 'السناتر والأونلاين' : 'Centers & Online',
      value: totalStudents.toLocaleString(),
      badge: studentsBadge,
      badgeType: totalStudents > 0 ? 'positive' : 'neutral',
      note: isAr
        ? `موزعون على ${activeGroupsCount} مجموعة نشطة`
        : `Across ${activeGroupsCount} active groups`,
      icon: Users,
      actionLabel: isAr ? 'سجل الطلاب' : 'Student Roster',
      route: '/teacher/students',
    },
    {
      id: 'courses',
      title: isAr ? 'المقررات والحصص' : 'Courses & Lessons',
      subtitle: isAr ? 'المحتوى التعليمي المنشور' : 'Published curriculum',
      value: `${totalLessonsCount.toLocaleString()} ${isAr ? 'حصة' : 'lessons'}`,
      badge: coursesBadge,
      badgeType: 'neutral',
      note: isAr
        ? `${activeCoursesCount} مقرر دراسي • متوسط الحضور ${Number(stats?.attendanceRate || 0)}%`
        : `${activeCoursesCount} courses • ${Number(stats?.attendanceRate || 0)}% avg attendance`,
      icon: BookOpen,
      actionLabel: isAr ? 'إدارة المقررات' : 'Courses',
      route: '/teacher/courses',
    },
    {
      id: 'pending-grading',
      title: isAr ? 'بانتظار التصحيح' : 'Pending Grading',
      subtitle: isAr ? 'الواجبات والامتحانات' : 'Homework & Exams',
      value: pendingGradingCount.toLocaleString(),
      badge: pendingGradingCount > 0
        ? (isAr ? 'بحاجة لتصحيح' : 'Needs Review')
        : (isAr ? 'مكتمل' : 'Up to date'),
      badgeType: pendingGradingCount > 0 ? 'warning' : 'positive',
      note: isAr
        ? `${pendingHomeworkCount} واجب • ${pendingExamCount} امتحان`
        : `${pendingHomeworkCount} homework • ${pendingExamCount} exams`,
      icon: Award,
      actionLabel: pendingHomeworkCount === 0 && pendingExamCount > 0
        ? (isAr ? 'تصحيح الامتحانات' : 'Exams')
        : (isAr ? 'تصحيح الواجبات' : 'Homework'),
      route: gradingRoute,
    },
  ];

  return (
    <div>
      {/* Header bar for Indicators */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
          }} />
          <h2 style={{
            fontSize: '15px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: 0,
          }}>
            {isAr ? 'مؤشرات الأداء السريعة' : 'Executive Key Indicators'}
          </h2>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {isAr ? 'بيانات حية محدثة الآن • انقر على أي مؤشر لعرض تفاصيله' : 'Live synced data • Click any indicator for details'}
        </span>
      </div>

      {/* Grid of 4 compact indicator cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
        gap: '14px',
      }}>
        {indicators.map((ind) => {
          const Icon = ind.icon;
          const badgeStyle = BADGE_STYLES[ind.badgeType] || BADGE_STYLES.neutral;
          return (
            <button
              key={ind.id}
              type="button"
              onClick={() => navigate(ind.route)}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 18px',
                boxShadow: 'var(--shadow-xs)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'inherit',
                fontFamily: 'inherit',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
              }}
            >
              {/* Top Row: Icon + Title + Badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '10px', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    flexShrink: 0,
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                      {ind.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {ind.subtitle}
                    </div>
                  </div>
                </div>

                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 7px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  ...badgeStyle,
                }}>
                  {ind.badge}
                </span>
              </div>

              {/* Main Metric Value */}
              <div style={{
                fontSize: '23px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading), var(--font-arabic)',
                letterSpacing: '-0.02em',
                marginBottom: '6px',
              }}>
                {ind.value}
              </div>

              {/* Bottom Note & Quick Action link */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                width: '100%',
                fontSize: '11px',
                paddingTop: '8px',
                borderTop: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
              }}>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ind.note}
                </span>
                <span style={{
                  color: 'var(--primary)',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  flexShrink: 0,
                }}>
                  {ind.actionLabel}
                  <ArrowUpRight size={12} />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
