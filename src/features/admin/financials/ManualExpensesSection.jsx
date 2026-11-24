import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  FileText,
  Server,
  Cpu,
  Megaphone,
  Briefcase,
  Users,
  Layers,
  Calendar,
  Save,
  X,
  AlertCircle,
} from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

const EXPENSE_CATEGORIES = [
  { id: 'hosting', labelAr: 'سيرفرات واستضافة ودومين', labelEn: 'Servers & Hosting', icon: Server, color: '#1588C7', bg: 'rgba(21, 136, 199, 0.12)' },
  { id: 'ai', labelAr: 'خدمات الذكاء الاصطناعي API', labelEn: 'AI & Cloud APIs', icon: Cpu, color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.12)' },
  { id: 'marketing', labelAr: 'تسويق وإعلانات ممولة', labelEn: 'Marketing & Ads', icon: Megaphone, color: '#D97706', bg: 'rgba(245, 158, 11, 0.14)' },
  { id: 'operations', labelAr: 'تشغيل ومصروفات إدارية', labelEn: 'Operations', icon: Briefcase, color: '#059669', bg: 'rgba(5, 150, 105, 0.12)' },
  { id: 'salaries', labelAr: 'رواتب ومكافآت فريق العمل', labelEn: 'Team & Salaries', icon: Users, color: '#DB2777', bg: 'rgba(219, 39, 119, 0.12)' },
  { id: 'other', labelAr: 'تكاليف أخرى متنوعة', labelEn: 'Other Costs', icon: Layers, color: '#64748B', bg: 'rgba(100, 116, 139, 0.14)' },
];

const getCategoryMeta = (catId) =>
  EXPENSE_CATEGORIES.find((c) => c.id === catId) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];

const todayIso = () => new Date().toISOString().slice(0, 10);

const fieldStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '11px',
  border: '1.5px solid var(--border-subtle)',
  backgroundColor: 'var(--bg-subtle)',
  color: 'var(--text-primary)',
  fontSize: '13.5px',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  outline: 'none',
};

export const ManualExpenseModal = ({
  expense = null,
  lang = 'ar',
  isRtl = true,
  saving = false,
  onClose,
  onSave,
}) => {
  const isAr = lang === 'ar';
  const isEdit = Boolean(expense?.id);

  const [title, setTitle] = useState(() => expense?.title || '');
  const [amountEgp, setAmountEgp] = useState(() =>
    expense?.amountEgp !== undefined ? String(expense.amountEgp) : ''
  );
  const [category, setCategory] = useState(() => expense?.category || 'hosting');
  const [expenseDate, setExpenseDate] = useState(() => expense?.expenseDate || todayIso());
  const [note, setNote] = useState(() => expense?.note || '');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError(isAr ? 'يرجى كتابة اسم بند التكلفة.' : 'Expense title is required.');
      return;
    }
    const num = Number(amountEgp);
    if (!Number.isFinite(num) || num <= 0) {
      setFormError(isAr ? 'يرجى إدخال قيمة تكلفة صحيحة أكبر من صفر.' : 'Enter a valid amount greater than zero.');
      return;
    }

    try {
      await onSave?.({
        title: title.trim(),
        amountEgp: num,
        category,
        expenseDate: expenseDate || todayIso(),
        note: note.trim(),
      });
    } catch (err) {
      const firstErr =
        err?.errors && typeof err.errors === 'object'
          ? Object.values(err.errors).flat()[0]
          : null;
      setFormError(firstErr || err?.message || (isAr ? 'تعذر حفظ التكلفة.' : 'Failed to save cost.'));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => !saving && onClose?.()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 37, 78, 0.62)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px',
      }}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '22px',
          width: '100%',
          maxWidth: '540px',
          boxShadow: 'var(--shadow-lg)',
          direction: isRtl ? 'rtl' : 'ltr',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '18px 24px',
            background: 'linear-gradient(135deg, #06254E 0%, #1588C7 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900' }}>
              {isEdit ? (isAr ? 'تعديل بند التكلفة والملاحظة' : 'Edit Manual Cost') : (isAr ? 'إضافة تكلفة يدوية جديدة' : 'Add Manual Cost')}
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.82)' }}>
              {isAr ? 'سجّل الرقم والملاحظة الخاصة به ليتم خصمه تلقائياً من صافي الربح' : 'Record cost amount & note to update Net Profit live'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '9px', border: '1px solid rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} />
          </button>
        </div>

        {formError && (
          <div style={{ margin: '14px 24px 0', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#DC2626', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={15} />
            <span>{formError}</span>
          </div>
        )}

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
              {isAr ? 'اسم البند / عنوان التكلفة *' : 'Cost Item Title *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isAr ? 'مثال: اشتراك سيرفر الاستضافة الشهري، حملة فيسبوك...' : 'e.g. Monthly cloud server'}
              style={fieldStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
                {isAr ? 'المبلغ / قيمة التكلفة (ج.م) *' : 'Cost Amount (EGP) *'}
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amountEgp}
                onChange={(e) => setAmountEgp(e.target.value)}
                placeholder="0.00"
                style={{ ...fieldStyle, fontWeight: '900', fontSize: '15px', color: '#B45309' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
                {isAr ? 'تاريخ التكلفة' : 'Date'}
              </label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                style={fieldStyle}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
              {isAr ? 'تصنيف التكلفة' : 'Category'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ ...fieldStyle, fontWeight: '700', cursor: 'pointer' }}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {isAr ? c.labelAr : c.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
              {isAr ? 'ملاحظة هذا الرقم / تفاصيل الصرف' : 'Note for this Amount'}
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={isAr ? 'اكتب ملاحظتك على هذا الرقم (سبب التكلفة، الفاتورة، أو أي تفاصيل تذكيرية)...' : 'Write details or notes about this cost number...'}
              style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>
        </div>

        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            style={{ padding: '9px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: '#FFFFFF', fontSize: '13px', fontWeight: '800', cursor: saving ? 'wait' : 'pointer', boxShadow: 'var(--shadow-primary)' }}
          >
            <Save size={15} />
            <span>{saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التكلفة والملاحظة' : 'Save Cost')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const ManualExpensesSection = ({
  expenses = [],
  expensesSummary = {},
  lang = 'ar',
  busyId = null,
  onOpenAdd,
  onOpenEdit,
  onDelete,
}) => {
  const isAr = lang === 'ar';
  const cur = isAr ? 'ج.م' : 'EGP';
  const [catFilter, setCatFilter] = useState('all');

  const filtered = catFilter === 'all'
    ? expenses
    : expenses.filter((e) => e.category === catFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
            {isAr ? 'التكاليف اليدوية' : 'Manual Costs'}
          </h3>
          <InfoTooltip
            size={14}
            text={
              isAr
                ? `إجمالي التكاليف اليدوية: ${Number(expensesSummary?.totalEgp || 0).toLocaleString()} ${cur} (${expenses.length} بند) — تُخصم تلقائياً لحساب صافي ربح المنصة.`
                : `Total manual costs: ${Number(expensesSummary?.totalEgp || 0).toLocaleString()} ${cur} — automatically deducted from Net Profit.`
            }
          />
          <span style={{ padding: '4px 10px', borderRadius: '999px', backgroundColor: 'rgba(245, 158, 11, 0.14)', color: '#B45309', fontSize: '12px', fontWeight: '900' }}>
            {Number(expensesSummary?.totalEgp || 0).toLocaleString()} {cur}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenAdd}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '10px 18px',
            borderRadius: '11px',
            border: 'none',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-primary)',
          }}
        >
          <Plus size={16} />
          <span>{isAr ? 'إضافة تكلفة' : 'Add Cost'}</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <button
          type="button"
          onClick={() => setCatFilter('all')}
          style={{
            padding: '7px 14px',
            borderRadius: '999px',
            border: catFilter === 'all' ? '1.5px solid #06254E' : '1px solid var(--border-subtle)',
            backgroundColor: catFilter === 'all' ? '#06254E' : 'var(--bg-surface)',
            color: catFilter === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
          }}
        >
          {isAr ? `الكل (${expenses.length})` : `All (${expenses.length})`}
        </button>

        {EXPENSE_CATEGORIES.map((cat) => {
          const active = catFilter === cat.id;
          const catSum = Number(expensesSummary?.byCategory?.[cat.id] || 0);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCatFilter(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 13px',
                borderRadius: '999px',
                border: active ? `1.5px solid ${cat.color}` : '1px solid var(--border-subtle)',
                backgroundColor: active ? cat.bg : 'var(--bg-surface)',
                color: active ? cat.color : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: active ? '800' : '600',
                cursor: 'pointer',
              }}
            >
              <span>{isAr ? cat.labelAr : cat.labelEn}</span>
              {catSum > 0 && (
                <span style={{ fontWeight: '900' }}>({catSum.toLocaleString()} {cur})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Expenses List */}
      {filtered.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px dashed var(--border-medium)',
            borderRadius: '20px',
            padding: '44px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <FileText size={32} color="var(--primary)" />
          <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)' }}>
            {isAr ? 'لم تقم بتسجيل أي تكاليف يدوية بعد' : 'No manual costs recorded yet'}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '420px' }}>
            {isAr
              ? 'أضف أي مصروفات تشغيلية أو سيرفرات أو تسويق مع ملاحظة توضيحية لكل رقم لحساب صافي ربحك بدقة.'
              : 'Add hosting, marketing, or operational costs with notes for each figure.'}
          </div>
          <button
            type="button"
            onClick={onOpenAdd}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Plus size={15} />
            <span>{isAr ? 'إضافة أول بند تكلفة' : 'Add First Cost'}</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 330px), 1fr))', gap: '16px' }}>
          {filtered.map((exp) => {
            const cat = getCategoryMeta(exp.category);
            const CatIcon = cat.icon;
            const isBusy = busyId === exp.id;

            return (
              <div
                key={exp.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '18px',
                  padding: '18px 20px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  opacity: isBusy ? 0.55 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: cat.bg,
                        color: cat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CatIcon size={18} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '14.5px', fontWeight: '900', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {exp.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        <span style={{ color: cat.color, fontWeight: '700' }}>{isAr ? cat.labelAr : cat.labelEn}</span>
                        <span>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Calendar size={11} />
                          {exp.expenseDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#B45309', whiteSpace: 'nowrap' }}>
                    {Number(exp.amountEgp || 0).toLocaleString()} {cur}
                  </div>
                </div>

                {/* Visible Note Box for this Cost Number */}
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '11px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12.5px',
                    color: exp.note ? 'var(--text-primary)' : 'var(--text-muted)',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                    minHeight: '42px',
                  }}
                >
                  {exp.note || (isAr ? 'لا توجد ملاحظة مضافة لهذا الرقم.' : 'No note attached.')}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'auto', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => onOpenEdit?.(exp)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      borderRadius: '9px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    <Edit3 size={13} />
                    <span>{isAr ? 'تعديل الرقم / الملاحظة' : 'Edit'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => onDelete?.(exp)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 10px',
                      borderRadius: '9px',
                      border: '1px solid rgba(220, 38, 38, 0.25)',
                      backgroundColor: 'rgba(220, 38, 38, 0.06)',
                      color: '#DC2626',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
