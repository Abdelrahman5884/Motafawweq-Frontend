import React from 'react';
import {
  ClipboardList,
  Plus,
  Unlock,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  TrendingUp,
  Search,
  X,
  Copy,
  Trash2,
  Clock,
  FileCheck,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export const ExamsListView = ({
  exams = [],
  filteredExams = [],
  isLoading,
  loadError,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  isAr,
  isDark,
  busyExamId,
  onRetry,
  onCreateNew,
  onOpenExam,
  onOpenSubmissions,
  onToggleStatus,
  onToggleResults,
  onDuplicate,
  onPromptDelete,
}) => {
  const totalExamsCount = exams.length;
  const activeExamsCount = exams.filter((e) => e.status === 'active').length;
  const totalPendingGrading = exams.reduce((sum, e) => sum + (Number(e.pendingGradingCount) || 0), 0);
  const totalSubmissions = exams.reduce((sum, e) => sum + (Number(e.submissionsCount) || 0), 0);
  const gradedExamsWithScores = exams.filter(
    (e) => (Number(e.gradedSubmissionsCount ?? e.submissionsCount) || 0) > 0 && Number(e.fullMark) > 0
  );
  const overallAvgPct = gradedExamsWithScores.length > 0
    ? `${(
        gradedExamsWithScores.reduce((sum, e) => sum + (Number(e.avgScore || 0) / Number(e.fullMark)) * 100, 0) /
        gradedExamsWithScores.length
      ).toFixed(1)}%`
    : '0%';

  const summaryCards = [
    {
      label: isAr ? 'إجمالي الاختبارات' : 'Total Exams',
      val: totalExamsCount.toLocaleString(),
      sub: isAr ? 'اختبارات تم إنشاؤها' : 'Created assessments',
      icon: ClipboardList,
      accent: 'var(--primary)',
    },
    {
      label: isAr ? 'متاح للطلاب الآن' : 'Active Exams',
      val: activeExamsCount.toLocaleString(),
      sub: isAr ? 'متاحة للحل حالياً' : 'Open for students',
      icon: Unlock,
      accent: 'var(--success)',
    },
    {
      label: isAr ? 'بانتظار التصحيح والاعتماد' : 'Pending Review',
      val: totalPendingGrading.toLocaleString(),
      sub: totalPendingGrading > 0
        ? (isAr ? 'أسئلة مقالية تحتاج اعتمادك' : 'Essays awaiting grading')
        : (isAr ? 'لا توجد إجابات معلقة' : 'All caught up'),
      icon: Clock,
      accent: totalPendingGrading > 0 ? '#D97706' : 'var(--success)',
      highlight: totalPendingGrading > 0,
      onClick: totalPendingGrading > 0 ? () => setStatusFilter('pending_grading') : undefined,
    },
    {
      label: isAr ? 'التسليمات ومتوسط الدرجات' : 'Submissions & Avg',
      val: `${totalSubmissions.toLocaleString()} • ${overallAvgPct}`,
      sub: totalSubmissions > 0
        ? (isAr ? 'إجمالي الإجابات المسلمة' : 'Total student submissions')
        : (isAr ? 'لا توجد تسليمات بعد' : 'No submissions yet'),
      icon: TrendingUp,
      accent: 'var(--primary)',
    },
  ];

  const filterTabs = [
    { id: 'all', label: isAr ? 'الكل' : 'All', count: exams.length },
    { id: 'active', label: isAr ? 'متاح للطلاب' : 'Active', count: activeExamsCount },
    { id: 'closed', label: isAr ? 'مغلق' : 'Closed', count: exams.filter((e) => e.status === 'closed').length },
    {
      id: 'pending_grading',
      label: isAr ? 'بانتظار التصحيح' : 'Needs Grading',
      count: exams.filter((e) => Number(e.pendingGradingCount || 0) > 0).length,
      warning: totalPendingGrading > 0,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '20px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              color: 'var(--primary)',
              backgroundColor: 'rgba(0, 102, 204, 0.08)',
              padding: '3px 9px',
              borderRadius: '6px',
            }}>
              {isAr ? 'بنك الأسئلة والاختبارات والتصحيح' : 'Exams & Grading Hub'}
            </span>
          </div>

          <h1 style={{
            fontSize: '21px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: 0,
            fontFamily: 'var(--font-heading), var(--font-arabic)',
          }}>
            {isAr ? 'إدارة الاختبارات ومراجعة إجابات الطلاب' : 'Exam Management & Student Review'}
          </h1>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
            {isAr
              ? 'إنشاء وتعديل الامتحانات، مراجعة إجابات الطلاب وتصحيح الأسئلة المقالية واعتماد الدرجات النهائية'
              : 'Create exams, review student submissions, grade essay answers, and approve final scores'}
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            borderRadius: '8px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '800',
            border: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Plus size={16} />
          <span>{isAr ? 'إنشاء اختبار جديد' : 'New Exam'}</span>
        </button>
      </div>

      {/* Summary Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
        gap: '12px',
        marginBottom: '20px',
      }}>
        {summaryCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              role={stat.onClick ? 'button' : undefined}
              tabIndex={stat.onClick ? 0 : undefined}
              onClick={stat.onClick}
              onKeyDown={(e) => {
                if (stat.onClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  stat.onClick();
                }
              }}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: `1px solid ${stat.highlight ? 'rgba(245, 158, 11, 0.45)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '14px 16px',
                boxShadow: 'var(--shadow-xs)',
                cursor: stat.onClick ? 'pointer' : 'default',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {stat.label}
                </span>
                <Icon size={15} color={stat.accent} />
              </div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: stat.highlight ? '#D97706' : 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                {stat.val}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {stat.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter Strip */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '10px 14px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '7px',
          padding: '7px 12px',
          flex: 1,
          minWidth: '220px',
          maxWidth: '420px',
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder={isAr ? 'بحث في أسماء الاختبارات والمقررات...' : 'Search exams or courses...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              width: '100%',
              fontFamily: 'inherit',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              aria-label={isAr ? 'مسح البحث' : 'Clear search'}
              onClick={() => setSearchQuery('')}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {filterTabs.map((f) => {
            const active = statusFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${active ? 'var(--primary)' : f.warning ? 'rgba(245, 158, 11, 0.35)' : 'var(--border-subtle)'}`,
                  backgroundColor: active ? 'rgba(0, 102, 204, 0.1)' : f.warning ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                  color: active ? 'var(--primary)' : f.warning ? '#D97706' : 'var(--text-secondary)',
                  fontSize: '11.5px',
                  fontWeight: active || f.warning ? '800' : '600',
                  cursor: 'pointer',
                }}
              >
                {f.label} ({f.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Error State */}
      {loadError && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '14px 18px',
            marginBottom: '18px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.28)',
            color: 'var(--text-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '700' }}>
            <AlertTriangle size={18} color="#EF4444" />
            <span>{loadError}</span>
          </div>
          <button
            type="button"
            onClick={onRetry}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} />
            <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))',
          gap: '16px',
        }}>
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              style={{
                height: '210px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      ) : filteredExams.length === 0 ? (
        /* Empty State */
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px dashed var(--border-medium, var(--border-subtle))',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 24px',
          textAlign: 'center',
        }}>
          <ClipboardList size={40} color="var(--text-muted)" style={{ opacity: 0.4, margin: '0 auto 12px', display: 'block' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
            {exams.length === 0
              ? (isAr ? 'لم تقم بإنشاء أي اختبارات بعد' : 'No exams created yet')
              : (isAr ? 'لا توجد اختبارات مطابقة للبحث أو الفلتر' : 'No exams match your filters')}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px' }}>
            {exams.length === 0
              ? (isAr ? 'أنشئ أول اختبار (اختيار من متعدد، صح وخطأ، ومقالي) وابدأ تقييم طلابك.' : 'Create your first MCQ, True/False, or Essay exam to start assessing students.')
              : (isAr ? 'جرّب تعديل البحث أو إعادة ضبط فلتر الحالة.' : 'Try clearing your search or status filter.')}
          </p>
          {exams.length === 0 ? (
            <button
              type="button"
              onClick={onCreateNew}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Plus size={15} />
              <span>{isAr ? 'إنشاء أول اختبار' : 'Create First Exam'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'عرض كافة الاختبارات' : 'Show All Exams'}
            </button>
          )}
        </div>
      ) : (
        /* Exams Grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '16px',
        }}>
          {filteredExams.map((exam) => {
            const isOpen = exam.status === 'active';
            const pendingCount = Number(exam.pendingGradingCount || 0);
            const subsCount = Number(exam.submissionsCount || 0);
            const isBusy = busyExamId === exam.id;

            return (
              <div
                key={exam.id}
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: `1px solid ${pendingCount > 0 ? 'rgba(245, 158, 11, 0.45)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xs)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.15s ease',
                  opacity: isBusy ? 0.7 : 1,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = pendingCount > 0 ? 'rgba(245, 158, 11, 0.45)' : 'var(--border-subtle)'; }}
              >
                <div>
                  {/* Header Tag + Quick Toggles */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '700',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '2px 7px',
                      borderRadius: '5px',
                      maxWidth: '160px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {exam.courseTitleAr}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onToggleStatus(exam.id)}
                        title={isOpen ? (isAr ? 'الامتحان متاح للطلاب (اضغط للإغلاق)' : 'Open (click to close)') : (isAr ? 'الامتحان مغلق (اضغط للإتاحة)' : 'Closed (click to open)')}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: `1px solid ${isOpen ? 'var(--primary)' : 'var(--border-subtle)'}`,
                          backgroundColor: isOpen ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                          color: isOpen ? 'var(--primary)' : 'var(--text-secondary)',
                          fontSize: '10.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        {isOpen ? <Unlock size={11} /> : <Lock size={11} />}
                        <span>{isOpen ? (isAr ? 'متاح' : 'Open') : (isAr ? 'مغلق' : 'Closed')}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onToggleResults(exam.id)}
                        title={exam.showResults !== false ? (isAr ? 'النتيجة معلنة (اضغط للحجب)' : 'Results visible') : (isAr ? 'النتيجة محجوبة (اضغط للإظهار)' : 'Results hidden')}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: `1px solid ${exam.showResults !== false ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                          backgroundColor: exam.showResults !== false
                            ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5')
                            : (isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB'),
                          color: exam.showResults !== false ? 'var(--success)' : '#D97706',
                          fontSize: '10.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        {exam.showResults !== false ? <Eye size={11} /> : <EyeOff size={11} />}
                        <span>{exam.showResults !== false ? (isAr ? 'معلنة' : 'Shown') : (isAr ? 'محجوبة' : 'Hidden')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onOpenExam(exam.id)}
                    style={{
                      fontSize: '15px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      margin: '0 0 10px',
                      lineHeight: 1.4,
                      cursor: 'pointer',
                    }}
                  >
                    {isAr ? exam.titleAr : (exam.titleEn || exam.titleAr)}
                  </h3>

                  {/* Pending Grading Alert Pill */}
                  {pendingCount > 0 && (
                    <button
                      type="button"
                      onClick={() => onOpenSubmissions(exam.id)}
                      style={{
                        width: '100%',
                        marginBottom: '10px',
                        padding: '7px 10px',
                        borderRadius: '7px',
                        backgroundColor: 'rgba(245, 158, 11, 0.12)',
                        border: '1px solid rgba(245, 158, 11, 0.35)',
                        color: '#D97706',
                        fontSize: '11.5px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={13} />
                        {isAr
                          ? `${pendingCount} إجابة بانتظار تصحيح المقالي والاعتماد`
                          : `${pendingCount} submission(s) awaiting essay review`}
                      </span>
                      <span>{isAr ? 'راجع الآن ←' : 'Review →'}</span>
                    </button>
                  )}

                  {/* Compact Specs Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                    fontSize: '11.5px',
                    color: 'var(--text-secondary)',
                    padding: '8px 10px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: '6px',
                    marginBottom: '14px',
                  }}>
                    <span>{exam.questions?.length ?? exam.questionsCount ?? 0} {isAr ? 'سؤال' : 'Q'}</span>
                    <span>•</span>
                    <span>{exam.durationMinutes} {isAr ? 'دقيقة' : 'min'}</span>
                    <span>•</span>
                    <span>{exam.fullMark} {isAr ? 'درجة' : 'pts'}</span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: '700', color: subsCount > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                      <CheckCircle2 size={12} />
                      {subsCount} {isAr ? 'تسليم' : 'sub'}
                    </span>
                  </div>
                </div>

                {/* Card Action Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-subtle)',
                  gap: '6px',
                }}>
                  <button
                    type="button"
                    onClick={() => onOpenExam(exam.id)}
                    style={{
                      padding: '7px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                      flex: 1,
                    }}
                  >
                    {isAr ? 'الأسئلة والنموذج' : 'Questions'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenSubmissions(exam.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      backgroundColor: pendingCount > 0 ? 'rgba(245, 158, 11, 0.14)' : 'var(--bg-subtle)',
                      color: pendingCount > 0 ? '#D97706' : 'var(--text-primary)',
                      fontSize: '11.5px',
                      fontWeight: '800',
                      border: `1px solid ${pendingCount > 0 ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      flex: 1,
                    }}
                  >
                    <FileCheck size={13} />
                    <span>
                      {isAr ? 'إجابات الطلاب' : 'Submissions'}
                      {subsCount > 0 ? ` (${subsCount})` : ''}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => onDuplicate(exam.id)}
                    title={isAr ? 'نسخ ومضاعفة الامتحان' : 'Duplicate Exam'}
                    aria-label={isAr ? 'نسخ الامتحان' : 'Duplicate Exam'}
                    style={{
                      padding: '7px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    <Copy size={13} />
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => onPromptDelete(exam)}
                    title={isAr ? 'حذف الامتحان' : 'Delete Exam'}
                    aria-label={isAr ? 'حذف الامتحان' : 'Delete Exam'}
                    style={{
                      padding: '7px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
