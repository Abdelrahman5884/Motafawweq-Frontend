import React from 'react';
import { Search, X, Video, Mic, Trash2, Clock, Layers } from 'lucide-react';

export const WorkspaceSidebar = ({
  lessons,
  courses,
  selectedLessonId,
  searchQuery,
  onSearchChange,
  courseFilter,
  onCourseFilterChange,
  mediaFilter,
  onMediaFilterChange,
  lang,
  isRtl,
  onSelectLesson,
  onRequestDelete,
}) => {
  const isAr = lang === 'ar';

  return (
    <aside
      className="lw-sidebar"
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <Search
          size={15}
          color="var(--text-tertiary)"
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            [isRtl ? 'right' : 'left']: '12px',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={isAr ? 'ابحث في الحصص...' : 'Search lessons...'}
          style={{
            width: '100%',
            padding: isRtl ? '9px 36px 9px 30px' : '9px 30px 9px 36px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontFamily: 'inherit',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              [isRtl ? 'left' : 'right']: '10px',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Course Filter Dropdown */}
      {courses.length > 0 && (
        <select
          value={courseFilter}
          onChange={(e) => onCourseFilterChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12.5px',
            fontFamily: 'inherit',
            marginBottom: '10px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        >
          <option value="all">{isAr ? 'جميع المقررات والكورسات' : 'All Courses'}</option>
          {courses.map((c) => (
            <option key={c.uuid || c.id} value={c.uuid || c.id}>
              {c.titleAr || c.title}
            </option>
          ))}
        </select>
      )}

      {/* Media Filter Pills */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
        {[
          { key: 'all', labelAr: 'الكل', labelEn: 'All' },
          { key: 'audio', labelAr: 'صوتي', labelEn: 'Audio' },
          { key: 'video', labelAr: 'فيديو', labelEn: 'Video' },
        ].map((pill) => {
          const active = mediaFilter === pill.key;
          return (
            <button
              key={pill.key}
              type="button"
              onClick={() => onMediaFilterChange(pill.key)}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid ' + (active ? 'var(--primary)' : 'var(--border-subtle)'),
                backgroundColor: active ? 'var(--primary-surface)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {isAr ? pill.labelAr : pill.labelEn}
            </button>
          );
        })}
      </div>

      {/* Lessons List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxHeight: '62vh',
          overflowY: 'auto',
        }}
      >
        {lessons.length === 0 ? (
          <div style={{ padding: '24px 12px', textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)' }}>
            {isAr ? 'لا توجد حصص مطابقة للبحث' : 'No matching lessons'}
          </div>
        ) : (
          lessons.map((lesson) => {
            const isSelected = selectedLessonId === lesson.id;
            const attachmentsCount = (lesson.lessonPdfs?.length || 0) + (lesson.lessonImages?.length || 0);
            return (
              <div
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                style={{
                  padding: '12px 13px',
                  borderRadius: 'var(--radius-lg)',
                  border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                        color: isSelected ? '#FFFFFF' : 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {lesson.mediaType === 'video' ? <Video size={15} /> : <Mic size={15} />}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isAr ? lesson.titleAr : lesson.title}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestDelete(lesson);
                    }}
                    title={isAr ? 'حذف الحصة' : 'Delete lesson'}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '6px',
                      flexShrink: 0,
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                  {lesson.subjectAr && <span>{lesson.subjectAr}</span>}
                  {lesson.courseTitleAr && (
                    <span style={{ color: '#10B981', fontWeight: '700' }}>• {lesson.courseTitleAr}</span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {lesson.durationFormatted}
                  </span>
                  {attachmentsCount > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: '700' }}>
                      <Layers size={12} />
                      {attachmentsCount} {isAr ? 'مرفق' : 'files'}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
