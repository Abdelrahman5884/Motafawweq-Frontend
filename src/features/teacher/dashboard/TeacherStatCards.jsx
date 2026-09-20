import React from 'react';
import { DollarSign, Users, Sparkles, Award } from 'lucide-react';
import { MOCK_TEACHER_EARNINGS } from '../../../data/mockData';

export const TeacherStatCards = ({ lang }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '18px',
      marginBottom: '36px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600' }}>{lang === 'ar' ? 'إجمالي الأرباح (سبتمبر)' : 'Monthly Revenue'}</span>
          <DollarSign size={18} color="var(--success)" />
        </div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
          {MOCK_TEACHER_EARNINGS.totalRevenueEgp.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: '600' }}>{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--success)', fontWeight: '600', marginTop: '4px' }}>
          +18.4% {lang === 'ar' ? 'عن الشهر الماضي' : 'vs last month'}
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600' }}>{lang === 'ar' ? 'إجمالي الطلاب المسجلين' : 'Total Students'}</span>
          <Users size={18} color="var(--primary)" />
        </div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
          3,840
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
          {lang === 'ar' ? 'في 3 سناتر ومجموعات الأونلاين' : 'Across 3 centers & online'}
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600' }}>{lang === 'ar' ? 'رصيد الذكاء الاصطناعي' : 'AI Minutes Quota'}</span>
          <Sparkles size={18} color="var(--primary-light)" />
        </div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
          184 <span style={{ fontSize: '14px', fontWeight: '600' }}>/ 300 {lang === 'ar' ? 'دقيقة' : 'min'}</span>
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--primary)', fontWeight: '600', marginTop: '4px' }}>
          {lang === 'ar' ? 'باقة المعلم المحترف نشطة' : 'Teacher Pro Active'}
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600' }}>{lang === 'ar' ? 'متوسط استيعاب الدفعة' : 'Class Mastery Avg'}</span>
          <Award size={18} color="var(--warning)" />
        </div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--warning)', fontFamily: 'var(--font-heading)' }}>
          84.5%
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--success)', fontWeight: '600', marginTop: '4px' }}>
          {lang === 'ar' ? 'أعلى من متوسط المحافظة (76%)' : 'Above state avg (76%)'}
        </div>
      </div>
    </div>
  );
};
