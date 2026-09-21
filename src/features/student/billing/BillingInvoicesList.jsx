import React, { useState } from 'react';
import { Receipt, Smartphone, Store, Zap, CreditCard, CheckCircle2, Download, Eye, X, ShieldCheck } from 'lucide-react';

export const BillingInvoicesList = ({ invoices, lang = 'ar', isRtl = true }) => {
  const isAr = lang === 'ar';
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const getMethodIcon = (methodStr = '') => {
    if (methodStr.includes('فودافون') || methodStr.includes('Vodafone') || methodStr.includes('محفظة')) {
      return <Smartphone size={14} color="#E11D48" />;
    }
    if (methodStr.includes('فوري') || methodStr.includes('Fawry')) {
      return <Store size={14} color="#F59E0B" />;
    }
    if (methodStr.includes('إنستاباي') || methodStr.includes('InstaPay')) {
      return <Zap size={14} color="#0284C7" />;
    }
    return <CreditCard size={14} color="var(--primary)" />;
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '24px',
        padding: '26px 28px',
        boxShadow: 'var(--shadow-sm)',
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily: isRtl ? 'var(--font-arabic), "Cairo", system-ui, sans-serif' : 'var(--font-heading), "Outfit", sans-serif'
      }}
    >
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
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
              justifyContent: 'center'
            }}
          >
            <Receipt size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'سجل العمليات والفواتير السابقة' : 'Payment History & Receipts'}
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {isAr ? 'فواتير وإيصالات الدفع الإلكتروني المعتمدة لكافة الباقات والكورسات' : 'Verified digital receipts for all subscribed packages and courses'}
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
            border: '1px solid rgba(21, 136, 199, 0.2)'
          }}
        >
          {isAr ? `${invoices.length} فواتير مسجلة` : `${invoices.length} Invoices`}
        </span>
      </div>

      {/* Invoices List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {invoices.map((inv) => (
          <div
            key={inv.id}
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
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(21, 136, 199, 0.3)';
              e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.backgroundColor = 'var(--bg-app)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(21, 136, 199, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {getMethodIcon(inv.method)}
              </div>

              <div>
                <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '3px' }}>
                  {isAr ? inv.descriptionAr : (inv.descriptionEn || inv.descriptionAr)}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono), monospace', fontWeight: '700', color: 'var(--primary)' }}>
                    {inv.id}
                  </span>
                  <span>•</span>
                  <span>{inv.date}</span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {isAr ? 'طريقة الدفع:' : 'Payment Method:'} {isAr ? (inv.methodAr || inv.method) : (inv.methodEn || inv.method)}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
                  {isAr ? inv.amount : (inv.amountEn || inv.amount)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {isAr ? 'شامل الرسوم الإلكترونية' : 'Total Paid (VAT incl.)'}
                </div>
              </div>

              {/* Status Pill (Platform blue/neutral - ZERO green) */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11.5px',
                  fontWeight: '800',
                  color: 'var(--primary)',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(21, 136, 199, 0.08)',
                  border: '1px solid rgba(21, 136, 199, 0.2)'
                }}
              >
                <CheckCircle2 size={13} color="var(--primary)" />
                <span>{isAr ? 'مكتمل بنجاح' : 'Paid & Verified'}</span>
              </div>

              {/* Receipt Preview Action */}
              <button
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
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <Eye size={13} />
                <span>{isAr ? 'عرض الإيصال' : 'View Receipt'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Sleek Invoice Slip Modal ── */}
      {selectedInvoice && (
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
            padding: '20px'
          }}
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '24px',
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-subtle)',
              position: 'relative',
              direction: isRtl ? 'rtl' : 'ltr',
              fontFamily: isRtl ? 'var(--font-arabic), "Cairo", system-ui, sans-serif' : 'var(--font-heading), "Outfit", sans-serif'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="var(--primary)" />
                <h4 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  {isAr ? 'إيصال سداد إلكتروني معتمد' : 'Verified Payment Receipt'}
                </h4>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Receipt Content */}
            <div style={{ backgroundColor: 'var(--bg-app)', borderRadius: '16px', padding: '18px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'رقم الإيصال:' : 'Receipt ID:'}</span>
                <span style={{ fontWeight: '800', fontFamily: 'monospace', color: 'var(--primary)' }}>{selectedInvoice.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'الخدمة / الباقة:' : 'Description:'}</span>
                <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                  {isAr ? selectedInvoice.descriptionAr : (selectedInvoice.descriptionEn || selectedInvoice.descriptionAr)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'تاريخ المعاملة:' : 'Date:'}</span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{selectedInvoice.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'وسيلة السداد:' : 'Payment Gateway:'}</span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                  {isAr ? (selectedInvoice.methodAr || selectedInvoice.method) : (selectedInvoice.methodEn || selectedInvoice.method)}
                </span>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{isAr ? 'المبلغ الإجمالي المدفوع:' : 'Total Amount Paid:'}</span>
                <span style={{ fontWeight: '900', color: 'var(--primary)' }}>
                  {isAr ? selectedInvoice.amount : (selectedInvoice.amountEn || selectedInvoice.amount)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  alert(isAr ? 'تم بدء تحميل ملف الإيصال PDF بنجاح' : 'Receipt PDF download started');
                  setSelectedInvoice(null);
                }}
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
                  gap: '6px'
                }}
              >
                <Download size={14} />
                <span>{isAr ? 'تحميل الإيصال PDF' : 'Download PDF'}</span>
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                style={{
                  padding: '12px 18px',
                  borderRadius: '14px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

