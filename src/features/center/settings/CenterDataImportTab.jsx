import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { parseStudentImportCsv } from './centerSettingsUtils';

export const CenterDataImportTab = ({
  lang,
  isRtl,
  groups = [],
  importCenterStudents,
  exportToCsv,
  showToast,
}) => {
  const fileInputRef = useRef(null);
  const [defaultGroupId, setDefaultGroupId] = useState(() => groups[0]?.id || '');
  const [stagedRows, setStagedRows] = useState([]);
  const [invalidFileRows, setInvalidFileRows] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [parseError, setParseError] = useState(null);

  // Manual quick-add row inputs for staging before commit
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualGrade, setManualGrade] = useState('الثالث الثانوي');
  const [manualGroup, setManualGroup] = useState('');

  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleDownloadTemplate = () => {
    const firstGroupName = groups[0]?.nameAr || '';
    const headers = [
      'اسم الطالب',
      'رقم الهاتف',
      'المجموعة',
      'المرحلة الدراسية',
      'اسم ولي الأمر',
      'هاتف ولي الأمر',
    ];
    const rows = firstGroupName
      ? [['', '', firstGroupName, groups[0]?.gradeAr || 'الثالث الثانوي', '', '']]
      : [];
    exportToCsv('Motafawweq_Center_Students_Template', headers, rows);
    if (showToast) {
      showToast(
        lang === 'ar'
          ? 'تم تحميل قالب استيراد الطلاب الرسمي (CSV).'
          : 'Official student CSV template downloaded.',
        'info'
      );
    }
  };

  const processCsvFile = async (file) => {
    if (!file) return;
    setParseError(null);
    setImportResult(null);
    setUploadedFileName(file.name);

    try {
      const text = await file.text();
      const parsed = parseStudentImportCsv(text);
      if (parsed.errorAr) {
        const msg = lang === 'ar' ? parsed.errorAr : parsed.errorEn;
        setParseError(msg);
        setStagedRows([]);
        setInvalidFileRows([]);
        if (showToast) showToast(msg, 'warning');
        return;
      }

      setStagedRows(parsed.validRows);
      setInvalidFileRows(parsed.invalidRows);

      if (showToast) {
        showToast(
          lang === 'ar'
            ? `تم فحص الملف: ${parsed.validRows.length} سجل صالح للمزامنة.`
            : `File parsed: ${parsed.validRows.length} valid rows ready.`,
          'success'
        );
      }
    } catch {
      const msg =
        lang === 'ar'
          ? 'تعذر قراءة ملف CSV المرفوع. تأكد من ترميز UTF-8.'
          : 'Could not read the uploaded CSV file.';
      setParseError(msg);
      if (showToast) showToast(msg, 'warning');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processCsvFile(file);
    }
    e.target.value = '';
  };

  const handleAddManualRow = (e) => {
    e.preventDefault();
    const trimmedName = manualName.trim();
    const cleanedPhone = manualPhone.trim().replace(/[^\d+]/g, '');

    if (trimmedName.length < 2 || cleanedPhone.length < 8) {
      if (showToast) {
        showToast(
          lang === 'ar'
            ? 'يرجى إدخال اسم الطالب ورقم هاتف صحيح (8 أرقام على الأقل).'
            : 'Please enter a valid student name and phone number.',
          'warning'
        );
      }
      return;
    }

    const selectedDefaultGroup = groups.find((g) => g.id === defaultGroupId);
    const resolvedGroupLabel =
      manualGroup.trim() || selectedDefaultGroup?.nameAr || '';

    setStagedRows((prev) => [
      ...prev,
      {
        name: trimmedName,
        phone: cleanedPhone,
        group: resolvedGroupLabel,
        grade: manualGrade.trim() || 'الثالث الثانوي',
      },
    ]);
    setManualName('');
    setManualPhone('');
    setParseError(null);
    setImportResult(null);
  };

  const handleRemoveStagedRow = (index) => {
    setStagedRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCommitImport = async () => {
    if (stagedRows.length === 0) {
      if (showToast) {
        showToast(
          lang === 'ar'
            ? 'قم برفع ملف CSV أو إضافة سجل واحد على الأقل قبل الاستيراد.'
            : 'Please upload a CSV file or add at least one row before importing.',
          'warning'
        );
      }
      return;
    }

    setIsImporting(true);
    setParseError(null);

    try {
      const resolvedDefaultGroupId = defaultGroupId || groups[0]?.id || null;
      const result = await importCenterStudents(stagedRows, resolvedDefaultGroupId);

      setImportResult(
        result || {
          importedCount: stagedRows.length,
          enrolledCount: stagedRows.length,
          skippedCount: 0,
          importedRows: stagedRows,
          skippedRows: [],
        }
      );
      setStagedRows([]);
      setInvalidFileRows([]);

      if (showToast) {
        showToast(
          lang === 'ar'
            ? `تم استيراد ${result?.importedCount ?? stagedRows.length} طالب بنجاح.`
            : `Successfully imported ${result?.importedCount ?? stagedRows.length} students.`,
          'success'
        );
      }
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      const msg =
        firstErr ||
        err?.message ||
        (lang === 'ar'
          ? 'تعذر استيراد سجلات الطلاب. تحقق من صحة البيانات.'
          : 'Failed to import student records.');
      setParseError(msg);
      if (showToast) showToast(msg, 'warning');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div>
        <h3
          style={{
            fontSize: '17px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <FileSpreadsheet size={19} style={{ color: 'var(--primary)' }} />
          <span>
            {lang === 'ar'
              ? 'استيراد قوائم الطلاب المجمعة من ملفات CSV'
              : 'Bulk Student Roster Import (CSV)'}
          </span>
        </h3>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: '1.5',
          }}
        >
          {lang === 'ar'
            ? 'ارفع ملف CSV يحتوي على بيانات الطلاب أو أضف السجلات في جدول المراجعة أدناه، مع إمكانية تحديد المجموعة الدراسية الافتراضية للتسكين المباشر.'
            : 'Upload a CSV file with student records or stage rows below, and select a default target study group for direct enrollment.'}
        </p>
      </div>

      {/* Controls Bar: Template Download, Default Group Selector & File Picker */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '14px',
          alignItems: 'end',
          padding: '16px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-app)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '6px',
              color: 'var(--text-primary)',
            }}
          >
            {lang === 'ar'
              ? 'المجموعة الافتراضية لتسكين الطلاب المستوردين'
              : 'Default Target Study Group'}
          </label>
          <select
            value={defaultGroupId}
            onChange={(e) => setDefaultGroupId(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '13px',
            }}
          >
            <option value="">
              {lang === 'ar'
                ? 'مطابقة اسم المجموعة من العمود تلقائياً'
                : 'Auto-match group name from CSV column'}
            </option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nameAr} {g.code ? `(${g.code})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <Download size={15} />
            <span>
              {lang === 'ar' ? 'تحميل قالب CSV المعتمد' : 'Download CSV Template'}
            </span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv,text/plain"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-subtle)',
              color: 'var(--primary)',
              border: '1px solid var(--primary)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <Upload size={15} />
            <span>
              {uploadedFileName
                ? `${lang === 'ar' ? 'تغيير الملف:' : 'File:'} ${uploadedFileName}`
                : lang === 'ar'
                  ? 'اختيار ملف CSV من الجهاز'
                  : 'Choose CSV File'}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Manual Staging Row Form */}
      <form
        onSubmit={handleAddManualRow}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '10px',
          alignItems: 'end',
        }}
      >
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '11.5px',
              fontWeight: '700',
              marginBottom: '4px',
              color: 'var(--text-secondary)',
            }}
          >
            {lang === 'ar' ? 'اسم الطالب *' : 'Student Name *'}
          </label>
          <input
            type="text"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            placeholder={lang === 'ar' ? 'الاسم الثلاثي أو الرباعي' : 'Full Name'}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '11.5px',
              fontWeight: '700',
              marginBottom: '4px',
              color: 'var(--text-secondary)',
            }}
          >
            {lang === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
          </label>
          <input
            type="text"
            value={manualPhone}
            onChange={(e) => setManualPhone(e.target.value)}
            placeholder="01000000000"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '11.5px',
              fontWeight: '700',
              marginBottom: '4px',
              color: 'var(--text-secondary)',
            }}
          >
            {lang === 'ar' ? 'المرحلة الدراسية' : 'Grade'}
          </label>
          <input
            type="text"
            value={manualGrade}
            onChange={(e) => setManualGrade(e.target.value)}
            placeholder={lang === 'ar' ? 'الثالث الثانوي' : 'Grade 12'}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '11.5px',
              fontWeight: '700',
              marginBottom: '4px',
              color: 'var(--text-secondary)',
            }}
          >
            {lang === 'ar' ? 'اسم المجموعة (اختياري)' : 'Group Name (Optional)'}
          </label>
          <input
            type="text"
            value={manualGroup}
            onChange={(e) => setManualGroup(e.target.value)}
            placeholder={lang === 'ar' ? 'يُستخدم الافتراضي إن تُرك فارغاً' : 'Optional group name'}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '9px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-app)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <Plus size={14} />
          <span>{lang === 'ar' ? 'إضافة لجدول المراجعة' : 'Stage Row'}</span>
        </button>
      </form>

      {parseError && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid rgba(220, 38, 38, 0.25)',
            color: 'var(--color-danger, #DC2626)',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>{parseError}</span>
        </div>
      )}

      {/* Invalid rows warning from CSV parser */}
      {invalidFileRows.length > 0 && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(217, 119, 6, 0.1)',
            border: '1px solid rgba(217, 119, 6, 0.3)',
            color: 'var(--warning)',
            fontSize: '12.5px',
          }}
        >
          <div style={{ fontWeight: '800', marginBottom: '4px' }}>
            {lang === 'ar'
              ? `تم استبعاد ${invalidFileRows.length} صف غير مكتمل من الملف:`
              : `Excluded ${invalidFileRows.length} invalid row(s) from CSV:`}
          </div>
          <ul style={{ margin: 0, paddingInlineStart: '18px' }}>
            {invalidFileRows.slice(0, 5).map((ir) => (
              <li key={ir.rowNumber}>
                {lang === 'ar'
                  ? `صف #${ir.rowNumber} (${ir.name}): ${ir.reasonAr}`
                  : `Row #${ir.rowNumber} (${ir.name}): ${ir.reasonEn}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Staged Rows Table Ready for Backend Import */}
      {stagedRows.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {lang === 'ar'
                ? `سجلات جاهزة للاعتماد والمزامنة (${stagedRows.length} طالب):`
                : `Staged Rows Ready for Import (${stagedRows.length}):`}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setStagedRows([])}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {lang === 'ar' ? 'مسح القائمة' : 'Clear All'}
              </button>

              <button
                type="button"
                disabled={isImporting}
                onClick={handleCommitImport}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: isImporting ? 'not-allowed' : 'pointer',
                }}
              >
                <Upload size={15} />
                <span>
                  {isImporting
                    ? lang === 'ar'
                      ? 'جاري الاستيراد والتسكين...'
                      : 'Importing...'
                    : lang === 'ar'
                      ? `اعتماد واستيراد (${stagedRows.length}) طالب الآن`
                      : `Commit & Import (${stagedRows.length}) Students`}
                </span>
              </button>
            </div>
          </div>

          <div
            style={{
              overflowX: 'auto',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: isRtl ? 'right' : 'left',
                fontSize: '12.5px',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--bg-app)',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'اسم الطالب' : 'Student Name'}
                  </th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'الهاتف' : 'Phone'}
                  </th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'المجموعة' : 'Group'}
                  </th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'المرحلة' : 'Grade'}
                  </th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'إجراء' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {stagedRows.map((row, idx) => (
                  <tr
                    key={`${row.phone}-${idx}`}
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <td
                      style={{
                        padding: '10px 14px',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {row.name}
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                      {row.phone}
                    </td>
                    <td
                      style={{
                        padding: '10px 14px',
                        color: 'var(--primary)',
                        fontWeight: '600',
                      }}
                    >
                      {row.group ||
                        groups.find((g) => g.id === defaultGroupId)?.nameAr ||
                        (lang === 'ar' ? 'بدون مجموعة محددة' : 'Unassigned')}
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                      {row.grade}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveStagedRow(idx)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--color-danger, #DC2626)',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                        title={lang === 'ar' ? 'حذف السجل' : 'Remove row'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Backend Import Execution Summary */}
      {importResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(22, 163, 74, 0.1)',
              border: '1px solid rgba(22, 163, 74, 0.25)',
              color: 'var(--success)',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={17} />
              <span>
                {lang === 'ar'
                  ? `تمت معالجة الدفعة بنجاح: استيراد ${importResult.importedCount ?? 0} طالب، وتسكين ${importResult.enrolledCount ?? 0} في المجموعات.`
                  : `Batch processed: ${importResult.importedCount ?? 0} imported, ${importResult.enrolledCount ?? 0} enrolled in groups.`}
              </span>
            </div>
            {Number(importResult.skippedCount) > 0 && (
              <span style={{ color: 'var(--warning)' }}>
                {lang === 'ar'
                  ? `تم تخطي: ${importResult.skippedCount}`
                  : `Skipped: ${importResult.skippedCount}`}
              </span>
            )}
          </div>

          {Array.isArray(importResult.importedRows) && importResult.importedRows.length > 0 && (
            <div
              style={{
                overflowX: 'auto',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: isRtl ? 'right' : 'left',
                  fontSize: '12px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: 'var(--bg-app)',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'اسم الطالب' : 'Student Name'}
                    </th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'الهاتف' : 'Phone'}
                    </th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'المجموعة المسكن بها' : 'Enrolled Group'}
                    </th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'المرحلة' : 'Grade'}
                    </th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {importResult.importedRows.map((r, i) => (
                    <tr key={`${r.phone}-${i}`} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td
                        style={{
                          padding: '10px 14px',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {r.name}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                        {r.phone}
                      </td>
                      <td
                        style={{
                          padding: '10px 14px',
                          color: 'var(--primary)',
                          fontWeight: '600',
                        }}
                      >
                        {r.group}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                        {r.grade}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            color: 'var(--success)',
                            fontWeight: '700',
                          }}
                        >
                          {lang === 'ar' ? 'تم الحفظ في قاعدة البيانات' : 'Synced to Database'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
