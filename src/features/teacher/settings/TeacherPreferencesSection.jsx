import React from 'react';
import { Sun, Moon, Languages, Globe, CheckCircle2 } from 'lucide-react';
import { SCard, SSection } from '../../../components/student/ui';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';

export const TeacherPreferencesSection = ({ onSyncPreference, lang }) => {
  const isAr = lang === 'ar';
  const { theme, setTheme } = useTheme();
  const { setLang } = useLanguage();

  const handleSelectTheme = (nextTheme) => {
    if (theme === nextTheme) return;
    setTheme(nextTheme);
    if (onSyncPreference) {
      onSyncPreference({ preferred_theme: nextTheme });
    }
  };

  const handleSelectLang = (nextLang) => {
    if (lang === nextLang) return;
    setLang(nextLang);
    if (onSyncPreference) {
      onSyncPreference({ preferred_lang: nextLang });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── 1. المظهر ونمط الألوان ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'المظهر ونمط الألوان' : 'Theme & Color Mode'}
          style={{ marginBottom: 0 }}
        >
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
            {isAr
              ? 'اختر النمط المريح لعينيك أثناء التحضير والتدريس — يُطبّق فوراً ويُحفظ تلقائياً في حسابك.'
              : 'Choose your preferred visual mode — applied immediately and saved automatically.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {/* Light Mode */}
            <button
              type="button"
              onClick={() => handleSelectTheme('light')}
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
                fontFamily: 'inherit',
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
                  <div style={{ width: '22px', height: '6px', borderRadius: '3px', backgroundColor: '#1588C7' }} />
                  <div style={{ width: '42px', height: '6px', borderRadius: '3px', backgroundColor: '#E2E8F0' }} />
                </div>
                <div style={{ width: '100%', height: '18px', borderRadius: '4px', backgroundColor: '#F1F5F9' }} />
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {isAr ? 'الوضع الفاتح النهاري' : 'Light Mode'}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {isAr ? 'ألوان ساطعة ونقية لضوء النهار' : 'Crisp contrast for daytime'}
                </div>
              </div>
            </button>

            {/* Dark Mode */}
            <button
              type="button"
              onClick={() => handleSelectTheme('dark')}
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
                fontFamily: 'inherit',
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
                  border: '1px solid rgba(255,255,255,0.12)',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '22px', height: '6px', borderRadius: '3px', backgroundColor: '#5CB6DB' }} />
                  <div style={{ width: '42px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
                </div>
                <div style={{ width: '100%', height: '18px', borderRadius: '4px', backgroundColor: '#041427' }} />
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {isAr ? 'الوضع الليلي الهادئ' : 'Dark Mode'}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {isAr ? 'كحلي عميق هادئ لتقليل إجهاد العين' : 'Deep navy for calm night preparation'}
                </div>
              </div>
            </button>
          </div>
        </SSection>
      </SCard>

      {/* ── 2. لغة الواجهة ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'لغة الواجهة' : 'Interface Language'}
          style={{ marginBottom: 0 }}
        >
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
            {isAr
              ? 'اختر اللغة المناسبة لواجهة تدريسك. يتم تطبيق اتجاه النصوص (RTL / LTR) وحفظ اختيارك تلقائياً.'
              : 'Choose your preferred interface language. Text direction and preference update immediately.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <button
              type="button"
              onClick={() => handleSelectLang('ar')}
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
                fontFamily: 'inherit',
                boxShadow: lang === 'ar' ? '0 4px 18px rgba(21, 136, 199, 0.16)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Languages size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    اللغة العربية
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
              onClick={() => handleSelectLang('en')}
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
                fontFamily: 'inherit',
                boxShadow: lang === 'en' ? '0 4px 18px rgba(21, 136, 199, 0.16)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Globe size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    English (US)
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
    </div>
  );
};
