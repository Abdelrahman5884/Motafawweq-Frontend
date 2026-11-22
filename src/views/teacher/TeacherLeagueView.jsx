import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Crown,
  Award,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { teacherApi } from '../../services/teacherApi';
import {
  normalizeLeagueItem,
  LeagueSwitcherBar,
  LeaguePodium,
  LeagueScoringRulesCard,
  LeagueLeaderboardTable,
  StartLeagueModal,
  EditLeagueModal,
  AddParticipantModal,
  AwardXpModal,
  StudentLeagueDetailModal,
  ConfirmActionModal,
} from '../../features/teacher/league';

export const TeacherLeagueView = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';

  // Responsive breakpoint (only updates on breakpoint crossing)
  const [isMobile, setIsMobile] = useState(
    () => (typeof window !== 'undefined' ? window.matchMedia('(max-width: 639px)').matches : false)
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Core data state
  const [leaguesMap, setLeaguesMap] = useState({});
  const [activeLeagueKey, setActiveLeagueKey] = useState('');
  const [coursesList, setCoursesList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadTick, setReloadTick] = useState(0);
  const [failedDetailsKey, setFailedDetailsKey] = useState('');
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Track which league IDs have already been fetched (prevents infinite fetch loop on 0-participant leagues!)
  const fetchedDetailsRef = useRef(new Set());
  const noticeTimerRef = useRef(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');

  // Modals & Toast Notice
  const [showStartModal, setShowStartModal] = useState(false);
  const [leagueToEdit, setLeagueToEdit] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [awardXpStudent, setAwardXpStudent] = useState(null);
  const [leagueToDelete, setLeagueToDelete] = useState(null);
  const [participantToRemove, setParticipantToRemove] = useState(null);
  const [notice, setNotice] = useState(null);

  const showToast = useCallback((title, desc, type = 'success') => {
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setNotice({ title, desc, type });
    noticeTimerRef.current = setTimeout(() => {
      setNotice(null);
    }, 4500);
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, []);

  // Initial load & manual retry: leagues, courses, study groups
  useEffect(() => {
    let cancelled = false;
    fetchedDetailsRef.current.clear();

    Promise.all([
      teacherApi.leagues.list(),
      teacherApi.courses.list().catch(() => ({ data: [] })),
      teacherApi.groups.list().catch(() => ({ data: [] })),
    ])
      .then(([leaguesRes, coursesRes, groupsRes]) => {
        if (cancelled) return;
        const rawLeagues = Array.isArray(leaguesRes?.data) ? leaguesRes.data : [];
        const dict = {};
        rawLeagues.forEach((item) => {
          const normalized = normalizeLeagueItem(item);
          if (normalized.key) {
            dict[normalized.key] = normalized;
          }
        });

        setLeaguesMap(dict);
        const keys = Object.keys(dict);
        setActiveLeagueKey((prev) => (prev && dict[prev] ? prev : keys[0] || ''));
        setCoursesList(Array.isArray(coursesRes?.data) ? coursesRes.data : []);
        setGroupsList(Array.isArray(groupsRes?.data) ? groupsRes.data : []);
        setLoadError('');
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err?.message || (isAr ? 'تعذر تحميل بيانات الدوري.' : 'Failed to load leagues.'));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadTick, isAr]);

  const handleRetryLoad = () => {
    setIsLoading(true);
    setLoadError('');
    setFailedDetailsKey('');
    setReloadTick((t) => t + 1);
  };

  // Fetch full details ONCE per selected league
  useEffect(() => {
    if (!activeLeagueKey) return;
    if (fetchedDetailsRef.current.has(activeLeagueKey)) return;

    const entry = leaguesMap[activeLeagueKey];
    if (!entry?.id || entry._detailsLoaded) {
      if (entry?._detailsLoaded) fetchedDetailsRef.current.add(activeLeagueKey);
      return;
    }

    let cancelled = false;
    fetchedDetailsRef.current.add(activeLeagueKey);

    teacherApi.leagues
      .get(entry.id)
      .then((res) => {
        if (cancelled || !res?.data) return;
        setFailedDetailsKey((prev) => (prev === activeLeagueKey ? '' : prev));
        setLeaguesMap((prev) => {
          const existing = prev[activeLeagueKey];
          if (!existing) return prev;
          return {
            ...prev,
            [activeLeagueKey]: normalizeLeagueItem(res.data, existing),
          };
        });
      })
      .catch((err) => {
        if (cancelled) return;
        fetchedDetailsRef.current.delete(activeLeagueKey);
        setFailedDetailsKey(activeLeagueKey);
        showToast(
          isAr ? 'تعذر تحميل تفاصيل الدوري' : 'Failed to load league details',
          err?.message || '',
          'error'
        );
      });

    return () => {
      cancelled = true;
    };
  }, [activeLeagueKey, leaguesMap, isAr, showToast]);

  const leaguesList = useMemo(() => Object.values(leaguesMap), [leaguesMap]);

  const currentLeague = useMemo(() => {
    return leaguesMap[activeLeagueKey] || leaguesList[0] || null;
  }, [leaguesMap, activeLeagueKey, leaguesList]);

  const isLoadingActiveDetails = Boolean(
    currentLeague?.id && !currentLeague._detailsLoaded && failedDetailsKey !== currentLeague.key
  );

  const upsertLeagueDetail = useCallback((rawLeague) => {
    if (!rawLeague) return null;
    const normalized = normalizeLeagueItem(rawLeague);
    if (!normalized.key) return null;
    fetchedDetailsRef.current.add(normalized.key);
    setLeaguesMap((prev) => ({
      ...prev,
      [normalized.key]: normalizeLeagueItem(rawLeague, prev[normalized.key]),
    }));
    return normalized;
  }, []);

  // ── Action Handlers ──────────────────────────────────────────────────────────

  const handleSelectLeague = (key) => {
    setActiveLeagueKey(key);
    setSearchQuery('');
    setTierFilter('all');
  };

  const handleCreateLeague = async (payload) => {
    const res = await teacherApi.leagues.create(payload);
    const created = upsertLeagueDetail(res?.data);
    if (created) {
      setActiveLeagueKey(created.key);
      setSearchQuery('');
      setTierFilter('all');
    }
    setShowStartModal(false);

    try {
      confetti({ particleCount: 110, spread: 75, origin: { y: 0.58 } });
    } catch {
      // Ignore canvas-confetti errors in restricted environments
    }

    showToast(
      isAr ? 'تم بدء الدوري بنجاح' : 'League Started Successfully',
      isAr
        ? `تم تفعيل "${created?.leagueTitle || payload.title_ar}" بعدد ${Number(created?.totalCompetitors || 0).toLocaleString()} طالب.`
        : `"${created?.leagueTitle || payload.title_ar}" is now live.`
    );
  };

  const handleUpdateLeague = async (leagueId, payload) => {
    const res = await teacherApi.leagues.update(leagueId, payload);
    const updated = upsertLeagueDetail(res?.data);
    setLeagueToEdit(null);
    showToast(
      isAr ? 'تم تعديل الدوري بنجاح' : 'League Updated',
      isAr
        ? `تم حفظ التعديلات على "${updated?.leagueTitle || payload.title_ar}" وتحديث الترتيب.`
        : 'League changes saved and ranks refreshed.'
    );
  };

  const handleDeleteLeague = async () => {
    if (!leagueToDelete?.id) return;
    await teacherApi.leagues.delete(leagueToDelete.id);

    const deletedKey = leagueToDelete.key;
    fetchedDetailsRef.current.delete(deletedKey);
    setLeaguesMap((prev) => {
      const next = { ...prev };
      delete next[deletedKey];
      const remaining = Object.keys(next);
      if (activeLeagueKey === deletedKey) {
        setActiveLeagueKey(remaining[0] || '');
      }
      return next;
    });

    setLeagueToDelete(null);
    showToast(
      isAr ? 'تم حذف الدوري بنجاح' : 'League Deleted',
      isAr ? 'تمت إزالة الدوري نهائياً من قائمة الدوريات.' : 'The league has been removed.'
    );
  };

  const handleAddParticipant = async (studentId, initialXp, displayName) => {
    if (!currentLeague?.id) return;
    const res = await teacherApi.leagues.addParticipant(currentLeague.id, {
      student_id: studentId,
      initial_xp: initialXp,
    });
    upsertLeagueDetail(res?.data);
    setShowAddStudentModal(false);
    showToast(
      isAr ? 'تمت إضافة الطالب إلى الدوري' : 'Student Added',
      isAr
        ? `تم إدراج "${displayName}" في جدول الترتيب بنجاح.`
        : `${displayName} has been added to the league.`
    );
  };

  const handleRemoveParticipant = async () => {
    if (!currentLeague?.id || !participantToRemove) return;
    const identifier = participantToRemove.id || participantToRemove.studentId;
    const res = await teacherApi.leagues.removeParticipant(currentLeague.id, identifier);
    upsertLeagueDetail(res?.data);
    const removedName = participantToRemove.nameAr;
    setParticipantToRemove(null);
    showToast(
      isAr ? 'تمت إزالة الطالب من الدوري' : 'Participant Removed',
      isAr
        ? `تمت إزالة "${removedName}" وإعادة ترتيب باقي المتنافسين.`
        : `${removedName} has been removed from this league.`
    );
  };

  const handleAwardXp = async ({ studentId, studentName, xpAmount, reason }) => {
    if (!currentLeague?.id) return;
    const res = await teacherApi.leagues.awardXp(currentLeague.id, {
      studentId,
      xpAmount,
      reason,
    });
    upsertLeagueDetail(res?.data);
    setAwardXpStudent(null);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } });
    } catch {
      // ignore
    }

    showToast(
      isAr ? 'تم منح نقاط البونص بنجاح' : 'Bonus XP Awarded',
      isAr
        ? `تمت إضافة +${xpAmount} XP إلى "${studentName}" وتحديث الترتيب فوراً.`
        : `Awarded +${xpAmount} XP to ${studentName} and updated ranks.`
    );
  };

  const handleRecalculate = async () => {
    if (!currentLeague?.id || isRecalculating) return;
    setIsRecalculating(true);
    try {
      const res = await teacherApi.leagues.recalculate(currentLeague.id);
      upsertLeagueDetail(res?.data);
      showToast(
        isAr ? 'تم تحديث الترتيب بنجاح' : 'Leaderboard Recalculated',
        isAr
          ? 'تمت مزامنة الطلاب والامتحانات والستريك وإعادة احتساب المراكز والمستويات.'
          : 'Synced enrolled students, exams, streaks, and recalculated all ranks.'
      );
    } catch (err) {
      showToast(
        isAr ? 'فشل تحديث الترتيب' : 'Recalculation Failed',
        err?.message || '',
        'error'
      );
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleAnnounceWinners = () => {
    if (!currentLeague || Number(currentLeague.totalCompetitors || 0) === 0) return;
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.58 } });
    } catch {
      // ignore
    }

    const champion = currentLeague.podium?.[0]?.nameAr;
    showToast(
      isAr ? 'تم تتويج أبطال الجولة بنجاح' : 'Champions Celebrated!',
      isAr
        ? champion
          ? `يتصدر "${champion}" دوري "${currentLeague.leagueTitle}" بين ${Number(currentLeague.totalCompetitors).toLocaleString()} متنافس.`
          : `تم الاحتفاء بأبطال "${currentLeague.leagueTitle}".`
        : `Celebrating the top performers of ${currentLeague.leagueTitle}.`
    );
  };

  return (
    <div
      style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: isMobile ? '18px 14px 60px' : '28px 24px 80px',
        fontFamily: 'var(--font-arabic)',
      }}
    >
      {/* 1. Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(21, 136, 199, 0.16)' : 'rgba(21, 136, 199, 0.12)',
                color: 'var(--primary)',
                fontSize: '11px',
                fontWeight: '800',
              }}
            >
              <Trophy size={13} />
              <span>{isAr ? 'بطولة الكورس والمنافسات' : 'Course Leagues'}</span>
            </span>
          </div>

          <h1
            style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Crown size={isMobile ? 22 : 24} color="#D97706" />
            <span>{isAr ? 'إدارة دوري الكورس وصدارة الطلاب' : 'Course League Management'}</span>
          </h1>
        </div>

        {/* Top Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          <button
            type="button"
            onClick={() => setShowStartModal(true)}
            style={{
              flex: isMobile ? '1 1 auto' : 'initial',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: isMobile ? '9px 14px' : '10px 18px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(21, 136, 199, 0.3)',
            }}
          >
            <Plus size={15} />
            <span>{isAr ? 'بدء دوري جديد' : 'New League'}</span>
          </button>

          {currentLeague?.id && Number(currentLeague.totalCompetitors || 0) > 0 && (
            <button
              type="button"
              onClick={handleAnnounceWinners}
              style={{
                flex: isMobile ? '1 1 auto' : 'initial',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: isMobile ? '9px 14px' : '10px 16px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <Award size={15} color="#D97706" />
              <span>{isAr ? 'تتويج الأوائل' : 'Celebrate Winners'}</span>
            </button>
          )}

          {currentLeague?.id && (
            <>
              <button
                type="button"
                onClick={() => setLeagueToEdit(currentLeague)}
                style={{
                  flex: isMobile ? '1 1 auto' : 'initial',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: isMobile ? '9px 12px' : '10px 15px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(21, 136, 199, 0.08)',
                  border: '1.5px solid rgba(21, 136, 199, 0.25)',
                  color: 'var(--primary)',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                <Edit3 size={14} />
                <span>{isAr ? 'تعديل الدوري' : 'Edit'}</span>
              </button>

              <button
                type="button"
                onClick={() => setLeagueToDelete(currentLeague)}
                style={{
                  flex: isMobile ? '1 1 auto' : 'initial',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: isMobile ? '9px 12px' : '10px 15px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1.5px solid rgba(239, 68, 68, 0.25)',
                  color: '#EF4444',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={14} />
                <span>{isAr ? 'حذف الدوري' : 'Delete'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {notice && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '14px',
            backgroundColor:
              notice.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.12)',
            border: `1.5px solid ${notice.type === 'error' ? '#EF4444' : '#10B981'}`,
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            {notice.type === 'error' ? (
              <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div>
              <div
                style={{
                  fontWeight: '900',
                  color:
                    notice.type === 'error'
                      ? '#EF4444'
                      : isDark
                      ? '#34D399'
                      : '#065F46',
                  fontSize: '13px',
                }}
              >
                {notice.title}
              </div>
              {notice.desc && (
                <div
                  style={{
                    color:
                      notice.type === 'error'
                        ? (isDark ? '#FCA5A5' : '#991B1B')
                        : (isDark ? '#E2E8F0' : '#047857'),
                    fontSize: '12px',
                    marginTop: '2px',
                  }}
                >
                  {notice.desc}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNotice(null)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Loading / Error / Empty / Main Content */}
      {isLoading ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '48px 20px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: '700',
          }}
        >
          {isAr ? 'جاري تحميل الدوريات ولوحة الصدارة...' : 'Loading course leagues...'}
        </div>
      ) : loadError ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '20px',
            padding: '36px 20px',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={32} color="#EF4444" style={{ marginBottom: '10px' }} />
          <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {loadError}
          </div>
          <button
            type="button"
            onClick={handleRetryLoad}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '10px',
              padding: '9px 18px',
              borderRadius: '11px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        </div>
      ) : leaguesList.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px dashed var(--border-medium)',
            borderRadius: '24px',
            padding: isMobile ? '36px 18px' : '52px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: 'rgba(245, 158, 11, 0.14)',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <Trophy size={32} />
          </div>
          <h2 style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 8px' }}>
            {isAr ? 'ابدأ أول دوري تنافسي لطلابك!' : 'Launch Your First Course League!'}
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 20px', lineHeight: 1.65 }}>
            {isAr
              ? 'حفّز طلابك على التفوق وحل الامتحانات والالتزام اليومي من خلال دوري رسمي بنقاط تلقائية ومنصة تتويج ومستويات تنافسية.'
              : 'Motivate your students with automated exam & streak XP scoring, a live winners podium, and competitive tiers.'}
          </p>
          <button
            type="button"
            onClick={() => setShowStartModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '11px 24px',
              borderRadius: '13px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(21, 136, 199, 0.35)',
            }}
          >
            <Plus size={16} />
            <span>{isAr ? 'إنشاء وبدء أول دوري' : 'Create First League'}</span>
          </button>
        </div>
      ) : (
        <>
          <LeagueSwitcherBar
            leagues={leaguesList}
            activeLeagueKey={currentLeague?.key}
            onSelect={handleSelectLeague}
            onCreateNew={() => setShowStartModal(true)}
            onEdit={(lg) => setLeagueToEdit(lg)}
            onDelete={(lg) => setLeagueToDelete(lg)}
            lang={lang}
            isDark={isDark}
            isMobile={isMobile}
          />

          {currentLeague && (
            <>
              <LeaguePodium
                league={currentLeague}
                isLoadingDetails={isLoadingActiveDetails}
                onSelectStudent={setSelectedStudent}
                onAddStudent={() => setShowAddStudentModal(true)}
                lang={lang}
                isDark={isDark}
                isMobile={isMobile}
              />

              <LeagueScoringRulesCard
                scoringRules={currentLeague.scoringRules}
                tiers={currentLeague.tiers}
                lang={lang}
                isMobile={isMobile}
              />

              <LeagueLeaderboardTable
                league={currentLeague}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                tierFilter={tierFilter}
                onTierFilterChange={setTierFilter}
                isLoadingDetails={isLoadingActiveDetails}
                isRecalculating={isRecalculating}
                onRecalculate={handleRecalculate}
                onOpenAddStudent={() => setShowAddStudentModal(true)}
                onSelectStudent={setSelectedStudent}
                onAwardXp={setAwardXpStudent}
                onRemoveParticipant={setParticipantToRemove}
                lang={lang}
                isDark={isDark}
                isMobile={isMobile}
              />
            </>
          )}
        </>
      )}

      {/* Modals */}
      {showStartModal && (
        <StartLeagueModal
          courses={coursesList}
          groups={groupsList}
          onSubmit={handleCreateLeague}
          onClose={() => setShowStartModal(false)}
          lang={lang}
          isRtl={isRtl}
          isMobile={isMobile}
        />
      )}

      {leagueToEdit && (
        <EditLeagueModal
          league={leagueToEdit}
          groups={groupsList}
          onSubmit={handleUpdateLeague}
          onClose={() => setLeagueToEdit(null)}
          lang={lang}
          isRtl={isRtl}
          isMobile={isMobile}
        />
      )}

      {showAddStudentModal && currentLeague && (
        <AddParticipantModal
          league={currentLeague}
          onAddParticipant={handleAddParticipant}
          onClose={() => setShowAddStudentModal(false)}
          lang={lang}
          isRtl={isRtl}
          isMobile={isMobile}
        />
      )}

      {awardXpStudent && currentLeague && (
        <AwardXpModal
          student={awardXpStudent}
          onSubmit={handleAwardXp}
          onClose={() => setAwardXpStudent(null)}
          lang={lang}
          isRtl={isRtl}
          isMobile={isMobile}
        />
      )}

      {selectedStudent && currentLeague && (
        <StudentLeagueDetailModal
          student={selectedStudent}
          league={currentLeague}
          onAwardXp={setAwardXpStudent}
          onRemoveParticipant={setParticipantToRemove}
          onClose={() => setSelectedStudent(null)}
          lang={lang}
          isRtl={isRtl}
          isMobile={isMobile}
        />
      )}

      {leagueToDelete && (
        <ConfirmActionModal
          title={isAr ? 'تأكيد حذف الدوري' : 'Delete League'}
          message={
            isAr
              ? `هل أنت متأكد من حذف دوري "${leagueToDelete.leagueTitle}"؟ ستتم إزالة جميع تصنيفات الطلاب الخاصة به نهائياً.`
              : `Are you sure you want to delete "${leagueToDelete.leagueTitle}"? All student rankings in this league will be removed.`
          }
          confirmLabel={isAr ? 'تأكيد الحذف' : 'Delete League'}
          cancelLabel={isAr ? 'إلغاء' : 'Cancel'}
          onConfirm={handleDeleteLeague}
          onClose={() => setLeagueToDelete(null)}
          isRtl={isRtl}
        />
      )}

      {participantToRemove && (
        <ConfirmActionModal
          title={isAr ? 'إزالة الطالب من الدوري' : 'Remove Participant'}
          message={
            isAr
              ? `هل تريد إزالة الطالب "${participantToRemove.nameAr}" من هذا الدوري؟ يمكنك إعادة إضافته لاحقاً في أي وقت.`
              : `Remove "${participantToRemove.nameAr}" from this league? You can re-add them anytime later.`
          }
          confirmLabel={isAr ? 'إزالة الطالب' : 'Remove'}
          cancelLabel={isAr ? 'إلغاء' : 'Cancel'}
          onConfirm={handleRemoveParticipant}
          onClose={() => setParticipantToRemove(null)}
          isRtl={isRtl}
        />
      )}
    </div>
  );
};

export default TeacherLeagueView;
