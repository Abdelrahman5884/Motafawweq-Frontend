import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, ArrowRight, ArrowLeft, Clock } from 'lucide-react';

export const UpcomingDeadlines = ({ upcomingExams = [], upcomingHomeworks = [], lang, isRtl }) => {
  const navigate = useNavigate();

  return (
    <div className="executive-deadlines-grid">
      {/* Upcoming Exams */}
      <div className="executive-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
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
                {lang === 'ar' ? 'الاختبارات المتاحة والقادمة' : 'Upcoming Exams'}
              </h3>
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(245, 158, 11, 0.12)',
              color: '#D97706'
            }}>
              {upcomingExams.length}
            </span>
          </div>

          {upcomingExams.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {upcomingExams.slice(0, 3).map((exam) => (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => navigate(`/student/exam?examId=${encodeURIComponent(exam.id)}`)}
                  style={{
                    width: '100%',
                    textAlign: isRtl ? 'right' : 'left',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lang === 'ar' ? exam.titleAr : (exam.titleEn || exam.titleAr)}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                      {(exam.courseTitleAr || exam.courseTitleEn) && (
                        <span style={{ color: '#D97706', fontWeight: '700' }}>
                          {lang === 'ar' ? exam.courseTitleAr : (exam.courseTitleEn || exam.courseTitleAr)}
                        </span>
                      )}
                      {(exam.courseTitleAr || exam.courseTitleEn) && <span>•</span>}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={11} />
                        {lang === 'ar' ? `${exam.durationMinutes || 30} دقيقة` : `${exam.durationMinutes || 30}m`}
                      </span>
                      {exam.dueDate && (
                        <>
                          <span>•</span>
                          <span>{exam.dueDate}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {isRtl ? <ArrowLeft size={14} color="#D97706" style={{ flexShrink: 0 }} /> : <ArrowRight size={14} color="#D97706" style={{ flexShrink: 0 }} />}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '12px 0 6px', fontWeight: '600' }}>
              {lang === 'ar' ? 'لا توجد اختبارات غير محلولة حالياً.' : 'No pending exams at the moment.'}
            </div>
          )}
        </div>

        <button
          type="button"
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

      {/* Upcoming Homeworks & Deadlines */}
      <div className="executive-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
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
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#DC2626'
            }}>
              {upcomingHomeworks.length}
            </span>
          </div>

          {upcomingHomeworks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {upcomingHomeworks.slice(0, 3).map((hw) => (
                <button
                  key={hw.id}
                  type="button"
                  onClick={() => navigate(`/student/homework?homeworkId=${encodeURIComponent(hw.id)}`)}
                  style={{
                    width: '100%',
                    textAlign: isRtl ? 'right' : 'left',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lang === 'ar' ? hw.titleAr : (hw.titleEn || hw.titleAr)}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                      {(hw.courseTitleAr || hw.courseTitleEn) && (
                        <span style={{ color: '#DC2626', fontWeight: '700' }}>
                          {lang === 'ar' ? hw.courseTitleAr : (hw.courseTitleEn || hw.courseTitleAr)}
                        </span>
                      )}
                      {(hw.courseTitleAr || hw.courseTitleEn) && <span>•</span>}
                      <span>
                        {lang === 'ar'
                          ? `${hw.maxGrade || hw.maxScore || 20} درجة`
                          : `${hw.maxGrade || hw.maxScore || 20} pts`}
                      </span>
                      {hw.dueDate && (
                        <>
                          <span>•</span>
                          <span>{hw.dueDate}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {isRtl ? <ArrowLeft size={14} color="#DC2626" style={{ flexShrink: 0 }} /> : <ArrowRight size={14} color="#DC2626" style={{ flexShrink: 0 }} />}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '12px 0 6px', fontWeight: '600' }}>
              {lang === 'ar' ? 'لا توجد واجبات مطلوبة حالياً.' : 'No pending homework at the moment.'}
            </div>
          )}
        </div>

        <button
          type="button"
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
