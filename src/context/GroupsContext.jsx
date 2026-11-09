import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { teacherApi } from '../services/teacherApi';

export const ALL_REGISTERED_STUDENTS = [];

export const parseScheduleSlots = (scheduleStr = '', defaultHall = 'القاعة الرئيسية') => {
  const text = (scheduleStr || '').toLowerCase();
  const slots = [];
  const dayConfigs = [
    { key: 'saturday', ar: 'السبت', en: 'Saturday', regex: /السبت/ },
    { key: 'sunday', ar: 'الأحد', en: 'Sunday', regex: /(الأحد|الاحد|الحد)/ },
    { key: 'monday', ar: 'الاثنين', en: 'Monday', regex: /(الإثنين|الاثنين|الاتنين)/ },
    { key: 'tuesday', ar: 'الثلاثاء', en: 'Tuesday', regex: /(الثلاثاء|الثلاثا|التلات)/ },
    { key: 'wednesday', ar: 'الأربعاء', en: 'Wednesday', regex: /(الأربعاء|الاربعاء|الاربعا)/ },
    { key: 'thursday', ar: 'الخميس', en: 'Thursday', regex: /الخميس/ },
    { key: 'friday', ar: 'الجمعة', en: 'Friday', regex: /الجمعة/ },
  ];

  let start = '16:00';
  let end = '18:00';
  if (text.includes('6') || text.includes('٦')) {
    start = '18:00'; end = '20:00';
  } else if (text.includes('5') || text.includes('٥')) {
    start = '17:00'; end = '19:00';
  } else if (text.includes('2') || text.includes('٢')) {
    start = '14:00'; end = '16:30';
  } else if (text.includes('10') || text.includes('١٠')) {
    start = '10:00'; end = '12:00';
  }

  dayConfigs.forEach((dc) => {
    if (dc.regex.test(text)) {
      slots.push({
        id: `slot-${dc.key}-${Math.random().toString(36).slice(2, 7)}`,
        day: dc.key,
        dayAr: dc.ar,
        dayEn: dc.en,
        startTime: start,
        endTime: end,
        hall: defaultHall || 'القاعة الرئيسية',
      });
    }
  });

  if (slots.length === 0) {
    slots.push({
      id: `slot-sun-${Math.random().toString(36).slice(2, 7)}`,
      day: 'sunday',
      dayAr: 'الأحد',
      dayEn: 'Sunday',
      startTime: start,
      endTime: end,
      hall: defaultHall || 'القاعة الرئيسية',
    });
  }
  return slots;
};

const GroupsContext = createContext(null);

export const GroupsProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  // Enrolled and pending students keyed by group id/uuid
  const [enrolledStudents, setEnrolledStudents] = useState({});
  const [pendingStudents, setPendingStudents] = useState({});

  // Active group for Student Roster view
  const [activeGroupId, setActiveGroupId] = useState('');

  // Schedule Notes per day
  const [scheduleNotes, setScheduleNotes] = useState({
    saturday: [],
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
  });

  // Student Study Sessions (Self-Study slots)
  const [studentStudySessions, setStudentStudySessions] = useState(() => {
    try {
      const saved = localStorage.getItem('motafawweq_student_study_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Global toast message notification
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Fetch groups from backend
  const fetchGroups = useCallback(async () => {
    setLoadingGroups(true);
    try {
      const res = await teacherApi.groups.list();
      const rawList = res?.data || [];
      const mappedGroups = rawList.map((g) => ({
        id: g.id || g.uuid,
        uuid: g.uuid || g.id,
        nameAr: g.nameAr || g.name_ar,
        nameEn: g.nameEn || g.name_en || g.nameAr || g.name_ar,
        subjectAr: g.subjectAr || g.subject_ar || 'الأحياء (الثانوية العامة)',
        subjectEn: g.subjectEn || g.subject_en || 'Biology',
        gradeAr: g.gradeAr || g.grade_ar || 'الصف الثالث الثانوي',
        gradeEn: g.gradeEn || g.grade_en || 'Grade 12',
        scheduleAr: g.scheduleAr || g.schedule_ar || 'الأحد والأربعاء 4:00 عصراً',
        scheduleEn: g.scheduleEn || g.schedule_en || 'Sundays & Wednesdays 4:00 PM',
        centerName: g.centerName || g.center_name || 'سنتر الرواد التعليمي',
        hallName: g.hallName || g.hall_name || 'القاعة الرئيسية',
        priceEgp: Number(g.priceEgp || g.price_egp) || 450,
        joinCode: g.joinCode || g.join_code,
        maxStudents: Number(g.maxStudents || g.max_students) || 50,
        enrolledCount: Number(g.enrolledCount || g.enrolled_count) || 0,
        pendingCount: Number(g.pendingCount || g.pending_count) || 0,
        status: g.status || 'active',
        scheduleSlots: Array.isArray(g.scheduleSlots || g.schedule_slots) && (g.scheduleSlots || g.schedule_slots).length > 0
          ? (g.scheduleSlots || g.schedule_slots).map((s) => ({
              id: s.id || `slot-${s.day || s.day_of_week}`,
              day: s.day || s.day_of_week,
              dayAr: s.dayAr || (s.day_of_week === 'sunday' ? 'الأحد' : s.day_of_week === 'monday' ? 'الاثنين' : s.day_of_week === 'tuesday' ? 'الثلاثاء' : s.day_of_week === 'wednesday' ? 'الأربعاء' : s.day_of_week === 'thursday' ? 'الخميس' : s.day_of_week === 'friday' ? 'الجمعة' : 'السبت'),
              dayEn: s.dayEn || s.day_of_week,
              startTime: s.startTime || s.start_time,
              endTime: s.endTime || s.end_time,
              hall: s.hall || s.hall_name || g.hallName || g.hall_name || 'القاعة الرئيسية',
            }))
          : parseScheduleSlots(g.scheduleAr || g.schedule_ar, g.hallName || g.hall_name),
      }));

      setGroups(mappedGroups);
      if (mappedGroups.length > 0) {
        setActiveGroupId((prev) => (prev && mappedGroups.some((m) => m.id === prev) ? prev : mappedGroups[0].id));
      }
    } catch (err) {
      console.warn('Teacher groups API fetch error:', err);
    } finally {
      setLoadingGroups(false);
    }
  }, []);

  // Fetch Roster for active group
  const fetchGroupRoster = useCallback(async (groupId) => {
    if (!groupId) return;
    try {
      const res = await teacherApi.roster.list(groupId);
      if (res?.data) {
        const enrolled = res.data.enrolled || [];
        const pending = res.data.pending || [];
        setEnrolledStudents((prev) => ({ ...prev, [groupId]: enrolled }));
        setPendingStudents((prev) => ({ ...prev, [groupId]: pending }));
      }
    } catch (err) {
      console.warn(`Roster fetch failed for group ${groupId}:`, err);
    }
  }, []);

  // Fetch Schedule Notes
  const fetchScheduleNotes = useCallback(async () => {
    try {
      const res = await teacherApi.schedule.getWeekly();
      if (res?.data?.notesByDay) {
        setScheduleNotes(res.data.notesByDay);
      }
    } catch (err) {
      console.warn('Weekly schedule fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
    fetchScheduleNotes();
  }, [fetchGroups, fetchScheduleNotes]);

  useEffect(() => {
    if (activeGroupId) {
      fetchGroupRoster(activeGroupId);
    }
  }, [activeGroupId, fetchGroupRoster]);

  useEffect(() => {
    try {
      localStorage.setItem('motafawweq_student_study_sessions', JSON.stringify(studentStudySessions));
    } catch (e) {}
  }, [studentStudySessions]);

  // Add new study group
  const addGroup = async (groupData) => {
    const slots =
      Array.isArray(groupData.scheduleSlots) && groupData.scheduleSlots.length > 0
        ? groupData.scheduleSlots
        : Array.isArray(groupData.slots) && groupData.slots.length > 0
        ? groupData.slots
        : parseScheduleSlots(groupData.scheduleAr, groupData.hallName || 'القاعة الرئيسية');

    try {
      const payload = {
        name_ar: groupData.nameAr || 'مجموعة دراسية جديدة',
        name_en: groupData.nameEn || groupData.nameAr || 'New Study Group',
        center_name: groupData.centerName || 'سنتر الرواد التعليمي',
        hall_name: groupData.hallName || 'القاعة الرئيسية',
        subject_ar: groupData.subjectAr || 'الأحياء',
        grade_ar: groupData.gradeAr || 'الصف الثالث الثانوي',
        schedule_ar: groupData.scheduleAr || 'الأحد والأربعاء 4:00 عصراً',
        price_egp: Number(groupData.priceEgp) || 450,
        max_students: Number(groupData.maxStudents) || 50,
        slots: slots.map((s) => ({
          day_of_week: s.day,
          start_time: s.startTime || '16:00',
          end_time: s.endTime || '18:00',
          hall_name: s.hall || groupData.hallName || 'القاعة الرئيسية',
        })),
      };

      const res = await teacherApi.groups.create(payload);
      const g = res.data;
      const createdObj = {
        id: g.id || g.uuid,
        uuid: g.uuid || g.id,
        nameAr: g.nameAr || g.name_ar || groupData.nameAr,
        nameEn: g.nameEn || g.name_en || groupData.nameEn,
        subjectAr: g.subjectAr || g.subject_ar || groupData.subjectAr,
        gradeAr: g.gradeAr || g.grade_ar || groupData.gradeAr,
        scheduleAr: g.scheduleAr || g.schedule_ar || groupData.scheduleAr,
        centerName: g.centerName || g.center_name || groupData.centerName,
        hallName: g.hallName || g.hall_name || groupData.hallName,
        maxStudents: Number(g.maxStudents || g.max_students) || 50,
        priceEgp: Number(g.priceEgp || g.price_egp) || 450,
        joinCode: g.joinCode || g.join_code,
        scheduleSlots: slots,
      };

      setGroups((prev) => [createdObj, ...prev]);
      setActiveGroupId(createdObj.id);
      showToast('تم إنشاء المجموعة وإضافتها بنجاح!');
      return createdObj;
    } catch (err) {
      console.error('Failed to create group:', err);
      showToast(err.message || 'فشل إنشاء المجموعة.', 'warning');
      throw err;
    }
  };

  // Update existing group
  const updateGroup = async (groupId, updatedData) => {
    const existing = groups.find((g) => g.id === groupId);
    const slots =
      Array.isArray(updatedData.scheduleSlots) && updatedData.scheduleSlots.length > 0
        ? updatedData.scheduleSlots
        : updatedData.scheduleAr
        ? parseScheduleSlots(updatedData.scheduleAr, updatedData.hallName || existing?.hallName)
        : existing?.scheduleSlots || [];

    try {
      const payload = {
        name_ar: updatedData.nameAr || existing?.nameAr,
        name_en: updatedData.nameEn || existing?.nameEn,
        center_name: updatedData.centerName || existing?.centerName,
        hall_name: updatedData.hallName || existing?.hallName,
        price_egp: Number(updatedData.priceEgp) || existing?.priceEgp,
        max_students: Number(updatedData.maxStudents) || existing?.maxStudents,
        schedule_ar: updatedData.scheduleAr || existing?.scheduleAr,
        slots: slots.map((s) => ({
          day_of_week: s.day,
          start_time: s.startTime || '16:00',
          end_time: s.endTime || '18:00',
          hall_name: s.hall || updatedData.hallName || existing?.hallName || 'القاعة الرئيسية',
        })),
      };

      await teacherApi.groups.update(groupId, payload);

      setGroups((prev) =>
        prev.map((g) => {
          if (g.id === groupId) {
            return { ...g, ...updatedData, scheduleSlots: slots };
          }
          return g;
        })
      );
      showToast('تم حفظ تعديلات المجموعة بنجاح!');
    } catch (err) {
      console.error('Failed to update group:', err);
      showToast(err.message || 'فشل تحديث بيانات المجموعة.', 'warning');
    }
  };

  // Delete study group
  const deleteGroup = async (groupId) => {
    try {
      await teacherApi.groups.delete(groupId);
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
      setEnrolledStudents((prev) => {
        const copy = { ...prev };
        delete copy[groupId];
        return copy;
      });
      setPendingStudents((prev) => {
        const copy = { ...prev };
        delete copy[groupId];
        return copy;
      });
      if (activeGroupId === groupId) {
        const remaining = groups.filter((g) => g.id !== groupId);
        if (remaining.length > 0) setActiveGroupId(remaining[0].id);
      }
      showToast('تم حذف المجموعة وسجلها بنجاح!');
    } catch (err) {
      console.error('Failed to delete group:', err);
      showToast(err.message || 'فشل حذف المجموعة.', 'warning');
    }
  };

  // Accept pending student enrollment
  const acceptPendingStudent = async (groupId, pendingId) => {
    try {
      await teacherApi.roster.accept(groupId, pendingId);
      await fetchGroupRoster(groupId);
      showToast('تم قبول الطالب بنجاح وإضافته لقائمة المقيدين!');
    } catch (err) {
      console.error('Failed to accept student:', err);
      showToast(err.message || 'فشل قبول الطالب.', 'warning');
    }
  };

  // Reject pending student enrollment
  const rejectPendingStudent = async (groupId, pendingId, reason = '') => {
    try {
      await teacherApi.roster.reject(groupId, pendingId, reason);
      await fetchGroupRoster(groupId);
      showToast('تم رفض طلب الانضمام.', 'warning');
    } catch (err) {
      console.error('Failed to reject student:', err);
      showToast(err.message || 'فشل رفض الطالب.', 'warning');
    }
  };

  // Remove enrolled student from group
  const removeStudentFromGroup = async (groupId, enrollmentUuid) => {
    try {
      await teacherApi.roster.remove(groupId, enrollmentUuid);
      await fetchGroupRoster(groupId);
      showToast('تم إلغاء قيد الطالب من هذه المجموعة.');
    } catch (err) {
      console.error('Failed to remove student:', err);
      showToast(err.message || 'فشل إلغاء قيد الطالب.', 'warning');
    }
  };

  // Invite student directly by teacher search
  const inviteStudentToGroup = async (groupId, studentId) => {
    try {
      await teacherApi.roster.invite(groupId, studentId);
      await fetchGroupRoster(groupId);
      showToast('تم إرسال دعوة الانضمام للطالب بنجاح!');
      return true;
    } catch (err) {
      console.error('Failed to invite student:', err);
      showToast(err.message || 'فشل إرسال الدعوة للطالب.', 'warning');
      return false;
    }
  };

  // Student scans QR or submits join code
  const studentJoinByCode = async (joinCode) => {
    const cleanCode = (joinCode || '').trim().toUpperCase();
    try {
      const res = await teacherApi.roster.studentJoin
        ? teacherApi.roster.studentJoin(cleanCode)
        : null;
      showToast('تم إرسال طلب الانضمام بنجاح!');
      return { success: true, data: res?.data };
    } catch (err) {
      return { success: false, error: err.message || 'كود المجموعة غير صحيح أو انتهت صلاحيته' };
    }
  };

  // Direct manual toggle of attendance
  const toggleStudentAttendance = async (groupId, studentId, currentStatus) => {
    const nextStatus = currentStatus === 'present' ? 'absent' : 'present';
    try {
      await teacherApi.attendance.toggleManual(groupId, {
        student_id: studentId,
        status: nextStatus,
      });
      await fetchGroupRoster(groupId);
      showToast('تم تحديث حالة الحضور بنجاح!');
    } catch (err) {
      console.error('Failed to toggle attendance:', err);
      showToast(err.message || 'فشل تحديث الحضور.', 'warning');
    }
  };

  // Record student attendance by Barcode or Passcode
  const recordStudentAttendanceByCode = async (groupId, code) => {
    const rawCode = (code || '').trim();
    if (!rawCode) return { success: false, message: 'يرجى إدخال أو مسح الباركود' };

    try {
      const res = await teacherApi.attendance.scan(groupId, rawCode, 'barcode_scanner');
      await fetchGroupRoster(groupId);
      showToast('تم تسجيل الحضور بنجاح!');
      return { success: true, student: res?.data };
    } catch (err) {
      console.error('Scan attendance error:', err);
      showToast(err.message || 'فشل تسجيل الحضور.', 'warning');
      return { success: false, message: err.message || 'فشل تسجيل الحضور.' };
    }
  };

  // Schedule Notes CRUD
  const addScheduleNote = async (dayKey, noteData) => {
    try {
      const res = await teacherApi.schedule.createNote({
        day_of_week: dayKey,
        note_text: noteData.text,
        priority: noteData.priority || 'medium',
        time_label: noteData.time || '16:00',
      });
      await fetchScheduleNotes();
      showToast('تمت إضافة الملاحظة بنجاح إلى جدول المواعيد!');
      return res.data;
    } catch (err) {
      console.error('Failed to add schedule note:', err);
      showToast(err.message || 'فشل إضافة الملاحظة.', 'warning');
    }
  };

  const toggleScheduleNote = async (dayKey, noteId) => {
    try {
      await teacherApi.schedule.toggleNote(noteId);
      await fetchScheduleNotes();
    } catch (err) {
      console.error('Failed to toggle note:', err);
    }
  };

  const deleteScheduleNote = async (dayKey, noteId) => {
    try {
      await teacherApi.schedule.deleteNote(noteId);
      await fetchScheduleNotes();
      showToast('تم حذف الملاحظة بنجاح.');
    } catch (err) {
      console.error('Failed to delete note:', err);
      showToast(err.message || 'فشل حذف الملاحظة.', 'warning');
    }
  };

  // Student Study Sessions Handlers (for student dashboard / self-study view)
  const addStudySession = (session) => {
    const newSession = {
      id: `study-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      day: session.day || 'tuesday',
      subject: session.subject || 'مذاكرة عامة',
      title: session.title || 'جلسة استذكار ومراجعة',
      startTime: session.startTime || '19:00',
      endTime: session.endTime || '21:00',
      durationMinutes: Number(session.durationMinutes) || 120,
      isCompleted: false,
      color: session.color || '#1588C7',
      notes: session.notes || '',
    };
    setStudentStudySessions((prev) => [newSession, ...prev]);
    showToast(`تمت إضافة جلسة مذاكرة «${newSession.subject}» إلى جدولك بنجاح!`);
    return newSession;
  };

  const updateStudySession = (id, updatedData) => {
    setStudentStudySessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    );
    showToast('تم تحديث جلسة المذاكرة بنجاح.');
  };

  const toggleStudySession = (id) => {
    setStudentStudySessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isCompleted: !s.isCompleted } : s))
    );
  };

  const deleteStudySession = (id) => {
    setStudentStudySessions((prev) => prev.filter((s) => s.id !== id));
    showToast('تم حذف جلسة المذاكرة من جدولك.');
  };

  const getActiveGroup = () => {
    return groups.find((g) => g.id === activeGroupId) || groups[0] || null;
  };

  return (
    <GroupsContext.Provider
      value={{
        groups,
        loadingGroups,
        activeGroupId,
        setActiveGroupId,
        getActiveGroup,
        addGroup,
        updateGroup,
        deleteGroup,
        enrolledStudents,
        pendingStudents,
        acceptPendingStudent,
        rejectPendingStudent,
        removeStudentFromGroup,
        inviteStudentToGroup,
        studentJoinByCode,
        toggleStudentAttendance,
        recordStudentAttendanceByCode,
        scheduleNotes,
        addScheduleNote,
        toggleScheduleNote,
        deleteScheduleNote,
        studentStudySessions,
        addStudySession,
        updateStudySession,
        toggleStudySession,
        deleteStudySession,
        showToast,
      }}
    >
      {children}

      {/* Floating Global Notification Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 100000,
            backgroundColor: toast.type === 'warning' ? '#B45309' : '#06254E',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.25), 0 0 0 1px rgba(21, 136, 199, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: '700',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </GroupsContext.Provider>
  );
};

export const useGroups = () => {
  const ctx = useContext(GroupsContext);
  if (!ctx) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return ctx;
};
