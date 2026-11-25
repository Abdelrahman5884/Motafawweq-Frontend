import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowRight,
  Unlock,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Printer,
  ClipboardList,
  FileCheck,
  Check,
  Edit3,
  X,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { teacherApi } from '../../services/teacherApi';
import {
  ExamsListView,
  ExamQuestionsTab,
  ExamSubmissionsTab,
  SubmissionGradingModal,
  ExamCreateWizard,
  ExamPrintModal,
  PrintableExamSheet,
  DeleteExamModal,
  createBlankQuestion,
  serializeQuestionsForApi,
} from '../../features/teacher/exams';

export const TeacherExamsView = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'detail' | 'create'
  const [detailTab, setDetailTab] = useState('questions'); // 'questions' | 'submissions'
  const [exams, setExams] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // List filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Feedback banner
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: string }
  const [busyExamId, setBusyExamId] = useState(null);
  const [isSavingQuestions, setIsSavingQuestions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Exam Settings Inline Editor
  const [editingSettings, setEditingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    titleAr: '',
    durationMinutes: '45',
    passScore: '0',
    dueDate: '',
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Grading modal & refresh trigger
  const [gradingSubmissionId, setGradingSubmissionId] = useState(null);
  const [submissionsRefreshKey, setSubmissionsRefreshKey] = useState(0);

  // Print modal
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printMode, setPrintMode] = useState('student');

  // Delete modal
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, type: null, id: null, title: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const showToast = useCallback((type, text) => {
    setFeedback({ type, text });
  }, []);

  useEffect(() => {
    if (!feedback) return undefined;
    const t = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(t);
  }, [feedback]);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const [examsRes, coursesRes] = await Promise.all([
        teacherApi.exams.list(),
        teacherApi.courses.list().catch(() => ({ data: [] })),
      ]);
      const examList = Array.isArray(examsRes?.data) ? examsRes.data : [];
      setExams(examList);
      setSelectedExamId((prev) => (prev && examList.some((e) => e.id === prev) ? prev : (examList[0]?.id || null)));
      setAvailableCourses(Array.isArray(coursesRes?.data) ? coursesRes.data : []);
    } catch (err) {
      setLoadError(err?.message || (isAr ? 'تعذر تحميل الاختبارات حالياً.' : 'Failed to load exams.'));
    } finally {
      setIsLoading(false);
    }
  }, [isAr]);

  useEffect(() => {
    let active = true;
    const loadInitial = async () => {
      try {
        const [examsRes, coursesRes] = await Promise.all([
          teacherApi.exams.list(),
          teacherApi.courses.list().catch(() => ({ data: [] })),
        ]);
        if (!active) return;
        const examList = Array.isArray(examsRes?.data) ? examsRes.data : [];
        setExams(examList);
        if (examList.length > 0) setSelectedExamId(examList[0].id);
        setAvailableCourses(Array.isArray(coursesRes?.data) ? coursesRes.data : []);
      } catch (err) {
        if (active) {
          setLoadError(err?.message || (isAr ? 'تعذر تحميل الاختبارات حالياً.' : 'Failed to load exams.'));
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    loadInitial();
    return () => { active = false; };
  }, [isAr]);

  const selectedExam = useMemo(
    () => exams.find((e) => e.id === selectedExamId) || null,
    [exams, selectedExamId]
  );

  useSetBreadcrumbs(
    viewMode === 'detail' && selectedExam
      ? [{
          labelAr: selectedExam.titleAr,
          labelEn: selectedExam.titleEn || selectedExam.titleAr,
          onClick: () => setViewMode('list'),
        }]
      : viewMode === 'create'
        ? [{
            labelAr: 'إنشاء امتحان جديد',
            labelEn: 'Create New Exam',
            onClick: () => setViewMode('list'),
          }]
        : []
  );

  const filteredExams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return exams.filter((exam) => {
      if (statusFilter === 'pending_grading') {
        if (Number(exam.pendingGradingCount || 0) <= 0) return false;
      } else if (statusFilter !== 'all' && exam.status !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        (exam.titleAr || '').toLowerCase().includes(q) ||
        (exam.titleEn || '').toLowerCase().includes(q) ||
        (exam.courseTitleAr || '').toLowerCase().includes(q)
      );
    });
  }, [exams, searchQuery, statusFilter]);

  const refreshSingleExam = useCallback(async (examId) => {
    if (!examId) return;
    try {
      const res = await teacherApi.exams.get(examId);
      if (res?.data) {
        setExams((prev) => prev.map((ex) => (ex.id === examId ? { ...ex, ...res.data } : ex)));
      }
    } catch {
      // keep existing state cleanly
    }
  }, []);

  const handleOpenExam = useCallback((examId, initialTab = 'questions') => {
    setSelectedExamId(examId);
    setDetailTab(initialTab);
    setEditingSettings(false);
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    refreshSingleExam(examId);
  }, [refreshSingleExam]);

  const handleToggleStatus = async (examId) => {
    setBusyExamId(examId);
    try {
      const res = await teacherApi.exams.toggleStatus(examId);
      if (res?.data) {
        setExams((prev) => prev.map((ex) => (ex.id === examId ? { ...ex, ...res.data } : ex)));
        showToast(
          'success',
          res.data.status === 'active'
            ? (isAr ? 'تم فتح الاختبار وأصبح متاحاً للطلاب.' : 'Exam is now open for students.')
            : (isAr ? 'تم إغلاق الاختبار أمام الطلاب.' : 'Exam has been closed.')
        );
      }
    } catch (err) {
      showToast('error', err?.message || (isAr ? 'تعذر تغيير حالة الاختبار.' : 'Failed to toggle exam status.'));
    } finally {
      setBusyExamId(null);
    }
  };

  const handleToggleResults = async (examId) => {
    setBusyExamId(examId);
    try {
      const res = await teacherApi.exams.toggleResults(examId);
      if (res?.data) {
        setExams((prev) => prev.map((ex) => (ex.id === examId ? { ...ex, ...res.data } : ex)));
        showToast(
          'success',
          res.data.showResults
            ? (isAr ? 'تم إعلان النتائج للطلاب.' : 'Results are now visible to students.')
            : (isAr ? 'تم حجب النتائج عن الطلاب مؤقتاً.' : 'Results are now hidden from students.')
        );
      }
    } catch (err) {
      showToast('error', err?.message || (isAr ? 'تعذر تحديث إظهار النتيجة.' : 'Failed to toggle results visibility.'));
    } finally {
      setBusyExamId(null);
    }
  };

  const handleDuplicateExam = async (examId) => {
    setBusyExamId(examId);
    try {
      const res = await teacherApi.exams.duplicate(examId);
      if (res?.data) {
        setExams((prev) => [res.data, ...prev]);
        showToast('success', isAr ? 'تم نسخ الامتحان مع كافة الأسئلة بنجاح!' : 'Exam duplicated successfully!');
      }
    } catch (err) {
      showToast('error', err?.message || (isAr ? 'فشل نسخ الامتحان.' : 'Failed to duplicate exam.'));
    } finally {
      setBusyExamId(null);
    }
  };

  const handleCreateExam = async (payload) => {
    setIsCreating(true);
    setCreateError('');
    try {
      const res = await teacherApi.exams.create(payload);
      if (res?.data) {
        setExams((prev) => [res.data, ...prev]);
        setSelectedExamId(res.data.id);
        setDetailTab('questions');
        setViewMode('detail');
        showToast('success', isAr ? 'تم إنشاء الاختبار ونشره بنجاح!' : 'Exam created and published!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setCreateError(err?.message || (isAr ? 'فشل إنشاء الاختبار على الخادم.' : 'Failed to create exam.'));
    } finally {
      setIsCreating(false);
    }
  };

  const syncQuestions = async (examId, updatedQuestions, successMsg) => {
    setIsSavingQuestions(true);
    try {
      const res = await teacherApi.exams.update(examId, {
        questions: serializeQuestionsForApi(updatedQuestions),
      });
      if (res?.data) {
        setExams((prev) => prev.map((ex) => (ex.id === examId ? { ...ex, ...res.data } : ex)));
        showToast('success', successMsg || (isAr ? 'تم حفظ الأسئلة بنجاح.' : 'Questions saved successfully.'));
        return true;
      }
      return false;
    } catch (err) {
      showToast('error', err?.message || (isAr ? 'فشل حفظ تعديلات الأسئلة.' : 'Failed to save question changes.'));
      return false;
    } finally {
      setIsSavingQuestions(false);
    }
  };

  const handleAddQuestion = (type) => {
    if (!selectedExam?.id) return;
    const current = selectedExam.questions || [];
    const defaultPts = current.length > 0 ? Math.max(1, Math.round((selectedExam.fullMark || 15) / current.length)) : 5;
    const newQ = createBlankQuestion(type, current.length + 1, defaultPts);
    newQ.questionAr = type === 'mcq'
      ? `سؤال اختيار من متعدد جديد رقم (${current.length + 1})`
      : type === 'true_false'
        ? `عبارة صح وخطأ جديدة رقم (${current.length + 1})`
        : `سؤال مقالي جديد رقم (${current.length + 1})`;
    if (type === 'mcq') {
      newQ.optionsAr = ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع'];
    }
    syncQuestions(selectedExam.id, [...current, newQ], isAr ? 'تمت إضافة السؤال بنجاح.' : 'Question added.');
  };

  const handleSaveQuestion = (qId, patch) => {
    if (!selectedExam?.id) return;
    const updated = (selectedExam.questions || []).map((q) => (q.id === qId ? { ...q, ...patch } : q));
    syncQuestions(selectedExam.id, updated, isAr ? 'تم حفظ تعديلات السؤال.' : 'Question updated.');
  };

  const handleUpdateQuestionPoints = (qId, points) => {
    if (!selectedExam?.id) return;
    const updated = (selectedExam.questions || []).map((q) => (q.id === qId ? { ...q, points } : q));
    syncQuestions(selectedExam.id, updated, isAr ? 'تم تحديث درجة السؤال وإجمالي الدرجات.' : 'Points updated.');
  };

  const handleOpenSettingsEdit = () => {
    if (!selectedExam) return;
    setSettingsForm({
      titleAr: selectedExam.titleAr || '',
      durationMinutes: String(selectedExam.durationMinutes || 45),
      passScore: String(selectedExam.passScore ?? 0),
      dueDate: selectedExam.dueDate || '',
    });
    setEditingSettings(true);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!selectedExam?.id || settingsForm.titleAr.trim().length < 3 || isSavingSettings) return;
    setIsSavingSettings(true);
    try {
      const maxMark = Number(selectedExam.fullMark) || 1000;
      const res = await teacherApi.exams.update(selectedExam.id, {
        title_ar: settingsForm.titleAr.trim(),
        title_en: settingsForm.titleAr.trim(),
        duration_minutes: Math.max(5, Number(settingsForm.durationMinutes) || 45),
        pass_score: Math.max(0, Math.min(maxMark, Number(settingsForm.passScore) || 0)),
        due_date: settingsForm.dueDate || null,
      });
      if (res?.data) {
        setExams((prev) => prev.map((ex) => (ex.id === selectedExam.id ? { ...ex, ...res.data } : ex)));
        setEditingSettings(false);
        showToast('success', isAr ? 'تم تحديث إعدادات الامتحان بنجاح.' : 'Exam settings updated.');
      }
    } catch (err) {
      showToast('error', err?.message || (isAr ? 'تعذر تحديث إعدادات الامتحان.' : 'Failed to update exam settings.'));
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.isOpen || isDeleting) return;
    setIsDeleting(true);
    setDeleteError('');

    try {
      if (deleteDialog.type === 'exam') {
        await teacherApi.exams.delete(deleteDialog.id);
        const remaining = exams.filter((x) => x.id !== deleteDialog.id);
        setExams(remaining);
        if (selectedExamId === deleteDialog.id) {
          setSelectedExamId(remaining[0]?.id || null);
          setViewMode('list');
        }
        setDeleteDialog({ isOpen: false, type: null, id: null, title: '' });
        showToast('success', isAr ? 'تم حذف الاختبار بنجاح.' : 'Exam deleted.');
      } else if (deleteDialog.type === 'question' && selectedExam?.id) {
        const current = selectedExam.questions || [];
        if (current.length <= 1) {
          setDeleteError(isAr ? 'يجب أن يحتوي الاختبار على سؤال واحد على الأقل.' : 'Exam must keep at least one question.');
          return;
        }
        const remaining = current
          .filter((q) => q.id !== deleteDialog.id)
          .map((q, idx) => ({ ...q, number: idx + 1 }));

        const res = await teacherApi.exams.update(selectedExam.id, {
          questions: serializeQuestionsForApi(remaining),
        });
        if (res?.data) {
          setExams((prev) => prev.map((ex) => (ex.id === selectedExam.id ? { ...ex, ...res.data } : ex)));
          setDeleteDialog({ isOpen: false, type: null, id: null, title: '' });
          showToast('success', isAr ? 'تم حذف السؤال وتحديث الدرجات.' : 'Question deleted.');
        }
      }
    } catch (err) {
      setDeleteError(err?.message || (isAr ? 'تعذر إتمام عملية الحذف.' : 'Delete operation failed.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmissionGraded = () => {
    setSubmissionsRefreshKey((k) => k + 1);
    if (selectedExam?.id) {
      refreshSingleExam(selectedExam.id);
    }
    showToast('success', isAr ? 'تم اعتماد الدرجة النهائية وحفظ التصحيح بنجاح!' : 'Grade approved and finalized successfully!');
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '24px 20px 120px',
        fontFamily: 'var(--font-arabic)',
        boxSizing: 'border-box',
      }}
    >
      {/* Print-specific CSS styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #exam-printable-student-sheet,
          #exam-printable-student-sheet * { visibility: visible !important; }
          #exam-printable-student-sheet {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 10mm 14mm !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .screen-only-modal, .no-print, nav, aside, header, footer, button { display: none !important; }
          .print-break-inside-avoid { page-break-inside: avoid !important; break-inside: avoid !important; }
          @page { size: A4 portrait; margin: 10mm; }
        }
        @media screen {
          .print-only-container { display: none !important; }
        }
      `}</style>

      {/* Inline Toast Feedback Banner */}
      {feedback && (
        <div
          role="status"
          style={{
            marginBottom: '16px',
            padding: '11px 16px',
            borderRadius: '10px',
            backgroundColor: feedback.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            border: `1px solid ${feedback.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            color: feedback.type === 'error' ? '#EF4444' : 'var(--success)',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {feedback.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* VIEW 1: MAIN EXAMS LIST */}
      {viewMode === 'list' && (
        <ExamsListView
          exams={exams}
          filteredExams={filteredExams}
          isLoading={isLoading}
          loadError={loadError}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          isAr={isAr}
          isDark={isDark}
          busyExamId={busyExamId}
          onRetry={fetchAll}
          onCreateNew={() => {
            setCreateError('');
            setViewMode('create');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenExam={(id) => handleOpenExam(id, 'questions')}
          onOpenSubmissions={(id) => handleOpenExam(id, 'submissions')}
          onToggleStatus={handleToggleStatus}
          onToggleResults={handleToggleResults}
          onDuplicate={handleDuplicateExam}
          onPromptDelete={(exam) => {
            setDeleteError('');
            setDeleteDialog({ isOpen: true, type: 'exam', id: exam.id, title: exam.titleAr });
          }}
        />
      )}

      {/* VIEW 2: EXAM DETAIL WORKSPACE (QUESTIONS TAB + STUDENT SUBMISSIONS & GRADING TAB) */}
      {viewMode === 'detail' && selectedExam && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '7px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <ArrowRight size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
                <span>{isAr ? 'الرجوع للاختبارات' : 'Back'}</span>
              </button>
              <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-subtle)', padding: '4px 9px', borderRadius: '6px' }}>
                {selectedExam.courseTitleAr}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
              <button
                type="button"
                disabled={busyExamId === selectedExam.id}
                onClick={() => handleToggleStatus(selectedExam.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '7px',
                  border: `1px solid ${selectedExam.status === 'active' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: selectedExam.status === 'active' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                  color: selectedExam.status === 'active' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {selectedExam.status === 'active' ? <Unlock size={12} /> : <Lock size={12} />}
                <span>{selectedExam.status === 'active' ? (isAr ? 'متاح للطلاب' : 'Open') : (isAr ? 'مغلق' : 'Closed')}</span>
              </button>

              <button
                type="button"
                disabled={busyExamId === selectedExam.id}
                onClick={() => handleToggleResults(selectedExam.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '7px',
                  border: `1px solid ${selectedExam.showResults !== false ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  backgroundColor: selectedExam.showResults !== false
                    ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5')
                    : (isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB'),
                  color: selectedExam.showResults !== false ? 'var(--success)' : '#D97706',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {selectedExam.showResults !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                <span>{selectedExam.showResults !== false ? (isAr ? 'النتيجة: معلنة' : 'Results: On') : (isAr ? 'النتيجة: محجوبة' : 'Results: Off')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '7px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <Printer size={13} color="var(--primary)" />
                <span>{isAr ? 'طباعة PDF' : 'Print PDF'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeleteError('');
                  setDeleteDialog({ isOpen: true, type: 'exam', id: selectedExam.id, title: selectedExam.titleAr });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 11px',
                  borderRadius: '7px',
                  backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#EF4444',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={12} />
                <span>{isAr ? 'حذف' : 'Delete'}</span>
              </button>
            </div>
          </div>

          {/* Exam Specs & Inline Settings Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 18px',
            boxShadow: 'var(--shadow-xs)',
          }}>
            {editingSettings ? (
              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      {isAr ? 'عنوان الامتحان:' : 'Exam Title:'}
                    </label>
                    <input
                      type="text"
                      required
                      minLength={3}
                      value={settingsForm.titleAr}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, titleAr: e.target.value }))}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      {isAr ? 'المدة (دقيقة):' : 'Duration (min):'}
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="360"
                      value={settingsForm.durationMinutes}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, durationMinutes: e.target.value }))}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      {isAr ? `درجة النجاح (من ${selectedExam.fullMark}):` : `Pass Score (max ${selectedExam.fullMark}):`}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={selectedExam.fullMark || 1000}
                      value={settingsForm.passScore}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, passScore: e.target.value }))}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      {isAr ? 'آخر موعد للتسليم:' : 'Due Date:'}
                    </label>
                    <input
                      type="date"
                      value={settingsForm.dueDate}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, dueDate: e.target.value }))}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={isSavingSettings}
                    onClick={() => setEditingSettings(false)}
                    style={{ padding: '7px 14px', borderRadius: '7px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 16px', borderRadius: '7px', border: 'none', backgroundColor: 'var(--primary)', color: '#FFFFFF', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                  >
                    <Check size={13} />
                    <span>{isSavingSettings ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ الإعدادات' : 'Save Settings')}</span>
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <h2 style={{ fontSize: '17.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                    {isAr ? selectedExam.titleAr : (selectedExam.titleEn || selectedExam.titleAr)}
                  </h2>

                  <button
                    type="button"
                    onClick={handleOpenSettingsEdit}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 11px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    <Edit3 size={12} color="var(--primary)" />
                    <span>{isAr ? 'تعديل إعدادات الامتحان' : 'Edit Settings'}</span>
                  </button>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '14px',
                  flexWrap: 'wrap',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '10px',
                  alignItems: 'center',
                }}>
                  <span>{isAr ? 'الأسئلة:' : 'Questions:'} <strong style={{ color: 'var(--text-primary)' }}>{(selectedExam.questions || []).length}</strong></span>
                  <span>{isAr ? 'المدة:' : 'Duration:'} <strong style={{ color: 'var(--text-primary)' }}>{selectedExam.durationMinutes} {isAr ? 'دقيقة' : 'min'}</strong></span>
                  <span>{isAr ? 'الدرجة الكلية:' : 'Full Mark:'} <strong style={{ color: 'var(--primary)' }}>{selectedExam.fullMark} {isAr ? 'درجة' : 'pts'}</strong></span>
                  <span>{isAr ? 'درجة النجاح:' : 'Pass Score:'} <strong style={{ color: 'var(--success)' }}>{selectedExam.passScore} {isAr ? 'درجة' : 'pts'}</strong></span>
                  {selectedExam.dueDate && (
                    <span>{isAr ? 'آخر موعد:' : 'Due:'} <strong style={{ color: 'var(--text-primary)' }}>{selectedExam.dueDate}</strong></span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* 2-Tab Navigation: Questions vs Student Submissions & Grading */}
          <div style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '10px',
            flexWrap: 'wrap',
          }}>
            <button
              type="button"
              onClick={() => setDetailTab('questions')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 16px',
                borderRadius: '8px',
                border: `1.5px solid ${detailTab === 'questions' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                backgroundColor: detailTab === 'questions' ? 'rgba(0, 102, 204, 0.1)' : 'var(--bg-surface-elevated)',
                color: detailTab === 'questions' ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <ClipboardList size={15} />
              <span>{isAr ? 'الأسئلة ونموذج الإجابة' : 'Questions & Answer Key'}</span>
              <span style={{
                fontSize: '11px',
                padding: '1px 7px',
                borderRadius: '999px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
              }}>
                {(selectedExam.questions || []).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setDetailTab('submissions')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 16px',
                borderRadius: '8px',
                border: `1.5px solid ${detailTab === 'submissions' ? 'var(--primary)' : Number(selectedExam.pendingGradingCount || 0) > 0 ? 'rgba(245, 158, 11, 0.45)' : 'var(--border-subtle)'}`,
                backgroundColor: detailTab === 'submissions' ? 'rgba(0, 102, 204, 0.1)' : 'var(--bg-surface-elevated)',
                color: detailTab === 'submissions' ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <FileCheck size={15} />
              <span>{isAr ? 'إجابات الطلاب والتصحيح' : 'Student Submissions & Grading'}</span>
              <span style={{
                fontSize: '11px',
                padding: '1px 7px',
                borderRadius: '999px',
                backgroundColor: Number(selectedExam.pendingGradingCount || 0) > 0 ? 'rgba(245, 158, 11, 0.18)' : 'var(--bg-subtle)',
                color: Number(selectedExam.pendingGradingCount || 0) > 0 ? '#D97706' : 'var(--text-primary)',
                fontWeight: '900',
              }}>
                {Number(selectedExam.pendingGradingCount || 0) > 0
                  ? (isAr ? `${selectedExam.pendingGradingCount} للتصحيح` : `${selectedExam.pendingGradingCount} pending`)
                  : Number(selectedExam.submissionsCount || 0)}
              </span>
            </button>
          </div>

          {/* Active Detail Tab Content */}
          {detailTab === 'questions' ? (
            <ExamQuestionsTab
              exam={selectedExam}
              isAr={isAr}
              isDark={isDark}
              isSaving={isSavingQuestions}
              onAddQuestion={handleAddQuestion}
              onSaveQuestion={handleSaveQuestion}
              onUpdatePoints={handleUpdateQuestionPoints}
              onPromptDeleteQuestion={(q) => {
                setDeleteError('');
                setDeleteDialog({
                  isOpen: true,
                  type: 'question',
                  id: q.id,
                  title: isAr ? `السؤال رقم (${q.number})` : `Question #${q.number}`,
                });
              }}
            />
          ) : (
            <ExamSubmissionsTab
              exam={selectedExam}
              isAr={isAr}
              isDark={isDark}
              refreshKey={submissionsRefreshKey}
              onOpenGradeModal={(submissionId) => setGradingSubmissionId(submissionId)}
            />
          )}
        </div>
      )}

      {/* VIEW 3: CREATE EXAM WIZARD */}
      {viewMode === 'create' && (
        <ExamCreateWizard
          courses={availableCourses}
          isAr={isAr}
          isRtl={isRtl}
          isSubmitting={isCreating}
          error={createError}
          onCancel={() => setViewMode('list')}
          onSubmit={handleCreateExam}
        />
      )}

      {/* STUDENT SUBMISSION REVIEW & ESSAY GRADING MODAL */}
      {gradingSubmissionId && selectedExam && (
        <SubmissionGradingModal
          examId={selectedExam.id}
          examPassScore={selectedExam.passScore}
          submissionId={gradingSubmissionId}
          isAr={isAr}
          isDark={isDark}
          onClose={() => setGradingSubmissionId(null)}
          onGraded={handleSubmissionGraded}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteExamModal
        dialog={deleteDialog}
        isAr={isAr}
        isDark={isDark}
        isDeleting={isDeleting}
        error={deleteError}
        onCancel={() => !isDeleting && setDeleteDialog({ isOpen: false, type: null, id: null, title: '' })}
        onConfirm={handleConfirmDelete}
      />

      {/* PRINT EXAM PAPER MODAL */}
      {showPrintModal && selectedExam && (
        <ExamPrintModal
          exam={selectedExam}
          printMode={printMode}
          setPrintMode={setPrintMode}
          isAr={isAr}
          isDark={isDark}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {/* PRINT-ONLY DOM SHEET */}
      <div id="exam-printable-student-sheet" className="print-only-container">
        <PrintableExamSheet exam={selectedExam} mode={printMode} />
      </div>
    </div>
  );
};

export default TeacherExamsView;
