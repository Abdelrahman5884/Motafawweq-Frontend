import React, { useEffect, useMemo, useRef, useState } from 'react';
import { InfoTooltip } from '../../../components/common/InfoTooltip';
import { Clock, Loader2, Mail, Search, Send, UserCheck, UserPlus, X } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { centerApi } from '../../../services/centerApi';
import { GRADE_OPTIONS } from './centerGroupsUtils';

export const CenterAddStudentModal = ({
  isOpen,
  onClose,
  activeGroup,
  activeGroupStudents = [],
  activeGroupPending = [],
  onEnrollExisting,
  onEnrollManual,
  isBackendCenter = true,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';

  const [tab, setTab] = useState('search'); // 'search' | 'manual'
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [invitingStudentId, setInvitingStudentId] = useState(null);
  const seqRef = useRef(0);

  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualGrade, setManualGrade] = useState(activeGroup?.gradeAr || GRADE_OPTIONS[5]);
  const [manualParentName, setManualParentName] = useState('');
  const [manualParentPhone, setManualParentPhone] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('paid'); // 'paid' | 'partial' | 'due'
  const [dueAmountEgp, setDueAmountEgp] = useState(() => String(activeGroup?.priceEgp || ''));
  const [submitting, setSubmitting] = useState(false);

  const enrolledLookup = useMemo(() => {
    const set = new Set();
    activeGroupStudents.forEach((s) => {
      if (s.studentId) set.add(`id:${s.studentId}`);
      if (s.studentCode) set.add(`code:${String(s.studentCode).toLowerCase()}`);
      const digits = String(s.phone || '').replace(/\D/g, '');
      if (digits) set.add(`phone:${digits}`);
    });
    return set;
  }, [activeGroupStudents]);

  const pendingLookup = useMemo(() => {
    const map = new Map();
    activeGroupPending.forEach((s) => {
      const method = s.joinMethod || (s.isTeacherInvite ? 'teacher_invite' : 'join_code');
      if (s.studentId) map.set(`id:${s.studentId}`, method);
      if (s.studentCode) map.set(`code:${String(s.studentCode).toLowerCase()}`, method);
      const digits = String(s.phone || '').replace(/\D/g, '');
      if (digits) map.set(`phone:${digits}`, method);
    });
    return map;
  }, [activeGroupPending]);

  useEffect(() => {
    if (!isOpen || !isBackendCenter || tab !== 'search') return undefined;

    const seq = ++seqRef.current;
    const q = searchQuery.trim();
    const timer = setTimeout(() => {
      setSearching(true);
      centerApi.groups
        .searchStudents(q)
        .then((res) => {
          if (seq !== seqRef.current) return;
          setSearchResults(Array.isArray(res?.data) ? res.data : []);
        })
        .catch(() => {
          if (seq !== seqRef.current) return;
          setSearchResults([]);
        })
        .finally(() => {
          if (seq === seqRef.current) {
            setSearching(false);
          }
        });
    }, q ? 250 : 0);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, isBackendCenter, tab, searchQuery]);

  if (!isOpen || !activeGroup) return null;

  const getStudentEnrollmentState = (std) => {
    const digits = String(std.phone || '').replace(/\D/g, '');
    const codeKey = std.studentCode ? `code:${String(std.studentCode).toLowerCase()}` : '';

    if (
      (std.id && enrolledLookup.has(`id:${std.id}`)) ||
      (codeKey && enrolledLookup.has(codeKey)) ||
      (digits && enrolledLookup.has(`phone:${digits}`))
    ) {
      return { status: 'enrolled', method: null };
    }

    const pendingMethod =
      (std.id && pendingLookup.get(`id:${std.id}`)) ||
      (codeKey && pendingLookup.get(codeKey)) ||
      (digits && pendingLookup.get(`phone:${digits}`)) ||
      null;

    if (pendingMethod) {
      return { status: 'pending', method: pendingMethod };
    }

    return { status: 'none', method: null };
  };

  const handleInvitePlatformStudent = async (std) => {
    if (invitingStudentId) return;
    setInvitingStudentId(std.id);
    try {
      await onEnrollExisting(std);
    } finally {
      setInvitingStudentId(null);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onEnrollManual({
        nameAr: manualName.trim(),
        phone: manualPhone.trim(),
        email: manualEmail.trim() || undefined,
        gradeAr: manualGrade,
        parentNameAr: manualParentName.trim() || undefined,
        parentPhone: manualParentPhone.trim() || manualPhone.trim(),
        paymentStatus,
        dueAmountEgp:
          paymentStatus === 'paid'
            ? 0
            : Math.max(0, Number.parseFloat(dueAmountEgp) || Number(activeGroup.priceEgp) || 0),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          maxWidth: '580px',
          width: '100%',
          padding: '24px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {isAr
                ? `دعوة وإضافة طالب لمجموعة: ${activeGroup.nameAr}`
                : `Invite or Add Student to: ${activeGroup.nameAr}`}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-app)',
            padding: '4px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '16px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => setTab('search')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: tab === 'search' ? 'var(--bg-surface)' : 'transparent',
              color: tab === 'search' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: '800',
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: tab === 'search' ? 'var(--shadow-xs)' : 'none',
            }}
          >
            {isAr ? '1. طالب مسجل بالمنصة (إرسال دعوة)' : '1. Platform Student (Send Invite)'}
          </button>
          <button
            type="button"
            onClick={() => setTab('manual')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: tab === 'manual' ? 'var(--bg-surface)' : 'transparent',
              color: tab === 'manual' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: '800',
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: tab === 'manual' ? 'var(--shadow-xs)' : 'none',
            }}
          >
            {isAr ? '2. طالب خارجي جديد (قيد مباشر وباركود)' : '2. Walk-in Student (Direct Enroll)'}
          </button>
        </div>

        {tab === 'search' ? (
          <div>
            <div
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(21, 136, 199, 0.08)',
                border: '1px solid rgba(21, 136, 199, 0.2)',
                fontSize: '11.5px',
                color: 'var(--text-secondary)',
                marginBottom: '12px',
                lineHeight: 1.55,
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                <span>{isAr ? 'طالب مسجل بالمنصة — يتم إرسال دعوة انضمام' : 'Platform student — invitation is sent'}</span>
                <InfoTooltip
                  size={13}
                  text={isAr
                    ? 'عند اختيار طالب مسجل في المنصة، يتم إرسال دعوة انضمام لحسابه؛ وبمجرد قبول الطالب للدعوة من عنده ينضم للمجموعة تلقائياً ويُصدر له باركود الحضور.'
                    : 'Selecting a registered platform student sends an invitation to their account. Once accepted by the student, they join automatically.'}
                />
              </span>
            </div>

            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <input
                type="text"
                autoFocus
                placeholder={isAr ? 'ابحث باسم الطالب أو رقم الهاتف أو الكود الموحد...' : 'Search by name, phone, or student code...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                }}
              />
              <Search
                size={16}
                color="var(--text-secondary)"
                style={{ position: 'absolute', left: '12px', top: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
              {searching ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  {isAr ? 'جاري البحث في طلاب المنصة...' : 'Searching platform students...'}
                </div>
              ) : searchResults.length === 0 ? (
                <div style={{ padding: '22px 14px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  <div style={{ marginBottom: '10px' }}>
                    {isAr
                      ? 'لم يتم العثور على طالب مسجل في المنصة بهذا البحث.'
                      : 'No matching platform student found.'}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('manual');
                      if (searchQuery.trim()) setManualName(searchQuery.trim());
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(21, 136, 199, 0.25)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    {isAr ? '+ تسجيل كطالب خارجي جديد وإصدار باركود فوراً' : '+ Register as Walk-in Student'}
                  </button>
                </div>
              ) : (
                searchResults.map((std) => {
                  const state = getStudentEnrollmentState(std);
                  const isInvitingThis = invitingStudentId === std.id;
                  const displayName = std.nameAr || std.name || 'طالب';

                  return (
                    <div
                      key={std.id}
                      style={{
                        padding: '11px 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-app)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <Avatar
                          src={std.avatar}
                          name={displayName}
                          size={42}
                          border="1.5px solid var(--primary)"
                        />
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '13.5px',
                              fontWeight: '800',
                              color: 'var(--text-primary)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {displayName}
                          </div>
                          <div
                            style={{
                              fontSize: '11.5px',
                              color: 'var(--text-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              flexWrap: 'wrap',
                              marginTop: '2px',
                            }}
                          >
                            {std.studentCode && (
                              <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)' }}>
                                {std.studentCode}
                              </span>
                            )}
                            {std.gradeAr && <span>• {std.gradeAr}</span>}
                            {std.phone && <span style={{ direction: 'ltr' }}>• {std.phone}</span>}
                          </div>
                        </div>
                      </div>

                      <div style={{ flexShrink: 0 }}>
                        {state.status === 'enrolled' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '6px 11px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'rgba(16, 185, 129, 0.12)',
                              color: '#10B981',
                              fontSize: '11.5px',
                              fontWeight: '800',
                            }}
                          >
                            <UserCheck size={13} />
                            <span>{isAr ? 'مقيد بالمجموعة' : 'Enrolled'}</span>
                          </span>
                        ) : state.status === 'pending' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '6px 11px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'rgba(245, 158, 11, 0.14)',
                              color: '#D97706',
                              fontSize: '11.5px',
                              fontWeight: '800',
                            }}
                          >
                            <Clock size={13} />
                            <span>
                              {state.method === 'teacher_invite'
                                ? isAr
                                  ? 'تم إرسال الدعوة (بانتظار الطالب)'
                                  : 'Invite Sent'
                                : isAr
                                  ? 'طلب انضمام معلق'
                                  : 'Pending Request'}
                            </span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={Boolean(invitingStudentId)}
                            onClick={() => handleInvitePlatformStudent(std)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '7px 14px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'var(--primary)',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: '800',
                              cursor: isInvitingThis ? 'wait' : 'pointer',
                              opacity: invitingStudentId && !isInvitingThis ? 0.65 : 1,
                            }}
                          >
                            {isInvitingThis ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                            <span>
                              {isInvitingThis
                                ? isAr
                                  ? 'جاري الإرسال...'
                                  : 'Sending...'
                                : isAr
                                  ? 'إرسال دعوة انضمام'
                                  : 'Send Invite'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontSize: '11.5px',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                <span>{isAr ? 'طالب خارجي — قيد مباشر وباركود فوري' : 'Walk-in student — instant enrollment & pass'}</span>
                <InfoTooltip
                  size={13}
                  text={isAr
                    ? 'تسجيل طالب عادي غير موجود بالمنصة: يتم قيد الطالب مباشرةً في المجموعة وإصدار بطاقة الباركود والكود السريع له فوراً.'
                    : 'Walk-in non-platform student: directly enrolls the student and generates their barcode & PIN pass immediately.'}
                />
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                {isAr ? 'اسم الطالب بالكامل *' : 'Student Full Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={isAr ? 'اكتب اسم الطالب...' : 'Enter student full name...'}
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  {isAr ? 'رقم هاتف الطالب *' : 'Student Phone *'}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="010XXXXXXXX"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  {isAr ? 'الصف الدراسي' : 'Grade'}
                </label>
                <select
                  value={manualGrade}
                  onChange={(e) => setManualGrade(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                >
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  {isAr ? 'اسم ولي الأمر' : 'Guardian Name'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'اسم ولي الأمر...' : 'Parent name...'}
                  value={manualParentName}
                  onChange={(e) => setManualParentName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  {isAr ? 'هاتف ولي الأمر' : 'Guardian Phone'}
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={manualParentPhone}
                  onChange={(e) => setManualParentPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: paymentStatus === 'paid' ? '1fr' : '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  {isAr ? 'حالة سداد الاشتراك' : 'Payment Status'}
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700',
                  }}
                >
                  <option value="paid">{isAr ? 'مسدد بالكامل' : 'Paid in Full'}</option>
                  <option value="partial">{isAr ? 'سداد جزئي (متبقي قسط)' : 'Partial Payment'}</option>
                  <option value="due">{isAr ? 'مستحق السداد لاحقاً' : 'Payment Due'}</option>
                </select>
              </div>

              {paymentStatus !== 'paid' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {isAr ? 'المبلغ المتبقي (ج.م)' : 'Due Amount (EGP)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={dueAmountEgp}
                    onChange={(e) => setDueAmountEgp(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                {isAr ? 'البريد الإلكتروني للطالب (اختياري)' : 'Student Email (Optional)'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
                <Mail size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !manualName.trim() || !manualPhone.trim()}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '800',
                fontSize: '13px',
                cursor: submitting ? 'wait' : 'pointer',
                marginTop: '6px',
              }}
            >
              {submitting
                ? isAr
                  ? 'جاري التسجيل...'
                  : 'Enrolling...'
                : isAr
                  ? 'تسجيل الطالب وإصدار الباركود فوراً'
                  : 'Enroll Student & Generate Barcode'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
