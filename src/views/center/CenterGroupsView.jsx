import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCenter } from '../../context/CenterContext';
import { useGroups, ALL_REGISTERED_STUDENTS } from '../../context/GroupsContext';
import { RealQRCode } from '../../components/common/RealQRCode';
import { 
  Building2, 
  Users, 
  Calendar, 
  QrCode, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  UserPlus, 
  Clock, 
  DollarSign, 
  GraduationCap, 
  Phone, 
  UserCheck, 
  Trash2, 
  Printer, 
  Scan, 
  Check, 
  ArrowRight,
  ArrowLeft,
  Copy,
  ExternalLink,
  MessageCircle,
  LayoutGrid,
  List,
  Filter,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

const WEEKDAYS = [
  { key: 'saturday', labelAr: 'السبت', labelEn: 'Saturday' },
  { key: 'sunday', labelAr: 'الأحد', labelEn: 'Sunday' },
  { key: 'monday', labelAr: 'الاثنين', labelEn: 'Monday' },
  { key: 'tuesday', labelAr: 'الثلاثاء', labelEn: 'Tuesday' },
  { key: 'wednesday', labelAr: 'الأربعاء', labelEn: 'Wednesday' },
  { key: 'thursday', labelAr: 'الخميس', labelEn: 'Thursday' },
  { key: 'friday', labelAr: 'الجمعة', labelEn: 'Friday' }
];

export const CenterGroupsView = () => {
  const { lang, isRtl } = useLanguage();
  const navigate = useNavigate();
  const { groupId: routeGroupId } = useParams();

  const { branches, rooms, checkScheduleConflict } = useCenter();
  const { 
    groups, 
    addGroup, 
    enrolledStudents, 
    enrollStudentDirectly, 
    toggleStudentAttendance, 
    recordStudentAttendanceByCode, 
    removeStudentFromGroup 
  } = useGroups();

  // Selected Group for viewing dedicated students & barcode attendance page
  // When activeGroupId is null, user sees the Cohorts/Groups list
  // When activeGroupId is set, user sees the dedicated Group Students & Barcode Attendance view
  const [activeGroupId, setActiveGroupId] = useState(routeGroupId || null);

  useEffect(() => {
    if (routeGroupId) {
      setActiveGroupId(routeGroupId);
    }
  }, [routeGroupId]);

  // Filters & Search for Groups List
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedTeacher, setSelectedTeacher] = useState('ALL');

  // Search & Filter for Group Students
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState('ALL'); // ALL, present, absent
  const [studentsViewMode, setStudentsViewMode] = useState('table'); // 'table' | 'cards'

  // Modals
  const [isAddCohortOpen, setIsAddCohortOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [studentCardModal, setStudentCardModal] = useState(null); // student object

  // Add Cohort Form State with Multi-session capability (like teacher modal)
  const [cohortName, setCohortName] = useState('');
  const [teacherName, setTeacherName] = useState('د. سلمى السيد');
  const [subject, setSubject] = useState('الرياضيات البحتة');
  const [cohortPrice, setCohortPrice] = useState('500');
  const [cohortMaxStudents, setCohortMaxStudents] = useState('50');
  const [cohortDefaultRoomId, setCohortDefaultRoomId] = useState(rooms[0]?.id || '');

  // Multi-session state: array of { id, day, startTime, endTime, hall }
  const [sessions, setSessions] = useState([
    { id: 'sess-1', day: 'sunday', startTime: '16:00', endTime: '18:00', hall: rooms[0]?.nameAr || 'قاعة 1 (المحاضرات الكبرى)' },
    { id: 'sess-2', day: 'wednesday', startTime: '16:00', endTime: '18:00', hall: rooms[0]?.nameAr || 'قاعة 1 (المحاضرات الكبرى)' }
  ]);

  // Add Student Modal State
  const [studentModalTab, setStudentModalTab] = useState('search'); // 'search' | 'manual'
  const [searchStudentQuery, setSearchStudentQuery] = useState('');
  
  // Manual Student Registration Form State
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualGrade, setManualGrade] = useState('الصف الثالث الثانوي');
  const [manualParentName, setManualParentName] = useState('');
  const [manualParentPhone, setManualParentPhone] = useState('');

  // Barcode Scanner Input State
  const [scanCodeInput, setScanCodeInput] = useState('');
  const [scanFeedback, setScanFeedback] = useState(null);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  const scannerInputRef = useRef(null);

  // Play realistic scanner beep audio on success
  const playScannerBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // 880Hz beep
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (err) {
      // AudioContext not allowed or not supported
    }
  };

  // Active Selected Group
  const activeGroup = groups.find(g => g.id === activeGroupId) || null;
  const activeGroupStudents = activeGroup ? (enrolledStudents[activeGroup.id] || []) : [];

  // Filtered Students for the active group
  const filteredStudents = activeGroupStudents.filter(std => {
    const q = studentSearchTerm.trim().toLowerCase();
    const matchQuery = !q || 
      (std.nameAr || '').toLowerCase().includes(q) ||
      (std.name || '').toLowerCase().includes(q) ||
      (std.phone || '').includes(q) ||
      (std.passcode || '').toLowerCase().includes(q) ||
      (std.barcode || '').includes(q);

    if (studentStatusFilter === 'present') return matchQuery && std.todayStatus === 'present';
    if (studentStatusFilter === 'absent') return matchQuery && std.todayStatus !== 'present';
    return matchQuery;
  });

  const presentCount = activeGroupStudents.filter(s => s.todayStatus === 'present').length;
  const absentCount = activeGroupStudents.filter(s => s.todayStatus !== 'present').length;
  const groupAttendanceRate = activeGroupStudents.length > 0 
    ? Math.round((presentCount / activeGroupStudents.length) * 100) 
    : 0;

  // Room of active group
  const activeGroupRoom = rooms.find(r => r.nameAr === activeGroup?.hallName || r.id === activeGroup?.hallName) || {
    nameAr: activeGroup?.hallName || 'القاعة الرئيسية',
    capacity: activeGroup?.maxStudents || 50
  };

  // Filtered Groups
  const filteredGroups = groups.filter(g => {
    const matchSearch = (g.nameAr || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.teacherNameAr || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.subjectAr || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.joinCode || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchSubject = selectedSubject === 'ALL' || g.subjectAr === selectedSubject;
    const matchTeacher = selectedTeacher === 'ALL' || g.teacherNameAr === selectedTeacher;

    return matchSearch && matchSubject && matchTeacher;
  });

  // Unique Subjects & Teachers for filters
  const allSubjects = Array.from(new Set(groups.map(g => g.subjectAr).filter(Boolean)));
  const allTeachers = Array.from(new Set(groups.map(g => g.teacherNameAr).filter(Boolean)));

  // Format 24h to 12h Arabic
  const formatTimeTo12h = (t24) => {
    if (!t24) return '';
    const [h, m] = t24.split(':').map(Number);
    const period = h >= 12 ? 'م' : 'ص';
    const h12 = h % 12 || 12;
    return `${h12}:${m < 10 ? '0' + m : m} ${period}`;
  };

  // Multi-session Handlers
  const handleSetSessionCount = (count) => {
    const validCount = Math.max(1, Math.min(7, Number(count) || 1));
    const extraDays = ['tuesday', 'thursday', 'saturday', 'monday', 'friday', 'sunday', 'wednesday'];
    let next = [...sessions];
    if (validCount > sessions.length) {
      while (next.length < validCount) {
        const nextDay = extraDays[(next.length) % extraDays.length] || 'saturday';
        next.push({
          id: `sess-${Date.now()}-${next.length}`,
          day: nextDay,
          startTime: '16:00',
          endTime: '18:00',
          hall: rooms[0]?.nameAr || 'القاعة 1'
        });
      }
    } else {
      next = next.slice(0, validCount);
    }
    setSessions(next);
  };

  const handleAddSingleSession = () => {
    if (sessions.length >= 7) return;
    const extraDays = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const unusedDay = extraDays.find(d => !sessions.some(s => s.day === d)) || 'saturday';
    setSessions(prev => [
      ...prev,
      {
        id: `sess-${Date.now()}`,
        day: unusedDay,
        startTime: '16:00',
        endTime: '18:00',
        hall: rooms[0]?.nameAr || 'القاعة 1'
      }
    ]);
  };

  const handleRemoveSessionSlot = (index) => {
    if (sessions.length <= 1) return;
    setSessions(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateSession = (index, field, value) => {
    setSessions(prev => prev.map((s, idx) => idx === index ? { ...s, [field]: value } : s));
  };

  // Conflict Checking across all session slots
  const sessionConflicts = sessions.map(sess => {
    const dayObj = WEEKDAYS.find(w => w.key === sess.day);
    const conflictResult = checkScheduleConflict({
      day: sess.day,
      dayAr: dayObj?.labelAr || sess.day,
      startTime: sess.startTime,
      endTime: sess.endTime,
      hall: sess.hall
    });
    return {
      session: sess,
      dayLabel: dayObj?.labelAr || sess.day,
      hasConflict: conflictResult?.hasConflict || false,
      messageAr: conflictResult?.messageAr || ''
    };
  });

  const hasAnyConflict = sessionConflicts.some(c => c.hasConflict);

  // Generate schedule string summary
  const generateScheduleSummary = () => {
    if (!sessions || sessions.length === 0) return '';
    const dayLabels = sessions.map(s => {
      const found = WEEKDAYS.find(w => w.key === s.day);
      return found ? found.labelAr : s.day;
    });
    const daysStr = dayLabels.join(' و');
    const firstSess = sessions[0];
    return `${daysStr} من ${formatTimeTo12h(firstSess.startTime)} إلى ${formatTimeTo12h(firstSess.endTime)}`;
  };

  // Handle Add Cohort Submit
  const handleCreateCohort = (e) => {
    e.preventDefault();
    if (!cohortName.trim() || hasAnyConflict) return;

    const matchedDefaultRoom = rooms.find(r => r.id === cohortDefaultRoomId) || rooms[0];

    const formattedSlots = sessions.map((sess, idx) => {
      const dayObj = WEEKDAYS.find(w => w.key === sess.day);
      return {
        id: `slot-${sess.day}-${idx}-${Date.now()}`,
        day: sess.day,
        dayAr: dayObj?.labelAr || sess.day,
        dayEn: dayObj?.labelEn || sess.day,
        startTime: sess.startTime,
        endTime: sess.endTime,
        hall: sess.hall || matchedDefaultRoom?.nameAr || 'القاعة 1'
      };
    });

    const scheduleSummary = generateScheduleSummary();

    const newGrp = addGroup({
      nameAr: cohortName.trim(),
      nameEn: cohortName.trim(),
      subjectAr: subject,
      teacherNameAr: teacherName,
      centerName: matchedDefaultRoom?.branchNameAr || 'سنتر الرواد التعليمي',
      hallName: matchedDefaultRoom?.nameAr || sessions[0]?.hall || 'القاعة 1',
      scheduleAr: scheduleSummary,
      maxStudents: parseInt(cohortMaxStudents) || matchedDefaultRoom?.capacity || 50,
      priceEgp: parseInt(cohortPrice) || 500,
      scheduleSlots: formattedSlots,
      slots: formattedSlots
    });

    setCohortName('');
    setIsAddCohortOpen(false);
    if (newGrp?.id) {
      handleOpenGroupStudents(newGrp.id);
    }
  };

  // Navigation: Navigate to dedicated group students page
  const handleOpenGroupStudents = (groupId) => {
    setActiveGroupId(groupId);
    navigate(`/center/groups/${groupId}`);
    setStudentSearchTerm('');
    setStudentStatusFilter('ALL');
  };

  // Navigation: Return to Groups Overview
  const handleBackToGroups = () => {
    setActiveGroupId(null);
    navigate('/center/groups');
  };

  // Handle Quick Barcode Scan Attendance
  const handleScanSubmit = (e) => {
    e?.preventDefault();
    if (!activeGroup || !scanCodeInput.trim()) return;

    const result = recordStudentAttendanceByCode(activeGroup.id, scanCodeInput.trim());
    if (result.success) {
      playScannerBeep();
      setScanFeedback({
        success: true,
        message: `تم تسجيل حضور «${result.student.nameAr}» بنجاح!`,
        student: result.student
      });
      setScanCodeInput('');
      if (scannerInputRef.current) {
        scannerInputRef.current.focus();
      }
    } else {
      setScanFeedback({
        success: false,
        message: result.message
      });
    }

    setTimeout(() => {
      setScanFeedback(null);
    }, 4000);
  };

  // Handle Add Existing Platform Student
  const handleEnrollExisting = (student) => {
    if (!activeGroup) return;
    enrollStudentDirectly(activeGroup.id, student);
    setIsAddStudentOpen(false);
    setSearchStudentQuery('');
  };

  // Handle Manual Student Registration
  const handleManualStudentRegister = (e) => {
    e.preventDefault();
    if (!activeGroup || !manualName.trim() || !manualPhone.trim()) return;

    enrollStudentDirectly(activeGroup.id, {
      nameAr: manualName.trim(),
      phone: manualPhone.trim(),
      gradeAr: manualGrade,
      parentNameAr: manualParentName.trim() || 'ولي الأمر',
      parentPhone: manualParentPhone.trim() || manualPhone.trim()
    });

    setManualName('');
    setManualPhone('');
    setManualParentName('');
    setManualParentPhone('');
    setIsAddStudentOpen(false);
  };

  // Copy code helper
  const handleCopyCode = (code, id) => {
    navigator.clipboard?.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Platform Student Search Results
  const searchResults = searchStudentQuery.trim()
    ? ALL_REGISTERED_STUDENTS.filter(s => 
        (s.nameAr || '').toLowerCase().includes(searchStudentQuery.toLowerCase()) ||
        (s.nameEn || '').toLowerCase().includes(searchStudentQuery.toLowerCase()) ||
        (s.phone || '').includes(searchStudentQuery)
      )
    : [];

  // Summary Metrics for the Center
  const totalEnrolledAllGroups = Object.values(enrolledStudents).reduce((acc, list) => acc + (list?.length || 0), 0);
  const totalCenterCapacity = rooms.reduce((acc, r) => acc + (parseInt(r.capacity) || 50), 0);
  
  // Occupied halls count (unique halls hosting cohorts)
  const occupiedHallsCount = Math.min(rooms.length, new Set(groups.map(g => g.hallName).filter(Boolean)).size || 5);

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
    }}>

      {/* =========================================================================
          VIEW MODE 1: GROUPS LIST (Main Cohorts Catalog View)
         ========================================================================= */}
      {!activeGroupId && (
        <div style={{ animation: 'fadeIn 0.25s ease' }}>
          {/* Top Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px',
            backgroundColor: 'var(--bg-surface)',
            padding: '20px 24px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <Users size={26} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                    {lang === 'ar' ? 'منظومة السنتر المركزية' : 'Center Academic Management'}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(22, 163, 74, 0.12)',
                    color: 'var(--success)',
                    fontWeight: '800'
                  }}>
                    {groups.length} {lang === 'ar' ? 'مجموعات نشطة' : 'Active Cohorts'}
                  </span>
                </div>
                <h1 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                  {lang === 'ar' ? 'المجموعات والصفوف الدراسية وإدارة الباركود' : 'Cohorts, Rooms & Barcode Attendance'}
                </h1>
              </div>
            </div>

            {/* Action Button: Create Cohort */}
            <button
              onClick={() => setIsAddCohortOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(21, 136, 199, 0.25)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Plus size={18} />
              <span>{lang === 'ar' ? 'إنشاء مجموعة وربط قاعة ومدرس' : 'Create Cohort & Room'}</span>
            </button>
          </div>

          {/* Metric Cards Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '16px',
            marginBottom: '26px'
          }}>
            {/* Card 1: Total Groups */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '20px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'إجمالي المجموعات' : 'Total Cohorts'}
                </span>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={18} color="var(--primary)" />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {groups.length}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {lang === 'ar' ? 'موزعة على كافة قاعات السنتر' : 'Across all center halls'}
              </div>
            </div>

            {/* Card 2: Total Enrolled Students (cleaned subtitle per audio instruction) */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '20px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'إجمالي الطلاب المقيدين' : 'Total Students'}
                </span>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: 'rgba(22, 163, 74, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={18} color="var(--success)" />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {totalEnrolledAllGroups} <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'طالب' : 'Students'}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {lang === 'ar' ? 'مقيدين وموزعين بالسجلات الرسمية' : 'Enrolled in active cohorts'}
              </div>
            </div>

            {/* Card 3: Halls In Use (per audio instruction) */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '20px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'القاعات المشغولة حالياً' : 'Halls In Use'}
                </span>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={18} color="var(--primary)" />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {occupiedHallsCount} <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? `قاعات من إجمالي ${rooms.length}` : `of ${rooms.length} Halls`}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {lang === 'ar' ? `سعة استيعابية ${totalCenterCapacity} مقعد` : `Total Capacity: ${totalCenterCapacity}`}
              </div>
            </div>

            {/* Card 4: Attendance System Accuracy */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '20px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'نظام الحضور والباركود' : 'Barcode Attendance'}
                </span>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: 'rgba(22, 163, 74, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={18} color="var(--success)" />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--success)' }}>
                96.4%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {lang === 'ar' ? 'دقة مسح الحضور بالبوابة' : 'Gate scan accuracy rate'}
              </div>
            </div>
          </div>

          {/* Groups Catalog Section */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* Header & Filter Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px',
              paddingBottom: '18px',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  {lang === 'ar' ? 'جدول مجموعات السنتر — اختر مجموعة لعرض طلابها والباركود' : 'Center Cohorts (Select cohort to view students)'}
                </h2>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', display: 'block' }}>
                  {lang === 'ar' ? 'اضغط على أي كارد للدخول إلى صفحة تفاصيل المجموعة وإدارة مسح باركود الحضور' : 'Click on any cohort to open its dedicated barcode attendance view'}
                </span>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* Search */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder={lang === 'ar' ? 'بحث باسم المجموعة أو المدرس...' : 'Search cohort...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      padding: '9px 12px 9px 34px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      width: '210px',
                      fontWeight: '600'
                    }}
                  />
                  <Search size={14} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                </div>

                {/* Subject Filter */}
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ALL">{lang === 'ar' ? 'كل المواد' : 'All Subjects'}</option>
                  {allSubjects.map((sub, i) => (
                    <option key={i} value={sub}>{sub}</option>
                  ))}
                </select>

                {/* Teacher Filter */}
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ALL">{lang === 'ar' ? 'كل المدرسين' : 'All Teachers'}</option>
                  {allTeachers.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Groups Grid with Enhanced Aesthetics, Animations & Spacing */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px'
            }}>
              {filteredGroups.map(group => {
                const students = enrolledStudents[group.id] || [];
                const room = rooms.find(r => r.nameAr === group.hallName || r.id === group.hallName) || {
                  nameAr: group.hallName || 'القاعة 1',
                  capacity: group.maxStudents || 50
                };
                const maxCap = parseInt(group.maxStudents) || parseInt(room.capacity) || 50;
                const groupSlots = group.scheduleSlots || group.slots || [];

                return (
                  <div
                    key={group.id}
                    onClick={() => handleOpenGroupStudents(group.id)}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-xl)',
                      border: '1.5px solid var(--border-subtle)',
                      padding: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(21, 136, 199, 0.18)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <div>
                      {/* Card Top: Subject Badge & Join Code */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                        <span style={{
                          fontSize: '11px',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--primary-surface)',
                          color: 'var(--primary)',
                          fontWeight: '800',
                          border: '1px solid rgba(21, 136, 199, 0.2)'
                        }}>
                          {group.subjectAr}
                        </span>

                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyCode(group.joinCode, group.id);
                          }}
                          title="اضغط لنسخ كود المجموعة"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: '800',
                            fontFamily: 'monospace',
                            backgroundColor: 'var(--bg-app)',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer'
                          }}
                        >
                          <span>كود: {group.joinCode}</span>
                          {copiedCodeId === group.id ? (
                            <Check size={12} color="var(--success)" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </div>
                      </div>

                      {/* Group Title */}
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '900',
                        color: 'var(--text-primary)',
                        margin: '0 0 8px 0',
                        lineHeight: '1.4'
                      }}>
                        {group.nameAr}
                      </h3>

                      {/* Teacher Info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        marginBottom: '12px'
                      }}>
                        <span>المدرس المسؤول:</span>
                        <strong style={{ color: 'var(--text-primary)', fontWeight: '800' }}>
                          {group.teacherNameAr || 'د. سلمى السيد'}
                        </strong>
                      </div>

                      {/* Hall / Room Badge */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        backgroundColor: 'var(--bg-app)',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Building2 size={15} color="var(--primary)" />
                          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{room.nameAr}</span>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)' }}>
                          سعة القاعة: {room.capacity} مقعد
                        </span>
                      </div>

                      {/* Weekly Sessions Pills */}
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          المواعيد الأسبوعية:
                        </div>
                        {groupSlots.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {groupSlots.map((slot, sIdx) => (
                              <div
                                key={sIdx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  fontSize: '11px',
                                  backgroundColor: 'var(--primary-surface)',
                                  color: 'var(--primary)',
                                  padding: '4px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  fontWeight: '700',
                                  border: '1px solid rgba(21, 136, 199, 0.15)'
                                }}
                              >
                                <Clock size={11} />
                                <span>{slot.dayAr || slot.day}: {formatTimeTo12h(slot.startTime)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '11px',
                            color: 'var(--text-secondary)'
                          }}>
                            <Clock size={12} />
                            <span>{group.scheduleAr || 'السبت 02:00 PM'}</span>
                          </div>
                        )}
                      </div>

                      {/* Clean Student Count Metric (No ugly percentage or progress bar) */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--bg-app)',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '16px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Users size={16} color="var(--primary)" />
                          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                            الطلاب المقيدون:
                          </span>
                        </div>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '900',
                          color: 'var(--primary)'
                        }}>
                          {students.length} / {maxCap} طالب
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenGroupStudents(group.id);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        boxShadow: 'var(--shadow-xs)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                    >
                      <span>عرض طلاب المجموعة وإدارة الباركود</span>
                      {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: DEDICATED GROUP STUDENTS & BARCODE ATTENDANCE VIEW
         ========================================================================= */}
      {activeGroupId && activeGroup && (
        <div style={{ animation: 'fadeIn 0.25s ease' }}>
          
          {/* Dedicated Header & Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px',
            backgroundColor: 'var(--bg-surface)',
            padding: '16px 22px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* Back Button */}
            <button
              onClick={handleBackToGroups}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-medium)',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-surface)';
                e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-app)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span>{lang === 'ar' ? 'العودة إلى قائمة المجموعات' : 'Back to Cohorts'}</span>
            </button>

            {/* Quick Cohort Switcher Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'الانتقال لمجموعة أخرى:' : 'Switch Cohort:'}
              </span>
              <select
                value={activeGroup.id}
                onChange={(e) => handleOpenGroupStudents(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  maxWidth: '260px'
                }}
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Action: Add Student Button */}
            <button
              onClick={() => setIsAddStudentOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            >
              <UserPlus size={16} />
              <span>{lang === 'ar' ? '+ إضافة طالب للمجموعة' : 'Add Student'}</span>
            </button>
          </div>

          {/* Group Hero Details Banner */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--border-subtle)',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '18px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--primary-surface)',
                    color: 'var(--primary)',
                    fontWeight: '800',
                    border: '1px solid rgba(21, 136, 199, 0.2)'
                  }}>
                    {activeGroup.subjectAr}
                  </span>

                  <span style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    fontFamily: 'monospace',
                    fontWeight: '800'
                  }}>
                    كود: {activeGroup.joinCode}
                  </span>

                  <span style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(22, 163, 74, 0.12)',
                    color: 'var(--success)',
                    fontWeight: '800'
                  }}>
                    القاعة: {activeGroupRoom.nameAr} ({activeGroupRoom.capacity} مقعد)
                  </span>
                </div>

                <h1 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                  {activeGroup.nameAr}
                </h1>

                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  المدرس المسؤول: <strong style={{ color: 'var(--text-primary)' }}>{activeGroup.teacherNameAr || 'د. سلمى السيد'}</strong>
                </div>
              </div>

              {/* Live Group Stats Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>إجمالي المقيدين</div>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary)' }}>
                    {activeGroupStudents.length} <span style={{ fontSize: '12px' }}>طالب</span>
                  </div>
                </div>

                <div style={{
                  padding: '10px 16px',
                  backgroundColor: 'rgba(22, 163, 74, 0.08)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(22, 163, 74, 0.25)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--success)' }}>حاضر اليوم</div>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--success)' }}>
                    {presentCount} <span style={{ fontSize: '12px' }}>({groupAttendanceRate}%)</span>
                  </div>
                </div>

                <div style={{
                  padding: '10px 16px',
                  backgroundColor: 'rgba(220, 38, 38, 0.08)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--danger)' }}>غائب اليوم</div>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--danger)' }}>
                    {absentCount}
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Sessions display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              paddingTop: '14px',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                المواعيد الأسبوعية للحصص:
              </span>
              {(activeGroup.scheduleSlots || activeGroup.slots || []).map((slot, sIdx) => (
                <div
                  key={sIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    backgroundColor: 'var(--primary-surface)',
                    color: 'var(--primary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    fontWeight: '800',
                    border: '1px solid rgba(21, 136, 199, 0.2)'
                  }}
                >
                  <Clock size={13} />
                  <span>{slot.dayAr || slot.day}: {formatTimeTo12h(slot.startTime)} - {formatTimeTo12h(slot.endTime)} ({slot.hall || activeGroupRoom.nameAr})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Barcode Scanner Terminal */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '2px solid var(--primary)',
            padding: '22px',
            marginBottom: '26px',
            boxShadow: '0 8px 24px -4px rgba(21, 136, 199, 0.15)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <Scan size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                    {lang === 'ar' ? 'ماسح باركود الحضور الفوري (Barcode Attendance Scanner)' : 'Barcode Attendance Scanner'}
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    جاهز للمسح المباشر بالماسح الضوئي (Barcode Reader Gun) أو كتابة الكود/الاسم
                  </span>
                </div>
              </div>

              {/* Status pulse */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success)',
                  boxShadow: '0 0 8px var(--success)'
                }} />
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--success)' }}>
                  نظام المسح متصل ونشط
                </span>
              </div>
            </div>

            {/* Scanner Input Form */}
            <form onSubmit={handleScanSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                <input
                  ref={scannerInputRef}
                  type="text"
                  placeholder={lang === 'ar' ? 'امسح بالباركود أو أدخل كود الطالب (مثال: STU-td-1 أو رقم الباركود 2026001)...' : 'Scan barcode or enter passcode...'}
                  value={scanCodeInput}
                  onChange={(e) => setScanCodeInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 16px 13px 44px',
                    borderRadius: 'var(--radius-lg)',
                    border: '2px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontWeight: '800',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                />
                <Scan size={18} color="var(--primary)" style={{ position: 'absolute', left: '16px', top: '15px' }} />
              </div>

              <button
                type="submit"
                style={{
                  padding: '13px 28px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(21, 136, 199, 0.28)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
              >
                <QrCode size={18} />
                <span>{lang === 'ar' ? 'تسجيل الحضور' : 'Register Attendance'}</span>
              </button>
            </form>

            {/* Visual Feedback on Scan */}
            {scanFeedback && (
              <div style={{
                marginTop: '14px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: scanFeedback.success ? 'rgba(22, 163, 74, 0.12)' : 'rgba(220, 38, 38, 0.12)',
                border: `1.5px solid ${scanFeedback.success ? 'var(--success)' : 'var(--danger)'}`,
                color: scanFeedback.success ? 'var(--success)' : 'var(--danger)',
                fontSize: '14px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                animation: 'fadeIn 0.2s ease'
              }}>
                {scanFeedback.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <span>{scanFeedback.message}</span>
              </div>
            )}

            {/* Quick Demo 1-Click Barcode Test Buttons for Students in This Group */}
            {activeGroupStudents.length > 0 && (
              <div style={{
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px dashed var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                  تجربة سريعة لمسح باركود طلاب المجموعة:
                </span>
                {activeGroupStudents.slice(0, 5).map(std => (
                  <button
                    key={std.id}
                    type="button"
                    onClick={() => {
                      const code = std.passcode || std.barcode || std.id;
                      setScanCodeInput(code);
                      const result = recordStudentAttendanceByCode(activeGroup.id, code);
                      if (result.success) {
                        playScannerBeep();
                        setScanFeedback({
                          success: true,
                          message: `تم مسح الباركود بنجاح! تم تسجيل حضور الطالب «${result.student.nameAr}»`,
                          student: result.student
                        });
                        setTimeout(() => setScanFeedback(null), 3500);
                      }
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '11px',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      fontWeight: '800',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary-surface)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-app)';
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                    }}
                  >
                    {std.nameAr} ({std.passcode || 'STU'})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Students Roster Section */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* Table Controls Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '20px'
            }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  {lang === 'ar' ? `قائمة الطلاب المقيدين (${filteredStudents.length} من أصل ${activeGroupStudents.length} طالب):` : `Enrolled Students (${filteredStudents.length}):`}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  يمكنك البحث بالاسم أو الهاتف، وتغيير حالة الحضور، وطباعة بطاقات الباركود الذكية
                </span>
              </div>

              {/* Search & Filter Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* Search */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder={lang === 'ar' ? 'بحث عن طالب...' : 'Search student...'}
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    style={{
                      padding: '8px 12px 8px 32px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      width: '180px',
                      fontWeight: '600'
                    }}
                  />
                  <Search size={14} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                </div>

                {/* Status Filter */}
                <div style={{ display: 'flex', backgroundColor: 'var(--bg-app)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
                  <button
                    type="button"
                    onClick={() => setStudentStatusFilter('ALL')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: studentStatusFilter === 'ALL' ? 'var(--bg-surface)' : 'transparent',
                      color: studentStatusFilter === 'ALL' ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    الكل ({activeGroupStudents.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentStatusFilter('present')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: studentStatusFilter === 'present' ? 'var(--bg-surface)' : 'transparent',
                      color: studentStatusFilter === 'present' ? 'var(--success)' : 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    حاضر ({presentCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentStatusFilter('absent')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: studentStatusFilter === 'absent' ? 'var(--bg-surface)' : 'transparent',
                      color: studentStatusFilter === 'absent' ? 'var(--danger)' : 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    غائب ({absentCount})
                  </button>
                </div>

                {/* View Mode Toggle: Table vs Cards */}
                <div style={{ display: 'flex', backgroundColor: 'var(--bg-app)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
                  <button
                    type="button"
                    onClick={() => setStudentsViewMode('table')}
                    title="عرض جدول"
                    style={{
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: studentsViewMode === 'table' ? 'var(--bg-surface)' : 'transparent',
                      color: studentsViewMode === 'table' ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    <List size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentsViewMode('cards')}
                    title="عرض بطاقات"
                    style={{
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: studentsViewMode === 'cards' ? 'var(--bg-surface)' : 'transparent',
                      color: studentsViewMode === 'cards' ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    <LayoutGrid size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {activeGroupStudents.length === 0 ? (
              <div style={{
                padding: '48px 24px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-xl)',
                border: '1.5px dashed var(--border-medium)'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  margin: '0 auto 16px'
                }}>
                  <Users size={28} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                  {lang === 'ar' ? 'لا يوجد طلاب مقيدون في هذه المجموعة حتى الآن' : 'No students enrolled yet'}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px', lineHeight: '1.5' }}>
                  {lang === 'ar' ? 'اضغط على زر «إضافة طالب للمجموعة» للبحث في قاعدة بيانات المنصة أو تسجيل طلاب جدد فوراً وتوليد كود باركود شخصي.' : 'Add students to this group.'}
                </p>
                <button
                  onClick={() => setIsAddStudentOpen(true)}
                  style={{
                    padding: '11px 24px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  + إضافة أول طالب للمجموعة
                </button>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                لا يوجد طلاب يطابقون خيارات البحث أو التصفية الحالية.
              </div>
            ) : studentsViewMode === 'table' ? (
              /* Students Table View */
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1.5px solid var(--border-subtle)' }}>
                      <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>الطالب</th>
                      <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>الهاتف وولي الأمر</th>
                      <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>كود الطالب والباركود</th>
                      <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>حضور اليوم</th>
                      <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>بطاقة الباركود</th>
                      <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((std, idx) => {
                      const isPresent = std.todayStatus === 'present';
                      return (
                        <tr 
                          key={std.id || idx} 
                          style={{ 
                            borderBottom: '1px solid var(--border-subtle)', 
                            transition: 'background-color 0.15s ease' 
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-app)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          {/* Student Info */}
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={std.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                                alt={std.nameAr}
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--primary)' }}
                              />
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                                  {std.nameAr || std.name}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                  {std.gradeAr || 'الصف الثالث الثانوي'}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact & Parent */}
                          <td style={{ padding: '14px 16px', fontSize: '12px' }}>
                            <div style={{ color: 'var(--text-primary)', fontWeight: '700', fontFamily: 'monospace' }}>
                              {std.phone}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '2px' }}>
                              ولي الأمر: {std.parentNameAr || std.parentName || 'ولي الأمر'} ({std.parentPhone || std.phone})
                            </div>
                          </td>

                          {/* Passcode & Barcode */}
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                fontWeight: '800',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'var(--bg-app)',
                                border: '1px solid var(--border-medium)',
                                color: 'var(--primary)'
                              }}>
                                {std.passcode || `STU-${std.id?.slice(-4) || '2026'}`}
                              </span>
                              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'monospace', letterSpacing: '1px' }}>
                                ||| {std.barcode || '2026001'} |||
                              </span>
                            </div>
                          </td>

                          {/* Today's Attendance Toggle */}
                          <td style={{ padding: '14px 16px' }}>
                            <button
                              type="button"
                              onClick={() => toggleStudentAttendance(activeGroup.id, std.id)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: isPresent ? 'rgba(22, 163, 74, 0.12)' : 'rgba(220, 38, 38, 0.12)',
                                color: isPresent ? 'var(--success)' : 'var(--danger)',
                                border: `1.5px solid ${isPresent ? 'var(--success)' : 'var(--danger)'}`,
                                fontSize: '11px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {isPresent ? <Check size={13} /> : <X size={13} />}
                              <span>{isPresent ? 'حاضر اليوم ✓' : 'غائب ✕'}</span>
                            </button>
                          </td>

                          {/* Barcode ID Card Modal Trigger */}
                          <td style={{ padding: '14px 16px' }}>
                            <button
                              type="button"
                              onClick={() => setStudentCardModal(std)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--bg-app)',
                                border: '1px solid var(--border-medium)',
                                color: 'var(--primary)',
                                fontSize: '12px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--primary-surface)';
                                e.currentTarget.style.borderColor = 'var(--primary)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--bg-app)';
                                e.currentTarget.style.borderColor = 'var(--border-medium)';
                              }}
                            >
                              <QrCode size={14} />
                              <span>عرض بطاقة الباركود</span>
                            </button>
                          </td>

                          {/* Actions: Remove student */}
                          <td style={{ padding: '14px 16px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`هل أنت متأكد من إلغاء قيد الطالب «${std.nameAr || std.name}» من هذه المجموعة؟`)) {
                                  removeStudentFromGroup(activeGroup.id, std.id);
                                }
                              }}
                              title="إلغاء قيد الطالب من المجموعة"
                              style={{
                                padding: '8px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'color 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Students Cards View */
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px'
              }}>
                {filteredStudents.map((std, idx) => {
                  const isPresent = std.todayStatus === 'present';
                  return (
                    <div
                      key={std.id || idx}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-lg)',
                        border: '1.5px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-app)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={std.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={std.nameAr}
                          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                            {std.nameAr || std.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {std.gradeAr || 'الصف الثالث الثانوي'}
                          </div>
                          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: '700' }}>
                            {std.passcode || 'STU-101'} • {std.phone}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => toggleStudentAttendance(activeGroup.id, std.id)}
                          style={{
                            flex: 1,
                            padding: '7px 10px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: isPresent ? 'rgba(22, 163, 74, 0.12)' : 'rgba(220, 38, 38, 0.12)',
                            color: isPresent ? 'var(--success)' : 'var(--danger)',
                            border: `1px solid ${isPresent ? 'var(--success)' : 'var(--danger)'}`,
                            fontSize: '11px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          {isPresent ? <Check size={12} /> : <X size={12} />}
                          <span>{isPresent ? 'حاضر اليوم' : 'غائب'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setStudentCardModal(std)}
                          style={{
                            padding: '7px 10px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-medium)',
                            color: 'var(--primary)',
                            fontSize: '11px',
                            fontWeight: '800',
                            cursor: 'pointer'
                          }}
                        >
                          بطاقة الباركود
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ADD COHORT (Multi-Session Support Like Teacher View)
         ========================================================================= */}
      {isAddCohortOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
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
            maxWidth: '620px',
            width: '100%',
            padding: '26px',
            maxHeight: '92vh',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-xl)',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <Plus size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                    {lang === 'ar' ? 'إنشاء مجموعة جديدة وتحديد الحصص الأسبوعية' : 'Create New Cohort'}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    إضافة حصة أو أكثر في الأسبوع وربط القاعات والجدول الزمني
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCohortOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCohort} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Group Name */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'اسم المجموعة *' : 'Cohort Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: أحياء 3 ثانوي — مجموعة النخبة' : 'Cohort name...'}
                  value={cohortName}
                  onChange={(e) => setCohortName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700'
                  }}
                />
              </div>

              {/* Subject & Teacher */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'المادة *' : 'Subject *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'المدرس المسؤول *' : 'Teacher *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}
                  />
                </div>
              </div>

              {/* Capacity & Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'السعر الشهري (ج.م)' : 'Price (EGP)'}
                  </label>
                  <input
                    type="number"
                    value={cohortPrice}
                    onChange={(e) => setCohortPrice(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'سعة الطلاب القصوى' : 'Max Students'}
                  </label>
                  <input
                    type="number"
                    value={cohortMaxStudents}
                    onChange={(e) => setCohortMaxStudents(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}
                  />
                </div>
              </div>

              {/* MULTI-SESSION SCHEDULER SECTION (Like Teacher Manager) */}
              <div style={{
                backgroundColor: 'var(--bg-app)',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--border-medium)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} color="var(--primary)" />
                    <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? 'حصص الأسبوع للمجموعة (مواعيد متعددة):' : 'Weekly Sessions per Cohort:'}
                    </span>
                  </div>

                  {/* Preset quick buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>العدد:</span>
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSetSessionCount(num)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: sessions.length === num ? 'var(--primary)' : 'var(--bg-surface)',
                          color: sessions.length === num ? '#FFFFFF' : 'var(--text-primary)',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Session Slots List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {sessions.map((sess, idx) => (
                    <div
                      key={sess.id || idx}
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)' }}>
                          الحصة رقم {idx + 1}
                        </span>
                        {sessions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSessionSlot(idx)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--danger)',
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                          >
                            <Trash2 size={13} />
                            <span>حذف الحصة</span>
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                        {/* Day */}
                        <div>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', marginBottom: '3px' }}>اليوم</label>
                          <select
                            value={sess.day}
                            onChange={(e) => handleUpdateSession(idx, 'day', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '7px 8px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-medium)',
                              fontSize: '11px',
                              fontWeight: '700'
                            }}
                          >
                            {WEEKDAYS.map(w => (
                              <option key={w.key} value={w.key}>{w.labelAr}</option>
                            ))}
                          </select>
                        </div>

                        {/* Start Time */}
                        <div>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', marginBottom: '3px' }}>من</label>
                          <input
                            type="time"
                            value={sess.startTime}
                            onChange={(e) => handleUpdateSession(idx, 'startTime', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-medium)',
                              fontSize: '11px',
                              fontWeight: '700'
                            }}
                          />
                        </div>

                        {/* End Time */}
                        <div>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', marginBottom: '3px' }}>إلى</label>
                          <input
                            type="time"
                            value={sess.endTime}
                            onChange={(e) => handleUpdateSession(idx, 'endTime', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-medium)',
                              fontSize: '11px',
                              fontWeight: '700'
                            }}
                          />
                        </div>

                        {/* Room */}
                        <div>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', marginBottom: '3px' }}>القاعة</label>
                          <select
                            value={sess.hall}
                            onChange={(e) => handleUpdateSession(idx, 'hall', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '7px 8px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-medium)',
                              fontSize: '11px',
                              fontWeight: '700'
                            }}
                          >
                            {rooms.map(r => (
                              <option key={r.id} value={r.nameAr}>{r.nameAr}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Session Slot Button */}
                {sessions.length < 7 && (
                  <button
                    type="button"
                    onClick={handleAddSingleSession}
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px dashed var(--primary)',
                      color: 'var(--primary)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={14} />
                    <span>+ إضافة حصة أخرى في الأسبوع</span>
                  </button>
                )}

                {/* Summary Preview */}
                <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  ملخص المواعيد: <strong style={{ color: 'var(--primary)' }}>{generateScheduleSummary()}</strong>
                </div>
              </div>

              {/* Conflict Warnings */}
              {hasAnyConflict && (
                <div style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  color: 'var(--danger)',
                  fontSize: '12px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={18} />
                  <span>توجد تعارضات زمنية في إحدى الحصص مع قاعات محجوزة مسبقاً! يرجى تغيير الوقت أو القاعة.</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={hasAnyConflict || !cohortName.trim()}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: hasAnyConflict || !cohortName.trim() ? 'var(--border-medium)' : 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: hasAnyConflict || !cohortName.trim() ? 'not-allowed' : 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'تأكيد الحجز وإنشاء المجموعة' : 'Confirm Cohort'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddCohortOpen(false)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '13px',
                    fontWeight: '800',
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

      {/* =========================================================================
          MODAL 2: ADD STUDENT TO COHORT (Search or Register)
         ========================================================================= */}
      {isAddStudentOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
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
            maxWidth: '560px',
            width: '100%',
            padding: '24px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  إضافة طالب لمجموعة: {activeGroup?.nameAr}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div style={{
              display: 'flex',
              backgroundColor: 'var(--bg-app)',
              padding: '4px',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '18px'
            }}>
              <button
                type="button"
                onClick={() => setStudentModalTab('search')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: studentModalTab === 'search' ? 'var(--bg-surface)' : 'transparent',
                  color: studentModalTab === 'search' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: studentModalTab === 'search' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                1. البحث في قاعدة بيانات متفوّق
              </button>
              <button
                type="button"
                onClick={() => setStudentModalTab('manual')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: studentModalTab === 'manual' ? 'var(--bg-surface)' : 'transparent',
                  color: studentModalTab === 'manual' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: studentModalTab === 'manual' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                2. تسجيل طالب جديد وإصدار باركود
              </button>
            </div>

            {/* TAB 1: Search Existing Platform Students */}
            {studentModalTab === 'search' && (
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  ابحث عن الطالب بالاسم أو رقم الهاتف لقيده بضغطة زر وتوليد باركود السنتر تلقائياً:
                </p>

                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="اكتب اسم الطالب (مثل: عمر طارق) أو رقم الهاتف..."
                    value={searchStudentQuery}
                    onChange={(e) => setSearchStudentQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 36px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}
                  />
                  <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                </div>

                {searchStudentQuery.trim() && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                    {searchResults.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        لم يتم العثور على طالب بهذا الاسم. يمكنك التبديل إلى تبويب <strong>«تسجيل طالب جديد»</strong> لإضافته فوراً!
                      </div>
                    ) : (
                      searchResults.map(std => {
                        const alreadyIn = (activeGroupStudents || []).some(s => s.phone === std.phone || s.id === std.id);
                        return (
                          <div
                            key={std.id}
                            style={{
                              padding: '12px 14px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'var(--bg-app)',
                              border: '1px solid var(--border-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={std.avatar}
                                alt={std.nameAr}
                                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                                  {std.nameAr}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                  {std.phone} • {std.gradeAr}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              disabled={alreadyIn}
                              onClick={() => handleEnrollExisting(std)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: alreadyIn ? 'var(--bg-subtle)' : 'var(--primary)',
                                color: alreadyIn ? 'var(--text-secondary)' : '#FFFFFF',
                                border: 'none',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: alreadyIn ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {alreadyIn ? 'مقيد بالفعل' : '+ قيد الطالب'}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Manual Student Registration */}
            {studentModalTab === 'manual' && (
              <form onSubmit={handleManualStudentRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  تسجيل طالب غير مسجل مسبقاً وتوليد كود باركود شخصي له للطباعة والحضور الفوري:
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    اسم الطالب بالكامل *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: حسام طارق محمد"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                      رقم هاتف الطالب *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="010XXXXXXXX"
                      value={manualPhone}
                      onChange={(e) => setManualPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-medium)',
                        backgroundColor: 'var(--bg-app)',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                      الصف الدراسي
                    </label>
                    <select
                      value={manualGrade}
                      onChange={(e) => setManualGrade(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-medium)',
                        backgroundColor: 'var(--bg-app)',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    >
                      <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                      <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                      <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                      اسم ولي الأمر
                    </label>
                    <input
                      type="text"
                      placeholder="أ. طارق محمد"
                      value={manualParentName}
                      onChange={(e) => setManualParentName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-medium)',
                        backgroundColor: 'var(--bg-app)',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                      رقم هاتف ولي الأمر
                    </label>
                    <input
                      type="tel"
                      placeholder="012XXXXXXXX"
                      value={manualParentPhone}
                      onChange={(e) => setManualParentPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-medium)',
                        backgroundColor: 'var(--bg-app)',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  تسجيل الطالب وإصدار الباركود فوراً ✓
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: STUDENT ATTENDANCE BARCODE CARD MODAL (Printable ID Card)
         ========================================================================= */}
      {studentCardModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.68)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '2px solid var(--primary)',
            maxWidth: '430px',
            width: '100%',
            padding: '26px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <button
                type="button"
                onClick={() => setStudentCardModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Center Branding */}
            <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '4px' }}>
              سنتر الرواد التعليمي — بطاقة الحضور والباركود الذكية
            </div>

            <img
              src={studentCardModal.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={studentCardModal.nameAr}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--primary)',
                margin: '10px auto'
              }}
            />

            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: '4px 0' }}>
              {studentCardModal.nameAr || studentCardModal.name}
            </h3>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {studentCardModal.gradeAr || 'الصف الثالث الثانوي'} • هاتف: {studentCardModal.phone}
            </div>

            {/* Real QR Code */}
            <div style={{ marginBottom: '14px' }}>
              <RealQRCode 
                value={`MOTAFAWWEQ:STUDENT:${studentCardModal.id}:${studentCardModal.passcode || 'STU-101'}:${studentCardModal.barcode || '2026001'}`} 
                size={140} 
              />
            </div>

            {/* Visual Barcode Display */}
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-medium)',
              marginBottom: '14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}>
              {/* Simulated crisp Barcode SVG lines */}
              <div style={{ display: 'flex', alignItems: 'center', height: '42px', gap: '3px' }}>
                {[4, 2, 6, 2, 4, 8, 2, 4, 6, 2, 8, 4, 2, 6, 4, 2, 8, 4, 6, 2, 4, 2].map((w, i) => (
                  <div key={i} style={{ width: `${w}px`, height: '100%', backgroundColor: '#06254E' }} />
                ))}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: '900', color: '#06254E', letterSpacing: '4px' }}>
                {studentCardModal.barcode || '20261042'}
              </div>
            </div>

            {/* Passcode Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-app)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>كود الطالب السريع:</span>
              <span style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: '900', color: 'var(--primary)' }}>
                {studentCardModal.passcode || 'STU-1042'}
              </span>
            </div>

            {/* Print button */}
            <button
              type="button"
              onClick={() => window.print()}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Printer size={16} />
              <span>طباعة بطاقة الباركود للطالب</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
