import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { studentApi } from '../../../services/studentApi';

const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB (matches SubmitHomeworkRequest)
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
]);
const ALLOWED_EXTENSIONS = new Set(['pdf', 'png', 'jpg', 'jpeg', 'webp']);

export function formatFileSize(bytes, lang = 'ar') {
  const num = Number(bytes || 0);
  if (!Number.isFinite(num) || num <= 0) return '';
  if (num < 1024) return `${num} B`;
  const kb = num / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(kb >= 100 ? 0 : 1)} ${lang === 'ar' ? 'ك.ب' : 'KB'}`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(mb >= 10 ? 1 : 2)} ${lang === 'ar' ? 'م.ب' : 'MB'}`;
}

export function formatHomeworkDate(isoOrDate, lang = 'ar') {
  if (!isoOrDate) return '';
  try {
    const dt = new Date(isoOrDate);
    if (Number.isNaN(dt.getTime())) return String(isoOrDate);
    return dt.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(isoOrDate);
  }
}

function normalizeStatus(submissionStatus) {
  if (submissionStatus === 'graded') return 'graded';
  if (submissionStatus === 'rejected') return 'rejected';
  if (submissionStatus === 'pending') return 'submitted';
  return 'pending'; // not_submitted -> pending student submission
}

export const useStudentHomework = (lang = 'ar') => {
  const isAr = lang === 'ar';
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsRef = useRef(searchParams);
  const deepLinkHandledRef = useRef('');
  const submittingRef = useRef(false);
  const toastTimerRef = useRef(null);
  const previewUrlRef = useRef('');

  const [homeworksList, setHomeworksList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'pending' | 'submitted' | 'graded'
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & form state
  const [selectedHw, setSelectedHw] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFilePreviewUrl, setSelectedFilePreviewUrl] = useState('');
  const [removeExistingAttachment, setRemoveExistingAttachment] = useState(false);
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const revokePreviewUrl = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = '';
    }
    setSelectedFilePreviewUrl('');
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const showToast = useCallback((message) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3800);
  }, []);

  const mapHomeworks = useCallback(
    (raw) =>
      raw.map((h) => ({
        id: h.id || h.uuid,
        titleAr: h.titleAr || '',
        subjectAr: h.courseTitleAr || h.lessonTitleAr || (isAr ? 'واجب دراسي' : 'Homework'),
        lessonTitleAr: h.lessonTitleAr || '',
        teacherNameAr: h.teacherName || '',
        type: h.type || (h.attachmentUrl ? 'file' : 'text'),
        fileType: h.fileType || null,
        textContent: h.textContent || '',
        attachmentName: h.attachmentName || '',
        attachmentSizeBytes: h.attachmentSizeBytes || 0,
        attachmentUrl: h.attachmentUrl || '',
        attachmentDownloadUrl: h.attachmentDownloadUrl || h.attachmentUrl || '',
        dueDate: h.dueDate || '',
        dueTime: h.dueTime || '',
        deadlineTextAr: h.dueDate
          ? `${h.dueDate}${h.dueTime ? ` • ${h.dueTime}` : ''}`
          : isAr
            ? 'مفتوح للتسليم'
            : 'Open deadline',
        isOverdue: Boolean(h.isOverdue),
        submissionStatus: h.submissionStatus || 'not_submitted',
        status: normalizeStatus(h.submissionStatus), // 'pending' | 'rejected' | 'submitted' | 'graded'
        submissionId: h.submissionId || null,
        submissionType: h.submissionType || null,
        solutionText: h.solutionText || '',
        submittedAttachmentName: h.submittedAttachmentName || '',
        submittedAttachmentUrl: h.submittedAttachmentUrl || '',
        submittedAttachmentDownloadUrl: h.submittedAttachmentDownloadUrl || h.submittedAttachmentUrl || '',
        maxScore: Math.max(1, Number(h.maxGrade || 20)),
        earnedScore: h.score !== null && h.score !== undefined ? Number(h.score) : null,
        feedbackAr: h.feedbackAr || '',
        submittedAt: h.submittedAt || null,
        gradedAt: h.gradedAt || null,
      })),
    [isAr]
  );

  const openHomework = useCallback(
    (hw) => {
      revokePreviewUrl();
      setSelectedHw(hw);
      setAnswerText(hw.solutionText || '');
      setSelectedFile(null);
      setRemoveExistingAttachment(false);
      setShowAttachmentPreview(false);
      setSubmitError(null);
    },
    [revokePreviewUrl]
  );

  const closeHomework = useCallback(() => {
    if (submittingRef.current) return;
    revokePreviewUrl();
    setSelectedHw(null);
    setSelectedFile(null);
    setRemoveExistingAttachment(false);
    setShowAttachmentPreview(false);
    setSubmitError(null);
  }, [revokePreviewUrl]);

  const refreshHomeworks = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await studentApi.homeworks.list();
      const raw = Array.isArray(res?.data) ? res.data : [];
      const mapped = mapHomeworks(raw);
      setHomeworksList(mapped);
      return mapped;
    } catch (err) {
      setLoadError(
        err?.message ||
          (isAr ? 'تعذر تحميل قائمة الواجبات، يرجى المحاولة مرة أخرى.' : 'Failed to load homework list.')
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAr, mapHomeworks]);

  // Initial fetch + deep-link (?id= or ?homeworkId=) cleanly after async response
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const res = await studentApi.homeworks.list();
        if (!mounted) return;
        const raw = Array.isArray(res?.data) ? res.data : [];
        const mapped = mapHomeworks(raw);
        setHomeworksList(mapped);
        setLoadError(null);

        const params = searchParamsRef.current;
        const requestedId = params.get('homeworkId') || params.get('id') || '';
        if (requestedId && deepLinkHandledRef.current !== requestedId) {
          deepLinkHandledRef.current = requestedId;
          const target = mapped.find((item) => item.id === requestedId);
          if (target) {
            openHomework(target);
          }
          const next = new URLSearchParams(params);
          next.delete('homeworkId');
          next.delete('id');
          setSearchParams(next, { replace: true });
        }
      } catch (err) {
        if (mounted) {
          setLoadError(
            err?.message ||
              (isAr ? 'تعذر تحميل قائمة الواجبات، يرجى المحاولة مرة أخرى.' : 'Failed to load homework list.')
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [mapHomeworks, isAr, openHomework, setSearchParams]);

  const handleSelectFile = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;

      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const mimeOk = ALLOWED_MIME_TYPES.has(file.type) || ALLOWED_EXTENSIONS.has(ext);
      if (!mimeOk) {
        setSubmitError(
          isAr
            ? 'نوع الملف غير مدعوم. يُسمح فقط بملفات PDF أو الصور (PNG, JPG, WEBP).'
            : 'Unsupported file type. Only PDF, PNG, JPG, or WEBP files are allowed.'
        );
        return;
      }

      if (file.size > MAX_FILE_BYTES) {
        setSubmitError(
          isAr
            ? 'حجم الملف يتجاوز الحد الأقصى المسموح به (25 ميجابايت).'
            : 'File exceeds the 25 MB maximum size limit.'
        );
        return;
      }

      revokePreviewUrl();
      setSubmitError(null);
      setSelectedFile(file);
      setRemoveExistingAttachment(false);

      if (file.type.startsWith('image/')) {
        const objUrl = URL.createObjectURL(file);
        previewUrlRef.current = objUrl;
        setSelectedFilePreviewUrl(objUrl);
      }
    },
    [isAr, revokePreviewUrl]
  );

  const handleClearSelectedFile = useCallback(() => {
    revokePreviewUrl();
    setSelectedFile(null);
  }, [revokePreviewUrl]);

  const handleSubmitHomework = useCallback(
    async (e) => {
      e.preventDefault();
      if (!selectedHw || submittingRef.current) return;

      const trimmedText = answerText.trim();
      const keepingExistingFile = Boolean(selectedHw.submittedAttachmentName) && !removeExistingAttachment;

      if (!trimmedText && !selectedFile && !keepingExistingFile) {
        setSubmitError(
          isAr
            ? 'يرجى كتابة الحل النصي أو إرفاق ملف الحل (PDF أو صورة) أولاً.'
            : 'Please enter a text solution or attach a PDF/image file first.'
        );
        return;
      }

      submittingRef.current = true;
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        let body;
        if (selectedFile) {
          body = new FormData();
          body.append('file', selectedFile);
          if (trimmedText) body.append('solution_text', trimmedText);
        } else {
          body = {
            solution_text: trimmedText,
            remove_attachment: removeExistingAttachment,
          };
        }

        await studentApi.homeworks.submit(selectedHw.id, body);
        const submittedTitle = selectedHw.titleAr;
        const wasUpdate = selectedHw.status === 'submitted';

        await refreshHomeworks();
        revokePreviewUrl();
        setSelectedHw(null);
        setSelectedFile(null);
        setRemoveExistingAttachment(false);

        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } });
        } catch {
          // ignore
        }

        showToast(
          wasUpdate
            ? isAr
              ? `تم تحديث حل الواجب بنجاح: ${submittedTitle}`
              : `Homework updated: ${submittedTitle}`
            : isAr
              ? `تم تسليم الواجب بنجاح: ${submittedTitle}`
              : `Homework submitted: ${submittedTitle}`
        );
      } catch (err) {
        const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
        setSubmitError(
          firstErr ||
            err?.message ||
            (isAr ? 'تعذر تسليم الواجب، يرجى المحاولة مرة أخرى.' : 'Failed to submit homework.')
        );
      } finally {
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [selectedHw, answerText, selectedFile, removeExistingAttachment, refreshHomeworks, revokePreviewUrl, showToast, isAr]
  );

  // Filter tab counts (rejected homeworks stay under 'pending' since student action is required)
  const tabCounts = useMemo(() => {
    let pendingCount = 0;
    let submittedCount = 0;
    let gradedCount = 0;

    homeworksList.forEach((h) => {
      if (h.status === 'pending' || h.status === 'rejected') pendingCount += 1;
      else if (h.status === 'submitted') submittedCount += 1;
      else if (h.status === 'graded') gradedCount += 1;
    });

    return {
      all: homeworksList.length,
      pending: pendingCount,
      submitted: submittedCount,
      graded: gradedCount,
    };
  }, [homeworksList]);

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return homeworksList.filter((hw) => {
      if (filterTab === 'pending' && hw.status !== 'pending' && hw.status !== 'rejected') return false;
      if (filterTab === 'submitted' && hw.status !== 'submitted') return false;
      if (filterTab === 'graded' && hw.status !== 'graded') return false;
      if (!q) return true;
      const hay = `${hw.titleAr} ${hw.subjectAr} ${hw.lessonTitleAr} ${hw.teacherNameAr}`.toLowerCase();
      return hay.includes(q);
    });
  }, [homeworksList, filterTab, searchQuery]);

  const hasFilters = filterTab !== 'all' || searchQuery.trim().length > 0;

  const resetFilters = useCallback(() => {
    setFilterTab('all');
    setSearchQuery('');
  }, []);

  return {
    homeworksList,
    filteredList,
    loading,
    loadError,
    refreshHomeworks,
    filterTab,
    setFilterTab,
    searchQuery,
    setSearchQuery,
    tabCounts,
    hasFilters,
    resetFilters,
    selectedHw,
    openHomework,
    closeHomework,
    answerText,
    setAnswerText,
    selectedFile,
    selectedFilePreviewUrl,
    removeExistingAttachment,
    setRemoveExistingAttachment,
    showAttachmentPreview,
    setShowAttachmentPreview,
    handleSelectFile,
    handleClearSelectedFile,
    handleSubmitHomework,
    isSubmitting,
    submitError,
    setSubmitError,
    toast,
  };
};
