import React from 'react';
import {
  Sun,
  Moon,
  Laptop,
  Globe,
  Gauge,
  FileSpreadsheet,
  Volume2,
  Sparkles,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { SCard, SSection, SBadge } from '../../../components/student/ui';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';

export const PreferencesSettingsSection = ({
  formData,
  handlePreferenceToggle,
  handleSelectChange,
  lang,
  isRtl
}) => {
  const { theme, setTheme } = useTheme();
  const { setLang } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── 1. نمط المظهر والألوان (Theme Mode) ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={lang === 'ar' ? 'المظهر ونمط الألوان' : 'Theme & Color Mode'}
          style={{ marginBottom: 0 }}
        >
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            margin: '0 0 16px 0',
            lineHeight: 1.5
          }}>
            {lang === 'ar'
              ? 'اختر النمط المفضل لعينيك. الألوان مصممة بعناية لتوفير أعلى درجات التركيز والهدوء أثناء ساعات المذاكرة الطويلة.'
              : 'Choose your visual comfort. Colors are calibrated for calm study sessions and minimal eye fatigue.'}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '14px'
          }}>
            {/* بطاقة الوضع الفاتح */}
            <div
              onClick={() => setTheme('light')}
              style={{
                borderRadius: 'var(--radius-lg)',
                border: theme === 'light' ? '2.5px solid var(--primary)' : '1.5px solid var(--border-medium)',
                backgroundColor: theme === 'light' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: theme === 'light' ? '0 4px 18px rgba(21, 136, 199, 0.18)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#FFFBEB',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sun size={20} />
                </div>
                {theme === 'light' && (
                  <CheckCircle2 size={18} color="var(--primary)" />
                )}
              </div>

              {/* معاينة مصغرة للوضع الفاتح */}
              <div style={{
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '20px', height: '6px', borderRadius: '3px', backgroundColor: '#1588C7' }} />
                  <div style={{ width: '40px', height: '6px', borderRadius: '3px', backgroundColor: '#E2E8F0' }} />
                </div>
                <div style={{ width: '100%', height: '18px', borderRadius: '4px', backgroundColor: '#F1F5F9' }} />
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'الوضع الفاتح الصباحي' : 'Light Mode'}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {lang === 'ar' ? 'ألوان ساطعة ونقية لضوء النهار' : 'Crisp contrast for daytime'}
                </div>
              </div>
            </div>

            {/* بطاقة الوضع الليلي الداكن */}
            <div
              onClick={() => setTheme('dark')}
              style={{
                borderRadius: 'var(--radius-lg)',
                border: theme === 'dark' ? '2.5px solid var(--primary)' : '1.5px solid var(--border-medium)',
                backgroundColor: theme === 'dark' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: theme === 'dark' ? '0 4px 18px rgba(92, 182, 219, 0.22)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#0E294B',
                  color: '#5CB6DB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Moon size={20} />
                </div>
                {theme === 'dark' && (
                  <CheckCircle2 size={18} color="var(--primary)" />
                )}
              </div>

              {/* معاينة مصغرة للوضع الداكن */}
              <div style={{
                borderRadius: '8px',
                backgroundColor: '#081D37',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '20px', height: '6px', borderRadius: '3px', backgroundColor: '#5CB6DB' }} />
                  <div style={{ width: '40px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
                </div>
                <div style={{ width: '100%', height: '18px', borderRadius: '4px', backgroundColor: '#041427' }} />
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'الوضع الليلي الهادئ' : 'Dark Mode'}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {lang === 'ar' ? 'كحلي عميق هادئ لتقليل إجهاد العين' : 'Deep navy for calm night study'}
                </div>
              </div>
            </div>
          </div>
        </SSection>
      </SCard>

      {/* ── 2. لغة المنصة (Language) ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={lang === 'ar' ? 'لغة الواجهة' : 'Interface Language'}
          style={{ marginBottom: 0 }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '14px'
          }}>
            {/* اللغة العربية */}
            <div
              onClick={() => setLang('ar')}
              style={{
                borderRadius: 'var(--radius-lg)',
                border: lang === 'ar' ? '2.5px solid var(--primary)' : '1.5px solid var(--border-medium)',
                backgroundColor: lang === 'ar' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>🇪🇬</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    اللغة العربية (مصر)
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    خط Cairo • متوافق مع المناهج
                  </div>
                </div>
              </div>
              {lang === 'ar' && <CheckCircle2 size={18} color="var(--primary)" />}
            </div>

            {/* اللغة الإنجليزية */}
            <div
              onClick={() => setLang('en')}
              style={{
                borderRadius: 'var(--radius-lg)',
                border: lang === 'en' ? '2.5px solid var(--primary)' : '1.5px solid var(--border-medium)',
                backgroundColor: lang === 'en' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>🌐</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    English (US)
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Inter & Outfit typography
                  </div>
                </div>
              </div>
              {lang === 'en' && <CheckCircle2 size={18} color="var(--primary)" />}
            </div>
          </div>
        </SSection>
      </SCard>

      {/* ── 3. مشغل الحصص وتجربة المذاكرة الذكية ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={lang === 'ar' ? 'تفضيلات مشغل الحصص والمذاكرة' : 'Study Player Preferences'}
          style={{ marginBottom: 0 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* سرعة التشغيل الافتراضية */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Gauge size={16} color="var(--primary)" />
                  <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'سرعة تشغيل الصوت والفيديو الافتراضية' : 'Default Playback Speed'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {lang === 'ar' ? 'تُطبق تلقائياً عند فتح أي حصة أو تسجيل ذكي.' : 'Applied automatically when opening lessons.'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {['1.0x', '1.25x', '1.5x', '1.75x', '2.0x'].map((spd) => {
                  const isSelected = (formData.playbackSpeed || '1.25x') === spd;
                  return (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => handleSelectChange('playbackSpeed', spd)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-surface)',
                        color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {spd}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

            {/* توليد ملخصات كورنيل تلقائياً */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileSpreadsheet size={16} color="var(--primary)" />
                  <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'توليد ملخصات كورنيل الذكية فوراً' : 'Auto-Generate Cornell Notes'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {lang === 'ar' ? 'يقوم الذكاء الاصطناعي بتنظيم خلاصة الحصة وأهم المصائد تلقائياً.' : 'AI creates formatted chapter summaries automatically.'}
                </div>
              </div>

              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.autoCornell !== false}
                  onChange={(e) => handlePreferenceToggle('autoCornell', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: formData.autoCornell !== false ? 'var(--primary)' : 'var(--border-medium)',
                  borderRadius: '24px',
                  transition: '0.2s',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    position: 'absolute',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    transition: '0.2s',
                    transform: formData.autoCornell !== false
                      ? (isRtl ? 'translateX(-22px)' : 'translateX(22px)')
                      : (isRtl ? 'translateX(-3px)' : 'translateX(3px)')
                  }} />
                </span>
              </label>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

            {/* المؤثرات الصوتية والاحتفالية */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Volume2 size={16} color="var(--primary)" />
                  <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'المؤثرات الصوتية وأصوات التفاعل' : 'Sound Effects & Celebrations'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {lang === 'ar' ? 'أصوات تشجيعية عند إنهاء الاختبارات وجمع نقاط الخبرة XP والمستويات.' : 'Plays gentle chimes when completing quizzes and XP.'}
                </div>
              </div>

              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.soundEffects !== false}
                  onChange={(e) => handlePreferenceToggle('soundEffects', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: formData.soundEffects !== false ? 'var(--primary)' : 'var(--border-medium)',
                  borderRadius: '24px',
                  transition: '0.2s',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    position: 'absolute',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    transition: '0.2s',
                    transform: formData.soundEffects !== false
                      ? (isRtl ? 'translateX(-22px)' : 'translateX(22px)')
                      : (isRtl ? 'translateX(-3px)' : 'translateX(3px)')
                  }} />
                </span>
              </label>
            </div>
          </div>
        </SSection>
      </SCard>
    </div>
  );
};
