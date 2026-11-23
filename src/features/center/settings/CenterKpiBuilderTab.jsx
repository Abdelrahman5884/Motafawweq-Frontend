import React, { useMemo, useState } from 'react';
import { CheckCircle2, Save, Target, TrendingUp } from 'lucide-react';

export const CenterKpiBuilderTab = ({
  lang,
  centerSettings,
  dashboardData,
  groups = [],
  rooms = [],
  financialSummary,
  updateKpiTargets,
  showToast,
}) => {
  const kpiObj = centerSettings?.kpiTargets || {};

  const [targetAttendance, setTargetAttendance] = useState(
    () =>
      Number(
        kpiObj.targetAttendancePct ??
          kpiObj.targetAttendance ??
          95
      )
  );
  const [targetRevenue, setTargetRevenue] = useState(
    () =>
      Number(
        kpiObj.targetMonthlyRevenueEgp ??
          kpiObj.targetRevenue ??
          200000
      )
  );
  const [targetUtilization, setTargetUtilization] = useState(
    () =>
      Number(
        kpiObj.targetRoomUtilizationPct ??
          kpiObj.targetUtilization ??
          85
      )
  );

  const [isSaving, setIsSaving] = useState(false);
  const [kpiSavedSuccess, setKpiSavedSuccess] = useState(false);

  // Live Actual Metrics Comparison from real backend context
  const liveMetrics = useMemo(() => {
    const actualAttendancePct = Number(
      dashboardData?.summary?.attendanceRatePct ??
        dashboardData?.attendanceTrend?.commitmentRatePct ??
        0
    );

    const totalCapacity = rooms.reduce((acc, r) => acc + (Number(r.capacity) || 0), 0);
    const totalEnrolled = groups.reduce((acc, g) => acc + (Number(g.enrolled) || 0), 0);
    const computedUtil =
      totalCapacity > 0
        ? Math.min(100, Math.round((totalEnrolled / totalCapacity) * 100))
        : 0;
    const actualUtilizationPct = Number(
      dashboardData?.summary?.roomUtilizationPct ?? computedUtil
    );

    const actualRevenueEgp = Number(
      financialSummary?.grossCollectedRevenue ??
        dashboardData?.summary?.monthlyRevenueEgp ??
        0
    );

    return {
      actualAttendancePct,
      actualUtilizationPct,
      actualRevenueEgp,
    };
  }, [dashboardData, rooms, groups, financialSummary]);

  const handleSaveKpiTargets = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setKpiSavedSuccess(false);
    try {
      await updateKpiTargets({
        target_attendance_pct: Math.min(100, Math.max(50, Number(targetAttendance) || 95)),
        target_monthly_revenue_egp: Math.max(1000, Number(targetRevenue) || 200000),
        target_room_utilization_pct: Math.min(100, Math.max(30, Number(targetUtilization) || 85)),
      });
      setKpiSavedSuccess(true);
      if (showToast) {
        showToast(
          lang === 'ar'
            ? 'تم اعتماد مستهدفات مؤشرات الأداء بنجاح.'
            : 'KPI target thresholds saved successfully.',
          'success'
        );
      }
      setTimeout(() => setKpiSavedSuccess(false), 3500);
    } catch (err) {
      if (showToast) {
        showToast(
          err?.message ||
            (lang === 'ar' ? 'تعذر حفظ مؤشرات الأداء.' : 'Failed to save KPI targets.'),
          'warning'
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div>
        <h3
          style={{
            fontSize: '17px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Target size={19} style={{ color: 'var(--primary)' }} />
          <span>
            {lang === 'ar'
              ? 'تخصيص مؤشرات الأداء والحدود المستهدفة'
              : 'Custom KPI Target Builder'}
          </span>
        </h3>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: '1.5',
          }}
        >
          {lang === 'ar'
            ? 'حدد المستهدفات الشهرية للسنتر، وتنعكس هذه الحدود مباشرة على مؤشرات لوحة التحكم والتنبيهات التشغيلية.'
            : 'Define monthly target thresholds that directly drive your dashboard KPIs and operational alerts.'}
        </p>
      </div>

      {/* Live Actual vs Target Comparison Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
        }}
      >
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {lang === 'ar' ? 'الحضور الفعلي مقابل المستهدف' : 'Actual vs Target Attendance'}
          </div>
          <div
            style={{
              marginTop: '6px',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {liveMetrics.actualAttendancePct}%
            </span>
            <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700' }}>
              {lang === 'ar' ? `المستهدف: ${targetAttendance}%` : `Target: ${targetAttendance}%`}
            </span>
          </div>
        </div>

        <div
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {lang === 'ar'
              ? 'إشغال القاعات الفعلي مقابل المستهدف'
              : 'Actual vs Target Room Utilization'}
          </div>
          <div
            style={{
              marginTop: '6px',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {liveMetrics.actualUtilizationPct}%
            </span>
            <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700' }}>
              {lang === 'ar'
                ? `المستهدف: ${targetUtilization}%`
                : `Target: ${targetUtilization}%`}
            </span>
          </div>
        </div>

        <div
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {lang === 'ar' ? 'الإيراد المحصل مقابل المستهدف' : 'Collected vs Target Revenue'}
          </div>
          <div
            style={{
              marginTop: '6px',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {liveMetrics.actualRevenueEgp.toLocaleString()}{' '}
              <small style={{ fontSize: '11px' }}>{lang === 'ar' ? 'ج.م' : 'EGP'}</small>
            </span>
            <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700' }}>
              <TrendingUp size={12} style={{ verticalAlign: 'middle', marginInlineEnd: '3px' }} />
              {Number(targetRevenue || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSaveKpiTargets}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '700',
                marginBottom: '6px',
                color: 'var(--text-primary)',
              }}
            >
              {lang === 'ar' ? 'نسبة الحضور المستهدفة (%)' : 'Target Attendance (%)'}
            </label>
            <input
              type="number"
              min="50"
              max="100"
              required
              value={targetAttendance}
              onChange={(e) => setTargetAttendance(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '700',
                marginBottom: '6px',
                color: 'var(--text-primary)',
              }}
            >
              {lang === 'ar'
                ? 'الإيراد الشهري المستهدف (ج.م)'
                : 'Target Monthly Revenue (EGP)'}
            </label>
            <input
              type="number"
              min="1000"
              required
              value={targetRevenue}
              onChange={(e) => setTargetRevenue(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '700',
                marginBottom: '6px',
                color: 'var(--text-primary)',
              }}
            >
              {lang === 'ar'
                ? 'معدل إشغال القاعات المستهدف (%)'
                : 'Target Room Utilization (%)'}
            </label>
            <input
              type="number"
              min="30"
              max="100"
              required
              value={targetUtilization}
              onChange={(e) => setTargetUtilization(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />
          </div>
        </div>

        {kpiSavedSuccess && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(22, 163, 74, 0.1)',
              border: '1px solid rgba(22, 163, 74, 0.25)',
              color: 'var(--success)',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} />
            <span>
              {lang === 'ar'
                ? 'تم اعتماد أهداف مؤشرات الأداء بنجاح.'
                : 'KPI thresholds saved successfully.'}
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          style={{
            alignSelf: 'flex-start',
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: '700',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Save size={15} />
          <span>
            {isSaving
              ? lang === 'ar'
                ? 'جاري الحفظ...'
                : 'Saving...'
              : lang === 'ar'
                ? 'حفظ مستهدفات مؤشرات الأداء'
                : 'Save KPI Targets'}
          </span>
        </button>
      </form>
    </div>
  );
};
