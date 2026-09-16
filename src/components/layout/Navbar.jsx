import React from 'react';
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
  Mic, 
  BookOpen, 
  ArrowRight,
  ArrowLeft,
  Layers,
  LogOut,
  User,
  LogIn,
  UserPlus
} from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(16px)',
      transition: 'background-color 0.2s ease, border-color 0.2s ease'
    }}>
      <div style={{
        maxWidth: 'var(--max-content-width)',
        margin: '0 auto',
        height: 'var(--topbar-height)',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Left: Brand Logo & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link 
            to="/"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <img
              src={isDark ? '/logo-dark.png' : '/logo-light.png'}
              alt="متفوّق"
              style={{
                width: '42px',
                height: '42px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 12px rgba(108, 77, 255, 0.35))'
              }}
            />
            <div>
              <div style={{
                fontSize: '20px',
                fontWeight: '900',
                letterSpacing: '-0.3px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {lang === 'ar' ? 'متفوّق' : 'Motafawweq'}
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: '800',
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  border: '1px solid var(--primary-light)'
                }}>
                  {lang === 'ar' ? 'مصر' : 'EG'}
                </span>
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: 'var(--text-secondary)',
                marginTop: '-2px',
                fontWeight: '600'
              }}>
                {t('tagline')}
              </div>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav style={{
            display: 'flex',
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
                    padding: '8px 13px',
                    fontSize: '13.5px',
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
                padding: '8px 13px',
                fontSize: '13.5px',
                fontWeight: '600',
                color: !isPublicPage ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: !isPublicPage ? 'var(--primary-surface)' : 'transparent',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none'
              }}
            >
              <Layers size={15} />
              {t('navDashboard')}
            </Link>
          </nav>
        </div>

        {/* Center/Right: Global Search & Control Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Global Cmd+K Search Bar Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '7px 13px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Search size={15} color="var(--text-secondary)" />
            <span style={{ color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'بحث سريع...' : 'Search...'}
            </span>
            <kbd style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)'
            }}>
              Ctrl K
            </kbd>
          </button>

          {/* Language Switcher (AR / EN) */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 11px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <Globe size={15} color="var(--primary)" />
            <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
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
            {theme === 'dark' ? <Sun size={16} color="#F59E0B" /> : <Moon size={16} color="var(--text-secondary)" />}
          </button>

          {/* Authentication Actions */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* User Avatar Card (Current Role) */}
              <div 
                onClick={() => navigate(getDashboardPath())}
                title={currentUser.email}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px 4px 4px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
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
                <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                    {lang === 'ar' ? (currentUser.nameAr || currentUser.name) : currentUser.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '600' }}>
                    {lang === 'ar' ? (currentUser.roleLabelAr || currentUser.roleLabel) : currentUser.roleLabel}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
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
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-medium)',
                  fontWeight: '600',
                  fontSize: '13px',
                  textDecoration: 'none'
                }}
              >
                <LogIn size={15} />
                <span>{t('navLogin')}</span>
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  fontSize: '13px',
                  fontWeight: '700',
                  textDecoration: 'none'
                }}
              >
                <UserPlus size={15} />
                <span>{t('navRegister')}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
