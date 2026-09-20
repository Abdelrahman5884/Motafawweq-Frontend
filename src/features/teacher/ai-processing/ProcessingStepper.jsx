import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

export const ProcessingStepper = ({
  steps,
  progress,
  currentStepIndex,
  isComplete,
  isRtl
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      textAlign: isRtl ? 'right' : 'left',
      marginBottom: '36px'
    }}>
      {steps.map((step, idx) => {
        const StepIcon = step.icon;
        const isFinished = progress >= step.threshold;
        const isCurrent = currentStepIndex === idx && !isComplete;

        return (
          <div
            key={step.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isCurrent ? 'var(--primary-surface)' : 'var(--bg-subtle)',
              border: isCurrent ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isFinished ? 'var(--success)' : (isCurrent ? 'var(--primary)' : 'var(--border-medium)'),
              color: '#FFFFFF',
              flexShrink: 0
            }}>
              {isFinished ? (
                <CheckCircle2 size={16} />
              ) : isCurrent ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <StepIcon size={14} />
              )}
            </div>

            <span style={{
              fontSize: '13.5px',
              fontWeight: isCurrent || isFinished ? '700' : '500',
              color: isFinished ? 'var(--text-primary)' : (isCurrent ? 'var(--primary)' : 'var(--text-muted)')
            }}>
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};
