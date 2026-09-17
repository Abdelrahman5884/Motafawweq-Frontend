import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  LayoutDashboard, 
  Mic, 
  Sparkles, 
  Users, 
  BookOpen, 
  DollarSign, 
  Brain, 
  AlertTriangle, 
  Building2, 
  ShieldCheck, 
  Compass, 
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  X,
  GraduationCap,
  HeartHandshake,
  QrCode,
  FileSpreadsheet,
  Activity,
  Server,
  Zap
} from 'lucide-react';

export const Sidebar = ({ mobileSidebarOpen, onClose }) => {
  const location = useLocation();
  const { currentRole, currentUser } = useAuth();
  const { lang, t, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Role metadata configurations
  const roleConfig = {
    teacher: {
      nameAr: 'بوابة المعلم الخارق',
      nameEn: 'Teacher Pro Suite',
      badgeAr: 'معلم معتمد',
      badgeEn: 'Verified Teacher',
      icon: Mic,
      color: '#6C4DFF',
      gradient: 'linear-gradient(135deg, #6C4DFF 0%, #4C8DFF 100%)',
      bgSurface: 'rgba(108, 77, 255, 0.08)'
    },
    student: {
      nameAr: 'بوابة الطالب المتفوق',
      nameEn: 'Student Study Suite',
      badgeAr: 'طالب متميز',
      badgeEn: 'Top Scholar',
      icon: GraduationCap,
      color: '#06B6D4',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
      bgSurface: 'rgba(6, 182, 212, 0.08)'
    },
    parent: {
      nameAr: 'بوابة أولياء الأمور',
      nameEn: 'Parent Portal',
      badgeAr: 'متابعة أسرية',
      badgeEn: 'Guardian Hub',
      icon: HeartHandshake,
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      bgSurface: 'rgba(16, 185, 129, 0.08)'
    },
    center: {
      nameAr: 'لوحة إدارة السنتر',
      nameEn: 'Center Academy Suite',
      badgeAr: 'سنتر مرخص',
      badgeEn: 'Licensed Center',
      icon: Building2,
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      bgSurface: 'rgba(245, 158, 11, 0.08)'
    },
    admin: {
      nameAr: 'إدارة المنصة والذكاء',
      nameEn: 'HQ & AI Economics',
      badgeAr: 'مدير المنظومة',
      badgeEn: 'System Admin',
      icon: ShieldCheck,
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
      bgSurface: 'rgba(236, 72, 153, 0.08)'
    }
  };

  const activeRoleMeta = roleConfig[currentRole] || roleConfig.teacher;

  const getMenuItems = () => {
    switch (currentRole) {
      case 'teacher':
        return [
          { id: 'dashboard', path: '/teacher/dashboard', label: lang === 'ar' ? 'لوحة التحكم الرئيسية' : 'Teacher Dashboard', icon: LayoutDashboard },
          { id: 'recording-studio', path: '/teacher/studio', label: lang === 'ar' ? 'استوديو التسجيل' : 'Recording Studio', icon: Mic, badge: lang === 'ar' ? 'مباشر AI' : 'Live AI', badgeColor: '#6C4DFF' },
          { id: 'lesson-workspace', path: '/teacher/workspace', label: lang === 'ar' ? 'خريطة المعرفة والحصة' : 'Lesson Workspace', icon: Sparkles, badge: '3D' },
          { id: 'classes', path: '/teacher/classes', label: lang === 'ar' ? 'إدارة المجموعات والقاعات' : 'Classes & Groups', icon: BookOpen },
          { id: 'students', path: '/teacher/students', label: lang === 'ar' ? 'سجل الطلاب والتقييمات' : 'Student Roster', icon: Users },
          { id: 'financials', path: '/teacher/financials', label: lang === 'ar' ? 'الأرباح والمحفظة (EGP)' : 'Earnings & Payouts', icon: DollarSign }
        ];
      case 'student':
        return [
          { id: 'student-dashboard', path: '/student/dashboard', label: lang === 'ar' ? 'لوحة مذاكرتي' : 'My Study Desk', icon: LayoutDashboard },
          { id: 'lesson-study', path: '/student/lesson', label: lang === 'ar' ? 'غرفة الحصة والشرح' : 'Lesson Study Room', icon: BookOpen },
          { id: 'take-exam', path: '/student/exam', label: lang === 'ar' ? 'الاختبارات الذكية' : 'Smart Exams', icon: Sparkles, badge: '15 Qs', badgeColor: '#3B82F6' },
          { id: 'weak-areas', path: '/student/weak-areas', label: lang === 'ar' ? 'تشخيص نقاط الضعف' : 'Weak Areas Hub', icon: AlertTriangle, badge: '⚠️', badgeColor: '#EF4444' }
        ];
      case 'parent':
        return [
          { id: 'parent-portal', path: '/parent/dashboard', label: lang === 'ar' ? 'متابعة الأبناء' : 'Children Overview', icon: Users },
          { id: 'parent-reports', path: '/parent/dashboard', label: lang === 'ar' ? 'التقارير الأسبوعية' : 'Weekly Reports', icon: Activity, badge: '96%' },
          { id: 'parent-feedback', path: '/parent/dashboard', label: lang === 'ar' ? 'ملاحظات المعلمين' : 'Teacher Feedback', icon: Sparkles }
        ];
      case 'center':
        return [
          { id: 'center-portal', path: '/center/dashboard', label: lang === 'ar' ? 'لوحة تحكم السنتر' : 'Center Dashboard', icon: Building2 },
          { id: 'center-halls', path: '/center/dashboard', label: lang === 'ar' ? 'القاعات والجداول' : 'Halls & Schedule', icon: BookOpen, badge: '18 قاعة' },
          { id: 'center-qr', path: '/center/dashboard', label: lang === 'ar' ? 'حضور الطلاب بالـ QR' : 'QR Attendance', icon: QrCode },
          { id: 'center-financials', path: '/center/dashboard', label: lang === 'ar' ? 'الفواتير والإيرادات' : 'Billing & Revenue', icon: DollarSign }
        ];
      case 'admin':
        return [
          { id: 'admin-portal', path: '/admin/dashboard', label: lang === 'ar' ? 'اقتصاديات المنصة والـ AI' : 'SaaS Economics', icon: ShieldCheck },
          { id: 'admin-gpu', path: '/admin/dashboard', label: lang === 'ar' ? 'كفاءة معالجة Whisper' : 'GPU Clusters', icon: Server, badge: '99.9%' },
          { id: 'admin-users', path: '/admin/dashboard', label: lang === 'ar' ? 'إدارة المستخدمين' : 'User Management', icon: Users }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const currentWidth = isCollapsed ? '76px' : '260px';

  return (
    <aside
      className={`app-sidebar ${mobileSidebarOpen ? 'sidebar-mobile-open' : ''} ${isCollapsed ? 'sidebar-collapsed' : ''}`}
      style={{
        width: currentWidth,
        minWidth: currentWidth,
        backgroundColor: 'var(--bg-surface)',
        borderRight: isRtl ? 'none' : '1px solid var(--border-subtle)',
        borderLeft: isRtl ? '1px solid var(--border-subtle)' : 'none',
        padding: isCollapsed ? '20px 8px' : '20px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 'calc(100vh - var(--topbar-height))',
        position: 'sticky',
        top: 'var(--topbar-height)',
        height: 'calc(100vh - var(--topbar-height))',
        overflowY: 'auto',
        overflowX: 'hidden',
        flexShrink: 0,
        transition: 'width 0.28s cubic-bezier(0.16, 1, 0.3, 1), padding 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: mobileSidebarOpen ? 999 : 50
      }}
    >
      <div>
        {/* Mobile Header with Close Button */}
        <div className="mobile-only" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 4px 16px',
          marginBottom: '14px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src={isDark ? '/logo-dark.png' : '/logo-light.png'}
              alt="متفوّق"
              style={{ width: '28px', height: '28px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'متفوّق' : 'Motafawweq'}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Role Banner Card */}
        <div style={{
          padding: isCollapsed ? '10px 4px' : '12px 14px',
          backgroundColor: activeRoleMeta.bgSurface,
          borderRadius: 'var(--radius-lg)',
          marginBottom: '20px',
          border: `1px solid ${activeRoleMeta.color}30`,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {/* Subtle Glow Accent */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: activeRoleMeta.gradient,
            opacity: 0.15,
            filter: 'blur(15px)',
            pointerEvents: 'none'
          }} />

          {/* Role Icon */}
          <div style={{
            width: isCollapsed ? '38px' : '34px',
            height: isCollapsed ? '38px' : '34px',
            borderRadius: '10px',
            background: activeRoleMeta.gradient,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 4px 12px ${activeRoleMeta.color}40`
          }}>
            {React.createElement(activeRoleMeta.icon, { size: isCollapsed ? 18 : 16 })}
          </div>

          {!isCollapsed && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontSize: '10px',
                color: activeRoleMeta.color,
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>{lang === 'ar' ? activeRoleMeta.badgeAr : activeRoleMeta.badgeEn}</span>
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                marginTop: '1px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {lang === 'ar' ? activeRoleMeta.nameAr : activeRoleMeta.nameEn}
              </div>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {menuItems.map(item => {
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
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  padding: isCollapsed ? '12px' : '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? activeRoleMeta.gradient : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: isActive ? '700' : '600',
                  fontSize: '13px',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  textAlign: isRtl ? 'right' : 'left',
                  textDecoration: 'none',
                  position: 'relative',
                  boxShadow: isActive ? `0 6px 18px ${activeRoleMeta.color}35` : 'none'
                }}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ItemIcon
                    size={18}
                    color={isActive ? '#FFFFFF' : 'currentColor'}
                    style={{ flexShrink: 0, transition: 'transform 0.2s ease' }}
                  />
                  {!isCollapsed && (
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.label}
                    </span>
                  )}
                </div>

                {!isCollapsed && item.badge && (
                  <span style={{
                    fontSize: '9.5px',
                    fontWeight: '800',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: item.badgeColor || (isActive ? '#FFFFFF25' : `${activeRoleMeta.color}18`),
                    color: isActive ? '#FFFFFF' : (item.badgeColor || activeRoleMeta.color),
                    border: isActive ? '1px solid rgba(255,255,255,0.3)' : `1px solid ${activeRoleMeta.color}30`,
                    flexShrink: 0
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom widgets & Controls */}
      <div style={{ marginTop: '24px' }}>
        {/* Teacher Widget: AI Quota with animated progress */}
        {currentRole === 'teacher' && !isCollapsed && (
          <div style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '10px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {lang === 'ar' ? 'رصيد الذكاء الاصطناعي' : 'AI Processing Quota'}
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--primary)' }}>
                184 / 300 {lang === 'ar' ? 'دقيقة' : 'm'}
              </span>
            </div>
            <div style={{
              height: '6px',
              width: '100%',
              backgroundColor: 'var(--border-subtle)',
              borderRadius: '3px',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <div style={{
                width: `${(184 / 300) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6C4DFF, #38BDF8)',
                borderRadius: '3px'
              }} />
            </div>
            <Link
              to="/pricing"
              onClick={handleLinkClick}
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '6px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--primary-light)',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                fontSize: '11px',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {lang === 'ar' ? '+ شحن دقائق إضافية' : '+ Add AI Minutes'}
            </Link>
          </div>
        )}

        {/* Student Widget: Gamification Streak */}
        {currentRole === 'student' && !isCollapsed && (
          <div style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '10px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Flame size={18} color="#F59E0B" />
              <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? '14 يوماً متتالياً 🔥' : '14-Day Streak 🔥'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              <Award size={14} color="#06B6D4" />
              <span>{lang === 'ar' ? '2,450 XP (مستوى 8)' : '2,450 XP (Level 8)'}</span>
            </div>
          </div>
        )}

        {/* Parent Widget: Children Attendance */}
        {currentRole === 'parent' && !isCollapsed && (
          <div style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '10px'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
              {lang === 'ar' ? 'الأبناء المسجلين (2)' : 'Registered Children (2)'}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#10B981', marginTop: '3px' }}>
              {lang === 'ar' ? '✓ نسبة الحضور 96.5%' : '✓ Attendance 96.5%'}
            </div>
          </div>
        )}

        {/* Center Widget: Active Halls */}
        {currentRole === 'center' && !isCollapsed && (
          <div style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '10px'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
              {lang === 'ar' ? 'حالة القاعات الآن' : 'Active Rooms Status'}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#F59E0B', marginTop: '3px' }}>
              {lang === 'ar' ? '18 قاعة ممتلئة (94%)' : '18 Rooms Busy (94%)'}
            </div>
          </div>
        )}

        {/* Admin Widget: AI Clusters */}
        {currentRole === 'admin' && !isCollapsed && (
          <div style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '10px'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
              {lang === 'ar' ? 'سيرفرات الذكاء الاصطناعي' : 'Whisper GPU Server'}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#EC4899', marginTop: '3px' }}>
              {lang === 'ar' ? 'جاهز 99.99% • 32ms' : 'Online 99.99% • 32ms'}
            </div>
          </div>
        )}

        {/* Return to Public Site Link */}
        <Link
          to="/"
          onClick={handleLinkClick}
          title={isCollapsed ? (lang === 'ar' ? 'الرجوع للموقع العام' : 'Public Website') : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '8px',
            width: '100%',
            padding: '8px 10px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            fontSize: '12px',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'color 0.15s ease'
          }}
        >
          <Compass size={16} />
          {!isCollapsed && <span>{lang === 'ar' ? 'الرجوع للموقع العام' : 'Public Website'}</span>}
        </Link>

        {/* Desktop Collapse / Expand Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="desktop-only"
          title={isCollapsed ? (lang === 'ar' ? 'توسيع القائمة' : 'Expand Sidebar') : (lang === 'ar' ? 'طي القائمة' : 'Collapse Sidebar')}
          style={{
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            gap: '8px',
            width: '100%',
            padding: '8px 10px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '11.5px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {!isCollapsed && <span>{lang === 'ar' ? 'طي القائمة' : 'Collapse'}</span>}
          {isRtl ? (
            isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
          ) : (
            isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />
          )}
        </button>
      </div>
    </aside>
  );
};
