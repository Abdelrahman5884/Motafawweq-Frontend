import React from 'react';
import { ArrowUpRight, Building2, GraduationCap, Layers, Users } from 'lucide-react';

const BADGE_STYLES = {
  positive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    color: 'var(--success, #10B981)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
  },
  warning: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    color: '#D97706',
    border: '1px solid rgba(245, 158, 11, 0.28)',
  },
  accent: {
    backgroundColor: 'rgba(21, 136, 199, 0.12)',
    color: 'var(--primary)',
    border: '1px solid rgba(21, 136, 199, 0.25)',
  },
  neutral: {
    backgroundColor: 'var(--bg-subtle)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-subtle)',
  },
};

const PERIOD_SUBLABEL = {
  today: { ar: 'حضور اليوم', en: 'Active today' },
  month: { ar: 'حضور الشهر', en: 'Active this month' },
  year: { ar: 'حضور العام', en: 'Active this year' },
};

/**
 * Renders the four core operational KPI cards matching the clean teacher-dashboard hierarchy.
 */
export const CenterKpiCards = ({
  kpis = {},
  period = 'today',
  isAr = true,
  onNavigate,
}) => {
  const activeStudents = Number(kpis.activeStudents ?? 0);
  const totalRegistered = Number(kpis.totalRegisteredStudents ?? 0);
  const activeStudentsPct = Number(kpis.activeStudentsPct ?? 0);
  const roomsCount = Number(kpis.roomsCount ?? 0);
  const totalCapacity = Number(kpis.totalCapacity ?? 0);
  const overallOccupancyPct = Number(kpis.overallOccupancyPct ?? 0);
  const activeGroupsCount = Number(kpis.activeGroupsCount ?? 0);
  const teachersCount = Number(kpis.teachersCount ?? 0);
  const targetAttendancePct = Number(kpis.targetAttendancePct ?? 0);
  const targetUtilizationPct = Number(kpis.targetUtilizationPct ?? 0);

  const periodCaption = PERIOD_SUBLABEL[period] || PERIOD_SUBLABEL.today;

  const cards = [
    {
      id: 'students',
      to: '/center/attendance',
      icon: Users,
      title: isAr ? 'الطلاب الحاضرون / المسجلون' : 'Active / Registered Students',
      subtitle: isAr ? periodCaption.ar : periodCaption.en,
      value: activeStudents.toLocaleString(),
      badge: `${activeStudentsPct}%`,
      badgeType: activeStudentsPct > 0 ? 'accent' : 'neutral',
      note: isAr
        ? `من أصل ${totalRegistered.toLocaleString()} طالب • المستهدف ${targetAttendancePct}%`
        : `Out of ${totalRegistered.toLocaleString()} • Target ${targetAttendancePct}%`,
      actionLabel: isAr ? 'سجل الحضور' : 'Attendance',
    },
    {
      id: 'halls',
      to: '/center/halls',
      icon: Building2,
      title: isAr ? 'إشغال القاعات والاستيعاب' : 'Halls & Capacity Occupancy',
      subtitle: isAr ? `${roomsCount} قاعة دراسية` : `${roomsCount} classrooms`,
      value: `${overallOccupancyPct}%`,
      badge: isAr ? `${roomsCount} قاعة` : `${roomsCount} halls`,
      badgeType: overallOccupancyPct > 0 ? 'positive' : 'neutral',
      note: isAr
        ? `السعة ${totalCapacity.toLocaleString()} مقعد • المستهدف ${targetUtilizationPct}%`
        : `${totalCapacity.toLocaleString()} seats • Target ${targetUtilizationPct}%`,
      actionLabel: isAr ? 'القاعات' : 'Halls',
    },
    {
      id: 'groups',
      to: '/center/groups',
      icon: Layers,
      title: isAr ? 'المجموعات والصفوف النشطة' : 'Active Learning Cohorts',
      subtitle: isAr ? 'الجداول والتسجيلات' : 'Schedules & rosters',
      value: activeGroupsCount.toLocaleString(),
      badge: activeGroupsCount > 0 ? (isAr ? 'نشط' : 'Active') : (isAr ? 'فارغ' : 'Empty'),
      badgeType: activeGroupsCount > 0 ? 'accent' : 'neutral',
      note: isAr
        ? `${totalRegistered.toLocaleString()} طالب مقيد بالمجموعات`
        : `${totalRegistered.toLocaleString()} enrolled students`,
      actionLabel: isAr ? 'المجموعات' : 'Groups',
    },
    {
      id: 'teachers',
      to: '/center/operations',
      icon: GraduationCap,
      title: isAr ? 'هيئة التدريس بالسنتر' : 'Center Faculty & Teachers',
      subtitle: isAr ? 'العقود والدعوات والفروع' : 'Contracts & branches',
      value: teachersCount.toLocaleString(),
      badge: isAr ? 'معلم' : 'Teachers',
      badgeType: teachersCount > 0 ? 'positive' : 'neutral',
      note: isAr
        ? 'إدارة العقود وربط المعلمين بالفروع'
        : 'Manage faculty contracts & invites',
      actionLabel: isAr ? 'المعلمون' : 'Faculty',
    },
  ];

  return (
    <div>
      {/* Section Title Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
            }}
          />
          <h2
            style={{
              fontSize: '15px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {isAr ? 'مؤشرات الأداء السريعة' : 'Executive Key Indicators'}
          </h2>
        </div>

        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {isAr
            ? 'بيانات حية محدثة الآن • انقر على أي مؤشر لعرض تفاصيله'
            : 'Live synced metrics • Click any card for details'}
        </span>
      </div>

      {/* Responsive 4-Card Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 245px), 1fr))',
          gap: '16px',
        }}
      >
        {cards.map((card) => {
          const Icon = card.icon;
          const badgeStyle = BADGE_STYLES[card.badgeType] || BADGE_STYLES.neutral;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onNavigate?.(card.to)}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px 20px',
                boxShadow: 'var(--shadow-xs)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                textAlign: isAr ? 'right' : 'left',
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
              {/* Top Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '8px',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={17} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '12.5px',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        lineHeight: 1.25,
                      }}
                    >
                      {card.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {card.subtitle}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    ...badgeStyle,
                  }}
                >
                  {card.badge}
                </span>
              </div>

              {/* Metric Value */}
              <div
                style={{
                  fontSize: '26px',
                  fontWeight: '900',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-heading), var(--font-arabic)',
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                }}
              >
                {card.value}
              </div>

              {/* Bottom Divider & Action */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  width: '100%',
                  fontSize: '11px',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {card.note}
                </span>
                <span
                  style={{
                    color: 'var(--primary)',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    flexShrink: 0,
                  }}
                >
                  <span>{card.actionLabel}</span>
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
