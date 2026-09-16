import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
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
  Settings,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';

export const Sidebar = ({ mobileSidebarOpen, onClose }) => {
  const location = useLocation();
  const { currentRole } = useAuth();
  const { lang, t, isRtl } = useLanguage();

  const getMenuItems = () => {
    switch (currentRole) {
      case 'teacher':
        return [
          { id: 'dashboard', path: '/teacher/dashboard', label: lang === 'ar' ? 'لوحة التحكم الرئيسية' : 'Teacher Dashboard', icon: LayoutDashboard },
          { id: 'recording-studio', path: '/teacher/studio', label: lang === 'ar' ? 'استوديو التسجيل' : 'Recording Studio', icon: Mic, badge: lang === 'ar' ? 'جديد' : 'AI' },
          { id: 'lesson-workspace', path: '/teacher/workspace', label: lang === 'ar' ? 'خريطة المعرفة والحصة' : 'Lesson Workspace', icon: Sparkles },
          { id: 'classes', path: '/teacher/classes', label: lang === 'ar' ? 'إدارة المجموعات والقاعات' : 'Classes & Groups', icon: BookOpen },
          { id: 'students', path: '/teacher/students', label: lang === 'ar' ? 'سجل الطلاب والتقييمات' : 'Student Roster', icon: Users },
          { id: 'financials', path: '/teacher/financials', label: lang === 'ar' ? 'الأرباح والمحفظة (EGP)' : 'Earnings & Payouts', icon: DollarSign }
        ];
      case 'student':
        return [
          { id: 'student-dashboard', path: '/student/dashboard', label: lang === 'ar' ? 'لوحة مذاكرتي' : 'My Study Desk', icon: LayoutDashboard },
          { id: 'lesson-study', path: '/student/lesson', label: lang === 'ar' ? 'غرفة الحصة والشرح' : 'Lesson Study Room', icon: BookOpen },
          { id: 'take-exam', path: '/student/exam', label: lang === 'ar' ? 'الاختبارات الذكية' : 'Smart Exams', icon: Sparkles, badge: '15 Qs' },
          { id: 'weak-areas', path: '/student/weak-areas', label: lang === 'ar' ? 'تشخيص نقاط الضعف' : 'Weak Areas Hub', icon: AlertTriangle, badgeColor: '#EF4444' }
        ];
      case 'parent':
        return [
          { id: 'parent-portal', path: '/parent/dashboard', label: lang === 'ar' ? 'متابعة الأبناء' : 'Children Overview', icon: Users }
        ];
      case 'center':
        return [
          { id: 'center-portal', path: '/center/dashboard', label: lang === 'ar' ? 'إدارة السنتر والفروع' : 'Center Dashboard', icon: Building2 }
        ];
      case 'admin':
        return [
          { id: 'admin-portal', path: '/admin/dashboard', label: lang === 'ar' ? 'اقتصاديات المنصة والـ AI' : 'SaaS Economics', icon: ShieldCheck }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside
      className={`app-sidebar ${mobileSidebarOpen ? 'sidebar-mobile-open' : ''}`}
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--bg-surface)',
        borderRight: isRtl ? 'none' : '1px solid var(--border-subtle)',
        borderLeft: isRtl ? '1px solid var(--border-subtle)' : 'none',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 'calc(100vh - var(--topbar-height))',
        position: 'sticky',
        top: 'var(--topbar-height)',
        height: 'calc(100vh - var(--topbar-height))',
        overflowY: 'auto',
        flexShrink: 0
      }}
    >
      <div>
        {/* Role Header indicator */}
        <div style={{
          padding: '12px 14px',
          backgroundColor: 'var(--primary-surface)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          border: '1px solid var(--primary-light)'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {lang === 'ar' ? 'البيئة النشطة' : 'Active Workspace'}
          </div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
            {currentRole === 'teacher' && (lang === 'ar' ? 'بوابة المعلم الخارق' : 'Teacher Pro Suite')}
            {currentRole === 'student' && (lang === 'ar' ? 'بوابة الطالب المتفوق' : 'Student Study Suite')}
            {currentRole === 'parent' && (lang === 'ar' ? 'بوابة أولياء الأمور' : 'Parent Portal')}
            {currentRole === 'center' && (lang === 'ar' ? 'لوحة تحكم السنتر' : 'Center Academy')}
            {currentRole === 'admin' && (lang === 'ar' ? 'إدارة المنصة والذكاء' : 'HQ & AI Economics')}
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map(item => {
            const ItemIcon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '13.5px',
                  transition: 'all 0.15s ease',
                  textAlign: isRtl ? 'right' : 'left',
                  textDecoration: 'none',
                  width: '100%'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ItemIcon size={18} color={isActive ? '#FFFFFF' : 'var(--primary)'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: item.badgeColor || (isActive ? '#FFFFFF' : 'var(--primary-surface)'),
                    color: isActive ? 'var(--primary)' : (item.badgeColor ? '#FFFFFF' : 'var(--primary)')
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom widgets & link to public site */}
      <div style={{ marginTop: '24px' }}>
        {currentRole === 'teacher' && (
          <div style={{
            padding: '14px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>
                {lang === 'ar' ? 'رصيد الذكاء الاصطناعي' : 'AI Processing Quota'}
              </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)' }}>
                184 / 300 {lang === 'ar' ? 'دقيقة' : 'mins'}
              </span>
            </div>
            <div style={{
              height: '6px',
              width: '100%',
              backgroundColor: 'var(--border-subtle)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(184 / 300) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6C4DFF, #4C8DFF)',
                borderRadius: '3px'
              }} />
            </div>
            <Link
              to="/pricing"
              style={{
                marginTop: '10px',
                display: 'block',
                textAlign: 'center',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--primary-light)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--primary)',
                fontSize: '11px',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              {lang === 'ar' ? '+ شحن دقائق إضافية' : '+ Add AI Minutes'}
            </Link>
          </div>
        )}

        {currentRole === 'student' && (
          <div style={{
            padding: '14px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Flame size={18} color="#F59E0B" />
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'حماسك مشتعل: 14 يوم متتالي 🔥' : '14-Day Study Streak 🔥'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <Award size={14} color="var(--primary)" />
              <span>{lang === 'ar' ? 'نقاط الخبرة: 2,450 XP (مستوى 8)' : '2,450 XP Points (Lvl 8)'}</span>
            </div>
          </div>
        )}

        {/* Link to public website */}
        <Link
          to="/"
          style={{
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            fontSize: '12px',
            textDecoration: 'none'
          }}
        >
          <Compass size={14} />
          <span>{lang === 'ar' ? 'الرجوع للموقع العام' : 'Public Website'}</span>
        </Link>
      </div>
    </aside>
  );
};
