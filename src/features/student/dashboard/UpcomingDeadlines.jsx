import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { UPCOMING_EXAMS, HOMEWORK_LIST } from '../../../data/studentData';

export const UpcomingDeadlines = ({ lang, isRtl }) => {
  const navigate = useNavigate();
  const nextExam = UPCOMING_EXAMS[0] || null;
  const nextHw = HOMEWORK_LIST[0] || null;

  return (
    <div className="executive-deadlines-grid">
      {/* US-11: Upcoming Exams */}
      <div className="executive-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.12)',
                color: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Calendar size={17} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'الاختبارات القادمة' : 'Upcoming Exams'}
              </h3>
            </div>
          </div>

          {nextExam ? (
            <>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {nextExam.titleAr}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                {lang === 'ar'
                  ? `المدة: ${nextExam.durationMinutes} دقيقة • ${nextExam.questionsCount} سؤال`
                  : `${nextExam.durationMinutes} mins • ${nextExam.questionsCount} questions`}
              </div>
            </>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '12px 0 18px', fontWeight: '600' }}>
              {lang === 'ar' ? 'لا توجد اختبارات قادمة حالياً.' : 'No upcoming exams at the moment.'}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/student/exam')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
            padding: '9px 14px',
            color: '#D97706',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            minHeight: '40px'
          }}
        >
          <span>{lang === 'ar' ? 'صفحة الامتحانات' : 'View Exams'}</span>
          {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
        </button>
      </div>

      {/* US-12: Upcoming Homeworks & Deadlines */}
      <div className="executive-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FileText size={17} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'الواجبات المطلوبة' : 'Upcoming Homework'}
              </h3>
            </div>
          </div>

          {nextHw ? (
            <>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {nextHw.titleAr}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                {lang === 'ar'
                  ? `الدرجة: ${nextHw.maxScore} درجة`
                  : `Max score: ${nextHw.maxScore} pts`}
              </div>
            </>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '12px 0 18px', fontWeight: '600' }}>
              {lang === 'ar' ? 'لا توجد واجبات مطلوبة حالياً.' : 'No pending homework at the moment.'}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/student/homework')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '9px 14px',
            color: '#DC2626',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            minHeight: '40px'
          }}
        >
          <span>{lang === 'ar' ? 'صفحة الواجبات' : 'View Homework'}</span>
          {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
        </button>
      </div>
    </div>
  );
};
