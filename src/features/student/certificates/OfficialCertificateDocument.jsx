import React, { useState, useEffect, useLayoutEffect, useRef, useId, forwardRef } from 'react';
import QRCode from 'qrcode';
import { UserCheck, Trophy } from 'lucide-react';

function resolveVerifyUrl(cert, serialId) {
  if (cert?.verificationUrl) return cert.verificationUrl;
  const origin = typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : '';
  const path = cert?.verifyPath || `/verify/${encodeURIComponent(serialId)}`;
  return origin ? `${origin}${path}` : path;
}

/**
 * OfficialCertificateDocument
 * - Fixed Master Certificate Design (960x662) with dynamic ResizeObserver scaling
 * - Unique SVG gradient IDs via React useId() (zero multi-card ID collisions)
 * - Offline base64 QR code via `qrcode` pointing to the live verification URL
 * - Full-resolution export mode (isExport = true) for crisp PNG downloads
 */
export const OfficialCertificateDocument = forwardRef(({
  cert,
  lang = 'ar',
  className = '',
  style = {},
  isExport = false,
  onQrReady,
}, ref) => {
  const containerRef = useRef(null);
  const uid = useId().replace(/:/g, '');
  const [scale, setScale] = useState(1);
  const [localQr, setLocalQr] = useState('');

  const BASE_WIDTH = 960;
  const BASE_HEIGHT = 662;

  useLayoutEffect(() => {
    if (isExport) return;
    const updateScale = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        if (w > 0) {
          setScale(w / BASE_WIDTH);
        }
      }
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    window.addEventListener('resize', updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [isExport]);

  const serialId = cert?.serialId || cert?.certificateNumber || cert?.certNumber || '';
  const targetUrl = cert ? resolveVerifyUrl(cert, serialId) : '';

  useEffect(() => {
    if (!cert || !targetUrl) return;
    let active = true;
    QRCode.toDataURL(targetUrl, {
      margin: 1,
      width: 220,
      color: {
        dark: '#06254E',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (!active) return;
        setLocalQr(url);
        onQrReady?.(url);
      })
      .catch(() => {
        if (active) onQrReady?.('');
      });

    return () => {
      active = false;
    };
  }, [cert, targetUrl, onQrReady]);

  if (!cert) return null;

  const isAr = lang === 'ar';
  const isTeacher = cert.issuerType === 'teacher' || cert.category === 'teacher';
  const isLeague = cert.issuerType === 'league' || cert.category === 'league';

  const studentName = isAr
    ? cert.studentNameAr || '—'
    : cert.studentNameEn || cert.studentNameAr || '—';

  const courseName = isAr
    ? cert.courseNameAr || cert.courseTitleAr || cert.titleAr || '—'
    : cert.courseNameEn || cert.courseTitleEn || cert.courseNameAr || cert.titleEn || '—';

  const completionDate = isAr
    ? cert.completionDate || cert.issueDate || '—'
    : cert.completionDateEn || cert.completionDate || cert.issueDate || '—';

  const instructorName = isAr
    ? cert.instructorAr || cert.issuerNameAr || 'إدارة منصة متفوّق التعليمية'
    : cert.instructorEn || cert.issuerNameEn || cert.instructorAr || 'Motafawweq Platform Administration';

  const score = isAr
    ? cert.score || (cert.gradePercent ? `${cert.gradePercent}%` : '—')
    : cert.scoreEn || cert.score || (cert.gradePercent ? `${cert.gradePercent}%` : '—');

  const completionRate = cert.completionRate || '100%';

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
          ? 'يشهد المعلم المشرف عبر منصة متفوّق التعليمية المعتمدة بأن الطالب:'
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
          : 'المعتمد رسمياً وفق معايير الجودة الأكاديمية لمنصة متفوّق التعليمية',
      closingWish: isLeague
        ? 'مع تمنياتنا له بمواصلة التفوق واعتلاء منصات التكريم والريادة دوماً.'
        : isTeacher
          ? 'مع خالص التمنيات بدوام التفوق المستمر والتميز الأكاديمي والمهني.'
          : 'سائلين المولى عز وجل له دوام التوفيق والسداد والريادة في مسيرته العلمية.',
      dateLabel: 'تاريخ الإصدار',
      sigLabel: isTeacher ? 'توقيع المعلم المشرف' : 'اعتماد إدارة المنصة',
      sigName: isTeacher ? instructorName : 'إدارة منصة متفوّق التعليمية',
      sealText1: isTeacher ? 'معتمد' : 'متفوق',
      sealText2: isTeacher ? 'المعلم' : 'اعتماد رسمي',
      scanLabel: 'مسح للتحقق الرسمي',
    },
    en: {
      headerTitle: isLeague
        ? 'CHAMPIONS LEAGUE EXCELLENCE AWARD'
        : isTeacher
          ? 'CERTIFICATE OF COURSE COMPLETION'
          : 'CERTIFICATE OF ACADEMIC EXCELLENCE',
      intro: isLeague
        ? 'In recognition of outstanding performance and intellectual leadership, this certifies that:'
        : isTeacher
          ? 'The supervising educator through Motafawweq Platform proudly certifies that:'
          : 'The Board of Directors of Motafawweq Educational Platform certifies that:',
      clause: isLeague
        ? 'Has earned distinction among the National Top 10 High-Honor Scholars in:'
        : isTeacher
          ? 'Has successfully accomplished all coursework and examinations for the course:'
          : 'Has successfully fulfilled all official academic requirements and examinations for:',
      accreditation: isLeague
        ? `National Honors League Championship (Final Score: ${score})`
        : isTeacher
          ? `Supervised by ${instructorName} & Accredited by Motafawweq Educational Standards`
          : 'Accredited under Motafawweq Educational Quality & Academic Standards',
      closingWish: isLeague
        ? 'Wishing continued brilliance, academic distinction, and lifelong leadership.'
        : isTeacher
          ? 'Wishing continued academic distinction and remarkable career milestones.'
          : 'Wishing enduring success, scholarly leadership, and distinguished advancement.',
      dateLabel: 'Date of Issue',
      sigLabel: isTeacher ? 'Supervising Educator' : 'Platform Administration',
      sigName: isTeacher ? instructorName : 'Motafawweq Platform Administration',
      sealText1: isTeacher ? 'VERIFIED' : 'EXCELLENCE',
      sealText2: isTeacher ? 'TEACHER' : 'MOTAFAWWEQ',
      scanLabel: 'Scan for Verification',
    },
  }[lang] || {};

  const gradDeep = `lwDeep_${uid}`;
  const gradVibrant = `lwVibrant_${uid}`;
  const gradSky = `lwSky_${uid}`;
  const gradCorner1 = `rcWave1_${uid}`;
  const gradCorner2 = `rcWave2_${uid}`;

  return (
    <div
      ref={containerRef}
      className={`official-certificate-container ${className}`}
      style={{
        width: isExport ? `${BASE_WIDTH}px` : '100%',
        maxWidth: `${BASE_WIDTH}px`,
        height: isExport ? `${BASE_HEIGHT}px` : `${Math.round(BASE_HEIGHT * scale)}px`,
        aspectRatio: `${BASE_WIDTH} / ${BASE_HEIGHT}`,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: isExport ? '20px' : `${Math.max(6, Math.round(18 * scale))}px`,
        boxShadow: isExport
          ? 'none'
          : '0 14px 40px -8px rgba(6, 37, 78, 0.18), 0 0 0 1px rgba(21, 136, 199, 0.16)',
        backgroundColor: '#FFFFFF',
        ...style,
      }}
    >
      {/* Internal Master 960x662 Canvas */}
      <div
        ref={ref}
        className="official-certificate-canvas"
        style={{
          width: `${BASE_WIDTH}px`,
          height: `${BASE_HEIGHT}px`,
          position: 'absolute',
          top: 0,
          left: 0,
          transform: isExport ? 'none' : `scale(${scale})`,
          transformOrigin: 'top left',
          backgroundColor: '#FFFFFF',
          color: '#06254E',
          direction: isAr ? 'rtl' : 'ltr',
          userSelect: 'none',
          fontFamily: isAr
            ? 'var(--font-arabic), "Cairo", system-ui, sans-serif'
            : 'var(--font-heading), "Outfit", sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFCFE 50%, #F3F8FD 100%)',
            zIndex: 1,
          }}
        />

        {/* Fluid Vector Curves (Left) */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '24%',
            height: '100%',
            zIndex: 3,
            pointerEvents: 'none',
          }}
          viewBox="0 0 230 662"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0 L140 0 C110 140 30 240 60 365 C90 490 140 555 150 662 L0 662 Z"
            fill={`url(#${gradDeep})`}
          />
          <path
            d="M0 0 L90 0 C55 150 10 260 38 385 C65 500 110 575 115 662 L0 662 Z"
            fill={`url(#${gradVibrant})`}
          />
          <path
            d="M0 120 C28 190 48 270 40 355 C30 450 65 545 78 662 L0 662 Z"
            fill={`url(#${gradSky})`}
            opacity="0.85"
          />
          <defs>
            <linearGradient id={gradDeep} x1="0" y1="0" x2="160" y2="662" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B3C68" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <linearGradient id={gradVibrant} x1="0" y1="0" x2="120" y2="662" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="55%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
            <linearGradient id={gradSky} x1="0" y1="120" x2="80" y2="662" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
          </defs>
        </svg>

        {/* Soft Blue Curves (Bottom-Right) */}
        <svg
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '15%',
            height: '30%',
            zIndex: 3,
            pointerEvents: 'none',
          }}
          viewBox="0 0 140 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M140 180 L40 180 C80 140 110 100 120 50 C125 25 135 10 140 0 Z"
            fill={`url(#${gradCorner1})`}
            opacity="0.32"
          />
          <path
            d="M140 180 L75 180 C100 150 120 120 130 85 C135 60 138 35 140 20 Z"
            fill={`url(#${gradCorner2})`}
            opacity="0.38"
          />
          <defs>
            <linearGradient id={gradCorner1} x1="40" y1="180" x2="140" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id={gradCorner2} x1="75" y1="180" x2="140" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#5CB6DB" />
            </linearGradient>
          </defs>
        </svg>

        {/* TOP-LEFT: Motafawweq Logo */}
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '155px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src="/logo.png"
            alt="Motafawweq"
            style={{
              height: '96px',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 4px 14px rgba(6, 37, 78, 0.14))',
            }}
          />
        </div>

        {/* TOP-RIGHT: Ribbon & Gold Seal */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: '55px',
            width: '70px',
            height: '205px',
            zIndex: 10,
            filter: 'drop-shadow(0 8px 18px rgba(6, 37, 78, 0.35))',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, #041935 0%, #06254E 55%, #0B3C68 100%)',
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 88%, 0% 100%)',
              position: 'relative',
              borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
              borderRight: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: '15%',
                left: '4px',
                width: '1.5px',
                backgroundColor: '#F59E0B',
                opacity: 0.75,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: '15%',
                right: '4px',
                width: '1.5px',
                backgroundColor: '#F59E0B',
                opacity: 0.75,
              }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              top: '72px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 35% 30%, #FFFBEB 0%, #FDE68A 25%, #F59E0B 55%, #D97706 80%, #92400E 100%)',
              boxShadow:
                '0 8px 24px rgba(180, 83, 9, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -3px 6px rgba(120, 53, 15, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2.5px dashed #FDE68A',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 40% 35%, #FEF3C7 0%, #F59E0B 70%, #B45309 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.6)',
                boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2px',
              }}
            >
              {isTeacher ? (
                <UserCheck size={23} color="#78350F" strokeWidth={2.4} />
              ) : isLeague ? (
                <Trophy size={23} color="#78350F" strokeWidth={2.4} />
              ) : (
                <svg width="28" height="23" viewBox="0 0 32 26" fill="none">
                  <path d="M16 2L1 9L16 16L31 9L16 2Z" fill="#78350F" />
                  <path
                    d="M7 12V20C7 22.5 11 24.5 16 24.5C21 24.5 25 22.5 25 20V12"
                    stroke="#78350F"
                    strokeWidth="2.4"
                    fill="none"
                  />
                  <path d="M29 10.5V19" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="29" cy="20.5" r="1.5" fill="#78350F" />
                </svg>
              )}

              <div
                style={{
                  fontSize: '8.5px',
                  fontWeight: '900',
                  color: '#78350F',
                  letterSpacing: '-0.2px',
                  marginTop: '1px',
                  lineHeight: 1,
                }}
              >
                {content.sealText1}
              </div>
              <div
                style={{
                  fontSize: '6px',
                  fontWeight: '800',
                  color: '#92400E',
                  lineHeight: 1,
                  marginTop: '1px',
                }}
              >
                {content.sealText2}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER CONTENT */}
        <div
          style={{
            position: 'absolute',
            top: '116px',
            left: '160px',
            right: '145px',
            zIndex: 8,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '27px',
              fontWeight: '900',
              color: '#06254E',
              margin: '0 0 10px 0',
              lineHeight: 1.25,
              letterSpacing: '-0.3px',
            }}
          >
            {content.headerTitle}
          </h1>

          <div
            style={{
              fontSize: '13.5px',
              fontWeight: '700',
              color: '#475569',
              lineHeight: 1.4,
              marginBottom: '12px',
            }}
          >
            {content.intro}
          </div>

          <div
            style={{
              position: 'relative',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '14px',
            }}
          >
            <div
              style={{
                fontSize: '34px',
                fontWeight: '900',
                color: '#0284C7',
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
              }}
            >
              {studentName}
            </div>
            <div
              style={{
                width: '380px',
                height: '2.5px',
                background:
                  'linear-gradient(90deg, transparent 0%, #38BDF8 25%, #0284C7 50%, #38BDF8 75%, transparent 100%)',
                marginTop: '8px',
              }}
            />
          </div>

          <div
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#475569',
              lineHeight: 1.4,
              marginBottom: '10px',
            }}
          >
            {content.clause}
          </div>

          <div
            style={{
              fontSize: '22px',
              fontWeight: '900',
              color: '#0369A1',
              lineHeight: 1.3,
              marginBottom: '14px',
            }}
          >
            {courseName}
          </div>

          {/* Academic Metrics Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              padding: '7px 24px',
              backgroundColor: 'rgba(21, 136, 199, 0.06)',
              border: '1.5px solid rgba(21, 136, 199, 0.26)',
              borderRadius: '12px',
              marginBottom: '14px',
              maxWidth: '96%',
              boxShadow: '0 2px 8px rgba(6, 37, 78, 0.04)',
              flexWrap: 'nowrap',
            }}
          >
            {isLeague ? (
              <>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>
                    {isAr ? 'المركز:' : 'Rank:'}
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: '900', color: '#0284C7' }}>
                    {isAr ? cert.rankAr || '—' : cert.rankEn || cert.rankAr || '—'}
                  </span>
                </div>
                <div style={{ width: '1.5px', height: '14px', backgroundColor: 'rgba(21, 136, 199, 0.35)' }} />
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>
                    {isAr ? 'النقاط:' : 'Points:'}
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: '900', color: '#06254E' }}>
                    {isAr ? cert.pointsAr || '—' : cert.pointsEn || cert.pointsAr || '—'}
                  </span>
                </div>
                <div style={{ width: '1.5px', height: '14px', backgroundColor: 'rgba(21, 136, 199, 0.35)' }} />
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>
                    {isAr ? 'التقييم:' : 'Score:'}
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: '900', color: '#0284C7' }}>{score}</span>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>
                    {isAr ? 'نسبة إتمام المقرر:' : 'Course Completion:'}
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: '900', color: '#0284C7' }}>
                    {completionRate}
                  </span>
                </div>
                <div style={{ width: '1.5px', height: '14px', backgroundColor: 'rgba(21, 136, 199, 0.35)' }} />
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>
                    {isAr ? 'التقييم العام:' : 'Overall Score:'}
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: '900', color: '#06254E' }}>{score}</span>
                </div>
              </>
            )}
          </div>

          <div
            style={{
              fontSize: '13.5px',
              fontWeight: '800',
              color: '#06254E',
              lineHeight: 1.4,
              marginBottom: '10px',
            }}
          >
            {content.accreditation}
          </div>

          <div
            style={{
              fontSize: '12px',
              fontWeight: '500',
              color: '#64748B',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            {content.closingWish}
          </div>
        </div>

        {/* BOTTOM ROW: QR Code, Signature, Issue Date */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '170px',
            right: '80px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          {/* Offline Base64 QR Code */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                padding: '4px',
                backgroundColor: '#FFFFFF',
                borderRadius: '9px',
                border: '1.5px solid #CBD5E1',
                boxShadow: '0 3px 10px rgba(6, 37, 78, 0.08)',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {localQr ? (
                <img
                  src={localQr}
                  alt="QR"
                  style={{ width: '72px', height: '72px', display: 'block' }}
                />
              ) : (
                <div style={{ width: '72px', height: '72px', backgroundColor: '#F1F5F9', borderRadius: '4px' }} />
              )}
            </div>
            <div style={{ fontSize: '9.5px', fontWeight: '800', color: '#64748B', letterSpacing: '0.2px' }}>
              {content.scanLabel}
            </div>
          </div>

          {/* Signature */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              marginBottom: '4px',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                fontWeight: '900',
                color: '#06254E',
                letterSpacing: '0.2px',
                marginBottom: '5px',
              }}
            >
              {content.sigName}
            </div>
            <div style={{ width: '175px', height: '2px', backgroundColor: '#CBD5E1', marginBottom: '5px' }} />
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', letterSpacing: '0.2px' }}>
              {content.sigLabel}
            </div>
            {serialId && (
              <div
                style={{
                  fontSize: '9.5px',
                  fontWeight: '700',
                  color: '#94A3B8',
                  marginTop: '3px',
                  fontFamily: 'monospace',
                }}
              >
                {serialId}
              </div>
            )}
          </div>

          {/* Date of Issue */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: isAr ? 'right' : 'left', lineHeight: 1.3 }}>
              <div style={{ color: '#64748B', fontSize: '11px', fontWeight: '800', marginBottom: '2px' }}>
                {content.dateLabel}
              </div>
              <div style={{ color: '#06254E', fontSize: '14px', fontWeight: '900' }}>{completionDate}</div>
            </div>
            <div
              style={{
                width: '3px',
                height: '32px',
                backgroundColor: '#0284C7',
                borderRadius: '2px',
                opacity: 0.9,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

OfficialCertificateDocument.displayName = 'OfficialCertificateDocument';
