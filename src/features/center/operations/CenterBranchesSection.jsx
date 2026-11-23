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
  const [modalBranch, setModalBranch] = useState(null); // null | { mode: 'create' | 'edit', branch }
  const [deleteTarget, setDeleteTarget] = useState(null);

  const enrichedBranches = useMemo(() => {
    return branches.map((branch) => {
      const localRooms = rooms.filter((r) => String(r.branchId) === String(branch.id));
      const localTeachers = centerTeachers.filter(
        (t) => String(t.branchId) === String(branch.id)
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
      const utilizationRate = Math.min(
        100,
        Math.max(0, Number(branch.utilizationRate ?? 0))
      );

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search & New Branch Bar */}
      {enrichedBranches.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            backgroundColor: 'var(--bg-surface)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
            <input
              type="text"
              placeholder={
                isAr
                  ? 'ابحث باسم الفرع أو العنوان أو مدير الفرع...'
                  : 'Search by branch name, address, or manager...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                padding: '0 14px 0 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
              }}
            />
            <Search
              size={15}
              color="var(--text-secondary)"
              style={{ position: 'absolute', left: '12px', top: '11px' }}
            />
          </div>

          <button
            type="button"
            onClick={() => setModalBranch({ mode: 'create', branch: null })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Plus size={15} />
            <span>{isAr ? '+ إنشاء فرع جديد' : '+ New Branch'}</span>
          </button>
        </div>
      )}

      {/* Branches Grid */}
      {enrichedBranches.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 24px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px dashed var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              margin: '0 auto 16px',
            }}
          >
            <Building2 size={28} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {isAr ? 'لم يتم تسجيل أي فروع للسنتر حتى الآن' : 'No center branches created yet'}
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              maxWidth: '440px',
              margin: '0 auto 20px',
              lineHeight: 1.6,
            }}
          >
            {isAr
              ? 'قم بإنشاء الفرع الرئيسي للسنتر الآن لتنظيم القاعات الدراسية والمعلمين والموظفين وتتبع نسب الإشغال.'
              : 'Create your main branch now to organize classrooms, teachers, staff, and track utilization.'}
          </p>
          <button
            type="button"
            onClick={() => setModalBranch({ mode: 'create', branch: null })}
            style={{
              padding: '10px 22px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus size={16} />
            <span>{isAr ? '+ إنشاء الفرع الرئيسي الآن' : '+ Create Main Branch'}</span>
          </button>
        </div>
      ) : filteredBranches.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 24px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
          }}
        >
          {isAr ? 'لا توجد فروع تطابق البحث الحالي.' : 'No branches match your search.'}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredBranches.map((branch) => {
            const utilization = branch.utilizationRate;

            return (
              <div
                key={branch.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: branch.isMain
                    ? '1.5px solid rgba(21, 136, 199, 0.45)'
                    : '1px solid var(--border-subtle)',
                  padding: '22px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  {/* Top Row: Address & Utilization Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginBottom: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11.5px',
                        color: 'var(--text-secondary)',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <MapPin size={12} color="var(--primary)" />
                      <span>{branch.addressAr || (isAr ? 'لم يحدد العنوان بعد' : 'Address not set')}</span>
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {branch.isMain && (
                        <span
                          style={{
                            fontSize: '10.5px',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'rgba(21, 136, 199, 0.12)',
                            color: 'var(--primary)',
                            fontWeight: '800',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <Star size={10} />
                          <span>{isAr ? 'الفرع الرئيسي' : 'Main'}</span>
                        </span>
                      )}

                      <span
                        style={{
                          fontSize: '11px',
                          padding: '3px 9px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor:
                            utilization > 0
                              ? 'rgba(16, 185, 129, 0.12)'
                              : 'var(--bg-subtle)',
                          color:
                            utilization > 0
                              ? 'var(--success, #10B981)'
                              : 'var(--text-secondary)',
                          fontWeight: '800',
                        }}
                      >
                        {utilization}% {isAr ? 'إشغال' : 'utilized'}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                    {isAr ? branch.nameAr : branch.nameEn || branch.nameAr}
                  </h3>

                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <UserCheck size={13} color="var(--primary)" />
                      <span>
                        {isAr ? 'مدير الفرع:' : 'Manager:'}{' '}
                        <strong style={{ color: 'var(--text-primary)' }}>
                          {branch.managerNameAr || (isAr ? 'إدارة السنتر' : 'Center Admin')}
                        </strong>
                      </span>
                    </span>
                    {branch.phone && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        • <Phone size={12} color="var(--primary)" />
                        <strong dir="ltr" style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                          {branch.phone}
                        </strong>
                      </span>
                    )}
                  </div>

                  {/* 3 Comparison Metrics */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '10px',
                      backgroundColor: 'var(--bg-app)',
                      padding: '14px 10px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-subtle)',
                      textAlign: 'center',
                    }}
                  >
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '700', marginBottom: '3px' }}>
                        {isAr ? 'عدد القاعات' : 'Classrooms'}
                      </div>
                      <div style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--primary)' }}>
                        {branch.roomsCount} {isAr ? 'قاعات' : 'rooms'}
                      </div>
                    </div>

                    <div
                      style={{
                        borderInlineStart: '1px solid var(--border-subtle)',
                        borderInlineEnd: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '700', marginBottom: '3px' }}>
                        {isAr ? 'عدد الطلاب' : 'Students'}
                      </div>
                      <div style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
                        {branch.activeStudents} {isAr ? 'طالب' : 'students'}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '700', marginBottom: '3px' }}>
                        {isAr ? 'عدد المدرسين' : 'Teachers'}
                      </div>
                      <div style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--success, #10B981)' }}>
                        {branch.teachersCount} {isAr ? 'مدرس' : 'teachers'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branch Action Buttons */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--border-subtle)',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setModalBranch({ mode: 'edit', branch })}
                      title={isAr ? 'تعديل بيانات الفرع' : 'Edit Branch'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '7px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-app)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                      }}
                    >
                      <Pencil size={13} style={{ color: 'var(--primary)' }} />
                      <span>{isAr ? 'تعديل' : 'Edit'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(branch)}
                      title={isAr ? 'حذف الفرع' : 'Delete Branch'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '7px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        backgroundColor: 'rgba(239, 68, 68, 0.06)',
                        color: 'var(--danger, #EF4444)',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} />
                      <span>{isAr ? 'حذف' : 'Delete'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenBranchHalls?.(branch)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'none',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '800',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <span>{isAr ? 'قاعات الفرع' : 'Branch Halls'}</span>
                    <ExternalLink size={13} />
                  </button>
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
              border: '1.5px solid rgba(239, 68, 68, 0.4)',
              maxWidth: '440px',
              width: '100%',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                color: 'var(--danger, #EF4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto',
              }}
            >
              <Trash2 size={26} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              {isAr ? 'تأكيد حذف الفرع' : 'Delete Branch'}
            </h3>

            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              {isAr
                ? `هل أنت متأكد من حذف الفرع «${deleteTarget.nameAr}»؟ لن يتم حذف القاعات أو الحصص المسجلة.`
                : `Are you sure you want to delete branch "${deleteTarget.nameAr}"?`}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={async () => {
                  const target = deleteTarget;
                  setDeleteTarget(null);
                  await onDeleteBranch(target);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--danger, #EF4444)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'نعم، احذف الفرع' : 'Yes, Delete'}
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                style={{
                  padding: '12px 20px',
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
  const [isMain, setIsMain] = useState(
    branch ? Boolean(branch.isMain) : !hasExistingBranches
  );
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
          maxWidth: '520px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '17px', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>
              {mode === 'edit'
                ? isAr
                  ? `تعديل بيانات «${branch?.nameAr}»`
                  : 'Edit Branch'
                : isAr
                  ? 'إنشاء وتدشين فرع جديد للسنتر'
                  : 'Create New Branch'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
              {isAr ? 'اسم الفرع *' : 'Branch Name *'}
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder={isAr ? 'مثال: الفرع الرئيسي — الدقي' : 'e.g. Main Branch'}
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '700',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
              {isAr ? 'العنوان والموقع الجغرافي' : 'Address'}
            </label>
            <input
              type="text"
              placeholder={isAr ? 'مثال: شارع التحرير، بجوار محطة المترو' : 'Street address...'}
              value={addressAr}
              onChange={(e) => setAddressAr(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                {isAr ? 'مدير الفرع المسؤول' : 'Branch Manager'}
              </label>
              <input
                type="text"
                placeholder={isAr ? 'اسم مدير الفرع...' : 'Manager name...'}
                value={managerNameAr}
                onChange={(e) => setManagerNameAr(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                {isAr ? 'رقم هاتف الفرع' : 'Branch Phone'}
              </label>
              <input
                type="tel"
                placeholder="010XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
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
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={isMain}
              onChange={(e) => setIsMain(e.target.checked)}
            />
            <span>{isAr ? 'تعيين كفرع رئيسي للسنتر' : 'Set as Main Center Branch'}</span>
          </label>

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
                    ? 'حفظ التعديلات'
                    : 'Save Changes'
                  : isAr
                    ? 'تدشين الفرع وحفظه'
                    : 'Create Branch'}
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
