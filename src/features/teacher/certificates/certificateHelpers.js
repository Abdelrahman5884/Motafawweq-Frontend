/**
 * Helper utilities, honors presets, score formatters, and QR export sync
 * for Teacher Certificates Management.
 */

export const HONORS_PRESETS = [
  {
    ar: 'شهادة تميز وتفوق بالدرجة النهائية (Full Mark)',
    en: 'Certificate of Full Mark Excellence',
  },
  {
    ar: 'شهادة صدارة وبطل الدوري الأكاديمي',
    en: 'Academic League Champion Certificate',
  },
  {
    ar: 'شهادة إتمام الكورس بمرتبة الشرف',
    en: 'Certificate of Course Completion with Honors',
  },
  {
    ar: 'شهادة اجتياز بنك الأسئلة والامتحانات الشاملة',
    en: 'Comprehensive Exams & Question Bank Mastery',
  },
  {
    ar: 'شهادة تقدير للالتزام والاجتهاد المستمر',
    en: 'Certificate of Dedication & Consistent Effort',
  },
];

export function formatCertScore(cert) {
  if (!cert) return '0%';
  const raw = cert.gradePercent;
  if (raw !== undefined && raw !== null && raw !== '') {
    const num = Number(raw);
    if (!Number.isNaN(num)) {
      return Number.isInteger(num) ? `${num}%` : `${Number(num.toFixed(1))}%`;
    }
  }
  const str = String(cert.score || '0%').trim();
  return str.endsWith('%') ? str : `${str}%`;
}

export function resolveLiveVerifyUrl(cert) {
  if (!cert) return '';
  const serial = cert.certNumber || cert.serialId || cert.certificate_number || '';
  const origin =
    typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
  if (serial && origin) {
    return `${origin}/verify/${encodeURIComponent(serial)}`;
  }
  return cert.verificationUrl || '';
}

export function formatCertForOfficial(cert) {
  if (!cert) return null;
  const serial = cert.certNumber || cert.serialId || cert.certificate_number || '';
  const liveVerifyUrl = resolveLiveVerifyUrl(cert);
  const formattedScore = formatCertScore(cert);

  return {
    ...cert,
    id: cert.id || cert.uuid,
    serialId: serial,
    certNumber: serial,
    issuerType: cert.issuerType || 'teacher',
    category: cert.category || 'teacher',
    issuerNameAr: cert.issuerNameAr || cert.instructorAr || 'معلم معتمد',
    issuerNameEn: cert.issuerNameEn || cert.instructorEn || cert.issuerNameAr || 'Certified Educator',
    instructorAr: cert.instructorAr || cert.issuerNameAr || 'معلم معتمد',
    instructorEn: cert.instructorEn || cert.issuerNameEn || cert.instructorAr || 'Certified Educator',
    instructorTitleAr: cert.instructorTitleAr || 'معلم معتمد على منصة متفوّق',
    instructorTitleEn: cert.instructorTitleEn || 'Certified Motafawweq Educator',
    titleAr: cert.honorsTitleAr || 'شهادة تميز وتفوق معتمدة',
    titleEn: cert.honorsTitleEn || 'Certificate of Academic Excellence',
    courseNameAr: cert.courseNameAr || 'المقرر الدراسي',
    courseNameEn: cert.courseNameEn || cert.courseNameAr || 'Course',
    studentNameAr: cert.studentNameAr || 'طالب متفوق',
    studentNameEn: cert.studentNameEn || cert.studentNameAr || 'Student',
    gradeAr: cert.gradeAr || 'الصف الثالث الثانوي',
    completionDate: cert.issueDate || cert.completionDate || '',
    score: formattedScore,
    scoreEn: formattedScore,
    verifyPath: serial ? `/verify/${encodeURIComponent(serial)}` : '/verify',
    verificationUrl: liveVerifyUrl,
    status: cert.status || 'verified',
  };
}

export function waitForQrImage(node, timeoutMs = 800) {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const qrImg = node?.querySelector('img[alt="QR"]');
      if (qrImg && typeof qrImg.src === 'string' && qrImg.src.startsWith('data:')) {
        requestAnimationFrame(() => resolve());
        return;
      }
      if (Date.now() - start >= timeoutMs) {
        resolve();
        return;
      }
      setTimeout(check, 30);
    };
    requestAnimationFrame(check);
  });
}
