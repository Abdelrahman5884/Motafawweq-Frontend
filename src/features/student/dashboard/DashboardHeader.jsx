import React from 'react';
import { BookOpen, ChevronDown, Check } from 'lucide-react';

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
          <img
            src={student.avatar}
            alt={student.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
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
              {student.gradeNameAr}
            </span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              {student.trackAr}
            </span>
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
            <span style={{ color: themeAccent }}>
              {lang === 'ar' ? student.nameAr.split(' ')[0] : student.name.split(' ')[0]}
            </span>
          </h1>
        </div>
      </div>

      {/* Subject Filter Dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setSubjectDropdownOpen(!subjectDropdownOpen)}
          className="executive-filter-btn"
          style={{ minWidth: '155px', justifyContent: 'space-between' }}
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

        {/* Dropdown Menu */}
        {subjectDropdownOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            insetInlineEnd: 0,
            width: '180px',
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
                onClick={() => {
                  setSelectedSubject(opt.id);
                  setSubjectDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
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
                {selectedSubject === opt.id && <Check size={14} style={{ color: themeAccent }} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
