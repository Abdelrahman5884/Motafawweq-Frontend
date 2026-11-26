import React, { useState } from 'react';
import { X, Phone, MessageSquare, Send, Loader2, AlertCircle } from 'lucide-react';

export const LinkChildModal = ({
  open,
  lang,
  onClose,
  onSubmit,
  submitting,
  error,
}) => {
  const [studentCode, setStudentCode] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentCode.trim() || submitting) return;
    const ok = await onSubmit(studentCode.trim());
    if (ok) {
      setStudentCode('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '26px',
          maxWidth: '450px',
          width: '100%',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'ربط طالب جديد بحسابك' : 'Link Student Profile'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
          {lang === 'ar'
            ? 'أدخل كود الطالب (مثل STD-XXXXXX) أو رقم الباركود المسجل على كارنيه السنتر لربط حسابه ومتابعته فورياً.'
            : 'Enter the student code (e.g. STD-XXXXXX) or center ID barcode to link and monitor their progress.'}
        </p>

        {error && (
          <div style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#DC2626',
            fontSize: '12.5px',
            fontWeight: '700',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
              {lang === 'ar' ? 'كود الطالب أو باركود الكارنيه' : 'Student Code / Barcode'}
            </label>
            <input
              type="text"
              required
              autoFocus
              dir="ltr"
              placeholder="STD-XXXXXX"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13.5px',
                fontWeight: '700',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 1,
                padding: '11px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '700',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              {submitting && <Loader2 size={14} className="spin" />}
              <span>{lang === 'ar' ? 'تأكيد الربط' : 'Confirm Link'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '11px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ContactCenterModal = ({
  open,
  lang,
  activeChild,
  onClose,
  onSubmit,
  submitting,
  error,
}) => {
  const [recipientType, setRecipientType] = useState('center');
  const [teacherId, setTeacherId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (!open) return null;

  const teachers = activeChild?.contacts?.teachers || [];
  const centerPhone = activeChild?.contacts?.centerPhone || activeChild?.centerPhone;
  const centerNameAr = activeChild?.contacts?.centerNameAr || activeChild?.centerAr;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || submitting) return;
    const ok = await onSubmit({
      student_id: activeChild?.id ?? null,
      recipient_type: recipientType,
      teacher_id: teacherId ? Number(teacherId) : null,
      subject: subject.trim(),
      message: message.trim(),
    });
    if (ok) {
      setSubject('');
      setMessage('');
      setTeacherId('');
      setRecipientType('center');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '26px',
          maxWidth: '510px',
          width: '100%',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'تواصل مع السنتر والمعلم' : 'Contact Center & Teacher'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        {(centerNameAr || centerPhone) && (
          <div style={{
            padding: '11px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: 'var(--text-primary)' }}>
              <Phone size={14} color="var(--primary)" />
              {centerNameAr || (lang === 'ar' ? 'استقبال السنتر' : 'Center Reception')}
            </span>
            {centerPhone && (
              <a
                href={`tel:${centerPhone}`}
                dir="ltr"
                style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none' }}
              >
                {centerPhone}
              </a>
            )}
          </div>
        )}

        {error && (
          <div style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#DC2626',
            fontSize: '12.5px',
            fontWeight: '700',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: teachers.length > 0 ? '1fr 1fr' : '1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                {lang === 'ar' ? 'الجهة المستلمة' : 'Recipient'}
              </label>
              <select
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  outline: 'none',
                }}
              >
                <option value="center">{lang === 'ar' ? 'إدارة السنتر' : 'Center Administration'}</option>
                <option value="teacher">{lang === 'ar' ? 'معلم المادة' : 'Subject Teacher'}</option>
                <option value="both">{lang === 'ar' ? 'إدارة السنتر والمعلم' : 'Both Center & Teacher'}</option>
              </select>
            </div>

            {teachers.length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'اختر المعلم (اختياري)' : 'Teacher (optional)'}
                </label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '12.5px',
                    outline: 'none',
                  }}
                >
                  <option value="">{lang === 'ar' ? 'تلقائي' : 'Auto'}</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}{t.subjectAr ? ` (${t.subjectAr})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
              {lang === 'ar' ? 'الموضوع' : 'Subject'}
            </label>
            <input
              type="text"
              required
              minLength={3}
              placeholder={lang === 'ar' ? 'مثال: استفسار حول موعد المراجعة' : 'e.g. Revision schedule inquiry'}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
              {lang === 'ar' ? 'نص الرسالة' : 'Message'}
            </label>
            <textarea
              required
              minLength={5}
              rows={4}
              placeholder={lang === 'ar' ? 'اكتب استفسارك أو ملاحظتك هنا...' : 'Write your inquiry here...'}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 1,
                padding: '11px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '700',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              {submitting ? <Loader2 size={14} className="spin" /> : <Send size={14} />}
              <span>{lang === 'ar' ? 'إرسال الاستفسار' : 'Send Message'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '11px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
