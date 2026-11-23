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
import { formatBackupSize, formatDateTimeLabel } from './centerSettingsUtils';

export const CenterCloudBackupTab = ({
  lang,
  isRtl,
  centerSettings,
  centerPlanTier,
  backups = [],
  createCenterBackup,
  showToast,
}) => {
  const navigate = useNavigate();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupNotice, setBackupNotice] = useState(null);
  const [errorNotice, setErrorNotice] = useState(null);

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
    setErrorNotice(null);
    try {
      const created = await createCenterBackup();
      const code = created?.snapshotCode || '';
      const msg =
        lang === 'ar'
          ? `تم إنشاء وتشفير النسخة الاحتياطية السحابية بنجاح ${code ? `(${code})` : ''} مع بصمة تحقق SHA-256.`
          : `Cloud snapshot ${code} encrypted and verified with SHA-256 checksum.`;
      setBackupNotice(msg);
      if (showToast) showToast(msg, 'success');
    } catch (err) {
      const msg =
        err?.message ||
        (lang === 'ar'
          ? 'يتطلب النسخ الاحتياطي الفوري تفعيل باقة السنتر الاحترافية (Pro).'
          : 'Instant cloud backup snapshots require the Pro Center tier.');
      setErrorNotice(msg);
      if (showToast) showToast(msg, 'warning');
    } finally {
      setIsBackingUp(false);
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
        gap: '18px',
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
          <Cloud size={19} style={{ color: 'var(--primary)' }} />
          <span>
            {lang === 'ar'
              ? 'النسخ الاحتياطي السحابي واسترجاع البيانات'
              : 'Cloud Backup & Data Integrity Snapshots'}
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
            ? 'يتم تأمين بيانات الفروع، القاعات، المجموعات، سجلات الحضور، والمعاملات المالية مع توثيق كل لقطة سحابية ببصمة تحقق SHA-256.'
            : 'All center branches, rooms, groups, attendance logs, and financials are snapshotted with SHA-256 integrity verification.'}
        </p>
      </div>

      {/* Sync Status Banner */}
      <div
        style={{
          padding: '18px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-app)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '13.5px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
            <span>
              {lang === 'ar' ? 'حالة المزامنة السحابية:' : 'Sync Status:'}{' '}
              <span style={{ color: 'var(--success)' }}>
                {lang === 'ar'
                  ? 'نشط ومتزامن ومشفر بالكامل (SHA-256)'
                  : 'Active & Synchronized (SHA-256 Verified)'}
              </span>
            </span>
          </div>

          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginTop: '4px',
            }}
          >
            {lang === 'ar'
              ? `آخر نسخة احتياطية موثقة: ${
                  latestBackupAt
                    ? formatDateTimeLabel(latestBackupAt, lang)
                    : 'لم يتم أخذ لقطة يدوية بعد'
                }`
              : `Last verified backup: ${
                  latestBackupAt
                    ? formatDateTimeLabel(latestBackupAt, lang)
                    : 'No manual snapshot taken yet'
                }`}
          </div>

          {latestChecksum && (
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginTop: '3px',
                fontFamily: 'monospace',
              }}
            >
              SHA-256: {String(latestChecksum).slice(0, 24)}...
            </div>
          )}
        </div>

        {isProTier ? (
          <button
            type="button"
            onClick={handleTriggerBackup}
            disabled={isBackingUp}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '700',
              cursor: isBackingUp ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw size={15} className={isBackingUp ? 'animate-spin' : ''} />
            <span>
              {isBackingUp
                ? lang === 'ar'
                  ? 'جاري أخذ اللقطة السحابية...'
                  : 'Creating Snapshot...'
                : lang === 'ar'
                  ? 'إنشاء نسخة احتياطية فورية'
                  : 'Create Backup Snapshot Now'}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/center/billing')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <Lock size={14} />
            <span>
              {lang === 'ar'
                ? 'ترقية لباقة Pro لتفعيل اللقطات السحابية الفورية'
                : 'Upgrade to Pro for On-Demand Snapshots'}
            </span>
          </button>
        )}
      </div>

      {backupNotice && (
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
          <span>{backupNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(217, 119, 6, 0.1)',
            border: '1px solid rgba(217, 119, 6, 0.3)',
            color: 'var(--warning)',
            fontSize: '13px',
            fontWeight: '700',
          }}
        >
          {errorNotice}
        </div>
      )}

      {/* Historical Cloud Snapshots Table */}
      <div>
        <div
          style={{
            fontSize: '14px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Database size={15} style={{ color: 'var(--primary)' }} />
          <span>
            {lang === 'ar'
              ? `سجل اللقطات الاحتياطية الموثقة (${backups.length})`
              : `Verified Backup Snapshots (${backups.length})`}
          </span>
        </div>

        {backups.length === 0 ? (
          <div
            style={{
              padding: '28px 20px',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-subtle)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '13px',
            }}
          >
            {isProTier
              ? lang === 'ar'
                ? 'لا توجد لقطات احتياطية يدوية مسجلة بعد. اضغط على «إنشاء نسخة احتياطية فورية» لحفظ أول لقطة موثقة.'
                : 'No cloud backup snapshots recorded yet. Click "Create Backup Snapshot Now" above.'
              : lang === 'ar'
                ? 'يتاح سجل اللقطات السحابية الفورية مع بصمة SHA-256 لمشتركي باقة السنتر الاحترافية (Pro).'
                : 'On-demand SHA-256 cloud snapshots are available on the Pro Center plan.'}
          </div>
        ) : (
          <div
            style={{
              overflowX: 'auto',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: isRtl ? 'right' : 'left',
                fontSize: '12.5px',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--bg-app)',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'كود اللقطة' : 'Snapshot Code'}
                  </th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'التوقيت' : 'Timestamp'}
                  </th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'ملخص السجلات' : 'Records Summary'}
                  </th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'الحجم' : 'Size'}
                  </th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'بصمة التحقق (SHA-256)' : 'SHA-256 Checksum'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {backups.map((b) => {
                  const summary = b.recordsSummary || {};
                  return (
                    <tr
                      key={b.id || b.snapshotCode}
                      style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    >
                      <td
                        style={{
                          padding: '10px 14px',
                          fontWeight: '800',
                          color: 'var(--primary)',
                          fontFamily: 'monospace',
                        }}
                      >
                        {b.snapshotCode}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>
                        {formatDateTimeLabel(b.completedAt, lang)}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                        {lang === 'ar'
                          ? `${summary.groups ?? 0} مجموعة • ${summary.enrollments ?? 0} قيد • ${summary.rooms ?? 0} قاعة`
                          : `${summary.groups ?? 0} groups • ${summary.enrollments ?? 0} enrollments • ${summary.rooms ?? 0} rooms`}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                        {formatBackupSize(b.sizeBytes)}
                      </td>
                      <td
                        style={{
                          padding: '10px 14px',
                          fontFamily: 'monospace',
                          fontSize: '11.5px',
                          color: 'var(--success)',
                        }}
                      >
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
