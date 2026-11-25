import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStudentActivity } from '../../context/StudentActivityContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../common/Avatar';
import {
  LayoutDashboard,
  Calendar,
  Mic,
  Users,
  BookOpen,
  DollarSign,
  Building2,
  ShieldCheck,
  Compass,
  ChevronRight,
  ChevronLeft,
  Award,
  X,
  QrCode,
  Layers,
  Activity,
  Server,
  Trophy,
  FileText,
  CreditCard,
  BookMarked,
  ClipboardList,
  TrendingUp,
  Medal,
  Sparkles,
  PlayCircle,
  FolderCheck,
  Flame,
  Settings,
  Target,
  Megaphone,
  Lock
} from 'lucide-react';
import {
  hasStudentFeatureAccess,
  getStudentFeatureGate,
  STUDENT_PLANS
} from '../../constants/studentPlanFeatures';
import {
  hasTeacherFeatureAccess,
  getTeacherFeatureGate,
  TEACHER_PLANS
} from '../../constants/teacherPlanFeatures';
import { CENTER_PLANS, normalizeCenterPlanTier } from '../../constants/centerPlanFeatures';

export const Sidebar = ({ mobileSidebarOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { currentRole, currentUser, studentPlanTier, teacherPlanTier, centerPlanTier } = useAuth();
  const activeCenterPlan = CENTER_PLANS[normalizeCenterPlanTier(centerPlanTier)] || CENTER_PLANS.free;
  const { streakDays: liveStreakDays } = useStudentActivity();
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const sidebarStreakDays = Number(liveStreakDays || currentUser?.streakDays || 0);

  // Effective role derived from path or current user role
  const effectiveRole = location.pathname.startsWith('/center')
    ? 'center'
    : location.pathname.startsWith('/teacher')
    ? 'teacher'
    : location.pathname.startsWith('/student')
    ? 'student'
    : location.pathname.startsWith('/parent')
    ? 'parent'
    : location.pathname.startsWith('/admin')
    ? 'admin'
    : currentRole;

  const profileSettingsPath =
    effectiveRole === 'student'
      ? '/student/settings'
      : effectiveRole === 'teacher'
      ? '/teacher/settings'
      : effectiveRole === 'center'
      ? '/center/settings'
      : '#';

  const sidebarProfileName =
    effectiveRole === 'center'
      ? lang === 'ar'
        ? currentUser?.centerNameAr || currentUser?.center || 'السنتر التعليمي'
        : currentUser?.centerNameEn || currentUser?.center || 'Educational Center'
      : lang === 'ar'
      ? currentUser?.nameAr || currentUser?.name || ''
      : currentUser?.name || '';

  const sidebarProfileSubtitle =
    effectiveRole === 'center' && currentUser?.name && currentUser.name !== sidebarProfileName
      ? lang === 'ar'
        ? `إدارة: ${currentUser.name}`
        : `Manager: ${currentUser.name}`
      : lang === 'ar'
      ? currentUser?.roleLabelAr || currentUser?.roleLabel || ''
      : currentUser?.roleLabel || '';

  // Role accent color strictly adhering to platform palette (#1588C7)
  const roleAccent = {
    teacher: '#1588C7',
    student: '#1588C7',
    parent: '#1588C7',
    center: '#1588C7',
    admin: '#1588C7',
  };
  const accent = roleAccent[effectiveRole] || '#1588C7';

  const getMenuItems = () => {
    switch (effectiveRole) {
      case 'teacher':
        return [
          {
            group: lang === 'ar' ? 'التدريس والمقررات' : 'Teaching & Curriculum',
            items: [
              { id: 'dashboard', path: '/teacher/dashboard', label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: LayoutDashboard },
              { id: 'teacher-courses', path: '/teacher/courses', label: lang === 'ar' ? 'المقررات والمناهج' : 'Courses & Curriculum', icon: BookOpen },
              { id: 'teacher-exams', path: '/teacher/exams', label: lang === 'ar' ? 'بنك الأسئلة والامتحانات' : 'Question Bank & Exams', icon: ClipboardList, featureKey: 'exams' },
              { id: 'teacher-homework', path: '/teacher/homework', label: lang === 'ar' ? 'تصحيح الواجبات' : 'Homework & Grading', icon: FileText, featureKey: 'homework' },
              { id: 'recording-studio', path: '/teacher/studio', label: lang === 'ar' ? 'استوديو التسجيل' : 'Recording Studio', icon: Mic, badge: teacherPlanTier === 'pro' ? 'AI' : null },
              { id: 'lesson-workspace', path: '/teacher/workspace', label: lang === 'ar' ? 'خريطة الحصة' : 'Lesson Workspace', icon: BookMarked },
            ]
          },
          {
            group: lang === 'ar' ? 'متابعة الطلاب والتقييم' : 'Students & Performance',
            items: [
              { id: 'teacher-league', path: '/teacher/league', label: lang === 'ar' ? 'دوري الكورس والتحدي' : 'Course League', icon: Trophy, featureKey: 'leagues' },
              { id: 'teacher-certificates', path: '/teacher/certificates', label: lang === 'ar' ? 'الشهادات المعتمدة' : 'Certificates', icon: Award, featureKey: 'certificates' },
              { id: 'students', path: '/teacher/students', label: lang === 'ar' ? 'سجل الطلاب' : 'Student Roster', icon: Users },
              { id: 'classes', path: '/teacher/classes', label: lang === 'ar' ? 'المجموعات والقاعات' : 'Classes & Groups', icon: Building2 },
              { id: 'teacher-schedule', path: '/teacher/schedule', label: lang === 'ar' ? 'جدول المواعيد والقاعات' : 'Weekly Schedule', icon: Calendar, featureKey: 'schedule' },
              { id: 'financials', path: '/teacher/financials', label: lang === 'ar' ? 'الأرباح والمحفظة' : 'Earnings & Payouts', icon: DollarSign, featureKey: 'financials' },
              { id: 'teacher-billing', path: '/teacher/billing', label: lang === 'ar' ? 'الاشتراكات وباقات المعلم' : 'Plans & Billing', icon: CreditCard },
              { id: 'teacher-settings', path: '/teacher/settings', label: lang === 'ar' ? 'إعدادات المعلم' : 'Teacher Settings', icon: Settings },
            ]
          }
        ];
      case 'student':
        return [
          {
            group: lang === 'ar' ? 'الرئيسية' : 'Main',
            items: [
              { id: 'student-dashboard', path: '/student/dashboard', label: lang === 'ar' ? 'الرئيسية' : 'Home', icon: LayoutDashboard },
              { id: 'student-groups', path: '/student/groups', label: lang === 'ar' ? 'مجموعاتي الدراسية' : 'My Cohorts', icon: Building2 },
              { id: 'student-schedule', path: '/student/schedule', label: lang === 'ar' ? 'جدول المواعيد والمذاكرة' : 'Weekly Schedule', icon: Calendar },
              { id: 'my-lessons', path: '/student/lesson', label: lang === 'ar' ? 'حصصي' : 'My Lessons', icon: PlayCircle },
              { id: 'courses', path: '/student/courses', label: lang === 'ar' ? 'المقررات' : 'Courses', icon: BookOpen },
              { id: 'take-exam', path: '/student/exam', label: lang === 'ar' ? 'الاختبارات' : 'Exams', icon: ClipboardList },
              { id: 'homework', path: '/student/homework', label: lang === 'ar' ? 'الواجبات' : 'Homework', icon: FileText },
              { id: 'league', path: '/student/league', label: lang === 'ar' ? 'الدوري' : 'League', icon: Trophy, featureKey: 'league' },
            ]
          },
          {
            group: lang === 'ar' ? 'أدوات التعلم الذكية' : 'Smart Learning Tools',
            items: [
              { id: 'smart-lecture', path: '/student/smart-lecture', label: lang === 'ar' ? 'تحويل المحاضرة' : 'Lecture Tool', icon: Mic, badge: 'AI', featureKey: 'smart-lecture' },
              { id: 'converted-lectures', path: '/student/converted-lectures', label: lang === 'ar' ? 'المحاضرات المحولة' : 'Converted Lectures', icon: FolderCheck, featureKey: 'converted-lectures' },
              { id: 'gamification', path: '/student/gamification', label: lang === 'ar' ? 'الإنجازات والجوائز' : 'Achievements', icon: Medal, featureKey: 'gamification' },
              { id: 'certificates', path: '/student/certificates', label: lang === 'ar' ? 'الشهادات المعتمدة' : 'Certificates', icon: Award, featureKey: 'certificates' },
              { id: 'billing', path: '/student/billing', label: lang === 'ar' ? 'الاشتراك والباقات' : 'Subscription', icon: CreditCard },
              { id: 'student-settings', path: '/student/settings', label: lang === 'ar' ? 'الإعدادات والملف الشخصي' : 'Settings', icon: Settings },
            ]
          }
        ];
      case 'parent':
        return [
          { id: 'parent-portal', path: '/parent/dashboard?tab=overview', label: lang === 'ar' ? 'متابعة الأبناء' : 'Children Overview', icon: Users },
          { id: 'parent-courses', path: '/parent/dashboard?tab=courses', label: lang === 'ar' ? 'المقررات والدروس' : 'Enrolled Courses', icon: BookOpen },
          { id: 'parent-attendance', path: '/parent/dashboard?tab=attendance', label: lang === 'ar' ? 'سجل حضور السنتر' : 'Center Attendance', icon: Calendar },
          { id: 'parent-exams', path: '/parent/dashboard?tab=exams', label: lang === 'ar' ? 'الدرجات والامتحانات' : 'Exam Scorecards', icon: Award },
          { id: 'parent-homework', path: '/parent/dashboard?tab=homework', label: lang === 'ar' ? 'الواجبات والتسليمات' : 'Homework Tracker', icon: FileText },
          { id: 'parent-financials', path: '/parent/dashboard?tab=financials', label: lang === 'ar' ? 'المصروفات والاشتراكات' : 'Tuition & Fees', icon: CreditCard },
          { id: 'parent-settings', path: '/parent/dashboard?tab=settings', label: lang === 'ar' ? 'الإعدادات والملف الشخصي' : 'Settings', icon: Settings },
        ];
      case 'center':
        return [
          {
            group: lang === 'ar' ? 'التشغيل اليومي' : 'Operations',
            items: [
              { id: 'center-portal', path: '/center/dashboard', label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: Building2 },
              { id: 'center-groups', path: '/center/groups', label: lang === 'ar' ? 'المجموعات' : 'Cohorts', icon: Users },
              { id: 'center-halls', path: '/center/halls', label: lang === 'ar' ? 'القاعات والجدول' : 'Halls & Schedule', icon: Calendar },
            ]
          },
          {
            group: lang === 'ar' ? 'الإدارة' : 'Management',
            items: [
              { id: 'center-operations', path: '/center/operations', label: lang === 'ar' ? 'الفروع والمعلمون' : 'Branches & Faculty', icon: Layers },
              { id: 'center-billing', path: '/center/billing', label: lang === 'ar' ? 'الباقات والاشتراك' : 'Plans & Billing', icon: CreditCard, badge: lang === 'ar' ? activeCenterPlan.shortAr : activeCenterPlan.shortEn },
              { id: 'center-settings', path: '/center/settings', label: lang === 'ar' ? 'الإعدادات' : 'Settings', icon: Settings },
            ]
          }
        ];
      case 'admin':
        return [
          { id: 'admin-overview', path: '/admin/dashboard?tab=overview', label: lang === 'ar' ? 'الرئيسية' : 'Overview', icon: LayoutDashboard },
          { id: 'admin-champions', path: '/admin/dashboard?tab=champions', label: lang === 'ar' ? 'الأبطال والدوري' : 'Champions', icon: Trophy, badge: lang === 'ar' ? 'مميز' : 'Cups' },
          { id: 'admin-users', path: '/admin/dashboard?tab=users', label: lang === 'ar' ? 'المستخدمون' : 'Users', icon: Users },
          { id: 'admin-courses', path: '/admin/dashboard?tab=courses', label: lang === 'ar' ? 'المقررات' : 'Courses', icon: BookOpen },
          { id: 'admin-financials', path: '/admin/dashboard?tab=financials', label: lang === 'ar' ? 'الماليات' : 'Financials', icon: DollarSign },
          { id: 'admin-announcements', path: '/admin/dashboard?tab=announcements', label: lang === 'ar' ? 'الإعلانات' : 'Announcements', icon: Megaphone },
          { id: 'admin-system', path: '/admin/dashboard?tab=system', label: lang === 'ar' ? 'الإعدادات' : 'Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();
  const isGrouped = Array.isArray(menuItems) && menuItems[0]?.group;

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const currentWidth = isCollapsed ? '76px' : '260px';

  const renderNavItem = (item) => {
    const ItemIcon = item.icon;
    const currentFullPath = location.pathname + (location.search || '');
    const isActive = item.path.includes('?')
      ? (currentFullPath === item.path || (location.pathname === item.path.split('?')[0] && !location.search && item.path.endsWith('?tab=overview')))
      : (location.pathname === item.path || (item.path === '/center/groups' && location.pathname.startsWith('/center/groups/')));

    const isStudentLocked =
      effectiveRole === 'student' &&
      Boolean(item.featureKey) &&
      !hasStudentFeatureAccess(studentPlanTier, item.featureKey);
    const isTeacherLocked =
      effectiveRole === 'teacher' &&
      Boolean(item.featureKey) &&
      !hasTeacherFeatureAccess(teacherPlanTier, item.featureKey);
    const isLocked = isStudentLocked || isTeacherLocked;
    const gate = isStudentLocked
      ? getStudentFeatureGate(item.featureKey)
      : isTeacherLocked
      ? getTeacherFeatureGate(item.featureKey)
      : null;
    const requiredPlan = gate
      ? (isTeacherLocked ? TEACHER_PLANS[gate.requiredTier] : STUDENT_PLANS[gate.requiredTier])
      : null;

    return (
      <div key={item.id} className="sidebar-item-wrapper">
        <Link
          to={item.path}
          onClick={handleLinkClick}
          className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
          title={
            isLocked && requiredPlan
              ? (lang === 'ar'
                ? `مقفول — يتطلب ${requiredPlan.nameAr}`
                : `Locked — Requires ${requiredPlan.nameEn}`)
              : undefined
          }
          style={{
            color: isActive ? accent : undefined,
            opacity: isLocked && !isActive ? 0.72 : 1,
          }}
        >
          <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
            <ItemIcon
              size={18}
              style={{ flexShrink: 0 }}
            />
            {isCollapsed && isLocked && (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '-5px',
                  insetInlineEnd: '-6px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--warning, #D97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lock size={8} />
              </span>
            )}
          </span>
          {!isCollapsed && (
            <span style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1
            }}>
              {item.label}
            </span>
          )}
          {!isCollapsed && isLocked && requiredPlan && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '2px 6px',
                borderRadius: '999px',
                fontSize: '9.5px',
                fontWeight: '800',
                backgroundColor: requiredPlan.tier === 'pro'
                  ? 'rgba(21, 136, 199, 0.14)'
                  : 'rgba(245, 158, 11, 0.14)',
                color: requiredPlan.tier === 'pro'
                  ? 'var(--primary)'
                  : 'var(--warning, #D97706)',
                border: `1px solid ${
                  requiredPlan.tier === 'pro'
                    ? 'rgba(21, 136, 199, 0.28)'
                    : 'rgba(245, 158, 11, 0.3)'
                }`,
                flexShrink: 0,
              }}
            >
              <Lock size={10} />
              <span>{lang === 'ar' ? requiredPlan.shortAr : requiredPlan.shortEn}</span>
            </span>
          )}
          {!isCollapsed && !isLocked && item.badge && (
            <span
              className="sidebar-badge-ai"
            >
              {item.badge}
            </span>
          )}
        </Link>

        {/* High-Performance Floating Tooltip in Collapsed Mode */}
        {isCollapsed && (
          <div className="sidebar-tooltip">
            <span>{item.label}</span>
            {isLocked && requiredPlan ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '9px',
                  fontWeight: '800',
                  padding: '1px 6px',
                  borderRadius: '99px',
                  backgroundColor: 'rgba(245, 158, 11, 0.18)',
                  color: '#F59E0B',
                }}
              >
                <Lock size={9} />
                <span>{lang === 'ar' ? requiredPlan.shortAr : requiredPlan.shortEn}</span>
              </span>
            ) : (
              item.badge && (
                <span className="sidebar-badge-ai" style={{ fontSize: '8.5px', padding: '1px 5px' }}>
                  {item.badge}
                </span>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`app-sidebar ${mobileSidebarOpen ? 'sidebar-mobile-open' : ''} ${isCollapsed ? 'sidebar-collapsed' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        right: isRtl ? 0 : undefined,
        left: isRtl ? undefined : 0,
        bottom: 0,
        width: currentWidth,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1002,
        overflowX: 'hidden',
        overflowY: 'hidden',
      }}
    >
      {/* ── Brand Header ── */}
      <div className="sidebar-brand-wrapper">
        {!isCollapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                minWidth: 0
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: `${accent}16`,
                border: `1px solid ${accent}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img
                  src={isDark ? '/logo-dark.png' : '/logo-light.png'}
                  alt="متفوّق"
                  style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  lineHeight: 1.2
                }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {lang === 'ar' ? 'متفوّق' : 'Motafawweq'}
                  </span>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: '800',
                    padding: '1px 5px',
                    borderRadius: '99px',
                    backgroundColor: 'var(--primary-surface)',
                    color: 'var(--primary)',
                    border: '1px solid var(--primary-light)'
                  }}>
                    {lang === 'ar' ? 'مصر' : 'EG'}
                  </span>
                </div>
                <div style={{
                  fontSize: '10px',
                  color: 'var(--text-secondary)',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginTop: '1px'
                }}>
                  {effectiveRole === 'student'
                    ? (lang === 'ar' ? 'منصة المتفوقين الذكية' : 'Smart Learning Hub')
                    : effectiveRole === 'center'
                    ? (lang === 'ar' ? 'بوابة إدارة السنتر' : 'Center Management')
                    : effectiveRole === 'parent'
                    ? (lang === 'ar' ? 'بوابة ولي الأمر' : 'Parent Portal')
                    : effectiveRole === 'admin'
                    ? (lang === 'ar' ? 'لوحة الإدارة العامة' : 'Admin Console')
                    : (lang === 'ar' ? 'بوابة المعلم' : 'Educator Workspace')}
                </div>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="mobile-only"
              aria-label="إغلاق القائمة"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="sidebar-item-wrapper" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: `${accent}16`,
                border: `1px solid ${accent}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={isDark ? '/logo-dark.png' : '/logo-light.png'}
                  alt="متفوّق"
                  style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                />
              </div>
            </Link>
            <div className="sidebar-tooltip">
              <span>{lang === 'ar' ? 'منصة متفوّق' : 'Motafawweq'}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── User Profile Mini-Card ── */}
      {currentUser && (
        !isCollapsed ? (
          <Link
            to={profileSettingsPath}
            onClick={handleLinkClick}
            className="sidebar-user-card"
            style={{ textDecoration: 'none', cursor: profileSettingsPath !== '#' ? 'pointer' : 'default' }}
          >
            <div className="sidebar-avatar-wrapper">
              <Avatar
                src={currentUser?.avatar}
                name={sidebarProfileName}
                size={34}
              />
              <span className="sidebar-online-dot" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '6px'
              }}>
                <div style={{
                  fontSize: '12.5px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {sidebarProfileName}
                </div>
                {currentRole === 'student' && sidebarStreakDays > 0 && (
                  <div
                    title={lang === 'ar' ? 'سلسلة الاستريك المتتالية' : 'Daily Streak'}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '1.5px 6px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(245, 158, 11, 0.12)',
                      color: '#D97706',
                      fontSize: '10.5px',
                      fontWeight: '800',
                      border: '1px solid rgba(245, 158, 11, 0.22)',
                      flexShrink: 0
                    }}
                  >
                    <Flame size={12} color="#F59E0B" />
                    <span>{sidebarStreakDays} {lang === 'ar' ? 'يوم' : 'd'}</span>
                  </div>
                )}
                {effectiveRole === 'teacher' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '1.5px 7px',
                      borderRadius: '8px',
                      backgroundColor: teacherPlanTier === 'pro'
                        ? 'rgba(21, 136, 199, 0.15)'
                        : teacherPlanTier === 'plus'
                        ? 'rgba(2, 132, 199, 0.12)'
                        : 'var(--bg-subtle)',
                      color: teacherPlanTier === 'free' ? 'var(--text-secondary)' : 'var(--primary)',
                      fontSize: '10px',
                      fontWeight: '800',
                      border: '1px solid var(--border-subtle)',
                      flexShrink: 0
                    }}
                  >
                    {lang === 'ar'
                      ? (TEACHER_PLANS[teacherPlanTier]?.shortAr || 'مجاني')
                      : (TEACHER_PLANS[teacherPlanTier]?.shortEn || 'Free')}
                  </span>
                )}
              </div>
              <div style={{
                fontSize: '10.5px',
                color: 'var(--text-secondary)',
                fontWeight: '500',
                marginTop: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {sidebarProfileSubtitle}
              </div>
            </div>
          </Link>
        ) : (
          <Link
            to={profileSettingsPath}
            onClick={handleLinkClick}
            className="sidebar-item-wrapper"
            style={{ margin: '10px auto 4px auto', display: 'flex', justifyContent: 'center', textDecoration: 'none' }}
          >
            <div className="sidebar-avatar-wrapper">
              <Avatar
                src={currentUser?.avatar}
                name={sidebarProfileName}
                size={32}
              />
              <span className="sidebar-online-dot" />
            </div>
            <div className="sidebar-tooltip">
              <span>{sidebarProfileName}</span>
            </div>
          </Link>
        )
      )}

      {/* ── Main Navigation List ── */}
      <nav
        className="sidebar-nav-scroll"
        style={{
          flex: 1,
          padding: isCollapsed ? '10px 8px' : '10px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {isGrouped ? (
          menuItems.map((group, gi) => (
            <div key={gi} style={{ marginBottom: '8px' }}>
              {!isCollapsed && (
                <div className="sidebar-group-title">
                  {group.group}
                </div>
              )}
              {isCollapsed && gi > 0 && (
                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '8px 4px' }} />
              )}
              {group.items.map(renderNavItem)}
            </div>
          ))
        ) : (
          menuItems.map(renderNavItem)
        )}
      </nav>

      {/* ── Bottom Section: Website Link & Collapse Toggle ── */}
      <div className="sidebar-footer-wrapper">
        {/* Back to website */}
        <div className="sidebar-item-wrapper">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="sidebar-nav-item"
            style={{
              padding: isCollapsed ? '8px' : '8px 12px',
              fontSize: '12.5px',
              justifyContent: isCollapsed ? 'center' : 'flex-start'
            }}
          >
            <Compass size={17} style={{ flexShrink: 0 }} />
            {!isCollapsed && <span>{lang === 'ar' ? 'الموقع الرئيسي' : 'Main Website'}</span>}
          </Link>
          {isCollapsed && (
            <div className="sidebar-tooltip">
              <span>{lang === 'ar' ? 'الموقع الرئيسي' : 'Main Website'}</span>
            </div>
          )}
        </div>

        {/* Desktop collapse toggle */}
        <div className="sidebar-item-wrapper desktop-only">
          <button
            onClick={onToggleCollapse}
            className="sidebar-nav-item"
            style={{
              width: '100%',
              padding: isCollapsed ? '8px' : '8px 12px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              fontSize: '12px',
              cursor: 'pointer',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              color: 'var(--text-secondary)'
            }}
          >
            {!isCollapsed && <span>{lang === 'ar' ? 'طي القائمة' : 'Collapse'}</span>}
            {isRtl
              ? (isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />)
              : (isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />)
            }
          </button>
          {isCollapsed && (
            <div className="sidebar-tooltip">
              <span>{lang === 'ar' ? 'توسيع القائمة' : 'Expand Sidebar'}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
