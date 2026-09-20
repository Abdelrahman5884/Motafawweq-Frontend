import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, FileText, Award, RotateCcw, Play, Trophy,
  AlertCircle, X
} from 'lucide-react';
import { UPCOMING_EXAMS } from '../../../data/studentData';

export const ExamCatalog = ({
  handleRequestStartExam,
  pendingExam,
  setPendingExam,
  handleConfirmStart,
  lang
}) => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)',
        flexWrap: 'wrap'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            letterSpacing: '-0.01em'
          }}>
            {lang === 'ar' ? 'الامتحانات والاختبارات' : 'Exams & Assessments'}
          </h1>
          <p style={{
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.5
          }}>
            {lang === 'ar' 
              ? 'امتحانات بنظام البابل شيت مع توقيت زمني دقيق وتصحيح تفصيلي فوري' 
              : 'Official timed bubble sheet exams with automated grading'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12.5px',
            fontWeight: '700',
            color: 'var(--text-secondary)'
          }}>
            <span>{UPCOMING_EXAMS.filter(e => e.status === 'ready').length} {lang === 'ar' ? 'امتحانات متاحة الآن' : 'exams available'}</span>
          </div>

          <button
            onClick={() => navigate('/student/league')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '12px',
              backgroundColor: 'var(--warning-light)',
              border: '1.5px solid var(--warning)',
              color: 'var(--warning)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            <Trophy size={15} color="var(--primary)" />
            <span>{lang === 'ar' ? 'عرض ترتيبي في الدوري' : 'League Rank'}</span>
          </button>
        </div>
      </div>

      {/* Clean Exam Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {UPCOMING_EXAMS.map((exam) => {
          const isReady = exam.status === 'ready';

          return (
            <div
              key={exam.id}
              className="clean-exam-card"
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div>
                {/* Top Row: Subject & Status */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {exam.subjectAr}
                  </span>

                  {isReady ? (
                    <span style={{
                      fontSize: '11.5px',
                      fontWeight: '700',
                      color: 'var(--success)',
                      backgroundColor: 'var(--success-light)',
                      padding: '3px 9px',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--success)',
                        animation: 'softPulse 2s infinite ease-in-out'
                      }} />
                      <span>{lang === 'ar' ? 'متاح الآن' : 'Available'}</span>
                    </span>
                  ) : (
                    <span style={{
                      fontSize: '11.5px',
                      fontWeight: '600',
                      color: 'var(--text-muted)',
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '3px 9px',
                      borderRadius: '8px'
                    }}>
                      {exam.date}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '16.5px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  margin: '0 0 8px 0',
                  lineHeight: 1.45,
                  minHeight: '44px'
                }}>
                  {exam.titleAr}
                </h3>

                {/* Subtitle / Teacher */}
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '16px'
                }}>
                  {exam.teacherNameAr || 'معلم المادة'} • {exam.typeAr || 'بابل شيت رسمي'}
                </div>

                {/* Clean Specs Grid */}
                <div style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="var(--text-muted)" />
                    <span>{exam.durationMinutes} دقيقة</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} color="var(--text-muted)" />
                    <span>{exam.questionsCount || 10} سؤالاً</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={14} color="var(--text-muted)" />
                    <span>{exam.maxScore} درجة</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RotateCcw size={14} color="var(--text-muted)" />
                    <span>المحاولات: {exam.attemptsAllowed}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isReady ? (
                  <button
                    onClick={() => handleRequestStartExam(exam)}
                    className="clean-btn"
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '13.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 10px rgba(21, 136, 199, 0.25)'
                    }}
                  >
                    <Play size={14} fill="#FFFFFF" />
                    <span>{lang === 'ar' ? 'بدء الامتحان' : 'Start Exam'}</span>
                  </button>
                ) : (
                  <button
                    disabled
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'not-allowed'
                    }}
                  >
                    {lang === 'ar' ? `متاح في موعده (${exam.date})` : 'Upcoming'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pre-Exam Instructions & Confirmation Modal */}
      {pendingExam && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(6, 37, 78, 0.45)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: '24px',
            maxWidth: '480px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
            animation: 'modalFadeIn 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                <AlertCircle size={20} />
                <span style={{ fontSize: '12.5px', fontWeight: '800' }}>
                  {lang === 'ar' ? 'تعليمات ما قبل البدء' : 'Exam Guidelines'}
                </span>
              </div>
              <button
                onClick={() => setPendingExam(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              {pendingExam.titleAr}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              {lang === 'ar'
                ? 'بمجرد الضغط على بدء الامتحان، سيبدأ العداد التنازلي فوراً ولن يمكنك إيقافه مؤقتاً.'
                : 'Once started, the timer will begin immediately and cannot be paused.'}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setPendingExam(null)}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                onClick={handleConfirmStart}
                style={{
                  flex: 2,
                  padding: '11px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 10px rgba(21, 136, 199, 0.25)'
                }}
              >
                <Play size={14} fill="#FFFFFF" />
                <span>{lang === 'ar' ? 'تأكيد وبدء الامتحان' : 'Confirm & Begin'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
