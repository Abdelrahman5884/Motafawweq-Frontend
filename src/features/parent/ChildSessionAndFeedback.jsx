import React from 'react';
import { Calendar, CheckCircle2, MessageSquare } from 'lucide-react';

export const ChildSessionAndFeedback = ({ activeChild, lang }) => {
  if (!activeChild) return null;

  const nextSessionText = lang === 'ar'
    ? (activeChild.nextSessionAr || 'لا توجد حصص مجدولة حالياً')
    : (activeChild.nextSession || 'No scheduled sessions yet');

  const teacherNoteText = lang === 'ar'
    ? (activeChild.teacherNotesAr || 'لا توجد ملاحظات مسجلة من المعلمين حتى الآن.')
    : (activeChild.teacherNotes || 'No teacher remarks recorded yet.');

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Calendar size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'الحصة القادمة' : 'Upcoming Session'}
          </h3>
        </div>
        <div style={{
          padding: '15px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-subtle)',
          fontSize: '13.5px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          lineHeight: 1.5,
        }}>
          {nextSessionText}
        </div>
        {activeChild.nextSessionConfirmed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--success, #16A34A)', marginTop: '10px' }}>
            <CheckCircle2 size={14} />
            <span>{lang === 'ar' ? 'مقعد الطالب مؤكد بالمجموعة' : 'Seat confirmed in study group'}</span>
          </div>
        )}
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="var(--primary-light)" />
            <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'آخر ملاحظات المعلمين' : 'Latest Teacher Remarks'}
            </h3>
          </div>
          {activeChild.teacherNotesAuthor && (
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--primary)' }}>
              {activeChild.teacherNotesAuthor}
            </span>
          )}
        </div>
        <div style={{
          padding: '15px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-subtle)',
          fontSize: '13.5px',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
        }}>
          &ldquo;{teacherNoteText}&rdquo;
        </div>
      </div>
    </div>
  );
};
