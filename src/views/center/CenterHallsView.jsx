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
  const [isAddCohortOpen, setIsAddCohortOpen] = useState(false);

  // New Room Form State
  const [roomNameAr, setRoomNameAr] = useState('');
  const [roomCapacity, setRoomCapacity] = useState('50');
  const [roomFloor, setRoomFloor] = useState('الطابق الأول');
  const [selectedBranchForRoom, setSelectedBranchForRoom] = useState(selectedBranchId);
  const [roomEquipment, setRoomEquipment] = useState(['شاشة ذكية تفاعلية', 'تكييف مركزي', 'نظام صوتيات لاسلكي']);

  // New Cohort Form State with Live Conflict Detection
  const [cohortName, setCohortName] = useState('');
  const [teacherName, setTeacherName] = useState('أ. سامح عبدالحميد');
  const [subject, setSubject] = useState('الرياضيات البحتة');
  const [cohortRoomId, setCohortRoomId] = useState(rooms[0]?.id || '');
  const [cohortDay, setCohortDay] = useState('Saturday');
  const [cohortStartTime, setCohortStartTime] = useState('14:00');
  const [cohortEndTime, setCohortEndTime] = useState('16:00');
  const [cohortPrice, setCohortPrice] = useState('500');
  const [cohortMaxStudents, setCohortMaxStudents] = useState('45');

  // Filter rooms by branch
  const currentBranchRooms = rooms.filter(r => r.branchId === selectedBranchId || !selectedBranchId);

  // Live Conflict Check for Cohort Form
  const liveConflict = checkScheduleConflict(
    cohortRoomId,
    cohortDay,
    cohortStartTime,
    cohortEndTime,
    teacherName
  );

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

  const handleCreateCohort = (e) => {
    e.preventDefault();
    if (!cohortName.trim() || liveConflict.hasConflict) return;

    const dayObj = WEEKDAYS.find(w => w.key === cohortDay);
    const dayKey = cohortDay.toLowerCase();
    const matchedRoom = rooms.find(r => r.id === cohortRoomId) || rooms[0];

    const slotItem = {
      id: `slot-${dayKey}-${Date.now()}`,
      day: dayKey,
      dayAr: dayObj?.labelAr || 'السبت',
      dayEn: cohortDay,
      startTime: cohortStartTime,
      endTime: cohortEndTime,
      hall: matchedRoom?.nameAr || 'القاعة 1'
    };

    addGroup({
      nameAr: cohortName.trim(),
      nameEn: cohortName.trim(),
      subjectAr: subject,
      teacherNameAr: teacherName,
      centerName: matchedRoom?.branchNameAr || 'سنتر الرواد التعليمي',
      hallName: matchedRoom?.nameAr || 'القاعة 1',
      scheduleAr: `${dayObj?.labelAr || 'السبت'} ${cohortStartTime} - ${cohortEndTime}`,
      maxStudents: parseInt(cohortMaxStudents) || matchedRoom?.capacity || 50,
      priceEgp: parseInt(cohortPrice) || 500,
      scheduleSlots: [slotItem],
      slots: [slotItem]
    });

    setCohortName('');
    setIsAddCohortOpen(false);
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
            onClick={() => setIsAddCohortOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            <span>{lang === 'ar' ? 'إنشاء مجموعة وربط قاعة' : 'Add Cohort & Room'}</span>
          </button>

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
          {currentBranchRooms.map(room => {
            // Find cohorts assigned to this room
            const assignedCohorts = groups.filter(
              g => g.hallName === room.nameAr || (g.slots && g.slots.some(s => s.hall === room.nameAr))
            );

            return (
              <div
                key={room.id}
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
          })}
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

            {/* Room Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', divideY: '1px solid var(--border-subtle)' }}>
              {currentBranchRooms.map(room => {
                // Find all sessions in this room on selectedDay
                const sessions = [];
                const selDayKey = selectedDay.toLowerCase();
                groups.forEach(g => {
                  const allSlots = g.scheduleSlots || g.slots || [];
                  allSlots.forEach(s => {
                    const slotDay = (s.day || '').toLowerCase();
                    const slotHall = s.hall || g.hallName;
                    if ((slotHall === room.nameAr || slotHall === room.nameEn || g.hallName === room.nameAr) && 
                        (slotDay === selDayKey || s.day === selectedDay || s.dayEn === selectedDay)) {
                      sessions.push({
                        group: g,
                        slot: s,
                        enrolledCount: (enrolledStudents[g.id] || []).length
                      });
                    }
                  });
                });

                return (
                  <div
                    key={room.id}
                    style={{
                      padding: '18px 20px',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'grid',
                      gridTemplateColumns: '220px 1fr',
                      gap: '16px',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {room.nameAr}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {room.floor} • {lang === 'ar' ? `سعة: ${room.capacity} طالب` : `Cap: ${room.capacity}`}
                      </div>
                    </div>

                    {/* Timeline / Slots in this Room */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {sessions.length === 0 ? (
                        <div style={{
                          padding: '10px 16px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-app)',
                          border: '1px dashed var(--border-subtle)',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Check size={14} color="var(--success)" />
                          <span>{lang === 'ar' ? 'القاعة شاغرة طوال هذا اليوم — متاحة لإنشاء حصص جديدة' : 'Room free all day'}</span>
                        </div>
                      ) : (
                        sessions.map((sess, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '10px 14px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'rgba(21, 136, 199, 0.08)',
                              border: '1px solid rgba(21, 136, 199, 0.25)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px'
                            }}
                          >
                            <Clock size={16} color="var(--primary)" />
                            <div>
                              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                                {sess.slot.startTime} - {sess.slot.endTime}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                {sess.group.nameAr} • {sess.group.teacherNameAr || 'أ. سامح عبدالحميد'} ({sess.enrolledCount} {lang === 'ar' ? 'طالب' : 'students'})
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}



      {/* MODAL 1: Add Cohort with Live Conflict Detection */}
      {isAddCohortOpen && (
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
            maxWidth: '540px',
            width: '100%',
            padding: '24px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'إنشاء مجموعة جديدة وربطها بالقاعة والمدرس' : 'Create Cohort & Schedule Room'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddCohortOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCohort} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'اسم المجموعة' : 'Cohort Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: فيزياء الصف الثالث الثانوي — مجموعة المتفوقين' : 'e.g. Physics 3rd Year'}
                  value={cohortName}
                  onChange={(e) => setCohortName(e.target.value)}
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
                    {lang === 'ar' ? 'المادة' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
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
                    {lang === 'ar' ? 'المدرس المسؤول' : 'Teacher'}
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'القاعة المخصصة' : 'Target Room'}
                  </label>
                  <select
                    value={cohortRoomId}
                    onChange={(e) => setCohortRoomId(e.target.value)}
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
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.nameAr} ({r.capacity} مقعد)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'يوم الحصة' : 'Day'}
                  </label>
                  <select
                    value={cohortDay}
                    onChange={(e) => setCohortDay(e.target.value)}
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
                    {WEEKDAYS.map(w => (
                      <option key={w.key} value={w.key}>
                        {w.labelAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'وقت البدء' : 'Start Time'}
                  </label>
                  <input
                    type="time"
                    required
                    value={cohortStartTime}
                    onChange={(e) => setCohortStartTime(e.target.value)}
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
                    {lang === 'ar' ? 'وقت الانتهاء' : 'End Time'}
                  </label>
                  <input
                    type="time"
                    required
                    value={cohortEndTime}
                    onChange={(e) => setCohortEndTime(e.target.value)}
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

              {/* LIVE CONFLICT DETECTION BANNER (Feature 7) */}
              {liveConflict.hasConflict ? (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--error-light)',
                  border: '1px solid rgba(220, 38, 38, 0.25)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <AlertTriangle size={18} color="var(--danger)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--danger)', marginBottom: '2px' }}>
                      {lang === 'ar' ? 'تم اكتشاف تعارض في الجدول!' : 'Schedule Conflict Detected!'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                      {liveConflict.conflictReasonAr}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--success-light)',
                  border: '1px solid rgba(22, 163, 74, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700' }}>
                    {lang === 'ar' ? 'الوقت والقاعة شاغران بالكامل ولا يوجد أي تداخل زمني.' : 'Room and time are completely clear.'}
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={liveConflict.hasConflict}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: liveConflict.hasConflict ? 'var(--bg-subtle)' : 'var(--primary)',
                    color: liveConflict.hasConflict ? 'var(--text-secondary)' : '#FFFFFF',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: liveConflict.hasConflict ? 'not-allowed' : 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'تأكيد الحجز وإنشاء المجموعة' : 'Confirm Cohort'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddCohortOpen(false)}
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

      {/* MODAL 2: Add New Room */}
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
