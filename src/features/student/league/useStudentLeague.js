import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { studentApi } from '../../../services/studentApi';

function mapLeaderboardEntry(s) {
  return {
    rank: Number(s.rank || 0),
    previousRank: s.previousRank !== null && s.previousRank !== undefined ? Number(s.previousRank) : null,
    rankChange: Number(s.rankChange || 0),
    movement: s.movement || 'same',
    nameAr: s.displayName || 'طالب متفوق',
    avatar: s.avatar || '',
    score: Number(s.xpPoints || 0),
    tier: s.tier || 'Bronze',
    tierLabelAr: s.tierLabelAr || 'دوري برونزي',
    badgeTitleAr: s.badgeTitleAr || 'منافس نشط',
    streak: Number(s.streakDays || 0),
    schoolAr: s.schoolAr || '',
    groupAr: s.groupAr || '',
    examsSolved: Number(s.examsSolved || 0),
    perfectExams: Number(s.perfectExams || 0),
    lessonsStudied: Number(s.lessonsStudied || 0),
    homeworkRate: Number(s.homeworkRate || 0),
    attendanceRate: Number(s.attendanceRate || 0),
    isMe: Boolean(s.isCurrentUser),
  };
}

function mapLeagueDetail(raw) {
  const lb = Array.isArray(raw?.leaderboard) ? raw.leaderboard.map(mapLeaderboardEntry) : [];
  return {
    leagueId: raw?.leagueId || '',
    category: raw?.category || 'teachers',
    isRepublicLeague: Boolean(raw?.isRepublicLeague),
    hasStarted: raw?.hasStarted !== false,
    titleAr: raw?.titleAr || '',
    courseTitleAr: raw?.courseTitleAr || '',
    groupNameAr: raw?.groupNameAr || '',
    teacherName: raw?.teacherName || '',
    durationType: raw?.durationType || 'monthly',
    durationLabelAr: raw?.durationLabelAr || '',
    isActive: raw?.isActive !== false,
    startsAt: raw?.startsAt || null,
    endsAt: raw?.endsAt || null,
    daysRemaining: Number(raw?.daysRemaining || 0),
    totalCompetitors: Number(raw?.totalCompetitors ?? lb.length),
    myStanding: raw?.myStanding || null,
    leaderboard: lb,
    rules: Array.isArray(raw?.rules) ? raw.rules : [],
    tiers: Array.isArray(raw?.tiers) ? raw.tiers : [],
    prizes: Array.isArray(raw?.prizes) ? raw.prizes : [],
  };
}

export const useStudentLeague = (lang = 'ar') => {
  const isAr = lang === 'ar';
  const [searchParams] = useSearchParams();
  const initialLeagueParam = searchParams.get('league') || '';
  const fetchedCacheRef = useRef({});
  const requestSeqRef = useRef(0);

  const [leaguesList, setLeaguesList] = useState([]);
  const [leagueCategory, setLeagueCategory] = useState('teachers'); // 'general' | 'teachers'
  const [selectedLeagueId, setSelectedLeagueId] = useState('');
  const [activeDetail, setActiveDetail] = useState(null);

  const [selectedTier, setSelectedTier] = useState('all'); // 'all' | 'Diamond' | 'Gold' | 'Silver' | 'Bronze'
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'rules' | 'prizes'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [loadingLeagues, setLoadingLeagues] = useState(true);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [error, setError] = useState(null);

  const fetchBoardForLeague = useCallback(
    async (leagueId, forceRefresh = false) => {
      if (!leagueId) return null;
      if (!forceRefresh && fetchedCacheRef.current[leagueId]) {
        setActiveDetail(fetchedCacheRef.current[leagueId]);
        return fetchedCacheRef.current[leagueId];
      }

      const seq = ++requestSeqRef.current;
      setLoadingBoard(true);
      setError(null);
      try {
        const res = await studentApi.gamification.leaderboard(leagueId);
        if (seq !== requestSeqRef.current) return null;
        const mapped = mapLeagueDetail(res?.data || {});
        fetchedCacheRef.current[leagueId] = mapped;
        setActiveDetail(mapped);
        return mapped;
      } catch (err) {
        if (seq === requestSeqRef.current) {
          setError(
            err?.message ||
              (isAr ? 'تعذر تحميل ترتيب الدوري، يرجى المحاولة مرة أخرى.' : 'Failed to load league leaderboard.')
          );
        }
        return null;
      } finally {
        if (seq === requestSeqRef.current) {
          setLoadingBoard(false);
        }
      }
    },
    [isAr]
  );

  // Initial load: fetch leagues list + initial leaderboard in one clean sequence (zero duplicate fetches)
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const res = await studentApi.gamification.leagues();
        if (!mounted) return;
        const raw = Array.isArray(res?.data) ? res.data : [];
        const mapped = raw.map((l) => ({
          id: l.id,
          category: l.category || (l.isRepublicLeague ? 'general' : 'teachers'),
          isRepublicLeague: Boolean(l.isRepublicLeague || l.id === 'general'),
          hasStarted: l.hasStarted !== false,
          titleAr: l.titleAr || '',
          courseTitleAr: l.courseTitleAr || '',
          groupNameAr: l.groupNameAr || '',
          teacherName: l.teacherName || '',
          durationType: l.durationType || 'monthly',
          durationLabelAr: l.durationLabelAr || '',
          tier: l.tier || 'Bronze',
          tierLabelAr: l.tierLabelAr || 'دوري برونزي',
          participantsCount: Number(l.participantsCount || 0),
          isActive: l.isActive !== false,
          startsAt: l.startsAt || null,
          endsAt: l.endsAt || null,
          daysRemaining: Number(l.daysRemaining || 0),
          myRank: l.myRank ? Number(l.myRank) : null,
          myXp: Number(l.myXp || 0),
          myStreak: Number(l.myStreak || 0),
          myBadgeAr: l.myBadgeAr || '',
        }));

        setLeaguesList(mapped);
        setError(null);

        const requested = initialLeagueParam
          ? mapped.find((l) => String(l.id) === String(initialLeagueParam))
          : null;
        const firstTeacher = mapped.find((l) => l.category === 'teachers');
        const initialLeague = requested || firstTeacher || mapped[0] || null;
        if (initialLeague) {
          setLeagueCategory(initialLeague.category);
          setSelectedLeagueId(initialLeague.id);

          const boardRes = await studentApi.gamification.leaderboard(initialLeague.id);
          if (!mounted) return;
          const detail = mapLeagueDetail(boardRes?.data || {});
          fetchedCacheRef.current[initialLeague.id] = detail;
          setActiveDetail(detail);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err?.message ||
              (isAr ? 'تعذر تحميل الدوريات حالياً، يرجى المحاولة مرة أخرى.' : 'Failed to load leagues.')
          );
        }
      } finally {
        if (mounted) setLoadingLeagues(false);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [initialLeagueParam, isAr]);

  const teacherLeagues = useMemo(
    () => leaguesList.filter((l) => l.category === 'teachers'),
    [leaguesList]
  );

  const generalLeague = useMemo(
    () => leaguesList.find((l) => l.category === 'general') || null,
    [leaguesList]
  );

  const handleSelectLeague = useCallback(
    (leagueId) => {
      if (!leagueId || leagueId === selectedLeagueId) return;
      setSelectedLeagueId(leagueId);
      setSelectedTier('all');
      setSearchQuery('');
      fetchBoardForLeague(leagueId, false);
    },
    [selectedLeagueId, fetchBoardForLeague]
  );

  const handleCategorySwitch = useCallback(
    (category) => {
      setLeagueCategory(category);
      setSelectedTier('all');
      setSearchQuery('');
      const target = category === 'general' ? generalLeague : teacherLeagues[0];
      if (target) {
        setSelectedLeagueId(target.id);
        fetchBoardForLeague(target.id, false);
      }
    },
    [generalLeague, teacherLeagues, fetchBoardForLeague]
  );

  const handleRefresh = useCallback(async () => {
    fetchedCacheRef.current = {};
    setError(null);
    setLoadingBoard(true);
    try {
      const res = await studentApi.gamification.leagues();
      const raw = Array.isArray(res?.data) ? res.data : [];
      const mapped = raw.map((l) => ({
        id: l.id,
        category: l.category || (l.isRepublicLeague ? 'general' : 'teachers'),
        isRepublicLeague: Boolean(l.isRepublicLeague || l.id === 'general'),
        titleAr: l.titleAr || '',
        courseTitleAr: l.courseTitleAr || '',
        groupNameAr: l.groupNameAr || '',
        teacherName: l.teacherName || '',
        durationType: l.durationType || 'monthly',
        durationLabelAr: l.durationLabelAr || '',
        tier: l.tier || 'Bronze',
        tierLabelAr: l.tierLabelAr || 'دوري برونزي',
        participantsCount: Number(l.participantsCount || 0),
        isActive: l.isActive !== false,
        startsAt: l.startsAt || null,
        endsAt: l.endsAt || null,
        daysRemaining: Number(l.daysRemaining || 0),
        myRank: l.myRank ? Number(l.myRank) : null,
        myXp: Number(l.myXp || 0),
        myStreak: Number(l.myStreak || 0),
        myBadgeAr: l.myBadgeAr || '',
      }));
      setLeaguesList(mapped);
      const activeId = selectedLeagueId || mapped[0]?.id;
      if (activeId) {
        await fetchBoardForLeague(activeId, true);
      }
    } catch (err) {
      setError(err?.message || (isAr ? 'تعذر تحديث بيانات الدوري.' : 'Failed to refresh league.'));
    } finally {
      setLoadingBoard(false);
    }
  }, [selectedLeagueId, fetchBoardForLeague, isAr]);

  const activeSummary = useMemo(
    () => leaguesList.find((l) => l.id === selectedLeagueId) || null,
    [leaguesList, selectedLeagueId]
  );

  const leaderboard = useMemo(
    () => activeDetail?.leaderboard || [],
    [activeDetail]
  );

  const tierCounts = useMemo(() => {
    const counts = { all: leaderboard.length, Diamond: 0, Gold: 0, Silver: 0, Bronze: 0 };
    leaderboard.forEach((s) => {
      if (counts[s.tier] !== undefined) counts[s.tier] += 1;
    });
    return counts;
  }, [leaderboard]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return leaderboard.filter((s) => {
      if (selectedTier !== 'all' && s.tier !== selectedTier) return false;
      if (!q) return true;
      const hay = `${s.nameAr} ${s.schoolAr} ${s.groupAr} ${s.badgeTitleAr}`.toLowerCase();
      return hay.includes(q);
    });
  }, [leaderboard, selectedTier, searchQuery]);

  const top1 = leaderboard[0] || null;
  const top2 = leaderboard[1] || null;
  const top3 = leaderboard[2] || null;

  return {
    leaguesList,
    teacherLeagues,
    generalLeague,
    leagueCategory,
    selectedLeagueId,
    activeSummary,
    activeDetail,
    leaderboard,
    filteredStudents,
    tierCounts,
    top1,
    top2,
    top3,
    selectedTier,
    setSelectedTier,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedStudent,
    setSelectedStudent,
    loadingLeagues,
    loadingBoard,
    error,
    handleSelectLeague,
    handleCategorySwitch,
    handleRefresh,
  };
};
