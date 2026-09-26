import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { TEACHER_CERTIFICATES, TEACHER_COURSES } from '../../data/teacherData';
import { CertificateModal } from '../../features/student/certificates/CertificateModal';
import {
  Award,
  Plus,
  Search,
  CheckCircle2,
  ExternalLink,
  Printer,
  Download,
  QrCode,
  ShieldCheck,
  Sparkles,
  X,
  Share2,
  FileCheck,
  MessageCircle,
  Copy,
  Check
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
  const [copiedId, setCopiedId] = useState(null);

  // New certificate form state: student selected from roster, no school/gov
  const [newCert, setNewCert] = useState({
    studentId: ENROLLED_STUDENTS[0].id,
    studentNameAr: ENROLLED_STUDENTS[0].nameAr,
    studentNameEn: ENROLLED_STUDENTS[0].nameEn,
    studentEmail: ENROLLED_STUDENTS[0].email,
    gradeAr: ENROLLED_STUDENTS[0].gradeAr,
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
      gradeAr: st.gradeAr
    }));
  };

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

  const handleCopyLink = (certNumber) => {
    setCopiedId(certNumber);
    navigator.clipboard?.writeText(`https://motafawweq.me/verify/${certNumber}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleShareRowWhatsApp = (cert) => {
    const studentName = cert.studentNameAr || 'الطالب';
    const courseName = cert.courseNameAr || 'المقرر';
    const scoreVal = cert.score || `${cert.gradePercent}%`;
    const serialCode = cert.certNumber || cert.serialId || 'MTF-2026';
    const verifyUrl = cert.verificationUrl || `https://motafawweq.me/verify/${serialCode}`;

    const message = `شهادة تقدير وتفوق معتمدة من منصة متفوّق 🎓\n\nنبارك للطالب المتفوق: *${studentName}*\nواجتيازه بتفوق مقرر: *${courseName}* بنسبة ${scoreVal}\n\nرقم التوثيق الرسمي: ${serialCode}\nرابط التحقق من صحة الشهادة واعتمادها:\n${verifyUrl}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  // Prepares cert object with standard fields for OfficialCertificateDocument
  const formattedPreviewCert = useMemo(() => {
    if (!previewCert) return null;
    const serial = previewCert.certNumber || previewCert.serialId || 'MTF-BIO-2026-0891';
    return {
      ...previewCert,
      id: previewCert.id,
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
      titleAr: previewCert.honorsTitleAr || 'شهادة تميز وتفوق بالدرجة النهائية (Full Mark)',
      titleEn: 'Certificate of Certified Course Completion',
      courseNameAr: previewCert.courseNameAr,
      courseNameEn: previewCert.courseNameAr,
      studentNameAr: previewCert.studentNameAr,
      studentNameEn: previewCert.studentNameEn || previewCert.studentNameAr,
      gradeAr: previewCert.gradeAr || 'الصف الثالث الثانوي 2026',
      completionDate: previewCert.issueDate || '27 سبتمبر 2026',
      score: previewCert.score || `${previewCert.gradePercent}%`,
      scoreEn: `${previewCert.gradePercent}%`,
      verificationUrl: previewCert.verificationUrl || `https://motafawweq.me/verify/${serial}`,
      status: 'verified'
    };
  }, [previewCert]);

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '32px 24px 80px',
      fontFamily: 'var(--font-arabic)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(234, 179, 8, 0.16)' : 'rgba(234, 179, 8, 0.12)',
              color: '#EAB308',
              fontSize: '11px',
              fontWeight: '800'
            }}>
              <Award size={13} />
              <span>{lang === 'ar' ? 'إصدار وتوثيق الشهادات المعتمدة' : 'Official Certificates Hub'}</span>
            </span>
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            letterSpacing: '-0.3px'
          }}>
            {lang === 'ar' ? 'سجل واعتماد شهادات التقدير والدرجات النهائية' : 'Issued Honors & Course Certificates'}
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            {lang === 'ar'
              ? 'إصدار وتوقيع شهادات التفوق رقمياً لطلاب المراكز والأكاديمية مع رمز التحقق الذكي (QR Code)'
              : 'Issue and sign certified certificates for top students with cryptographic QR verification.'}
          </p>
        </div>

        <button
          onClick={() => setShowIssueModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 102, 204, 0.25)',
            transition: 'all 0.2s'
          }}
        >
          <Plus size={16} />
          <span>{lang === 'ar' ? 'إصدار شهادة تقدير جديدة' : 'Issue New Certificate'}</span>
        </button>
      </div>

      {/* Top Stats Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div style={{
          backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
          borderRadius: '16px',
          border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
          padding: '18px 20px'
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
          backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
          borderRadius: '16px',
          border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
          padding: '18px 20px'
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
          backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
          borderRadius: '16px',
          border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
          padding: '18px 20px'
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
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '22px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
          border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
          borderRadius: '12px',
          padding: '4px 14px',
          minWidth: '280px',
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
              padding: '8px 0'
            }}
          />
        </div>

        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
            border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
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

      {/* Certificates Table */}
      <div style={{
        backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
        borderRadius: '20px',
        border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
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
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
                borderBottom: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
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
              {filteredCerts.map((cert) => (
                <tr
                  key={cert.id}
                  style={{
                    borderBottom: `1px solid ${isDark ? 'var(--border-subtle)' : '#F1F5F9'}`,
                    transition: 'background-color 0.15s'
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setPreviewCert(cert)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
                          color: '#3B82F6',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        <FileCheck size={14} />
                        <span>{lang === 'ar' ? 'معاينة' : 'Preview'}</span>
                      </button>

                      <button
                        onClick={() => handleShareRowWhatsApp(cert)}
                        title={lang === 'ar' ? 'مشاركة عبر واتساب' : 'Share on WhatsApp'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(37, 211, 102, 0.12)',
                          color: '#10B981',
                          border: '1px solid rgba(37, 211, 102, 0.25)',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.22)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.12)'}
                      >
                        <MessageCircle size={14} color="#10B981" />
                        <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                      </button>

                      <button
                        onClick={() => handleCopyLink(cert.certNumber || cert.serialId)}
                        title={lang === 'ar' ? 'نسخ رابط التحقق' : 'Copy Verification Link'}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          backgroundColor: copiedId === (cert.certNumber || cert.serialId) ? '#10B981' : (isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'),
                          color: copiedId === (cert.certNumber || cert.serialId) ? '#FFFFFF' : 'var(--text-secondary)',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {copiedId === (cert.certNumber || cert.serialId) ? <Check size={14} /> : <Share2 size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Certificate Preview Modal (Master Student Design with PNG Export & WhatsApp Sharing) */}
      {formattedPreviewCert && (
        <CertificateModal
          selectedCert={formattedPreviewCert}
          onClose={() => setPreviewCert(null)}
          lang={lang}
        />
      )}

      {/* Issue Modal */}
      {showIssueModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1100,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '560px',
            padding: '28px',
            border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
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
              {/* Student Selector from Roster */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'اختيار الطالب (من قائمة الطلاب المسجلين بالمنصة)' : 'Select Student (Enrolled Roster)'} *
                </label>
                <select
                  value={newCert.studentId}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: `1.5px solid ${isDark ? 'var(--border-subtle)' : '#CBD5E1'}`,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {ENROLLED_STUDENTS.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.nameAr} — {st.gradeAr}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '11.5px', color: 'var(--primary)', fontWeight: '700', marginTop: '5px' }}>
                  {lang === 'ar'
                    ? `الاسم المعتمد على الشهادة: «${newCert.studentNameAr}»`
                    : `Official Name on Certificate: ${newCert.studentNameAr}`}
                </div>
              </div>

              {/* Course & Score in a 2-column Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
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
                      border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
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
                      border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
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
                    border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? 'var(--border-medium)' : '#E2E8F0'}`,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
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
                    boxShadow: '0 4px 14px rgba(21, 136, 199, 0.35)'
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
