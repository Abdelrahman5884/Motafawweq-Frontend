import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Flame, 
  CheckCircle2, 
  ClipboardCheck, 
  BookOpen, 
  Trophy, 
  ChevronLeft
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

  // Derive stats matching the student's own "إنجازاتي" format
  const streak = student.streak || 16;
  const perfectQuizzes = student.perfectQuizzes || (isMe ? 18 : 12);
  const examsSolved = student.examsSolved || (isMe ? 24 : Math.round(perfectQuizzes * 1.4 + 4));
  const lessonsStudied = student.lessonsStudied || (isMe ? 42 : Math.round(streak * 2 + 10));

  const stats = [
    {
      id: 'exams-solved',
      titleAr: 'امتحانات تم حلها',
      value: examsSolved,
      subAr: 'شاملة الكويزات والتدريبات',
      icon: ClipboardCheck,
      color: 'var(--primary)'
    },
    {
      id: 'full-marks',
      titleAr: 'امتحانات مقفلة 100%',
      value: perfectQuizzes,
      subAr: 'تقفيل كامل بالدرجة النهائية',
      icon: CheckCircle2,
      color: 'var(--success)'
    },
    {
      id: 'lessons-studied',
      titleAr: 'حصص تمت مذاكرتها',
      value: lessonsStudied,
      subAr: 'محاضرات مسجلة مكتملة',
      icon: BookOpen,
      color: 'var(--primary)'
    },
    {
      id: 'streak-days',
      titleAr: 'أيام الاستمرار والاستريك',
      value: `${streak} يوماً`,
      subAr: 'مذاكرة متواصلة دون انقطاع',
      icon: Flame,
      color: '#EA580C'
    }
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 37, 78, 0.5)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 48px rgba(6, 37, 78, 0.25)',
          border: '1px solid var(--border-subtle)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div style={{
          position: 'relative',
          padding: '24px 20px 18px',
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
              top: '14px',
              insetInlineEnd: '14px',
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
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
            <img
              src={student.avatar}
              alt={student.nameAr}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: isMe ? '3px solid var(--primary)' : '3px solid var(--border-medium)',
                boxShadow: isMe ? '0 4px 16px rgba(21, 136, 199, 0.25)' : 'none'
              }}
            />
            {/* Rank badge */}
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              insetInlineEnd: '-2px',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: student.rank === 1 ? '#F59E0B' : student.rank === 2 ? '#1588C7' : student.rank === 3 ? '#B45309' : '#0F172A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '900',
              border: '2px solid var(--bg-surface)'
            }}>
              #{student.rank}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '3px' }}>
            <h2 style={{
              fontSize: '17px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {student.nameAr}
            </h2>
            {isMe && (
              <span style={{
                fontSize: '10.5px',
                fontWeight: '700',
                padding: '2px 7px',
                borderRadius: '6px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF'
              }}>
                حسابك
              </span>
            )}
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
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
            <Trophy size={13} color="var(--primary)" />
            <span>{leagueTitle || 'دوري المتفوقين'} • {student.score?.toLocaleString()} نقطة</span>
          </div>
        </div>

        {/* Modal Body - 4 Study Metrics Cards identical to "إنجازاتي" */}
        <div style={{ padding: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '20px'
          }}>
            {stats.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '14px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '92px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                      {item.titleAr}
                    </span>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color,
                      flexShrink: 0
                    }}>
                      <IconComponent size={15} />
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {item.subAr}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Action */}
          <div>
            {isMe ? (
              <button
                onClick={() => {
                  onClose();
                  navigate('/student/gamification');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(21, 136, 199, 0.25)',
                  transition: 'opacity 0.15s ease'
                }}
              >
                <Trophy size={15} />
                <span>فتح صفحة إنجازاتي الكاملة</span>
                <ChevronLeft size={15} />
              </button>
            ) : (
              <button
                onClick={onClose}
                style={{
                  width: '100%',
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
