import React, { useMemo, useState } from 'react';
import {
  Check,
  Pencil,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { SBadge, SButton, SCard } from '../../../components/student/ui';
import { ALL_STAFF_PERMISSIONS, STAFF_ROLE_OPTIONS } from './centerOperationsUtils';

export const CenterStaffSection = ({
  staff = [],
  branches = [],
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  lang = 'ar',
  isRtl = true,
}) => {
  const isAr = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [modalStaff, setModalStaff] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredStaff = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter(
      (s) =>
        (s.nameAr || '').toLowerCase().includes(q) ||
        (s.roleAr || '').toLowerCase().includes(q) ||
        (s.branchNameAr || '').toLowerCase().includes(q) ||
        (s.phone || '').includes(q)
    );
  }, [staff, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <SCard padding={16} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'الفريق الإداري وصلاحيات الاستقبال' : 'Administrative Staff & Permissions'}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {staff.length} {isAr ? 'موظفين معينين بالفروع' : 'assigned staff members'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {staff.length > 0 && (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="co-input"
                  placeholder={isAr ? 'بحث في الموظفين...' : 'Search staff...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ height: '36px', paddingInlineStart: '34px', width: '210px', fontSize: '12.5px' }}
                />
                <Search
                  size={14}
                  color="var(--text-muted)"
                  style={{
                    position: 'absolute',
                    insetInlineStart: '11px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            )}

            <SButton
              variant="primary"
              size="sm"
              icon={<UserPlus size={14} />}
              onClick={() => setModalStaff({ mode: 'create', member: null })}
            >
              {isAr ? 'إضافة موظف' : 'Add Staff'}
            </SButton>
          </div>
        </div>
      </SCard>

      <SCard padding={0} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden' }}>
        {staff.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <ShieldCheck
              size={34}
              color="var(--primary)"
              style={{ margin: '0 auto 12px', display: 'block', opacity: 0.85 }}
            />
            <h4 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
              {isAr ? 'لم يتم إضافة موظفين إداريين حتى الآن' : 'No administrative staff added yet'}
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 16px' }}>
              {isAr
                ? 'أضف موظفي الاستقبال ومشرفي القاعات ومديري الفروع وحدد صلاحيات كل موظف بدقة.'
                : 'Add receptionists, hall supervisors, and branch managers with role-based permissions.'}
            </p>
            <SButton
              variant="primary"
              size="sm"
              icon={<UserPlus size={14} />}
              onClick={() => setModalStaff({ mode: 'create', member: null })}
            >
              {isAr ? 'تعيين أول موظف بالسنتر' : 'Add First Staff Member'}
            </SButton>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            {isAr ? 'لا يوجد موظفون يطابقون البحث الحالي.' : 'No staff members match your search.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="co-table" style={{ minWidth: '720px', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr>
                  <th>{isAr ? 'الموظف' : 'Staff'}</th>
                  <th>{isAr ? 'الدور الوظيفي' : 'Role'}</th>
                  <th>{isAr ? 'الفرع' : 'Branch'}</th>
                  <th>{isAr ? 'الهاتف' : 'Phone'}</th>
                  <th>{isAr ? 'الصلاحيات' : 'Permissions'}</th>
                  <th style={{ textAlign: 'center' }}>{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar name={s.nameAr || 'موظف'} size={34} />
                        <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                          {s.nameAr}
                        </span>
                      </div>
                    </td>
                    <td>
                      <SBadge variant="primary" size="xs">{s.roleAr}</SBadge>
                    </td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
                      {s.branchNameAr || (isAr ? 'الفرع الرئيسي' : 'Main Branch')}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                      <span dir="ltr" style={{ display: 'inline-block' }}>
                        {s.phone || '—'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(Array.isArray(s.permissions) ? s.permissions : []).map((p, i) => (
                          <span
                            key={`${p}-${i}`}
                            style={{
                              fontSize: '10.5px',
                              fontWeight: '700',
                              padding: '2px 7px',
                              borderRadius: '6px',
                              backgroundColor: 'var(--bg-subtle)',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setModalStaff({ mode: 'edit', member: s })}
                          title={isAr ? 'تعديل الموظف والصلاحيات' : 'Edit Staff'}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-surface)',
                            color: 'var(--text-secondary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(s)}
                          title={isAr ? 'حذف الموظف' : 'Remove Staff'}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(220, 38, 38, 0.25)',
                            backgroundColor: 'var(--error-light)',
                            color: 'var(--danger, #DC2626)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SCard>

      {/* Add / Edit Staff Modal */}
      {modalStaff && (
        <StaffFormModal
          key={modalStaff.member?.id || 'create-staff'}
          mode={modalStaff.mode}
          member={modalStaff.member}
          branches={branches}
          onClose={() => setModalStaff(null)}
          onSave={async (payload) => {
            if (modalStaff.mode === 'edit' && modalStaff.member) {
              await onUpdateStaff(modalStaff.member.id, payload);
            } else {
              await onAddStaff(payload);
            }
            setModalStaff(null);
          }}
          lang={lang}
        />
      )}

      {/* Delete Staff Confirm Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setDeleteTarget(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-medium)',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>
              {isAr ? 'تأكيد إلغاء تعيين الموظف' : 'Remove Staff Member'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px', lineHeight: 1.55 }}>
              {isAr
                ? `هل أنت متأكد من حذف الموظف «${deleteTarget.nameAr}» (${deleteTarget.roleAr})؟`
                : `Are you sure you want to remove "${deleteTarget.nameAr}"?`}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <SButton
                variant="danger"
                size="sm"
                onClick={async () => {
                  const target = deleteTarget;
                  setDeleteTarget(null);
                  await onDeleteStaff(target);
                }}
              >
                {isAr ? 'نعم، حذف الموظف' : 'Yes, Remove'}
              </SButton>
              <SButton variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </SButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StaffFormModal = ({
  mode,
  member,
  branches = [],
  onClose,
  onSave,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';
  const [nameAr, setNameAr] = useState(member?.nameAr || '');
  const [roleAr, setRoleAr] = useState(member?.roleAr || STAFF_ROLE_OPTIONS[0].roleAr);
  const [branchId, setBranchId] = useState(member?.branchId || branches[0]?.id || '');
  const [phone, setPhone] = useState(member?.phone || '');
  const [permissions, setPermissions] = useState(() => {
    if (Array.isArray(member?.permissions) && member.permissions.length > 0) {
      return member.permissions;
    }
    return STAFF_ROLE_OPTIONS[0].defaultPermissions;
  });
  const [submitting, setSubmitting] = useState(false);

  const handleRoleChange = (nextRoleAr) => {
    setRoleAr(nextRoleAr);
    const found = STAFF_ROLE_OPTIONS.find((r) => r.roleAr === nextRoleAr);
    if (found && mode !== 'edit') {
      setPermissions(found.defaultPermissions);
    }
  };

  const togglePermission = (perm) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameAr.trim() || submitting) return;
    const roleObj = STAFF_ROLE_OPTIONS.find((r) => r.roleAr === roleAr);

    setSubmitting(true);
    try {
      await onSave({
        nameAr: nameAr.trim(),
        role: roleObj?.role || 'receptionist',
        roleAr,
        branchId: branchId || undefined,
        phone: phone.trim(),
        permissions,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-medium)',
          maxWidth: '500px',
          width: '100%',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
          }}
        >
          <h3 style={{ fontSize: '16.5px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
            {mode === 'edit'
              ? isAr
                ? `تعديل بيانات «${member?.nameAr}»`
                : 'Edit Staff Member'
              : isAr
                ? 'إضافة موظف جديد'
                : 'Add Staff Member'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
              {isAr ? 'اسم الموظف بالكامل *' : 'Staff Full Name *'}
            </label>
            <input
              type="text"
              className="co-input"
              required
              autoFocus
              placeholder={isAr ? 'اكتب اسم الموظف...' : 'Enter staff name...'}
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                {isAr ? 'المسمى الوظيفي' : 'Role'}
              </label>
              <select
                className="co-input"
                value={roleAr}
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                {STAFF_ROLE_OPTIONS.map((opt) => (
                  <option key={opt.role} value={opt.roleAr}>
                    {isAr ? opt.roleAr : opt.roleEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                {isAr ? 'الفرع المخصص' : 'Assigned Branch'}
              </label>
              <select
                className="co-input"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
              >
                {branches.length === 0 ? (
                  <option value="">{isAr ? 'الفرع الرئيسي' : 'Main Branch'}</option>
                ) : (
                  branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {isAr ? b.nameAr : b.nameEn || b.nameAr}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
              {isAr ? 'رقم الهاتف' : 'Phone Number'}
            </label>
            <input
              type="tel"
              dir="ltr"
              className="co-input"
              placeholder="010XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
              {isAr ? 'الصلاحيات داخل المنظومة' : 'Permissions'}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ALL_STAFF_PERMISSIONS.map((perm) => {
                const active = permissions.includes(perm);
                return (
                  <button
                    key={perm}
                    type="button"
                    onClick={() => togglePermission(perm)}
                    className={`co-pill-filter${active ? ' active' : ''}`}
                  >
                    {active && <Check size={11} />}
                    <span>{perm}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <SButton type="button" variant="ghost" size="sm" onClick={onClose}>
              {isAr ? 'إلغاء' : 'Cancel'}
            </SButton>
            <SButton type="submit" variant="primary" size="sm" disabled={submitting || !nameAr.trim()}>
              {submitting
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : mode === 'edit'
                  ? isAr
                    ? 'حفظ التعديلات'
                    : 'Save Changes'
                  : isAr
                    ? 'حفظ الموظف'
                    : 'Save Staff'}
            </SButton>
          </div>
        </form>
      </div>
    </div>
  );
};
