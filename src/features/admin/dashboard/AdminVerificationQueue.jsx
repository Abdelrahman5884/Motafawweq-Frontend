import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { CheckCircle2, XCircle } from 'lucide-react';

export const AdminVerificationQueue = ({ queue, onApprove, onReject }) => {
  const { lang } = useLanguage();

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      padding: '28px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'طلبات اعتماد وتوثيق المعلمين' : 'Tutor Accreditation & KYC Queue'}
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {queue.filter(q => q.status === 'Pending Review').length} {lang === 'ar' ? 'قيد المراجعة' : 'pending'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {queue.map(req => (
          <div
            key={req.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {req.name}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: req.status === 'Approved' ? 'rgba(21, 136, 199, 0.12)' : (req.status === 'Rejected' ? 'rgba(6, 37, 78, 0.08)' : 'rgba(92, 182, 219, 0.15)'),
                  color: req.status === 'Approved' ? 'var(--primary)' : (req.status === 'Rejected' ? 'var(--text-secondary)' : 'var(--primary-light, #5CB6DB)')
                }}>
                  {lang === 'ar'
                    ? (req.status === 'Approved' ? 'معتمد' : req.status === 'Rejected' ? 'مرفوض' : 'قيد المراجعة')
                    : req.status}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', marginTop: '2px' }}>
                {req.subject} • {req.certificate}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {lang === 'ar' ? 'الرقم القومي: ' : 'National ID: '}{req.nationalId}
              </div>
            </div>

            {req.status === 'Pending Review' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => onApprove(req.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>{lang === 'ar' ? 'اعتماد المعلم' : 'Approve'}</span>
                </button>

                <button
                  onClick={() => onReject(req.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <XCircle size={13} />
                  <span>{lang === 'ar' ? 'رفض' : 'Reject'}</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
