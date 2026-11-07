import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { MOCK_GATE_LOGS } from '../../../data/mockAdminData';
import {
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  Building,
  Clock,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Filter
} from 'lucide-react';

export const AdminAttendanceManager = () => {
  const { lang, isRtl } = useLanguage();
  const [logs, setLogs] = useState(MOCK_GATE_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [centerFilter, setCenterFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCenter = centerFilter === 'all' || log.centerName.includes(centerFilter);
    return matchesSearch && matchesCenter;
  });

  const grantedCount = logs.filter(l => l.status === 'granted').length;
  const deniedCount = logs.filter(l => l.status === 'denied').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Gate KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {[
          {
            label: lang === 'ar' ? 'إجمالي عمليات المسح اليوم' : 'Total Gate Scans Today',
            val: logs.length * 148,
            icon: QrCode,
            color: 'var(--primary)',
            bg: 'rgba(21, 136, 199, 0.12)',
            sub: lang === 'ar' ? 'عبر 48 بوابة ذكية' : 'Across 48 smart gates'
          },
          {
            label: lang === 'ar' ? 'عمليات دخول مصرحة' : 'Authorized Gate Entries',
            val: `${Math.round((grantedCount / (grantedCount + deniedCount)) * 100)}%`,
            icon: CheckCircle2,
            color: 'var(--primary)',
            bg: 'rgba(21, 136, 199, 0.12)',
            sub: lang === 'ar' ? `${grantedCount * 140} عملية ناجحة` : `${grantedCount * 140} successful admissions`
          },
          {
            label: lang === 'ar' ? 'محاولات دخول مرفوضة أو غير مسددة' : 'Denied / Unpaid Admissions',
            val: deniedCount * 8,
            icon: ShieldAlert,
            color: 'var(--primary-light, #5CB6DB)',
            bg: 'rgba(92, 182, 219, 0.15)',
            sub: lang === 'ar' ? 'تم تنبيه موظف الاستقبال' : 'Reception desk alerted'
          },
          {
            label: lang === 'ar' ? 'السناتر المتصلة حالياً' : 'Connected Center Nodes',
            val: lang === 'ar' ? '48 سنتر' : '48 Centers',
            icon: Building,
            color: 'var(--primary)',
            bg: 'rgba(21, 136, 199, 0.12)',
            sub: lang === 'ar' ? 'اتصال لحظي مع السيرفر' : 'Real-time WebSocket sync'
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
                backgroundColor: item.bg || 'rgba(21, 136, 199, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 240px', maxWidth: '360px' }}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث بكود الطالب، الاسم، أو المادة...' : 'Search student or barcode...'}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'all', labelAr: 'جميع السناتر', labelEn: 'All Centers' },
            { id: 'الرواد', labelAr: 'سنتر الرواد', labelEn: 'Al-Rowad Center' },
            { id: 'الأهرام', labelAr: 'سنتر الأهرام', labelEn: 'Al-Ahram Center' },
            { id: 'الأمراء', labelAr: 'سنتر الأمراء', labelEn: 'Al-Omaraa Center' }
          ].map(c => {
            const isSelected = centerFilter === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCenterFilter(c.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                  color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: isSelected ? '700' : '500',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? c.labelAr : c.labelEn}
              </button>
            );
          })}
        </div>
      </div>

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
              {filteredLogs.map(log => {
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
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                      {log.scanTime}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: isGranted ? 'rgba(21, 136, 199, 0.12)' : 'rgba(92, 182, 219, 0.15)',
                        color: isGranted ? 'var(--primary)' : 'var(--text-secondary)'
                      }}>
                        {isGranted ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        {lang === 'ar' ? (log.reasonAr || log.reason) : (log.reasonEn || log.reason)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

