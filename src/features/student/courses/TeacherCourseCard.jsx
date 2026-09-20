import React from 'react';
import { Check, Video, Clock, Star, Play } from 'lucide-react';

export const TeacherCourseCard = ({ course, isEnrolled, lang, onContinue, onEnroll }) => {
  return (
    <div
      className="clean-course-card"
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      <div>
        {/* Top Row: Subject & Enrollment status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            padding: '3px 10px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)'
          }}>
            {course.subjectAr}
          </span>

          {isEnrolled ? (
            <span style={{
              fontSize: '11.5px',
              fontWeight: '700',
              color: '#059669',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              padding: '3px 8px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Check size={12} />
              <span>مشترك به</span>
            </span>
          ) : (
            <span style={{
              fontSize: '11.5px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-subtle)',
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              {course.priceEgp} ج.م
            </span>
          )}
        </div>

        {/* Course Title */}
        <h3 style={{
          fontSize: '16.5px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          margin: '0 0 10px 0',
          lineHeight: 1.45,
          minHeight: '44px'
        }}>
          {course.titleAr}
        </h3>

        {/* Teacher Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <img
            src={course.teacher.avatar}
            alt={course.teacher.nameAr}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {course.teacher.nameAr}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {course.teacher.titleAr}
            </div>
          </div>
        </div>

        {/* Progress Bar if enrolled */}
        {isEnrolled && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11.5px',
              fontWeight: '700',
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              <span>تقدمك في الحصص</span>
              <strong style={{ color: 'var(--text-primary)' }}>{course.progressPercent}%</strong>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-subtle)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${course.progressPercent}%`,
                height: '100%',
                borderRadius: '6px',
                backgroundColor: 'var(--primary)',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        )}

        {/* Course Specs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: '18px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Video size={13} color="var(--text-muted)" />
            {course.lessonsCount} حصة
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} color="var(--text-muted)" />
            {course.durationHours}
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={13} color="#F59E0B" fill="#F59E0B" />
            <span>{course.rating}</span>
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div>
        {isEnrolled ? (
          <button
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
              boxShadow: '0 2px 8px rgba(21, 136, 199, 0.25)'
            }}
          >
            <Play size={14} fill="#FFFFFF" />
            <span>{lang === 'ar' ? 'متابعة الحصة الآن' : 'Continue Lesson'}</span>
          </button>
        ) : (
          <button
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
              gap: '6px'
            }}
          >
            <span>{lang === 'ar' ? `الاشتراك بالكورس (${course.priceEgp} ج.م)` : 'Enroll in Course'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
