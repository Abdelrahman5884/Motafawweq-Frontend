import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Building2, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import { PlexusBackground } from '../../components/common/PlexusBackground';
import { AuthSidePanel } from '../../features/auth/common';
import { RoleSelectorTabs, LoginForm, QuickDemoAccess } from '../../features/auth/login';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, quickDemoLogin } = useAuth();
  const { lang, t, isRtl } = useLanguage();

  const [selectedRole, setSelectedRole] = useState('student');
  const [emailOrPhone, setEmailOrPhone] = useState(
    selectedRole === 'teacher' ? 'salma.biology@motafawweq.me' : 'omar.tarek@motafawweq.me'
  );
  const [password, setPassword] = useState('motafawweq2026');
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
    { id: 'student', label: lang === 'ar' ? 'طالب' : 'Student', icon: BookOpen },
    { id: 'teacher', label: lang === 'ar' ? 'معلم' : 'Teacher', icon: GraduationCap },
    { id: 'parent', label: lang === 'ar' ? 'ولي أمر' : 'Parent', icon: Users },
    { id: 'center', label: lang === 'ar' ? 'سنتر' : 'Center', icon: Building2 }
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
      <PlexusBackground />

      <div className="auth-split-card">
        {/* Reusable Side Panel with Orbital Logo & Character */}
        <AuthSidePanel activeChar={activeChar} charKey={selectedRole} />

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

          <RoleSelectorTabs
            roleOptions={roleOptions}
            selectedRole={selectedRole}
            onRoleChange={handleRoleTabChange}
          />

          <LoginForm
            emailOrPhone={emailOrPhone}
            setEmailOrPhone={setEmailOrPhone}
            password={password}
            setPassword={setPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            isLoading={isLoading}
            errorMsg={errorMsg}
            onSubmit={handleLoginSubmit}
          />

          <QuickDemoAccess onQuickDemo={handleQuickDemo} />

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            {t('dontHaveAccount')}{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
              {t('signUpBtn')}
            </Link>
          </div>

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
