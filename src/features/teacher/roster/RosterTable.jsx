import React, { useState } from 'react';
import { Flame, MessageCircle, Phone, Trash2, Users, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGroups } from '../../../context/GroupsContext';

export const RosterTable = ({
  groupId,
  students = [],
  lang = 'ar',
  isRtl = true
}) => {
  const { removeStudentFromGroup } = useGroups();
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState(null);

  // Pagination for desktop
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(students.length / pageSize) || 1;
  const paginatedStudents = students.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleConfirmDelete = () => {
    if (!deleteConfirmStudent) return;
    removeStudentFromGroup(groupId, deleteConfirmStudent.id);
    setDeleteConfirmStudent(null);
  };

  if (students.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '48px 20px',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        <Users size={36} color="var(--primary)" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
          {lang === 'ar' ? 'لا يوجد طلاب مقيدون في هذه المجموعة حالياً' : 'No enrolled students in this cohort yet'}
        </h3>
        <p style={{ fontSize: '12.5px', margin: 0 }}>
          {lang === 'ar'
            ? 'يمكنك قبول طلبات انضمام الطلاب من تبويب «طلبات الانضمام والدعوات» أعلاه، أو إرسال دعوة مباشرة'
            : 'Accept join requests from the Pending tab or invite students directly'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop & Tablet Table */}
      <div className="roster-desktop-table" style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: '800' }}>
                <th style={{ padding: '14px 18px' }}>{lang === 'ar' ? 'الطالب' : 'Student'}</th>
                <th style={{ padding: '14px 18px' }}>{lang === 'ar' ? 'نسبة الحضور' : 'Attendance'}</th>
                <th style={{ padding: '14px 18px' }}>{lang === 'ar' ? 'الحصص المحضورة' : 'Sessions'}</th>
                <th style={{ padding: '14px 18px' }}>{lang === 'ar' ? 'متوسط الامتحانات' : 'Avg Quiz'}</th>
                <th style={{ padding: '14px 18px' }}>{lang === 'ar' ? 'ولي الأمر والاتصال' : 'Parent Contact'}</th>
                <th style={{ padding: '14px 18px' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((s) => (
                <tr
                  key={s.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* Student Info */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={s.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80'}
                        alt=""
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {lang === 'ar' ? s.nameAr || s.name : s.name || s.nameAr}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Flame size={12} color="var(--primary)" />
                          <span>{s.streakDays || 1} {lang === 'ar' ? 'أيام متتالية' : 'day streak'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Attendance Rate */}
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--primary-surface)',
                      color: 'var(--primary)',
                      fontWeight: '800',
                      fontSize: '12px'
                    }}>
                      {s.attendanceRate || 100}%
                    </span>
                  </td>

                  {/* Attended Sessions */}
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '12.5px' }}>
                      {s.attendedSessions || 1} / {s.totalSessions || 1} {lang === 'ar' ? 'حصة' : 'Sessions'}
                    </span>
                  </td>

                  {/* Quiz Score */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '900', color: 'var(--primary)' }}>
                      {s.avgQuizScore || 90}%
                    </div>
                  </td>

                  {/* Parent Info & WhatsApp Contact */}
                  <td style={{ padding: '14px 18px' }}>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? s.parentNameAr || 'ولي الأمر' : s.parentName || 'Parent'}
                      </div>
                      <a
                        href={`https://wa.me/${s.parentPhone?.replace(/\D/g, '') || s.phone?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          color: 'var(--primary)',
                          textDecoration: 'none',
                          fontWeight: '700',
                          direction: 'ltr',
                          marginTop: '2px'
                        }}
                      >
                        <MessageCircle size={12} />
                        <span>{s.parentPhone || s.phone}</span>
                      </a>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--primary-surface)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(21, 136, 199, 0.2)'
                    }}>
                      {s.status === 'Excellence'
                        ? (lang === 'ar' ? 'متفوق' : 'Excellence')
                        : s.status === 'Top 1%'
                        ? (lang === 'ar' ? 'أوائل 1%' : 'Top 1%')
                        : (lang === 'ar' ? 'نشط وملتزم' : 'Active')}
                    </span>
                  </td>

                  {/* Action: Remove Student */}
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <button
                      onClick={() => setDeleteConfirmStudent(s)}
                      title={lang === 'ar' ? 'إلغاء قيد الطالب من المجموعة' : 'Remove student from cohort'}
                      style={{
                        border: 'none',
                        background: 'var(--bg-subtle)',
                        borderRadius: '8px',
                        padding: '6px',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.color = '#EF4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}>
            <div>
              {lang === 'ar'
                ? `عرض ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, students.length)} من أصل ${students.length} طالب`
                : `Showing ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, students.length)} of ${students.length} students`}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface)',
                  padding: '4px 8px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1
                }}
              >
                <ChevronRight size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
              </button>

              <span style={{ fontWeight: '700', padding: '0 4px' }}>
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface)',
                  padding: '4px 8px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1
                }}
              >
                <ChevronLeft size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Remove Student Confirmation Modal */}
      {deleteConfirmStudent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(4, 25, 53, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 10002,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '18px',
            padding: '24px',
            maxWidth: '420px',
            width: '100%',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'إلغاء قيد الطالب من المجموعة' : 'Remove Student'}
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 20px 0' }}>
              {lang === 'ar'
                ? `هل أنت متأكد من إلغاء قيد الطالب «${deleteConfirmStudent.nameAr || deleteConfirmStudent.name}» من هذه المجموعة؟`
                : `Are you sure you want to remove ${deleteConfirmStudent.name} from this cohort?`}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setDeleteConfirmStudent(null)}
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
                onClick={handleConfirmDelete}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'تأكيد الإلغاء' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
