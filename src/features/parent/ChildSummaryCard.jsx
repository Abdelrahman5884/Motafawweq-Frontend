import React from 'react';
import { Flame, Building2, School, QrCode } from 'lucide-react';
import { ParentAvatar } from './ParentAvatar';

export const ChildSummaryCard = ({ activeChild, lang, isRtl }) => {
  if (!activeChild) return null;

  const displayName = lang === 'ar' ? (activeChild.nameAr || activeChild.name) : (activeChild.name || activeChild.nameAr);
  const gradeLabel = lang === 'ar' ? (activeChild.gradeAr || activeChild.grade) : (activeChild.grade || activeChild.gradeAr);
  const centerLabel = lang === 'ar' ? activeChild.centerAr : (activeChild.center || activeChild.centerAr);
  const schoolLabel = lang === 'ar' ? activeChild.schoolAr : (activeChild.school || activeChild.schoolAr);
  const presentCount = Number(activeChild.presentSessionsCount || 0);
  const totalSessions = Number(activeChild.totalSessionsCount || 0);
  const attendanceCaption = totalSessions > 0
    ? (lang === 'ar' ? `${presentCount} من ${totalSessions} حصة` : `${presentCount} of ${totalSessions} sessions`)
    : (lang === 'ar' ? 'لا توجد حصص مسجلة بعد' : 'No sessions yet');

  const standingLabel = lang === 'ar'
    ? (activeChild.gradeStandingAr || 'لا توجد اختبارات بعد')
    : (activeChild.gradeStandingEn || 'No exams yet');

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
      gap: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', minWidth: '260px' }}>
        <div style={{ position: 'relative' }}>
          <ParentAvatar
            src={activeChild.avatar}
            name={displayName}
            size={68}
            border="3px solid var(--primary-light)"
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
            border: '2px solid var(--bg-surface)',
          }} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {displayName}
            </h2>
            {activeChild.studentCode && (
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '99px',
                backgroundColor: 'rgba(21, 136, 199, 0.1)',
                color: 'var(--primary)',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <QrCode size={12} />
                <span>{activeChild.studentCode}</span>
              </span>
            )}
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '600' }}>
            {gradeLabel}
          </div>

          {(centerLabel || schoolLabel) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginTop: '8px',
              fontSize: '11.5px',
              color: 'var(--text-secondary)',
              flexWrap: 'wrap',
            }}>
              {centerLabel && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building2 size={13} color="var(--primary)" />
                  {centerLabel}
                </span>
              )}
              {schoolLabel && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <School size={13} color="var(--text-secondary)" />
                  {schoolLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
      }}>
        {/* Attendance KPI */}
        <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {lang === 'ar' ? 'نسبة الحضور' : 'Attendance Rate'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--success, #16A34A)', fontFamily: 'var(--font-heading)' }}>
            {activeChild.attendanceRate ?? 0}%
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
            {attendanceCaption}
          </div>
        </div>

        <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-subtle)' }} />

        {/* GPA / Exam Average */}
        <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {lang === 'ar' ? 'المعدل التراكمي' : 'Cumulative GPA'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
            {activeChild.avgQuizScore ?? 0}%
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--primary)', fontWeight: '700' }}>
            {standingLabel}
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
            justifyContent: isRtl ? 'flex-start' : 'flex-end',
          }}>
            <Flame size={20} color="#F59E0B" />
            <span>{activeChild.streakDays ?? 0}</span>
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? 'يوماً متواصلاً' : 'consecutive days'}
          </div>
        </div>
      </div>
    </div>
  );
};
