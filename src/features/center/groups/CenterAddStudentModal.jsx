import React, { useEffect, useState } from 'react';
import { Mail, Search, UserPlus, X } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { centerApi } from '../../../services/centerApi';
import { GRADE_OPTIONS } from './centerGroupsUtils';

export const CenterAddStudentModal = ({
  isOpen,
  onClose,
  activeGroup,
  activeGroupStudents = [],
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

  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualGrade, setManualGrade] = useState(activeGroup?.gradeAr || GRADE_OPTIONS[5]);
  const [manualParentName, setManualParentName] = useState('');
  const [manualParentPhone, setManualParentPhone] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('paid'); // 'paid' | 'partial' | 'due'
  const [dueAmountEgp, setDueAmountEgp] = useState(() => String(activeGroup?.priceEgp || ''));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const q = searchQuery.trim();
    if (!isBackendCenter || q.length < 2) {
      return undefined;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      setSearching(true);
      centerApi.groups
        .searchStudents(q)
        .then((res) => {
          if (!cancelled) {
            setSearchResults(Array.isArray(res?.data) ? res.data : []);
          }
        })
        .catch(() => {
          if (!cancelled) setSearchResults([]);
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isOpen, isBackendCenter, searchQuery]);

  if (!isOpen || !activeGroup) return null;

  const displayedResults = searchQuery.trim().length >= 2 ? searchResults : [];

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
          maxWidth: '560px',
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
                ? `إضافة طالب لمجموعة: ${activeGroup.nameAr}`
                : `Add Student to: ${activeGroup.nameAr}`}
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
            marginBottom: '18px',
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
            {isAr ? '1. البحث في قاعدة بيانات متفوّق' : '1. Search Platform Students'}
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
            {isAr ? '2. تسجيل طالب جديد وإصدار باركود' : '2. Register Walk-in Student'}
          </button>
        </div>

        {tab === 'search' ? (
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {isAr
                ? 'ابحث عن الطالب بالاسم أو رقم الهاتف أو الكود لقيده فوراً وتوليد باركود السنتر:'
                : 'Search by student name, phone, or student code:'}
            </p>

            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <input
                type="text"
                autoFocus
                placeholder={isAr ? 'اكتب اسم الطالب أو رقم الهاتف أو الكود...' : 'Name, phone, or code...'}
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

            {searchQuery.trim().length >= 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '290px', overflowY: 'auto' }}>
                {searching ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {isAr ? 'جاري البحث...' : 'Searching...'}
                  </div>
                ) : displayedResults.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {isAr
                      ? 'لم يتم العثور على طالب مطابق. يمكنك التبديل إلى تبويب «تسجيل طالب جديد» لإضافته فوراً.'
                      : 'No matching student found. Switch to "Register Walk-in Student" to enroll them.'}
                  </div>
                ) : (
                  displayedResults.map((std) => {
                    const alreadyIn = activeGroupStudents.some(
                      (s) =>
                        (s.studentId && String(s.studentId) === String(std.id)) ||
                        (s.phone && std.phone && s.phone === std.phone)
                    );
                    return (
                      <div
                        key={std.id}
                        style={{
                          padding: '12px 14px',
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
                          <Avatar src={std.avatar} name={std.nameAr || 'طالب'} size={38} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                              {std.nameAr}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                              {std.phone || std.studentCode || ''} • {std.gradeAr || ''}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={alreadyIn}
                          onClick={() => onEnrollExisting(std)}
                          style={{
                            padding: '7px 14px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: alreadyIn ? 'var(--bg-subtle)' : 'var(--primary)',
                            color: alreadyIn ? 'var(--text-secondary)' : '#FFFFFF',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: '800',
                            cursor: alreadyIn ? 'not-allowed' : 'pointer',
                            flexShrink: 0,
                          }}
                        >
                          {alreadyIn
                            ? isAr
                              ? 'مقيد بالفعل'
                              : 'Enrolled'
                            : isAr
                            ? '+ قيد الطالب'
                            : '+ Enroll'}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
