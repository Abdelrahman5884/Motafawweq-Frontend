import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight, ArrowLeft } from 'lucide-react';

export const SmartNextStepBanner = ({ lang, isRtl, isDark }) => {
  const navigate = useNavigate();

  return (
    <div className="executive-card" style={{
      background: isDark
        ? 'linear-gradient(90deg, rgba(21, 136, 199, 0.08) 0%, rgba(14, 23, 38, 0.8) 100%)'
        : 'linear-gradient(90deg, rgba(92, 182, 219, 0.12) 0%, rgba(255, 255, 255, 0.95) 100%)',
      border: '1px solid rgba(21, 136, 199, 0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '750px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'rgba(21, 136, 199, 0.15)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Target size={22} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', background: 'rgba(21, 136, 199, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
              {lang === 'ar' ? 'توصية المستشار الذكي (US-13)' : 'AI Smart Next Step'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'إرشاد موجه يزيل أي حيرة' : 'Zero hesitation workflow'}
            </span>
          </div>

          <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
            {lang === 'ar'
              ? 'خطوتك التالية الموصى بها الآن: تسليم واجب الأحياء المطلوب قبل إغلاقه الليلة، ثم استكمال آخر 14 دقيقة من درس "البناء الضوئي" لضمان الاستعداد التام لاختبار الأحد والحفاظ على ترتيبك #2.'
              : 'Your recommended next step: Submit Biology homework before midnight, then finish the remaining 14m of Photosynthesis lesson to stay ready for Sunday’s exam and retain your #2 rank.'
            }
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/student/homework')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--primary)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '10px',
          padding: '10px 18px',
          fontSize: '13px',
          fontWeight: '700',
          cursor: 'pointer',
          minHeight: '44px',
          boxShadow: '0 4px 16px rgba(21, 136, 199, 0.35)',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
      >
        <span>{lang === 'ar' ? 'تنفيذ الخطوة التالية فوراً' : 'Execute Next Step'}</span>
        {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
      </button>
    </div>
  );
};
