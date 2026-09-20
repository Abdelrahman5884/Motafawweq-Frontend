import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const { requestPasswordReset, verifyOtp, completePasswordReset } = useAuth();
  const { lang, isRtl } = useLanguage();

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
              isLoading={isLoading}
              onSubmit={handleRequestOtp}
            />
          )}

          {step === 2 && (
            <ForgotPasswordStep2Otp
              emailOrPhone={emailOrPhone}
              otpCode={otpCode}
              setOtpCode={setOtpCode}
              generatedCode={generatedCode}
              errorMsg={errorMsg}
              isLoading={isLoading}
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
