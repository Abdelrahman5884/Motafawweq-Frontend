import React, { useState, useEffect, useRef, useMemo } from 'react';
import { toPng } from 'html-to-image';
import { useLanguage } from '../../context/LanguageContext';
import { useGroups } from '../../context/GroupsContext';
import { useAuth } from '../../context/AuthContext';
import { studentApi } from '../../services/studentApi';
import { copyTextToClipboard } from '../../utils';
import { RealQRCode } from '../common/RealQRCode';
import { RealBarcode } from '../common/RealBarcode';
import { printStudentCenterPass } from './studentPassPrintTemplate';
import {
  Building2,
  CheckCircle2,
  X,
  Printer,
  Download,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Calendar,
  KeyRound,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const StudentCenterQrPassModal = ({
  isOpen,
  onClose,
  studentInfo,
  initialGroupId = 'all'
}) => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';
  const { groups } = useGroups();
  const { currentUser } = useAuth();

  const [attendanceData, setAttendanceData] = useState(null);
  const [loadingPass, setLoadingPass] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId || 'all');
  const [copiedKey, setCopiedKey] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [failedAvatarSrc, setFailedAvatarSrc] = useState(null);

  const printableCardRef = useRef(null);

  // Sync pre-selected group whenever modal opens
  const [lastOpenKey, setLastOpenKey] = useState('');
  const openKey = isOpen ? `${initialGroupId || 'all'}` : '';
  if (isOpen && openKey !== lastOpenKey) {
    setLastOpenKey(openKey);
    setSelectedGroupId(initialGroupId || 'all');
  }

  useEffect(() => {
    if (!isOpen) return undefined;
    let active = true;

    const loadPass = async () => {
      setLoadingPass(true);
      try {
        const res = await studentApi.attendance.getOverview();
        if (active && res?.data) {
          setAttendanceData(res.data);
        }
      } catch {
        // Fallback smoothly to currentUser + GroupsContext data
      } finally {
        if (active) setLoadingPass(false);
      }
    };

    loadPass();
    return () => {
      active = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const enrolledGroups = useMemo(() => {
    if (Array.isArray(attendanceData?.enrolledGroups) && attendanceData.enrolledGroups.length > 0) {
      return attendanceData.enrolledGroups;
    }
    return (groups || []).filter((g) => g.enrollmentStatus === 'enrolled');
  }, [attendanceData, groups]);

  const activeGroup = useMemo(() => {
    if (selectedGroupId === 'all') return null;
    return enrolledGroups.find((g) => g.id === selectedGroupId) || null;
  }, [selectedGroupId, enrolledGroups]);

  if (!isOpen) return null;

  const student = {
    name: attendanceData?.studentName || studentInfo?.name || currentUser?.nameAr || currentUser?.name || '',
    phone: attendanceData?.studentPhone || studentInfo?.phone || currentUser?.phone || '',
    avatar: attendanceData?.studentAvatar || currentUser?.avatar || '',
    code: attendanceData?.studentCode || studentInfo?.code || currentUser?.studentCode || currentUser?.student_code || `STD-${currentUser?.id || '0000'}`,
    grade: attendanceData?.gradeAr || studentInfo?.grade || currentUser?.grade || (isAr ? 'الصف الثالث الثانوي' : '3rd Secondary'),
    track: attendanceData?.trackAr || currentUser?.track || '',
    centerName: activeGroup?.centerName || attendanceData?.centerName || enrolledGroups[0]?.centerName || ''
  };

  // Use permanent QR payload so BOTH on-screen scans and printed cards work permanently across every group
  const activeBarcode = activeGroup?.barcode || attendanceData?.primaryBarcode || student.code;
  const activePasscode = activeGroup?.passcode || attendanceData?.primaryPasscode || '';
  const qrPayload = activeGroup?.barcode
    ? `MOTAFAWWEQ:STUDENT:${activeGroup.barcode}`
    : (attendanceData?.permanentQrPayload || `MOTAFAWWEQ:STUDENT:${student.code}`);

  const overallRate = Number(
    activeGroup?.attendanceRate ?? attendanceData?.attendanceSummary?.overallRate ?? 100
  );
  const issuedAt = attendanceData?.issuedAt || new Date().toISOString().slice(0, 10);
  const showAvatar = Boolean(student.avatar) && failedAvatarSrc !== student.avatar;

  const handleCopy = async (text, key) => {
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(''), 2000);
    }
  };

  const handlePrintPass = async () => {
    setIsPrinting(true);
    try {
      await printStudentCenterPass({
        student,
        qrPayload,
        barcodeValue: activeBarcode,
        passcode: activePasscode,
        groups: activeGroup ? [activeGroup] : enrolledGroups,
        attendanceRate: overallRate,
        issuedAt,
        lang
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDownloadPng = async () => {
    if (!printableCardRef.current) return;
    setIsDownloading(true);
    try {
      let dataUrl;
      try {
        dataUrl = await toPng(printableCardRef.current, {
          pixelRatio: 3,
          cacheBust: true,
          backgroundColor: '#041A3B'
        });
      } catch {
        // Retry skipping cross-origin avatar images if CORS blocks canvas export
        dataUrl = await toPng(printableCardRef.current, {
          pixelRatio: 3,
          backgroundColor: '#041A3B',
          filter: (node) => node?.dataset?.exportSkipCors !== 'true'
        });
      }
      const link = document.createElement('a');
      link.download = `Motafawweq-Pass-${student.code}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Fallback: open clean print preview (Save as PDF)
      await handlePrintPass();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 14, 32, 0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)',
        direction: isRtl ? 'rtl' : 'ltr'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '94vh',
          overflowY: 'auto',
          boxShadow: '0 28px 70px rgba(0, 0, 0, 0.45)',
          padding: '20px',
          position: 'relative'
        }}
      >
        {/* Top Modal Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'rgba(21, 136, 199, 0.14)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {isAr ? 'بطاقة حضور السنتر الذكية' : 'Smart Center Student Pass'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {isAr ? 'صالحة للمسح الرقمي والطباعة بجميع القاعات' : 'Ready for digital scan & high-DPI print'}
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
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Optional Group Scope Switcher when student has multiple enrolled groups */}
        {enrolledGroups.length > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '6px',
            marginBottom: '12px'
          }}>
            <button
              type="button"
              onClick={() => setSelectedGroupId('all')}
              style={{
                padding: '5px 11px',
                borderRadius: '999px',
                border: `1px solid ${selectedGroupId === 'all' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                backgroundColor: selectedGroupId === 'all' ? 'rgba(21, 136, 199, 0.14)' : 'var(--bg-subtle)',
                color: selectedGroupId === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '11.5px',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {isAr ? 'البطاقة الشاملة (الكل)' : 'Universal Pass'}
            </button>
            {enrolledGroups.map((grp) => {
              const active = selectedGroupId === grp.id;
              return (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => setSelectedGroupId(grp.id)}
                  style={{
                    padding: '5px 11px',
                    borderRadius: '999px',
                    border: `1px solid ${active ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    backgroundColor: active ? 'rgba(21, 136, 199, 0.14)' : 'var(--bg-subtle)',
                    color: active ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isAr ? grp.nameAr : (grp.nameEn || grp.nameAr)}
                </button>
              );
            })}
          </div>
        )}

        {/* ════════════ LUXURY EXECUTIVE STUDENT ID CARD ════════════ */}
        <div
          ref={printableCardRef}
          style={{
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #041A3B 0%, #0A336E 55%, #0F5FA9 100%)',
            color: '#FFFFFF',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            boxShadow: '0 18px 42px rgba(4, 26, 59, 0.35)',
            position: 'relative'
          }}
        >
          {/* Decorative Ambient Glows */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            insetInlineEnd: '-40px',
            width: '170px',
            height: '170px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            insetInlineStart: '-30px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {/* Card Header Bar */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            background: 'rgba(2, 14, 34, 0.35)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(125, 211, 252, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src="/logo-dark.png"
                  alt="Motafawweq"
                  style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: '900', letterSpacing: '-0.2px', lineHeight: 1.15 }}>
                  {isAr ? 'منصة متفوّق التعليمية' : 'Motafawweq Platform'}
                </div>
                <div style={{ fontSize: '10px', color: '#BAE6FD', fontWeight: '700' }}>
                  {isAr ? 'بطاقة طالب معتمدة • OFFICIAL PASS' : 'OFFICIAL STUDENT ACCESS PASS'}
                </div>
              </div>
            </div>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.18)',
              border: '1px solid rgba(52, 211, 153, 0.45)',
              color: '#A7F3D0',
              fontSize: '10.5px',
              fontWeight: '800'
            }}>
              <span className="live-time-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
              <span>{isAr ? 'مفعّلة' : 'ACTIVE'}</span>
            </span>
          </div>

          {/* Student Identity Row */}
          <div style={{ position: 'relative', padding: '18px 18px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{
                width: '58px',
                height: '58px',
                borderRadius: '15px',
                border: '2px solid #38BDF8',
                background: 'rgba(255, 255, 255, 0.14)',
                overflow: 'hidden',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: '900',
                color: '#E0F2FE',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
              }}>
                {showAvatar ? (
                  <img
                    src={student.avatar}
                    alt={student.name}
                    data-export-skip-cors="true"
                    onError={() => setFailedAvatarSrc(student.avatar)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  (student.name || 'ط').trim().charAt(0)
                )}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '900',
                  margin: '0 0 4px 0',
                  color: '#FFFFFF',
                  lineHeight: 1.25,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {student.name || (isAr ? 'طالب متفوّق' : 'Student')}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(56, 189, 248, 0.2)',
                    border: '1px solid rgba(125, 211, 252, 0.35)',
                    color: '#E0F2FE'
                  }}>
                    {student.grade}{student.track ? ` • ${student.track}` : ''}
                  </span>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(16, 185, 129, 0.18)',
                    color: '#A7F3D0'
                  }}>
                    {isAr ? `حضور ${overallRate}%` : `${overallRate}% Att.`}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Credentials Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: activePasscode ? '1fr 1fr' : '1fr',
              gap: '8px',
              marginBottom: '14px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '11px',
                padding: '8px 11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '6px'
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#BAE6FD', fontWeight: '700' }}>
                    {isAr ? 'كود الطالب الموحد' : 'Student ID'}
                  </div>
                  <div dir="ltr" style={{ fontSize: '13px', fontWeight: '900', fontFamily: 'monospace', letterSpacing: '1px' }}>
                    {student.code}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(student.code, 'code')}
                  title={isAr ? 'نسخ كود الطالب' : 'Copy Student ID'}
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: 'none',
                    borderRadius: '7px',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E0F2FE',
                    cursor: 'pointer'
                  }}
                >
                  {copiedKey === 'code' ? <Check size={14} color="#34D399" /> : <Copy size={13} />}
                </button>
              </div>

              {activePasscode && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '11px',
                  padding: '8px 11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px'
                }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#BAE6FD', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <KeyRound size={10} />
                      <span>{isAr ? 'كود المرور السريع (PIN)' : 'Quick PIN'}</span>
                    </div>
                    <div dir="ltr" style={{ fontSize: '13px', fontWeight: '900', fontFamily: 'monospace', letterSpacing: '2px' }}>
                      {activePasscode}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(activePasscode, 'pin')}
                    title={isAr ? 'نسخ كود المرور' : 'Copy PIN'}
                    style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: 'none',
                      borderRadius: '7px',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#E0F2FE',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedKey === 'pin' ? <Check size={14} color="#34D399" /> : <Copy size={13} />}
                  </button>
                </div>
              )}
            </div>

            {/* White High-Contrast QR + Code-128 Barcode Scan Zone */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px 14px 12px',
              color: '#06254E',
              boxShadow: '0 10px 26px rgba(2, 16, 38, 0.3)',
              textAlign: 'center'
            }}>
              {loadingPass ? (
                <div style={{ padding: '36px 0', color: '#64748B', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <RefreshCw size={16} className="spin" />
                  <span>{isAr ? 'جاري تجهيز البطاقة...' : 'Loading pass...'}</span>
                </div>
              ) : (
                <>
                  <div style={{
                    position: 'relative',
                    display: 'inline-flex',
                    padding: '10px',
                    borderRadius: '14px',
                    border: '2px solid #E0F2FE',
                    backgroundColor: '#FFFFFF'
                  }}>
                    <RealQRCode value={qrPayload} size={156} />
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#059669',
                    marginTop: '8px',
                    marginBottom: '10px'
                  }}>
                    <CheckCircle2 size={13} />
                    <span>{isAr ? 'امسح QR أو باركود الليزر عند بوابة السنتر' : 'Scan QR or Laser Barcode at Center Gate'}</span>
                  </div>

                  <div style={{
                    paddingTop: '10px',
                    borderTop: '1px dashed #CBD5E1',
                    maxWidth: '300px',
                    margin: '0 auto'
                  }}>
                    <RealBarcode value={activeBarcode} height={42} barColor="#06254E" showText />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card Bottom Strip */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            background: 'rgba(2, 14, 34, 0.42)',
            borderTop: '1px solid rgba(125, 211, 252, 0.16)',
            fontSize: '10.5px',
            color: '#BAE6FD',
            fontWeight: '700'
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Building2 size={12} />
              <span>{student.centerName || (isAr ? 'جميع فروع السنتر المعتمدة' : 'All Authorized Centers')}</span>
            </span>
            <span dir="ltr" style={{ fontFamily: 'monospace' }}>{issuedAt}</span>
          </div>
        </div>

        {/* Linked Enrolled Cohorts Summary */}
        <div style={{ marginTop: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {isAr ? 'المجموعات المفعّلة على بطاقتك:' : 'Active Cohorts on This Pass:'}
            </span>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)' }}>
              {enrolledGroups.length} {isAr ? 'مجموعات' : 'cohorts'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {enrolledGroups.length === 0 ? (
              <div style={{
                padding: '11px 14px',
                borderRadius: '11px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px dashed var(--border-subtle)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                textAlign: 'center'
              }}>
                {isAr
                  ? 'بطاقتك الموحدة جاهزة! فور قبول معلمك لطلب انضمامك ستظهر مجموعاتك هنا تلقائياً.'
                  : 'Your universal pass is ready! Enrolled cohorts will appear here once approved.'}
              </div>
            ) : (
              (activeGroup ? [activeGroup] : enrolledGroups).map((grp) => (
                <div
                  key={grp.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '11px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {isAr ? grp.nameAr : (grp.nameEn || grp.nameAr)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                      <span>{grp.teacherName || grp.teacherNameAr || ''}</span>
                      {grp.centerName && (
                        <>
                          <span>•</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <MapPin size={10} />
                            {grp.centerName}{grp.hallName ? ` (${grp.hallName})` : ''}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {(grp.scheduleAr || grp.scheduleEn) && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10.5px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '7px',
                        backgroundColor: 'rgba(21, 136, 199, 0.12)',
                        color: 'var(--primary)'
                      }}>
                        <Calendar size={10} />
                        {isAr ? grp.scheduleAr : (grp.scheduleEn || grp.scheduleAr)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons: Gorgeous Print + PNG Export + Copy */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginTop: '18px'
        }}>
          <button
            type="button"
            disabled={isPrinting}
            onClick={handlePrintPass}
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
              boxShadow: '0 6px 18px rgba(2, 132, 199, 0.35)'
            }}
          >
            <Printer size={16} />
            <span>{isPrinting ? (isAr ? 'جاري التجهيز...' : 'Preparing...') : (isAr ? 'طباعة البطاقة' : 'Print Pass')}</span>
          </button>

          <button
            type="button"
            disabled={isDownloading}
            onClick={handleDownloadPng}
            style={{
              padding: '11px 14px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontWeight: '800',
              fontSize: '13px',
              cursor: isDownloading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px'
            }}
          >
            <Download size={16} color="var(--primary)" />
            <span>{isDownloading ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ كصورة PNG' : 'Save as PNG')}</span>
          </button>
        </div>

        <div style={{
          marginTop: '10px',
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px'
        }}>
          <Sparkles size={12} color="var(--primary)" />
          <span>
            {isAr
              ? 'الطباعة تشمل الوجهين (الأمامي + الخلفي بالمواعيد) بعلامات قص جاهزة للتغليف'
              : 'Print layout includes front & back cards with clean cut marks ready for lamination'}
          </span>
        </div>
      </div>
    </div>
  );
};
