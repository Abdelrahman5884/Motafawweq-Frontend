import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON, MOCK_CLASSES, MOCK_STUDENTS } from '../../data/mockData';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Users, 
  Calendar, 
  ArrowRight, 
  X, 
  Tag
} from 'lucide-react';

export const SearchModal = () => {
  const navigate = useNavigate();
  const { searchModalOpen, setSearchModalOpen, switchRole } = useAuth();
  const { lang, isRtl } = useLanguage();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Ctrl+K / Cmd+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchModalOpen]);

  if (!searchModalOpen) return null;

  // Search through concepts in MOCK_LESSON.knowledgeMap.nodes
  const nodes = MOCK_LESSON.knowledgeMap?.nodes || [];
  const matchingConcepts = nodes.filter(n => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (n.label && n.label.toLowerCase().includes(q)) ||
           (n.labelAr && n.labelAr.includes(q)) ||
           (n.summary && n.summary.toLowerCase().includes(q));
  }).slice(0, 4);

  // Search through students
  const matchingStudents = MOCK_STUDENTS.filter(s => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (s.name && s.name.toLowerCase().includes(q)) ||
           (s.nameAr && s.nameAr.includes(q));
  }).slice(0, 3);

  // Search through classes
  const matchingClasses = MOCK_CLASSES.filter(c => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (c.name && c.name.toLowerCase().includes(q)) ||
           (c.nameAr && c.nameAr.includes(q));
  }).slice(0, 2);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(14, 12, 27, 0.7)',
        backdropFilter: 'blur(10px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
        paddingLeft: '16px',
        paddingRight: '16px'
      }}
      onClick={() => setSearchModalOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-scale-in"
      >
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '18px 20px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <Search size={20} color="var(--primary)" />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'ابحث عن حصة، مفهوم علمي، طالب، أو مجموعة...' : 'Search lessons, concepts, students, or classes...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '16px',
              color: 'var(--text-primary)',
              fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-latin)'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <X size={18} />
            </button>
          )}
          <kbd style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)'
          }}>
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '16px' }}>
          {/* Quick Lessons Section */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={12} color="var(--primary)" />
              <span>{lang === 'ar' ? 'الحصص ومساحات العمل' : 'Lessons & Workspaces'}</span>
            </div>
            <div 
              onClick={() => {
                navigate('/teacher/workspace');
                setSearchModalOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-surface)',
                border: '1px solid var(--primary-light)',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? MOCK_LESSON.titleAr : MOCK_LESSON.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '2px' }}>
                  {lang === 'ar' ? MOCK_LESSON.gradeAr : MOCK_LESSON.grade} • {MOCK_LESSON.durationFormatted}
                </div>
              </div>
              <ArrowRight size={16} color="var(--primary)" style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
            </div>
          </div>

          {/* Concepts Section */}
          {matchingConcepts.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={12} color="#06B6D4" />
                <span>{lang === 'ar' ? 'المفاهيم العلمية بخريطة المعرفة' : 'Concepts in Knowledge Map'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchingConcepts.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      navigate('/teacher/workspace');
                      setSearchModalOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-subtle)',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(6, 182, 212, 0.15)',
                        color: '#06B6D4',
                        fontWeight: '700'
                      }}>
                        {c.timestamp}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? c.labelAr : c.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {lang === 'ar' ? 'إتقان الطلاب' : 'Mastery'}: {c.mastery}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students Section */}
          {matchingStudents.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={12} color="#10B981" />
                <span>{lang === 'ar' ? 'الطلاب' : 'Students'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchingStudents.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      switchRole('teacher');
                      navigate('/teacher/students');
                      setSearchModalOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={s.avatar} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? s.nameAr : s.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>
                      {s.avgQuizScore}% Avg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 20px',
          backgroundColor: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: 'var(--text-muted)'
        }}>
          <span>{lang === 'ar' ? 'اضغط Enter للاختيار • Esc للإغلاق' : 'Press Enter to select • Esc to dismiss'}</span>
          <span>Learnora Universal Index</span>
        </div>
      </div>
    </div>
  );
};
