import React from 'react';
import { Calendar, CheckCircle2, MessageSquare } from 'lucide-react';

export const ChildSessionAndFeedback = ({ activeChild, lang }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Calendar size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'الحصة القادمة وجدول الحضور' : 'Upcoming Session'}
          </h3>
        </div>
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-subtle)',
          fontSize: '14px',
          fontWeight: '700',
          color: 'var(--text-primary)'
        }}>
          {lang === 'ar' ? activeChild.nextSessionAr : activeChild.nextSession}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--success)', marginTop: '10px' }}>
          <CheckCircle2 size={14} />
          <span>{lang === 'ar' ? 'تم تأكيد حجز مقعد القاعة' : 'Seat reservation confirmed'}</span>
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <MessageSquare size={18} color="var(--primary-light)" />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'ملاحظات المعلمين الأسبوعية' : 'Teacher Weekly Feedback'}
          </h3>
        </div>
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-subtle)',
          fontSize: '13.5px',
          lineHeight: 1.6,
          color: 'var(--text-secondary)'
        }}>
          "{lang === 'ar' ? activeChild.teacherNotesAr : activeChild.teacherNotes}"
        </div>
      </div>
    </div>
  );
};
