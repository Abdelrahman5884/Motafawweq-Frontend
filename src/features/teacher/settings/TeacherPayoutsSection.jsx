import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Trash2,
  Info,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { SCard, SSection, SButton, SSkeleton } from '../../../components/student/ui';
import { PAYOUT_ACCOUNT_TYPES } from './teacherSettingsConfig';

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-medium)',
  backgroundColor: 'var(--bg-subtle)',
  color: 'var(--text-primary)',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
};

export const TeacherPayoutsSection = ({
  accounts = [],
  loading = false,
  loadError = null,
  onRetry,
  onAddAccount,
  onToggleActive,
  onSetDefault,
  onDeleteAccount,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [accountType, setAccountType] = useState('instapay');
  const [accountLabel, setAccountLabel] = useState('');
  const [accountValue, setAccountValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const selectedTypeMeta =
    PAYOUT_ACCOUNT_TYPES.find((t) => t.value === accountType) || PAYOUT_ACCOUNT_TYPES[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedValue = accountValue.trim();
    if (trimmedValue.length < 4) {
      setFeedback({
        type: 'error',
        text: isAr
          ? 'يرجى إدخال رقم حساب أو عنوان صحيح (4 أحرف على الأقل).'
          : 'Please enter a valid account identifier (at least 4 characters).',
      });
      return;
    }

    setIsAdding(true);
    setFeedback(null);
    try {
      await onAddAccount({
        type: accountType,
        account_identifier: trimmedValue,
        label_ar: accountLabel.trim() || undefined,
        label_en: accountLabel.trim() || undefined,
        is_default: accounts.length === 0,
      });
      setAccountLabel('');
      setAccountValue('');
      setFeedback({
        type: 'success',
        text: isAr ? 'تمت إضافة وسيلة الاستلام وتشفيرها بنجاح.' : 'Receiving account added and encrypted.',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err?.message || (isAr ? 'تعذر إضافة وسيلة الاستلام.' : 'Failed to add receiving account.'),
      });
    } finally {
      setIsAdding(false);
    }
  };

  const runAccountAction = async (id, fn, successText) => {
    setBusyId(id);
    setFeedback(null);
    try {
      await fn(id);
      setConfirmDeleteId(null);
      if (successText) {
        setFeedback({ type: 'success', text: successText });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err?.message || (isAr ? 'تعذر تنفيذ العملية.' : 'Action failed.'),
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'الحسابات البنكية واستقبال تحويلات الطلاب المباشرة' : 'Bank & Direct Receiving Accounts'}
          style={{ marginBottom: 0 }}
        >
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
            {isAr
              ? 'حدد الحسابات ووسائل الدفع التي يحول إليها الطلاب مباشرة عند شراء الكورسات والمذكرات (إنستاباي، فودافون كاش، الحساب البنكي، أو البطاقة).'
              : 'Configure receiving channels where students transfer funds directly when purchasing courses or materials.'}
          </p>

          {/* Direct Transfer Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-surface)',
              border: '1px solid var(--primary-light)',
              marginBottom: '20px',
              color: 'var(--primary)',
              fontSize: '13px',
              lineHeight: 1.5,
            }}
          >
            <Info size={20} style={{ flexShrink: 0 }} />
            <div>
              <span style={{ fontWeight: '800' }}>
                {isAr ? 'نظام التحويل المباشر للمعلم:' : 'Direct Transfer System:'}
              </span>
              <span style={{ marginInlineStart: '6px', color: 'var(--text-secondary)' }}>
                {isAr
                  ? 'التحويلات تتم مباشرة من الطالب إلى حسابك المعتمد أدناه، وتُحفظ بيانات حساباتك مشفّرة بالكامل.'
                  : 'Payments transfer directly from students to your active accounts below, stored encrypted at rest.'}
              </span>
            </div>
          </div>

          {/* Inline Action Feedback */}
          {feedback && (
            <div
              role="status"
              style={{
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: feedback.type === 'success' ? 'var(--success-light)' : 'var(--error-light)',
                color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger, #DC2626)',
                fontSize: '12.5px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              {feedback.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Receiving Accounts List */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
              <SSkeleton height={74} radius={12} />
              <SSkeleton height={74} radius={12} />
            </div>
          ) : loadError ? (
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--error-light)',
                color: 'var(--danger, #DC2626)',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '20px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                {loadError}
              </span>
              {onRetry && (
                <SButton variant="ghost" size="sm" icon={<RefreshCw />} onClick={onRetry}>
                  {isAr ? 'إعادة المحاولة' : 'Retry'}
                </SButton>
              )}
            </div>
          ) : accounts.length === 0 ? (
            <div
              style={{
                padding: '22px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                marginBottom: '22px',
              }}
            >
              {isAr
                ? 'لا توجد وسائل استلام مضافة بعد. أضف حسابك الأول بالأسفل ليظهر لطلابك.'
                : 'No receiving accounts configured yet. Add your first account below.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
              {accounts.map((pm) => {
                const isBusy = busyId === pm.id;
                const isConfirmingDelete = confirmDeleteId === pm.id;

                return (
                  <div
                    key={pm.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 18px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: pm.isActive ? 'var(--bg-surface)' : 'var(--bg-subtle)',
                      border: `1.5px solid ${pm.isDefault ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      opacity: isBusy ? 0.7 : 1,
                      flexWrap: 'wrap',
                      gap: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          backgroundColor: pm.isDefault ? 'var(--primary)' : 'var(--primary-light)',
                          color: pm.isDefault ? '#FFFFFF' : 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <CreditCard size={20} />
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                            {isAr ? pm.labelAr : pm.labelEn}
                          </span>
                          {pm.isDefault && (
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: '800',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--primary-light)',
                                color: 'var(--primary)',
                              }}
                            >
                              {isAr ? 'الافتراضي' : 'Default'}
                            </span>
                          )}
                          {!pm.isActive && (
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: '700',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--bg-surface)',
                                border: '1px solid var(--border-medium)',
                                color: 'var(--text-muted)',
                              }}
                            >
                              {isAr ? 'مخفي عن الطلاب' : 'Hidden'}
                            </span>
                          )}
                        </div>
                        <div
                          dir="ltr"
                          style={{
                            fontSize: '12.5px',
                            color: 'var(--text-secondary)',
                            fontFamily: 'var(--font-mono)',
                            marginTop: '3px',
                            wordBreak: 'break-all',
                          }}
                        >
                          {pm.value || pm.maskedValue}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      {!pm.isDefault && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() =>
                            runAccountAction(
                              pm.id,
                              onSetDefault,
                              isAr ? 'تم تعيين الحساب كوسيلة الاستلام الافتراضية.' : 'Default receiving account updated.'
                            )
                          }
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-medium)',
                            backgroundColor: 'var(--bg-surface)',
                            color: 'var(--text-secondary)',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: isBusy ? 'wait' : 'pointer',
                          }}
                        >
                          {isAr ? 'تعيين كافتراضي' : 'Set Default'}
                        </button>
                      )}

                      {/* Active Toggle Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={pm.isActive}
                        disabled={isBusy}
                        onClick={() =>
                          runAccountAction(
                            pm.id,
                            onToggleActive,
                            pm.isActive
                              ? (isAr ? 'تم إخفاء الحساب عن الطلاب.' : 'Account hidden from students.')
                              : (isAr ? 'تم تفعيل الحساب للطلاب.' : 'Account activated for students.')
                          )
                        }
                        title={isAr ? 'تفعيل أو إخفاء الحساب للطلاب' : 'Toggle account visibility'}
                        style={{
                          width: '42px',
                          height: '24px',
                          borderRadius: '99px',
                          border: 'none',
                          padding: 0,
                          backgroundColor: pm.isActive ? 'var(--primary)' : 'var(--border-medium)',
                          position: 'relative',
                          cursor: isBusy ? 'wait' : 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            position: 'absolute',
                            top: '3px',
                            insetInlineStart: pm.isActive ? '21px' : '3px',
                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          }}
                        />
                      </button>

                      {/* Delete with inline confirmation */}
                      {isConfirmingDelete ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              runAccountAction(
                                pm.id,
                                onDeleteAccount,
                                isAr ? 'تم حذف وسيلة الاستلام بنجاح.' : 'Receiving account removed.'
                              )
                            }
                            style={{
                              padding: '5px 10px',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: 'var(--danger, #DC2626)',
                              color: '#FFFFFF',
                              fontSize: '11.5px',
                              fontWeight: '700',
                              cursor: 'pointer',
                            }}
                          >
                            {isAr ? 'تأكيد الحذف' : 'Confirm'}
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => setConfirmDeleteId(null)}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-medium)',
                              backgroundColor: 'transparent',
                              color: 'var(--text-secondary)',
                              fontSize: '11.5px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            {isAr ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => setConfirmDeleteId(pm.id)}
                          aria-label={isAr ? 'حذف الحساب' : 'Delete account'}
                          title={isAr ? 'حذف الحساب' : 'Delete account'}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: 'rgba(220, 38, 38, 0.08)',
                            color: 'var(--danger, #DC2626)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isBusy ? 'wait' : 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add New Receiving Account Form */}
          <div
            style={{
              padding: '18px 20px',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px dashed var(--border-medium)',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
              {isAr ? 'إضافة حساب أو وسيلة استلام جديدة' : 'Add New Receiving Channel'}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                }}
              >
                <div>
                  <label htmlFor="payout-type" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {isAr ? 'نوع الحساب' : 'Account Type'}
                  </label>
                  <select
                    id="payout-type"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    style={inputStyle}
                  >
                    {PAYOUT_ACCOUNT_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {isAr ? opt.labelAr : opt.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="payout-label" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {isAr ? 'اسم الحساب (اختياري)' : 'Account Label (Optional)'}
                  </label>
                  <input
                    id="payout-label"
                    type="text"
                    maxLength={120}
                    placeholder={isAr ? 'مثال: محفظة فودافون الشخصية' : 'e.g. Personal Wallet'}
                    value={accountLabel}
                    onChange={(e) => setAccountLabel(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="payout-value" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {isAr ? 'رقم الحساب / العنوان / الآيبان *' : 'Account Number / IPA / Phone *'}
                  </label>
                  <input
                    id="payout-value"
                    type="text"
                    dir="ltr"
                    maxLength={120}
                    placeholder={isAr ? selectedTypeMeta.placeholderAr : selectedTypeMeta.placeholderEn}
                    value={accountValue}
                    onChange={(e) => setAccountValue(e.target.value)}
                    style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <SButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={<Plus />}
                  disabled={isAdding || accountValue.trim().length < 4}
                >
                  {isAdding
                    ? (isAr ? 'جاري الإضافة...' : 'Adding...')
                    : (isAr ? 'إضافة وسيلة الاستلام' : 'Add Receiving Account')}
                </SButton>
              </div>
            </form>
          </div>
        </SSection>
      </SCard>
    </div>
  );
};
