import React, { useState } from 'react';
import {
  Flame,
  MessageCircle,
  Trash2,
  Users,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Loader2,
  UserPlus,
} from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { useGroups } from '../../../context/GroupsContext';

function formatWhatsappNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (/^01\d{9}$/.test(digits)) {
    return `2${digits}`;
  }
  return digits;
}

function getAcademicBadge(status, isAr) {
  switch (status) {
    case 'Top 1%':
      return {
        label: isAr ? 'أوائل 1%' : 'Top 1%',
        color: '#D97706',
        bg: 'rgba(245, 158, 11, 0.14)',
        border: 'rgba(245, 158, 11, 0.3)',
      };
    case 'Excellence':
      return {
        label: isAr ? 'متفوق' : 'Excellence',
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.3)',
      };
    case 'Needs Support':
      return {
        label: isAr ? 'يحتاج متابعة' : 'Needs Support',
        color: '#EF4444',
        bg: 'rgba(239, 68, 68, 0.1)',
        border: 'rgba(239, 68, 68, 0.28)',
      };
    default:
      return {
        label: isAr ? 'نشط وملتزم' : 'Good',
        color: 'var(--primary)',
        bg: 'rgba(21, 136, 199, 0.1)',
        border: 'rgba(21, 136, 199, 0.25)',
      };
  }
}

export const RosterTable = ({
  groupId,
  students = [],
  hasFilters = false,
  lang = 'ar',
  isRtl = true,
  isMobile = false,
  onOpenInviteModal,
  onResetFilters,
}) => {
  const isAr = lang === 'ar';
  const { removeStudentFromGroup, showToast } = useGroups();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(students.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedStudents = students.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleCopyBarcode = (s) => {
    const code = s.studentBarcode || s.studentPasscode || '';
    if (!code) return;
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedCodeId(s.id);
    showToast?.(isAr ? `تم نسخ كود حضور الطالب: ${code}` : `Copied pass code: ${code}`);
    setTimeout(() => setCopiedCodeId((prev) => (prev === s.id ? null : prev)), 2000);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    setDeleteError('');
    const result = await removeStudentFromGroup(groupId, deleteTarget.id);
    setIsDeleting(false);
    if (result?.success) {
      setDeleteTarget(null);
    } else {
      setDeleteError(result?.error || (isAr ? 'تعذر إلغاء قيد الطالب.' : 'Failed to remove student.'));
    }
  };

  if (students.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '44px 20px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
        }}
      >
        <Users size={36} color="var(--primary)" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
          {hasFilters
            ? isAr
              ? 'لا توجد نتائج مطابقة لخيارات البحث والفلترة'
              : 'No students match your filter'
            : isAr
              ? 'لا يوجد طلاب مقيدون في هذه المجموعة حالياً'
              : 'No enrolled students in this cohort yet'}
        </h3>
        <p style={{ fontSize: '12.5px', margin: '0 auto 16px', maxWidth: '440px', lineHeight: 1.6 }}>
          {hasFilters
            ? isAr
              ? 'جرب تعديل نص البحث أو مسح فلتر الحالة.'
              : 'Try adjusting your search query or clearing filters.'
            : isAr
              ? 'اقبل طلبات الانضمام المعلقة أو أضف طلاباً مباشرة من زر دعوة طالب.'
              : 'Accept pending requests or invite students directly.'}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              color: 'var(--primary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
          </button>
        ) : (
          onOpenInviteModal && (
            <button
              type="button"
              onClick={onOpenInviteModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <UserPlus size={14} />
              <span>{isAr ? 'دعوة أو إضافة طالب' : 'Invite Student'}</span>
            </button>
          )
        )}
      </div>
    );
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          borderTop: isMobile ? undefined : '1px solid var(--border-subtle)',
          border: isMobile ? '1px solid var(--border-subtle)' : undefined,
          borderRadius: isMobile ? '12px' : 0,
          marginTop: isMobile ? '12px' : 0,
          backgroundColor: 'var(--bg-subtle)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div>
          {isAr
            ? `عرض ${(safePage - 1) * pageSize + 1} - ${Math.min(safePage * pageSize, students.length)} من أصل ${students.length} طالب`
            : `Showing ${(safePage - 1) * pageSize + 1} - ${Math.min(safePage * pageSize, students.length)} of ${students.length}`}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
            style={{
              border: '1px solid var(--border-medium)',
              borderRadius: '7px',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              padding: '4px 8px',
              cursor: safePage === 1 ? 'not-allowed' : 'pointer',
              opacity: safePage === 1 ? 0.5 : 1,
            }}
          >
            <ChevronRight size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
          </button>

          <span style={{ fontWeight: '800', padding: '0 6px' }}>
            {safePage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={safePage === totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
            style={{
              border: '1px solid var(--border-medium)',
              borderRadius: '7px',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              padding: '4px 8px',
              cursor: safePage === totalPages ? 'not-allowed' : 'pointer',
              opacity: safePage === totalPages ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {paginatedStudents.map((s) => {
            const displayName = s.nameAr || s.name || 'طالب';
            const badge = getAcademicBadge(s.status || s.academicStatus, isAr);
            const attendanceRate = Number(s.attendanceRate ?? 0);
            const attendedSessions = Number(s.attendedSessions ?? 0);
            const totalSessions = Number(s.totalSessions ?? 0);
            const streakDays = Number(s.streakDays ?? 0);
            const avgQuiz = Number(s.avgQuizScore ?? 0);
            const hasExams = Number(s.gradedExamsCount ?? 0) > 0 || avgQuiz > 0;
            const contactPhone = s.parentPhone || s.phone || '';
            const cleanWa = formatWhatsappNumber(contactPhone);
            const isCopied = copiedCodeId === s.id;

            return (
              <div
                key={s.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <Avatar src={s.avatar} name={displayName} size={38} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {displayName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          <Flame size={11} color="#D97706" />
                          {streakDays} {isAr ? 'يوم' : 'd'}
                        </span>
                        {(s.studentPasscode || s.studentBarcode) && (
                          <button
                            type="button"
                            onClick={() => handleCopyBarcode(s)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              border: 'none',
                              background: 'transparent',
                              padding: 0,
                              color: isCopied ? '#10B981' : 'var(--text-secondary)',
                              fontFamily: 'monospace',
                              fontSize: '11px',
                              cursor: 'pointer',
                            }}
                          >
                            <span>• {s.studentPasscode ? `PIN: ${s.studentPasscode}` : s.studentBarcode}</span>
                            {isCopied ? <Check size={11} /> : <Copy size={11} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: '800',
                      padding: '3px 8px',
                      borderRadius: '7px',
                      backgroundColor: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`,
                      flexShrink: 0,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center' }}>
                  <div style={{ padding: '7px 4px', borderRadius: '9px', backgroundColor: 'var(--bg-subtle)' }}>
                    <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--primary)' }}>
                      {totalSessions > 0 ? `${attendanceRate}%` : '—'}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{isAr ? 'الحضور' : 'Attendance'}</div>
                  </div>
                  <div style={{ padding: '7px 4px', borderRadius: '9px', backgroundColor: 'var(--bg-subtle)' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {attendedSessions}/{totalSessions}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{isAr ? 'الحصص' : 'Sessions'}</div>
                  </div>
                  <div style={{ padding: '7px 4px', borderRadius: '9px', backgroundColor: 'var(--bg-subtle)' }}>
                    <div style={{ fontSize: '13px', fontWeight: '900', color: '#10B981' }}>
                      {hasExams ? `${avgQuiz}%` : '—'}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{isAr ? 'الامتحانات' : 'Exams'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                  {cleanWa ? (
                    <a
                      href={`https://wa.me/${cleanWa}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        fontWeight: '700',
                        direction: 'ltr',
                      }}
                    >
                      <MessageCircle size={13} />
                      <span>{contactPhone}</span>
                    </a>
                  ) : (
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>—</span>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError('');
                      setDeleteTarget(s);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      color: '#EF4444',
                      border: '1px solid rgba(239, 68, 68, 0.22)',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={12} />
                    <span>{isAr ? 'إلغاء القيد' : 'Remove'}</span>
                  </button>
                </div>
              </div>
            );
          })}
          {renderPagination()}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: isRtl ? 'right' : 'left',
                fontSize: '13px',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontWeight: '800',
                  }}
                >
                  <th style={{ padding: '14px 16px' }}>{isAr ? 'الطالب' : 'Student'}</th>
                  <th style={{ padding: '14px 16px' }}>{isAr ? 'كود الحضور (PIN)' : 'Attendance Pass'}</th>
                  <th style={{ padding: '14px 16px' }}>{isAr ? 'الحضور والحصص' : 'Attendance'}</th>
                  <th style={{ padding: '14px 16px' }}>{isAr ? 'متوسط الامتحانات' : 'Avg Exams'}</th>
                  <th style={{ padding: '14px 16px' }}>{isAr ? 'ولي الأمر والاتصال' : 'Contact'}</th>
                  <th style={{ padding: '14px 16px' }}>{isAr ? 'الحالة' : 'Status'}</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center' }}>{isAr ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((s) => {
                  const displayName = s.nameAr || s.name || 'طالب';
                  const badge = getAcademicBadge(s.status || s.academicStatus, isAr);
                  const attendanceRate = Number(s.attendanceRate ?? 0);
                  const attendedSessions = Number(s.attendedSessions ?? 0);
                  const totalSessions = Number(s.totalSessions ?? 0);
                  const streakDays = Number(s.streakDays ?? 0);
                  const avgQuiz = Number(s.avgQuizScore ?? 0);
                  const hasExams = Number(s.gradedExamsCount ?? 0) > 0 || avgQuiz > 0;
                  const contactPhone = s.parentPhone || s.phone || '';
                  const cleanWa = formatWhatsappNumber(contactPhone);
                  const contactLabel = s.parentNameAr
                    || (s.parentPhone ? (isAr ? 'ولي الأمر' : 'Parent') : (contactPhone ? (isAr ? 'هاتف الطالب' : 'Student Phone') : '—'));
                  const isCopied = copiedCodeId === s.id;

                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Avatar src={s.avatar} name={displayName} size={36} />
                          <div>
                            <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                              {displayName}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                              <Flame size={11} color="#D97706" />
                              <span>
                                {streakDays} {isAr ? 'يوم التزام' : 'day streak'}
                              </span>
                              {s.studentCode && <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>• {s.studentCode}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                        {s.studentBarcode || s.studentPasscode ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div>
                              {s.studentPasscode && (
                                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                                  PIN: {s.studentPasscode}
                                </div>
                              )}
                              {s.studentBarcode && (
                                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                  {s.studentBarcode}
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyBarcode(s)}
                              title={isAr ? 'نسخ كود الباركود' : 'Copy barcode'}
                              style={{
                                background: 'var(--bg-subtle)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '6px',
                                padding: '4px',
                                color: isCopied ? '#10B981' : 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                              }}
                            >
                              {isCopied ? <Check size={12} /> : <Copy size={12} />}
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>

                      <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(21, 136, 199, 0.1)',
                              color: 'var(--primary)',
                              fontWeight: '800',
                              fontSize: '12px',
                            }}
                          >
                            {totalSessions > 0 ? `${attendanceRate}%` : '—'}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                            ({attendedSessions}/{totalSessions})
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            fontSize: '13.5px',
                            fontWeight: '900',
                            color: hasExams ? 'var(--primary)' : 'var(--text-muted)',
                          }}
                        >
                          {hasExams ? `${avgQuiz}%` : '—'}
                        </span>
                      </td>

                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {contactLabel}
                        </div>
                        {cleanWa ? (
                          <a
                            href={`https://wa.me/${cleanWa}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11.5px',
                              color: 'var(--primary)',
                              textDecoration: 'none',
                              fontWeight: '700',
                              direction: 'ltr',
                              marginTop: '2px',
                            }}
                          >
                            <MessageCircle size={12} />
                            <span>{contactPhone}</span>
                          </a>
                        ) : (
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>

                      <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '3px 9px',
                            borderRadius: '7px',
                            backgroundColor: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>

                      <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError('');
                            setDeleteTarget(s);
                          }}
                          title={isAr ? 'إلغاء قيد الطالب من المجموعة' : 'Remove student from cohort'}
                          style={{
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            background: 'rgba(239, 68, 68, 0.08)',
                            borderRadius: '8px',
                            padding: '6px 8px',
                            cursor: 'pointer',
                            color: '#EF4444',
                            display: 'inline-flex',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </div>
      )}

      {/* Remove Student Confirmation Modal */}
      {deleteTarget && (
        <div
          onClick={() => { if (!isDeleting) setDeleteTarget(null); }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(4, 25, 53, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 10002,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            direction: isRtl ? 'rtl' : 'ltr',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '420px',
              width: '100%',
              border: '1px solid var(--border-medium)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '11px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertCircle size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? 'إلغاء قيد الطالب من المجموعة' : 'Remove Student'}
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 16px 0' }}>
              {isAr
                ? `هل أنت متأكد من إلغاء قيد الطالب «${deleteTarget.nameAr || deleteTarget.name}» من هذه المجموعة؟`
                : `Are you sure you want to remove ${deleteTarget.name || deleteTarget.nameAr} from this cohort?`}
            </p>

            {deleteError && (
              <div
                style={{
                  padding: '9px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  fontSize: '12px',
                  fontWeight: '700',
                  marginBottom: '14px',
                }}
              >
                {deleteError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: isDeleting ? 'wait' : 'pointer',
                  opacity: isDeleting ? 0.7 : 1,
                }}
              >
                {isDeleting && <Loader2 size={14} className="animate-spin" />}
                <span>{isAr ? 'تأكيد الإلغاء' : 'Confirm Remove'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
