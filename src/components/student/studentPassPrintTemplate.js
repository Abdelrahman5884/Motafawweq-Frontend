import QRCode from 'qrcode';
import { generateCode128SvgString } from '../../utils/barcodeEncoder';
import { getInitials } from '../../utils';

const escapeHtml = (value = '') =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Print a high-resolution, color-accurate, dual-sided cut-out Student Center Smart Pass
 * using a hidden iframe so popup blockers never interfere and page chrome never leaks.
 */
export async function printStudentCenterPass({
  student,
  qrPayload,
  barcodeValue,
  passcode,
  groups = [],
  attendanceRate = 100,
  issuedAt = '',
  lang = 'ar'
}) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  const qrDataUrl = await QRCode.toDataURL(qrPayload || barcodeValue || 'MOTAFAWWEQ', {
    width: 480,
    margin: 1.5,
    color: { dark: '#06254E', light: '#FFFFFF' },
    errorCorrectionLevel: 'H'
  });

  const barcodeSvg = generateCode128SvgString(barcodeValue || student.code || 'STD-0000', {
    height: 42,
    barColor: '#06254E',
    background: '#FFFFFF'
  });

  const logoUrl = `${window.location.origin}/logo-dark.png`;
  const initials = getInitials(student.name);

  const safeName = escapeHtml(student.name || (isAr ? 'طالب متفوّق' : 'Motafawweq Student'));
  const safeGrade = escapeHtml(student.grade || (isAr ? 'الصف الثالث الثانوي' : '3rd Secondary'));
  const safeTrack = escapeHtml(student.track || '');
  const safeCode = escapeHtml(student.code || barcodeValue || 'STD-0000');
  const safeBarcode = escapeHtml(barcodeValue || student.code || 'STD-0000');
  const safePasscode = escapeHtml(passcode || '');
  const safePhone = escapeHtml(student.phone || '');
  const safeCenter = escapeHtml(student.centerName || (groups[0]?.centerName || (isAr ? 'جميع فروع السنتر المعتمدة' : 'All Authorized Centers')));
  const safeIssued = escapeHtml(issuedAt || new Date().toISOString().slice(0, 10));

  const groupsRowsHtml = groups.length > 0
    ? groups.slice(0, 5).map((grp) => `
        <div class="grp-row">
          <div class="grp-main">
            <div class="grp-name">${escapeHtml(isAr ? (grp.nameAr || grp.nameEn) : (grp.nameEn || grp.nameAr))}</div>
            <div class="grp-meta">
              ${escapeHtml(grp.teacherName || grp.teacherNameAr || '')}
              ${grp.centerName ? ` • ${escapeHtml(grp.centerName)}` : ''}
              ${grp.hallName ? ` (${escapeHtml(grp.hallName)})` : ''}
            </div>
          </div>
          <div class="grp-right">
            <div class="grp-time">${escapeHtml(isAr ? (grp.scheduleAr || '') : (grp.scheduleEn || grp.scheduleAr || ''))}</div>
            ${grp.passcode ? `<div class="grp-pin">PIN: ${escapeHtml(grp.passcode)}</div>` : ''}
          </div>
        </div>
      `).join('')
    : `
      <div class="grp-empty">
        ${isAr
          ? 'هذه البطاقة الموحدة مفعّلة وجاهزة للمسح التلقائي فور قبول انضمامك لأي مجموعة سنتر.'
          : 'This universal smart pass is active and ready for automatic check-in across all enrolled cohorts.'}
      </div>
    `;

  const html = `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${dir}">
<head>
  <meta charset="UTF-8" />
  <title>${isAr ? 'بطاقة الطالب الذكية — متفوّق' : 'Motafawweq Smart Student Pass'} - ${safeCode}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;700;800;900&display=swap" rel="stylesheet" />
  <style>
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    @page {
      size: A4 portrait;
      margin: 12mm;
    }

    body {
      margin: 0;
      padding: 18px;
      background: #F1F5F9;
      font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
      color: #0F172A;
    }

    .sheet {
      max-width: 760px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .sheet-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1.5px solid #CBD5E1;
      padding-bottom: 10px;
    }

    .sheet-title {
      font-size: 16px;
      font-weight: 900;
      color: #06254E;
    }

    .sheet-sub {
      font-size: 11px;
      font-weight: 600;
      color: #475569;
    }

    .cut-wrapper {
      border: 1.5px dashed #94A3B8;
      border-radius: 22px;
      padding: 12px;
      background: #FFFFFF;
      position: relative;
      page-break-inside: avoid;
    }

    .cut-label {
      position: absolute;
      top: -10px;
      inset-inline-start: 22px;
      background: #FFFFFF;
      padding: 0 10px;
      font-size: 10px;
      font-weight: 800;
      color: #64748B;
      letter-spacing: 0.4px;
    }

    /* ── FRONT LUXURY CARD ── */
    .id-card-front {
      border-radius: 18px;
      overflow: hidden;
      background: linear-gradient(135deg, #041A3B 0%, #09326A 56%, #0F5EA8 100%);
      color: #FFFFFF;
      border: 1.5px solid #1E6BB8;
      position: relative;
      box-shadow: 0 12px 30px rgba(4, 26, 59, 0.18);
    }

    .id-card-front::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle at 85% 15%, rgba(56, 189, 248, 0.24) 0%, transparent 45%),
        radial-gradient(circle at 12% 88%, rgba(16, 185, 129, 0.16) 0%, transparent 40%);
      pointer-events: none;
    }

    .front-top-bar {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(2, 16, 38, 0.28);
    }

    .brand-block {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-logo-box {
      width: 34px;
      height: 34px;
      border-radius: 9px;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(125, 211, 252, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .brand-logo-box img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }

    .brand-name {
      font-size: 14px;
      font-weight: 900;
      letter-spacing: -0.2px;
      line-height: 1.15;
    }

    .brand-tagline {
      font-size: 9.5px;
      color: #BAE6FD;
      font-weight: 700;
    }

    .active-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 11px;
      border-radius: 999px;
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid rgba(52, 211, 153, 0.55);
      color: #A7F3D0;
      font-size: 10px;
      font-weight: 800;
    }

    .active-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #34D399;
    }

    .front-body {
      position: relative;
      display: grid;
      grid-template-columns: 1.25fr 0.95fr;
      gap: 18px;
      padding: 18px 20px;
      align-items: center;
    }

    .student-identity {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .student-profile-row {
      display: flex;
      align-items: center;
      gap: 13px;
    }

    .avatar-ring {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      border: 2.5px solid #38BDF8;
      background: rgba(255, 255, 255, 0.14);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 900;
      color: #E0F2FE;
      flex-shrink: 0;
      overflow: hidden;
    }

    .avatar-ring img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .student-name {
      font-size: 20px;
      font-weight: 900;
      line-height: 1.2;
      color: #FFFFFF;
      margin: 0 0 4px 0;
    }

    .grade-chip {
      display: inline-block;
      padding: 2px 9px;
      border-radius: 6px;
      background: rgba(56, 189, 248, 0.2);
      border: 1px solid rgba(125, 211, 252, 0.35);
      color: #E0F2FE;
      font-size: 10.5px;
      font-weight: 800;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .meta-box {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 10px;
      padding: 7px 10px;
    }

    .meta-label {
      font-size: 9.5px;
      color: #BAE6FD;
      font-weight: 700;
      margin-bottom: 2px;
    }

    .meta-val {
      font-size: 12px;
      font-weight: 800;
      color: #FFFFFF;
      word-break: break-word;
    }

    .mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      letter-spacing: 1px;
    }

    .scan-panel {
      background: #FFFFFF;
      border-radius: 14px;
      padding: 12px;
      color: #06254E;
      text-align: center;
      box-shadow: 0 8px 20px rgba(2, 16, 38, 0.28);
    }

    .qr-frame {
      display: inline-block;
      padding: 6px;
      border-radius: 10px;
      border: 2px solid #E0F2FE;
      background: #FFFFFF;
    }

    .qr-frame img {
      width: 126px;
      height: 126px;
      display: block;
    }

    .barcode-strip {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px dashed #CBD5E1;
    }

    .barcode-caption {
      margin-top: 3px;
      font-size: 10px;
      font-weight: 800;
      color: #06254E;
      letter-spacing: 1.8px;
    }

    .front-footer {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 9px 20px;
      background: rgba(2, 16, 38, 0.35);
      border-top: 1px solid rgba(125, 211, 252, 0.2);
      font-size: 10px;
      color: #BAE6FD;
      font-weight: 700;
    }

    /* ── BACK SCHEDULE & VERIFICATION CARD ── */
    .id-card-back {
      border-radius: 18px;
      overflow: hidden;
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      color: #0F172A;
    }

    .back-stripe {
      height: 10px;
      background: linear-gradient(90deg, #041A3B 0%, #1588C7 60%, #38BDF8 100%);
    }

    .back-body {
      padding: 16px 20px;
    }

    .back-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .back-title {
      font-size: 13.5px;
      font-weight: 900;
      color: #06254E;
    }

    .att-badge {
      font-size: 10.5px;
      font-weight: 800;
      padding: 2px 9px;
      border-radius: 999px;
      background: #ECFDF5;
      color: #047857;
      border: 1px solid #A7F3D0;
    }

    .grp-list {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-bottom: 12px;
    }

    .grp-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 8px 11px;
      border-radius: 10px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
    }

    .grp-name {
      font-size: 12px;
      font-weight: 800;
      color: #0F172A;
    }

    .grp-meta {
      font-size: 10px;
      color: #475569;
      font-weight: 600;
    }

    .grp-right {
      text-align: end;
      flex-shrink: 0;
    }

    .grp-time {
      font-size: 10.5px;
      font-weight: 800;
      color: #0284C7;
    }

    .grp-pin {
      font-size: 9.5px;
      font-weight: 800;
      color: #06254E;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }

    .grp-empty {
      padding: 12px;
      border-radius: 10px;
      background: #F8FAFC;
      border: 1px dashed #CBD5E1;
      text-align: center;
      font-size: 11.5px;
      color: #475569;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .instructions-box {
      padding: 10px 12px;
      border-radius: 10px;
      background: #F0F9FF;
      border: 1px solid #BAE6FD;
      font-size: 10.5px;
      color: #0C4A6E;
      line-height: 1.55;
      font-weight: 600;
    }

    .back-footer {
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10px;
      color: #64748B;
      font-weight: 700;
    }

    @media print {
      body {
        background: #FFFFFF;
        padding: 0;
      }
      .sheet {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="sheet-header">
      <div>
        <div class="sheet-title">${isAr ? 'بطاقة دخول السنتر الذكية — منصة متفوّق' : 'Motafawweq Smart Center Student Pass'}</div>
        <div class="sheet-sub">${isAr ? 'بطاقة حضور رسمية معتمدة مزوّدة برمز QR وباركود ليزر Code-128' : 'Official attendance pass with QR & Code-128 laser barcode'}</div>
      </div>
      <div class="sheet-sub mono">${safeIssued}</div>
    </div>

    <!-- FRONT CARD -->
    <div class="cut-wrapper">
      <div class="cut-label">✂ ${isAr ? 'الوجه الأمامي — قص على الخط المتقطع' : 'FRONT SIDE — CUT ALONG DASHED LINE'}</div>
      <div class="id-card-front">
        <div class="front-top-bar">
          <div class="brand-block">
            <div class="brand-logo-box">
              <img src="${logoUrl}" alt="Motafawweq" onerror="this.style.display='none'" />
            </div>
            <div>
              <div class="brand-name">${isAr ? 'منصة متفوّق التعليمية' : 'Motafawweq Academy'}</div>
              <div class="brand-tagline">${isAr ? 'بطاقة طالب معتمدة • OFFICIAL STUDENT PASS' : 'OFFICIAL SMART STUDENT ID'}</div>
            </div>
          </div>
          <div class="active-pill">
            <span class="active-dot"></span>
            <span>${isAr ? 'مفعّلة • ACTIVE' : 'ACTIVE PASS'}</span>
          </div>
        </div>

        <div class="front-body">
          <div class="student-identity">
            <div class="student-profile-row">
              <div class="avatar-ring">
                ${student.avatar
                  ? `<img src="${escapeHtml(student.avatar)}" alt="${safeName}" onerror="this.remove();" />`
                  : escapeHtml(initials)}
              </div>
              <div>
                <h1 class="student-name">${safeName}</h1>
                <span class="grade-chip">${safeGrade}${safeTrack ? ` • ${safeTrack}` : ''}</span>
              </div>
            </div>

            <div class="meta-grid">
              <div class="meta-box">
                <div class="meta-label">${isAr ? 'كود الطالب الموحد' : 'Student Code'}</div>
                <div class="meta-val mono" dir="ltr">${safeCode}</div>
              </div>
              <div class="meta-box">
                <div class="meta-label">${safePasscode ? (isAr ? 'كود المرور السريع (PIN)' : 'Quick PIN') : (isAr ? 'رقم الهاتف' : 'Phone')}</div>
                <div class="meta-val mono" dir="ltr">${safePasscode || safePhone || '—'}</div>
              </div>
              <div class="meta-box" style="grid-column: span 2;">
                <div class="meta-label">${isAr ? 'السنتر / المقر المعتمد' : 'Authorized Center'}</div>
                <div class="meta-val">${safeCenter}</div>
              </div>
            </div>
          </div>

          <div class="scan-panel">
            <div class="qr-frame">
              <img src="${qrDataUrl}" alt="QR Pass" />
            </div>
            <div class="barcode-strip">
              ${barcodeSvg}
              <div class="barcode-caption mono" dir="ltr">${safeBarcode}</div>
            </div>
          </div>
        </div>

        <div class="front-footer">
          <span>${isAr ? 'صالحة للمسح الإلكتروني والليزر بجميع قاعات وفروع السنتر' : 'Valid for QR & laser barcode scanners across all halls'}</span>
          <span class="mono">motafawweq.me</span>
        </div>
      </div>
    </div>

    <!-- BACK CARD -->
    <div class="cut-wrapper">
      <div class="cut-label">✂ ${isAr ? 'الوجه الخلفي — المجموعات والمواعيد المسجلة' : 'BACK SIDE — ENROLLED COHORTS & SCHEDULE'}</div>
      <div class="id-card-back">
        <div class="back-stripe"></div>
        <div class="back-body">
          <div class="back-title-row">
            <div class="back-title">${isAr ? 'المجموعات والمواعيد المعتمدة على البطاقة' : 'Registered Cohorts & Class Timetable'}</div>
            <span class="att-badge">${isAr ? `نسبة الالتزام: ${attendanceRate}%` : `Attendance: ${attendanceRate}%`}</span>
          </div>

          <div class="grp-list">
            ${groupsRowsHtml}
          </div>

          <div class="instructions-box">
            <strong>${isAr ? 'تعليمات بوابة الحضور:' : 'Gate Check-in Instructions:'}</strong>
            ${isAr
              ? 'أبرز هذه البطاقة لمشرف القاعة أو امسح رمز QR / الباركود عند الدخول ليتم تسجيل حضورك تلقائياً وإرسال إشعار فوري لولي الأمر.'
              : 'Present this card at the hall entrance scanner to automatically record your session attendance and notify your parent.'}
          </div>

          <div class="back-footer">
            <span>${isAr ? `حامل البطاقة: ${safeName}` : `Holder: ${safeName}`}</span>
            <span>${isAr ? `تاريخ الإصدار: ${safeIssued}` : `Issued: ${safeIssued}`}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(iframe);

    const cleanup = () => {
      window.setTimeout(() => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
        resolve(true);
      }, 600);
    };

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      cleanup();
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    let triggered = false;
    const triggerPrint = () => {
      if (triggered) return;
      triggered = true;
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } finally {
        cleanup();
      }
    };

    iframe.onload = () => {
      window.setTimeout(triggerPrint, 280);
    };
    window.setTimeout(triggerPrint, 900);
  });
}
