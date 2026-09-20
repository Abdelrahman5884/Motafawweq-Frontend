import React from 'react';

export const WorkspaceSummaryTab = ({ lesson, lang, isRtl }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Overview */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
          {lang === 'ar' ? 'ملخص المحتوى العام' : 'Lesson Overview'}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          {lang === 'ar' ? lesson.summary.overviewAr : lesson.summary.overview}
        </p>
      </div>

      {/* Definitions */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
          {lang === 'ar' ? 'أهم المصطلحات والتعريفات' : 'Key Definitions'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {lesson.summary.keyDefinitions.map((def, idx) => (
            <div key={idx} style={{
              padding: '14px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                {lang === 'ar' ? def.termAr : def.term}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {lang === 'ar' ? def.defAr : def.def}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Formulas */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
          {lang === 'ar' ? 'المعادلات الكيميائية والحركية' : 'Chemical Equations & Formulas'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {lesson.summary.keyFormulas.map((form, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {form.label}
              </span>
              <code style={{
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--primary)',
                backgroundColor: 'var(--bg-surface)',
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)'
              }}>
                {form.formula}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Takeaways and Traps */}
      <div style={{
        backgroundColor: 'rgba(239, 68, 68, 0.06)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--danger)', marginBottom: '14px' }}>
          {lang === 'ar' ? '⚠️ مصائد امتحانات الثانوية العامة وأهم النقاط' : '⚠️ Thanawya Amma Exam Traps & Takeaways'}
        </h3>
        <ul style={{ paddingRight: isRtl ? '20px' : '0', paddingLeft: isRtl ? '0' : '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(lang === 'ar' ? lesson.summary.takeawaysAr : lesson.summary.takeaways).map((item, idx) => (
            <li key={idx} style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
