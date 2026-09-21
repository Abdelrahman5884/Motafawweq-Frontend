import React from 'react';
import { Trophy, Clock, Zap, BookOpen } from 'lucide-react';

export const LeagueHeroBanner = ({ lang, isRtl, onStartQuiz, onStartExam, onGoToAchievements, activeLeague }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #06254E 0%, #0B3A6F 60%, #06254E 100%)',
      borderRadius: '24px',
      padding: '26px 30px',
      marginBottom: '20px',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 12px 36px rgba(6, 37, 78, 0.2)',
      border: '1px solid rgba(92, 182, 219, 0.25)'
    }}>
      {/* Subtle decorative glow */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        insetInlineEnd: '-60px',
        width: '220px',
        height: '220px',
        borderRadius: '50%',
        backgroundColor: 'rgba(92, 182, 219, 0.12)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(92, 182, 219, 0.16)',
            border: '1px solid rgba(92, 182, 219, 0.35)',
            color: 'var(--primary-light)',
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '10px'
          }}>
            <Trophy size={14} color="var(--primary-light)" />
            <span>{activeLeague?.badge || (lang === 'ar' ? 'الموسم الدراسي 2026' : 'Season 2026')}</span>
            <span>•</span>
            <span>{lang === 'ar' ? 'الجولة الأسبوعية الحالية' : 'Current Week'}</span>
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            margin: '0 0 6px 0',
            letterSpacing: '-0.01em',
            color: '#FFFFFF'
          }}>
            {activeLeague?.titleAr || (lang === 'ar' ? 'دوري المتفوقين الوطني' : 'National Champions League')}
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#CBD5E1',
            margin: 0,
            maxWidth: '540px',
            lineHeight: 1.6
          }}>
            {activeLeague?.descriptionAr || (lang === 'ar' 
              ? 'تنافس مع نخبة الطلاب على مستوى الجمهورية. كل إجابة صحيحة تضيف نقطة، وتقفيل الامتحان يمنحك 3 نقاط بونص لتتصدر الترتيب.'
              : 'Compete nationwide. Earn 1 pt per correct answer and 3 bonus pts for 100% full marks.')}
          </p>
        </div>

        {/* Countdown & Quick Action */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isRtl ? 'flex-start' : 'flex-end',
          gap: '12px'
        }}>
          <div style={{
            padding: '8px 14px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            textAlign: isRtl ? 'right' : 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-light)', fontSize: '11px', fontWeight: '700' }}>
              <Clock size={12} />
              <span>{lang === 'ar' ? 'حسم جولة هذا الأسبوع:' : 'Closes in:'}</span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', marginTop: '2px' }}>
              {lang === 'ar' ? 'يومان و 14 ساعة' : '2 days, 14 hours'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {onGoToAchievements && (
              <button
                onClick={onGoToAchievements}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 15px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.14)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Trophy size={14} color="#FBBF24" />
                <span>{lang === 'ar' ? 'سجل إنجازاتي 🏆' : 'My Achievements'}</span>
              </button>
            )}

            <button
              onClick={onStartQuiz}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 15px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(21, 136, 199, 0.35)',
                transition: 'opacity 0.15s ease'
              }}
            >
              <Zap size={14} />
              <span>{lang === 'ar' ? 'حل كويز' : 'Quiz'}</span>
            </button>

            <button
              onClick={onStartExam}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 15px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <BookOpen size={14} />
              <span>{lang === 'ar' ? 'امتحانات' : 'Exams'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
