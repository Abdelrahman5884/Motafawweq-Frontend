import React, { useState, useEffect } from 'react';
import {
  Users,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  X,
  Bell,
  Sparkles,
  Calendar,
  Loader2,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { teacherApi } from '../../../services/teacherApi';

const BROADCAST_TYPES = [
  { id: 'announcement', labelAr: 'تنبيه هام', labelEn: 'Important Alert' },
  { id: 'homework', labelAr: 'تذكير بالواجب', labelEn: 'Homework Reminder' },
  { id: 'quiz', labelAr: 'كويز سريع', labelEn: 'Pop Quiz' },
  { id: 'reschedule', labelAr: 'تعديل موعد', labelEn: 'Schedule Note' },
];

export const ActiveClassesList = ({
  lang,
  activeClasses = [],
  isScheduleLocked = false,
  onOpenClasses,
  onOpenSchedule,
  onOpenRoster,
  onAnnouncementSent,
}) => {
  const isAr = lang === 'ar';
  const classes = activeClasses;

  // Modal states
  const [selectedCohortForTrack, setSelectedCohortForTrack] = useState(null);
  const [selectedCohortForBroadcast, setSelectedCohortForBroadcast] = useState(null);
  const [broadcastType, setBroadcastType] = useState('announcement');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastError, setBroadcastError] = useState('');
  const [broadcastResult, setBroadcastResult] = useState(null);

  // Recent announcements fetched from backend for the selected broadcast cohort
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedCohortForTrack(null);
        setSelectedCohortForBroadcast(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load saved announcements when opening Broadcast Modal
  const broadcastGroupId = selectedCohortForBroadcast?.id || null;
  useEffect(() => {
    if (!broadcastGroupId) return;

    let mounted = true;
    const loadAnnouncements = async () => {
      try {
        const res = await teacherApi.groups.listAnnouncements(broadcastGroupId);
        if (mounted) {
          setRecentAnnouncements(Array.isArray(res?.data) ? res.data : []);
        }
      } catch {
        if (mounted) setRecentAnnouncements([]);
      } finally {
        if (mounted) setLoadingAnnouncements(false);
      }
    };

    loadAnnouncements();
    return () => {
      mounted = false;
    };
  }, [broadcastGroupId]);

  const handleOpenBroadcast = (cls) => {
    setBroadcastType('announcement');
    setBroadcastMessage('');
    setBroadcastError('');
    setBroadcastResult(null);
    setRecentAnnouncements([]);
    setLoadingAnnouncements(Boolean(cls?.id));
    setSelectedCohortForBroadcast(cls);
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    const trimmed = broadcastMessage.trim();
    if (!selectedCohortForBroadcast?.id || trimmed.length < 3) {
      setBroadcastError(
        isAr
          ? 'يرجى كتابة رسالة لا تقل عن 3 أحرف.'
          : 'Please enter a message with at least 3 characters.'
      );
      return;
    }

    setBroadcastSending(true);
    setBroadcastError('');

    try {
      const res = await teacherApi.groups.sendAnnouncement(selectedCohortForBroadcast.id, {
        type: broadcastType,
        message: trimmed,
      });

      const saved = res?.data;
      setBroadcastResult(saved || { recipientsCount: selectedCohortForBroadcast.enrolledCount ?? 0 });
      if (saved) {
        setRecentAnnouncements((prev) => [saved, ...prev]);
      }
      setBroadcastMessage('');
      onAnnouncementSent?.();
    } catch (err) {
      setBroadcastError(
        err?.message ||
          (isAr ? 'تعذر إرسال التنبيه حالياً. يرجى المحاولة مجدداً.' : 'Failed to send announcement. Please try again.')
      );
    } finally {
      setBroadcastSending(false);
    }
  };

  const getTypeLabel = (typeId) => {
    const found = BROADCAST_TYPES.find((t) => t.id === typeId);
    if (!found) return typeId;
    return isAr ? found.labelAr : found.labelEn;
  };

  const renderCapacityBadge = (remainingSeats, isFullOrNearly, compact = false) => {
    if (isFullOrNearly) {
      return (
        <span style={{
          fontSize: '11px',
          fontWeight: '700',
          padding: compact ? '2px 7px' : '3px 8px',
          borderRadius: '6px',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          color: '#D97706',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <AlertCircle size={11} />
          {isAr
            ? (remainingSeats === 0 ? 'مكتملة' : `شبه مكتملة (${remainingSeats})`)
            : (remainingSeats === 0 ? 'Full' : `Near Full (${remainingSeats})`)}
        </span>
      );
    }
    return (
      <span style={{
        fontSize: '11px',
        fontWeight: '700',
        padding: compact ? '2px 7px' : '3px 8px',
        borderRadius: '6px',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        color: 'var(--success)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        <CheckCircle2 size={11} />
        {isAr ? `متاح (${remainingSeats} مقعد)` : `Open (${remainingSeats} left)`}
      </span>
    );
  };

  const trackEnrolled = selectedCohortForTrack
    ? (selectedCohortForTrack.enrolledCount ?? selectedCohortForTrack.enrolledStudents ?? 0)
    : 0;
  const trackCapacity = selectedCohortForTrack
    ? Math.max(1, selectedCohortForTrack.maxCapacity ?? selectedCohortForTrack.capacity ?? 50)
    : 50;
  const trackFillPct = Math.min(100, Math.round((trackEnrolled / trackCapacity) * 100));

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      boxShadow: 'var(--shadow-xs)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} color="var(--primary)" />
          <div>
            <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'المجموعات والقاعات النشطة' : 'Active Classes & Cohorts'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              {isAr ? 'جدول المتابعة الميدانية ونسب استيعاب المقاعد' : 'Live cohort capacity and quick action controls'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onOpenSchedule && (
            <button
              type="button"
              onClick={onOpenSchedule}
              style={{
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
            >
              <Calendar size={13} color={isScheduleLocked ? '#D97706' : 'var(--primary)'} />
              <span>{isAr ? 'الجدول الأسبوعي' : 'Weekly Schedule'}</span>
              {isScheduleLocked && <Lock size={11} color="#D97706" />}
            </button>
          )}

          <button
            type="button"
            onClick={onOpenClasses}
            style={{
              border: 'none',
              background: 'var(--bg-subtle)',
              color: 'var(--primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{isAr ? 'إدارة كافة القاعات' : 'Manage All'}</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>

      {/* ── RESPONSIVE TABLE VIEW (Visible on tablet & desktop) ── */}
      <div className="teacher-classes-table-container">
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
          fontSize: '12.5px',
        }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: isAr ? 'right' : 'left' }}>
              <th style={{ padding: '8px 12px', fontWeight: '700' }}>{isAr ? 'المجموعة والكود' : 'Group & Code'}</th>
              <th style={{ padding: '8px 12px', fontWeight: '700' }}>{isAr ? 'المادة والمرحلة' : 'Subject & Stage'}</th>
              <th style={{ padding: '8px 12px', fontWeight: '700' }}>{isAr ? 'الموعد' : 'Schedule'}</th>
              <th style={{ padding: '8px 12px', fontWeight: '700' }}>{isAr ? 'العدد والسعة' : 'Enrolled'}</th>
              <th style={{ padding: '8px 12px', fontWeight: '700' }}>{isAr ? 'حالة الاستيعاب' : 'Capacity'}</th>
              <th style={{ padding: '8px 12px', fontWeight: '700', textAlign: 'center' }}>{isAr ? 'إجراءات سريعة' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  {isAr ? 'لا توجد مجموعات دراسية نشطة حالياً' : 'No active study groups found'}
                </td>
              </tr>
            ) : (
              classes.map((cls) => {
                const enrolled = cls.enrolledCount ?? cls.enrolledStudents ?? 0;
                const capacity = Math.max(1, cls.maxCapacity ?? cls.capacity ?? 50);
                const fillPct = Math.min(100, Math.round((enrolled / capacity) * 100));
                const remainingSeats = Math.max(0, capacity - enrolled);
                const isFullOrNearly = fillPct >= 95;
                const groupName = isAr ? cls.nameAr : (cls.nameEn || cls.name || cls.nameAr);
                const subjectLabel = isAr ? (cls.subjectAr || '—') : (cls.subjectEn || cls.subject || cls.subjectAr || '—');
                const gradeLabel = isAr ? (cls.gradeAr || '') : (cls.gradeEn || cls.grade || cls.gradeAr || '');
                const scheduleLabel = isAr ? (cls.scheduleAr || 'غير محدد') : (cls.scheduleEn || cls.schedule || 'Not set');

                return (
                  <tr
                    key={cls.id}
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Group Name & Code */}
                    <td style={{
                      padding: '12px',
                      borderRadius: isAr ? '0 8px 8px 0' : '8px 0 0 8px',
                      borderTop: '1px solid var(--border-subtle)',
                      borderBottom: '1px solid var(--border-subtle)',
                      borderInlineStart: '1px solid var(--border-subtle)',
                    }}>
                      <div style={{ fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {groupName}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                        {cls.joinCode && (
                          <span style={{
                            fontSize: '10.5px',
                            fontWeight: '700',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-surface)',
                            color: 'var(--primary)',
                            border: '1px solid var(--border-subtle)',
                            fontFamily: 'var(--font-mono, monospace)',
                          }}>
                            {cls.joinCode}
                          </span>
                        )}
                        {cls.centerName && (
                          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                            {cls.centerName}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Subject & Grade */}
                    <td style={{
                      padding: '12px',
                      borderTop: '1px solid var(--border-subtle)',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                        {subjectLabel}
                      </div>
                      {gradeLabel && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {gradeLabel}
                        </div>
                      )}
                    </td>

                    {/* Schedule */}
                    <td style={{
                      padding: '12px',
                      borderTop: '1px solid var(--border-subtle)',
                      borderBottom: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} color="var(--text-muted)" />
                        <span>{scheduleLabel}</span>
                      </div>
                    </td>

                    {/* Enrolled Students & Mini Bar */}
                    <td style={{
                      padding: '12px',
                      borderTop: '1px solid var(--border-subtle)',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}>
                      <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                        {enrolled} <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)' }}>/ {capacity}</span>
                      </div>
                      <div style={{
                        width: '80px',
                        height: '5px',
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginTop: '4px',
                      }}>
                        <div style={{
                          width: `${fillPct}%`,
                          height: '100%',
                          backgroundColor: isFullOrNearly ? '#F59E0B' : 'var(--primary)',
                          borderRadius: '4px',
                        }} />
                      </div>
                    </td>

                    {/* Capacity Status Badge */}
                    <td style={{
                      padding: '12px',
                      borderTop: '1px solid var(--border-subtle)',
                      borderBottom: '1px solid var(--border-subtle)',
                      whiteSpace: 'nowrap',
                    }}>
                      {renderCapacityBadge(remainingSeats, isFullOrNearly)}
                    </td>

                    {/* Action Buttons */}
                    <td style={{
                      padding: '12px',
                      borderRadius: isAr ? '8px 0 0 8px' : '0 8px 8px 0',
                      borderTop: '1px solid var(--border-subtle)',
                      borderBottom: '1px solid var(--border-subtle)',
                      borderInlineEnd: '1px solid var(--border-subtle)',
                      textAlign: 'center',
                    }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedCohortForTrack(cls)}
                          title={isAr ? 'متابعة الحضور والدرجات' : 'Track Attendance & Grades'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '5px 9px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Eye size={12} color="var(--primary)" />
                          <span>{isAr ? 'متابعة' : 'Track'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenBroadcast(cls)}
                          title={isAr ? 'إرسال تنبيه أو إشعار للمجموعة' : 'Send Alert / Announcement'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '5px 9px',
                            borderRadius: '6px',
                            border: '1px solid rgba(0, 102, 204, 0.25)',
                            backgroundColor: 'rgba(0, 102, 204, 0.08)',
                            color: 'var(--primary)',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Send size={12} />
                          <span>{isAr ? 'إرسال تنبيه' : 'Alert'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── ADAPTIVE MOBILE CARDS VIEW (Controlled cleanly by CSS media query) ── */}
      <div className="teacher-classes-mobile-cards" style={{ flexDirection: 'column', gap: '12px' }}>
        {classes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
            {isAr ? 'لا توجد مجموعات دراسية نشطة حالياً' : 'No active study groups found'}
          </div>
        ) : (
          classes.map((cls) => {
            const enrolled = cls.enrolledCount ?? cls.enrolledStudents ?? 0;
            const capacity = Math.max(1, cls.maxCapacity ?? cls.capacity ?? 50);
            const fillPct = Math.min(100, Math.round((enrolled / capacity) * 100));
            const remainingSeats = Math.max(0, capacity - enrolled);
            const isFullOrNearly = fillPct >= 95;
            const groupName = isAr ? cls.nameAr : (cls.nameEn || cls.name || cls.nameAr);
            const subjectLabel = isAr ? (cls.subjectAr || '') : (cls.subjectEn || cls.subject || cls.subjectAr || '');
            const gradeLabel = isAr ? (cls.gradeAr || '') : (cls.gradeEn || cls.grade || cls.gradeAr || '');
            const scheduleLabel = isAr ? (cls.scheduleAr || 'غير محدد') : (cls.scheduleEn || cls.schedule || 'Not set');

            return (
              <div
                key={cls.id}
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {groupName}
                    </div>
                    {(subjectLabel || gradeLabel) && (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {[subjectLabel, gradeLabel].filter(Boolean).join(' • ')}
                      </div>
                    )}
                  </div>
                  {cls.joinCode && (
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '800',
                      padding: '2px 7px',
                      borderRadius: '5px',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--primary)',
                      border: '1px solid var(--border-subtle)',
                      whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-mono, monospace)',
                    }}>
                      {cls.joinCode}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                    <Clock size={12} color="var(--text-muted)" />
                    <span>{scheduleLabel}</span>
                  </div>
                  {renderCapacityBadge(remainingSeats, isFullOrNearly, true)}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{isAr ? 'الطلاب المسجلون:' : 'Enrolled:'}</span>
                    <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                      {enrolled} / {capacity} ({fillPct}%)
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '5px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: '5px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${fillPct}%`,
                      height: '100%',
                      backgroundColor: isFullOrNearly ? '#F59E0B' : 'var(--primary)',
                      borderRadius: '5px',
                    }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedCohortForTrack(cls)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '7px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    <Eye size={13} color="var(--primary)" />
                    <span>{isAr ? 'متابعة الطلاب' : 'Track'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenBroadcast(cls)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '7px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    <Send size={13} />
                    <span>{isAr ? 'إرسال تنبيه' : 'Alert'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── MODAL 1: TRACK COHORT REAL STATS ── */}
      {selectedCohortForTrack && (
        <div
          onClick={() => setSelectedCohortForTrack(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '480px',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {isAr ? selectedCohortForTrack.nameAr : (selectedCohortForTrack.nameEn || selectedCohortForTrack.nameAr)}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  {[
                    selectedCohortForTrack.centerName,
                    selectedCohortForTrack.hallName,
                    selectedCohortForTrack.joinCode,
                  ].filter(Boolean).join(' • ') || (isAr ? 'تقرير الحضور ومعدل الاستيعاب الفوري' : 'Live attendance & performance summary')}
                </p>
              </div>
              <button
                type="button"
                aria-label={isAr ? 'إغلاق' : 'Close'}
                onClick={() => setSelectedCohortForTrack(null)}
                style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isAr ? 'نسبة الحضور' : 'Attendance'}</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--primary)', marginTop: '2px' }}>
                  {Number(selectedCohortForTrack.attendanceRate || 0)}%
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isAr ? 'متوسط الكويز' : 'Quiz Avg'}</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--success)', marginTop: '2px' }}>
                  {Number(selectedCohortForTrack.avgScore || 0)}%
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isAr ? 'نسبة الاستيعاب' : 'Capacity'}</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {trackFillPct}%
                </div>
              </div>
            </div>

            {/* Real Dynamic Cohort Details */}
            <div style={{
              fontSize: '12.5px',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '18px',
              lineHeight: 1.65,
            }}>
              <div>
                {isAr
                  ? `عدد الطلاب المقيدين حالياً: ${trackEnrolled} من أصل ${trackCapacity} مقعد.`
                  : `Currently enrolled: ${trackEnrolled} of ${trackCapacity} seats.`}
              </div>
              {selectedCohortForTrack.pendingCount > 0 && (
                <div style={{ color: '#D97706', fontWeight: '700' }}>
                  {isAr
                    ? `يوجد ${selectedCohortForTrack.pendingCount} طلب انضمام بانتظار المراجعة.`
                    : `${selectedCohortForTrack.pendingCount} pending join request(s) awaiting review.`}
                </div>
              )}
              <div>
                {selectedCohortForTrack.sessionsCount > 0
                  ? (isAr
                      ? `إجمالي جلسات الحضور المسجلة: ${selectedCohortForTrack.sessionsCount} جلسة (آخر جلسة: ${selectedCohortForTrack.lastSessionDate} — حضور ${selectedCohortForTrack.lastSessionPresentCount}، غياب ${selectedCohortForTrack.lastSessionAbsentCount}).`
                      : `Recorded attendance sessions: ${selectedCohortForTrack.sessionsCount} (Latest: ${selectedCohortForTrack.lastSessionDate} — ${selectedCohortForTrack.lastSessionPresentCount} present, ${selectedCohortForTrack.lastSessionAbsentCount} absent).`)
                  : (isAr
                      ? 'لم يتم تسجيل جلسات حضور لهذه المجموعة بعد.'
                      : 'No attendance sessions have been recorded for this cohort yet.')}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setSelectedCohortForTrack(null)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>

              {onOpenRoster && (
                <button
                  type="button"
                  onClick={() => {
                    const groupId = selectedCohortForTrack.id;
                    setSelectedCohortForTrack(null);
                    onOpenRoster(groupId);
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 102, 204, 0.3)',
                    backgroundColor: 'rgba(0, 102, 204, 0.08)',
                    color: 'var(--primary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {isAr ? 'سجل طلاب المجموعة' : 'View Roster'}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setSelectedCohortForTrack(null);
                  onOpenClasses();
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'فتح في إدارة القاعات' : 'Open Class Manager'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: REAL PERSISTED BROADCAST ALERT TO GROUP ── */}
      {selectedCohortForBroadcast && (
        <div
          onClick={() => !broadcastSending && setSelectedCohortForBroadcast(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bell size={18} color="var(--primary)" />
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                    {isAr ? 'إرسال تنبيه للمجموعة' : 'Broadcast Alert to Cohort'}
                  </h4>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  {isAr
                    ? `إلى: ${selectedCohortForBroadcast.nameAr} (${selectedCohortForBroadcast.enrolledCount ?? 0} طالب مقيد)`
                    : `To: ${selectedCohortForBroadcast.nameEn || selectedCohortForBroadcast.nameAr} (${selectedCohortForBroadcast.enrolledCount ?? 0} enrolled)`}
                </p>
              </div>
              <button
                type="button"
                aria-label={isAr ? 'إغلاق' : 'Close'}
                disabled={broadcastSending}
                onClick={() => setSelectedCohortForBroadcast(null)}
                style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {broadcastResult && (
              <div style={{
                padding: '14px 16px',
                marginBottom: '14px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.28)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <Sparkles size={18} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800' }}>
                    {isAr ? 'تم إرسال التنبيه وحفظه بنجاح!' : 'Announcement Dispatched & Saved!'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {isAr
                      ? `المستلمون المسجلون في المجموعة: ${broadcastResult.recipientsCount ?? 0} طالب.`
                      : `Recorded for ${broadcastResult.recipientsCount ?? 0} enrolled student(s).`}
                  </div>
                </div>
              </div>
            )}

            {broadcastError && (
              <div style={{
                padding: '10px 12px',
                marginBottom: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '8px',
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                <span>{broadcastError}</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast}>
              {/* Broadcast category selector */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {BROADCAST_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setBroadcastType(type.id)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: `1px solid ${broadcastType === type.id ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      backgroundColor: broadcastType === type.id ? 'rgba(0, 102, 204, 0.1)' : 'var(--bg-subtle)',
                      color: broadcastType === type.id ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    {isAr ? type.labelAr : type.labelEn}
                  </button>
                ))}
              </div>

              {/* Message Textarea */}
              <div style={{ marginBottom: '14px' }}>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={broadcastMessage}
                  onChange={(e) => {
                    setBroadcastMessage(e.target.value);
                    if (broadcastError) setBroadcastError('');
                  }}
                  placeholder={isAr
                    ? 'اكتب نص التنبيه هنا... سيتم حفظه وإرساله للمجموعة'
                    : 'Type your announcement here...'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  disabled={broadcastSending}
                  onClick={() => setSelectedCohortForBroadcast(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>

                <button
                  type="submit"
                  disabled={broadcastSending || broadcastMessage.trim().length < 3}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: broadcastMessage.trim().length >= 3 && !broadcastSending
                      ? 'var(--primary)'
                      : 'var(--border-subtle)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: broadcastMessage.trim().length >= 3 && !broadcastSending ? 'pointer' : 'not-allowed',
                  }}
                >
                  {broadcastSending ? <Loader2 size={13} className="spin" /> : <Send size={13} />}
                  <span>
                    {broadcastSending
                      ? (isAr ? 'جاري الإرسال...' : 'Sending...')
                      : (isAr ? 'إرسال التنبيه الآن' : 'Dispatch Alert')}
                  </span>
                </button>
              </div>
            </form>

            {/* Saved Recent Announcements History */}
            <div style={{
              marginTop: '18px',
              paddingTop: '14px',
              borderTop: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                {isAr ? 'آخر التنبيهات المرسلة لهذه المجموعة' : 'Recent Announcements Sent'}
              </div>

              {loadingAnnouncements ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '8px 0' }}>
                  {isAr ? 'جاري تحميل سجل التنبيهات...' : 'Loading announcements...'}
                </div>
              ) : recentAnnouncements.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '8px 0' }}>
                  {isAr ? 'لم يتم إرسال تنبيهات لهذه المجموعة بعد.' : 'No announcements sent to this cohort yet.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {recentAnnouncements.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '11px' }}>
                          {getTypeLabel(item.type)}
                        </span>
                        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US') : ''}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>{item.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
