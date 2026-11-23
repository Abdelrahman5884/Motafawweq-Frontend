import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Trash2,
  Upload,
} from 'lucide-react';
import { errorText, parseStudentImportCsv } from './centerSettingsUtils';

export const CenterDataImportTab = ({
  lang,
  isRtl,
  groups = [],
  importCenterStudents,
  exportToCsv,
  showToast,
}) => {
  const isAr = lang === 'ar';
  const fileInputRef = useRef(null);

  const [defaultGroupId, setDefaultGroupId] = useState(() => groups[0]?.id || '');
  const [stagedRows, setStagedRows] = useState([]);
  const [invalidFileRows, setInvalidFileRows] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [parseError, setParseError] = useState(null);

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
        isAr
          ? 'تم تحميل قالب استيراد الطلاب الرسمي (CSV).'
          : 'CSV template downloaded.',
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
        const msg = isAr ? parsed.errorAr : parsed.errorEn;
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
          isAr
            ? `تم فحص الملف: جاهز لاستيراد ${parsed.validRows.length} سجل.`
            : `File parsed: ${parsed.validRows.length} rows ready.`,
          'success'
        );
      }
    } catch {
      const msg = isAr
        ? 'تعذر قراءة ملف CSV المرفوع. تأكد من ترميز UTF-8.'
        : 'Could not read CSV file.';
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

  const handleRemoveRow = (idx) => {
    setStagedRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCommitImport = async () => {
    if (stagedRows.length === 0) {
      if (showToast) {
        showToast(
          isAr
            ? 'يرجى اختيار ملف CSV يحتوي على بيانات طلاب صالحة.'
            : 'Please select a valid CSV file.',
          'warning'
        );
      }
      return;
    }

    setIsImporting(true);
    setParseError(null);

    try {
      const targetGroupId = defaultGroupId || groups[0]?.id || null;
      const result = await importCenterStudents(stagedRows, targetGroupId);

      setImportResult(
        result || {
          importedCount: stagedRows.length,
          enrolledCount: stagedRows.length,
          skippedCount: 0,
        }
      );
      setStagedRows([]);
      setInvalidFileRows([]);
      setUploadedFileName('');

      if (showToast) {
        showToast(
          isAr
            ? `تم استيراد ${result?.importedCount ?? stagedRows.length} طالب بنجاح!`
            : `Imported ${result?.importedCount ?? stagedRows.length} students.`,
          'success'
        );
      }
    } catch (err) {
      const msg = errorText(
        err,
        isAr ? 'تعذر استيراد الطلاب.' : 'Failed to import students.'
      );
      setParseError(msg);
      if (showToast) showToast(msg, 'warning');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div>
      {/* 1. Upload & Options Card */}
      <div className="cs-card">
        <div className="cs-card-header">
          <div>
            <h3 className="cs-card-title">
              <FileSpreadsheet size={18} />
              <span>{isAr ? 'استيراد قوائم الطلاب من ملف CSV' : 'Bulk Student CSV Import'}</span>
            </h3>
            <p className="cs-card-subtitle">
              {isAr
                ? 'ارفع ملف CSV وسيقوم النظام بتسجيل الطلاب وتسكينهم في المجموعة المحددة فورياً.'
                : 'Upload a CSV to provision students and enroll them in target groups.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="cs-btn"
          >
            <Download size={14} />
            <span>{isAr ? 'تحميل قالب CSV المعتمد' : 'Download Template'}</span>
          </button>
        </div>

        <div className="cs-grid">
          <div className="cs-field">
            <label className="cs-label">
              {isAr ? 'المجموعة الافتراضية لتسكين الطلاب' : 'Default Target Group'}
            </label>
            <select
              className="cs-select"
              value={defaultGroupId}
              onChange={(e) => setDefaultGroupId(e.target.value)}
            >
              <option value="">
                {isAr
                  ? 'مطابقة اسم المجموعة من الملف تلقائياً'
                  : 'Auto-match group name from file'}
              </option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nameAr} {g.code ? `(${g.code})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="cs-field">
            <label className="cs-label">
              {isAr ? 'ملف بيانات الطلاب (CSV)' : 'CSV File'}
            </label>
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
              className="cs-btn cs-btn-primary"
              style={{ height: '42px' }}
            >
              <Upload size={15} />
              <span>
                {uploadedFileName
                  ? `${isAr ? 'تغيير الملف:' : 'Change:'} ${uploadedFileName}`
                  : isAr
                    ? 'اختيار ملف CSV من جهازك'
                    : 'Choose CSV File'}
              </span>
            </button>
          </div>
        </div>

        {parseError && (
          <div className="cs-alert cs-alert-danger">
            <AlertCircle size={16} />
            <span>{parseError}</span>
          </div>
        )}

        {invalidFileRows.length > 0 && (
          <div className="cs-alert cs-alert-warning" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontWeight: '800' }}>
              {isAr
                ? `تم استبعاد ${invalidFileRows.length} سجل غير مكتمل:`
                : `Excluded ${invalidFileRows.length} invalid rows:`}
            </div>
            <ul style={{ margin: '6px 0 0', paddingInlineStart: '18px' }}>
              {invalidFileRows.slice(0, 4).map((ir) => (
                <li key={ir.rowNumber}>
                  {isAr
                    ? `صف #${ir.rowNumber} (${ir.name}): ${ir.reasonAr}`
                    : `Row #${ir.rowNumber} (${ir.name}): ${ir.reasonEn}`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {importResult && (
          <div className="cs-alert cs-alert-success">
            <CheckCircle2 size={16} />
            <span>
              {isAr
                ? `تمت العملية بنجاح: استيراد ${importResult.importedCount ?? 0} طالب، وتسكين ${importResult.enrolledCount ?? 0} في المجموعات الدراسية.`
                : `Successfully imported ${importResult.importedCount ?? 0} students.`}
            </span>
          </div>
        )}
      </div>

      {/* 2. Staged Preview Table Card */}
      {stagedRows.length > 0 && (
        <div className="cs-card">
          <div className="cs-card-header">
            <div>
              <h3 className="cs-card-title">
                <span>
                  {isAr
                    ? `معاينة السجلات الجاهزة للاستيراد (${stagedRows.length})`
                    : `Staged Records (${stagedRows.length})`}
                </span>
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setStagedRows([])}
                className="cs-btn"
              >
                {isAr ? 'إلغاء الكل' : 'Clear'}
              </button>

              <button
                type="button"
                disabled={isImporting}
                onClick={handleCommitImport}
                className="cs-btn cs-btn-primary"
              >
                <Upload size={14} />
                <span>
                  {isImporting
                    ? isAr
                      ? 'جاري الاستيراد والتسكين...'
                      : 'Importing...'
                    : isAr
                      ? `اعتماد واستيراد (${stagedRows.length}) طالب`
                      : `Import (${stagedRows.length})`}
                </span>
              </button>
            </div>
          </div>

          <div className="cs-table-wrap">
            <table className="cs-table" style={{ textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr>
                  <th>{isAr ? 'اسم الطالب' : 'Name'}</th>
                  <th>{isAr ? 'رقم الهاتف' : 'Phone'}</th>
                  <th>{isAr ? 'المجموعة' : 'Group'}</th>
                  <th>{isAr ? 'المرحلة' : 'Grade'}</th>
                  <th style={{ width: '50px' }}>{isAr ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {stagedRows.map((row, idx) => (
                  <tr key={`${row.phone}-${idx}`}>
                    <td style={{ fontWeight: '700' }}>{row.name}</td>
                    <td style={{ fontFamily: 'monospace' }} dir="ltr">
                      {row.phone}
                    </td>
                    <td style={{ color: 'var(--primary)', fontWeight: '600' }}>
                      {row.group ||
                        groups.find((g) => g.id === defaultGroupId)?.nameAr ||
                        (isAr ? 'افتراضي' : 'Default')}
                    </td>
                    <td>{row.grade}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(idx)}
                        className="cs-btn cs-btn-danger cs-icon-btn"
                        title={isAr ? 'حذف السجل' : 'Remove'}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
