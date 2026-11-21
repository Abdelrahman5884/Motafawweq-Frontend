import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react';
import { useAuth } from './AuthContext';
import { tokenStorage } from '../services/api';
import { studentApi } from '../services/studentApi';
import { getClientTimezone, getLocalDateKey } from '../utils';

const HEARTBEAT_FLUSH_SECONDS = 30;
const LEADER_LEASE_MS = 8000;
const CHANNEL_NAME = 'motafawweq_student_activity_v1';

const createInitialState = (timezone) => ({
  activeSecondsToday: 0,
  streakDays: 0,
  longestStreakDays: 0,
  isActiveToday: false,
  streakWasReset: false,
  previousStreakDays: 0,
  todayDate: getLocalDateKey(),
  timezone,
  dailyGoalMinutes: 120,
  hydrated: false,
});

const StudentActivityContext = createContext(null);

export const StudentActivityProvider = ({ children }) => {
  const { isAuthenticated, authLoading, currentRole, currentUser } = useAuth();
  const timezone = useMemo(() => getClientTimezone(), []);

  const hasToken = Boolean(tokenStorage.getAccessToken());
  const isStudentActive = Boolean(
    !authLoading &&
    isAuthenticated &&
    hasToken &&
    currentRole === 'student' &&
    currentUser?.id &&
    currentUser?.email_verified !== false
  );
  const userKey = isStudentActive ? String(currentUser.id) : '';

  const [activity, setActivity] = useState(() => createInitialState(timezone));
  const [isTracking, setIsTracking] = useState(false);
  const [dayRolloverCount, setDayRolloverCount] = useState(0);

  const tabIdRef = useRef('');
  const pendingSecondsRef = useRef(0);
  const lastTickMsRef = useRef(0);
  const inFlightRef = useRef(false);
  const todayDateRef = useRef('');
  const activeSecondsRef = useRef(0);
  const channelRef = useRef(null);
  const hiddenSinceRef = useRef(null);

  const getTabId = useCallback(() => {
    if (!tabIdRef.current) {
      tabIdRef.current = `tab_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    }
    return tabIdRef.current;
  }, []);

  const leaderStorageKey = userKey ? `mtfq_act_leader_${userKey}` : '';

  const broadcastMessage = useCallback((payload) => {
    try {
      channelRef.current?.postMessage(payload);
    } catch {
      // BroadcastChannel may be closed or unsupported
    }
  }, []);

  const applyServerSnapshot = useCallback((snapshot, { fromBroadcast = false, authoritative = false } = {}) => {
    if (!snapshot || typeof snapshot !== 'object') return;

    const serverDate = snapshot.todayDate || getLocalDateKey();
    const serverSeconds = Math.max(0, Number(snapshot.activeSecondsToday ?? snapshot.studySecondsToday ?? 0));
    const dateChanged = Boolean(todayDateRef.current && serverDate !== todayDateRef.current);

    if (dateChanged) {
      todayDateRef.current = serverDate;
      pendingSecondsRef.current = 0;
      activeSecondsRef.current = serverSeconds;
      setDayRolloverCount((c) => c + 1);
    } else {
      todayDateRef.current = serverDate;
      const candidateSeconds = serverSeconds + pendingSecondsRef.current;
      activeSecondsRef.current = authoritative
        ? candidateSeconds
        : Math.max(activeSecondsRef.current, candidateSeconds);
    }

    setActivity((prev) => {
      const sameDay = !dateChanged && prev.todayDate === serverDate;
      const nextStreakWasReset = sameDay
        ? (prev.streakWasReset || Boolean(snapshot.streakWasReset))
        : Boolean(snapshot.streakWasReset);
      const nextPreviousStreak = nextStreakWasReset
        ? (prev.streakWasReset && sameDay ? prev.previousStreakDays : Number(snapshot.previousStreakDays ?? prev.previousStreakDays ?? 0))
        : Number(snapshot.streakDays ?? prev.streakDays ?? 0);

      return {
        ...prev,
        activeSecondsToday: activeSecondsRef.current,
        streakDays: Number(snapshot.streakDays ?? prev.streakDays ?? 0),
        longestStreakDays: Math.max(
          Number(snapshot.longestStreakDays ?? 0),
          Number(snapshot.streakDays ?? 0)
        ),
        isActiveToday: Boolean(snapshot.isActiveToday ?? true),
        streakWasReset: nextStreakWasReset,
        previousStreakDays: nextPreviousStreak,
        todayDate: serverDate,
        timezone: snapshot.timezone || prev.timezone || timezone,
        dailyGoalMinutes: Number(snapshot.dailyGoalMinutes ?? prev.dailyGoalMinutes ?? 120),
        hydrated: true,
      };
    });

    if (!fromBroadcast && userKey) {
      broadcastMessage({
        type: 'ACTIVITY_SYNC',
        userKey,
        snapshot,
      });
    }
  }, [broadcastMessage, timezone, userKey]);

  const claimOrRenewLeader = useCallback(() => {
    if (!leaderStorageKey || typeof document === 'undefined' || document.visibilityState !== 'visible') {
      return false;
    }
    const myTabId = getTabId();
    const now = Date.now();
    try {
      const raw = localStorage.getItem(leaderStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.tabId && parsed.tabId !== myTabId && Number(parsed.expiresAt || 0) > now) {
          return false;
        }
      }
      localStorage.setItem(
        leaderStorageKey,
        JSON.stringify({ tabId: myTabId, expiresAt: now + LEADER_LEASE_MS })
      );
      return true;
    } catch {
      return true;
    }
  }, [leaderStorageKey, getTabId]);

  const releaseLeader = useCallback(() => {
    if (!leaderStorageKey) return;
    const myTabId = getTabId();
    try {
      const raw = localStorage.getItem(leaderStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.tabId === myTabId) {
          localStorage.removeItem(leaderStorageKey);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, [leaderStorageKey, getTabId]);

  const flushHeartbeat = useCallback(async ({ isCheckIn = false, keepalive = false } = {}) => {
    if (!isStudentActive || !tokenStorage.getAccessToken()) return null;

    const deltaToSend = Math.min(90, Math.max(0, Math.floor(pendingSecondsRef.current)));
    if (deltaToSend === 0 && !isCheckIn) return null;
    if (inFlightRef.current && !keepalive) return null;

    pendingSecondsRef.current = Math.max(0, pendingSecondsRef.current - deltaToSend);
    if (!keepalive) {
      inFlightRef.current = true;
    }

    try {
      const res = await studentApi.activity.heartbeat(
        {
          delta_seconds: deltaToSend,
          timezone,
          is_check_in: isCheckIn,
        },
        { keepalive }
      );

      if (res?.data && !keepalive) {
        applyServerSnapshot(res.data, { authoritative: deltaToSend > 0 });
        return res.data;
      }
      return res?.data || null;
    } catch {
      // Preserve unsynced seconds on transient error (capped to avoid burst)
      if (!keepalive && deltaToSend > 0) {
        pendingSecondsRef.current = Math.min(90, pendingSecondsRef.current + deltaToSend);
      }
      return null;
    } finally {
      if (!keepalive) {
        inFlightRef.current = false;
      }
    }
  }, [isStudentActive, timezone, applyServerSnapshot]);

  // Manage active student session tracking, multi-tab sync, and server heartbeats
  useEffect(() => {
    if (!userKey) {
      pendingSecondsRef.current = 0;
      activeSecondsRef.current = 0;
      todayDateRef.current = getLocalDateKey();
      return undefined;
    }

    let cancelled = false;
    pendingSecondsRef.current = 0;
    lastTickMsRef.current = Date.now();
    todayDateRef.current = getLocalDateKey();
    getTabId();

    // Multi-tab BroadcastChannel setup
    let channel = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        channel = new BroadcastChannel(CHANNEL_NAME);
        channelRef.current = channel;
        channel.onmessage = (event) => {
          const msg = event?.data;
          if (!msg || msg.userKey !== userKey) return;

          if (msg.type === 'ACTIVITY_SYNC' && msg.snapshot) {
            applyServerSnapshot(msg.snapshot, { fromBroadcast: true });
          } else if (msg.type === 'ACTIVITY_TICK' && typeof msg.activeSecondsToday === 'number') {
            if (msg.todayDate === todayDateRef.current) {
              activeSecondsRef.current = msg.activeSecondsToday;
              setActivity((prev) => ({
                ...prev,
                activeSecondsToday: msg.activeSecondsToday,
              }));
            }
          }
        };
      } catch {
        channelRef.current = null;
      }
    }

    // Immediate daily check-in so streak & today's active seconds hydrate right away
    const initCheckIn = async () => {
      if (cancelled) return;
      if (typeof document !== 'undefined') {
        setIsTracking(document.visibilityState === 'visible');
      }
      await flushHeartbeat({ isCheckIn: true });
    };
    initCheckIn();

    // 1-second monotonic wall-clock ticker while tab is visible
    const intervalId = window.setInterval(() => {
      if (cancelled) return;
      if (typeof document === 'undefined' || document.visibilityState !== 'visible') {
        setIsTracking(false);
        return;
      }

      setIsTracking(true);
      const now = Date.now();
      const localDay = getLocalDateKey(new Date(now));

      // Handle midnight day rollover cleanly while the tab stays open
      if (todayDateRef.current && localDay !== todayDateRef.current) {
        const isLeader = claimOrRenewLeader();
        lastTickMsRef.current = now;
        if (isLeader) {
          flushHeartbeat({ isCheckIn: true });
        }
        return;
      }

      const elapsed = Math.floor((now - lastTickMsRef.current) / 1000);
      if (elapsed < 1) return;

      // Guard against laptop sleep / OS suspension jumps (> 5s in a 1s interval)
      const step = elapsed > 5 ? 1 : elapsed;
      lastTickMsRef.current = elapsed > 5 ? now : lastTickMsRef.current + elapsed * 1000;

      const isLeader = claimOrRenewLeader();
      if (!isLeader) {
        return;
      }

      pendingSecondsRef.current += step;
      activeSecondsRef.current += step;
      const nextSeconds = activeSecondsRef.current;

      setActivity((prev) => ({
        ...prev,
        activeSecondsToday: nextSeconds,
      }));

      broadcastMessage({
        type: 'ACTIVITY_TICK',
        userKey,
        activeSecondsToday: nextSeconds,
        todayDate: todayDateRef.current,
      });

      if (pendingSecondsRef.current >= HEARTBEAT_FLUSH_SECONDS) {
        flushHeartbeat({ isCheckIn: false });
      }
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hiddenSinceRef.current = Date.now();
        setIsTracking(false);
        flushHeartbeat({ isCheckIn: false, keepalive: true });
        releaseLeader();
      } else {
        const hiddenMs = hiddenSinceRef.current ? Date.now() - hiddenSinceRef.current : 0;
        hiddenSinceRef.current = null;
        lastTickMsRef.current = Date.now();
        setIsTracking(true);

        const localDay = getLocalDateKey();
        if (hiddenMs > 30000 || (todayDateRef.current && localDay !== todayDateRef.current)) {
          flushHeartbeat({ isCheckIn: true });
        }
      }
    };

    const handlePageHide = () => {
      flushHeartbeat({ isCheckIn: false, keepalive: true });
      releaseLeader();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      if (pendingSecondsRef.current > 0 && tokenStorage.getAccessToken()) {
        flushHeartbeat({ isCheckIn: false, keepalive: true });
      }
      releaseLeader();
      try {
        channel?.close();
      } catch {
        // ignore
      }
      channelRef.current = null;
    };
  }, [
    userKey,
    timezone,
    getTabId,
    applyServerSnapshot,
    broadcastMessage,
    claimOrRenewLeader,
    releaseLeader,
    flushHeartbeat
  ]);

  const updateDailyGoalMinutes = useCallback((minutes) => {
    const parsed = Number(minutes);
    if (!Number.isFinite(parsed) || parsed < 15) return;
    setActivity((prev) => ({
      ...prev,
      dailyGoalMinutes: parsed,
    }));
  }, []);

  const value = useMemo(() => {
    const effectiveActivity = isStudentActive ? activity : createInitialState(timezone);
    return {
      ...effectiveActivity,
      activeMinutesToday: Math.floor(Number(effectiveActivity.activeSecondsToday || 0) / 60),
      isTracking: isStudentActive && isTracking,
      dayRolloverCount: isStudentActive ? dayRolloverCount : 0,
      syncFromServerSnapshot: applyServerSnapshot,
      updateDailyGoalMinutes,
      flushNow: () => flushHeartbeat({ isCheckIn: false }),
    };
  }, [activity, timezone, isStudentActive, isTracking, dayRolloverCount, applyServerSnapshot, updateDailyGoalMinutes, flushHeartbeat]);

  return (
    <StudentActivityContext.Provider value={value}>
      {children}
    </StudentActivityContext.Provider>
  );
};

export const useStudentActivity = () => {
  const ctx = useContext(StudentActivityContext);
  if (!ctx) {
    return {
      ...createInitialState(getClientTimezone()),
      activeMinutesToday: 0,
      isTracking: false,
      dayRolloverCount: 0,
      syncFromServerSnapshot: () => {},
      updateDailyGoalMinutes: () => {},
      flushNow: async () => null,
    };
  }
  return ctx;
};
