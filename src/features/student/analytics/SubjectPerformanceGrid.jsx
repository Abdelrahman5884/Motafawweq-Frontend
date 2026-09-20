import React from 'react';
import { SCard, SProgress, S } from '../../../components/student/ui';

export const SubjectPerformanceGrid = ({ subjectAverages, lang }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '16px',
      marginBottom: '28px'
    }}>
      {subjectAverages.map((sub, i) => (
        <SCard key={i}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: S.textPrimary }}>
              {sub.subjectAr}
            </span>
            <span style={{
              fontSize: '16px',
              fontWeight: '800',
              color: sub.avg >= 90 ? S.success : sub.avg >= 80 ? S.primary : S.warning
            }}>
              {sub.avg}%
            </span>
          </div>

          <SProgress
            value={sub.avg}
            color={sub.avg >= 90 ? S.success : sub.avg >= 80 ? S.primary : S.warning}
          />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            color: S.textMuted,
            marginTop: '10px'
          }}>
            <span>{sub.testsCount} اختبارات</span>
            <span>{sub.lessonsDone} من {sub.lessonsTotal} حصة</span>
          </div>
        </SCard>
      ))}
    </div>
  );
};
