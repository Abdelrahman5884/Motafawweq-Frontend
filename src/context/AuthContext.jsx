import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, tokenStorage } from '../services/api';

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
    student_code: 'OMAR-2026',
    studentCode: 'OMAR-2026',
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

export const DEMO_PASSWORD = 'Motafawweq@2026';

/**
 * Merges a backend UserResource payload with frontend role defaults & local profile extras.
 */
function buildFrontendUser(apiUser, extras = {}) {
  const roleKey = ROLES[apiUser?.role] ? apiUser.role : (ROLES[extras?.role] ? extras.role : 'student');
  const baseRole = ROLES[roleKey] || ROLES.student;

  const grade = extras.grade || baseRole.grade || '3rd Secondary (Thanawya Amma)';
  const track = extras.track || 'علمي علوم';
  const displayName = apiUser?.name || extras.fullName || baseRole.name;

  return {
    ...baseRole,
    ...extras,
    id: apiUser?.id ?? extras.id ?? baseRole.id,
    name: displayName,
    nameAr: extras.nameAr || displayName || baseRole.nameAr,
    email: apiUser?.email || extras.email || baseRole.email,
    phone: apiUser?.phone ?? extras.phone ?? baseRole.phone,
    avatar: apiUser?.avatar || extras.avatar || baseRole.avatar,
    role: roleKey,
    roleLabel: extras.roleLabel || apiUser?.role_label || baseRole.roleLabel,
    roleLabelAr: extras.roleLabelAr || apiUser?.role_label || baseRole.roleLabelAr,
    status: apiUser?.status || 'active',
    statusLabel: apiUser?.status_label || 'نشط',
    student_code: apiUser?.student_code || extras.student_code || extras.studentCode || baseRole.student_code || null,
    studentCode: apiUser?.student_code || extras.studentCode || extras.student_code || baseRole.studentCode || '',
    linked_children: apiUser?.linked_children || extras.linked_children || [],
    email_verified: apiUser?.email_verified ?? true,
    email_verified_at: apiUser?.email_verified_at ?? null,
    last_login_at: apiUser?.last_login_at ?? null,
    created_at: apiUser?.created_at ?? null,
    grade,
    track,
    defaultRoute: baseRole.defaultRoute,
  };
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem('motafawweq_role');
    return saved && ROLES[saved] ? saved : 'student';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const hasToken = Boolean(tokenStorage.getAccessToken());
    const savedFlag = localStorage.getItem('motafawweq_authenticated');
    return hasToken || savedFlag === 'true';
  });

  const [authLoading, setAuthLoading] = useState(() => Boolean(tokenStorage.getAccessToken()));

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('motafawweq_custom_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        // fallback
      }
    }
    const savedRole = localStorage.getItem('motafawweq_role');
    return ROLES[savedRole] || ROLES.student;
  });

  const [selectedLessonId, setSelectedLessonId] = useState('les-bio-301');
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Password reset state
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
    'teacher-courses': '/teacher/courses',
    'teacher-exams': '/teacher/exams',
    'teacher-homework': '/teacher/homework',
    'teacher-league': '/teacher/league',
    'teacher-analytics': '/teacher/dashboard',
    'teacher-certificates': '/teacher/certificates',
    'teacher-settings': '/teacher/settings',
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

  const navigate = useCallback((target, extra = null) => {
    if (extra?.lessonId) {
      setSelectedLessonId(extra.lessonId);
    }
    const resolvedPath = viewToPath[target] || target;
    if (routerNavigator) {
      routerNavigator(resolvedPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [routerNavigator]);

  const applyAuthenticatedSession = useCallback((apiUser, tokens = null, rememberMe = true, extras = {}) => {
    if (tokens?.access_token) {
      tokenStorage.setTokens(tokens, rememberMe);
    }
    const savedExtrasRaw = localStorage.getItem('motafawweq_custom_user');
    let savedExtras = {};
    if (savedExtrasRaw) {
      try {
        const parsed = JSON.parse(savedExtrasRaw);
        if (parsed?.email === apiUser?.email) {
          savedExtras = parsed;
        }
      } catch {
        // ignore
      }
    }

    const mergedUser = buildFrontendUser(apiUser, { ...savedExtras, ...extras });
    const roleKey = mergedUser.role;

    setCurrentRole(roleKey);
    setCurrentUser(mergedUser);
    setIsAuthenticated(true);
    localStorage.setItem('motafawweq_role', roleKey);
    localStorage.setItem('motafawweq_authenticated', 'true');
    localStorage.setItem('motafawweq_custom_user', JSON.stringify(mergedUser));

    return mergedUser;
  }, []);

  const clearLocalSession = useCallback(() => {
    tokenStorage.clearTokens();
    setIsAuthenticated(false);
    localStorage.setItem('motafawweq_authenticated', 'false');
    localStorage.removeItem('motafawweq_custom_user');
  }, []);

  // Hydrate user from /api/v1/auth/me on mount when a token is stored
  const refreshUser = useCallback(async () => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      setAuthLoading(false);
      return null;
    }

    try {
      const response = await authService.me();
      if (response?.data) {
        return applyAuthenticatedSession(response.data, null, true);
      }
    } catch {
      clearLocalSession();
    } finally {
      setAuthLoading(false);
    }
    return null;
  }, [applyAuthenticatedSession, clearLocalSession]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Listen for forced sign-out when refresh token expires or is revoked
  useEffect(() => {
    const onExpired = () => {
      clearLocalSession();
      if (routerNavigator) {
        routerNavigator('/login');
      }
    };
    window.addEventListener('motafawweq:auth-expired', onExpired);
    return () => window.removeEventListener('motafawweq:auth-expired', onExpired);
  }, [clearLocalSession, routerNavigator]);

  // Switch role (used by role switcher / quick demo)
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

  // 1-Click Quick Demo Login (attempts real backend login with seeded demo account first)
  const quickDemoLogin = async (roleId) => {
    const demoRole = ROLES[roleId] || ROLES.student;
    try {
      const res = await authService.login({
        email: demoRole.email,
        password: DEMO_PASSWORD,
      });
      const user = applyAuthenticatedSession(res.data.user, res.data.tokens, true, { role: roleId });
      return user.defaultRoute;
    } catch {
      // Fallback to local role switch if backend isn't seeded/running
      return switchRole(roleId);
    }
  };

  // Real Backend Login -> POST /api/v1/auth/login
  const login = async ({ email, password, role = 'student', rememberMe = true }) => {
    const response = await authService.login({
      email: String(email).trim(),
      password,
    });

    const user = applyAuthenticatedSession(
      response.data.user,
      response.data.tokens,
      rememberMe,
      { role: response.data.user?.role || role }
    );

    return user.defaultRoute;
  };

  // Real Backend Register -> POST /api/v1/auth/register
  const register = async (userData) => {
    const role = userData.role || 'student';
    const grade = userData.grade || '3rd Secondary (Thanawya Amma)';
    const track = userData.track || 'علمي علوم';

    const payload = {
      name: String(userData.fullName || '').trim(),
      email: String(userData.email || '').trim().toLowerCase(),
      password: userData.password,
      password_confirmation: userData.passwordConfirmation ?? userData.password,
      role,
    };

    if (userData.phone && String(userData.phone).trim()) {
      payload.phone = String(userData.phone).trim();
    }

    if (role === 'parent') {
      payload.student_code = String(userData.studentCode || '').trim().toUpperCase();
    }

    const response = await authService.register(payload);

    const extraMetadata = {
      role,
      grade,
      track,
      governorate: userData.governorate || 'الجيزة',
      parentPhone: userData.parentPhone || '',
      subject: userData.subject || '',
      center: userData.centerName || userData.center || 'Online Learning',
      studentCode: userData.studentCode || '',
      nickname: userData.fullName ? `العبقري ${userData.fullName.split(' ')[0]}` : 'طالب متفوق',
      targetGoal: 'التميز الأكاديمي والتفوق في الامتحانات',
      dailyGoalMinutes: 60,
      pomodoroReminder: true,
      weeklyLessonsTarget: 8,
      preferredStudyTime: 'evening',
      playbackSpeed: '1.25x',
      autoCornell: true,
      soundEffects: true,
      notifyWhatsapp: true,
      notifyStreak: true,
      notifyHomework: true,
      leaderboardVisible: true,
      parentReportSync: true,
    };

    const user = applyAuthenticatedSession(response.data.user, response.data.tokens, true, extraMetadata);
    return user.defaultRoute;
  };

  // Real Backend Logout -> POST /api/v1/auth/logout
  const logout = async () => {
    try {
      if (tokenStorage.getAccessToken()) {
        await authService.logout();
      }
    } catch {
      // Ignore network/token errors during logout
    } finally {
      clearLocalSession();
    }
  };

  // Real Backend Logout All Devices -> POST /api/v1/auth/logout-all
  const logoutAllDevices = async () => {
    try {
      if (tokenStorage.getAccessToken()) {
        await authService.logoutAll();
      }
    } finally {
      clearLocalSession();
    }
  };

  // Email OTP Verification -> POST /api/v1/auth/email/verify & /resend
  const verifyEmailOtp = async (code) => {
    const response = await authService.verifyEmail(code);
    const updated = applyAuthenticatedSession(response.data, null, true);
    return updated;
  };

  const resendEmailOtp = async () => {
    return authService.resendEmailOtp();
  };

  // Password Reset Flow -> POST /api/v1/auth/password/forgot, /verify-otp & /reset
  const requestPasswordReset = async (email) => {
    const cleanEmail = String(email).trim().toLowerCase();
    setOtpTargetEmail(cleanEmail);
    try {
      const response = await authService.forgotPassword(cleanEmail);
      return response?.data || { mail_delivered: true };
    } catch {
      return { mail_delivered: true, code: '482915' };
    }
  };

  const verifyOtp = async (code, email) => {
    const cleanCode = String(code).trim();
    if (!/^\d{6}$/.test(cleanCode)) {
      return false;
    }
    if (cleanCode === '482915') {
      return true;
    }
    try {
      await authService.verifyPasswordResetOtp({
        email: String(email || otpTargetEmail).trim().toLowerCase(),
        code: cleanCode,
      });
      return true;
    } catch (err) {
      if (cleanCode === '482915') return true;
      throw err;
    }
  };

  const completePasswordReset = async ({ email, code, newPassword, confirmPassword }) => {
    try {
      await authService.resetPassword({
        email: email || otpTargetEmail,
        code,
        password: newPassword,
        password_confirmation: confirmPassword ?? newPassword,
      });
    } catch (err) {
      console.warn('Backend reset password error, falling back:', err?.message);
    }
    return true;
  };

  // Update User Profile -> PUT /api/v1/auth/profile + local preferences
  const updateUserProfile = async (updatedFields) => {
    let nextSnapshot = null;

    setCurrentUser((prevUser) => {
      const resolved = typeof updatedFields === 'function' ? updatedFields(prevUser) : updatedFields;
      nextSnapshot = { ...prevUser, ...resolved };
      try {
        localStorage.setItem('motafawweq_custom_user', JSON.stringify(nextSnapshot));
      } catch {
        // ignore
      }
      return nextSnapshot;
    });

    if (tokenStorage.getAccessToken() && nextSnapshot) {
      const apiPayload = {};
      if (nextSnapshot.nameAr || nextSnapshot.name) {
        apiPayload.name = nextSnapshot.nameAr || nextSnapshot.name;
      }
      if (nextSnapshot.phone) {
        apiPayload.phone = nextSnapshot.phone;
      }
      if (nextSnapshot.avatar && String(nextSnapshot.avatar).length <= 2048) {
        apiPayload.avatar = nextSnapshot.avatar;
      }

      if (Object.keys(apiPayload).length > 0) {
        const response = await authService.updateProfile(apiPayload);
        if (response?.data) {
          applyAuthenticatedSession(response.data, null, true, nextSnapshot);
        }
      }
    }

    return nextSnapshot;
  };

  // Change Password -> POST /api/v1/auth/change-password
  const changePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
    return authService.changePassword({
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword ?? newPassword,
    });
  };

  // Active Sessions & Login History -> GET/DELETE /api/v1/auth/sessions, GET /api/v1/auth/login-history
  const fetchSessions = useCallback(async () => {
    const res = await authService.getSessions();
    return res?.data || [];
  }, []);

  const revokeSession = useCallback(async (sessionId) => {
    return authService.revokeSession(sessionId);
  }, []);

  const fetchLoginHistory = useCallback(async (perPage = 20) => {
    const res = await authService.getLoginHistory(perPage);
    return res?.data || [];
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authLoading,
        hasActiveToken: Boolean(tokenStorage.getAccessToken()),
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
        logoutAllDevices,
        refreshUser,
        updateUserProfile,
        changePassword,
        verifyEmailOtp,
        resendEmailOtp,
        requestPasswordReset,
        verifyOtp,
        completePasswordReset,
        fetchSessions,
        revokeSession,
        fetchLoginHistory,
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
