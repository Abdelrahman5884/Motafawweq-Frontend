import React, { useState } from 'react';
import {
  Receipt,
  Smartphone,
  Store,
  Zap,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
  Eye,
  X,
  ShieldCheck,
} from 'lucide-react';

function resolveStatusMeta(rawStatus, isAr) {
  const s = String(rawStatus || '').toLowerCase();
  if (s === 'pending' || s.includes('مراجعة')) {
    return {
      label: isAr ? 'قيد المراجعة' : 'Pending Review',
      color: '#D97706',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.3)',
      Icon: Clock,
    };
  }
  if (s === 'rejected' || s.includes('مرفوض')) {
    return {
      label: isAr ? 'مرفوض' : 'Rejected',
      color: '#DC2626',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
      Icon: XCircle,
    };
  }
  return {
    label: isAr ? 'مدفوع ومعتمد' : 'Paid & Verified',
    color: 'var(--primary)',
    bg: 'rgba(21, 136, 199, 0.08)',
    border: 'rgba(21, 136, 199, 0.22)',
    Icon: CheckCircle2,
  };
}

function getMethodIcon(methodStr = '') {
  const m = String(methodStr || '').toLowerCase();
  if (m.includes('vodafone') || m.includes('فودافون') || m.includes('محفظة')) {
    return <Smartphone size={16} color="#E11D48" />;
  }
  if (m.includes('fawry') || m.includes('فوري')) {
    return <Store size={16} color="#F59E0B" />;
  }
  if (m.includes('instapay') || m.includes('إنستاباي')) {
    return <Zap size={16} color="#0284C7" />;
  }
  return <CreditCard size={16} color="var(--primary)" />;
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function printInvoiceReceipt(inv, isAr) {
  const statusMeta = resolveStatusMeta(inv.status, isAr);
  const title = isAr ? 'إيصال سداد إلكتروني معتمد — منصة متفوّق' : 'Verified Payment Receipt — Motafawweq';
  const desc = isAr ? inv.descriptionAr : inv.descriptionEn || inv.descriptionAr;
  const method = isAr ? inv.methodAr || inv.method : inv.methodEn || inv.method;
  const amount = isAr ? inv.amount : inv.amountEn || inv.amount;

  const html = `<!doctype html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(inv.id)}</title>
  <style>
    body { font-family: Cairo, system-ui, sans-serif; padding: 36px; color: #06254E; background: #fff; }
    .card { max-width: 560px; margin: 0 auto; border: 2px solid #0284C7; border-radius: 16px; padding: 28px; }
    h1 { margin: 0 0 6px; font-size: 20px; color: #06254E; }
    .sub { color: #64748B; font-size: 13px; margin-bottom: 20px; }
    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; }
    .row:last-child { border-bottom: none; font-size: 17px; font-weight: 900; color: #0284C7; }
    .label { color: #64748B; }
    .val { font-weight: 800; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${escapeHtml(title)}</h1>
    <div class="sub">${escapeHtml(inv.id)} • ${escapeHtml(inv.date || '')}</div>
    <div class="row"><span class="label">${isAr ? 'الخدمة / الباقة' : 'Item'}</span><span class="val">${escapeHtml(desc)}</span></div>
    <div class="row"><span class="label">${isAr ? 'وسيلة الدفع' : 'Payment Method'}</span><span class="val">${escapeHtml(method)}</span></div>
    <div class="row"><span class="label">${isAr ? 'الحالة' : 'Status'}</span><span class="val">${escapeHtml(statusMeta.label)}</span></div>
    ${inv.couponCode ? `<div class="row"><span class="label">${isAr ? 'كود الخصم' : 'Coupon'}</span><span class="val">${escapeHtml(inv.couponCode)}</span></div>` : ''}
    <div class="row"><span class="label">${isAr ? 'الإجمالي المدفوع' : 'Total Paid'}</span><span class="val">${escapeHtml(amount)}</span></div>
  </div>
  <script>window.onload = function(){ window.print(); };</script>
</body>
</html>`;

  const w = window.open('', '_blank', 'width=680,height=620');
  if (w) {
    w.document.open();
    w.document.write(html);
    w.document.close();
  }
}

export const BillingInvoicesList = ({ invoices = [], lang = 'ar', isRtl = true }) => {
  const isAr = lang === 'ar';
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '24px',
        padding: '24px 26px',
        boxShadow: 'var(--shadow-sm)',
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily: isRtl
          ? 'var(--font-arabic), "Cairo", system-ui, sans-serif'
          : 'var(--font-heading), "Outfit", sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Receipt size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'سجل العمليات والفواتير السابقة' : 'Payment History & Invoices'}
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {isAr
                ? 'فواتير اشتراكات المنصة ومدفوعات المقررات المباشرة مع المعلمين'
                : 'Verified receipts for platform subscriptions and direct course payments'}
            </div>
          </div>
        </div>

        <span
          style={{
            fontSize: '12px',
            fontWeight: '800',
            padding: '4px 12px',
            borderRadius: '99px',
            backgroundColor: 'rgba(21, 136, 199, 0.08)',
            color: 'var(--primary)',
            border: '1px solid rgba(21, 136, 199, 0.2)',
          }}
        >
          {isAr ? `${invoices.length} فاتورة` : `${invoices.length} Invoices`}
        </span>
      </div>

      {/* Invoices List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {invoices.length === 0 && (
          <div
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px dashed var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '13.5px',
              fontWeight: '700',
            }}
          >
            {isAr ? 'لا توجد عمليات دفع أو فواتير سابقة مسجلة حتى الآن.' : 'No payment invoices recorded yet.'}
          </div>
        )}

        {invoices.map((inv) => {
          const statusMeta = resolveStatusMeta(inv.status, isAr);
          const StatusIcon = statusMeta.Icon;

          return (
            <div
              key={inv.uuid || inv.id}
              style={{
                padding: '16px 20px',
                borderRadius: '18px',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px', flex: 1 }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(21, 136, 199, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getMethodIcon(inv.method || inv.methodAr)}
                </div>

                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '3px' }}>
                    {isAr ? inv.descriptionAr : inv.descriptionEn || inv.descriptionAr}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono), monospace', fontWeight: '700', color: 'var(--primary)' }}>
                      {inv.id}
                    </span>
                    {inv.date && (
                      <>
                        <span>•</span>
                        <span>{inv.date}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{isAr ? inv.methodAr || inv.method : inv.methodEn || inv.method}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                  <div style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
                    {isAr ? inv.amount : inv.amountEn || inv.amount}
                  </div>
                  {Number(inv.discountAmountEgp || 0) > 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700' }}>
                      {isAr
                        ? `شامل خصم ${inv.discountAmountEgp} ج.م`
                        : `Includes ${inv.discountAmountEgp} EGP off`}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    color: statusMeta.color,
                    padding: '5px 10px',
                    borderRadius: '8px',
                    backgroundColor: statusMeta.bg,
                    border: `1px solid ${statusMeta.border}`,
                  }}
                >
                  <StatusIcon size={13} color={statusMeta.color} />
                  <span>{statusMeta.label}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedInvoice(inv)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  <Eye size={13} />
                  <span>{isAr ? 'عرض الإيصال' : 'Receipt'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoice Receipt Modal */}
      {selectedInvoice && (() => {
        const statusMeta = resolveStatusMeta(selectedInvoice.status, isAr);
        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(6, 37, 78, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setSelectedInvoice(null)}
          >
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '24px',
                maxWidth: '460px',
                width: '100%',
                padding: '26px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                direction: isRtl ? 'rtl' : 'ltr',
                fontFamily: isRtl
                  ? 'var(--font-arabic), "Cairo", system-ui, sans-serif'
                  : 'var(--font-heading), "Outfit", sans-serif',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} color="var(--primary)" />
                  <h4 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                    {isAr ? 'إيصال سداد إلكتروني معتمد' : 'Verified Payment Receipt'}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: '16px',
                  padding: '18px',
                  marginBottom: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '13px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'رقم الإيصال:' : 'Receipt ID:'}</span>
                  <span style={{ fontWeight: '800', fontFamily: 'monospace', color: 'var(--primary)' }}>
                    {selectedInvoice.id}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'الخدمة / الباقة:' : 'Description:'}</span>
                  <span style={{ fontWeight: '800', color: 'var(--text-primary)', textAlign: 'end' }}>
                    {isAr ? selectedInvoice.descriptionAr : selectedInvoice.descriptionEn || selectedInvoice.descriptionAr}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'التاريخ:' : 'Date:'}</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{selectedInvoice.date || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'وسيلة السداد:' : 'Method:'}</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                    {isAr ? selectedInvoice.methodAr || selectedInvoice.method : selectedInvoice.methodEn || selectedInvoice.method}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'الحالة:' : 'Status:'}</span>
                  <span style={{ fontWeight: '800', color: statusMeta.color }}>{statusMeta.label}</span>
                </div>
                {selectedInvoice.couponCode && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'كود الخصم:' : 'Coupon:'}</span>
                    <span style={{ fontWeight: '800', fontFamily: 'monospace', color: 'var(--primary)' }}>
                      {selectedInvoice.couponCode}
                    </span>
                  </div>
                )}
                {selectedInvoice.rejectionReason && (
                  <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: '700', paddingTop: '4px' }}>
                    {isAr ? `سبب الرفض: ${selectedInvoice.rejectionReason}` : `Reason: ${selectedInvoice.rejectionReason}`}
                  </div>
                )}
                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                  <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                    {isAr ? 'المبلغ الإجمالي:' : 'Total Paid:'}
                  </span>
                  <span style={{ fontWeight: '900', color: 'var(--primary)' }}>
                    {isAr ? selectedInvoice.amount : selectedInvoice.amountEn || selectedInvoice.amount}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => printInvoiceReceipt(selectedInvoice, isAr)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Printer size={15} />
                  <span>{isAr ? 'طباعة / حفظ الإيصال PDF' : 'Print / Save PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '14px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
