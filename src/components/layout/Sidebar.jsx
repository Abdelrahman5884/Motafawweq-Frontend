import React from 'react';
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
  Building2,
  ShieldCheck,
  Compass,
  ChevronRight,
  ChevronLeft,
  Award,
  X,
  GraduationCap,
  QrCode,
  Activity,
  Server,
  Trophy,
  FileText,
  RotateCcw,
  CreditCard,
  BookMarked,
  ClipboardList,
  TrendingUp,
  Medal,
  Sparkles,
  PlayCircle
} from 'lucide-react';

export const Sidebar = ({ mobileSidebarOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { currentRole, currentUser } = useAuth();
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  // Role accent color
  const roleAccent = {
    teacher: '#1588C7',
    student: '#1588C7',
    parent: '#16A34A',
    center: '#F59E0B',
    admin: '#1588C7',
  };
  const accent = roleAccent[currentRole] || '#1588C7';

  const getMenuItems = () => {
    switch (currentRole) {
      case 'teacher':
        return [
          { id: 'dashboard', path: '/teacher/dashboard', label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: LayoutDashboard },
          { id: 'recording-studio', path: '/teacher/studio', label: lang === 'ar' ? 'استوديو التسجيل' : 'Recording Studio', icon: Mic, badge: 'AI' },
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
              { id: 'my-lessons', path: '/student/lesson', label: lang === 'ar' ? 'حصصي' : 'My Lessons', icon: PlayCircle },
              { id: 'courses', path: '/student/courses', label: lang === 'ar' ? 'المقررات' : 'Courses', icon: BookOpen },
              { id: 'take-exam', path: '/student/exam', label: lang === 'ar' ? 'الاختبارات' : 'Exams', icon: ClipboardList },
              { id: 'homework', path: '/student/homework', label: lang === 'ar' ? 'الواجبات' : 'Homework', icon: FileText },
              { id: 'league', path: '/student/league', label: lang === 'ar' ? 'الدوري' : 'League', icon: Trophy },
            ]
          },
          {
            group: lang === 'ar' ? 'أدوات التعلم الذكية' : 'Smart Learning Tools',
            items: [
              { id: 'smart-lecture', path: '/student/smart-lecture', label: lang === 'ar' ? 'تحويل المحاضرة' : 'Lecture Tool', icon: Mic, badge: 'AI' },
              { id: 'revision', path: '/student/revision', label: lang === 'ar' ? 'المراجعة الذكية' : 'Smart Revision', icon: RotateCcw },
              { id: 'quiz', path: '/student/quiz', label: lang === 'ar' ? 'الكويزات والتدريب' : 'Quizzes', icon: Sparkles },
              { id: 'gamification', path: '/student/gamification', label: lang === 'ar' ? 'الإنجازات والجوائز' : 'Achievements', icon: Medal },
              { id: 'certificates', path: '/student/certificates', label: lang === 'ar' ? 'الشهادات المعتمدة' : 'Certificates', icon: Award },
              { id: 'billing', path: '/student/billing', label: lang === 'ar' ? 'الاشتراك والباقات' : 'Subscription', icon: CreditCard },
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
  const isStudentGrouped = currentRole === 'student' && Array.isArray(menuItems) && menuItems[0]?.group;

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const currentWidth = isCollapsed ? '76px' : '260px';

  const renderNavItem = (item) => {
    const ItemIcon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <div key={item.id} className="sidebar-item-wrapper">
        <Link
          to={item.path}
          onClick={handleLinkClick}
          className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
          style={{
            color: isActive ? accent : undefined,
          }}
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
          {!isCollapsed && item.badge && (
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
            {item.badge && (
              <span className="sidebar-badge-ai" style={{ fontSize: '8.5px', padding: '1px 5px' }}>
                {item.badge}
              </span>
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
                  {currentRole === 'student'
                    ? (lang === 'ar' ? 'منصة المتفوقين الذكية' : 'Smart Learning Hub')
                    : (lang === 'ar' ? 'بوابة المعلم' : 'Workspace')}
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
          <div className="sidebar-user-card">
            <div className="sidebar-avatar-wrapper">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: `${accent}20`,
                  color: accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <GraduationCap size={16} />
                </div>
              )}
              <span className="sidebar-online-dot" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontSize: '12.5px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {lang === 'ar' ? (currentUser.nameAr || currentUser.name) : currentUser.name}
              </div>
              <div style={{
                fontSize: '10.5px',
                color: 'var(--text-secondary)',
                fontWeight: '500',
                marginTop: '1px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {lang === 'ar' ? (currentUser.roleLabelAr || currentUser.roleLabel) : currentUser.roleLabel}
              </div>
            </div>
          </div>
        ) : (
          <div className="sidebar-item-wrapper" style={{ margin: '10px auto 4px auto', display: 'flex', justifyContent: 'center' }}>
            <div className="sidebar-avatar-wrapper">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <span className="sidebar-online-dot" />
            </div>
            <div className="sidebar-tooltip">
              <span>{lang === 'ar' ? (currentUser.nameAr || currentUser.name) : currentUser.name}</span>
            </div>
          </div>
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
        {isStudentGrouped ? (
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
