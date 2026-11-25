import React from 'react';
import { Trophy, Eye, EyeOff, Target, Award } from 'lucide-react';
import { SCard, SSection, SBadge } from '../../../components/student/ui';
import { Avatar } from '../../../components/common/Avatar';
import {
  DAILY_GOAL_OPTIONS,
  WEEKLY_EXAMS_OPTIONS,
  TARGET_SCORE_OPTIONS,
  formatLeaderboardPreview,
} from './studentSettingsConfig';

export const StudyGoalsPrivacySection = ({
  formData,
  handleSelectChange,
  handleChange,
  lang,
  isRtl,
}) => {
  const isAr = lang === 'ar';

  const displayModes = [
    {
      id: 'full',
      labelAr: 'الاسم الكامل',
      labelEn: 'Full Name',
      descAr: 'يظهر اسمك الكامل كما هو في ملفك',
      descEn: 'Display your full profile name',
    },
    {
      id: 'initials',
      labelAr: 'الاسم الأول وحرف الثاني',
      labelEn: 'First Name + Initial',
      descAr: 'يظهر اسمك الأول متبوعاً بأول حرف من الاسم الثاني',
      descEn: 'First name followed by second initial',
    },
    {
      id: 'nickname',
      labelAr: 'اسم الشهرة / اللقب',
      labelEn: 'Nickname',
      descAr: 'يظهر لقبك المختار لزملائك في الدوري',
      descEn: 'Show your custom league nickname',
    },
  ];

  const previewName = formatLeaderboardPreview({
    name: formData.name,
    showOnLeaderboard: formData.showOnLeaderboard,
    displayNameMode: formData.displayNameMode,
    nickname: formData.nickname,
    isAr,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── 1. أهداف المذاكرة والتحديات ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'أهداف المذاكرة والتحديات الأسبوعية' : 'Study Goals & Weekly Challenges'}
          style={{ marginBottom: 0 }}
        >
          {/* هدف المذاكرة اليومي */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Target size={16} color="var(--primary)" />
              <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {isAr ? 'هدف المذاكرة اليومي' : 'Daily Study Goal'}
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 14px 0', lineHeight: 1.5 }}>
              {isAr
                ? 'يُستخدم لحساب نسبة إنجازك اليومي ومتابعة التزامك المستمر (Streak) على لوحة التحكم.'
                : 'Used to track your daily study progress and streak consistency on your dashboard.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '10px' }}>
              {DAILY_GOAL_OPTIONS.map((mins) => {
                const isSelected = Number(formData.dailyStudyGoalMinutes) === mins;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleSelectChange('dailyStudyGoalMinutes', mins)}
                    style={{
                      padding: '14px 10px',
                      borderRadius: 'var(--radius-lg)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                      backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(21, 136, 199, 0.16)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '20px', fontWeight: '800', color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                      {mins}
                    </span>
                    <span style={{ fontSize: '11.5px', fontWeight: isSelected ? '700' : '500', color: isSelected ? 'var(--primary)' : 'var(--text-secondary)' }}>
                      {isAr ? 'دقيقة / يوم' : 'min / day'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', marginBottom: '20px' }} />

          {/* هدف الاختبارات الأسبوعية + الدرجة المستهدفة */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="weekly-exams-goal" style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {isAr ? 'عدد الاختبارات المستهدف أسبوعياً' : 'Weekly Exams Target'}
              </label>
              <select
                id="weekly-exams-goal"
                value={formData.weeklyExamsGoal}
                onChange={(e) => handleSelectChange('weeklyExamsGoal', Number(e.target.value))}
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
                  fontFamily: 'var(--font-arabic)',
                }}
              >
                {WEEKLY_EXAMS_OPTIONS.map((num) => (
                  <option key={num} value={num}>
                    {isAr
                      ? (num === 1 ? 'اختبار واحد أسبوعياً' : num === 2 ? 'اختباران أسبوعياً' : `${num} اختبارات أسبوعياً`)
                      : `${num} ${num === 1 ? 'exam' : 'exams'} / week`}
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                {isAr
                  ? 'يضبط تلقائياً هدف تحدي الاختبارات الأسبوعي في صفحة الإنجازات والجوائز.'
                  : 'Automatically sets your weekly exam challenge goal in Achievements.'}
              </span>
            </div>

            <div>
              <label htmlFor="target-score-percent" style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {isAr ? 'معدل الدرجات المستهدف في الامتحانات' : 'Target Exam Score'}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {TARGET_SCORE_OPTIONS.map((pct) => {
                  const active = Number(formData.targetScorePercent) === pct;
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleSelectChange('targetScorePercent', pct)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: active ? '1.5px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: active ? 'var(--primary-surface)' : 'var(--bg-surface)',
                        color: active ? 'var(--primary)' : 'var(--text-primary)',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {pct}%
                    </button>
                  );
                })}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Award size={12} color="var(--primary)" />
                <span>{isAr ? 'المستوى الأكاديمي الذي تسعى لتحقيقه في اختباراتك.' : 'The score benchmark you aim to achieve on exams.'}</span>
              </span>
            </div>
          </div>
        </SSection>
      </SCard>

      {/* ── 2. الخصوصية والظهور في دوري المتفوقين ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'الخصوصية والظهور في دوري المتفوقين' : 'League Leaderboard Privacy'}
          style={{ marginBottom: 0 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* تفعيل / إخفاء الظهور */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: formData.showOnLeaderboard ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                    color: formData.showOnLeaderboard ? 'var(--primary)' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {formData.showOnLeaderboard ? <Trophy size={18} /> : <EyeOff size={18} />}
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {isAr ? 'إظهار اسمي وصورتي في لوحة المتصدرين' : 'Show my name & avatar on leaderboards'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {isAr
                      ? 'عند الإيقاف، يرى زملاؤك ترتيبك ونقاطك باسم "طالب متفوق (مخفي)" دون إظهار صورتك.'
                      : 'When off, classmates see you as "Top Student (Hidden)" without your avatar.'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={Boolean(formData.showOnLeaderboard)}
                aria-label={isAr ? 'الظهور في لوحة المتصدرين' : 'Show on leaderboard'}
                onClick={() => handleSelectChange('showOnLeaderboard', !formData.showOnLeaderboard)}
                style={{
                  position: 'relative',
                  width: '46px',
                  height: '26px',
                  borderRadius: '99px',
                  border: 'none',
                  backgroundColor: formData.showOnLeaderboard ? 'var(--primary)' : 'var(--border-medium)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background-color 0.2s ease',
                  padding: 0,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '3px',
                    insetInlineStart: formData.showOnLeaderboard ? '23px' : '3px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.22)',
                    transition: 'inset-inline-start 0.2s ease',
                  }}
                />
              </button>
            </div>

            {/* اختيار طريقة عرض الاسم عند تفعيل الظهور */}
            {formData.showOnLeaderboard && (
              <>
                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
                    {isAr ? 'طريقة عرض اسمك لزملائك في الدوري:' : 'How your name appears to classmates:'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
                    {displayModes.map((mode) => {
                      const active = formData.displayNameMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => handleSelectChange('displayNameMode', mode.id)}
                          style={{
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-md)',
                            border: active ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                            backgroundColor: active ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                            textAlign: isRtl ? 'right' : 'left',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ fontSize: '13px', fontWeight: '700', color: active ? 'var(--primary)' : 'var(--text-primary)' }}>
                            {isAr ? mode.labelAr : mode.labelEn}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.4 }}>
                            {isAr ? mode.descAr : mode.descEn}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {formData.displayNameMode === 'nickname' && (
                  <div style={{ maxWidth: '420px' }}>
                    <label htmlFor="league-nickname" style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
                      {isAr ? 'اسم الشهرة أو اللقب في الدوري' : 'League Nickname'}
                    </label>
                    <input
                      id="league-nickname"
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      maxLength={60}
                      placeholder={isAr ? 'مثال: د. عمر' : 'e.g. Dr. Omar'}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-medium)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        fontSize: '13.5px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'var(--font-arabic)',
                      }}
                    />
                    {!formData.nickname?.trim() && (
                      <span style={{ fontSize: '11.5px', color: 'var(--warning)', marginTop: '4px', display: 'block', fontWeight: '600' }}>
                        {isAr ? 'أدخل لقباً لكي يظهر بدلاً من اسمك الكامل.' : 'Enter a nickname to display instead of your full name.'}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}

            {/* معاينة مباشرة لشكل الظهور في لوحة الدوري */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px dashed var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Avatar
                  src={formData.showOnLeaderboard ? formData.avatar : null}
                  name={previewName}
                  size={36}
                />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={12} />
                    <span>{isAr ? 'معاينة ظهورك لزملائك في لوحة المتصدرين:' : 'Live preview for classmates on leaderboard:'}</span>
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {previewName}
                  </div>
                </div>
              </div>
              <SBadge variant={formData.showOnLeaderboard ? 'success' : 'default'} size="xs">
                {formData.showOnLeaderboard
                  ? (isAr ? 'ظاهر في الدوري' : 'Visible')
                  : (isAr ? 'وضع الخصوصية' : 'Private Mode')}
              </SBadge>
            </div>
          </div>
        </SSection>
      </SCard>
    </div>
  );
};
