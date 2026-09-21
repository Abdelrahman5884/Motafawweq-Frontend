import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Flame, 
  Target, 
  Award, 
  BookOpen, 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Zap
} from 'lucide-react';

export const StudentAchievementModal = ({ student, leagueTitle, onClose, lang = 'ar' }) => {
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!student) return null;

  const isMe = student.isMe;

  // Derive realistic stats if not provided directly
  const streak = student.streak || 16;
  const perfectQuizzes = student.perfectQuizzes || 11;
  const examsSolved = student.examsSolved || Math.round(perfectQuizzes * 1.5 + 4);
  const lessonsStudied = student.lessonsStudied || Math.round(streak * 2 + 10);

  // Unlocked Badges
  const badges = [
    {
      id: 'diamond-student',
      title: 'المتفوق الماسي',
      icon: '💎',
      desc: 'ضمن النخبة الأولى على مستوى الجمهورية',
      unlocked: true,
      color: '#1588C7'
    },
    {
      id: 'streak-fire',
      title: 'شعلة الالتزام',
      icon: '🔥',
      desc: `استمرارية المذاكرة لـ ${streak} يوماً متواصلاً`,
      unlocked: true,
      color: '#EA580C'
    },
    {
      id: 'perfect-master',
      title: 'عبقري التقفيل',
      icon: '🎯',
      desc: `تقفيل ${perfectQuizzes} امتحاناً بالدرجة النهائية 100%`,
      unlocked: true,
      color: '#059669'
    },
    {
      id: 'fast-solver',
      title: 'سريع البديهة',
      icon: '⚡',
      desc: 'متوسط زمن إجابة أقل من 40 ثانية للسؤال',
      unlocked: true,
      color: '#7C3AED'
    }
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 37, 78, 0.45)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 48px rgba(6, 37, 78, 0.22)',
          border: '1px solid var(--border-subtle)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon / Banner */}
        <div style={{
          position: 'relative',
          padding: '28px 24px 20px',
          background: 'linear-gradient(135deg, rgba(6, 37, 78, 0.04) 0%, rgba(21, 136, 199, 0.08) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          textAlign: 'center'
        }}>
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="إغلاق"
            style={{
              position: 'absolute',
              top: '16px',
              insetInlineEnd: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={17} />
          </button>

          {/* Avatar with rank badge */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
            <img
              src={student.avatar}
              alt={student.nameAr}
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: isMe ? '3px solid var(--primary)' : '3px solid var(--border-medium)',
                boxShadow: isMe ? '0 4px 16px rgba(21, 136, 199, 0.25)' : 'none'
              }}
            />
            {/* Rank badge */}
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              insetInlineEnd: '-4px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: student.rank === 1 ? '#F59E0B' : student.rank === 2 ? '#1588C7' : student.rank === 3 ? '#B45309' : '#0F172A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12.5px',
              fontWeight: '900',
              border: '2px solid var(--bg-surface)'
            }}>
              #{student.rank}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {student.nameAr}
            </h2>
            {isMe && (
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF'
              }}>
                حسابك
              </span>
            )}
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            {student.schoolAr}
          </div>

          {/* Current League Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            fontSize: '11.5px',
            fontWeight: '700',
            color: 'var(--primary)'
          }}>
            <Trophy size={13} />
            <span>{leagueTitle || 'دوري المتفوقين'} • {student.score?.toLocaleString()} نقطة</span>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '22px 24px' }}>
          {/* 4 Quick Stat Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '22px'
          }}>
            {/* Streak */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '14px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(234, 88, 12, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EA580C',
                flexShrink: 0
              }}>
                <Flame size={20} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  أيام الالتزام
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {streak} يوم متواصل
                </div>
              </div>
            </div>

            {/* Perfect Quizzes */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '14px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                flexShrink: 0
              }}>
                <Target size={20} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  امتحانات 100%
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {perfectQuizzes} تقفيل
                </div>
              </div>
            </div>

            {/* Exams Solved */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '14px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(21, 136, 199, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                flexShrink: 0
              }}>
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  امتحانات محلولة
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {examsSolved} امتحان وكويز
                </div>
              </div>
            </div>

            {/* Lessons Studied */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '14px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7C3AED',
                flexShrink: 0
              }}>
                <BookOpen size={20} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  حصص مكتملة
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lessonsStudied} حصة
                </div>
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={15} color="var(--primary)" />
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  الأوسمة والشارات المكتسبة
                </span>
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                4 أوسمة متميزة
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              {badges.map((b) => (
                <div
                  key={b.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                >
                  <div style={{
                    fontSize: '20px',
                    lineHeight: '1',
                    flexShrink: 0
                  }}>
                    {b.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {b.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {b.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Navigation CTA */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            {isMe ? (
              <button
                onClick={() => {
                  onClose();
                  navigate('/student/gamification');
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(21, 136, 199, 0.25)',
                  transition: 'opacity 0.15s ease'
                }}
              >
                <Trophy size={16} />
                <span>فتح صفحة إنجازاتي وجوائزي الكاملة</span>
                <ExternalLink size={14} />
              </button>
            ) : (
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '11px 18px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                إغلاق بطاقة الطالب
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
