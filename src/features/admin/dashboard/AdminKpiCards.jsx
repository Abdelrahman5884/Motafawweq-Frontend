import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  TrendingUp,
  Users,
  GraduationCap,
  Award,
  Building2,
  Clock,
  Zap,
  Activity,
  ArrowUpRight
} from 'lucide-react';

export const AdminKpiCards = ({ econ }) => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const totalUsers = econ?.totalUsers || 34800;
  const studentsCount = 33332;
  const teachersCount = 1420;
  const centersCount = 48;

  const studentsPct = ((studentsCount / totalUsers) * 100).toFixed(1);
  const teachersPct = ((teachersCount / totalUsers) * 100).toFixed(1);
  const centersPct = ((centersCount / totalUsers) * 100).toFixed(1);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
      gap: '20px',
      marginBottom: '28px'
    }}>
      {/* ── CARD 1: Monthly Recurring Revenue (MRR) ── */}
      <div
        className="admin-kpi-card"
        style={{
          backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
          padding: '24px',
          borderRadius: '22px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.25s ease'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'الإيراد الشهري المتكرر (MRR)' : 'Monthly Recurring (MRR)'}
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              backgroundColor: 'rgba(21, 136, 199, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <TrendingUp size={16} />
            </div>
          </div>

          <div style={{
            fontSize: '30px',
            fontWeight: '900',
            color: 'var(--primary)',
            fontFamily: 'var(--font-heading)',
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px'
          }}>
            <span>{econ.mrrEgp.toLocaleString()}</span>
            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-secondary)' }}>
              {isAr ? 'ج.م' : 'EGP'}
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: '800',
            color: 'var(--primary)',
            backgroundColor: 'rgba(21, 136, 199, 0.1)',
            padding: '3px 8px',
            borderRadius: '6px'
          }}>
            <ArrowUpRight size={13} />
            +24.2% MoM
          </span>
          <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            {isAr ? 'نمو اشتراكات السناتر والمعلمين' : 'Strong Tier Retention'}
          </span>
        </div>
      </div>

      {/* ── CARD 2: Total Active Users with Rich Breakdown (Student / Teacher / Center) ── */}
      <div
        className="admin-kpi-card admin-kpi-users-card"
        style={{
          backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
          padding: '24px',
          borderRadius: '22px',
          border: '1.5px solid rgba(21, 136, 199, 0.28)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gridColumn: 'span 2',
          transition: 'all 0.25s ease'
        }}
      >
        <div>
          {/* Top Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <Users size={16} />
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {isAr ? 'إجمالي المستخدمين النشطين بالمنصة' : 'Total Active Platform Users'}
              </span>
            </div>

            <span style={{
              fontSize: '11.5px',
              fontWeight: '800',
              padding: '3px 10px',
              borderRadius: '20px',
              backgroundColor: 'rgba(21, 136, 199, 0.12)',
              color: 'var(--primary)',
              border: '1px solid rgba(21, 136, 199, 0.25)'
            }}>
              {isAr ? '99.4% نسبة تفاعل الحسابات' : '99.4% Active Ratio'}
            </span>
          </div>

          {/* Big Number */}
          <div style={{
            fontSize: '32px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            marginBottom: '12px'
          }}>
            {totalUsers.toLocaleString()}
          </div>

          {/* Multi-segment Visual Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-subtle, #f1f5f9)',
            overflow: 'hidden',
            display: 'flex',
            marginBottom: '14px'
          }}>
            <div
              title={`${isAr ? 'الطلاب' : 'Students'}: ${studentsPct}%`}
              style={{
                width: `${studentsPct}%`,
                backgroundColor: 'var(--primary, #1588C7)',
                transition: 'width 0.6s ease'
              }}
            />
            <div
              title={`${isAr ? 'المعلمون' : 'Teachers'}: ${teachersPct}%`}
              style={{
                width: `${teachersPct}%`,
                backgroundColor: 'var(--primary-light, #5CB6DB)',
                transition: 'width 0.6s ease'
              }}
            />
            <div
              title={`${isAr ? 'السناتر' : 'Centers'}: ${centersPct}%`}
              style={{
                width: `${Math.max(1, parseFloat(centersPct))}%`,
                backgroundColor: 'var(--color-brand-dark, #06254E)',
                transition: 'width 0.6s ease'
              }}
            />
          </div>
        </div>

        {/* ── 3 Beautiful Structured Breakdown Chips: Student, Teacher, Center ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginTop: '6px'
        }}>
          {/* Students Chip */}
          <div style={{
            backgroundColor: 'var(--bg-subtle, #f8fafc)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(21, 136, 199, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              flexShrink: 0
            }}>
              <GraduationCap size={16} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {isAr ? 'الطلاب' : 'Students'}
              </div>
              <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {studentsCount.toLocaleString()}
                <span style={{ fontSize: '10.5px', color: 'var(--primary)', fontWeight: '700', marginInlineStart: '4px' }}>
                  ({studentsPct}%)
                </span>
              </div>
            </div>
          </div>

          {/* Teachers Chip */}
          <div style={{
            backgroundColor: 'var(--bg-subtle, #f8fafc)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(92, 182, 219, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-light, #5CB6DB)',
              flexShrink: 0
            }}>
              <Award size={16} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {isAr ? 'المعلمون' : 'Teachers'}
              </div>
              <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {teachersCount.toLocaleString()}
                <span style={{ fontSize: '10.5px', color: 'var(--primary-light, #5CB6DB)', fontWeight: '700', marginInlineStart: '4px' }}>
                  ({teachersPct}%)
                </span>
              </div>
            </div>
          </div>

          {/* Centers Chip */}
          <div style={{
            backgroundColor: 'var(--bg-subtle, #f8fafc)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(6, 37, 78, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-brand-dark, #06254E)',
              flexShrink: 0
            }}>
              <Building2 size={16} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {isAr ? 'السناتر' : 'Centers'}
              </div>
              <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {centersCount.toLocaleString()}
                <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: '700', marginInlineStart: '4px' }}>
                  ({centersPct}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CARD 3: Processing Latency (Avg Lesson Pipeline Speed) ── */}
      <div
        className="admin-kpi-card"
        style={{
          backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
          padding: '24px',
          borderRadius: '22px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.25s ease'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'متوسط سرعة المعالجة' : 'Avg Pipeline Latency'}
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              backgroundColor: 'rgba(92, 182, 219, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-light, #5CB6DB)'
            }}>
              <Clock size={16} />
            </div>
          </div>

          <div style={{
            fontSize: '30px',
            fontWeight: '900',
            color: 'var(--primary-light, #5CB6DB)',
            fontFamily: 'var(--font-heading)',
            display: 'flex',
            alignItems: 'baseline',
            gap: '4px'
          }}>
            <span>{econ.aiEconomics.avgLessonProcessingSeconds}</span>
            <span style={{ fontSize: '16px', fontWeight: '800' }}>{isAr ? 'ثانية' : 's'}</span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '800',
            color: 'var(--primary)',
            backgroundColor: 'rgba(21, 136, 199, 0.1)',
            padding: '3px 8px',
            borderRadius: '6px'
          }}>
            {isAr ? 'فائق السرعة' : 'Ultra Fast'}
          </span>
          <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            {isAr ? 'لكل 45 دقيقة صوتية كاملة' : 'Per 45m lesson audio'}
          </span>
        </div>
      </div>

      <style>{`
        .admin-kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(21, 136, 199, 0.08) !important;
          border-color: rgba(21, 136, 199, 0.35) !important;
        }
        @media (max-width: 900px) {
          .admin-kpi-users-card {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
};
