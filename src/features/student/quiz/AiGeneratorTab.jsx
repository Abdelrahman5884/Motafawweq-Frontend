import React from 'react';
import { Brain, Target, Zap, Sparkles } from 'lucide-react';

export const AiGeneratorTab = ({
  lessonTitle,
  handleGenerateAIQuiz,
  isGeneratingAI,
  lang
}) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1.5px solid var(--primary)',
      borderRadius: '24px',
      padding: '32px',
      boxShadow: '0 12px 36px rgba(21, 136, 199, 0.12)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--primary-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
          <Brain size={26} />
        </div>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'محرك توليد الأسئلة بالذكاء الاصطناعي' : 'AI Question Generator Engine'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
            {lang === 'ar' ? 'يحلل الذكاء الاصطناعي تفريغ المحاضرة ويستخرج أهم الأسئلة المتوقعة بنظام البابل شيت' : 'Analyze lecture transcript & generate exam-level practice questions'}
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-subtle)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
          {lang === 'ar' ? 'المحاضرة المختارة لتحليل الأسئلة:' : 'Selected Lecture:'}
        </div>
        <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--primary)' }}>
          {lessonTitle}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          {lang === 'ar' ? 'تتضمن: 10 مقاطع تفريغ صوتي • 14 مفهوماً علمياً • دورة كالفن وانشطار الماء' : 'Includes: 10 audio segments • 14 scientific concepts • Calvin cycle'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
            <Target size={16} color="var(--primary)" />
            <span>{lang === 'ar' ? 'مستوى الصعوبة' : 'Difficulty Level'}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {lang === 'ar' ? 'مستويات عليا للتفكير والربط (Thanawya Bloom Levels)' : 'Higher-order thinking & synthesis'}
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
            <Zap size={16} color="var(--primary)" />
            <span>{lang === 'ar' ? 'نوع الأسئلة' : 'Question Type'}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {lang === 'ar' ? 'اختيار من متعدد (MCQ) مع تفسير علمي لكل اختيار' : 'Multiple choice (MCQ) with scientific rationale'}
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerateAIQuiz}
        disabled={isGeneratingAI}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '16px',
          backgroundColor: 'var(--primary)',
          color: '#FFFFFF',
          border: 'none',
          fontSize: '15px',
          fontWeight: '900',
          cursor: isGeneratingAI ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: '0 8px 24px rgba(21, 136, 199, 0.35)'
        }}
      >
        <Sparkles size={20} />
        <span>{isGeneratingAI ? (lang === 'ar' ? 'جاري استخراج الأسئلة من النص الصوتي...' : 'Generating...') : (lang === 'ar' ? 'أنشئ أسئلة ذكية فورية وابدأ الحل' : 'Generate & Start AI Quiz')}</span>
      </button>
    </div>
  );
};
