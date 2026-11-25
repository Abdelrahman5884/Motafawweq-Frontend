import React, { useEffect } from 'react';
import {
  X,
  Flame,
  CheckCircle2,
  ClipboardCheck,
  BookOpen,
  Trophy,
  FileCheck,
  CalendarCheck,
} from 'lucide-react';
import { LeagueAvatar } from './LeagueAvatar';

export const StudentAchievementModal = ({ student, leagueTitle, onClose, lang = 'ar' }) => {
  const isAr = lang === 'ar';

  useEffect(() => {
    if (!student) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [student, onClose]);

  if (!student) return null;

  const isMe = student.isMe;
  const subMeta = [student.groupAr, student.schoolAr].filter(Boolean).join(' • ');

  // 100% Real Server Metrics — ZERO fabricated fallbacks
  const stats = [
    {
      id: 'exams-solved',
      title: isAr ? 'امتحانات مكتملة' : 'Exams Solved',
      value: student.examsSolved,
      icon: ClipboardCheck,
      color: 'var(--primary)',
    },
    {
      id: 'full-marks',
      title: isAr ? 'درجات نهائية 100%' : 'Perfect Exams',
      value: student.perfectExams,
      icon: CheckCircle2,
      color: '#059669',
    },
    {
      id: 'lessons-studied',
      title: isAr ? 'حصص مكتملة' : 'Lessons Completed',
      value: student.lessonsStudied,
      icon: BookOpen,
      color: '#7C3AED',
    },
    {
      id: 'streak-days',
      title: isAr ? 'أيام الاستمرار' : 'Streak Days',
      value: isAr ? `${student.streak} يوم` : `${student.streak}d`,
      icon: Flame,
      color: '#EA580C',
    },
    {
      id: 'homework-rate',
      title: isAr ? 'نسبة الواجبات' : 'Homework Rate',
      value: `${student.homeworkRate}%`,
      icon: FileCheck,
      color: '#0284C7',
    },
    {
      id: 'attendance-rate',
      title: isAr ? 'نسبة الحضور' : 'Attendance Rate',
      value: `${student.attendanceRate}%`,
      icon: CalendarCheck,
      color: '#D97706',
    },
  ];

  const rankBadgeBg =
    student.rank === 1
      ? '#F59E0B'
      : student.rank === 2
        ? 'var(--primary)'
        : student.rank === 3
          ? '#B45309'
          : '#334155';

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 37, 78, 0.52)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '22px',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 22px 50px rgba(6, 37, 78, 0.28)',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          animation: 'lgFadeIn 0.2s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            position: 'relative',
            padding: '24px 20px 18px',
            background: 'linear-gradient(135deg, rgba(6, 37, 78, 0.04) 0%, rgba(21, 136, 199, 0.08) 100%)',
            borderBottom: '1px solid var(--border-subtle)',
            textAlign: 'center',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            style={{
              position: 'absolute',
              top: '14px',
              insetInlineEnd: '14px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>

          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
            <LeagueAvatar
              src={student.avatar}
              name={student.nameAr}
              size={70}
              borderColor={isMe ? 'var(--primary)' : rankBadgeBg}
              borderWidth={3}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                insetInlineEnd: '-2px',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: rankBadgeBg,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11.5px',
                fontWeight: '900',
                border: '2px solid var(--bg-surface)',
              }}
            >
              #{student.rank}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {student.nameAr}
            </h2>
            {isMe && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '2px 7px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                }}
              >
                {isAr ? 'أنت' : 'You'}
              </span>
            )}
          </div>

          {subMeta && (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {subMeta}
            </div>
          )}

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              fontWeight: '800',
              color: 'var(--primary)',
            }}
          >
            <Trophy size={13} />
            <span>
              {leagueTitle} • {student.score.toLocaleString()} XP • {student.tierLabelAr}
            </span>
          </div>
        </div>

        {/* Real Stats Grid */}
        <div style={{ padding: '18px 20px 20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              marginBottom: '18px',
            }}
          >
            {stats.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                      {item.title}
                    </span>
                    <IconComponent size={15} color={item.color} />
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)' }}>
                    {item.value}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '11px 18px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
