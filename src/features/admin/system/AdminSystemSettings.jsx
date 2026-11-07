import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Settings,
  Server,
  Shield,
  Cpu,
  RefreshCw,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Activity,
  Zap
} from 'lucide-react';

export const AdminSystemSettings = () => {
  const { lang, isRtl } = useLanguage();
  const [toastMessage, setToastMessage] = useState(null);

  // Settings Toggles
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowTeacherRegistration: true,
    autoCertificates: true,
    antiPassback: true,
    highPerformanceAudio: true,
    logLevel: 'standard'
  });

  const [isFlushingCache, setIsFlushingCache] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggle = (key) => {
    setSettings(prev => {
      const next = { ...prev, [key]: !prev[key] };
      showToast(lang === 'ar' ? 'تم تحديث الإعداد وحفظ التغييرات' : 'Setting updated');
      return next;
    });
  };

  const handleFlushCache = () => {
    setIsFlushingCache(true);
    setTimeout(() => {
      setIsFlushingCache(false);
      showToast(lang === 'ar' ? 'تم تفريغ الكاش (Redis / Browser Cache) بنجاح' : 'Cache cleared successfully');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: isRtl ? '24px' : 'auto',
          right: isRtl ? 'auto' : '24px',
          backgroundColor: 'var(--color-brand-dark)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: '600'
        }}>
          <CheckCircle2 size={18} color="var(--primary-light)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cluster Health & Server Telemetry */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px',
        padding: '22px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={22} color="var(--primary)" />
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'حالة السيرفرات وعناقيد الذكاء الاصطناعي' : 'Infrastructure Telemetry'}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'عناقيد معالجة الصوت ونماذج المعالجة الذكية على بطاقات الحوسبة الرسومية' : 'Whisper GPU nodes and server status'}
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            color: '#047857',
            fontSize: '12px',
            fontWeight: '700'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            <span>{lang === 'ar' ? 'جميع الأنظمة تعمل بكفاءة (جاهزية 99.98%)' : 'All Systems Operational (99.98% Uptime)'}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {[
            {
              label: lang === 'ar' ? 'زمن استجابة واجهة البرمجة (API)' : 'API Response Latency',
              val: '38ms',
              sub: lang === 'ar' ? 'استجابة فائقة السرعة' : 'Ultra Fast Latency',
              color: '#10B981'
            },
            {
              label: lang === 'ar' ? 'بطاقات معالجة الرسوميات النشطة' : 'Active GPU Clusters',
              val: '4x A10G',
              sub: lang === 'ar' ? 'جاهزية بنسبة 100%' : '100% Operational',
              color: 'var(--primary)'
            },
            {
              label: lang === 'ar' ? 'استهلاك الذاكرة المؤقتة' : 'In-Memory Cache (Redis)',
              val: '1.4 GB / 8 GB',
              sub: lang === 'ar' ? '17.5% قيد الاستخدام' : '17.5% Utilized',
              color: '#6366F1'
            },
            {
              label: lang === 'ar' ? 'معدل نجاح تحويل الصوت' : 'Audio Inference Success',
              val: '99.4%',
              sub: lang === 'ar' ? 'بدون أخطاء تذكر' : 'Zero Critical Errors',
              color: '#F59E0B'
            }
          ].map((item, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '14px',
                padding: '14px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px' }}>
                {item.val}
              </div>
              <div style={{ fontSize: '11px', color: item.color, fontWeight: '700' }}>
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Controls & Toggles */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px',
        padding: '22px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
          {lang === 'ar' ? 'مفاتيح التحكم وسياسات التشغيل' : 'Platform Policies & Toggles'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Maintenance Mode */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderRadius: '14px',
            backgroundColor: settings.maintenanceMode ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-subtle)',
            border: settings.maintenanceMode ? '1.5px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={16} color={settings.maintenanceMode ? '#EF4444' : 'var(--text-secondary)'} />
                <span>{lang === 'ar' ? 'وضع الصيانة للمنصة' : 'Platform Maintenance Mode'}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {lang === 'ar' ? 'عند التفعيل، تظهر رسالة صيانة مجدولة لجميع الطلاب وأولياء الأمور ويتم إيقاف العمليات مؤقتاً' : 'Temporarily lock public access for system maintenance'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={() => handleToggle('maintenanceMode')}
              style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: '#EF4444' }}
            />
          </div>

          {/* Teacher Self-Registration */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'السماح بتسجيل المعلمين الجدد ذاتياً' : 'Allow Teacher Self-Registration'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {lang === 'ar' ? 'يتيح لأي معلم إنشاء حساب جديد وتقديم ملف التوثيق للاعتماد' : 'Permits tutors to sign up and submit verification documents'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.allowTeacherRegistration}
              onChange={() => handleToggle('allowTeacherRegistration')}
              style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: 'var(--primary)' }}
            />
          </div>

          {/* Auto Certificates */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'إصدار الشهادات المعتمدة تلقائياً عند اجتياز الاختبار الشامل' : 'Auto-issue Certificates'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {lang === 'ar' ? 'توليد شهادة موثقة بباركود فوري برقم مسلسل معتمد عندما يحقق الطالب نسبة 85% فأكثر' : 'Automatically generate serial-numbered certificates for top scores'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoCertificates}
              onChange={() => handleToggle('autoCertificates')}
              style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: 'var(--primary)' }}
            />
          </div>

          {/* Anti-Passback Gate Security */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'منع تكرار مسح الباركود في بوابات السنتر' : 'Anti-Passback Gate Protection'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {lang === 'ar' ? 'حظر استخدام نفس كود الحضور مرتين في أقل من 45 دقيقة لمنع تمرير الكود لزميل آخر' : 'Blocks duplicate entrance scans within 45 minutes'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.antiPassback}
              onChange={() => handleToggle('antiPassback')}
              style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: 'var(--primary)' }}
            />
          </div>
        </div>

        {/* Flush Cache Action */}
        <div style={{
          marginTop: '20px',
          paddingTop: '18px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'إفراغ الذاكرة المؤقتة' : 'Clear Platform Cache'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'تحديث وتفريغ مخزن الذاكرة فوراً لمزامنة التغييرات الجديدة على جميع الأجهزة' : 'Purge Redis cache and sync live assets immediately'}
            </div>
          </div>

          <button
            onClick={handleFlushCache}
            disabled={isFlushingCache}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-subtle)',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              cursor: isFlushingCache ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw size={14} className={isFlushingCache ? 'spin' : ''} />
            <span>{isFlushingCache ? (lang === 'ar' ? 'جارٍ الإفراغ...' : 'Purging...') : (lang === 'ar' ? 'إفراغ الكاش الآن' : 'Purge Cache')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

