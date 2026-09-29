import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';

const BreadcrumbContext = createContext(null);

/**
 * Platform Route Hierarchy Definition
 * Supports bilingual Arabic & English labels, explicit parent links,
 * and role-based root identification.
 */
export const ROUTE_HIERARCHY = {
  // ── TEACHER ROUTES ──
  '/teacher/dashboard': {
    titleAr: 'لوحة التحكم',
    titleEn: 'Dashboard',
    isRoot: true,
    role: 'teacher'
  },
  '/teacher/courses': {
    titleAr: 'المقررات والمناهج',
    titleEn: 'Courses & Curriculum',
    parent: '/teacher/dashboard',
    role: 'teacher'
  },
  '/teacher/exams': {
    titleAr: 'بنك الأسئلة والامتحانات',
    titleEn: 'Question Bank & Exams',
    parent: '/teacher/dashboard',
    role: 'teacher'
  },
  '/teacher/homework': {
    titleAr: 'تصحيح الواجبات',
    titleEn: 'Homework & Grading',
    parent: '/teacher/dashboard',
    role: 'teacher'
  },
  '/teacher/studio': {
    titleAr: 'استوديو التسجيل',
    titleEn: 'Recording Studio',
    parent: '/teacher/dashboard',
    role: 'teacher'
  },
  '/teacher/workspace': {
    titleAr: 'خريطة الحصة',
    titleEn: 'Lesson Workspace',
    parent: '/teacher/courses',
    role: 'teacher'
  },
  '/teacher/processing': {
    titleAr: 'معالجة الذكاء الاصطناعي',
    titleEn: 'AI Processing',
    parent: '/teacher/studio',
    role: 'teacher'
  },
  '/teacher/classes': {
    titleAr: 'المجموعات والقاعات',
    titleEn: 'Classes & Groups',
    parent: '/teacher/dashboard',
    role: 'teacher'
  },
  '/teacher/schedule': {
    titleAr: 'جدول المواعيد والقاعات الأسبوعي',
    titleEn: 'Weekly Schedule & Halls',
    parent: '/teacher/classes',
    role: 'teacher'
  },
  '/teacher/students': {
    titleAr: 'سجل الطلاب',
    titleEn: 'Student Roster',
    parent: '/teacher/classes',
    role: 'teacher'
  },
  '/teacher/financials': {
    titleAr: 'الأرباح والمحفظة',
    titleEn: 'Earnings & Payouts',
    parent: '/teacher/dashboard',
    role: 'teacher'
  },
  '/teacher/billing': {
    titleAr: 'الاشتراكات وباقات المعلم',
    titleEn: 'Plans & Billing',
    parent: '/teacher/dashboard',
    role: 'teacher'
  },
  '/teacher/settings': {
    titleAr: 'إعدادات المعلم',
    titleEn: 'Teacher Settings',
    parent: '/teacher/dashboard',
    role: 'teacher'
  },
  '/teacher/league': {
    titleAr: 'دوري الكورس والتحدي',
    titleEn: 'Course League',
    parent: '/teacher/dashboard',
    role: 'teacher'
  },
  '/teacher/certificates': {
    titleAr: 'الشهادات المعتمدة',
    titleEn: 'Certificates',
    parent: '/teacher/dashboard',
    role: 'teacher'
  },

  // ── STUDENT ROUTES ──
  '/student/dashboard': {
    titleAr: 'الرئيسية',
    titleEn: 'Home',
    isRoot: true,
    role: 'student'
  },
  '/student/courses': {
    titleAr: 'المقررات الدراسية',
    titleEn: 'Courses',
    parent: '/student/dashboard',
    role: 'student'
  },
  '/student/lesson': {
    titleAr: 'حصصي ومذاكرتي',
    titleEn: 'Lesson Study',
    parent: '/student/courses',
    role: 'student'
  },
  '/student/groups': {
    titleAr: 'مجموعاتي الدراسية',
    titleEn: 'My Cohorts',
    parent: '/student/dashboard',
    role: 'student'
  },
  '/student/classes': {
    titleAr: 'مجموعاتي الدراسية',
    titleEn: 'My Cohorts',
    parent: '/student/dashboard',
    role: 'student'
  },
  '/student/schedule': {
    titleAr: 'جدول المواعيد والمذاكرة الأسبوعي',
    titleEn: 'Weekly Schedule & Study Plan',
    parent: '/student/groups',
    role: 'student'
  },
  '/student/quiz': {
    titleAr: 'الكويزات والتدريبات',
    titleEn: 'Quizzes & Practice',
    parent: '/student/dashboard',
    role: 'student'
  },
  '/student/homework': {
    titleAr: 'الواجبات المنزلية',
    titleEn: 'Homework',
    parent: '/student/dashboard',
    role: 'student'
  },
  '/student/exam': {
    titleAr: 'الاختبارات والامتحانات',
    titleEn: 'Exams',
    parent: '/student/dashboard',
    role: 'student'
  },
  '/student/smart-lecture': {
    titleAr: 'تحويل المحاضرة الذكية',
    titleEn: 'Smart Lecture Tool',
    parent: '/student/dashboard',
    role: 'student'
  },
  '/student/converted-lectures': {
    titleAr: 'المحاضرات المحولة',
    titleEn: 'Converted Lectures',
    parent: '/student/smart-lecture',
    role: 'student'
  },
  '/student/revision': {
    titleAr: 'المراجعة الذكية',
    titleEn: 'Smart Revision',
    parent: '/student/dashboard',
    role: 'student'
  },
  '/student/league': {
    titleAr: 'دوري المتفوقين',
    titleEn: 'League',
    parent: '/student/dashboard',
    role: 'student'
  },
  '/student/gamification': {
    titleAr: 'الإنجازات والجوائز',
    titleEn: 'Achievements',
    parent: '/student/dashboard',
    role: 'student'
  },
  '/student/certificates': {
    titleAr: 'الشهادات المعتمدة',
    titleEn: 'Certificates',
    parent: '/student/dashboard',
    role: 'student'
  },
  '/student/billing': {
    titleAr: 'الاشتراك والباقات',
    titleEn: 'Subscription',
    parent: '/student/dashboard',
    role: 'student'
  },
  '/student/weak-areas': {
    titleAr: 'معالجة نقاط الضعف',
    titleEn: 'Weak Areas Hub',
    parent: '/student/dashboard',
    role: 'student'
  },
  '/student/settings': {
    titleAr: 'إعدادات الحساب والملف الشخصي',
    titleEn: 'Account Settings',
    parent: '/student/dashboard',
    role: 'student'
  },

  // ── PARENT ROUTES ──
  '/parent/dashboard': {
    titleAr: 'بوابة ولي الأمر',
    titleEn: 'Parent Portal',
    isRoot: true,
    role: 'parent'
  },

  // ── CENTER ROUTES ──
  '/center/dashboard': {
    titleAr: 'لوحة تحكم السنتر',
    titleEn: 'Center Dashboard',
    isRoot: true,
    role: 'center'
  },

  // ── ADMIN ROUTES ──
  '/admin/dashboard': {
    titleAr: 'إدارة المنصة',
    titleEn: 'Platform Admin',
    isRoot: true,
    role: 'admin'
  },

  // ── PUBLIC / MARKETING ROUTES ──
  '/': {
    titleAr: 'الرئيسية',
    titleEn: 'Home',
    isRoot: true
  },
  '/features': {
    titleAr: 'المميزات والخصائص',
    titleEn: 'Features',
    parent: '/'
  },
  '/pricing': {
    titleAr: 'خطط الأسعار',
    titleEn: 'Pricing',
    parent: '/'
  },
  '/marketplace': {
    titleAr: 'متجر المعلمين',
    titleEn: 'Marketplace',
    parent: '/'
  },
  '/login': {
    titleAr: 'تسجيل الدخول',
    titleEn: 'Login',
    parent: '/'
  },
  '/register': {
    titleAr: 'إنشاء حساب جديد',
    titleEn: 'Register',
    parent: '/'
  },
  '/forgot-password': {
    titleAr: 'استعادة كلمة المرور',
    titleEn: 'Forgot Password',
    parent: '/login'
  }
};

/**
 * Fallback role roots configuration
 */
export const ROLE_ROOTS = {
  teacher: { path: '/teacher/dashboard', titleAr: 'لوحة التحكم', titleEn: 'Dashboard' },
  student: { path: '/student/dashboard', titleAr: 'الرئيسية', titleEn: 'Home' },
  parent: { path: '/parent/dashboard', titleAr: 'بوابة ولي الأمر', titleEn: 'Parent Portal' },
  center: { path: '/center/dashboard', titleAr: 'لوحة تحكم السنتر', titleEn: 'Center Dashboard' },
  admin: { path: '/admin/dashboard', titleAr: 'إدارة المنصة', titleEn: 'Platform Admin' }
};

export const BreadcrumbProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const { currentRole } = useAuth();
  const isAr = lang === 'ar';

  // Dynamic extra breadcrumbs added by individual pages/views
  // e.g. [{ labelAr: 'البيانات الشخصية', labelEn: 'Profile', onClick: ... }]
  const [extraCrumbs, setExtraCrumbs] = useState([]);

  // Automatically reset extra breadcrumbs whenever the URL pathname changes
  useEffect(() => {
    setExtraCrumbs([]);
  }, [location.pathname]);

  /**
   * Resolve breadcrumb hierarchy for current route
   */
  const breadcrumbs = useMemo(() => {
    const pathname = location.pathname;
    const roleRoot = ROLE_ROOTS[currentRole] || ROLE_ROOTS.student;

    // Check if this is the root route itself
    const isCurrentRoot = 
      pathname === roleRoot.path || 
      pathname === `/${currentRole}` ||
      (pathname === '/' && !currentRole);

    if (isCurrentRoot) {
      const rootTitle = isAr ? roleRoot.titleAr : roleRoot.titleEn;
      const rootCrumbs = [
        {
          id: 'root',
          label: rootTitle,
          path: roleRoot.path,
          isCurrent: extraCrumbs.length === 0,
          isRoot: true
        }
      ];
      if (extraCrumbs.length > 0) {
        return [...rootCrumbs, ...extraCrumbs.map((ec, idx) => ({
          id: `extra-${idx}`,
          label: isAr ? (ec.labelAr || ec.label) : (ec.labelEn || ec.label || ec.labelAr),
          path: ec.path,
          onClick: ec.onClick,
          isCurrent: idx === extraCrumbs.length - 1
        }))];
      }
      return rootCrumbs;
    }

    // Traverse upwards from current route
    const chain = [];
    let currentKey = pathname;
    const visited = new Set();

    while (currentKey && ROUTE_HIERARCHY[currentKey] && !visited.has(currentKey)) {
      visited.add(currentKey);
      const node = ROUTE_HIERARCHY[currentKey];
      chain.unshift({
        key: currentKey,
        label: isAr ? node.titleAr : node.titleEn,
        path: currentKey,
        isRoot: !!node.isRoot
      });

      if (node.isRoot) break;
      currentKey = node.parent;
    }

    // If chain didn't resolve to a root, ensure role root is prepended if inside dashboard
    if (chain.length > 0) {
      const first = chain[0];
      if (!first.isRoot && pathname.startsWith(`/${currentRole}`)) {
        chain.unshift({
          key: roleRoot.path,
          label: isAr ? roleRoot.titleAr : roleRoot.titleEn,
          path: roleRoot.path,
          isRoot: true
        });
      }
    } else {
      // Dynamic fallback for any unknown or newly added route (future-proof)
      const rolePrefix = `/${currentRole}`;
      if (pathname.startsWith(rolePrefix)) {
        chain.push({
          key: roleRoot.path,
          label: isAr ? roleRoot.titleAr : roleRoot.titleEn,
          path: roleRoot.path,
          isRoot: true
        });
        const subSegment = pathname.replace(rolePrefix, '').replace(/^\//, '');
        if (subSegment) {
          const formattedTitle = subSegment
            .split(/[-_/]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          chain.push({
            key: pathname,
            label: formattedTitle,
            path: pathname,
            isRoot: false
          });
        }
      } else {
        chain.push({
          key: pathname,
          label: isAr ? 'لوحة التحكم' : 'Dashboard',
          path: pathname,
          isRoot: true
        });
      }
    }

    // Deduplicate consecutive items with identical paths or labels to prevent "لوحة التحكم > لوحة التحكم"
    const deduplicated = [];
    chain.forEach((item, index) => {
      const prev = deduplicated[deduplicated.length - 1];
      if (!prev || (prev.path !== item.path && prev.label !== item.label)) {
        deduplicated.push(item);
      }
    });

    // Mark current item
    const baseCrumbs = deduplicated.map((c, idx) => ({
      ...c,
      id: `crumb-${idx}`,
      isCurrent: extraCrumbs.length === 0 && idx === deduplicated.length - 1
    }));

    // Append extra crumbs if provided by page
    if (extraCrumbs && extraCrumbs.length > 0) {
      const processedExtras = extraCrumbs.map((ec, idx) => ({
        id: `extra-${idx}`,
        label: isAr ? (ec.labelAr || ec.label) : (ec.labelEn || ec.label || ec.labelAr),
        path: ec.path,
        onClick: ec.onClick,
        isCurrent: idx === extraCrumbs.length - 1
      }));
      return [...baseCrumbs, ...processedExtras];
    }

    return baseCrumbs;
  }, [location.pathname, extraCrumbs, currentRole, lang, isAr]);

  return (
    <BreadcrumbContext.Provider value={{
      breadcrumbs,
      extraCrumbs,
      setExtraCrumbs,
      clearExtraCrumbs: () => setExtraCrumbs([])
    }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
  }
  return context;
};

/**
 * Convenient React hook for pages to declare custom breadcrumb tabs or sub-states
 * Automatically cleans up on unmount or tab change.
 */
export const useSetBreadcrumbs = (crumbs) => {
  const { setExtraCrumbs } = useBreadcrumbs();

  useEffect(() => {
    if (Array.isArray(crumbs) && crumbs.length > 0) {
      setExtraCrumbs(crumbs);
    } else {
      setExtraCrumbs([]);
    }

    return () => {
      setExtraCrumbs([]);
    };
  }, [JSON.stringify(crumbs), setExtraCrumbs]);
};
