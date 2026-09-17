import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Lock, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Building2, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  User
} from 'lucide-react';
import { PlexusBackground } from '../../components/common/PlexusBackground';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, quickDemoLogin } = useAuth();
  const { lang, t, isRtl } = useLanguage();
  const { isDark } = useTheme();

  const [selectedRole, setSelectedRole] = useState('student');
  const [emailOrPhone, setEmailOrPhone] = useState(
    selectedRole === 'teacher' ? 'salma.biology@motafawweq.me' : 'omar.tarek@motafawweq.me'
  );
  const [password, setPassword] = useState('motafawweq2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleTabChange = (roleKey) => {
    setSelectedRole(roleKey);
    if (roleKey === 'teacher') setEmailOrPhone('salma.biology@motafawweq.me');
    else if (roleKey === 'student') setEmailOrPhone('omar.tarek@motafawweq.me');
    else if (roleKey === 'parent') setEmailOrPhone('tarek.kady@gmail.com');
    else if (roleKey === 'center') setEmailOrPhone('admin@alrowad.edu.eg');
    else if (roleKey === 'admin') setEmailOrPhone('hq@motafawweq.me');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const targetRoute = login({ email: emailOrPhone, password, role: selectedRole });
      navigate(targetRoute);
    }, 600);
  };

  const handleQuickDemo = (roleKey) => {
    const targetRoute = quickDemoLogin(roleKey);
    navigate(targetRoute);
  };

  const roleOptions = [
    { id: 'student', label: lang === 'ar' ? 'طالب' : 'Student', icon: BookOpen, color: '#06B6D4' },
    { id: 'teacher', label: lang === 'ar' ? 'معلم' : 'Teacher', icon: GraduationCap, color: '#6C4DFF' },
    { id: 'parent', label: lang === 'ar' ? 'ولي أمر' : 'Parent', icon: Users, color: '#10B981' },
    { id: 'center', label: lang === 'ar' ? 'سنتر' : 'Center', icon: Building2, color: '#F59E0B' }
  ];

  const roleCharacters = {
    student: {
      img: '/characters/student.png',
      title: lang === 'ar' ? 'طالب متفوّق' : 'Top Student',
      quote: lang === 'ar' ? 'جاهز تبدأ مذاكرة وتختبر نفسك بالذكاء الاصطناعي؟ انطلق الآن!' : 'Ready to study smart and test yourself with AI? Let\'s go!',
      badge: lang === 'ar' ? 'حساب الطالب' : 'Student'
    },
    teacher: {
      img: '/characters/teacher.png',
      title: lang === 'ar' ? 'معلّم مبدع' : 'Master Educator',
      quote: lang === 'ar' ? 'حوّل شرحك لمذكرات واختبارات تفاعلية في ثوانٍ معدودة.' : 'Turn your lectures into interactive notes & smart exams in seconds.',
      badge: lang === 'ar' ? 'حساب المعلم' : 'Teacher'
    },
    parent: {
      img: '/characters/parent.png',
      title: lang === 'ar' ? 'ولي أمر مهتم' : 'Caring Parent',
      quote: lang === 'ar' ? 'تابع مستوى أولادك وتقارير الدرجات والتحصيل أولاً بأول.' : 'Track your children\'s grades and real-time learning progress.',
      badge: lang === 'ar' ? 'حساب ولي الأمر' : 'Parent'
    },
    center: {
      img: '/characters/teacher.png',
      title: lang === 'ar' ? 'إدارة السنتر' : 'Center Manager',
      quote: lang === 'ar' ? 'تحكم كامل في القاعات، الطلاب، الاشتراكات ونظام الحضور الذكي.' : 'Complete control over halls, students, subscriptions & smart attendance.',
      badge: lang === 'ar' ? 'حساب السنتر' : 'Center'
    },
    admin: {
      img: '/characters/teacher.png',
      title: lang === 'ar' ? 'الإدارة العامة' : 'HQ Admin',
      quote: lang === 'ar' ? 'لوحة التحكم الرئيسية لإدارة المنصة والعمليات التعليمية.' : 'HQ master dashboard for platform and academic operations.',
      badge: lang === 'ar' ? 'إدارة المنظومة' : 'Admin'
    }
  };

  const activeChar = roleCharacters[selectedRole] || roleCharacters.student;

  return (
    <div className="auth-page-container">
      {/* Interactive Constellation / Neural Background */}
      <PlexusBackground />

      <div className="auth-split-card">
        {/* Side Panel: Logo + Dynamic Welcome + Emerging Character */}
        <div className="auth-split-side">
          {/* Top Brand Logo with Orbital Animation */}
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
                    alt="متفوّق – Motafawweq"
                    className="auth-orbital-img"
                    style={{ width: '64px', height: '64px' }}
                  />
                </div>
              </Link>
            </div>

            {/* Dynamic Welcome Heading for Role (No emojis, sleek badge & typography) */}
            <div key={selectedRole + '-head'} style={{ animation: 'authSpeechPop 0.4s ease-out', position: 'relative', zIndex: 10 }}>
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
          <div key={selectedRole + '-img'} className="auth-side-character-wrap">
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
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {t('loginTitle')}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {t('loginSubtitle')}
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px',
            backgroundColor: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '22px'
          }}>
            {roleOptions.map((item) => {
              const IconComp = item.icon;
              const isSelected = selectedRole === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleRoleTabChange(item.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: isSelected ? 'var(--bg-surface)' : 'transparent',
                    color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
                    cursor: 'pointer',
                    fontWeight: isSelected ? '700' : '500',
                    fontSize: '11.5px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <IconComp size={16} color={isSelected ? 'var(--primary)' : 'currentColor'} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {errorMsg && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: 'var(--error-light)',
              color: 'var(--error)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {lang === 'ar' ? 'البريد الإلكتروني أو رقم الموبايل' : 'Email or Mobile Number'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: omar@motafawweq.me أو 010...' : 'e.g. name@motafawweq.me'}
                  style={{
                    width: '100%',
                    padding: isRtl ? '11px 40px 11px 14px' : '11px 14px 11px 40px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    fontFamily: 'inherit'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  [isRtl ? 'right' : 'left']: '12px',
                  color: 'var(--text-muted)'
                }}>
                  <Mail size={16} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {t('passwordLabel')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: isRtl ? '11px 40px 11px 40px' : '11px 40px 11px 40px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    fontFamily: 'inherit'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  [isRtl ? 'right' : 'left']: '12px',
                  color: 'var(--text-muted)'
                }}>
                  <Lock size={16} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    [isRtl ? 'left' : 'right']: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  style={{ accentColor: 'var(--primary)' }}
                />
                {t('rememberMe')}
              </label>
              <Link to="/forgot-password" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                {t('forgotPasswordLink')}
              </Link>
            </div>

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
                gap: '8px',
                marginTop: '6px'
              }}
            >
              {isLoading ? (
                <span>{lang === 'ar' ? 'جاري التحقق...' : 'Signing in...'}</span>
              ) : (
                <>
                  <span>{t('signInBtn')}</span>
                  {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </>
              )}
            </button>
          </form>

          {/* Quick Demo 1-Click Pills */}
          <div style={{
            marginTop: '26px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--primary)',
              marginBottom: '10px'
            }}>
              <Sparkles size={13} />
              {t('quickDemoAccess')}
            </div>
            <div className="auth-demo-grid">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                style={{
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: isRtl ? 'right' : 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <BookOpen size={14} color="#06B6D4" />
                <span>{lang === 'ar' ? 'طالب (عمر طارق)' : 'Student Demo'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('teacher')}
                style={{
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: isRtl ? 'right' : 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <GraduationCap size={14} color="#6C4DFF" />
                <span>{lang === 'ar' ? 'معلم (د. سلمى)' : 'Teacher Demo'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('center')}
                style={{
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: isRtl ? 'right' : 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Building2 size={14} color="#F59E0B" />
                <span>{lang === 'ar' ? 'سنتر (أكاديمية الرواد)' : 'Center Demo'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('parent')}
                style={{
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: isRtl ? 'right' : 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Users size={14} color="#10B981" />
                <span>{lang === 'ar' ? 'ولي أمر (م. طارق)' : 'Parent Demo'}</span>
              </button>
            </div>
          </div>

          {/* Switch to Register */}
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            {t('dontHaveAccount')}{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
              {t('signUpBtn')}
            </Link>
          </div>

          {/* Back to Home Link */}
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
