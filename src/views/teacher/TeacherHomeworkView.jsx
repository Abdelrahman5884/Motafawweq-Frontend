import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { teacherApi } from '../../services/teacherApi';
import {
  HomeworkListView,
  HomeworkDetailView,
  HomeworkGradingDesk,
  HomeworkFormModal,
  AttachmentPreviewModal,
  DeleteHomeworkModal,
  buildLocationOptions,
  createEmptyHomeworkForm,
  homeworkToForm,
} from '../../features/teacher/homework';

export const TeacherHomeworkView = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';

  const [homeworks, setHomeworks] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableLessons, setAvailableLessons] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Navigation: 'list' | 'detail' | 'grading'
  const [viewMode, setViewMode] = useState('list');
  const [selectedHwId, setSelectedHwId] = useState(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

  // Submissions for the active homework
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionsError, setSubmissionsError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [tableStatusFilter, setTableStatusFilter] = useState('all');

  // Grading Desk state
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [isSavingGrade, setIsSavingGrade] = useState(false);
  const [gradeError, setGradeError] = useState('');
  const [gradeSuccess, setGradeSuccess] = useState('');

  // Create / Edit Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [formState, setFormState] = useState(() => createEmptyHomeworkForm());
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formError, setFormError] = useState('');

  // Delete Modal & Attachment Preview Modal
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, title: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState(null);

  // Global Toast
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3600);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const [hwRes, coursesRes, lessonsRes, groupsRes] = await Promise.all([
        teacherApi.homeworks.list(),
        teacherApi.courses.list().catch(() => ({ data: [] })),
        teacherApi.studio.listLessons().catch(() => ({ data: [] })),
        teacherApi.groups.list().catch(() => ({ data: [] })),
      ]);
      const hwList = Array.isArray(hwRes?.data) ? hwRes.data : [];
      setHomeworks(hwList);
      setAvailableCourses(Array.isArray(coursesRes?.data) ? coursesRes.data : []);
      setAvailableLessons(Array.isArray(lessonsRes?.data) ? lessonsRes.data : []);
      setAvailableGroups(Array.isArray(groupsRes?.data) ? groupsRes.data : []);
    } catch (err) {
      setLoadError(
        err?.message || (isAr ? 'تعذر تحميل الواجبات. يرجى المحاولة مرة أخرى.' : 'Failed to load homework assignments.')
      );
    } finally {
      setIsLoading(false);
    }
  }, [isAr]);

  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        const [hwRes, coursesRes, lessonsRes, groupsRes] = await Promise.all([
          teacherApi.homeworks.list(),
          teacherApi.courses.list().catch(() => ({ data: [] })),
          teacherApi.studio.listLessons().catch(() => ({ data: [] })),
          teacherApi.groups.list().catch(() => ({ data: [] })),
        ]);
        if (!active) return;
        setHomeworks(Array.isArray(hwRes?.data) ? hwRes.data : []);
        setAvailableCourses(Array.isArray(coursesRes?.data) ? coursesRes.data : []);
        setAvailableLessons(Array.isArray(lessonsRes?.data) ? lessonsRes.data : []);
        setAvailableGroups(Array.isArray(groupsRes?.data) ? groupsRes.data : []);
      } catch (err) {
        if (active) {
          setLoadError(
            err?.message || (isAr ? 'تعذر تحميل الواجبات. يرجى المحاولة مرة أخرى.' : 'Failed to load homework assignments.')
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    init();
    return () => {
      active = false;
    };
  }, [isAr]);

  const fetchSubmissions = useCallback(
    async (hwId) => {
      if (!hwId) return;
      setLoadingSubmissions(true);
      setSubmissionsError('');
      try {
        const res = await teacherApi.homeworks.listSubmissions(hwId);
        const list = Array.isArray(res?.data) ? res.data : [];
        setSubmissions(list);
        if (res?.meta) {
          setHomeworks((prev) =>
            prev.map((hw) =>
              hw.id === hwId
                ? {
                    ...hw,
                    totalAssigned: res.meta.totalAssigned ?? hw.totalAssigned,
                    submittedCount: res.meta.submittedCount ?? hw.submittedCount,
                    gradedCount: res.meta.gradedCount ?? hw.gradedCount,
                    pendingGrading: res.meta.pendingGrading ?? hw.pendingGrading,
                    avgGrade: res.meta.avgGrade ?? hw.avgGrade,
                  }
                : hw
            )
          );
        }
      } catch (err) {
        setSubmissionsError(
          err?.message || (isAr ? 'تعذر تحميل تسليمات الطلاب.' : 'Failed to load student submissions.')
        );
      } finally {
        setLoadingSubmissions(false);
      }
    },
    [isAr]
  );

  const locationOptions = useMemo(() => buildLocationOptions(availableGroups, isAr), [availableGroups, isAr]);

  const selectedHw = useMemo(
    () => homeworks.find((h) => h.id === selectedHwId) || null,
    [homeworks, selectedHwId]
  );

  const activeSubmission = useMemo(
    () => submissions.find((s) => s.id === selectedSubmissionId) || submissions[0] || null,
    [submissions, selectedSubmissionId]
  );

  const handleOpenDetail = (hwId) => {
    setSelectedHwId(hwId);
    setViewMode('detail');
    setTableSearchQuery('');
    setTableStatusFilter('all');
    setSubmissions([]);
    fetchSubmissions(hwId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubmissionForGrading = (sub) => {
    if (!sub) return;
    setSelectedSubmissionId(sub.id);
    setGradeInput(sub.score !== null && sub.score !== undefined ? String(sub.score) : '');
    setFeedbackInput(sub.feedbackAr || '');
    setGradeError('');
    setGradeSuccess('');
  };

  const handleOpenGradingDesk = (subId) => {
    const target = submissions.find((s) => s.id === subId);
    if (target) {
      handleSelectSubmissionForGrading(target);
      setViewMode('grading');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenCreateModal = () => {
    setEditingHomework(null);
    setFormState(createEmptyHomeworkForm(availableCourses[0] || null));
    setSelectedFile(null);
    setFormError('');
    setUploadProgress(0);
    setShowFormModal(true);
  };

  const handleOpenEditModal = (hw) => {
    setEditingHomework(hw);
    setFormState(homeworkToForm(hw));
    setSelectedFile(null);
    setFormError('');
    setUploadProgress(0);
    setShowFormModal(true);
  };

  const handleSubmitHomeworkForm = async (e) => {
    e.preventDefault();
    setFormError('');

    const title = formState.title.trim();
    if (title.length < 3) {
      setFormError(isAr ? 'يرجى كتابة عنوان الواجب (3 أحرف على الأقل).' : 'Please enter a title (min 3 characters).');
      return;
    }

    const isEditing = Boolean(editingHomework);
    const keepsExistingFile =
      isEditing && Boolean(editingHomework?.attachmentUrl) && !formState.removeExistingAttachment;

    if (formState.type === 'file' && !selectedFile && !keepsExistingFile) {
      setFormError(
        isAr
          ? 'يرجى اختيار ملف (PDF أو صورة) لرفعه على الخادم، أو تحويل نوع الواجب إلى نصي.'
          : 'Please attach a PDF/image file or switch format to Text.'
      );
      return;
    }

    if (formState.type === 'text' && !formState.textContent.trim()) {
      setFormError(isAr ? 'يرجى كتابة نص وأسئلة الواجب.' : 'Please enter the homework questions.');
      return;
    }

    const selectedLoc = locationOptions.find((l) => l.id === formState.targetLocationId);
    const payload = {
      title_ar: title,
      course_id: formState.courseId || '',
      course_title_ar: formState.courseTitle || '',
      lesson_id: formState.lessonId || '',
      lesson_title_ar: formState.lessonTitle || '',
      target_location_id: formState.targetLocationId || 'all',
      target_location_ar: selectedLoc?.label || formState.targetLocationAr || '',
      type: formState.type,
      text_content: formState.textContent.trim(),
      due_date: formState.dueDate || '',
      due_time: formState.dueTime || '23:59',
      max_grade: Math.max(1, Number(formState.maxGrade) || 20),
    };

    if (isEditing && formState.removeExistingAttachment && !selectedFile) {
      payload.remove_attachment = true;
    }

    setIsSubmittingForm(true);
    setUploadProgress(selectedFile ? 5 : 0);

    try {
      let res;
      if (isEditing) {
        res = await teacherApi.homeworks.update(editingHomework.id, payload, selectedFile, {
          onProgress: (pct) => setUploadProgress(pct),
        });
      } else {
        res = await teacherApi.homeworks.create(payload, selectedFile, {
          onProgress: (pct) => setUploadProgress(pct),
        });
      }

      const savedHw = res?.data;
      if (!savedHw) {
        throw new Error(isAr ? 'تعذر حفظ الواجب على الخادم.' : 'Failed to save homework.');
      }

      if (isEditing) {
        setHomeworks((prev) => prev.map((h) => (h.id === savedHw.id ? savedHw : h)));
        showToast(isAr ? 'تم تحديث الواجب بنجاح.' : 'Homework updated successfully.');
      } else {
        setHomeworks((prev) => [savedHw, ...prev]);
        setSelectedHwId(savedHw.id);
        setSubmissions([]);
        setViewMode('detail');
        showToast(
          savedHw.attachmentDisk === 'supabase'
            ? isAr
              ? 'تم نشر الواجب ورفع الملف على الخادم السحابي بنجاح.'
              : 'Homework published and uploaded to cloud storage.'
            : isAr
              ? 'تم نشر الواجب للطلاب بنجاح.'
              : 'Homework published successfully.'
        );
      }

      setShowFormModal(false);
      setEditingHomework(null);
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (err) {
      setFormError(err?.message || (isAr ? 'فشل حفظ الواجب. تحقق من البيانات وحجم الملف.' : 'Failed to save homework.'));
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const applyGradedResult = (res) => {
    const updatedSub = res?.data;
    if (!updatedSub || !selectedHw) return;

    setSubmissions((prev) => prev.map((s) => (s.id === updatedSub.id ? updatedSub : s)));

    if (res?.meta) {
      setHomeworks((prev) =>
        prev.map((hw) =>
          hw.id === selectedHw.id
            ? {
                ...hw,
                submittedCount: res.meta.submittedCount ?? hw.submittedCount,
                gradedCount: res.meta.gradedCount ?? hw.gradedCount,
                pendingGrading: res.meta.pendingGrading ?? hw.pendingGrading,
                avgGrade: res.meta.avgGrade ?? hw.avgGrade,
              }
            : hw
        )
      );
    }
  };

  const handleSaveGrading = async (e) => {
    if (e) e.preventDefault();
    if (!activeSubmission || !selectedHw || isSavingGrade) return;

    const maxGrade = Number(selectedHw.maxGrade || 20);
    const parsed = Number(gradeInput);
    if (gradeInput === '' || Number.isNaN(parsed) || parsed < 0 || parsed > maxGrade) {
      setGradeError(
        isAr
          ? `يرجى إدخال درجة صالحة بين 0 و ${maxGrade}.`
          : `Please enter a valid score between 0 and ${maxGrade}.`
      );
      return;
    }

    setIsSavingGrade(true);
    setGradeError('');
    setGradeSuccess('');

    try {
      const res = await teacherApi.homeworks.gradeSubmission(selectedHw.id, activeSubmission.id, {
        status: 'graded',
        score: parsed,
        feedbackAr: feedbackInput.trim(),
      });

      applyGradedResult(res);
      setGradeSuccess(
        isAr
          ? 'تم اعتماد الدرجة وإرسال التغذية الراجعة لحساب الطالب بنجاح.'
          : 'Grade approved and sent to the student.'
      );
    } catch (err) {
      setGradeError(err?.message || (isAr ? 'تعذر حفظ الدرجة. يرجى المحاولة مرة أخرى.' : 'Failed to save grade.'));
    } finally {
      setIsSavingGrade(false);
    }
  };

  const handleRejectSubmission = async () => {
    if (!activeSubmission || !selectedHw || isSavingGrade) return;

    const rejectFeedback =
      feedbackInput.trim() ||
      (isAr
        ? 'تم رفض الواجب لعدم استيفاء الشروط أو نقص الحل. يرجى مراجعة الملاحظات وإعادة التسليم.'
        : 'Submission rejected due to incomplete work. Please review and resubmit.');

    setIsSavingGrade(true);
    setGradeError('');
    setGradeSuccess('');

    try {
      const res = await teacherApi.homeworks.gradeSubmission(selectedHw.id, activeSubmission.id, {
        status: 'rejected',
        score: 0,
        feedbackAr: rejectFeedback,
      });

      applyGradedResult(res);
      setGradeInput('0');
      setFeedbackInput(rejectFeedback);
      setGradeSuccess(
        isAr
          ? 'تم رفض التسليم وإخطار الطالب بإمكانية إعادة رفع الحل.'
          : 'Submission rejected; student can resubmit.'
      );
    } catch (err) {
      setGradeError(err?.message || (isAr ? 'تعذر رفض التسليم. يرجى المحاولة مرة أخرى.' : 'Failed to reject submission.'));
    } finally {
      setIsSavingGrade(false);
    }
  };

  const promptDeleteHomework = (id, title, e) => {
    if (e) e.stopPropagation();
    setDeleteError('');
    setDeleteDialog({ isOpen: true, id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id || isDeleting) return;
    setIsDeleting(true);
    setDeleteError('');

    try {
      await teacherApi.homeworks.delete(deleteDialog.id);
      setHomeworks((prev) => prev.filter((h) => h.id !== deleteDialog.id));
      if (selectedHwId === deleteDialog.id) {
        setSelectedHwId(null);
        setSubmissions([]);
        setViewMode('list');
      }
      setDeleteDialog({ isOpen: false, id: null, title: '' });
      showToast(isAr ? 'تم حذف الواجب بنجاح.' : 'Homework deleted successfully.');
    } catch (err) {
      setDeleteError(err?.message || (isAr ? 'تعذر حذف الواجب. يرجى المحاولة مرة أخرى.' : 'Failed to delete homework.'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="hw-container"
      style={{
        maxWidth: '1240px',
        margin: '0 auto',
        fontFamily: 'var(--font-arabic)',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .hw-container { padding: 28px 24px 100px; }
        @keyframes hwSpin { to { transform: rotate(360deg); } }
        .hw-spin { animation: hwSpin 0.8s linear infinite; }
        @media (max-width: 768px) {
          .hw-container { padding: 16px 12px 100px !important; }
          .hw-header-row { flex-direction: column !important; align-items: stretch !important; gap: 14px !important; }
          .hw-header-btn { width: 100% !important; justify-content: center !important; }
          .hw-view1-search-box, .hw-filter-search-box { max-width: 100% !important; width: 100% !important; }
          .hw-controls-row { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; padding: 12px !important; }
          .hw-filter-tabs-wrap { width: 100% !important; overflow-x: auto !important; white-space: nowrap !important; }
          .hw-submissions-table-wrap { display: none !important; }
          .hw-submissions-mobile-cards { display: flex !important; flex-direction: column !important; gap: 12px !important; width: 100% !important; }
        }
        @media (min-width: 769px) {
          .hw-submissions-table-wrap { display: block !important; }
          .hw-submissions-mobile-cards { display: none !important; }
        }
        .hw-grading-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.95fr);
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 991px) {
          .hw-grading-grid { display: flex !important; flex-direction: column !important; gap: 16px !important; width: 100% !important; }
          .hw-grading-grid > div { width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
        }
      `}</style>

      {/* Inline Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: isRtl ? '24px' : 'auto',
            right: isRtl ? 'auto' : '24px',
            zIndex: 9999,
            backgroundColor: toast.type === 'error' ? '#EF4444' : '#059669',
            color: '#FFFFFF',
            padding: '11px 16px',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '800',
          }}
        >
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {viewMode === 'list' && (
        <HomeworkListView
          homeworks={homeworks}
          availableCourses={availableCourses}
          isLoading={isLoading}
          loadError={loadError}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterCourse={filterCourse}
          onFilterCourseChange={setFilterCourse}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          isAr={isAr}
          isDark={isDark}
          onRetry={loadInitialData}
          onOpenCreate={handleOpenCreateModal}
          onOpenEdit={handleOpenEditModal}
          onOpenDetail={handleOpenDetail}
          onPromptDelete={promptDeleteHomework}
        />
      )}

      {viewMode === 'detail' && selectedHw && (
        <HomeworkDetailView
          homework={selectedHw}
          submissions={submissions}
          loadingSubmissions={loadingSubmissions}
          submissionsError={submissionsError}
          searchQuery={tableSearchQuery}
          onSearchChange={setTableSearchQuery}
          statusFilter={tableStatusFilter}
          onStatusFilterChange={setTableStatusFilter}
          isAr={isAr}
          isRtl={isRtl}
          isDark={isDark}
          onBack={() => setViewMode('list')}
          onRefreshSubmissions={() => fetchSubmissions(selectedHw.id)}
          onOpenEdit={handleOpenEditModal}
          onPromptDelete={promptDeleteHomework}
          onPreviewAttachment={setPreviewAttachment}
          onOpenGradingDesk={handleOpenGradingDesk}
        />
      )}

      {viewMode === 'grading' && selectedHw && activeSubmission && (
        <HomeworkGradingDesk
          homework={selectedHw}
          submissions={submissions}
          activeSubmission={activeSubmission}
          gradeInput={gradeInput}
          onGradeInputChange={setGradeInput}
          feedbackInput={feedbackInput}
          onFeedbackInputChange={setFeedbackInput}
          isSavingGrade={isSavingGrade}
          gradeError={gradeError}
          gradeSuccess={gradeSuccess}
          isAr={isAr}
          isRtl={isRtl}
          isDark={isDark}
          onBack={() => setViewMode('detail')}
          onSelectSubmission={handleSelectSubmissionForGrading}
          onSaveGrading={handleSaveGrading}
          onRejectSubmission={handleRejectSubmission}
          onPreviewAttachment={setPreviewAttachment}
        />
      )}

      <HomeworkFormModal
        isOpen={showFormModal}
        editingHomework={editingHomework}
        form={formState}
        onFormChange={(patch) => setFormState((prev) => ({ ...prev, ...patch }))}
        availableCourses={availableCourses}
        availableLessons={availableLessons}
        locationOptions={locationOptions}
        selectedFile={selectedFile}
        onSelectFile={setSelectedFile}
        onClearSelectedFile={() => setSelectedFile(null)}
        isSubmitting={isSubmittingForm}
        uploadProgress={uploadProgress}
        submitError={formError}
        onClearError={() => setFormError('')}
        isAr={isAr}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleSubmitHomeworkForm}
        onPreviewAttachment={setPreviewAttachment}
      />

      <DeleteHomeworkModal
        isOpen={deleteDialog.isOpen}
        title={deleteDialog.title}
        isDeleting={isDeleting}
        error={deleteError}
        isAr={isAr}
        isDark={isDark}
        onCancel={() => setDeleteDialog({ isOpen: false, id: null, title: '' })}
        onConfirm={handleConfirmDelete}
      />

      <AttachmentPreviewModal
        attachment={previewAttachment}
        isAr={isAr}
        onClose={() => setPreviewAttachment(null)}
      />
    </div>
  );
};

export default TeacherHomeworkView;
