import React from 'react';
import { Check } from 'lucide-react';
import { SCard, SSection } from '../../../components/student/ui';
import { DEFAULT_STAGES_CATALOG } from './teacherSettingsConfig';

export const TeacherStagesSection = ({
  stagesCatalog,
  stagesTaught = [],
  onToggleGrade,
  onToggleStageGroup,
  lang,
}) => {
  const isAr = lang === 'ar';
  const catalog = Array.isArray(stagesCatalog) && stagesCatalog.length > 0
    ? stagesCatalog
    : DEFAULT_STAGES_CATALOG;

  const totalGrades = catalog.reduce((acc, st) => acc + (st.grades?.length || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'المراحل والمناهج الدراسية المعتمدة' : 'Stages & Curriculum'}
          action={
            <span
              style={{
                fontSize: '12px',
                fontWeight: '800',
                padding: '4px 10px',
                borderRadius: '999px',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
              }}
            >
              {stagesTaught.length} / {totalGrades} {isAr ? 'صف محدد' : 'selected'}
            </span>
          }
          style={{ marginBottom: 0 }}
        >
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
            {isAr
              ? 'حدد المراحل والصفوف الدراسية التي تقوم بتدريسها لتظهر تلقائياً عند إنشاء الكورسات والمجموعات.'
              : 'Select the stages and grades you teach to pre-align your courses and study groups.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {catalog.map((stage) => {
              const stageGradeNames = (stage.grades || []).map((g) => g.nameAr);
              const selectedCount = stageGradeNames.filter((name) => stagesTaught.includes(name)).length;
              const allSelected = stageGradeNames.length > 0 && selectedCount === stageGradeNames.length;

              return (
                <div
                  key={stage.id}
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '18px 20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                        {isAr ? stage.nameAr : stage.nameEn}
                      </h4>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {isAr ? stage.descAr : stage.descEn}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                        }}
                      >
                        {selectedCount} / {stageGradeNames.length} {isAr ? 'محدد' : 'selected'}
                      </span>

                      {stageGradeNames.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onToggleStageGroup(stageGradeNames, !allSelected)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-medium)',
                            backgroundColor: 'var(--bg-surface)',
                            color: 'var(--text-secondary)',
                            fontSize: '11.5px',
                            fontWeight: '700',
                            cursor: 'pointer',
                          }}
                        >
                          {allSelected
                            ? (isAr ? 'إلغاء الكل' : 'Clear all')
                            : (isAr ? 'تحديد الكل' : 'Select all')}
                        </button>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                      gap: '10px',
                    }}
                  >
                    {(stage.grades || []).map((grade) => {
                      const isSelected = stagesTaught.includes(grade.nameAr);
                      return (
                        <button
                          key={grade.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => onToggleGrade(grade.nameAr)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-surface)',
                            border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            textAlign: 'inherit',
                            fontFamily: 'inherit',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: isSelected ? '800' : '600',
                              color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                            }}
                          >
                            {isAr ? grade.nameAr : grade.nameEn}
                          </span>

                          <span
                            aria-hidden="true"
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                              border: isSelected ? 'none' : '1.5px solid var(--border-medium)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              flexShrink: 0,
                            }}
                          >
                            {isSelected && <Check size={12} />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </SSection>
      </SCard>
    </div>
  );
};
