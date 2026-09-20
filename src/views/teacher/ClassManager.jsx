import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_CLASSES } from '../../data/mockData';
import { Plus } from 'lucide-react';
import { ClassCard, ClassQrModal } from '../../features/teacher/classes';

export const ClassManager = () => {
  const { navigate } = useAuth();
  const { lang, isRtl } = useLanguage();
  const [selectedClass, setSelectedClass] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '36px 24px 80px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
          }}>
            {lang === 'ar' ? 'إدارة المجموعات والقاعات الدراسية' : 'Class & Hall Management'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            {lang === 'ar' ? 'متابعة سعة القاعات، أكواد انضمام الطلاب، والباركود السريع' : 'Monitor hall capacity, student join codes, and quick QR invitations'}
          </p>
        </div>

        <button
          onClick={() => alert(lang === 'ar' ? 'نموذج إنشاء مجموعة جديدة وقاعة سنتر' : 'Create new group modal')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(21, 136, 199, 0.35)'
          }}
        >
          <Plus size={16} />
          <span>{lang === 'ar' ? 'إنشاء مجموعة جديدة' : 'Add New Cohort'}</span>
        </button>
      </div>

      {/* Classes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {MOCK_CLASSES.map(cls => (
          <ClassCard
            key={cls.id}
            cls={cls}
            lang={lang}
            isRtl={isRtl}
            copiedCode={copiedCode}
            onOpenQr={() => {
              setSelectedClass(cls);
              setShowQrModal(true);
            }}
            onCopyCode={() => handleCopyCode(cls.joinCode)}
            onViewRoster={() => navigate('students')}
          />
        ))}
      </div>

      {/* QR Code Invitation Modal */}
      <ClassQrModal
        showQrModal={showQrModal}
        selectedClass={selectedClass}
        lang={lang}
        onClose={() => setShowQrModal(false)}
      />
    </div>
  );
};
