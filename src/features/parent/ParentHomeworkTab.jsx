import React, { useMemo, useState } from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import { InfoTooltip } from '../../components/common/InfoTooltip';
import { ParentEmptyState } from './ParentEmptyState';

export const ParentHomeworkTab = ({ homeworkData, lang }) => {
  const [statusFilter, setStatusFilter] = useState('all');

  const summary = homeworkData?.summary || { total: 0, graded: 0, submitted: 0, pending: 0, rejected: 0, overdue: 0 };
  const items = useMemo(() => homeworkData?.items || [], [homeworkData]);

  const filteredItems = useMemo(() => {
    if (statusFilter === 'all') return items;
    if (statusFilter === 'overdue') return items.filter((hw) => hw.isOverdue);
    return items.filter((hw) => hw.status === statusFilter);
  }, [items, statusFilter]);

  const chips = [
    { key: 'all', labelAr: 'الكل', labelEn: 'All', count: summary.total, color: 'var(--primary)', bg: 'rgba(21, 136, 199, 0.1)' },
    { key: 'pending', labelAr: 'لم يُسلّم', labelEn: 'Pending', count: summary.pending, color: '#D97706', bg: 'rgba(245, 158, 11, 0.12)' },
    { key: 'submitted', labelAr: 'بانتظار التصحيح', labelEn: 'Submitted', count: summary.submitted, color: 'var(--primary)', bg: 'rgba(21, 136, 199, 0.12)' },
    { key: 'graded', labelAr: 'تم التصحيح', labelEn: 'Graded', count: summary.graded, color: 'var(--color-success, #16A34A)', bg: 'rgba(22, 163, 74, 0.12)' },
    { key: 'rejected', labelAr: 'إعادة تسليم', labelEn: 'Rejected', count: summary.rejected, color: '#DC2626', bg: 'rgba(239, 68, 68, 0.12)' },
  ];

  if (summary.overdue > 0) {
    chips.push({
      key: 'overdue',
      labelAr: 'متأخر',
      labelEn: 'Overdue',
      count: summary.overdue,
      color: '#DC2626',
      bg: 'rgba(239, 68, 68, 0.12)',
    });
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-subtle)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'متابعة الواجبات' : 'Homework Tracker'}
        </h3>
        <InfoTooltip
          text={lang === 'ar'
            ? 'متابعة الواجبات المسندة للطالب وحالة التسليم والدرجات وملاحظات المعلم.'
            : 'Track assigned, submitted, and graded homework with teacher remarks.'}
        />
      </div>

      {/* Clickable Filter Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
        {chips.map((chip) => {
          const isSelected = statusFilter === chip.key;
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => setStatusFilter(chip.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? `1.5px solid ${chip.color}` : '1px solid var(--border-subtle)',
                backgroundColor: isSelected ? chip.bg : 'var(--bg-app)',
                color: isSelected ? chip.color : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <span>{lang === 'ar' ? chip.labelAr : chip.labelEn}</span>
              <span style={{
                padding: '1px 6px',
                borderRadius: '99px',
                backgroundColor: 'var(--bg-surface)',
                color: chip.color,
                fontSize: '11px',
                fontWeight: '800',
              }}>
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredItems.length === 0 ? (
        <ParentEmptyState
          icon={FileText}
          title={lang === 'ar' ? 'لا توجد واجبات مطابقة حالياً' : 'No homework assignments found'}
          subtitle={lang === 'ar'
            ? 'الواجبات المسندة للطالب من المعلمين ستظهر هنا مع مواعيد التسليم والدرجات.'
            : 'Assignments posted by teachers will appear here with deadlines and grades.'}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredItems.map((hw) => (
            <div
              key={hw.id}
              style={{
                padding: '18px 20px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-app)',
                border: hw.isOverdue ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div style={{ flex: 1, minWidth: '250px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(21, 136, 199, 0.1)',
                    color: 'var(--primary)',
                    fontWeight: '800',
                  }}>
                    {hw.subjectAr}
                  </span>
                  {hw.isOverdue && (
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      color: '#DC2626',
                      fontWeight: '800',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <AlertTriangle size={11} />
                      <span>{lang === 'ar' ? 'متأخر عن الموعد' : 'Overdue'}</span>
                    </span>
                  )}
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {hw.teacherAr} • {lang === 'ar' ? hw.deadlineAr : (hw.deadlineEn || hw.deadlineAr)}
                  </span>
                </div>

                <h4 style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                  {hw.titleAr}
                </h4>

                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {lang === 'ar' ? hw.notesAr : (hw.notesEn || hw.notesAr)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {hw.earnedScore !== null && (
                  <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--color-success, #16A34A)' }}>
                    {hw.earnedScore} / {hw.maxScore}
                  </div>
                )}

                <span style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: hw.status === 'graded'
                    ? 'rgba(22, 163, 74, 0.12)'
                    : hw.status === 'submitted'
                    ? 'rgba(21, 136, 199, 0.12)'
                    : hw.status === 'rejected' || hw.isOverdue
                    ? 'rgba(239, 68, 68, 0.12)'
                    : 'rgba(245, 158, 11, 0.12)',
                  color: hw.status === 'graded'
                    ? 'var(--color-success, #16A34A)'
                    : hw.status === 'submitted'
                    ? 'var(--primary)'
                    : hw.status === 'rejected' || hw.isOverdue
                    ? '#DC2626'
                    : '#D97706',
                }}>
                  {lang === 'ar' ? hw.statusAr : hw.statusEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
