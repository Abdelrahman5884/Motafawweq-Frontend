import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCenter } from '../../context/CenterContext';
import { useGroups } from '../../context/GroupsContext';
import { 
  Building2, 
  Users, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Tv, 
  Mic, 
  Wind, 
  Video, 
  Layers, 
  Filter, 
  Check, 
  X,
  MapPin,
  Sparkles,
  BarChart3
} from 'lucide-react';

const WEEKDAYS = [
  { key: 'Saturday', labelAr: 'السبت', labelEn: 'Saturday' },
  { key: 'Sunday', labelAr: 'الأحد', labelEn: 'Sunday' },
  { key: 'Monday', labelAr: 'الاثنين', labelEn: 'Monday' },
  { key: 'Tuesday', labelAr: 'الثلاثاء', labelEn: 'Tuesday' },
  { key: 'Wednesday', labelAr: 'الأربعاء', labelEn: 'Wednesday' },
  { key: 'Thursday', labelAr: 'الخميس', labelEn: 'Thursday' },
  { key: 'Friday', labelAr: 'الجمعة', labelEn: 'Friday' }
];

const STANDARD_CENTER_SLOTS = [
  { label: '10:00 ص - 12:00 م', startTime: '10:00', endTime: '12:00' },
  { label: '12:00 م - 02:00 م', startTime: '12:00', endTime: '14:00' },
  { label: '02:00 م - 04:00 م', startTime: '14:00', endTime: '16:00' },
  { label: '04:00 م - 06:00 م', startTime: '16:00', endTime: '18:00' },
  { label: '06:00 م - 08:00 م', startTime: '18:00', endTime: '20:00' },
  { label: '08:00 م - 10:00 م', startTime: '20:00', endTime: '22:00' }
];

const format12h = (t24) => {
  if (!t24) return '';
  const [h, m] = t24.split(':').map(Number);
  const period = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 || 12;
  return `${h12}:${m < 10 ? '0' + m : m} ${period}`;
};

const matchesRoom = (slotHallName, groupHallName, room) => {
  const clean = (s = '') => s.toLowerCase().replace(/[\(\)\s\-_]/g, '');
  const r = clean(room?.nameAr);
  const s = clean(slotHallName);
  const g = clean(groupHallName);
  return (s && (r.includes(s) || s.includes(r))) || (g && (r.includes(g) || g.includes(r)));
};

export const CenterHallsView = () => {
  const { lang, isRtl } = useLanguage();
  const { 
    branches, 
    selectedBranchId, 
    setSelectedBranchId, 
    rooms, 
    addRoom, 
    checkScheduleConflict 
  } = useCenter();
  const { groups, enrolledStudents, addGroup } = useGroups();

  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'schedule' | 'utilization'
  const [selectedDay, setSelectedDay] = useState('Saturday');
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);

  // New Room Form State
  const [roomNameAr, setRoomNameAr] = useState('');
  const [roomCapacity, setRoomCapacity] = useState('50');
  const [roomFloor, setRoomFloor] = useState('الطابق الأول');
  const [selectedBranchForRoom, setSelectedBranchForRoom] = useState(selectedBranchId);
  const [roomEquipment, setRoomEquipment] = useState(['شاشة ذكية تفاعلية', 'تكييف مركزي', 'نظام صوتيات لاسلكي']);

  // Filter rooms by branch (or all branches)
  const currentBranchRooms = React.useMemo(() => {
    if (!selectedBranchId || selectedBranchId === 'all') return rooms;
    return rooms.filter(r => r.branchId === selectedBranchId);
  }, [rooms, selectedBranchId]);

  const displayHalls = currentBranchRooms;

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!roomNameAr.trim()) return;

    addRoom({
      nameAr: roomNameAr,
      nameEn: roomNameAr,
      branchId: selectedBranchForRoom,
      branchNameAr: branches.find(b => b.id === selectedBranchForRoom)?.nameAr || 'الفرع الرئيسي',
      capacity: parseInt(roomCapacity) || 40,
      equipped: roomEquipment,
      floor: roomFloor,
      isAvailable: true
    });

    setRoomNameAr('');
    setIsAddRoomOpen(false);
  };



  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
    }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        backgroundColor: 'var(--bg-surface)',
        padding: '18px 24px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'rgba(21, 136, 199, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                {lang === 'ar' ? 'إدارة المساحات والجدول' : 'Room & Capacity Logistics'}
              </span>
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                fontWeight: '700'
              }}>
                {rooms.length} {lang === 'ar' ? 'قاعات مسجلة' : 'Rooms Configured'}
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
              {lang === 'ar' ? 'إدارة القاعات وجداول التشغيل ومنع التعارض' : 'Rooms, Cohorts & Master Schedule'}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsAddRoomOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Building2 size={16} />
            <span>{lang === 'ar' ? 'إضافة قاعة جديدة' : 'Add New Room'}</span>
          </button>

          {/* Branch Filter */}
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">
              {lang === 'ar' ? 'جميع الفروع (كافة القاعات)' : 'All Branches (All Rooms)'}
            </option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>
                {lang === 'ar' ? b.nameAr : b.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '24px',
        gap: '24px'
      }}>
        {[
          { id: 'rooms', labelAr: 'قاعات السنتر وسعاتها', labelEn: 'Rooms & Capacities', icon: Building2 },
          { id: 'schedule', labelAr: 'الجدول الموحد واكتشاف التعارضات', labelEn: 'Conflict-Free Master Schedule', icon: Calendar }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 4px',
                border: 'none',
                background: 'none',
                fontSize: '14px',
                fontWeight: '700',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Rooms & Capacities */}
      {activeTab === 'rooms' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {currentBranchRooms.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '60px 24px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px dashed var(--border-subtle)',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                backgroundColor: 'rgba(21, 136, 199, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                margin: '0 auto 16px'
              }}>
                <Building2 size={28} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'لم يتم إضافة قاعات دراسية في هذا الفرع بعد' : 'No classrooms added to this branch yet'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                {lang === 'ar'
                  ? 'يمكنك إضافة قاعة دراسية جديدة وتحديد سعتها المجهزة بالشاشات والتكييف ونظام الصوتيات الآن.'
                  : 'You can add a classroom, define its seating capacity and multimedia equipment now.'}
              </p>
              <button
                onClick={() => {
                  setSelectedBranchForRoom(selectedBranchId !== 'all' ? selectedBranchId : (branches[0]?.id || 'br-dokki'));
                  setIsAddRoomOpen(true);
                }}
                className="center-interactive-card"
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
                  gap: '6px'
                }}
              >
                <Plus size={16} />
                <span>{lang === 'ar' ? 'إضافة قاعة جديدة الآن' : 'Add Classroom Now'}</span>
              </button>
            </div>
          ) : (
            currentBranchRooms.map(room => {
              // Find cohorts assigned to this room
              const assignedCohorts = groups.filter(
                g => g.hallName === room.nameAr || (g.slots && g.slots.some(s => s.hall === room.nameAr))
              );

              return (
                <div
                  key={room.id}
                  className="center-interactive-card"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-subtle)',
                    padding: '22px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                        {room.branchNameAr} • {room.floor}
                      </span>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                        {lang === 'ar' ? room.nameAr : room.nameEn}
                      </h3>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)',
                      color: 'var(--primary)'
                    }}>
                      {room.capacity} {lang === 'ar' ? 'مقعد' : 'seats'}
                    </span>
                  </div>

                  {/* Room Equipment Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {room.equipped?.map((eq, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-secondary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Check size={11} color="var(--success)" />
                        {eq}
                      </span>
                    ))}
                  </div>

                  {/* Cohorts using this room */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {lang === 'ar' ? 'المجموعات المرتبطة بالقاعة:' : 'Assigned Cohorts:'} ({assignedCohorts.length})
                    </div>
                    {assignedCohorts.length === 0 ? (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        {lang === 'ar' ? 'لا توجد مجموعات مجدولة حالياً في هذه القاعة' : 'No cohorts assigned yet'}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {assignedCohorts.map(c => {
                          const enrolled = (enrolledStudents[c.id] || []).length;
                          const fillRatio = Math.round((enrolled / room.capacity) * 100);
                          return (
                            <div
                              key={c.id}
                              style={{
                                padding: '8px 10px',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--bg-app)',
                                border: '1px solid var(--border-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '12px'
                              }}
                            >
                              <div>
                                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{c.nameAr}</span>
                                <span style={{ color: 'var(--text-secondary)', marginRight: '6px', marginLeft: '6px' }}>
                                  ({c.teacherNameAr || 'معلم معتمد'})
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{
                                  fontWeight: '700',
                                  color: fillRatio >= 90 ? 'var(--danger)' : fillRatio >= 70 ? 'var(--warning)' : 'var(--success)'
                                }}>
                                  {enrolled} / {room.capacity} ({fillRatio}%)
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'مؤشر الكفاءة التشغيلية' : 'Efficiency'}</span>
                    <span style={{ color: 'var(--primary)' }}>84%</span>
                  </div>
                  <div style={{ height: '5px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                    <div style={{ width: '84%', height: '100%', backgroundColor: 'var(--primary)' }} />
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
      )}

      {/* TAB 2: Conflict-Free Master Schedule */}
      {activeTab === 'schedule' && (
        <div>
          {/* Day Selector Pills */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '20px'
          }}>
            {WEEKDAYS.map(day => (
              <button
                key={day.key}
                onClick={() => setSelectedDay(day.key)}
                style={{
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: selectedDay === day.key ? 'var(--primary)' : 'var(--bg-surface)',
                  color: selectedDay === day.key ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {lang === 'ar' ? day.labelAr : day.labelEn}
              </button>
            ))}
          </div>

          {/* Schedule Grid Matrix */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* Header info */}
            <div style={{
              padding: '16px 20px',
              backgroundColor: 'var(--bg-app)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {lang === 'ar'
                    ? `جدول يوم ${WEEKDAYS.find(w => w.key === selectedDay)?.labelAr} — نظام فحص التعارضات نشط`
                    : `${selectedDay} Master Schedule — Zero Conflict Shield Active`}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {lang === 'ar' ? 'فحص تلقائي للقاعات والمدرسين والمجموعات لمنع التداخل' : 'Automated Room & Teacher Collision Prevention'}
              </span>
            </div>

            {/* Responsive Halls Schedule Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
              {displayHalls.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 24px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px dashed var(--border-subtle)'
                }}>
                  <Building2 size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 12px', display: 'block' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'لم يتم إضافة قاعات دراسية لعرض الجدول في هذا الفرع' : 'No classrooms available for this branch schedule'}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'يرجى اختيار فرع آخر أو إضافة قاعة دراسية جديدة' : 'Please select another branch or add a classroom'}
                  </p>
                </div>
              ) : (
                displayHalls.map(room => {
                  // Find all sessions in this room on selectedDay
                  const sessions = [];
                  const selDayKey = selectedDay.toLowerCase();
                  groups.forEach(g => {
                    const allSlots = g.scheduleSlots || g.slots || [];
                    allSlots.forEach(s => {
                      const slotDay = (s.day || '').toLowerCase();
                      const dayMatches = slotDay === selDayKey || s.day === selectedDay || s.dayEn === selectedDay || s.dayAr === selectedDay;
                      if (dayMatches && matchesRoom(s.hall, g.hallName, room)) {
                        sessions.push({
                          group: g,
                          slot: s,
                          enrolledCount: (enrolledStudents[g.id] || []).length || Math.floor(room.capacity * 0.75)
                        });
                      }
                    });
                  });

                  // Sort sessions by start time
                  sessions.sort((a, b) => (a.slot.startTime || '').localeCompare(b.slot.startTime || ''));

                  const freeSlots = STANDARD_CENTER_SLOTS.filter(std => {
                    return !sessions.some(sess => {
                      const sStart = sess.slot.startTime || '16:00';
                      const sEnd = sess.slot.endTime || '18:00';
                      return (std.startTime < sEnd) && (std.endTime > sStart);
                    });
                  });

                  const isOccupied = sessions.length > 0;

                  return (
                    <div
                      key={room.id}
                      className="center-interactive-card"
                      style={{
                        backgroundColor: 'var(--bg-app)',
                        borderRadius: 'var(--radius-xl)',
                        border: isOccupied ? '1.5px solid rgba(21, 136, 199, 0.3)' : '1px solid var(--border-subtle)',
                        padding: '18px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        boxShadow: 'var(--shadow-xs)'
                      }}
                    >
                    {/* Room Header Banner */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          backgroundColor: isOccupied ? 'var(--primary-light)' : 'var(--bg-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isOccupied ? 'var(--primary)' : 'var(--text-secondary)'
                        }}>
                          <Building2 size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                            {room.nameAr}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {room.floor} • سعة: <strong>{room.capacity} مقعد</strong> • {room.branchNameAr || 'الفرع الرئيسي'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '11.5px',
                          fontWeight: '800',
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: isOccupied ? 'rgba(239, 68, 68, 0.1)' : 'var(--success-light)',
                          color: isOccupied ? 'var(--danger)' : 'var(--success)',
                          border: isOccupied ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          {isOccupied 
                            ? (lang === 'ar' ? `مشغولة (${sessions.length} مجموعات)` : `Occupied (${sessions.length} sessions)`)
                            : (lang === 'ar' ? 'شاغرة طوال اليوم' : 'Available all day')}
                        </span>
                      </div>
                    </div>

                    {/* Scheduled Cohorts List */}
                    {isOccupied ? (
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                          {lang === 'ar' ? 'المجموعات المحجوزة في هذه القاعة اليوم:' : 'Scheduled cohorts in this hall:'}
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                          gap: '12px'
                        }}>
                          {sessions.map((sess, idx) => (
                            <div
                              key={idx}
                              style={{
                                backgroundColor: 'var(--bg-surface)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border-subtle)',
                                padding: '14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                boxShadow: 'var(--shadow-xs)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '4px 9px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: 'rgba(21, 136, 199, 0.1)',
                                  color: 'var(--primary)',
                                  fontSize: '11.5px',
                                  fontWeight: '800'
                                }}>
                                  <Clock size={13} />
                                  <span>{format12h(sess.slot.startTime)} - {format12h(sess.slot.endTime)}</span>
                                </div>
                                <span style={{
                                  fontSize: '10.5px',
                                  fontWeight: '800',
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  color: 'var(--danger)'
                                }}>
                                  {lang === 'ar' ? 'محجوزة' : 'Booked'}
                                </span>
                              </div>

                              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                                {sess.group.nameAr}
                              </div>

                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '11.5px',
                                color: 'var(--text-secondary)',
                                paddingTop: '4px',
                                borderTop: '1px dashed var(--border-subtle)'
                              }}>
                                <span>المدرس: <strong style={{ color: 'var(--text-primary)' }}>{sess.group.teacherNameAr || 'د. سلمى السيد'}</strong></span>
                                <span>الحضور: <strong style={{ color: 'var(--primary)' }}>{sess.enrolledCount} طالب</strong></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        padding: '14px 18px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px dashed var(--border-medium)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-secondary)',
                        fontSize: '12.5px'
                      }}>
                        <Check size={16} color="var(--success)" />
                        <span>{lang === 'ar' ? 'القاعة شاغرة طوال هذا اليوم — متاحة لحجز حصص جديدة بدون أي تداخل زمني.' : 'Room is free throughout this day.'}</span>
                      </div>
                    )}

                    {/* Free Slots Quick Indicator */}
                    {isOccupied && freeSlots.length > 0 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '6px',
                        paddingTop: '8px',
                        fontSize: '11px',
                        color: 'var(--text-secondary)'
                      }}>
                        <span style={{ fontWeight: '700' }}>المواعيد الشاغرة المتبقية بالقاعة:</span>
                        {freeSlots.map(fs => (
                          <span
                            key={fs.startTime}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--success)',
                              fontWeight: '700'
                            }}
                          >
                            {fs.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }))}
            </div>
          </div>
        </div>
      )}



      {/* MODAL: Add New Room */}

      {isAddRoomOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            maxWidth: '480px',
            width: '100%',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'إضافة قاعة دراسية جديدة' : 'Add New Classroom'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddRoomOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'اسم القاعة' : 'Room Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: قاعة فاروق الباز للجيولوجيا' : 'e.g. Hall 4'}
                  value={roomNameAr}
                  onChange={(e) => setRoomNameAr(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'السعة (عدد الطلاب)' : 'Capacity'}
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    max="300"
                    value={roomCapacity}
                    onChange={(e) => setRoomCapacity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'الطابق' : 'Floor'}
                  </label>
                  <input
                    type="text"
                    required
                    value={roomFloor}
                    onChange={(e) => setRoomFloor(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'الفرع' : 'Branch'}
                </label>
                <select
                  value={selectedBranchForRoom}
                  onChange={(e) => setSelectedBranchForRoom(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'حفظ وإضافة القاعة' : 'Save Room'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddRoomOpen(false)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
