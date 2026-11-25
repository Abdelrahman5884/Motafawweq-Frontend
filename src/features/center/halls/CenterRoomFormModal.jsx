import React, { useState } from 'react';
import { Building2, Check, Plus, X } from 'lucide-react';
import { FLOOR_OPTIONS, PRESET_ROOM_EQUIPMENT } from './centerHallsUtils';

export const CenterRoomFormModal = ({
  isOpen,
  editingRoom = null,
  branches = [],
  selectedBranchId = 'all',
  onClose,
  onSave,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';

  const defaultBranchId =
    editingRoom?.branchId ||
    (selectedBranchId && selectedBranchId !== 'all' ? selectedBranchId : branches[0]?.id || '');

  const [roomNameAr, setRoomNameAr] = useState(editingRoom?.nameAr || '');
  const [roomCapacity, setRoomCapacity] = useState(String(editingRoom?.capacity || 50));
  const [roomFloor, setRoomFloor] = useState(editingRoom?.floor || FLOOR_OPTIONS[1]);
  const [selectedBranchForRoom, setSelectedBranchForRoom] = useState(defaultBranchId);
  const [isAvailable, setIsAvailable] = useState(
    editingRoom ? editingRoom.isAvailable !== false : true
  );
  const [roomEquipment, setRoomEquipment] = useState(() => {
    const initial = editingRoom?.equipped || editingRoom?.equipment;
    if (Array.isArray(initial)) return initial;
    return ['شاشة ذكية تفاعلية', 'تكييف مركزي', 'نظام صوتيات لاسلكي'];
  });
  const [customEquipInput, setCustomEquipInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleEquipmentItem = (item) => {
    setRoomEquipment((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleAddCustomEquip = () => {
    const clean = customEquipInput.trim();
    if (!clean) return;
    if (!roomEquipment.includes(clean)) {
      setRoomEquipment((prev) => [...prev, clean]);
    }
    setCustomEquipInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomNameAr.trim() || submitting) return;

    const branchObj = branches.find((b) => b.id === selectedBranchForRoom) || branches[0];
    setSubmitting(true);
    try {
      await onSave({
        nameAr: roomNameAr.trim(),
        nameEn: roomNameAr.trim(),
        branchId: selectedBranchForRoom || undefined,
        branchNameAr: branchObj?.nameAr || 'الفرع الرئيسي',
        capacity: Math.max(1, Math.min(1000, Number.parseInt(roomCapacity, 10) || 40)),
        equipped: roomEquipment,
        floor: roomFloor.trim() || 'الطابق الأول',
        isAvailable,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const allEquipmentChoices = Array.from(
    new Set([...PRESET_ROOM_EQUIPMENT, ...roomEquipment])
  );

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
        zIndex: 9999,
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
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '24px',
          boxShadow: 'var(--shadow-xl)',
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
            <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              {editingRoom
                ? isAr
                  ? 'تعديل بيانات القاعة الدراسية'
                  : 'Edit Classroom'
                : isAr
                  ? 'إضافة قاعة دراسية جديدة'
                  : 'Add New Classroom'}
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
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
              {isAr ? 'اسم القاعة الدراسية *' : 'Classroom Name *'}
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder={isAr ? 'مثال: قاعة 1 الكبرى أو مدرج أينشتاين' : 'e.g. Hall 1'}
              value={roomNameAr}
              onChange={(e) => setRoomNameAr(e.target.value)}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                {isAr ? 'السعة الاستيعابية (مقعد) *' : 'Seating Capacity *'}
              </label>
              <input
                type="number"
                required
                min="1"
                max="1000"
                value={roomCapacity}
                onChange={(e) => setRoomCapacity(e.target.value)}
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

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                {isAr ? 'الطابق / الموقع' : 'Floor'}
              </label>
              <input
                type="text"
                list="center-room-floor-options"
                required
                value={roomFloor}
                onChange={(e) => setRoomFloor(e.target.value)}
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
              <datalist id="center-room-floor-options">
                {FLOOR_OPTIONS.map((fl) => (
                  <option key={fl} value={fl} />
                ))}
              </datalist>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                {isAr ? 'الفرع التابع له القاعة' : 'Branch'}
              </label>
              <select
                value={selectedBranchForRoom}
                onChange={(e) => setSelectedBranchForRoom(e.target.value)}
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

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                {isAr ? 'حالة التشغيل' : 'Operational Status'}
              </label>
              <select
                value={isAvailable ? 'available' : 'maintenance'}
                onChange={(e) => setIsAvailable(e.target.value === 'available')}
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
                <option value="available">{isAr ? 'متاحة للتشغيل والحجز' : 'Available for Booking'}</option>
                <option value="maintenance">{isAr ? 'خارج الخدمة / في الصيانة' : 'Under Maintenance'}</option>
              </select>
            </div>
          </div>

          {/* Equipment Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
              {isAr ? 'التجهيزات التقنية بالقاعة' : 'Classroom Equipment'}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {allEquipmentChoices.map((eq) => {
                const active = roomEquipment.includes(eq);
                return (
                  <button
                    key={eq}
                    type="button"
                    onClick={() => toggleEquipmentItem(eq)}
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
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {active && <Check size={12} />}
                    <span>{eq}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder={isAr ? 'إضافة تجهيز آخر (مثال: ميكروفون لاسلكي)...' : 'Add custom equipment...'}
                value={customEquipInput}
                onChange={(e) => setCustomEquipInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomEquip();
                  }
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomEquip}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={13} />
                <span>{isAr ? 'إضافة' : 'Add'}</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={submitting || !roomNameAr.trim()}
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
                : editingRoom
                  ? isAr
                    ? 'حفظ تعديلات القاعة'
                    : 'Save Changes'
                  : isAr
                    ? 'حفظ وإضافة القاعة'
                    : 'Save Classroom'}
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
