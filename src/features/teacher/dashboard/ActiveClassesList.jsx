import React, { useState } from 'react';
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
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { MOCK_CLASSES } from '../../../data/mockData';

export const ActiveClassesList = ({ lang, onOpenClasses }) => {
  const isAr = lang === 'ar';

  // Modal states
  const [selectedCohortForTrack, setSelectedCohortForTrack] = useState(null);
  const [selectedCohortForBroadcast, setSelectedCohortForBroadcast] = useState(null);
  const [broadcastType, setBroadcastType] = useState('announcement');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSentToast, setBroadcastSentToast] = useState(false);

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSentToast(true);
    setTimeout(() => {
      setBroadcastSentToast(false);
      setSelectedCohortForBroadcast(null);
      setBroadcastMessage('');
    }, 2200);
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      boxShadow: 'var(--shadow-xs)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
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

        <button
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
            transition: 'all 0.15s ease'
          }}
        >
          <span>{isAr ? 'إدارة كافة القاعات' : 'Manage All'}</span>
          <ArrowUpRight size={13} />
        </button>
      </div>

      {/* ── RESPONSIVE TABLE VIEW (Visible on tablet & desktop) ── */}
      <div className="teacher-classes-table-container">
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
          fontSize: '12.5px'
        }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: isAr ? 'right' : 'left' }}>
              <th style={{ padding: '8px 12px', fontWeight: '700' }}>{isAr ? 'اسم المجموعة والمقر' : 'Group & Hall'}</th>
              <th style={{ padding: '8px 12px', fontWeight: '700' }}>{isAr ? 'المادة والمرحلة' : 'Subject & Stage'}</th>
              <th style={{ padding: '8px 12px', fontWeight: '700' }}>{isAr ? 'الموعد' : 'Schedule'}</th>
              <th style={{ padding: '8px 12px', fontWeight: '700' }}>{isAr ? 'العدد والسعة' : 'Enrolled'}</th>
              <th style={{ padding: '8px 12px', fontWeight: '700' }}>{isAr ? 'حالة الاستيعاب' : 'Capacity'}</th>
              <th style={{ padding: '8px 12px', fontWeight: '700', textAlign: 'center' }}>{isAr ? 'إجراءات سريعة' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CLASSES.map(cls => {
              const fillPct = Math.round((cls.enrolledStudents / cls.capacity) * 100);
              const remainingSeats = cls.capacity - cls.enrolledStudents;
              const isFullOrNearly = fillPct >= 95;

              return (
                <tr
                  key={cls.id}
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Group Name & Code */}
                  <td style={{
                    padding: '12px',
                    borderRadius: isAr ? '0 8px 8px 0' : '8px 0 0 8px',
                    borderTop: '1px solid var(--border-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    borderInlineStart: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ fontWeight: '800', color: 'var(--text-primary)', marginBottom: '3px' }}>
                      {isAr ? cls.nameAr : cls.name}
                    </div>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '700',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      {cls.joinCode}
                    </span>
                  </td>

                  {/* Subject & Grade */}
                  <td style={{
                    padding: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                      {isAr ? cls.subjectAr : cls.subject}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {isAr ? cls.gradeAr : cls.grade}
                    </div>
                  </td>

                  {/* Schedule */}
                  <td style={{
                    padding: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} color="var(--text-muted)" />
                      <span>{isAr ? cls.scheduleAr : cls.schedule}</span>
                    </div>
                  </td>

                  {/* Enrolled Students & Mini Bar */}
                  <td style={{
                    padding: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      {cls.enrolledStudents} <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)' }}>/ {cls.capacity}</span>
                    </div>
                    <div style={{
                      width: '80px',
                      height: '5px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginTop: '4px'
                    }}>
                      <div style={{
                        width: `${fillPct}%`,
                        height: '100%',
                        backgroundColor: isFullOrNearly ? '#F59E0B' : 'var(--primary)',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </td>

                  {/* Capacity Status Badge (مليان ولا لسه) */}
                  <td style={{
                    padding: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    whiteSpace: 'nowrap'
                  }}>
                    {isFullOrNearly ? (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(245, 158, 11, 0.12)',
                        color: '#D97706',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <AlertCircle size={11} />
                        {isAr ? `مكتملة (${remainingSeats} مقاعد)` : `Near Full (${remainingSeats} left)`}
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        color: 'var(--success)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCircle2 size={11} />
                        {isAr ? `متاح تسجيل (${remainingSeats} مقعداً)` : `Available (${remainingSeats} seats)`}
                      </span>
                    )}
                  </td>

                  {/* Action Buttons (متابعة + ابعتلهم حاجه) */}
                  <td style={{
                    padding: '12px',
                    borderRadius: isAr ? '8px 0 0 8px' : '0 8px 8px 0',
                    borderTop: '1px solid var(--border-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    borderInlineEnd: '1px solid var(--border-subtle)',
                    textAlign: 'center'
                  }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {/* Button: Follow / Track */}
                      <button
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
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Eye size={12} color="var(--primary)" />
                        <span>{isAr ? 'متابعة' : 'Track'}</span>
                      </button>

                      {/* Button: Send Announcement / Message */}
                      <button
                        onClick={() => setSelectedCohortForBroadcast(cls)}
                        title={isAr ? 'إرسال تنبيه أو رسالة للمجموعة' : 'Send Alert / Message'}
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
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Send size={12} />
                        <span>{isAr ? 'إرسال تنبيه' : 'Alert'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── ADAPTIVE MOBILE CARDS VIEW (Visible only on mobile screens) ── */}
      <div className="teacher-classes-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '12px' }}>
        {MOCK_CLASSES.map(cls => {
          const fillPct = Math.round((cls.enrolledStudents / cls.capacity) * 100);
          const remainingSeats = cls.capacity - cls.enrolledStudents;
          const isFullOrNearly = fillPct >= 95;

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
                gap: '10px'
              }}
            >
              {/* Title & Join Code */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {isAr ? cls.nameAr : cls.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {isAr ? `${cls.subjectAr} • ${cls.gradeAr}` : `${cls.subject} • ${cls.grade}`}
                  </div>
                </div>
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: '800',
                  padding: '2px 7px',
                  borderRadius: '5px',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--primary)',
                  border: '1px solid var(--border-subtle)',
                  whiteSpace: 'nowrap'
                }}>
                  {cls.joinCode}
                </span>
              </div>

              {/* Schedule & Capacity Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                  <Clock size={12} color="var(--text-muted)" />
                  <span>{isAr ? cls.scheduleAr : cls.schedule}</span>
                </div>

                {isFullOrNearly ? (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 7px',
                    borderRadius: '5px',
                    backgroundColor: 'rgba(245, 158, 11, 0.12)',
                    color: '#D97706'
                  }}>
                    {isAr ? `مكتملة (${remainingSeats} متبقي)` : `Near Full (${remainingSeats})`}
                  </span>
                ) : (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 7px',
                    borderRadius: '5px',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: 'var(--success)'
                  }}>
                    {isAr ? `متاح (${remainingSeats} مقعد)` : `Available (${remainingSeats})`}
                  </span>
                )}
              </div>

              {/* Students count & progress track */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{isAr ? 'الطلاب المسجلون:' : 'Enrolled:'}</span>
                  <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                    {cls.enrolledStudents} / {cls.capacity} ({fillPct}%)
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '5px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '5px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${fillPct}%`,
                    height: '100%',
                    backgroundColor: isFullOrNearly ? '#F59E0B' : 'var(--primary)',
                    borderRadius: '5px'
                  }} />
                </div>
              </div>

              {/* Action Buttons Full Width on Mobile */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
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
                    cursor: 'pointer'
                  }}
                >
                  <Eye size={13} color="var(--primary)" />
                  <span>{isAr ? 'متابعة الطلاب' : 'Track'}</span>
                </button>

                <button
                  onClick={() => setSelectedCohortForBroadcast(cls)}
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
                    cursor: 'pointer'
                  }}
                >
                  <Send size={13} />
                  <span>{isAr ? 'إرسال تنبيه' : 'Alert'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MODAL 1: TRACK COHORT QUICK STATS ── */}
      {selectedCohortForTrack && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: '480px',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {isAr ? selectedCohortForTrack.nameAr : selectedCohortForTrack.name}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  {isAr ? 'تقرير الحضور ومعدل الاستيعاب الفوري' : 'Live attendance & performance summary'}
                </p>
              </div>
              <button
                onClick={() => setSelectedCohortForTrack(null)}
                style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isAr ? 'نسبة الحضور' : 'Attendance'}</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--primary)', marginTop: '2px' }}>
                  {selectedCohortForTrack.attendanceRate}%
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isAr ? 'متوسط الكويز' : 'Quiz Avg'}</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--success)', marginTop: '2px' }}>
                  {selectedCohortForTrack.avgScore}%
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isAr ? 'نسبة الاستيعاب' : 'Capacity'}</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {Math.round((selectedCohortForTrack.enrolledStudents / selectedCohortForTrack.capacity) * 100)}%
                </div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
              {isAr
                ? 'المجموعة ملتزمة بنسبة 94.2% ولم تسجل أي حالات غياب غير مبررة خلال آخر حصتين. تم تصحيح كويز الأحياء الأخير لـ 146 طالباً.'
                : 'Cohort attendance is at 94.2% with 0 unexcused absences in the last two sessions. 146 quiz submissions processed.'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setSelectedCohortForTrack(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
              <button
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
                  cursor: 'pointer'
                }}
              >
                {isAr ? 'فتح في إدارة القاعات' : 'Open in Class Manager'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: SEND ALERT / BROADCAST TO GROUP (Addressing "ابعتلهم حاجه") ── */}
      {selectedCohortForBroadcast && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: '500px',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bell size={18} color="var(--primary)" />
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                    {isAr ? 'إرسال تنبيه أو إشعار فوري' : 'Broadcast Alert to Cohort'}
                  </h4>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  {isAr ? `إلى: ${selectedCohortForBroadcast.nameAr} (${selectedCohortForBroadcast.enrolledStudents} طالب)` : `To: ${selectedCohortForBroadcast.name}`}
                </p>
              </div>
              <button
                onClick={() => setSelectedCohortForBroadcast(null)}
                style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Success Toast */}
            {broadcastSentToast ? (
              <div style={{
                padding: '24px',
                textAlign: 'center',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--success)'
              }}>
                <Sparkles size={28} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '15px', fontWeight: '800' }}>
                  {isAr ? 'تم إرسال التنبيه بنجاح!' : 'Alert Sent Successfully!'}
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px', color: 'var(--text-secondary)' }}>
                  {isAr ? 'وصل الإشعار عبر تطبيق متفوق ورسائل SMS لأولياء الأمور والطلاب.' : 'Notification dispatched to students and parent portal.'}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendBroadcast}>
                {/* Broadcast category selector */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'announcement', labelAr: 'تنبيه هام', labelEn: 'Important Alert' },
                    { id: 'homework', labelAr: 'تذكير بالواجب', labelEn: 'Homework Reminder' },
                    { id: 'quiz', labelAr: 'كويز سريع', labelEn: 'Pop Quiz' },
                    { id: 'reschedule', labelAr: 'تعديل موعد', labelEn: 'Schedule Note' }
                  ].map(type => (
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
                        cursor: 'pointer'
                      }}
                    >
                      {isAr ? type.labelAr : type.labelEn}
                    </button>
                  ))}
                </div>

                {/* Message Textarea */}
                <div style={{ marginBottom: '16px' }}>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder={isAr
                      ? 'اكتب نص التنبيه هنا... سيصل مباشرة عبر الإشعارات وتطبيق ولي الأمر'
                      : 'Type your message here...'}
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
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedCohortForBroadcast(null)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={!broadcastMessage.trim()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: broadcastMessage.trim() ? 'var(--primary)' : 'var(--border-subtle)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: broadcastMessage.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <Send size={13} />
                    <span>{isAr ? 'إرسال للجميع الآن' : 'Dispatch Alert'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
