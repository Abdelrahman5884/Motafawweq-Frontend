import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  TrendingUp,
  Users,
  Activity,
  Zap,
  ArrowUpRight
} from 'lucide-react';

const useCountUp = (target, duration = 900) => {
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

export const AdminKpiCards = ({ kpis = {} }) => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const animatedMrr = useCountUp(Math.round(Number(kpis?.mrrEgp || 0)), 900);
  const animatedUsers = useCountUp(Number(kpis?.totalUsers || 0), 950);
  const animatedActive = useCountUp(Number(kpis?.activeNowCount || 0), 850);
  const animatedLatency = useCountUp(Number(kpis?.avgLessonProcessingSeconds || 38), 750);

  const mrrGrowth = Number(kpis?.mrrGrowthPct || 0);
  const growthPrefix = mrrGrowth >= 0 ? '+' : '';
  const livePct = Number(kpis?.liveConnectedPct || 0);

  const cardsData = [
    {
      id: 'mrr',
      value: `${animatedMrr.toLocaleString()} ${isAr ? 'ج.م' : 'EGP'}`,
      shortLabel: isAr ? 'شهرياً (MRR)' : 'MRR / mo',
      icon: TrendingUp,
      iconColor: '#1588C7',
      iconBg: 'rgba(21, 136, 199, 0.12)',
      badge: (
        <span style={{
          fontSize: '11px',
          color: mrrGrowth >= 0 ? '#10B981' : '#EF4444',
          fontWeight: '800',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px'
        }}>
          <ArrowUpRight size={13} className="admin-arrow-bounce" />
          <span>{isAr ? `${growthPrefix}${mrrGrowth}% نمو شهري` : `${growthPrefix}${mrrGrowth}% MoM`}</span>
        </span>
      ),
      delay: '0.04s'
    },
    {
      id: 'total-users',
      value: `${animatedUsers.toLocaleString()}`,
      shortLabel: isAr ? 'مستخدم مسجل' : 'Registered Users',
      icon: Users,
      iconColor: '#1588C7',
      iconBg: 'rgba(21, 136, 199, 0.12)',
      badge: (
        <span style={{
          fontSize: '11px',
          color: 'var(--text-secondary)',
          fontWeight: '700'
        }}>
          {isAr
            ? `${Number(kpis?.studentsCount || 0)} طالب • ${Number(kpis?.teachersCount || 0)} معلم • ${Number(kpis?.centersCount || 0)} سنتر`
            : `${Number(kpis?.studentsCount || 0)} std • ${Number(kpis?.teachersCount || 0)} tutor • ${Number(kpis?.centersCount || 0)} ctr`}
        </span>
      ),
      delay: '0.1s'
    },
    {
      id: 'active-now',
      value: `${animatedActive.toLocaleString()}`,
      shortLabel: isAr ? 'نشط الآن' : 'Active Now',
      icon: Activity,
      iconColor: '#10B981',
      iconBg: 'rgba(16, 185, 129, 0.14)',
      badge: (
        <span style={{
          fontSize: '11px',
          color: '#10B981',
          fontWeight: '800',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span className="admin-radar-beacon">
            <span className="admin-radar-core" />
            <span className="admin-radar-wave" />
          </span>
          <span>{isAr ? `متصل لحظياً (${livePct}%)` : `Live Connected (${livePct}%)`}</span>
        </span>
      ),
      delay: '0.16s'
    },
    {
      id: 'ai-latency',
      value: `${animatedLatency} ${isAr ? 'ثانية' : 'sec'}`,
      shortLabel: isAr ? 'معالجة AI' : 'AI Processing',
      icon: Zap,
      iconColor: '#1588C7',
      iconBg: 'rgba(21, 136, 199, 0.12)',
      badge: (
        <span style={{
          fontSize: '11px',
          color: 'var(--text-secondary)',
          fontWeight: '700'
        }}>
          {isAr ? 'لكل محاضرة 45 دقيقة' : 'Per 45m lecture'}
        </span>
      ),
      delay: '0.22s'
    }
  ];

  return (
    <div
      className="admin-kpi-one-line-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '14px',
        marginBottom: '6px'
      }}
    >
      {cardsData.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className="center-interactive-card admin-animated-kpi-card"
            style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '14px 16px',
              borderRadius: 'var(--radius-lg, 14px)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '84px',
              animation: `adminKpiSlideUpEntrance 0.5s ${c.delay} cubic-bezier(0.16, 1, 0.3, 1) both`
            }}
          >
            <div className="admin-kpi-shimmer-sweep" />
            <div style={{ position: 'relative', zIndex: 2, minWidth: 0, flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '6px',
                flexWrap: 'wrap',
                marginBottom: '4px'
              }}>
                <span
                  className="admin-kpi-number-pop"
                  style={{
                    fontSize: '22px',
                    fontWeight: '900',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                    lineHeight: 1
                  }}
                >
                  {c.value}
                </span>
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: '800',
                    color: c.id === 'active-now' ? '#10B981' : '#1588C7',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {c.shortLabel}
                </span>
              </div>
              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {c.badge}
              </div>
            </div>

            <div
              className="admin-kpi-icon-box"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '11px',
                backgroundColor: c.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: c.iconColor,
                flexShrink: 0,
                position: 'relative',
                zIndex: 2,
                transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <Icon size={20} />
            </div>
          </div>
        );
      })}

      <style>{`
        @media (max-width: 1080px) {
          .admin-kpi-one-line-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 580px) {
          .admin-kpi-one-line-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes adminKpiSlideUpEntrance {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .admin-animated-kpi-card { transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.24s ease, border-color 0.24s ease; }
        .admin-animated-kpi-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -4px rgba(21, 136, 199, 0.16); border-color: rgba(21, 136, 199, 0.4) !important; }
        .admin-animated-kpi-card:hover .admin-kpi-icon-box { transform: scale(1.15) rotate(5deg); }
        .admin-kpi-shimmer-sweep { position: absolute; top: 0; left: -120%; width: 80%; height: 100%; background: linear-gradient(90deg, transparent, rgba(21, 136, 199, 0.06), transparent); transform: skewX(-20deg); pointer-events: none; transition: left 0.75s ease-in-out; z-index: 1; }
        .admin-animated-kpi-card:hover .admin-kpi-shimmer-sweep { left: 140%; }
        .admin-arrow-bounce { animation: adminArrowFloat 1.8s ease-in-out infinite; }
        @keyframes adminArrowFloat { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(1.5px, -2px); } }
        .admin-radar-beacon { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 9px; height: 9px; }
        .admin-radar-core { width: 7px; height: 7px; border-radius: 50%; background-color: #10B981; z-index: 2; }
        .admin-radar-wave { position: absolute; inset: -2px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.5); animation: adminRadarPulse 1.8s cubic-bezier(0.24, 0, 0.38, 1) infinite; z-index: 1; }
        @keyframes adminRadarPulse { 0% { transform: scale(0.9); opacity: 0.9; } 70% { transform: scale(2.4); opacity: 0; } 100% { transform: scale(2.6); opacity: 0; } }
      `}</style>
    </div>
  );
};
