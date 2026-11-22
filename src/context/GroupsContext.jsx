import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { tokenStorage } from '../services/api';
import { teacherApi } from '../services/teacherApi';
import { studentApi } from '../services/studentApi';
import { extractGroupJoinCode } from '../utils';
import { useAuth } from './AuthContext';
import { hasTeacherFeatureAccess } from '../constants/teacherPlanFeatures';

// Retained for backwards compatibility with legacy consumers
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
  const { currentUser, isAuthenticated, authLoading, teacherPlanTier } = useAuth();
  const hasToken = Boolean(tokenStorage.getAccessToken());
  const isStudentRole = currentUser?.role === 'student';
  const isTeacherRole = currentUser?.role === 'teacher';
  const canUseTeacherSchedule = isTeacherRole && hasTeacherFeatureAccess(teacherPlanTier, 'schedule');
  const activeUserId = isAuthenticated && hasToken && currentUser?.id ? String(currentUser.id) : '';
  const studySessionsStorageKey = activeUserId ? `motafawweq_student_study_sessions_${activeUserId}` : '';

  const [groups, setGroups] = useState([]);
  const [groupsMeta, setGroupsMeta] = useState(null);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [groupsError, setGroupsError] = useState(null);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [scheduleError, setScheduleError] = useState(null);

  // Enrolled and pending students keyed by group id/uuid
  const [enrolledStudents, setEnrolledStudents] = useState({});
  const [pendingStudents, setPendingStudents] = useState({});
  const [rosterStats, setRosterStats] = useState({});
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [rosterError, setRosterError] = useState(null);
  const rosterRequestSeqRef = useRef(0);

  // Active group for Student Roster view
  const [activeGroupId, setActiveGroupId] = useState('');

  // Schedule Notes per day
  const [scheduleNotes, setScheduleNotes] = useState(() => ({ ...EMPTY_NOTES_MAP }));

  // Student Study Sessions (Self-Study slots)
  const [studentStudySessions, setStudentStudySessions] = useState([]);

  // Global toast message notification
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ message, type });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3500);
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
            joinMethod: g.joinMethod || g.join_method || 'join_code',
            joinMethodLabelAr: g.joinMethodLabelAr || '',
            isTeacherInvite: Boolean(
              g.isTeacherInvite || (status === 'pending' && (g.joinMethod || g.join_method) === 'teacher_invite')
            ),
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
      if (res?.meta) {
        setGroupsMeta(res.meta);
      }
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

  // Fetch Roster for active group (Teacher only) with stale-request guard and optional session date
  const fetchGroupRoster = useCallback(async (groupId, date = null) => {
    if (authLoading || !groupId || !isTeacherRole || !activeUserId) return;
    const seq = ++rosterRequestSeqRef.current;
    setLoadingRoster(true);
    setRosterError(null);
    try {
      const res = await teacherApi.roster.list(groupId, date ? { date } : {});
      if (seq !== rosterRequestSeqRef.current) return;
      if (res?.data) {
        const enrolled = Array.isArray(res.data.enrolled) ? res.data.enrolled : [];
        const pending = Array.isArray(res.data.pending) ? res.data.pending : [];
        const stats = res.data.stats && typeof res.data.stats === 'object' ? res.data.stats : null;
        setEnrolledStudents((prev) => ({ ...prev, [groupId]: enrolled }));
        setPendingStudents((prev) => ({ ...prev, [groupId]: pending }));
        if (stats) {
          setRosterStats((prev) => ({ ...prev, [groupId]: stats }));
        }
        setGroups((prev) =>
          prev.map((g) =>
            g.id === groupId
              ? { ...g, enrolledCount: enrolled.length, pendingCount: pending.length }
              : g
          )
        );
      }
    } catch (err) {
      if (seq !== rosterRequestSeqRef.current) return;
      setRosterError(err?.message || 'تعذر تحميل سجل طلاب المجموعة.');
    } finally {
      if (seq === rosterRequestSeqRef.current) {
        setLoadingRoster(false);
      }
    }
  }, [authLoading, isTeacherRole, activeUserId]);

  // Fetch Schedule Notes & Student Personal Study Sessions
  const fetchScheduleNotes = useCallback(async () => {
    if (authLoading) return;
    if (!activeUserId || (!isStudentRole && !isTeacherRole)) {
      setScheduleNotes({ ...EMPTY_NOTES_MAP });
      setStudentStudySessions([]);
      setScheduleError(null);
      setLoadingSchedule(false);
      return;
    }

    setLoadingSchedule(true);
    setScheduleError(null);
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

      if (isTeacherRole && !canUseTeacherSchedule) {
        setScheduleNotes({ ...EMPTY_NOTES_MAP });
        setScheduleError(null);
        setLoadingSchedule(false);
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
    } catch (err) {
      setScheduleError(err?.message || 'تعذر تحميل بيانات الجدول الأسبوعي.');
      // Fallback to user-scoped local cache if offline
      if (isStudentRole && studySessionsStorageKey) {
        try {
          const cached = localStorage.getItem(studySessionsStorageKey);
          if (cached) setStudentStudySessions(JSON.parse(cached) || []);
        } catch {
          // ignore
        }
      }
    } finally {
      setLoadingSchedule(false);
    }
  }, [authLoading, activeUserId, isStudentRole, isTeacherRole, canUseTeacherSchedule, studySessionsStorageKey]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      fetchGroups();
      fetchScheduleNotes();
    });
    return () => {
      cancelled = true;
    };
  }, [fetchGroups, fetchScheduleNotes]);

  useEffect(() => {
    if (!activeGroupId || !isTeacherRole) return undefined;
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      fetchGroupRoster(activeGroupId);
    });
    return () => {
      cancelled = true;
    };
  }, [activeGroupId, isTeacherRole, fetchGroupRoster]);

  useEffect(() => {
    if (!studySessionsStorageKey || !isStudentRole) return;
    try {
      localStorage.setItem(studySessionsStorageKey, JSON.stringify(studentStudySessions));
    } catch {
      // ignore storage errors
    }
  }, [studentStudySessions, studySessionsStorageKey, isStudentRole]);

  // Helper to normalize server study group payload consistently
  const normalizeTeacherGroup = useCallback((g, fallback = {}) => {
    const incomingSlots = g?.scheduleSlots || g?.schedule_slots;
    const rawSlots = Array.isArray(incomingSlots) && incomingSlots.length > 0
      ? incomingSlots.map((s) => {
          const dayKey = String(s.day || s.day_of_week || '').toLowerCase();
          const meta = DAY_LABELS[dayKey] || { ar: dayKey, en: dayKey };
          return {
            id: s.id || `slot-${dayKey}-${s.startTime || s.start_time || ''}`,
            day: dayKey,
            dayAr: s.dayAr || meta.ar,
            dayEn: s.dayEn || meta.en,
            startTime: s.startTime || s.start_time || '16:00',
            endTime: s.endTime || s.end_time || '18:00',
            hall: s.hall || s.hall_name || g.hallName || g.hall_name || fallback.hallName || 'القاعة الرئيسية',
          };
        })
      : (Array.isArray(fallback.scheduleSlots) && fallback.scheduleSlots.length > 0
        ? fallback.scheduleSlots
        : parseScheduleSlots(g?.scheduleAr || g?.schedule_ar || fallback.scheduleAr, g?.hallName || g?.hall_name || fallback.hallName));

    const rawPrice = g?.priceEgp ?? g?.price_egp ?? fallback.priceEgp ?? 0;
    const numericPrice = !Number.isNaN(Number(rawPrice)) ? Number(rawPrice) : 0;

    return {
      id: g?.id || g?.uuid || fallback.id,
      uuid: g?.uuid || g?.id || fallback.uuid || fallback.id,
      nameAr: g?.nameAr || g?.name_ar || fallback.nameAr || 'مجموعة دراسية',
      nameEn: g?.nameEn || g?.name_en || g?.nameAr || g?.name_ar || fallback.nameEn || fallback.nameAr || '',
      subjectAr: g?.subjectAr || g?.subject_ar || fallback.subjectAr || 'المادة الدراسية',
      subjectEn: g?.subjectEn || g?.subject_en || g?.subjectAr || g?.subject_ar || fallback.subjectEn || fallback.subjectAr || '',
      gradeAr: g?.gradeAr || g?.grade_ar || fallback.gradeAr || 'الصف الثالث الثانوي',
      gradeEn: g?.gradeEn || g?.grade_en || g?.gradeAr || g?.grade_ar || fallback.gradeEn || fallback.gradeAr || '',
      scheduleAr: g?.scheduleAr || g?.schedule_ar || fallback.scheduleAr || '',
      scheduleEn: g?.scheduleEn || g?.schedule_en || g?.scheduleAr || g?.schedule_ar || fallback.scheduleEn || fallback.scheduleAr || '',
      centerName: g?.centerName || g?.center_name || fallback.centerName || '',
      hallName: g?.hallName || g?.hall_name || fallback.hallName || 'القاعة الرئيسية',
      priceEgp: numericPrice,
      joinCode: String(g?.joinCode || g?.join_code || fallback.joinCode || '').trim().toUpperCase(),
      maxStudents: Number(g?.maxStudents ?? g?.max_students ?? fallback.maxStudents) || 50,
      enrolledCount: Number(g?.enrolledCount ?? g?.enrolled_count ?? fallback.enrolledCount) || 0,
      pendingCount: Number(g?.pendingCount ?? g?.pending_count ?? fallback.pendingCount) || 0,
      status: g?.status || fallback.status || 'active',
      scheduleSlots: rawSlots,
    };
  }, []);

  // Add new study group
  const addGroup = async (groupData) => {
    const slots =
      Array.isArray(groupData.scheduleSlots) && groupData.scheduleSlots.length > 0
        ? groupData.scheduleSlots
        : Array.isArray(groupData.slots) && groupData.slots.length > 0
        ? groupData.slots
        : parseScheduleSlots(groupData.scheduleAr, groupData.hallName || 'القاعة الرئيسية');

    try {
      const cleanCustomCode = String(groupData.joinCode || '').trim().toUpperCase();
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
        ...(cleanCustomCode ? { join_code: cleanCustomCode } : {}),
        slots: slots.map((s) => ({
          day_of_week: s.day,
          start_time: s.startTime || '16:00',
          end_time: s.endTime || '18:00',
          hall_name: s.hall || groupData.hallName || 'القاعة الرئيسية',
        })),
      };

      const res = await teacherApi.groups.create(payload);
      const createdObj = normalizeTeacherGroup(res?.data || {}, { ...groupData, scheduleSlots: slots });

      setGroups((prev) => [createdObj, ...prev]);
      setActiveGroupId(createdObj.id);
      showToast('تم إنشاء المجموعة وإضافتها بنجاح!');
      return createdObj;
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      showToast(firstErr || err?.message || 'فشل إنشاء المجموعة.', 'warning');
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
        name_en: updatedData.nameEn || updatedData.nameAr || existing?.nameEn,
        subject_ar: updatedData.subjectAr || existing?.subjectAr,
        grade_ar: updatedData.gradeAr || existing?.gradeAr,
        center_name: updatedData.centerName || existing?.centerName,
        hall_name: updatedData.hallName || existing?.hallName,
        price_egp: updatedData.priceEgp !== undefined && updatedData.priceEgp !== '' && !isNaN(Number(updatedData.priceEgp))
          ? Number(updatedData.priceEgp)
          : (existing?.priceEgp ?? 0),
        max_students: Number(updatedData.maxStudents) || existing?.maxStudents || 50,
        schedule_ar: updatedData.scheduleAr || existing?.scheduleAr,
        slots: slots.map((s) => ({
          day_of_week: s.day,
          start_time: s.startTime || '16:00',
          end_time: s.endTime || '18:00',
          hall_name: s.hall || updatedData.hallName || existing?.hallName || 'القاعة الرئيسية',
        })),
      };

      const res = await teacherApi.groups.update(groupId, payload);
      const updatedObj = normalizeTeacherGroup(res?.data || {}, { ...existing, ...updatedData, scheduleSlots: slots });

      setGroups((prev) => prev.map((g) => (g.id === groupId ? updatedObj : g)));
      showToast('تم حفظ تعديلات المجموعة بنجاح!');
      return updatedObj;
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      showToast(firstErr || err?.message || 'فشل تحديث بيانات المجموعة.', 'warning');
      throw err;
    }
  };

  // Regenerate study group join code (Anti-leakage)
  const regenerateGroupJoinCode = async (groupId) => {
    try {
      const res = await teacherApi.groups.regenerateCode(groupId);
      const existing = groups.find((g) => g.id === groupId) || {};
      const updatedObj = normalizeTeacherGroup(res?.data || {}, existing);
      setGroups((prev) => prev.map((g) => (g.id === groupId ? updatedObj : g)));
      showToast(`تم تجديد كود الانضمام للمجموعة: ${updatedObj.joinCode}`);
      return { success: true, group: updatedObj };
    } catch (err) {
      const msg = err?.message || 'تعذر تجديد كود الانضمام حالياً.';
      showToast(msg, 'warning');
      return { success: false, error: msg };
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
      setRosterStats((prev) => {
        const copy = { ...prev };
        delete copy[groupId];
        return copy;
      });
      if (activeGroupId === groupId) {
        const remaining = groups.filter((g) => g.id !== groupId);
        setActiveGroupId(remaining.length > 0 ? remaining[0].id : '');
      }
      showToast('تم حذف المجموعة وسجلها بنجاح!');
      return { success: true };
    } catch (err) {
      const msg = err?.message || 'فشل حذف المجموعة.';
      showToast(msg, 'warning');
      return { success: false, error: msg };
    }
  };

  // Accept pending student enrollment
  const acceptPendingStudent = async (groupId, pendingId) => {
    try {
      await teacherApi.roster.accept(groupId, pendingId);
      await fetchGroupRoster(groupId);
      showToast('تم قبول الطالب بنجاح وإضافته لقائمة المقيدين!');
      return { success: true };
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      const msg = firstErr || err?.message || 'فشل قبول الطالب.';
      showToast(msg, 'warning');
      return { success: false, error: msg };
    }
  };

  // Reject pending student enrollment or cancel a teacher-sent invitation
  const rejectPendingStudent = async (groupId, pendingId, reason = '', { isInviteCancel = false } = {}) => {
    try {
      await teacherApi.roster.reject(groupId, pendingId, reason);
      await fetchGroupRoster(groupId);
      showToast(
        isInviteCancel ? 'تم إلغاء الدعوة المرسلة للطالب.' : 'تم رفض طلب الانضمام.',
        'warning'
      );
      return { success: true };
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      const msg = firstErr || err?.message || (isInviteCancel ? 'فشل إلغاء الدعوة.' : 'فشل رفض الطالب.');
      showToast(msg, 'warning');
      return { success: false, error: msg };
    }
  };

  // Remove enrolled student from group
  const removeStudentFromGroup = async (groupId, enrollmentUuid) => {
    try {
      await teacherApi.roster.remove(groupId, enrollmentUuid);
      await fetchGroupRoster(groupId);
      showToast('تم إلغاء قيد الطالب من هذه المجموعة.');
      return { success: true };
    } catch (err) {
      const msg = err?.message || 'فشل إلغاء قيد الطالب.';
      showToast(msg, 'warning');
      return { success: false, error: msg };
    }
  };

  // Invite student directly by teacher search or manual registration
  const inviteStudentToGroup = async (groupId, studentOrPayload) => {
    try {
      let body;
      if (studentOrPayload && typeof studentOrPayload === 'object') {
        if (studentOrPayload.id && !studentOrPayload.name_ar) {
          body = {
            student_id: String(studentOrPayload.id),
            parent_name_ar: studentOrPayload.parentNameAr || undefined,
            parent_phone: studentOrPayload.parentPhone || undefined,
          };
        } else {
          body = studentOrPayload;
        }
      } else {
        body = { student_id: String(studentOrPayload ?? '') };
      }

      await teacherApi.roster.invite(groupId, body);
      await fetchGroupRoster(groupId);
      showToast('تم إرسال دعوة الانضمام للطالب بنجاح! بانتظار قبول الطالب من حسابه.');
      return { success: true };
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      const msg = firstErr || err?.message || 'فشل إرسال الدعوة للطالب.';
      showToast(msg, 'warning');
      return { success: false, error: msg };
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

  // Student accepts a teacher-initiated group invitation
  const studentAcceptInvitation = async (enrollmentUuid) => {
    if (!enrollmentUuid) return { success: false, error: 'معرف الدعوة غير صالح.' };
    try {
      const res = await studentApi.groups.acceptInvitation(enrollmentUuid);
      await Promise.all([fetchGroups(), fetchScheduleNotes()]);
      const msg = res?.message || 'تم قبول دعوة الانضمام للمجموعة بنجاح!';
      showToast(msg);
      return { success: true, message: msg, data: res?.data };
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      const errMsg = firstErr || err?.message || 'تعذر قبول الدعوة حالياً.';
      showToast(errMsg, 'warning');
      return { success: false, error: errMsg };
    }
  };

  // Student declines a teacher-initiated group invitation
  const studentDeclineInvitation = async (enrollmentUuid) => {
    if (!enrollmentUuid) return { success: false, error: 'معرف الدعوة غير صالح.' };
    try {
      const res = await studentApi.groups.declineInvitation(enrollmentUuid);
      await Promise.all([fetchGroups(), fetchScheduleNotes()]);
      const msg = res?.message || 'تم رفض دعوة الانضمام للمجموعة.';
      showToast(msg, 'warning');
      return { success: true, message: msg, data: res?.data };
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      const errMsg = firstErr || err?.message || 'تعذر رفض الدعوة حالياً.';
      showToast(errMsg, 'warning');
      return { success: false, error: errMsg };
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

  // Direct manual toggle or explicit set of attendance (present / absent / late / excused)
  const toggleStudentAttendance = async (groupId, enrollmentId, targetStatus = null, date = null) => {
    try {
      const res = await teacherApi.attendance.toggleManual(groupId, {
        enrollment_id: String(enrollmentId),
        ...(targetStatus ? { status: targetStatus } : {}),
        ...(date ? { date } : {}),
      });
      await fetchGroupRoster(groupId, date);
      const finalStatus = res?.data?.status || targetStatus;
      const studentName = res?.data?.nameAr || '';
      if (finalStatus === 'absent') {
        showToast(studentName ? `تم تسجيل غياب الطالب: ${studentName}` : 'تم تسجيل غياب الطالب.', 'warning');
      } else {
        showToast(studentName ? `تم تسجيل حضور الطالب: ${studentName}` : 'تم تسجيل حضور الطالب بنجاح!');
      }
      return { success: true, record: res?.data };
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      const msg = firstErr || err?.message || 'فشل تحديث حالة الحضور.';
      showToast(msg, 'warning');
      return { success: false, error: msg };
    }
  };

  // Record student attendance by Barcode, PIN Passcode, Student Code, or Phone
  const recordStudentAttendanceByCode = async (groupId, code, date = null) => {
    const rawCode = String(code || '').trim();
    if (!rawCode) {
      return { success: false, message: 'يرجى إدخال كود الطالب أو مسح الباركود.' };
    }

    try {
      const res = await teacherApi.attendance.scan(groupId, rawCode, 'barcode_input', date);
      await fetchGroupRoster(groupId, date);
      const alreadyRecorded = Boolean(res?.data?.alreadyRecorded);
      const record = res?.data?.record || null;
      const studentName = record?.nameAr || '';
      const msg = alreadyRecorded
        ? (studentName ? `الطالب «${studentName}» مسجل حضوره بالفعل في هذه الحصة.` : 'الطالب مسجل حضوره بالفعل.')
        : (studentName ? `تم تسجيل حضور الطالب «${studentName}» بنجاح!` : 'تم تسجيل الحضور بنجاح!');
      showToast(msg, alreadyRecorded ? 'warning' : 'success');
      return {
        success: true,
        alreadyRecorded,
        record,
        session: res?.data?.session || null,
        message: msg,
      };
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      const msg = firstErr || err?.message || 'لم يتم العثور على طالب مطابق لهذا الكود في المجموعة.';
      showToast(msg, 'warning');
      return { success: false, message: msg };
    }
  };

  // Schedule Notes CRUD (Teacher API + Student API)
  const addScheduleNote = async (dayKey, noteData) => {
    if (isStudentRole) {
      try {
        const res = await studentApi.schedule.createNote({
          day_of_week: dayKey,
          text: noteData.text,
          time: noteData.time ? noteData.time : null,
          priority: noteData.priority || 'medium',
        });
        const created = res?.data;
        if (created) {
          const targetDay = created.day || dayKey;
          setScheduleNotes((prev) => ({
            ...prev,
            [targetDay]: [...(prev[targetDay] || []), created],
          }));
        }
        showToast('تمت إضافة الملحوظة بنجاح إلى جدول المواعيد!');
        return created;
      } catch (err) {
        const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
        showToast(firstErr || err?.message || 'فشل إضافة الملحوظة.', 'warning');
        throw err;
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
      showToast('تمت إضافة الملحوظة بنجاح إلى جدول المواعيد!');
      return res.data;
    } catch (err) {
      console.error('Failed to add schedule note:', err);
      showToast(err.message || 'فشل إضافة الملحوظة.', 'warning');
      throw err;
    }
  };

  const updateScheduleNote = async (previousDayKey, noteId, noteData) => {
    if (isStudentRole) {
      try {
        const targetDay = noteData.day || previousDayKey;
        const res = await studentApi.schedule.updateNote(noteId, {
          day_of_week: targetDay,
          text: noteData.text,
          time: noteData.time ? noteData.time : null,
          priority: noteData.priority || 'medium',
        });
        const updated = res?.data;
        if (updated) {
          const newDay = updated.day || targetDay;
          setScheduleNotes((prev) => {
            const next = { ...prev };
            if (newDay === previousDayKey) {
              next[newDay] = (prev[newDay] || []).map((n) => (n.id === noteId ? updated : n));
            } else {
              next[previousDayKey] = (prev[previousDayKey] || []).filter((n) => n.id !== noteId);
              next[newDay] = [...(prev[newDay] || []), updated];
            }
            return next;
          });
        }
        showToast('تم تحديث الملحوظة بنجاح.');
        return updated;
      } catch (err) {
        const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
        showToast(firstErr || err?.message || 'تعذر تحديث الملحوظة.', 'warning');
        throw err;
      }
    }
    return null;
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
        groupsMeta,
        loadingGroups,
        groupsError,
        loadingSchedule,
        scheduleError,
        refreshGroups,
        activeGroupId,
        setActiveGroupId,
        getActiveGroup,
        addGroup,
        updateGroup,
        regenerateGroupJoinCode,
        deleteGroup,
        enrolledStudents,
        pendingStudents,
        rosterStats,
        loadingRoster,
        rosterError,
        fetchGroupRoster,
        acceptPendingStudent,
        rejectPendingStudent,
        removeStudentFromGroup,
        inviteStudentToGroup,
        studentJoinByCode,
        studentAcceptInvitation,
        studentDeclineInvitation,
        studentLeaveGroup,
        toggleStudentAttendance,
        recordStudentAttendanceByCode,
        scheduleNotes,
        addScheduleNote,
        updateScheduleNote,
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
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 100000,
            maxWidth: 'min(92vw, 420px)',
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
            lineHeight: 1.5,
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
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
