import React from 'react';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { InfoTooltip } from '../../components/common/InfoTooltip';
import { ParentEmptyState } from './ParentEmptyState';

export const ParentAttendanceTab = ({
  attendanceData,
  statusFilter,
  onChangeFilter,
  filterLoading,
  loadingMore,
  onLoadMore,
  lang,
  isRtl,
}) => {
  const summary = attendanceData?.summary || {
    rate: 0,
    presentCount: 0,
    lateCount: 0,
    absentCount: 0,
    excusedCount: 0,
    totalCount: 0,
  };
  const logs = attendanceData?.items || [];
  const pagination = attendanceData?.pagination;

  const statPills = [
    { key: 'all', labelAr: 'الكل', labelEn: 'All', count: summary.totalCount, color: 'var(--primary)', bg: 'rgba(21, 136, 199, 0.1)' },
    { key: 'present', labelAr: 'حاضر', labelEn: 'Present', count: summary.presentCount, color: 'var(--color-success, #16A34A)', bg: 'rgba(22, 163, 74, 0.12)' },
    { key: 'late', labelAr: 'متأخر', labelEn: 'Late', count: summary.lateCount, color: '#D97706', bg: 'rgba(245, 158, 11, 0.12)' },
    { key: 'absent', labelAr: 'غائب', labelEn: 'Absent', count: summary.absentCount, color: '#DC2626', bg: 'rgba(239, 68, 68, 0.12)' },
    { key: 'excused', labelAr: 'بعذر', labelEn: 'Excused', count: summary.excusedCount, color: '#6366F1', bg: 'rgba(99, 102, 241, 0.12)' },
  ];

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-subtle)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'سجل الحضور بالسنتر' : 'Center Attendance Log'}
          </h3>
          <InfoTooltip
            text={lang === 'ar'
              ? 'رصد توقيت مسح باركود الطالب عند بوابة الدخول وحالة الحضور لكل حصة دراسية.'
              : 'Timestamped gate barcode scans and session attendance status.'}
          />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
          color: 'var(--color-success, #16A34A)',
          fontSize: '12.5px',
          fontWeight: '700',
        }}>
          <CheckCircle2 size={15} />
          <span>
            {lang === 'ar'
              ? `نسبة الانضباط: ${summary.rate}%`
              : `Punctuality: ${summary.rate}%`}
          </span>
        </div>
      </div>

      {/* Clickable KPI Filter Chips (Server-backed!) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
        {statPills.map((pill) => {
          const isSelected = statusFilter === pill.key;
          return (
            <button
              key={pill.key}
              type="button"
              disabled={filterLoading}
              onClick={() => onChangeFilter(pill.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? `1.5px solid ${pill.color}` : '1px solid var(--border-subtle)',
                backgroundColor: isSelected ? pill.bg : 'var(--bg-app)',
                color: isSelected ? pill.color : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: filterLoading ? 'wait' : 'pointer',
              }}
            >
              <span>{lang === 'ar' ? pill.labelAr : pill.labelEn}</span>
              <span style={{
                padding: '1px 6px',
                borderRadius: '99px',
                backgroundColor: 'var(--bg-surface)',
                color: pill.color,
                fontSize: '11px',
                fontWeight: '800',
              }}>
                {pill.count}
              </span>
            </button>
          );
        })}
        {filterLoading && <Loader2 size={15} color="var(--primary)" className="spin" />}
      </div>

      {logs.length === 0 ? (
        <ParentEmptyState
          icon={Clock}
          title={lang === 'ar' ? 'لا توجد سجلات حضور مطابقة' : 'No matching attendance logs'}
          subtitle={lang === 'ar'
            ? 'عند تسجيل حضور أو غياب الطالب في أي مجموعة ستظهر التفاصيل هنا مع وقت مسح الكود.'
            : 'Attendance records and gate check-in timestamps will appear here once logged.'}
        />
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'المادة والمعلم' : 'Subject & Teacher'}</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'القاعة' : 'Hall'}</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'وقت المسح' : 'Scan Time'}</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '13px 12px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? log.dateAr : log.date}
                    </td>
                    <td style={{ padding: '13px 12px', fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
                      {lang === 'ar' ? log.subjectAr : log.subjectEn}
                    </td>
                    <td style={{ padding: '13px 12px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      {log.roomAr}
                    </td>
                    <td style={{ padding: '13px 12px', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} color="var(--primary)" />
                        {lang === 'ar' ? log.scanTime : log.scanTimeEn}
                      </span>
                    </td>
                    <td style={{ padding: '13px 12px' }}>
                      <span style={{
                        fontSize: '11.5px',
                        fontWeight: '700',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: log.status === 'present'
                          ? 'rgba(22, 163, 74, 0.12)'
                          : log.status === 'absent'
                          ? 'rgba(239, 68, 68, 0.12)'
                          : log.status === 'excused'
                          ? 'rgba(99, 102, 241, 0.12)'
                          : 'rgba(245, 158, 11, 0.12)',
                        color: log.status === 'present'
                          ? 'var(--color-success, #16A34A)'
                          : log.status === 'absent'
                          ? '#DC2626'
                          : log.status === 'excused'
                          ? '#6366F1'
                          : '#D97706',
                      }}>
                        {lang === 'ar' ? log.statusAr : log.statusEn}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.currentPage < pagination.lastPage && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                disabled={loadingMore}
                onClick={onLoadMore}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: loadingMore ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {loadingMore && <Loader2 size={13} className="spin" />}
                <span>{lang === 'ar' ? 'عرض المزيد من السجلات' : 'Load More Records'}</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
