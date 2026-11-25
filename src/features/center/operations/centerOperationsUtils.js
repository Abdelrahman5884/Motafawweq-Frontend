export const STAFF_ROLE_OPTIONS = [
  {
    role: 'receptionist',
    roleAr: 'سكرتارية واستقبال',
    roleEn: 'Reception & Registration',
    defaultPermissions: ['إدارة الحضور بالباركود', 'تسجيل الطلاب', 'تحصيل الرسوم'],
  },
  {
    role: 'manager',
    roleAr: 'مدير فرع',
    roleEn: 'Branch Manager',
    defaultPermissions: ['إدارة الفرع بالكامل', 'جدولة القاعات', 'مراجعة الحضور', 'اعتماد المعلمين'],
  },
  {
    role: 'supervisor',
    roleAr: 'مشرف قاعات',
    roleEn: 'Halls Supervisor',
    defaultPermissions: ['جدولة القاعات', 'إدارة الحضور بالباركود', 'متابعة الطابور اليومي'],
  },
  {
    role: 'accountant',
    roleAr: 'محاسب مالي',
    roleEn: 'Financial Accountant',
    defaultPermissions: ['إدارة المصروفات', 'تسويات المدرسين', 'متابعة المتأخرات'],
  },
];

export const ALL_STAFF_PERMISSIONS = [
  'إدارة الفرع بالكامل',
  'جدولة القاعات',
  'إدارة الحضور بالباركود',
  'تسجيل الطلاب',
  'تحصيل الرسوم',
  'متابعة الطابور اليومي',
  'اعتماد المعلمين',
  'إدارة المصروفات',
  'تسويات المدرسين',
  'متابعة المتأخرات',
];

export const SUBJECT_SUGGESTIONS = [
  'الفيزياء',
  'الكيمياء',
  'الأحياء',
  'الرياضيات',
  'اللغة العربية',
  'اللغة الإنجليزية',
  'اللغة الفرنسية',
  'التاريخ',
  'الجغرافيا',
  'الفلسفة والمنطق',
  'علم النفس والاجتماع',
  'الجيولوجيا',
];

const escapeHtml = (value = '') =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Clean isolated iframe printer for the Center Executive Operational Report (Zero Financials).
 */
export function printCenterExecutiveReport({
  centerNameAr = 'السنتر التعليمي',
  reportType = 'weekly',
  summary = {},
  branches = [],
  lang = 'ar',
}) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const periodLabel =
    reportType === 'monthly'
      ? isAr
        ? 'التقرير الإداري والتشغيلي الشهري'
        : 'Monthly Operational Executive Digest'
      : isAr
        ? 'التقرير الإداري والتشغيلي الأسبوعي'
        : 'Weekly Operational Executive Report';

  const dateStr = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const branchesRowsHtml =
    branches.length > 0
      ? branches
          .map(
            (b) => `
          <tr>
            <td><strong>${escapeHtml(b.nameAr)}</strong> ${b.isMain ? `<span class="badge">${isAr ? 'رئيسي' : 'Main'}</span>` : ''}</td>
            <td>${escapeHtml(b.addressAr || '—')}</td>
            <td>${escapeHtml(b.managerNameAr || '—')}</td>
            <td>${Number(b.roomsCount ?? 0)}</td>
            <td>${Number(b.activeStudents ?? 0)}</td>
            <td>${Number(b.teachersCount ?? 0)}</td>
            <td><strong>${Number(b.utilizationRate ?? 0)}%</strong></td>
          </tr>
        `
          )
          .join('')
      : `<tr><td colspan="7" style="text-align:center;padding:16px;">${
          isAr ? 'لا توجد فروع مضافة حتى الآن' : 'No branches configured yet'
        }</td></tr>`;

  const html = `<!doctype html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(centerNameAr)} — ${escapeHtml(periodLabel)}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      margin: 0;
      font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
    }
    .header {
      padding: 18px 22px;
      border-radius: 14px;
      background: linear-gradient(135deg, #06254E 0%, #0E4B8A 65%, #1588C7 100%);
      color: #FFFFFF;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
    }
    .title { font-size: 19px; font-weight: 900; margin: 0 0 4px; }
    .sub { font-size: 12px; opacity: 0.9; margin: 0; }
    .kpis {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 18px;
    }
    .kpi {
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      padding: 10px 12px;
      background: #F8FAFC;
      text-align: center;
    }
    .kpi-val { font-size: 18px; font-weight: 900; color: #06254E; }
    .kpi-lbl { font-size: 11px; color: #475569; font-weight: 700; margin-top: 2px; }
    h3 { font-size: 14px; color: #06254E; margin: 16px 0 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #CBD5E1; padding: 8px 10px; text-align: ${isAr ? 'right' : 'left'}; }
    th { background: #F1F5F9; font-weight: 800; color: #06254E; }
    .badge {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 999px;
      background: #E0F2FE;
      color: #0284C7;
      font-size: 10px;
      font-weight: 800;
    }
    .footer {
      margin-top: 22px;
      padding-top: 10px;
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      font-size: 10.5px;
      color: #64748B;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">${escapeHtml(centerNameAr)}</div>
      <div class="sub">${escapeHtml(periodLabel)}</div>
    </div>
    <div class="sub">${escapeHtml(dateStr)}</div>
  </div>

  <div class="kpis">
    <div class="kpi">
      <div class="kpi-val">${Number(summary.branchesCount ?? 0)}</div>
      <div class="kpi-lbl">${isAr ? 'الفروع النشطة' : 'Branches'}</div>
    </div>
    <div class="kpi">
      <div class="kpi-val">${Number(summary.roomsCount ?? 0)} (${Number(summary.totalCapacity ?? 0)} ${isAr ? 'مقعد' : 'seats'})</div>
      <div class="kpi-lbl">${isAr ? 'القاعات والسعة' : 'Rooms & Capacity'}</div>
    </div>
    <div class="kpi">
      <div class="kpi-val">${Number(summary.teachersCount ?? 0)}</div>
      <div class="kpi-lbl">${isAr ? 'المعلمون المعتمدون' : 'Certified Teachers'}</div>
    </div>
    <div class="kpi">
      <div class="kpi-val">${Number(summary.totalStudents ?? 0)} (${Number(summary.avgAttendanceRate ?? 0)}%)</div>
      <div class="kpi-lbl">${isAr ? 'الطلاب ومعدل الحضور' : 'Students & Attendance'}</div>
    </div>
  </div>

  <h3>${isAr ? 'مقارنة الأداء التشغيلي للفروع' : 'Branches Operational Benchmark'}</h3>
  <table>
    <thead>
      <tr>
        <th>${isAr ? 'الفرع' : 'Branch'}</th>
        <th>${isAr ? 'العنوان' : 'Address'}</th>
        <th>${isAr ? 'المدير' : 'Manager'}</th>
        <th>${isAr ? 'القاعات' : 'Rooms'}</th>
        <th>${isAr ? 'الطلاب' : 'Students'}</th>
        <th>${isAr ? 'المعلمون' : 'Teachers'}</th>
        <th>${isAr ? 'نسبة الإشغال' : 'Utilization'}</th>
      </tr>
    </thead>
    <tbody>
      ${branchesRowsHtml}
    </tbody>
  </table>

  <div class="footer">
    <span>${isAr ? 'منصة متفوّق — التقرير الإداري والتشغيلي المعتمد' : 'Motafawweq Platform — Executive Report'}</span>
    <span>${escapeHtml(dateStr)}</span>
  </div>
</body>
</html>`;

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
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
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

  iframe.onload = () => window.setTimeout(triggerPrint, 220);
  window.setTimeout(triggerPrint, 800);
}
