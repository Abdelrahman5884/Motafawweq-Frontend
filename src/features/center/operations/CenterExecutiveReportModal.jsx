import React, { useEffect, useState } from 'react';
import { Printer, RefreshCw, Sparkles, X } from 'lucide-react';
import { printCenterExecutiveReport } from './centerOperationsUtils';

export const CenterExecutiveReportModal = ({
  isOpen,
  onClose,
  centerNameAr = 'السنتر التعليمي',
  branches = [],
  rooms = [],
  centerTeachers = [],
  staff = [],
  executiveReport = null,
  fetchExecutiveReport,
  isBackendCenter = true,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';
  const [reportType, setReportType] = useState('weekly');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !isBackendCenter || !fetchExecutiveReport) return undefined;
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setLoading(true);
      fetchExecutiveReport(reportType).finally(() => {
        if (!cancelled) setLoading(false);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, isBackendCenter, fetchExecutiveReport, reportType]);

  if (!isOpen) return null;

  const localTotalCapacity = rooms.reduce((sum, r) => sum + (Number(r.capacity) || 0), 0);
  const localTotalStudents = branches.reduce(
    (sum, b) => sum + (Number(b.activeStudents) || 0),
    0
  );

  const summary = {
    branchesCount: Number(executiveReport?.summary?.branchesCount ?? branches.length),
    roomsCount: Number(executiveReport?.summary?.roomsCount ?? rooms.length),
    totalCapacity: Number(executiveReport?.summary?.totalCapacity ?? localTotalCapacity),
    teachersCount: Number(executiveReport?.summary?.teachersCount ?? centerTeachers.length),
    staffCount: Number(executiveReport?.summary?.staffCount ?? staff.length),
    activeGroupsCount: Number(executiveReport?.summary?.activeGroupsCount ?? 0),
    totalStudents: Number(executiveReport?.summary?.totalStudents ?? localTotalStudents),
    sessionsHeld: Number(executiveReport?.summary?.sessionsHeld ?? 0),
    avgAttendanceRate: Number(executiveReport?.summary?.avgAttendanceRate ?? 0),
  };

  const resolvedCenterName =
    executiveReport?.centerNameAr || centerNameAr || (isAr ? 'السنتر التعليمي' : 'Educational Center');
  const reportBranches = Array.isArray(executiveReport?.branches) && executiveReport.branches.length > 0
    ? executiveReport.branches
    : branches;

  const handlePrint = () => {
    printCenterExecutiveReport({
      centerNameAr: resolvedCenterName,
      reportType,
      summary,
      branches: reportBranches,
      lang,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.68)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          maxWidth: '620px',
          width: '100%',
          padding: '24px',
          boxShadow: 'var(--shadow-xl)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '17px', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>
              {isAr ? 'التقرير الإداري والتشغيلي للسنتر' : 'Executive Operational Report'}
            </h3>
            {loading && <RefreshCw size={14} className="animate-spin" color="var(--primary)" />}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Frequency Selector */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '18px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => setReportType('weekly')}
            style={{
              flex: 1,
              padding: '7px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: reportType === 'weekly' ? 'var(--primary)' : 'transparent',
              color: reportType === 'weekly' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'التقرير الأسبوعي (آخر 7 أيام)' : 'Weekly Report'}
          </button>
          <button
            type="button"
            onClick={() => setReportType('monthly')}
            style={{
              flex: 1,
              padding: '7px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: reportType === 'monthly' ? 'var(--primary)' : 'transparent',
              color: reportType === 'monthly' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'التقرير الشهري التنفيذي (آخر 30 يوماً)' : 'Monthly Digest'}
          </button>
        </div>

        {/* Live Report Document Content (100% Dynamic — Zero Hardcoded Metrics!) */}
        <div
          style={{
            backgroundColor: 'var(--bg-app)',
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            fontSize: '13px',
          }}
        >
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <div style={{ fontWeight: '900', color: 'var(--text-primary)', fontSize: '15.5px' }}>
              {resolvedCenterName} —{' '}
              {reportType === 'weekly'
                ? isAr
                  ? 'ملخص الأداء والتشغيل الأسبوعي'
                  : 'Weekly Operational Summary'
                : isAr
                  ? 'الملخص الإداري والتشغيلي الشهري'
                  : 'Monthly Operational Digest'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {isAr
                ? 'تم التوليد لحظياً من البيانات الفعلية للسنتر بدون أي بيانات مالية'
                : 'Generated live from authoritative center operational metrics'}
            </div>
          </div>

          {/* Summary KPI Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(125px, 1fr))',
              gap: '8px',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--primary)' }}>
                {summary.branchesCount}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'الفروع النشطة' : 'Branches'}
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {summary.roomsCount} ({summary.totalCapacity})
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'القاعات (المقاعد)' : 'Rooms (Seats)'}
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--success, #10B981)' }}>
                {summary.teachersCount}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'المعلمون المعتمدون' : 'Teachers'}
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--primary)' }}>
                {summary.avgAttendanceRate}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'معدل الحضور الفعلي' : 'Attendance Rate'}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
              {isAr ? '1. الطاقة الاستيعابية والانتشار الجغرافي:' : '1. Capacity & Branch Footprint:'}
            </div>
            <div style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
              {isAr
                ? `يضم السنتر حالياً ${summary.branchesCount} فروع تشغيلية، بعدد إجمالي ${summary.roomsCount} قاعة دراسية وسعة استيعابية إجمالية تبلغ ${summary.totalCapacity} مقعداً، ويدير التشغيل ${summary.staffCount} موظفين إداريين.`
                : `The center operates ${summary.branchesCount} branches with ${summary.roomsCount} classrooms (${summary.totalCapacity} total seats) and ${summary.staffCount} staff members.`}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
              {isAr ? '2. شبكة المعلمين والتشغيل الأكاديمي:' : '2. Teachers Network & Academic Operations:'}
            </div>
            <div style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
              {isAr
                ? `تضم الشبكة ${summary.teachersCount} معلماً معتمداً يشرفون على ${summary.activeGroupsCount} مجموعة دراسية نشطة بإجمالي ${summary.totalStudents} طالباً مقيداً. تم عقد ${summary.sessionsHeld} حصة خلال الفترة بمعدل حضور فعلي ${summary.avgAttendanceRate}%.`
                : `The network includes ${summary.teachersCount} certified teachers managing ${summary.activeGroupsCount} active cohorts with ${summary.totalStudents} enrolled students (${summary.sessionsHeld} sessions held, ${summary.avgAttendanceRate}% attendance rate).`}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
          <button
            type="button"
            onClick={handlePrint}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Printer size={15} />
            <span>{isAr ? 'طباعة التقرير الإداري (Print / PDF)' : 'Print / Save PDF'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '11px 20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
