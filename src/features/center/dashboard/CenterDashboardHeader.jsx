import React from 'react';
import {
  Building2,
  Calendar,
  Crown,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

const PERIOD_OPTIONS = [
  { key: 'today', labelAr: 'اليوم', labelEn: 'Today' },
  { key: 'month', labelAr: 'هذا الشهر', labelEn: 'This Month' },
  { key: 'year', labelAr: 'هذا العام', labelEn: 'This Year' },
];

/**
 * Executive header banner showing the Center's brand name,
 * branch filter, reporting period pills, and live refresh trigger.
 */
export const CenterDashboardHeader = ({
  center,
  managerName = '',
  branches = [],
  selectedBranchId = 'all',
  onSelectBranch,
  period = 'today',
  onSelectPeriod,
  refreshing = false,
  onRefresh,
  isAr = true,
  isRtl = true,
  isDark = false,
  themeAccent = '#1588C7',
}) => {
  const rawCenterName = isAr
    ? center?.nameAr || center?.nameEn || ''
    : center?.nameEn || center?.nameAr || '';

  const centerTitle = rawCenterName || (isAr ? 'السنتر التعليمي' : 'Educational Center');

  const planBadge = isAr
    ? center?.planNameAr || center?.planTier || ''
    : center?.planNameEn || center?.planTier || '';

  const formattedDate = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formatBranchLabel = (branch) => {
    const base = isAr ? branch.nameAr : branch.nameEn || branch.nameAr;
    if (!branch.isMain) return base;
    if (String(base).includes('رئيسي') || String(base).toLowerCase().includes('main')) {
      return base;
    }
    return isAr ? `${base} (الرئيسي)` : `${base} (Main)`;
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}
    >
      {/* Center Brand Identity & Subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '240px', flex: '1 1 320px' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: `linear-gradient(135deg, ${themeAccent} 0%, #0EA5E9 100%)`,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: isDark
              ? '0 8px 20px rgba(56, 189, 248, 0.22)'
              : '0 8px 20px rgba(21, 136, 199, 0.22)',
          }}
        >
          <Building2 size={25} />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading), var(--font-arabic)',
                letterSpacing: isRtl ? 0 : '-0.02em',
              }}
            >
              {centerTitle}
            </h1>

            {center?.isVerified && (
              <span
                title={isAr ? 'سنتر معتمد' : 'Verified Center'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#10B981',
                  fontSize: '11px',
                  fontWeight: '800',
                }}
              >
                <ShieldCheck size={12} />
                <span>{isAr ? 'معتمد' : 'Verified'}</span>
              </span>
            )}

            {planBadge && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  backgroundColor: isDark ? 'rgba(56, 189, 248, 0.14)' : 'rgba(21, 136, 199, 0.1)',
                  color: themeAccent,
                  fontSize: '11px',
                  fontWeight: '800',
                }}
              >
                <Crown size={12} />
                <span>{planBadge}</span>
              </span>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '6px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontWeight: '600',
            }}
          >
            {managerName && (
              <span>{isAr ? `إدارة: ${managerName}` : `Managed by: ${managerName}`}</span>
            )}
            {managerName && <span style={{ opacity: 0.45 }}>•</span>}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
              <Calendar size={12} style={{ color: themeAccent }} />
              <span>{formattedDate}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Refresh Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
        <select
          aria-label={isAr ? 'تصفية حسب الفرع' : 'Filter by branch'}
          value={selectedBranchId}
          onChange={(e) => onSelectBranch?.(e.target.value)}
          style={{
            height: '38px',
            padding: '0 12px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer',
            minWidth: '155px',
          }}
        >
          <option value="all">{isAr ? 'جميع الفروع' : 'All Branches'}</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {formatBranchLabel(branch)}
            </option>
          ))}
        </select>

        <div
          style={{
            height: '38px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            boxSizing: 'border-box',
          }}
        >
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`executive-filter-btn ${period === opt.key ? 'active' : ''}`}
              onClick={() => onSelectPeriod?.(opt.key)}
              style={{
                height: '30px',
                padding: '0 12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              {isAr ? opt.labelAr : opt.labelEn}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          aria-label={isAr ? 'تحديث البيانات' : 'Refresh dashboard'}
          style={{
            height: '38px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 14px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: refreshing ? 'wait' : 'pointer',
            opacity: refreshing ? 0.7 : 1,
          }}
        >
          <RefreshCw
            size={13}
            style={{
              color: themeAccent,
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
            }}
          />
          <span>{isAr ? (refreshing ? 'تحديث...' : 'تحديث') : (refreshing ? 'Syncing...' : 'Refresh')}</span>
        </button>
      </div>
    </div>
  );
};
