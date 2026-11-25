import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import {
  Award,
  Plus,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { teacherApi } from '../../services/teacherApi';
import { CertificateModal } from '../../features/student/certificates/CertificateModal';
import { OfficialCertificateDocument } from '../../features/student/certificates/OfficialCertificateDocument';
import {
  formatCertForOfficial,
  resolveLiveVerifyUrl,
  waitForQrImage,
  CertificateStatsCards,
  CertificatesTable,
  IssueCertificateModal,
  RevokeCertificateModal,
} from '../../features/teacher/certificates';

export const TeacherCertificatesView = () => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  // Responsive breakpoint via matchMedia
  const [isMobile, setIsMobile] = useState(
    () => (typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false)
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Data state
  const [certificates, setCertificates] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [stats, setStats] = useState({ total: 0, verifiedCount: 0, revokedCount: 0, averageGrade: 0 });
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadTick, setReloadTick] = useState(0);

  // Server-backed filters & pagination
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'verified' | 'revoked'
  const [page, setPage] = useState(1);

  // Modals & row PNG share
  const [previewCert, setPreviewCert] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [certToRevoke, setCertToRevoke] = useState(null);
  const [sharingRowId, setSharingRowId] = useState(null);
  const [sharingCert, setSharingCert] = useState(null);
  const [toast, setToast] = useState(null);

  const offscreenCertRef = useRef(null);
  const toastTimerRef = useRef(null);
  const listReqSeqRef = useRef(0);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 4500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Load teacher's courses once
  useEffect(() => {
    let active = true;
    teacherApi.courses
      .list()
      .then((res) => {
        if (!active) return;
        setCoursesList(Array.isArray(res?.data) ? res.data : []);
      })
      .catch(() => {
        // Non-fatal: modal allows free-text course name fallback
      });
    return () => {
      active = false;
    };
  }, []);

  // Load certificates whenever filters, page, or reloadTick change
  useEffect(() => {
    const seq = ++listReqSeqRef.current;
    let active = true;

    const params = { page, per_page: 20 };
    if (debouncedSearch) params.search = debouncedSearch;
    if (filterCourse !== 'all') params.course_id = filterCourse;
    if (filterStatus !== 'all') params.status = filterStatus;

    teacherApi.certificates
      .list(params)
      .then((res) => {
        if (!active || seq !== listReqSeqRef.current) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        const meta = res?.meta || {};
        setCertificates(list);
        setPagination({
          current_page: Number(meta.current_page || 1),
          last_page: Number(meta.last_page || 1),
          total: Number(meta.total ?? list.length),
        });
        if (meta.stats) {
          setStats(meta.stats);
        } else {
          setStats({
            total: Number(meta.total ?? list.length),
            verifiedCount: list.filter((c) => c.status !== 'revoked').length,
            revokedCount: list.filter((c) => c.status === 'revoked').length,
            averageGrade: 0,
          });
        }
        setLoadError('');
      })
      .catch((err) => {
        if (!active || seq !== listReqSeqRef.current) return;
        setLoadError(err?.message || (isAr ? 'تعذر تحميل سجل الشهادات.' : 'Failed to load certificates.'));
      })
      .finally(() => {
        if (active && seq === listReqSeqRef.current) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, filterCourse, filterStatus, page, reloadTick, isAr]);

  const triggerReload = () => {
    setIsLoading(true);
    setLoadError('');
    setReloadTick((t) => t + 1);
  };

  // Dynamic course options built strictly from teacher's real courses + loaded certificates
  const courseFilterOptions = useMemo(() => {
    const map = new Map();
    coursesList.forEach((c) => {
      const id = String(c.uuid || c.id);
      const title = c.titleAr || c.title_ar || c.title;
      if (id && title) map.set(id, title);
    });
    certificates.forEach((cert) => {
      const key = cert.courseId ? String(cert.courseId) : cert.courseNameAr;
      if (key && cert.courseNameAr && !map.has(key)) {
        map.set(key, cert.courseNameAr);
      }
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [coursesList, certificates]);

  // Issue single certificate
  const handleIssueSingle = async (payload) => {
    const res = await teacherApi.certificates.issue(payload);
    const issued = res?.data;
    setShowIssueModal(false);
    if (issued) {
      setPreviewCert(issued);
    }
    setPage(1);
    setReloadTick((t) => t + 1);
    showToast(
      isAr
        ? 'تم إصدار الشهادة وحفظها وتوثيقها برمز QR بنجاح.'
        : 'Certificate issued and cryptographically signed.'
    );
  };

  // Bulk issue certificates
  const handleIssueBulk = async (payload) => {
    const res = await teacherApi.certificates.bulkIssue(payload);
    const createdList = Array.isArray(res?.data) ? res.data : [];
    setShowIssueModal(false);
    setPage(1);
    setReloadTick((t) => t + 1);
    showToast(
      isAr
        ? `تم إصدار ${createdList.length} شهادة معتمدة بنجاح.`
        : `Successfully issued ${createdList.length} certificates.`
    );
  };

  // Revoke certificate
  const handleConfirmRevoke = async (certUuid, reason) => {
    const res = await teacherApi.certificates.revoke(certUuid, reason);
    const updated = res?.data;
    if (updated) {
      setCertificates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    }
    setCertToRevoke(null);
    setReloadTick((t) => t + 1);
    showToast(
      isAr
        ? 'تم إلغاء الشهادة وتحديث حالة التحقق الرسمية بنجاح.'
        : 'Certificate revoked and verification registry updated.'
    );
  };

  // Share as crisp PNG image (waits reliably for QR data URL!)
  const handleShareRowImage = async (cert) => {
    if (sharingRowId || !cert || cert.status === 'revoked') return;
    setSharingRowId(cert.id);
    const formatted = formatCertForOfficial(cert);
    setSharingCert(formatted);

    try {
      await new Promise((r) => setTimeout(r, 60));
      if (!offscreenCertRef.current) {
        throw new Error('Export canvas not ready');
      }
      await waitForQrImage(offscreenCertRef.current, 900);

      const dataUrl = await toPng(offscreenCertRef.current, {
        pixelRatio: 2.2,
        cacheBust: true,
        backgroundColor: '#FFFFFF',
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const studentName = cert.studentNameAr || 'الطالب';
      const courseName = cert.courseNameAr || 'المقرر';
      const fileName = `شهادة-${studentName}.png`
        .replace(/[/\\?%*:|"<>]/g, '-')
        .replace(/\s+/g, '-');
      const file = new File([blob], fileName, { type: 'image/png' });
      const verifyUrl = resolveLiveVerifyUrl(cert);
      const message = isAr
        ? `شهادة تقدير وتفوق معتمدة للطالب: *${studentName}*\nفي مقرر: *${courseName}*\nمنصة متفوّق التعليمية 🎓\nرابط التوثيق الرسمي: ${verifyUrl}`
        : `Official Verified Certificate for: *${studentName}*\nCourse: *${courseName}*\nMotafawweq Platform 🎓\nVerification: ${verifyUrl}`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: isAr ? `شهادة تقدير - ${studentName}` : `Certificate - ${studentName}`,
          text: message,
        });
      } else {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();

        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          }
        } catch {
          // Clipboard image write unsupported in some browsers
        }

        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
          '_blank',
          'noopener,noreferrer'
        );
        showToast(
          isAr
            ? 'تم حفظ صورة الشهادة ونسخها للحافظة وفتح رابط المشاركة.'
            : 'Certificate image saved, copied, and WhatsApp share opened.'
        );
      }
    } catch (err) {
      if (err?.name !== 'AbortError') {
        showToast(
          isAr ? 'تعذر تجهيز صورة الشهادة للمشاركة.' : 'Failed to prepare certificate image.',
          'error'
        );
      }
    } finally {
      setSharingRowId(null);
      setSharingCert(null);
    }
  };

  const formattedPreviewCert = useMemo(() => formatCertForOfficial(previewCert), [previewCert]);
  const hasActiveFilters = Boolean(debouncedSearch || filterCourse !== 'all' || filterStatus !== 'all');

  const handleResetFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setFilterCourse('all');
    setFilterStatus('all');
    setPage(1);
  };

  return (
    <div
      style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: isMobile ? '16px 14px 60px' : '28px 24px 80px',
        fontFamily: 'var(--font-arabic)',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Off-screen export node mounted strictly while sharing a row PNG */}
      {sharingCert && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: '-9999px',
            left: '-9999px',
            width: '960px',
            height: '662px',
            pointerEvents: 'none',
            zIndex: -100,
            overflow: 'hidden',
          }}
        >
          <OfficialCertificateDocument
            ref={offscreenCertRef}
            cert={sharingCert}
            lang={lang}
            isExport={true}
          />
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: isRtl ? '24px' : 'auto',
            left: isRtl ? 'auto' : '24px',
            zIndex: 10000,
            backgroundColor: toast.type === 'error' ? '#7F1D1D' : '#06254E',
            color: '#FFFFFF',
            padding: '12px 18px',
            borderRadius: '14px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
            border: `1px solid ${toast.type === 'error' ? 'rgba(248, 113, 113, 0.5)' : 'rgba(56, 189, 248, 0.4)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: '700',
            maxWidth: '440px',
          }}
        >
          {toast.type === 'error' ? (
            <AlertCircle size={18} color="#FCA5A5" style={{ flexShrink: 0 }} />
          ) : (
            <CheckCircle2 size={18} color="#38BDF8" style={{ flexShrink: 0 }} />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: '2px', marginInlineStart: '4px' }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '16px',
          marginBottom: '22px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 11px',
                borderRadius: '8px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                color: 'var(--primary)',
                border: '1px solid rgba(21, 136, 199, 0.2)',
                fontSize: '11.5px',
                fontWeight: '800',
              }}
            >
              <Award size={14} />
              <span>{isAr ? 'إصدار وتوثيق الشهادات المعتمدة' : 'Official Certificates Hub'}</span>
            </span>
          </div>

          <h1
            style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: '0 0 5px 0',
            }}
          >
            {isAr ? 'سجل واعتماد شهادات التقدير والدرجات النهائية' : 'Issued Honors & Course Certificates'}
          </h1>
          <p style={{ fontSize: isMobile ? '12.5px' : '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
            {isAr
              ? 'إصدار فردي أو جماعي لشهادات التفوق بتوقيع رقمي ورمز تحقق QR مع إمكانية المشاركة والإلغاء'
              : 'Issue single or bulk cryptographically signed certificates with live QR verification and revocation.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowIssueModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '11px 20px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-primary)',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          <Plus size={16} />
          <span>{isAr ? 'إصدار شهادة جديدة' : 'Issue Certificate'}</span>
        </button>
      </div>

      {/* Live Stats Cards */}
      <CertificateStatsCards stats={stats} lang={lang} isMobile={isMobile} />

      {/* Search, Course Filter & Status Filter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '10px',
          marginBottom: '18px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '6px 14px',
            flex: '1 1 240px',
          }}
        >
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder={isAr ? 'ابحث باسم الطالب أو رقم الشهادة أو المقرر...' : 'Search student, serial, or course...'}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontFamily: 'inherit',
              width: '100%',
              padding: '5px 0',
            }}
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <select
          value={filterCourse}
          onChange={(e) => {
            setFilterCourse(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: '700',
            fontFamily: 'inherit',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">{isAr ? 'كل المقررات' : 'All Courses'}</option>
          {courseFilterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '4px',
            gap: '3px',
          }}
        >
          {[
            { id: 'all', label: isAr ? 'الكل' : 'All' },
            { id: 'verified', label: isAr ? 'معتمدة' : 'Verified' },
            { id: 'revoked', label: isAr ? 'ملغاة' : 'Revoked' },
          ].map((tab) => {
            const active = filterStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setFilterStatus(tab.id);
                  setPage(1);
                }}
                style={{
                  flex: isMobile ? 1 : 'initial',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: active ? '800' : '600',
                  backgroundColor: active ? 'var(--primary)' : 'transparent',
                  color: active ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Loading / Error / Table */}
      {isLoading ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '18px',
            border: '1px solid var(--border-subtle)',
            padding: '48px 20px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '13.5px',
            fontWeight: '700',
          }}
        >
          {isAr ? 'جاري تحميل سجل الشهادات المعتمدة...' : 'Loading certificates registry...'}
        </div>
      ) : loadError ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '18px',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            padding: '36px 20px',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={30} color="#EF4444" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
            {loadError}
          </div>
          <button
            type="button"
            onClick={triggerReload}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '11px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        </div>
      ) : (
        <CertificatesTable
          certificates={certificates}
          pagination={pagination}
          sharingRowId={sharingRowId}
          hasActiveFilters={hasActiveFilters}
          onPreview={setPreviewCert}
          onShareImage={handleShareRowImage}
          onRevoke={setCertToRevoke}
          onPageChange={(nextPage) => {
            setIsLoading(true);
            setPage(nextPage);
          }}
          onResetFilters={handleResetFilters}
          onOpenIssue={() => setShowIssueModal(true)}
          lang={lang}
          isRtl={isRtl}
          isMobile={isMobile}
        />
      )}

      {/* Official Certificate Preview Modal */}
      {formattedPreviewCert && (
        <CertificateModal
          selectedCert={formattedPreviewCert}
          onClose={() => setPreviewCert(null)}
          lang={lang}
        />
      )}

      {/* Issue / Bulk Issue Modal */}
      {showIssueModal && (
        <IssueCertificateModal
          courses={coursesList}
          onIssueSingle={handleIssueSingle}
          onIssueBulk={handleIssueBulk}
          onClose={() => setShowIssueModal(false)}
          lang={lang}
          isRtl={isRtl}
          isMobile={isMobile}
        />
      )}

      {/* Revoke Certificate Confirmation Modal */}
      {certToRevoke && (
        <RevokeCertificateModal
          certificate={certToRevoke}
          onConfirm={handleConfirmRevoke}
          onClose={() => setCertToRevoke(null)}
          lang={lang}
          isRtl={isRtl}
        />
      )}
    </div>
  );
};

export default TeacherCertificatesView;
