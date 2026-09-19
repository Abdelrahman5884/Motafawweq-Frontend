import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { HOMEWORK_LIST } from '../../data/studentData';
import confetti from 'canvas-confetti';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  Calendar,
  X,
  Send,
  Paperclip,
  Download,
  Eye,
  EyeOff,
  Award,
  AlertCircle,
  FileCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SPage } from '../../components/student/ui';

export const StudentHomeworkView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();

  const [filterTab, setFilterTab] = useState('all');
  const [selectedHw, setSelectedHw] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationToast, setConfirmationToast] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(true);

  const filteredList = HOMEWORK_LIST.filter(hw => {
    if (filterTab === 'all') return true;
    return hw.status === filterTab;
  });

  const handleOpenHw = (hw) => {
    setSelectedHw(hw);
    setAnswerText(hw.submissionText || '');
    setUploadedFileName(hw.submittedFileUrl || '');
    setShowPdfPreview(true);
  };

  const handleSimulateFileUpload = (e) => {
    const file = e.target.files?.[0];
    setUploadedFileName(file ? file.name : 'حل-الواجب-عمر-طارق.pdf');
  };

  const handleSubmitHomework = (e) => {
    e.preventDefault();
    if (!answerText.trim() && !uploadedFileName) {
      alert(lang === 'ar' ? 'يرجى كتابة الحل أو إرفاق ملف الحل أولاً.' : 'Please enter an answer or upload a file.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } });
      } catch (err) {
        // ignore
      }
      setConfirmationToast(selectedHw.titleAr);
      setSelectedHw(null);
      setTimeout(() => setConfirmationToast(null), 3500);
    }, 1000);
  };

  const pendingCount = HOMEWORK_LIST.filter(h => h.status === 'pending').length;

  return (
    <SPage maxWidth={1060}>
      {/* Subtle & Calm Styles */}
      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes tabFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .clean-hw-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .clean-hw-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
          border-color: var(--border-medium);
        }
        .clean-btn {
          transition: all 0.15s ease;
        }
        .clean-btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .clean-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'var(--font-arabic, sans-serif)' }}>
        
        {/* Toast Notification */}
        {confirmationToast && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            padding: '12px 22px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.35)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13.5px',
            fontWeight: '700',
            animation: 'modalFadeIn 0.2s ease'
          }}>
            <CheckCircle2 size={18} />
            <span>تم تسليم الواجب بنجاح: {confirmationToast}</span>
          </div>
        )}

        {/* Clean Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              letterSpacing: '-0.01em'
            }}>
              {lang === 'ar' ? 'الواجبات والتكليفات' : 'Homework & Assignments'}
            </h1>
            <p style={{
              fontSize: '13.5px',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.5
            }}>
              {lang === 'ar'
                ? 'استعراض شيتات وملفات الواجبات المرفقة من المعلمين وتسليم الحلول ومتابعة التقييم'
                : 'Review assignment sheets, attached PDFs, submit solutions, and track grades'}
            </p>
          </div>

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
            <span>{pendingCount} {lang === 'ar' ? 'واجبات قيد التسليم' : 'pending assignments'}</span>
          </div>
        </div>

        {/* Clean Filter Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-subtle)',
          padding: '4px',
          borderRadius: '14px',
          width: 'fit-content',
          border: '1px solid var(--border-subtle)'
        }}>
          {[
            { id: 'all', label: lang === 'ar' ? 'جميع الواجبات' : 'All', count: HOMEWORK_LIST.length },
            { id: 'pending', label: lang === 'ar' ? 'مطلوب تسليمه' : 'Pending', count: pendingCount },
            { id: 'submitted', label: lang === 'ar' ? 'تم التسليم' : 'Submitted', count: HOMEWORK_LIST.filter(h => h.status === 'submitted').length },
            { id: 'graded', label: lang === 'ar' ? 'مصحح ومعتمد' : 'Graded', count: HOMEWORK_LIST.filter(h => h.status === 'graded').length }
          ].map(tab => {
            const isActive = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '6px',
                  backgroundColor: isActive ? 'var(--primary-surface)' : 'var(--bg-hover)',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)'
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Homework Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
          animation: 'tabFadeIn 0.2s ease-out'
        }}>
          {filteredList.map((hw) => {
            const isPending = hw.status === 'pending';
            const isGraded = hw.status === 'graded';
            const isSubmitted = hw.status === 'submitted';

            return (
              <div
                key={hw.id}
                className="clean-hw-card"
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
                    marginBottom: '12px'
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
                      {hw.subjectAr}
                    </span>

                    {isPending && (
                      <span style={{
                        fontSize: '11.5px',
                        fontWeight: '700',
                        color: '#B45309',
                        backgroundColor: 'rgba(245, 158, 11, 0.08)',
                        padding: '3px 9px',
                        borderRadius: '8px'
                      }}>
                        مطلوب تسليمه
                      </span>
                    )}

                    {isSubmitted && (
                      <span style={{
                        fontSize: '11.5px',
                        fontWeight: '700',
                        color: '#2563EB',
                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                        padding: '3px 9px',
                        borderRadius: '8px'
                      }}>
                        تم التسليم • قيد المراجعة
                      </span>
                    )}

                    {isGraded && (
                      <span style={{
                        fontSize: '11.5px',
                        fontWeight: '800',
                        color: '#059669',
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        padding: '3px 9px',
                        borderRadius: '8px'
                      }}>
                        تم التصحيح ({hw.earnedScore}/{hw.maxScore})
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '16.5px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    margin: '0 0 10px 0',
                    lineHeight: 1.45,
                    minHeight: '44px'
                  }}>
                    {hw.titleAr}
                  </h3>

                  {/* Teacher & Deadline */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: '14px'
                  }}>
                    <span style={{ fontWeight: '600' }}>{hw.teacherNameAr}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isPending ? '#B45309' : 'var(--text-muted)' }}>
                      <Clock size={12} />
                      {hw.deadlineTextAr}
                    </span>
                  </div>

                  {/* PDF Attachment Notice (if teacher attached PDF) */}
                  {hw.teacherAttachmentPdf && (
                    <div style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.06)',
                      border: '1px solid rgba(239, 68, 68, 0.15)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: '#B91C1C',
                      fontWeight: '700',
                      marginBottom: '14px'
                    }}>
                      <FileText size={14} />
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        شيت الأسئلة مرفق بصيغة PDF
                      </span>
                      <span style={{ fontSize: '11px', opacity: 0.85 }}>
                        {hw.teacherAttachmentPdf.fileSize}
                      </span>
                    </div>
                  )}

                  {/* Specs row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: '18px'
                  }}>
                    <span>{hw.questionsCount} أسئلة</span>
                    <span>•</span>
                    <span>الدرجة: {hw.maxScore} درجة</span>
                  </div>
                </div>

                {/* Action Button */}
                <div>
                  <button
                    onClick={() => handleOpenHw(hw)}
                    className="clean-btn"
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      backgroundColor: isPending ? 'var(--primary)' : 'var(--bg-subtle)',
                      color: isPending ? '#FFFFFF' : 'var(--text-primary)',
                      border: isPending ? 'none' : '1px solid var(--border-subtle)',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: isPending ? '0 2px 8px rgba(108, 77, 255, 0.25)' : 'none'
                    }}
                  >
                    {isPending ? (
                      <>
                        <UploadCloud size={15} />
                        <span>{lang === 'ar' ? 'عرض الأسئلة والحل' : 'View & Submit'}</span>
                      </>
                    ) : isGraded ? (
                      <>
                        <Award size={15} />
                        <span>{lang === 'ar' ? 'عرض التقييم والملاحظات' : 'View Feedback'}</span>
                      </>
                    ) : (
                      <>
                        <Eye size={15} />
                        <span>{lang === 'ar' ? 'عرض الحل المسلّم' : 'View Submission'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            CALM HOMEWORK DETAILS & PDF VIEW MODAL
           ========================================================================= */}
        {selectedHw && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: '22px',
              maxWidth: '620px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18)',
              position: 'relative',
              animation: 'modalFadeIn 0.2s ease-out'
            }}>
              {/* Close Button */}
              <button
                onClick={() => setSelectedHw(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: isRtl ? '20px' : 'auto',
                  right: isRtl ? 'auto' : '20px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>

              {/* Header */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)'
                  }}>
                    {selectedHw.subjectAr}
                  </span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    المعلم: {selectedHw.teacherNameAr}
                  </span>
                </div>

                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  margin: '0 0 6px 0',
                  lineHeight: 1.4
                }}>
                  {selectedHw.titleAr}
                </h2>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={13} />
                  <span>الموعد النهائي: {selectedHw.deadlineTextAr}</span>
                  <span>•</span>
                  <span>الدرجة: {selectedHw.maxScore} درجة</span>
                </div>
              </div>

              {/* 📄 TEACHER ATTACHED PDF CARD (Key User Request) */}
              {selectedHw.teacherAttachmentPdf && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  border: '1.5px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '18px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: showPdfPreview ? '12px' : '0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        color: '#DC2626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {selectedHw.teacherAttachmentPdf.fileName}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                          ملف الأسئلة المرفق من الأستاذ • {selectedHw.teacherAttachmentPdf.fileSize} • {selectedHw.teacherAttachmentPdf.pagesCount} صفحات
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => setShowPdfPreview(!showPdfPreview)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '7px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {showPdfPreview ? <EyeOff size={13} /> : <Eye size={13} />}
                        <span>{showPdfPreview ? 'إخفاء المعاينة' : 'معاينة الأسئلة'}</span>
                      </button>

                      <a
                        href="#download"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(lang === 'ar' ? 'تم بدء تحميل ملف أسئلة الواجب بصيغة PDF.' : 'Downloading PDF file.');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '7px 12px',
                          borderRadius: '8px',
                          backgroundColor: '#DC2626',
                          color: '#FFFFFF',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        <Download size={13} />
                        <span>تحميل PDF</span>
                      </a>
                    </div>
                  </div>

                  {/* Interactive Question Preview Inside Modal */}
                  {showPdfPreview && (
                    <div style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      fontSize: '12.5px',
                      lineHeight: 1.6
                    }}>
                      <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#DC2626', marginBottom: '8px' }}>
                        مقتطفات من أسئلة شيت الواجب:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-primary)' }}>
                        {selectedHw.teacherAttachmentPdf.previewQuestions.map((q, qIdx) => (
                          <div key={qIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <span style={{ color: '#DC2626', fontWeight: '700' }}>•</span>
                            <span>{q}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Instructions */}
              {selectedHw.instructionsAr && (
                <div style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  marginBottom: '18px',
                  fontSize: '12.5px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.5
                }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '3px', fontWeight: '700' }}>
                    تعليمات المعلم للحل:
                  </div>
                  {selectedHw.instructionsAr}
                </div>
              )}

              {/* Graded Feedback Card (if graded) */}
              {selectedHw.status === 'graded' && (
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1.5px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} />
                      <span>تقييم المعلم والدرجة</span>
                    </span>
                    <strong style={{ fontSize: '15px', fontWeight: '900', color: '#059669' }}>
                      {selectedHw.earnedScore} / {selectedHw.maxScore} درجة
                    </strong>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: '0 0 6px 0', lineHeight: 1.6 }}>
                    {selectedHw.teacherFeedbackAr}
                  </p>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    تاريخ التصحيح: {selectedHw.gradedDate}
                  </div>
                </div>
              )}

              {/* Solution Submission Form (for pending / submitted) */}
              {selectedHw.status !== 'graded' ? (
                <form onSubmit={handleSubmitHomework}>
                  <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    كتابة الحل أو التعليق:
                  </div>
                  <textarea
                    value={answerText}
                    onChange={e => setAnswerText(e.target.value)}
                    placeholder="اكتب إجابتك أو خطوات الحل العلمي هنا..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'var(--font-arabic)',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      marginBottom: '12px'
                    }}
                  />

                  {/* File Upload / Attach Solution Box */}
                  <div style={{
                    border: '1.5px dashed var(--border-medium)',
                    borderRadius: '14px',
                    padding: '14px',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-surface)',
                    marginBottom: '20px'
                  }}>
                    <label style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}>
                      <Paperclip size={18} color="var(--primary)" />
                      <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {uploadedFileName || 'إرفاق ملف الحل من جهازك (PDF أو صورة)'}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        انقر هنا لاختيار ملف من جهازك
                      </span>
                      <input type="file" style={{ display: 'none' }} onChange={handleSimulateFileUpload} />
                    </label>
                  </div>

                  {/* Modal Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedHw(null)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      إلغاء
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="clean-btn"
                      style={{
                        padding: '10px 24px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: '800',
                        fontSize: '13px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 10px rgba(108, 77, 255, 0.3)'
                      }}
                    >
                      <Send size={14} />
                      <span>{isSubmitting ? 'جارٍ التسليم...' : 'تسليم الواجب الآن'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Graded Close Button */
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setSelectedHw(null)}
                    style={{
                      padding: '10px 22px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: '800',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    إغلاق
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SPage>
  );
};
