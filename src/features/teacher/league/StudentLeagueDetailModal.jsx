import React from 'react';
import { X, Sparkles, UserMinus } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { TIER_MAP } from './leagueConstants';

export const StudentLeagueDetailModal = ({
  student,
  league,
  onAwardXp,
  onRemoveParticipant,
  onClose,
  lang,
  isRtl,
  isMobile,
}) => {
  if (!student) return null;
  const isAr = lang === 'ar';
  const tierMeta = TIER_MAP[student.tier] || TIER_MAP.Bronze;

  const score = Number(student.score ?? 0);
  const perfectExams = Number(student.perfectExams ?? 0);
  const streak = Number(student.streak ?? 0);
  const examsSolved = Number(student.examsSolved ?? 0);
  const homeworkRate = student.homeworkRate || '0%';
  const attendanceRate = student.attendanceRate || '0%';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '450px',
          padding: isMobile ? '20px 16px' : '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Avatar & Rank */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
          <Avatar
            src={student.avatar}
            name={student.nameAr}
            size={74}
            border="3px solid var(--primary)"
            boxShadow="0 6px 20px rgba(21, 136, 199, 0.25)"
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-3px',
              right: '-3px',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor:
                student.rank === 1 ? '#F59E0B' : student.rank === 2 ? '#38BDF8' : student.rank === 3 ? '#EA580C' : 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: '900',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #FFFFFF',
            }}
          >
            #{student.rank}
          </div>
        </div>

        <h3 style={{ fontSize: '17.5px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px' }}>
          {student.nameAr}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '800',
              padding: '2px 9px',
              borderRadius: '8px',
              backgroundColor: tierMeta.bg,
              color: tierMeta.color,
            }}
          >
            {isAr ? tierMeta.fullLabelAr : tierMeta.labelEn}
          </span>
          {student.badge && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 9px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              {student.badge}
            </span>
          )}
        </div>

        <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
          {[student.studentCode, student.schoolAr, student.groupAr || league?.groupNameAr]
            .filter(Boolean)
            .join(' • ')}
        </p>

        {/* Primary Metrics Grid (100% real data — zero fake fallbacks) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
          <div style={{ padding: '10px 6px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)' }}>
            <div style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--primary)' }}>
              {score.toLocaleString()}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
              {isAr ? 'مجموع النقاط' : 'Total XP'}
            </div>
          </div>

          <div style={{ padding: '10px 6px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)' }}>
            <div style={{ fontSize: '15.5px', fontWeight: '900', color: '#10B981' }}>
              {perfectExams}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
              {isAr ? 'فول مارك' : 'Full Marks'}
            </div>
          </div>

          <div style={{ padding: '10px 6px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)' }}>
            <div style={{ fontSize: '15.5px', fontWeight: '900', color: '#D97706' }}>
              {streak} {isAr ? 'يوم' : 'd'}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
              {isAr ? 'أيام الالتزام' : 'Streak'}
            </div>
          </div>
        </div>

        {/* Secondary Breakdown */}
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            fontSize: '11.5px',
            color: 'var(--text-secondary)',
            marginBottom: '18px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
          }}
        >
          <div>
            <div>{isAr ? 'الامتحانات' : 'Exams'}</div>
            <strong style={{ color: 'var(--text-primary)' }}>{examsSolved}</strong>
          </div>
          <div>
            <div>{isAr ? 'الواجبات' : 'Homework'}</div>
            <strong style={{ color: 'var(--text-primary)' }}>{homeworkRate}</strong>
          </div>
          <div>
            <div>{isAr ? 'الحضور' : 'Attendance'}</div>
            <strong style={{ color: 'var(--text-primary)' }}>{attendanceRate}</strong>
          </div>
        </div>

        {/* Actions (only while league is active) */}
        {!league?.isConcluded && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onAwardXp(student);
              }}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 12px',
                borderRadius: '12px',
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '800',
                fontSize: '12.5px',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={14} />
              <span>{isAr ? 'منح بونص XP' : 'Award Bonus XP'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onRemoveParticipant(student);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                fontWeight: '800',
                fontSize: '12.5px',
                cursor: 'pointer',
              }}
            >
              <UserMinus size={14} />
              <span>{isAr ? 'إزالة' : 'Remove'}</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '9px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-primary)',
            fontWeight: '700',
            fontSize: '12.5px',
            cursor: 'pointer',
          }}
        >
          {isAr ? 'إغلاق' : 'Close'}
        </button>
      </div>
    </div>
  );
};

export default StudentLeagueDetailModal;
