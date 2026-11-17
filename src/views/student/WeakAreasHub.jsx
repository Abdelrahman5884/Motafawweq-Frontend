import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AlertTriangle } from 'lucide-react';
import { WeakAreaCard } from '../../features/student/analytics';

export const WeakAreasHub = () => {
  const { navigate } = useAuth();
  const { lang, isRtl } = useLanguage();

  const weakConcepts = [];

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '36px 24px 80px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <AlertTriangle size={20} color="var(--danger)" />
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--danger)', letterSpacing: '0.5px' }}>
            {lang === 'ar' ? 'تشخيص الذكاء الاصطناعي الذاتي' : 'AI Diagnostic Engine'}
          </span>
        </div>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          margin: '0 0 6px 0',
          fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
        }}>
          {lang === 'ar' ? 'مركز معالجة نقاط الضعف والمراجعة الذكية' : 'Weak Areas & Targeted Revision Hub'}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          {lang === 'ar' ? 'يقوم ليرنورا بتحليل أخطائك في الامتحانات ليرشدك مباشرة إلى اللحظات الزمنية التي يجب عليك إعادة سماعها دون إضاعة وقتك.' : 'Learnora pinpoints your exact quiz misconceptions and hyperlinks you directly to the 2-minute audio explanation.'}
        </p>
      </div>

      {/* Weak Concept Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {weakConcepts.length === 0 && (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px dashed var(--border-subtle)',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {lang === 'ar' ? 'لا توجد نقاط ضعف مسجلة حالياً' : 'No Weak Areas Detected'}
            </div>
            <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
              {lang === 'ar'
                ? 'سيقوم النظام بتحليل إجاباتك في الامتحانات وتحديد الجزئيات التي تحتاج للمراجعة تلقائياً.'
                : 'Your exam answers will be analyzed automatically to highlight concepts that need review.'}
            </div>
          </div>
        )}
        {weakConcepts.map(c => (
          <WeakAreaCard
            key={c.id}
            concept={c}
            lang={lang}
            onListen={() => navigate('/student/lesson')}
            onPractice={() => navigate('/student/exam')}
          />
        ))}
      </div>
    </div>
  );
};
