import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Keyboard,
  LayoutGrid,
  List,
  Pencil,
  Phone,
  QrCode,
  RefreshCw,
  Scan,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { CameraBarcodeScanner } from '../../../components/common/CameraBarcodeScanner';
import { SBadge, SButton, SCard } from '../../../components/student/ui';
import { formatTimeTo12h, playScannerBeep } from './centerGroupsUtils';

export const CenterGroupDetailSection = ({
  activeGroup,
  groups = [],
  rooms = [],
  activeGroupStudents = [],
  pendingStudentsList = [],
  loadingRoster = false,
  isMobile = false,
  onBackToGroups,
  onSelectGroup,
  onEditCohort,
  onDeleteCohort,
  onRegenerateJoinCode,
  onOpenAddStudent,
  onOpenStudentCard,
  onToggleAttendance,
  onScanCode,
  onAcceptPending,
  onRejectPending,
  onRemoveStudent,
  onUpdatePayment,
  showToast,
  lang = 'ar',
  isRtl = true,
}) => {
  const isAr = lang === 'ar';

  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState('ALL'); // 'ALL' | 'present' | 'absent'
  const [studentsViewMode, setStudentsViewMode] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'cards' : 'table'
  );

  const [scannerMode, setScannerMode] = useState('manual'); // 'manual' | 'camera'
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanCodeInput, setScanCodeInput] = useState('');
  const [scanFeedback, setScanFeedback] = useState(null);
  const [scanningBusy, setScanningBusy] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [busyStudentId, setBusyStudentId] = useState(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);
  const [regeneratingCode, setRegeneratingCode] = useState(false);

  const scannerInputRef = useRef(null);
  const fileSnapRef = useRef(null);
  const feedbackTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const handleCopyCode = (code, id) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 1800);
  };

  const processScannedCode = async (rawText) => {
    if (!activeGroup || !rawText || scanningBusy) return;
    const raw = String(rawText).trim();
    if (!raw) return;

    setScanningBusy(true);
    try {
      const res = await onScanCode(activeGroup.id, raw);
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);

      if (res?.success) {
        playScannerBeep();
        const studentObj = res.student || res.record || { nameAr: 'الطالب' };
        setScanFeedback({
          success: true,
          message:
            res.message ||
            `تم مسح الباركود بنجاح! تم تسجيل حضور «${studentObj.nameAr || 'الطالب'}»`,
        });
        setScanCodeInput('');
        scannerInputRef.current?.focus();
      } else {
        setScanFeedback({
          success: false,
          message:
            res?.message ||
            `تم قراءة الكود [${raw.slice(0, 32)}] ولكن لم يتم العثور على طالب مطابق في هذه المجموعة.`,
        });
      }

      feedbackTimerRef.current = setTimeout(() => {
        setScanFeedback(null);
      }, 4500);
    } finally {
      setScanningBusy(false);
    }
  };

  const handleSnapshotChosen = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeGroup) return;

    try {
      const decoder = new Html5Qrcode('center-snap-decoder-box', {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.UPC_A,
        ],
        verbose: false,
      });
      const decodedText = await decoder.scanFile(file, true);
      if (decodedText) {
        await processScannedCode(decodedText);
      } else {
        showToast?.('لم يتم العثور على باركود واضح في الصورة.', 'warning');
      }
    } catch {
      showToast?.('تعذر قراءة الباركود من هذه الصورة. يرجى توضيح الإضاءة والمحاولة مجدداً.', 'warning');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleScanSubmit = (e) => {
    e?.preventDefault();
    if (!scanCodeInput.trim()) return;
    processScannedCode(scanCodeInput.trim());
  };

  const handleToggleStudentAttendance = async (stdId) => {
    if (!activeGroup || busyStudentId) return;
    setBusyStudentId(stdId);
    try {
      await onToggleAttendance(activeGroup.id, stdId);
    } finally {
      setBusyStudentId(null);
    }
  };

  const handleTogglePayment = async (std) => {
    if (!activeGroup || !onUpdatePayment || busyStudentId) return;
    const enrollmentId = std.enrollmentId || std.id;
    const isCurrentlyPaid = (std.paymentStatus || 'paid') === 'paid';
    const nextStatus = isCurrentlyPaid ? 'due' : 'paid';
    const nextDue = isCurrentlyPaid ? Number(activeGroup.priceEgp) || 350 : 0;

    setBusyStudentId(enrollmentId);
    try {
      await onUpdatePayment(activeGroup.id, enrollmentId, {
        payment_status: nextStatus,
        due_amount_egp: nextDue,
      });
    } finally {
      setBusyStudentId(null);
    }
  };

  const activeGroupRoom = rooms.find(
    (r) =>
      String(r.id) === String(activeGroup.roomId) ||
      r.nameAr === activeGroup.hallName ||
      String(r.id) === String(activeGroup.hallName)
  ) || {
    nameAr: activeGroup.hallName || (isAr ? 'القاعة الرئيسية' : 'Main Hall'),
    capacity: activeGroup.maxStudents || 50,
  };

  const presentCount = activeGroupStudents.filter((s) => s.todayStatus === 'present').length;
  const absentCount = activeGroupStudents.filter((s) => s.todayStatus !== 'present').length;
  const groupAttendanceRate =
    activeGroupStudents.length > 0
      ? Math.round((presentCount / activeGroupStudents.length) * 100)
      : 0;

  const filteredStudents = activeGroupStudents.filter((std) => {
    const q = studentSearchTerm.trim().toLowerCase();
    const matchQuery =
      !q ||
      (std.nameAr || '').toLowerCase().includes(q) ||
      (std.name || '').toLowerCase().includes(q) ||
      (std.phone || '').includes(q) ||
      (std.studentCode || '').toLowerCase().includes(q) ||
      (std.passcode || '').toLowerCase().includes(q) ||
      (std.barcode || '').toLowerCase().includes(q);

    if (studentStatusFilter === 'present') return matchQuery && std.todayStatus === 'present';
    if (studentStatusFilter === 'absent') return matchQuery && std.todayStatus !== 'present';
    return matchQuery;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* ── 1. Top Navigation & Actions Bar ── */}
      <div className="cg-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <SButton
            variant="ghost"
            size="sm"
            icon={isRtl ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
            onClick={onBackToGroups}
          >
            {isAr ? 'قائمة المجموعات' : 'All Cohorts'}
          </SButton>

          {groups.length > 1 && (
            <select
              aria-label={isAr ? 'الانتقال لمجموعة أخرى' : 'Switch cohort'}
              className="cg-select"
              value={activeGroup.id}
              onChange={(e) => onSelectGroup?.(e.target.value)}
              style={{ maxWidth: '250px' }}
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nameAr}
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <SButton
            variant="ghost"
            size="sm"
            icon={<Pencil size={14} />}
            onClick={(e) => onEditCohort?.(activeGroup, e)}
          >
            {isAr ? 'تعديل' : 'Edit'}
          </SButton>

          <SButton
            variant="ghost"
            size="sm"
            icon={<Trash2 size={14} color="var(--danger, #EF4444)" />}
            onClick={() => onDeleteCohort?.(activeGroup)}
            style={{ color: 'var(--danger, #EF4444)' }}
          >
            {isAr ? 'حذف' : 'Delete'}
          </SButton>

          <SButton
            variant="primary"
            size="sm"
            icon={<UserPlus size={15} />}
            onClick={onOpenAddStudent}
          >
            {isAr ? 'إضافة طالب للمجموعة' : 'Add Student'}
          </SButton>
        </div>
      </div>

      {/* ── 2. Group Overview Card ── */}
      <SCard padding={22}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {activeGroup.subjectAr && (
                <SBadge variant="primary" size="xs">
                  {activeGroup.subjectAr}
                </SBadge>
              )}

              {activeGroup.gradeAr && (
                <SBadge variant="default" size="xs">
                  {activeGroup.gradeAr}
                </SBadge>
              )}

              <SBadge variant="default" size="xs">
                <Building2 size={11} />
                <span>
                  {activeGroupRoom.nameAr} ({activeGroupRoom.capacity} {isAr ? 'مقعد' : 'seats'})
                </span>
              </SBadge>

              {activeGroup.joinCode && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(activeGroup.joinCode, 'hero-code')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11px',
                      padding: '3px 9px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-app)',
                      color: copiedCodeId === 'hero-code' ? 'var(--success, #10B981)' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      fontFamily: 'monospace',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    <span>
                      {isAr ? 'كود الانضمام:' : 'Code:'} {activeGroup.joinCode}
                    </span>
                    {copiedCodeId === 'hero-code' ? <Check size={12} /> : <Copy size={12} />}
                  </button>

                  {onRegenerateJoinCode && (
                    <button
                      type="button"
                      disabled={regeneratingCode}
                      onClick={async () => {
                        setRegeneratingCode(true);
                        try {
                          await onRegenerateJoinCode(activeGroup.id);
                        } finally {
                          setRegeneratingCode(false);
                        }
                      }}
                      title={isAr ? 'توليد كود انضمام جديد' : 'Regenerate Join Code'}
                      className="cg-icon-btn"
                      style={{ width: '26px', height: '26px' }}
                    >
                      <RefreshCw size={12} className={regeneratingCode ? 'animate-spin' : ''} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <h1 style={{ fontSize: '20.5px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px' }}>
              {activeGroup.nameAr}
            </h1>

            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span>
                {isAr ? 'المعلم المسؤول:' : 'Teacher:'}{' '}
                <strong style={{ color: 'var(--text-primary)' }}>
                  {activeGroup.teacherNameAr || (isAr ? 'غير محدد' : 'Unassigned')}
                </strong>
              </span>
              <span>
                {isAr ? 'قيمة الاشتراك:' : 'Tuition:'}{' '}
                <strong style={{ color: 'var(--success, #10B981)' }}>
                  {Number(activeGroup.priceEgp ?? 0).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                </strong>
              </span>
            </div>
          </div>

          {/* Mini Stats Strip */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: '10px', flexWrap: 'wrap', minWidth: '290px' }}>
            <div
              style={{
                flex: '1 1 100px',
                padding: '11px 14px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {isAr ? 'المقيدون' : 'Enrolled'}
                </span>
                <Users size={13} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {activeGroupStudents.length}{' '}
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                  / {activeGroup.maxStudents || activeGroupRoom.capacity || 50}
                </span>
              </div>
            </div>

            <div
              style={{
                flex: '1 1 100px',
                padding: '11px 14px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {isAr ? 'حاضر اليوم' : 'Present'}
                </span>
                <UserCheck size={13} color="var(--success, #10B981)" />
              </div>
              <div style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <span>{presentCount}</span>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--success, #10B981)' }}>
                  ({groupAttendanceRate}%)
                </span>
              </div>
            </div>

            <div
              style={{
                flex: '1 1 100px',
                padding: '11px 14px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {isAr ? 'غائب اليوم' : 'Absent'}
                </span>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: absentCount > 0 ? 'var(--danger, #EF4444)' : 'var(--border-medium)',
                  }}
                />
              </div>
              <div style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {absentCount}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Slots */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            paddingTop: '14px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
            {isAr ? 'المواعيد الأسبوعية:' : 'Weekly Schedule:'}
          </span>
          {(activeGroup.scheduleSlots || activeGroup.slots || []).map((slot, sIdx) => (
            <span
              key={slot.id || sIdx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 11px',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '800',
              }}
            >
              <Clock size={12} />
              <span>
                {slot.dayAr || slot.day}: {formatTimeTo12h(slot.startTime, isAr)} -{' '}
                {formatTimeTo12h(slot.endTime, isAr)}
              </span>
              <span style={{ opacity: 0.78, fontSize: '11px' }}>
                ({slot.hall || activeGroupRoom.nameAr})
              </span>
            </span>
          ))}
        </div>
      </SCard>

      {/* ── 3. Pending Join Requests & Sent Invitations ── */}
      {pendingStudentsList.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '18px',
            border: '1.5px solid rgba(245, 158, 11, 0.42)',
            padding: '18px 20px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <SBadge variant="warning" size="xs">
              {pendingStudentsList.length} {isAr ? 'معلق' : 'Pending'}
            </SBadge>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr
                ? 'طلبات الانضمام والدعوات المرسلة للطلاب'
                : 'Pending Join Requests & Sent Invitations'}
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
              gap: '10px',
            }}
          >
            {pendingStudentsList.map((pend) => {
              const pendId = pend.enrollmentId || pend.id;
              const isSentInvite =
                pend.joinMethod === 'teacher_invite' || Boolean(pend.isTeacherInvite);

              return (
                <div
                  key={pendId}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <Avatar
                      src={pend.avatar}
                      name={pend.nameAr || pend.name || 'طالب'}
                      size={38}
                      border="1.5px solid var(--primary)"
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {pend.nameAr || pend.name || 'طالب'}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        {pend.phone || pend.studentCode || ''}{' '}
                        {pend.parentPhone ? `• ${isAr ? 'ولي الأمر:' : 'Parent:'} ${pend.parentPhone}` : ''}
                      </div>
                      <div
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '800',
                          color: isSentInvite ? '#b45309' : 'var(--primary)',
                          marginTop: '2px',
                        }}
                      >
                        {isSentInvite
                          ? isAr
                            ? 'دعوة مرسلة من السنتر — بانتظار قبول الطالب من حسابه'
                            : 'Invite sent — Awaiting student acceptance'
                          : isAr
                            ? 'طلب انضمام عبر الكود — بانتظار موافقة السنتر'
                            : 'Join code request — Awaiting approval'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {!isSentInvite && (
                      <SButton
                        variant="primary"
                        size="sm"
                        icon={<Check size={13} />}
                        onClick={() => onAcceptPending?.(activeGroup.id, pendId)}
                      >
                        {isAr ? 'قبول' : 'Accept'}
                      </SButton>
                    )}

                    <SButton
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onRejectPending?.(activeGroup.id, pendId, '', {
                          isInviteCancel: isSentInvite,
                        })
                      }
                      style={{ color: 'var(--danger, #EF4444)' }}
                    >
                      {isSentInvite
                        ? isAr
                          ? 'إلغاء الدعوة'
                          : 'Cancel'
                        : isAr
                          ? 'رفض'
                          : 'Reject'}
                    </SButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 4. Interactive Barcode Scanner Terminal (RTL-Safe) ── */}
      <div className="cg-scanner-box">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '11px',
                backgroundColor: 'var(--primary-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                flexShrink: 0,
              }}
            >
              <Scan size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? 'ماسح باركود الحضور الفوري' : 'Instant Barcode & QR Attendance'}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {isAr
                  ? 'يدعم جهاز الباركود USB أو الكاميرا المباشرة أو إدخال كود الطالب / رقم الهاتف'
                  : 'Supports USB scanner gun, live camera QR scan, or student code / phone'}
              </span>
            </div>
          </div>

          <SBadge variant="success" size="sm">
            {scannerMode === 'camera' && isCameraActive
              ? isAr
                ? 'الكاميرا نشطة'
                : 'Camera Active'
              : isAr
                ? 'جاهز للمسح'
                : 'Scanner Ready'}
          </SBadge>
        </div>

        <input
          ref={fileSnapRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleSnapshotChosen}
          style={{ display: 'none' }}
        />
        <div id="center-snap-decoder-box" style={{ display: 'none' }} />

        {/* Scanner Mode Toggle */}
        <div
          className="cg-seg-group"
          style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', width: '100%', marginBottom: '14px' }}
        >
          <button
            type="button"
            className={`cg-seg-btn ${scannerMode === 'manual' ? 'primary-active' : ''}`}
            style={{ padding: '9px 14px', fontSize: '12.5px' }}
            onClick={() => {
              setScannerMode('manual');
              setIsCameraActive(false);
              scannerInputRef.current?.focus();
            }}
          >
            <Keyboard size={15} />
            <span>{isAr ? 'قارئ الباركود اليدوي / USB' : 'USB Gun / Manual Code'}</span>
          </button>

          <button
            type="button"
            className={`cg-seg-btn ${scannerMode === 'camera' ? 'primary-active' : ''}`}
            style={{ padding: '9px 14px', fontSize: '12.5px' }}
            onClick={() => {
              setScannerMode('camera');
              setIsCameraActive(false);
            }}
          >
            <Camera size={15} />
            <span>{isAr ? 'المسح عبر الكاميرا المباشرة' : 'Live Camera Scan'}</span>
          </button>
        </div>

        {scannerMode === 'camera' && (
          <div style={{ marginBottom: '14px' }}>
            {isCameraActive ? (
              <CameraBarcodeScanner
                onScanSuccess={processScannedCode}
                isScanningActive={isCameraActive}
                showControls={true}
                onClose={() => setIsCameraActive(false)}
              />
            ) : (
              <div
                style={{
                  padding: '24px 18px',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: '14px',
                  border: '1.5px dashed var(--border-medium)',
                }}
              >
                <Camera size={30} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '14.5px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 12px' }}>
                  {isAr ? 'جاهز لتشغيل الكاميرا المباشرة' : 'Ready to Start Live Camera'}
                </h4>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <SButton
                    variant="primary"
                    size="sm"
                    icon={<Camera size={14} />}
                    onClick={() => setIsCameraActive(true)}
                  >
                    {isAr ? 'تشغيل الكاميرا الآن' : 'Start Camera'}
                  </SButton>

                  <SButton
                    variant="ghost"
                    size="sm"
                    icon={<Scan size={14} />}
                    onClick={() => fileSnapRef.current?.click()}
                  >
                    {isAr ? 'رفع صورة للباركود' : 'Upload Barcode Image'}
                  </SButton>
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleScanSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div className="cg-scanner-input-wrap">
            <Scan size={17} className="cg-scanner-icon" />
            <input
              ref={scannerInputRef}
              type="text"
              className="cg-scanner-input"
              placeholder={
                isAr
                  ? 'امسح الباركود أو أدخل كود الطالب أو رقم الهاتف...'
                  : 'Scan barcode or enter passcode / phone...'
              }
              value={scanCodeInput}
              onChange={(e) => setScanCodeInput(e.target.value)}
            />
          </div>

          <SButton
            type="submit"
            variant="primary"
            size="md"
            icon={<QrCode size={16} />}
            disabled={scanningBusy || !scanCodeInput.trim()}
          >
            {scanningBusy
              ? isAr
                ? 'جاري التسجيل...'
                : 'Scanning...'
              : isAr
                ? 'تسجيل الحضور'
                : 'Record Attendance'}
          </SButton>
        </form>

        {scanFeedback && (
          <div
            style={{
              marginTop: '12px',
              padding: '11px 14px',
              borderRadius: '12px',
              backgroundColor: scanFeedback.success
                ? 'rgba(22, 163, 74, 0.1)'
                : 'rgba(220, 38, 38, 0.1)',
              border: `1.5px solid ${scanFeedback.success ? 'var(--success, #16A34A)' : 'var(--danger, #DC2626)'}`,
              color: scanFeedback.success ? 'var(--success, #16A34A)' : 'var(--danger, #DC2626)',
              fontSize: '13px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {scanFeedback.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{scanFeedback.message}</span>
          </div>
        )}

        {/* Quick 1-click check-in chips */}
        {activeGroupStudents.length > 0 && (
          <div
            style={{
              marginTop: '12px',
              paddingTop: '11px',
              borderTop: '1px dashed var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)' }}>
              {isAr ? 'تسجيل سريع:' : 'Quick check-in:'}
            </span>
            {activeGroupStudents.slice(0, 6).map((std) => {
              const code = std.barcode || std.passcode || std.studentCode || std.phone;
              if (!code) return null;
              return (
                <button
                  key={std.id}
                  type="button"
                  onClick={() => {
                    setScanCodeInput(code);
                    processScannedCode(code);
                  }}
                  style={{
                    padding: '4px 9px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '11px',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontWeight: '800',
                    fontFamily: 'inherit',
                  }}
                >
                  {std.nameAr} ({std.passcode || std.barcode})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 5. Enrolled Students Roster Section ── */}
      <SCard padding={22}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {isAr
                ? `قائمة الطلاب المقيدين (${filteredStudents.length} من ${activeGroupStudents.length})`
                : `Enrolled Students (${filteredStudents.length} of ${activeGroupStudents.length})`}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {isAr
                ? 'بحث سريع، تبديل الحضور والسداد، وطباعة بطاقة الباركود الذكية'
                : 'Search, toggle attendance & payment, and print smart barcode cards'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div className="cg-search-wrap" style={{ flex: '0 1 210px', minWidth: '175px' }}>
              <Search size={14} className="cg-search-icon" />
              <input
                type="text"
                className="cg-search-input"
                style={{ height: '36px' }}
                placeholder={isAr ? 'بحث عن طالب...' : 'Search student...'}
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
              />
            </div>

            <div className="cg-seg-group">
              <button
                type="button"
                className={`cg-seg-btn ${studentStatusFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setStudentStatusFilter('ALL')}
              >
                {isAr ? `الكل (${activeGroupStudents.length})` : `All (${activeGroupStudents.length})`}
              </button>
              <button
                type="button"
                className={`cg-seg-btn ${studentStatusFilter === 'present' ? 'active' : ''}`}
                onClick={() => setStudentStatusFilter('present')}
                style={studentStatusFilter === 'present' ? { color: 'var(--success, #10B981)' } : undefined}
              >
                {isAr ? `حاضر (${presentCount})` : `Present (${presentCount})`}
              </button>
              <button
                type="button"
                className={`cg-seg-btn ${studentStatusFilter === 'absent' ? 'active' : ''}`}
                onClick={() => setStudentStatusFilter('absent')}
                style={studentStatusFilter === 'absent' ? { color: 'var(--danger, #EF4444)' } : undefined}
              >
                {isAr ? `غائب (${absentCount})` : `Absent (${absentCount})`}
              </button>
            </div>

            <div className="cg-seg-group">
              <button
                type="button"
                className={`cg-seg-btn ${studentsViewMode === 'table' ? 'active' : ''}`}
                onClick={() => setStudentsViewMode('table')}
                title={isAr ? 'عرض جدول' : 'Table view'}
                style={{ padding: '6px 8px' }}
              >
                <List size={14} />
              </button>
              <button
                type="button"
                className={`cg-seg-btn ${studentsViewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setStudentsViewMode('cards')}
                title={isAr ? 'عرض بطاقات' : 'Cards view'}
                style={{ padding: '6px 8px' }}
              >
                <LayoutGrid size={14} />
              </button>
            </div>
          </div>
        </div>

        {loadingRoster && activeGroupStudents.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            {isAr ? 'جاري تحميل سجل طلاب المجموعة...' : 'Loading group roster...'}
          </div>
        ) : activeGroupStudents.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-app)',
              borderRadius: '14px',
              border: '1.5px dashed var(--border-medium)',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: 'var(--primary-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                margin: '0 auto 12px',
              }}
            >
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px' }}>
              {isAr ? 'لا يوجد طلاب مقيدون في هذه المجموعة بعد' : 'No students enrolled yet'}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 16px', lineHeight: 1.6 }}>
              {isAr
                ? 'أضف طلاب المنصة بدعوة فورية أو سجّل طلاب السنتر يدوياً لتوليد بطاقة الباركود لكل طالب.'
                : 'Invite existing platform students or register walk-in students to issue barcode ID cards.'}
            </p>
            <SButton variant="primary" size="sm" icon={<UserPlus size={14} />} onClick={onOpenAddStudent}>
              {isAr ? 'إضافة أول طالب للمجموعة' : 'Enroll First Student'}
            </SButton>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ padding: '28px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '700' }}>
            {isAr ? 'لا يوجد طلاب يطابقون خيارات البحث الحالية.' : 'No students match the current filter.'}
          </div>
        ) : studentsViewMode === 'table' ? (
          <div
            style={{
              overflowX: 'auto',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <table className="cg-table" style={{ textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr>
                  <th>{isAr ? 'الطالب والكود' : 'Student & Code'}</th>
                  <th>{isAr ? 'ولي الأمر' : 'Guardian'}</th>
                  <th>{isAr ? 'هاتف الطالب' : 'Phone'}</th>
                  <th>{isAr ? 'حالة السداد' : 'Payment'}</th>
                  <th>{isAr ? 'حضور اليوم' : 'Attendance'}</th>
                  <th>{isAr ? 'بطاقة الباركود' : 'ID Card'}</th>
                  <th>{isAr ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((std, idx) => {
                  const stdId = std.enrollmentId || std.id;
                  const isPresent = std.todayStatus === 'present';
                  const isPaid = (std.paymentStatus || 'paid') === 'paid';
                  const isBusy = busyStudentId === stdId;

                  return (
                    <tr key={stdId || idx}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Avatar
                            src={std.avatar}
                            name={std.nameAr || std.name || 'طالب'}
                            size={36}
                            border={`1.5px solid ${isPresent ? 'var(--success, #10B981)' : 'var(--primary)'}`}
                          />
                          <div>
                            <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                              {std.nameAr || std.name}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <span>{std.gradeAr || activeGroup.gradeAr}</span>
                              {std.passcode && (
                                <span
                                  onClick={() => handleCopyCode(std.passcode, `tbl-code-${stdId}`)}
                                  title={isAr ? 'نسخ كود الطالب' : 'Copy passcode'}
                                  style={{
                                    fontFamily: 'monospace',
                                    fontWeight: '800',
                                    color: 'var(--primary)',
                                    cursor: 'pointer',
                                  }}
                                >
                                  • {std.passcode}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ fontSize: '12px' }}>
                        <div style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
                          {std.parentNameAr || std.parentName || (isAr ? 'ولي الأمر' : 'Guardian')}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontFamily: 'monospace', direction: 'ltr', display: 'inline-block' }}>
                          {std.parentPhone || '-'}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <Phone size={12} color="var(--primary)" />
                          <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', direction: 'ltr' }}>
                            {std.phone || '-'}
                          </span>
                        </div>
                      </td>

                      <td>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleTogglePayment(std)}
                          title={isAr ? 'اضغط لتبديل حالة السداد' : 'Toggle payment'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '5px 10px',
                            borderRadius: '999px',
                            backgroundColor: isPaid
                              ? 'rgba(16, 185, 129, 0.12)'
                              : 'rgba(245, 158, 11, 0.14)',
                            color: isPaid ? 'var(--success, #10B981)' : '#b45309',
                            border: `1px solid ${
                              isPaid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.35)'
                            }`,
                            fontSize: '11px',
                            fontWeight: '800',
                            fontFamily: 'inherit',
                            cursor: isBusy ? 'wait' : 'pointer',
                          }}
                        >
                          <CreditCard size={12} />
                          <span>{std.paymentStatusAr || (isPaid ? 'مسدد بالكامل' : 'مستحق السداد')}</span>
                        </button>
                      </td>

                      <td>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleToggleStudentAttendance(stdId)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '999px',
                            backgroundColor: isPresent
                              ? 'rgba(22, 163, 74, 0.12)'
                              : 'rgba(220, 38, 38, 0.1)',
                            color: isPresent ? 'var(--success, #16A34A)' : 'var(--danger, #DC2626)',
                            border: `1.5px solid ${isPresent ? 'var(--success, #16A34A)' : 'var(--danger, #DC2626)'}`,
                            fontSize: '11px',
                            fontWeight: '800',
                            fontFamily: 'inherit',
                            cursor: isBusy ? 'wait' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {isPresent ? <Check size={12} /> : <X size={12} />}
                          <span>{isPresent ? (isAr ? 'حاضر' : 'Present') : isAr ? 'غائب' : 'Absent'}</span>
                        </button>
                      </td>

                      <td>
                        <SButton
                          variant="ghost"
                          size="sm"
                          icon={<QrCode size={13} />}
                          onClick={() => onOpenStudentCard?.(std)}
                        >
                          {isAr ? 'البطاقة' : 'Card'}
                        </SButton>
                      </td>

                      <td>
                        {confirmRemoveId === stdId ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmRemoveId(null);
                                onRemoveStudent?.(activeGroup.id, stdId);
                              }}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: 'var(--danger, #EF4444)',
                                color: '#ffffff',
                                fontSize: '10.5px',
                                fontWeight: '800',
                                fontFamily: 'inherit',
                                cursor: 'pointer',
                              }}
                            >
                              {isAr ? 'تأكيد' : 'Yes'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmRemoveId(null)}
                              style={{
                                padding: '4px 7px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-subtle)',
                                backgroundColor: 'var(--bg-app)',
                                color: 'var(--text-secondary)',
                                fontSize: '10.5px',
                                fontWeight: '700',
                                fontFamily: 'inherit',
                                cursor: 'pointer',
                              }}
                            >
                              {isAr ? 'إلغاء' : 'No'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="cg-icon-btn danger"
                            onClick={() => setConfirmRemoveId(stdId)}
                            title={isAr ? 'إلغاء قيد الطالب' : 'Remove student'}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(min(100%, 305px), 1fr))',
              gap: '14px',
            }}
          >
            {filteredStudents.map((std, idx) => {
              const stdId = std.enrollmentId || std.id;
              const isPresent = std.todayStatus === 'present';
              const isPaid = (std.paymentStatus || 'paid') === 'paid';
              const isBusy = busyStudentId === stdId;

              return (
                <div
                  key={stdId || idx}
                  className={`cg-student-card ${isPresent ? 'is-present' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                      <Avatar
                        src={std.avatar}
                        name={std.nameAr || std.name || 'طالب'}
                        size={42}
                        border={`2px solid ${isPresent ? 'var(--success, #16A34A)' : 'var(--primary)'}`}
                      />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)' }}>
                          {std.nameAr || std.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {std.gradeAr || activeGroup.gradeAr}
                        </div>
                      </div>
                    </div>

                    {confirmRemoveId === stdId ? (
                      <div style={{ display: 'inline-flex', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmRemoveId(null);
                            onRemoveStudent?.(activeGroup.id, stdId);
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: 'var(--danger, #EF4444)',
                            color: '#ffffff',
                            fontSize: '10.5px',
                            fontWeight: '800',
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                          }}
                        >
                          {isAr ? 'حذف' : 'Remove'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmRemoveId(null)}
                          style={{
                            padding: '4px 7px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-surface)',
                            color: 'var(--text-secondary)',
                            fontSize: '10.5px',
                            cursor: 'pointer',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="cg-icon-btn danger"
                        onClick={() => setConfirmRemoveId(stdId)}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Passcode & Barcode */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 11px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '11px',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>
                        {isAr ? 'الكود:' : 'Code:'}{' '}
                      </span>
                      <span
                        onClick={() => handleCopyCode(std.passcode, `card-code-${stdId}`)}
                        style={{ fontFamily: 'monospace', fontWeight: '900', color: 'var(--primary)', cursor: 'pointer' }}
                      >
                        {std.passcode || '--'}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>
                        {isAr ? 'الباركود:' : 'Barcode:'}{' '}
                      </span>
                      <span style={{ fontFamily: 'monospace', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {std.barcode || '--'}
                      </span>
                    </div>
                  </div>

                  {/* Phone & Payment */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', direction: 'ltr' }}>
                      {std.phone || '-'}
                    </span>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleTogglePayment(std)}
                      style={{
                        padding: '3px 9px',
                        borderRadius: '999px',
                        backgroundColor: isPaid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.14)',
                        color: isPaid ? 'var(--success, #10B981)' : '#b45309',
                        border: 'none',
                        fontSize: '10.5px',
                        fontWeight: '800',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      {std.paymentStatusAr || (isPaid ? 'مسدد بالكامل' : 'مستحق السداد')}
                    </button>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleToggleStudentAttendance(stdId)}
                      style={{
                        width: '100%',
                        padding: '9px 14px',
                        borderRadius: '10px',
                        backgroundColor: isPresent ? 'var(--success, #16A34A)' : 'transparent',
                        color: isPresent ? '#ffffff' : 'var(--danger, #DC2626)',
                        border: `1.5px solid ${isPresent ? 'var(--success, #16A34A)' : 'var(--danger, #DC2626)'}`,
                        fontSize: '12px',
                        fontWeight: '800',
                        fontFamily: 'inherit',
                        cursor: isBusy ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      {isPresent ? <CheckCircle2 size={14} /> : <X size={14} />}
                      <span>
                        {isPresent
                          ? isAr
                            ? 'حاضر اليوم (اضغط للإلغاء)'
                            : 'Present Today'
                          : isAr
                            ? 'غائب اليوم (اضغط للتسجيل)'
                            : 'Mark Present'}
                      </span>
                    </button>

                    <SButton
                      variant="ghost"
                      size="sm"
                      fullWidth
                      icon={<QrCode size={14} />}
                      onClick={() => onOpenStudentCard?.(std)}
                    >
                      {isAr ? 'عرض بطاقة الباركود الذكية' : 'View Smart Barcode Card'}
                    </SButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SCard>
    </div>
  );
};
