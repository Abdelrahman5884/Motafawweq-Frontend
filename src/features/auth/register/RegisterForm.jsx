import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { RegisterRoleFields } from './RegisterRoleFields';

export const RegisterForm = ({
  role,
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  passwordConfirmation,
  setPasswordConfirmation,
  grade,
  setGrade,
  track,
  setTrack,
  governorate,
  setGovernorate,
  parentPhone,
  setParentPhone,
  subject,
  setSubject,
  centerName,
  setCenterName,
  studentCode,
  setStudentCode,
  agreedTerms,
  setAgreedTerms,
  isLoading,
  errorMsg,
  fieldErrors = {},
  onSubmit
}) => {
  const { lang, t, isRtl } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {errorMsg && (
        <div style={{
          padding: '10px 14px',
          backgroundColor: 'var(--error-light, rgba(220, 38, 38, 0.1))',
          color: 'var(--error, #dc2626)',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Common Fields */}
      <div className="auth-grid-2">
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: أحمد محمد مصطفى' : 'e.g. Ahmed Mostafa'}
              style={{
                width: '100%',
                padding: isRtl ? '10px 38px 10px 12px' : '10px 12px 10px 38px',
                borderRadius: 'var(--radius-md)',
                border: fieldErrors.name ? '1px solid var(--error, #dc2626)' : '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px'
              }}
            />
            <User size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRtl ? 'right' : 'left']: '12px', color: 'var(--text-muted)' }} />
          </div>
          {fieldErrors.name && (
            <span style={{ fontSize: '11.5px', color: 'var(--error, #dc2626)', marginTop: '4px', display: 'block' }}>{fieldErrors.name}</span>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {t('emailLabel')}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{
                width: '100%',
                padding: isRtl ? '10px 38px 10px 12px' : '10px 12px 10px 38px',
                borderRadius: 'var(--radius-md)',
                border: fieldErrors.email ? '1px solid var(--error, #dc2626)' : '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px'
              }}
            />
            <Mail size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRtl ? 'right' : 'left']: '12px', color: 'var(--text-muted)' }} />
          </div>
          {fieldErrors.email && (
            <span style={{ fontSize: '11.5px', color: 'var(--error, #dc2626)', marginTop: '4px', display: 'block' }}>{fieldErrors.email}</span>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {t('phoneLabel')}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01012345678"
              style={{
                width: '100%',
                padding: isRtl ? '10px 38px 10px 12px' : '10px 12px 10px 38px',
                borderRadius: 'var(--radius-md)',
                border: fieldErrors.phone ? '1px solid var(--error, #dc2626)' : '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px'
              }}
            />
            <Phone size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRtl ? 'right' : 'left']: '12px', color: 'var(--text-muted)' }} />
          </div>
          {fieldErrors.phone && (
            <span style={{ fontSize: '11.5px', color: 'var(--error, #dc2626)', marginTop: '4px', display: 'block' }}>{fieldErrors.phone}</span>
          )}
        </div>
      </div>

      {/* Role-Specific Custom Field */}
      <RegisterRoleFields
        role={role}
        grade={grade}
        setGrade={setGrade}
        track={track}
        setTrack={setTrack}
        governorate={governorate}
        setGovernorate={setGovernorate}
        parentPhone={parentPhone}
        setParentPhone={setParentPhone}
        studentCode={studentCode}
        setStudentCode={setStudentCode}
        subject={subject}
        setSubject={setSubject}
        centerName={centerName}
        setCenterName={setCenterName}
      />

      {/* Password & Confirmation */}
      <div className="auth-grid-2">
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {t('passwordLabel')}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              style={{
                width: '100%',
                padding: '10px 38px 10px 38px',
                borderRadius: 'var(--radius-md)',
                border: fieldErrors.password ? '1px solid var(--error, #dc2626)' : '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px'
              }}
            />
            <Lock size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRtl ? 'right' : 'left']: '12px', color: 'var(--text-muted)' }} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                [isRtl ? 'left' : 'right']: '10px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="••••••••••"
              style={{
                width: '100%',
                padding: isRtl ? '10px 38px 10px 12px' : '10px 12px 10px 38px',
                borderRadius: 'var(--radius-md)',
                border: fieldErrors.password ? '1px solid var(--error, #dc2626)' : '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px'
              }}
            />
            <Lock size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRtl ? 'right' : 'left']: '12px', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {lang === 'ar'
              ? '10 أحرف على الأقل تشمل حروفاً كبيرة وصغيرة وأرقاماً ورمزاً خاصاً (مثل: Motafawweq@2026)'
              : 'At least 10 chars with uppercase, lowercase, number, and symbol (e.g. Motafawweq@2026)'}
          </span>
          {fieldErrors.password && (
            <span style={{ fontSize: '11.5px', color: 'var(--error, #dc2626)', marginTop: '4px', display: 'block' }}>{fieldErrors.password}</span>
          )}
        </div>
      </div>

      {/* Terms checkbox */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
        <input
          type="checkbox"
          required
          checked={agreedTerms}
          onChange={(e) => setAgreedTerms(e.target.checked)}
          style={{ accentColor: 'var(--primary)' }}
        />
        <span style={{ color: 'var(--text-secondary)' }}>
          {lang === 'ar' ? 'أوافق على شروط الخدمة وسياسة الخصوصية الخاصة بمنصة متفوّق' : 'I agree to Motafawweq Terms of Service and Privacy Policy'}
        </span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary"
        style={{
          width: '100%',
          padding: '13px',
          fontSize: '14px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        {isLoading ? (
          <span>{lang === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating Account...'}</span>
        ) : (
          <>
            <span>{t('signUpBtn')}</span>
            {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </>
        )}
      </button>
    </form>
  );
};
