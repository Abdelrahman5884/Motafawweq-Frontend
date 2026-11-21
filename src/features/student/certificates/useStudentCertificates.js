import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { studentApi } from '../../../services/studentApi';

export function buildLiveVerifyUrl(serialId, verifyPath) {
  const origin = typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : '';
  const path = verifyPath || (serialId ? `/verify/${encodeURIComponent(serialId)}` : '/verify');
  return origin ? `${origin}${path}` : path;
}

export function normalizeStudentCertificate(raw) {
  if (!raw) return null;
  const serial = raw.serialId || raw.certificateNumber || raw.certNumber || '';
  const scoreVal = raw.score || (raw.gradePercent !== undefined && raw.gradePercent !== null ? `${raw.gradePercent}%` : '');
  const issueDate = raw.completionDate || raw.issueDate || '';
  const verifyPath = raw.verifyPath || (serial ? `/verify/${encodeURIComponent(serial)}` : '/verify');

  return {
    id: raw.id || serial,
    serialId: serial,
    certificateNumber: serial,
    signatureHash: raw.signatureHash || '',
    issuerType: raw.issuerType || raw.category || 'teacher',
    category: raw.category || raw.issuerType || 'teacher',
    issuerNameAr: raw.issuerNameAr || raw.instructorAr || '',
    issuerNameEn: raw.issuerNameEn || raw.instructorEn || raw.issuerNameAr || '',
    instructorAr: raw.instructorAr || raw.issuerNameAr || '',
    instructorEn: raw.instructorEn || raw.issuerNameEn || raw.instructorAr || '',
    instructorTitleAr: raw.instructorTitleAr || '',
    instructorTitleEn: raw.instructorTitleEn || '',
    studentNameAr: raw.studentNameAr || '',
    studentNameEn: raw.studentNameEn || raw.studentNameAr || '',
    courseId: raw.courseId || null,
    courseNameAr: raw.courseNameAr || raw.courseTitleAr || '',
    courseNameEn: raw.courseNameEn || raw.courseTitleEn || raw.courseNameAr || '',
    gradeAr: raw.gradeAr || '',
    gradePercent: Number(raw.gradePercent ?? 0),
    score: scoreVal,
    scoreEn: raw.scoreEn || scoreVal,
    completionRate: raw.completionRate || '100%',
    honorsTitleAr: raw.honorsTitleAr || raw.honorsAr || '',
    honorsTitleEn: raw.honorsTitleEn || '',
    issueDate,
    completionDate: issueDate,
    completionDateEn: raw.completionDateEn || issueDate,
    status: raw.status || 'verified',
    verifyPath,
    verificationUrl: buildLiveVerifyUrl(serial, verifyPath),
    rankAr: raw.rankAr || '',
    rankEn: raw.rankEn || '',
    pointsAr: raw.pointsAr || '',
    pointsEn: raw.pointsEn || '',
  };
}

export const useStudentCertificates = (lang = 'ar') => {
  const isAr = lang === 'ar';
  const requestSeqRef = useRef(0);

  const [workspace, setWorkspace] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [claimingCourseId, setClaimingCourseId] = useState(null);
  const [error, setError] = useState(null);
  const [claimMessage, setClaimMessage] = useState(null);

  const loadWorkspace = useCallback(
    async ({ silent = false } = {}) => {
      const seq = ++requestSeqRef.current;
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const res = await studentApi.gamification.certificatesWorkspace();
        if (seq !== requestSeqRef.current) return null;
        const data = res?.data || {};
        setWorkspace(data);
        return data;
      } catch (err) {
        if (seq === requestSeqRef.current) {
          setError(
            err?.message ||
              (isAr
                ? 'تعذر تحميل الشهادات المعتمدة حالياً، يرجى المحاولة مرة أخرى.'
                : 'Failed to load certificates. Please try again.')
          );
        }
        return null;
      } finally {
        if (seq === requestSeqRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [isAr]
  );

  useEffect(() => {
    let mounted = true;
    const seq = ++requestSeqRef.current;

    const init = async () => {
      try {
        const res = await studentApi.gamification.certificatesWorkspace();
        if (!mounted || seq !== requestSeqRef.current) return;
        setWorkspace(res?.data || {});
        setError(null);
      } catch (err) {
        if (mounted && seq === requestSeqRef.current) {
          setError(
            err?.message ||
              (isAr
                ? 'تعذر تحميل الشهادات المعتمدة حالياً، يرجى المحاولة مرة أخرى.'
                : 'Failed to load certificates. Please try again.')
          );
        }
      } finally {
        if (mounted && seq === requestSeqRef.current) {
          setLoading(false);
        }
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [isAr]);

  const certificates = useMemo(() => {
    const rawList = Array.isArray(workspace?.certificates) ? workspace.certificates : [];
    return rawList.map(normalizeStudentCertificate).filter(Boolean);
  }, [workspace]);

  const eligibility = useMemo(() => workspace?.eligibility || null, [workspace]);

  const handleRefresh = useCallback(() => {
    loadWorkspace({ silent: Boolean(workspace) });
  }, [loadWorkspace, workspace]);

  const handleClaimCourse = useCallback(
    async (courseId) => {
      if (!courseId || claimingCourseId) return;
      setClaimingCourseId(courseId);
      setError(null);
      setClaimMessage(null);

      try {
        const res = await studentApi.gamification.claimCertificate(courseId);
        const issued = normalizeStudentCertificate(res?.data);
        await loadWorkspace({ silent: true });
        if (issued) {
          setSelectedCert(issued);
        }
        setClaimMessage(
          isAr
            ? 'تم إصدار شهادة إتمام المقرر وتوثيقها بالرقم التسلسلي وكود QR بنجاح.'
            : 'Your verified course completion certificate has been issued.'
        );
      } catch (err) {
        setError(
          err?.message ||
            (isAr
              ? 'تعذر إصدار الشهادة لهذا المقرر، تأكد من إتمام 100% من الحصص.'
              : 'Unable to claim certificate. Ensure 100% of lessons are completed.')
        );
      } finally {
        setClaimingCourseId(null);
      }
    },
    [claimingCourseId, isAr, loadWorkspace]
  );

  return {
    certificates,
    eligibility,
    selectedCert,
    setSelectedCert,
    loading,
    refreshing,
    claimingCourseId,
    error,
    claimMessage,
    setClaimMessage,
    handleRefresh,
    handleClaimCourse,
  };
};
