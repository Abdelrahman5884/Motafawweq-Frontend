import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tokenStorage } from '../services/api';
import { teacherApi } from '../services/teacherApi';
import { studentApi } from '../services/studentApi';
import { extractGroupJoinCode } from '../utils';
import { useAuth } from './AuthContext';

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

const EMPTY_NOTES_MAP = {
  saturday: [],
  sunday: [],
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
};

const DAY_LABELS = {
  saturday: { ar: 'السبت', en: 'Saturday' },
  sunday: { ar: 'الأحد', en: 'Sunday' },
  monday: { ar: 'الاثنين', en: 'Monday' },
  tuesday: { ar: 'الثلاثاء', en: 'Tuesday' },
  wednesday: { ar: 'الأربعاء', en: 'Wednesday' },
  thursday: { ar: 'الخميس', en: 'Thursday' },
  friday: { ar: 'الجمعة', en: 'Friday' },
};

const GroupsContext = createContext(null);

export const GroupsProvider = ({ children }) => {
  const { currentUser, isAuthenticated, authLoading } = useAuth();
  const hasToken = Boolean(tokenStorage.getAccessToken());
  const isStudentRole = currentUser?.role === 'student';
  const isTeacherRole = currentUser?.role === 'teacher';
  const activeUserId = isAuthenticated && hasToken && currentUser?.id ? String(currentUser.id) : '';
  const studySessionsStorageKey = activeUserId ? `motafawweq_student_study_sessions_${activeUserId}` : '';

  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [groupsError, setGroupsError] = useState(null);

  // Enrolled and pending students keyed by group id/uuid
  const [enrolledStudents, setEnrolledStudents] = useState({});
  const [pendingStudents, setPendingStudents] = useState({});

  // Active group for Student Roster view
  const [activeGroupId, setActiveGroupId] = useState('');

  // Schedule Notes per day
  const [scheduleNotes, setScheduleNotes] = useState(() => ({ ...EMPTY_NOTES_MAP }));

  // Student Study Sessions (Self-Study slots)
  const [studentStudySessions, setStudentStudySessions] = useState([]);

  // Global toast message notification
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  // Fetch groups from backend (role-aware: Teacher vs Student)
  const fetchGroups = useCallback(async () => {
    if (authLoading) return;
    if (!activeUserId || (!isStudentRole && !isTeacherRole)) {
      setGroups([]);
      setEnrolledStudents({});
      setPendingStudents({});
      setGroupsError(null);
      setLoadingGroups(false);
      return;
    }

    setLoadingGroups(true);
    setGroupsError(null);
    try {
      if (isStudentRole) {
        const res = await studentApi.groups.list();
        const rawList = Array.isArray(res?.data) ? res.data : [];
        const enrolledMap = {};
        const pendingMap = {};

        const mappedGroups = rawList.map((g) => {
          const gid = g.groupId || g.id || g.uuid;
          const status = g.enrollmentStatus || 'pending';
          const meEntry = {
            id: g.enrollmentId || gid,
            nameAr: currentUser?.nameAr || currentUser?.name || 'الطالب',
            name: currentUser?.name || currentUser?.nameAr || 'الطالب',
            phone: currentUser?.phone || '',
            barcode: g.studentBarcode || null,
            passcode: g.studentPasscode || null,
            attendanceRate: Number(g.attendanceRate ?? 100),
            attendedSessions: Number(g.attendedSessions ?? 0),
            totalSessions: Number(g.totalSessions ?? 0),
          };
          if (status === 'enrolled') {
            enrolledMap[gid] = [meEntry];
            pendingMap[gid] = [];
          } else {
            enrolledMap[gid] = [];
            pendingMap[gid] = [meEntry];
          }

          const rawSlots = Array.isArray(g.scheduleSlots) ? g.scheduleSlots : [];
          const normalizedSlots = rawSlots.length > 0
            ? rawSlots.map((s) => {
                const dayKey = String(s.day || s.day_of_week || '').toLowerCase();
                const meta = DAY_LABELS[dayKey] || { ar: dayKey, en: dayKey };
                return {
                  id: s.id || `slot-${dayKey}-${s.startTime || ''}`,
                  day: dayKey,
                  dayAr: s.dayAr || meta.ar,
                  dayEn: s.dayEn || meta.en,
                  startTime: s.startTime || s.start_time || '16:00',
                  endTime: s.endTime || s.end_time || '18:00',
                  hall: s.hall || s.hall_name || g.hallName || 'القاعة الرئيسية',
                };
              })
            : parseScheduleSlots(g.scheduleAr, g.hallName);

          const rawPrice = g.priceEgp ?? g.price_egp ?? 0;
          const numericPrice = !Number.isNaN(Number(rawPrice)) ? Number(rawPrice) : 0;

          return {
            id: gid,
            uuid: gid,
            enrollmentId: g.enrollmentId || gid,
            courseId: g.courseId || null,
            nameAr: g.nameAr || g.name_ar || '',
            nameEn: g.nameEn || g.name_en || g.nameAr || '',
            subjectAr: g.subjectAr || g.subject_ar || '',
            subjectEn: g.subjectEn || g.subject_en || g.subjectAr || '',
            gradeAr: g.gradeAr || g.grade_ar || '',
            gradeEn: g.gradeEn || g.grade_en || g.gradeAr || '',
            scheduleAr: g.scheduleAr || g.schedule_ar || '',
            scheduleEn: g.scheduleEn || g.schedule_en || g.scheduleAr || '',
            centerName: g.centerName || g.center_name || '',
            hallName: g.hallName || g.hall_name || '',
            priceEgp: numericPrice,
            joinCode: String(g.joinCode || g.join_code || '').trim().toUpperCase(),
            maxStudents: Number(g.maxStudents || g.max_students || 50),
            enrolledCount: Number(g.enrolledCount || g.enrolled_count || 0),
            teacherName: g.teacherName || g.teacherNameAr || '',
            teacherNameAr: g.teacherNameAr || g.teacherName || '',
            teacherNameEn: g.teacherNameEn || g.teacherName || '',
            enrollmentStatus: status,
            studentBarcode: g.studentBarcode || null,
            studentPasscode: g.studentPasscode || null,
            attendanceRate: Number(g.attendanceRate ?? 100),
            attendedSessions: Number(g.attendedSessions ?? 0),
            totalSessions: Number(g.totalSessions ?? 0),
            enrolledAt: g.enrolledAt || null,
            requestedAt: g.requestedAt || null,
            scheduleSlots: normalizedSlots,
          };
        });

        setGroups(mappedGroups);
        setEnrolledStudents(enrolledMap);
        setPendingStudents(pendingMap);
        return;
      }

      const res = await teacherApi.groups.list();
      const rawList = Array.isArray(res?.data) ? res.data : [];
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
        priceEgp: (g.priceEgp !== undefined && g.priceEgp !== null && !Number.isNaN(Number(g.priceEgp)))
          ? Number(g.priceEgp)
          : (g.price_egp !== undefined && g.price_egp !== null && !Number.isNaN(Number(g.price_egp)))
          ? Number(g.price_egp)
          : 0,
        joinCode: String(g.joinCode || g.join_code || '').trim().toUpperCase(),
        maxStudents: Number(g.maxStudents || g.max_students) || 50,
        enrolledCount: Number(g.enrolledCount || g.enrolled_count) || 0,
        pendingCount: Number(g.pendingCount || g.pending_count) || 0,
        status: g.status || 'active',
        scheduleSlots: Array.isArray(g.scheduleSlots || g.schedule_slots) && (g.scheduleSlots || g.schedule_slots).length > 0
          ? (g.scheduleSlots || g.schedule_slots).map((s) => {
              const dayKey = String(s.day || s.day_of_week || '').toLowerCase();
              const meta = DAY_LABELS[dayKey] || { ar: dayKey, en: dayKey };
              return {
                id: s.id || `slot-${dayKey}`,
                day: dayKey,
                dayAr: s.dayAr || meta.ar,
                dayEn: s.dayEn || meta.en,
                startTime: s.startTime || s.start_time,
                endTime: s.endTime || s.end_time,
                hall: s.hall || s.hall_name || g.hallName || g.hall_name || 'القاعة الرئيسية',
              };
            })
          : parseScheduleSlots(g.scheduleAr || g.schedule_ar, g.hallName || g.hall_name),
      }));

      setGroups(mappedGroups);
      if (mappedGroups.length > 0) {
        setActiveGroupId((prev) => (prev && mappedGroups.some((m) => m.id === prev) ? prev : mappedGroups[0].id));
      }
    } catch (err) {
      setGroupsError(err?.message || 'تعذر تحميل بيانات المجموعات الدراسية.');
    } finally {
      setLoadingGroups(false);
    }
  }, [authLoading, activeUserId, isStudentRole, isTeacherRole, currentUser?.name, currentUser?.nameAr, currentUser?.phone]);

  // Fetch Roster for active group (Teacher only)
  const fetchGroupRoster = useCallback(async (groupId) => {
    if (authLoading || !groupId || !isTeacherRole || !activeUserId) return;
    try {
      const res = await teacherApi.roster.list(groupId);
      if (res?.data) {
        const enrolled = res.data.enrolled || [];
        const pending = res.data.pending || [];
        setEnrolledStudents((prev) => ({ ...prev, [groupId]: enrolled }));
        setPendingStudents((prev) => ({ ...prev, [groupId]: pending }));
      }
    } catch {
      // ignore non-critical roster fetch errors
    }
  }, [authLoading, isTeacherRole, activeUserId]);

  // Fetch Schedule Notes & Student Personal Study Sessions
  const fetchScheduleNotes = useCallback(async () => {
    if (authLoading) return;
    if (!activeUserId || (!isStudentRole && !isTeacherRole)) {
      setScheduleNotes({ ...EMPTY_NOTES_MAP });
      setStudentStudySessions([]);
      return;
    }

    try {
      if (isStudentRole) {
        const res = await studentApi.schedule.getWeekly();
        if (Array.isArray(res?.data?.personalSessions)) {
          setStudentStudySessions(res.data.personalSessions);
        }
        if (res?.data?.scheduleNotes && typeof res.data.scheduleNotes === 'object') {
          setScheduleNotes({ ...EMPTY_NOTES_MAP, ...res.data.scheduleNotes });
        }
        return;
      }

      const res = await teacherApi.schedule.getWeekly();
      const daysData = res?.data?.days;
      if (daysData && typeof daysData === 'object') {
        const mapped = { ...EMPTY_NOTES_MAP };
        Object.keys(mapped).forEach((dayKey) => {
          if (Array.isArray(daysData[dayKey]?.notes)) {
            mapped[dayKey] = daysData[dayKey].notes;
          }
        });
        setScheduleNotes(mapped);
      } else if (res?.data?.notesByDay) {
        setScheduleNotes({ ...EMPTY_NOTES_MAP, ...res.data.notesByDay });
      }
    } catch {
      // Fallback to user-scoped local cache if offline
      if (isStudentRole && studySessionsStorageKey) {
        try {
          const cached = localStorage.getItem(studySessionsStorageKey);
          if (cached) setStudentStudySessions(JSON.parse(cached) || []);
        } catch {
          // ignore
        }
      }
    }
  }, [authLoading, activeUserId, isStudentRole, isTeacherRole, studySessionsStorageKey]);

  useEffect(() => {
    fetchGroups();
    fetchScheduleNotes();
  }, [fetchGroups, fetchScheduleNotes]);

  useEffect(() => {
    if (activeGroupId && isTeacherRole) {
      fetchGroupRoster(activeGroupId);
    }
  }, [activeGroupId, isTeacherRole, fetchGroupRoster]);

  useEffect(() => {
    if (!studySessionsStorageKey || !isStudentRole) return;
    try {
      localStorage.setItem(studySessionsStorageKey, JSON.stringify(studentStudySessions));
    } catch {
      // ignore storage errors
    }
  }, [studentStudySessions, studySessionsStorageKey, isStudentRole]);

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
        price_egp: groupData.priceEgp !== undefined && groupData.priceEgp !== '' && !isNaN(Number(groupData.priceEgp)) ? Number(groupData.priceEgp) : 0,
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
      const rawCreatedPrice = g.priceEgp !== undefined && g.priceEgp !== null ? g.priceEgp : g.price_egp;
      const createdPrice = rawCreatedPrice !== undefined && rawCreatedPrice !== null && !isNaN(Number(rawCreatedPrice))
        ? Number(rawCreatedPrice)
        : (groupData.priceEgp !== undefined && !isNaN(Number(groupData.priceEgp)) ? Number(groupData.priceEgp) : 0);

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
        priceEgp: createdPrice,
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
        price_egp: updatedData.priceEgp !== undefined && updatedData.priceEgp !== '' && !isNaN(Number(updatedData.priceEgp))
          ? Number(updatedData.priceEgp)
          : (existing?.priceEgp ?? 0),
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
      throw err;
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

  // Student scans QR or submits join code (accepts raw code or full QR join URL)
  const studentJoinByCode = async (joinCode, extraData = {}) => {
    const cleanCode = extractGroupJoinCode(joinCode);
    if (!cleanCode) {
      const msg = 'يرجى إدخال كود المجموعة أولاً.';
      showToast(msg, 'warning');
      return { success: false, message: msg, error: msg };
    }
    try {
      const res = await studentApi.groups.join(cleanCode, {
        parent_name_ar: extraData.parentNameAr || undefined,
        parent_phone: extraData.parentPhone || undefined,
      });
      await Promise.all([fetchGroups(), fetchScheduleNotes()]);
      const successMsg = res?.message || 'تم إرسال طلب الانضمام بنجاح! بانتظار موافقة المعلم.';
      showToast(successMsg);
      return { success: true, message: successMsg, data: res?.data };
    } catch (err) {
      const errMsg = err?.errors?.join_code?.[0] || err?.message || 'كود المجموعة غير صحيح أو انتهت صلاحيته';
      showToast(errMsg, 'warning');
      return { success: false, message: errMsg, error: errMsg };
    }
  };

  // Student leaves an enrolled group or cancels a pending join request
  const studentLeaveGroup = async (groupUuid) => {
    if (!groupUuid) return { success: false, error: 'معرف المجموعة غير صالح.' };
    try {
      const res = await studentApi.groups.leave(groupUuid);
      await Promise.all([fetchGroups(), fetchScheduleNotes()]);
      const msg = res?.message || 'تم مغادرة المجموعة الدراسية بنجاح.';
      showToast(msg);
      return { success: true, message: msg };
    } catch (err) {
      const errMsg = err?.message || 'تعذر مغادرة المجموعة حالياً.';
      showToast(errMsg, 'warning');
      return { success: false, error: errMsg };
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

  // Schedule Notes CRUD (Teacher API + Student API)
  const addScheduleNote = async (dayKey, noteData) => {
    if (isStudentRole) {
      try {
        const res = await studentApi.schedule.createNote({
          day_of_week: dayKey,
          text: noteData.text,
          time: noteData.time || '16:00',
          priority: noteData.priority || 'medium',
        });
        const created = res?.data;
        if (created) {
          setScheduleNotes((prev) => ({
            ...prev,
            [dayKey]: [...(prev[dayKey] || []), created],
          }));
        }
        showToast('تمت إضافة الملاحظة بنجاح إلى جدول المواعيد!');
        return created;
      } catch (err) {
        showToast(err?.message || 'فشل إضافة الملاحظة.', 'warning');
        return null;
      }
    }

    try {
      const res = await teacherApi.schedule.createNote({
        day_of_week: dayKey,
        note_text: noteData.text,
        priority: noteData.priority || 'medium',
        note_time: noteData.time || '16:00',
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
    if (isStudentRole) {
      setScheduleNotes((prev) => ({
        ...prev,
        [dayKey]: (prev[dayKey] || []).map((n) => (n.id === noteId ? { ...n, isDone: !n.isDone } : n)),
      }));
      try {
        await studentApi.schedule.toggleNote(noteId);
      } catch (err) {
        // Revert optimistic update on failure
        setScheduleNotes((prev) => ({
          ...prev,
          [dayKey]: (prev[dayKey] || []).map((n) => (n.id === noteId ? { ...n, isDone: !n.isDone } : n)),
        }));
        showToast(err?.message || 'تعذر تحديث حالة الملحوظة.', 'warning');
      }
      return;
    }

    try {
      await teacherApi.schedule.toggleNote(noteId);
      await fetchScheduleNotes();
    } catch (err) {
      showToast(err?.message || 'تعذر تحديث الملحوظة.', 'warning');
    }
  };

  const deleteScheduleNote = async (dayKey, noteId) => {
    if (isStudentRole) {
      try {
        await studentApi.schedule.deleteNote(noteId);
        setScheduleNotes((prev) => ({
          ...prev,
          [dayKey]: (prev[dayKey] || []).filter((n) => n.id !== noteId),
        }));
        showToast('تم حذف الملاحظة بنجاح.');
      } catch (err) {
        showToast(err?.message || 'فشل حذف الملاحظة.', 'warning');
      }
      return;
    }

    try {
      await teacherApi.schedule.deleteNote(noteId);
      await fetchScheduleNotes();
      showToast('تم حذف الملاحظة بنجاح.');
    } catch (err) {
      showToast(err?.message || 'فشل حذف الملاحظة.', 'warning');
    }
  };

  // Student Study Sessions Handlers (backed by /api/v1/student/study-sessions with overlap protection)
  const addStudySession = async (session) => {
    if (isStudentRole && activeUserId) {
      try {
        const res = await studentApi.schedule.createStudySession({
          day: session.day || 'tuesday',
          subject: session.subject || 'مذاكرة عامة',
          title: session.title || 'جلسة استذكار ومراجعة',
          startTime: session.startTime || '19:00',
          endTime: session.endTime || '21:00',
          color: session.color || '#1588C7',
          notes: session.notes || '',
        });
        const created = res.data;
        setStudentStudySessions((prev) => [created, ...prev]);
        showToast(`تمت إضافة جلسة مذاكرة «${created.subject}» إلى جدولك بنجاح!`);
        return created;
      } catch (err) {
        const msg = err?.errors?.start_time?.[0] || err.message || 'فشل إضافة جلسة المذاكرة بسبب تعارض المواعيد.';
        showToast(msg, 'warning');
        throw err;
      }
    }

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

  const updateStudySession = async (id, updatedData) => {
    if (isStudentRole && activeUserId && !String(id).startsWith('study-')) {
      try {
        const res = await studentApi.schedule.updateStudySession(id, {
          day: updatedData.day,
          subject: updatedData.subject,
          title: updatedData.title,
          startTime: updatedData.startTime,
          endTime: updatedData.endTime,
          color: updatedData.color,
          notes: updatedData.notes || '',
        });
        setStudentStudySessions((prev) => prev.map((s) => (s.id === id ? res.data : s)));
        showToast('تم تحديث جلسة المذاكرة بنجاح.');
        return res.data;
      } catch (err) {
        const msg = err?.errors?.start_time?.[0] || err.message || 'فشل تحديث جلسة المذاكرة.';
        showToast(msg, 'warning');
        throw err;
      }
    }
    setStudentStudySessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    );
    showToast('تم تحديث جلسة المذاكرة بنجاح.');
    return updatedData;
  };

  const toggleStudySession = async (id) => {
    setStudentStudySessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isCompleted: !s.isCompleted } : s))
    );
    if (isStudentRole && activeUserId && !String(id).startsWith('study-')) {
      try {
        await studentApi.schedule.toggleStudySession(id);
      } catch (err) {
        setStudentStudySessions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isCompleted: !s.isCompleted } : s))
        );
        showToast(err?.message || 'تعذر تحديث حالة جلسة المذاكرة.', 'warning');
      }
    }
  };

  const deleteStudySession = async (id) => {
    if (isStudentRole && activeUserId && !String(id).startsWith('study-')) {
      try {
        await studentApi.schedule.deleteStudySession(id);
      } catch (err) {
        showToast(err?.message || 'تعذر حذف جلسة المذاكرة.', 'warning');
        return;
      }
    }
    setStudentStudySessions((prev) => prev.filter((s) => s.id !== id));
    showToast('تم حذف جلسة المذاكرة من جدولك.');
  };

  const getActiveGroup = () => {
    return groups.find((g) => g.id === activeGroupId) || groups[0] || null;
  };

  const refreshGroups = useCallback(async () => {
    await Promise.all([fetchGroups(), fetchScheduleNotes()]);
  }, [fetchGroups, fetchScheduleNotes]);

  return (
    <GroupsContext.Provider
      value={{
        groups,
        loadingGroups,
        groupsError,
        refreshGroups,
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
        studentLeaveGroup,
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
