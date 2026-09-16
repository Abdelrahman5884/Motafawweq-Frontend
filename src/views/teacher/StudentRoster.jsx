import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_STUDENTS } from '../../data/mockData';
import { 
  Users, 
  Search, 
  Phone, 
  MessageCircle, 
  AlertTriangle, 
  Award, 
  CheckCircle2, 
  Filter,
  Flame
} from 'lucide-react';

export const StudentRoster = () => {
  const { lang, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredStudents = MOCK_STUDENTS.filter(s => {
    const matchesSearch = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.nameAr.includes(searchQuery) ||
      s.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || s.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '36px 24px 80px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          margin: '0 0 6px 0',
          fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
        }}>
          {lang === 'ar' ? 'سجل الطلاب والتشخيص الأكاديمي' : 'Student Performance & Diagnostics Roster'}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          {lang === 'ar' ? 'متابعة تفصيلية لدرجات امتحانات الحصص، الحضور، وتنبيهات المفاهيم الصعبة' : 'Comprehensive tracking of attendance, quiz scores, and AI diagnosed weak areas'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        backgroundColor: 'var(--bg-surface-elevated)',
        padding: '16px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-medium)',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-subtle)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          flex: 1,
          minWidth: '240px'
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'ابحث باسم الطالب أو رقم ولي الأمر...' : 'Search by student name or parent phone...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '13px',
              color: 'var(--text-primary)',
              width: '100%',
              fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-latin)'
            }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {[
            { id: 'all', label: lang === 'ar' ? 'جميع الطلاب' : 'All Students' },
            { id: 'top performer', label: lang === 'ar' ? 'المتفوقون' : 'Top Performers' },
            { id: 'needs attention', label: lang === 'ar' ? 'يحتاج متابعة' : 'Needs Attention' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              style={{
                padding: '7px 12px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: statusFilter === f.id ? 'var(--primary)' : 'var(--bg-subtle)',
                color: statusFilter === f.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Table */}
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
                          <Flame size={12} color="#F59E0B" />
                          <span>{s.streakDays} {lang === 'ar' ? 'أيام متتالية' : 'day streak'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Attendance */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: s.attendanceRate >= 90 ? '#10B981' : '#F59E0B' }}>
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
                      color: '#EF4444',
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
                          color: '#10B981',
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
                      color: s.status === 'Top Performer' ? '#10B981' : (s.status === 'Needs Attention' ? '#EF4444' : 'var(--text-secondary)')
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
    </div>
  );
};
