import React, { useState } from 'react';
import { Sparkles, X, AlertCircle } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { resolveTierFromXp } from './leagueConstants';

const QUICK_PRESETS = [10, 25, 50, 100, 200];

export const AwardXpModal = ({
  student,
  onSubmit,
  onClose,
  lang,
  isRtl,
  isMobile,
}) => {
  const isAr = lang === 'ar';
  const [xpAmount, setXpAmount] = useState(50);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!student) return null;

  const parsedXp = Number.parseInt(xpAmount, 10) || 0;
  const currentScore = Number(student.score || 0);
  const nextScore = currentScore + Math.max(0, parsedXp);
  const nextTier = resolveTierFromXp(nextScore);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (parsedXp < 1 || parsedXp > 5000) {
      setError(isAr ? 'يجب أن تكون نقاط البونص بين 1 و 5000 نقطة.' : 'Bonus XP must be between 1 and 5000.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit({
        studentId: student.studentId || student.id,
        studentName: student.nameAr,
        xpAmount: parsedXp,
        reason: reason.trim() || (isAr ? 'مكافأة تشجيعية من المعلم' : 'Teacher bonus reward'),
      });
    } catch (err) {
      setError(err?.message || (isAr ? 'تعذر منح النقاط للطالب.' : 'Failed to award XP.'));
    } finally {
      setIsSubmitting(false);
    }
  };

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
          maxWidth: '460px',
          padding: isMobile ? '20px 16px' : '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(245, 158, 11, 0.14)',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? 'منح نقاط بونص للطالب' : 'Award Bonus XP'}
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>
                {isAr ? 'تُضاف فوراً لرصيد الطالب وتعيد ترتيب الدوري تلقائياً' : 'Immediately updates student XP and league rank'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Target Student Summary */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <Avatar src={student.avatar} name={student.nameAr} size={38} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {student.nameAr}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                {isAr ? `المركز الحالي: #${student.rank}` : `Current Rank: #${student.rank}`}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--primary)', flexShrink: 0 }}>
            {currentScore.toLocaleString()} XP
          </div>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '12.5px',
              fontWeight: '700',
              marginBottom: '12px',
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Quick Presets */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {isAr ? 'اختر مقدار النقاط (XP):' : 'Select Bonus XP:'}
            </label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {QUICK_PRESETS.map((val) => {
                const selected = parsedXp === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setXpAmount(val)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '9px',
                      border: selected ? '1.5px solid #D97706' : '1px solid var(--border-medium)',
                      backgroundColor: selected ? 'rgba(245, 158, 11, 0.16)' : 'var(--bg-subtle)',
                      color: selected ? '#D97706' : 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    +{val} XP
                  </button>
                );
              })}
            </div>
            <input
              type="number"
              min={1}
              max={5000}
              required
              value={xpAmount}
              onChange={(e) => setXpAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '11px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '13.5px',
                fontWeight: '800',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
              {isAr ? 'سبب المكافأة (اختياري):' : 'Reason (optional):'}
            </label>
            <input
              type="text"
              maxLength={255}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={isAr ? 'مثال: مشاركة متميزة في الحصة أو إجابة نموذجية' : 'e.g. Outstanding class participation'}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '11px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          {/* Preview */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '11px',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              marginBottom: '18px',
              fontSize: '12px',
            }}
          >
            <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>
              {isAr ? 'الرصيد بعد المكافأة:' : 'New Total:'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ color: '#10B981', fontSize: '13.5px' }}>
                {nextScore.toLocaleString()} XP
              </strong>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: '800',
                  padding: '2px 7px',
                  borderRadius: '6px',
                  backgroundColor: nextTier.bg,
                  color: nextTier.color,
                }}
              >
                {isAr ? nextTier.labelAr : nextTier.labelEn}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '11px',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '11px',
                border: 'none',
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                cursor: isSubmitting ? 'wait' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              <Sparkles size={14} />
              <span>
                {isSubmitting
                  ? (isAr ? 'جاري المنح...' : 'Awarding...')
                  : (isAr ? `منح +${Math.max(0, parsedXp)} XP` : `Award +${Math.max(0, parsedXp)} XP`)}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AwardXpModal;
