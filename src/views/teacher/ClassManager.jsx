import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_CLASSES } from '../../data/mockData';
import { 
  Users, 
  Plus, 
  QrCode, 
  Copy, 
  Check, 
  Calendar, 
  MapPin, 
  DollarSign,
  ArrowRight,
  X
} from 'lucide-react';

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
            boxShadow: '0 4px 14px rgba(108, 77, 255, 0.35)'
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
        {MOCK_CLASSES.map(cls => {
          const occupancyPercent = Math.round((cls.enrolledStudents / cls.capacity) * 100);
          return (
            <div
              key={cls.id}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '18px'
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--primary-surface)',
                    color: 'var(--primary)'
                  }}>
                    {lang === 'ar' ? cls.gradeAr : cls.grade}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedClass(cls);
                      setShowQrModal(true);
                    }}
                    title="View QR Code"
                    style={{
                      border: 'none',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '5px',
                      cursor: 'pointer',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <QrCode size={16} />
                  </button>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {lang === 'ar' ? cls.nameAr : cls.name}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--text-muted)" />
                    <span>{lang === 'ar' ? cls.scheduleAr : cls.schedule}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--text-muted)" />
                    <span>{cls.centerName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={14} color="#10B981" />
                    <span>{cls.priceEgp} {lang === 'ar' ? 'ج.م / شهرياً' : 'EGP / mo'}</span>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'سعة القاعة' : 'Occupancy'}</span>
                    <span style={{ fontWeight: '700', color: occupancyPercent > 90 ? '#EF4444' : 'var(--primary)' }}>
                      {cls.enrolledStudents} / {cls.capacity} ({occupancyPercent}%)
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'var(--border-subtle)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${occupancyPercent}%`,
                      height: '100%',
                      backgroundColor: occupancyPercent > 90 ? '#EF4444' : 'var(--primary)',
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>
              </div>

              {/* Join Code & Students Action */}
              <div style={{
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <button
                  onClick={() => handleCopyCode(cls.joinCode)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    fontWeight: '700',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  {copiedCode === cls.joinCode ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                  <span>{cls.joinCode}</span>
                </button>

                <button
                  onClick={() => navigate('students')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--primary-surface)',
                    color: 'var(--primary)',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <span>{lang === 'ar' ? 'سجل الطلاب' : 'View Roster'}</span>
                  <ArrowRight size={12} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* QR Code Invitation Modal */}
      {showQrModal && selectedClass && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowQrModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQrModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {lang === 'ar' ? selectedClass.nameAr : selectedClass.name}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {lang === 'ar' ? 'امسح الباركود بهاتف الطالب للانضمام الفوري للمجموعة' : 'Scan with student phone camera to join instantly'}
            </p>

            {/* Simulated QR Code Box */}
            <div style={{
              width: '200px',
              height: '200px',
              margin: '0 auto 20px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
            }}>
              <QrCode size={160} color="#181622" />
            </div>

            <div style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              fontWeight: '700',
              color: 'var(--primary)',
              letterSpacing: '1px'
            }}>
              {selectedClass.joinCode}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
