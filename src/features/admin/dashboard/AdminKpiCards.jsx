import React, { useState, useEffect, memo } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  TrendingUp,
  Users,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const useCountUp = (target, duration = 750) => {
  const numericTarget = Number(target) || 0;
  const [count, setCount] = useState(numericTarget);

  useEffect(() => {
    let startTimestamp = null;
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * numericTarget));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCount(numericTarget);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [numericTarget, duration]);

  return count;
};

export const AdminKpiCards = memo(({ kpis = {}, loading = false, onNavigateTab }) => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const animatedMrr = useCountUp(Math.round(Number(kpis?.mrrEgp || 0)), 750);
  const animatedUsers = useCountUp(Number(kpis?.totalUsers || 0), 800);
  const animatedActive = useCountUp(Number(kpis?.activeNowCount || 0), 700);
  const animatedLatency = useCountUp(Number(kpis?.avgLessonProcessingSeconds || 38), 650);

  const mrrGrowth = Number(kpis?.mrrGrowthPct || 0);
  const isPositiveGrowth = mrrGrowth >= 0;
  const growthPrefix = isPositiveGrowth ? '+' : '';
  const livePct = Number(kpis?.liveConnectedPct || 0);

  const cardsData = [
    {
      id: 'mrr',
      tab: 'financials',
      title: isAr ? 'الإيراد الشهري المتكرر (MRR)' : 'Monthly Recurring Revenue',
      value: `${animatedMrr.toLocaleString()}`,
      unit: isAr ? 'ج.م' : 'EGP',
      icon: TrendingUp,
      accent: '#1588C7',
      iconBg: 'rgba(21, 136, 199, 0.12)',
      badge: (
        <span style={{
          fontSize: '11px',
          color: isPositiveGrowth ? '#059669' : '#DC2626',
          backgroundColor: isPositiveGrowth ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          padding: '2px 8px',
          borderRadius: '999px',
          fontWeight: '800',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px'
        }}>
          {isPositiveGrowth ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{isAr ? `${growthPrefix}${mrrGrowth}% نمو شهري` : `${growthPrefix}${mrrGrowth}% MoM`}</span>
        </span>
      ),
      delay: '0.03s'
    },
    {
      id: 'total-users',
      tab: 'users',
      title: isAr ? 'إجمالي مستخدمي المنصة' : 'Total Registered Users',
      value: `${animatedUsers.toLocaleString()}`,
      unit: isAr ? 'حساب' : 'users',
      icon: Users,
      accent: '#0284C7',
      iconBg: 'rgba(2, 132, 199, 0.12)',
      badge: (
        <span style={{
          fontSize: '11.5px',
          color: 'var(--text-secondary)',
          fontWeight: '700'
        }}>
          {isAr
            ? `${Number(kpis?.studentsCount || 0)} طالب • ${Number(kpis?.teachersCount || 0)} معلم • ${Number(kpis?.centersCount || 0)} سنتر`
            : `${Number(kpis?.studentsCount || 0)} std • ${Number(kpis?.teachersCount || 0)} tutor • ${Number(kpis?.centersCount || 0)} ctr`}
        </span>
      ),
      delay: '0.08s'
    },
    {
      id: 'active-now',
      tab: 'attendance',
      title: isAr ? 'المتصلون والنشطون الآن' : 'Active Live Sessions',
      value: `${animatedActive.toLocaleString()}`,
      unit: isAr ? 'مستخدم' : 'online',
      icon: Activity,
      accent: '#10B981',
      iconBg: 'rgba(16, 185, 129, 0.14)',
      badge: (
        <span style={{
          fontSize: '11px',
          color: '#059669',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          padding: '2px 9px',
          borderRadius: '999px',
          fontWeight: '800',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span className="admin-radar-beacon">
            <span className="admin-radar-core" />
            <span className="admin-radar-wave" />
          </span>
          <span>{isAr ? `تفاعل لحظي (${livePct}%)` : `Live Ratio (${livePct}%)`}</span>
        </span>
      ),
      delay: '0.13s'
    },
    {
      id: 'ai-latency',
      tab: 'system',
      title: isAr ? 'سرعة معالجة الذكاء الاصطناعي' : 'AI Lecture Processing',
      value: `${animatedLatency}`,
      unit: isAr ? 'ثانية' : 'sec',
      icon: Zap,
      accent: '#6366F1',
      iconBg: 'rgba(99, 102, 241, 0.12)',
      badge: (
        <span style={{
          fontSize: '11.5px',
          color: 'var(--text-secondary)',
          fontWeight: '700'
        }}>
          {isAr ? 'متوسط تفريغ محاضرة 45 دقيقة' : 'Avg per 45m audio lecture'}
        </span>
      ),
      delay: '0.18s'
    }
  ];

  return (
    <div
      className="admin-kpi-one-line-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '16px'
      }}
    >
      {cardsData.map((c) => {
        const Icon = c.icon;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onNavigateTab && onNavigateTab(c.tab)}
            className="admin-animated-kpi-card"
            style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '18px 20px',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'inherit',
              cursor: onNavigateTab ? 'pointer' : 'default',
              animation: `adminKpiSlideUpEntrance 0.45s ${c.delay} cubic-bezier(0.16, 1, 0.3, 1) both`
            }}
          >
            {/* Top accent hairline */}
            <div style={{
              position: 'absolute',
              top: 0,
              insetInline: 0,
              height: '3px',
              background: `linear-gradient(90deg, ${c.accent}, transparent)`,
              opacity: 0.75
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', width: '100%' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                {c.title}
              </span>
              <div
                className="admin-kpi-icon-box"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '11px',
                  backgroundColor: c.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: c.accent,
                  flexShrink: 0,
                  transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <Icon size={19} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{
                fontSize: '26px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1
              }}>
                {loading ? '—' : c.value}
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: '800', color: c.accent }}>
                {c.unit}
              </span>
            </div>

            <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {c.badge}
            </div>
          </button>
        );
      })}

      <style>{`
        @media (max-width: 1100px) {
          .admin-kpi-one-line-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 580px) {
          .admin-kpi-one-line-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes adminKpiSlideUpEntrance {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .admin-animated-kpi-card { transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease, border-color 0.22s ease; }
        .admin-animated-kpi-card:hover { transform: translateY(-3px); box-shadow: 0 14px 28px -6px rgba(21, 136, 199, 0.16); border-color: rgba(21, 136, 199, 0.4) !important; }
        .admin-animated-kpi-card:hover .admin-kpi-icon-box { transform: scale(1.1) rotate(4deg); }
        .admin-radar-beacon { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 8px; height: 8px; }
        .admin-radar-core { width: 6px; height: 6px; border-radius: 50%; background-color: #10B981; z-index: 2; }
        .admin-radar-wave { position: absolute; inset: -2px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.5); animation: adminRadarPulse 1.8s cubic-bezier(0.24, 0, 0.38, 1) infinite; z-index: 1; }
        @keyframes adminRadarPulse { 0% { transform: scale(0.9); opacity: 0.9; } 70% { transform: scale(2.4); opacity: 0; } 100% { transform: scale(2.6); opacity: 0; } }
      `}</style>
    </div>
  );
});

AdminKpiCards.displayName = 'AdminKpiCards';
