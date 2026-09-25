import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { TEACHER_PROFILE } from '../../data/teacherData';
import {
  User,
  Shield,
  Palette,
  CreditCard,
  Building,
  GraduationCap,
  Save,
  CheckCircle2,
  Camera,
  Moon,
  Sun,
  Lock,
  Smartphone,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';

export const TeacherSettingsView = () => {
  const { lang, isRtl, toggleLanguage } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();

  const [activeTab, setActiveTab] = useState('profile');
  const [isSaved, setIsSaved] = useState(false);

  // Form State initialized from TEACHER_PROFILE
  const [formData, setFormData] = useState({
    nameAr: TEACHER_PROFILE.nameAr,
    nameEn: TEACHER_PROFILE.name,
    titleAr: TEACHER_PROFILE.titleAr,
    subjectAr: TEACHER_PROFILE.subjectAr,
    email: TEACHER_PROFILE.email,
    phone: TEACHER_PROFILE.phone,
    bioAr: TEACHER_PROFILE.bioAr,
    avatar: TEACHER_PROFILE.avatar,
    // Stages taught
    stagesTaught: ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي', 'الصف الثالث الإعدادي (علوم متقدمة)'],
    // Centers
    centers: TEACHER_PROFILE.centers,
    // Payout
    payoutMethods: TEACHER_PROFILE.payoutMethods,
    defaultPayout: 'pm-1',
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    // Notifications
    notifyWhatsappIntervention: true,
    notifyNewEnrollment: true,
    notifyExamSubmission: false
  });

  const [newCenterName, setNewCenterName] = useState('');
  const [newCenterLoc, setNewCenterLoc] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddCenter = () => {
    if (!newCenterName.trim()) return;
    const newCtr = {
      id: `ctr-${Date.now()}`,
      nameAr: newCenterName,
      location: newCenterLoc || 'القاهرة والجيزة',
      studentsCount: 0
    };
    setFormData({
      ...formData,
      centers: [...formData.centers, newCtr]
    });
    setNewCenterName('');
    setNewCenterLoc('');
  };

  const handleRemoveCenter = (id) => {
    setFormData({
      ...formData,
      centers: formData.centers.filter(c => c.id !== id)
    });
  };

  const tabs = [
    { id: 'profile', labelAr: 'البيانات الشخصية والأكاديمية', labelEn: 'Profile & Credentials', icon: User },
    { id: 'stages', labelAr: 'المراحل الدراسية والمناهج', labelEn: 'Stages & Curriculum', icon: GraduationCap },
    { id: 'centers', labelAr: 'فروع السناتر والمنصة', labelEn: 'Centers & Branches', icon: Building },
    { id: 'payouts', labelAr: 'طرق سحب الأرباح', labelEn: 'Payout Methods', icon: CreditCard },
    { id: 'preferences', labelAr: 'المظهر والتفضيلات', labelEn: 'Preferences & Theme', icon: Palette },
    { id: 'security', labelAr: 'الأمان وكلمة المرور', labelEn: 'Security & 2FA', icon: Shield }
  ];

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '32px 20px 120px',
      fontFamily: 'var(--font-arabic)',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            letterSpacing: '-0.3px'
          }}>
            {lang === 'ar' ? 'إعدادات حساب المعلم' : 'Teacher Account Settings'}
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            {lang === 'ar'
              ? 'تعديل الملف الشخصي، إدارة المراحل التدريسية، وفروع السناتر، ووسائل استلام المستحقات المالية'
              : 'Manage teacher profile, stages taught, center affiliations, and payout configurations.'}
          </p>
        </div>

        {isSaved && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.16)' : '#DCFCE7',
            color: '#10B981',
            fontSize: '13px',
            fontWeight: '800'
          }}>
            <CheckCircle2 size={16} />
            <span>{lang === 'ar' ? 'تم حفظ التعديلات بنجاح!' : 'Settings saved successfully!'}</span>
          </div>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '28px',
        borderBottom: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: isActive
                  ? (isDark ? 'rgba(0, 102, 204, 0.2)' : '#EBF5FF')
                  : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: isActive ? '800' : '600',
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Card */}
      <form onSubmit={handleSave}>
        <div style={{
          backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
          borderRadius: '24px',
          border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          marginBottom: '28px'
        }}>
          {/* 1. Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '20px' }}>
                {lang === 'ar' ? 'البيانات الشخصية والتعريف الأكاديمي' : 'Personal & Academic Identity'}
              </h2>

              {/* Avatar Section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={formData.avatar}
                    alt={formData.nameAr}
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid var(--primary)'
                    }}
                  />
                  <label
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => setFormData({ ...formData, avatar: re.target.result });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
                    {formData.nameAr}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {formData.titleAr}
                  </div>
                  <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '700' }}>
                    ✓ {lang === 'ar' ? 'معلم معتمد وموثق على المنصة' : 'Verified Motafawweq Educator'}
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'الاسم باللغة العربية' : 'Full Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'الاسم باللغة الإنجليزية' : 'Full Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'البريد الإلكتروني المهني' : 'Work Email'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'رقم الهاتف والتواصل' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'نبذة عن المعلم والمؤلفات (Bio)' : 'Teacher Bio'}
                </label>
                <textarea
                  rows={4}
                  value={formData.bioAr}
                  onChange={(e) => setFormData({ ...formData, bioAr: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                    lineHeight: '1.6',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>
          )}

          {/* 2. Stages Tab */}
          {activeTab === 'stages' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'المراحل والصفوف الدراسية التي تدرسها' : 'Stages & Grades Taught'}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                {lang === 'ar'
                  ? 'اختر الصفوف التي تظهر في بروفايلك وتتيح للطلاب التسجيل في مقرراتها'
                  : 'Select stages that appear on your public profile for student enrollments.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { grade: 'الصف الأول الثانوي', stage: 'المرحلة الثانوية' },
                  { grade: 'الصف الثاني الثانوي', stage: 'المرحلة الثانوية' },
                  { grade: 'الصف الثالث الثانوي', stage: 'المرحلة الثانوية (شهادة عامة)' },
                  { grade: 'الصف الثالث الإعدادي (علوم متقدمة)', stage: 'المرحلة الإعدادية' }
                ].map((item) => {
                  const isChecked = formData.stagesTaught.includes(item.grade);
                  return (
                    <label
                      key={item.grade}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        borderRadius: '14px',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
                        border: `1px solid ${isChecked ? 'var(--primary)' : (isDark ? 'var(--border-subtle)' : '#E2E8F0')}`,
                        cursor: 'pointer'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {item.grade}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {item.stage}
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const updated = isChecked
                            ? formData.stagesTaught.filter(g => g !== item.grade)
                            : [...formData.stagesTaught, item.grade];
                          setFormData({ ...formData, stagesTaught: updated });
                        }}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Centers Tab */}
          {activeTab === 'centers' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'فروع السناتر والمجموعات الحضورية' : 'Affiliated Centers & Groups'}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                {lang === 'ar'
                  ? 'إدارة مراكز التدريس المسجل بها مجموعاتك لربط جداول الحضور وسجلات الدرجات'
                  : 'Manage physical centers where your offline student groups are hosted.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {formData.centers.map((ctr) => (
                  <div
                    key={ctr.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
                      border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {ctr.nameAr}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {ctr.location} • {ctr.studentsCount} {lang === 'ar' ? 'طالب' : 'students'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveCenter(ctr.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        padding: '6px'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Center */}
              <div style={{
                padding: '18px',
                borderRadius: '16px',
                border: `1px dashed ${isDark ? 'rgba(255,255,255,0.2)' : '#CBD5E1'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'اسم السنتر الجديد...' : 'Center name...'}
                  value={newCenterName}
                  onChange={(e) => setNewCenterName(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '180px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'الموقع أو العنوان...' : 'Location / Address...'}
                  value={newCenterLoc}
                  onChange={(e) => setNewCenterLoc(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '180px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCenter}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={15} />
                  <span>{lang === 'ar' ? 'إضافة سنتر' : 'Add Center'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. Payouts Tab */}
          {activeTab === 'payouts' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'الحسابات البنكية واستلام الأرباح' : 'Payout Accounts & Financials'}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                {lang === 'ar'
                  ? 'حدد وسيلة الدفع الافتراضية لتحويل أرباح مبيعات الكورس والاشتراكات شهرياً'
                  : 'Configure default payout channels for monthly automated earnings disbursements.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {formData.payoutMethods.map((pm) => (
                  <label
                    key={pm.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
                      border: `1px solid ${formData.defaultPayout === pm.id ? 'var(--primary)' : (isDark ? 'var(--border-subtle)' : '#E2E8F0')}`,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: isDark ? 'rgba(0, 102, 204, 0.16)' : '#EBF5FF',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {pm.label}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                          {pm.address || pm.accountNumber || pm.phone}
                        </div>
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="defaultPayout"
                      checked={formData.defaultPayout === pm.id}
                      onChange={() => setFormData({ ...formData, defaultPayout: pm.id })}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                    />
                  </label>
                ))}
              </div>

              <div style={{
                padding: '14px 18px',
                borderRadius: '12px',
                backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : '#FEF3C7',
                color: isDark ? '#F59E0B' : '#B45309',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>
                  {lang === 'ar'
                    ? 'يتم تحويل الأرباح والمستحقات تلقائياً في أول 3 أيام عمل من كل شهر ميلادي.'
                    : 'Payouts are executed automatically within the first 3 business days of each calendar month.'}
                </span>
              </div>
            </div>
          )}

          {/* 5. Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'المظهر واللغة والإشعارات' : 'Theme, Language & Preferences'}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                {lang === 'ar' ? 'تخصيص واجهة المنصة بما يناسب راحة عينك ونظام تنبيهاتك' : 'Customize platform interface and alerts.'}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {/* Theme Toggle */}
                <div style={{
                  padding: '18px',
                  borderRadius: '16px',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
                  border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'وضع المظهر (Dark / Light)' : 'Color Theme'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    {isDark ? (lang === 'ar' ? 'الوضع الليلي مفعّل' : 'Dark mode enabled') : (lang === 'ar' ? 'الوضع النهاري مفعّل' : 'Light mode enabled')}
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                      color: 'var(--text-primary)',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {isDark ? <Sun size={15} /> : <Moon size={15} />}
                    <span>{isDark ? (lang === 'ar' ? 'التبديل إلى النهاري' : 'Switch to Light') : (lang === 'ar' ? 'التبديل إلى الليلي' : 'Switch to Dark')}</span>
                  </button>
                </div>

                {/* Language Toggle */}
                <div style={{
                  padding: '18px',
                  borderRadius: '16px',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
                  border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'لغة الواجهة (Language)' : 'Interface Language'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    {lang === 'ar' ? 'العربية (الافتراضية)' : 'English'}
                  </div>
                  <button
                    type="button"
                    onClick={toggleLanguage}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                      color: 'var(--text-primary)',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}</span>
                  </button>
                </div>
              </div>

              {/* Notification Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'تنبيه واتساب فوري عند غياب طالب أو تعثره' : 'Instant WhatsApp alert on student risk'}
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.notifyWhatsappIntervention}
                    onChange={(e) => setFormData({ ...formData, notifyWhatsappIntervention: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'إشعار فوري عند اشتراك طالب جديد في الكورس' : 'Instant notification on new student enrollment'}
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.notifyNewEnrollment}
                    onChange={(e) => setFormData({ ...formData, notifyNewEnrollment: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* 6. Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'كلمة المرور والمصادقة الثنائية' : 'Password & Security'}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                {lang === 'ar' ? 'حماية حساب المعلم وبنك الأسئلة وسجلات الدرجات' : 'Protect your teacher account and examination question bank.'}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* 2FA Card */}
              <div style={{
                padding: '18px 20px',
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
                border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.16)' : '#DCFCE7',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? 'المصادقة الثنائية (2FA عبر رسائل SMS / واتساب)' : 'Two-Factor Authentication (2FA)'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'طلب رمز تأكيد إضافي عند تسجيل الدخول من جهاز جديد' : 'Require confirmation code when logging in from new devices.'}
                    </div>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={formData.twoFactorEnabled}
                  onChange={(e) => setFormData({ ...formData, twoFactorEnabled: e.target.checked })}
                  style={{ width: '20px', height: '20px', accentColor: '#10B981' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 102, 204, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            <Save size={16} />
            <span>{lang === 'ar' ? 'حفظ كافة التعديلات' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
