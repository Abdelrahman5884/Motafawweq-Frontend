import React, { useMemo, useState } from 'react';
import {
  Building2,
  ExternalLink,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  Star,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import { SBadge, SButton, SCard } from '../../../components/student/ui';

export const CenterBranchesSection = ({
  branches = [],
  rooms = [],
  centerTeachers = [],
  onAddBranch,
  onUpdateBranch,
  onDeleteBranch,
  onOpenBranchHalls,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [modalBranch, setModalBranch] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const enrichedBranches = useMemo(() => {
    return branches.map((branch) => {
      const localRooms = rooms.filter((r) => String(r.branchId) === String(branch.id));
      const localTeachers = centerTeachers.filter(
        (t) => String(t.branchId) === String(branch.id) && t.status === 'active'
      );

      const roomsCount =
        localRooms.length > 0 ? localRooms.length : Number(branch.roomsCount ?? 0);
      const totalCapacity =
        localRooms.length > 0
          ? localRooms.reduce((sum, r) => sum + (Number(r.capacity) || 0), 0)
          : Number(branch.totalCapacity ?? 0);
      const teachersCount =
        localTeachers.length > 0 ? localTeachers.length : Number(branch.teachersCount ?? 0);
      const activeStudents = Number(branch.activeStudents ?? 0);
      const utilizationRate = Math.min(100, Math.max(0, Number(branch.utilizationRate ?? 0)));

      return {
        ...branch,
        roomsCount,
        totalCapacity,
        teachersCount,
        activeStudents,
        utilizationRate,
      };
    });
  }, [branches, rooms, centerTeachers]);

  const filteredBranches = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return enrichedBranches;
    return enrichedBranches.filter(
      (b) =>
        (b.nameAr || '').toLowerCase().includes(q) ||
        (b.nameEn || '').toLowerCase().includes(q) ||
        (b.addressAr || '').toLowerCase().includes(q) ||
        (b.managerNameAr || '').toLowerCase().includes(q) ||
        (b.phone || '').includes(q)
    );
  }, [enrichedBranches, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Search & New Branch Toolbar */}
      {enrichedBranches.length > 0 && (
        <SCard padding={14} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
              <input
                type="text"
                className="co-input"
                placeholder={
                  isAr
                    ? 'ابحث باسم الفرع أو العنوان أو المدير...'
                    : 'Search by branch name, address, or manager...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingInlineStart: '36px' }}
              />
              <Search
                size={15}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  insetInlineStart: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            <SButton
              variant="primary"
              size="sm"
              icon={<Plus size={15} />}
              onClick={() => setModalBranch({ mode: 'create', branch: null })}
            >
              {isAr ? 'إنشاء فرع جديد' : 'New Branch'}
            </SButton>
          </div>
        </SCard>
      )}

      {/* Branches Grid */}
      {enrichedBranches.length === 0 ? (
        <SCard
          padding={48}
          style={{
            textAlign: 'center',
            border: '1.5px dashed var(--border-medium)',
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <Building2 size={26} />
          </div>
          <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
            {isAr ? 'لم يتم تسجيل أي فروع للسنتر حتى الآن' : 'No center branches created yet'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 18px', lineHeight: 1.6 }}>
            {isAr
              ? 'أنشئ الفرع الرئيسي لتنظيم القاعات والمعلمين والموظفين وتتبع نسب الإشغال.'
              : 'Create your main branch to organize classrooms, teachers, staff, and utilization.'}
          </p>
          <SButton
            variant="primary"
            size="sm"
            icon={<Plus size={15} />}
            onClick={() => setModalBranch({ mode: 'create', branch: null })}
          >
            {isAr ? 'إنشاء الفرع الرئيسي' : 'Create Main Branch'}
          </SButton>
        </SCard>
      ) : filteredBranches.length === 0 ? (
        <SCard padding={32} style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
          {isAr ? 'لا توجد فروع تطابق البحث الحالي.' : 'No branches match your search.'}
        </SCard>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredBranches.map((branch) => {
            const utilization = branch.utilizationRate;

            return (
              <div
                key={branch.id}
                className={`co-branch-card${branch.isMain ? ' is-main' : ''}`}
              >
                <div>
                  {/* Top Row: Badges */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginBottom: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {branch.isMain && (
                        <SBadge variant="primary" size="xs">
                          <Star size={10} />
                          <span>{isAr ? 'الفرع الرئيسي' : 'Main'}</span>
                        </SBadge>
                      )}
                      <SBadge variant={utilization > 0 ? 'success' : 'neutral'} size="xs">
                        {utilization}% {isAr ? 'إشغال' : 'utilized'}
                      </SBadge>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenBranchHalls?.(branch)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'none',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        padding: 0,
                        fontFamily: 'inherit',
                      }}
                    >
                      <span>{isAr ? 'قاعات الفرع' : 'Halls'}</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>

                  {/* Branch Name */}
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                    {isAr ? branch.nameAr : branch.nameEn || branch.nameAr}
                  </h3>

                  {/* Address & Contact Meta */}
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      marginBottom: '14px',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={13} color="var(--primary)" />
                      <span>{branch.addressAr || (isAr ? 'لم يحدد العنوان بعد' : 'Address not set')}</span>
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <UserCheck size={13} color="var(--primary)" />
                        <span>{branch.managerNameAr || (isAr ? 'إدارة السنتر' : 'Center Admin')}</span>
                      </span>
                      {branch.phone && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} color="var(--primary)" />
                          <span dir="ltr" style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                            {branch.phone}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Utilization Bar */}
                  <div style={{ marginBottom: '14px' }}>
                    <div
                      style={{
                        height: '6px',
                        borderRadius: '999px',
                        backgroundColor: 'var(--bg-subtle)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${utilization}%`,
                          height: '100%',
                          borderRadius: '999px',
                          backgroundColor: utilization >= 80 ? 'var(--success)' : 'var(--primary)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* 3 Stat Tiles */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      backgroundColor: 'var(--bg-app)',
                      padding: '12px 8px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      textAlign: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        {isAr ? 'القاعات' : 'Rooms'}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary)', marginTop: '2px' }}>
                        {branch.roomsCount}
                      </div>
                    </div>

                    <div
                      style={{
                        borderInlineStart: '1px solid var(--border-subtle)',
                        borderInlineEnd: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        {isAr ? 'الطلاب' : 'Students'}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                        {branch.activeStudents}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        {isAr ? 'المعلمون' : 'Teachers'}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--success)', marginTop: '2px' }}>
                        {branch.teachersCount}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '8px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <SButton
                    variant="ghost"
                    size="sm"
                    icon={<Pencil size={13} />}
                    onClick={() => setModalBranch({ mode: 'edit', branch })}
                  >
                    {isAr ? 'تعديل' : 'Edit'}
                  </SButton>

                  <SButton
                    variant="danger"
                    size="sm"
                    icon={<Trash2 size={13} />}
                    onClick={() => setDeleteTarget(branch)}
                  >
                    {isAr ? 'حذف' : 'Delete'}
                  </SButton>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Branch Modal */}
      {modalBranch && (
        <BranchFormModal
          key={modalBranch.branch?.id || 'create-branch'}
          mode={modalBranch.mode}
          branch={modalBranch.branch}
          hasExistingBranches={branches.length > 0}
          onClose={() => setModalBranch(null)}
          onSave={async (payload) => {
            if (modalBranch.mode === 'edit' && modalBranch.branch) {
              await onUpdateBranch(modalBranch.branch.id, payload);
            } else {
              await onAddBranch(payload);
            }
            setModalBranch(null);
          }}
          lang={lang}
        />
      )}

      {/* Delete Branch Confirm Modal */}
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
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--error-light)',
                color: 'var(--danger, #DC2626)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <Trash2 size={22} />
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>
              {isAr ? 'تأكيد حذف الفرع' : 'Delete Branch'}
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.55 }}>
              {isAr
                ? `هل أنت متأكد من حذف الفرع «${deleteTarget.nameAr}»؟ لن يتم حذف القاعات أو الحصص المسجلة.`
                : `Are you sure you want to delete branch "${deleteTarget.nameAr}"?`}
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <SButton
                variant="danger"
                size="sm"
                onClick={async () => {
                  const target = deleteTarget;
                  setDeleteTarget(null);
                  await onDeleteBranch(target);
                }}
              >
                {isAr ? 'نعم، احذف الفرع' : 'Yes, Delete'}
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

const BranchFormModal = ({
  mode,
  branch,
  hasExistingBranches,
  onClose,
  onSave,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';
  const [nameAr, setNameAr] = useState(branch?.nameAr || '');
  const [addressAr, setAddressAr] = useState(branch?.addressAr || '');
  const [managerNameAr, setManagerNameAr] = useState(branch?.managerNameAr || '');
  const [phone, setPhone] = useState(branch?.phone || '');
  const [isMain, setIsMain] = useState(branch ? Boolean(branch.isMain) : !hasExistingBranches);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameAr.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSave({
        nameAr: nameAr.trim(),
        nameEn: nameAr.trim(),
        addressAr: addressAr.trim(),
        managerNameAr: managerNameAr.trim(),
        phone: phone.trim(),
        isMain,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={19} color="var(--primary)" />
            <h3 style={{ fontSize: '16.5px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              {mode === 'edit'
                ? isAr
                  ? `تعديل فرع «${branch?.nameAr}»`
                  : 'Edit Branch'
                : isAr
                  ? 'إنشاء فرع جديد'
                  : 'Create New Branch'}
            </h3>
          </div>
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
              {isAr ? 'اسم الفرع *' : 'Branch Name *'}
            </label>
            <input
              type="text"
              className="co-input"
              required
              autoFocus
              placeholder={isAr ? 'مثال: الفرع الرئيسي — الدقي' : 'e.g. Main Branch'}
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
              {isAr ? 'العنوان' : 'Address'}
            </label>
            <input
              type="text"
              className="co-input"
              placeholder={isAr ? 'الشارع، الحي، المدينة...' : 'Street address...'}
              value={addressAr}
              onChange={(e) => setAddressAr(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                {isAr ? 'مدير الفرع' : 'Branch Manager'}
              </label>
              <input
                type="text"
                className="co-input"
                placeholder={isAr ? 'اسم المدير...' : 'Manager name...'}
                value={managerNameAr}
                onChange={(e) => setManagerNameAr(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                {isAr ? 'هاتف الفرع' : 'Branch Phone'}
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
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={isMain}
              onChange={(e) => setIsMain(e.target.checked)}
              style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
            />
            <span>{isAr ? 'تعيين كفرع رئيسي للسنتر' : 'Set as Main Branch'}</span>
          </label>

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
                    ? 'إنشاء الفرع'
                    : 'Create Branch'}
            </SButton>
          </div>
        </form>
      </div>
    </div>
  );
};
