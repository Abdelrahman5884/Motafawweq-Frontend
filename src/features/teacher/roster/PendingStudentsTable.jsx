import React from 'react';
import { Check, X, Clock, Smartphone, UserPlus, Phone, MessageCircle, AlertCircle } from 'lucide-react';
import { useGroups } from '../../../context/GroupsContext';

export const PendingStudentsTable = ({
  groupId,
  pendingStudents = [],
  lang = 'ar',
  isRtl = true,
  onOpenInviteModal
}) => {
  const { acceptPendingStudent, rejectPendingStudent, studentJoinByCode, getActiveGroup } = useGroups();
  const currentGroup = getActiveGroup();

  const handleSimulateQuickScan = () => {
    if (!currentGroup) return;
    const names = [
      { nameAr: 'نورهان هاني الجوهري', phone: '+20 101 122 3344', parentNameAr: 'هاني الجوهري', parentPhone: '+20 100 556 6778', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
      { nameAr: 'عبدالرحمن حسن مصطفى', phone: '+20 100 012 3456', parentNameAr: 'حسن مصطفى', parentPhone: '+20 101 123 4567', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' },
      { nameAr: 'أحمد محمد فتحي', phone: '+20 128 877 6655', parentNameAr: 'محمد فتحي', parentPhone: '+20 122 887 7665', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' }
    ];
    const pick = names[Math.floor(Math.random() * names.length)];
    studentJoinByCode(currentGroup.joinCode, pick);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Action Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        borderRadius: '14px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} color="var(--primary)" />
          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {lang === 'ar'
              ? `طلبات الانضمام المعلقة (${pendingStudents.length})`
              : `Pending Join Requests (${pendingStudents.length})`}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {lang === 'ar'
              ? '— الطلاب الذين مسحوا الباركود أو تم إرسال دعوة لهم بانتظار موافقتك'
              : '— Students who scanned the QR code or were invited'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Quick simulation for easy testing */}
          <button
            onClick={handleSimulateQuickScan}
            title={lang === 'ar' ? 'محاكاة طالب يمسح الباركود بهاتفه' : 'Simulate QR Scan by student'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Smartphone size={14} color="var(--primary)" />
            <span>{lang === 'ar' ? 'محاكاة مسح باركود' : 'Simulate Scan'}</span>
          </button>

          <button
            onClick={onOpenInviteModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 8px var(--primary-glow)'
            }}
          >
            <UserPlus size={14} />
            <span>{lang === 'ar' ? 'دعوة طالب جديد' : 'Invite Student'}</span>
          </button>
        </div>
      </div>

      {/* Requests Content */}
      {pendingStudents.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '48px 20px',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <Clock size={36} color="var(--primary)" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
            {lang === 'ar' ? 'لا توجد طلبات انضمام معلقة حالياً' : 'No pending join requests'}
          </h3>
          <p style={{ fontSize: '12.5px', margin: '0 0 16px 0' }}>
            {lang === 'ar'
              ? 'عندما يقوم الطالب بمسح باركود المجموعة بكاميرا هاتفه أو إدخال الكود، سيظهر طلبه هنا فوراً لقبوله'
              : 'When a student scans the group QR code, their request appears here for approval'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button
              onClick={handleSimulateQuickScan}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                border: '1px solid rgba(21, 136, 199, 0.25)',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              <Smartphone size={14} />
              <span>{lang === 'ar' ? 'تجربة محاكاة مسح طالب الآن' : 'Test Student Scan Now'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: '800' }}>
                  <th style={{ padding: '14px 18px' }}>{lang === 'ar' ? 'الطالب' : 'Student'}</th>
                  <th style={{ padding: '14px 18px' }}>{lang === 'ar' ? 'رقم هاتف الطالب' : 'Student Phone'}</th>
                  <th style={{ padding: '14px 18px' }}>{lang === 'ar' ? 'ولي الأمر' : 'Parent Contact'}</th>
                  <th style={{ padding: '14px 18px' }}>{lang === 'ar' ? 'طريقة الانضمام والتوقيت' : 'Method & Time'}</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center' }}>{lang === 'ar' ? 'الإجراء المطلوب' : 'Decision'}</th>
                </tr>
              </thead>
              <tbody>
                {pendingStudents.map((st) => (
                  <tr
                    key={st.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {/* Student Info */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={st.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80'}
                          alt=""
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                          {st.nameAr || st.name}
                        </div>
                      </div>
                    </td>

                    {/* Student Phone */}
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontWeight: '700', direction: 'ltr', display: 'inline-block' }}>
                        {st.phone}
                      </span>
                    </td>

                    {/* Parent Contact */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '12.5px' }}>
                        {st.parentNameAr || 'ولي الأمر'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace', direction: 'ltr', marginTop: '2px' }}>
                        {st.parentPhone}
                      </div>
                    </td>

                    {/* Method & Time */}
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--primary-surface)',
                        color: 'var(--primary)',
                        fontSize: '11px',
                        fontWeight: '800'
                      }}>
                        <Smartphone size={12} />
                        <span>{st.method || 'مسح الباركود'}</span>
                      </span>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                        {st.requestedAt || 'الآن'}
                      </div>
                    </td>

                    {/* Action Buttons: Accept / Reject */}
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {/* Accept Button */}
                        <button
                          onClick={() => acceptPendingStudent(groupId, st.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 14px',
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
                          <Check size={14} />
                          <span>{lang === 'ar' ? 'قبول' : 'Accept'}</span>
                        </button>

                        {/* Reject Button */}
                        <button
                          onClick={() => rejectPendingStudent(groupId, st.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                            e.currentTarget.style.color = '#EF4444';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          }}
                        >
                          <X size={14} />
                          <span>{lang === 'ar' ? 'رفض' : 'Reject'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
