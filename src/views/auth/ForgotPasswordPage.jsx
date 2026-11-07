import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { PlexusBackground } from '../../components/common/PlexusBackground';
import { AuthSidePanel } from '../../features/auth/common';
import {
  ForgotPasswordStep1Request,
  ForgotPasswordStep2Otp,
  ForgotPasswordStep3NewPassword,
  ForgotPasswordStep4Success
} from '../../features/auth/forgot-password';

export const ForgotPasswordPage = () => {
  const { currentUser, requestPasswordReset, verifyOtp, completePasswordReset } = useAuth();
  const { lang, isRtl } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [step, setStep] = useState(1); // 1: request, 2: verify OTP, 3: set new password, 4: success
  const [emailOrPhone, setEmailOrPhone] = useState(() => {
    const saved = currentUser?.email;
    return saved && !saved.endsWith('@motafawweq.me') ? saved : '';
  });
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle clicking the Copy Icon in the email (?email=...&code=...) and sync across open tabs
  useEffect(() => {
    const urlEmail = searchParams.get('email');
    const urlCode = String(searchParams.get('code') || '').replace(/\D/g, '').slice(0, 6);

    if (urlCode.length === 6) {
      if (urlEmail) setEmailOrPhone(urlEmail);
      setOtpCode(urlCode);
      setStep(2);
      setInfoMsg(
        lang === 'ar'
          ? 'تم نسخ وملء رمز التحقق تلقائياً من البريد الإلكتروني.'
          : 'Verification code copied and filled automatically from your email.'
      );

      // Copy to clipboard if permitted by browser
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(urlCode).catch(() => {});
      }

      // Broadcast to any already-open /forgot-password tab so it fills there immediately too
      try {
        localStorage.setItem(
          'motafawweq_otp_sync',
          JSON.stringify({ email: urlEmail || '', code: urlCode, ts: Date.now() })
        );
        if (typeof BroadcastChannel !== 'undefined') {
          const ch = new BroadcastChannel('motafawweq_otp');
          ch.postMessage({ email: urlEmail || '', code: urlCode });
          ch.close();
        }
      } catch {
        // ignore storage errors
      }

      // Remove code from address bar for security
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, lang]);

  // Listen for OTP copied from email in another tab
  useEffect(() => {
    const applySyncedOtp = (payload) => {
      if (!payload?.code || String(payload.code).length !== 6) return;
      if (payload.email) setEmailOrPhone(payload.email);
      setOtpCode(String(payload.code));
      setStep(2);
      setInfoMsg(
        lang === 'ar'
          ? 'تم نسخ وملء رمز التحقق تلقائياً من البريد الإلكتروني.'
          : 'Verification code copied and filled automatically from your email.'
      );
    };

    const onStorage = (e) => {
      if (e.key === 'motafawweq_otp_sync' && e.newValue) {
        try {
          applySyncedOtp(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', onStorage);
    let ch = null;
    if (typeof BroadcastChannel !== 'undefined') {
      ch = new BroadcastChannel('motafawweq_otp');
      ch.onmessage = (ev) => applySyncedOtp(ev.data);
    }

    return () => {
      window.removeEventListener('storage', onStorage);
      if (ch) ch.close();
    };
  }, [lang]);

  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      await requestPasswordReset(emailOrPhone);
      setInfoMsg(
        lang === 'ar'
          ? 'تم إرسال رمز التحقق المكون من 6 أرقام إلى بريدك الإلكتروني (صالح لمدة 10 دقائق).'
          : 'A 6-digit verification code has been sent to your email (valid for 10 minutes).'
      );
      setStep(2);
    } catch (err) {
      const fieldErrors = err?.getFieldErrors ? err.getFieldErrors() : {};
      setErrorMsg(
        fieldErrors.email ||
          err?.message ||
          (lang === 'ar' ? 'تعذر إرسال رمز التحقق، يرجى التأكد من البريد الإلكتروني.' : 'Could not send verification code.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!/^\d{6}$/.test(String(otpCode).trim())) {
      setErrorMsg(
        lang === 'ar'
          ? 'رمز التحقق يجب أن يتكون من 6 أرقام.'
          : 'OTP code must be 6 digits.'
      );
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp(otpCode, emailOrPhone);
      setStep(3);
    } catch (err) {
      const fieldErrors = err?.getFieldErrors ? err.getFieldErrors() : {};
      setErrorMsg(
        fieldErrors.code ||
          err?.message ||
          (lang === 'ar' ? 'رمز التحقق غير صحيح أو منتهي الصلاحية.' : 'Invalid or expired verification code.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg(lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    try {
      await completePasswordReset({
        email: emailOrPhone,
        code: otpCode,
        newPassword,
        confirmPassword
      });
      setStep(4);
    } catch (err) {
      const fieldErrors = err?.getFieldErrors ? err.getFieldErrors() : {};
      // If the OTP code itself was rejected by backend, return user to Step 2
      if (fieldErrors.code) {
        setStep(2);
        setErrorMsg(fieldErrors.code);
      } else {
        setErrorMsg(
          err?.message ||
            (lang === 'ar' ? 'فشل إعادة تعيين كلمة المرور.' : 'Failed to reset password.')
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stepInfo = {
    1: {
      img: '/characters/student.png',
      badge: lang === 'ar' ? 'استعادة الحساب' : 'Account Recovery',
      title: lang === 'ar' ? 'لا تقلق.. سنساعدك!' : 'Don\'t worry, we\'ve got you!',
      quote: lang === 'ar' ? 'أدخل بريدك المسجل وسنرسل لك كود التحقق فوراً.' : 'Enter your registered email to receive your OTP code.'
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
      quote: lang === 'ar' ? 'احرص على استخدام 10 أحرف تشمل حروفاً كبيرة وصغيرة وأرقاماً ورمزاً خاصاً.' : 'Ensure strong security with 10+ chars, upper/lower case, numbers & symbols.'
    },
    4: {
      img: '/characters/student.png',
      badge: lang === 'ar' ? 'تم بنجاح' : 'Success',
      title: lang === 'ar' ? 'أهلاً بعودتك يا بطل!' : 'Welcome Back!',
      quote: lang === 'ar' ? 'تم تعيين كلمة المرور بنجاح وإبطال الجلسات القديمة. يمكنك الآن تسجيل الدخول مباشرة.' : 'Password reset successfully. You can now login.'
    }
  };

  const activeChar = stepInfo[step] || stepInfo[1];

  return (
    <div className="auth-page-container">
      <PlexusBackground />

      <div className="auth-split-card">
        {/* Reusable Side Panel */}
        <AuthSidePanel activeChar={activeChar} charKey={`step-${step}`} />

        {/* Form Panel */}
        <div className="auth-split-form">
          {step === 1 && (
            <ForgotPasswordStep1Request
              emailOrPhone={emailOrPhone}
              setEmailOrPhone={setEmailOrPhone}
              errorMsg={errorMsg}
              isLoading={isLoading}
              onSubmit={handleRequestOtp}
            />
          )}

          {step === 2 && (
            <ForgotPasswordStep2Otp
              emailOrPhone={emailOrPhone}
              otpCode={otpCode}
              setOtpCode={setOtpCode}
              errorMsg={errorMsg}
              infoMsg={infoMsg}
              isLoading={isLoading}
              onResend={() => handleRequestOtp()}
              onChangeEmail={() => {
                setErrorMsg('');
                setInfoMsg('');
                setOtpCode('');
                setStep(1);
              }}
              onSubmit={handleVerifyOtp}
            />
          )}

          {step === 3 && (
            <ForgotPasswordStep3NewPassword
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              errorMsg={errorMsg}
              isLoading={isLoading}
              onSubmit={handleSetNewPassword}
            />
          )}

          {step === 4 && <ForgotPasswordStep4Success />}

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
