import React, { useState } from 'react';
import { Check, X, Clock, Smartphone, UserPlus, Copy, Loader2, Send } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { useGroups } from '../../../context/GroupsContext';

export const PendingStudentsTable = ({
  groupId,
  pendingStudents = [],
  joinCode = '',
  lang = 'ar',
  isRtl = true,
  isMobile = false,
  onOpenInviteModal,
}) => {
  const isAr = lang === 'ar';
  const { acceptPendingStudent, rejectPendingStudent, showToast } = useGroups();
  const [busyMap, setBusyMap] = useState({});
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyJoinLink = () => {
    if (!joinCode) return;
    const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
    const link = origin ? `${origin}/join-group/${encodeURIComponent(joinCode)}` : joinCode;
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopiedLink(true);
    showToast(isAr ? 'تم نسخ رابط وكود الانضمام للمجموعة!' : 'Group join link copied!');
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleAccept = async (enrollmentId) => {
    if (busyMap[enrollmentId]) return;
    setBusyMap((prev) => ({ ...prev, [enrollmentId]: 'accept' }));
    await acceptPendingStudent(groupId, enrollmentId);
    setBusyMap((prev) => {
      const next = { ...prev };
      delete next[enrollmentId];
      return next;
    });
  };

  const handleReject = async (enrollmentId, isTeacherInvite = false) => {
    if (busyMap[enrollmentId]) return;
    setBusyMap((prev) => ({ ...prev, [enrollmentId]: 'reject' }));
    await rejectPendingStudent(groupId, enrollmentId, '', { isInviteCancel: isTeacherInvite });
    setBusyMap((prev) => {
      const next = { ...prev };
      delete next[enrollmentId];
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Action Header Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Clock size={16} color="var(--primary)" />
          <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {isAr
              ? `طلبات الانضمام والدعوات المعلقة (${pendingStudents.length})`
              : `Pending Requests & Invites (${pendingStudents.length})`}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {isAr
              ? '— طلبات الطلاب بانتظار موافقتك، ودعواتك بانتظار قبول الطالب من حسابه'
              : '— Student requests await your approval; sent invites await student acceptance'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {joinCode && (
            <button
              type="button"
              onClick={handleCopyJoinLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '9px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                color: copiedLink ? '#10B981' : 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} color="var(--primary)" />}
              <span>
                {copiedLink
                  ? isAr
                    ? 'تم نسخ الرابط'
                    : 'Link Copied'
                  : isAr
                    ? 'نسخ رابط الانضمام'
                    : 'Copy Join Link'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenInviteModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '9px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 8px var(--primary-glow)',
            }}
          >
            <UserPlus size={14} />
            <span>{isAr ? 'دعوة طالب جديد' : 'Invite Student'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {pendingStudents.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '44px 20px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <Clock size={36} color="var(--primary)" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
            {isAr ? 'لا توجد طلبات انضمام معلقة حالياً' : 'No pending join requests'}
          </h3>
          <p style={{ fontSize: '12.5px', margin: '0 auto 16px', maxWidth: '460px', lineHeight: 1.6 }}>
            {isAr
              ? 'شارك كود أو رابط المجموعة مع طلابك لمراجعة طلبات الانضمام، كما ستظهر الدعوات التي ترسلها هنا بانتظار قبول الطالب من حسابه.'
              : 'Share your group code or invite link to review student requests. Invitations you send also appear here until accepted by the student.'}
          </p>
          <button
            type="button"
            onClick={onOpenInviteModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              color: 'var(--primary)',
              border: '1px solid rgba(21, 136, 199, 0.25)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <UserPlus size={14} />
            <span>{isAr ? 'دعوة أو إضافة طالب الآن' : 'Invite a Student Now'}</span>
          </button>
        </div>
      ) : isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pendingStudents.map((st) => {
            const busyAction = busyMap[st.id];
            const displayName = st.nameAr || st.name || 'طالب';
            const isTeacherInvite = st.joinMethod === 'teacher_invite';

            return (
              <div
                key={st.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-subtle)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Avatar src={st.avatar} name={displayName} size={38} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-primary)' }}>
                      {displayName}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                      {st.phone || st.email || '—'}
                    </div>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: isTeacherInvite ? 'rgba(245, 158, 11, 0.12)' : 'rgba(21, 136, 199, 0.1)',
                      color: isTeacherInvite ? '#D97706' : 'var(--primary)',
                      fontSize: '10.5px',
                      fontWeight: '800',
                    }}
                  >
                    {isTeacherInvite ? <Send size={11} /> : <Smartphone size={11} />}
                    <span>{st.method || (isAr ? 'كود الانضمام' : 'Join Code')}</span>
                  </span>
                </div>

                {(st.parentNameAr || st.parentPhone) && (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                    <strong>{isAr ? 'ولي الأمر:' : 'Parent:'}</strong> {st.parentNameAr || '—'}{' '}
                    {st.parentPhone ? `• ${st.parentPhone}` : ''}
                  </div>
                )}

                {isTeacherInvite ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '7px 10px',
                        borderRadius: '9px',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        color: '#D97706',
                        fontSize: '12px',
                        fontWeight: '800',
                      }}
                    >
                      <Clock size={13} />
                      <span>{isAr ? 'بانتظار قبول الطالب من حسابه' : 'Awaiting student acceptance'}</span>
                    </div>

                    <button
                      type="button"
                      disabled={Boolean(busyAction)}
                      onClick={() => handleReject(st.id, true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        padding: '8px',
                        borderRadius: '9px',
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        color: '#EF4444',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        cursor: busyAction ? 'wait' : 'pointer',
                        opacity: busyAction ? 0.7 : 1,
                      }}
                    >
                      {busyAction === 'reject' ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                      <span>{isAr ? 'إلغاء الدعوة' : 'Cancel Invite'}</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      disabled={Boolean(busyAction)}
                      onClick={() => handleAccept(st.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        padding: '8px',
                        borderRadius: '9px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        cursor: busyAction ? 'wait' : 'pointer',
                        opacity: busyAction ? 0.7 : 1,
                      }}
                    >
                      {busyAction === 'accept' ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      <span>{isAr ? 'قبول' : 'Accept'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={Boolean(busyAction)}
                      onClick={() => handleReject(st.id, false)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        padding: '8px',
                        borderRadius: '9px',
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        color: '#EF4444',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        cursor: busyAction ? 'wait' : 'pointer',
                        opacity: busyAction ? 0.7 : 1,
                      }}
                    >
                      {busyAction === 'reject' ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                      <span>{isAr ? 'رفض' : 'Reject'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: isRtl ? 'right' : 'left',
                fontSize: '13px',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontWeight: '800',
                  }}
                >
                  <th style={{ padding: '14px 18px' }}>{isAr ? 'الطالب' : 'Student'}</th>
                  <th style={{ padding: '14px 18px' }}>{isAr ? 'رقم هاتف الطالب' : 'Student Phone'}</th>
                  <th style={{ padding: '14px 18px' }}>{isAr ? 'ولي الأمر' : 'Parent Contact'}</th>
                  <th style={{ padding: '14px 18px' }}>{isAr ? 'طريقة الانضمام والتوقيت' : 'Method & Time'}</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center' }}>{isAr ? 'الإجراء المطلوب' : 'Decision'}</th>
                </tr>
              </thead>
              <tbody>
                {pendingStudents.map((st) => {
                  const busyAction = busyMap[st.id];
                  const displayName = st.nameAr || st.name || 'طالب';
                  const isTeacherInvite = st.joinMethod === 'teacher_invite';

                  return (
                    <tr key={st.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Avatar src={st.avatar} name={displayName} size={36} />
                          <div>
                            <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                              {displayName}
                            </div>
                            {st.studentCode && (
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                {st.studentCode}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontWeight: '700', direction: 'ltr', display: 'inline-block' }}>
                          {st.phone || '—'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '12.5px' }}>
                          {st.parentNameAr || '—'}
                        </div>
                        {st.parentPhone && (
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace', direction: 'ltr', marginTop: '2px' }}>
                            {st.parentPhone}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: isTeacherInvite ? 'rgba(245, 158, 11, 0.12)' : 'rgba(21, 136, 199, 0.1)',
                            color: isTeacherInvite ? '#D97706' : 'var(--primary)',
                            fontSize: '11px',
                            fontWeight: '800',
                          }}
                        >
                          {isTeacherInvite ? <Send size={12} /> : <Smartphone size={12} />}
                          <span>{st.method || (isAr ? 'كود الانضمام' : 'Join Code')}</span>
                        </span>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                          {st.requestedAt ? String(st.requestedAt).slice(0, 10) : '—'}
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        {isTeacherInvite ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '5px 10px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid rgba(245, 158, 11, 0.25)',
                                color: '#D97706',
                                fontSize: '11.5px',
                                fontWeight: '800',
                              }}
                            >
                              <Clock size={12} />
                              <span>{isAr ? 'بانتظار قبول الطالب' : 'Awaiting Student'}</span>
                            </span>

                            <button
                              type="button"
                              disabled={Boolean(busyAction)}
                              onClick={() => handleReject(st.id, true)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                color: '#EF4444',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: busyAction ? 'wait' : 'pointer',
                                opacity: busyAction ? 0.7 : 1,
                              }}
                            >
                              {busyAction === 'reject' ? <Loader2 size={13} className="animate-spin" /> : <X size={14} />}
                              <span>{isAr ? 'إلغاء الدعوة' : 'Cancel Invite'}</span>
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              disabled={Boolean(busyAction)}
                              onClick={() => handleAccept(st.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--primary)',
                                color: '#FFFFFF',
                                border: 'none',
                                fontSize: '12px',
                                fontWeight: '800',
                                cursor: busyAction ? 'wait' : 'pointer',
                                opacity: busyAction ? 0.7 : 1,
                              }}
                            >
                              {busyAction === 'accept' ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />}
                              <span>{isAr ? 'قبول' : 'Accept'}</span>
                            </button>

                            <button
                              type="button"
                              disabled={Boolean(busyAction)}
                              onClick={() => handleReject(st.id, false)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                color: '#EF4444',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: busyAction ? 'wait' : 'pointer',
                                opacity: busyAction ? 0.7 : 1,
                              }}
                            >
                              {busyAction === 'reject' ? <Loader2 size={13} className="animate-spin" /> : <X size={14} />}
                              <span>{isAr ? 'رفض' : 'Reject'}</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
