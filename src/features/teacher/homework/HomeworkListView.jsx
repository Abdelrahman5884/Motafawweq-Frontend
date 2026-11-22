import React, { useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  X,
  FileCheck,
  Trash2,
  Edit3,
  Layers,
  Calendar,
  MapPin,
  Users,
  BookOpen,
  Cloud,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const HomeworkListView = ({
  homeworks,
  availableCourses,
  isLoading,
  loadError,
  searchQuery,
  onSearchChange,
  filterCourse,
  onFilterCourseChange,
  filterStatus,
  onFilterStatusChange,
  isAr,
  isDark,
  onRetry,
  onOpenCreate,
  onOpenEdit,
  onOpenDetail,
  onPromptDelete,
}) => {
  const courseOptions = useMemo(() => {
    const names = new Set();
    availableCourses.forEach((c) => {
      const label = c.titleAr || c.title;
      if (label) names.add(label);
    });
    homeworks.forEach((hw) => {
      if (hw.courseTitleAr) names.add(hw.courseTitleAr);
    });
    return Array.from(names);
  }, [availableCourses, homeworks]);

  const filteredHomeworks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return homeworks.filter((hw) => {
      if (q) {
        const matchTitle = (hw.titleAr || '').toLowerCase().includes(q);
        const matchCourse = (hw.courseTitleAr || '').toLowerCase().includes(q);
        const matchLesson = (hw.lessonAr || '').toLowerCase().includes(q);
        const matchLocation = (hw.targetLocationAr || '').toLowerCase().includes(q);
        if (!matchTitle && !matchCourse && !matchLesson && !matchLocation) return false;
      }
      if (filterCourse !== 'all' && hw.courseTitleAr !== filterCourse) return false;
      if (filterStatus === 'pending' && Number(hw.pendingGrading || 0) === 0) return false;
      if (filterStatus === 'completed' && Number(hw.pendingGrading || 0) > 0) return false;
      return true;
    });
  }, [homeworks, searchQuery, filterCourse, filterStatus]);

  const totalHomeworksCount = homeworks.length;
  const totalSubmissionsCount = homeworks.reduce((acc, h) => acc + Number(h.submittedCount || 0), 0);
  const totalGradedCount = homeworks.reduce((acc, h) => acc + Number(h.gradedCount || 0), 0);
  const totalPendingCount = homeworks.reduce((acc, h) => acc + Number(h.pendingGrading || 0), 0);

  return (
    <div>
      {/* Top Header */}
      <div
        className="hw-header-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(0, 102, 204, 0.15)' : 'rgba(0, 102, 204, 0.08)',
                color: 'var(--primary)',
                fontSize: '11.5px',
                fontWeight: '800',
              }}
            >
              <BookOpen size={13} />
              <span>{isAr ? 'التطبيقات والواجبات الأسبوعية' : 'Weekly Homework & Tasks'}</span>
            </span>
          </div>

          <h1
            style={{
              fontSize: '22px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: 0,
              fontFamily: 'var(--font-heading), var(--font-arabic)',
            }}
          >
            {isAr ? 'إدارة وتصحيح الواجبات المنزلية' : 'Homework Grading & Feedback'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            {isAr
              ? 'نشر الواجبات ورفع ملفاتها على الخادم، مراجعة حلول الطلاب، ورصد الدرجات والتغذية الراجعة'
              : 'Publish assignments to cloud storage, review student submissions, and send graded feedback'}
          </p>
        </div>

        <button
          type="button"
          className="hw-header-btn"
          onClick={onOpenCreate}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
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
          <span>{isAr ? 'إضافة واجب جديد' : 'New Assignment'}</span>
        </button>
      </div>

      {/* Overview Stats Ribbon */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
          gap: '12px',
          marginBottom: '22px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 18px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {isAr ? 'إجمالي الواجبات المنشورة' : 'Total Assignments'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '4px' }}>
            {totalHomeworksCount}{' '}
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{isAr ? 'واجب' : 'tasks'}</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 18px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {isAr ? 'إجمالي تسليمات الطلاب' : 'Total Submissions'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary)', marginTop: '4px' }}>
            {totalSubmissionsCount.toLocaleString()}{' '}
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{isAr ? 'تسليم' : 'submitted'}</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 18px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {isAr ? 'تم تصحيحه واعتماده' : 'Graded Submissions'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--success)', marginTop: '4px' }}>
            {totalGradedCount.toLocaleString()}{' '}
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{isAr ? 'طالب' : 'graded'}</span>
          </div>
        </div>

        <div
          onClick={() => totalPendingCount > 0 && onFilterStatusChange('pending')}
          style={{
            backgroundColor:
              totalPendingCount > 0
                ? isDark
                  ? 'rgba(245, 158, 11, 0.12)'
                  : '#FFFBEB'
                : 'var(--bg-surface-elevated)',
            border:
              totalPendingCount > 0
                ? '1px solid rgba(245, 158, 11, 0.35)'
                : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 18px',
            boxShadow: 'var(--shadow-xs)',
            cursor: totalPendingCount > 0 ? 'pointer' : 'default',
          }}
        >
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {isAr ? 'قيد الانتظار والتصحيح' : 'Pending Review'}
          </div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: '900',
              color: totalPendingCount > 0 ? '#D97706' : 'var(--text-primary)',
              marginTop: '4px',
            }}
          >
            {totalPendingCount.toLocaleString()}{' '}
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{isAr ? 'طالب' : 'pending'}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="hw-controls-row"
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '14px 18px',
          marginBottom: '22px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div
          className="hw-view1-search-box"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '8px 14px',
            flex: 1,
            minWidth: '220px',
            maxWidth: '440px',
          }}
        >
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder={isAr ? 'بحث في أسماء الواجبات، الحصص، أو المقررات...' : 'Search by title, lesson, or course...'}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '13px',
              width: '100%',
              fontFamily: 'inherit',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={filterCourse}
            onChange={(e) => onFilterCourseChange(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontFamily: 'inherit',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">{isAr ? 'جميع المقررات والكورسات' : 'All Courses'}</option>
            {courseOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <div
            style={{
              display: 'flex',
              gap: '4px',
              backgroundColor: 'var(--bg-subtle)',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {[
              { id: 'all', label: isAr ? 'الكل' : 'All' },
              { id: 'pending', label: isAr ? 'قيد التصحيح' : 'Pending' },
              { id: 'completed', label: isAr ? 'مكتمل' : 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterStatusChange(tab.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: filterStatus === tab.id ? 'var(--primary)' : 'transparent',
                  color: filterStatus === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error State */}
      {loadError && !isLoading && (
        <div
          style={{
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', fontWeight: '700', fontSize: '13.5px' }}>
            <AlertCircle size={18} />
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
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
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

      {/* Loading Skeletons */}
      {isLoading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
            gap: '18px',
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '20px',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div style={{ height: '20px', width: '55%', borderRadius: '6px', backgroundColor: 'var(--bg-subtle)' }} />
              <div style={{ height: '18px', width: '85%', borderRadius: '6px', backgroundColor: 'var(--bg-subtle)' }} />
              <div style={{ height: '48px', width: '100%', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)' }} />
              <div style={{ height: '38px', width: '100%', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)' }} />
            </div>
          ))}
        </div>
      ) : (
        /* Homeworks Cards Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
            gap: '18px',
          }}
        >
          {filteredHomeworks.length === 0 ? (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '48px 16px',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-xl)',
                border: '1px dashed var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              <FileText size={40} style={{ margin: '0 auto 12px', opacity: 0.35, display: 'block' }} />
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {homeworks.length === 0
                  ? isAr
                    ? 'لا توجد واجبات مضافة حتى الآن'
                    : 'No homework assignments yet'
                  : isAr
                    ? 'لا توجد واجبات مطابقة لخيارات البحث الحالية'
                    : 'No assignments match your filters'}
              </p>
              <p style={{ margin: '6px 0 16px', fontSize: '13px' }}>
                {homeworks.length === 0
                  ? isAr
                    ? 'اضغط على زر «إضافة واجب جديد» لإنشاء أول واجب ورفع ملفاته على الخادم.'
                    : 'Click "New Assignment" to create your first homework.'
                  : isAr
                    ? 'جرّب مسح كلمات البحث أو تغيير الفلاتر.'
                    : 'Try clearing your search or changing filters.'}
              </p>
              {homeworks.length === 0 ? (
                <button
                  type="button"
                  onClick={onOpenCreate}
                  style={{
                    padding: '9px 20px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {isAr ? 'إضافة واجب جديد الآن' : 'Create Homework Now'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    onFilterCourseChange('all');
                    onFilterStatusChange('all');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {isAr ? 'عرض جميع الواجبات' : 'Reset Filters'}
                </button>
              )}
            </div>
          ) : (
            filteredHomeworks.map((hw) => {
              const hasAttachment = Boolean(hw.attachmentUrl);
              const isCloud = hw.attachmentDisk === 'supabase';
              return (
                <div
                  key={hw.id}
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-xs)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div>
                    {/* Top Row: Badges + Edit/Delete */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '8px',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: isDark ? 'rgba(0, 102, 204, 0.15)' : 'rgba(0, 102, 204, 0.08)',
                            color: 'var(--primary)',
                            border: '1px solid rgba(0, 102, 204, 0.2)',
                          }}
                        >
                          {hw.courseTitleAr || (isAr ? 'المقرر الدراسي' : 'Course')}
                        </span>

                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {hasAttachment ? (
                            <FileCheck size={11} color="var(--primary)" />
                          ) : (
                            <FileText size={11} color="var(--primary)" />
                          )}
                          <span>
                            {hasAttachment
                              ? hw.fileType === 'image'
                                ? isAr
                                  ? 'صورة'
                                  : 'Image'
                                : isAr
                                  ? 'ملف PDF'
                                  : 'PDF File'
                              : isAr
                                ? 'واجب نصي'
                                : 'Text Task'}
                          </span>
                        </span>

                        {hasAttachment && isCloud && (
                          <span
                            title={isAr ? 'مرفوع على الخادم السحابي' : 'Stored on Cloud Server'}
                            style={{
                              fontSize: '10.5px',
                              fontWeight: '700',
                              padding: '3px 7px',
                              borderRadius: '6px',
                              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.14)' : '#ECFDF5',
                              color: 'var(--success)',
                              border: '1px solid rgba(16, 185, 129, 0.25)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <Cloud size={11} />
                            <span>{isAr ? 'سحابي' : 'Cloud'}</span>
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEdit(hw);
                          }}
                          title={isAr ? 'تعديل الواجب' : 'Edit Homework'}
                          style={{
                            padding: '5px 7px',
                            borderRadius: '6px',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                          }}
                        >
                          <Edit3 size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => onPromptDelete(hw.id, hw.titleAr, e)}
                          title={isAr ? 'حذف الواجب' : 'Delete Homework'}
                          style={{
                            padding: '5px 7px',
                            borderRadius: '6px',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-subtle)',
                            color: '#EF4444',
                            cursor: 'pointer',
                            display: 'inline-flex',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h2
                      style={{
                        fontSize: '15.5px',
                        fontWeight: '900',
                        color: 'var(--text-primary)',
                        margin: '0 0 10px',
                        lineHeight: 1.45,
                        fontFamily: 'var(--font-heading), var(--font-arabic)',
                      }}
                    >
                      {hw.titleAr}
                    </h2>

                    {/* Metadata */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '16px' }}>
                      {hw.lessonAr && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <Layers size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
                          <span>{hw.lessonAr}</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        <Calendar size={12} style={{ flexShrink: 0 }} />
                        <span>
                          {hw.dueDate
                            ? `${isAr ? 'آخر موعد:' : 'Due:'} ${hw.dueDate} (${hw.dueTime || '23:59'})`
                            : isAr
                              ? 'مفتوح بدون موعد نهائي'
                              : 'Open deadline'}
                        </span>
                        {hw.targetLocationAr && (
                          <>
                            <span>•</span>
                            <MapPin size={12} style={{ flexShrink: 0 }} />
                            <span>{hw.targetLocationAr}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Stats Strip */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '6px',
                        padding: '10px 8px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '14px',
                        textAlign: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
                          {hw.submittedCount || 0}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {isAr ? 'المسلّمون' : 'Submitted'}
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: '13.5px',
                            fontWeight: '900',
                            color: Number(hw.pendingGrading || 0) > 0 ? '#D97706' : 'var(--text-primary)',
                          }}
                        >
                          {hw.pendingGrading || 0}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {isAr ? 'قيد الانتظار' : 'Pending'}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: '900', color: 'var(--primary)' }}>
                          {hw.maxGrade} {isAr ? 'درجة' : 'pts'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {isAr ? 'الدرجة الكلية' : 'Max Grade'}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => onOpenDetail(hw.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-xs)',
                      }}
                    >
                      <Users size={14} />
                      <span>
                        {isAr
                          ? `عرض تسليمات الطلاب (${hw.submittedCount || 0})`
                          : `View Student Submissions (${hw.submittedCount || 0})`}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
