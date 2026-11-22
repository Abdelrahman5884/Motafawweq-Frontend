import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Search, UserPlus, UserCheck, AlertCircle, Loader2, Users } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { useGroups } from '../../../context/GroupsContext';
import { teacherApi } from '../../../services/teacherApi';

export const InviteStudentModal = ({
  isOpen,
  groupId,
  groupName,
  lang = 'ar',
  isRtl = true,
  onClose,
  onInvited,
}) => {
  const isAr = lang === 'ar';
  const { inviteStudentToGroup, enrolledStudents, pendingStudents } = useGroups();

  const [mode, setMode] = useState('search'); // 'search' | 'manual'
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(true);
  const [invitingId, setInvitingId] = useState(null);
  const [error, setError] = useState('');
  const seqRef = useRef(0);

  // Manual student registration form
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualParentName, setManualParentName] = useState('');
  const [manualParentPhone, setManualParentPhone] = useState('');
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  const currentEnrolled = useMemo(
    () => (Array.isArray(enrolledStudents[groupId]) ? enrolledStudents[groupId] : []),
    [enrolledStudents, groupId]
  );
  const currentPending = useMemo(
    () => (Array.isArray(pendingStudents[groupId]) ? pendingStudents[groupId] : []),
    [pendingStudents, groupId]
  );

  const enrolledLookup = useMemo(() => {
    const set = new Set();
    currentEnrolled.forEach((s) => {
      if (s.studentId) set.add(`id:${s.studentId}`);
      if (s.studentCode) set.add(`code:${String(s.studentCode).toLowerCase()}`);
      if (s.phone) set.add(`phone:${String(s.phone).replace(/\D/g, '')}`);
    });
    return set;
  }, [currentEnrolled]);

  const pendingLookup = useMemo(() => {
    const set = new Set();
    currentPending.forEach((s) => {
      if (s.studentId) set.add(`id:${s.studentId}`);
      if (s.studentCode) set.add(`code:${String(s.studentCode).toLowerCase()}`);
      if (s.phone) set.add(`phone:${String(s.phone).replace(/\D/g, '')}`);
    });
    return set;
  }, [currentPending]);

  // Debounced live platform student search with stale-request guard
  useEffect(() => {
    if (!isOpen || mode !== 'search') return undefined;
    const seq = ++seqRef.current;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await teacherApi.roster.searchStudents(searchQuery.trim());
        if (seq !== seqRef.current) return;
        setResults(Array.isArray(res?.data) ? res.data : []);
      } catch {
        if (seq !== seqRef.current) return;
        setResults([]);
      } finally {
        if (seq === seqRef.current) {
          setIsSearching(false);
        }
      }
    }, searchQuery ? 300 : 0);

    return () => clearTimeout(timer);
  }, [isOpen, mode, searchQuery]);

  if (!isOpen) return null;

  const isInSet = (st, set) => {
    if (st.id && set.has(`id:${st.id}`)) return true;
    if (st.studentCode && set.has(`code:${String(st.studentCode).toLowerCase()}`)) return true;
    const digits = String(st.phone || '').replace(/\D/g, '');
    if (digits && set.has(`phone:${digits}`)) return true;
    return false;
  };

  const handleInviteRegistered = async (student) => {
    if (invitingId) return;
    setError('');
    setInvitingId(student.id);
    const result = await inviteStudentToGroup(groupId, {
      student_id: String(student.id),
      parent_name_ar: student.parentNameAr || undefined,
      parent_phone: student.parentPhone || undefined,
    });
    setInvitingId(null);
    if (!result?.success) {
      setError(result?.error || (isAr ? 'تعذر إرسال الدعوة للطالب.' : 'Failed to invite student.'));
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingManual) return;

    const cleanName = manualName.trim();
    const cleanPhone = manualPhone.trim();
    if (cleanName.length < 2) {
      setError(isAr ? 'يرجى إدخال اسم الطالب (حرفين على الأقل).' : 'Please enter student name.');
      return;
    }
    if (cleanPhone.replace(/\D/g, '').length < 8) {
      setError(isAr ? 'يرجى إدخال رقم هاتف صحيح للطالب.' : 'Please enter a valid student phone number.');
      return;
    }

    setError('');
    setIsSubmittingManual(true);
    const result = await inviteStudentToGroup(groupId, {
      name_ar: cleanName,
      phone: cleanPhone,
      parent_name_ar: manualParentName.trim() || undefined,
      parent_phone: manualParentPhone.trim() || undefined,
    });
    setIsSubmittingManual(false);

    if (result?.success) {
      setManualName('');
      setManualPhone('');
      setManualParentName('');
      setManualParentPhone('');
      onInvited?.();
      handleClose();
    } else {
      setError(result?.error || (isAr ? 'تعذر إضافة الطالب للمجموعة.' : 'Failed to add student.'));
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 25, 53, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '22px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '11px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserPlus size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? 'دعوة وإضافة طالب للمجموعة' : 'Invite Student to Cohort'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                {groupName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Switcher */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            padding: '4px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            marginBottom: '14px',
          }}
        >
          <button
            type="button"
            onClick={() => { setMode('search'); setError(''); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: mode === 'search' ? 'var(--primary)' : 'transparent',
              color: mode === 'search' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Search size={14} />
            <span>{isAr ? 'بحث في طلاب المنصة' : 'Search Platform Students'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('manual'); setError(''); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: mode === 'manual' ? 'var(--primary)' : 'transparent',
              color: mode === 'manual' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Users size={14} />
            <span>{isAr ? 'إضافة طالب بالاسم والهاتف' : 'Add by Name & Phone'}</span>
          </button>
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

        {mode === 'search' ? (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '11px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                marginBottom: '12px',
              }}
            >
              <Search size={15} color="var(--text-secondary)" />
              <input
                type="text"
                placeholder={isAr ? 'ابحث باسم الطالب أو كوده أو رقم الهاتف...' : 'Search by name, code, or phone...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setError('');
                }}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  width: '100%',
                  fontFamily: 'inherit',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '330px',
                overflowY: 'auto',
              }}
            >
              {isSearching ? (
                <div style={{ textAlign: 'center', padding: '32px 10px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  {isAr ? 'جاري البحث عن الطلاب...' : 'Searching students...'}
                </div>
              ) : results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '28px 12px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  <div>{isAr ? 'لا يوجد طلاب مطابقون لنتائج البحث' : 'No matching students found'}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('manual');
                      setManualName(searchQuery.trim());
                    }}
                    style={{
                      marginTop: '10px',
                      padding: '7px 14px',
                      borderRadius: '9px',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(21, 136, 199, 0.25)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    {isAr ? 'إضافة الطالب يدوياً بالاسم والهاتف' : 'Add manually by name & phone'}
                  </button>
                </div>
              ) : (
                results.map((st) => {
                  const enrolled = isInSet(st, enrolledLookup);
                  const pending = isInSet(st, pendingLookup);
                  const isBusy = invitingId === st.id;
                  const displayName = st.nameAr || st.name || 'طالب';

                  return (
                    <div
                      key={st.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        gap: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <Avatar src={st.avatar} name={displayName} size={38} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {displayName}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                            {st.studentCode && <span style={{ fontFamily: 'monospace' }}>{st.studentCode}</span>}
                            {st.gradeAr && <span>• {st.gradeAr}</span>}
                            {st.phone && <span style={{ direction: 'ltr' }}>• {st.phone}</span>}
                          </div>
                        </div>
                      </div>

                      <div style={{ flexShrink: 0 }}>
                        {enrolled ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(16, 185, 129, 0.12)',
                              color: '#10B981',
                              fontSize: '11.5px',
                              fontWeight: '800',
                            }}
                          >
                            <UserCheck size={12} />
                            <span>{isAr ? 'مقيد بالمجموعة' : 'Enrolled'}</span>
                          </span>
                        ) : pending ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(245, 158, 11, 0.14)',
                              color: '#D97706',
                              fontSize: '11.5px',
                              fontWeight: '800',
                            }}
                          >
                            <span>{isAr ? 'دعوة معلقة' : 'Pending'}</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={Boolean(invitingId)}
                            onClick={() => handleInviteRegistered(st)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '7px 12px',
                              borderRadius: '9px',
                              backgroundColor: 'var(--primary)',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: '800',
                              cursor: isBusy ? 'wait' : 'pointer',
                              opacity: invitingId && !isBusy ? 0.6 : 1,
                            }}
                          >
                            {isBusy ? <Loader2 size={13} className="animate-spin" /> : <UserPlus size={13} />}
                            <span>{isBusy ? (isAr ? 'جاري...' : 'Sending...') : (isAr ? 'إرسال دعوة' : 'Invite')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                {isAr ? 'اسم الطالب بالكامل *' : 'Student Full Name *'}
              </label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={150}
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder={isAr ? 'مثال: أحمد محمد علي' : 'e.g. Ahmed Mohamed Ali'}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                {isAr ? 'رقم هاتف الطالب *' : 'Student Phone *'}
              </label>
              <input
                type="tel"
                required
                minLength={8}
                maxLength={20}
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value)}
                placeholder="010xxxxxxxx"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  direction: 'ltr',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  {isAr ? 'اسم ولي الأمر (اختياري)' : 'Parent Name (optional)'}
                </label>
                <input
                  type="text"
                  maxLength={150}
                  value={manualParentName}
                  onChange={(e) => setManualParentName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  {isAr ? 'هاتف ولي الأمر (اختياري)' : 'Parent Phone (optional)'}
                </label>
                <input
                  type="tel"
                  maxLength={30}
                  value={manualParentPhone}
                  onChange={(e) => setManualParentPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    direction: 'ltr',
                    textAlign: isRtl ? 'right' : 'left',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                padding: '9px 12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(21, 136, 199, 0.08)',
                border: '1px solid rgba(21, 136, 199, 0.2)',
                fontSize: '11.5px',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
              }}
            >
              {isAr
                ? 'سيُضاف الطالب لقائمة «طلبات الانضمام والدعوات» ويمكنك قبوله فوراً لتوليد باركود وكود الحضور الخاص به.'
                : 'The student will be added to Pending & Invites where you can immediately approve them to generate their attendance pass.'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmittingManual}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: isSubmittingManual ? 'wait' : 'pointer',
                  opacity: isSubmittingManual ? 0.7 : 1,
                }}
              >
                {isSubmittingManual ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                <span>{isSubmittingManual ? (isAr ? 'جاري الإضافة...' : 'Adding...') : (isAr ? 'إرسال دعوة وإضافة' : 'Send Invite')}</span>
              </button>
            </div>
          </form>
        )}

        {mode === 'search' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
