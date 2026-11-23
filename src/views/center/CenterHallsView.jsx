import React, { useCallback, useMemo, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Calendar, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCenter } from '../../context/CenterContext';
import { useGroups } from '../../context/GroupsContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { SButton, SPage, SPageHeader, SSkeleton } from '../../components/student/ui';
import { CenterCohortFormModal } from '../../features/center/groups';
import {
  CenterDeleteRoomModal,
  CenterMasterScheduleSection,
  CenterRoomFormModal,
  CenterRoomsCatalogSection,
  doesSlotMatchRoom,
  getTodayWeekdayKey,
} from '../../features/center/halls';
import '../../features/center/halls/halls.css';

const VALID_TABS = ['rooms', 'schedule'];

export const CenterHallsView = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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
    centerSettings,
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

  const rawTab = searchParams.get('tab');
  const activeTab = VALID_TABS.includes(rawTab) ? rawTab : 'rooms';

  const setActiveTab = useCallback(
    (nextTab) => {
      if (nextTab === 'rooms') {
        const next = new URLSearchParams(searchParams);
        next.delete('tab');
        setSearchParams(next, { replace: true });
      } else {
        setSearchParams({ tab: nextTab }, { replace: true });
      }
    },
    [searchParams, setSearchParams]
  );

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

  const weeklySessionsCount = useMemo(() => {
    let count = 0;
    groups.forEach((g) => {
      const slots = g.scheduleSlots || g.slots || [];
      slots.forEach((s) => {
        if (selectedBranchId && selectedBranchId !== 'all') {
          const matchesBranchRoom = currentBranchRooms.some((r) => doesSlotMatchRoom(s, g, r));
          const matchesGroupBranch = String(g.branchId || '') === String(selectedBranchId);
          if (!matchesBranchRoom && !matchesGroupBranch) return;
        }
        count += 1;
      });
    });
    return count;
  }, [groups, selectedBranchId, currentBranchRooms]);

  const breadcrumbs = useMemo(
    () =>
      activeTab === 'schedule'
        ? [
            {
              labelAr: 'الجدول الأسبوعي',
              labelEn: 'Weekly Schedule',
              onClick: () => setActiveTab('rooms'),
            },
          ]
        : [],
    [activeTab, setActiveTab]
  );
  useSetBreadcrumbs(breadcrumbs);

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
        showToast?.(
          isAr
            ? `تم حفظ تعديلات القاعة «${roomPayload.nameAr}» بنجاح!`
            : `Room "${roomPayload.nameAr}" updated!`
        );
      } else {
        await addRoom(roomPayload);
        showToast?.(
          isAr
            ? `تمت إضافة القاعة «${roomPayload.nameAr}» بنجاح!`
            : `Room "${roomPayload.nameAr}" added!`
        );
      }
      setEditingRoom(null);
      setIsRoomModalOpen(false);
    },
    [editingRoom, updateRoom, addRoom, showToast, isAr]
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
          ? isAr
            ? `تم تفعيل القاعة «${room.nameAr}» وإتاحتها للحجز.`
            : `Room "${room.nameAr}" is now active.`
          : isAr
            ? `تم تحويل القاعة «${room.nameAr}» إلى وضع الصيانة.`
            : `Room "${room.nameAr}" set to maintenance.`,
        nextIsAvailable ? 'success' : 'warning'
      );
    },
    [updateRoom, showToast, isAr]
  );

  const handleConfirmDeleteRoom = useCallback(async () => {
    if (!deleteConfirmRoom) return;
    const deletedName = deleteConfirmRoom.nameAr;
    const deletedId = deleteConfirmRoom.id;
    try {
      await deleteRoom(deletedId);
      if (focusedRoomId === deletedId) setFocusedRoomId(null);
      showToast?.(
        isAr ? `تم حذف القاعة «${deletedName}» بنجاح.` : `Room "${deletedName}" deleted.`,
        'warning'
      );
    } finally {
      setDeleteConfirmRoom(null);
    }
  }, [deleteConfirmRoom, deleteRoom, focusedRoomId, showToast, isAr]);

  const handleOpenRoomSchedule = useCallback(
    (room) => {
      if (!room?.id) return;
      setFocusedRoomId(room.id);
      setActiveTab('schedule');
    },
    [setActiveTab]
  );

  const handleOpenGroupDetail = useCallback(
    (groupId) => {
      if (!groupId) return;
      navigate(`/center/groups/${groupId}`);
    },
    [navigate]
  );

  const handleScheduleCohortInRoom = useCallback(
    (room = null, dayKey = null, slot = null) => {
      const targetRoom =
        room ||
        currentBranchRooms.find((r) => String(r.id) === String(focusedRoomId)) ||
        currentBranchRooms.find((r) => r.isAvailable !== false) ||
        currentBranchRooms[0] ||
        null;

      const targetDay = dayKey || selectedDay || 'saturday';
      setBookingCohortDraft({
        branchId:
          targetRoom?.branchId ||
          (selectedBranchId !== 'all' ? selectedBranchId : branches[0]?.id || ''),
        roomId: targetRoom?.id || '',
        hallName: targetRoom?.nameAr || (isAr ? 'القاعة الرئيسية' : 'Main Hall'),
        maxStudents: targetRoom?.capacity || 50,
        scheduleSlots: [
          {
            day: targetDay,
            startTime: slot?.startTime || '16:00',
            endTime: slot?.endTime || '18:00',
            roomId: targetRoom?.id || undefined,
            hall: targetRoom?.nameAr || (isAr ? 'القاعة الرئيسية' : 'Main Hall'),
          },
        ],
      });
    },
    [currentBranchRooms, focusedRoomId, selectedDay, selectedBranchId, branches, isAr]
  );

  const handleSaveBookedCohort = useCallback(
    async (cohortPayload) => {
      const created = await addGroup(cohortPayload);
      setBookingCohortDraft(null);
      await loadCoreCenterData?.({ force: true });
      if (created?.id) {
        showToast?.(
          isAr
            ? `تم تسكين المجموعة «${created.nameAr}» في الجدول بنجاح!`
            : `Cohort "${created.nameAr}" scheduled successfully!`
        );
      }
    },
    [addGroup, loadCoreCenterData, showToast, isAr]
  );

  const handleRefreshAll = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await Promise.all([loadCoreCenterData?.({ force: true }), refreshGroups?.()]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, loadCoreCenterData, refreshGroups]);

  if (authLoading) {
    return (
      <SPage maxWidth={1240}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SSkeleton height={88} radius={16} />
          <div className="ch-kpi-grid">
            {[1, 2, 3, 4].map((i) => (
              <SSkeleton key={i} height={82} radius={16} />
            ))}
          </div>
          <SSkeleton height={360} radius={16} />
        </div>
      </SPage>
    );
  }

  if (!isAuthenticated || !hasActiveToken || currentUser?.role !== 'center') {
    return <Navigate to="/login" replace />;
  }

  const centerNameAr =
    centerSettings?.nameAr ||
    currentUser?.centerNameAr ||
    currentUser?.center ||
    (isAr ? 'السنتر التعليمي' : 'Educational Center');

  return (
    <SPage maxWidth={1240}>
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          paddingBottom: '48px',
          fontFamily: isRtl
            ? 'var(--font-arabic), "Cairo", system-ui, sans-serif'
            : 'var(--font-heading), "Outfit", sans-serif',
        }}
      >
        {/* ── 1. Unified Page Header ── */}
        <SPageHeader
          title={isAr ? 'القاعات والجدول الأسبوعي' : 'Halls & Weekly Schedule'}
          subtitle={
            isAr
              ? `إدارة قاعات «${centerNameAr}» وسعاتها الاستيعابية والجدول الأسبوعي الشامل بدون تعارض.`
              : `Manage classrooms, seating capacities, and the conflict-free weekly schedule.`
          }
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <SButton
                variant="ghost"
                size="sm"
                icon={<RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />}
                onClick={handleRefreshAll}
                disabled={refreshing}
              >
                {isAr ? 'تحديث' : 'Refresh'}
              </SButton>

              {branches.length > 0 && (
                <select
                  aria-label={isAr ? 'تصفية حسب الفرع' : 'Filter by branch'}
                  className="ch-select"
                  value={selectedBranchId}
                  onChange={(e) => {
                    setSelectedBranchId(e.target.value);
                    setFocusedRoomId(null);
                  }}
                >
                  <option value="all">
                    {isAr ? 'جميع الفروع' : 'All Branches'}
                  </option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {isAr ? b.nameAr : b.nameEn || b.nameAr}
                    </option>
                  ))}
                </select>
              )}

              <SButton
                variant="primary"
                size="sm"
                icon={<Plus size={15} />}
                onClick={
                  activeTab === 'schedule'
                    ? () => handleScheduleCohortInRoom()
                    : handleOpenAddRoom
                }
              >
                {activeTab === 'schedule'
                  ? isAr
                    ? 'حجز حصة جديدة'
                    : 'Schedule Session'
                  : isAr
                    ? 'إضافة قاعة'
                    : 'Add Room'}
              </SButton>
            </div>
          }
        />

        {/* ── 2. Underline Navigation Tabs ── */}
        <div className="ch-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'rooms'}
            className={`ch-tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            <Building2 size={16} />
            <span>{isAr ? 'القاعات والسعات' : 'Classrooms & Capacities'}</span>
            <span className="ch-tab-count">{currentBranchRooms.length}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'schedule'}
            className={`ch-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={16} />
            <span>{isAr ? 'الجدول الأسبوعي' : 'Weekly Schedule'}</span>
            <span className="ch-tab-count">{weeklySessionsCount}</span>
          </button>
        </div>

        {/* ── 3. Active Tab Content ── */}
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
            onSelectFocusedRoom={setFocusedRoomId}
            onClearFocusedRoom={() => setFocusedRoomId(null)}
            onOpenGroupDetail={handleOpenGroupDetail}
            onBookSlot={handleScheduleCohortInRoom}
            isBackendCenter={isBackendCenter}
            lang={lang}
            isRtl={isRtl}
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
            key={`book-room-${bookingCohortDraft.roomId || 'any'}-${bookingCohortDraft.scheduleSlots?.[0]?.day}-${bookingCohortDraft.scheduleSlots?.[0]?.startTime}`}
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
    </SPage>
  );
};
