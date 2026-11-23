import React, { useEffect, useState } from 'react';
import { Printer, X } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { RealQRCode } from '../../../components/common/RealQRCode';
import { centerApi } from '../../../services/centerApi';

export const CenterStudentCardModal = ({
  student,
  activeGroup,
  centerNameAr = '',
  onClose,
  isBackendCenter = true,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';
  const [cardPayload, setCardPayload] = useState(null);

  useEffect(() => {
    if (!student || !activeGroup?.id || !isBackendCenter) {
      return undefined;
    }

    const enrollmentId = student.enrollmentId || student.id;
    if (!enrollmentId) return undefined;

    let cancelled = false;
    centerApi.groups
      .getStudentCard(activeGroup.id, enrollmentId)
      .then((res) => {
        if (!cancelled && res?.data) {
          setCardPayload(res.data);
        }
      })
      .catch(() => {
        if (!cancelled) setCardPayload(null);
      });

    return () => {
      cancelled = true;
    };
  }, [student, activeGroup?.id, isBackendCenter]);

  if (!student) return null;

  const displayCenterName =
    cardPayload?.centerNameAr ||
    centerNameAr ||
    activeGroup?.centerName ||
    (isAr ? 'السنتر التعليمي' : 'Educational Center');

  const displayName = cardPayload?.studentNameAr || student.nameAr || student.name || 'طالب';
  const displayGrade = cardPayload?.gradeAr || student.gradeAr || activeGroup?.gradeAr || '';
  const displayPhone = cardPayload?.studentPhone || student.phone || '';
  const displayBarcode = cardPayload?.barcode || student.barcode || '--';
  const displayPasscode = cardPayload?.passcode || student.passcode || student.studentCode || '--';
  const qrValue =
    cardPayload?.signedQrPayload ||
    cardPayload?.permanentQrPayload ||
    student.qrPayload ||
    (student.barcode ? `MOTAFAWWEQ:STUDENT:${student.barcode}` : displayPasscode);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.68)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '2px solid var(--primary)',
          maxWidth: '430px',
          width: '100%',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            fontSize: '11.5px',
            fontWeight: '900',
            color: 'var(--primary)',
            letterSpacing: '0.4px',
            marginBottom: '12px',
          }}
        >
          {displayCenterName} — {isAr ? 'بطاقة الحضور والباركود الذكية' : 'Smart Attendance ID Card'}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <Avatar
            src={student.avatar}
            name={displayName}
            size={68}
            border="3px solid var(--primary)"
          />
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: '4px 0' }}>
          {displayName}
        </h3>

        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          {displayGrade}
          {displayPhone ? ` • ${displayPhone}` : ''}
        </div>

        {activeGroup && (
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-app)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '14px',
            }}
          >
            {activeGroup.nameAr} • {activeGroup.hallName}
          </div>
        )}

        <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
          <RealQRCode value={qrValue} size={144} />
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-medium)',
            marginBottom: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', height: '38px', gap: '3px' }}>
            {[4, 2, 6, 2, 4, 8, 2, 4, 6, 2, 8, 4, 2, 6, 4, 2, 8, 4, 6, 2, 4, 2].map((w, i) => (
              <div key={i} style={{ width: `${w}px`, height: '100%', backgroundColor: '#06254E' }} />
            ))}
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '13.5px',
              fontWeight: '900',
              color: '#06254E',
              letterSpacing: '3px',
            }}
          >
            {displayBarcode}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-app)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {isAr ? 'كود الطالب السريع:' : 'Quick Passcode:'}
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: '900', color: 'var(--primary)' }}>
            {displayPasscode}
          </span>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Printer size={16} />
          <span>{isAr ? 'طباعة بطاقة الباركود للطالب' : 'Print Student ID Card'}</span>
        </button>
      </div>
    </div>
  );
};
