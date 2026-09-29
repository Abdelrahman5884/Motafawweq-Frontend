import React, { useState, useEffect } from 'react';
import { X, Building2, BookOpen, Calendar, MapPin, Coins, Plus, Check, Trash2 } from 'lucide-react';

export const ClassFormModal = ({
  isOpen,
  initialData = null,
  lang = 'ar',
  onClose,
  onSubmit
}) => {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    subjectAr: 'الأحياء (الثانوية العامة)',
    gradeAr: 'الصف الثالث الثانوي',
    scheduleAr: 'الأحد والأربعاء 4:00 عصراً',
    centerName: 'سنتر الرواد التعليمي — الدقي',
    joinCode: '',
    hallName: 'قاعة 1'
  });

  const DAYS_LIST = [
    { key: 'saturday', ar: 'السبت', en: 'Saturday' },
    { key: 'sunday', ar: 'الأحد', en: 'Sunday' },
    { key: 'monday', ar: 'الاثنين', en: 'Monday' },
    { key: 'tuesday', ar: 'الثلاثاء', en: 'Tuesday' },
    { key: 'wednesday', ar: 'الأربعاء', en: 'Wednesday' },
    { key: 'thursday', ar: 'الخميس', en: 'Thursday' },
    { key: 'friday', ar: 'الجمعة', en: 'Friday' }
  ];

  const [sessionCount, setSessionCount] = useState(2);
  const [sessions, setSessions] = useState([
    { day: 'sunday', startTime: '16:00', endTime: '18:00', hall: 'قاعة 1' },
    { day: 'wednesday', startTime: '16:00', endTime: '18:00', hall: 'قاعة 1' }
  ]);
  const [manualScheduleEdit, setManualScheduleEdit] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nameAr: initialData.nameAr || '',
        nameEn: initialData.nameEn || '',
        subjectAr: initialData.subjectAr || 'الأحياء (الثانوية العامة)',
        gradeAr: initialData.gradeAr || 'الصف الثالث الثانوي',
        scheduleAr: initialData.scheduleAr || 'الأحد والأربعاء 4:00 عصراً',
        centerName: initialData.centerName || 'سنتر الرواد التعليمي — الدقي',
        hallName: initialData.hallName || 'قاعة 1',
        priceEgp: initialData.priceEgp || 450,
        joinCode: initialData.joinCode || ''
      });

      if (Array.isArray(initialData.scheduleSlots) && initialData.scheduleSlots.length > 0) {
        setSessions(initialData.scheduleSlots.map(s => ({
          day: s.day || 'sunday',
          startTime: s.startTime || '16:00',
          endTime: s.endTime || '18:00',
          hall: s.hall || initialData.hallName || 'قاعة 1'
        })));
        setSessionCount(initialData.scheduleSlots.length);
      }
    } else {
      setFormData({
        nameAr: '',
        nameEn: '',
        subjectAr: 'الأحياء (الثانوية العامة)',
        gradeAr: 'الصف الثالث الثانوي',
        scheduleAr: 'الأحد والأربعاء من 04:00 م إلى 06:00 م',
        centerName: 'سنتر الرواد التعليمي — الدقي',
        hallName: 'قاعة 1',
        priceEgp: 450,
        joinCode: ''
      });
      setSessionCount(2);
      setSessions([
        { day: 'sunday', startTime: '16:00', endTime: '18:00', hall: 'قاعة 1' },
        { day: 'wednesday', startTime: '16:00', endTime: '18:00', hall: 'قاعة 1' }
      ]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const formatTimeTo12h = (t24) => {
    if (!t24) return '';
    const [h, m] = t24.split(':').map(Number);
    const period = h >= 12 ? 'م' : 'ص';
    const h12 = h % 12 || 12;
    return `${h12}:${m < 10 ? '0' + m : m} ${period}`;
  };

  const handleSessionCountChange = (count) => {
    const validCount = Math.max(1, Math.min(7, Number(count) || 1));
    setSessionCount(validCount);
    let next = [...sessions];
    if (validCount > sessions.length) {
      const extraDays = ['tuesday', 'wednesday', 'thursday', 'saturday', 'monday', 'friday', 'sunday'];
      while (next.length < validCount) {
        const nextDay = extraDays[(next.length) % extraDays.length] || 'sunday';
        next.push({ day: nextDay, startTime: '16:00', endTime: '18:00', hall: formData.hallName || 'قاعة 1' });
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
    setSessionCount(next.length);
    setSessions(next);
    generateScheduleSummary(next);
  };

  const handleUpdateSession = (index, field, value) => {
    const next = sessions.map((s, idx) => idx === index ? { ...s, [field]: value } : s);
    setSessions(next);
    generateScheduleSummary(next);
  };

  const generateScheduleSummary = (sessionsList) => {
    if (!sessionsList || sessionsList.length === 0) return;
    const dayNames = sessionsList.map(s => DAYS_LIST.find(d => d.key === s.day)?.ar || s.day).join(' و');
    const first = sessionsList[0];
    const summary = `${dayNames} من ${formatTimeTo12h(first.startTime)} إلى ${formatTimeTo12h(first.endTime)}`;
    setFormData(prev => ({ ...prev, scheduleAr: summary }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nameAr.trim()) return;

    const formattedSlots = sessions.map((s, idx) => {
      const dayMeta = DAYS_LIST.find(d => d.key === s.day);
      return {
        id: `slot-${s.day}-${idx}-${Date.now()}`,
        day: s.day,
        dayAr: dayMeta?.ar || s.day,
        dayEn: dayMeta?.en || s.day,
        startTime: s.startTime,
        endTime: s.endTime,
        hall: s.hall || formData.hallName || 'القاعة الرئيسية'
      };
    });

    onSubmit({
      ...formData,
      scheduleSlots: formattedSlots
    });
  };

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
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {isEdit
                  ? (lang === 'ar' ? 'تعديل بيانات المجموعة والقاعة' : 'Edit Cohort Details')
                  : (lang === 'ar' ? 'إنشاء مجموعة دراسية جديدة' : 'Create New Cohort')}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                {lang === 'ar' ? 'أدخل اسم المجموعة، المادة، المواعيد، والسعر ومكان السنتر' : 'Set group name, subject, timing, price and center'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Group Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
              {lang === 'ar' ? 'اسم المجموعة والقاعة' : 'Group Name'} *
            </label>
            <input
              type="text"
              required
              placeholder={lang === 'ar' ? 'مثال: أحياء 3 ثانوي 2026 — مجموعة الدقي النخبة' : 'e.g. Dokki Elite Cohort'}
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
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Subject Name & Grade in 2 Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                {lang === 'ar' ? 'اسم المادة والمقرر' : 'Subject'} *
              </label>
              <input
                type="text"
                required
                placeholder={lang === 'ar' ? 'مثال: الأحياء (الثانوية العامة)' : 'e.g. Biology'}
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
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                {lang === 'ar' ? 'الصف الدراسي' : 'Grade'} *
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
                  cursor: 'pointer'
                }}
              >
                <option value="الصف الثالث الثانوي">{lang === 'ar' ? 'الصف الثالث الثانوي' : '3rd Secondary'}</option>
                <option value="الصف الثاني الثانوي">{lang === 'ar' ? 'الصف الثاني الثانوي' : '2nd Secondary'}</option>
                <option value="الصف الأول الثانوي">{lang === 'ar' ? 'الصف الأول الثانوي' : '1st Secondary'}</option>
              </select>
            </div>
          </div>

          {/* Interactive Weekly Schedule Builder */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  <Calendar size={14} style={{ verticalAlign: 'middle', marginLeft: '6px', color: 'var(--primary)' }} />
                  {lang === 'ar' ? 'مواعيد وتكرار الحصص الأسبوعية' : 'Weekly Schedule & Sessions'} *
                </label>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {lang === 'ar' ? 'حدد عدد الحصص بالأسبوع ومواعيد كل حصة لتنزيلها بالجدول تلقائياً' : 'Set session frequency and timing for calendar sync'}
                </span>
              </div>

              {/* Numeric Sessions Stepper & Quick Counter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Stepper with - and + */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  padding: '2px'
                }}>
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
                      justifyContent: 'center'
                    }}
                  >
                    -
                  </button>
                  <span style={{
                    minWidth: '32px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '900',
                    color: 'var(--primary)'
                  }}>
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
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Quick Numbers 1 to 5 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {[1, 2, 3, 4, 5].map(num => (
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
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {num} {lang === 'ar' ? (num === 1 ? 'حصة' : 'حصص') : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Session slots cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sessions.map((sess, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--primary)' }}>
                      {lang === 'ar' ? `الحصة رقم (${idx + 1})` : `Session (${idx + 1})`}
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
                          fontWeight: '700'
                        }}
                      >
                        <Trash2 size={12} />
                        <span>{lang === 'ar' ? 'حذف الحصة' : 'Remove'}</span>
                      </button>
                    )}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                    gap: '8px',
                    alignItems: 'center'
                  }}>
                    {/* Day */}
                    <div>
                      <span style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '2px' }}>
                        {lang === 'ar' ? 'اليوم' : 'Day'}
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
                          fontSize: '12px',
                          fontWeight: '700',
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                      >
                        {DAYS_LIST.map(d => (
                          <option key={d.key} value={d.key}>
                            {lang === 'ar' ? d.ar : d.en}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Start Time */}
                    <div>
                      <span style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '2px' }}>
                        {lang === 'ar' ? 'من' : 'From'}
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
                          fontSize: '12px',
                          fontWeight: '700',
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    {/* End Time */}
                    <div>
                      <span style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '2px' }}>
                        {lang === 'ar' ? 'إلى' : 'To'}
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
                          fontSize: '12px',
                          fontWeight: '700',
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    {/* Hall / Room */}
                    <div>
                      <span style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '2px' }}>
                        {lang === 'ar' ? 'القاعة' : 'Hall'}
                      </span>
                      <input
                        type="text"
                        placeholder={lang === 'ar' ? 'قاعة 1' : 'Hall 1'}
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
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Generated Summary Preview & Edit Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11.5px',
                color: 'var(--primary)',
                fontWeight: '700',
                backgroundColor: 'var(--primary-surface)',
                padding: '4px 10px',
                borderRadius: '6px'
              }}>
                <Check size={13} />
                <span>{formData.scheduleAr || 'سيتم إدراج المواعيد بالجدول الأسبوعي'}</span>
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
                  textDecoration: 'underline'
                }}
              >
                {manualScheduleEdit ? (lang === 'ar' ? 'إخفاء النص اليدوي' : 'Hide manual') : (lang === 'ar' ? 'تعديل النص يدوياً' : 'Edit text')}
              </button>
            </div>

            {manualScheduleEdit && (
              <input
                type="text"
                placeholder={lang === 'ar' ? 'نص الموعد اليدوي' : 'Manual schedule string'}
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
                  fontFamily: 'inherit'
                }}
              />
            )}
          </div>

          {/* Location Center & Price in 2 Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                {lang === 'ar' ? 'السنتر / القاعة' : 'Center / Hall'} *
              </label>
              <input
                type="text"
                required
                placeholder={lang === 'ar' ? 'مثال: سنتر الرواد التعليمي — الدقي' : 'e.g. Al-Rowad Center'}
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
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                {lang === 'ar' ? 'السعر (ج.م / شهرياً)' : 'Price (EGP/mo)'} *
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="450"
                value={formData.priceEgp}
                onChange={(e) => setFormData({ ...formData, priceEgp: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Join Code (optional override or auto) */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '5px' }}>
              {lang === 'ar' ? 'كود الانضمام المخصص (اتركه فارغاً للتوليد التلقائي)' : 'Custom Join Code (Optional)'}
            </label>
            <input
              type="text"
              placeholder={isEdit ? formData.joinCode : 'مثال: BIO-DK-2026'}
              value={formData.joinCode}
              onChange={(e) => setFormData({ ...formData, joinCode: e.target.value.toUpperCase() })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontFamily: 'monospace',
                fontWeight: '700',
                outline: 'none'
              }}
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 2px 8px var(--primary-glow)'
              }}
            >
              {isEdit ? <Check size={15} /> : <Plus size={15} />}
              <span>{isEdit ? (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (lang === 'ar' ? 'إنشاء المجموعة' : 'Create Group')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
