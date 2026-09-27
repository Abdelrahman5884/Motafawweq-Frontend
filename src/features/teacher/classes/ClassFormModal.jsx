import React, { useState, useEffect } from 'react';
import { X, Building2, BookOpen, Calendar, MapPin, Coins, Plus, Check } from 'lucide-react';

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
    priceEgp: 450,
    joinCode: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nameAr: initialData.nameAr || '',
        nameEn: initialData.nameEn || '',
        subjectAr: initialData.subjectAr || 'الأحياء (الثانوية العامة)',
        gradeAr: initialData.gradeAr || 'الصف الثالث الثانوي',
        scheduleAr: initialData.scheduleAr || 'الأحد والأربعاء 4:00 عصراً',
        centerName: initialData.centerName || 'سنتر الرواد التعليمي — الدقي',
        priceEgp: initialData.priceEgp || 450,
        joinCode: initialData.joinCode || ''
      });
    } else {
      setFormData({
        nameAr: '',
        nameEn: '',
        subjectAr: 'الأحياء (الثانوية العامة)',
        gradeAr: 'الصف الثالث الثانوي',
        scheduleAr: 'الأحد والأربعاء 4:00 عصراً',
        centerName: 'سنتر الرواد التعليمي — الدقي',
        priceEgp: 450,
        joinCode: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nameAr.trim()) return;
    onSubmit(formData);
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

          {/* Schedule */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
              {lang === 'ar' ? 'مواعيد الحصص الأسبوعية' : 'Weekly Schedule'} *
            </label>
            <input
              type="text"
              required
              placeholder={lang === 'ar' ? 'مثال: الأحد والأربعاء 4:00 عصراً' : 'e.g. Sundays & Wednesdays 4:00 PM'}
              value={formData.scheduleAr}
              onChange={(e) => setFormData({ ...formData, scheduleAr: e.target.value })}
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
