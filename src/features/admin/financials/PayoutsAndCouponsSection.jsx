import React, { useState } from 'react';
import {
  Plus,
  Check,
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  X,
} from 'lucide-react';
import { InfoTooltip } from '../../../components/common/InfoTooltip';

export const PayoutsSection = ({
  payouts = [],
  lang = 'ar',
  isRtl = true,
  busyId = null,
  submitting = false,
  onCreatePayout,
  onApprovePayout,
  onRejectPayout,
}) => {
  const isAr = lang === 'ar';
  const cur = isAr ? 'ج.م' : 'EGP';

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutToReject, setPayoutToReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [newPayout, setNewPayout] = useState({
    recipientType: 'teacher',
    recipientNameAr: '',
    amountEgp: 1500,
    payoutMethod: 'instapay',
    destination: '',
    notesAr: '',
  });

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    if (!newPayout.recipientNameAr.trim() || Number(newPayout.amountEgp) <= 0) return;
    const ok = await onCreatePayout?.({
      recipient_type: newPayout.recipientType,
      recipient_name_ar: newPayout.recipientNameAr.trim(),
      amount_egp: Number(newPayout.amountEgp),
      payout_method: newPayout.payoutMethod,
      destination: newPayout.destination.trim() || undefined,
      notes_ar: newPayout.notesAr.trim() || undefined,
    });
    if (ok !== false) {
      setIsPayoutModalOpen(false);
      setNewPayout({ recipientType: 'teacher', recipientNameAr: '', amountEgp: 1500, payoutMethod: 'instapay', destination: '', notesAr: '' });
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--shadow-xs)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
            {isAr ? 'التسويات' : 'Payouts'}
          </h3>
          <InfoTooltip
            size={14}
            text={
              isAr
                ? 'طلبات سحب أرباح المعلمين والسناتر، مع إمكانية الاعتماد أو الرفض عبر فودافون كاش وإنستاباي والبنك.'
                : 'Review, approve, or reject teacher & center payout transfers.'
            }
          />
        </div>

        <button
          type="button"
          onClick={() => setIsPayoutModalOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '11px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', boxShadow: 'var(--shadow-primary)' }}
        >
          <Plus size={16} />
          <span>{isAr ? 'طلب صرف جديد' : 'New Payout'}</span>
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-subtle)', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '12px 16px' }}>{isAr ? 'المستفيد والمرجع' : 'Recipient & Ref'}</th>
              <th style={{ padding: '12px 16px' }}>{isAr ? 'المبلغ المطلوب' : 'Amount'}</th>
              <th style={{ padding: '12px 16px' }}>{isAr ? 'طريقة الاستلام' : 'Method'}</th>
              <th style={{ padding: '12px 16px' }}>{isAr ? 'تاريخ الطلب' : 'Date'}</th>
              <th style={{ padding: '12px 16px' }}>{isAr ? 'الحالة' : 'Status'}</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>{isAr ? 'الإجراء' : 'Action'}</th>
            </tr>
          </thead>
          <tbody>
            {payouts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  {isAr ? 'لا توجد طلبات تسوية مالية مسجلة حتى الآن' : 'No payout requests recorded yet'}
                </td>
              </tr>
            ) : (
              payouts.map((p) => {
                const isCompleted = p.status === 'completed';
                const isRejected = p.status === 'rejected';
                const isPending = p.status === 'pending';
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '13px', opacity: busyId === p.id ? 0.6 : 1 }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                        {isAr ? p.teacherNameAr || p.teacherName : p.teacherNameEn || p.teacherName}
                      </div>
                      {p.referenceNumber && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {p.referenceNumber}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '900', color: 'var(--primary)' }}>
                      {Number(p.amountEgp || 0).toLocaleString()} {cur}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      <div>{isAr ? p.methodAr || p.method : p.methodEn || p.method}</div>
                      {p.destinationMasked && (
                        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          {p.destinationMasked}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                      {p.requestDate || '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: '800',
                          backgroundColor: isCompleted ? 'rgba(22, 163, 74, 0.12)' : isRejected ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.14)',
                          color: isCompleted ? '#15803D' : isRejected ? '#B91C1C' : '#B45309',
                        }}
                      >
                        {isCompleted ? (isAr ? 'تم التحويل' : 'Completed') : isRejected ? (isAr ? 'مرفوض' : 'Rejected') : (isAr ? 'قيد المراجعة' : 'Pending')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      {isPending ? (
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            disabled={busyId === p.id}
                            onClick={() => onApprovePayout?.(p)}
                            style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                          >
                            {isAr ? 'تأكيد التحويل' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            disabled={busyId === p.id}
                            onClick={() => {
                              setPayoutToReject(p);
                              setRejectReason('');
                            }}
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#B91C1C', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                          >
                            {isAr ? 'رفض' : 'Reject'}
                          </button>
                        </div>
                      ) : isCompleted ? (
                        <span style={{ color: '#15803D', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '800' }}>
                          <Check size={14} />
                          {p.transferReference || (isAr ? 'مسدد' : 'Settled')}
                        </span>
                      ) : (
                        <span style={{ color: '#B91C1C', fontSize: '11.5px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <XCircle size={13} />
                          {p.rejectionReason || (isAr ? 'مرفوض' : 'Rejected')}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isPayoutModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.62)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '22px', width: '100%', maxWidth: '480px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {isAr ? 'تسجيل طلب صرف مستحقات' : 'Record New Payout Request'}
              </h3>
              <button type="button" onClick={() => setIsPayoutModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmitCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>{isAr ? 'نوع المستفيد' : 'Recipient Type'}</label>
                  <select value={newPayout.recipientType} onChange={(e) => setNewPayout({ ...newPayout, recipientType: e.target.value })} style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}>
                    <option value="teacher">{isAr ? 'معلم' : 'Teacher'}</option>
                    <option value="center">{isAr ? 'سنتر تعليمي' : 'Center'}</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>{isAr ? 'وسيلة الدفع' : 'Method'}</label>
                  <select value={newPayout.payoutMethod} onChange={(e) => setNewPayout({ ...newPayout, payoutMethod: e.target.value })} style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}>
                    <option value="instapay">InstaPay</option>
                    <option value="vodafone">Vodafone Cash</option>
                    <option value="bank">{isAr ? 'تحويل بنكي' : 'Bank Wire'}</option>
                    <option value="fawry">Fawry</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>{isAr ? 'اسم المستفيد *' : 'Recipient Name *'}</label>
                <input type="text" required value={newPayout.recipientNameAr} onChange={(e) => setNewPayout({ ...newPayout, recipientNameAr: e.target.value })} placeholder="أ. محمد عبد الرحمن" style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>{isAr ? 'المبلغ (ج.م) *' : 'Amount (EGP) *'}</label>
                  <input type="number" min="1" required value={newPayout.amountEgp} onChange={(e) => setNewPayout({ ...newPayout, amountEgp: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontWeight: '800', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>{isAr ? 'رقم المحفظة / الحساب' : 'Destination'}</label>
                  <input type="text" value={newPayout.destination} onChange={(e) => setNewPayout({ ...newPayout, destination: e.target.value })} placeholder="010XXXXXXXX" style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsPayoutModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '700' }}>{isAr ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" disabled={submitting} style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: '#fff', fontWeight: '800', cursor: 'pointer' }}>{isAr ? 'تسجيل الطلب' : 'Create Payout'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {payoutToReject && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.62)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '20px', width: '100%', maxWidth: '430px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'رفض طلب التحويل المالي' : 'Reject Payout Request'}
            </h3>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={isAr ? 'اكتب سبب الرفض...' : 'Rejection reason...'}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setPayoutToReject(null)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '700' }}>{isAr ? 'إلغاء' : 'Cancel'}</button>
              <button
                type="button"
                disabled={submitting}
                onClick={async () => {
                  await onRejectPayout?.(payoutToReject.id, rejectReason.trim() || undefined);
                  setPayoutToReject(null);
                  setRejectReason('');
                }}
                style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', backgroundColor: '#DC2626', color: '#fff', fontWeight: '800', cursor: 'pointer' }}
              >
                {isAr ? 'تأكيد الرفض' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const CouponsSection = ({
  coupons = [],
  lang = 'ar',
  busyId = null,
  submitting = false,
  onCreateCoupon,
  onToggleCoupon,
  onDeleteCoupon,
}) => {
  const isAr = lang === 'ar';
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercent: 20,
    maxUses: 500,
    expiryDate: '2027-12-31',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;
    const cleanCode = newCoupon.code.trim().toUpperCase();
    const ok = await onCreateCoupon?.({
      code: cleanCode,
      discount_percent: Number(newCoupon.discountPercent),
      max_uses: Number(newCoupon.maxUses) || null,
      expires_at: newCoupon.expiryDate || null,
      is_active: true,
    });
    if (ok !== false) {
      setIsCouponModalOpen(false);
      setNewCoupon({ code: '', discountPercent: 20, maxUses: 500, expiryDate: '2027-12-31' });
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '22px', boxShadow: 'var(--shadow-xs)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
            {isAr ? 'الكوبونات' : 'Coupons'}
          </h3>
          <InfoTooltip
            size={14}
            text={
              isAr
                ? 'إنشاء وتفعيل وإيقاف أكواد الخصم الترويجية للاشتراكات عبر جميع البوابات.'
                : 'Create, toggle, and delete promotional discount codes across all portals.'
            }
          />
        </div>

        <button
          type="button"
          onClick={() => setIsCouponModalOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', padding: '10px 16px', borderRadius: '11px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', boxShadow: 'var(--shadow-primary)' }}
        >
          <Plus size={16} />
          <span>{isAr ? 'كود خصم جديد' : 'New Coupon'}</span>
        </button>
      </div>

      {coupons.length === 0 ? (
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13.5px' }}>
          {isAr ? 'لا توجد كوبونات خصم منشأة بعد' : 'No coupons created yet'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {coupons.map((cp) => (
            <div
              key={cp.id}
              style={{
                border: cp.isActive ? '1.5px dashed rgba(21, 136, 199, 0.4)' : '1.5px dashed var(--border-subtle)',
                borderRadius: '16px',
                padding: '16px',
                backgroundColor: 'var(--bg-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                opacity: busyId === cp.id ? 0.5 : cp.isActive ? 1 : 0.65,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '1px', fontFamily: 'var(--font-mono)' }}>
                  {cp.code}
                </span>
                <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: 'var(--primary-surface)', color: 'var(--primary)', fontSize: '11px', fontWeight: '800' }}>
                  {isAr ? `خصم ${cp.discountPercent}%` : `${cp.discountPercent}% Off`}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {isAr ? 'الاستخدامات: ' : 'Uses: '}
                <strong>{cp.usageCount ?? 0}</strong>
                {cp.maxUses ? (isAr ? ` من ${cp.maxUses}` : ` of ${cp.maxUses}`) : (isAr ? ' (غير محدود)' : ' (Unlimited)')}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {isAr ? 'ينتهي في: ' : 'Expires: '}{cp.expiryDate || (isAr ? 'مفتوح' : 'No expiry')}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => onToggleCoupon?.(cp)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', padding: '5px 10px', borderRadius: '8px', fontSize: '11.5px', fontWeight: '800', color: cp.isActive ? '#15803D' : 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  {cp.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                  <span>{cp.isActive ? (isAr ? 'مفعّل' : 'Active') : (isAr ? 'متوقف' : 'Paused')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteCoupon?.(cp)}
                  title={isAr ? 'حذف الكوبون' : 'Delete Coupon'}
                  style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCouponModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.62)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '22px', width: '100%', maxWidth: '460px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {isAr ? 'إنشاء كود خصم جديد' : 'Create New Coupon'}
              </h3>
              <button type="button" onClick={() => setIsCouponModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                  {isAr ? 'كود الخصم (أحرف وأرقام إنجليزية) *' : 'Promo Code *'}
                </label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="MOTAFAWWEQ25"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: '800', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>{isAr ? 'نسبة الخصم (%)' : 'Discount (%)'}</label>
                  <input type="number" min="1" max="100" required value={newCoupon.discountPercent} onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: Number(e.target.value) })} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>{isAr ? 'الحد الأقصى للاستخدام' : 'Max Uses'}</label>
                  <input type="number" min="1" value={newCoupon.maxUses} onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: Number(e.target.value) })} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>{isAr ? 'تاريخ انتهاء الصلاحية' : 'Expiry Date'}</label>
                <input type="date" value={newCoupon.expiryDate} onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsCouponModalOpen(false)} style={{ backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>{isAr ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" disabled={submitting} style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', padding: '9px 20px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>
                  {submitting ? (isAr ? 'جاري التفعيل...' : 'Saving...') : (isAr ? 'تفعيل الكود' : 'Activate Code')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
