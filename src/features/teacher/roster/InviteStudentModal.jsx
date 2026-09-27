import React, { useState, useMemo } from 'react';
import { X, Search, UserPlus, Check, UserCheck, Phone, ShieldCheck } from 'lucide-react';
import { ALL_REGISTERED_STUDENTS, useGroups } from '../../../context/GroupsContext';

export const InviteStudentModal = ({
  isOpen,
  groupId,
  groupName,
  lang = 'ar',
  onClose
}) => {
  const { inviteStudentToGroup, enrolledStudents, pendingStudents } = useGroups();
  const [searchQuery, setSearchQuery] = useState('');

  const currentEnrolled = enrolledStudents[groupId] || [];
  const currentPending = pendingStudents[groupId] || [];

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ALL_REGISTERED_STUDENTS;
    return ALL_REGISTERED_STUDENTS.filter(st =>
      st.nameAr.toLowerCase().includes(q) ||
      st.nameEn.toLowerCase().includes(q) ||
      st.phone.includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleInvite = (student) => {
    const success = inviteStudentToGroup(groupId, student);
    if (success) {
      // keep modal open so teacher can invite more if wanted, or close
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 25, 53, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10001,
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
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
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
              <UserPlus size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'دعوة وإضافة طالب للمجموعة' : 'Invite Student to Cohort'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                {groupName}
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

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '10px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '14px'
        }}>
          <Search size={15} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'ابحث باسم الطالب أو رقم الهاتف...' : 'Search student by name or phone...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '13px',
              color: 'var(--text-primary)',
              width: '100%',
              fontFamily: 'inherit'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Students List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxHeight: '340px',
          overflowY: 'auto',
          paddingRight: '2px'
        }}>
          {filteredStudents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-secondary)', fontSize: '13px' }}>
              {lang === 'ar' ? 'لا يوجد طلاب مطابقون لنتائج البحث' : 'No students found matching search'}
            </div>
          ) : (
            filteredStudents.map((st) => {
              const isAlreadyEnrolled = currentEnrolled.some(s => s.nameAr === st.nameAr || s.phone === st.phone);
              const isAlreadyPending = currentPending.some(s => s.nameAr === st.nameAr || s.phone === st.phone);

              return (
                <div
                  key={st.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={st.avatar}
                      alt={st.nameAr}
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? st.nameAr : st.nameEn}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span>{st.gradeAr}</span>
                        <span>•</span>
                        <span style={{ direction: 'ltr' }}>{st.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isAlreadyEnrolled ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 9px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--primary-surface)',
                        color: 'var(--primary)',
                        fontSize: '11px',
                        fontWeight: '800'
                      }}>
                        <UserCheck size={12} />
                        <span>{lang === 'ar' ? 'مقيد بالمجموعة' : 'Enrolled'}</span>
                      </span>
                    ) : isAlreadyPending ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 9px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(21, 136, 199, 0.1)',
                        color: 'var(--primary)',
                        fontSize: '11px',
                        fontWeight: '800'
                      }}>
                        <span>{lang === 'ar' ? 'دعوة معلقة' : 'Pending'}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleInvite(st)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px var(--primary-glow)',
                          transition: 'opacity 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        <UserPlus size={13} />
                        <span>{lang === 'ar' ? 'إرسال دعوة' : 'Invite'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
