import React from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  FileText, 
  Brain, 
  Layers, 
  Sparkles, 
  UploadCloud 
} from 'lucide-react';

export const LectureAiStagesProgress = ({
  currentStageIndex = 1, // 0-based or 1-based index of currently active stage
  selectedOutputs = ['graph', 'transcript', 'topics'],
  overallProgress = 45,
  lang = 'ar'
}) => {
  const isRtl = lang === 'ar';

  // Base list of all possible stages
  const allStages = [
    {
      id: 'extract',
      key: 'extract',
      titleAr: 'قراءة وفك تشفير الملف',
      titleEn: 'File extraction & decoding',
      descAr: 'تحليل أجزاء المحتوى وفصل الصوت',
      descEn: 'Analyzing media & stream buffers',
      icon: UploadCloud,
      alwaysIncluded: true
    },
    {
      id: 'transcript',
      key: 'transcript',
      titleAr: 'التفريغ الصوتي الذكي والتعرف',
      titleEn: 'Speech-to-Text transcription',
      descAr: 'تحويل الصوت إلى نص دقيق متزامن',
      descEn: 'Generating timestamped transcript',
      icon: FileText,
      targetId: 'transcript'
    },
    {
      id: 'topics',
      key: 'topics',
      titleAr: 'استخراج محاور وفصول الشرح',
      titleEn: 'Chaptering & topic division',
      descAr: 'تحديد العناوين والتقسيمات الزمنية',
      descEn: 'Synthesizing key lecture chapters',
      icon: Layers,
      targetId: 'topics'
    },
    {
      id: 'graph',
      key: 'graph',
      titleAr: 'بناء خريطة المفاهيم التفاعلية (Graph)',
      titleEn: 'Interactive Knowledge Graph',
      descAr: 'ربط المفاهيم والعلاقات الهيكلية',
      descEn: 'Generating node network & relations',
      icon: Brain,
      targetId: 'graph'
    },
    {
      id: 'quiz',
      key: 'quiz',
      titleAr: 'توليد أسئلة الكويز التدريبي',
      titleEn: 'AI Quiz Generation',
      descAr: 'صياغة بنك أسئلة فهم فورية',
      descEn: 'Formulating assessment questions',
      icon: Sparkles,
      targetId: 'quiz'
    }
  ];

  // Filter stages based on user selected outputs
  const activeStages = allStages.filter(st => {
    if (st.alwaysIncluded) return true;
    return selectedOutputs.includes(st.targetId);
  });

  return (
    <div style={{
      backgroundColor: 'var(--bg-subtle)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '16px',
      padding: '16px 18px',
      marginTop: '16px',
      animation: 'fadeIn 0.25s ease'
    }}>
      {/* Header with overall percentage */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Loader2 size={16} className="spin" color="var(--primary)" style={{ animation: 'spin 1.2s linear infinite' }} />
          <span style={{
            fontSize: '13px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-arabic)'
          }}>
            {isRtl ? 'مراحل التوليد والمعالجة الذكية' : 'AI Generation Stages in Progress'}
          </span>
        </div>

        <div style={{
          fontSize: '12px',
          fontWeight: '700',
          color: 'var(--primary)',
          backgroundColor: 'var(--primary-light)',
          padding: '2px 10px',
          borderRadius: '12px'
        }}>
          {overallProgress}%
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: '6px',
        backgroundColor: 'var(--border-subtle)',
        borderRadius: '99px',
        overflow: 'hidden',
        marginBottom: '16px'
      }}>
        <div style={{
          height: '100%',
          width: `${overallProgress}%`,
          backgroundColor: 'var(--primary)',
          borderRadius: '99px',
          transition: 'width 0.4s ease'
        }} />
      </div>

      {/* Stages List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {activeStages.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isActive = idx === currentStageIndex;
          const isPending = idx > currentStageIndex;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '12px',
                backgroundColor: isActive 
                  ? 'var(--bg-surface)' 
                  : isDone 
                    ? 'rgba(22, 163, 74, 0.05)' 
                    : 'transparent',
                border: '1px solid',
                borderColor: isActive 
                  ? 'var(--primary)' 
                  : isDone 
                    ? 'rgba(22, 163, 74, 0.2)' 
                    : 'transparent',
                transition: 'all 0.2s ease',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                {/* State Indicator */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isDone 
                    ? 'var(--success)' 
                    : isActive 
                      ? 'var(--primary)' 
                      : 'var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0,
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  {isDone ? (
                    <CheckCircle2 size={15} strokeWidth={2.5} />
                  ) : isActive ? (
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      animation: 'aiPulse 1.5s infinite'
                    }} />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: '12.5px',
                    fontWeight: isActive ? '700' : '600',
                    color: isActive ? 'var(--primary)' : isDone ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-arabic)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Icon size={13} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {isRtl ? stage.titleAr : stage.titleEn}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    marginTop: '1px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {isRtl ? stage.descAr : stage.descEn}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{ flexShrink: 0 }}>
                {isDone && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--success)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'var(--success-light)',
                    padding: '2px 8px',
                    borderRadius: '8px'
                  }}>
                    {isRtl ? 'تم الانتهاء' : 'Done'}
                  </span>
                )}
                {isActive && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'var(--primary-light)',
                    padding: '2px 8px',
                    borderRadius: '8px'
                  }}>
                    <Loader2 size={11} style={{ animation: 'spin 1.2s linear infinite' }} />
                    <span>{isRtl ? 'جاري التنفيذ...' : 'Processing...'}</span>
                  </span>
                )}
                {isPending && (
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    padding: '2px 8px'
                  }}>
                    {isRtl ? 'في الانتظار' : 'Pending'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
