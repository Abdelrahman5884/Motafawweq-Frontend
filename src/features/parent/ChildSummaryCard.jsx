import React from 'react';
import { Flame, Trophy, Building2, School, CheckCircle2, QrCode } from 'lucide-react';

export const ChildSummaryCard = ({ activeChild, lang, isRtl }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', minWidth: '280px' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={activeChild.avatar}
            alt=""
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--primary-light)'
            }}
          />
          <span style={{
            position: 'absolute',
            bottom: '2px',
            right: isRtl ? 'auto' : '2px',
            left: isRtl ? '2px' : 'auto',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: 'var(--success, #16A34A)',
            border: '2px solid var(--bg-surface)'
          }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? activeChild.nameAr : activeChild.name}
            </h2>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '99px',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              color: 'var(--primary)',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <QrCode size={12} />
              <span>{activeChild.studentCode || 'STD-2026-OMAR'}</span>
            </span>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '600' }}>
            {lang === 'ar' ? activeChild.gradeAr : activeChild.grade}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginTop: '8px',
            fontSize: '11.5px',
            color: 'var(--text-secondary)',
            flexWrap: 'wrap'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Building2 size={13} color="var(--primary)" />
              {lang === 'ar' ? (activeChild.centerAr || 'سنتر الدقي النخبة') : (activeChild.center || 'Dokki Elite Center')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <School size={13} color="var(--text-secondary)" />
              {lang === 'ar' ? (activeChild.schoolAr || 'مدرسة السعيدية الثانوية') : (activeChild.school || 'El-Saidia High School')}
            </span>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Attendance KPI */}
        <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {lang === 'ar' ? 'نسبة حضور السنتر' : 'Attendance Rate'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--success, #16A34A)', fontFamily: 'var(--font-heading)' }}>
            {activeChild.attendanceRate}%
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? '28 من 29 حصة' : '28 of 29 sessions'}
          </div>
        </div>

        <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-subtle)' }} />

        {/* GPA / Exam Average */}
        <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {lang === 'ar' ? 'المعدل التراكمي' : 'Cumulative GPA'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
            {activeChild.avgQuizScore}%
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--primary)', fontWeight: '700' }}>
            {lang === 'ar' ? 'تقدير امتياز' : 'Top Tier'}
          </div>
        </div>

        <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Streak */}
        <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {lang === 'ar' ? 'الالتزام اليومي' : 'Daily Streak'}
          </div>
          <div style={{
            fontSize: '22px',
            fontWeight: '900',
            color: '#F59E0B',
            fontFamily: 'var(--font-heading)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            justifyContent: isRtl ? 'flex-start' : 'flex-end'
          }}>
            <Flame size={20} color="#F59E0B" />
            <span>{activeChild.streakDays}</span>
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? 'يوماً متواصلاً' : 'consecutive days'}
          </div>
        </div>
      </div>
    </div>
  );
};
