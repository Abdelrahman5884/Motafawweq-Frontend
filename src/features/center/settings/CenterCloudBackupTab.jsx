import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Cloud,
  Database,
  Lock,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { errorText, formatBackupSize, formatDateTimeLabel } from './centerSettingsUtils';

export const CenterCloudBackupTab = ({
  lang,
  isRtl,
  centerSettings,
  centerPlanTier,
  backups = [],
  createCenterBackup,
  showToast,
}) => {
  const isAr = lang === 'ar';
  const navigate = useNavigate();

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupNotice, setBackupNotice] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const effectiveTier =
    String(centerPlanTier || centerSettings?.planTier || 'free').toLowerCase();
  const isProTier = effectiveTier === 'pro';

  const latestBackupAt =
    backups[0]?.completedAt || centerSettings?.lastBackupAt || null;
  const latestChecksum =
    backups[0]?.checksumSha256 || centerSettings?.lastBackupChecksum || null;

  const handleTriggerBackup = async () => {
    setIsBackingUp(true);
    setBackupNotice(null);
    setErrorMessage(null);

    try {
      const created = await createCenterBackup();
      const code = created?.snapshotCode || '';
      const msg = isAr
        ? `تم إنشاء وتشفير النسخة الاحتياطية بنجاح ${code ? `(${code})` : ''} وبصمة SHA-256.`
        : `Snapshot ${code} created with SHA-256 checksum.`;
      setBackupNotice(msg);
      if (showToast) showToast(msg, 'success');
    } catch (err) {
      const msg = errorText(
        err,
        isAr
          ? 'يتطلب النسخ الاحتياطي الفوري تفعيل باقة السنتر الاحترافية (Pro).'
          : 'Instant snapshots require the Pro Center plan.'
      );
      setErrorMessage(msg);
      if (showToast) showToast(msg, 'warning');
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div>
      {/* 1. Status & Trigger Card */}
      <div className="cs-card">
        <div className="cs-card-header">
          <div>
            <h3 className="cs-card-title">
              <Cloud size={18} />
              <span>{isAr ? 'النسخ الاحتياطي السحابي وتأمين البيانات' : 'Cloud Backup & Data Integrity'}</span>
            </h3>
            <p className="cs-card-subtitle">
              {isAr
                ? 'يتم تشفير وحفظ لقطات بيانات السنتر، الحضور، والعمليات المالية دورياً.'
                : 'All center operations, groups, and financials are periodically snapshotted.'}
            </p>
          </div>

          <div>
            {isProTier ? (
              <button
                type="button"
                onClick={handleTriggerBackup}
                disabled={isBackingUp}
                className="cs-btn cs-btn-primary"
              >
                <RefreshCw size={14} className={isBackingUp ? 'animate-spin' : ''} />
                <span>
                  {isBackingUp
                    ? isAr
                      ? 'جاري أخذ اللقطة...'
                      : 'Backing up...'
                    : isAr
                      ? 'إنشاء لقطة احتياطية فورية'
                      : 'Create Backup Now'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/center/billing')}
                className="cs-btn cs-btn-primary"
              >
                <Lock size={14} />
                <span>
                  {isAr ? 'ترقية لباقة Pro للنسخ الاحتياطي' : 'Upgrade to Pro for Snapshots'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Sync Status Banner */}
        <div
          style={{
            padding: '16px 18px',
            borderRadius: 'var(--radius-lg, 16px)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: '800' }}>
              <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
              <span>
                {isAr ? 'حالة المزامنة السحابية:' : 'Sync Status:'}{' '}
                <span style={{ color: 'var(--success)' }}>
                  {isAr ? 'نشط ومتزامن (مشفر SHA-256)' : 'Active & Synchronized (SHA-256)'}
                </span>
              </span>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {isAr
                ? `آخر لقطة موثقة: ${latestBackupAt ? formatDateTimeLabel(latestBackupAt, lang) : 'لم يتم تسجيل لقطات بعد'}`
                : `Last backup: ${latestBackupAt ? formatDateTimeLabel(latestBackupAt, lang) : 'No backups yet'}`}
            </div>

            {latestChecksum && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>
                SHA-256: {String(latestChecksum).slice(0, 24)}...
              </div>
            )}
          </div>
        </div>

        {backupNotice && (
          <div className="cs-alert cs-alert-success">
            <CheckCircle2 size={16} />
            <span>{backupNotice}</span>
          </div>
        )}

        {errorMessage && (
          <div className="cs-alert cs-alert-danger">{errorMessage}</div>
        )}
      </div>

      {/* 2. Historical Snapshots Table */}
      <div className="cs-card">
        <div className="cs-card-header">
          <h3 className="cs-card-title">
            <Database size={17} />
            <span>
              {isAr
                ? `سجل اللقطات الاحتياطية الموثقة (${backups.length})`
                : `Backup Snapshots History (${backups.length})`}
            </span>
          </h3>
        </div>

        {backups.length === 0 ? (
          <div className="cs-empty">
            {isProTier
              ? isAr
                ? 'لا توجد لقطات احتياطية مسجلة بعد. اضغط على «إنشاء لقطة احتياطية فورية» لحفظ أول لقطة.'
                : 'No snapshots recorded yet. Click "Create Backup Now" above.'
              : isAr
                ? 'سجل اللقطات السحابية متاح لمشتركي باقة السنتر الاحترافية (Pro).'
                : 'On-demand verified snapshots are available on Pro tier.'}
          </div>
        ) : (
          <div className="cs-table-wrap">
            <table className="cs-table" style={{ textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr>
                  <th>{isAr ? 'كود اللقطة' : 'Code'}</th>
                  <th>{isAr ? 'التوقيت' : 'Timestamp'}</th>
                  <th>{isAr ? 'ملخص السجلات' : 'Records Summary'}</th>
                  <th>{isAr ? 'الحجم' : 'Size'}</th>
                  <th>{isAr ? 'بصمة SHA-256' : 'SHA-256'}</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((b) => {
                  const summary = b.recordsSummary || {};
                  return (
                    <tr key={b.id || b.snapshotCode}>
                      <td style={{ fontWeight: '800', color: 'var(--primary)', fontFamily: 'monospace' }}>
                        {b.snapshotCode}
                      </td>
                      <td>{formatDateTimeLabel(b.completedAt, lang)}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {isAr
                          ? `${summary.groups ?? 0} مجموعة • ${summary.enrollments ?? 0} قيد • ${summary.rooms ?? 0} قاعة`
                          : `${summary.groups ?? 0} groups • ${summary.enrollments ?? 0} enrollments`}
                      </td>
                      <td>{formatBackupSize(b.sizeBytes)}</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--success)' }}>
                        {String(b.checksumSha256 || '').slice(0, 16)}...
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
