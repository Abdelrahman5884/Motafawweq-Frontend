import React from 'react';
import { Trophy, Clock, Zap, BookOpen } from 'lucide-react';

export const LeagueHeroBanner = ({ lang, isRtl, onStartQuiz, onStartExam }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #06254E 0%, #0B3A6F 60%, #06254E 100%)',
      borderRadius: '24px',
      padding: '28px 32px',
      marginBottom: '24px',
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
            padding: '5px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(92, 182, 219, 0.16)',
            border: '1px solid rgba(92, 182, 219, 0.35)',
            color: 'var(--primary-light)',
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '10px'
          }}>
            <Trophy size={14} color="var(--primary-light)" />
            <span>{lang === 'ar' ? 'الموسم الدراسي 2026 • الجولة الأسبوعية الثالثة' : 'Academic Season 2026 • Week 3'}</span>
          </div>

          <h1 style={{
            fontSize: '26px',
            fontWeight: '800',
            margin: '0 0 6px 0',
            letterSpacing: '-0.01em',
            color: '#FFFFFF'
          }}>
            {lang === 'ar' ? 'دوري المتفوقين الوطني' : 'National Champions League'}
          </h1>
          <p style={{
            fontSize: '13.5px',
            color: '#CBD5E1',
            margin: 0,
            maxWidth: '540px',
            lineHeight: 1.6
          }}>
            {lang === 'ar' 
              ? 'تنافس مع نخبة الطلاب على مستوى الجمهورية. كل إجابة صحيحة تضيف نقطة، وتقفيل الامتحان يمنحك 3 نقاط بونص لتتصدر الترتيب.'
              : 'Compete nationwide. Earn 1 pt per correct answer and 3 bonus pts for 100% full marks.'}
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
            padding: '10px 16px',
            borderRadius: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            textAlign: isRtl ? 'right' : 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-light)', fontSize: '11.5px', fontWeight: '700' }}>
              <Clock size={13} />
              <span>{lang === 'ar' ? 'متبقي على حسم الفائزين:' : 'Closes in:'}</span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginTop: '2px' }}>
              {lang === 'ar' ? 'يومان و 14 ساعة' : '2 days, 14 hours'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onStartQuiz}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(21, 136, 199, 0.35)',
                transition: 'opacity 0.15s ease'
              }}
            >
              <Zap size={15} />
              <span>{lang === 'ar' ? 'حل كويز لجمع النقاط' : 'Start Practice Quiz'}</span>
            </button>

            <button
              onClick={onStartExam}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <BookOpen size={15} />
              <span>{lang === 'ar' ? 'امتحانات المعلمين' : 'Official Exams'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
