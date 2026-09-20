import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Sparkles, BookOpen, GraduationCap, Building2, Users } from 'lucide-react';

export const QuickDemoAccess = ({ onQuickDemo }) => {
  const { lang, t, isRtl } = useLanguage();

  return (
    <div style={{
      marginTop: '26px',
      paddingTop: '20px',
      borderTop: '1px solid var(--border-subtle)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: 'var(--primary)',
        marginBottom: '10px'
      }}>
        <Sparkles size={13} />
        {t('quickDemoAccess')}
      </div>
      <div className="auth-demo-grid">
        <button
          type="button"
          onClick={() => onQuickDemo('student')}
          style={{
            padding: '9px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-medium)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: isRtl ? 'right' : 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <BookOpen size={14} color="#06B6D4" />
          <span>{lang === 'ar' ? 'طالب (عمر طارق)' : 'Student Demo'}</span>
        </button>
        <button
          type="button"
          onClick={() => onQuickDemo('teacher')}
          style={{
            padding: '9px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-medium)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: isRtl ? 'right' : 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <GraduationCap size={14} color="var(--primary)" />
          <span>{lang === 'ar' ? 'معلم (د. سلمى)' : 'Teacher Demo'}</span>
        </button>
        <button
          type="button"
          onClick={() => onQuickDemo('center')}
          style={{
            padding: '9px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-medium)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: isRtl ? 'right' : 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Building2 size={14} color="var(--warning, #F59E0B)" />
          <span>{lang === 'ar' ? 'سنتر (أكاديمية الرواد)' : 'Center Demo'}</span>
        </button>
        <button
          type="button"
          onClick={() => onQuickDemo('parent')}
          style={{
            padding: '9px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-medium)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: isRtl ? 'right' : 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Users size={14} color="var(--success, #16A34A)" />
          <span>{lang === 'ar' ? 'ولي أمر (م. طارق)' : 'Parent Demo'}</span>
        </button>
      </div>
    </div>
  );
};
