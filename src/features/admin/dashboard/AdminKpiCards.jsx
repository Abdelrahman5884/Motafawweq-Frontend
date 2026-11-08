import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  DollarSign,
  Users,
  Activity,
  Zap,
  ArrowUpRight
} from 'lucide-react';

// Easing count-up animation hook
const useCountUp = (target, duration = 1200) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo for a snappy, premium feel
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return count;
};

export const AdminKpiCards = ({ econ }) => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  // Dynamic Animated Values
  const animatedMrr = useCountUp(econ?.mrrEgp || 540000, 1100);
  const animatedUsers = useCountUp(econ?.totalUsers || 34800, 1200);
  const animatedActive = useCountUp(2840, 1000);
  const animatedLatency = useCountUp(econ?.aiEconomics?.avgLessonProcessingSeconds || 38, 900);

  const cardsData = [
    {
      id: 'mrr',
      title: isAr ? 'الإيراد الشهري المتكرر' : 'Monthly Recurring (MRR)',
      icon: DollarSign,
      iconColor: '#1588C7',
      iconBg: 'rgba(21, 136, 199, 0.12)',
      displayValue: `${animatedMrr.toLocaleString()}`,
      unit: isAr ? 'ج.م / شهرياً' : 'EGP / mo',
      badge: (
        <div style={{
          fontSize: '12px',
          color: '#10B981',
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <ArrowUpRight size={14} className="admin-arrow-bounce" />
          <span>{isAr ? '+24.2% نمو شهري متصاعد' : '+24.2% MoM growth'}</span>
        </div>
      ),
      delay: '0.04s'
    },
    {
      id: 'total-users',
      title: isAr ? 'المستخدمون المسجلون' : 'Total Active Users',
      icon: Users,
      iconColor: '#1588C7',
      iconBg: 'rgba(21, 136, 199, 0.12)',
      displayValue: `${animatedUsers.toLocaleString()}`,
      unit: isAr ? 'مستخدم مسجل' : 'registered accounts',
      badge: (
        <div style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: '800' }}>
            {isAr ? '33.3k طالب • 1,420 معلماً • 48 سنتر' : '33.3k students • 1.4k tutors • 48 centers'}
          </span>
        </div>
      ),
      delay: '0.1s'
    },
    {
      id: 'active-now',
      title: isAr ? 'المستخدمون النشطون الآن' : 'Live Active Users',
      icon: Activity,
      iconColor: '#10B981',
      iconBg: 'rgba(16, 185, 129, 0.14)',
      displayValue: `${animatedActive.toLocaleString()}`,
      unit: isAr ? 'متصل بالمنصة' : 'online now',
      badge: (
        <div style={{
          fontSize: '12px',
          color: '#10B981',
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span className="admin-radar-beacon">
            <span className="admin-radar-core" />
            <span className="admin-radar-wave" />
          </span>
          <span>{isAr ? 'متصلون لحظياً • 81.6% تفاعل' : 'Live session engagement 81.6%'}</span>
        </div>
      ),
      delay: '0.16s'
    },
    {
      id: 'ai-latency',
      title: isAr ? 'سرعة المعالجة الذكية' : 'Avg Pipeline Latency',
      icon: Zap,
      iconColor: '#1588C7',
      iconBg: 'rgba(21, 136, 199, 0.12)',
      displayValue: `${animatedLatency}s`,
      unit: isAr ? 'ثانية / محاضرة' : 'seconds average',
      badge: (
        <div style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          fontWeight: '700'
        }}>
          <span>{isAr ? 'لكل 45 دقيقة صوتية معالجة بنماذج AI' : 'Per 45m lesson processed by AI'}</span>
        </div>
      ),
      delay: '0.22s'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {cardsData.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className="center-interactive-card admin-animated-kpi-card"
            style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '18px 20px',
              borderRadius: 'var(--radius-lg, 14px)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '126px',
              position: 'relative',
              overflow: 'hidden',
              animation: `adminKpiSlideUpEntrance 0.5s ${c.delay} cubic-bezier(0.16, 1, 0.3, 1) both`
            }}
          >
            {/* Ambient Shimmer Sweep on Hover */}
            <div className="admin-kpi-shimmer-sweep" />

            {/* Top Row: Title + Icon Box */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
              position: 'relative',
              zIndex: 2
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                {c.title}
              </span>
              <div
                className="admin-kpi-icon-box"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: c.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: c.iconColor,
                  flexShrink: 0,
                  transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <Icon size={18} />
              </div>
            </div>

            {/* Middle Row: Animated Number Value with Unit */}
            <div style={{
              fontSize: '25px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              marginBottom: '4px',
              lineHeight: 1.15,
              position: 'relative',
              zIndex: 2
            }}>
              <span className="admin-kpi-number-pop">{c.displayValue}</span>{' '}
              <span style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                fontFamily: 'inherit'
              }}>
                {c.unit}
              </span>
            </div>

            {/* Bottom Row: Harmonious Aligned Metric Line */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              {c.badge}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes adminKpiSlideUpEntrance {
          0% {
            opacity: 0;
            transform: translateY(16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .admin-animated-kpi-card {
          transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.24s ease,
                      border-color 0.24s ease;
        }

        .admin-animated-kpi-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 28px -4px rgba(21, 136, 199, 0.16), 0 4px 10px -2px rgba(6, 37, 78, 0.05);
          border-color: rgba(21, 136, 199, 0.4) !important;
        }

        .admin-animated-kpi-card:hover .admin-kpi-icon-box {
          transform: scale(1.15) rotate(5deg);
          box-shadow: 0 4px 12px rgba(21, 136, 199, 0.25);
        }

        .admin-kpi-shimmer-sweep {
          position: absolute;
          top: 0;
          left: -120%;
          width: 80%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(21, 136, 199, 0.06),
            transparent
          );
          transform: skewX(-20deg);
          pointer-events: none;
          transition: left 0.75s ease-in-out;
          z-index: 1;
        }

        .admin-animated-kpi-card:hover .admin-kpi-shimmer-sweep {
          left: 140%;
        }

        .admin-arrow-bounce {
          animation: adminArrowFloat 1.8s ease-in-out infinite;
        }

        @keyframes adminArrowFloat {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(1.5px, -2px);
          }
        }

        .admin-radar-beacon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 9px;
          height: 9px;
        }

        .admin-radar-core {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #10B981;
          z-index: 2;
        }

        .admin-radar-wave {
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background-color: rgba(16, 185, 129, 0.5);
          animation: adminRadarPulse 1.8s cubic-bezier(0.24, 0, 0.38, 1) infinite;
          z-index: 1;
        }

        @keyframes adminRadarPulse {
          0% {
            transform: scale(0.9);
            opacity: 0.9;
          }
          70% {
            transform: scale(2.4);
            opacity: 0;
          }
          100% {
            transform: scale(2.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
