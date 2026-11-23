import React, { useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
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

  const handleCopyCode = (code, id) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
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
      r.id === activeGroup.roomId ||
      r.nameAr === activeGroup.hallName ||
      r.id === activeGroup.hallName
  ) || {
    nameAr: activeGroup.hallName || 'القاعة الرئيسية',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Action & Navigation Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          backgroundColor: 'var(--bg-surface-elevated)',
          padding: '16px 22px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <button
          type="button"
          onClick={onBackToGroups}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-app)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-medium)',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
          }}
        >
          {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          <span>{isAr ? 'العودة إلى قائمة المجموعات' : 'Back to Cohorts'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
            {isAr ? 'الانتقال لمجموعة أخرى:' : 'Switch Cohort:'}
          </span>
          <select
            value={activeGroup.id}
            onChange={(e) => onSelectGroup(e.target.value)}
            style={{
              height: '38px',
              padding: '0 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              maxWidth: '260px',
            }}
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nameAr}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={(e) => onEditCohort(activeGroup, e)}
            style={{
              height: '38px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Pencil size={14} />
            <span>{isAr ? 'تعديل المجموعة' : 'Edit Cohort'}</span>
          </button>

          <button
            type="button"
            onClick={() => onDeleteCohort(activeGroup)}
            style={{
              height: '38px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--danger, #EF4444)',
              border: '1px solid var(--border-medium)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={14} />
            <span>{isAr ? 'حذف' : 'Delete'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddStudent}
            style={{
              height: '38px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <UserPlus size={16} />
            <span>{isAr ? '+ إضافة طالب للمجموعة' : '+ Add Student'}</span>
          </button>
        </div>
      </div>

      {/* Group Hero Details Banner */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '22px 24px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(21, 136, 199, 0.1)',
                  color: 'var(--primary)',
                  fontWeight: '800',
                  border: '1px solid rgba(21, 136, 199, 0.2)',
                }}
              >
                {activeGroup.subjectAr}
              </span>

              {activeGroup.gradeAr && (
                <span
                  style={{
                    fontSize: '11px',
                    padding: '3px 9px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    fontWeight: '700',
                  }}
                >
                  {activeGroup.gradeAr}
                </span>
              )}

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
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      fontFamily: 'monospace',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    <span>
                      {isAr ? 'كود الانضمام:' : 'Code:'} {activeGroup.joinCode}
                    </span>
                    {copiedCodeId === 'hero-code' ? (
                      <Check size={12} color="var(--success)" />
                    ) : (
                      <Copy size={12} />
                    )}
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
                      style={{
                        padding: '4px 7px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-app)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--primary)',
                        cursor: regeneratingCode ? 'wait' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      <RefreshCw
                        size={12}
                        style={{
                          animation: regeneratingCode ? 'spin 1s linear infinite' : 'none',
                        }}
                      />
                    </button>
                  )}
                </div>
              )}

              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  fontWeight: '800',
                }}
              >
                {isAr
                  ? `القاعة: ${activeGroupRoom.nameAr} (${activeGroupRoom.capacity} مقعد)`
                  : `Hall: ${activeGroupRoom.nameAr} (${activeGroupRoom.capacity} seats)`}
              </span>
            </div>

            <h1 style={{ fontSize: '21px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              {activeGroup.nameAr}
            </h1>

            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <span>
                {isAr ? 'المعلم المسؤول:' : 'Assigned Teacher:'}{' '}
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

          {/* Group Stats */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: '12px', flexWrap: 'wrap', minWidth: '300px' }}>
            <div
              style={{
                flex: '1 1 110px',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {isAr ? 'إجمالي المقيدين' : 'Enrolled'}
                </span>
                <Users size={14} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {activeGroupStudents.length}{' '}
                <span style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  / {activeGroup.maxStudents || activeGroupRoom.capacity || 50}
                </span>
              </div>
            </div>

            <div
              style={{
                flex: '1 1 110px',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {isAr ? 'حاضر اليوم' : 'Present Today'}
                </span>
                <UserCheck size={14} color="var(--success)" />
              </div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span>{presentCount}</span>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--success)' }}>
                  ({groupAttendanceRate}%)
                </span>
              </div>
            </div>

            <div
              style={{
                flex: '1 1 110px',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {isAr ? 'غائب اليوم' : 'Absent Today'}
                </span>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: absentCount > 0 ? 'var(--danger)' : 'var(--border-medium)',
                  }}
                />
              </div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)' }}>
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
            {isAr ? 'المواعيد الأسبوعية للحصص:' : 'Weekly Session Schedule:'}
          </span>
          {(activeGroup.scheduleSlots || activeGroup.slots || []).map((slot, sIdx) => (
            <div
              key={slot.id || sIdx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: '700',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Clock size={13} color="var(--primary)" />
              <span>
                {slot.dayAr || slot.day}: {formatTimeTo12h(slot.startTime, isAr)} -{' '}
                {formatTimeTo12h(slot.endTime, isAr)}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                ({slot.hall || activeGroupRoom.nameAr})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Join Requests & Sent Invitations Section */}
      {pendingStudentsList.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid rgba(245, 158, 11, 0.38)',
            padding: '18px 22px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(245, 158, 11, 0.16)',
                  color: '#D97706',
                  fontSize: '11.5px',
                  fontWeight: '800',
                }}
              >
                {pendingStudentsList.length} {isAr ? 'طلب / دعوة معلقة' : 'Pending'}
              </span>
              <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {isAr
                  ? 'طلبات الانضمام والدعوات المرسلة للطلاب'
                  : 'Pending Join Requests & Sent Student Invitations'}
              </h3>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '10px' }}>
            {pendingStudentsList.map((pend) => {
              const pendId = pend.enrollmentId || pend.id;
              const isSentInvite =
                pend.joinMethod === 'teacher_invite' || Boolean(pend.isTeacherInvite);

              return (
                <div
                  key={pendId}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
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
                        {pend.parentPhone ? `• ولي الأمر: ${pend.parentPhone}` : ''}
                      </div>
                      <div
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '800',
                          color: isSentInvite ? '#D97706' : 'var(--primary)',
                          marginTop: '2px',
                        }}
                      >
                        {isSentInvite
                          ? isAr
                            ? 'دعوة مرسلة من السنتر — بانتظار قبول الطالب من حسابه'
                            : 'Invite sent — Awaiting student acceptance'
                          : isAr
                            ? 'طلب انضمام عبر كود المجموعة — بانتظار موافقة السنتر'
                            : 'Join code request — Awaiting center approval'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {!isSentInvite && (
                      <button
                        type="button"
                        onClick={() => onAcceptPending?.(activeGroup.id, pendId)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: 'none',
                          backgroundColor: 'var(--success, #10B981)',
                          color: '#FFFFFF',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Check size={13} />
                        <span>{isAr ? 'قبول' : 'Accept'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        onRejectPending?.(activeGroup.id, pendId, '', {
                          isInviteCancel: isSentInvite,
                        })
                      }
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(239, 68, 68, 0.35)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--danger, #EF4444)',
                        fontSize: '11.5px',
                        fontWeight: '800',
                        cursor: 'pointer',
                      }}
                    >
                      {isSentInvite
                        ? isAr
                          ? 'إلغاء الدعوة'
                          : 'Cancel Invite'
                        : isAr
                          ? 'رفض'
                          : 'Reject'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Barcode Scanner Terminal */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-xl)',
          border: '2px solid var(--primary)',
          padding: '22px',
          boxShadow: '0 8px 24px -4px rgba(21, 136, 199, 0.14)',
        }}
      >
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
                borderRadius: '10px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <Scan size={21} />
            </div>
            <div>
              <h3 style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {isAr
                  ? 'ماسح باركود الحضور الفوري (Barcode & QR Attendance)'
                  : 'Instant Barcode & QR Attendance Scanner'}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {isAr
                  ? 'جاهز للمسح المباشر بجهاز الباركود USB أو الكاميرا أو إدخال كود الطالب / رقم الهاتف'
                  : 'Ready for USB barcode scanner gun, camera QR scan, or student code/phone'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: 'var(--success, #10B981)',
                boxShadow: '0 0 8px var(--success, #10B981)',
              }}
            />
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--success, #10B981)' }}>
              {scannerMode === 'camera' && isCameraActive
                ? isAr
                  ? 'الكاميرا نشطة'
                  : 'Camera Active'
                : isAr
                ? 'نظام المسح متصل'
                : 'Scanner Ready'}
            </span>
          </div>
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
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            backgroundColor: 'var(--bg-app)',
            padding: '5px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '16px',
            border: '1px solid var(--border-subtle)',
            gap: '6px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setScannerMode('manual');
              setIsCameraActive(false);
              scannerInputRef.current?.focus();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: scannerMode === 'manual' ? 'var(--primary)' : 'transparent',
              color: scannerMode === 'manual' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Keyboard size={16} />
            <span>{isAr ? 'قارئ الباركود اليدوي / USB' : 'USB Gun / Manual Code'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setScannerMode('camera');
              setIsCameraActive(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: scannerMode === 'camera' ? 'var(--primary)' : 'transparent',
              color: scannerMode === 'camera' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Camera size={16} />
            <span>{isAr ? 'المسح عبر الكاميرا المباشرة' : 'Live Camera Scan'}</span>
          </button>
        </div>

        {scannerMode === 'camera' && (
          <div style={{ marginBottom: '16px' }}>
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
                  padding: '28px 20px',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1.5px dashed var(--border-medium)',
                }}
              >
                <Camera size={34} color="var(--primary)" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                  {isAr ? 'جاهز لتشغيل الكاميرا المباشرة' : 'Ready to Start Live Camera'}
                </h4>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsCameraActive(true)}
                    style={{
                      padding: '10px 22px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Camera size={15} />
                    <span>{isAr ? 'تشغيل الكاميرا الآن' : 'Start Camera'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileSnapRef.current?.click()}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Scan size={15} color="var(--primary)" />
                    <span>{isAr ? 'أو التقط صورة للباركود' : 'Upload Barcode Image'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleScanSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <input
              ref={scannerInputRef}
              type="text"
              placeholder={
                isAr
                  ? 'امسح الباركود أو أدخل كود الطالب أو رقم الهاتف...'
                  : 'Scan barcode or enter passcode / student phone...'
              }
              value={scanCodeInput}
              onChange={(e) => setScanCodeInput(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--border-medium)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13.5px',
                fontWeight: '700',
              }}
            />
            <Scan size={17} color="var(--primary)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
          </div>

          <button
            type="submit"
            disabled={scanningBusy || !scanCodeInput.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: '800',
              cursor: scanningBusy ? 'wait' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <QrCode size={17} />
            <span>{scanningBusy ? (isAr ? 'جاري التسجيل...' : 'Scanning...') : isAr ? 'تسجيل الحضور' : 'Record Attendance'}</span>
          </button>
        </form>

        {scanFeedback && (
          <div
            style={{
              marginTop: '14px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: scanFeedback.success
                ? 'rgba(22, 163, 74, 0.12)'
                : 'rgba(220, 38, 38, 0.12)',
              border: `1.5px solid ${scanFeedback.success ? 'var(--success)' : 'var(--danger)'}`,
              color: scanFeedback.success ? 'var(--success)' : 'var(--danger)',
              fontSize: '13.5px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {scanFeedback.success ? <CheckCircle2 size={19} /> : <AlertCircle size={19} />}
            <span>{scanFeedback.message}</span>
          </div>
        )}

        {/* Quick 1-click scan chips for actual enrolled students in this group */}
        {activeGroupStudents.length > 0 && (
          <div
            style={{
              marginTop: '14px',
              paddingTop: '12px',
              borderTop: '1px dashed var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)' }}>
              {isAr ? 'تسجيل سريع لطلاب المجموعة:' : 'Quick check-in:'}
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
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '11px',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontWeight: '800',
                  }}
                >
                  {std.nameAr} ({std.passcode || std.barcode})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Enrolled Students Roster Section */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '22px 24px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '18px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {isAr
                ? `قائمة الطلاب المقيدين (${filteredStudents.length} من أصل ${activeGroupStudents.length} طالب)`
                : `Enrolled Students (${filteredStudents.length} of ${activeGroupStudents.length})`}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {isAr
                ? 'بحث بالاسم أو الهاتف أو الكود، تغيير حالة الحضور والسداد، وطباعة بطاقة الباركود'
                : 'Search students, toggle attendance & tuition status, and print smart ID cards'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={isAr ? 'بحث عن طالب...' : 'Search student...'}
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
                style={{
                  height: '36px',
                  padding: '0 12px 0 32px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  width: '185px',
                  fontWeight: '600',
                }}
              />
              <Search size={14} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '11px' }} />
            </div>

            <div style={{ display: 'flex', backgroundColor: 'var(--bg-app)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
              <button
                type="button"
                onClick={() => setStudentStatusFilter('ALL')}
                style={{
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: studentStatusFilter === 'ALL' ? 'var(--bg-surface)' : 'transparent',
                  color: studentStatusFilter === 'ALL' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {isAr ? `الكل (${activeGroupStudents.length})` : `All (${activeGroupStudents.length})`}
              </button>
              <button
                type="button"
                onClick={() => setStudentStatusFilter('present')}
                style={{
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: studentStatusFilter === 'present' ? 'var(--bg-surface)' : 'transparent',
                  color: studentStatusFilter === 'present' ? 'var(--success)' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {isAr ? `حاضر (${presentCount})` : `Present (${presentCount})`}
              </button>
              <button
                type="button"
                onClick={() => setStudentStatusFilter('absent')}
                style={{
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: studentStatusFilter === 'absent' ? 'var(--bg-surface)' : 'transparent',
                  color: studentStatusFilter === 'absent' ? 'var(--danger)' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {isAr ? `غائب (${absentCount})` : `Absent (${absentCount})`}
              </button>
            </div>

            <div style={{ display: 'flex', backgroundColor: 'var(--bg-app)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
              <button
                type="button"
                onClick={() => setStudentsViewMode('table')}
                title={isAr ? 'عرض جدول' : 'Table view'}
                style={{
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: studentsViewMode === 'table' ? 'var(--bg-surface)' : 'transparent',
                  color: studentsViewMode === 'table' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <List size={15} />
              </button>
              <button
                type="button"
                onClick={() => setStudentsViewMode('cards')}
                title={isAr ? 'عرض بطاقات' : 'Cards view'}
                style={{
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: studentsViewMode === 'cards' ? 'var(--bg-surface)' : 'transparent',
                  color: studentsViewMode === 'cards' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <LayoutGrid size={15} />
              </button>
            </div>
          </div>
        </div>

        {loadingRoster && activeGroupStudents.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            {isAr ? 'جاري تحميل سجل طلاب المجموعة...' : 'Loading group roster...'}
          </div>
        ) : activeGroupStudents.length === 0 ? (
          <div
            style={{
              padding: '44px 24px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px dashed var(--border-medium)',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                margin: '0 auto 14px',
              }}
            >
              <Users size={26} />
            </div>
            <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px' }}>
              {isAr ? 'لا يوجد طلاب مقيدون في هذه المجموعة حتى الآن' : 'No students enrolled yet'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 18px', lineHeight: 1.5 }}>
              {isAr
                ? 'اضغط على زر «إضافة طالب للمجموعة» للبحث في قاعدة بيانات المنصة أو تسجيل طلاب جدد وتوليد باركود شخصي.'
                : 'Add existing platform students or register walk-in students to generate barcode cards.'}
            </p>
            <button
              type="button"
              onClick={onOpenAddStudent}
              style={{
                padding: '10px 22px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {isAr ? '+ إضافة أول طالب للمجموعة' : '+ Enroll First Student'}
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            {isAr ? 'لا يوجد طلاب يطابقون خيارات البحث أو التصفية الحالية.' : 'No students match the current filter.'}
          </div>
        ) : studentsViewMode === 'table' ? (
          <div
            style={{
              overflowX: 'auto',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <table style={{ width: '100%', minWidth: '820px', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1.5px solid var(--border-subtle)' }}>
                  <th style={{ padding: '13px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {isAr ? 'الطالب والكود' : 'Student & Code'}
                  </th>
                  <th style={{ padding: '13px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {isAr ? 'ولي الأمر' : 'Guardian'}
                  </th>
                  <th style={{ padding: '13px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {isAr ? 'هاتف الطالب' : 'Phone'}
                  </th>
                  <th style={{ padding: '13px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {isAr ? 'حالة السداد' : 'Payment'}
                  </th>
                  <th style={{ padding: '13px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {isAr ? 'حضور اليوم' : 'Attendance'}
                  </th>
                  <th style={{ padding: '13px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {isAr ? 'بطاقة الباركود' : 'ID Card'}
                  </th>
                  <th style={{ padding: '13px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {isAr ? 'إجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((std, idx) => {
                  const stdId = std.enrollmentId || std.id;
                  const isPresent = std.todayStatus === 'present';
                  const isPaid = (std.paymentStatus || 'paid') === 'paid';
                  const isBusy = busyStudentId === stdId;

                  return (
                    <tr
                      key={stdId || idx}
                      style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    >
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Avatar
                            src={std.avatar}
                            name={std.nameAr || std.name || 'طالب'}
                            size={38}
                            border={`1.5px solid ${isPresent ? 'var(--success)' : 'var(--primary)'}`}
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

                      <td style={{ padding: '13px 16px', fontSize: '12px' }}>
                        <div style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
                          {std.parentNameAr || std.parentName || (isAr ? 'ولي الأمر' : 'Guardian')}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontFamily: 'monospace', direction: 'ltr', display: 'inline-block' }}>
                          {std.parentPhone || '-'}
                        </div>
                      </td>

                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={13} color="var(--primary)" />
                          <span style={{ fontFamily: 'monospace', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', direction: 'ltr' }}>
                            {std.phone || '-'}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '13px 16px' }}>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleTogglePayment(std)}
                          title={isAr ? 'اضغط لتبديل حالة السداد' : 'Click to toggle payment status'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '5px 10px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: isPaid
                              ? 'rgba(16, 185, 129, 0.12)'
                              : 'rgba(245, 158, 11, 0.14)',
                            color: isPaid ? 'var(--success, #10B981)' : '#D97706',
                            border: `1px solid ${
                              isPaid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.35)'
                            }`,
                            fontSize: '11px',
                            fontWeight: '800',
                            cursor: isBusy ? 'wait' : 'pointer',
                          }}
                        >
                          <CreditCard size={12} />
                          <span>{std.paymentStatusAr || (isPaid ? 'مسدد بالكامل' : 'مستحق السداد')}</span>
                        </button>
                      </td>

                      <td style={{ padding: '13px 16px' }}>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleToggleStudentAttendance(stdId)}
                          style={{
                            padding: '6px 13px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: isPresent
                              ? 'rgba(22, 163, 74, 0.12)'
                              : 'rgba(220, 38, 38, 0.12)',
                            color: isPresent ? 'var(--success)' : 'var(--danger)',
                            border: `1.5px solid ${isPresent ? 'var(--success)' : 'var(--danger)'}`,
                            fontSize: '11px',
                            fontWeight: '800',
                            cursor: isBusy ? 'wait' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          {isPresent ? <Check size={13} /> : <X size={13} />}
                          <span>{isPresent ? (isAr ? 'حاضر اليوم' : 'Present') : isAr ? 'غائب' : 'Absent'}</span>
                        </button>
                      </td>

                      <td style={{ padding: '13px 16px' }}>
                        <button
                          type="button"
                          onClick={() => onOpenStudentCard(std)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-app)',
                            border: '1px solid var(--border-medium)',
                            color: 'var(--primary)',
                            fontSize: '11.5px',
                            fontWeight: '800',
                            cursor: 'pointer',
                          }}
                        >
                          <QrCode size={13} />
                          <span>{isAr ? 'بطاقة الباركود' : 'ID Card'}</span>
                        </button>
                      </td>

                      <td style={{ padding: '13px 16px' }}>
                        {confirmRemoveId === stdId ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmRemoveId(null);
                                onRemoveStudent(activeGroup.id, stdId);
                              }}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: 'var(--danger, #EF4444)',
                                color: '#FFFFFF',
                                fontSize: '10.5px',
                                fontWeight: '800',
                                cursor: 'pointer',
                              }}
                            >
                              {isAr ? 'تأكيد' : 'Confirm'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmRemoveId(null)}
                              style={{
                                padding: '4px 7px',
                                borderRadius: '4px',
                                border: '1px solid var(--border-subtle)',
                                backgroundColor: 'var(--bg-app)',
                                color: 'var(--text-secondary)',
                                fontSize: '10.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                              }}
                            >
                              {isAr ? 'إلغاء' : 'Cancel'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmRemoveId(stdId)}
                            title={isAr ? 'إلغاء قيد الطالب' : 'Remove student'}
                            style={{
                              padding: '7px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={15} />
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
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(min(100%, 310px), 1fr))',
              gap: '16px',
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
                  style={{
                    padding: '18px',
                    borderRadius: 'var(--radius-xl)',
                    border: isPresent
                      ? '2px solid rgba(22, 163, 74, 0.4)'
                      : '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar
                        src={std.avatar}
                        name={std.nameAr || std.name || 'طالب'}
                        size={44}
                        border={`2px solid ${isPresent ? 'var(--success)' : 'var(--primary)'}`}
                      />
                      <div>
                        <div style={{ fontSize: '14.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
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
                            onRemoveStudent(activeGroup.id, stdId);
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: 'none',
                            backgroundColor: 'var(--danger)',
                            color: '#FFFFFF',
                            fontSize: '10.5px',
                            fontWeight: '800',
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
                            borderRadius: '4px',
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
                        onClick={() => setConfirmRemoveId(stdId)}
                        style={{
                          padding: '5px',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  {/* Passcode & Barcode Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
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
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: '900',
                          color: 'var(--primary)',
                          cursor: 'pointer',
                        }}
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

                  {/* Phone & Payment Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {std.phone || '-'}
                    </span>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleTogglePayment(std)}
                      style={{
                        padding: '3px 9px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isPaid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.14)',
                        color: isPaid ? 'var(--success, #10B981)' : '#D97706',
                        border: 'none',
                        fontSize: '10.5px',
                        fontWeight: '800',
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
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: isPresent ? 'var(--success)' : 'transparent',
                        color: isPresent ? '#FFFFFF' : 'var(--danger)',
                        border: `1.5px solid ${isPresent ? 'var(--success)' : 'var(--danger)'}`,
                        fontSize: '12.5px',
                        fontWeight: '800',
                        cursor: isBusy ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      {isPresent ? <CheckCircle2 size={15} /> : <X size={15} />}
                      <span>
                        {isPresent
                          ? isAr
                            ? 'حاضر اليوم (اضغط للإلغاء)'
                            : 'Present Today'
                          : isAr
                          ? 'غائب اليوم (اضغط لتسجيل الحضور)'
                          : 'Mark Present'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenStudentCard(std)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-medium)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <QrCode size={14} color="var(--primary)" />
                      <span>{isAr ? 'عرض بطاقة الباركود الذكية' : 'View Smart Barcode Card'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
