import React, { createContext, useContext, useState, useEffect } from 'react';

export const ROLES = {
  teacher: {
    id: 'teacher',
    name: 'Dr. Salma El-Sayed',
    nameAr: 'د. سلمى السيد',
    roleLabel: 'Senior Biology Teacher',
    roleLabelAr: 'كبير معلمي الأحياء (الثانوية العامة)',
    email: 'salma.biology@motafawweq.me',
    phone: '01012345678',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    center: 'Dokki Elite Center & Online',
    grade: '3rd Secondary',
    defaultRoute: '/teacher/dashboard'
  },
  student: {
    id: 'student',
    name: 'Omar Tarek El-Kady',
    nameAr: 'عمر طارق القاضي',
    roleLabel: '3rd Secondary Student',
    roleLabelAr: 'طالب 3 ثانوي - شعبة علمي علوم',
    email: 'omar.tarek@motafawweq.me',
    phone: '01123456789',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    center: 'Al-Rowad Center',
    grade: '3rd Secondary (Thanawya Amma)',
    defaultRoute: '/student/dashboard'
  },
  parent: {
    id: 'parent',
    name: 'Eng. Tarek El-Kady',
    nameAr: 'م. طارق القاضي',
    roleLabel: 'Parent of Omar & Sarah',
    roleLabelAr: 'ولي أمر (عمر وسارة)',
    email: 'tarek.kady@gmail.com',
    phone: '01223344556',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    center: 'Cairo',
    defaultRoute: '/parent/dashboard'
  },
  center: {
    id: 'center',
    name: 'Al-Rowad Educational Academy',
    nameAr: 'أكاديمية الرواد التعليمية',
    roleLabel: 'Center Director (Dokki & Nasr City)',
    roleLabelAr: 'إدارة السنتر (فرع الدقي ومدينة نصر)',
    email: 'admin@alrowad.edu.eg',
    phone: '01009876543',
    avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80',
    center: 'Dokki & Nasr City Branches',
    defaultRoute: '/center/dashboard'
  },
  admin: {
    id: 'admin',
    name: 'Motafawweq SuperAdmin',
    nameAr: 'مدير منصة متفوّق',
    roleLabel: 'System & AI Operations',
    roleLabelAr: 'إدارة النظام واقتصاديات الذكاء الاصطناعي',
    email: 'hq@motafawweq.me',
    phone: '01000000000',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    center: 'HQ Cairo',
    defaultRoute: '/admin/dashboard'
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load initial session from localStorage or default to student demo
  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem('motafawweq_role');
    return saved && ROLES[saved] ? saved : 'student';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('motafawweq_authenticated') !== 'false';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('motafawweq_custom_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        // fallback
      }
    }
    const savedRole = localStorage.getItem('motafawweq_role');
    return ROLES[savedRole] || ROLES.student;
  });

  const [selectedLessonId, setSelectedLessonId] = useState('les-bio-301');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  
  // OTP simulation state for forgot password
  const [otpSentCode, setOtpSentCode] = useState(null);
  const [otpTargetEmail, setOtpTargetEmail] = useState('');

  // View to URL Route mapping
  const viewToPath = {
    'landing': '/',
    'features': '/features',
    'pricing': '/pricing',
    'marketplace': '/marketplace',
    'login': '/login',
    'register': '/register',
    'forgot-password': '/forgot-password',
    'dashboard': '/teacher/dashboard',
    'recording-studio': '/teacher/studio',
    'lesson-workspace': '/teacher/workspace',
    'classes': '/teacher/classes',
    'students': '/teacher/students',
    'financials': '/teacher/financials',
    'ai-processing': '/teacher/processing',
    'student-dashboard': '/student/dashboard',
    'courses': '/student/courses',
    'lesson-study': '/student/lesson',
    'quiz': '/student/quiz',
    'homework': '/student/homework',
    'take-exam': '/student/exam',
    'smart-lecture': '/student/smart-lecture',
    'revision': '/student/revision',
    'league': '/student/league',
    'analytics': '/student/league',
    'gamification': '/student/gamification',
    'certificates': '/student/certificates',
    'billing': '/student/billing',
    'weak-areas': '/student/weak-areas',
    'parent-portal': '/parent/dashboard',
    'center-portal': '/center/dashboard',
    'admin-portal': '/admin/dashboard'
  };

  const [routerNavigator, setRouterNavigator] = useState(null);

  const navigate = (target, extra = null) => {
    if (extra?.lessonId) {
      setSelectedLessonId(extra.lessonId);
    }
    const resolvedPath = viewToPath[target] || target;
    if (routerNavigator) {
      routerNavigator(resolvedPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Persist role change
  const switchRole = (newRole) => {
    if (ROLES[newRole]) {
      setCurrentRole(newRole);
      setCurrentUser(ROLES[newRole]);
      setIsAuthenticated(true);
      localStorage.setItem('motafawweq_role', newRole);
      localStorage.setItem('motafawweq_authenticated', 'true');
      localStorage.removeItem('motafawweq_custom_user');
      const targetPath = ROLES[newRole].defaultRoute;
      if (routerNavigator) routerNavigator(targetPath);
      return targetPath;
    }
    return '/';
  };

  // 1-Click Quick Demo Login
  const quickDemoLogin = (roleId) => {
    return switchRole(roleId);
  };

  // Standard Login
  const login = ({ email, password, role = 'student' }) => {
    const matchedRole = ROLES[role] ? role : 'student';
    const baseUser = ROLES[matchedRole];
    const loggedUser = {
      ...baseUser,
      email: email || baseUser.email,
      name: email ? email.split('@')[0] : baseUser.name
    };
    setCurrentRole(matchedRole);
    setCurrentUser(loggedUser);
    setIsAuthenticated(true);
    localStorage.setItem('motafawweq_role', matchedRole);
    localStorage.setItem('motafawweq_authenticated', 'true');
    localStorage.setItem('motafawweq_custom_user', JSON.stringify(loggedUser));
    return baseUser.defaultRoute;
  };

  // Register New Account
  const register = (userData) => {
    const role = userData.role || 'student';
    const baseUser = ROLES[role] || ROLES.student;
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.fullName || 'New User',
      nameAr: userData.fullName || 'مستخدم جديد',
      role: role,
      roleLabel: role === 'teacher' ? (userData.subject || 'Teacher') : (userData.grade || 'Student'),
      roleLabelAr: role === 'teacher' ? (userData.subject || 'معلم متخصص') : (userData.grade || 'طالب ثانوي'),
      email: userData.email,
      phone: userData.phone || '01000000000',
      avatar: baseUser.avatar,
      center: userData.centerName || 'Online Learning',
      grade: userData.grade || '3rd Secondary',
      defaultRoute: baseUser.defaultRoute
    };

    setCurrentRole(role);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('motafawweq_role', role);
    localStorage.setItem('motafawweq_authenticated', 'true');
    localStorage.setItem('motafawweq_custom_user', JSON.stringify(newUser));
    return baseUser.defaultRoute;
  };

  // Logout
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('motafawweq_authenticated', 'false');
  };

  // Forgot password OTP trigger
  const requestPasswordReset = (emailOrPhone) => {
    const demoCode = '4829';
    setOtpSentCode(demoCode);
    setOtpTargetEmail(emailOrPhone);
    return demoCode;
  };

  const verifyOtp = (code) => {
    return code === otpSentCode || code === '4829';
  };

  const completePasswordReset = (newPassword) => {
    setOtpSentCode(null);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentRole,
        currentUser,
        selectedLessonId,
        setSelectedLessonId,
        searchModalOpen,
        setSearchModalOpen,
        switchRole,
        quickDemoLogin,
        login,
        register,
        logout,
        requestPasswordReset,
        verifyOtp,
        completePasswordReset,
        otpSentCode,
        otpTargetEmail,
        navigate,
        setRouterNavigator,
        allRoles: ROLES
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
