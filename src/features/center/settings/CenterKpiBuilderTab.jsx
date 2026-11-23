import React, { useMemo, useState } from 'react';
import { CheckCircle2, Save, Target } from 'lucide-react';
import { errorText } from './centerSettingsUtils';

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
  const isAr = lang === 'ar';
  const kpiObj = centerSettings?.kpiTargets || {};

  const [targetAttendance, setTargetAttendance] = useState(
    () => Number(kpiObj.targetAttendancePct ?? kpiObj.targetAttendance ?? 95)
  );
  const [targetRevenue, setTargetRevenue] = useState(
    () => Number(kpiObj.targetMonthlyRevenueEgp ?? kpiObj.targetRevenue ?? 200000)
  );
  const [targetUtilization, setTargetUtilization] = useState(
    () => Number(kpiObj.targetRoomUtilizationPct ?? kpiObj.targetUtilization ?? 85)
  );

  const [isSaving, setIsSaving] = useState(false);
  const [kpiSavedSuccess, setKpiSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Live Actual Metrics Comparison
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
    setErrorMessage(null);

    try {
      await updateKpiTargets({
        target_attendance_pct: Math.min(100, Math.max(50, Number(targetAttendance) || 95)),
        target_monthly_revenue_egp: Math.max(1000, Number(targetRevenue) || 200000),
        target_room_utilization_pct: Math.min(100, Math.max(30, Number(targetUtilization) || 85)),
      });

      setKpiSavedSuccess(true);
      if (showToast) {
        showToast(
          isAr
            ? 'تم اعتماد مستهدفات مؤشرات الأداء بنجاح.'
            : 'KPI targets saved successfully.',
          'success'
        );
      }
      setTimeout(() => setKpiSavedSuccess(false), 3500);
    } catch (err) {
      const msg = errorText(
        err,
        isAr ? 'تعذر حفظ مؤشرات الأداء.' : 'Failed to save KPI targets.'
      );
      setErrorMessage(msg);
      if (showToast) showToast(msg, 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  const attendanceRatio = Math.min(
    100,
    Math.round((liveMetrics.actualAttendancePct / Math.max(1, Number(targetAttendance))) * 100)
  );
  const utilizationRatio = Math.min(
    100,
    Math.round((liveMetrics.actualUtilizationPct / Math.max(1, Number(targetUtilization))) * 100)
  );
  const revenueRatio = Math.min(
    100,
    Math.round((liveMetrics.actualRevenueEgp / Math.max(1, Number(targetRevenue))) * 100)
  );

  return (
    <div className="cs-card">
      <div className="cs-card-header">
        <div>
          <h3 className="cs-card-title">
            <Target size={18} />
            <span>{isAr ? 'تخصيص مؤشرات الأداء والمستهدفات الشهرية' : 'Custom KPI Targets'}</span>
          </h3>
          <p className="cs-card-subtitle">
            {isAr
              ? 'تحدد هذه المستهدفات نسب الإشغال والتحصيل المستهدفة في لوحة التحكم والتقارير التنفيذية.'
              : 'These thresholds directly drive dashboard gauges and executive reports.'}
          </p>
        </div>
      </div>

      {/* 1. Comparison Cards with Live Progress */}
      <div className="cs-kpi-grid">
        <div className="cs-kpi-card">
          <span className="cs-kpi-label">{isAr ? 'نسبة الحضور الفعلي' : 'Actual Attendance'}</span>
          <div className="cs-kpi-val-row">
            <span className="cs-kpi-value">{liveMetrics.actualAttendancePct}%</span>
            <span className="cs-kpi-target">
              {isAr ? `المستهدف: ${targetAttendance}%` : `Target: ${targetAttendance}%`}
            </span>
          </div>
          <div className="cs-progress-bar">
            <div className="cs-progress-fill" style={{ width: `${attendanceRatio}%` }} />
          </div>
        </div>

        <div className="cs-kpi-card">
          <span className="cs-kpi-label">{isAr ? 'إشغال القاعات الفعلي' : 'Room Utilization'}</span>
          <div className="cs-kpi-val-row">
            <span className="cs-kpi-value">{liveMetrics.actualUtilizationPct}%</span>
            <span className="cs-kpi-target">
              {isAr ? `المستهدف: ${targetUtilization}%` : `Target: ${targetUtilization}%`}
            </span>
          </div>
          <div className="cs-progress-bar">
            <div className="cs-progress-fill" style={{ width: `${utilizationRatio}%` }} />
          </div>
        </div>

        <div className="cs-kpi-card">
          <span className="cs-kpi-label">{isAr ? 'الإيراد المحصل هذا الشهر' : 'Collected Revenue'}</span>
          <div className="cs-kpi-val-row">
            <span className="cs-kpi-value">
              {liveMetrics.actualRevenueEgp.toLocaleString()}{' '}
              <small style={{ fontSize: '12px' }}>{isAr ? 'ج.م' : 'EGP'}</small>
            </span>
            <span className="cs-kpi-target">
              {isAr
                ? `المستهدف: ${Number(targetRevenue || 0).toLocaleString()} ج.م`
                : `Target: ${Number(targetRevenue || 0).toLocaleString()}`}
            </span>
          </div>
          <div className="cs-progress-bar">
            <div className="cs-progress-fill" style={{ width: `${revenueRatio}%` }} />
          </div>
        </div>
      </div>

      {/* 2. Target Adjustment Form */}
      <form onSubmit={handleSaveKpiTargets}>
        <div className="cs-grid">
          <div className="cs-field">
            <label className="cs-label">
              {isAr ? 'نسبة الحضور المستهدفة (%)' : 'Target Attendance (%)'}
            </label>
            <input
              type="number"
              min="50"
              max="100"
              required
              className="cs-input"
              value={targetAttendance}
              onChange={(e) => setTargetAttendance(e.target.value)}
            />
          </div>

          <div className="cs-field">
            <label className="cs-label">
              {isAr ? 'الإيراد الشهري المستهدف (ج.م)' : 'Target Monthly Revenue (EGP)'}
            </label>
            <input
              type="number"
              min="1000"
              required
              className="cs-input"
              value={targetRevenue}
              onChange={(e) => setTargetRevenue(e.target.value)}
            />
          </div>

          <div className="cs-field">
            <label className="cs-label">
              {isAr ? 'معدل إشغال القاعات المستهدف (%)' : 'Target Room Utilization (%)'}
            </label>
            <input
              type="number"
              min="30"
              max="100"
              required
              className="cs-input"
              value={targetUtilization}
              onChange={(e) => setTargetUtilization(e.target.value)}
            />
          </div>
        </div>

        {errorMessage && (
          <div className="cs-alert cs-alert-danger">{errorMessage}</div>
        )}

        {kpiSavedSuccess && (
          <div className="cs-alert cs-alert-success">
            <CheckCircle2 size={16} />
            <span>
              {isAr
                ? 'تم حفظ واعتماد مستهدفات مؤشرات الأداء بنجاح.'
                : 'KPI target thresholds saved.'}
            </span>
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={isSaving}
            className="cs-btn cs-btn-primary"
          >
            <Save size={15} />
            <span>
              {isSaving
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : isAr
                  ? 'حفظ المستهدفات'
                  : 'Save Targets'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
