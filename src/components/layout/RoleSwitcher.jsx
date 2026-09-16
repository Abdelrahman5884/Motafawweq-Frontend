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
  ExternalLink,
  LogIn
} from 'lucide-react';

export const RoleSwitcher = () => {
  const navigate = useNavigate();
  const { currentRole, switchRole } = useAuth();
  const { lang, t, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const rolesList = [
    {
      id: 'teacher',
      title: lang === 'ar' ? 'معلم (د. سلمى السيد)' : 'Teacher (Dr. Salma)',
      subtitle: lang === 'ar' ? 'استوديو التسجيل، خريطة المعرفة، بنك الأسئلة' : 'Studio, Knowledge Map, Quizzes, Roster',
      icon: GraduationCap,
      color: '#6C4DFF',
      path: '/teacher/dashboard'
    },
    {
      id: 'student',
      title: lang === 'ar' ? 'طالب (عمر طارق)' : 'Student (Omar Tarek)',
      subtitle: lang === 'ar' ? 'غرفة المذاكرة، الامتحانات، تشخيص نقاط الضعف' : 'Study Room, Quizzes, Weak Areas Hub',
      icon: BookOpen,
      color: '#06B6D4',
      path: '/student/dashboard'
    },
    {
      id: 'parent',
      title: lang === 'ar' ? 'ولي أمر (م. طارق)' : 'Parent (Eng. Tarek)',
      subtitle: lang === 'ar' ? 'متابعة الأبناء، الحضور، درجات الامتحانات' : 'Children Overview, Attendance & Progress',
      icon: Users,
      color: '#10B981',
      path: '/parent/dashboard'
    },
    {
      id: 'center',
      title: lang === 'ar' ? 'سنتر تعليمي (أكاديمية الرواد)' : 'Center (Al-Rowad Academy)',
      subtitle: lang === 'ar' ? 'إدارة المدرسين، القاعات، التقارير والبراندينج' : 'Teachers, Rooms, Financials & White-label',
      icon: Building2,
      color: '#F59E0B',
      path: '/center/dashboard'
    },
    {
      id: 'admin',
      title: lang === 'ar' ? 'مدير المنصة (SuperAdmin)' : 'SaaS Admin (HQ)',
      subtitle: lang === 'ar' ? 'اقتصاديات الذكاء الاصطناعي، التوثيق، النمو' : 'AI Economics, Margin Analytics, Verification',
      icon: ShieldCheck,
      color: '#EC4899',
      path: '/admin/dashboard'
    }
  ];

  const quickShowcases = [
    { label: lang === 'ar' ? 'الموقع العام' : 'Public Website', path: '/', icon: Compass },
    { label: lang === 'ar' ? 'تسجيل الدخول' : 'Login Page', path: '/login', icon: LogIn },
    { label: lang === 'ar' ? 'استوديو التسجيل' : 'Recording Studio', path: '/teacher/studio', role: 'teacher', icon: Mic },
    { label: lang === 'ar' ? 'خريطة المعرفة' : 'Lesson Workspace', path: '/teacher/workspace', role: 'teacher', icon: Sparkles },
    { label: lang === 'ar' ? 'اختبار الطالب' : 'Student Exam', path: '/student/exam', role: 'student', icon: BookOpen },
    { label: lang === 'ar' ? 'سوق المعلمين' : 'Teacher Market', path: '/marketplace', icon: ExternalLink }
  ];

  const activeRoleObj = rolesList.find(r => r.id === currentRole) || rolesList[1];
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
          width: '360px',
          maxHeight: '80vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.22)',
          padding: '16px',
          backdropFilter: 'blur(20px)'
        }} className="animate-fade-in">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--primary)" />
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--primary)' }}>
                {lang === 'ar' ? 'مبدل الأدوار الفوري - متفوّق' : 'Motafawweq Role Switcher'}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Live Demo</span>
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
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? `1.5px solid ${item.color}` : '1px solid transparent',
                    backgroundColor: isSelected ? 'var(--primary-surface)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: isRtl ? 'right' : 'left',
                    transition: 'all 0.15s ease',
                    width: '100%'
                  }}
                >
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: `${item.color}20`,
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
                      fontWeight: '700',
                      color: isSelected ? item.color : 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span>{item.title}</span>
                      {isSelected && (
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: item.color,
                          color: '#FFFFFF'
                        }}>
                          {lang === 'ar' ? 'نشط' : 'Active'}
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
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
              {lang === 'ar' ? 'انتقال سريع لصفحة محددة:' : 'Direct URL Jump:'}
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
                      padding: '7px 9px',
                      fontSize: '11px',
                      fontWeight: '500',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: isRtl ? 'right' : 'left'
                    }}
                  >
                    <DemoIcon size={12} color="var(--primary)" />
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
          backgroundColor: 'var(--bg-surface-elevated)',
          border: `1.5px solid ${activeRoleObj.color}`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
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
          backgroundColor: `${activeRoleObj.color}25`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <IconComponent size={14} color={activeRoleObj.color} />
        </div>
        <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1 }}>
            {lang === 'ar' ? 'الدور الحالي' : 'Active Role'}
          </div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.2 }}>
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
