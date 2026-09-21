import React, { useState, useEffect, forwardRef } from 'react';
import QRCode from 'qrcode';
import { UserCheck, Trophy } from 'lucide-react';

/**
 * OfficialCertificateDocument
 * - Official Motafawweq platform logo placed cleanly in the white area (left: 175px) & enlarged
 * - Official Academic Metrics Badge: Displays completion percentage, score, rank (top 3) and points
 * - High-speed offline QR code generation (zero external CORS or network delays)
 * - Proportional vertical rhythm (moderate, natural spacing between lines)
 * - Straight lines only (no slanted/rotated signature text)
 * - Clean background (no blurred watermark text)
 * - Signature placed cleanly beside QR code
 * - Fully bilingual (Arabic RTL / English LTR)
 * - Strictly Motafawweq platform brand colors (#1588C7, #06254E, #5CB6DB)
 */
export const OfficialCertificateDocument = forwardRef(({
  cert,
  lang = 'ar',
  isMini = false,
  className = ''
}, ref) => {
  if (!cert) return null;

  const [localQr, setLocalQr] = useState('');

  const isAr = lang === 'ar';
  const isTeacher = cert.issuerType === 'teacher' || cert.category === 'teacher';
  const isLeague = cert.issuerType === 'league' || cert.category === 'league';

  const studentName = isAr
    ? (cert.studentNameAr || 'عبدالرحمن حسن')
    : (cert.studentNameEn || 'Abdulrahman Hassan');

  const courseName = isAr
    ? (cert.courseNameAr || cert.titleAr || 'الرياضيات للصف الثالث الثانوي')
    : (cert.courseNameEn || cert.titleEn || 'Mathematics - 3rd Secondary (Thanawya Amma)');

  const completionDate = isAr
    ? (cert.completionDate || '15 سبتمبر 2026')
    : (cert.completionDateEn || 'September 15, 2026');

  const instructorName = isAr
    ? (cert.instructorAr || cert.issuerNameAr || 'د. سلمى السيد')
    : (cert.instructorEn || cert.issuerNameEn || 'Dr. Salma El-Sayed');

  const score = isAr ? (cert.score || '98.5%') : (cert.scoreEn || '98.5%');
  const serialId = cert.serialId || 'MTF-2026-MATH-99482';
  const qrCodeUrl = cert.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://motafawweq.me/verify/${serialId}`;

  // Generate offline base64 QR code for instant PNG export with 0 CORS issues
  useEffect(() => {
    const targetUrl = cert.verificationUrl || `https://motafawweq.me/verify/${serialId}`;
    QRCode.toDataURL(targetUrl, {
      margin: 1,
      width: isMini ? 80 : 180,
      color: {
        dark: '#06254E',
        light: '#FFFFFF'
      }
    })
      .then((url) => setLocalQr(url))
      .catch(() => {});
  }, [cert.verificationUrl, serialId, isMini]);

  // Content localization
  const content = {
    ar: {
      headerTitle: isLeague
        ? 'شهادة تفوق وريادة في دوري الأبطال'
        : isTeacher
          ? 'شهادة إنجاز واجتياز كورس معتمد'
          : 'شهادة إتمام وتفوق أكاديمي',
      intro: isLeague
        ? 'تقديراً للأداء الاستثنائي والجهد العلمي الفارق، يُشهد بأن المتفوق:'
        : isTeacher
          ? 'يشهد الأستاذ المشرف عبر منصة متفوّق التعليمية المعتمدة بأن الطالب:'
          : 'يشهد مجلس إدارة منظومة متفوّق التعليمية المعتمدة بأن الطالب:',
      clause: isLeague
        ? 'قد حقق الصدارة والمركز المتميز ضمن قائمة العشرة الأوائل في منافسات:'
        : isTeacher
          ? 'قد أتم بنجاح واقتدار متطلبات دراسة واختبارات المقرر التخصصي:'
          : 'قد اجتاز بنجاح واقتدار كافة متطلبات دراسة واختبارات المنهج الرسمي لمقرر:',
      accreditation: isLeague
        ? `دوري المتفوقين الوطني لطلاب الثانوية العامة على مستوى الجمهورية (بنتيجة ${score})`
        : isTeacher
          ? `بإشراف ${instructorName} ومطابق لمعايير الجودة والاعتماد لمنصة متفوّق`
          : 'المعتمد رسمياً وفق معايير وزارة التربية والتعليم والتعليم الفني',
      closingWish: isLeague
        ? 'مع تمنياتنا له بمواصلة التفوق واعتلاء منصات التكريم والريادة دوماً.'
        : isTeacher
          ? 'مع خالص التمنيات بدوام التفوق المستمر والتميز الأكاديمي والمهني.'
          : 'سائلين المولى عز وجل له دوام التوفيق والسداد والريادة في مسيرته العلمية والجامعية.',
      dateLabel: 'تاريخ الإصدار',
      sigLabel: isTeacher ? 'توقيع المعلم المشرف' : 'اعتماد إدارة المنصة',
      sigName: isTeacher ? instructorName : 'إدارة منصة متفوّق التعليمية',
      sealText1: isTeacher ? 'معتمد' : 'متفوق',
      sealText2: isTeacher ? 'المعلم' : 'اعتماد رسمي'
    },
    en: {
      headerTitle: isLeague
        ? 'Certificate of Distinction & League Championship'
        : isTeacher
          ? 'Certificate of Certified Course Completion'
          : 'Certificate of Academic Excellence',
      intro: isLeague
        ? 'In recognition of outstanding performance, this is to certify that:'
        : isTeacher
          ? 'The supervising educator and Motafawweq Platform certify that:'
          : 'The Academic Board of Motafawweq Educational Platform certifies that:',
      clause: isLeague
        ? 'Has achieved championship distinction and ranked in the National Top 10 in:'
        : isTeacher
          ? 'Has successfully completed all academic requirements for the course:'
          : 'Has successfully completed all requirements and official examinations for:',
      accreditation: isLeague
        ? `The National High School Student League with score (${score})`
        : isTeacher
          ? `Under the supervision of ${instructorName} on Motafawweq Platform`
          : 'Officially accredited according to Ministry of Education standards',
      closingWish: isLeague
        ? 'Wishing him continued distinction, leadership, and perpetual success.'
        : isTeacher
          ? 'Wishing him ongoing success and professional academic advancement.'
          : 'Wishing him continued success, brilliance, and leadership in his future journey.',
      dateLabel: 'Date of Issue',
      sigLabel: isTeacher ? 'Supervising Educator' : 'Platform Administration',
      sigName: isTeacher ? instructorName : 'Motafawweq Platform Administration',
      sealText1: isTeacher ? 'VERIFIED' : 'EXCELLENCE',
      sealText2: isTeacher ? 'TEACHER' : 'MOTAFAWWEQ'
    }
  }[lang] || {};

  return (
    <div
      ref={ref}
      className={`official-certificate-root ${className}`}
      style={{
        width: '100%',
        maxWidth: isMini ? '100%' : '960px',
        aspectRatio: '1.45 / 1',
        position: 'relative',
        backgroundColor: '#FFFFFF',
        color: '#06254E',
        borderRadius: isMini ? '14px' : '20px',
        overflow: 'hidden',
        boxShadow: isMini
          ? '0 6px 20px rgba(6, 37, 78, 0.08), 0 0 0 1px rgba(21, 136, 199, 0.12)'
          : '0 28px 70px -10px rgba(6, 37, 78, 0.28), 0 0 0 1px rgba(21, 136, 199, 0.18)',
        direction: isAr ? 'rtl' : 'ltr',
        userSelect: 'none',
        fontFamily: isAr ? 'var(--font-arabic), "Cairo", system-ui, sans-serif' : 'var(--font-heading), "Outfit", sans-serif'
      }}
    >
      {/* ── Background: Clean, luxury pearl white without any watermark text or blur ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFCFE 50%, #F3F8FD 100%)',
        zIndex: 1
      }} />

      {/* ── Fluid Vector Curves (Fixed on the Left side) ── */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '26%',
          height: '100%',
          zIndex: 3,
          pointerEvents: 'none'
        }}
        viewBox="0 0 240 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 0 L140 0 C110 130 30 220 60 340 C90 460 190 520 210 620 L0 620 Z"
          fill="url(#leftWaveDeep_v3)"
        />
        <path
          d="M0 0 L90 0 C55 140 10 240 38 360 C65 470 145 540 155 620 L0 620 Z"
          fill="url(#leftWaveVibrant_v3)"
        />
        <path
          d="M0 110 C28 175 48 250 40 330 C30 420 75 510 98 620 L0 620 Z"
          fill="url(#leftWaveSky_v3)"
          opacity="0.85"
        />
        <defs>
          <linearGradient id="leftWaveDeep_v3" x1="0" y1="0" x2="220" y2="620" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B3C68" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="leftWaveVibrant_v3" x1="0" y1="0" x2="160" y2="620" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="55%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
          <linearGradient id="leftWaveSky_v3" x1="0" y1="110" x2="100" y2="620" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── Soft Blue Curves on Bottom-Right Corner ── */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '20%',
          height: '38%',
          zIndex: 3,
          pointerEvents: 'none'
        }}
        viewBox="0 0 180 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M180 220 L50 220 C95 170 135 125 145 70 C150 35 165 10 180 0 Z"
          fill="url(#rightCornerWave1_v3)"
          opacity="0.38"
        />
        <path
          d="M180 220 L95 220 C125 180 150 150 165 110 C172 80 176 45 180 25 Z"
          fill="url(#rightCornerWave2_v3)"
          opacity="0.45"
        />
        <defs>
          <linearGradient id="rightCornerWave1_v3" x1="50" y1="220" x2="180" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="rightCornerWave2_v3" x1="95" y1="220" x2="180" y2="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0369A1" />
            <stop offset="100%" stopColor="#5CB6DB" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── TOP-LEFT: OFFICIAL MOTAFAWWEQ LOGO (Positioned in clean white area & enlarged) ── */}
      <div style={{
        position: 'absolute',
        top: isMini ? '16px' : '32px',
        left: isMini ? '68px' : '175px', // In pristine white zone to the right of the wave
        zIndex: 10,
        display: 'flex',
        alignItems: 'center'
      }}>
        <img
          src="/logo.png"
          alt="Motafawweq"
          style={{
            height: isMini ? '38px' : '72px', // Prominently enlarged as requested
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 3px 8px rgba(6, 37, 78, 0.12))'
          }}
        />
      </div>

      {/* ── TOP-RIGHT: Hanging Dark Navy Ribbon with 3D Gold Medal Seal ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: isMini ? '30px' : '65px',
        width: isMini ? '38px' : '72px',
        height: isMini ? '115px' : '220px',
        zIndex: 10,
        filter: 'drop-shadow(0 10px 16px rgba(6, 37, 78, 0.35))'
      }}>
        {/* Dark Navy Fabric Ribbon */}
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, #041935 0%, #06254E 55%, #0B3C68 100%)',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 88%, 0% 100%)',
          position: 'relative',
          borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          {/* Gold vertical pin-stripes */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: '15%',
            left: isMini ? '3px' : '5px',
            width: isMini ? '1px' : '2px',
            backgroundColor: '#F59E0B',
            opacity: 0.75
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: '15%',
            right: isMini ? '3px' : '5px',
            width: isMini ? '1px' : '2px',
            backgroundColor: '#F59E0B',
            opacity: 0.75
          }} />
        </div>

        {/* ── 3D Embossed Gold Medallion Seal ── */}
        <div style={{
          position: 'absolute',
          top: isMini ? '36px' : '74px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: isMini ? '48px' : '94px',
          height: isMini ? '48px' : '94px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #FFFBEB 0%, #FDE68A 25%, #F59E0B 55%, #D97706 80%, #92400E 100%)',
          boxShadow: '0 8px 24px rgba(180, 83, 9, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -3px 6px rgba(120, 53, 15, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: isMini ? '1.5px dashed #FDE68A' : '3px dashed #FDE68A'
        }}>
          <div style={{
            width: isMini ? '38px' : '78px',
            height: isMini ? '38px' : '78px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, #FEF3C7 0%, #F59E0B 70%, #B45309 100%)',
            border: isMini ? '1px solid rgba(255, 255, 255, 0.6)' : '2px solid rgba(255, 255, 255, 0.6)',
            boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2px'
          }}>
            {isTeacher ? (
              <UserCheck size={isMini ? 12 : 24} color="#78350F" strokeWidth={2.4} />
            ) : isLeague ? (
              <Trophy size={isMini ? 12 : 24} color="#78350F" strokeWidth={2.4} />
            ) : (
              <svg width={isMini ? "14" : "28"} height={isMini ? "12" : "24"} viewBox="0 0 32 26" fill="none">
                <path d="M16 2L1 9L16 16L31 9L16 2Z" fill="#78350F" />
                <path d="M7 12V20C7 22.5 11 24.5 16 24.5C21 24.5 25 22.5 25 20V12" stroke="#78350F" strokeWidth="2.4" fill="none" />
                <path d="M29 10.5V19" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
                <circle cx="29" cy="20.5" r="1.5" fill="#78350F" />
              </svg>
            )}

            <div style={{
              fontSize: isMini ? '4.5px' : '9px',
              fontWeight: '900',
              color: '#78350F',
              letterSpacing: '-0.2px',
              marginTop: '1px',
              lineHeight: 1
            }}>
              {content.sealText1}
            </div>
            <div style={{
              fontSize: isMini ? '3px' : '6px',
              fontWeight: '800',
              color: '#92400E',
              lineHeight: 1,
              marginTop: '1px'
            }}>
              {content.sealText2}
            </div>
          </div>
        </div>
      </div>

      {/* ── CENTER MAIN CONTENT: Beautiful, Natural Spacing (NOT crowded, NO Latin subtitle in Arabic) ── */}
      <div style={{
        position: 'absolute',
        top: isMini ? '24%' : '20%',
        left: isMini ? '12%' : '14%',
        right: isMini ? '12%' : '14%',
        zIndex: 8,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Certificate Title */}
        <h1 style={{
          fontSize: isMini ? '16px' : '32px',
          fontWeight: '900',
          color: '#06254E',
          margin: '0 0 6px 0',
          lineHeight: 1.25,
          letterSpacing: '-0.3px'
        }}>
          {content.headerTitle}
        </h1>

        {/* Granting Intro */}
        <div style={{
          fontSize: isMini ? '6.5px' : '14px',
          fontWeight: '700',
          color: '#475569',
          lineHeight: 1.4,
          marginBottom: isMini ? '4px' : '10px'
        }}>
          {content.intro}
        </div>

        {/* Recipient Student Name */}
        <div style={{
          position: 'relative',
          paddingBottom: isMini ? '3px' : '8px',
          marginBottom: isMini ? '4px' : '10px'
        }}>
          <div style={{
            fontSize: isMini ? '16px' : '34px',
            fontWeight: '900',
            color: '#0284C7',
            letterSpacing: '-0.5px',
            lineHeight: 1.2
          }}>
            {studentName}
          </div>
          {/* Horizontal Straight Line Underline */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '5%',
            right: '5%',
            height: isMini ? '1px' : '2px',
            background: 'linear-gradient(90deg, transparent 0%, #38BDF8 25%, #0284C7 50%, #38BDF8 75%, transparent 100%)'
          }} />
        </div>

        {/* Completion Clause */}
        <div style={{
          fontSize: isMini ? '6px' : '13px',
          fontWeight: '600',
          color: '#475569',
          lineHeight: 1.4,
          marginBottom: isMini ? '3px' : '6px'
        }}>
          {content.clause}
        </div>

        {/* Course / Subject Name */}
        <div style={{
          fontSize: isMini ? '10px' : '21px',
          fontWeight: '900',
          color: '#0369A1',
          lineHeight: 1.3,
          marginBottom: isMini ? '2px' : '6px'
        }}>
          {courseName}
        </div>

        {/* ── Official Academic Metrics & Achievement Badge (Rank, Points, Completion Rate, Exam Score) ── */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMini ? '5px' : '14px',
          padding: isMini ? '2.5px 8px' : '5px 18px',
          backgroundColor: 'rgba(21, 136, 199, 0.05)',
          border: '1px solid rgba(21, 136, 199, 0.22)',
          borderRadius: isMini ? '6px' : '12px',
          margin: isMini ? '1px 0 3px 0' : '2px 0 8px 0',
          maxWidth: '96%',
          boxShadow: isMini ? 'none' : '0 2px 6px rgba(6, 37, 78, 0.04)',
          flexWrap: 'nowrap'
        }}>
          {isLeague ? (
            <>
              {/* League Rank for Top 3 */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: isMini ? '2px' : '4px' }}>
                <span style={{ fontSize: isMini ? '5px' : '11.5px', fontWeight: '800', color: '#64748B' }}>
                  {isAr ? 'المركز:' : 'Rank:'}
                </span>
                <span style={{ fontSize: isMini ? '5.5px' : '12.5px', fontWeight: '900', color: '#0284C7' }}>
                  {isAr ? (cert.rankAr || 'المركز الأول 🥇') : (cert.rankEn || '1st Place 🥇')}
                </span>
              </div>

              {/* Straight Divider */}
              <div style={{ width: '1px', height: isMini ? '7px' : '12px', backgroundColor: 'rgba(21, 136, 199, 0.35)' }} />

              {/* League XP Points */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: isMini ? '2px' : '4px' }}>
                <span style={{ fontSize: isMini ? '5px' : '11.5px', fontWeight: '800', color: '#64748B' }}>
                  {isAr ? 'مجموع النقاط:' : 'Total XP:'}
                </span>
                <span style={{ fontSize: isMini ? '5.5px' : '12.5px', fontWeight: '900', color: '#06254E' }}>
                  {isAr ? (cert.pointsAr || '3,980 نقطة') : (cert.pointsEn || '3,980 XP')}
                </span>
              </div>

              {/* Straight Divider */}
              <div style={{ width: '1px', height: isMini ? '7px' : '12px', backgroundColor: 'rgba(21, 136, 199, 0.35)' }} />

              {/* Final Score */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: isMini ? '2px' : '4px' }}>
                <span style={{ fontSize: isMini ? '5px' : '11.5px', fontWeight: '800', color: '#64748B' }}>
                  {isAr ? 'النسبة:' : 'Score:'}
                </span>
                <span style={{ fontSize: isMini ? '5.5px' : '12.5px', fontWeight: '900', color: '#0284C7' }}>
                  {score}
                </span>
              </div>
            </>
          ) : isTeacher ? (
            <>
              {/* Teacher Course Completion Rate */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: isMini ? '2px' : '4px' }}>
                <span style={{ fontSize: isMini ? '5px' : '11.5px', fontWeight: '800', color: '#64748B' }}>
                  {isAr ? 'نسبة إتمام الكورس:' : 'Course Completion:'}
                </span>
                <span style={{ fontSize: isMini ? '5.5px' : '12.5px', fontWeight: '900', color: '#0284C7' }}>
                  {cert.completionRate || '100%'}
                </span>
              </div>

              {/* Straight Divider */}
              <div style={{ width: '1px', height: isMini ? '7px' : '12px', backgroundColor: 'rgba(21, 136, 199, 0.35)' }} />

              {/* Overall Evaluation Score */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: isMini ? '2px' : '4px' }}>
                <span style={{ fontSize: isMini ? '5px' : '11.5px', fontWeight: '800', color: '#64748B' }}>
                  {isAr ? 'التقييم العام:' : 'Overall Grade:'}
                </span>
                <span style={{ fontSize: isMini ? '5.5px' : '12.5px', fontWeight: '900', color: '#06254E' }}>
                  {score}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Ministry Curriculum Completion Rate */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: isMini ? '2px' : '4px' }}>
                <span style={{ fontSize: isMini ? '5px' : '11.5px', fontWeight: '800', color: '#64748B' }}>
                  {isAr ? 'نسبة إتمام المادة:' : 'Subject Completion:'}
                </span>
                <span style={{ fontSize: isMini ? '5.5px' : '12.5px', fontWeight: '900', color: '#0284C7' }}>
                  {cert.completionRate || '100%'}
                </span>
              </div>

              {/* Straight Divider */}
              <div style={{ width: '1px', height: isMini ? '7px' : '12px', backgroundColor: 'rgba(21, 136, 199, 0.35)' }} />

              {/* Official Ministry Exam Score */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: isMini ? '2px' : '4px' }}>
                <span style={{ fontSize: isMini ? '5px' : '11.5px', fontWeight: '800', color: '#64748B' }}>
                  {isAr ? 'نتيجة الامتحانات الوزارية:' : 'Ministry Exams:'}
                </span>
                <span style={{ fontSize: isMini ? '5.5px' : '12.5px', fontWeight: '900', color: '#06254E' }}>
                  {score}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Accreditation Clause */}
        <div style={{
          fontSize: isMini ? '6px' : '13px',
          fontWeight: '700',
          color: '#06254E',
          lineHeight: 1.4,
          marginBottom: isMini ? '3px' : '8px'
        }}>
          {content.accreditation}
        </div>

        {/* Well Wishes */}
        {!isMini && (
          <div style={{
            fontSize: '11.5px',
            fontWeight: '500',
            color: '#64748B',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.5
          }}>
            {content.closingWish}
          </div>
        )}
      </div>

      {/* ── BOTTOM ROW: In Safe White Zone (All lines straight, no tilted text) ── */}
      <div style={{
        position: 'absolute',
        bottom: isMini ? '14px' : '28px',
        left: isMini ? '55px' : '175px', // Starts in safe white zone to avoid left wave
        right: isMini ? '25px' : '65px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
      }}>
        {/* Clean QR Code */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px'
        }}>
          <div style={{
            padding: isMini ? '2px' : '4px',
            backgroundColor: '#FFFFFF',
            borderRadius: isMini ? '4px' : '6px',
            border: '1px solid #CBD5E1',
            boxShadow: '0 2px 6px rgba(6, 37, 78, 0.08)'
          }}>
            <img
              src={localQr || qrCodeUrl}
              crossOrigin="anonymous"
              alt="QR"
              style={{
                width: isMini ? '32px' : '56px',
                height: isMini ? '32px' : '56px',
                display: 'block'
              }}
            />
          </div>
        </div>

        {/* ── Official Signature beside QR Code (Straight lines, no tilted text) ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: isMini ? '2px' : '4px'
        }}>
          {/* Signature name in elegant straight typography */}
          <div style={{
            fontSize: isMini ? '9.5px' : '16px',
            fontWeight: '900',
            color: '#06254E',
            letterSpacing: '0.2px',
            marginBottom: isMini ? '2px' : '4px'
          }}>
            {content.sigName}
          </div>
          {/* Straight Horizontal Signature Line */}
          <div style={{
            width: isMini ? '70px' : '150px',
            height: '1.5px',
            backgroundColor: '#CBD5E1',
            marginBottom: isMini ? '2px' : '4px'
          }} />
          <div style={{
            fontSize: isMini ? '6px' : '10.5px',
            fontWeight: '800',
            color: '#64748B',
            letterSpacing: '0.2px'
          }}>
            {content.sigLabel}
          </div>
        </div>

        {/* Date of Issue with Clean Straight Vertical Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMini ? '4px' : '8px'
        }}>
          <div style={{
            fontSize: isMini ? '6.5px' : '11px',
            fontWeight: '800',
            color: '#06254E',
            textAlign: isAr ? 'right' : 'left',
            lineHeight: 1.3
          }}>
            <div style={{ color: '#64748B', fontSize: isMini ? '5.5px' : '9.5px', fontWeight: '700' }}>
              {content.dateLabel}
            </div>
            <div style={{ color: '#06254E' }}>
              {completionDate}
            </div>
          </div>
          <div style={{
            width: isMini ? '1.5px' : '2px',
            height: isMini ? '16px' : '28px',
            backgroundColor: '#0284C7',
            opacity: 0.8
          }} />
        </div>
      </div>
    </div>
  );
});

OfficialCertificateDocument.displayName = 'OfficialCertificateDocument';
