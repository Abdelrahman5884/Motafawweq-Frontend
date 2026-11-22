import React, { useState, useEffect, useMemo } from 'react';
import { X, Building2, Calendar, Plus, Check, Trash2, AlertTriangle, Loader2 } from 'lucide-react';

const DAYS_LIST = [
  { key: 'saturday', ar: 'السبت', en: 'Saturday' },
  { key: 'sunday', ar: 'الأحد', en: 'Sunday' },
  { key: 'monday', ar: 'الاثنين', en: 'Monday' },
  { key: 'tuesday', ar: 'الثلاثاء', en: 'Tuesday' },
  { key: 'wednesday', ar: 'الأربعاء', en: 'Wednesday' },
  { key: 'thursday', ar: 'الخميس', en: 'Thursday' },
  { key: 'friday', ar: 'الجمعة', en: 'Friday' },
];

const timeToMinutes = (t) => {
  if (!t || typeof t !== 'string' || !t.includes(':')) return -1;
  const [h, m] = t.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return -1;
  return h * 60 + m;
};

const formatTimeTo12h = (t24) => {
  if (!t24) return '';
  const [h, m] = t24.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return t24;
  const period = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 || 12;
  return `${h12}:${m < 10 ? '0' + m : m} ${period}`;
};

const buildInitialFormState = (initialData) => {
  if (initialData) {
    return {
      nameAr: initialData.nameAr || '',
      nameEn: initialData.nameEn || '',
      subjectAr: initialData.subjectAr || 'الأحياء (الثانوية العامة)',
      gradeAr: initialData.gradeAr || 'الصف الثالث الثانوي',
      scheduleAr: initialData.scheduleAr || 'الأحد والأربعاء 4:00 عصراً',
      centerName: initialData.centerName || '',
      hallName: initialData.hallName || 'قاعة 1',
      priceEgp: initialData.priceEgp !== undefined && initialData.priceEgp !== null ? String(initialData.priceEgp) : '0',
      maxStudents: String(initialData.maxStudents || 50),
      joinCode: initialData.joinCode || '',
    };
  }
  return {
    nameAr: '',
    nameEn: '',
    subjectAr: 'الأحياء (الثانوية العامة)',
    gradeAr: 'الصف الثالث الثانوي',
    scheduleAr: 'الأحد والأربعاء من 04:00 م إلى 06:00 م',
    centerName: '',
    hallName: 'قاعة 1',
    priceEgp: '450',
    maxStudents: '50',
    joinCode: '',
  };
};

const buildInitialSessions = (initialData) => {
  if (initialData && Array.isArray(initialData.scheduleSlots) && initialData.scheduleSlots.length > 0) {
    return initialData.scheduleSlots.map((s) => ({
      day: s.day || 'sunday',
      startTime: s.startTime || '16:00',
      endTime: s.endTime || '18:00',
      hall: s.hall || initialData.hallName || 'قاعة 1',
    }));
  }
  return [
    { day: 'sunday', startTime: '16:00', endTime: '18:00', hall: 'قاعة 1' },
    { day: 'wednesday', startTime: '16:00', endTime: '18:00', hall: 'قاعة 1' },
  ];
};

const ClassFormModalContent = ({ initialData, existingGroups, lang, onClose, onSubmit }) => {
  const isEdit = Boolean(initialData);
  const isAr = lang === 'ar';

  const [formData, setFormData] = useState(() => buildInitialFormState(initialData));
  const [sessions, setSessions] = useState(() => buildInitialSessions(initialData));
  const [manualScheduleEdit, setManualScheduleEdit] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !submitting) {
        onClose?.();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [submitting, onClose]);

  const scheduleConflicts = useMemo(() => {
    const messages = [];
    const conflictingIndices = new Set();

    const parsed = sessions.map((s, idx) => ({
      idx,
      day: s.day,
      dayLabel: DAYS_LIST.find((d) => d.key === s.day)?.[isAr ? 'ar' : 'en'] || s.day,
      startTime: s.startTime,
      endTime: s.endTime,
      startMin: timeToMinutes(s.startTime),
      endMin: timeToMinutes(s.endTime),
    }));

    // 1. Check invalid time range (end <= start)
    parsed.forEach((s) => {
      if (s.startMin < 0 || s.endMin < 0 || s.endMin <= s.startMin) {
        conflictingIndices.add(s.idx);
        messages.push(
          isAr
            ? `الحصة (${s.idx + 1}) يوم ${s.dayLabel}: وقت الانتهاء يجب أن يكون بعد وقت البداية.`
            : `Session (${s.idx + 1}) on ${s.dayLabel}: end time must be after start time.`
        );
      }
    });

    // 2. Check intra-group overlaps
    for (let i = 0; i < parsed.length; i++) {
      for (let j = i + 1; j < parsed.length; j++) {
        const a = parsed[i];
        const b = parsed[j];
        if (
          a.day === b.day &&
          a.startMin >= 0 &&
          a.endMin > a.startMin &&
          b.startMin >= 0 &&
          b.endMin > b.startMin &&
          a.startMin < b.endMin &&
          a.endMin > b.startMin
        ) {
          conflictingIndices.add(a.idx);
          conflictingIndices.add(b.idx);
          messages.push(
            isAr
              ? `تداخل داخل نفس المجموعة يوم ${a.dayLabel} بين الحصة (${a.idx + 1}) والحصة (${b.idx + 1}).`
              : `Overlap within this group on ${a.dayLabel} between session (${a.idx + 1}) and (${b.idx + 1}).`
          );
        }
      }
    }

    // 3. Check against other active groups
    const currentId = initialData?.id || initialData?.uuid || null;
    const otherGroups = (existingGroups || []).filter(
      (g) => (g.status || 'active') === 'active' && g.id !== currentId && g.uuid !== currentId
    );

    parsed.forEach((s) => {
      if (s.startMin < 0 || s.endMin <= s.startMin) return;
      for (const grp of otherGroups) {
        const grpSlots = grp.scheduleSlots || [];
        for (const es of grpSlots) {
          if (es.day !== s.day) continue;
          const esStart = timeToMinutes(es.startTime);
          const esEnd = timeToMinutes(es.endTime);
          if (esStart < 0 || esEnd <= esStart) continue;
          if (s.startMin < esEnd && s.endMin > esStart) {
            conflictingIndices.add(s.idx);
            messages.push(
              isAr
                ? `تعارض يوم ${s.dayLabel} (${formatTimeTo12h(s.startTime)} - ${formatTimeTo12h(s.endTime)}) مع مجموعة «${grp.nameAr}» (${formatTimeTo12h(es.startTime)} - ${formatTimeTo12h(es.endTime)}).`
                : `Conflict on ${s.dayLabel} with "${grp.nameEn || grp.nameAr}" (${es.startTime} - ${es.endTime}).`
            );
            break;
          }
        }
      }
    });

    return {
      hasError: messages.length > 0,
      messages,
      conflictingIndices,
    };
  }, [sessions, existingGroups, initialData, isAr]);

  const generateScheduleSummary = (sessionsList) => {
    if (!sessionsList || sessionsList.length === 0) return;
    const dayNames = sessionsList
      .map((s) => DAYS_LIST.find((d) => d.key === s.day)?.ar || s.day)
      .join(' و');
    const first = sessionsList[0];
    const summary = `${dayNames} من ${formatTimeTo12h(first.startTime)} إلى ${formatTimeTo12h(first.endTime)}`;
    setFormData((prev) => ({ ...prev, scheduleAr: summary }));
  };

  const handleSessionCountChange = (count) => {
    const validCount = Math.max(1, Math.min(7, Number(count) || 1));
    let next = [...sessions];
    if (validCount > sessions.length) {
      const extraDays = ['tuesday', 'wednesday', 'thursday', 'saturday', 'monday', 'friday', 'sunday'];
      while (next.length < validCount) {
        const nextDay = extraDays[next.length % extraDays.length] || 'sunday';
        next.push({
          day: nextDay,
          startTime: '16:00',
          endTime: '18:00',
          hall: formData.hallName || 'قاعة 1',
        });
      }
    } else {
      next = next.slice(0, validCount);
    }
    setSessions(next);
    generateScheduleSummary(next);
  };

  const handleRemoveSessionSlot = (index) => {
    if (sessions.length <= 1) return;
    const next = sessions.filter((_, idx) => idx !== index);
    setSessions(next);
    generateScheduleSummary(next);
  };

  const handleUpdateSession = (index, field, value) => {
    const next = sessions.map((s, idx) => (idx === index ? { ...s, [field]: value } : s));
    setSessions(next);
    generateScheduleSummary(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const cleanName = formData.nameAr.trim();
    const cleanSubject = formData.subjectAr.trim();
    const cleanCenter = formData.centerName.trim();
    const cleanCode = formData.joinCode.trim().toUpperCase();
    const parsedPrice = formData.priceEgp === '' ? 0 : Number(formData.priceEgp);
    const parsedMax = Number(formData.maxStudents) || 50;

    if (cleanName.length < 3) {
      setSubmitError(isAr ? 'يجب أن يكون اسم المجموعة 3 أحرف على الأقل.' : 'Group name must be at least 3 characters.');
      return;
    }
    if (cleanSubject.length < 2) {
      setSubmitError(isAr ? 'يرجى إدخال اسم المادة الدراسية.' : 'Please enter a subject name.');
      return;
    }
    if (cleanCenter.length < 2) {
      setSubmitError(isAr ? 'يرجى إدخال اسم السنتر أو القاعة.' : 'Please enter center or hall name.');
      return;
    }
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setSubmitError(isAr ? 'يرجى إدخال سعر شهري صحيح (0 أو أكثر).' : 'Please enter a valid non-negative price.');
      return;
    }
    if (parsedMax < 1 || parsedMax > 1000) {
      setSubmitError(isAr ? 'الحد الأقصى للطلاب يجب أن يكون بين 1 و 1000.' : 'Max students must be between 1 and 1000.');
      return;
    }
    if (!isEdit && cleanCode && !/^[A-Z0-9\-_]{4,32}$/.test(cleanCode)) {
      setSubmitError(
        isAr
          ? 'كود الانضمام المخصص يجب أن يتكون من 4 إلى 32 حرفاً إنجليزياً أو أرقاماً أو (-) فقط.'
          : 'Custom join code must be 4-32 letters, numbers, hyphens, or underscores.'
      );
      return;
    }
    if (scheduleConflicts.hasError) {
      setSubmitError(scheduleConflicts.messages[0]);
      return;
    }

    const formattedSlots = sessions.map((s, idx) => {
      const dayMeta = DAYS_LIST.find((d) => d.key === s.day);
      return {
        id: `slot-${s.day}-${idx}-${Date.now()}`,
        day: s.day,
        dayAr: dayMeta?.ar || s.day,
        dayEn: dayMeta?.en || s.day,
        startTime: s.startTime,
        endTime: s.endTime,
        hall: s.hall || formData.hallName || 'القاعة الرئيسية',
      };
    });

    setSubmitError('');
    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        nameAr: cleanName,
        subjectAr: cleanSubject,
        centerName: cleanCenter,
        hallName: formData.hallName.trim() || 'قاعة 1',
        priceEgp: parsedPrice,
        maxStudents: parsedMax,
        joinCode: cleanCode,
        scheduleSlots: formattedSlots,
      });
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      setSubmitError(firstErr || err?.message || (isAr ? 'حدث خطأ أثناء حفظ المجموعة.' : 'Failed to save group.'));
    } finally {
      setSubmitting(false);
    }
  };

  const sessionCount = sessions.length;

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
        padding: '16px',
      }}
      onClick={() => {
        if (!submitting) onClose?.();
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Building2 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {isEdit
                  ? isAr
                    ? 'تعديل بيانات المجموعة والقاعة'
                    : 'Edit Cohort Details'
                  : isAr
                    ? 'إنشاء مجموعة دراسية جديدة'
                    : 'Create New Cohort'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                {isAr
                  ? 'أدخل اسم المجموعة، المادة، المواعيد، السعة، والسعر ومكان السنتر'
                  : 'Set group name, subject, timing, capacity, price, and center'}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: submitting ? 'not-allowed' : 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Group Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
              {isAr ? 'اسم المجموعة والقاعة' : 'Group Name'} *
            </label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={200}
              placeholder={isAr ? 'مثال: أحياء 3 ثانوي 2026 — مجموعة الدقي النخبة' : 'e.g. Dokki Elite Cohort'}
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '600',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Subject Name & Grade */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                {isAr ? 'اسم المادة والمقرر' : 'Subject'} *
              </label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={120}
                placeholder={isAr ? 'مثال: الأحياء (الثانوية العامة)' : 'e.g. Biology'}
                value={formData.subjectAr}
                onChange={(e) => setFormData({ ...formData, subjectAr: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '600',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                {isAr ? 'الصف الدراسي' : 'Grade'} *
              </label>
              <select
                value={formData.gradeAr}
                onChange={(e) => setFormData({ ...formData, gradeAr: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <option value="الصف الثالث الثانوي">{isAr ? 'الصف الثالث الثانوي' : '3rd Secondary'}</option>
                <option value="الصف الثاني الثانوي">{isAr ? 'الصف الثاني الثانوي' : '2nd Secondary'}</option>
                <option value="الصف الأول الثانوي">{isAr ? 'الصف الأول الثانوي' : '1st Secondary'}</option>
                <option value="الصف الثالث الإعدادي">{isAr ? 'الصف الثالث الإعدادي' : '3rd Prep'}</option>
                <option value="الصف الثاني الإعدادي">{isAr ? 'الصف الثاني الإعدادي' : '2nd Prep'}</option>
                <option value="الصف الأول الإعدادي">{isAr ? 'الصف الأول الإعدادي' : '1st Prep'}</option>
              </select>
            </div>
          </div>

          {/* Interactive Weekly Schedule Builder */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  <Calendar size={14} style={{ verticalAlign: 'middle', marginInlineEnd: '6px', color: 'var(--primary)' }} />
                  {isAr ? 'مواعيد وتكرار الحصص الأسبوعية' : 'Weekly Schedule & Sessions'} *
                </label>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {isAr
                    ? 'حدد عدد الحصص بالأسبوع ومواعيد كل حصة لتنزيلها بالجدول تلقائياً'
                    : 'Set session frequency and timing for calendar sync'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    padding: '2px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleSessionCountChange(sessionCount - 1)}
                    disabled={sessionCount <= 1}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '7px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: sessionCount <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                      fontSize: '16px',
                      fontWeight: '900',
                      cursor: sessionCount <= 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: '32px', textAlign: 'center', fontSize: '13px', fontWeight: '900', color: 'var(--primary)' }}>
                    {sessionCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSessionCountChange(sessionCount + 1)}
                    disabled={sessionCount >= 7}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '7px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: sessionCount >= 7 ? 'var(--text-muted)' : 'var(--text-primary)',
                      fontSize: '16px',
                      fontWeight: '900',
                      cursor: sessionCount >= 7 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    +
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSessionCountChange(num)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: sessionCount === num ? 'var(--primary)' : 'var(--border-subtle)',
                        backgroundColor: sessionCount === num ? 'var(--primary)' : 'var(--bg-subtle)',
                        color: sessionCount === num ? '#FFFFFF' : 'var(--text-secondary)',
                        fontSize: '11.5px',
                        fontWeight: '800',
                        cursor: 'pointer',
                      }}
                    >
                      {num} {isAr ? (num === 1 ? 'حصة' : 'حصص') : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sessions.map((sess, idx) => {
                const hasConflict = scheduleConflicts.conflictingIndices.has(idx);
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: hasConflict ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-surface)',
                      border: hasConflict ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--primary)' }}>
                        {isAr ? `الحصة رقم (${idx + 1})` : `Session (${idx + 1})`}
                      </span>
                      {sessions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSessionSlot(idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#EF4444',
                            cursor: 'pointer',
                            padding: '2px 4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontSize: '11px',
                            fontWeight: '700',
                          }}
                        >
                          <Trash2 size={12} />
                          <span>{isAr ? 'حذف الحصة' : 'Remove'}</span>
                        </button>
                      )}
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))',
                        gap: '8px',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <span style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '2px' }}>
                          {isAr ? 'اليوم' : 'Day'}
                        </span>
                        <select
                          value={sess.day}
                          onChange={(e) => handleUpdateSession(idx, 'day', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-primary)',
                            colorScheme: 'dark light',
                            fontSize: '12px',
                            fontWeight: '700',
                            outline: 'none',
                            fontFamily: 'inherit',
                          }}
                        >
                          {DAYS_LIST.map((d) => (
                            <option key={d.key} value={d.key} style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                              {isAr ? d.ar : d.en}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '2px' }}>
                          {isAr ? 'من' : 'From'}
                        </span>
                        <input
                          type="time"
                          value={sess.startTime}
                          onChange={(e) => handleUpdateSession(idx, 'startTime', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '5px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-primary)',
                            colorScheme: 'dark light',
                            fontSize: '12px',
                            fontWeight: '700',
                            outline: 'none',
                            fontFamily: 'inherit',
                          }}
                        />
                      </div>

                      <div>
                        <span style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '2px' }}>
                          {isAr ? 'إلى' : 'To'}
                        </span>
                        <input
                          type="time"
                          value={sess.endTime}
                          onChange={(e) => handleUpdateSession(idx, 'endTime', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '5px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-primary)',
                            colorScheme: 'dark light',
                            fontSize: '12px',
                            fontWeight: '700',
                            outline: 'none',
                            fontFamily: 'inherit',
                          }}
                        />
                      </div>

                      <div>
                        <span style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '2px' }}>
                          {isAr ? 'القاعة' : 'Hall'}
                        </span>
                        <input
                          type="text"
                          placeholder={isAr ? 'قاعة 1' : 'Hall 1'}
                          value={sess.hall || ''}
                          onChange={(e) => handleUpdateSession(idx, 'hall', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '5px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            fontWeight: '600',
                            outline: 'none',
                            fontFamily: 'inherit',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {scheduleConflicts.hasError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#DC2626',
                  fontSize: '12px',
                  fontWeight: '700',
                  lineHeight: 1.5,
                }}
              >
                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {scheduleConflicts.messages.map((msg, i) => (
                    <span key={i}>{msg}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', gap: '8px', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11.5px',
                  color: 'var(--primary)',
                  fontWeight: '700',
                  backgroundColor: 'var(--primary-surface)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}
              >
                <Check size={13} />
                <span>{formData.scheduleAr || (isAr ? 'سيتم إدراج المواعيد بالجدول الأسبوعي' : 'Will sync to weekly schedule')}</span>
              </div>

              <button
                type="button"
                onClick={() => setManualScheduleEdit(!manualScheduleEdit)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                {manualScheduleEdit ? (isAr ? 'إخفاء النص اليدوي' : 'Hide manual') : isAr ? 'تعديل النص يدوياً' : 'Edit text'}
              </button>
            </div>

            {manualScheduleEdit && (
              <input
                type="text"
                placeholder={isAr ? 'نص الموعد اليدوي' : 'Manual schedule string'}
                value={formData.scheduleAr}
                onChange={(e) => setFormData({ ...formData, scheduleAr: e.target.value })}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '600',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            )}
          </div>

          {/* Center Name & Main Hall */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                {isAr ? 'اسم السنتر / المقر' : 'Center Name'} *
              </label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={150}
                placeholder={isAr ? 'مثال: سنتر الرواد التعليمي — الدقي' : 'e.g. Al-Rowad Center'}
                value={formData.centerName}
                onChange={(e) => setFormData({ ...formData, centerName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '600',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                {isAr ? 'القاعة الرئيسية' : 'Main Hall'}
              </label>
              <input
                type="text"
                maxLength={100}
                placeholder={isAr ? 'مثال: قاعة 1' : 'e.g. Hall 1'}
                value={formData.hallName}
                onChange={(e) => setFormData({ ...formData, hallName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '600',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Price & Max Students Capacity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                {isAr ? 'السعر (ج.م / شهرياً)' : 'Price (EGP/mo)'} *
              </label>
              <input
                type="number"
                min="0"
                max="50000"
                required
                placeholder="450"
                value={formData.priceEgp}
                onChange={(e) => setFormData({ ...formData, priceEgp: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                {isAr ? 'السعة القصوى للطلاب' : 'Max Capacity'} *
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                required
                placeholder="50"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Join Code */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '5px' }}>
              {isEdit
                ? isAr
                  ? 'كود الانضمام الحالي (يمكن تجديده بأمان من نافذة الباركود QR)'
                  : 'Current Join Code (rotate safely from QR modal)'
                : isAr
                  ? 'كود الانضمام المخصص (اتركه فارغاً للتوليد التلقائي)'
                  : 'Custom Join Code (optional)'}
            </label>
            <input
              type="text"
              readOnly={isEdit}
              placeholder={isEdit ? formData.joinCode : 'مثال: BIO-DK-2026'}
              value={formData.joinCode}
              onChange={(e) => {
                if (!isEdit) {
                  setFormData({ ...formData, joinCode: e.target.value.toUpperCase() });
                }
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: isEdit ? 'var(--text-muted)' : 'var(--text-primary)',
                fontSize: '12px',
                fontFamily: 'monospace',
                fontWeight: '700',
                outline: 'none',
                opacity: isEdit ? 0.8 : 1,
                cursor: isEdit ? 'default' : 'text',
              }}
            />
          </div>

          {submitError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#DC2626',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              <AlertTriangle size={15} style={{ flexShrink: 0 }} />
              <span>{submitError}</span>
            </div>
          )}

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={scheduleConflicts.hasError || submitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: scheduleConflicts.hasError || submitting ? 'var(--text-muted)' : 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                cursor: scheduleConflicts.hasError || submitting ? 'not-allowed' : 'pointer',
                opacity: scheduleConflicts.hasError || submitting ? 0.65 : 1,
                boxShadow: scheduleConflicts.hasError || submitting ? 'none' : '0 2px 8px var(--primary-glow)',
              }}
            >
              {submitting ? <Loader2 size={15} className="animate-spin" /> : isEdit ? <Check size={15} /> : <Plus size={15} />}
              <span>
                {submitting
                  ? isAr
                    ? 'جاري الحفظ...'
                    : 'Saving...'
                  : isEdit
                    ? isAr
                      ? 'حفظ التعديلات'
                      : 'Save Changes'
                    : isAr
                      ? 'إنشاء المجموعة'
                      : 'Create Group'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ClassFormModal = ({
  isOpen,
  initialData = null,
  existingGroups = [],
  lang = 'ar',
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;
  const formKey = initialData?.id || initialData?.uuid || 'new';
  return (
    <ClassFormModalContent
      key={formKey}
      initialData={initialData}
      existingGroups={existingGroups}
      lang={lang}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};
