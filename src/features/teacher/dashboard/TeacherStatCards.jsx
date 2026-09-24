import React from 'react';
import { DollarSign, Users, Sparkles, Award, ArrowUpRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { MOCK_TEACHER_EARNINGS } from '../../../data/mockData';

export const TeacherStatCards = ({ lang }) => {
  const { navigate } = useAuth();
  const isAr = lang === 'ar';

  const indicators = [
    {
      id: 'revenue',
      title: isAr ? 'إجمالي الأرباح' : 'Monthly Revenue',
      subtitle: isAr ? 'شهر سبتمبر' : 'September',
      value: `${MOCK_TEACHER_EARNINGS.totalRevenueEgp.toLocaleString()} ${isAr ? 'ج.م' : 'EGP'}`,
      badge: '+18.4%',
      badgeType: 'positive',
      note: isAr ? 'مقارنة بالشهر الماضي' : 'vs last month',
      icon: DollarSign,
      actionLabel: isAr ? 'تفاصيل المالية' : 'Financials',
      route: '/teacher/financials'
    },
    {
      id: 'students',
      title: isAr ? 'إجمالي الطلاب المسجلين' : 'Total Enrolled Students',
      subtitle: isAr ? 'السناتر والأونلاين' : 'Centers & Online',
      value: '3,840',
      badge: isAr ? '3 مقرات نشطة' : '3 Active Centers',
      badgeType: 'neutral',
      note: isAr ? 'الدقي، م. نصر، المنصة' : 'Dokki, Nasr City, Online',
      icon: Users,
      actionLabel: isAr ? 'قائمة الطلاب' : 'Student Roster',
      route: '/teacher/students'
    },
    {
      id: 'ai-quota',
      title: isAr ? 'رصيد الذكاء الاصطناعي' : 'AI Processing Quota',
      subtitle: isAr ? 'باقة المعلم المحترف' : 'Teacher Pro Plan',
      value: `184 / 300 ${isAr ? 'دقيقة' : 'mins'}`,
      badge: isAr ? '61% متبقي' : '61% left',
      badgeType: 'neutral',
      note: isAr ? 'تجديد الباقة في 1 أكتوبر' : 'Renews Oct 1st',
      icon: Sparkles,
      actionLabel: isAr ? 'استهلاك الذكاء' : 'AI Processing',
      route: '/teacher/processing'
    },
    {
      id: 'mastery',
      title: isAr ? 'متوسط استيعاب الدفعة' : 'Class Mastery Rate',
      subtitle: isAr ? 'كافة المراحل' : 'All Cohorts',
      value: '84.5%',
      badge: isAr ? '+8.5% أعلى' : '+8.5% higher',
      badgeType: 'positive',
      note: isAr ? 'أعلى من متوسط المحافظة (76%)' : 'Above state avg (76%)',
      icon: Award,
      actionLabel: isAr ? 'لوحة التحليلات' : 'Analytics',
      route: '/teacher/analytics'
    }
  ];

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Header bar for Indicators */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)'
          }} />
          <h2 style={{
            fontSize: '15px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            {isAr ? 'مؤشرات الأداء السريعة' : 'Executive Key Indicators'}
          </h2>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {isAr ? 'بيانات حية محدثة الآن • انقر على أي مؤشر لعرض تفاصيله' : 'Live synced data • Click to view details'}
        </span>
      </div>

      {/* Grid of 4 compact indicator cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
        gap: '14px'
      }}>
        {indicators.map((ind) => {
          const Icon = ind.icon;
          return (
            <div
              key={ind.id}
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
                overflow: 'hidden'
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
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    flexShrink: 0
                  }}>
                    <Icon size={16} />
                  </div>
                  <div>
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
                  backgroundColor: ind.badgeType === 'positive'
                    ? 'rgba(16, 185, 129, 0.12)'
                    : 'var(--bg-subtle)',
                  color: ind.badgeType === 'positive'
                    ? 'var(--success)'
                    : 'var(--text-secondary)',
                  border: `1px solid ${ind.badgeType === 'positive' ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'}`,
                  whiteSpace: 'nowrap'
                }}>
                  {ind.badge}
                </span>
              </div>

              {/* Main Metric Value */}
              <div style={{
                fontSize: '24px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em',
                marginBottom: '6px'
              }}>
                {ind.value}
              </div>

              {/* Bottom Note & Quick Action link */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
                paddingTop: '8px',
                borderTop: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)'
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
                  flexShrink: 0
                }}>
                  {ind.actionLabel}
                  <ArrowUpRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
