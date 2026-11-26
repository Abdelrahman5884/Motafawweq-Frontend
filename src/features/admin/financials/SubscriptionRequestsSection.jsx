import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  Copy,
  Users,
  GraduationCap,
  Building2,
  ExternalLink,
  X,
  FileText,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { adminApi } from '../../../services/adminApi';

const ROLE_META = {
  student: { ar: 'طالب', en: 'Student', color: '#0284C7', bg: 'rgba(2, 132, 199, 0.1)', Icon: Users },
  teacher: { ar: 'معلم', en: 'Teacher', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)', Icon: GraduationCap },
  center: { ar: 'سنتر تعليمي', en: 'Center', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)', Icon: Building2 },
};

const REJECTION_PRESETS_AR = [
  'صورة إيصال التحويل غير واضحة أو ناقصة',
  'كود العملية غير مطابق أو غير موجود',
  'المبلغ المحوّل أقل من قيمة الباقة المطلوبة',
  'لم يصل التحويل إلى حساب المنصة بعد',
];

export const SubscriptionRequestsSection = ({
  lang = 'ar',
  refreshTick = 0,
  onStatusChanged,
  showToast,
}) => {
  const isAr = lang === 'ar';
  const cur = isAr ? 'ج.م' : 'EGP';
  const seqRef = useRef(0);

  const [statusFilter, setStatusFilter] = useState('pending_review');
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ pendingCount: 0, pendingAmountEgp: 0, approvedCount: 0, rejectedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [busyUuid, setBusyUuid] = useState(null);
  const [copiedId, setCopiedId] = useState('');

  const [previewReq, setPreviewReq] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadRequests = useCallback(async () => {
    const seq = ++seqRef.current;
    setLoading(true);
    try {
      const res = await adminApi.financials.subscriptionRequests.list({
        status: statusFilter,
        role: roleFilter === 'all' ? '' : roleFilter,
        search: search.trim(),
        per_page: 50,
      });
      if (seq !== seqRef.current) return;
      setItems(Array.isArray(res?.data) ? res.data : []);
      if (res?.meta?.summary) {
        setSummary(res.meta.summary);
      }
    } catch (err) {
      if (seq === seqRef.current) {
        showToast?.(err?.message || (isAr ? 'تعذر تحميل طلبات الاشتراك' : 'Failed to load requests'), 'error');
      }
    } finally {
      if (seq === seqRef.current) setLoading(false);
    }
  }, [statusFilter, roleFilter, search, isAr, showToast]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadRequests();
    }, search ? 240 : 0);
    return () => window.clearTimeout(timer);
  }, [loadRequests, refreshTick, search]);

  const handleApprove = async (req) => {
    const ok = window.confirm(
      isAr
        ? `تأكيد اعتماد اشتراك «${req.userName}» في ${req.planNameAr} بمبلغ ${req.amountEgp} ج.م وتفعيل الباقة فوراً؟`
        : `Approve "${req.userName}" for ${req.planNameEn} (${req.amountEgp} EGP)?`
    );
    if (!ok) return;

    setBusyUuid(req.id);
    try {
      await adminApi.financials.subscriptionRequests.approve(req.role, req.id);
      showToast?.(isAr ? `تم اعتماد وتفعيل باقة «${req.userName}» بنجاح` : 'Subscription approved and activated');
      await loadRequests();
      onStatusChanged?.();
    } catch (err) {
      showToast?.(err?.message || (isAr ? 'تعذر اعتماد طلب الاشتراك' : 'Failed to approve request'), 'error');
    } finally {
      setBusyUuid(null);
    }
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectTarget || rejectReason.trim().length < 3) return;

    setBusyUuid(rejectTarget.id);
    try {
      await adminApi.financials.subscriptionRequests.reject(rejectTarget.role, rejectTarget.id, rejectReason.trim());
      showToast?.(isAr ? `تم رفض طلب «${rejectTarget.userName}» وإرسال سبب الرفض` : 'Subscription request rejected');
      setRejectTarget(null);
      setRejectReason('');
      await loadRequests();
      onStatusChanged?.();
    } catch (err) {
      showToast?.(err?.message || (isAr ? 'تعذر رفض الطلب' : 'Failed to reject request'), 'error');
    } finally {
      setBusyUuid(null);
    }
  };

  const handleCopyCode = (code, id) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(''), 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))', gap: '14px' }}>
        {[
          {
            label: isAr ? 'بانتظار مراجعة الوصل' : 'Pending Review',
            value: summary.pendingCount,
            sub: `${Number(summary.pendingAmountEgp || 0).toLocaleString()} ${cur}`,
            color: '#D97706',
            bg: 'rgba(245, 158, 11, 0.1)',
            Icon: Clock,
          },
          {
            label: isAr ? 'اشتراكات نشطة ومعتمدة' : 'Active Approved',
            value: summary.approvedCount,
            sub: isAr ? 'مفعّلة عبر جميع الرولات' : 'Active across all roles',
            color: '#059669',
            bg: 'rgba(5, 150, 105, 0.1)',
            Icon: CheckCircle2,
          },
          {
            label: isAr ? 'طلبات مرفوضة' : 'Rejected',
            value: summary.rejectedCount,
            sub: isAr ? 'بأسباب مسجلة للمستخدم' : 'With logged reasons',
            color: '#DC2626',
            bg: 'rgba(220, 38, 38, 0.08)',
            Icon: XCircle,
          },
        ].map((kpi, i) => {
          const KIcon = kpi.Icon;
          return (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '18px',
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '13px',
                  backgroundColor: kpi.bg,
                  color: kpi.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <KIcon size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{kpi.label}</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: kpi.color }}>{kpi.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters Toolbar */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '18px',
          padding: '14px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          {[
            { id: 'pending_review', ar: `قيد المراجعة (${summary.pendingCount})`, en: `Pending (${summary.pendingCount})` },
            { id: 'approved', ar: 'معتمدة', en: 'Approved' },
            { id: 'rejected', ar: 'مرفوضة', en: 'Rejected' },
            { id: 'all', ar: 'الكل', en: 'All' },
          ].map((st) => {
            const active = statusFilter === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  border: active ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: active ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                  color: active ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {isAr ? st.ar : st.en}
              </button>
            );
          })}

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <option value="all">{isAr ? 'جميع الحسابات (الكل)' : 'All Roles'}</option>
            <option value="student">{isAr ? 'الطلاب' : 'Students'}</option>
            <option value="teacher">{isAr ? 'المعلمون' : 'Teachers'}</option>
            <option value="center">{isAr ? 'السناتر التعليمية' : 'Centers'}</option>
          </select>
        </div>

        <div style={{ position: 'relative', minWidth: '240px', flex: '0 1 300px' }}>
          <Search size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '11px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث بالاسم أو كود العملية أو الهاتف...' : 'Search name, transaction ref, phone...'}
            style={{
              width: '100%',
              padding: '8px 12px',
              paddingInlineStart: '34px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ height: '130px', borderRadius: '18px', backgroundColor: 'var(--bg-subtle)' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px dashed var(--border-subtle)',
            borderRadius: '20px',
            padding: '44px 20px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <FileCheck2 size={38} color="var(--primary)" style={{ opacity: 0.65, marginBottom: '10px' }} />
          <div style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {statusFilter === 'pending_review'
              ? isAr
                ? 'لا توجد طلبات اشتراك معلّقة حالياً'
                : 'No Pending Subscription Requests'
              : isAr
                ? 'لا توجد طلبات مطابقة للبحث'
                : 'No Matching Requests'}
          </div>
          <div style={{ fontSize: '12.5px' }}>
            {isAr
              ? 'أي طالب أو معلم أو سنتر يطلب اشتراكاً مدفوعاً سيظهر هنا مع كود العملية وصورة الوصل لاعتماده.'
              : 'Paid subscription submissions from Students, Teachers, and Centers will appear here for receipt review.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {items.map((req) => {
            const roleMeta = ROLE_META[req.role] || ROLE_META.student;
            const RoleIcon = roleMeta.Icon;
            const isPending = req.status === 'pending_review';
            const isRejected = req.status === 'rejected';
            const isBusy = busyUuid === req.id;
            const isPdf = String(req.receiptMimeType || '').toLowerCase().includes('pdf');

            return (
              <div
                key={`${req.role}-${req.id}`}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: isPending
                    ? '1.5px solid rgba(245, 158, 11, 0.45)'
                    : '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '18px 20px',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  opacity: isBusy ? 0.65 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  {/* Left: User + Plan Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '240px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          backgroundColor: roleMeta.bg,
                          color: roleMeta.color,
                          fontSize: '11.5px',
                          fontWeight: '900',
                        }}
                      >
                        <RoleIcon size={12} />
                        <span>{isAr ? roleMeta.ar : roleMeta.en}</span>
                      </span>

                      <strong style={{ fontSize: '15.5px', color: 'var(--text-primary)' }}>{req.userName || '—'}</strong>

                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: '900',
                          backgroundColor: isPending
                            ? 'rgba(245, 158, 11, 0.14)'
                            : isRejected
                              ? 'rgba(220, 38, 38, 0.12)'
                              : 'rgba(5, 150, 105, 0.12)',
                          color: isPending ? '#B45309' : isRejected ? '#DC2626' : '#059669',
                        }}
                      >
                        {isPending
                          ? isAr ? 'قيد المراجعة' : 'Pending Review'
                          : isRejected
                            ? isAr ? 'مرفوض' : 'Rejected'
                            : isAr ? 'معتمد ونشط' : 'Approved'}
                      </span>
                    </div>

                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <strong style={{ color: 'var(--primary)' }}>{req.planNameAr}</strong>
                      {req.userPhone && <span>• {req.userPhone}</span>}
                      {req.userEmail && <span>• {req.userEmail}</span>}
                      {req.submittedDate && <span>• {req.submittedDate}</span>}
                    </div>
                  </div>

                  {/* Right: Amount Box */}
                  <div
                    style={{
                      padding: '10px 16px',
                      borderRadius: '14px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      textAlign: 'center',
                      minWidth: '130px',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
                      {isAr ? 'المبلغ المدفوع' : 'Amount'}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary)' }}>
                      {Number(req.amountEgp || 0).toLocaleString()} {cur}
                    </div>
                    {req.couponCode && (
                      <div style={{ fontSize: '10.5px', fontWeight: '800', color: '#059669' }}>
                        {isAr ? `كوبون: ${req.couponCode}` : `Coupon: ${req.couponCode}`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Middle: Transaction Code + Sender Info + Receipt Proof */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
                      {isAr ? 'كود العملية / الرقم المرجعي:' : 'Transaction Reference Code:'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '14px',
                          fontWeight: '900',
                          color: 'var(--text-primary)',
                          backgroundColor: 'var(--bg-surface)',
                          padding: '3px 9px',
                          borderRadius: '7px',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {req.transactionReference || '—'}
                      </span>
                      {req.transactionReference && (
                        <button
                          type="button"
                          onClick={() => handleCopyCode(req.transactionReference, req.id)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: copiedId === req.id ? '#059669' : 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '2px',
                          }}
                          title={isAr ? 'نسخ كود العملية' : 'Copy'}
                        >
                          {copiedId === req.id ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '3px' }}>
                      {isAr ? 'وسيلة التحويل وبيانات المرسل:' : 'Method & Sender:'}
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {req.paymentMethodLabelAr || req.paymentMethod || '—'}
                    </div>
                    {req.senderReference && (
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                        {req.senderReference}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                    {req.receiptUrl ? (
                      <button
                        type="button"
                        onClick={() => setPreviewReq(req)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 14px',
                          borderRadius: '11px',
                          border: '1.5px solid var(--primary)',
                          backgroundColor: 'var(--primary-surface)',
                          color: 'var(--primary)',
                          fontSize: '12.5px',
                          fontWeight: '900',
                          cursor: 'pointer',
                        }}
                      >
                        {isPdf ? <FileText size={15} /> : <Eye size={15} />}
                        <span>{isAr ? 'معاينة وصل الدفع' : 'Inspect Receipt'}</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                        {req.isFreePromo ? (isAr ? 'تفعيل مجاني (عرض مؤقت)' : 'Free Promo') : (isAr ? 'بدون مرفق وصل' : 'No receipt attached')}
                      </span>
                    )}
                  </div>
                </div>

                {req.rejectionReason && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(220, 38, 38, 0.08)',
                      color: '#DC2626',
                      fontSize: '12.5px',
                      fontWeight: '700',
                    }}
                  >
                    {isAr ? `سبب الرفض: ${req.rejectionReason}` : `Rejection reason: ${req.rejectionReason}`}
                  </div>
                )}

                {/* Action Footer for Pending Requests */}
                {isPending && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => {
                        setRejectTarget(req);
                        setRejectReason('');
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 16px',
                        borderRadius: '11px',
                        border: '1px solid rgba(220, 38, 38, 0.35)',
                        backgroundColor: 'rgba(220, 38, 38, 0.08)',
                        color: '#DC2626',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        cursor: isBusy ? 'wait' : 'pointer',
                      }}
                    >
                      <XCircle size={15} />
                      <span>{isAr ? 'رفض الطلب' : 'Reject'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleApprove(req)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 20px',
                        borderRadius: '11px',
                        border: 'none',
                        backgroundColor: '#059669',
                        color: '#FFFFFF',
                        fontSize: '12.5px',
                        fontWeight: '900',
                        cursor: isBusy ? 'wait' : 'pointer',
                        boxShadow: '0 6px 16px rgba(5, 150, 105, 0.28)',
                      }}
                    >
                      {isBusy ? <Loader2 size={15} className="spin" /> : <CheckCircle2 size={15} />}
                      <span>{isAr ? 'اعتماد الوصل وتفعيل الباقة' : 'Approve & Activate'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Full-Screen Receipt Preview Lightbox */}
      {previewReq && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewReq(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 37, 78, 0.82)',
            backdropFilter: 'blur(6px)',
            zIndex: 10002,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '22px',
              maxWidth: '780px',
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 28px 70px rgba(0,0,0,0.45)',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {isAr ? `إيصال دفع: ${previewReq.userName}` : `Receipt: ${previewReq.userName}`}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  {previewReq.transactionReference} • {Number(previewReq.amountEgp || 0).toLocaleString()} {cur}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a
                  href={previewReq.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '9px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: '800',
                  }}
                >
                  <ExternalLink size={14} />
                  <span>{isAr ? 'فتح في نافذة جديدة' : 'Open'}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewReq(null)}
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '16px', backgroundColor: '#0B1220', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '340px' }}>
              {String(previewReq.receiptMimeType || '').toLowerCase().includes('pdf') ? (
                <iframe
                  src={previewReq.receiptUrl}
                  title="Payment Receipt PDF"
                  style={{ width: '100%', height: '65vh', border: 'none', borderRadius: '12px', backgroundColor: '#FFFFFF' }}
                />
              ) : (
                <img
                  src={previewReq.receiptUrl}
                  alt={previewReq.receiptOriginalName || 'Payment Receipt'}
                  style={{ maxWidth: '100%', maxHeight: '72vh', borderRadius: '12px', objectFit: 'contain' }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectTarget && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => !busyUuid && setRejectTarget(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 37, 78, 0.72)',
            backdropFilter: 'blur(5px)',
            zIndex: 10002,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleConfirmReject}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '22px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={20} color="#DC2626" />
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {isAr ? `رفض طلب اشتراك ${rejectTarget.userName}` : `Reject ${rejectTarget.userName}`}
              </h3>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {REJECTION_PRESETS_AR.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setRejectReason(preset)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '999px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              required
              minLength={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={isAr ? 'اكتب سبب الرفض بوضوح ليظهر للمستخدم...' : 'Enter clear rejection reason...'}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                border: '1.5px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                disabled={Boolean(busyUuid)}
                onClick={() => setRejectTarget(null)}
                style={{ padding: '9px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', fontWeight: '700', cursor: 'pointer' }}
              >
                {isAr ? 'تراجع' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={Boolean(busyUuid) || rejectReason.trim().length < 3}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'تأكيد الرفض' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
