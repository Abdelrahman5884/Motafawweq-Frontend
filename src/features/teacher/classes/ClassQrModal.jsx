import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Link2, Users, BookOpen, RefreshCw, Loader2 } from 'lucide-react';
import { RealQRCode } from '../../../components/common/RealQRCode';
import { useGroups } from '../../../context/GroupsContext';
import { useAuth } from '../../../context/AuthContext';
import { copyTextToClipboard } from '../../../utils';

export const ClassQrModal = ({
  showQrModal,
  selectedClass,
  lang = 'ar',
  onClose,
  onOpenRoster,
}) => {
  const { groups, regenerateGroupJoinCode, showToast } = useGroups();
  const { currentRole } = useAuth();
  const isStudent = currentRole === 'student';
  const isAr = lang === 'ar';

  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    if (!showQrModal) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !regenerating) {
        setConfirmRegen(false);
        onClose?.();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showQrModal, regenerating, onClose]);

  if (!showQrModal || !selectedClass) return null;

  // Always prefer the freshest group object from context (reflects regenerated joinCode immediately)
  const liveClass =
    groups.find((g) => g.id === selectedClass.id || g.uuid === selectedClass.id) || selectedClass;

  const cleanJoinCode = String(liveClass.joinCode || liveClass.join_code || '').trim().toUpperCase();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://motafawweq.me';
  const qrValue = cleanJoinCode ? `${origin}/join-group/${encodeURIComponent(cleanJoinCode)}` : origin;

  const handleClose = () => {
    if (regenerating) return;
    setConfirmRegen(false);
    onClose?.();
  };

  const handleCopyCode = async () => {
    if (!cleanJoinCode) return;
    const ok = await copyTextToClipboard(cleanJoinCode);
    if (ok) {
      setCopied(true);
      showToast?.(isAr ? `تم نسخ كود المجموعة: ${cleanJoinCode}` : `Copied code: ${cleanJoinCode}`);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyJoinLink = async () => {
    if (!cleanJoinCode) return;
    const ok = await copyTextToClipboard(qrValue);
    if (ok) {
      setCopiedLink(true);
      showToast?.(isAr ? 'تم نسخ رابط الانضمام للمجموعة!' : 'Join link copied!');
      window.setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleRegenerateCode = async () => {
    if (regenerating || !liveClass.id) return;
    if (!confirmRegen) {
      setConfirmRegen(true);
      return;
    }
    setRegenerating(true);
    await regenerateGroupJoinCode(liveClass.id);
    setRegenerating(false);
    setConfirmRegen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 25, 53, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          padding: '28px 24px',
          maxWidth: '430px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            border: 'none',
            background: 'var(--bg-subtle)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          <X size={18} />
        </button>

        <h3
          style={{
            fontSize: '18px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            padding: '0 24px',
          }}
        >
          {isAr ? liveClass.nameAr : liveClass.nameEn || liveClass.nameAr}
        </h3>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 10px',
            borderRadius: '6px',
            backgroundColor: 'var(--primary-surface)',
            color: 'var(--primary)',
            fontSize: '12px',
            fontWeight: '800',
            marginBottom: '10px',
          }}
        >
          <BookOpen size={13} />
          <span>{isAr ? liveClass.subjectAr || 'المادة الدراسية' : liveClass.subjectEn || liveClass.subjectAr}</span>
        </div>

        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.55 }}>
          {isStudent
            ? isAr
              ? 'كود وباركود المجموعة للمشاركة والانضمام مع زملائك'
              : 'Cohort code & QR to share with your classmates'
            : isAr
              ? 'يمسح الطالب الباركود بكاميرا هاتفه أو يدخل الكود لإرسال طلب انضمام فوري للمجموعة'
              : 'Students scan this QR or enter the join code to request enrollment'}
        </p>

        {/* Real High-Resolution Authentic QR Code */}
        <div
          style={{
            width: '236px',
            height: '236px',
            margin: '0 auto 16px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 8px 24px var(--primary-glow)',
          }}
        >
          <RealQRCode value={qrValue} size={220} />
        </div>

        {/* Join Code Chip with Copy */}
        <button
          type="button"
          onClick={handleCopyCode}
          title={isAr ? 'انقر لنسخ الكود' : 'Click to copy code'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-surface)',
            border: '1.5px dashed var(--primary)',
            fontSize: '14px',
            fontFamily: 'monospace',
            fontWeight: '900',
            color: 'var(--primary)',
            letterSpacing: '1px',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          {copied ? <Check size={15} color="#10B981" /> : <Copy size={15} />}
          <span dir="ltr">{cleanJoinCode || '—'}</span>
        </button>

        {/* Action Buttons: Student mode vs Teacher mode */}
        {isStudent ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleCopyCode}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '11px 16px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 2px 8px var(--primary-glow)',
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? (isAr ? 'تم نسخ الكود!' : 'Copied!') : isAr ? 'نسخ كود المجموعة' : 'Copy Code'}</span>
            </button>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '11px 18px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={handleCopyJoinLink}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 12px',
                  borderRadius: '11px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-medium)',
                  color: copiedLink ? '#10B981' : 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {copiedLink ? <Check size={14} /> : <Link2 size={14} color="var(--primary)" />}
                <span>{copiedLink ? (isAr ? 'تم النسخ' : 'Copied') : isAr ? 'نسخ رابط الانضمام' : 'Copy Join Link'}</span>
              </button>

              <button
                type="button"
                disabled={regenerating}
                onClick={handleRegenerateCode}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 12px',
                  borderRadius: '11px',
                  backgroundColor: confirmRegen ? 'rgba(245, 158, 11, 0.14)' : 'var(--bg-subtle)',
                  border: confirmRegen ? '1px solid rgba(245, 158, 11, 0.45)' : '1px solid var(--border-medium)',
                  color: confirmRegen ? '#B45309' : 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: regenerating ? 'wait' : 'pointer',
                }}
              >
                {regenerating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <RefreshCw size={14} color={confirmRegen ? '#D97706' : 'var(--primary)'} />
                )}
                <span>
                  {regenerating
                    ? isAr
                      ? 'جاري التجديد...'
                      : 'Updating...'
                    : confirmRegen
                      ? isAr
                        ? 'تأكيد إبطال القديم'
                        : 'Confirm Rotate'
                      : isAr
                        ? 'تجديد الكود'
                        : 'Rotate Code'}
                </span>
              </button>
            </div>

            {confirmRegen && (
              <div style={{ fontSize: '11.5px', color: '#B45309', lineHeight: 1.45 }}>
                {isAr
                  ? 'سيتم إبطال الكود القديم وتوليد كود جديد فوراً (الطلاب المقيدون حالياً لن يتأثروا).'
                  : 'Old join code will be invalidated immediately (current students are unaffected).'}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                handleClose();
                if (onOpenRoster) onOpenRoster(liveClass);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 2px 8px var(--primary-glow)',
              }}
            >
              <Users size={15} />
              <span>{isAr ? 'فتح سجل الطلاب وقبول الطلبات' : 'Open Roster & Review Requests'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
