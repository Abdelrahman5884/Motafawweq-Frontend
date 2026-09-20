import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { HOMEWORK_LIST } from '../../data/studentData';
import confetti from 'canvas-confetti';
import { CheckCircle2 } from 'lucide-react';
import { SPage } from '../../components/student/ui';
import { HomeworkCard, HomeworkSubmissionModal } from '../../features/student/homework';

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
            backgroundColor: 'var(--success)',
            color: '#FFFFFF',
            padding: '12px 22px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(22, 163, 74, 0.35)',
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
          borderBottom: '1px solid var(--border-subtle)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ maxWidth: '100%', minWidth: 0, flex: 1 }}>
            <h1 style={{
              fontSize: 'clamp(20px, 4vw, 24px)',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              letterSpacing: '-0.01em',
              wordBreak: 'break-word'
            }}>
              {lang === 'ar' ? 'الواجبات والتكليفات' : 'Homework & Assignments'}
            </h1>
            <p style={{
              fontSize: '13.5px',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.5,
              wordBreak: 'break-word'
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
            <span>{pendingCount} واجبات تنتظر تسليمك</span>
          </div>
        </div>

        {/* Clean Filter Tabs Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          {[
            { id: 'all', labelAr: 'جميع التكليفات', labelEn: 'All', count: HOMEWORK_LIST.length },
            { id: 'pending', labelAr: 'مطلوب تسليمه', labelEn: 'Pending', count: pendingCount },
            { id: 'submitted', labelAr: 'قيد المراجعة', labelEn: 'In Review', count: HOMEWORK_LIST.filter(h => h.status === 'submitted').length },
            { id: 'graded', labelAr: 'تم التصحيح', labelEn: 'Graded', count: HOMEWORK_LIST.filter(h => h.status === 'graded').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                backgroundColor: filterTab === tab.id ? 'var(--primary)' : 'var(--bg-subtle)',
                color: filterTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: filterTab === tab.id ? 'var(--primary)' : 'var(--border-subtle)',
                fontSize: '13px',
                fontWeight: filterTab === tab.id ? '800' : '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
              <span style={{
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '6px',
                backgroundColor: filterTab === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
                color: filterTab === tab.id ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: '700'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Homework Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
          animation: 'tabFadeIn 0.25s ease'
        }}>
          {filteredList.map((hw) => (
            <HomeworkCard
              key={hw.id}
              hw={hw}
              handleOpenHw={handleOpenHw}
              lang={lang}
            />
          ))}
        </div>

        {/* Submission / Grade Modal */}
        <HomeworkSubmissionModal
          selectedHw={selectedHw}
          setSelectedHw={setSelectedHw}
          showPdfPreview={showPdfPreview}
          setShowPdfPreview={setShowPdfPreview}
          answerText={answerText}
          setAnswerText={setAnswerText}
          uploadedFileName={uploadedFileName}
          handleSimulateFileUpload={handleSimulateFileUpload}
          handleSubmitHomework={handleSubmitHomework}
          isSubmitting={isSubmitting}
          lang={lang}
          isRtl={isRtl}
        />
      </div>
    </SPage>
  );
};

export default StudentHomeworkView;
