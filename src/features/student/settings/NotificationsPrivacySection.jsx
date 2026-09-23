import React from 'react';
import {
  Bell,
  MessageSquare,
  Flame,
  FileCheck2,
  Trophy,
  Shield,
  Eye,
  EyeOff,
  Share2,
  Download,
  AlertTriangle
} from 'lucide-react';
import { SCard, SSection, SBadge, SButton } from '../../../components/student/ui';

export const NotificationsPrivacySection = ({
  formData,
  handlePreferenceToggle,
  handleExportData,
  lang,
  isRtl
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── 1. قنوات الإشعارات والتنبيهات ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={lang === 'ar' ? 'الإشعارات وقنوات التواصل' : 'Notifications & Alerts'}
          style={{ marginBottom: 0 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* تنبيهات الواتساب */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--success-light)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MessageSquare size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'تنبيهات مواعيد الحصص والاختبارات عبر الواتساب' : 'WhatsApp Lesson & Exam Alerts'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {lang === 'ar' ? 'رسالة تذكير قبل موعد الحصة أو الاختبار بساعة لعدم نسيانها.' : 'Get a reminder message 1 hour before scheduled events.'}
                  </div>
                </div>
              </div>

              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={formData.notifyWhatsapp !== false}
                  onChange={(e) => handlePreferenceToggle('notifyWhatsapp', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: formData.notifyWhatsapp !== false ? 'var(--primary)' : 'var(--border-medium)',
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
                    transform: formData.notifyWhatsapp !== false
                      ? (isRtl ? 'translateX(-22px)' : 'translateX(22px)')
                      : (isRtl ? 'translateX(-3px)' : 'translateX(3px)')
                  }} />
                </span>
              </label>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

            {/* تذكير الستريك اليومي */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--warning-light)',
                  color: 'var(--warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Flame size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'تذكير الحفاظ على السلسلة والستريك اليومي' : 'Daily Streak Protection Alert'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {lang === 'ar' ? 'إشعار لطيف مساءً في حال لم تُكمل هدفك اليومي لحماية سلسلتك.' : 'Sent at 8:00 PM if you have not met your daily study goal.'}
                  </div>
                </div>
              </div>

              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={formData.notifyStreak !== false}
                  onChange={(e) => handlePreferenceToggle('notifyStreak', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: formData.notifyStreak !== false ? 'var(--primary)' : 'var(--border-medium)',
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
                    transform: formData.notifyStreak !== false
                      ? (isRtl ? 'translateX(-22px)' : 'translateX(22px)')
                      : (isRtl ? 'translateX(-3px)' : 'translateX(3px)')
                  }} />
                </span>
              </label>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

            {/* تصحيح الواجبات من المعلمين */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileCheck2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'تصحيح الواجبات وملاحظات المعلمين' : 'Graded Homework & Teacher Feedback'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {lang === 'ar' ? 'إشعار فوري عند وضع المعلم الدرجة وملاحظات التحسين على واجبك.' : 'Get notified as soon as a teacher reviews your submission.'}
                  </div>
                </div>
              </div>

              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={formData.notifyHomework !== false}
                  onChange={(e) => handlePreferenceToggle('notifyHomework', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: formData.notifyHomework !== false ? 'var(--primary)' : 'var(--border-medium)',
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
                    transform: formData.notifyHomework !== false
                      ? (isRtl ? 'translateX(-22px)' : 'translateX(22px)')
                      : (isRtl ? 'translateX(-3px)' : 'translateX(3px)')
                  }} />
                </span>
              </label>
            </div>
          </div>
        </SSection>
      </SCard>

      {/* ── 2. الخصوصية ودوري المتفوقين ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={lang === 'ar' ? 'الخصوصية ودوري المتفوقين (League)' : 'Privacy & Leaderboard Visibility'}
          style={{ marginBottom: 0 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* الظهور في لوحة الشرف */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Trophy size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'الظهور في لوحة شرف دوري المتفوقين' : 'Show on League Leaderboard'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {lang === 'ar' ? 'السماح للزملاء برؤية اسمك ونقاطك، أو الظهور كـ "طالب متفوق مجهول".' : 'Allow classmates to see your points or remain anonymous.'}
                  </div>
                </div>
              </div>

              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={formData.leaderboardVisible !== false}
                  onChange={(e) => handlePreferenceToggle('leaderboardVisible', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: formData.leaderboardVisible !== false ? 'var(--primary)' : 'var(--border-medium)',
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
                    transform: formData.leaderboardVisible !== false
                      ? (isRtl ? 'translateX(-22px)' : 'translateX(22px)')
                      : (isRtl ? 'translateX(-3px)' : 'translateX(3px)')
                  }} />
                </span>
              </label>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

            {/* إرسال تقرير أسبوعي لولي الأمر */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Shield size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'إرسال التقرير الأسبوعي لبوابة ولي الأمر' : 'Send Weekly Report to Parent Portal'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {lang === 'ar' ? 'مشاركة ملخص درجاتك وساعات التزامك الأسبوعية تلقائياً مع ولي أمرك.' : 'Automatically sync your weekly progress with your parents.'}
                  </div>
                </div>
              </div>

              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={formData.parentReportSync !== false}
                  onChange={(e) => handlePreferenceToggle('parentReportSync', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: formData.parentReportSync !== false ? 'var(--primary)' : 'var(--border-medium)',
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
                    transform: formData.parentReportSync !== false
                      ? (isRtl ? 'translateX(-22px)' : 'translateX(22px)')
                      : (isRtl ? 'translateX(-3px)' : 'translateX(3px)')
                  }} />
                </span>
              </label>
            </div>
          </div>
        </SSection>
      </SCard>

      {/* ── 3. النسخ الاحتياطي والبيانات ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={lang === 'ar' ? 'بياناتك وملاحظاتك الدراسية' : 'Data & Notes Backup'}
          style={{ marginBottom: 0 }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'تصدير نسخة كاملة من ملاحظاتك وملخصاتك' : 'Export Complete Study Archive'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {lang === 'ar' ? 'تنزيل أرشيف يضم كافة ملخصات كورنيل والتفريغات النصية ونتائج الامتحانات.' : 'Download a ZIP archive with your notes, transcripts, and exam analytics.'}
              </div>
            </div>

            <SButton
              variant="ghost"
              size="sm"
              icon={<Download />}
              onClick={handleExportData}
            >
              {lang === 'ar' ? 'تحميل الأرشيف (PDF & JSON)' : 'Download Archive'}
            </SButton>
          </div>
        </SSection>
      </SCard>
    </div>
  );
};
