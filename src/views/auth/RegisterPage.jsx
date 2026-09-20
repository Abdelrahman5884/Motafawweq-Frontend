import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Building2, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import { PlexusBackground } from '../../components/common/PlexusBackground';
import { AuthSidePanel } from '../../features/auth/common';
import { RegisterRoleCards, RegisterForm } from '../../features/auth/register';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { lang, t, isRtl } = useLanguage();

  const [role, setRole] = useState('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState('grade-sec3');
  const [subject, setSubject] = useState('Biology');
  const [centerName, setCenterName] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!agreedTerms) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      const targetRoute = register({
        role,
        fullName,
        email,
        phone,
        grade,
        subject,
        centerName,
        studentCode
      });

      navigate(targetRoute);
    }, 700);
  };

  const roleCards = [
    {
      id: 'student',
      title: lang === 'ar' ? 'أنا طالب' : 'I am a Student',
      subtitle: lang === 'ar' ? 'مذاكرة ذكية لجميع المراحل: ابتدائي → إعدادي → ثانوي' : 'Smart Learning for All Grades: Primary → Prep → Secondary',
      icon: BookOpen,
      color: '#06B6D4'
    },
    {
      id: 'teacher',
      title: lang === 'ar' ? 'أنا معلم' : 'I am a Teacher',
      subtitle: lang === 'ar' ? 'تسجيل الحصص، إنتاج الخرائط، وإدارة القاعات والطلاب' : 'Studio Recording, Cornell Summaries & Roster',
      icon: GraduationCap,
      color: 'var(--primary)'
    },
    {
      id: 'parent',
      title: lang === 'ar' ? 'أنا ولي أمر' : 'I am a Parent',
      subtitle: lang === 'ar' ? 'متابعة حضور ودرجات ومستوى الأبناء أسبوعياً' : 'Track Children Attendance & Weekly Progress',
      icon: Users,
      color: 'var(--success, #16A34A)'
    },
    {
      id: 'center',
      title: lang === 'ar' ? 'إدارة سنتر تعليمي' : 'Learning Center Academy',
      subtitle: lang === 'ar' ? 'جدولة الحصص، تقارير المعلمين، وحسابات القاعات' : 'Multi-teacher Oversight, Halls & Branding',
      icon: Building2,
      color: 'var(--warning, #F59E0B)'
    }
  ];

  const roleCharacters = {
    student: {
      img: '/characters/student.png',
      title: lang === 'ar' ? 'انضم كطالب متفوّق' : 'Join as a Student',
      quote: lang === 'ar' ? 'سجل الآن واستمتع بمذاكرة ذكية، بنوك أسئلة واختبارات تفاعلية مستمرة.' : 'Sign up and enjoy AI-powered study guides, interactive questions & instant grading.',
      badge: lang === 'ar' ? 'حساب طالب جديد' : 'New Student'
    },
    teacher: {
      img: '/characters/teacher.png',
      title: lang === 'ar' ? 'انضم كمعلّم مبدع' : 'Join as an Educator',
      quote: lang === 'ar' ? 'ابدأ رحلة التدريس الذكي، تحويل الحصص لملازم وإدارة مجموعاتك بسهولة.' : 'Start smart teaching, generate handouts from your lectures and manage groups effortlessly.',
      badge: lang === 'ar' ? 'حساب معلّم جديد' : 'New Educator'
    },
    parent: {
      img: '/characters/parent.png',
      title: lang === 'ar' ? 'انضم كولي أمر' : 'Join as a Parent',
      quote: lang === 'ar' ? 'تابع مسيرة أولادك التعليمية وابقَ على اطلاع دائم بدرجاتهم ومستواهم.' : 'Stay connected to your children\'s academic performance with real-time insight.',
      badge: lang === 'ar' ? 'حساب ولي أمر' : 'New Parent'
    },
    center: {
      img: '/characters/teacher.png',
      title: lang === 'ar' ? 'تسجيل سنتر تعليمي' : 'Register a Center',
      quote: lang === 'ar' ? 'نظام متكامل لإدارة الحجوزات، القاعات، المدرسين، والباركود الذكي.' : 'A unified platform for managing halls, teachers, attendance & smart barcodes.',
      badge: lang === 'ar' ? 'حساب سنتر' : 'New Center'
    }
  };

  const activeChar = roleCharacters[role] || roleCharacters.student;

  return (
    <div className="auth-page-container">
      <PlexusBackground />

      <div className="auth-split-card">
        {/* Reusable Side Panel */}
        <AuthSidePanel activeChar={activeChar} charKey={role} />

        {/* Form Panel */}
        <div className="auth-split-form">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {t('registerTitle')}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {t('registerSubtitle')}
            </p>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {t('selectRolePrompt')}
            </label>
            <RegisterRoleCards
              roleCards={roleCards}
              selectedRole={role}
              onSelectRole={setRole}
            />
          </div>

          <RegisterForm
            role={role}
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            password={password}
            setPassword={setPassword}
            grade={grade}
            setGrade={setGrade}
            subject={subject}
            setSubject={setSubject}
            centerName={centerName}
            setCenterName={setCenterName}
            studentCode={studentCode}
            setStudentCode={setStudentCode}
            agreedTerms={agreedTerms}
            setAgreedTerms={setAgreedTerms}
            isLoading={isLoading}
            onSubmit={handleRegisterSubmit}
          />

          {/* Switch to Login */}
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
              {t('signInBtn')}
            </Link>
          </div>

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
