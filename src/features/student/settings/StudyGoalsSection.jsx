import React from 'react';
import { Target, Clock, BookOpen, Coffee, Award, Sparkles, Check } from 'lucide-react';
import { SCard, SSection, SBadge } from '../../../components/student/ui';

export const StudyGoalsSection = ({
  formData,
  handleSelectChange,
  handlePreferenceToggle,
  lang,
  isRtl
}) => {
  const goalMinutes = [30, 45, 60, 90, 120];
  const weeklyLessons = [4, 6, 8, 10, 12];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── 1. هدف المذاكرة اليومي ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={lang === 'ar' ? 'هدف المذاكرة اليومي (التركيز المستمر)' : 'Daily Study Goal'}
          style={{ marginBottom: 0 }}
        >
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            margin: '0 0 16px 0',
            lineHeight: 1.5
          }}>
            {lang === 'ar'
              ? 'تحديد وقت يومي يساعدك في الحفاظ على سلسلة أيامك (Streak) والحصول على شارات التميز الأسبوعية في دوري المتفوقين.'
              : 'Consistent daily study builds your streak and unlocks weekly league badges.'}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}>
            {goalMinutes.map((mins) => {
              const isSelected = (formData.dailyGoalMinutes || 60) === mins;
              return (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleSelectChange('dailyGoalMinutes', mins)}
                  style={{
                    padding: '16px 12px',
                    borderRadius: 'var(--radius-lg)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 14px rgba(21, 136, 199, 0.16)' : 'none'
                  }}
                >
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    color: isSelected ? 'var(--primary)' : 'var(--text-primary)'
                  }}>
                    {mins}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: isSelected ? '700' : '500'
                  }}>
                    {lang === 'ar' ? 'دقيقة / يومياً' : 'min / day'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* تنبيه استراحة بومودورو */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--warning-light)',
                color: 'var(--warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Coffee size={18} />
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'تذكير أخذ استراحة ذكية (Pomodoro 45/10)' : 'Smart Rest Reminder (45/10)'}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {lang === 'ar' ? 'ينبهك المشغل بلطف لأخذ 10 دقائق استراحة كل 45 دقيقة مذاكرة متواصلة.' : 'Gentle prompt to stretch after 45 min of focused learning.'}
                </div>
              </div>
            </div>

            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.pomodoroReminder !== false}
                onChange={(e) => handlePreferenceToggle('pomodoroReminder', e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: formData.pomodoroReminder !== false ? 'var(--primary)' : 'var(--border-medium)',
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
                  transform: formData.pomodoroReminder !== false
                    ? (isRtl ? 'translateX(-22px)' : 'translateX(22px)')
                    : (isRtl ? 'translateX(-3px)' : 'translateX(3px)')
                }} />
              </span>
            </label>
          </div>
        </SSection>
      </SCard>

      {/* ── 2. الحصص الأسبوعية وأوقات التركيز ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={lang === 'ar' ? 'الحصص الأسبوعية المستهدفة' : 'Weekly Lesson Targets'}
          style={{ marginBottom: 0 }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            {/* عدد الحصص الأسبوعية */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {lang === 'ar' ? 'عدد الحصص المطلوب إنجازها أسبوعياً' : 'Target Lessons Completed Weekly'}
              </label>
              <select
                value={formData.weeklyLessonsTarget || 8}
                onChange={(e) => handleSelectChange('weeklyLessonsTarget', Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-arabic)'
                }}
              >
                {weeklyLessons.map(num => (
                  <option key={num} value={num}>
                    {lang === 'ar' ? `${num} حصص في الأسبوع` : `${num} lessons / week`}
                  </option>
                ))}
              </select>
            </div>

            {/* الوقت المفضل للمذاكرة */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {lang === 'ar' ? 'الوقت الذهبي المفضل للمذاكرة' : 'Preferred Prime Study Time'}
              </label>
              <select
                value={formData.preferredStudyTime || 'evening'}
                onChange={(e) => handleSelectChange('preferredStudyTime', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-arabic)'
                }}
              >
                <option value="morning">{lang === 'ar' ? 'الصباح الباكر (06:00 ص - 10:00 ص)' : 'Early Morning (06:00 - 10:00 AM)'}</option>
                <option value="afternoon">{lang === 'ar' ? 'بعد الظهر والعصر (02:00 م - 06:00 م)' : 'Afternoon (02:00 - 06:00 PM)'}</option>
                <option value="evening">{lang === 'ar' ? 'المساء والليل (07:00 م - 12:00 ص)' : 'Evening (07:00 PM - 12:00 AM)'}</option>
              </select>
            </div>
          </div>
        </SSection>
      </SCard>
    </div>
  );
};
