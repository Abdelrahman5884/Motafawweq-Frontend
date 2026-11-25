import React from 'react';
import { Sun, Moon, Gauge, CheckCircle2 } from 'lucide-react';
import { SCard, SSection } from '../../../components/student/ui';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { PLAYBACK_SPEED_OPTIONS } from './studentSettingsConfig';

export const PreferencesSettingsSection = ({
  formData,
  handleSelectChange,
  onSyncInstantPreference,
  lang,
}) => {
  const isAr = lang === 'ar';
  const { theme, setTheme } = useTheme();
  const { setLang } = useLanguage();

  const handleThemeSelect = (nextTheme) => {
    if (theme === nextTheme) return;
    setTheme(nextTheme);
    if (onSyncInstantPreference) {
      onSyncInstantPreference({ theme: nextTheme });
    }
  };

  const handleLangSelect = (nextLang) => {
    if (lang === nextLang) return;
    setLang(nextLang);
    if (onSyncInstantPreference) {
      onSyncInstantPreference({ language: nextLang });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── 1. نمط المظهر والألوان (Theme Mode) ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'المظهر ونمط الألوان' : 'Theme & Color Mode'}
          style={{ marginBottom: 0 }}
        >
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
            {isAr
              ? 'اختر النمط المريح لعينيك أثناء المذاكرة — يُطبَّق فوراً ويُحفظ لحسابك.'
              : 'Choose your preferred visual mode — applied immediately and saved to your account.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
            {/* الوضع الفاتح */}
            <button
              type="button"
              onClick={() => handleThemeSelect('light')}
              style={{
                borderRadius: 'var(--radius-lg)',
                border: theme === 'light' ? '2.5px solid var(--primary)' : '1.5px solid var(--border-medium)',
                backgroundColor: theme === 'light' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                textAlign: 'inherit',
                boxShadow: theme === 'light' ? '0 4px 18px rgba(21, 136, 199, 0.18)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#FFFBEB',
                    color: '#D97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sun size={20} />
                </div>
                {theme === 'light' && <CheckCircle2 size={18} color="var(--primary)" />}
              </div>

              <div
                style={{
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '20px', height: '6px', borderRadius: '3px', backgroundColor: '#1588C7' }} />
                  <div style={{ width: '40px', height: '6px', borderRadius: '3px', backgroundColor: '#E2E8F0' }} />
                </div>
                <div style={{ width: '100%', height: '18px', borderRadius: '4px', backgroundColor: '#F1F5F9' }} />
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {isAr ? 'الوضع الفاتح' : 'Light Mode'}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {isAr ? 'ألوان ساطعة ومريحة لإضاءة النهار' : 'Crisp contrast for daytime study'}
                </div>
              </div>
            </button>

            {/* الوضع الليلي */}
            <button
              type="button"
              onClick={() => handleThemeSelect('dark')}
              style={{
                borderRadius: 'var(--radius-lg)',
                border: theme === 'dark' ? '2.5px solid var(--primary)' : '1.5px solid var(--border-medium)',
                backgroundColor: theme === 'dark' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                textAlign: 'inherit',
                boxShadow: theme === 'dark' ? '0 4px 18px rgba(92, 182, 219, 0.22)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#0E294B',
                    color: '#5CB6DB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Moon size={20} />
                </div>
                {theme === 'dark' && <CheckCircle2 size={18} color="var(--primary)" />}
              </div>

              <div
                style={{
                  borderRadius: '8px',
                  backgroundColor: '#081D37',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '20px', height: '6px', borderRadius: '3px', backgroundColor: '#5CB6DB' }} />
                  <div style={{ width: '40px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
                </div>
                <div style={{ width: '100%', height: '18px', borderRadius: '4px', backgroundColor: '#041427' }} />
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {isAr ? 'الوضع الليلي' : 'Dark Mode'}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {isAr ? 'كحلي عميق هادئ لتقليل إجهاد العين ليلاً' : 'Deep navy for comfortable night study'}
                </div>
              </div>
            </button>
          </div>
        </SSection>
      </SCard>

      {/* ── 2. لغة الواجهة (Language) ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'لغة الواجهة' : 'Interface Language'}
          style={{ marginBottom: 0 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
            <button
              type="button"
              onClick={() => handleLangSelect('ar')}
              style={{
                borderRadius: 'var(--radius-lg)',
                border: lang === 'ar' ? '2.5px solid var(--primary)' : '1.5px solid var(--border-medium)',
                backgroundColor: lang === 'ar' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'inherit',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary)' }}>ع</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    اللغة العربية (مصر)
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    واجهة عربية متكاملة (RTL)
                  </div>
                </div>
              </div>
              {lang === 'ar' && <CheckCircle2 size={18} color="var(--primary)" />}
            </button>

            <button
              type="button"
              onClick={() => handleLangSelect('en')}
              style={{
                borderRadius: 'var(--radius-lg)',
                border: lang === 'en' ? '2.5px solid var(--primary)' : '1.5px solid var(--border-medium)',
                backgroundColor: lang === 'en' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'inherit',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--primary)' }}>EN</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    English
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Left-to-right interface (LTR)
                  </div>
                </div>
              </div>
              {lang === 'en' && <CheckCircle2 size={18} color="var(--primary)" />}
            </button>
          </div>
        </SSection>
      </SCard>

      {/* ── 3. سرعة تشغيل مشغل الحصص الافتراضية ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'مشغل الحصص الدراسية' : 'Lesson Player Preference'}
          style={{ marginBottom: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gauge size={16} color="var(--primary)" />
                <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {isAr ? 'سرعة التشغيل الافتراضية للفيديو والصوت' : 'Default Video & Audio Playback Speed'}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                {isAr
                  ? 'تُطبّق تلقائياً عند فتح أي حصة في صفحة حصصي مع إمكانية تغييرها داخل المشغل.'
                  : 'Applied automatically whenever you open a lesson in My Lessons.'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {PLAYBACK_SPEED_OPTIONS.map((spd) => {
                const isSelected = (formData.playbackSpeed || '1.0x') === spd;
                return (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => handleSelectChange('playbackSpeed', spd)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-medium)',
                      backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-surface)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {spd}
                  </button>
                );
              })}
            </div>
          </div>
        </SSection>
      </SCard>
    </div>
  );
};
