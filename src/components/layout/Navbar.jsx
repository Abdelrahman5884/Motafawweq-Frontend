import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Sparkles, 
  Search, 
  Moon, 
  Sun, 
  Globe, 
  Layers, 
  LogOut, 
  LogIn, 
  UserPlus,
  Menu,
  X,
  Flame,
  Trophy,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { STUDENT_PROFILE } from '../../data/studentData';

export const Navbar = ({ mobileSidebarOpen, setMobileSidebarOpen, isFullPage, hasSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { 
    currentRole, 
    currentUser, 
    isAuthenticated, 
    logout, 
    setSearchModalOpen 
  } = useAuth();
  const { lang, setLang, t, isRtl } = useLanguage();
  const { theme, isDark, toggleTheme } = useTheme();

  const currentPath = location.pathname;
  const isPublicPage = ['/', '/features', '/pricing', '/marketplace'].includes(currentPath);
  const isDashboardLayout = hasSidebar && !isFullPage;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: t('navFeatures'), path: '/features' },
    { label: t('navMarketplace'), path: '/marketplace' },
    { label: t('navPricing'), path: '/pricing' }
  ];

  const getDashboardPath = () => {
    switch (currentRole) {
      case 'teacher': return '/teacher/dashboard';
      case 'student': return '/student/dashboard';
      case 'parent': return '/parent/dashboard';
      case 'center': return '/center/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/student/dashboard';
    }
  };

  const getPageTitle = () => {
    if (currentPath.startsWith('/student/dashboard')) return lang === 'ar' ? 'الرئيسية' : 'Overview';
    if (currentPath.startsWith('/student/lesson')) return lang === 'ar' ? 'حصصي ومذاكرتي' : 'Lesson Study';
    if (currentPath.startsWith('/student/courses')) return lang === 'ar' ? 'المقررات' : 'Courses';
    if (currentPath.startsWith('/student/exam')) return lang === 'ar' ? 'الاختبارات' : 'Exams';
    if (currentPath.startsWith('/student/homework')) return lang === 'ar' ? 'الواجبات' : 'Homework';
    if (currentPath.startsWith('/student/league') || currentPath.startsWith('/student/analytics')) return lang === 'ar' ? 'دوري المتفوقين' : 'League';
    if (currentPath.startsWith('/student/smart-lecture')) return lang === 'ar' ? 'تحويل المحاضرة الذكية' : 'Smart Lecture Tool';
    if (currentPath.startsWith('/student/revision')) return lang === 'ar' ? 'المراجعة الذكية' : 'Smart Revision';
    if (currentPath.startsWith('/student/quiz')) return lang === 'ar' ? 'الكويزات والتدريبات' : 'Quizzes';
    if (currentPath.startsWith('/student/gamification')) return lang === 'ar' ? 'الإنجازات والجوائز' : 'Achievements';
    if (currentPath.startsWith('/student/certificates')) return lang === 'ar' ? 'الشهادات المعتمدة' : 'Certificates';
    if (currentPath.startsWith('/student/billing')) return lang === 'ar' ? 'الاشتراك والباقات' : 'Subscription';
    if (currentPath.startsWith('/teacher/dashboard')) return lang === 'ar' ? 'لوحة المعلم' : 'Teacher Dashboard';
    if (currentPath.startsWith('/teacher/studio')) return lang === 'ar' ? 'استوديو التسجيل' : 'Recording Studio';
    if (currentPath.startsWith('/teacher/workspace')) return lang === 'ar' ? 'خريطة الحصة' : 'Lesson Workspace';
    if (currentPath.startsWith('/teacher/classes')) return lang === 'ar' ? 'المجموعات والقاعات' : 'Classes';
    if (currentPath.startsWith('/teacher/students')) return lang === 'ar' ? 'سجل الطلاب' : 'Student Roster';
    if (currentPath.startsWith('/teacher/financials')) return lang === 'ar' ? 'الأرباح والمحفظة' : 'Financials';
    if (currentPath.startsWith('/parent')) return lang === 'ar' ? 'بوابة ولي الأمر' : 'Parent Portal';
    if (currentPath.startsWith('/center')) return lang === 'ar' ? 'لوحة السنتر' : 'Center Dashboard';
    if (currentPath.startsWith('/admin')) return lang === 'ar' ? 'إدارة المنصة' : 'Platform Admin';
    return lang === 'ar' ? 'لوحة التحكم' : 'Dashboard';
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(16px)',
      transition: 'background-color 0.2s ease, border-color 0.2s ease',
      width: '100%',
      maxWidth: '100vw'
    }}>
      <div className={`navbar-container ${isDashboardLayout ? 'navbar-dashboard' : ''}`}>
        {/* ── LEFT / START AREA ── */}
        {isDashboardLayout ? (
          /* Dashboard Mode: Desktop shows Breadcrumb / Route Title (NO duplicate logo), Mobile shows hamburger + compact logo */
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Mobile Hamburger Toggle for Sidebar */}
            <button
              onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(!mobileSidebarOpen)}
              className="mobile-only"
              aria-label="Toggle Sidebar"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: mobileSidebarOpen ? 'var(--primary-surface)' : 'var(--bg-surface)',
                color: mobileSidebarOpen ? 'var(--primary)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Compact Logo */}
            <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src={isDark ? '/logo-dark.png' : '/logo-light.png'}
                alt="متفوّق"
                style={{ width: '28px', height: '28px', objectFit: 'contain' }}
              />
              <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'متفوّق' : 'Motafawweq'}
              </span>
            </div>

            {/* Desktop Breadcrumb / Route Indicator */}
            <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12.5px',
                fontWeight: '500',
                color: 'var(--text-secondary)'
              }}>
                <span>{lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
                <span style={{ opacity: 0.35 }}>
                  {isRtl ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
                </span>
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                letterSpacing: '-0.2px'
              }}>
                {getPageTitle()}
              </span>
            </div>
          </div>
        ) : (
          /* Public Marketing Mode: Full Brand Logo & Tagline + Marketing Links */
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link 
              to="/"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              <img
                src={isDark ? '/logo-dark.png' : '/logo-light.png'}
                alt="متفوّق"
                style={{
                  width: '38px',
                  height: '38px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 10px rgba(21, 136, 199, 0.35))'
                }}
              />
              <div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '900',
                  letterSpacing: '-0.3px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-heading)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {lang === 'ar' ? 'متفوّق' : 'Motafawweq'}
                  <span style={{
                    fontSize: '9px',
                    fontWeight: '800',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--primary-surface)',
                    color: 'var(--primary)',
                    border: '1px solid var(--primary-light)'
                  }}>
                    {lang === 'ar' ? 'مصر' : 'EG'}
                  </span>
                </div>
                <div className="desktop-only" style={{ 
                  fontSize: '10.5px', 
                  color: 'var(--text-secondary)',
                  marginTop: '-2px',
                  fontWeight: '600'
                }}>
                  {t('tagline')}
                </div>
              </div>
            </Link>

            {/* Navigation Links (Desktop) */}
            <nav className="desktop-only" style={{
              alignItems: 'center',
              gap: '4px'
            }}>
              {navLinks.map((link, idx) => {
                const isActive = currentPath === link.path;
                return (
                  <Link
                    key={idx}
                    to={link.path}
                    style={{
                      padding: '8px 12px',
                      fontSize: '13px',
                      fontWeight: isActive ? '700' : '500',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--primary-surface)' : 'transparent',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Direct Link to Main Role Dashboard */}
              <Link
                to={getDashboardPath()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: !isPublicPage ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: !isPublicPage ? 'var(--primary-surface)' : 'transparent',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none'
                }}
              >
                <Layers size={14} />
                {t('navDashboard')}
              </Link>
            </nav>
          </div>
        )}

        {/* ── RIGHT / END AREA: Global Controls & Actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Global Cmd+K Search Bar Button (Desktop) */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="desktop-only"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '12.5px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Search size={14} color="var(--text-secondary)" />
            <span style={{ color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'بحث سريع...' : 'Search...'}
            </span>
            <kbd style={{
              fontSize: '9.5px',
              padding: '2px 5px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)'
            }}>
              Ctrl K
            </kbd>
          </button>

          {/* Compact Search Trigger (Mobile) */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="mobile-only"
            aria-label="Search"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Search size={16} />
          </button>

          {/* Language Switcher (AR / EN) */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 9px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <Globe size={14} color="var(--primary)" />
            <span>{lang === 'ar' ? 'En' : 'عربي'}</span>
          </button>

          {/* Theme Switcher (Dark / Light) */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {theme === 'dark' ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color="var(--text-secondary)" />}
          </button>

          {/* Desktop Authentication Actions */}
          {isAuthenticated ? (
            <div className="desktop-only" style={{ alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => navigate(currentRole === 'student' ? '/student/league' : getDashboardPath())}
                title={lang === 'ar' ? 'الملف الشخصي والإعدادات' : 'Profile & Settings'}
                aria-label={lang === 'ar' ? 'الملف الشخصي والإعدادات' : 'Profile & Settings'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1.5px solid var(--border-subtle)',
                  padding: 0,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'all 0.18s ease'
                }}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                title={t('navLogout')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="desktop-only" style={{ alignItems: 'center', gap: '6px' }}>
              <Link
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-medium)',
                  fontWeight: '600',
                  fontSize: '12.5px',
                  textDecoration: 'none'
                }}
              >
                <LogIn size={14} />
                <span>{t('navLogin')}</span>
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  textDecoration: 'none'
                }}
              >
                <UserPlus size={14} />
                <span>{t('navRegister')}</span>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button (Public Marketing Pages Only) */}
          {!isDashboardLayout && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-only"
              aria-label="Toggle Menu"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: mobileMenuOpen ? 'var(--primary-surface)' : 'var(--bg-surface)',
                color: mobileMenuOpen ? 'var(--primary)' : 'var(--text-primary)',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer animate-fade-in">
          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map((link, idx) => {
              const isActive = currentPath === link.path;
              return (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: '10px 14px',
                    fontSize: '14px',
                    fontWeight: isActive ? '700' : '600',
                    color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                    backgroundColor: isActive ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none'
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                fontSize: '14px',
                fontWeight: '600',
                color: !isPublicPage ? 'var(--primary)' : 'var(--text-primary)',
                backgroundColor: !isPublicPage ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none'
              }}
            >
              <Layers size={16} />
              <span>{t('navDashboard')}</span>
            </Link>
          </div>

          {/* Mobile Auth Actions */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? (currentUser.nameAr || currentUser.name) : currentUser.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--primary)' }}>
                      {lang === 'ar' ? (currentUser.roleLabelAr || currentUser.roleLabel) : currentUser.roleLabel}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <LogOut size={16} />
                  <span>{t('navLogout')}</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <LogIn size={15} />
                  <span>{t('navLogin')}</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <UserPlus size={15} />
                  <span>{t('navRegister')}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
