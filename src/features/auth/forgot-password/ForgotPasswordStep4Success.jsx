import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export const ForgotPasswordStep4Success = () => {
  const { lang, isRtl } = useLanguage();

  return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: 'var(--success-light)',
        color: 'var(--success)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px'
      }}>
        <CheckCircle2 size={32} />
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
        {lang === 'ar' ? 'تم تحديث كلمة المرور بنجاح!' : 'Password Reset Successfully!'}
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        {lang === 'ar' ? 'يمكنك الآن تسجيل الدخول مباشرة ببياناتك الجديدة.' : 'You can now sign in with your updated credentials.'}
      </p>
      <Link
        to="/login"
        className="btn btn-primary"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 28px',
          fontWeight: '700',
          textDecoration: 'none'
        }}
      >
        <span>{lang === 'ar' ? 'الانتقال لتسجيل الدخول' : 'Proceed to Sign In'}</span>
        {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
      </Link>
    </div>
  );
};
