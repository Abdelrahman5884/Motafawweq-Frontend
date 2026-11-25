import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  ScanBarcode,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { useGroups } from '../../../context/GroupsContext';
import { AttendanceActionButtons } from './AttendanceActionButtons';

export const QuickAttendanceBar = ({
  groupId,
  students = [],
  attendanceDate,
  todayStr,
  onChangeDate,
  lang = 'ar',
  isRtl = true,
  isMobile = false,
}) => {
  const isAr = lang === 'ar';
  const { recordStudentAttendanceByCode, toggleStudentAttendance } = useGroups();

  const [codeInput, setCodeInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanFeedback, setScanFeedback] = useState(null);
  const codeInputRef = useRef(null);

  const [nameQuery, setNameQuery] = useState('');
  const [busyRowMap, setBusyRowMap] = useState({});

  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    students.forEach((s) => {
      if (s.todayAttendanceStatus === 'present' || s.todayAttendanceStatus === 'late') {
        present += 1;
      } else if (s.todayAttendanceStatus === 'absent' || s.todayAttendanceStatus === 'excused') {
        absent += 1;
      }
    });
    return {
      present,
      absent,
      unmarked: Math.max(0, students.length - present - absent),
    };
  }, [students]);

  const matchedByName = useMemo(() => {
    const q = nameQuery.trim().toLowerCase();
    if (!q) return [];
    return students
      .filter(
        (s) =>
          String(s.nameAr || '').toLowerCase().includes(q) ||
          String(s.name || '').toLowerCase().includes(q) ||
          String(s.studentCode || '').toLowerCase().includes(q) ||
          String(s.studentPasscode || '').toLowerCase().includes(q) ||
          String(s.studentBarcode || '').toLowerCase().includes(q) ||
          String(s.phone || '').toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [students, nameQuery]);

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    const clean = codeInput.trim();
    if (!clean || scanning || !groupId) return;

    setScanning(true);
    setScanFeedback(null);
    const res = await recordStudentAttendanceByCode(groupId, clean, attendanceDate);
    setScanning(false);

    if (res?.success) {
      setScanFeedback({
        type: res.alreadyRecorded ? 'warning' : 'success',
        text: res.message,
      });
      setCodeInput('');
      window.setTimeout(() => codeInputRef.current?.focus(), 40);
    } else {
      setScanFeedback({
        type: 'error',
        text:
          res?.message ||
          (isAr ? 'الكود غير مطابق لأي طالب في المجموعة.' : 'Student code not found in cohort.'),
      });
      codeInputRef.current?.select();
    }
  };

  const handleMarkStatus = useCallback(
    async (studentId, targetStatus) => {
      if (!groupId) return;
      setBusyRowMap((prev) => {
        if (prev[studentId]) return prev;
        return { ...prev, [studentId]: targetStatus };
      });
      await toggleStudentAttendance(groupId, studentId, targetStatus, attendanceDate);
      setBusyRowMap((prev) => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
    },
    [groupId, attendanceDate, toggleStudentAttendance]
  );

  const isViewingToday = attendanceDate === todayStr;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px',
        padding: isMobile ? '14px' : '16px 20px',
        marginBottom: '18px',
        boxShadow: 'var(--shadow-xs)',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Top Row: Concise Title + Live Counters + Date */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '9px',
              backgroundColor: 'rgba(21, 136, 199, 0.12)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ScanBarcode size={16} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)' }}>
            {isAr ? 'تسجيل الحضور' : 'Attendance Check-in'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: '#10B981',
              fontSize: '11.5px',
              fontWeight: '800',
            }}
          >
            <CheckCircle2 size={13} />
            <span>{isAr ? `حاضر: ${stats.present}` : `Present: ${stats.present}`}</span>
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              fontSize: '11.5px',
              fontWeight: '800',
            }}
          >
            <XCircle size={13} />
            <span>{isAr ? `غائب: ${stats.absent}` : `Absent: ${stats.absent}`}</span>
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '11.5px',
              fontWeight: '700',
            }}
          >
            <Clock size={12} />
            <span>{isAr ? `لم يُسجل: ${stats.unmarked}` : `Pending: ${stats.unmarked}`}</span>
          </span>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <input
              type="date"
              value={attendanceDate}
              max={todayStr}
              onChange={(e) => {
                if (e.target.value) {
                  setScanFeedback(null);
                  onChangeDate(e.target.value);
                }
              }}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '800',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            />
            {!isViewingToday && (
              <button
                type="button"
                onClick={() => {
                  setScanFeedback(null);
                  onChangeDate(todayStr);
                }}
                style={{
                  border: 'none',
                  borderRadius: '6px',
                  padding: '2px 7px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '10.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'اليوم' : 'Today'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Two-Column Inputs: By Code | By Name */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '12px',
          alignItems: 'start',
        }}
      >
        {/* By Student Code */}
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <label
            htmlFor="roster-attendance-code-input"
            style={{
              display: 'block',
              fontSize: '11.5px',
              fontWeight: '800',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
            }}
          >
            {isAr ? 'بالكود' : 'By Code'}
          </label>
          <form onSubmit={handleCodeSubmit} style={{ display: 'flex', gap: '8px' }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '7px 11px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                minWidth: 0,
              }}
            >
              <ScanBarcode size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
              <input
                id="roster-attendance-code-input"
                ref={codeInputRef}
                type="text"
                value={codeInput}
                onChange={(e) => {
                  setCodeInput(e.target.value);
                  if (scanFeedback) setScanFeedback(null);
                }}
                placeholder={isAr ? 'أدخل كود الطالب...' : 'Student code...'}
                autoComplete="off"
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  width: '100%',
                  fontFamily: 'inherit',
                }}
              />
              {codeInput && (
                <button
                  type="button"
                  onClick={() => {
                    setCodeInput('');
                    setScanFeedback(null);
                    codeInputRef.current?.focus();
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={scanning || !codeInput.trim()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: '800',
                cursor: scanning || !codeInput.trim() ? 'not-allowed' : 'pointer',
                opacity: scanning || !codeInput.trim() ? 0.6 : 1,
                flexShrink: 0,
              }}
            >
              {scanning ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              <span>{isAr ? 'تسجيل' : 'Check In'}</span>
            </button>
          </form>

          {scanFeedback && (
            <div
              style={{
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 10px',
                borderRadius: '9px',
                fontSize: '12px',
                fontWeight: '700',
                backgroundColor:
                  scanFeedback.type === 'success'
                    ? 'rgba(16, 185, 129, 0.12)'
                    : scanFeedback.type === 'warning'
                      ? 'rgba(245, 158, 11, 0.14)'
                      : 'rgba(239, 68, 68, 0.1)',
                color:
                  scanFeedback.type === 'success'
                    ? '#059669'
                    : scanFeedback.type === 'warning'
                      ? '#B45309'
                      : '#DC2626',
                border:
                  scanFeedback.type === 'success'
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : scanFeedback.type === 'warning'
                      ? '1px solid rgba(245, 158, 11, 0.3)'
                      : '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              {scanFeedback.type === 'success' ? (
                <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
              ) : (
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
              )}
              <span>{scanFeedback.text}</span>
            </div>
          )}
        </div>

        {/* By Student Name */}
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <label
            htmlFor="roster-attendance-name-search"
            style={{
              display: 'block',
              fontSize: '11.5px',
              fontWeight: '800',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
            }}
          >
            {isAr ? 'بالاسم' : 'By Name'}
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '7px 11px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <Search size={15} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
            <input
              id="roster-attendance-name-search"
              type="text"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder={isAr ? 'ابحث باسم الطالب...' : 'Student name...'}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '600',
                width: '100%',
                fontFamily: 'inherit',
              }}
            />
            {nameQuery && (
              <button
                type="button"
                onClick={() => setNameQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {nameQuery.trim() && (
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {matchedByName.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '6px 4px', textAlign: 'center' }}>
                  {isAr ? 'لا يوجد طالب مطابق.' : 'No matching student.'}
                </div>
              ) : (
                matchedByName.map((st) => {
                  const displayName = st.nameAr || st.name || 'طالب';
                  const isPresent = st.todayAttendanceStatus === 'present' || st.todayAttendanceStatus === 'late';
                  const isAbsent = st.todayAttendanceStatus === 'absent' || st.todayAttendanceStatus === 'excused';

                  return (
                    <div
                      key={st.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        padding: '7px 10px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <Avatar src={st.avatar} name={displayName} size={30} />
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '12.5px',
                              fontWeight: '800',
                              color: 'var(--text-primary)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {displayName}
                          </div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            {st.studentCode || st.studentPasscode || st.phone || '—'}
                          </div>
                        </div>
                      </div>

                      <div style={{ flexShrink: 0 }}>
                        <AttendanceActionButtons
                          isPresent={isPresent}
                          isAbsent={isAbsent}
                          busy={busyRowMap[st.id]}
                          isAr={isAr}
                          onMark={(status) => handleMarkStatus(st.id, status)}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
