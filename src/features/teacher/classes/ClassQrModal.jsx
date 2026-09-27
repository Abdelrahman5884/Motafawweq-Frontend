import React, { useState } from 'react';
import { X, Copy, Check, Smartphone, Users, BookOpen } from 'lucide-react';
import { RealQRCode } from '../../../components/common/RealQRCode';
import { useGroups } from '../../../context/GroupsContext';

export const ClassQrModal = ({
  showQrModal,
  selectedClass,
  lang,
  onClose,
  onOpenRoster
}) => {
  const { studentJoinByCode } = useGroups();
  const [copied, setCopied] = useState(false);
  const [simulated, setSimulated] = useState(false);

  if (!showQrModal || !selectedClass) return null;

  const qrValue = `https://motafawweq.me/join-group/${selectedClass.joinCode}`;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(selectedClass.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateScan = () => {
    const demoStudents = [
      { nameAr: 'يوسف أحمد الشناوي', name: 'Youssef Ahmed', phone: '+20 109 988 7766', parentNameAr: 'أحمد الشناوي', parentPhone: '+20 100 998 8776' },
      { nameAr: 'نورهان هاني الجوهري', name: 'Nourhan Hany', phone: '+20 101 122 3344', parentNameAr: 'هاني الجوهري', parentPhone: '+20 100 556 6778' },
      { nameAr: 'عبدالرحمن حسن', name: 'Abdulrahman Hassan', phone: '+20 100 012 3456', parentNameAr: 'حسن مصطفى', parentPhone: '+20 101 123 4567' }
    ];
    const pick = demoStudents[Math.floor(Math.random() * demoStudents.length)];
    studentJoinByCode(selectedClass.joinCode, pick);
    setSimulated(true);
    setTimeout(() => setSimulated(false), 3000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 25, 53, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          padding: '28px 24px',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          border: '1px solid var(--border-subtle)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            border: 'none',
            background: 'var(--bg-subtle)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={18} />
        </button>

        <h3 style={{
          fontSize: '18px',
          fontWeight: '900',
          color: 'var(--text-primary)',
          margin: '0 0 6px 0',
          padding: '0 20px'
        }}>
          {lang === 'ar' ? selectedClass.nameAr : selectedClass.nameEn || selectedClass.name}
        </h3>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 10px',
          borderRadius: '6px',
          backgroundColor: 'var(--primary-surface)',
          color: 'var(--primary)',
          fontSize: '12px',
          fontWeight: '800',
          marginBottom: '10px'
        }}>
          <BookOpen size={13} />
          <span>{lang === 'ar' ? (selectedClass.subjectAr || 'الأحياء') : (selectedClass.subjectEn || 'Biology')}</span>
        </div>

        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
          {lang === 'ar'
            ? 'امسح الباركود بكاميرا هاتف الطالب للانضمام الفوري إلى المجموعة ومراجعة طلبه'
            : 'Scan with student mobile camera for instant cohort join request'}
        </p>

        {/* Real High-Resolution Authentic QR Code */}
        <div style={{
          width: '236px',
          height: '236px',
          margin: '0 auto 16px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 8px 24px var(--primary-glow)'
        }}>
          <RealQRCode value={qrValue} size={220} />
        </div>

        {/* Join Code Chip with Copy */}
        <div
          onClick={handleCopyCode}
          title={lang === 'ar' ? 'انقر لنسخ الكود' : 'Click to copy code'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-surface)',
            border: '1.5px dashed var(--primary)',
            fontSize: '14px',
            fontFamily: 'monospace',
            fontWeight: '900',
            color: 'var(--primary)',
            letterSpacing: '1px',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          {copied ? <Check size={15} color="var(--primary)" /> : <Copy size={15} />}
          <span>{selectedClass.joinCode}</span>
        </div>

        {/* Action Buttons: Simulate Scan + View Roster */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={handleSimulateScan}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-surface)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
          >
            <Smartphone size={15} color="var(--primary)" />
            <span>
              {simulated
                ? (lang === 'ar' ? 'تم تسجيل مسح الطالب بنجاح!' : 'Scan Simulated!')
                : (lang === 'ar' ? 'محاكاة مسح الباركود بهاتف طالب' : 'Simulate Student Scan')}
            </span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenRoster) onOpenRoster(selectedClass);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 8px var(--primary-glow)'
            }}
          >
            <Users size={15} />
            <span>{lang === 'ar' ? 'فتح سجل الطلاب وقبول الطلبات' : 'Open Roster & Review Requests'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
