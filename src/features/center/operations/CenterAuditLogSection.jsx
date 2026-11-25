import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InfoTooltip } from '../../../components/common/InfoTooltip';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { SBadge, SButton, SCard } from '../../../components/student/ui';

const PAGE_SIZE_OPTIONS = [10, 15, 25, 50];

/**
 * Generates a compact page number list with ellipsis (e.g. [1, '...', 4, 5, 6, '...', 12]).
 */
function buildPageWindow(currentPage, lastPage) {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, i) => i + 1);
  }
  const pages = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(lastPage - 1, currentPage + 1);

  if (start > 2) pages.push('ellipsis-start');
  for (let p = start; p <= end; p += 1) {
    pages.push(p);
  }
  if (end < lastPage - 1) pages.push('ellipsis-end');
  pages.push(lastPage);
  return pages;
}

export const CenterAuditLogSection = ({
  auditLogs = [],
  auditLogsMeta = null,
  loading = false,
  onRefreshAuditLogs,
  lang = 'ar',
  isRtl = true,
}) => {
  const isAr = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [page, setPage] = useState(() => Number(auditLogsMeta?.currentPage || 1));
  const [perPage, setPerPage] = useState(() => Number(auditLogsMeta?.perPage || 15));
  const [refreshing, setRefreshing] = useState(false);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Debounce server-side search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPage = useCallback(
    async (targetPage, targetPerPage, targetLevel, targetSearch) => {
      if (!onRefreshAuditLogs) return;
      setRefreshing(true);
      try {
        await onRefreshAuditLogs({
          page: targetPage,
          perPage: targetPerPage,
          level: targetLevel,
          search: targetSearch,
        });
      } finally {
        if (mountedRef.current) {
          setRefreshing(false);
        }
      }
    },
    [onRefreshAuditLogs]
  );

  // Fetch paginated logs on mount and whenever pagination or server filters change
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        fetchPage(page, perPage, levelFilter, debouncedSearch);
      }
    });
    return () => {
      active = false;
    };
  }, [page, perPage, levelFilter, debouncedSearch, fetchPage]);

  const currentPage = Number(auditLogsMeta?.currentPage || page || 1);
  const totalItems = Number(auditLogsMeta?.total ?? auditLogs.length);
  const lastPage = Math.max(1, Number(auditLogsMeta?.lastPage || Math.ceil(totalItems / perPage) || 1));
  const rangeFrom = Number(
    auditLogsMeta?.from ?? (totalItems > 0 ? (currentPage - 1) * perPage + 1 : 0)
  );
  const rangeTo = Number(
    auditLogsMeta?.to ?? (totalItems > 0 ? Math.min(totalItems, rangeFrom + auditLogs.length - 1) : 0)
  );

  // Keep local client filter as instant visual feedback while debounce catches up
  const visibleLogs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q || q === debouncedSearch.toLowerCase()) return auditLogs;
    return auditLogs.filter(
      (log) =>
        (log.actionAr || '').toLowerCase().includes(q) ||
        (log.detailsAr || '').toLowerCase().includes(q) ||
        (log.userAr || '').toLowerCase().includes(q) ||
        (log.event || '').toLowerCase().includes(q)
    );
  }, [auditLogs, searchTerm, debouncedSearch]);

  const pageNumbers = useMemo(
    () => buildPageWindow(currentPage, lastPage),
    [currentPage, lastPage]
  );

  const isBusy = loading || refreshing;

  const handleGoToPage = (nextPage) => {
    const clamped = Math.max(1, Math.min(lastPage, nextPage));
    if (clamped === page || isBusy) return;
    setPage(clamped);
  };

  const handleLevelChange = (nextLevel) => {
    setLevelFilter(nextLevel);
    setPage(1);
  };

  const handlePerPageChange = (nextSize) => {
    setPerPage(Number(nextSize) || 15);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setPage(1);
  };

  const handleManualRefresh = () => {
    fetchPage(currentPage, perPage, levelFilter, debouncedSearch);
  };

  return (
    <SCard
      padding={0}
      style={{
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-xs)',
        overflow: 'hidden',
      }}
    >
      {/* ── Top Header & Filter Controls ── */}
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
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={19} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? 'سجل العمليات والرقابة والأمان' : 'Security Audit Trail'}
              </h3>
              <SBadge variant="default" size="xs">
                {totalItems.toLocaleString()} {isAr ? 'عملية' : 'logs'}
              </SBadge>
              <InfoTooltip
                size={13}
                text={isAr
                  ? 'توثيق غير قابل للتعديل لكافة عمليات الإدارة والفروع والقاعات والمعلمين'
                  : 'Immutable tenant-isolated audit trail of center operations'}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="co-input"
              placeholder={isAr ? 'بحث في السجل...' : 'Search audit logs...'}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              style={{
                height: '36px',
                paddingInlineStart: '34px',
                paddingInlineEnd: searchTerm ? '30px' : '12px',
                width: '215px',
                fontSize: '12.5px',
              }}
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
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label={isAr ? 'مسح البحث' : 'Clear search'}
                style={{
                  position: 'absolute',
                  insetInlineEnd: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          <select
            aria-label={isAr ? 'تصفية حسب المستوى' : 'Filter by severity'}
            className="co-input"
            value={levelFilter}
            onChange={(e) => handleLevelChange(e.target.value)}
            style={{ height: '36px', width: 'auto', paddingBlock: 0, fontSize: '12.5px', fontWeight: '700' }}
          >
            <option value="all">{isAr ? 'كل المستويات' : 'All Levels'}</option>
            <option value="info">{isAr ? 'عمليات اعتيادية' : 'Info'}</option>
            <option value="warning">{isAr ? 'عمليات حساسة / حذف' : 'Warning'}</option>
            <option value="critical">{isAr ? 'تنبيهات حرجة' : 'Critical'}</option>
          </select>

          <SButton
            variant="ghost"
            size="sm"
            icon={<RefreshCw size={13} className={isBusy ? 'animate-spin' : ''} />}
            disabled={isBusy}
            onClick={handleManualRefresh}
          >
            {isAr ? 'تحديث' : 'Refresh'}
          </SButton>
        </div>
      </div>

      {/* ── Table Body ── */}
      {visibleLogs.length === 0 && !isBusy ? (
        <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
          <Activity size={30} color="var(--primary)" style={{ margin: '0 auto 10px', display: 'block', opacity: 0.7 }} />
          <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {isAr ? 'لا توجد سجلات عمليات مطابقة حالياً.' : 'No matching audit log entries found.'}
          </div>
          {(searchTerm || levelFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setDebouncedSearch('');
                setLevelFilter('all');
                setPage(1);
              }}
              style={{
                marginTop: '8px',
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {isAr ? 'إعادة تعيين الفلاتر' : 'Reset filters'}
            </button>
          )}
        </div>
      ) : (
        <div style={{ overflowX: 'auto', opacity: isBusy ? 0.6 : 1, transition: 'opacity 0.15s ease' }}>
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
              {visibleLogs.map((log) => {
                const isCritical = log.level === 'critical' || log.level === 'error';
                const isWarning = log.level === 'warning';
                const badgeVariant = isCritical ? 'danger' : isWarning ? 'warning' : 'primary';

                return (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', fontSize: '12px' }}>
                      {log.timestamp}
                    </td>
                    <td>
                      <SBadge variant={badgeVariant} size="xs">
                        {log.actionAr}
                      </SBadge>
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                      {log.userAr}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>{log.detailsAr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Server-Side Pagination Footer ── */}
      {totalItems > 0 && (
        <div className="co-pagination-bar">
          {/* Range summary + per-page picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            <span>
              {isAr
                ? `عرض ${rangeFrom.toLocaleString()} – ${rangeTo.toLocaleString()} من أصل ${totalItems.toLocaleString()} عملية`
                : `Showing ${rangeFrom.toLocaleString()}–${rangeTo.toLocaleString()} of ${totalItems.toLocaleString()} logs`}
            </span>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <label htmlFor="audit-per-page" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isAr ? 'لكل صفحة:' : 'Per page:'}
              </label>
              <select
                id="audit-per-page"
                className="co-input"
                value={perPage}
                disabled={isBusy}
                onChange={(e) => handlePerPageChange(e.target.value)}
                style={{
                  height: '32px',
                  width: 'auto',
                  padding: '0 10px',
                  fontSize: '12px',
                  fontWeight: '700',
                }}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Numbered Page Navigation */}
          <nav
            aria-label={isAr ? 'ترقيم صفحات سجل العمليات' : 'Audit log pagination'}
            className="co-page-controls"
          >
            <button
              type="button"
              className="co-page-btn"
              disabled={currentPage <= 1 || isBusy}
              onClick={() => handleGoToPage(1)}
              title={isAr ? 'الصفحة الأولى' : 'First page'}
              aria-label={isAr ? 'الصفحة الأولى' : 'First page'}
            >
              {isRtl ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
            </button>

            <button
              type="button"
              className="co-page-btn"
              disabled={currentPage <= 1 || isBusy}
              onClick={() => handleGoToPage(currentPage - 1)}
              title={isAr ? 'السابق' : 'Previous'}
              aria-label={isAr ? 'السابق' : 'Previous'}
            >
              {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              <span>{isAr ? 'السابق' : 'Prev'}</span>
            </button>

            {pageNumbers.map((item) =>
              typeof item === 'string' ? (
                <span key={item} className="co-page-ellipsis" aria-hidden="true">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  className={`co-page-btn${item === currentPage ? ' active' : ''}`}
                  disabled={isBusy}
                  aria-current={item === currentPage ? 'page' : undefined}
                  onClick={() => handleGoToPage(item)}
                >
                  {item}
                </button>
              )
            )}

            <button
              type="button"
              className="co-page-btn"
              disabled={currentPage >= lastPage || isBusy}
              onClick={() => handleGoToPage(currentPage + 1)}
              title={isAr ? 'التالي' : 'Next'}
              aria-label={isAr ? 'التالي' : 'Next'}
            >
              <span>{isAr ? 'التالي' : 'Next'}</span>
              {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>

            <button
              type="button"
              className="co-page-btn"
              disabled={currentPage >= lastPage || isBusy}
              onClick={() => handleGoToPage(lastPage)}
              title={isAr ? 'الصفحة الأخيرة' : 'Last page'}
              aria-label={isAr ? 'الصفحة الأخيرة' : 'Last page'}
            >
              {isRtl ? <ChevronsLeft size={14} /> : <ChevronsRight size={14} />}
            </button>
          </nav>
        </div>
      )}
    </SCard>
  );
};
