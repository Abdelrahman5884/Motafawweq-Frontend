import React, { useMemo } from 'react';
import { CheckCircle2, Search, X, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { SPage } from '../../components/student/ui';
import '../../features/student/homework/homework.css';
import {
  HomeworkCard,
  HomeworkSubmissionModal,
  useStudentHomework,
} from '../../features/student/homework';

export const StudentHomeworkView = () => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';
  const hw = useStudentHomework(lang);

  const breadcrumbs = useMemo(
    () => [
      {
        labelAr: 'الواجبات والتكليفات',
        labelEn: 'Homework & Assignments',
      },
    ],
    []
  );
  useSetBreadcrumbs(breadcrumbs);

  const tabs = useMemo(
    () => [
      { id: 'all', labelAr: 'الكل', labelEn: 'All', count: hw.tabCounts.all },
      { id: 'pending', labelAr: 'مطلوب تسليمه', labelEn: 'Due', count: hw.tabCounts.pending },
      { id: 'submitted', labelAr: 'قيد المراجعة', labelEn: 'In Review', count: hw.tabCounts.submitted },
      { id: 'graded', labelAr: 'تم التصحيح', labelEn: 'Graded', count: hw.tabCounts.graded },
    ],
    [hw.tabCounts.all, hw.tabCounts.pending, hw.tabCounts.submitted, hw.tabCounts.graded]
  );

  return (
    <SPage maxWidth={1080}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          fontFamily: 'var(--font-arabic, sans-serif)',
          minWidth: 0,
        }}
      >
        {/* Toast Notification */}
        {hw.toast && (
          <div
            role="status"
            aria-live="polite"
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: 'min(92vw, 480px)',
              backgroundColor: '#059669',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(5, 150, 105, 0.35)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              fontWeight: '700',
              animation: 'hwModalFadeIn 0.2s ease',
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{hw.toast}</span>
          </div>
        )}

        {/* Header */}
        <div
          style={{
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              letterSpacing: '-0.01em',
            }}
          >
            {isAr ? 'الواجبات والتكليفات' : 'Homework & Assignments'}
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            {isAr
              ? 'استعرض واجباتك وملفات المعلمين، سلّم حلك نصاً أو ملف PDF/صورة، وتابع التقييم والملاحظات'
              : 'Review assigned homework sheets, submit text or PDF/image solutions, and track grading feedback'}
          </p>
        </div>

        {/* Error Banner with Retry */}
        {hw.loadError && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: '14px',
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: '#DC2626',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <AlertCircle size={17} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '13px', fontWeight: '700' }}>{hw.loadError}</span>
            </div>
            <button
              type="button"
              onClick={hw.refreshHomeworks}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(220, 38, 38, 0.35)',
                backgroundColor: 'var(--bg-surface)',
                color: '#DC2626',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={13} />
              <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
            </button>
          </div>
        )}

        {/* Filter Tabs + Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div
            role="tablist"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '4px',
              backgroundColor: 'var(--bg-subtle)',
              padding: '4px',
              borderRadius: '13px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {tabs.map((tab) => {
              const active = hw.filterTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => hw.setFilterTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 13px',
                    borderRadius: '9px',
                    border: 'none',
                    backgroundColor: active ? 'var(--bg-surface-elevated)' : 'transparent',
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: '12.5px',
                    fontWeight: active ? '800' : '600',
                    cursor: 'pointer',
                    boxShadow: active ? 'var(--shadow-xs)' : 'none',
                  }}
                >
                  <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: '800',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      backgroundColor: active ? 'var(--primary-surface)' : 'var(--bg-hover)',
                      color: active ? 'var(--primary)' : 'var(--text-muted)',
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                insetInlineStart: '11px',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              value={hw.searchQuery}
              onChange={(e) => hw.setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث في الواجبات أو المعلم...' : 'Search homework or teacher...'}
              style={{
                width: '100%',
                height: '38px',
                paddingInlineStart: '34px',
                paddingInlineEnd: hw.searchQuery ? '30px' : '12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {hw.searchQuery && (
              <button
                type="button"
                onClick={() => hw.setSearchQuery('')}
                aria-label={isAr ? 'مسح البحث' : 'Clear search'}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  insetInlineEnd: '8px',
                  border: 'none',
                  background: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Loading Skeletons / Empty State / Homework Grid */}
        {hw.loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 310px), 1fr))',
              gap: '20px',
            }}
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '20px',
                  minHeight: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ height: '20px', width: '44%', borderRadius: '7px', backgroundColor: 'var(--bg-subtle)' }} />
                <div style={{ height: '24px', width: '85%', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)' }} />
                <div style={{ height: '38px', width: '100%', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)' }} />
                <div style={{ height: '40px', width: '100%', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', marginTop: 'auto' }} />
              </div>
            ))}
          </div>
        ) : hw.filteredList.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              borderRadius: '20px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px dashed var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <FileText size={34} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {hw.homeworksList.length === 0
                ? isAr
                  ? 'لا توجد واجبات منشورة حالياً'
                  : 'No Homework Posted Yet'
                : isAr
                  ? 'لا توجد واجبات مطابقة للبحث أو الفلتر'
                  : 'No Matching Homework Found'}
            </div>
            <div style={{ fontSize: '13px', marginBottom: hw.hasFilters ? '14px' : 0 }}>
              {hw.homeworksList.length === 0
                ? isAr
                  ? 'ستظهر هنا جميع الواجبات والتكليفات التي يضيفها معلموك بمجرد نشرها.'
                  : 'Assignments posted by your teachers will appear here.'
                : isAr
                  ? 'جرّب تعديل كلمات البحث أو عرض جميع الواجبات.'
                  : 'Try adjusting your search or resetting filters.'}
            </div>
            {hw.hasFilters && (
              <button
                type="button"
                onClick={hw.resetFilters}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--primary)',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'عرض جميع الواجبات' : 'Reset Filters'}
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 310px), 1fr))',
              gap: '20px',
              animation: 'hwTabFadeIn 0.2s ease',
            }}
          >
            {hw.filteredList.map((item) => (
              <HomeworkCard
                key={item.id}
                hw={item}
                handleOpenHw={hw.openHomework}
                lang={lang}
              />
            ))}
          </div>
        )}

        {/* Homework Details, Preview, Submission & Evaluation Modal */}
        <HomeworkSubmissionModal
          selectedHw={hw.selectedHw}
          onClose={hw.closeHomework}
          showAttachmentPreview={hw.showAttachmentPreview}
          setShowAttachmentPreview={hw.setShowAttachmentPreview}
          answerText={hw.answerText}
          setAnswerText={hw.setAnswerText}
          selectedFile={hw.selectedFile}
          selectedFilePreviewUrl={hw.selectedFilePreviewUrl}
          removeExistingAttachment={hw.removeExistingAttachment}
          setRemoveExistingAttachment={hw.setRemoveExistingAttachment}
          handleSelectFile={hw.handleSelectFile}
          handleClearSelectedFile={hw.handleClearSelectedFile}
          handleSubmitHomework={hw.handleSubmitHomework}
          isSubmitting={hw.isSubmitting}
          submitError={hw.submitError}
          onClearError={() => hw.setSubmitError(null)}
          lang={lang}
          isRtl={isRtl}
        />
      </div>
    </SPage>
  );
};

export default StudentHomeworkView;
