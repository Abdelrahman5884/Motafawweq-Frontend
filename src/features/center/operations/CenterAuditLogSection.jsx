import React, { useMemo, useState } from 'react';
import { Activity, RefreshCw, Search, ShieldCheck } from 'lucide-react';

export const CenterAuditLogSection = ({
  auditLogs = [],
  onRefreshAuditLogs,
  lang = 'ar',
  isRtl = true,
}) => {
  const isAr = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all'); // 'all' | 'info' | 'warning'
  const [refreshing, setRefreshing] = useState(false);

  const filteredLogs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return auditLogs.filter((log) => {
      if (levelFilter !== 'all' && (log.level || 'info') !== levelFilter) return false;
      if (!q) return true;
      return (
        (log.actionAr || '').toLowerCase().includes(q) ||
        (log.detailsAr || '').toLowerCase().includes(q) ||
        (log.userAr || '').toLowerCase().includes(q) ||
        (log.event || '').toLowerCase().includes(q)
      );
    });
  }, [auditLogs, searchTerm, levelFilter]);

  const handleRefresh = async () => {
    if (!onRefreshAuditLogs || refreshing) return;
    setRefreshing(true);
    try {
      await onRefreshAuditLogs();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: 'var(--bg-app)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="var(--primary)" />
          <div>
            <h3 style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'سجل العمليات والرقابة والأمان (Audit Log)' : 'Security Audit Trail & Activity Log'}
            </h3>
            <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              {isAr
                ? 'توثيق غير قابل للتعديل لكافة عمليات الإدارة والفروع والقاعات والمجموعات'
                : 'Immutable tenant-isolated audit trail of center operations'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder={isAr ? 'بحث في السجل...' : 'Search audit logs...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                height: '36px',
                padding: '0 12px 0 32px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '700',
              }}
            />
            <Search
              size={14}
              color="var(--text-secondary)"
              style={{ position: 'absolute', left: '10px', top: '11px' }}
            />
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            style={{
              height: '36px',
              padding: '0 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '700',
            }}
          >
            <option value="all">{isAr ? 'كل المستويات' : 'All Levels'}</option>
            <option value="info">{isAr ? 'عمليات اعتيادية (Info)' : 'Info'}</option>
            <option value="warning">{isAr ? 'عمليات حساسة / حذف (Warning)' : 'Warning'}</option>
          </select>

          <button
            type="button"
            disabled={refreshing}
            onClick={handleRefresh}
            style={{
              height: '36px',
              padding: '0 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: refreshing ? 'wait' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span>{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div style={{ padding: '44px 24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
          <Activity size={32} color="var(--primary)" style={{ margin: '0 auto 10px', display: 'block', opacity: 0.7 }} />
          <div>
            {isAr ? 'لا توجد سجلات عمليات مطابقة حالياً.' : 'No matching audit log entries found.'}
          </div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}
              >
                <th style={{ padding: '12px 18px' }}>{isAr ? 'التوقيت' : 'Timestamp'}</th>
                <th style={{ padding: '12px 18px' }}>{isAr ? 'العملية' : 'Action'}</th>
                <th style={{ padding: '12px 18px' }}>{isAr ? 'المنفذ' : 'Actor'}</th>
                <th style={{ padding: '12px 18px' }}>{isAr ? 'التفاصيل والملاحظات' : 'Details'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const isWarning = log.level === 'warning' || log.level === 'critical';
                return (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '12.5px' }}>
                    <td style={{ padding: '12px 18px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {log.timestamp}
                    </td>
                    <td
                      style={{
                        padding: '12px 18px',
                        fontWeight: '800',
                        color: isWarning ? '#D97706' : 'var(--primary)',
                      }}
                    >
                      {log.actionAr}
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {log.userAr}
                    </td>
                    <td style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>
                      {log.detailsAr}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
