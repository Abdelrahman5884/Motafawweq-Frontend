import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  KeyRound, 
  Mail, 
  Phone, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { requestPasswordReset, verifyOtp, completePasswordReset } = useAuth();
  const { lang, t, isRtl } = useLanguage();
  const { isDark } = useTheme();

  const [step, setStep] = useState(1); // 1: request, 2: verify OTP, 3: set new password, 4: success
  const [emailOrPhone, setEmailOrPhone] = useState('omar.tarek@motafawweq.me');
  const [otpCode, setOtpCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      const code = requestPasswordReset(emailOrPhone);
      setGeneratedCode(code);
      setStep(2);
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      if (verifyOtp(otpCode)) {
        setStep(3);
      } else {
        setErrorMsg(lang === 'ar' ? 'رمز التحقق غير صحيح، يرجى المحاولة مجدداً' : 'Invalid OTP code. Try again.');
      }
    }, 500);
  };

  const handleSetNewPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg(lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      completePasswordReset(newPassword);
      setStep(4);
    }, 600);
  };

  const stepInfo = {
    1: {
      img: '/characters/student.png',
      badge: lang === 'ar' ? 'استعادة الحساب' : 'Account Recovery',
      title: lang === 'ar' ? 'لا تقلق.. سنساعدك!' : 'Don\'t worry, we\'ve got you!',
      quote: lang === 'ar' ? 'أدخل بريدك أو رقم هاتفك وسنرسل لك كود التحقق فوراً.' : 'Enter your registered email or phone to receive your OTP code.'
    },
    2: {
      img: '/characters/teacher.png',
      badge: lang === 'ar' ? 'تأكيد الهوية' : 'Verification',
      title: lang === 'ar' ? 'كود التحقق في الطريق' : 'OTP on the way',
      quote: lang === 'ar' ? 'أدخل رمز الأمان المكون من 6 أرقام لتأكيد ملكية الحساب.' : 'Enter the 6-digit security code to verify your account.'
    },
    3: {
      img: '/characters/parent.png',
      badge: lang === 'ar' ? 'كلمة مرور جديدة' : 'New Password',
      title: lang === 'ar' ? 'اختر كلمة سر قوية' : 'Choose Strong Password',
      quote: lang === 'ar' ? 'احرص على استخدام حروف وأرقام لتأمين حسابك بالكامل.' : 'Ensure strong security with a mix of characters and numbers.'
    },
    4: {
      img: '/characters/student.png',
      badge: lang === 'ar' ? 'تم بنجاح' : 'Success',
      title: lang === 'ar' ? 'أهلاً بعودتك يا بطل!' : 'Welcome Back!',
      quote: lang === 'ar' ? 'تم تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول مباشرة.' : 'Password reset successfully. You can now login.'
    }
  };

  const activeChar = stepInfo[step] || stepInfo[1];

  return (
    <div className="auth-page-container">
      <div className="hero-glow-orb hero-orb-1" />
      <div className="hero-glow-orb hero-orb-2" />

      <div className="auth-split-card">
        {/* Side Panel: Logo + Step Info + 3D Character */}
        <div className="auth-split-side">
          {/* Top Brand Logo with Orbital Animation (No extra text) */}
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div className="auth-side-logo-box">
              <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="auth-orbital-wrapper" style={{ width: '110px', height: '110px' }}>
                  <div className="auth-orbital-ring1" />
                  <div className="auth-orbital-ring2">
                    <div className="auth-orbital-dot" style={{
                      top: '-4px', left: '50%', marginLeft: '-4px',
                      width: '7px', height: '7px',
                      backgroundColor: '#6C4DFF',
                      boxShadow: '0 0 10px 3px rgba(108,77,255,0.85)'
                    }} />
                  </div>
                  <div className="auth-orbital-ring3">
                    <div className="auth-orbital-dot" style={{
                      top: '8%', right: '-4px',
                      width: '5px', height: '5px',
                      backgroundColor: '#06B6D4',
                      boxShadow: '0 0 8px 3px rgba(6,182,212,0.85)',
                      animationDelay: '0.6s'
                    }} />
                    <div className="auth-orbital-dot" style={{
                      bottom: '10%', left: '-3px',
                      width: '5px', height: '5px',
                      backgroundColor: '#A855F7',
                      boxShadow: '0 0 7px 3px rgba(168,85,247,0.85)',
                      animationDelay: '1.2s'
                    }} />
                  </div>
                  <div className="auth-orbital-ring4" />
                  <img
                    src={isDark ? '/logo-dark.png' : '/logo-light.png'}
                    alt="متفوّق"
                    className="auth-orbital-img"
                    style={{ width: '64px', height: '64px' }}
                  />
                </div>
              </Link>
            </div>

            {/* Dynamic Welcome Heading for Step */}
            <div key={step + '-head'} style={{ animation: 'authSpeechPop 0.4s ease-out', position: 'relative', zIndex: 10 }}>
              <div className="auth-role-badge">
                <Sparkles size={12} />
                <span>{activeChar.badge}</span>
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                marginBottom: '6px',
                fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
              }}>
                {activeChar.title}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>
                {activeChar.quote}
              </p>
            </div>
          </div>

          {/* Bottom: Emerging 3D Character */}
          <div key={step + '-img'} className="auth-side-character-wrap">
            <div className="auth-character-glow" />
            <img
              src={activeChar.img}
              alt={activeChar.title}
              className="auth-character-img"
            />
          </div>
        </div>

        {/* Form Panel */}
        <div className="auth-split-form">
          {/* Step 1: Request OTP */}
          {step === 1 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px'
                }}>
                  <KeyRound size={22} />
                </div>
                <h1 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {t('forgotPasswordTitle')}
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {t('forgotPasswordSubtitle')}
                </p>
              </div>

              <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'البريد أو رقم الهاتف المسجل' : 'Registered Email or Phone'}
                  </label>
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="omar@motafawweq.me"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13.5px'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isLoading ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (lang === 'ar' ? 'إرسال رمز التحقق OTP' : 'Send Verification OTP')}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Enter OTP */}
          {step === 2 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px'
                }}>
                  <ShieldCheck size={22} />
                </div>
                <h2 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'أدخل رمز التحقق (OTP)' : 'Enter Verification Code'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? `تم إرسال الرمز إلى ${emailOrPhone}` : `Code sent to ${emailOrPhone}`}
                </p>
              </div>

              {/* Demo Helper Banner */}
              <div style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(108,77,255,0.1)',
                border: '1px solid rgba(108,77,255,0.25)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? `رمز التحقق التجريبي هو: ` : `Demo OTP is: `}
                  <strong style={{ color: 'var(--primary)', letterSpacing: '2px', fontSize: '14px' }}>{generatedCode || '4829'}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setOtpCode(generatedCode || '4829')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'تعبئة تلقائية' : 'Auto Fill'}
                </button>
              </div>

              {errorMsg && (
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: 'var(--error-light)',
                  color: 'var(--error)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '12.5px',
                  marginBottom: '14px'
                }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="4829"
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '24px',
                      fontWeight: '800',
                      letterSpacing: '12px',
                      textAlign: 'center'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '700'
                  }}
                >
                  {isLoading ? (lang === 'ar' ? 'جاري التحقق...' : 'Verifying...') : (lang === 'ar' ? 'تأكيد الرمز والمتابعة' : 'Verify & Continue')}
                </button>
              </form>
            </div>
          )}

          {/* Step 3: Set New Password */}
          {step === 3 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                <h2 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'تعيين كلمة المرور الجديدة' : 'Set New Password'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'اختر كلمة مرور قوية لتأمين حسابك في متفوّق' : 'Choose a strong password for your account'}
                </p>
              </div>

              {errorMsg && (
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: 'var(--error-light)',
                  color: 'var(--error)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '12.5px',
                  marginBottom: '14px'
                }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSetNewPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {t('confirmPasswordLabel')}
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    marginTop: '6px'
                  }}
                >
                  {isLoading ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ كلمة المرور الجديدة' : 'Save New Password')}
                </button>
              </form>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
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
          )}

          {step !== 4 && (
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
              <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600' }}>
                {lang === 'ar' ? 'تذكرت كلمة المرور؟ تسجيل الدخول' : 'Remembered password? Sign in'}
              </Link>
            </div>
          )}

          {/* Back to Home */}
          <div style={{ textAlign: 'center', marginTop: '14px' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {isRtl ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
              {lang === 'ar' ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
