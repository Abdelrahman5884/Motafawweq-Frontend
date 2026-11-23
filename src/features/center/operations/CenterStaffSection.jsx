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
  const [modalStaff, setModalStaff] = useState(null); // null | { mode: 'create' | 'edit', member }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: 'var(--bg-surface)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div>
          <h3 style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            {isAr ? 'إدارة الموظفين الإداريين وفريق الاستقبال' : 'Administrative Staff & Reception Roles'}
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {staff.length} {isAr ? 'موظفين معينين بالفروع' : 'active staff members'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {staff.length > 0 && (
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={isAr ? 'بحث في الموظفين...' : 'Search staff...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  height: '36px',
                  padding: '0 12px 0 32px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                }}
              />
              <Search
                size={14}
                color="var(--text-secondary)"
                style={{ position: 'absolute', left: '10px', top: '11px' }}
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setModalStaff({ mode: 'create', member: null })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <UserPlus size={14} />
            <span>{isAr ? '+ إضافة موظف جديد' : '+ Add Staff Member'}</span>
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {staff.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <ShieldCheck
              size={36}
              color="var(--primary)"
              style={{ margin: '0 auto 12px', display: 'block', opacity: 0.8 }}
            />
            <h4 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
              {isAr ? 'لم يتم إضافة موظفين إداريين حتى الآن' : 'No administrative staff added yet'}
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 16px' }}>
              {isAr
                ? 'أضف موظفي الاستقبال ومشرفي القاعات ومديري الفروع وحدد صلاحيات كل موظف بدقة.'
                : 'Add receptionists, hall supervisors, and branch managers with role-based permissions.'}
            </p>
            <button
              type="button"
              onClick={() => setModalStaff({ mode: 'create', member: null })}
              style={{
                padding: '9px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {isAr ? '+ تعيين أول موظف بالسنتر' : '+ Add First Staff Member'}
            </button>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            {isAr ? 'لا يوجد موظفون يطابقون البحث الحالي.' : 'No staff members match your search.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '720px', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <th style={{ padding: '12px 18px' }}>{isAr ? 'الاسم' : 'Name'}</th>
                  <th style={{ padding: '12px 18px' }}>{isAr ? 'المسمى الوظيفي' : 'Role'}</th>
                  <th style={{ padding: '12px 18px' }}>{isAr ? 'الفرع المخصص' : 'Branch'}</th>
                  <th style={{ padding: '12px 18px' }}>{isAr ? 'الهاتف' : 'Phone'}</th>
                  <th style={{ padding: '12px 18px' }}>{isAr ? 'الصلاحيات الرئيسية' : 'Permissions'}</th>
                  <th style={{ padding: '12px 18px', textAlign: 'center' }}>{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                    <td style={{ padding: '14px 18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {s.nameAr}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: '11.5px',
                          padding: '3px 9px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'rgba(21, 136, 199, 0.1)',
                          color: 'var(--primary)',
                          fontWeight: '800',
                        }}
                      >
                        {s.roleAr}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-primary)', fontWeight: '700' }}>
                      {s.branchNameAr || (isAr ? 'الفرع الرئيسي' : 'Main Branch')}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                      <span dir="ltr" style={{ display: 'inline-block' }}>
                        {s.phone || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(Array.isArray(s.permissions) ? s.permissions : []).map((p, i) => (
                          <span
                            key={`${p}-${i}`}
                            style={{
                              fontSize: '10.5px',
                              fontWeight: '700',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--bg-app)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setModalStaff({ mode: 'edit', member: s })}
                          title={isAr ? 'تعديل الموظف والصلاحيات' : 'Edit Staff'}
                          style={{
                            padding: '6px 8px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-app)',
                            color: 'var(--text-primary)',
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
                            padding: '6px 8px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            backgroundColor: 'rgba(239, 68, 68, 0.06)',
                            color: 'var(--danger, #EF4444)',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
            backgroundColor: 'rgba(15, 23, 42, 0.68)',
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
              border: '1.5px solid rgba(239, 68, 68, 0.4)',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 8px' }}>
              {isAr ? 'تأكيد إلغاء تعيين الموظف' : 'Remove Staff Member'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px', lineHeight: 1.5 }}>
              {isAr
                ? `هل أنت متأكد من حذف الموظف «${deleteTarget.nameAr}» (${deleteTarget.roleAr})؟`
                : `Are you sure you want to remove "${deleteTarget.nameAr}"?`}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={async () => {
                  const target = deleteTarget;
                  setDeleteTarget(null);
                  await onDeleteStaff(target);
                }}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--danger, #EF4444)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'نعم، حذف الموظف' : 'Yes, Remove'}
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                style={{
                  padding: '11px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
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
        backgroundColor: 'rgba(15, 23, 42, 0.68)',
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
          border: '1px solid var(--border-subtle)',
          maxWidth: '500px',
          width: '100%',
          padding: '24px',
          boxShadow: 'var(--shadow-xl)',
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
          <h3 style={{ fontSize: '16.5px', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>
            {mode === 'edit'
              ? isAr
                ? `تعديل بيانات وصلاحيات «${member?.nameAr}»`
                : 'Edit Staff Member'
              : isAr
                ? 'إضافة موظف وتحديد صلاحياته'
                : 'Add Staff Member'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
              {isAr ? 'اسم الموظف بالكامل *' : 'Staff Full Name *'}
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder={isAr ? 'اكتب اسم الموظف...' : 'Enter staff name...'}
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '700',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                {isAr ? 'المسمى الوظيفي والدور' : 'Role'}
              </label>
              <select
                value={roleAr}
                onChange={(e) => handleRoleChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                }}
              >
                {STAFF_ROLE_OPTIONS.map((opt) => (
                  <option key={opt.role} value={opt.roleAr}>
                    {isAr ? opt.roleAr : opt.roleEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                {isAr ? 'الفرع المخصص له' : 'Assigned Branch'}
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                }}
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
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
              {isAr ? 'رقم هاتف الموظف' : 'Phone Number'}
            </label>
            <input
              type="tel"
              placeholder="010XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px' }}>
              {isAr ? 'صلاحيات الموظف داخل المنظومة' : 'Permissions'}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ALL_STAFF_PERMISSIONS.map((perm) => {
                const active = permissions.includes(perm);
                return (
                  <button
                    key={perm}
                    type="button"
                    onClick={() => togglePermission(perm)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: active
                        ? '1px solid var(--primary)'
                        : '1px solid var(--border-subtle)',
                      backgroundColor: active
                        ? 'rgba(21, 136, 199, 0.12)'
                        : 'var(--bg-app)',
                      color: active ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {active && <Check size={11} />}
                    <span>{perm}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={submitting || !nameAr.trim()}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '800',
                fontSize: '13px',
                cursor: submitting ? 'wait' : 'pointer',
              }}
            >
              {submitting
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : mode === 'edit'
                  ? isAr
                    ? 'حفظ تعديلات الموظف'
                    : 'Save Changes'
                  : isAr
                    ? 'حفظ الموظف'
                    : 'Save Staff'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
