import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { adminApi } from '../../../services/adminApi';
import { PRESET_AVATARS, PRESET_BADGES } from '../../../data/mockAdminData';
import {
  Trophy,
  Plus,
  Trash2,
  Edit3,
  Pin,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Flame,
  Award,
  Sparkles,
  School,
  Shield,
  Crown,
  X,
  Play,
  Square,
  RefreshCw
} from 'lucide-react';

export const AdminChampionsManager = () => {
  const { lang, isRtl } = useLanguage();
  const [champions, setChampions] = useState([]);
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [leagueBusy, setLeagueBusy] = useState(false);
  const [leagueTitle, setLeagueTitle] = useState('دوري الجمهورية العام');
  const [leagueDuration, setLeagueDuration] = useState('monthly');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChamp, setEditingChamp] = useState(null);
  const [championToDelete, setChampionToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    titleAr: '',
    titleEn: '',
    monthAr: '',
    monthEn: '',
    schoolAr: '',
    schoolEn: '',
    scoreAr: '3,950 نقطة',
    scoreEn: '3,950 Points',
    rankAr: 'المركز الأول جمهورياً',
    rankEn: 'National 1st Place',
    streakAr: '30 يوم استريك',
    streakEn: '30-Day Streak',
    badgeAr: 'كأس التفوق الشهري',
    badgeEn: 'Monthly Excellence Cup',
    image: '/characters/real-male-champ-1.png',
    isPinned: true,
  });

  const showToast = useCallback((text, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ text, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3400);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [champRes, leagueRes] = await Promise.all([
        adminApi.champions.list(),
        adminApi.republicLeague.get().catch(() => ({ data: null })),
      ]);
      setChampions(Array.isArray(champRes?.data) ? champRes.data : []);
      setLeague(leagueRes?.data || null);
    } catch (err) {
      setError(err?.message || (lang === 'ar' ? 'تعذر تحميل قائمة أبطال لوحة الشرف' : 'Failed to load champions'));
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const emitChampionsSync = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('champions-updated'));
    }
  };

  const handleStartLeague = async () => {
    setLeagueBusy(true);
    try {
      const res = await adminApi.republicLeague.start({
        title_ar: leagueTitle.trim() || 'دوري الجمهورية العام',
        duration: leagueDuration,
      });
      if (res?.data) setLeague(res.data);
      showToast(lang === 'ar' ? 'تم إطلاق جولة جديدة من دوري الجمهورية العام بنجاح!' : 'General Republic League launched!');
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر بدء دوري الجمهورية' : 'Failed to start league'), 'error');
    } finally {
      setLeagueBusy(false);
    }
  };

  const handleStopLeague = async () => {
    setLeagueBusy(true);
    try {
      await adminApi.republicLeague.stop();
      showToast(lang === 'ar' ? 'تم إيقاف دوري الجمهورية العام بنجاح' : 'Republic League stopped');
      loadData();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر إيقاف الدوري' : 'Failed to stop league'), 'error');
    } finally {
      setLeagueBusy(false);
    }
  };

  const openAddModal = () => {
    setEditingChamp(null);
    setFormData({
      nameAr: '',
      nameEn: '',
      titleAr: 'بطل دوري المتفوقين الشهري',
      titleEn: 'Monthly League Champion',
      monthAr: 'دوري شهر نوفمبر 2026',
      monthEn: 'November 2026 League',
      schoolAr: 'مدرسة المتفوقين STEM',
      schoolEn: 'STEM High School',
      scoreAr: '3,950 نقطة',
      scoreEn: '3,950 Points',
      rankAr: 'المركز الأول جمهورياً',
      rankEn: 'National 1st Place',
      streakAr: '30 يوم استريك',
      streakEn: '30-Day Streak',
      badgeAr: 'كأس التفوق الشهري',
      badgeEn: 'Monthly Excellence Cup',
      image: '/characters/real-male-champ-1.png',
      isPinned: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (champ) => {
    setEditingChamp(champ);
    setFormData({
      nameAr: champ.nameAr || '',
      nameEn: champ.nameEn || '',
      titleAr: champ.titleAr || '',
      titleEn: champ.titleEn || '',
      monthAr: champ.monthAr || '',
      monthEn: champ.monthEn || '',
      schoolAr: champ.schoolAr || '',
      schoolEn: champ.schoolEn || '',
      scoreAr: champ.scoreAr || '',
      scoreEn: champ.scoreEn || '',
      rankAr: champ.rankAr || '',
      rankEn: champ.rankEn || '',
      streakAr: champ.streakAr || '',
      streakEn: champ.streakEn || '',
      badgeAr: champ.badgeAr || '',
      badgeEn: champ.badgeEn || '',
      image: champ.image || '/characters/real-male-champ-1.png',
      isPinned: champ.isPinned !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.nameAr.trim()) {
      showToast(lang === 'ar' ? 'يرجى إدخال اسم الطالب المتفوق' : 'Please enter student name', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingChamp) {
        await adminApi.champions.update(editingChamp.id, formData);
        showToast(lang === 'ar' ? 'تم تحديث بيانات بطل الكأس بنجاح' : 'Champion updated successfully');
      } else {
        await adminApi.champions.create(formData);
        showToast(lang === 'ar' ? 'تمت إضافة بطل متفوق جديد إلى لوحة الشرف والكؤوس' : 'New champion added successfully');
      }
      setIsModalOpen(false);
      emitChampionsSync();
      loadData();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر حفظ بيانات البطل' : 'Failed to save champion'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (champ) => {
    setChampionToDelete({
      id: champ.id,
      name: lang === 'ar' ? champ.nameAr : (champ.nameEn || champ.nameAr),
    });
  };

  const handleConfirmDeleteChampion = async () => {
    if (!championToDelete) return;
    setSubmitting(true);
    try {
      await adminApi.champions.delete(championToDelete.id);
      setChampionToDelete(null);
      emitChampionsSync();
      showToast(lang === 'ar' ? 'تم الحذف من لوحة الشرف' : 'Removed from champions list');
      loadData();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر حذف البطل' : 'Failed to delete champion'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await adminApi.champions.togglePin(id);
      emitChampionsSync();
      showToast(lang === 'ar' ? 'تم تحديث حالة الظهور في الواجهة الرئيسية' : 'Visibility updated');
      loadData();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر تحديث التثبيت' : 'Failed to toggle pin'), 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', left: isRtl ? '24px' : 'auto', right: isRtl ? 'auto' : '24px',
          backgroundColor: toast.type === 'error' ? '#991B1B' : 'var(--color-brand-dark)', color: '#FFFFFF',
          padding: '12px 20px', borderRadius: '12px', boxShadow: 'var(--shadow-lg)',
          display: 'flex', alignItems: 'center', gap: '10px', zIndex: 9999, fontSize: '14px', fontWeight: '600'
        }}>
          {toast.type === 'error'
            ? <AlertCircle size={18} color="#FCA5A5" />
            : <CheckCircle size={18} color="var(--primary-light)" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* General Republic League Control Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: league?.isActive ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1.5px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '14px',
            backgroundColor: league?.isActive ? 'rgba(16, 185, 129, 0.14)' : 'rgba(21, 136, 199, 0.12)',
            color: league?.isActive ? '#047857' : 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Crown size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {league?.titleAr || (lang === 'ar' ? 'دوري الجمهورية العام' : 'General Republic League')}
              </h3>
              <span style={{
                padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
                backgroundColor: league?.isActive ? 'rgba(16, 185, 129, 0.14)' : 'rgba(148, 163, 184, 0.18)',
                color: league?.isActive ? '#047857' : 'var(--text-secondary)'
              }}>
                {league?.isActive
                  ? (lang === 'ar' ? `جاري الآن • متبقي ${league.daysRemaining ?? 0} يوم` : `Active • ${league.daysRemaining ?? 0}d left`)
                  : (lang === 'ar' ? 'متوقف حالياً' : 'Inactive')}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
              {lang === 'ar'
                ? 'تحكم في بدء أو إيقاف موسم دوري الجمهورية التنافسي لجميع طلاب المنصة'
                : 'Start or stop the platform-wide competitive Republic League season'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {!league?.isActive && (
            <>
              <input
                type="text"
                value={leagueTitle}
                onChange={e => setLeagueTitle(e.target.value)}
                placeholder={lang === 'ar' ? 'اسم جولة الدوري' : 'Round Title'}
                style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12.5px', width: '185px' }}
              />
              <select
                value={leagueDuration}
                onChange={e => setLeagueDuration(e.target.value)}
                style={{ padding: '8px 10px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: '600' }}
              >
                <option value="weekly">{lang === 'ar' ? 'أسبوعي (7 أيام)' : 'Weekly (7d)'}</option>
                <option value="monthly">{lang === 'ar' ? 'شهري (30 يوماً)' : 'Monthly (30d)'}</option>
                <option value="half_year">{lang === 'ar' ? 'نصف سنوي' : 'Half Year'}</option>
                <option value="full_year">{lang === 'ar' ? 'سنوي كامل' : 'Full Year'}</option>
              </select>
              <button
                type="button"
                disabled={leagueBusy}
                onClick={handleStartLeague}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#047857', color: '#fff',
                  border: 'none', padding: '9px 16px', borderRadius: '10px', fontSize: '12.5px', fontWeight: '700', cursor: leagueBusy ? 'wait' : 'pointer'
                }}
              >
                <Play size={14} />
                <span>{lang === 'ar' ? 'بدء جولة جديدة' : 'Launch League'}</span>
              </button>
            </>
          )}
          {league?.isActive && (
            <button
              type="button"
              disabled={leagueBusy}
              onClick={handleStopLeague}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(239, 68, 68, 0.12)',
                color: '#B91C1C', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '9px 16px', borderRadius: '10px',
                fontSize: '12.5px', fontWeight: '700', cursor: leagueBusy ? 'wait' : 'pointer'
              }}
            >
              <Square size={14} />
              <span>{lang === 'ar' ? 'إيقاف الجولة الحالية' : 'Stop Active Round'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '20px',
        padding: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        gap: '16px', boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(21, 136, 199, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
          }}>
            <Trophy size={26} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'إدارة لوحة الشرف وأبطال الكؤوس والتفوق' : 'Honor Roll & Cup Champions Management'}
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              {lang === 'ar'
                ? 'التحكم الكامل في أبطال الكؤوس والظهور المباشر في السلايدر الرئيسي للمنصة'
                : 'Manage top achievers, cup winners, and live landing page hero placement'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            style={{
              width: '38px', height: '38px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>

          <button
            type="button"
            onClick={openAddModal}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--primary)', color: '#FFFFFF',
              border: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '700',
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(21, 136, 199, 0.3)'
            }}
          >
            <Plus size={18} />
            <span>{lang === 'ar' ? 'إضافة بطل / فائز بالكأس' : 'Add New Champion'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px',
          padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#B91C1C', fontSize: '13px', fontWeight: '600'
        }}>
          <span>{error}</span>
          <button type="button" onClick={loadData} style={{ backgroundColor: '#B91C1C', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer' }}>
            {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* Champions Cards Grid */}
      {loading ? (
        <div style={{ padding: '44px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)', borderRadius: '18px', border: '1px solid var(--border-subtle)' }}>
          {lang === 'ar' ? 'جاري تحميل لوحة الشرف...' : 'Loading honor roll...'}
        </div>
      ) : champions.length === 0 ? (
        <div style={{ padding: '44px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)', borderRadius: '18px', border: '1px solid var(--border-subtle)' }}>
          {lang === 'ar' ? 'لم يتم إضافة أبطال بعد — اضغط "إضافة بطل" للبدء' : 'No champions added yet'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
          {champions.map((champ) => {
            const isPinned = champ.isPinned !== false;
            return (
              <div
                key={champ.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: isPinned ? '1.5px solid rgba(21, 136, 199, 0.35)' : '1px solid var(--border-subtle)',
                  borderRadius: '18px', overflow: 'hidden',
                  boxShadow: isPinned ? '0 4px 20px rgba(21, 136, 199, 0.08)' : 'var(--shadow-sm)',
                  display: 'flex', flexDirection: 'column', position: 'relative'
                }}
              >
                <div style={{
                  padding: '10px 16px', backgroundColor: isPinned ? 'rgba(21, 136, 199, 0.08)' : 'var(--bg-subtle)',
                  borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', fontSize: '12px', fontWeight: '700'
                }}>
                  <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={14} />
                    {(lang === 'ar' ? champ.badgeAr : champ.badgeEn) || (lang === 'ar' ? 'كأس التفوق الشهري' : 'Monthly Excellence Cup')}
                  </span>
                  <span style={{
                    padding: '3px 8px', borderRadius: '20px',
                    backgroundColor: isPinned ? 'rgba(16, 185, 129, 0.12)' : 'rgba(148, 163, 184, 0.15)',
                    color: isPinned ? 'var(--color-success)' : 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px'
                  }}>
                    {isPinned ? <Eye size={12} /> : <EyeOff size={12} />}
                    {isPinned ? (lang === 'ar' ? 'معروض في الرئيسية' : 'Pinned') : (lang === 'ar' ? 'مخفي' : 'Hidden')}
                  </span>
                </div>

                <div style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    position: 'relative', width: '74px', height: '74px', borderRadius: '18px', overflow: 'hidden',
                    border: '2px solid var(--primary)', flexShrink: 0, backgroundColor: 'var(--bg-subtle)'
                  }}>
                    <img
                      src={champ.image || '/characters/real-male-champ-1.png'}
                      alt={lang === 'ar' ? champ.nameAr : (champ.nameEn || champ.nameAr)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = '/characters/student.png'; }}
                    />
                    <div style={{
                      position: 'absolute', bottom: '2px', right: isRtl ? '2px' : 'auto', left: isRtl ? 'auto' : '2px',
                      backgroundColor: '#EAB308', color: '#000', width: '20px', height: '20px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Trophy size={11} color="#000" />
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lang === 'ar' ? champ.nameAr : (champ.nameEn || champ.nameAr)}
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700', marginBottom: '4px' }}>
                      {lang === 'ar' ? (champ.titleAr || champ.rankAr) : (champ.titleEn || champ.rankEn || champ.titleAr)}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <School size={13} style={{ flexShrink: 0 }} />
                      <span>{lang === 'ar' ? champ.schoolAr : (champ.schoolEn || champ.schoolAr)}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  margin: '0 20px 16px', padding: '10px 14px', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: '700' }}>
                    <Sparkles size={14} />
                    <span>{lang === 'ar' ? (champ.scoreAr || '—') : (champ.scoreEn || champ.scoreAr || '—')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: '700' }}>
                    <Flame size={14} />
                    <span>{lang === 'ar' ? (champ.streakAr || '—') : (champ.streakEn || champ.streakAr || '—')}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                    {lang === 'ar' ? (champ.monthAr || 'الدوري العام') : (champ.monthEn || 'General League')}
                  </div>
                </div>

                <div style={{
                  marginTop: 'auto', padding: '12px 20px', borderTop: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px'
                }}>
                  <button
                    type="button"
                    onClick={() => handleTogglePin(champ.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      backgroundColor: isPinned ? 'rgba(21, 136, 199, 0.1)' : 'var(--bg-subtle)',
                      color: isPinned ? 'var(--primary)' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)', padding: '6px 12px', borderRadius: '8px',
                      fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                    }}
                  >
                    <Pin size={13} style={{ transform: isPinned ? 'rotate(45deg)' : 'none' }} />
                    <span>{isPinned ? (lang === 'ar' ? 'مثبت' : 'Pinned') : (lang === 'ar' ? 'تثبيت' : 'Pin')}</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => openEditModal(champ)}
                      style={{
                        backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)',
                        width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                      }}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(champ)}
                      style={{
                        backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--color-danger)',
                        width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div className="responsive-modal-box" style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '24px',
            width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Trophy size={22} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {editingChamp ? (lang === 'ar' ? 'تعديل بيانات بطل الكأس' : 'Edit Champion') : (lang === 'ar' ? 'إضافة بطل متفوق جديد' : 'Add New Champion')}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Avatar Picker */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {lang === 'ar' ? 'صورة الطالب المتفوق' : 'Champion Photo'}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '14px', overflow: 'hidden', border: '2px solid var(--primary)', flexShrink: 0 }}>
                    <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/characters/student.png'; }} />
                  </div>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/characters/real-male-champ-1.png"
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {PRESET_AVATARS.map(preset => {
                    const isSelected = formData.image === preset.src;
                    return (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => setFormData({ ...formData, image: preset.src })}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '10px',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.1)' : 'var(--bg-subtle)', cursor: 'pointer', flexShrink: 0
                        }}
                      >
                        <img src={preset.src} alt={preset.label} style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'cover' }} />
                        <span style={{ fontSize: '11px', fontWeight: isSelected ? '700' : '500', color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                          {lang === 'ar' ? (preset.labelAr || preset.label) : (preset.labelEn || preset.label)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>{lang === 'ar' ? 'اسم الطالب (عربي)' : 'Name (AR)'} *</label>
                  <input type="text" required value={formData.nameAr} onChange={e => setFormData({ ...formData, nameAr: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>{lang === 'ar' ? 'اسم الطالب (إنجليزي)' : 'Name (EN)'}</label>
                  <input type="text" value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>{lang === 'ar' ? 'المدرسة والمحافظة' : 'School & Location'}</label>
                <input type="text" value={formData.schoolAr} onChange={e => setFormData({ ...formData, schoolAr: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>{lang === 'ar' ? 'نوع الكأس / وسام التكريم' : 'Cup / Badge'}</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PRESET_BADGES.map(badge => {
                    const isSelected = formData.badgeAr === badge.labelAr;
                    const IconComponent = badge.icon === 'Trophy' ? Trophy : badge.icon === 'Shield' ? Shield : badge.icon === 'Crown' ? Crown : badge.icon === 'Sparkles' ? Sparkles : Award;
                    return (
                      <button
                        type="button"
                        key={badge.id}
                        onClick={() => setFormData({ ...formData, badgeAr: badge.labelAr, badgeEn: badge.labelEn })}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                          color: isSelected ? 'var(--primary)' : 'var(--text-primary)', fontSize: '12px', fontWeight: isSelected ? '700' : '500', cursor: 'pointer'
                        }}
                      >
                        <IconComponent size={14} color={isSelected ? 'var(--primary)' : badge.color} />
                        <span>{lang === 'ar' ? badge.labelAr : (badge.labelEn || badge.labelAr)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="responsive-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>{lang === 'ar' ? 'النقاط' : 'Score'}</label>
                  <input type="text" value={formData.scoreAr} onChange={e => setFormData({ ...formData, scoreAr: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>{lang === 'ar' ? 'الترتيب' : 'Rank'}</label>
                  <input type="text" value={formData.rankAr} onChange={e => setFormData({ ...formData, rankAr: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>{lang === 'ar' ? 'أيام الاستريك' : 'Streak'}</label>
                  <input type="text" value={formData.streakAr} onChange={e => setFormData({ ...formData, streakAr: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }} />
                </div>
              </div>

              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>{lang === 'ar' ? 'مسمى الدوري / الشهر' : 'League Month'}</label>
                  <input type="text" value={formData.monthAr} onChange={e => setFormData({ ...formData, monthAr: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>{lang === 'ar' ? 'اللقب التكريمي' : 'Honorific Title'}</label>
                  <input type="text" value={formData.titleAr} onChange={e => setFormData({ ...formData, titleAr: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'العرض في السلايدر الرئيسي بالصفحة الرئيسية' : 'Show in Landing Page Slider'}
                  </div>
                </div>
                <input type="checkbox" checked={formData.isPinned} onChange={e => setFormData({ ...formData, isPinned: e.target.checked })} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', padding: '10px 18px', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={submitting} style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', padding: '10px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: submitting ? 'wait' : 'pointer' }}>
                  {submitting ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (editingChamp ? (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (lang === 'ar' ? 'إضافة إلى الأبطال' : 'Add Champion'))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {championToDelete && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.45)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '24px',
            width: '100%', maxWidth: '440px', padding: '28px 24px', boxShadow: '0 25px 50px -12px rgba(6, 37, 78, 0.25)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px'
          }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trash2 size={28} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'تأكيد الحذف من لوحة الشرف' : 'Confirm Champion Removal'}
              </h3>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {lang === 'ar'
                  ? `هل أنت متأكد من حذف البطل (${championToDelete.name}) من لوحة الشرف؟`
                  : `Are you sure you want to remove (${championToDelete.name})?`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button type="button" onClick={() => setChampionToDelete(null)} style={{ flex: 1, backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '11px 18px', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button type="button" disabled={submitting} onClick={handleConfirmDeleteChampion} style={{ flex: 1, backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', padding: '11px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                {lang === 'ar' ? 'تأكيد الحذف' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
