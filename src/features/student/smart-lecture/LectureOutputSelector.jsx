import React from 'react';
import { Brain, FileText, Layers, Sparkles, Check } from 'lucide-react';

export const LectureOutputSelector = ({
  selectedOutputs,
  onToggleOutput,
  disabled = false,
  lang = 'ar'
}) => {
  const isRtl = lang === 'ar';

  const outputOptions = [
    {
      id: 'graph',
      labelAr: 'خريطة المفاهيم التفاعلية (Graph)',
      labelEn: 'Interactive Knowledge Graph',
      descAr: 'شبكة علاقات وعقد ذكية قابلة للاستكشاف',
      descEn: 'Visual concept network & nodes',
      icon: Brain
    },
    {
      id: 'transcript',
      labelAr: 'التفريغ الصوتي والنص الكامل',
      labelEn: 'Full Audio Transcript',
      descAr: 'تفريغ دقيق بالثواني وقابل للبحث',
      descEn: 'Timestamped searchable text',
      icon: FileText
    },
    {
      id: 'topics',
      labelAr: 'محاور وفصول الشرح',
      labelEn: 'Lecture Chapters & Topics',
      descAr: 'تقسيم ذكي للدرس إلى محاور رئيسية',
      descEn: 'AI organized chapters',
      icon: Layers
    },
    {
      id: 'quiz',
      labelAr: 'كويز تدريبي فوري',
      labelEn: 'Practice Quiz Questions',
      descAr: 'أسئلة فهم وتقييم من محتوى المحاضرة',
      descEn: 'Instant self-check questions',
      icon: Sparkles
    }
  ];

  return (
    <div style={{
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid var(--border-subtle)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '10px'
      }}>
        <div style={{
          fontSize: '12.5px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-arabic)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>{isRtl ? 'المخرجات المطلوبة من الذكاء الاصطناعي:' : 'Select AI Outputs to Generate:'}</span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {isRtl ? 'حدد ما ترغب في استخراجه (جراف، نص، محاور)' : 'Choose graph, text, topics or quiz'}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '10px'
      }}>
        {outputOptions.map((opt) => {
          const isSelected = selectedOutputs.includes(opt.id);
          const Icon = opt.icon;

          return (
            <div
              key={opt.id}
              onClick={() => {
                if (!disabled) onToggleOutput(opt.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '12px',
                backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                border: '1px solid',
                borderColor: isSelected ? 'var(--primary)' : 'var(--border-subtle)',
                cursor: disabled ? 'default' : 'pointer',
                opacity: disabled ? 0.7 : 1,
                transition: 'all 0.15s ease',
                userSelect: 'none'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '6px',
                backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-surface)',
                border: isSelected ? 'none' : '1.5px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                marginTop: '2px',
                flexShrink: 0
              }}>
                {isSelected && <Check size={13} strokeWidth={3} />}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                  fontFamily: 'var(--font-arabic)'
                }}>
                  <Icon size={14} color={isSelected ? 'var(--primary)' : 'var(--text-secondary)'} />
                  <span>{isRtl ? opt.labelAr : opt.labelEn}</span>
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  marginTop: '2px',
                  lineHeight: 1.3
                }}>
                  {isRtl ? opt.descAr : opt.descEn}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
