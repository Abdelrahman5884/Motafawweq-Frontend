import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { TEACHER_CERTIFICATES, TEACHER_COURSES } from '../../data/teacherData';
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
  FileCheck
} from 'lucide-react';

export const TeacherCertificatesView = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  const [certificates, setCertificates] = useState(TEACHER_CERTIFICATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [previewCert, setPreviewCert] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // New certificate form state
  const [newCert, setNewCert] = useState({
    studentNameAr: '',
    studentEmail: '',
    courseNameAr: TEACHER_COURSES[0]?.titleAr || '',
    gradePercent: 95,
    honorsTitleAr: 'شهادة تميز وتفوق بالدرجة النهائية (Full Mark)',
    schoolAr: ''
  });

  const filteredCerts = certificates.filter(c => {
    const matchesSearch = c.studentNameAr.includes(searchQuery) || c.certNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = filterCourse === 'all' || c.courseNameAr.includes(filterCourse);
    return matchesSearch && matchesCourse;
  });

  const handleIssueCertificate = (e) => {
    e.preventDefault();
    if (!newCert.studentNameAr.trim()) return;

    const issued = {
      id: `cert-issue-${Date.now()}`,
      certNumber: `MTF-BIO-2026-08${Math.floor(10 + Math.random() * 89)}`,
      studentNameAr: newCert.studentNameAr,
      studentEmail: newCert.studentEmail || 'student@motafawweq.me',
      schoolAr: newCert.schoolAr || 'مدرسة المتفوقين الرسمية',
      courseNameAr: newCert.courseNameAr,
      gradePercent: Number(newCert.gradePercent),
      honorsTitleAr: newCert.honorsTitleAr,
      issueDate: new Date().toISOString().split('T')[0],
      qrCodeUrl: 'https://motafawweq.me/verify/certificate',
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
                <th style={{ padding: '16px 20px' }}>{lang === 'ar' ? 'اسم الطالب والمدرسة' : 'Student & School'}</th>
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
                      {cert.certNumber}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {cert.issueDate}
                    </div>
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                      {cert.studentNameAr}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {cert.schoolAr}
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
                      {cert.gradePercent}%
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
                        onClick={() => handleCopyLink(cert.certNumber)}
                        title={lang === 'ar' ? 'نسخ رابط التحقق' : 'Copy Verification Link'}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          backgroundColor: copiedId === cert.certNumber ? '#10B981' : (isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'),
                          color: copiedId === cert.certNumber ? '#FFFFFF' : 'var(--text-secondary)',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {previewCert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1100,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            color: '#0F172A',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '780px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            border: '6px solid #D97706'
          }}>
            {/* Modal Actions Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px',
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#64748B' }}>
                {lang === 'ar' ? 'معاينة الشهادة الرسمية للطباعة والتصدير' : 'Official Certificate Document'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={14} />
                  <span>{lang === 'ar' ? 'طباعة' : 'Print'}</span>
                </button>

                <button
                  onClick={() => setPreviewCert(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Certificate Body (Prestige Border & Golden Accents) */}
            <div style={{
              padding: '40px 36px',
              textAlign: 'center',
              position: 'relative',
              background: 'linear-gradient(180deg, #FFFDF8 0%, #FFFFFF 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <Award size={28} color="#D97706" />
                <span style={{ fontSize: '16px', fontWeight: '900', color: '#D97706', letterSpacing: '1px' }}>
                  MOTAFAWWEQ PLATFORM • منصة المتفوق
                </span>
              </div>

              <h2 style={{
                fontSize: '26px',
                fontWeight: '900',
                color: '#1E293B',
                margin: '0 0 4px 0',
                letterSpacing: '-0.5px'
              }}>
                شهادة تميز وتقدير أكاديمي
              </h2>
              <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
                Certificate of Academic Excellence & Full Mark Achievement
              </div>

              <p style={{ fontSize: '15px', color: '#475569', margin: '0 0 8px 0' }}>
                تشهد إدارة منصة المتفوق التعليمية وسلسلة كورسات الأحياء بأن الطالب / الطالبة:
              </p>

              <div style={{
                fontSize: '28px',
                fontWeight: '900',
                color: '#0066CC',
                margin: '0 0 6px 0',
                textDecoration: 'underline',
                textUnderlineOffset: '6px'
              }}>
                {previewCert.studentNameAr}
              </div>
              <div style={{ fontSize: '14px', color: '#64748B', fontWeight: '700', marginBottom: '18px' }}>
                {previewCert.schoolAr}
              </div>

              <p style={{ fontSize: '15px', color: '#334155', maxWidth: '600px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                قد أتم بنجاح وتفوق باهر متطلبات مقرر: <strong>{previewCert.courseNameAr}</strong>
                <br />
                وحصل على نسبة <strong>{previewCert.gradePercent}%</strong> ومُنح <strong>{previewCert.honorsTitleAr}</strong>.
              </p>

              {/* Signatures and QR Verification */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px dashed #CBD5E1'
              }}>
                {/* QR Code */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: isRtl ? 'right' : 'left' }}>
                  <div style={{
                    padding: '8px',
                    borderRadius: '12px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0'
                  }}>
                    <QrCode size={48} color="#0F172A" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A' }}>
                      التحقق الفوري المشفر
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'monospace' }}>
                      {previewCert.certNumber}
                    </div>
                    <div style={{ fontSize: '10px', color: '#10B981', fontWeight: '700' }}>
                      ✓ موثقة رسمياً
                    </div>
                  </div>
                </div>

                {/* Teacher Stamp & Signature */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '900',
                    color: '#0066CC',
                    fontFamily: 'cursive',
                    marginBottom: '2px'
                  }}>
                    د. سلمى السيد
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#1E293B' }}>
                    كبير معلمي الأحياء والمشرفة الأكاديمية
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>
                    التاريخ: {previewCert.issueDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issue Modal */}
      {showIssueModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1100,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '560px',
            padding: '28px',
            border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'إصدار شهادة تقدير معتمدة' : 'Issue Certified Certificate'}
              </h3>
              <button
                onClick={() => setShowIssueModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleIssueCertificate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'اسم الطالب الكامل' : 'Student Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: يوسف أحمد الشناوي' : 'e.g. Youssef Ahmed'}
                  value={newCert.studentNameAr}
                  onChange={(e) => setNewCert({ ...newCert, studentNameAr: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'المدرسة / المحافظة' : 'School / Governorate'}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'ar' ? 'مثال: الأورمان التجريبية، الجيزة' : 'e.g. Al-Orman Exp.'}
                    value={newCert.schoolAr}
                    onChange={(e) => setNewCert({ ...newCert, schoolAr: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'الدرجة المئوية (%)' : 'Score Percentage (%)'}
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="100"
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
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'المقرر الدراسي' : 'Course'}
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
                    outline: 'none'
                  }}
                >
                  {TEACHER_COURSES.map(c => (
                    <option key={c.id} value={c.titleAr}>{c.titleAr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'لقب الشرف والتقدير' : 'Honors Title'}
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
                    outline: 'none'
                  }}
                >
                  <option value="شهادة تميز وتفوق بالدرجة النهائية (Full Mark)">{lang === 'ar' ? 'شهادة تميز وتفوق بالدرجة النهائية (Full Mark)' : 'Full Mark Honor'}</option>
                  <option value="شهادة صدارة وبطل الدوري الأكاديمي">{lang === 'ar' ? 'شهادة صدارة وبطل الدوري الأكاديمي' : 'League Champion'}</option>
                  <option value="شهادة إتمام الكورس بمرتبة الشرف">{lang === 'ar' ? 'شهادة إتمام الكورس بمرتبة الشرف' : 'Course Completion with Honors'}</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                    color: 'var(--text-secondary)',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,102,204,0.3)'
                  }}
                >
                  {lang === 'ar' ? 'إصدار وتوقيع الشهادة' : 'Issue & Sign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
