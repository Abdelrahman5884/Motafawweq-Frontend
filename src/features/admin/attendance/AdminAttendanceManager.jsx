import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { adminApi } from '../../../services/adminApi';
import {
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  Building,
  ShieldAlert,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export const AdminAttendanceManager = () => {
  const { lang, isRtl } = useLanguage();

  const [logs, setLogs] = useState([]);
  const [centers, setCenters] = useState([]);
  const [summary, setSummary] = useState({
    totalScansToday: 0,
    authorizedEntriesToday: 0,
    authorizedRatePct: 100,
    deniedOrUnpaidCount: 0,
    connectedCentersCount: 0,
  });
  const [meta, setMeta] = useState({ current_page: 1, per_page: 25, total: 0, last_page: 1 });

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [centerFilter, setCenterFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportingCsv, setExportingCsv] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchGates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.attendance.getGates({
        search: debouncedSearch || undefined,
        center_id: centerFilter !== 'all' ? centerFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page,
        per_page: 25,
      });

      const payload = res?.data || {};
      setLogs(Array.isArray(payload.logs) ? payload.logs : []);
      setCenters(Array.isArray(payload.centers) ? payload.centers : []);
      if (payload.summary) {
        setSummary(payload.summary);
      }
      if (res?.meta) {
        setMeta({
          current_page: res.meta.current_page ?? 1,
          per_page: res.meta.per_page ?? 25,
          total: res.meta.total ?? 0,
          last_page: res.meta.last_page ?? 1,
        });
      }
    } catch (err) {
      setError(err?.message || (lang === 'ar' ? 'تعذر تحميل سجلات بوابات الحضور' : 'Failed to load gate attendance logs'));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, centerFilter, statusFilter, page, lang]);

  useEffect(() => {
    fetchGates();
  }, [fetchGates]);

  const handleExportCsv = async () => {
    setExportingCsv(true);
    try {
      await adminApi.attendance.exportCsv(
        {
          search: debouncedSearch || undefined,
          center_id: centerFilter !== 'all' ? centerFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        },
        `motafawweq-gate-logs-${new Date().toISOString().slice(0, 10)}.csv`
      );
    } catch (err) {
      setError(err?.message || (lang === 'ar' ? 'تعذر تصدير سجلات البوابات' : 'Failed to export CSV'));
    } finally {
      setExportingCsv(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Gate KPI Cards (Live Data) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {[
          {
            label: lang === 'ar' ? 'إجمالي عمليات المسح اليوم' : 'Total Gate Scans Today',
            val: Number(summary.totalScansToday || 0).toLocaleString(),
            icon: QrCode,
            color: 'var(--primary)',
            bg: 'rgba(21, 136, 199, 0.12)',
            sub: lang === 'ar'
              ? `عبر ${summary.connectedCentersCount} سنتر متصل`
              : `Across ${summary.connectedCentersCount} active centers`
          },
          {
            label: lang === 'ar' ? 'نسبة الدخول المصرح به' : 'Authorized Gate Rate',
            val: `${Number(summary.authorizedRatePct ?? 100).toFixed(1)}%`,
            icon: CheckCircle2,
            color: '#047857',
            bg: 'rgba(16, 185, 129, 0.12)',
            sub: lang === 'ar'
              ? `${Number(summary.authorizedEntriesToday || 0).toLocaleString()} عملية دخول ناجحة اليوم`
              : `${Number(summary.authorizedEntriesToday || 0).toLocaleString()} authorized entries today`
          },
          {
            label: lang === 'ar' ? 'محاولات مرفوضة أو غير مسددة' : 'Denied / Unpaid Admissions',
            val: Number(summary.deniedOrUnpaidCount || 0).toLocaleString(),
            icon: ShieldAlert,
            color: '#B45309',
            bg: 'rgba(245, 158, 11, 0.14)',
            sub: lang === 'ar' ? 'تنبيه فوري لموظف الاستقبال' : 'Reception desk alerted'
          },
          {
            label: lang === 'ar' ? 'السناتر المتصلة حالياً' : 'Connected Center Nodes',
            val: lang === 'ar'
              ? `${summary.connectedCentersCount} سنتر`
              : `${summary.connectedCentersCount} Centers`,
            icon: Building,
            color: 'var(--primary)',
            bg: 'rgba(92, 182, 219, 0.16)',
            sub: lang === 'ar' ? 'مزامنة مباشرة مع قاعدة البيانات' : 'Live database sync'
          }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '18px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: item.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
                flexShrink: 0,
              }}>
                <Icon size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {item.val}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {item.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '14px 18px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 240px', maxWidth: '340px' }}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث بكود الطالب، الاسم، أو المادة...' : 'Search student, barcode, or subject...'}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px'
            }}
          />
        </div>

        {/* Dynamic Centers & Status Filters */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => { setCenterFilter('all'); setPage(1); }}
            style={{
              padding: '6px 12px', borderRadius: '8px',
              border: centerFilter === 'all' ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
              backgroundColor: centerFilter === 'all' ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
              color: centerFilter === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '12px', fontWeight: centerFilter === 'all' ? '700' : '500', cursor: 'pointer'
            }}
          >
            {lang === 'ar' ? 'جميع السناتر' : 'All Centers'}
          </button>

          {centers.slice(0, 6).map(c => {
            const isSelected = String(centerFilter) === String(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => { setCenterFilter(String(c.id)); setPage(1); }}
                style={{
                  padding: '6px 12px', borderRadius: '8px',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                  color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '12px', fontWeight: isSelected ? '700' : '500', cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? c.nameAr : (c.nameEn || c.nameAr)}
              </button>
            );
          })}

          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            style={{
              padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
            }}
          >
            <option value="all">{lang === 'ar' ? 'كل الحالات' : 'All Results'}</option>
            <option value="granted">{lang === 'ar' ? 'دخول مصرح' : 'Granted'}</option>
            <option value="denied">{lang === 'ar' ? 'مرفوض / غير مسدد' : 'Denied / Unpaid'}</option>
          </select>

          <button
            type="button"
            onClick={fetchGates}
            disabled={loading}
            title={lang === 'ar' ? 'تحديث' : 'Refresh'}
            style={{
              width: '34px', height: '34px', borderRadius: '8px', border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exportingCsv}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '8px',
              border: '1px solid var(--border-subtle)', backgroundColor: 'var(--primary)', color: '#fff',
              fontSize: '12px', fontWeight: '700', cursor: exportingCsv ? 'wait' : 'pointer'
            }}
          >
            <Download size={14} />
            <span>{exportingCsv ? (lang === 'ar' ? 'تصدير...' : 'Exporting...') : 'CSV'}</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px',
          padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#B91C1C', fontSize: '13px', fontWeight: '600'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={16} />{error}</span>
          <button type="button" onClick={fetchGates} style={{ backgroundColor: '#B91C1C', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
            {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* Logs Table */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="responsive-table-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="responsive-table" style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
            <thead>
              <tr style={{
                backgroundColor: 'var(--bg-subtle)',
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--text-secondary)',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'الطالب' : 'Student'}</th>
                <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'باركود الطالب' : 'Barcode ID'}</th>
                <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'السنتر والقاعة' : 'Center / Room'}</th>
                <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'المادة / المجموعة' : 'Cohort'}</th>
                <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'وقت المسح' : 'Scan Time'}</th>
                <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'نتيجة الفحص' : 'Access Result'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '44px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'جاري تحميل سجلات البوابات...' : 'Loading gate attendance logs...'}
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '44px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'لا توجد سجلات حضور مسجلة تطابق معايير البحث' : 'No gate scan records found'}
                  </td>
                </tr>
              ) : (
                logs.map(log => {
                  const isGranted = log.status === 'granted';
                  return (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? (log.studentNameAr || log.studentName) : (log.studentNameEn || log.studentName)}
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: '700' }}>
                        {log.barcode}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        <div>{lang === 'ar' ? (log.centerNameAr || log.centerName) : (log.centerNameEn || log.centerName)}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang === 'ar' ? (log.hallAr || log.hall) : (log.hallEn || log.hall)}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        {lang === 'ar' ? (log.subjectAr || log.subject) : (log.subjectEn || log.subject)}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '12px' }} dir="ltr">
                        {log.scanTime}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px',
                          borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                          backgroundColor: isGranted ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                          color: isGranted ? '#047857' : '#B91C1C'
                        }}>
                          {isGranted ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                          {lang === 'ar' ? (log.reasonAr || log.reason) : (log.reasonEn || log.reason)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px',
            borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', fontSize: '12px', color: 'var(--text-secondary)'
          }}>
            <span>
              {lang === 'ar' ? `صفحة ${meta.current_page} من ${meta.last_page} (${meta.total} سجل)` : `Page ${meta.current_page} of ${meta.last_page} (${meta.total} records)`}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                disabled={meta.current_page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px',
                  border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)',
                  cursor: meta.current_page <= 1 ? 'not-allowed' : 'pointer', opacity: meta.current_page <= 1 ? 0.5 : 1
                }}
              >
                {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                <span>{lang === 'ar' ? 'السابق' : 'Prev'}</span>
              </button>
              <button
                type="button"
                disabled={meta.current_page >= meta.last_page}
                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px',
                  border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)',
                  cursor: meta.current_page >= meta.last_page ? 'not-allowed' : 'pointer', opacity: meta.current_page >= meta.last_page ? 0.5 : 1
                }}
              >
                <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
                {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
