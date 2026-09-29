import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useGroups } from '../../context/GroupsContext';
import { RealQRCode } from '../common/RealQRCode';
import { 
  Building2, 
  QrCode, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  X, 
  User, 
  CreditCard, 
  Sparkles,
  Printer,
  Share2
} from 'lucide-react';

export const StudentCenterQrPassModal = ({ isOpen, onClose, studentInfo }) => {
  const { lang, isRtl } = useLanguage();
  const { groups, enrolledStudents } = useGroups();

  if (!isOpen) return null;

  // Default student information if not provided
  const student = studentInfo || {
    name: 'أحمد محمود رضوان',
    phone: '01001122334',
    code: 'STU-88219',
    grade: 'الصف الثالث الثانوي — علمي رياضة'
  };

  const qrValue = `QR-STU-${student.phone}`;

  // Find groups student is enrolled in
  const studentGroups = groups.filter(g => {
    const list = enrolledStudents[g.id] || [];
    return list.some(s => s.phone === student.phone || s.name === student.name);
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px',
      fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-2xl)',
        border: '1px solid var(--border-subtle)',
        maxWidth: '460px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            left: isRtl ? '16px' : 'auto',
            right: isRtl ? 'auto' : '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* Card Header & Center Branding */}
        <div style={{
          backgroundColor: '#06254E',
          color: '#FFFFFF',
          padding: '24px 20px',
          borderTopLeftRadius: 'var(--radius-2xl)',
          borderTopRightRadius: 'var(--radius-2xl)',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(21, 136, 199, 0.25)',
            color: '#7DD3FC',
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '0.5px',
            marginBottom: '10px'
          }}>
            <Building2 size={13} />
            <span>{lang === 'ar' ? 'بطاقة دخول السنتر الذكية' : 'Center Smart Access Pass'}</span>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px 0', color: '#FFFFFF' }}>
            {student.name}
          </h2>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
            {student.grade} • {student.code}
          </div>
        </div>

        {/* QR Code Section */}
        <div style={{ padding: '24px 20px', textAlign: 'center' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '16px',
            borderRadius: '16px',
            display: 'inline-block',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            marginBottom: '14px'
          }}>
            <RealQRCode value={qrValue} size={180} />
            <div style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              fontWeight: '700',
              color: '#06254E',
              marginTop: '8px',
              letterSpacing: '1px'
            }}>
              {qrValue}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#10B981',
            marginBottom: '18px'
          }}>
            <CheckCircle2 size={15} />
            <span>{lang === 'ar' ? 'الباركود مفعل وصالح لجميع فروع السنتر' : 'Pass Active for All Branches'}</span>
          </div>

          {/* How it Works Directive */}
          <div style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(21, 136, 199, 0.08)',
            border: '1px solid rgba(21, 136, 199, 0.25)',
            textAlign: isRtl ? 'right' : 'left',
            fontSize: '12px',
            color: 'var(--text-primary)',
            lineHeight: '1.5',
            marginBottom: '20px'
          }}>
            <div style={{ fontWeight: '800', color: 'var(--primary)', marginBottom: '2px' }}>
              {lang === 'ar' ? 'طريقة الاستخدام عند الحضور:' : 'How to use at center entrance:'}
            </div>
            {lang === 'ar'
              ? 'امسح هذا الباركود عند بوابة السنتر. سيتعرف النظام تلقائياً على موعد حصتك المسجلة ويسجل حضورك في القاعة المحددة.'
              : 'Scan at the entrance scanner. The gate automatically detects your scheduled cohort at the current time and registers your attendance.'}
          </div>

          {/* Student Cohorts Schedule Registered in Pass */}
          <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
              {lang === 'ar' ? 'المجموعات والمواعيد المسجلة على بطاقتك:' : 'Enrolled Cohorts Linked to Pass:'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {studentGroups.length === 0 ? (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}>
                  {lang === 'ar' ? 'مجموعة الفيزياء للثانوية العامة — السبت 02:00 م (قاعة 1)' : 'Physics 3rd Year - Saturday 2:00 PM'}
                </div>
              ) : (
                studentGroups.map(grp => (
                  <div
                    key={grp.id}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                        {grp.nameAr}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {grp.teacherNameAr} • {grp.hallName || 'القاعة 1'}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)',
                      color: 'var(--primary)'
                    }}>
                      {grp.scheduleTime || 'السبت 02:00 م'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={() => window.print()}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Printer size={15} />
              <span>{lang === 'ar' ? 'طباعة البطاقة' : 'Print Pass'}</span>
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
