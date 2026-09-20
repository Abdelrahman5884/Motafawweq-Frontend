import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { UPCOMING_EXAMS, HOMEWORK_LIST } from '../../../data/studentData';

export const UpcomingDeadlines = ({ lang, isRtl }) => {
  const navigate = useNavigate();

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
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  {lang === 'ar' ? 'الاختبارات القادمة (US-11)' : 'Upcoming Exams'}
                </h3>
              </div>
            </div>

            <span style={{ fontSize: '11px', fontWeight: '700', color: '#F59E0B', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
              {lang === 'ar' ? 'متبقي 18 ساعة' : '18h left'}
            </span>
          </div>

          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {UPCOMING_EXAMS[0].titleAr}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            {lang === 'ar'
              ? `الموعد: الأحد 06:00 م • المدة: ${UPCOMING_EXAMS[0].durationMinutes} دقيقة • ${UPCOMING_EXAMS[0].questionsCount} سؤال (${UPCOMING_EXAMS[0].maxScore} درجة)`
              : `Sunday 06:00 PM • ${UPCOMING_EXAMS[0].durationMinutes} mins • ${UPCOMING_EXAMS[0].questionsCount} questions`
            }
          </div>
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
            minHeight: '40px',
            transition: 'all 0.15s ease'
          }}
        >
          <span>{lang === 'ar' ? 'مراجعة المنهج ودخول الاختبار' : 'View Exam & Prepare'}</span>
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
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  {lang === 'ar' ? 'الواجبات المطلوبة (US-12)' : 'Upcoming Homework'}
                </h3>
              </div>
            </div>

            <span style={{ fontSize: '11px', fontWeight: '700', color: '#EF4444', background: 'rgba(239, 68, 68, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
              {lang === 'ar' ? 'ينتهي الليلة' : 'Due Tonight'}
            </span>
          </div>

          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {HOMEWORK_LIST[0].titleAr}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            {lang === 'ar'
              ? `الموعد النهائي: الليلة قبل 11:59 م • ${HOMEWORK_LIST[0].questionsCount} أسئلة (${HOMEWORK_LIST[0].maxScore} درجة) • مادة ${HOMEWORK_LIST[0].subjectAr}`
              : `Deadline: Tonight 11:59 PM • ${HOMEWORK_LIST[0].questionsCount} questions (${HOMEWORK_LIST[0].maxScore} pts)`
            }
          </div>
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
            minHeight: '40px',
            transition: 'all 0.15s ease'
          }}
        >
          <span>{lang === 'ar' ? 'حل وتسليم الواجب الآن' : 'Solve & Submit Homework'}</span>
          {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
        </button>
      </div>
    </div>
  );
};
