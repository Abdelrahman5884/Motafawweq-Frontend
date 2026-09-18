import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Mic,
  Users,
  BookOpen,
  DollarSign,
  AlertTriangle,
  Building2,
  ShieldCheck,
  Compass,
  ChevronRight,
  ChevronLeft,
  Flame,
  Award,
  X,
  GraduationCap,
  HeartHandshake,
  QrCode,
  Activity,
  Server,
  Trophy,
  FileText,
  RotateCcw,
  BarChart3,
  CreditCard,
  BookMarked,
  ClipboardList,
  TrendingUp,
  Medal
} from 'lucide-react';

export const Sidebar = ({ mobileSidebarOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { currentRole, currentUser } = useAuth();
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  // Role accent color (kept minimal — only for active state highlight)
  const roleAccent = {
    teacher: '#6C4BFF',
    student: '#6C4BFF',
    parent: '#14B87A',
    center: '#F5A623',
    admin: '#6C4BFF',
  };
  const accent = roleAccent[currentRole] || '#6C4BFF';

  const getMenuItems = () => {
    switch (currentRole) {
      case 'teacher':
        return [
          { id: 'dashboard', path: '/teacher/dashboard', label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: LayoutDashboard },
          { id: 'recording-studio', path: '/teacher/studio', label: lang === 'ar' ? 'استوديو التسجيل' : 'Recording Studio', icon: Mic },
          { id: 'lesson-workspace', path: '/teacher/workspace', label: lang === 'ar' ? 'خريطة الحصة' : 'Lesson Workspace', icon: BookOpen },
          { id: 'classes', path: '/teacher/classes', label: lang === 'ar' ? 'المجموعات والقاعات' : 'Classes & Groups', icon: Users },
          { id: 'students', path: '/teacher/students', label: lang === 'ar' ? 'سجل الطلاب' : 'Student Roster', icon: ClipboardList },
          { id: 'financials', path: '/teacher/financials', label: lang === 'ar' ? 'الأرباح والمحفظة' : 'Earnings & Payouts', icon: DollarSign },
        ];
      case 'student':
        return [
          {
            group: lang === 'ar' ? 'الرئيسية' : 'Main',
            items: [
              { id: 'student-dashboard', path: '/student/dashboard', label: lang === 'ar' ? 'الرئيسية' : 'Home', icon: LayoutDashboard },
              { id: 'courses', path: '/student/courses', label: lang === 'ar' ? 'حصصي' : 'My Courses', icon: BookOpen },
              { id: 'take-exam', path: '/student/exam', label: lang === 'ar' ? 'الاختبارات' : 'Exams', icon: ClipboardList },
              { id: 'homework', path: '/student/homework', label: lang === 'ar' ? 'الواجبات' : 'Homework', icon: FileText },
              { id: 'analytics', path: '/student/analytics', label: lang === 'ar' ? 'مستواي' : 'My Level', icon: TrendingUp },
            ]
          },
          {
            group: lang === 'ar' ? 'أدوات التعلم' : 'Learning Tools',
            items: [
              { id: 'smart-lecture', path: '/student/smart-lecture', label: lang === 'ar' ? 'تحويل المحاضرة' : 'Lecture Tool', icon: Mic },
              { id: 'revision', path: '/student/revision', label: lang === 'ar' ? 'المراجعة' : 'Revision', icon: RotateCcw },
              { id: 'quiz', path: '/student/quiz', label: lang === 'ar' ? 'الكويزات' : 'Quizzes', icon: Trophy },
              { id: 'gamification', path: '/student/gamification', label: lang === 'ar' ? 'الإنجازات' : 'Achievements', icon: Medal },
              { id: 'certificates', path: '/student/certificates', label: lang === 'ar' ? 'الشهادات' : 'Certificates', icon: Award },
              { id: 'billing', path: '/student/billing', label: lang === 'ar' ? 'الاشتراك' : 'Subscription', icon: CreditCard },
            ]
          }
        ];
      case 'parent':
        return [
          { id: 'parent-portal', path: '/parent/dashboard', label: lang === 'ar' ? 'متابعة الأبناء' : 'Children Overview', icon: Users },
          { id: 'parent-reports', path: '/parent/dashboard', label: lang === 'ar' ? 'التقارير الأسبوعية' : 'Weekly Reports', icon: Activity },
          { id: 'parent-feedback', path: '/parent/dashboard', label: lang === 'ar' ? 'ملاحظات المعلمين' : 'Teacher Feedback', icon: BookMarked },
        ];
      case 'center':
        return [
          { id: 'center-portal', path: '/center/dashboard', label: lang === 'ar' ? 'لوحة تحكم السنتر' : 'Center Dashboard', icon: Building2 },
          { id: 'center-halls', path: '/center/dashboard', label: lang === 'ar' ? 'القاعات والجداول' : 'Halls & Schedule', icon: BookOpen },
          { id: 'center-qr', path: '/center/dashboard', label: lang === 'ar' ? 'حضور الطلاب' : 'QR Attendance', icon: QrCode },
          { id: 'center-financials', path: '/center/dashboard', label: lang === 'ar' ? 'الفواتير والإيرادات' : 'Billing & Revenue', icon: DollarSign },
        ];
      case 'admin':
        return [
          { id: 'admin-portal', path: '/admin/dashboard', label: lang === 'ar' ? 'اقتصاديات المنصة' : 'SaaS Economics', icon: ShieldCheck },
          { id: 'admin-gpu', path: '/admin/dashboard', label: lang === 'ar' ? 'كفاءة المعالجة' : 'GPU Clusters', icon: Server },
          { id: 'admin-users', path: '/admin/dashboard', label: lang === 'ar' ? 'إدارة المستخدمين' : 'User Management', icon: Users },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  // Flatten for non-student roles (they use flat arrays, not groups)
  const isStudentGrouped = currentRole === 'student' && Array.isArray(menuItems) && menuItems[0]?.group;

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const currentWidth = isCollapsed ? '72px' : '260px';

  const renderNavItem = (item) => {
    const ItemIcon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <Link
        key={item.id}
        to={item.path}
        onClick={handleLinkClick}
        title={isCollapsed ? item.label : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: isCollapsed ? '10px' : '10px 12px',
          borderRadius: '10px',
          backgroundColor: isActive ? `${accent}14` : 'transparent',
          color: isActive ? accent : 'var(--text-secondary)',
          fontWeight: isActive ? '600' : '500',
          fontSize: '14px',
          textDecoration: 'none',
          transition: 'background-color 0.15s ease, color 0.15s ease',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          position: 'relative',
          borderInlineStart: isActive ? `3px solid ${accent}` : '3px solid transparent',
        }}
        className="sidebar-nav-item"
      >
        <ItemIcon
          size={18}
          style={{ flexShrink: 0 }}
        />
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
      </Link>
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
        backgroundColor: 'var(--bg-surface)',
        borderInlineStart: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 999,
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      {/* Top brand + close (mobile only) */}
      <div style={{
        padding: isCollapsed ? '16px 8px' : '16px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        minHeight: '64px',
        flexShrink: 0
      }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src={isDark ? '/logo-dark.png' : '/logo-light.png'}
              alt="متفوّق"
              style={{ width: '28px', height: '28px', objectFit: 'contain' }}
            />
            <span style={{
              fontSize: '15px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-arabic)'
            }}>
              متفوّق
            </span>
          </div>
        )}
        {isCollapsed && (
          <img
            src={isDark ? '/logo-dark.png' : '/logo-light.png'}
            alt="متفوّق"
            style={{ width: '28px', height: '28px', objectFit: 'contain' }}
          />
        )}
        {/* Mobile close button */}
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

      {/* Student profile pill (non-collapsed) */}
      {currentRole === 'student' && !isCollapsed && currentUser && (
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: `${accent}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accent,
            fontSize: '13px',
            fontWeight: '700',
            flexShrink: 0,
            overflow: 'hidden'
          }}>
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              <GraduationCap size={16} />
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser?.nameAr || currentUser?.name || 'الطالب'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '1px' }}>
              {lang === 'ar' ? 'الصف الثالث الثانوي' : '3rd Secondary'}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: isCollapsed ? '12px 8px' : '12px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        {isStudentGrouped ? (
          // Student: grouped nav
          menuItems.map((group, gi) => (
            <div key={gi} style={{ marginBottom: '8px' }}>
              {!isCollapsed && (
                <div style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  padding: '4px 12px 6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  opacity: 0.7
                }}>
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
          // Other roles: flat nav
          menuItems.map(renderNavItem)
        )}
      </nav>

      {/* Bottom: collapse toggle (desktop only) + back to site */}
      <div style={{
        padding: isCollapsed ? '12px 8px' : '12px 10px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flexShrink: 0
      }}>
        {/* Back to website */}
        <Link
          to="/"
          onClick={handleLinkClick}
          title={isCollapsed ? (lang === 'ar' ? 'الموقع الرئيسي' : 'Website') : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: isCollapsed ? '8px' : '8px 12px',
            borderRadius: '8px',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '500',
            textDecoration: 'none',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            transition: 'color 0.15s ease'
          }}
        >
          <Compass size={16} />
          {!isCollapsed && <span>{lang === 'ar' ? 'الموقع الرئيسي' : 'Website'}</span>}
        </Link>

        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="desktop-only"
          title={isCollapsed ? (lang === 'ar' ? 'توسيع' : 'Expand') : (lang === 'ar' ? 'طي' : 'Collapse')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: isCollapsed ? '8px' : '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            width: '100%',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            transition: 'background-color 0.15s ease'
          }}
        >
          {!isCollapsed && <span>{lang === 'ar' ? 'طي القائمة' : 'Collapse'}</span>}
          {isRtl
            ? (isCollapsed ? <ChevronLeft size={15} /> : <ChevronRight size={15} />)
            : (isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />)
          }
        </button>
      </div>
    </aside>
  );
};
