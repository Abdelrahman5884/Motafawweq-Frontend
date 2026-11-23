import React, { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import {
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Download,
  KeyRound,
  MapPin,
  Printer,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { RealBarcode } from '../../../components/common/RealBarcode';
import { RealQRCode } from '../../../components/common/RealQRCode';
import { printStudentCenterPass } from '../../../components/student/studentPassPrintTemplate';
import { centerApi } from '../../../services/centerApi';
import { copyTextToClipboard } from '../../../utils';

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
  const [loadingCard, setLoadingCard] = useState(() =>
    Boolean(student && activeGroup?.id && isBackendCenter && (student.enrollmentId || student.id))
  );
  const [copiedKey, setCopiedKey] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const printableCardRef = useRef(null);

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
      })
      .finally(() => {
        if (!cancelled) setLoadingCard(false);
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
  const displayAvatar =
    cardPayload?.avatar || cardPayload?.studentAvatar || student.avatar || null;
  const displayGrade =
    cardPayload?.gradeAr || student.gradeAr || activeGroup?.gradeAr || (isAr ? 'الصف الثالث الثانوي' : 'Grade 12');
  const displayPhone = cardPayload?.studentPhone || student.phone || '';
  const displayStudentCode =
    cardPayload?.studentCode || student.studentCode || student.passcode || student.barcode || 'STD-0000';
  const displayBarcode =
    cardPayload?.barcode || student.barcode || displayStudentCode;
  const displayPasscode =
    cardPayload?.passcode || student.passcode || '';
  const attendanceRate = Number(
    cardPayload?.attendanceRate ?? student.attendanceRate ?? 100
  );
  const issuedAt = cardPayload?.issuedAt || new Date().toISOString().slice(0, 10);

  // Permanent scannable QR payload that works for both on-screen and printed passes
  const qrValue =
    cardPayload?.permanentQrPayload ||
    student.qrPayload ||
    (displayBarcode ? `MOTAFAWWEQ:STUDENT:${displayBarcode}` : displayStudentCode);

  const groupForCard = {
    id: activeGroup?.id || 'group',
    nameAr: cardPayload?.groupNameAr || activeGroup?.nameAr || '',
    nameEn: activeGroup?.nameEn || cardPayload?.groupNameAr || activeGroup?.nameAr || '',
    teacherName:
      cardPayload?.teacherNameAr || activeGroup?.teacherNameAr || '',
    teacherNameAr:
      cardPayload?.teacherNameAr || activeGroup?.teacherNameAr || '',
    centerName: displayCenterName,
    hallName: cardPayload?.hallName || activeGroup?.hallName || '',
    scheduleAr: cardPayload?.scheduleAr || activeGroup?.scheduleAr || '',
    scheduleEn: activeGroup?.scheduleEn || cardPayload?.scheduleAr || activeGroup?.scheduleAr || '',
    passcode: displayPasscode,
  };

  const handleCopy = async (text, key) => {
    if (!text) return;
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(''), 2000);
    }
  };

  const handlePrintCard = async () => {
    if (isPrinting) return;
    setIsPrinting(true);
    try {
      await printStudentCenterPass({
        student: {
          name: displayName,
          phone: displayPhone,
          avatar: displayAvatar,
          code: displayStudentCode,
          grade: displayGrade,
          track: '',
          centerName: displayCenterName,
        },
        qrPayload: qrValue,
        barcodeValue: displayBarcode,
        passcode: displayPasscode,
        groups: groupForCard.nameAr ? [groupForCard] : [],
        attendanceRate,
        issuedAt,
        lang,
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDownloadPng = async () => {
    if (!printableCardRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      let dataUrl;
      try {
        dataUrl = await toPng(printableCardRef.current, {
          pixelRatio: 3,
          cacheBust: true,
          backgroundColor: '#041A3B',
        });
      } catch {
        dataUrl = await toPng(printableCardRef.current, {
          pixelRatio: 3,
          backgroundColor: '#041A3B',
          filter: (node) => node?.tagName !== 'IMG' || !node?.src?.startsWith('http'),
        });
      }
      const link = document.createElement('a');
      link.download = `Motafawweq-Card-${displayBarcode || displayStudentCode}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      await handlePrintCard();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 14, 32, 0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px',
        direction: isAr ? 'rtl' : 'ltr',
        fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-heading)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '94vh',
          overflowY: 'auto',
          padding: '20px',
          boxShadow: '0 28px 70px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Top Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'rgba(21, 136, 199, 0.14)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {isAr ? 'بطاقة الحضور والباركود الذكية للطالب' : 'Smart Student Attendance ID Card'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {isAr ? 'مجهزة للطباعة عالية الدقة ومسح الليزر ورمز QR' : 'High-DPI printable card with QR & Code-128 barcode'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Printable Luxury Card Preview */}
        <div
          ref={printableCardRef}
          style={{
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #041A3B 0%, #0A336E 55%, #0F5FA9 100%)',
            color: '#FFFFFF',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            boxShadow: '0 18px 42px rgba(4, 26, 59, 0.35)',
            position: 'relative',
          }}
        >
          {/* Card Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '13px 18px',
              background: 'rgba(2, 14, 34, 0.35)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(125, 211, 252, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/logo-dark.png"
                  alt="Motafawweq"
                  style={{ width: '21px', height: '21px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '900', lineHeight: 1.15 }}>
                  {displayCenterName}
                </div>
                <div style={{ fontSize: '9.5px', color: '#BAE6FD', fontWeight: '700' }}>
                  {isAr ? 'بطاقة طالب معتمدة • OFFICIAL STUDENT PASS' : 'OFFICIAL STUDENT ACCESS PASS'}
                </div>
              </div>
            </div>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 10px',
                borderRadius: '999px',
                background: 'rgba(16, 185, 129, 0.18)',
                border: '1px solid rgba(52, 211, 153, 0.45)',
                color: '#A7F3D0',
                fontSize: '10px',
                fontWeight: '800',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
              <span>{isAr ? 'مفعّلة' : 'ACTIVE'}</span>
            </span>
          </div>

          {/* Student Profile & Credentials */}
          <div style={{ padding: '16px 18px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '13px', marginBottom: '14px' }}>
              <Avatar
                src={displayAvatar}
                name={displayName}
                size={60}
                radius="15px"
                border="2.5px solid #38BDF8"
                boxShadow="0 6px 16px rgba(0, 0, 0, 0.25)"
              />

              <div style={{ minWidth: 0, flex: 1 }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '900',
                    margin: '0 0 4px 0',
                    color: '#FFFFFF',
                    lineHeight: 1.25,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {displayName}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'rgba(56, 189, 248, 0.2)',
                      border: '1px solid rgba(125, 211, 252, 0.35)',
                      color: '#E0F2FE',
                    }}
                  >
                    {displayGrade}
                  </span>
                  {displayPhone && (
                    <span
                      dir="ltr"
                      style={{
                        fontSize: '10.5px',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.12)',
                        color: '#E0F2FE',
                        fontFamily: 'monospace',
                      }}
                    >
                      {displayPhone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Cohort & Schedule Strip */}
            {groupForCard.nameAr && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '11px',
                  padding: '8px 12px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#FFFFFF' }}>
                    {groupForCard.nameAr}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#BAE6FD', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {groupForCard.teacherNameAr && <span>{groupForCard.teacherNameAr}</span>}
                    {groupForCard.hallName && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        • <MapPin size={10} /> {groupForCard.hallName}
                      </span>
                    )}
                  </div>
                </div>
                {groupForCard.scheduleAr && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(56, 189, 248, 0.2)',
                      color: '#E0F2FE',
                    }}
                  >
                    <Calendar size={10} />
                    <span>{groupForCard.scheduleAr}</span>
                  </span>
                )}
              </div>
            )}

            {/* Student Code & PIN Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: displayPasscode ? '1fr 1fr' : '1fr',
                gap: '8px',
                marginBottom: '14px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '11px',
                  padding: '7px 11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px',
                }}
              >
                <div>
                  <div style={{ fontSize: '9.5px', color: '#BAE6FD', fontWeight: '700' }}>
                    {isAr ? 'كود الطالب الموحد' : 'Student ID'}
                  </div>
                  <div dir="ltr" style={{ fontSize: '12.5px', fontWeight: '900', fontFamily: 'monospace', letterSpacing: '1px' }}>
                    {displayStudentCode}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(displayStudentCode, 'code')}
                  title={isAr ? 'نسخ كود الطالب' : 'Copy Student ID'}
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: 'none',
                    borderRadius: '7px',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E0F2FE',
                    cursor: 'pointer',
                  }}
                >
                  {copiedKey === 'code' ? <Check size={13} color="#34D399" /> : <Copy size={12} />}
                </button>
              </div>

              {displayPasscode && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '11px',
                    padding: '7px 11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '9.5px', color: '#BAE6FD', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <KeyRound size={10} />
                      <span>{isAr ? 'كود المرور السريع (PIN)' : 'Quick PIN'}</span>
                    </div>
                    <div dir="ltr" style={{ fontSize: '12.5px', fontWeight: '900', fontFamily: 'monospace', letterSpacing: '2px' }}>
                      {displayPasscode}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(displayPasscode, 'pin')}
                    title={isAr ? 'نسخ الكود السريع' : 'Copy PIN'}
                    style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: 'none',
                      borderRadius: '7px',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#E0F2FE',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedKey === 'pin' ? <Check size={13} color="#34D399" /> : <Copy size={12} />}
                  </button>
                </div>
              )}
            </div>

            {/* High-Contrast QR + Code-128 Laser Barcode Scan Zone */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '14px 14px 12px',
                color: '#06254E',
                boxShadow: '0 10px 26px rgba(2, 16, 38, 0.3)',
                textAlign: 'center',
              }}
            >
              {loadingCard ? (
                <div
                  style={{
                    padding: '32px 0',
                    color: '#64748B',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <RefreshCw size={16} className="animate-spin" />
                  <span>{isAr ? 'جاري تحميل بيانات البطاقة الموقعة...' : 'Loading signed card...'}</span>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: 'inline-flex',
                      padding: '8px',
                      borderRadius: '14px',
                      border: '2px solid #E0F2FE',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <RealQRCode value={qrValue} size={148} />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      fontSize: '11px',
                      fontWeight: '800',
                      color: '#059669',
                      marginTop: '7px',
                      marginBottom: '9px',
                    }}
                  >
                    <CheckCircle2 size={13} />
                    <span>
                      {isAr
                        ? 'امسح رمز QR أو باركود الليزر Code-128 عند بوابة القاعة'
                        : 'Scan QR or Code-128 Laser Barcode at Hall Gate'}
                    </span>
                  </div>

                  <div
                    style={{
                      paddingTop: '10px',
                      borderTop: '1px dashed #CBD5E1',
                      maxWidth: '300px',
                      margin: '0 auto',
                    }}
                  >
                    <RealBarcode value={displayBarcode} height={42} barColor="#06254E" showText />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card Footer Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 18px',
              background: 'rgba(2, 14, 34, 0.42)',
              borderTop: '1px solid rgba(125, 211, 252, 0.16)',
              fontSize: '10.5px',
              color: '#BAE6FD',
              fontWeight: '700',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Building2 size={12} />
              <span>{displayCenterName}</span>
            </span>
            <span dir="ltr" style={{ fontFamily: 'monospace' }}>
              {issuedAt}
            </span>
          </div>
        </div>

        {/* Print & Save PNG Actions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginTop: '16px',
          }}
        >
          <button
            type="button"
            disabled={isPrinting}
            onClick={handlePrintCard}
            style={{
              padding: '11px 14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: '800',
              fontSize: '13px',
              cursor: isPrinting ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              boxShadow: '0 6px 18px rgba(2, 132, 199, 0.35)',
            }}
          >
            <Printer size={16} />
            <span>
              {isPrinting
                ? isAr
                  ? 'جاري تجهيز الطباعة...'
                  : 'Preparing...'
                : isAr
                  ? 'طباعة البطاقة (وجهين)'
                  : 'Print ID Card'}
            </span>
          </button>

          <button
            type="button"
            disabled={isDownloading}
            onClick={handleDownloadPng}
            style={{
              padding: '11px 14px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
              fontWeight: '800',
              fontSize: '13px',
              cursor: isDownloading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
            }}
          >
            <Download size={16} color="var(--primary)" />
            <span>
              {isDownloading
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : isAr
                  ? 'حفظ كصورة PNG'
                  : 'Save as PNG'}
            </span>
          </button>
        </div>

        <div
          style={{
            marginTop: '10px',
            textAlign: 'center',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
          }}
        >
          <Sparkles size={12} color="var(--primary)" />
          <span>
            {isAr
              ? 'الطباعة تتم في صفحة مستقلة نظيفة تشمل الوجهين الأمامي والخلفي وعلامات القص جاهزة للتغليف'
              : 'Prints in a dedicated clean sheet with front & back card sides and lamination cut marks'}
          </span>
        </div>
      </div>
    </div>
  );
};
