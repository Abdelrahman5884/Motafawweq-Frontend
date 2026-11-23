import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Calendar, Check, Plus, Trash2, X } from 'lucide-react';
import {
  GRADE_OPTIONS,
  WEEKDAYS,
  computeSessionConflicts,
  formatTimeTo12h,
  generateScheduleSummary,
  getSlotAvailabilityForSession,
} from './centerGroupsUtils';

export const CenterCohortFormModal = ({
  isOpen,
  editingCohort = null,
  onClose,
  onSave,
  branches = [],
  rooms = [],
  centerTeachers = [],
  checkScheduleConflict,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';
  const isEditMode = Boolean(editingCohort?.id);
  const firstRoom = rooms[0] || null;
  const assignableTeachers = centerTeachers.filter(
    (t) =>
      !t.status ||
      t.status === 'active' ||
      (isEditMode && editingCohort?.teacherId && String(t.id) === String(editingCohort.teacherId))
  );
  const firstTeacher = assignableTeachers[0] || null;

  const matchedInitRoom = editingCohort
    ? rooms.find(
        (r) =>
          r.id === editingCohort.roomId ||
          r.nameAr === editingCohort.hallName ||
          r.id === editingCohort.hallName
      ) || null
    : firstRoom;

  const matchedInitTeacher = isEditMode
    ? assignableTeachers.find(
        (t) =>
          (editingCohort.teacherId && t.id === editingCohort.teacherId) ||
          t.nameAr === editingCohort.teacherNameAr
      ) || null
    : firstTeacher;

  const [cohortName, setCohortName] = useState(
    () => (editingCohort ? editingCohort.nameAr || editingCohort.nameEn || '' : '')
  );
  const [subject, setSubject] = useState(
    () => editingCohort?.subjectAr || firstTeacher?.subjectAr || ''
  );
  const [gradeAr, setGradeAr] = useState(
    () => editingCohort?.gradeAr || GRADE_OPTIONS[5]
  );
  const [teacherMode, setTeacherMode] = useState(() => {
    if (isEditMode) {
      return matchedInitTeacher ? 'select' : 'custom';
    }
    return firstTeacher ? 'select' : 'custom';
  });
  const [selectedTeacherId, setSelectedTeacherId] = useState(
    () => matchedInitTeacher?.id || firstTeacher?.id || ''
  );
  const [customTeacherName, setCustomTeacherName] = useState(
    () =>
      editingCohort?.teacherNameAr ||
      matchedInitTeacher?.nameAr ||
      firstTeacher?.nameAr ||
      ''
  );
  const [selectedBranchId, setSelectedBranchId] = useState(
    () =>
      editingCohort?.branchId ||
      matchedInitRoom?.branchId ||
      branches[0]?.id ||
      ''
  );
  const [defaultRoomId, setDefaultRoomId] = useState(
    () => matchedInitRoom?.id || firstRoom?.id || ''
  );
  const [customHallName, setCustomHallName] = useState(() => {
    if (editingCohort) {
      return matchedInitRoom ? '' : editingCohort.hallName || 'القاعة الرئيسية';
    }
    return firstRoom ? '' : 'القاعة الرئيسية';
  });
  const [cohortPrice, setCohortPrice] = useState(() =>
    editingCohort && editingCohort.priceEgp !== undefined
      ? String(editingCohort.priceEgp)
      : '350'
  );
  const [cohortMaxStudents, setCohortMaxStudents] = useState(() =>
    editingCohort
      ? String(editingCohort.maxStudents || 50)
      : String(firstRoom?.capacity || 50)
  );
  const [sessions, setSessions] = useState(() => {
    const defaultHall =
      editingCohort?.hallName || firstRoom?.nameAr || 'القاعة الرئيسية';
    if (editingCohort) {
      const existingSlots = editingCohort.scheduleSlots || editingCohort.slots || [];
      if (existingSlots.length > 0) {
        return existingSlots.map((s, idx) => ({
          id: s.id || `sess-slot-${idx + 1}`,
          day: String(s.day || 'saturday').toLowerCase(),
          startTime: s.startTime || '16:00',
          endTime: s.endTime || '18:00',
          hall: s.hall || defaultHall,
        }));
      }
      return [
        {
          id: 'sess-slot-1',
          day: 'saturday',
          startTime: '16:00',
          endTime: '18:00',
          hall: defaultHall,
        },
      ];
    }
    return [
      { id: 'sess-slot-1', day: 'sunday', startTime: '16:00', endTime: '18:00', hall: defaultHall },
      { id: 'sess-slot-2', day: 'wednesday', startTime: '16:00', endTime: '18:00', hall: defaultHall },
    ];
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const matchedDefaultRoom = rooms.find((r) => r.id === defaultRoomId) || null;
  const matchedTeacher =
    teacherMode === 'select'
      ? assignableTeachers.find((t) => t.id === selectedTeacherId) || null
      : null;

  const effectiveTeacherName =
    teacherMode === 'select'
      ? matchedTeacher?.nameAr || customTeacherName.trim()
      : customTeacherName.trim();

  const effectiveHallName =
    matchedDefaultRoom?.nameAr || customHallName.trim() || 'القاعة الرئيسية';

  const teacherHint = matchedTeacher?.id || effectiveTeacherName || null;

  const sessionConflicts = computeSessionConflicts(
    sessions,
    checkScheduleConflict,
    editingCohort?.id || null,
    teacherHint
  );
  const hasAnyConflict = sessionConflicts.some((c) => c.hasConflict);

  const handleSetSessionCount = (count) => {
    const validCount = Math.max(1, Math.min(7, Number(count) || 1));
    const extraDays = ['sunday', 'wednesday', 'saturday', 'tuesday', 'monday', 'thursday', 'friday'];
    let next = [...sessions];
    if (validCount > sessions.length) {
      while (next.length < validCount) {
        const nextDay =
          extraDays.find((d) => !next.some((s) => s.day === d)) ||
          extraDays[next.length % extraDays.length];
        next.push({
          id: `sess-slot-${next.length + 1}`,
          day: nextDay,
          startTime: '16:00',
          endTime: '18:00',
          hall: effectiveHallName,
        });
      }
    } else {
      next = next.slice(0, validCount);
    }
    setSessions(next);
  };

  const handleAddSingleSession = () => {
    if (sessions.length >= 7) return;
    const extraDays = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const unusedDay = extraDays.find((d) => !sessions.some((s) => s.day === d)) || 'saturday';
    setSessions((prev) => [
      ...prev,
      {
        id: `sess-slot-${prev.length + 1}`,
        day: unusedDay,
        startTime: '16:00',
        endTime: '18:00',
        hall: effectiveHallName,
      },
    ]);
  };

  const handleRemoveSessionSlot = (index) => {
    if (sessions.length <= 1) return;
    setSessions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateSession = (index, field, value) => {
    setSessions((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, [field]: value } : s))
    );
  };

  const handleRoomSelectionChange = (newRoomId) => {
    setDefaultRoomId(newRoomId);
    const roomObj = rooms.find((r) => r.id === newRoomId);
    if (roomObj) {
      if (roomObj.branchId) setSelectedBranchId(roomObj.branchId);
      if (roomObj.capacity) setCohortMaxStudents(String(roomObj.capacity));
      setSessions((prev) => prev.map((s) => ({ ...s, hall: roomObj.nameAr })));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cohortName.trim() || !subject.trim() || hasAnyConflict || submitting) return;

    const formattedSlots = sessions.map((sess, idx) => {
      const dayObj = WEEKDAYS.find((w) => w.key === sess.day);
      const slotRoom =
        rooms.find((r) => r.nameAr === sess.hall || r.id === sess.hall) || matchedDefaultRoom;
      return {
        id: sess.id || `slot-${sess.day}-${idx + 1}`,
        day: sess.day,
        dayAr: dayObj?.labelAr || sess.day,
        dayEn: dayObj?.labelEn || sess.day,
        startTime: sess.startTime,
        endTime: sess.endTime,
        roomId: slotRoom?.id || undefined,
        hall: sess.hall || effectiveHallName,
      };
    });

    const selectedBranch = branches.find((b) => b.id === selectedBranchId) || null;
    const scheduleSummary = generateScheduleSummary(sessions, isAr);

    const payload = {
      nameAr: cohortName.trim(),
      nameEn: cohortName.trim(),
      subjectAr: subject.trim(),
      gradeAr,
      teacherId: matchedTeacher?.id || undefined,
      teacherNameAr: effectiveTeacherName || 'معلم السنتر',
      branchId: selectedBranch?.id || matchedDefaultRoom?.branchId || undefined,
      roomId: matchedDefaultRoom?.id || undefined,
      centerName: selectedBranch?.nameAr || matchedDefaultRoom?.branchNameAr || undefined,
      hallName: effectiveHallName,
      scheduleAr: scheduleSummary,
      maxStudents: Math.max(1, Number.parseInt(cohortMaxStudents, 10) || matchedDefaultRoom?.capacity || 50),
      priceEgp: Math.max(0, Number.parseFloat(cohortPrice) || 0),
      scheduleSlots: formattedSlots,
      slots: formattedSlots,
    };

    setSubmitting(true);
    try {
      await onSave(payload);
    } finally {
      setSubmitting(false);
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
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          maxWidth: '650px',
          width: '100%',
          padding: '24px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
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
              <Plus size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {isEditMode
                  ? isAr
                    ? 'تعديل بيانات المجموعة والمواعيد'
                    : 'Edit Cohort & Schedule'
                  : isAr
                  ? 'إنشاء مجموعة جديدة وتحديد الحصص الأسبوعية'
                  : 'Create New Study Cohort'}
              </h3>
              <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                {isAr
                  ? 'ربط المجموعة بالفرع والقاعة والمعلم مع فحص التعارضات الزمنية تلقائياً'
                  : 'Assign branch, hall, teacher, and conflict-checked weekly sessions'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '5px' }}>
                {isAr ? 'اسم المجموعة *' : 'Cohort Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={isAr ? 'مثال: فيزياء 3 ثانوي — مجموعة أ' : 'e.g. Physics Grade 12 - Group A'}
                value={cohortName}
                onChange={(e) => setCohortName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '5px' }}>
                {isAr ? 'الصف الدراسي *' : 'Academic Grade *'}
              </label>
              <select
                value={gradeAr}
                onChange={(e) => setGradeAr(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '5px' }}>
                {isAr ? 'المادة الدراسية *' : 'Subject *'}
              </label>
              <input
                type="text"
                required
                placeholder={isAr ? 'مثال: الفيزياء / الرياضيات / الأحياء' : 'e.g. Physics / Mathematics'}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: '800' }}>
                  {isAr ? 'المعلم المسؤول *' : 'Assigned Teacher *'}
                </label>
                {assignableTeachers.length > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setTeacherMode((prev) => (prev === 'select' ? 'custom' : 'select'))
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'var(--primary)',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    {teacherMode === 'select'
                      ? isAr
                        ? '+ كتابة اسم معلم يدوياً'
                        : '+ Type custom name'
                      : isAr
                      ? 'الاختيار من معلمي السنتر'
                      : 'Pick from center teachers'}
                  </button>
                ) : (
                  <Link
                    to="/center/operations"
                    style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}
                  >
                    {isAr ? '+ إدارة معلمي السنتر' : '+ Manage Faculty'}
                  </Link>
                )}
              </div>

              {assignableTeachers.length > 0 && teacherMode === 'select' ? (
                <select
                  value={selectedTeacherId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedTeacherId(id);
                    const tch = assignableTeachers.find((t) => t.id === id);
                    if (tch) {
                      setCustomTeacherName(tch.nameAr || '');
                      if (tch.subjectAr && !subject.trim()) {
                        setSubject(tch.subjectAr);
                      }
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {centerTeachers.map((tch) => {
                    const isPending = tch.status === 'invited';
                    const isDeclined = tch.status === 'declined';
                    const isDisabled =
                      (isPending || isDeclined) &&
                      !(isEditMode && String(tch.id) === String(editingCohort?.teacherId));
                    const suffix = isPending
                      ? isAr
                        ? ' — بانتظار موافقة المعلم'
                        : ' — Pending approval'
                      : isDeclined
                        ? isAr
                          ? ' — تم رفض الدعوة'
                          : ' — Declined'
                        : '';
                    return (
                      <option key={tch.id} value={tch.id} disabled={isDisabled}>
                        {tch.nameAr} {tch.subjectAr ? `(${tch.subjectAr})` : ''}
                        {suffix}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'اكتب اسم المعلم المسؤول...' : 'Enter teacher name...'}
                  value={customTeacherName}
                  onChange={(e) => setCustomTeacherName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700',
                  }}
                />
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {branches.length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '5px' }}>
                  {isAr ? 'الفرع' : 'Branch'}
                </label>
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: '800' }}>
                  {isAr ? 'القاعة الأساسية للمجموعة *' : 'Primary Hall *'}
                </label>
                {rooms.length === 0 && (
                  <Link
                    to="/center/halls"
                    style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}
                  >
                    {isAr ? '+ إضافة قاعات للسنتر' : '+ Add Halls'}
                  </Link>
                )}
              </div>

              {rooms.length > 0 ? (
                <select
                  value={defaultRoomId}
                  onChange={(e) => handleRoomSelectionChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nameAr} ({isAr ? `سعة ${r.capacity} مقعد` : `${r.capacity} seats`})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: القاعة الرئيسية' : 'e.g. Main Hall'}
                  value={customHallName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomHallName(val);
                    setSessions((prev) => prev.map((s) => ({ ...s, hall: val || 'القاعة الرئيسية' })));
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700',
                  }}
                />
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '5px' }}>
                {isAr ? 'اشتراك المجموعة (ج.م)' : 'Tuition Price (EGP)'}
              </label>
              <input
                type="number"
                min="0"
                max="100000"
                value={cohortPrice}
                onChange={(e) => setCohortPrice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '5px' }}>
                {isAr ? 'السعة القصوى للطلاب' : 'Max Students Capacity'}
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={cohortMaxStudents}
                onChange={(e) => setCohortMaxStudents(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                }}
              />
            </div>
          </div>

          {/* Multi-Session Weekly Scheduler */}
          <div
            style={{
              backgroundColor: 'var(--bg-app)',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} color="var(--primary)" />
                <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {isAr ? 'مواعيد الحصص الأسبوعية:' : 'Weekly Session Slots:'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {isAr ? 'عدد الحصص:' : 'Count:'}
                </span>
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSetSessionCount(num)}
                    style={{
                      padding: '3px 9px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: sessions.length === num ? 'var(--primary)' : 'var(--bg-surface)',
                      color: sessions.length === num ? '#FFFFFF' : 'var(--text-primary)',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sessions.map((sess, idx) => {
                const slotAvailability = getSlotAvailabilityForSession(
                  sess.day,
                  sess.hall,
                  idx,
                  sessions,
                  checkScheduleConflict,
                  editingCohort?.id || null,
                  teacherHint
                );
                const availableSlots = slotAvailability.filter((s) => s.isAvailable);
                const busySlots = slotAvailability.filter((s) => !s.isAvailable);
                const currentConflict = sessionConflicts[idx];
                const currentDayObj = WEEKDAYS.find((w) => w.key === sess.day);

                return (
                  <div
                    key={sess.id || idx}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: currentConflict?.hasConflict
                        ? '1.5px solid var(--danger)'
                        : '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)' }}>
                          {isAr ? `الحصة رقم ${idx + 1}` : `Session #${idx + 1}`}
                        </span>
                        {currentConflict?.hasConflict && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: '800',
                              padding: '2px 6px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              color: 'var(--danger)',
                            }}
                          >
                            {isAr ? 'يوجد تعارض زمني' : 'Schedule Conflict'}
                          </span>
                        )}
                      </div>

                      {sessions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSessionSlot(idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--danger)',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <Trash2 size={13} />
                          <span>{isAr ? 'حذف' : 'Remove'}</span>
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '8px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                          {isAr ? 'اليوم' : 'Day'}
                        </label>
                        <select
                          value={sess.day}
                          onChange={(e) => handleUpdateSession(idx, 'day', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-medium)',
                            backgroundColor: 'var(--bg-app)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                          }}
                        >
                          {WEEKDAYS.map((w) => (
                            <option key={w.key} value={w.key}>
                              {isAr ? w.labelAr : w.labelEn}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                          {isAr ? 'من' : 'From'}
                        </label>
                        <input
                          type="time"
                          value={sess.startTime}
                          onChange={(e) => handleUpdateSession(idx, 'startTime', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: 'var(--radius-sm)',
                            border: currentConflict?.hasConflict
                              ? '1.5px solid var(--danger)'
                              : '1px solid var(--border-medium)',
                            backgroundColor: 'var(--bg-app)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            fontWeight: '700',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                          {isAr ? 'إلى' : 'To'}
                        </label>
                        <input
                          type="time"
                          value={sess.endTime}
                          onChange={(e) => handleUpdateSession(idx, 'endTime', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: 'var(--radius-sm)',
                            border: currentConflict?.hasConflict
                              ? '1.5px solid var(--danger)'
                              : '1px solid var(--border-medium)',
                            backgroundColor: 'var(--bg-app)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            fontWeight: '700',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                          {isAr ? 'القاعة' : 'Hall'}
                        </label>
                        {rooms.length > 0 ? (
                          <select
                            value={sess.hall}
                            onChange={(e) => handleUpdateSession(idx, 'hall', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-medium)',
                              backgroundColor: 'var(--bg-app)',
                              color: 'var(--text-primary)',
                              fontSize: '12px',
                              fontWeight: '700',
                              cursor: 'pointer',
                            }}
                          >
                            {rooms.map((r) => (
                              <option key={r.id} value={r.nameAr}>
                                {r.nameAr}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={sess.hall}
                            onChange={(e) => handleUpdateSession(idx, 'hall', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '7px 10px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-medium)',
                              backgroundColor: 'var(--bg-app)',
                              color: 'var(--text-primary)',
                              fontSize: '12px',
                              fontWeight: '700',
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {currentConflict?.hasConflict ? (
                      <div
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.35)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontSize: '12px', fontWeight: '800' }}>
                          <AlertCircle size={15} />
                          <span>
                            {currentConflict.messageAr ||
                              `الميعاد (${formatTimeTo12h(sess.startTime, isAr)} - ${formatTimeTo12h(sess.endTime, isAr)}) غير متاح يوم ${currentDayObj?.labelAr}!`}
                          </span>
                        </div>

                        {availableSlots.length > 0 && (
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                              {isAr ? 'اختر موعداً بديلاً متاحاً:' : 'Pick an available alternative slot:'}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {availableSlots.map((av) => (
                                <button
                                  key={av.startTime}
                                  type="button"
                                  onClick={() => {
                                    handleUpdateSession(idx, 'startTime', av.startTime);
                                    handleUpdateSession(idx, 'endTime', av.endTime);
                                  }}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: 'rgba(22, 163, 74, 0.15)',
                                    border: '1px solid var(--success)',
                                    color: 'var(--success)',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <Check size={12} />
                                  <span>{av.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-app)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                          <span style={{ fontWeight: '800', color: 'var(--text-secondary)' }}>
                            {isAr
                              ? `الفترات السريعة المتاحة يوم ${currentDayObj?.labelAr || ''}:`
                              : `Quick slots on ${currentDayObj?.labelEn || ''}:`}
                          </span>
                          <span style={{ color: 'var(--success)', fontWeight: '800' }}>
                            {availableSlots.length} {isAr ? 'متاح' : 'available'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {availableSlots.map((av) => {
                            const isSelected =
                              sess.startTime === av.startTime && sess.endTime === av.endTime;
                            return (
                              <button
                                key={av.startTime}
                                type="button"
                                onClick={() => {
                                  handleUpdateSession(idx, 'startTime', av.startTime);
                                  handleUpdateSession(idx, 'endTime', av.endTime);
                                }}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: 'var(--radius-sm)',
                                  border: isSelected
                                    ? '1.5px solid var(--primary)'
                                    : '1px solid var(--border-medium)',
                                  backgroundColor: isSelected
                                    ? 'rgba(21, 136, 199, 0.18)'
                                    : 'var(--bg-surface)',
                                  color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                                  fontSize: '11px',
                                  fontWeight: isSelected ? '800' : '600',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                {isSelected && <Check size={11} />}
                                <span>{av.label}</span>
                              </button>
                            );
                          })}
                        </div>
                        {busySlots.length > 0 && (
                          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <span>{isAr ? 'محجوز:' : 'Booked:'}</span>
                            {busySlots.map((bs) => (
                              <span key={bs.startTime} style={{ color: 'var(--danger)', textDecoration: 'line-through' }}>
                                {bs.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {sessions.length < 7 && (
              <button
                type="button"
                onClick={handleAddSingleSession}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px dashed var(--primary)',
                  color: 'var(--primary)',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={14} />
                <span>{isAr ? '+ إضافة حصة أخرى في الأسبوع' : '+ Add another weekly session'}</span>
              </button>
            )}

            <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              {isAr ? 'ملخص المواعيد:' : 'Schedule Summary:'}{' '}
              <strong style={{ color: 'var(--primary)' }}>
                {generateScheduleSummary(sessions, isAr)}
              </strong>
            </div>
          </div>

          {hasAnyConflict && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                color: 'var(--danger)',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={17} />
              <span>
                {isAr
                  ? 'يرجى حل التعارضات الزمنية المشار إليها قبل حفظ المجموعة.'
                  : 'Please resolve schedule conflicts before saving.'}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="submit"
              disabled={hasAnyConflict || !cohortName.trim() || !subject.trim() || submitting}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor:
                  hasAnyConflict || !cohortName.trim() || !subject.trim() || submitting
                    ? 'var(--border-medium)'
                    : 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '800',
                fontSize: '13.5px',
                cursor:
                  hasAnyConflict || !cohortName.trim() || !subject.trim() || submitting
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              {submitting
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : isEditMode
                ? isAr
                  ? 'حفظ التعديلات'
                  : 'Save Changes'
                : isAr
                ? 'تأكيد وإنشاء المجموعة'
                : 'Create Cohort'}
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-medium)',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
