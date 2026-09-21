import React from 'react';
import { ShieldCheck, CheckCircle2, UserCheck, BookOpenCheck, Trophy } from 'lucide-react';

/**
 * CertificateEligibilityCard
 * - Zero green colors: Strictly uses Motafawweq platform brand colors (#1588C7, #06254E, #5CB6DB)
 * - Removed the "تهانينا!..." bottom banner completely as requested
 * - Fully bilingual: Arabic (RTL) / English (LTR)
 * - High-standard academic phrasing and refined typography
 */
export const CertificateEligibilityCard = ({ lang = 'ar' }) => {
  const isAr = lang === 'ar';

  const content = {
    ar: {
      badge: 'معايير الاعتماد الرسمي',
      title: 'ضوابط ومعايير استحقاق الشهادات المعتمدة',
      subtitle: 'تخضع الشهادات الصادرة عبر منصة متفوّق لمنظومة تدقيق وتوثيق رسمي برقم تسلسلي موثق وكود QR معتمد، وتُمنح وفق 3 مسارات أكاديمية:',
      tracks: [
        {
          id: 'teacher',
          trackNum: 'المسار 01',
          trackBadge: 'مقررات المعلمين المعتمدين',
          title: 'إتمام المقررات التخصصية للمعلم المشرف',
          requirement: 'إتمام 100% من المحاضرات المقررة، واجتياز الاختبارات التقييمية، واعتماد الواجبات والتطبيقات من قِبل المعلم المشرف.',
          documentType: 'شهادة إتمام وتفوق معتمدة وموقعة رقمياً من المعلم الخبير ومنصة متفوّق.',
          status: 'مستوفى الشروط • الشهادة موثقة وجاهزة',
          icon: UserCheck
        },
        {
          id: 'ministry',
          trackNum: 'المسار 02',
          trackBadge: 'مناهج وزارة التربية والتعليم',
          title: 'اجتياز المنهج والامتحانات الرسمية النازلة على المنصة',
          requirement: 'استكمال كامل مفردات المنهج الدراسي واجتياز الامتحانات الوزارية المعتمدة على المنصة بنسبة نجاح لا تقل عن 80%.',
          documentType: 'شهادة إتمام دراسي رسمية مطابقة لمواصفات وزارة التربية والتعليم والتعليم الفني.',
          status: 'مستوفى الشروط • اعتماد أكاديمي وزاري',
          icon: BookOpenCheck
        },
        {
          id: 'league',
          trackNum: 'المسار 03',
          trackBadge: 'بطولات دوري المتفوقين',
          title: 'الصدارة والترتيب ضمن العشرة الأوائل على مستوى الجمهورية',
          requirement: 'إحراز الصدارة أو تحقيق مركز متقدم ضمن قائمة العشرة الأوائل (Top 10) في الترتيب العام لدوري المتفوقين الوطني.',
          documentType: 'شهادة التميز الشرفية ووسام صدارة الترتيب ممهورة بختم مسابقات المنصة الرسمي.',
          status: 'مستوفى الشروط • الحائز على صدارة الترتيب',
          icon: Trophy
        }
      ]
    },
    en: {
      badge: 'Official Accreditation Standards',
      title: 'Certificate Eligibility Standards & Guidelines',
      subtitle: 'Certificates issued by Motafawweq Platform undergo official academic verification with authenticated serial IDs and QR codes across 3 tracks:',
      tracks: [
        {
          id: 'teacher',
          trackNum: 'Track 01',
          trackBadge: 'Certified Teacher Courses',
          title: 'Completion of Specialized Educator Courses',
          requirement: 'Complete 100% of required lectures, pass periodic assessments, and receive assignment approvals from the supervising educator.',
          documentType: 'Certified completion credential digitally authenticated by the educator and Motafawweq.',
          status: 'Criteria Met • Certified & Ready',
          icon: UserCheck
        },
        {
          id: 'ministry',
          trackNum: 'Track 02',
          trackBadge: 'Ministry of Education Curriculum',
          title: 'Official Syllabus & Accredited Platform Examinations',
          requirement: 'Complete the full subject curriculum syllabus and pass accredited official platform examinations with 80%+ score.',
          documentType: 'Official curriculum completion credential complying with Ministry of Education standards.',
          status: 'Criteria Met • Official Ministry Verification',
          icon: BookOpenCheck
        },
        {
          id: 'league',
          trackNum: 'Track 03',
          trackBadge: 'National Student League',
          title: 'Championship & National Top 10 Distinction',
          requirement: 'Achieve 1st place championship or rank within the National Top 10 in the Motafawweq Student League.',
          documentType: 'Honorary distinction award and national championship shield authenticated with the official platform seal.',
          status: 'Criteria Met • National Rank Distinction',
          icon: Trophy
        }
      ]
    }
  }[lang] || {};

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '22px',
        padding: '26px 28px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-sm)',
        direction: isAr ? 'rtl' : 'ltr',
        fontFamily: isAr ? 'var(--font-arabic), "Cairo", system-ui, sans-serif' : 'var(--font-latin), "Inter", sans-serif'
      }}
    >
      {/* ── Section Header ── */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '11px',
            backgroundColor: 'rgba(21, 136, 199, 0.1)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: '800',
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: isAr ? '0' : '0.5px',
              marginBottom: '2px'
            }}>
              {content.badge}
            </div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.3
            }}>
              {content.title}
            </h2>
          </div>
        </div>

        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          margin: '4px 0 0 0',
          lineHeight: 1.6
        }}>
          {content.subtitle}
        </p>
      </div>

      {/* ── 3 Tracks Grid (Strictly Motafawweq Brand Colors - ZERO Green) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '16px'
      }}>
        {content.tracks.map((track) => {
          const IconComponent = track.icon;
          return (
            <div
              key={track.id}
              style={{
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(21, 136, 199, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                {/* Track Badge & Icon */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '900',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF'
                    }}>
                      {track.trackNum}
                    </span>
                    <span style={{
                      fontSize: '11.5px',
                      fontWeight: '800',
                      color: 'var(--primary)'
                    }}>
                      {track.trackBadge}
                    </span>
                  </div>

                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(21, 136, 199, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}>
                    <IconComponent size={16} />
                  </div>
                </div>

                {/* Track Title */}
                <h3 style={{
                  fontSize: '14.5px',
                  fontWeight: '900',
                  color: 'var(--text-primary)',
                  margin: '0 0 10px 0',
                  lineHeight: 1.35
                }}>
                  {track.title}
                </h3>

                {/* Requirement */}
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '10px'
                }}>
                  <strong style={{ color: 'var(--text-primary)', fontWeight: '800' }}>
                    {isAr ? 'الضابط الأكاديمي: ' : 'Academic Requirement: '}
                  </strong>
                  <span>{track.requirement}</span>
                </div>

                {/* Document Type */}
                <div style={{
                  fontSize: '11.5px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  marginBottom: '16px'
                }}>
                  <strong style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>
                    {isAr ? 'الاعتماد: ' : 'Credential: '}
                  </strong>
                  <span>{track.documentType}</span>
                </div>
              </div>

              {/* Status Pill in Platform Blue (#1588C7) - ZERO GREEN */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(21, 136, 199, 0.08)',
                color: 'var(--primary)',
                fontSize: '11.5px',
                fontWeight: '800',
                border: '1px solid rgba(21, 136, 199, 0.2)'
              }}>
                <CheckCircle2 size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>{track.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
