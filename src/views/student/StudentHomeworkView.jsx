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
  AlertCircle,
  Eye,
  Edit3,
  X,
  Calendar,
  Send,
  Paperclip
} from 'lucide-react';
import {
  SPage,
  SPageHeader,
  STabs,
  SCard,
  SRowItem,
  SBadge,
  SStatusBadge,
  SButton,
  SEmptyState,
  SDivider,
  SIconBox,
  S
} from '../../components/student/ui';

export const StudentHomeworkView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();

  const [filterTab, setFilterTab] = useState('all');
  const [selectedHw, setSelectedHw] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationToast, setConfirmationToast] = useState(null);

  const filteredList = HOMEWORK_LIST.filter(hw => {
    if (filterTab === 'all') return true;
    return hw.status === filterTab;
  });

  const handleOpenHw = (hw) => {
    setSelectedHw(hw);
    setAnswerText(hw.submissionText || '');
    setUploadedFileName(hw.submittedFileUrl || '');
  };

  const handleSimulateFileUpload = (e) => {
    const file = e.target.files?.[0];
    setUploadedFileName(file ? file.name : 'homework-solution.pdf');
  };

  const handleSubmitHomework = (e) => {
    e.preventDefault();
    if (!answerText.trim() && !uploadedFileName) {
      alert(lang === 'ar' ? 'يرجى كتابة الحل أو إرفاق ملف' : 'Please write an answer or attach a file.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
      setConfirmationToast(selectedHw.titleAr);
      setSelectedHw(null);
      setTimeout(() => setConfirmationToast(null), 3500);
    }, 1400);
  };

  const tabs = [
    { id: 'all', label: lang === 'ar' ? 'الكل' : 'All', count: HOMEWORK_LIST.length },
    { id: 'pending', label: lang === 'ar' ? 'جديد' : 'New' },
    { id: 'submitted', label: lang === 'ar' ? 'تم التسليم' : 'Submitted' },
    { id: 'graded', label: lang === 'ar' ? 'مصحح' : 'Graded' },
  ];

  const statusColor = {
    pending: S.warning,
    submitted: S.primary,
    graded: S.success,
  };

  return (
    <SPage>
      {/* Toast */}
      {confirmationToast && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: S.success, color: '#fff',
          padding: '11px 20px', borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(20,184,122,0.3)',
          zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '13px', fontWeight: '600', fontFamily: 'var(--font-arabic)'
        }}>
          <CheckCircle2 size={16} />
          {lang === 'ar' ? 'تم تسليم الواجب بنجاح' : 'Homework submitted successfully'}
        </div>
      )}

      <SPageHeader
        title={lang === 'ar' ? 'الواجبات' : 'Assignments'}
        subtitle={lang === 'ar' ? 'مراجعة الواجبات المطلوبة وتسليم الحلول' : 'Review and submit your assignments'}
      />

      <STabs tabs={tabs} active={filterTab} onChange={setFilterTab} style={{ marginBottom: '20px' }} />

      {/* List */}
      {filteredList.length === 0 ? (
        <SEmptyState
          icon={<FileText size={22} />}
          title={lang === 'ar' ? 'لا توجد واجبات حاليًا' : 'No assignments found'}
        />
      ) : (
        <SCard padding={0} style={{ overflow: 'hidden' }}>
          {filteredList.map((hw, i) => (
            <div key={hw.id}>
              <div
                onClick={() => handleOpenHw(hw)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 16px', cursor: 'pointer'
                }}
                className="s-row-clickable"
              >
                <SIconBox
                  icon={<FileText size={16} />} size={36} radius={8}
                  color={statusColor[hw.status] || 'var(--text-secondary)'}
                  bg={hw.status === 'pending' ? S.warningLight : hw.status === 'graded' ? S.successLight : S.primaryLight}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-arabic)'
                  }}>
                    {hw.titleAr}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span>{hw.subjectAr}</span>
                    <span>·</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Calendar size={11} />
                      {hw.deadlineAr}
                    </span>
                  </div>
                </div>
                <SStatusBadge status={hw.status} />
                {hw.score !== undefined && hw.status === 'graded' && (
                  <SBadge variant="success" size="xs">{hw.score}/{hw.maxScore}</SBadge>
                )}
                <SButton size="sm" variant="ghost" onClick={e => { e.stopPropagation(); handleOpenHw(hw); }}>
                  {lang === 'ar' ? 'عرض' : 'View'}
                </SButton>
              </div>
              {i < filteredList.length - 1 && <SDivider />}
            </div>
          ))}
        </SCard>
      )}

      {/* Homework Detail Drawer/Modal */}
      {selectedHw && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)', zIndex: 9999,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)', borderRadius: '20px 20px 0 0',
            width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto',
            padding: '24px', border: '1px solid var(--border-subtle)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <SBadge variant="primary" size="xs">{selectedHw.subjectAr}</SBadge>
                <h2 style={{
                  fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)',
                  margin: '8px 0 4px', fontFamily: 'var(--font-arabic)'
                }}>
                  {selectedHw.titleAr}
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Calendar size={12} />
                  {lang === 'ar' ? 'الموعد النهائي:' : 'Due:'} {selectedHw.deadlineAr}
                </div>
              </div>
              <button onClick={() => setSelectedHw(null)} style={{
                width: '30px', height: '30px', borderRadius: '8px',
                border: 'none', backgroundColor: 'var(--bg-subtle)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)', flexShrink: 0
              }}>
                <X size={15} />
              </button>
            </div>

            <SDivider style={{ marginBottom: '16px' }} />

            {/* Instructions */}
            {selectedHw.instructionsAr && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', fontFamily: 'var(--font-arabic)' }}>
                  {lang === 'ar' ? 'تعليمات الواجب' : 'Instructions'}
                </div>
                <div style={{
                  fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.7,
                  padding: '12px 14px', backgroundColor: 'var(--bg-subtle)', borderRadius: '10px',
                  fontFamily: 'var(--font-arabic)'
                }}>
                  {selectedHw.instructionsAr}
                </div>
              </div>
            )}

            {/* Graded result */}
            {selectedHw.status === 'graded' && (
              <div style={{
                padding: '14px 16px', borderRadius: '10px',
                backgroundColor: S.successLight, border: `1px solid ${S.success}30`,
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: S.success, fontFamily: 'var(--font-arabic)' }}>
                    {lang === 'ar' ? 'نتيجة الواجب' : 'Result'}
                  </span>
                  <SBadge variant="success">{selectedHw.score}/{selectedHw.maxScore}</SBadge>
                </div>
                {selectedHw.teacherFeedbackAr && (
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.6, fontFamily: 'var(--font-arabic)' }}>
                    {selectedHw.teacherFeedbackAr}
                  </div>
                )}
              </div>
            )}

            {/* Solution form (pending / submitted states) */}
            {selectedHw.status !== 'graded' && (
              <form onSubmit={handleSubmitHomework}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'var(--font-arabic)' }}>
                  {lang === 'ar' ? 'الإجابة' : 'Your Answer'}
                </div>
                <textarea
                  value={answerText}
                  onChange={e => setAnswerText(e.target.value)}
                  placeholder={lang === 'ar' ? 'اكتب إجابتك هنا...' : 'Write your answer here...'}
                  rows={5}
                  style={{
                    width: '100%', padding: '12px 14px',
                    border: '1px solid var(--border-subtle)', borderRadius: '10px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px',
                    resize: 'vertical', outline: 'none',
                    fontFamily: 'var(--font-arabic)',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 14px', borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)',
                    fontFamily: 'var(--font-arabic)'
                  }}>
                    <Paperclip size={14} />
                    {uploadedFileName || (lang === 'ar' ? 'إرفاق ملف' : 'Attach file')}
                    <input type="file" style={{ display: 'none' }} onChange={handleSimulateFileUpload} />
                  </label>
                  <SButton type="submit" icon={<Send size={14} />} disabled={isSubmitting} style={{ marginInlineStart: 'auto' }}>
                    {isSubmitting ? (lang === 'ar' ? 'جارٍ التسليم...' : 'Submitting...') : (lang === 'ar' ? 'تسليم الواجب' : 'Submit')}
                  </SButton>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </SPage>
  );
};
