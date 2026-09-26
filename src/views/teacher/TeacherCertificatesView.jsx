import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { TEACHER_CERTIFICATES, TEACHER_COURSES } from '../../data/teacherData';
import { CertificateModal } from '../../features/student/certificates/CertificateModal';
import { OfficialCertificateDocument } from '../../features/student/certificates/OfficialCertificateDocument';
import { toPng } from 'html-to-image';
import {
  Award,
  Plus,
  Search,
  CheckCircle2,
  ShieldCheck,
  X,
  FileCheck,
  MessageCircle,
  Loader2,
  Check,
  UserCheck,
  Phone
} from 'lucide-react';

const ENROLLED_STUDENTS = [
  { id: 'std-1', nameAr: 'عمر طارق القاضي', nameEn: 'Omar Tarek El-Kady', gradeAr: 'الصف الثالث الثانوي', email: 'omar.tarek@motafawweq.me', phone: '+201024589912' },
  { id: 'std-2', nameAr: 'سارة خالد منصور', nameEn: 'Sarah Khaled Mansour', gradeAr: 'الصف الثالث الثانوي', email: 'sara.mansour@stem.edu.eg', phone: '+201118765432' },
  { id: 'std-3', nameAr: 'مريم عادل شنودة', nameEn: 'Mariam Adel Shenouda', gradeAr: 'الصف الثالث الثانوي', email: 'mariam.adel@gmail.com', phone: '+201204457789' },
  { id: 'std-4', nameAr: 'كريم مصطفى بدوي', nameEn: 'Kareem Mostafa Badawi', gradeAr: 'الصف الثالث الثانوي', email: 'kareem.badawi@gmail.com', phone: '+201063321980' },
  { id: 'std-5', nameAr: 'عبدالرحمن حسن', nameEn: 'Abdulrahman Hassan', gradeAr: 'الصف الثالث الثانوي', email: 'abdulrahman.hassan@gmail.com', phone: '+201001234567' },
  { id: 'std-6', nameAr: 'يوسف أحمد الشناوي', nameEn: 'Youssef Ahmed El-Shennawy', gradeAr: 'الصف الثالث الثانوي', email: 'youssef.shennawy@gmail.com', phone: '+201099887766' },
  { id: 'std-7', nameAr: 'سلمى محمود عزت', nameEn: 'Salma Mahmoud Ezzat', gradeAr: 'الصف الثالث الثانوي', email: 'salma.ezzat@gmail.com', phone: '+201155443322' },
  { id: 'std-8', nameAr: 'أحمد محمد فتحي', nameEn: 'Ahmed Mohamed Fathy', gradeAr: 'الصف الثالث الثانوي', email: 'ahmed.fathy@gmail.com', phone: '+201288776655' },
  { id: 'std-9', nameAr: 'نورهان هاني الجوهري', nameEn: 'Nourhan Hany El-Gohary', gradeAr: 'الصف الثالث الثانوي', email: 'nourhan.gohary@gmail.com', phone: '+201011223344' }
];

export const TeacherCertificatesView = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  const [certificates, setCertificates] = useState(TEACHER_CERTIFICATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [previewCert, setPreviewCert] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);

  // Student search within modal
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  // Row WhatsApp sharing state
  const [sharingRowId, setSharingRowId] = useState(null);
  const [sharingCert, setSharingCert] = useState(null);
  const [toastNotice, setToastNotice] = useState(null);
  const offscreenCertRef = useRef(null);

  // Mobile viewport detection
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Format cert for OfficialCertificateDocument standard
  const formatCertForOfficial = (cert) => {
    if (!cert) return null;
    const serial = cert.certNumber || cert.serialId || 'MTF-BIO-2026-0891';
    return {
      ...cert,
      id: cert.id,
      serialId: serial,
      certNumber: serial,
      issuerType: 'teacher',
      category: 'teacher',
      issuerNameAr: 'د. سلمى السيد',
      issuerNameEn: 'Dr. Salma El-Sayed',
      instructorAr: 'د. سلمى السيد',
      instructorEn: 'Dr. Salma El-Sayed',
      instructorTitleAr: 'كبير معلمي الأحياء ومؤلف سلسلة التفوق',
      instructorTitleEn: 'Senior Biology Lecturer',
      titleAr: cert.honorsTitleAr || 'شهادة تميز وتفوق بالدرجة النهائية (Full Mark)',
      titleEn: 'Certificate of Academic Excellence & Course Completion',
      courseNameAr: cert.courseNameAr,
      courseNameEn: cert.courseNameAr,
      studentNameAr: cert.studentNameAr,
      studentNameEn: cert.studentNameEn || cert.studentNameAr,
      gradeAr: cert.gradeAr || 'الصف الثالث الثانوي 2026',
      completionDate: cert.issueDate || '27 سبتمبر 2026',
      score: cert.score || `${cert.gradePercent}%`,
      scoreEn: `${cert.gradePercent}%`,
      verificationUrl: cert.verificationUrl || `https://motafawweq.me/verify/${serial}`,
      status: 'verified'
    };
  };

  // Form state for issuing new certificate
  const [newCert, setNewCert] = useState({
    studentId: ENROLLED_STUDENTS[0].id,
    studentNameAr: ENROLLED_STUDENTS[0].nameAr,
    studentNameEn: ENROLLED_STUDENTS[0].nameEn,
    studentEmail: ENROLLED_STUDENTS[0].email,
    gradeAr: ENROLLED_STUDENTS[0].gradeAr,
    studentPhone: ENROLLED_STUDENTS[0].phone,
    courseNameAr: TEACHER_COURSES[0]?.titleAr || 'ماستر كلاس الأحياء: البناء الضوئي وحركية الطاقة',
    gradePercent: 98,
    honorsTitleAr: 'شهادة تميز وتفوق بالدرجة النهائية (Full Mark)'
  });

  const handleStudentSelect = (studentId) => {
    const st = ENROLLED_STUDENTS.find(s => s.id === studentId) || ENROLLED_STUDENTS[0];
    setNewCert(prev => ({
      ...prev,
      studentId: st.id,
      studentNameAr: st.nameAr,
      studentNameEn: st.nameEn,
      studentEmail: st.email,
      gradeAr: st.gradeAr,
      studentPhone: st.phone
    }));
  };

  // Filter students in the issue modal by name or phone
  const filteredEnrolledStudents = useMemo(() => {
    const q = studentSearchQuery.trim().toLowerCase();
    if (!q) return ENROLLED_STUDENTS;
    return ENROLLED_STUDENTS.filter(st =>
      st.nameAr.toLowerCase().includes(q) ||
      st.nameEn.toLowerCase().includes(q) ||
      st.phone.includes(q)
    );
  }, [studentSearchQuery]);

  // Main table/cards filter
  const filteredCerts = certificates.filter(c => {
    const matchesSearch = (c.studentNameAr && c.studentNameAr.includes(searchQuery)) ||
      (c.certNumber && c.certNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.serialId && c.serialId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCourse = filterCourse === 'all' || (c.courseNameAr && c.courseNameAr.includes(filterCourse));
    return matchesSearch && matchesCourse;
  });

  const handleIssueCertificate = (e) => {
    e.preventDefault();
    if (!newCert.studentNameAr.trim()) return;

    const serialNum = `MTF-BIO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const issued = {
      id: `cert-issue-${Date.now()}`,
      certNumber: serialNum,
      serialId: serialNum,
      studentId: newCert.studentId,
      studentNameAr: newCert.studentNameAr,
      studentNameEn: newCert.studentNameEn,
      studentEmail: newCert.studentEmail,
      gradeAr: newCert.gradeAr,
      courseNameAr: newCert.courseNameAr,
      courseNameEn: newCert.courseNameAr,
      gradePercent: Number(newCert.gradePercent),
      score: `${newCert.gradePercent}%`,
      scoreEn: `${newCert.gradePercent}%`,
      honorsTitleAr: newCert.honorsTitleAr,
      issueDate: '27 سبتمبر 2026',
      completionDate: '27 سبتمبر 2026',
      verificationUrl: `https://motafawweq.me/verify/${serialNum}`,
      issuerType: 'teacher',
      category: 'teacher',
      issuerNameAr: 'د. سلمى السيد',
      issuerNameEn: 'Dr. Salma El-Sayed',
      instructorAr: 'د. سلمى السيد',
      instructorEn: 'Dr. Salma El-Sayed',
      instructorTitleAr: 'كبير معلمي الأحياء ومؤلف سلسلة التفوق',
      instructorTitleEn: 'Senior Biology Lecturer',
      titleAr: newCert.honorsTitleAr,
      titleEn: 'Certificate of Academic Excellence & Course Completion',
      status: 'verified'
    };

    setCertificates([issued, ...certificates]);
    setShowIssueModal(false);
    setPreviewCert(issued);
  };

  // WhatsApp Share as Image (using Web Share API on mobile, or download + copy + WhatsApp Web on desktop)
  const handleShareRowWhatsApp = async (cert) => {
    if (sharingRowId) return;
    setSharingRowId(cert.id);
    const formatted = formatCertForOfficial(cert);
    setSharingCert(formatted);

    try {
      // Allow offscreen component to render with QR code
      await new Promise(resolve => setTimeout(resolve, 200));

      if (offscreenCertRef.current) {
        const dataUrl = await toPng(offscreenCertRef.current, {
          pixelRatio: 2.2,
          cacheBust: true,
          backgroundColor: '#FFFFFF'
        });

        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const studentName = cert.studentNameAr || 'الطالب';
        const courseName = cert.courseNameAr || 'المقرر';
        const fileName = `شهادة-${studentName}.png`.replace(/\s+/g, '-');
        const file = new File([blob], fileName, { type: 'image/png' });
        const serialCode = cert.certNumber || cert.serialId || 'MTF-2026';
        const verifyUrl = cert.verificationUrl || `https://motafawweq.me/verify/${serialCode}`;
        const message = lang === 'ar'
          ? `شهادة تقدير وتفوق معتمدة للطالب: *${studentName}*\nفي مقرر: *${courseName}*\nمنصة متفوّق التعليمية 🎓\nرابط التوثيق: ${verifyUrl}`
          : `Official Certificate of Excellence for: *${studentName}*\nCourse: *${courseName}*\nMotafawweq Platform 🎓\nVerification: ${verifyUrl}`;

        // 1. Mobile & Web Share API with actual image file
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `شهادة تقدير - ${studentName}`,
            text: message
          });
        } else {
          // 2. Desktop Fallback: Download PNG image + copy to clipboard + open WhatsApp Web
          const link = document.createElement('a');
          link.download = fileName;
          link.href = dataUrl;
          link.click();

          try {
            if (navigator.clipboard && window.ClipboardItem) {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ]);
            }
          } catch (clipErr) {
            // Ignore clipboard permission errors if unsupported
          }

          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
          setToastNotice(lang === 'ar'
            ? 'تم تنزيل صورة الشهادة ونسخها للحافظة! يمكنك لصقها مباشرة في واتساب (Ctrl+V).'
            : 'Certificate image downloaded & copied! Paste directly in WhatsApp (Ctrl+V).');
          setTimeout(() => setToastNotice(null), 5000);
        }
      }
    } catch (err) {
      console.error('Failed to share certificate image via WhatsApp:', err);
    } finally {
      setSharingRowId(null);
    }
  };

  const formattedPreviewCert = useMemo(() => {
    return formatCertForOfficial(previewCert);
  }, [previewCert]);

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: isMobile ? '16px 14px 60px' : '28px 24px 80px',
      fontFamily: 'var(--font-arabic)',
      direction: isRtl ? 'rtl' : 'ltr'
    }}>
      {/* Off-screen Document for Pristine WhatsApp PNG Export */}
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
          opacity: 0,
          overflow: 'hidden'
        }}
      >
        {sharingCert && (
          <OfficialCertificateDocument
            ref={offscreenCertRef}
            cert={sharingCert}
            lang={lang}
            isExport={true}
          />
        )}
      </div>

      {/* Toast Notification Banner */}
      {toastNotice && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: isRtl ? '24px' : 'auto',
          left: isRtl ? 'auto' : '24px',
          zIndex: 10000,
          backgroundColor: '#06254E',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '14px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(37, 211, 102, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: '700',
          maxWidth: '440px',
          animation: 'fadeIn 0.25s ease'
        }}>
          <Check size={18} color="#4ADE80" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '16px',
        marginBottom: '26px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(234, 179, 8, 0.16)' : 'rgba(234, 179, 8, 0.12)',
              color: '#D97706',
              fontSize: '11.5px',
              fontWeight: '800'
            }}>
              <Award size={14} />
              <span>{lang === 'ar' ? 'إصدار وتوثيق الشهادات المعتمدة' : 'Official Certificates Hub'}</span>
            </span>
          </div>

          <h1 style={{
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            letterSpacing: '-0.3px'
          }}>
            {lang === 'ar' ? 'سجل واعتماد شهادات التقدير والدرجات النهائية' : 'Issued Honors & Course Certificates'}
          </h1>
          <p style={{
            fontSize: isMobile ? '12.5px' : '13.5px',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.5
          }}>
            {lang === 'ar'
              ? 'إصدار وتوقيع شهادات التفوق رقمياً لطلابك المسجلين مع رمز التحقق الذكي (QR Code) ومشاركتها كصور'
              : 'Issue and sign certified certificates for your enrolled students with cryptographic QR verification.'}
          </p>
        </div>

        <button
          onClick={() => {
            setStudentSearchQuery('');
            setShowIssueModal(true);
          }}
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
            transition: 'opacity 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <Plus size={16} />
          <span>{lang === 'ar' ? 'إصدار شهادة تقدير جديدة' : 'Issue New Certificate'}</span>
        </button>
      </div>

      {/* Top Stats Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '18px 20px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {lang === 'ar' ? 'إجمالي الشهادات الممنوحة' : 'Total Certificates'}
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)' }}>
            184
          </div>
          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', marginTop: '4px' }}>
            {lang === 'ar' ? 'مصدقة ومعتمدة برمز QR' : 'Cryptographically verified'}
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '18px 20px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {lang === 'ar' ? 'شهادات الدرجة النهائية (Full Mark)' : 'Full Mark Honors'}
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#EAB308' }}>
            62
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '4px' }}>
            {lang === 'ar' ? 'حصلوا على 100% في امتحانات الشهور' : 'Students scored 100%'}
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '18px 20px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {lang === 'ar' ? 'شهادات صدارة الدوري' : 'League Champions'}
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#8B5CF6' }}>
            24
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '4px' }}>
            {lang === 'ar' ? 'مراكز الذهب والفضة والبرونز' : 'Podium placements'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '6px 14px',
          flex: 1
        }}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'ابحث بالاسم أو رقم الشهادة...' : 'Search student or cert number...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontFamily: 'inherit',
              width: '100%',
              padding: '6px 0'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: '700',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="all">{lang === 'ar' ? 'كل المقررات' : 'All Courses'}</option>
          <option value="ماستر">{lang === 'ar' ? 'ماستر كلاس الأحياء (3 ثانوي)' : 'Biology Masterclass (3rd Sec)'}</option>
          <option value="المراجعة">{lang === 'ar' ? 'المراجعة النهائية (3 ثانوي)' : 'Final Revision (3rd Sec)'}</option>
        </select>
      </div>

      {/* Main Certificate View: Mobile Cards or Desktop Table */}
      {isMobile ? (
        /* Mobile Cards Layout (No overflowing horizontal table) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredCerts.length === 0 ? (
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              padding: '36px 20px',
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}>
              <Award size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: '700' }}>
                {lang === 'ar' ? 'لا توجد شهادات مطابقة لخيارات البحث' : 'No matching certificates found'}
              </p>
            </div>
          ) : (
            filteredCerts.map((cert) => {
              const isRowSharing = sharingRowId === cert.id;
              return (
                <div
                  key={cert.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px',
                    boxShadow: 'var(--shadow-xs)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {/* Top: Student Name & Score */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)' }}>
                      {cert.studentNameAr}
                    </div>
                    <div style={{
                      padding: '3px 9px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      color: '#10B981',
                      fontWeight: '900',
                      fontSize: '13.5px'
                    }}>
                      {cert.gradePercent || cert.score}%
                    </div>
                  </div>

                  {/* Course & Honors Title */}
                  <div>
                    <div style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: isDark ? 'rgba(234, 179, 8, 0.15)' : 'rgba(234, 179, 8, 0.1)',
                      color: '#D97706',
                      fontWeight: '800',
                      fontSize: '11px',
                      marginBottom: '4px'
                    }}>
                      {cert.honorsTitleAr}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      {cert.courseNameAr}
                    </div>
                  </div>

                  {/* Serial, Date & Verification Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '11.5px',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontWeight: '700' }}>
                      {cert.certNumber || cert.serialId}
                    </span>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#10B981',
                      fontWeight: '800'
                    }}>
                      <ShieldCheck size={13} />
                      <span>{lang === 'ar' ? 'معتمدة وموقعة' : 'Verified'}</span>
                    </span>
                  </div>

                  {/* Action Buttons: Preview & WhatsApp Image Share ONLY */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    marginTop: '2px'
                  }}>
                    <button
                      onClick={() => setPreviewCert(cert)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--primary-surface)',
                        color: 'var(--primary)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      <FileCheck size={14} />
                      <span>{lang === 'ar' ? 'معاينة' : 'Preview'}</span>
                    </button>

                    <button
                      onClick={() => handleShareRowWhatsApp(cert)}
                      disabled={isRowSharing}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        backgroundColor: '#25D366',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        cursor: isRowSharing ? 'wait' : 'pointer',
                        opacity: isRowSharing ? 0.75 : 1,
                        boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
                      }}
                    >
                      {isRowSharing ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />}
                      <span>{isRowSharing ? (lang === 'ar' ? 'تجهيز...' : 'Preparing...') : (lang === 'ar' ? 'صورة واتساب' : 'WhatsApp')}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Desktop Table */
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '18px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: isRtl ? 'right' : 'left',
              fontSize: '13px'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontWeight: '800'
                }}>
                  <th style={{ padding: '16px 20px' }}>{lang === 'ar' ? 'رقم الشهادة والتاريخ' : 'Serial & Date'}</th>
                  <th style={{ padding: '16px 20px' }}>{lang === 'ar' ? 'اسم الطالب' : 'Student Name'}</th>
                  <th style={{ padding: '16px 20px' }}>{lang === 'ar' ? 'نوع التقدير والكورس' : 'Honors & Course'}</th>
                  <th style={{ padding: '16px 20px' }}>{lang === 'ar' ? 'النسبة المئوية' : 'Score'}</th>
                  <th style={{ padding: '16px 20px' }}>{lang === 'ar' ? 'حالة التوثيق' : 'Verification'}</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center' }}>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCerts.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <Award size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                      <div>{lang === 'ar' ? 'لا توجد شهادات مطابقة لخيارات البحث' : 'No matching certificates found'}</div>
                    </td>
                  </tr>
                ) : (
                  filteredCerts.map((cert) => {
                    const isRowSharing = sharingRowId === cert.id;
                    return (
                      <tr
                        key={cert.id}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                            {cert.certNumber || cert.serialId}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {cert.issueDate}
                          </div>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                            {cert.studentNameAr}
                          </div>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <div style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: isDark ? 'rgba(234, 179, 8, 0.15)' : 'rgba(234, 179, 8, 0.1)',
                            color: '#D97706',
                            fontWeight: '800',
                            fontSize: '11px',
                            marginBottom: '4px'
                          }}>
                            {cert.honorsTitleAr}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {cert.courseNameAr}
                          </div>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontSize: '15px', fontWeight: '900', color: '#10B981' }}>
                            {cert.gradePercent || cert.score}%
                          </div>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                            color: '#10B981',
                            fontSize: '11px',
                            fontWeight: '800'
                          }}>
                            <ShieldCheck size={13} />
                            <span>{lang === 'ar' ? 'معتمدة وموقعة' : 'Verified'}</span>
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            {/* Preview Certificate */}
                            <button
                              onClick={() => setPreviewCert(cert)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--primary-surface)',
                                color: 'var(--primary)',
                                border: '1px solid var(--border-subtle)',
                                fontSize: '12px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                transition: 'opacity 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                            >
                              <FileCheck size={14} />
                              <span>{lang === 'ar' ? 'معاينة' : 'Preview'}</span>
                            </button>

                            {/* WhatsApp Share as Image (3rd share button completely removed) */}
                            <button
                              onClick={() => handleShareRowWhatsApp(cert)}
                              disabled={isRowSharing}
                              title={lang === 'ar' ? 'مشاركة الشهادة كصورة عبر واتساب' : 'Share certificate image on WhatsApp'}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                backgroundColor: '#25D366',
                                color: '#FFFFFF',
                                border: 'none',
                                fontSize: '12px',
                                fontWeight: '800',
                                cursor: isRowSharing ? 'wait' : 'pointer',
                                opacity: isRowSharing ? 0.75 : 1,
                                boxShadow: '0 2px 8px rgba(37, 211, 102, 0.25)',
                                transition: 'opacity 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                            >
                              {isRowSharing ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />}
                              <span>{isRowSharing ? (lang === 'ar' ? 'جاري التجهيز...' : 'Preparing...') : (lang === 'ar' ? 'واتساب كـ صورة' : 'WhatsApp Image')}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Certificate Preview Modal (Master Student Design with PNG Export & WhatsApp Image Sharing) */}
      {formattedPreviewCert && (
        <CertificateModal
          selectedCert={formattedPreviewCert}
          onClose={() => setPreviewCert(null)}
          lang={lang}
        />
      )}

      {/* Issue Modal with Interactive Searchable Student Selector */}
      {showIssueModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(4, 25, 53, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 1100,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          direction: isRtl ? 'rtl' : 'ltr'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: isMobile ? '20px 16px' : '26px 28px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  {lang === 'ar' ? 'إصدار شهادة تقدير معتمدة' : 'Issue Certified Certificate'}
                </h3>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleIssueCertificate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Student Selector with Interactive Search */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'اختيار الطالب من قائمة طلابك المسجلين بالمقرر' : 'Select Student from Your Enrolled Course Students'} *
                </label>

                {/* Search Bar for Enrolled Students */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '8px'
                }}>
                  <Search size={14} color="var(--text-secondary)" />
                  <input
                    type="text"
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    placeholder={lang === 'ar' ? 'ابحث باسم الطالب أو رقم الهاتف...' : 'Search student by name or phone...'}
                    style={{
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '12.5px',
                      width: '100%',
                      fontFamily: 'inherit'
                    }}
                  />
                  {studentSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setStudentSearchQuery('')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Filterable Student Selection List */}
                <div style={{
                  maxHeight: '160px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  backgroundColor: 'var(--bg-subtle)'
                }}>
                  {filteredEnrolledStudents.length === 0 ? (
                    <div style={{ padding: '14px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {lang === 'ar' ? 'لا يوجد طالب يطابق هذا البحث' : 'No student matching this search'}
                    </div>
                  ) : (
                    filteredEnrolledStudents.map((st) => {
                      const isSelected = newCert.studentId === st.id;
                      return (
                        <div
                          key={st.id}
                          onClick={() => handleStudentSelect(st.id)}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-surface)',
                            border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: isSelected ? '800' : '600',
                              color: isSelected ? 'var(--primary)' : 'var(--text-primary)'
                            }}>
                              {st.nameAr}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                              <span>{st.gradeAr}</span>
                              <span>•</span>
                              <span style={{ direction: 'ltr' }}>{st.phone}</span>
                            </div>
                          </div>
                          {isSelected && (
                            <div style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--primary)',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Selected Student Confirmation Chip */}
                <div style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-surface)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11.5px',
                  color: 'var(--primary)',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <UserCheck size={14} />
                  <span>
                    {lang === 'ar'
                      ? `الطالب المختار: «${newCert.studentNameAr}» (${newCert.gradeAr})`
                      : `Selected Student: ${newCert.studentNameAr} (${newCert.gradeAr})`}
                  </span>
                </div>
              </div>

              {/* Course & Score in a 2-column Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'المقرر الدراسي' : 'Course'} *
                  </label>
                  <select
                    value={newCert.courseNameAr}
                    onChange={(e) => setNewCert({ ...newCert, courseNameAr: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: '700',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {TEACHER_COURSES.map(c => (
                      <option key={c.id} value={c.titleAr}>{c.titleAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'الدرجة المئوية (%)' : 'Score (%)'} *
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    required
                    value={newCert.gradePercent}
                    onChange={(e) => setNewCert({ ...newCert, gradePercent: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: '700',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Honors & Achievement Title */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'نوع التقدير واللقب الشرفي' : 'Honors Title'} *
                </label>
                <select
                  value={newCert.honorsTitleAr}
                  onChange={(e) => setNewCert({ ...newCert, honorsTitleAr: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="شهادة تميز وتفوق بالدرجة النهائية (Full Mark)">
                    {lang === 'ar' ? 'شهادة تميز وتفوق بالدرجة النهائية (Full Mark)' : 'Full Mark Honor'}
                  </option>
                  <option value="شهادة صدارة وبطل الدوري الأكاديمي">
                    {lang === 'ar' ? 'شهادة صدارة وبطل الدوري الأكاديمي' : 'League Champion'}
                  </option>
                  <option value="شهادة إتمام الكورس بمرتبة الشرف">
                    {lang === 'ar' ? 'شهادة إتمام الكورس بمرتبة الشرف' : 'Course Completion with Honors'}
                  </option>
                  <option value="شهادة اجتياز بنك الأسئلة والامتحانات الشاملة">
                    {lang === 'ar' ? 'شهادة اجتياز بنك الأسئلة والامتحانات الشاملة' : 'Comprehensive Question Bank Mastery'}
                  </option>
                </select>
              </div>

              {/* Actions Bar */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 22px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-primary)'
                  }}
                >
                  <Award size={15} />
                  <span>{lang === 'ar' ? 'إصدار واعتماد الشهادة' : 'Issue & Certify'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
