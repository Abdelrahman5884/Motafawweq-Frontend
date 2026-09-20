import React from 'react';
import { Flame, AlertTriangle, MessageCircle } from 'lucide-react';

export const RosterTable = ({ filteredStudents, lang, isRtl }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-medium)' }}>
              <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {lang === 'ar' ? 'الطالب' : 'Student'}
              </th>
              <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {lang === 'ar' ? 'نسبة الحضور' : 'Attendance'}
              </th>
              <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {lang === 'ar' ? 'متوسط الامتحانات' : 'Avg Quiz Score'}
              </th>
              <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {lang === 'ar' ? 'نقطة الضعف المشخصة بالـ AI' : 'Diagnosed Weak Area'}
              </th>
              <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {lang === 'ar' ? 'ولي الأمر' : 'Parent & Contact'}
              </th>
              <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {lang === 'ar' ? 'الحالة' : 'Status'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, idx) => (
              <tr
                key={s.id}
                style={{
                  borderBottom: idx !== filteredStudents.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {/* Student Info */}
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={s.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? s.nameAr : s.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Flame size={12} color="var(--warning)" />
                        <span>{s.streakDays} {lang === 'ar' ? 'أيام متتالية' : 'day streak'}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Attendance */}
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: s.attendanceRate >= 90 ? 'var(--success)' : 'var(--warning)' }}>
                    {s.attendanceRate}%
                  </div>
                </td>

                {/* Quiz Score */}
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: '800', color: s.avgQuizScore >= 90 ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {s.avgQuizScore}%
                  </div>
                </td>

                {/* AI Diagnosed Weak Area */}
                <td style={{ padding: '14px 18px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--danger)',
                    fontSize: '11.5px',
                    fontWeight: '700'
                  }}>
                    <AlertTriangle size={12} />
                    <span>{lang === 'ar' ? s.weakAreaAr : s.weakArea}</span>
                  </div>
                </td>

                {/* Parent & WhatsApp */}
                <td style={{ padding: '14px 18px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? s.parentNameAr : s.parentName}
                    </div>
                    <a
                      href={`https://wa.me/${s.parentPhone?.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        color: 'var(--success)',
                        textDecoration: 'none',
                        fontWeight: '600',
                        marginTop: '2px'
                      }}
                    >
                      <MessageCircle size={12} />
                      <span>{s.parentPhone}</span>
                    </a>
                  </div>
                </td>

                {/* Status */}
                <td style={{ padding: '14px 18px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: s.status === 'Top Performer' ? '#ECFDF5' : (s.status === 'Needs Attention' ? '#FEF2F2' : 'var(--bg-subtle)'),
                    color: s.status === 'Top Performer' ? 'var(--success)' : (s.status === 'Needs Attention' ? 'var(--danger)' : 'var(--text-secondary)')
                  }}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
