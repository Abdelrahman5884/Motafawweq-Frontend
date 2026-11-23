import React, { useState } from 'react';
import { Building2, Check, CheckCircle2, MapPin, Sparkles, X } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { SBadge, SButton, SCard } from '../../../components/student/ui';

export const TeacherCenterInvitationsBanner = ({
  invitations = [],
  onAccept,
  onDecline,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';
  const [busyId, setBusyId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  if (!Array.isArray(invitations) || (invitations.length === 0 && !feedback)) {
    return null;
  }

  const handleAction = async (inv, action) => {
    if (busyId) return;
    setBusyId(inv.id);
    setFeedback(null);
    try {
      if (action === 'accept') {
        await onAccept(inv.id);
        setFeedback({
          type: 'success',
          text: isAr
            ? `تم قبول دعوة الانضمام إلى «${inv.centerNameAr}» بنجاح!`
            : `Accepted invitation from "${inv.centerNameEn || inv.centerNameAr}".`,
        });
      } else {
        await onDecline(inv.id);
        setFeedback({
          type: 'info',
          text: isAr
            ? `تم رفض دعوة «${inv.centerNameAr}».`
            : `Declined invitation from "${inv.centerNameEn || inv.centerNameAr}".`,
        });
      }
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setFeedback({
        type: 'error',
        text:
          err?.message ||
          (isAr ? 'تعذر تنفيذ الطلب، يرجى المحاولة مجدداً.' : 'Action failed, please try again.'),
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {feedback && (
        <div
          role="status"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor:
              feedback.type === 'error'
                ? 'var(--error-light)'
                : feedback.type === 'success'
                  ? 'var(--success-light)'
                  : 'var(--primary-surface)',
            border: `1px solid ${
              feedback.type === 'error'
                ? 'rgba(220, 38, 38, 0.3)'
                : feedback.type === 'success'
                  ? 'rgba(22, 163, 74, 0.3)'
                  : 'var(--primary-light)'
            }`,
            color:
              feedback.type === 'error'
                ? 'var(--danger, #DC2626)'
                : feedback.type === 'success'
                  ? 'var(--success)'
                  : 'var(--primary)',
            fontSize: '13px',
            fontWeight: '700',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{feedback.text}</span>
        </div>
      )}

      {invitations.length > 0 && (
        <SCard
          padding={20}
          style={{
            border: '1.5px solid rgba(21, 136, 199, 0.35)',
            backgroundColor: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '11px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Building2 size={19} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {isAr ? 'دعوات انضمام جديدة من السناتر التعليمية' : 'Incoming Educational Center Invitations'}
                  </h3>
                  <SBadge variant="warning" size="xs">
                    <Sparkles size={11} />
                    <span>
                      {invitations.length} {isAr ? 'بانتظار موافقتك' : 'Pending'}
                    </span>
                  </SBadge>
                </div>
                <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  {isAr
                    ? 'لن يتم ربط حسابك بأي سنتر تعليمي إلا بعد موافقتك الصريحة على الدعوة.'
                    : 'Your account will only be linked to a center once you explicitly approve.'}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {invitations.map((inv) => {
              const isBusy = busyId === inv.id;
              return (
                <div
                  key={inv.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                    <Avatar src={inv.centerAvatar} name={inv.centerNameAr} size={44} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {isAr ? inv.centerNameAr : inv.centerNameEn || inv.centerNameAr}
                        </span>
                        {inv.isVerifiedCenter && (
                          <SBadge variant="success" size="xs">
                            {isAr ? 'سنتر معتمد ✓' : 'Verified ✓'}
                          </SBadge>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          marginTop: '3px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} color="var(--primary)" />
                          <span>{inv.branchNameAr}</span>
                        </span>
                        {inv.subjectAr && <span>• {inv.subjectAr}</span>}
                        {Number(inv.settlementPercent) > 0 && (
                          <span>
                            • {isAr ? `نسبة المعلم: ${inv.settlementPercent}%` : `Share: ${inv.settlementPercent}%`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <SButton
                      variant="primary"
                      size="sm"
                      icon={<Check size={14} />}
                      disabled={isBusy}
                      onClick={() => handleAction(inv, 'accept')}
                    >
                      {isBusy
                        ? isAr
                          ? 'جاري...'
                          : 'Working...'
                        : isAr
                          ? 'قبول الدعوة'
                          : 'Accept'}
                    </SButton>

                    <SButton
                      variant="danger"
                      size="sm"
                      icon={<X size={14} />}
                      disabled={isBusy}
                      onClick={() => handleAction(inv, 'decline')}
                    >
                      {isAr ? 'رفض' : 'Decline'}
                    </SButton>
                  </div>
                </div>
              );
            })}
          </div>
        </SCard>
      )}
    </div>
  );
};
