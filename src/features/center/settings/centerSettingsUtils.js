export const SETTINGS_TABS = [
  { id: 'policies', labelAr: 'هوية وسياسات السنتر', labelEn: 'Policies & Identity' },
  { id: 'tasks', labelAr: 'المهام اليومية للموظفين', labelEn: 'Daily Staff Tasks' },
  { id: 'announcements', labelAr: 'الإعلانات والتعميمات', labelEn: 'Staff Announcements' },
  { id: 'import', labelAr: 'استيراد البيانات (CSV)', labelEn: 'CSV Bulk Import' },
  { id: 'backup', labelAr: 'النسخ الاحتياطي السحابي', labelEn: 'Cloud Backup' },
  { id: 'kpis', labelAr: 'تخصيص مؤشرات الأداء', labelEn: 'Custom KPI Builder' },
];

export const REFUND_POLICIES = [
  {
    value: 'strict',
    labelAr: 'صارمة (لا استرداد بعد أول حصة)',
    labelEn: 'Strict (No refund after 1st session)',
  },
  {
    value: 'flexible_50',
    labelAr: 'مرنة (استرداد 50% خلال أول أسبوع)',
    labelEn: 'Flexible (50% refund within 1st week)',
  },
  {
    value: 'full_before_second',
    labelAr: 'استرداد كامل قبل الحصة الثانية',
    labelEn: 'Full refund before 2nd session',
  },
];

export const PAYMENT_METHOD_LABELS = [
  { key: 'cash', labelAr: 'الدفع النقدي بالفرع (Cash)', labelEn: 'Branch Cash Payment' },
  { key: 'vodafoneCash', labelAr: 'فودافون كاش / محافظ إلكترونية', labelEn: 'Vodafone Cash / Wallets' },
  { key: 'instaPay', labelAr: 'تحويل لحظي (InstaPay)', labelEn: 'InstaPay Instant Transfer' },
  { key: 'visa', labelAr: 'ماكينة فيزا / بطاقات بنكية (POS)', labelEn: 'POS / Bank Cards' },
];

/**
 * Parse a single CSV line respecting RFC-4180 double quotes.
 */
function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((ch === ',' || ch === ';') && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result.map((cell) => cell.replace(/^'+/, '').trim());
}

const HEADER_ALIASES = {
  name: ['اسم الطالب', 'الاسم', 'الطالب', 'name', 'student name', 'student_name', 'full_name'],
  phone: ['رقم الهاتف', 'الهاتف', 'الموبايل', 'رقم الموبايل', 'phone', 'mobile', 'student_phone'],
  group: ['المجموعة', 'اسم المجموعة', 'كود المجموعة', 'group', 'group_name', 'study_group'],
  grade: ['المرحلة الدراسية', 'المرحلة', 'الصف', 'الصف الدراسي', 'grade', 'level', 'stage'],
  parent_name: ['اسم ولي الأمر', 'ولي الأمر', 'parent_name', 'parent name', 'guardian'],
  parent_phone: ['هاتف ولي الأمر', 'رقم ولي الأمر', 'موبايل ولي الأمر', 'parent_phone', 'parent phone'],
};

function detectColumnIndices(headerCells) {
  const normalized = headerCells.map((h) => String(h || '').trim().toLowerCase());
  const indices = {
    name: -1,
    phone: -1,
    group: -1,
    grade: -1,
    parent_name: -1,
    parent_phone: -1,
  };

  Object.entries(HEADER_ALIASES).forEach(([field, aliases]) => {
    const idx = normalized.findIndex((cell) =>
      aliases.some((alias) => cell === alias.toLowerCase() || cell.includes(alias.toLowerCase()))
    );
    if (idx !== -1) {
      indices[field] = idx;
    }
  });

  // Fallback positional mapping if headers were not recognized
  const hasRecognizedHeader = indices.name !== -1 || indices.phone !== -1;
  if (!hasRecognizedHeader) {
    return {
      hasHeaderRow: false,
      indices: {
        name: 0,
        phone: 1,
        group: 2,
        grade: 3,
        parent_name: 4,
        parent_phone: 5,
      },
    };
  }

  return { hasHeaderRow: true, indices };
}

/**
 * Parse uploaded CSV text into validated student rows ready for `/api/v1/center/import/students`.
 */
export function parseStudentImportCsv(rawText) {
  const cleaned = String(rawText || '')
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  const lines = cleaned
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return {
      validRows: [],
      invalidRows: [],
      errorAr: 'الملف المرفوع فارغ ولا يحتوي على أي سجلات.',
      errorEn: 'The uploaded file is empty.',
    };
  }

  const firstCells = parseCsvLine(lines[0]);
  const { hasHeaderRow, indices } = detectColumnIndices(firstCells);
  const dataLines = hasHeaderRow ? lines.slice(1) : lines;

  if (dataLines.length === 0) {
    return {
      validRows: [],
      invalidRows: [],
      errorAr: 'الملف يحتوي على صف العناوين فقط بدون بيانات طلاب.',
      errorEn: 'The file contains only headers and no student rows.',
    };
  }

  const validRows = [];
  const invalidRows = [];

  dataLines.slice(0, 200).forEach((line, idx) => {
    const cells = parseCsvLine(line);
    const rowNumber = hasHeaderRow ? idx + 2 : idx + 1;

    const getCell = (colIdx) => (colIdx >= 0 && colIdx < cells.length ? cells[colIdx] : '');

    const name = getCell(indices.name).trim();
    const rawPhone = getCell(indices.phone).trim();
    const phone = rawPhone.replace(/[^\d+]/g, '');
    const group = getCell(indices.group).trim();
    const grade = getCell(indices.grade).trim() || 'الثالث الثانوي';
    const parentName = getCell(indices.parent_name).trim();
    const parentPhone = getCell(indices.parent_phone).trim().replace(/[^\d+]/g, '');

    if (!name && !phone) {
      return;
    }

    if (name.length < 2) {
      invalidRows.push({
        rowNumber,
        name: name || '—',
        phone: rawPhone || '—',
        reasonAr: 'اسم الطالب قصير جداً أو مفقود',
        reasonEn: 'Student name is missing or too short',
      });
      return;
    }

    if (phone.length < 8) {
      invalidRows.push({
        rowNumber,
        name,
        phone: rawPhone || '—',
        reasonAr: 'رقم الهاتف غير صالح (يجب أن لا يقل عن 8 أرقام)',
        reasonEn: 'Invalid phone number (minimum 8 digits)',
      });
      return;
    }

    validRows.push({
      name,
      phone,
      group: group || '',
      grade,
      ...(parentName ? { parent_name: parentName } : {}),
      ...(parentPhone ? { parent_phone: parentPhone } : {}),
    });
  });

  if (validRows.length === 0 && invalidRows.length === 0) {
    return {
      validRows: [],
      invalidRows: [],
      errorAr: 'لم يتم العثور على سجلات صالحة للاستيراد في الملف.',
      errorEn: 'No valid student rows found in file.',
    };
  }

  return {
    validRows,
    invalidRows,
    errorAr: null,
    errorEn: null,
  };
}

export function formatBackupSize(bytes) {
  const num = Number(bytes) || 0;
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatDateTimeLabel(isoStr, lang = 'ar') {
  if (!isoStr) return '';
  try {
    const dt = new Date(isoStr);
    if (Number.isNaN(dt.getTime())) return String(isoStr);
    return dt.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(isoStr);
  }
}
