import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ChevronDown, Check } from 'lucide-react';
import { AvatarLightboxModal } from '../../../components/common/AvatarCropperModal';

export const DashboardHeader = ({
  student,
  lang,
  isRtl,
  isDark,
  themeAccent,
  selectedSubject,
  setSelectedSubject,
  subjectDropdownOpen,
  setSubjectDropdownOpen,
  filterOptions,
  currentSubjectLabel
}) => {
  const [isAvatarLightboxOpen, setIsAvatarLightboxOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!subjectDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSubjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [subjectDropdownOpen, setSubjectDropdownOpen]);

  const firstName = (lang === 'ar' ? (student.nameAr || student.name) : (student.name || student.nameAr) || '')
    .trim()
    .split(/\s+/)[0] || (lang === 'ar' ? 'بطل' : 'Student');

  const gradeBadge = student.gradeNameAr || (lang === 'ar' ? 'بوابة الطالب' : 'Student Portal');

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      {/* Student Profile Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          position: 'relative',
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          border: `2px solid ${isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.35)'}`,
          overflow: 'hidden',
          flexShrink: 0
        }}>
          {student.avatar ? (
            <img
              src={student.avatar}
              alt={student.name || 'Student'}
              onClick={() => setIsAvatarLightboxOpen(true)}
              title={lang === 'ar' ? 'اضغط لتكبير الصورة' : 'Click to enlarge'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.12)',
              color: themeAccent,
              fontWeight: '800',
              fontSize: '18px'
            }}>
              {(student.nameAr || student.name || 'ط').trim().charAt(0)}
            </div>
          )}
          <span style={{
            position: 'absolute',
            bottom: '3px',
            insetInlineEnd: '3px',
            width: '10px',
            height: '10px',
            backgroundColor: '#10B981',
            borderRadius: '50%',
            border: '2px solid var(--bg-surface)',
            boxShadow: '0 0 6px #10B981'
          }} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '11.5px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.12)',
              color: themeAccent,
              border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.25)'}`
            }}>
              {gradeBadge}
            </span>
            {student.trackAr && (
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                {student.trackAr}
              </span>
            )}
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '3px 0 0',
            fontFamily: 'var(--font-heading), var(--font-arabic)',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>{lang === 'ar' ? 'مرحباً' : 'Welcome,'}</span>
            <span style={{ color: themeAccent }}>{firstName}</span>
          </h1>
        </div>
      </div>

      {/* Subject Filter Dropdown */}
      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setSubjectDropdownOpen(!subjectDropdownOpen)}
          className="executive-filter-btn"
          style={{ minWidth: '165px', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={15} style={{ color: themeAccent }} />
            <span>{currentSubjectLabel}</span>
          </div>
          <ChevronDown
            size={14}
            style={{
              color: 'var(--text-secondary)',
              transform: subjectDropdownOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease'
            }}
          />
        </button>

        {subjectDropdownOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            insetInlineEnd: 0,
            minWidth: '195px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            boxShadow: isDark ? '0 12px 30px rgba(0, 0, 0, 0.5)' : '0 12px 30px rgba(0, 0, 0, 0.12)',
            padding: '6px',
            zIndex: 50
          }}>
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setSelectedSubject(opt.id);
                  setSubjectDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '8px 12px',
                  background: selectedSubject === opt.id ? (isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.12)') : 'transparent',
                  color: selectedSubject === opt.id ? themeAccent : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: selectedSubject === opt.id ? '700' : '500',
                  cursor: 'pointer',
                  textAlign: isRtl ? 'right' : 'left',
                  transition: 'background 0.15s ease'
                }}
              >
                <span>{lang === 'ar' ? opt.labelAr : opt.labelEn}</span>
                {selectedSubject === opt.id && <Check size={14} style={{ color: themeAccent, flexShrink: 0 }} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <AvatarLightboxModal
        isOpen={isAvatarLightboxOpen}
        imageSrc={student.avatar}
        altText={student.nameAr || student.name || 'Student'}
        isAr={lang === 'ar'}
        onClose={() => setIsAvatarLightboxOpen(false)}
      />
    </div>
  );
};
