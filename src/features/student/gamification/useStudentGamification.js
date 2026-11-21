import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { studentApi } from '../../../services/studentApi';

function getBrowserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Cairo';
  } catch {
    return 'Africa/Cairo';
  }
}

export const useStudentGamification = (lang = 'ar') => {
  const isAr = lang === 'ar';
  const requestSeqRef = useRef(0);

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadWorkspace = useCallback(
    async ({ silent = false } = {}) => {
      const seq = ++requestSeqRef.current;
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const tz = getBrowserTimezone();
        const res = await studentApi.gamification.workspace(tz);
        if (seq !== requestSeqRef.current) return null;
        const data = res?.data || {};
        setWorkspace(data);
        return data;
      } catch (err) {
        if (seq === requestSeqRef.current) {
          setError(
            err?.message ||
              (isAr
                ? 'تعذر تحميل لوحة الإنجازات حالياً، يرجى المحاولة مرة أخرى.'
                : 'Failed to load achievements workspace. Please try again.')
          );
        }
        return null;
      } finally {
        if (seq === requestSeqRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [isAr]
  );

  useEffect(() => {
    let mounted = true;
    const seq = ++requestSeqRef.current;

    const init = async () => {
      try {
        const tz = getBrowserTimezone();
        const res = await studentApi.gamification.workspace(tz);
        if (!mounted || seq !== requestSeqRef.current) return;
        setWorkspace(res?.data || {});
        setError(null);
      } catch (err) {
        if (mounted && seq === requestSeqRef.current) {
          setError(
            err?.message ||
              (isAr
                ? 'تعذر تحميل لوحة الإنجازات حالياً، يرجى المحاولة مرة أخرى.'
                : 'Failed to load achievements workspace. Please try again.')
          );
        }
      } finally {
        if (mounted && seq === requestSeqRef.current) {
          setLoading(false);
        }
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [isAr]);

  const summary = useMemo(() => workspace?.summary || null, [workspace]);

  const leagues = useMemo(
    () => (Array.isArray(workspace?.leagues) ? workspace.leagues : []),
    [workspace]
  );

  const generalLeague = useMemo(
    () => leagues.find((l) => l.category === 'general' || l.isRepublicLeague) || null,
    [leagues]
  );

  const activeTeacherLeagues = useMemo(
    () => leagues.filter((l) => l.category === 'teachers' && l.isActive !== false),
    [leagues]
  );

  const pastLeagues = useMemo(
    () => (Array.isArray(workspace?.pastLeagues) ? workspace.pastLeagues : []),
    [workspace]
  );

  const heatmap = useMemo(() => workspace?.heatmap || null, [workspace]);

  const challenges = useMemo(
    () => (Array.isArray(workspace?.challenges) ? workspace.challenges : []),
    [workspace]
  );

  const completedChallengesCount = useMemo(
    () => challenges.filter((c) => Boolean(c.isCompleted ?? c.completed)).length,
    [challenges]
  );

  const handleRefresh = useCallback(() => {
    loadWorkspace({ silent: Boolean(workspace) });
  }, [loadWorkspace, workspace]);

  return {
    summary,
    generalLeague,
    activeTeacherLeagues,
    pastLeagues,
    heatmap,
    challenges,
    completedChallengesCount,
    loading,
    refreshing,
    error,
    handleRefresh,
  };
};
