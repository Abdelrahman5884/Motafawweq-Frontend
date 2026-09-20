import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_CENTER_DATA } from '../../data/mockData';
import { 
  Building2, 
  Users, 
  BookOpen, 
  DollarSign, 
  Sparkles, 
  Settings, 
  CheckCircle2, 
  Globe, 
  Palette,
  MapPin
} from 'lucide-react';

export const CenterDashboard = () => {
  const { lang, isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'branding'
  const [centerName, setCenterName] = useState('أكاديمية الرواد التعليمية');
  const [customDomain, setCustomDomain] = useState('alrowad.learnora.me');
  const [primaryBrandColor, setPrimaryBrandColor] = useState('#1588C7');
  const [savedBranding, setSavedBranding] = useState(false);

  const center = MOCK_CENTER_DATA;

  const handleSaveBranding = (e) => {
    e.preventDefault();
    setSavedBranding(true);
    setTimeout(() => setSavedBranding(false), 2000);
  };

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '36px 24px 80px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Building2 size={20} color="var(--primary)" />
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.5px' }}>
              {lang === 'ar' ? 'إدارة السنتر التعليمي' : 'Learning Center Hub'}
            </span>
          </div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: 0,
            fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
          }}>
            {lang === 'ar' ? center.nameAr : center.name}
          </h1>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {center.branches.join(' • ')}
          </div>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'inline-flex',
          backgroundColor: 'var(--bg-subtle)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: activeTab === 'overview' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'overview' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {lang === 'ar' ? 'نظرة عامة والمدرسين' : 'Overview & Teachers'}
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: activeTab === 'branding' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'branding' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {lang === 'ar' ? 'تخصيص هوية السنتر (White-Label)' : 'White-Label Branding'}
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Key Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
            marginBottom: '32px'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '22px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {lang === 'ar' ? 'إجمالي دخل السنتر الشهري' : 'Center Monthly Gross'}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#10B981', fontFamily: 'var(--font-heading)' }}>
                {center.monthlyRevenueEgp.toLocaleString()} <span style={{ fontSize: '13px' }}>{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '22px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {lang === 'ar' ? 'الطلاب النشطون بالقاعات' : 'Active Students in Halls'}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                {center.totalStudents.toLocaleString()}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '22px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {lang === 'ar' ? 'طاقم المعلمين المعتمدين' : 'Rostered Teachers'}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#F59E0B', fontFamily: 'var(--font-heading)' }}>
                {center.totalTeachers} {lang === 'ar' ? 'معلماً' : 'Teachers'}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '22px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {lang === 'ar' ? 'متوسط حضور القاعات' : 'Average Hall Attendance'}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#06B6D4', fontFamily: 'var(--font-heading)' }}>
                {center.avgAttendanceRate}%
              </div>
            </div>
          </div>

          {/* Rostered Teachers Table */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
              {lang === 'ar' ? 'جدول معلمي السنتر ونسب الإشغال' : 'Center Faculty Roster & Split'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'د. سلمى السيد', subject: 'الأحياء - 3 ثانوي', students: 380, split: '80% / 20%', hall: 'قاعة النخبة (الدقي)' },
                { name: 'د. هاني الشناوي', subject: 'الفيزياء الحديثة', students: 320, split: '75% / 25%', hall: 'قاعة رقم 1' },
                { name: 'أ. محمود راضي', subject: 'الكيمياء', students: 260, split: '80% / 20%', hall: 'قاعة رقم 2' },
                { name: 'م. أحمد عادل', subject: 'الرياضيات', students: 210, split: '75% / 25%', hall: 'قاعة رقم 3' }
              ].map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>
                      {t.subject} • {t.hall}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'الطلاب' : 'Students'}</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{t.students}</div>
                    </div>
                    <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'نسبة السنتر' : 'Split'}</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#10B981' }}>{t.split}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* White-Label Branding Tab */
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {lang === 'ar' ? 'تخصيص الهوية والشعار الخاص بالسنتر' : 'White-Label Branding Settings'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {lang === 'ar' 
              ? 'اجعل تجربة الطلاب وأولياء الأمور تحمل اسم وهوية السنتر بالكامل دون ظهور اسم ليرنورا.'
              : 'Students and parents will see your center branding, custom domain, and bespoke certificates.'}
          </p>

          <form onSubmit={handleSaveBranding} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '600px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {lang === 'ar' ? 'اسم السنتر أو الأكاديمية' : 'Center Name'}
              </label>
              <input
                type="text"
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  fontSize: '14px',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {lang === 'ar' ? 'الدومين المخصص (Custom Domain)' : 'Custom Domain'}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {lang === 'ar' ? 'اللون الأساسي لشاشات الطلاب' : 'Primary Brand Color'}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="color"
                  value={primaryBrandColor}
                  onChange={(e) => setPrimaryBrandColor(e.target.value)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  {primaryBrandColor}
                </span>
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: savedBranding ? '#10B981' : 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                width: 'fit-content'
              }}
            >
              <CheckCircle2 size={16} />
              <span>{savedBranding ? (lang === 'ar' ? 'تم حفظ التعديلات!' : 'Settings Saved!') : (lang === 'ar' ? 'حفظ إعدادات الهوية' : 'Save Branding')}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
