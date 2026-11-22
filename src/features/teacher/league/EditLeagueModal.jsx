import React, { useState, useMemo } from 'react';
import { Edit3, X, AlertCircle } from 'lucide-react';
import { LEAGUE_DURATION_OPTIONS, getDurationMeta, addDaysToDateInput } from './leagueConstants';

export const EditLeagueModal = ({
  league,
  groups,
  onSubmit,
  onClose,
  lang,
  isRtl,
  isMobile,
}) => {
  const isAr = lang === 'ar';

  const [titleAr, setTitleAr] = useState(league?.leagueTitle || '');
  const [groupId, setGroupId] = useState(league?.groupId || 'all');
  const [duration, setDuration] = useState(league?.durationType || 'monthly');
  const [endsAt, setEndsAt] = useState(league?.endsAt ? String(league.endsAt).slice(0, 10) : '');
  const [isActive, setIsActive] = useState(league?.isActive !== undefined ? Boolean(league.isActive) : true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const leagueCourseId = league?.courseId;
  const availableGroups = useMemo(() => {
    if (!leagueCourseId) return groups;
    const matched = groups.filter(
      (g) => !g.courseId || String(g.courseId) === String(leagueCourseId)
    );
    return matched.length > 0 ? matched : groups;
  }, [groups, leagueCourseId]);

  const handleDurationChange = (nextDuration) => {
    setDuration(nextDuration);
    const meta = getDurationMeta(nextDuration);
    setEndsAt(addDaysToDateInput(league?.startsAt, meta.days));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    const cleanTitle = titleAr.trim();
    if (cleanTitle.length < 2) {
      setError(isAr ? 'يرجى إدخال اسم صالح للدوري (حرفين على الأقل).' : 'Please enter a valid league title.');
      return;
    }

    setError('');
    setIsSaving(true);
    try {
      const payload = {
        title_ar: cleanTitle,
        duration,
        study_group_id: groupId || 'all',
        is_active: isActive,
      };
      if (endsAt) {
        payload.ends_at = endsAt;
      }
      await onSubmit(league.id, payload);
    } catch (err) {
      setError(err?.message || (isAr ? 'تعذر حفظ تعديلات الدوري.' : 'Failed to update league.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: isMobile ? '20px 16px' : '26px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Edit3 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? 'تعديل بيانات الدوري' : 'Edit League'}
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>
                {isAr ? 'عدّل الاسم أو المدة أو المجموعة أو حالة الدوري دون فقدان نقاط الطلاب' : 'Update league settings safely'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '11px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '12.5px',
              fontWeight: '700',
              marginBottom: '14px',
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {isAr ? 'اسم الدوري' : 'League Title'}
            </label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={250}
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '13.5px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {isAr ? 'المجموعة المستهدفة' : 'Target Group'}
            </label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '13.5px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            >
              <option value="all">{isAr ? 'جميع المجموعات (دوري موحد)' : 'All Groups (Unified)'}</option>
              {availableGroups.map((g) => (
                <option key={g.uuid || g.id} value={g.uuid || g.id}>
                  {g.nameAr || g.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {isAr ? 'مدة الدوري' : 'Duration'}
              </label>
              <select
                value={duration}
                onChange={(e) => handleDurationChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              >
                {LEAGUE_DURATION_OPTIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {isAr ? d.labelAr : d.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {isAr ? 'تاريخ انتهاء الجولة' : 'End Date'}
              </label>
              <input
                type="date"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '20px',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span>{isAr ? 'الدوري نشط حالياً ومتاح للمنافسة' : 'League is currently active'}</span>
          </label>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSaving}
              style={{
                padding: '10px 22px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                cursor: isSaving ? 'wait' : 'pointer',
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving
                ? (isAr ? 'جاري الحفظ...' : 'Saving...')
                : (isAr ? 'حفظ التعديلات' : 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeagueModal;
