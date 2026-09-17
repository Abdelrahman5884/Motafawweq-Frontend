import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Building2, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';
import { PlexusBackground } from '../../components/common/PlexusBackground';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { lang, t, isRtl } = useLanguage();
  const { isDark } = useTheme();

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
      // Fire confetti celebration
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
      color: '#6C4DFF'
    },
    {
      id: 'parent',
      title: lang === 'ar' ? 'أنا ولي أمر' : 'I am a Parent',
      subtitle: lang === 'ar' ? 'متابعة حضور ودرجات ومستوى الأبناء أسبوعياً' : 'Track Children Attendance & Weekly Progress',
      icon: Users,
      color: '#10B981'
    },
    {
      id: 'center',
      title: lang === 'ar' ? 'إدارة سنتر تعليمي' : 'Learning Center Academy',
      subtitle: lang === 'ar' ? 'جدولة الحصص، تقارير المعلمين، وحسابات القاعات' : 'Multi-teacher Oversight, Halls & Branding',
      icon: Building2,
      color: '#F59E0B'
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
                    alt="متفوّق"
                    className="auth-orbital-img"
                    style={{ width: '64px', height: '64px' }}
                  />
                </div>
              </Link>
            </div>

            {/* Dynamic Welcome Heading for Role (No emojis, sleek badge & typography) */}
            <div key={role + '-head'} style={{ animation: 'authSpeechPop 0.4s ease-out', position: 'relative', zIndex: 10 }}>
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
          <div key={role + '-img'} className="auth-side-character-wrap">
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
              {t('registerTitle')}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {t('registerSubtitle')}
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Step 1: Role Picker */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {t('selectRolePrompt')}
              </label>
              <div className="auth-roles-grid">
                {roleCards.map((rc) => {
                  const IconC = rc.icon;
                  const isSelected = role === rc.id;
                  return (
                    <div
                      key={rc.id}
                      onClick={() => setRole(rc.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? `2px solid ${rc.color}` : '1px solid var(--border-subtle)',
                        backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '12.5px', color: isSelected ? rc.color : 'var(--text-primary)' }}>
                          <IconC size={16} color={rc.color} />
                          {rc.title}
                        </div>
                        {isSelected && <CheckCircle2 size={15} color={rc.color} />}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                        {rc.subtitle}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: User Common Fields */}
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
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                  <User size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRtl ? 'right' : 'left']: '12px', color: 'var(--text-muted)' }} />
                </div>
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
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                  <Mail size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRtl ? 'right' : 'left']: '12px', color: 'var(--text-muted)' }} />
                </div>
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
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                  <Phone size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRtl ? 'right' : 'left']: '12px', color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>

            {/* Step 3: Role-Specific Custom Field */}
            {role === 'student' && (
              <div className="auth-grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {t('gradeLabel')}
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  >
                    {/* روضة */}
                    <optgroup label={lang === 'ar' ? 'روضة الأطفال' : 'Kindergarten'}>
                      <option value="kg1">{lang === 'ar' ? 'كجي 1 (روضة أولى)' : 'KG1 (Nursery)'}</option>
                      <option value="kg2">{lang === 'ar' ? 'كجي 2 (روضة ثانية)' : 'KG2 (Reception)'}</option>
                    </optgroup>
                    {/* ابتدائي */}
                    <optgroup label={lang === 'ar' ? 'المرحلة الابتدائية' : 'Primary Stage'}>
                      <option value="primary1">{lang === 'ar' ? 'الصف الأول الابتدائي' : 'Primary 1st Grade'}</option>
                      <option value="primary2">{lang === 'ar' ? 'الصف الثاني الابتدائي' : 'Primary 2nd Grade'}</option>
                      <option value="primary3">{lang === 'ar' ? 'الصف الثالث الابتدائي' : 'Primary 3rd Grade'}</option>
                      <option value="primary4">{lang === 'ar' ? 'الصف الرابع الابتدائي' : 'Primary 4th Grade'}</option>
                      <option value="primary5">{lang === 'ar' ? 'الصف الخامس الابتدائي' : 'Primary 5th Grade'}</option>
                      <option value="primary6">{lang === 'ar' ? 'الصف السادس الابتدائي' : 'Primary 6th Grade'}</option>
                    </optgroup>
                    {/* إعدادي */}
                    <optgroup label={lang === 'ar' ? 'المرحلة الإعدادية' : 'Preparatory Stage'}>
                      <option value="prep1">{lang === 'ar' ? 'الصف الأول الإعدادي' : 'Prep 1st Grade'}</option>
                      <option value="prep2">{lang === 'ar' ? 'الصف الثاني الإعدادي' : 'Prep 2nd Grade'}</option>
                      <option value="prep3">{lang === 'ar' ? 'الصف الثالث الإعدادي' : 'Prep 3rd Grade'}</option>
                    </optgroup>
                    {/* ثانوي */}
                    <optgroup label={lang === 'ar' ? 'المرحلة الثانوية' : 'Secondary Stage'}>
                      <option value="grade-sec1">{lang === 'ar' ? 'الصف الأول الثانوي' : '1st Secondary'}</option>
                      <option value="grade-sec2">{lang === 'ar' ? 'الصف الثاني الثانوي' : '2nd Secondary'}</option>
                      <option value="grade-sec3">{lang === 'ar' ? 'الصف الثالث الثانوي (ثانوية عامة)' : '3rd Secondary (Thanawya Amma)'}</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {t('centerCodeLabel')}
                  </label>
                  <input
                    type="text"
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: ROWAD-301' : 'e.g. ROWAD-301'}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>
            )}

            {role === 'teacher' && (
              <div className="auth-grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {t('subjectLabel')}
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  >
                    <option value="Biology">{lang === 'ar' ? 'الأحياء (Biology)' : 'Biology'}</option>
                    <option value="Physics">{lang === 'ar' ? 'الفيزياء (Physics)' : 'Physics'}</option>
                    <option value="Chemistry">{lang === 'ar' ? 'الكيمياء (Chemistry)' : 'Chemistry'}</option>
                    <option value="Mathematics">{lang === 'ar' ? 'الرياضيات (Math)' : 'Mathematics'}</option>
                    <option value="Arabic">{lang === 'ar' ? 'اللغة العربية' : 'Arabic Language'}</option>
                    <option value="English">{lang === 'ar' ? 'اللغة الإنجليزية' : 'English'}</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {lang === 'ar' ? 'السنتر الرئيسي أو أونلاين' : 'Main Center or Online'}
                  </label>
                  <input
                    type="text"
                    value={centerName}
                    onChange={(e) => setCenterName(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: سنتر الرواد بالدقي' : 'e.g. Dokki Center'}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>
            )}

            {role === 'parent' && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  {lang === 'ar' ? 'كود الطالب لربط المتابعة' : 'Student Link Code'}
                </label>
                <input
                  type="text"
                  required
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder={lang === 'ar' ? 'أدخل كود ابنك المسجل بالمنصة (مثال: OMAR-2026)' : 'e.g. OMAR-2026'}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>
            )}

            {role === 'center' && (
              <div className="auth-grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {t('centerNameLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    value={centerName}
                    onChange={(e) => setCenterName(e.target.value)}
                    placeholder={lang === 'ar' ? 'أكاديمية النور التعليمية' : 'Al-Noor Academy'}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
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
                    {t('governorateLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ar' ? 'الجيزة / الدقي' : 'Giza / Dokki'}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                {t('passwordLabel')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: isRtl ? '10px 38px 10px 12px' : '10px 12px 10px 38px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
                <Lock size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRtl ? 'right' : 'left']: '12px', color: 'var(--text-muted)' }} />
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
