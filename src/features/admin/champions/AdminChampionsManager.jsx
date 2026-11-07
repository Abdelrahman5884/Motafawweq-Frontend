import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  getChampions,
  addChampion,
  updateChampion,
  deleteChampion,
  togglePinChampion
} from '../../../services/championsStorage';
import { PRESET_AVATARS, PRESET_BADGES } from '../../../data/mockAdminData';
import {
  Trophy,
  Plus,
  Trash2,
  Edit3,
  Pin,
  CheckCircle,
  Eye,
  EyeOff,
  Flame,
  Award,
  Sparkles,
  School,
  Shield,
  Crown,
  X
} from 'lucide-react';

export const AdminChampionsManager = () => {
  const { lang, isRtl } = useLanguage();
  const [champions, setChampions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChamp, setEditingChamp] = useState(null);
  const [championToDelete, setChampionToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
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
    isPinned: true
  });

  const loadData = () => {
    setChampions(getChampions());
  };

  useEffect(() => {
    loadData();
    const handleSync = () => loadData();
    window.addEventListener('champions-updated', handleSync);
    return () => window.removeEventListener('champions-updated', handleSync);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingChamp(null);
    setFormData({
      nameAr: '',
      nameEn: '',
      titleAr: 'بطل دوري المتفوقين لشهر نوفمبر',
      titleEn: 'November League Champion',
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
      isPinned: true
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
      isPinned: champ.isPinned !== false
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nameAr.trim()) {
      showToast(lang === 'ar' ? 'يرجى إدخال اسم الطالب المتفوق' : 'Please enter student name');
      return;
    }

    if (editingChamp) {
      updateChampion(editingChamp.id, formData);
      showToast(lang === 'ar' ? 'تم تحديث بيانات بطل الكأس بنجاح' : 'Champion updated successfully');
    } else {
      addChampion(formData);
      showToast(lang === 'ar' ? 'تمت إضافة بطل متفوق جديد إلى لوحة الشرف والكؤوس' : 'New champion added successfully');
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleOpenDelete = (champ) => {
    setChampionToDelete({
      id: champ.id,
      name: lang === 'ar' ? champ.nameAr : (champ.nameEn || champ.nameAr)
    });
  };

  const handleConfirmDeleteChampion = () => {
    if (!championToDelete) return;
    deleteChampion(championToDelete.id);
    showToast(lang === 'ar' ? 'تم الحذف من لوحة الشرف' : 'Removed from champions list');
    setChampionToDelete(null);
    loadData();
  };

  const handleTogglePin = (id) => {
    togglePinChampion(id);
    loadData();
    showToast(lang === 'ar' ? 'تم تحديث حالة الظهور في الواجهة الرئيسية' : 'Visibility updated');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: isRtl ? '24px' : 'auto',
          right: isRtl ? 'auto' : '24px',
          backgroundColor: 'var(--color-brand-dark)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: '600',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle size={18} color="var(--primary-light)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1.5px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: 'rgba(21, 136, 199, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Trophy size={26} />
          </div>
          <div>
            <h2 style={{
              margin: '0 0 4px',
              fontSize: '20px',
              fontWeight: '800',
              color: 'var(--text-primary)'
            }}>
              {lang === 'ar' ? 'إدارة لوحة الشرف وأبطال الكؤوس والتفوق' : 'Honor Roll & Cup Champions Management'}
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              {lang === 'ar'
                ? 'التحكم الكامل في صور الطلاب المتفوقين، كؤوس ودروع الدوري، والظهور في السلايدر الرئيسي للمنصة'
                : 'Manage top achievers, cup winners, custom badges, and live landing page hero placement'}
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px rgba(21, 136, 199, 0.3)'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--primary)'}
        >
          <Plus size={18} />
          <span>{lang === 'ar' ? 'إضافة بطل / فائز بالكأس جديد' : 'Add New Cup Champion'}</span>
        </button>
      </div>

      {/* Champions Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        gap: '20px'
      }}>
        {champions.map((champ) => {
          const isPinned = champ.isPinned !== false;
          return (
            <div
              key={champ.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: isPinned ? '1.5px solid rgba(21, 136, 199, 0.35)' : '1px solid var(--border-subtle)',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: isPinned ? '0 4px 20px rgba(21, 136, 199, 0.08)' : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                position: 'relative'
              }}
            >
              {/* Top Banner Tag */}
              <div style={{
                padding: '10px 16px',
                backgroundColor: isPinned ? 'rgba(21, 136, 199, 0.08)' : 'var(--bg-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={14} />
                  {(lang === 'ar' ? champ.badgeAr : champ.badgeEn) || (lang === 'ar' ? 'كأس التفوق الشهري' : 'Monthly Excellence Cup')}
                </span>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '20px',
                  backgroundColor: isPinned ? 'rgba(16, 185, 129, 0.12)' : 'rgba(148, 163, 184, 0.15)',
                  color: isPinned ? 'var(--color-success)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px'
                }}>
                  {isPinned ? <Eye size={12} /> : <EyeOff size={12} />}
                  {isPinned ? (lang === 'ar' ? 'معروض في الرئيسية' : 'Pinned on Home') : (lang === 'ar' ? 'مخفي' : 'Hidden')}
                </span>
              </div>

              {/* Champion Profile Section */}
              <div style={{
                padding: '20px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
              }}>
                <div style={{
                  position: 'relative',
                  width: '74px',
                  height: '74px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: '2px solid var(--primary)',
                  boxShadow: '0 4px 12px rgba(21, 136, 199, 0.2)',
                  flexShrink: 0,
                  backgroundColor: 'var(--bg-subtle)'
                }}>
                  <img
                    src={champ.image || '/characters/real-male-champ-1.png'}
                    alt={lang === 'ar' ? champ.nameAr : (champ.nameEn || champ.nameAr)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.src = '/characters/student.png'; }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: isRtl ? '2px' : 'auto',
                    left: isRtl ? 'auto' : '2px',
                    backgroundColor: '#EAB308',
                    color: '#000',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}>
                    <Trophy size={11} color="#000" />
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    margin: '0 0 4px',
                    fontSize: '16px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {lang === 'ar' ? champ.nameAr : (champ.nameEn || champ.nameAr)}
                  </h3>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--primary)',
                    fontWeight: '700',
                    marginBottom: '4px'
                  }}>
                    {lang === 'ar' ? (champ.titleAr || champ.rankAr) : (champ.titleEn || champ.rankEn || champ.titleAr)}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    <School size={13} style={{ flexShrink: 0 }} />
                    <span>{lang === 'ar' ? champ.schoolAr : (champ.schoolEn || champ.schoolAr)}</span>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div style={{
                margin: '0 20px 16px',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: '700' }}>
                  <Sparkles size={14} />
                  <span>{lang === 'ar' ? (champ.scoreAr || '3,900 نقطة') : (champ.scoreEn || '3,900 Points')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: '700' }}>
                  <Flame size={14} />
                  <span>{lang === 'ar' ? (champ.streakAr || '30 يوم') : (champ.streakEn || '30-Day Streak')}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                  {lang === 'ar' ? (champ.monthAr || 'الدوري العام') : (champ.monthEn || 'General League')}
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{
                marginTop: 'auto',
                padding: '12px 20px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <button
                  onClick={() => handleTogglePin(champ.id)}
                  title={isPinned ? (lang === 'ar' ? 'إلغاء التثبيت من الرئيسية' : 'Unpin') : (lang === 'ar' ? 'تثبيت في الرئيسية' : 'Pin to Home')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: isPinned ? 'rgba(21, 136, 199, 0.1)' : 'var(--bg-subtle)',
                    color: isPinned ? 'var(--primary)' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <Pin size={13} style={{ transform: isPinned ? 'rotate(45deg)' : 'none' }} />
                  <span>{isPinned ? (lang === 'ar' ? 'مثبت' : 'Pinned') : (lang === 'ar' ? 'تثبيت' : 'Pin')}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => openEditModal(champ)}
                    title={lang === 'ar' ? 'تعديل بيانات البطل والكأس' : 'Edit'}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    onClick={() => handleOpenDelete(champ)}
                    title={lang === 'ar' ? 'حذف من لوحة الشرف' : 'Delete'}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-danger)'; e.currentTarget.style.borderColor = 'var(--color-danger)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(6, 37, 78, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div 
            className="responsive-modal-box"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Trophy size={22} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {editingChamp
                    ? (lang === 'ar' ? 'تعديل بيانات بطل الكأس' : 'Edit Champion')
                    : (lang === 'ar' ? 'إضافة بطل متفوق جديد إلى لوحة الشرف' : 'Add New Cup Champion')}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Photo & Avatar Picker */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {lang === 'ar' ? 'صورة الطالب المتفوق (اختر شخصية أو أدخل مسار الصورة)' : 'Student Champion Photo'}
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '2px solid var(--primary)',
                    flexShrink: 0,
                    backgroundColor: 'var(--bg-subtle)'
                  }}>
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = '/characters/student.png'; }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/characters/real-male-champ-1.png"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>

                {/* Preset Avatars Selection */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto',
                  paddingBottom: '6px'
                }}>
                  {PRESET_AVATARS.map(preset => {
                    const isSelected = formData.image === preset.src;
                    return (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => setFormData({ ...formData, image: preset.src })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 10px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.1)' : 'var(--bg-subtle)',
                          cursor: 'pointer',
                          flexShrink: 0
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

              {/* Student Name */}
              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'اسم الطالب (عربي)' : 'Student Name (AR)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                    placeholder="مثال: أحمد إبراهيم الدسوقي"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'اسم الطالب (إنجليزي)' : 'Student Name (EN)'}
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Ahmed Ibrahim El-Desouky"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              {/* School & Governorate */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'المدرسة والمحافظة' : 'School & Location'}
                </label>
                <input
                  type="text"
                  value={formData.schoolAr}
                  onChange={e => setFormData({ ...formData, schoolAr: e.target.value })}
                  placeholder="مدرسة المتفوقين للعلوم والتكنولوجيا STEM، كفر الشيخ"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              {/* Badge / Trophy Type */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'نوع الكأس / وسام التكريم' : 'Cup / Honor Badge'}
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PRESET_BADGES.map(badge => {
                    const isSelected = formData.badgeAr === badge.labelAr;
                    const IconComponent =
                      badge.icon === 'Trophy' ? Trophy :
                      badge.icon === 'Shield' ? Shield :
                      badge.icon === 'Crown' ? Crown :
                      badge.icon === 'Sparkles' ? Sparkles : Award;

                    return (
                      <button
                        type="button"
                        key={badge.id}
                        onClick={() => setFormData({ ...formData, badgeAr: badge.labelAr, badgeEn: badge.labelEn })}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                          color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                          fontSize: '12px',
                          fontWeight: isSelected ? '700' : '500',
                          cursor: 'pointer'
                        }}
                      >
                        <IconComponent size={14} color={isSelected ? 'var(--primary)' : badge.color} />
                        <span>{lang === 'ar' ? badge.labelAr : (badge.labelEn || badge.labelAr)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Score, Streak & Rank */}
              <div className="responsive-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'النقاط' : 'Score'}
                  </label>
                  <input
                    type="text"
                    value={formData.scoreAr}
                    onChange={e => setFormData({ ...formData, scoreAr: e.target.value })}
                    placeholder="3,980 نقطة"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'الترتيب' : 'Rank'}
                  </label>
                  <input
                    type="text"
                    value={formData.rankAr}
                    onChange={e => setFormData({ ...formData, rankAr: e.target.value })}
                    placeholder="المركز الأول جمهورياً"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'أيام الاستريك' : 'Streak'}
                  </label>
                  <input
                    type="text"
                    value={formData.streakAr}
                    onChange={e => setFormData({ ...formData, streakAr: e.target.value })}
                    placeholder="30 يوم استريك"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              {/* Month / League Season */}
              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'مسمى الدوري / الشهر' : 'League Month'}
                  </label>
                  <input
                    type="text"
                    value={formData.monthAr}
                    onChange={e => setFormData({ ...formData, monthAr: e.target.value })}
                    placeholder="دوري شهر نوفمبر 2026"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'اللقب التكريمي' : 'Honorific Title'}
                  </label>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={e => setFormData({ ...formData, titleAr: e.target.value })}
                    placeholder="بطل دوري المتفوقين لشهر نوفمبر"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              {/* Pin Switch */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'العرض في السلايدر الرئيسي على الصفحة الرئيسية' : 'Show in Landing Page Slider'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'سيظهر كارت وصورة الطالب مباشرةً لزوار المنصة وفي لوحة دوري المتفوقين' : 'Will be displayed to platform visitors and in the league hall of fame'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={e => setFormData({ ...formData, isPinned: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '10px'
              }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(21, 136, 199, 0.3)'
                  }}
                >
                  {editingChamp ? (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (lang === 'ar' ? 'إضافة إلى الأبطال' : 'Add Champion')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Themed Delete Confirmation Dialog */}
      {championToDelete && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(6, 37, 78, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '440px',
            padding: '28px 24px',
            boxShadow: '0 25px 50px -12px rgba(6, 37, 78, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px',
            direction: isRtl ? 'rtl' : 'ltr'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <Trash2 size={28} />
            </div>

            <div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'تأكيد الحذف من لوحة الشرف' : 'Confirm Champion Removal'}
              </h3>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {lang === 'ar' ? (
                  <>
                    هل أنت متأكد من حذف البطل <strong style={{ color: 'var(--text-primary)' }}>({championToDelete.name})</strong> من لوحة الشرف والكؤوس؟
                  </>
                ) : (
                  <>
                    Are you sure you want to remove <strong style={{ color: 'var(--text-primary)' }}>({championToDelete.name})</strong> from the Honor Roll and Champions League?
                  </>
                )}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setChampionToDelete(null)}
                style={{
                  flex: 1,
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  padding: '11px 18px',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteChampion}
                style={{
                  flex: 1,
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '11px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)',
                  transition: 'all 0.15s ease'
                }}
              >
                {lang === 'ar' ? 'تأكيد الحذف' : 'Remove Champion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

