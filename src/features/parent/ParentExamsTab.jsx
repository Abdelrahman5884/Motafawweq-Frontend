import React, { useMemo, useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { InfoTooltip } from '../../components/common/InfoTooltip';
import { ParentEmptyState } from './ParentEmptyState';

export const ParentExamsTab = ({
  examsData,
  exportingCsv,
  onExportCsv,
  loadingMore,
  onLoadMore,
  lang,
  isRtl,
}) => {
  const [subjectFilter, setSubjectFilter] = useState('all');

  const summary = examsData?.summary || { avgPercent: 0, totalGraded: 0, passedCount: 0, fullMarkCount: 0 };
  const items = useMemo(() => examsData?.items || [], [examsData]);
  const pagination = examsData?.pagination;

  const subjects = useMemo(() => {
    const unique = new Set(items.map((ex) => ex.subjectAr).filter(Boolean));
    return Array.from(unique);
  }, [items]);

  const filteredExams = useMemo(() => {
    if (subjectFilter === 'all') return items;
    return items.filter((ex) => ex.subjectAr === subjectFilter);
  }, [items, subjectFilter]);

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
            {lang === 'ar' ? 'كشف درجات الاختبارات' : 'Exam Scorecards'}
          </h3>
          <InfoTooltip
            text={lang === 'ar'
              ? 'نتائج اختبارات الطالب مع الترتيب على الدفعة وملاحظات المعلم وإمكانية التحميل بصيغة CSV.'
              : 'Graded exam results with cohort ranking, teacher remarks, and CSV download.'}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {subjects.length > 1 && (
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
              }}
            >
              <option value="all">{lang === 'ar' ? 'كل المواد' : 'All Subjects'}</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          )}

          <button
            type="button"
            disabled={exportingCsv || items.length === 0}
            onClick={onExportCsv}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: exportingCsv || items.length === 0 ? 'not-allowed' : 'pointer',
              opacity: exportingCsv || items.length === 0 ? 0.6 : 1,
            }}
          >
            {exportingCsv ? <Loader2 size={14} className="spin" /> : <Download size={14} />}
            <span>{lang === 'ar' ? 'تحميل كشف الدرجات (CSV)' : 'Download Scorecard (CSV)'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Bar */}
      {summary.totalGraded > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px',
          marginBottom: '18px',
        }}>
          {[
            { label: lang === 'ar' ? 'متوسط الدرجات' : 'Average Score', value: `${summary.avgPercent}%`, color: 'var(--primary)' },
            { label: lang === 'ar' ? 'اختبارات مصحّحة' : 'Graded Exams', value: summary.totalGraded, color: 'var(--text-primary)' },
            { label: lang === 'ar' ? 'اختبارات ناجحة' : 'Passed', value: summary.passedCount, color: 'var(--color-success, #16A34A)' },
            { label: lang === 'ar' ? 'درجات نهائية' : 'Full Marks', value: summary.fullMarkCount, color: '#D97706' },
          ].map((kpi) => (
            <div
              key={kpi.label}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>{kpi.label}</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: kpi.color, marginTop: '2px' }}>{kpi.value}</div>
            </div>
          ))}
        </div>
      )}

      {filteredExams.length === 0 ? (
        <ParentEmptyState
          icon={FileText}
          title={lang === 'ar' ? 'لا توجد اختبارات مسجلة للطالب بعد' : 'No exam attempts recorded yet'}
          subtitle={lang === 'ar'
            ? 'فور أداء الطالب لأي اختبار دوري أو شهري ستظهر نتيجته وترتيبه وملاحظات المعلم هنا.'
            : 'Once the student completes a quiz or exam, graded scores and teacher feedback will appear here.'}
        />
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredExams.map((ex) => {
              const isGraded = ex.status === 'graded';
              const badgeBg = !isGraded
                ? 'rgba(245, 158, 11, 0.12)'
                : ex.isPassed === false
                ? 'rgba(239, 68, 68, 0.12)'
                : 'rgba(22, 163, 74, 0.12)';
              const badgeColor = !isGraded
                ? '#D97706'
                : ex.isPassed === false
                ? '#DC2626'
                : 'var(--color-success, #16A34A)';

              return (
                <div
                  key={ex.id}
                  style={{
                    padding: '18px 20px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(21, 136, 199, 0.1)',
                        color: 'var(--primary)',
                        fontWeight: '800',
                      }}>
                        {lang === 'ar' ? ex.subjectAr : ex.subjectEn}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {ex.teacherAr}{ex.date ? ` • ${ex.date}` : ''}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                      {lang === 'ar' ? ex.titleAr : ex.titleEn}
                    </h4>

                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {lang === 'ar' ? 'التقييم:' : 'Note:'}{' '}
                      <span style={{ color: 'var(--text-primary)' }}>
                        &ldquo;{lang === 'ar' ? ex.notesAr : (ex.notesEn || ex.notesAr)}&rdquo;
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {lang === 'ar' ? ex.rankAr : ex.rankEn}
                      </div>
                      <div style={{ fontSize: '19px', fontWeight: '900', color: 'var(--primary)' }}>
                        {ex.score !== null ? `${ex.score} / ${ex.maxScore}` : '—'}
                      </div>
                    </div>

                    <div style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: badgeBg,
                      color: badgeColor,
                      fontSize: isGraded ? '15px' : '12px',
                      fontWeight: '900',
                    }}>
                      {isGraded ? ex.percent : (lang === 'ar' ? 'قيد التصحيح' : 'Pending')}
                    </div>
                  </div>
                </div>
              );
            })}
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
                <span>{lang === 'ar' ? 'عرض المزيد من الاختبارات' : 'Load More Exams'}</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
