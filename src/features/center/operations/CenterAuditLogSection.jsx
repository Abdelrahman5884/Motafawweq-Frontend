import React, { useMemo, useState } from 'react';
import { Activity, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { SBadge, SButton, SCard } from '../../../components/student/ui';

export const CenterAuditLogSection = ({
  auditLogs = [],
  onRefreshAuditLogs,
  lang = 'ar',
  isRtl = true,
}) => {
  const isAr = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
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
    <SCard padding={0} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden' }}>
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={18} color="var(--primary)" />
          <div>
            <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'سجل العمليات والرقابة والأمان' : 'Security Audit Trail'}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {isAr
                ? 'توثيق غير قابل للتعديل لكافة عمليات الإدارة والفروع والقاعات والمعلمين'
                : 'Immutable tenant-isolated audit trail of center operations'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="co-input"
              placeholder={isAr ? 'بحث في السجل...' : 'Search audit logs...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ height: '36px', paddingInlineStart: '34px', width: '200px', fontSize: '12.5px' }}
            />
            <Search
              size={14}
              color="var(--text-muted)"
              style={{
                position: 'absolute',
                insetInlineStart: '11px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          <select
            className="co-input"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            style={{ height: '36px', width: 'auto', paddingBlock: 0, fontSize: '12.5px', fontWeight: '700' }}
          >
            <option value="all">{isAr ? 'كل المستويات' : 'All Levels'}</option>
            <option value="info">{isAr ? 'عمليات اعتيادية' : 'Info'}</option>
            <option value="warning">{isAr ? 'عمليات حساسة / حذف' : 'Warning'}</option>
          </select>

          <SButton
            variant="ghost"
            size="sm"
            icon={<RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />}
            disabled={refreshing}
            onClick={handleRefresh}
          >
            {isAr ? 'تحديث' : 'Refresh'}
          </SButton>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div style={{ padding: '44px 24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
          <Activity size={30} color="var(--primary)" style={{ margin: '0 auto 10px', display: 'block', opacity: 0.75 }} />
          <div>{isAr ? 'لا توجد سجلات عمليات مطابقة حالياً.' : 'No matching audit log entries found.'}</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="co-table" style={{ minWidth: '680px', textAlign: isRtl ? 'right' : 'left' }}>
            <thead>
              <tr>
                <th>{isAr ? 'التوقيت' : 'Timestamp'}</th>
                <th>{isAr ? 'العملية' : 'Action'}</th>
                <th>{isAr ? 'المنفذ' : 'Actor'}</th>
                <th>{isAr ? 'التفاصيل' : 'Details'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const isWarning = log.level === 'warning' || log.level === 'critical';
                return (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', fontSize: '12px' }}>
                      {log.timestamp}
                    </td>
                    <td>
                      <SBadge variant={isWarning ? 'warning' : 'primary'} size="xs">
                        {log.actionAr}
                      </SBadge>
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{log.userAr}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>{log.detailsAr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </SCard>
  );
};
