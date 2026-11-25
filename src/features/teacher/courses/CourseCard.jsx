import React from 'react';
import {
  Layers,
  PlayCircle,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { COURSE_STATUS_META } from './courseConstants';

export const CourseCard = ({
  course,
  isAr,
  isDark,
  isExpanded,
  onToggleDescription,
  onEdit,
  onDelete,
  onOpenWorkspace,
  onOpenStudio,
}) => {
  const statusMeta = COURSE_STATUS_META[course.status] || COURSE_STATUS_META.published;
  const title = isAr ? course.titleAr : (course.titleEn || course.titleAr);
  const subject = isAr ? course.subjectAr : (course.subjectEn || course.subjectAr);
  const description = isAr ? course.descriptionAr : (course.descriptionEn || course.descriptionAr);
  const isLongDescription = Boolean(description && description.trim().length > 110);
  const isFree = Number(course.priceEgp) === 0;

  return (
    <div
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
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
      }}
    >
      <div>
        {/* Header Tags + Price + Edit/Delete */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {subject && (
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 102, 204, 0.1)',
                color: 'var(--primary)',
                border: '1px solid rgba(0, 102, 204, 0.2)',
              }}>
                {subject}
              </span>
            )}

            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
            }}>
              {course.gradeAr}
            </span>

            <span style={{
              fontSize: '10.5px',
              fontWeight: '800',
              padding: '3px 7px',
              borderRadius: '6px',
              backgroundColor: statusMeta.bg,
              color: statusMeta.color,
              border: `1px solid ${statusMeta.border}`,
            }}>
              {isAr ? statusMeta.labelAr : statusMeta.labelEn}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{
              fontSize: '11.5px',
              fontWeight: '800',
              padding: '3px 9px',
              borderRadius: '6px',
              backgroundColor: isFree
                ? (isDark ? 'rgba(16, 185, 129, 0.22)' : '#D1FAE5')
                : (isDark ? 'rgba(16, 185, 129, 0.12)' : '#ECFDF5'),
              color: isFree ? (isDark ? '#34D399' : '#047857') : 'var(--success)',
              border: `1px solid ${isFree
                ? (isDark ? 'rgba(16, 185, 129, 0.5)' : '#6EE7B7')
                : (isDark ? 'rgba(16, 185, 129, 0.25)' : '#A7F3D0')}`,
            }}>
              {isFree
                ? (isAr ? 'مجاني' : 'Free')
                : `${Number(course.priceEgp).toLocaleString()} ${isAr ? 'ج.م / شهر' : 'EGP/mo'}`}
            </span>

            <button
              type="button"
              onClick={() => onEdit(course)}
              title={isAr ? 'تعديل بيانات الكورس' : 'Edit Course'}
              aria-label={isAr ? 'تعديل بيانات الكورس' : 'Edit Course'}
              style={{
                padding: '5px 6px',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(0, 102, 204, 0.15)' : 'rgba(0, 102, 204, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Edit3 size={13} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(course)}
              title={isAr ? 'حذف الكورس' : 'Delete Course'}
              aria-label={isAr ? 'حذف الكورس' : 'Delete Course'}
              style={{
                padding: '5px 6px',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#EF4444';
                e.currentTarget.style.borderColor = '#FCA5A5';
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '15.5px',
          fontWeight: '900',
          color: 'var(--text-primary)',
          margin: '0 0 8px',
          lineHeight: 1.4,
          fontFamily: 'var(--font-heading), var(--font-arabic)',
        }}>
          {title}
        </h2>

        {/* Description (smart expand toggle only when text is long) */}
        {description ? (
          <div
            onClick={isLongDescription ? () => onToggleDescription(course.id) : undefined}
            style={{
              margin: '0 0 16px',
              padding: isExpanded ? '8px 10px' : '2px 0',
              borderRadius: '8px',
              backgroundColor: isExpanded ? 'var(--bg-subtle)' : 'transparent',
              border: isExpanded ? '1px dashed var(--border-subtle)' : '1px solid transparent',
              cursor: isLongDescription ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
            }}
          >
            <p style={{
              fontSize: '12px',
              color: isExpanded ? 'var(--text-primary)' : 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.6,
              ...(!isExpanded && isLongDescription ? {
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              } : {}),
              wordBreak: 'break-word',
            }}>
              {description}
            </p>

            {isLongDescription && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: '800',
                color: 'var(--primary)',
                marginTop: '4px',
              }}>
                {isExpanded ? (
                  <>
                    <ChevronUp size={12} />
                    <span>{isAr ? 'عرض أقل' : 'Show less'}</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={12} />
                    <span>{isAr ? 'عرض المزيد' : 'Show more'}</span>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', fontStyle: 'italic' }}>
            {isAr ? 'لا يوجد وصف مضاف لهذا المقرر بعد.' : 'No description added yet.'}
          </div>
        )}
      </div>

      <div>
        {/* Real Stats Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          padding: '10px 8px',
          borderRadius: '8px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '14px',
          textAlign: 'center',
        }}>
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
            }}>
              {course.studentsCount.toLocaleString()}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {isAr ? 'طالب مقيد' : 'Students'}
            </div>
          </div>

          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
            }}>
              {course.lessonsCount.toLocaleString()}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {isAr ? 'حصة مسجلة' : 'Lessons'}
            </div>
          </div>

          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
            }}>
              {course.hoursTotal}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {isAr ? 'ساعات الشرح' : 'Duration'}
            </div>
          </div>
        </div>

        {/* Connected Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            type="button"
            onClick={() => onOpenWorkspace(course.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 102, 204, 0.08)',
              border: '1px solid rgba(0, 102, 204, 0.22)',
              color: 'var(--primary)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 102, 204, 0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 102, 204, 0.08)'; }}
          >
            <Layers size={13} />
            <span>{isAr ? 'خريطة الحصص' : 'Lessons Map'}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenStudio(course.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 10px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'; }}
          >
            <PlayCircle size={13} />
            <span>{isAr ? 'تسجيل حصة' : 'Add Lesson'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
