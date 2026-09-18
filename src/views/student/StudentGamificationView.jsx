import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { STUDENT_PROFILE, STUDENT_BADGES, generateActivityStreakGrid } from '../../data/studentData';
import { 
  Flame, 
  Award, 
  Trophy, 
  Target, 
  Sparkles, 
  Zap, 
  Calendar, 
  CheckCircle2, 
  Star,
  Clock,
  ArrowRight,
  ArrowLeft,
  Crown
} from 'lucide-react';

export const StudentGamificationView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const student = STUDENT_PROFILE;

  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate 52 weeks GitHub-style activity matrix (US-85)
  const streakWeeks = useMemo(() => generateActivityStreakGrid(), []);

  // Intensity color mapper for GitHub squares
  const getSquareColor = (level) => {
    switch (level) {
      case 0: return 'var(--bg-subtle)';
      case 1: return '#86EFAC';
      case 2: return '#4ADE80';
      case 3: return '#22C55E';
      case 4: return '#15803D';
      default: return 'var(--bg-subtle)';
    }
  };

  // Weekly challenges (US-88)
  const challenges = [
    { id: 'ch-1', titleAr: 'تحدي عبقري الأحياء: حل 3 كويزات بدرجة 90%+', progress: '2 / 3', completed: false, xpReward: 250 },
    { id: 'ch-2', titleAr: 'تحدي الالتزام الأسبوعي: 5 أيام متتالية مذاكرة', progress: '5 / 5', completed: true, xpReward: 300 },
    { id: 'ch-3', titleAr: 'تحدي بنك الأخطاء: تصحيح 5 مفاهيم من بنك الأخطاء', progress: '3 / 5', completed: false, xpReward: 200 }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '28px 20px 80px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'نظام التحفيز وسجل الاستريك (Gamification & Streak) 🔥' : 'Gamification & Study Streak'}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          {lang === 'ar' ? 'سجل نشاطك الدراسي السنوي بنمط جيت هاب، شارات التميز، والتحديات الأسبوعية' : 'GitHub-style activity heatmap, badges, XP levels & weekly challenges'}
        </p>
      </div>

      {/* Level & XP Progression Hero (US-83 & US-84) */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #31104B 100%)',
        border: '1.5px solid #818CF8',
        borderRadius: '24px',
        padding: '28px',
        marginBottom: '28px',
        color: '#FFFFFF',
        boxShadow: '0 12px 36px rgba(79, 70, 229, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: '2px solid #818CF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px'
            }}>
              👑
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#A5B4FC', fontWeight: '800', textTransform: 'uppercase' }}>
                المستوى الحالي {student.level} • {student.levelTitleAr}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '900', marginTop: '2px' }}>
                {student.xp.toLocaleString()} XP
              </div>
            </div>
          </div>

          {/* Dual Streaks (Study Streak & Exam Streak) (US-85) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              padding: '12px 18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid #F59E0B',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#FDE68A' }}>
                🔥 {student.streakDays} يوماً
              </div>
              <div style={{ fontSize: '11px', color: '#FCD34D', fontWeight: '800' }}>
                استريك المذاكرة اليومية
              </div>
            </div>

            <div style={{
              padding: '12px 18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(56, 189, 248, 0.2)',
              border: '1px solid #38BDF8',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#BAE6FD' }}>
                ⚡ {student.examStreak} اختبارات
              </div>
              <div style={{ fontSize: '11px', color: '#7DD3FC', fontWeight: '800' }}>
                استريك الامتحانات المتواصلة
              </div>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#C7D2FE', marginBottom: '6px', fontWeight: '700' }}>
            <span>المستوى 9 (Senior Scholar)</span>
            <span>باقي 550 XP للوصول إلى المستوى 10 (Master Genius) 🚀</span>
          </div>
          <div style={{ width: '100%', height: '10px', borderRadius: '5px', backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
            <div style={{ width: '74%', height: '100%', borderRadius: '5px', background: 'linear-gradient(90deg, #818CF8 0%, #C084FC 100%)' }} />
          </div>
        </div>
      </div>

      {/* =========================================================================
          GITHUB-STYLE STUDY STREAK HEATMAP (US-85)
         ========================================================================= */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '24px',
        padding: '24px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} color="#10B981" />
            <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'سجل الالتزام الدراسي (Study Activity Heatmap) بنمط GitHub 🟩' : 'Study Activity Matrix (GitHub Style)'}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>أقل</span>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--bg-subtle)' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#86EFAC' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#4ADE80' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#22C55E' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#15803D' }} />
            <span>أكثر</span>
          </div>
        </div>

        {/* The 52-Week Grid */}
        <div style={{
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          <div style={{
            display: 'flex',
            gap: '3px',
            width: 'max-content'
          }}>
            {streakWeeks.map((week, wIdx) => (
              <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    style={{
                      width: '13px',
                      height: '13px',
                      borderRadius: '3px',
                      backgroundColor: getSquareColor(day.level),
                      border: '1px solid rgba(0,0,0,0.05)',
                      cursor: 'pointer',
                      transition: 'transform 0.1s ease'
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Hovered Day Tooltip Bar */}
        <div style={{
          marginTop: '12px',
          padding: '8px 14px',
          borderRadius: '10px',
          backgroundColor: 'var(--bg-subtle)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          minHeight: '36px',
          display: 'flex',
          alignItems: 'center'
        }}>
          {hoveredDay ? (
            <span>
              📅 <strong>{hoveredDay.date} ({hoveredDay.dayName}):</strong> {hoveredDay.minutes > 0 ? `${hoveredDay.minutes} دقيقة مذاكرة • ${hoveredDay.quizzes} اختبارات مكتملة` : 'لا يوجد نشاط مسجل في هذا اليوم'}
            </span>
          ) : (
            <span>مرر مؤشر الماوس فوق أي مربع لرؤية تفاصيل مذاكرتك واختباراتك في ذلك اليوم.</span>
          )}
        </div>
      </div>

      {/* Badges Showcase Grid (US-86 & US-89) */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '24px',
        padding: '24px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <Trophy size={20} color="#F59E0B" />
          <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'معرض شارات التميز والأوسمة (Badges):' : 'Badges & Achievements Showcase:'}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {STUDENT_BADGES.map((b) => (
            <div
              key={b.id}
              style={{
                padding: '18px',
                borderRadius: '16px',
                backgroundColor: b.unlocked ? 'var(--bg-subtle)' : 'rgba(0,0,0,0.02)',
                border: '1.5px solid',
                borderColor: b.unlocked ? 'var(--border-medium)' : 'var(--border-subtle)',
                opacity: b.unlocked ? 1 : 0.6,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px'
              }}
            >
              <div style={{
                fontSize: '28px',
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                backgroundColor: b.unlocked ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {b.icon}
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {b.titleAr}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                  {b.descAr}
                </div>
                <div style={{ fontSize: '11px', color: b.unlocked ? '#10B981' : 'var(--text-muted)', fontWeight: '700', marginTop: '6px' }}>
                  {b.unlocked ? `تم الإنجاز في: ${b.date}` : '🔒 لم يُفتح بعد'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Challenges (US-88) */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '24px',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <Zap size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'تحديات الأسبوع التعليمية (+XP إضافي):' : 'Weekly Challenges:'}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {challenges.map((ch) => (
            <div
              key={ch.id}
              style={{
                padding: '16px 20px',
                borderRadius: '16px',
                backgroundColor: ch.completed ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-subtle)',
                border: '1px solid',
                borderColor: ch.completed ? '#10B981' : 'var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: ch.completed ? '#10B981' : 'var(--bg-surface)',
                  color: ch.completed ? '#FFFFFF' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {ch.completed ? <CheckCircle2 size={18} /> : '🎯'}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {ch.titleAr}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    التقدم: {ch.progress}
                  </div>
                </div>
              </div>

              <div style={{ padding: '6px 14px', borderRadius: '10px', backgroundColor: 'var(--primary-surface)', color: 'var(--primary)', fontWeight: '900', fontSize: '12.5px' }}>
                +{ch.xpReward} XP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
