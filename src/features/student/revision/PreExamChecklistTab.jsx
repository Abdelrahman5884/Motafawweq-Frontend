import React from 'react';
import { ListCheck, Check } from 'lucide-react';

export const PreExamChecklistTab = ({ checklist, lang, onToggleChecklistItem }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1.5px solid var(--border-medium)',
      borderRadius: '24px',
      padding: '28px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <ListCheck size={22} color="var(--primary)" />
        <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'قائمة الاستعداد لامتحان الأحياء الشامل (الأحد القادم):' : 'Pre-Exam Preparation Checklist:'}
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {checklist.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleChecklistItem(item.id)}
            style={{
              padding: '14px 18px',
              borderRadius: '14px',
              backgroundColor: item.done ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-subtle)',
              border: '1.5px solid',
              borderColor: item.done ? 'var(--success)' : 'var(--border-subtle)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '6px',
              backgroundColor: item.done ? 'var(--success)' : 'var(--bg-surface)',
              border: '1.5px solid',
              borderColor: item.done ? 'var(--success)' : 'var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              {item.done && <Check size={14} />}
            </div>

            <span style={{
              fontSize: '13.5px',
              fontWeight: '700',
              color: item.done ? '#065F46' : 'var(--text-primary)',
              textDecoration: item.done ? 'line-through' : 'none'
            }}>
              {item.textAr}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
