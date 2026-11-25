import {
  DAYS_CONFIG,
  NOTE_PRIORITIES,
  formatTimeTo12h,
  formatStudyHoursValue,
} from './scheduleUtils';

const escapeHtml = (value = '') =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Print a clean, color-accurate A4 Landscape Weekly Timetable via a hidden iframe
 * so browser chrome, sidebars, and modals never leak onto the printed page.
 */
export function printStudentWeeklySchedule({
  studentName = '',
  timetableByDay = {},
  scheduleNotes = {},
  stats = {},
  lang = 'ar',
}) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const studyHours = formatStudyHoursValue(stats.totalStudyMinutes || 0, isAr);
  const printDate = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const columnsHtml = DAYS_CONFIG.map((day) => {
    const items = timetableByDay[day.key] || [];
    const notes = scheduleNotes[day.key] || [];

    const itemsHtml = items.length
      ? items
          .map((item) => {
            const isCenter = item.type === 'center';
            const accent = isCenter
              ? '#1588C7'
              : item.isCompleted
                ? '#059669'
                : item.color || '#7C3AED';
            const badgeText = isCenter
              ? isAr
                ? 'حصة سنتر'
                : 'Center'
              : isAr
                ? 'مذاكرة'
                : 'Study';

            return `
              <div class="slot-card" style="border-${isAr ? 'right' : 'left'}: 3.5px solid ${escapeHtml(accent)};">
                <div class="slot-top">
                  <span class="slot-badge" style="background:${escapeHtml(accent)};">${badgeText}</span>
                  <span class="slot-time">${escapeHtml(formatTimeTo12h(item.startTime, isAr))} - ${escapeHtml(formatTimeTo12h(item.endTime, isAr))}</span>
                </div>
                <div class="slot-title ${item.isCompleted ? 'done' : ''}">${escapeHtml(item.title)}</div>
                <div class="slot-sub">${escapeHtml(item.subject)}</div>
                ${
                  isCenter && item.hall
                    ? `<div class="slot-meta">${escapeHtml(item.centerName ? `${item.centerName} • ${item.hall}` : item.hall)}</div>`
                    : item.notes
                      ? `<div class="slot-meta">${escapeHtml(item.notes)}</div>`
                      : ''
                }
              </div>
            `;
          })
          .join('')
      : `<div class="empty-day">${isAr ? 'يوم راحة' : 'Free day'}</div>`;

    const notesHtml = notes.length
      ? `
        <div class="notes-box">
          <div class="notes-title">${isAr ? 'ملاحظات اليوم' : 'Notes'} (${notes.length})</div>
          ${notes
            .map((n) => {
              const pr = NOTE_PRIORITIES[n.priority] || NOTE_PRIORITIES.medium;
              return `
                <div class="note-item ${n.isDone ? 'done' : ''}">
                  <span class="note-dot" style="background:${pr.color};"></span>
                  <span class="note-text">${escapeHtml(n.text)}</span>
                </div>
              `;
            })
            .join('')}
        </div>
      `
      : '';

    return `
      <div class="day-col">
        <div class="day-header">
          <span class="day-name">${escapeHtml(isAr ? day.ar : day.en)}</span>
          <span class="day-count">${items.length}</span>
        </div>
        <div class="day-body">
          ${itemsHtml}
          ${notesHtml}
        </div>
      </div>
    `;
  }).join('');

  const html = `<!doctype html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(isAr ? 'الجدول الأسبوعي — متفوّق' : 'Weekly Schedule — Motafawweq')}</title>
  <style>
    @page { size: A4 landscape; margin: 10mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      margin: 0;
      font-family: 'Cairo', 'Tajawal', 'Segoe UI', Tahoma, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      border-radius: 14px;
      background: linear-gradient(135deg, #06254E 0%, #0E4B8A 65%, #1588C7 100%);
      color: #FFFFFF;
      margin-bottom: 14px;
    }
    .brand { font-size: 18px; font-weight: 900; margin: 0 0 3px; }
    .sub { font-size: 11.5px; opacity: 0.88; margin: 0; }
    .kpis { display: flex; gap: 10px; }
    .kpi {
      background: rgba(255,255,255,0.14);
      border: 1px solid rgba(255,255,255,0.22);
      border-radius: 10px;
      padding: 6px 12px;
      text-align: center;
      min-width: 84px;
    }
    .kpi-val { font-size: 15px; font-weight: 900; }
    .kpi-lbl { font-size: 9.5px; opacity: 0.9; }
    .grid {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      gap: 8px;
      align-items: stretch;
    }
    .day-col {
      border: 1px solid #CBD5E1;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background: #F8FAFC;
      min-width: 0;
    }
    .day-header {
      background: #06254E;
      color: #FFFFFF;
      padding: 7px 9px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11.5px;
      font-weight: 800;
    }
    .day-count {
      background: rgba(255,255,255,0.2);
      padding: 1px 6px;
      border-radius: 999px;
      font-size: 10px;
    }
    .day-body {
      padding: 7px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
    }
    .slot-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 6px 7px;
      min-width: 0;
      overflow: hidden;
    }
    .slot-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 4px;
      margin-bottom: 4px;
      flex-wrap: wrap;
    }
    .slot-badge {
      color: #FFFFFF;
      font-size: 8.5px;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 4px;
    }
    .slot-time { font-size: 8.5px; font-weight: 700; color: #475569; }
    .slot-title {
      font-size: 10px;
      font-weight: 800;
      color: #0F172A;
      line-height: 1.35;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .slot-sub {
      font-size: 9px;
      color: #475569;
      margin-top: 2px;
      overflow-wrap: anywhere;
    }
    .slot-meta {
      font-size: 8.5px;
      color: #64748B;
      margin-top: 3px;
      overflow-wrap: anywhere;
    }
    .done { text-decoration: line-through; opacity: 0.6; }
    .empty-day {
      text-align: center;
      padding: 20px 6px;
      color: #94A3B8;
      font-size: 10px;
      font-weight: 700;
      border: 1px dashed #CBD5E1;
      border-radius: 8px;
    }
    .notes-box {
      margin-top: auto;
      background: #FFFFFF;
      border: 1px dashed #CBD5E1;
      border-radius: 8px;
      padding: 5px 6px;
    }
    .notes-title {
      font-size: 8.5px;
      font-weight: 800;
      color: #475569;
      margin-bottom: 3px;
    }
    .note-item {
      display: flex;
      align-items: flex-start;
      gap: 4px;
      font-size: 8.5px;
      color: #334155;
      margin-bottom: 2px;
    }
    .note-dot {
      width: 5px;
      height: 5px;
      border-radius: 999px;
      flex-shrink: 0;
      margin-top: 4px;
    }
    .note-text { overflow-wrap: anywhere; word-break: break-word; }
    .footer {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 9.5px;
      color: #64748B;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="brand">${escapeHtml(isAr ? 'الجدول الأسبوعي وخطة المذاكرة — منصة متفوّق' : 'Weekly Study Schedule — Motafawweq')}</h1>
      <p class="sub">${escapeHtml(studentName ? `${isAr ? 'الطالب:' : 'Student:'} ${studentName}  •  ` : '')}${escapeHtml(printDate)}</p>
    </div>
    <div class="kpis">
      <div class="kpi">
        <div class="kpi-val">${stats.totalCenterSessions || 0}</div>
        <div class="kpi-lbl">${isAr ? 'حصص السنتر' : 'Center Classes'}</div>
      </div>
      <div class="kpi">
        <div class="kpi-val">${stats.totalStudySessions || 0}</div>
        <div class="kpi-lbl">${isAr ? 'جلسات مذاكرة' : 'Study Sessions'}</div>
      </div>
      <div class="kpi">
        <div class="kpi-val">${escapeHtml(studyHours.value)}</div>
        <div class="kpi-lbl">${escapeHtml(studyHours.unit)}</div>
      </div>
      <div class="kpi">
        <div class="kpi-val">${stats.completionRate || 0}%</div>
        <div class="kpi-lbl">${isAr ? 'نسبة الإنجاز' : 'Completion'}</div>
      </div>
    </div>
  </div>
  <div class="grid">${columnsHtml}</div>
  <div class="footer">
    <span>${isAr ? 'منصة متفوّق التعليمية الذكية' : 'Motafawweq Smart Education Platform'}</span>
    <span>${escapeHtml(printDate)}</span>
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
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  const cleanup = () => {
    window.setTimeout(() => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }, 800);
  };

  window.setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      cleanup();
    }
  }, 260);
}
