import React, { useCallback, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Building2, Calendar, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCenter } from '../../context/CenterContext';
import { useGroups } from '../../context/GroupsContext';
import { useLanguage } from '../../context/LanguageContext';
import { CenterCohortFormModal } from '../../features/center/groups';
import {
  CenterDeleteRoomModal,
  CenterMasterScheduleSection,
  CenterRoomFormModal,
  CenterRoomsCatalogSection,
  getTodayWeekdayKey,
} from '../../features/center/halls';

export const CenterHallsView = () => {
  const navigate = useNavigate();
  const { authLoading, isAuthenticated, hasActiveToken, currentUser } = useAuth();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const {
    isBackendCenter,
    branches = [],
    selectedBranchId,
    setSelectedBranchId,
    rooms = [],
    centerTeachers = [],
    addRoom,
    updateRoom,
    deleteRoom,
    checkScheduleConflict,
    loadCoreCenterData,
  } = useCenter();

  const {
    groups = [],
    enrolledStudents = {},
    addGroup,
    refreshGroups,
    showToast,
  } = useGroups();

  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'schedule'
  const [selectedDay, setSelectedDay] = useState(() => getTodayWeekdayKey());
  const [focusedRoomId, setFocusedRoomId] = useState(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deleteConfirmRoom, setDeleteConfirmRoom] = useState(null);
  const [bookingCohortDraft, setBookingCohortDraft] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const currentBranchRooms = useMemo(() => {
    if (!selectedBranchId || selectedBranchId === 'all') return rooms;
    return rooms.filter((r) => String(r.branchId) === String(selectedBranchId));
  }, [rooms, selectedBranchId]);

  const handleOpenAddRoom = useCallback(() => {
    setEditingRoom(null);
    setIsRoomModalOpen(true);
  }, []);

  const handleOpenEditRoom = useCallback((room, e) => {
    if (e) e.stopPropagation();
    setEditingRoom(room);
    setIsRoomModalOpen(true);
  }, []);

  const handleSaveRoom = useCallback(
    async (roomPayload) => {
      if (editingRoom) {
        await updateRoom(editingRoom.id, roomPayload);
        showToast?.(`تم حفظ تعديلات القاعة «${roomPayload.nameAr}» بنجاح!`);
      } else {
        await addRoom(roomPayload);
        showToast?.(`تمت إضافة القاعة «${roomPayload.nameAr}» بنجاح!`);
      }
      setEditingRoom(null);
      setIsRoomModalOpen(false);
    },
    [editingRoom, updateRoom, addRoom, showToast]
  );

  const handleToggleRoomAvailability = useCallback(
    async (room, nextIsAvailable) => {
      await updateRoom(room.id, {
        nameAr: room.nameAr,
        nameEn: room.nameEn || room.nameAr,
        branchId: room.branchId,
        capacity: room.capacity,
        floor: room.floor,
        equipped: room.equipped || room.equipment || [],
        isAvailable: nextIsAvailable,
      });
      showToast?.(
        nextIsAvailable
          ? `تم تفعيل القاعة «${room.nameAr}» وإتاحتها للحجز.`
          : `تم تحويل القاعة «${room.nameAr}» إلى وضع الصيانة.`,
        nextIsAvailable ? 'success' : 'warning'
      );
    },
    [updateRoom, showToast]
  );

  const handleConfirmDeleteRoom = useCallback(async () => {
    if (!deleteConfirmRoom) return;
    const deletedName = deleteConfirmRoom.nameAr;
    const deletedId = deleteConfirmRoom.id;
    try {
      await deleteRoom(deletedId);
      if (focusedRoomId === deletedId) setFocusedRoomId(null);
      showToast?.(`تم حذف القاعة «${deletedName}» بنجاح.`, 'warning');
    } finally {
      setDeleteConfirmRoom(null);
    }
  }, [deleteConfirmRoom, deleteRoom, focusedRoomId, showToast]);

  const handleOpenRoomSchedule = useCallback((room) => {
    if (!room?.id) return;
    setFocusedRoomId(room.id);
    setActiveTab('schedule');
  }, []);

  const handleOpenGroupDetail = useCallback(
    (groupId) => {
      if (!groupId) return;
      navigate(`/center/groups/${groupId}`);
    },
    [navigate]
  );

  const handleScheduleCohortInRoom = useCallback(
    (room, dayKey = null, slot = null) => {
      if (!room) return;
      const targetDay = dayKey || selectedDay || 'saturday';
      setBookingCohortDraft({
        branchId: room.branchId || (selectedBranchId !== 'all' ? selectedBranchId : branches[0]?.id || ''),
        roomId: room.id,
        hallName: room.nameAr,
        maxStudents: room.capacity || 50,
        scheduleSlots: [
          {
            day: targetDay,
            startTime: slot?.startTime || '16:00',
            endTime: slot?.endTime || '18:00',
            roomId: room.id,
            hall: room.nameAr,
          },
        ],
      });
    },
    [selectedDay, selectedBranchId, branches]
  );

  const handleSaveBookedCohort = useCallback(
    async (cohortPayload) => {
      const created = await addGroup(cohortPayload);
      setBookingCohortDraft(null);
      await loadCoreCenterData?.({ force: true });
      if (created?.id) {
        showToast?.(`تم تسكين المجموعة «${created.nameAr}» في القاعة بنجاح!`);
      }
    },
    [addGroup, loadCoreCenterData, showToast]
  );

  const handleRefreshAll = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await Promise.all([
        loadCoreCenterData?.({ force: true }),
        refreshGroups?.(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, loadCoreCenterData, refreshGroups]);

  if (authLoading) {
    return (
      <div className="center-dashboard-container executive-dashboard" aria-busy="true">
        <div
          className="executive-skeleton"
          style={{ height: '96px', borderRadius: 'var(--radius-xl)' }}
        />
        <div
          className="executive-skeleton"
          style={{ height: '380px', borderRadius: 'var(--radius-xl)' }}
        />
      </div>
    );
  }

  if (!isAuthenticated || !hasActiveToken || currentUser?.role !== 'center') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '24px 20px 80px',
        fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '22px',
          backgroundColor: 'var(--bg-surface)',
          padding: '18px 24px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: 'var(--primary)',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                }}
              >
                {isAr ? 'إدارة المساحات والجدول الموحد' : 'Room & Capacity Logistics'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: 'var(--success, #10B981)',
                  fontWeight: '800',
                }}
              >
                {currentBranchRooms.length} {isAr ? 'قاعات مسجلة' : 'Rooms Configured'}
              </span>
            </div>
            <h1 style={{ fontSize: '21px', fontWeight: '900', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
              {isAr
                ? 'إدارة القاعات وجداول التشغيل ومنع التعارض'
                : 'Rooms, Cohorts & Master Schedule'}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleRefreshAll}
            disabled={refreshing}
            title={isAr ? 'تحديث بيانات القاعات والجدول' : 'Refresh rooms & schedule'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: refreshing ? 'wait' : 'pointer',
            }}
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span>{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>

          <select
            value={selectedBranchId}
            onChange={(e) => {
              setSelectedBranchId(e.target.value);
              setFocusedRoomId(null);
            }}
            style={{
              padding: '9px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="all">
              {isAr ? 'جميع الفروع (كافة القاعات)' : 'All Branches (All Rooms)'}
            </option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {isAr ? b.nameAr : b.nameEn || b.nameAr}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleOpenAddRoom}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <Plus size={16} />
            <span>{isAr ? '+ إضافة قاعة جديدة' : '+ Add New Room'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '22px',
          gap: '24px',
        }}
      >
        {[
          {
            id: 'rooms',
            labelAr: 'قاعات السنتر وسعاتها الاستيعابية',
            labelEn: 'Rooms & Capacities',
            icon: Building2,
          },
          {
            id: 'schedule',
            labelAr: 'الجدول الموحد واكتشاف التعارضات',
            labelEn: 'Conflict-Free Master Schedule',
            icon: Calendar,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 4px',
                border: 'none',
                background: 'none',
                fontSize: '14px',
                fontWeight: '800',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              <span>{isAr ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      {activeTab === 'rooms' ? (
        <CenterRoomsCatalogSection
          rooms={currentBranchRooms}
          groups={groups}
          enrolledStudents={enrolledStudents}
          onOpenAddRoom={handleOpenAddRoom}
          onOpenEditRoom={handleOpenEditRoom}
          onDeleteRoom={setDeleteConfirmRoom}
          onToggleRoomAvailability={handleToggleRoomAvailability}
          onOpenRoomSchedule={handleOpenRoomSchedule}
          onOpenGroupDetail={handleOpenGroupDetail}
          onScheduleCohortInRoom={(room) => handleScheduleCohortInRoom(room)}
          lang={lang}
        />
      ) : (
        <CenterMasterScheduleSection
          rooms={currentBranchRooms}
          groups={groups}
          enrolledStudents={enrolledStudents}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          selectedBranchId={selectedBranchId}
          focusedRoomId={focusedRoomId}
          onClearFocusedRoom={() => setFocusedRoomId(null)}
          onOpenGroupDetail={handleOpenGroupDetail}
          onBookSlot={handleScheduleCohortInRoom}
          isBackendCenter={isBackendCenter}
          lang={lang}
        />
      )}

      {/* Create / Edit Room Modal */}
      {isRoomModalOpen && (
        <CenterRoomFormModal
          key={editingRoom?.id || 'create-room'}
          isOpen={isRoomModalOpen}
          editingRoom={editingRoom}
          branches={branches}
          selectedBranchId={selectedBranchId}
          onClose={() => {
            setIsRoomModalOpen(false);
            setEditingRoom(null);
          }}
          onSave={handleSaveRoom}
          lang={lang}
        />
      )}

      {/* Delete Room Confirmation Modal */}
      {deleteConfirmRoom && (
        <CenterDeleteRoomModal
          room={deleteConfirmRoom}
          groups={groups}
          onConfirm={handleConfirmDeleteRoom}
          onCancel={() => setDeleteConfirmRoom(null)}
          lang={lang}
        />
      )}

      {/* Quick Schedule New Cohort in Free Room Slot Modal */}
      {bookingCohortDraft && (
        <CenterCohortFormModal
          key={`book-room-${bookingCohortDraft.roomId}-${bookingCohortDraft.scheduleSlots?.[0]?.day}-${bookingCohortDraft.scheduleSlots?.[0]?.startTime}`}
          isOpen={Boolean(bookingCohortDraft)}
          editingCohort={bookingCohortDraft}
          onClose={() => setBookingCohortDraft(null)}
          onSave={handleSaveBookedCohort}
          branches={branches}
          rooms={rooms}
          centerTeachers={centerTeachers}
          checkScheduleConflict={checkScheduleConflict}
          lang={lang}
        />
      )}
    </div>
  );
};
