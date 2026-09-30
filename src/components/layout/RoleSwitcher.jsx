import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Mic, 
  ChevronDown,
  Calendar,
  QrCode,
  DollarSign,
  Layers,
  Settings,
  LogIn
} from 'lucide-react';

export const RoleSwitcher = () => {
  const navigate = useNavigate();
  const { currentRole, switchRole } = useAuth();
  const { lang, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const rolesList = [
    {
      id: 'center',
      title: lang === 'ar' ? 'سنتر تعليمي (أكاديمية الرواد)' : 'Center (Al-Rowad Academy)',
      subtitle: lang === 'ar' ? 'إدارة المدرسين، القاعات، الحضور، المالية والتشغيل' : 'Teachers, Rooms, Attendance, Financials & Ops',
      icon: Building2,
      color: 'var(--primary)',
      bgLight: 'var(--primary-light)',
      path: '/center/dashboard'
    },
    {
      id: 'teacher',
      title: lang === 'ar' ? 'معلم (د. سلمى السيد)' : 'Teacher (Dr. Salma)',
      subtitle: lang === 'ar' ? 'استوديو التسجيل، خريطة المعرفة، بنك الأسئلة' : 'Studio, Knowledge Map, Quizzes, Roster',
      icon: GraduationCap,
      color: 'var(--primary)',
      bgLight: 'var(--primary-light)',
      path: '/teacher/dashboard'
    },
    {
      id: 'student',
      title: lang === 'ar' ? 'طالب (عمر طارق)' : 'Student (Omar Tarek)',
      subtitle: lang === 'ar' ? 'غرفة المذاكرة، الامتحانات، تشخيص نقاط الضعف' : 'Study Room, Quizzes, Weak Areas Hub',
      icon: BookOpen,
      color: 'var(--color-primary-light)',
      bgLight: 'var(--primary-light)',
      path: '/student/dashboard'
    },
    {
      id: 'parent',
      title: lang === 'ar' ? 'ولي أمر (م. طارق)' : 'Parent (Eng. Tarek)',
      subtitle: lang === 'ar' ? 'متابعة الأبناء، الحضور، درجات الامتحانات' : 'Children Overview, Attendance & Progress',
      icon: Users,
      color: 'var(--success)',
      bgLight: 'var(--success-light)',
      path: '/parent/dashboard'
    },
    {
      id: 'admin',
      title: lang === 'ar' ? 'مدير المنصة (SuperAdmin)' : 'SaaS Admin (HQ)',
      subtitle: lang === 'ar' ? 'اقتصاديات الذكاء الاصطناعي، التوثيق، النمو' : 'AI Economics, Margin Analytics, Verification',
      icon: ShieldCheck,
      color: 'var(--color-brand-dark)',
      bgLight: 'var(--bg-subtle)',
      path: '/admin/dashboard'
    }
  ];

  const quickShowcases = [
    { label: lang === 'ar' ? 'لوحة التحكم' : 'Control Panel', path: '/center/dashboard', role: 'center', icon: Building2 },
    { label: lang === 'ar' ? 'القاعات وجدول التشغيل' : 'Rooms & Schedule', path: '/center/halls', role: 'center', icon: Calendar },
    { label: lang === 'ar' ? 'المالية ونسب المدرسين' : 'Center Financials', path: '/center/financials', role: 'center', icon: DollarSign },
    { label: lang === 'ar' ? 'الفروع والعمليات والـ CRM' : 'Branches & CRM', path: '/center/operations', role: 'center', icon: Layers },
    { label: lang === 'ar' ? 'إعدادات المنظومة والمهام' : 'Center Settings', path: '/center/settings', role: 'center', icon: Settings },
    { label: lang === 'ar' ? 'استوديو تسجيل المعلم' : 'Recording Studio', path: '/teacher/studio', role: 'teacher', icon: Mic },
    { label: lang === 'ar' ? 'خريطة المعرفة' : 'Lesson Workspace', path: '/teacher/workspace', role: 'teacher', icon: Sparkles },
    { label: lang === 'ar' ? 'امتحان الطالب التفاعلي' : 'Student Exam', path: '/student/exam', role: 'student', icon: BookOpen },
    { label: lang === 'ar' ? 'الموقع العام' : 'Public Website', path: '/', icon: Compass }
  ];

  const activeRoleObj = rolesList.find(r => r.id === currentRole) || rolesList[0];
  const IconComponent = activeRoleObj.icon;

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      left: isRtl ? 'auto' : '20px',
      right: isRtl ? '20px' : 'auto',
      zIndex: 9999,
      fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-latin)'
    }}>
      {/* Expanded Menu Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '54px',
          [isRtl ? 'right' : 'left']: 0,
          width: '380px',
          maxHeight: '82vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 20px 48px rgba(6, 37, 78, 0.22)',
          padding: '16px',
          backdropFilter: 'blur(20px)'
        }} className="animate-fade-in">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            paddingBottom: '10px',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--primary)" />
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'مبدل الأدوار وبوابات متفوّق' : 'Motafawweq Role & Portal Switcher'}
              </span>
            </div>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontWeight: '700'
            }}>
              100% Live
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
            {rolesList.map(item => {
              const ItemIcon = item.icon;
              const isSelected = currentRole === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    const targetRoute = switchRole(item.id);
                    navigate(targetRoute || item.path);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-lg)',
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-app)',
                    cursor: 'pointer',
                    textAlign: isRtl ? 'right' : 'left',
                    transition: 'all 0.15s ease',
                    width: '100%'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: item.bgLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <ItemIcon size={18} color={item.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '800',
                      color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span>{item.title}</span>
                      {isSelected && (
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          fontWeight: '700'
                        }}>
                          {lang === 'ar' ? 'النشط' : 'Active'}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginTop: '2px'
                    }}>
                      {item.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Deep links */}
          <div style={{
            paddingTop: '10px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {lang === 'ar' ? 'انتقال سريع لأي قسم مباشر:' : 'Direct Quick Jump:'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {quickShowcases.map((demo, idx) => {
                const DemoIcon = demo.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (demo.role) switchRole(demo.role);
                      navigate(demo.path);
                      setIsOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 10px',
                      fontSize: '11px',
                      fontWeight: '600',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: isRtl ? 'right' : 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-app)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    <DemoIcon size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {demo.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Trigger Button Floating Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 16px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid var(--primary)',
          boxShadow: 'var(--shadow-lg)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          backdropFilter: 'blur(16px)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          backgroundColor: activeRoleObj.bgLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <IconComponent size={14} color={activeRoleObj.color} />
        </div>
        <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1 }}>
            {lang === 'ar' ? 'البوابة الحالية' : 'Active Portal'}
          </div>
          <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {activeRoleObj.title.split('(')[0]}
          </div>
        </div>
        <ChevronDown size={14} color="var(--text-secondary)" style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s ease'
        }} />
      </button>
    </div>
  );
};
