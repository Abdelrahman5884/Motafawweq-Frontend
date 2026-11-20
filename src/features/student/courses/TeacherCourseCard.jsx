import React from 'react';
import { Check, Video, Clock, Play, Users, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { formatCourseDuration } from './useStudentCourses';

export const TeacherCourseCard = ({
  course,
  isEnrolled,
  isPending = false,
  lang = 'ar',
  onContinue,
  onEnroll,
  onViewBilling,
}) => {
  const isAr = lang === 'ar';
  const title = isAr ? course.titleAr : course.titleEn || course.titleAr;
  const subject = isAr ? course.subjectAr : course.subjectEn || course.subjectAr;
  const description = isAr ? course.descriptionAr : course.descriptionEn || course.descriptionAr;
  const durationLabel = formatCourseDuration(
    course.hoursTotal,
    course.publishedDurationSeconds,
    course.lessonsCount,
    lang
  );

  return (
    <div
      className="clean-course-card"
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: isEnrolled
          ? '1px solid rgba(21, 136, 199, 0.3)'
          : '1px solid var(--border-subtle)',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-xs)',
        minWidth: 0,
      }}
    >
      {course.coverUrl ? (
        <div style={{ height: '132px', backgroundColor: '#06254E', overflow: 'hidden', position: 'relative' }}>
          <img
            src={course.coverUrl}
            alt={title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div
          style={{
            height: '6px',
            background: isEnrolled
              ? 'linear-gradient(90deg, #059669 0%, #1588C7 100%)'
              : isPending
                ? 'linear-gradient(90deg, #D97706 0%, #F59E0B 100%)'
                : 'linear-gradient(90deg, #06254E 0%, #1588C7 100%)',
          }}
        />
      )}

      <div
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          minWidth: 0,
        }}
      >
        <div style={{ minWidth: 0 }}>
          {/* Top Row: Subject & Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: '800',
                padding: '3px 10px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                maxWidth: '60%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {subject}
            </span>

            {isEnrolled ? (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#059669',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  padding: '3px 9px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0,
                }}
              >
                <Check size={12} strokeWidth={3} />
                <span>{isAr ? 'مشترك به' : 'Enrolled'}</span>
              </span>
            ) : isPending ? (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#D97706',
                  backgroundColor: 'rgba(245, 158, 11, 0.14)',
                  padding: '3px 9px',
                  borderRadius: '999px',
                  flexShrink: 0,
                }}
              >
                {isAr ? 'بانتظار موافقة المعلم' : 'Pending Approval'}
              </span>
            ) : (
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: '800',
                  color: course.priceEgp > 0 ? 'var(--primary)' : '#059669',
                  backgroundColor:
                    course.priceEgp > 0
                      ? 'var(--primary-surface)'
                      : 'rgba(16, 185, 129, 0.1)',
                  padding: '3px 9px',
                  borderRadius: '999px',
                  flexShrink: 0,
                }}
              >
                {course.priceEgp > 0
                  ? `${course.priceEgp} ${isAr ? 'ج.م' : 'EGP'}`
                  : isAr
                    ? 'متاح بالتسجيل'
                    : 'Open Enrollment'}
              </span>
            )}
          </div>

          {/* Course Title */}
          <h3
            title={title}
            style={{
              fontSize: '16px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              lineHeight: 1.45,
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </h3>

          {description && (
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                margin: '0 0 12px 0',
                lineHeight: 1.5,
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </p>
          )}

          {/* Teacher Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border-subtle)',
              minWidth: 0,
            }}
          >
            {course.teacher?.avatar ? (
              <img
                src={course.teacher.avatar}
                alt={course.teacher.nameAr}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '800',
                  flexShrink: 0,
                }}
              >
                {(course.teacher?.nameAr || 'م').trim().charAt(0)}
              </div>
            )}
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: '12.5px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {course.teacher?.nameAr}
              </div>
              {course.gradeAr && (
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {course.gradeAr}
                </div>
              )}
            </div>
          </div>

          {/* Real Progress Bar if enrolled */}
          {isEnrolled && (
            <div style={{ marginBottom: '14px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                <span>
                  {isAr
                    ? `أتممت ${course.completedLessons} من ${course.lessonsCount} حصة`
                    : `${course.completedLessons} / ${course.lessonsCount} lessons done`}
                </span>
                <strong style={{ color: course.progressPercent === 100 ? '#059669' : 'var(--primary)' }}>
                  {course.progressPercent}%
                </strong>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-subtle)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${course.progressPercent}%`,
                    height: '100%',
                    borderRadius: '6px',
                    backgroundColor: course.progressPercent === 100 ? '#059669' : 'var(--primary)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          )}

          {/* Real Course Specs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '16px',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
              <Video size={13} color="var(--primary)" />
              {course.lessonsCount} {isAr ? 'حصة' : 'lessons'}
            </span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
              <Clock size={13} color="var(--text-muted)" />
              {durationLabel}
            </span>
            {course.studentsCount > 0 && (
              <>
                <span style={{ opacity: 0.4 }}>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                  <Users size={13} color="var(--text-muted)" />
                  {course.studentsCount} {isAr ? 'طالب' : 'students'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div>
          {isEnrolled ? (
            <button
              type="button"
              onClick={onContinue}
              className="clean-btn"
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(21, 136, 199, 0.25)',
              }}
            >
              <Play size={14} fill="#FFFFFF" />
              <span>
                {course.progressPercent > 0 && course.progressPercent < 100
                  ? isAr
                    ? 'استكمال المذاكرة الآن'
                    : 'Resume Learning'
                  : isAr
                    ? 'دخول الحصص الآن'
                    : 'Start Course'}
              </span>
            </button>
          ) : isPending ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <div
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  color: '#D97706',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  fontSize: '12px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Clock size={14} />
                <span>{isAr ? 'بانتظار التأكيد' : 'Pending Approval'}</span>
              </div>
              {onViewBilling && (
                <button
                  type="button"
                  onClick={onViewBilling}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>{isAr ? 'المدفوعات' : 'Billing'}</span>
                  {isAr ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onEnroll}
              className="clean-btn"
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={14} color="var(--primary)" />
              <span>
                {course.priceEgp > 0
                  ? isAr
                    ? `طلب الاشتراك (${course.priceEgp} ج.م)`
                    : `Enroll Now (${course.priceEgp} EGP)`
                  : isAr
                    ? 'طلب التسجيل في المقرر'
                    : 'Request Enrollment'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
