import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { adminApi } from '../../../services/adminApi';
import { PRESET_AVATARS, PRESET_BADGES } from '../../../data/mockAdminData';
import {
  Trophy,
  Plus,
  Trash2,
  Edit3,
  Pin,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Flame,
  Award,
  Sparkles,
  School,
  Shield,
  Crown,
  X,
  Play,
  Square,
  RefreshCw,
  Search,
  Upload,
  Users,
  Medal,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Clock,
  Star,
  Image as ImageIcon,
  Mail,
  Phone,
  Copy,
  Check,
  MessageCircle,
  Megaphone,
  Calendar,
} from 'lucide-react';

const CANONICAL_GRADES = [
  { key: 'prep_1', value: 'الصف الأول الإعدادي', labelAr: 'أولى إعدادي', fullAr: 'الصف الأول الإعدادي', labelEn: '1st Prep' },
  { key: 'prep_2', value: 'الصف الثاني الإعدادي', labelAr: 'ثانية إعدادي', fullAr: 'الصف الثاني الإعدادي', labelEn: '2nd Prep' },
  { key: 'prep_3', value: 'الصف الثالث الإعدادي', labelAr: 'ثالثة إعدادي', fullAr: 'الصف الثالث الإعدادي', labelEn: '3rd Prep' },
  { key: 'sec_1', value: 'الصف الأول الثانوي', labelAr: 'أولى ثانوي', fullAr: 'الصف الأول الثانوي', labelEn: '1st Sec' },
  { key: 'sec_2', value: 'الصف الثاني الثانوي', labelAr: 'ثانية ثانوي', fullAr: 'الصف الثاني الثانوي', labelEn: '2nd Sec' },
  { key: 'sec_3', value: 'الصف الثالث الثانوي', labelAr: 'ثالثة ثانوي', fullAr: 'الصف الثالث الثانوي', labelEn: '3rd Sec' },
];

const EMPTY_FORM = {
  studentId: null,
  republicLeagueId: null,
  championUuid: null,
  source: 'manual',
  nameAr: '',
  nameEn: '',
  gradeAr: 'الصف الثالث الثانوي',
  titleAr: 'بطل دوري الجمهورية المتفوق',
  titleEn: 'Republic League Champion',
  monthAr: 'دوري الجمهورية العام',
  monthEn: 'General Republic League',
  schoolAr: '',
  schoolEn: '',
  scoreAr: '0 نقطة',
  scoreEn: '0 Points',
  rankAr: 'المركز الأول جمهورياً',
  rankEn: 'National 1st Place',
  streakAr: '0 يوم استريك',
  streakEn: '0-Day Streak',
  badgeAr: 'كأس التفوق الشهري',
  badgeEn: 'Monthly Excellence Cup',
  image: '/characters/real-male-champ-1.png',
  isPinned: true,
  displayOrder: 1,
};

const TIER_STYLES = {
  diamond: { bg: 'rgba(14, 165, 233, 0.14)', color: '#0284C7', border: 'rgba(14, 165, 233, 0.35)' },
  gold: { bg: 'rgba(245, 158, 11, 0.15)', color: '#B45309', border: 'rgba(245, 158, 11, 0.38)' },
  silver: { bg: 'rgba(100, 116, 139, 0.14)', color: '#475569', border: 'rgba(100, 116, 139, 0.3)' },
  bronze: { bg: 'rgba(180, 83, 9, 0.13)', color: '#9A3412', border: 'rgba(180, 83, 9, 0.3)' },
};

const getRankVisual = (rank) => {
  if (rank === 1) {
    return {
      bg: 'linear-gradient(135deg, #F59E0B, #D97706)',
      softBg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.42)',
      color: '#FFFFFF',
      accentText: '#B45309',
      ring: 'rgba(245, 158, 11, 0.45)',
      label: '#1',
      titleAr: 'المركز الأول',
      titleEn: '1st Place',
    };
  }
  if (rank === 2) {
    return {
      bg: 'linear-gradient(135deg, #64748B, #475569)',
      softBg: 'rgba(100, 116, 139, 0.08)',
      border: 'rgba(148, 163, 184, 0.45)',
      color: '#FFFFFF',
      accentText: '#475569',
      ring: 'rgba(148, 163, 184, 0.45)',
      label: '#2',
      titleAr: 'المركز الثاني',
      titleEn: '2nd Place',
    };
  }
  if (rank === 3) {
    return {
      bg: 'linear-gradient(135deg, #D97706, #9A3412)',
      softBg: 'rgba(217, 119, 6, 0.08)',
      border: 'rgba(217, 119, 6, 0.35)',
      color: '#FFFFFF',
      accentText: '#9A3412',
      ring: 'rgba(217, 119, 6, 0.35)',
      label: '#3',
      titleAr: 'المركز الثالث',
      titleEn: '3rd Place',
    };
  }
  return {
    bg: 'var(--bg-subtle)',
    softBg: 'var(--bg-subtle)',
    border: 'var(--border-subtle)',
    color: 'var(--text-primary)',
    accentText: 'var(--text-secondary)',
    ring: 'var(--border-subtle)',
    label: `#${rank}`,
    titleAr: `المركز #${rank}`,
    titleEn: `Rank #${rank}`,
  };
};

const getInitials = (name) => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '؟';
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[1][0]}`;
};

const formatShortDate = (iso, lang) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

const buildWhatsAppLink = (phone, studentName, rank, gradeAr) => {
  const digits = String(phone || '').replace(/[^\d]/g, '');
  if (!digits) return null;
  const intl = digits.startsWith('0') && digits.length === 11 ? `2${digits}` : digits;
  const rankWord = rank === 1 ? 'الأول' : rank === 2 ? 'الثاني' : `#${rank}`;
  const msg = `ألف مبروك يا ${studentName}! تصدّرت المركز ${rankWord} على مستوى الجمهورية (${gradeAr}) في منصة متفوّق 🏆\nنرجو إرسال صورة شخصية واضحة ومناسبة لعرضك في لوحة الشرف والسلايدر الرئيسي بالمنصة.`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(msg)}`;
};

const buildMailtoLink = (email, studentName, rank, gradeAr) => {
  if (!email) return null;
  const rankWord = rank === 1 ? 'الأول' : rank === 2 ? 'الثاني' : `#${rank}`;
  const subject = `تهنئة منصة متفوّق — طلب صورة شخصية لعرضك في لوحة الشرف (${gradeAr})`;
  const body = `مرحباً ${studentName}،\n\nألف مبروك على حصولك على المركز ${rankWord} في دوري الجمهورية (${gradeAr}) على منصة متفوّق!\n\nنرجو الرد بصورة شخصية واضحة ومناسبة ليتم اعتمادها وعرضها في لوحة الشرف الرئيسية للمنصة.\n\nمع خالص التمنيات بدوام التفوق،\nإدارة منصة متفوّق`;
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const PaginationBar = ({ meta, onPageChange, perPage, onPerPageChange, perPageOptions = [12, 24, 36], lang, isRtl }) => {
  const pagination = meta?.pagination;
  if (!pagination || pagination.total <= 0) return null;

  const { current_page: currentPage, last_page: lastPage, total, from, to } = pagination;

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(lastPage, currentPage + 2);
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('ellipsis-start');
  }
  for (let p = start; p <= end; p += 1) pages.push(p);
  if (end < lastPage) {
    if (end < lastPage - 1) pages.push('ellipsis-end');
    pages.push(lastPage);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '13px 18px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
          {lang === 'ar'
            ? `عرض ${from} – ${to} من إجمالي ${total.toLocaleString('ar-EG')}`
            : `Showing ${from}–${to} of ${total.toLocaleString()}`}
        </span>

        {onPerPageChange && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'عدد الصفوف:' : 'Per page:'}
            </span>
            <select
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              style={{
                padding: '5px 8px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {perPageOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {lastPage > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '9px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: currentPage <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage <= 1 ? 0.5 : 1,
            }}
          >
            {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            <span>{lang === 'ar' ? 'السابق' : 'Prev'}</span>
          </button>

          {pages.map((p) =>
            typeof p === 'string' ? (
              <span key={p} style={{ padding: '0 4px', color: 'var(--text-secondary)', fontSize: '12px' }}>…</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                style={{
                  minWidth: '32px',
                  height: '32px',
                  padding: '0 8px',
                  borderRadius: '9px',
                  border: p === currentPage ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: p === currentPage ? 'var(--primary)' : 'var(--bg-surface)',
                  color: p === currentPage ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            disabled={currentPage >= lastPage}
            onClick={() => onPageChange(currentPage + 1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '9px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: currentPage >= lastPage ? 'var(--text-muted)' : 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: currentPage >= lastPage ? 'not-allowed' : 'pointer',
              opacity: currentPage >= lastPage ? 0.5 : 1,
            }}
          >
            <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
            {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>
      )}
    </div>
  );
};

export const AdminChampionsManager = () => {
  const { lang, isRtl } = useLanguage();

  // Shared top-level state
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedLeagueUuid, setSelectedLeagueUuid] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('nominees'); // 'nominees' | 'leaderboard' | 'slider'

  // Overview & League Controls
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState(null);
  const [leagueBusy, setLeagueBusy] = useState(false);

  // Modals: Launch, Announce End, Stop
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [launchForm, setLaunchForm] = useState({
    grade_ar: 'all',
    title_ar: 'دوري الجمهورية العام (أولى إعدادي — ثالثة ثانوي)',
    duration: 'monthly',
  });
  const [announceEndTarget, setAnnounceEndTarget] = useState(null);
  const [announceForm, setAnnounceForm] = useState({
    end_now: true,
    publish_announcement: true,
    announcement_title_ar: '',
    announcement_content_ar: '',
    audience: 'all',
    priority: 'important',
    display_days: 7,
  });
  const [confirmStopRound, setConfirmStopRound] = useState(null);

  // Tab 1: Auto-Detected Top-2 Nominees State
  const [nominees, setNominees] = useState([]);
  const [nomineesMeta, setNomineesMeta] = useState(null);
  const [nomineesLoading, setNomineesLoading] = useState(true);
  const [nomineeStatusFilter, setNomineeStatusFilter] = useState('all');
  const [nomineesPage, setNomineesPage] = useState(1);
  const [nomineesPerPage, setNomineesPerPage] = useState(12);

  // Tab 2: Live Republic League Standings State
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardMeta, setLeaderboardMeta] = useState(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [lbSearchInput, setLbSearchInput] = useState('');
  const [lbSearch, setLbSearch] = useState('');
  const [lbOnlyScored, setLbOnlyScored] = useState(false);
  const [lbPage, setLbPage] = useState(1);
  const [lbPerPage, setLbPerPage] = useState(15);

  // Tab 3: Approved Slider Champions State
  const [champions, setChampions] = useState([]);
  const [championsMeta, setChampionsMeta] = useState(null);
  const [championsLoading, setChampionsLoading] = useState(false);
  const [champSearchInput, setChampSearchInput] = useState('');
  const [champSearch, setChampSearch] = useState('');
  const [champPinnedFilter, setChampPinnedFilter] = useState('all');
  const [champSourceFilter, setChampSourceFilter] = useState('all');
  const [champPage, setChampPage] = useState(1);
  const [champPerPage, setChampPerPage] = useState(12);

  // Review / Approve / Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'approve' | 'edit' | 'create'
  const [editingChampUuid, setEditingChampUuid] = useState(null);
  const [modalContactInfo, setModalContactInfo] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const [championToDelete, setChampionToDelete] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const copyTimerRef = useRef(null);

  // Sequence counters to prevent stale async races
  const overviewSeqRef = useRef(0);
  const nomineesSeqRef = useRef(0);
  const leaderboardSeqRef = useRef(0);
  const championsSeqRef = useRef(0);

  const showToast = useCallback((text, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ text, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3600);
  }, []);

  const handleCopy = useCallback(async (value, key, label) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopiedKey(null), 1800);
      showToast(lang === 'ar' ? `تم نسخ ${label}: ${value}` : `Copied ${label}`);
    } catch {
      showToast(lang === 'ar' ? 'تعذر النسخ التلقائي' : 'Copy failed', 'error');
    }
  }, [lang, showToast]);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
  }, []);

  // Debounce search inputs
  useEffect(() => {
    const t = setTimeout(() => {
      setLbSearch(lbSearchInput.trim());
      setLbPage(1);
    }, 320);
    return () => clearTimeout(t);
  }, [lbSearchInput]);

  useEffect(() => {
    const t = setTimeout(() => {
      setChampSearch(champSearchInput.trim());
      setChampPage(1);
    }, 320);
    return () => clearTimeout(t);
  }, [champSearchInput]);

  const emitChampionsSync = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('champions-updated'));
    }
  };

  // ─── Data Fetchers ─────────────────────────────────────────────────────────

  const fetchOverview = useCallback(async () => {
    const seq = ++overviewSeqRef.current;
    setOverviewLoading(true);
    setOverviewError(null);
    try {
      const res = await adminApi.republicLeague.get({ grade: selectedGrade });
      if (seq !== overviewSeqRef.current) return;
      setOverview(res?.data || null);
    } catch (err) {
      if (seq !== overviewSeqRef.current) return;
      setOverviewError(err?.message || (lang === 'ar' ? 'تعذر تحميل بيانات دوري الجمهورية' : 'Failed to load Republic League overview'));
    } finally {
      if (seq === overviewSeqRef.current) setOverviewLoading(false);
    }
  }, [selectedGrade, lang]);

  const fetchNominees = useCallback(async () => {
    const seq = ++nomineesSeqRef.current;
    setNomineesLoading(true);
    try {
      const res = await adminApi.republicLeague.getNominees({
        grade: selectedGrade,
        status: nomineeStatusFilter,
        league_id: selectedLeagueUuid || undefined,
        top_per_grade: 2,
        page: nomineesPage,
        per_page: nomineesPerPage,
      });
      if (seq !== nomineesSeqRef.current) return;
      setNominees(Array.isArray(res?.data) ? res.data : []);
      setNomineesMeta(res?.meta || null);
    } catch (err) {
      if (seq !== nomineesSeqRef.current) return;
      showToast(err?.message || (lang === 'ar' ? 'تعذر تحميل أوائل دوري الجمهورية' : 'Failed to load nominees'), 'error');
    } finally {
      if (seq === nomineesSeqRef.current) setNomineesLoading(false);
    }
  }, [selectedGrade, nomineeStatusFilter, selectedLeagueUuid, nomineesPage, nomineesPerPage, lang, showToast]);

  const fetchLeaderboard = useCallback(async () => {
    const seq = ++leaderboardSeqRef.current;
    setLeaderboardLoading(true);
    try {
      const res = await adminApi.republicLeague.getLeaderboard({
        grade: selectedGrade,
        search: lbSearch || undefined,
        league_id: selectedLeagueUuid || undefined,
        only_scored: lbOnlyScored ? '1' : '0',
        page: lbPage,
        per_page: lbPerPage,
      });
      if (seq !== leaderboardSeqRef.current) return;
      setLeaderboard(Array.isArray(res?.data) ? res.data : []);
      setLeaderboardMeta(res?.meta || null);
    } catch (err) {
      if (seq !== leaderboardSeqRef.current) return;
      showToast(err?.message || (lang === 'ar' ? 'تعذر تحميل ترتيب الدوري' : 'Failed to load standings'), 'error');
    } finally {
      if (seq === leaderboardSeqRef.current) setLeaderboardLoading(false);
    }
  }, [selectedGrade, lbSearch, selectedLeagueUuid, lbOnlyScored, lbPage, lbPerPage, lang, showToast]);

  const fetchChampions = useCallback(async () => {
    const seq = ++championsSeqRef.current;
    setChampionsLoading(true);
    try {
      const res = await adminApi.champions.list({
        grade: selectedGrade,
        search: champSearch || undefined,
        pinned: champPinnedFilter,
        source: champSourceFilter,
        page: champPage,
        per_page: champPerPage,
      });
      if (seq !== championsSeqRef.current) return;
      setChampions(Array.isArray(res?.data) ? res.data : []);
      setChampionsMeta(res?.meta || null);
    } catch (err) {
      if (seq !== championsSeqRef.current) return;
      showToast(err?.message || (lang === 'ar' ? 'تعذر تحميل لوحة الشرف' : 'Failed to load champions'), 'error');
    } finally {
      if (seq === championsSeqRef.current) setChampionsLoading(false);
    }
  }, [selectedGrade, champSearch, champPinnedFilter, champSourceFilter, champPage, champPerPage, lang, showToast]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    if (activeSubTab === 'nominees') fetchNominees();
  }, [activeSubTab, fetchNominees]);

  useEffect(() => {
    if (activeSubTab === 'leaderboard') fetchLeaderboard();
  }, [activeSubTab, fetchLeaderboard]);

  useEffect(() => {
    if (activeSubTab === 'slider') fetchChampions();
  }, [activeSubTab, fetchChampions]);

  const refreshAllVisible = useCallback(() => {
    fetchOverview();
    if (activeSubTab === 'nominees') fetchNominees();
    else if (activeSubTab === 'leaderboard') fetchLeaderboard();
    else fetchChampions();
  }, [activeSubTab, fetchOverview, fetchNominees, fetchLeaderboard, fetchChampions]);

  const handleSelectGrade = (gradeValue) => {
    setSelectedGrade(gradeValue);
    setNomineesPage(1);
    setLbPage(1);
    setChampPage(1);
  };

  // ─── League Actions (Launch / Announce End & Early Honoring / Stop) ────────

  const openLaunchLeagueModal = () => {
    const initialGrade = selectedGrade;
    const defaultTitle = initialGrade === 'all'
      ? 'دوري الجمهورية العام (أولى إعدادي — ثالثة ثانوي)'
      : `دوري الجمهورية — ${initialGrade}`;
    setLaunchForm({
      grade_ar: initialGrade,
      title_ar: defaultTitle,
      duration: 'monthly',
    });
    setShowLaunchModal(true);
  };

  const handleLaunchLeague = async (e) => {
    e.preventDefault();
    setLeagueBusy(true);
    try {
      await adminApi.republicLeague.start({
        title_ar: launchForm.title_ar.trim() || undefined,
        grade_ar: launchForm.grade_ar === 'all' ? null : launchForm.grade_ar,
        duration: launchForm.duration,
      });
      setShowLaunchModal(false);
      setSelectedLeagueUuid('');
      showToast(lang === 'ar' ? 'تم إطلاق جولة جديدة من دوري الجمهورية بنجاح!' : 'Republic League round launched!');
      refreshAllVisible();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر بدء جولة الدوري' : 'Failed to start league'), 'error');
    } finally {
      setLeagueBusy(false);
    }
  };

  const openAnnounceEndModal = (roundObj) => {
    const target = roundObj || overview?.league || null;
    if (!target) {
      showToast(lang === 'ar' ? 'لا توجد جولة دوري حالية لإعلان انتهائها' : 'No Republic League round found', 'error');
      return;
    }

    const topTwoPreview = nominees
      .filter((n) => !target.gradeAr || n.gradeAr === target.gradeAr)
      .slice(0, 4)
      .map((n) => `${n.rank === 1 ? '🥇' : '🥈'} ${n.name} (${getShortGradeLabel(n.gradeAr)})`)
      .join(' • ');

    const scopeLabel = target.gradeLabelAr || 'جميع الصفوف';
    const defaultBody = topTwoPreview
      ? `تُعلن إدارة منصة متفوّق عن انتهاء جولة «${target.titleAr}» (${scopeLabel}) والبدء في التكريم الرسمي لأوائل الجمهورية (المركز الأول والثاني): ${topTwoPreview}. سيتم عرض صور الأوائل في لوحة الشرف الرئيسية فور اعتمادها.`
      : `تُعلن إدارة منصة متفوّق عن انتهاء جولة «${target.titleAr}» (${scopeLabel}) وتثبيت الترتيب النهائي والبدء في التكريم الرسمي لأوائل الجمهورية (المركز الأول والثاني من كل صف دراسي).`;

    setAnnounceEndTarget(target);
    setAnnounceForm({
      end_now: Boolean(target.isActive),
      publish_announcement: true,
      announcement_title_ar: `إعلان انتهاء ${target.titleAr} وبدء التكريم الرسمي للأوائل 🏆`,
      announcement_content_ar: defaultBody,
      audience: 'all',
      priority: 'important',
      display_days: 7,
    });
  };

  const handleConfirmAnnounceEnd = async (e) => {
    e.preventDefault();
    if (!announceEndTarget) return;
    setLeagueBusy(true);
    try {
      const res = await adminApi.republicLeague.announceEnd({
        league_id: announceEndTarget.id,
        end_now: announceForm.end_now,
        publish_announcement: announceForm.publish_announcement,
        announcement_title_ar: announceForm.announcement_title_ar.trim(),
        announcement_content_ar: announceForm.announcement_content_ar.trim(),
        audience: announceForm.audience,
        priority: announceForm.priority,
        display_days: Number(announceForm.display_days) || 7,
      });
      setAnnounceEndTarget(null);
      const endedEarly = res?.data?.endedEarly;
      showToast(
        endedEarly
          ? (lang === 'ar' ? 'تم إنهاء الدوري مبكراً ونشر إعلان التكريم الرسمي بنجاح!' : 'League concluded early and honoring announcement published!')
          : (lang === 'ar' ? 'تم إعلان انتهاء الدوري وبث تنبيه التكريم بنجاح!' : 'League conclusion announcement published!')
      );
      refreshAllVisible();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر نشر إعلان انتهاء الدوري' : 'Failed to announce league end'), 'error');
    } finally {
      setLeagueBusy(false);
    }
  };

  const handleConfirmStopLeague = async () => {
    if (!confirmStopRound) return;
    setLeagueBusy(true);
    try {
      await adminApi.republicLeague.stop(confirmStopRound.id ? { league_id: confirmStopRound.id } : {});
      setConfirmStopRound(null);
      showToast(lang === 'ar' ? 'تم إيقاف جولة دوري الجمهورية بنجاح' : 'Republic League round stopped');
      refreshAllVisible();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر إيقاف الدوري' : 'Failed to stop league'), 'error');
    } finally {
      setLeagueBusy(false);
    }
  };

  // ─── Champion Review / Approval / Photo Upload / CRUD ──────────────────────

  const openApproveNomineeModal = (entry) => {
    const s = entry?.suggestedChampion || {};
    setModalMode('approve');
    setEditingChampUuid(entry?.championUuid || null);
    setModalContactInfo({
      name: entry?.name || s.nameAr || '',
      email: entry?.email || null,
      phone: entry?.phone || entry?.parentPhone || null,
      parentPhone: entry?.parentPhone || null,
      rank: entry?.rank || 1,
      gradeAr: entry?.gradeAr || s.gradeAr || '',
    });
    setFormData({
      ...EMPTY_FORM,
      studentId: s.studentId ?? entry?.studentId ?? null,
      republicLeagueId: s.republicLeagueId ?? overview?.league?.dbId ?? null,
      championUuid: s.championUuid ?? entry?.championUuid ?? null,
      source: 'republic_league',
      nameAr: s.nameAr || entry?.name || '',
      nameEn: s.nameEn || entry?.name || '',
      gradeAr: s.gradeAr || entry?.gradeAr || 'الصف الثالث الثانوي',
      titleAr: s.titleAr || '',
      titleEn: s.titleEn || '',
      monthAr: s.monthAr || overview?.league?.titleAr || 'دوري الجمهورية العام',
      monthEn: s.monthEn || 'General Republic League',
      schoolAr: s.schoolAr || entry?.schoolDisplay || '',
      schoolEn: s.schoolEn || entry?.schoolDisplay || '',
      scoreAr: s.scoreAr || `${Number(entry?.xpPoints || 0).toLocaleString()} نقطة`,
      scoreEn: s.scoreEn || `${Number(entry?.xpPoints || 0).toLocaleString()} Points`,
      rankAr: s.rankAr || `المركز #${entry?.rank || 1}`,
      rankEn: s.rankEn || `Rank #${entry?.rank || 1}`,
      streakAr: s.streakAr || `${entry?.streakDays || 0} يوم استريك`,
      streakEn: s.streakEn || `${entry?.streakDays || 0}-Day Streak`,
      badgeAr: s.badgeAr || 'كأس التفوق الشهري',
      badgeEn: s.badgeEn || 'Monthly Excellence Cup',
      image: s.image || '/characters/real-male-champ-1.png',
      isPinned: true,
      displayOrder: Number(s.displayOrder ?? entry?.rank ?? 1),
    });
    setIsModalOpen(true);
  };

  const openManualAddModal = () => {
    setModalMode('create');
    setEditingChampUuid(null);
    setModalContactInfo(null);
    setFormData({
      ...EMPTY_FORM,
      gradeAr: selectedGrade !== 'all' ? selectedGrade : 'الصف الثالث الثانوي',
      monthAr: overview?.league?.titleAr || 'دوري الجمهورية العام',
    });
    setIsModalOpen(true);
  };

  const openEditChampionModal = (champ) => {
    setModalMode('edit');
    setEditingChampUuid(champ.id);
    setModalContactInfo(null);
    setFormData({
      ...EMPTY_FORM,
      studentId: champ.studentId || null,
      republicLeagueId: champ.republicLeagueId || null,
      championUuid: champ.id,
      source: champ.source || 'manual',
      nameAr: champ.nameAr || '',
      nameEn: champ.nameEn || '',
      gradeAr: champ.gradeAr || 'الصف الثالث الثانوي',
      titleAr: champ.titleAr || '',
      titleEn: champ.titleEn || '',
      monthAr: champ.monthAr || '',
      monthEn: champ.monthEn || '',
      schoolAr: champ.schoolAr || '',
      schoolEn: champ.schoolEn || '',
      scoreAr: champ.scoreAr || '',
      scoreEn: champ.scoreEn || '',
      rankAr: champ.rankAr || '',
      rankEn: champ.rankEn || '',
      streakAr: champ.streakAr || '',
      streakEn: champ.streakEn || '',
      badgeAr: champ.badgeAr || 'كأس التفوق الشهري',
      badgeEn: champ.badgeEn || 'Monthly Excellence Cup',
      image: champ.image || '/characters/real-male-champ-1.png',
      isPinned: champ.isPinned !== false,
      displayOrder: Number(champ.displayOrder ?? 0),
    });
    setIsModalOpen(true);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast(lang === 'ar' ? 'يُسمح فقط برفع صور JPG أو PNG أو WebP' : 'Only JPG, PNG, or WebP images are allowed', 'error');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      showToast(lang === 'ar' ? 'حجم الصورة يجب ألا يتجاوز 3 ميجابايت' : 'Image size must not exceed 3 MB', 'error');
      return;
    }

    setUploadingPhoto(true);
    try {
      const res = await adminApi.champions.uploadPhoto(file);
      const uploadedUrl = res?.data?.url;
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, image: uploadedUrl }));
        showToast(lang === 'ar' ? 'تم رفع الصورة وتجهيزها للعرض بنجاح' : 'Portrait uploaded successfully');
      }
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر رفع الصورة' : 'Failed to upload photo'), 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveChampion = async (e) => {
    e.preventDefault();
    if (!formData.nameAr.trim()) {
      showToast(lang === 'ar' ? 'يرجى إدخال اسم الطالب المتفوق' : 'Please enter student name', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === 'approve') {
        await adminApi.champions.approveNominee(formData);
        showToast(
          formData.isPinned
            ? (lang === 'ar' ? 'تم اعتماد الطالب وعرضه مباشرة في السلايدر الرئيسي!' : 'Nominee approved & published to homepage slider!')
            : (lang === 'ar' ? 'تم حفظ بيانات الطالب في لوحة الشرف (مخفي مؤقتاً)' : 'Saved to honor roll (hidden)')
        );
      } else if (modalMode === 'edit' && editingChampUuid) {
        await adminApi.champions.update(editingChampUuid, formData);
        showToast(lang === 'ar' ? 'تم تحديث بيانات وصورة البطل بنجاح' : 'Champion details updated successfully');
      } else {
        await adminApi.champions.create(formData);
        showToast(lang === 'ar' ? 'تمت إضافة البطل إلى لوحة الشرف بنجاح' : 'New champion added successfully');
      }

      setIsModalOpen(false);
      emitChampionsSync();
      refreshAllVisible();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر حفظ البيانات' : 'Failed to save champion'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePin = async (uuid) => {
    try {
      await adminApi.champions.togglePin(uuid);
      emitChampionsSync();
      showToast(lang === 'ar' ? 'تم تحديث حالة الظهور في السلايدر الرئيسي' : 'Slider visibility updated');
      refreshAllVisible();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر تحديث التثبيت' : 'Failed to toggle visibility'), 'error');
    }
  };

  const handleConfirmDeleteChampion = async () => {
    if (!championToDelete) return;
    setSubmitting(true);
    try {
      await adminApi.champions.delete(championToDelete.id);
      setChampionToDelete(null);
      emitChampionsSync();
      showToast(lang === 'ar' ? 'تم حذف البطاقة من لوحة الشرف بنجاح' : 'Removed from honor roll');
      refreshAllVisible();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر حذف البطل' : 'Failed to remove champion'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Derived data
  const gradeCatalog = useMemo(() => {
    if (Array.isArray(overview?.grades) && overview.grades.length > 0) {
      return overview.grades;
    }
    return CANONICAL_GRADES.map((g) => ({
      ...g,
      labelAr: g.fullAr,
      studentsCount: 0,
      hasActiveRound: false,
      pinnedChampionsCount: 0,
    }));
  }, [overview]);

  const activeLeague = overview?.league || null;
  const activeRounds = Array.isArray(overview?.activeRounds) ? overview.activeRounds : [];
  const recentRounds = Array.isArray(overview?.recentRounds) ? overview.recentRounds : [];
  const summary = overview?.summary || {
    totalStudents: 0,
    totalStudentsAllGrades: 0,
    activeCompetitors: 0,
    approvedChampions: 0,
    pinnedChampions: 0,
    pendingNominees: 0,
  };

  const getShortGradeLabel = (fullAr) => {
    const match = CANONICAL_GRADES.find((g) => g.value === fullAr);
    return match ? (lang === 'ar' ? match.labelAr : match.labelEn) : fullAr;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: isRtl ? '24px' : 'auto',
            right: isRtl ? 'auto' : '24px',
            backgroundColor: toast.type === 'error' ? '#991B1B' : '#06254E',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '14px',
            boxShadow: '0 14px 36px rgba(6, 37, 78, 0.28)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 10050,
            fontSize: '13.5px',
            fontWeight: '700',
            maxWidth: '440px',
          }}
        >
          {toast.type === 'error' ? <AlertCircle size={18} color="#FCA5A5" /> : <CheckCircle size={18} color="#5CB6DB" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* ─── 1. Executive Republic League Hero Command Center ─── */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-surface)',
          border: activeLeague?.isActive ? '1.5px solid rgba(16, 185, 129, 0.35)' : '1.5px solid var(--border-subtle)',
          borderRadius: '24px',
          boxShadow: '0 8px 30px rgba(6, 37, 78, 0.06)',
        }}
      >
        {/* Top Accent Ribbon */}
        <div
          style={{
            height: '4px',
            width: '100%',
            background: activeLeague?.isActive
              ? 'linear-gradient(90deg, #06254E 0%, #1588C7 45%, #10B981 100%)'
              : 'linear-gradient(90deg, #06254E 0%, #1588C7 60%, #5CB6DB 100%)',
          }}
        />

        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Row A: Title + Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #06254E 0%, #1588C7 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 8px 20px rgba(21, 136, 199, 0.25)',
                }}
              >
                <Crown size={26} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'دوري الجمهورية ولوحة شرف الأوائل' : 'Republic League & Honor Roll'}
                  </h2>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '11.5px',
                      fontWeight: '800',
                      backgroundColor: activeLeague?.isActive ? 'rgba(16, 185, 129, 0.14)' : 'rgba(148, 163, 184, 0.15)',
                      color: activeLeague?.isActive ? '#047857' : 'var(--text-secondary)',
                      border: activeLeague?.isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                    }}
                  >
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: activeLeague?.isActive ? '#10B981' : '#94A3B8',
                      }}
                    />
                    {activeLeague?.isActive
                      ? (lang === 'ar' ? activeLeague.dayProgressLabelAr : activeLeague.dayProgressLabelEn)
                      : (activeLeague
                        ? (lang === 'ar' ? activeLeague.dayProgressLabelAr : activeLeague.dayProgressLabelEn)
                        : (lang === 'ar' ? 'لا توجد جولة نشطة حالياً' : 'No Active Round'))}
                  </span>
                </div>
                <p style={{ margin: '5px 0 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {activeLeague
                    ? (lang === 'ar'
                      ? `${activeLeague.titleAr} • النطاق: ${activeLeague.gradeLabelAr}`
                      : `${activeLeague.titleAr} • Scope: ${activeLeague.gradeLabelEn}`)
                    : (lang === 'ar'
                      ? 'إدارة مواسم دوري الجمهورية (أولى إعدادي ← ثالثة ثانوي)، ترشيح الأول والثاني تلقائياً بالتواصل المباشر، وإعلان انتهاء الدوري للتكريم.'
                      : 'Manage Republic League seasons (1st Prep – 3rd Sec), auto-nominate Top 2 per grade with direct contact, and broadcast honoring announcements.')}
                </p>
              </div>
            </div>

            {/* Action Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {recentRounds.length > 0 && (
                <select
                  value={selectedLeagueUuid}
                  onChange={(e) => {
                    setSelectedLeagueUuid(e.target.value);
                    setNomineesPage(1);
                    setLbPage(1);
                  }}
                  aria-label={lang === 'ar' ? 'اختيار جولة الدوري' : 'Select League Round'}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '11px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    maxWidth: '235px',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">{lang === 'ar' ? 'الجولة الحالية / الأحدث تلقائياً' : 'Current / Latest Round'}</option>
                  {recentRounds.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.isActive ? '● ' : '✓ '}
                      {r.titleAr} ({lang === 'ar' ? `يوم ${r.currentDay}/${r.totalDays}` : `Day ${r.currentDay}/${r.totalDays}`})
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                onClick={refreshAllVisible}
                disabled={overviewLoading}
                title={lang === 'ar' ? 'تحديث البيانات' : 'Refresh'}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '11px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={15} style={{ animation: overviewLoading ? 'spin 1s linear infinite' : 'none' }} />
              </button>

              <button
                type="button"
                onClick={openLaunchLeagueModal}
                disabled={leagueBusy}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '9px 15px',
                  borderRadius: '11px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: leagueBusy ? 'wait' : 'pointer',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.24)',
                }}
              >
                <Play size={14} />
                <span>{lang === 'ar' ? 'إطلاق جولة' : 'Launch Round'}</span>
              </button>

              {activeLeague && (
                <button
                  type="button"
                  onClick={() => openAnnounceEndModal(activeLeague)}
                  disabled={leagueBusy}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '9px 15px',
                    borderRadius: '11px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: leagueBusy ? 'wait' : 'pointer',
                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.28)',
                  }}
                >
                  <Megaphone size={15} />
                  <span>{lang === 'ar' ? 'إعلان انتهاء الدوري والتكريم' : 'Announce End & Honoring'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={openManualAddModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '9px 15px',
                  borderRadius: '11px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(21, 136, 199, 0.25)',
                }}
              >
                <Plus size={16} />
                <span>{lang === 'ar' ? 'إضافة بطل يدوياً' : 'Add Champion'}</span>
              </button>
            </div>
          </div>

          {/* Row B: Active Rounds Day-by-Day Progress Tracker (Shows Day X of Y for EVERY active league!) */}
          {(activeRounds.length > 0 || activeLeague) && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: activeRounds.length > 1
                  ? 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))'
                  : '1fr',
                gap: '12px',
              }}
            >
              {(activeRounds.length > 0 ? activeRounds : [activeLeague]).filter(Boolean).map((round) => {
                const pct = Math.min(100, Math.max(0, Number(round.progressPercent ?? 0)));
                const isRunning = Boolean(round.isActive);
                return (
                  <div
                    key={round.id}
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: isRunning ? '1px solid rgba(21, 136, 199, 0.25)' : '1px solid var(--border-subtle)',
                      borderRadius: '16px',
                      padding: '14px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexWrap: 'wrap' }}>
                        <Calendar size={16} color={isRunning ? 'var(--primary)' : 'var(--text-secondary)'} />
                        <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {round.titleAr}
                        </span>
                        <span
                          style={{
                            padding: '2px 9px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: '700',
                            backgroundColor: 'rgba(21, 136, 199, 0.1)',
                            color: 'var(--primary)',
                          }}
                        >
                          {round.gradeAr ? getShortGradeLabel(round.gradeAr) : (lang === 'ar' ? 'جميع الصفوف' : 'All Grades')}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            padding: '4px 11px',
                            borderRadius: '999px',
                            backgroundColor: isRunning ? 'rgba(21, 136, 199, 0.12)' : 'rgba(148, 163, 184, 0.15)',
                            color: isRunning ? 'var(--primary)' : 'var(--text-secondary)',
                            fontSize: '12px',
                            fontWeight: '800',
                          }}
                        >
                          {lang === 'ar'
                            ? `اليوم ${round.currentDay ?? 0} من ${round.totalDays ?? round.durationDays ?? 30}`
                            : `Day ${round.currentDay ?? 0} of ${round.totalDays ?? round.durationDays ?? 30}`}
                        </span>

                        {isRunning && (
                          <span
                            style={{
                              padding: '4px 11px',
                              borderRadius: '999px',
                              backgroundColor: 'rgba(16, 185, 129, 0.14)',
                              color: '#047857',
                              fontSize: '12px',
                              fontWeight: '800',
                            }}
                          >
                            {lang === 'ar'
                              ? `متبقي ${round.daysRemaining ?? 0} يوم`
                              : `${round.daysRemaining ?? 0} days left`}
                          </span>
                        )}

                        {isRunning && (
                          <button
                            type="button"
                            onClick={() => openAnnounceEndModal(round)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              border: '1px solid rgba(217, 119, 6, 0.35)',
                              backgroundColor: 'rgba(245, 158, 11, 0.12)',
                              color: '#B45309',
                              fontSize: '11.5px',
                              fontWeight: '800',
                              cursor: 'pointer',
                            }}
                          >
                            <Megaphone size={12} />
                            <span>{lang === 'ar' ? 'إعلان انتهاء مبكر' : 'End & Announce'}</span>
                          </button>
                        )}

                        {isRunning && (
                          <button
                            type="button"
                            onClick={() => setConfirmStopRound(round)}
                            title={lang === 'ar' ? 'إيقاف الجولة بدون إعلان' : 'Stop silently'}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 9px',
                              borderRadius: '8px',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              backgroundColor: 'rgba(239, 68, 68, 0.08)',
                              color: '#DC2626',
                              fontSize: '11.5px',
                              fontWeight: '700',
                              cursor: 'pointer',
                            }}
                          >
                            <Square size={11} />
                            <span>{lang === 'ar' ? 'إيقاف' : 'Stop'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '9px',
                          borderRadius: '999px',
                          backgroundColor: 'var(--border-subtle)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            borderRadius: '999px',
                            background: isRunning
                              ? 'linear-gradient(90deg, #1588C7 0%, #10B981 100%)'
                              : 'linear-gradient(90deg, #64748B 0%, #94A3B8 100%)',
                            transition: 'width 0.35s ease',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', minWidth: '38px', textAlign: 'center' }}>
                        {pct}%
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                      <span>
                        {lang === 'ar' ? 'تاريخ البداية: ' : 'Started: '}
                        <strong style={{ color: 'var(--text-primary)' }}>{formatShortDate(round.startsAt, lang)}</strong>
                      </span>
                      <span>
                        {round.endedEarly
                          ? (lang === 'ar' ? 'تم الإنهاء المبكر للتكريم: ' : 'Ended early: ')
                          : (lang === 'ar' ? 'تاريخ الانتهاء: ' : 'Ends: ')}
                        <strong style={{ color: 'var(--text-primary)' }}>{formatShortDate(round.endsAt, lang)}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Row C: 4 Clean Executive KPI Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 195px), 1fr))', gap: '12px' }}>
            {[
              {
                icon: Users,
                color: 'var(--primary)',
                bg: 'rgba(21, 136, 199, 0.1)',
                label: selectedGrade === 'all'
                  ? (lang === 'ar' ? 'طلاب المراحل الست' : 'Students (All 6 Grades)')
                  : (lang === 'ar' ? `طلاب ${getShortGradeLabel(selectedGrade)}` : `${getShortGradeLabel(selectedGrade)} Students`),
                value: summary.totalStudents,
              },
              {
                icon: Flame,
                color: '#EA580C',
                bg: 'rgba(234, 88, 12, 0.1)',
                label: lang === 'ar' ? 'متنافسون حققوا نقاطاً' : 'Scored Competitors',
                value: summary.activeCompetitors,
              },
              {
                icon: Sparkles,
                color: '#D97706',
                bg: 'rgba(245, 158, 11, 0.14)',
                label: lang === 'ar' ? 'أوائل (#1 و #2) بانتظارك' : 'Top-2 Pending Approval',
                value: summary.pendingNominees,
                highlight: summary.pendingNominees > 0,
              },
              {
                icon: Trophy,
                color: '#059669',
                bg: 'rgba(16, 185, 129, 0.12)',
                label: lang === 'ar' ? 'معروضون حالياً بالسلايدر' : 'Live in Homepage Slider',
                value: summary.pinnedChampions,
              },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.label}
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: kpi.highlight ? '1.5px solid rgba(245, 158, 11, 0.45)' : '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    padding: '13px 15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: kpi.bg,
                      color: kpi.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '21px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.15 }}>
                      {Number(kpi.value || 0).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                    </div>
                    <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {kpi.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {overviewError && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '14px',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            color: '#B91C1C',
            fontSize: '13px',
            fontWeight: '700',
          }}
        >
          <span>{overviewError}</span>
          <button
            type="button"
            onClick={refreshAllVisible}
            style={{ backgroundColor: '#B91C1C', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
          >
            {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* ─── 2. 6-Grade Filter Strip (1st Prep → 3rd Secondary) ─── */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '18px',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
            <GraduationCap size={17} color="var(--primary)" />
            <span>{lang === 'ar' ? 'الصفوف الدراسية في دوري الجمهورية (أولى إعدادي ← ثالثة ثانوي)' : 'Republic League Grade Filter (1st Prep – 3rd Sec)'}</span>
          </div>
          {selectedGrade !== 'all' && (
            <button
              type="button"
              onClick={() => handleSelectGrade('all')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
            >
              {lang === 'ar' ? 'عرض جميع الصفوف' : 'Show All Grades'}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleSelectGrade('all')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 14px',
              borderRadius: '11px',
              border: selectedGrade === 'all' ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
              backgroundColor: selectedGrade === 'all' ? 'var(--primary)' : 'var(--bg-subtle)',
              color: selectedGrade === 'all' ? '#FFFFFF' : 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{lang === 'ar' ? 'جميع الصفوف' : 'All Grades'}</span>
            <span
              style={{
                padding: '1px 7px',
                borderRadius: '999px',
                fontSize: '11px',
                backgroundColor: selectedGrade === 'all' ? 'rgba(255,255,255,0.22)' : 'var(--bg-surface)',
                color: selectedGrade === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              {summary.totalStudentsAllGrades ?? 0}
            </span>
          </button>

          {gradeCatalog.map((g) => {
            const isSelected = selectedGrade === g.value;
            return (
              <button
                key={g.value}
                type="button"
                onClick={() => handleSelectGrade(g.value)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 13px',
                  borderRadius: '11px',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {g.hasDedicatedRound && (
                  <span
                    title={lang === 'ar' ? 'دوري خاص نشط لهذا الصف' : 'Dedicated active round'}
                    style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: isSelected ? '#A7F3D0' : '#10B981' }}
                  />
                )}
                <span>{getShortGradeLabel(g.value)}</span>
                <span
                  style={{
                    padding: '1px 7px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.22)' : 'var(--bg-surface)',
                    color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  {g.studentsCount ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 3. Segmented Sub-Tabs ─── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '7px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {[
          {
            id: 'nominees',
            icon: Sparkles,
            labelAr: 'أوائل الجمهورية للاعتماد (#1 و #2)',
            labelEn: 'Top-2 Auto Nominees (#1 & #2)',
            badge: summary.pendingNominees > 0 ? summary.pendingNominees : null,
            badgeTone: 'amber',
          },
          {
            id: 'leaderboard',
            icon: Medal,
            labelAr: 'ترتيب دوري الجمهورية الكامل',
            labelEn: 'Live League Standings',
            badge: summary.totalStudents > 0 ? summary.totalStudents : null,
            badgeTone: 'neutral',
          },
          {
            id: 'slider',
            icon: Trophy,
            labelAr: 'لوحة الشرف (السلايدر الرئيسي)',
            labelEn: 'Homepage Slider Champions',
            badge: summary.pinnedChampions > 0 ? summary.pinnedChampions : null,
            badgeTone: 'emerald',
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: '1 1 210px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px 16px',
                borderRadius: '12px',
                border: active ? '1px solid rgba(21, 136, 199, 0.35)' : '1px solid transparent',
                backgroundColor: active ? 'rgba(21, 136, 199, 0.1)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
              {tab.badge !== null && (
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: '800',
                    backgroundColor:
                      tab.badgeTone === 'amber'
                        ? 'rgba(245, 158, 11, 0.18)'
                        : tab.badgeTone === 'emerald'
                          ? 'rgba(16, 185, 129, 0.16)'
                          : 'var(--bg-subtle)',
                    color:
                      tab.badgeTone === 'amber'
                        ? '#B45309'
                        : tab.badgeTone === 'emerald'
                          ? '#047857'
                          : 'var(--text-secondary)',
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: TOP-2 AUTO-NOMINEES (#1 & #2 ONLY) WITH EMAIL, PHONE & WHATSAPP */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'nominees' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '14px 18px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
            }}
          >
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              <strong style={{ color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'ترشيح المركز الأول والثاني فقط من كل صف: ' : 'Top-2 Only Per Grade (#1 & #2): '}
              </strong>
              {lang === 'ar'
                ? 'تظهر بيانات التواصل (الإيميل ورقم الهاتف) مباشرة لطلب صورة شخصية مناسبة من الطالب قبل تعديل البطاقة والموافقة على عرضها في السلايدر.'
                : 'Email and phone are shown directly so you can request a crisp portrait from each winner before publishing to the homepage slider.'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                { id: 'pending', labelAr: 'بانتظار الموافقة', labelEn: 'Pending' },
                { id: 'approved', labelAr: 'تم اعتماده', labelEn: 'Approved' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setNomineeStatusFilter(st.id);
                    setNomineesPage(1);
                  }}
                  style={{
                    padding: '7px 13px',
                    borderRadius: '9px',
                    border: nomineeStatusFilter === st.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: nomineeStatusFilter === st.id ? 'var(--primary)' : 'var(--bg-subtle)',
                    color: nomineeStatusFilter === st.id ? '#FFFFFF' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {lang === 'ar' ? st.labelAr : st.labelEn}
                </button>
              ))}
            </div>
          </div>

          {nomineesLoading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)', borderRadius: '18px', border: '1px solid var(--border-subtle)' }}>
              {lang === 'ar' ? 'جاري رصد أوائل دوري الجمهورية (الأول والثاني)...' : 'Detecting Top-2 Republic League nominees...'}
            </div>
          ) : nominees.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)', borderRadius: '18px', border: '1px solid var(--border-subtle)' }}>
              <Crown size={36} style={{ opacity: 0.35, marginBottom: '10px' }} />
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {lang === 'ar' ? 'لا يوجد مرشحون مطابقون لهذا الفلتر حالياً' : 'No matching Top-2 nominees found'}
              </div>
              <div style={{ fontSize: '13px' }}>
                {lang === 'ar'
                  ? 'جرّب اختيار "جميع الصفوف" أو تغيير حالة الفلتر، أو أطلق جولة جديدة من دوري الجمهورية.'
                  : 'Try switching to All Grades or changing the status filter.'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '18px' }}>
              {nominees.map((entry) => {
                const rankVis = getRankVisual(entry.rank);
                const isApprovedPinned = entry.approvalStatus === 'approved_pinned';
                const isApprovedHidden = entry.approvalStatus === 'approved_hidden';
                const tierStyle = TIER_STYLES[entry.tier] || TIER_STYLES.bronze;
                const displayImg = entry.existingChampion?.image || entry.avatar;
                const contactPhone = entry.phone || entry.parentPhone || null;
                const isParentPhone = !entry.phone && Boolean(entry.parentPhone);
                const waUrl = buildWhatsAppLink(contactPhone, entry.name, entry.rank, entry.gradeAr);
                const mailUrl = buildMailtoLink(entry.email, entry.name, entry.rank, entry.gradeAr);

                return (
                  <div
                    key={`${entry.studentId}-${entry.gradeAr}`}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: isApprovedPinned
                        ? '1.5px solid rgba(16, 185, 129, 0.45)'
                        : `1.5px solid ${rankVis.border}`,
                      borderRadius: '20px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: entry.rank === 1
                        ? '0 10px 28px rgba(245, 158, 11, 0.1)'
                        : '0 6px 20px rgba(6, 37, 78, 0.05)',
                    }}
                  >
                    {/* Top Podium Strip */}
                    <div
                      style={{
                        padding: '11px 16px',
                        backgroundColor: isApprovedPinned ? 'rgba(16, 185, 129, 0.08)' : rankVis.softBg,
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            background: rankVis.bg,
                            color: rankVis.color,
                            fontSize: '11.5px',
                            fontWeight: '800',
                            flexShrink: 0,
                          }}
                        >
                          {entry.rank === 1 ? <Crown size={12} /> : <Medal size={12} />}
                          <span>{lang === 'ar' ? rankVis.titleAr : rankVis.titleEn}</span>
                        </span>
                        <span
                          style={{
                            fontSize: '11.5px',
                            fontWeight: '800',
                            color: 'var(--primary)',
                            backgroundColor: 'rgba(21, 136, 199, 0.1)',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {getShortGradeLabel(entry.gradeAr)}
                        </span>
                      </div>

                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: '800',
                          flexShrink: 0,
                          backgroundColor: isApprovedPinned
                            ? 'rgba(16, 185, 129, 0.15)'
                            : isApprovedHidden
                              ? 'rgba(100, 116, 139, 0.15)'
                              : 'rgba(245, 158, 11, 0.16)',
                          color: isApprovedPinned ? '#047857' : isApprovedHidden ? '#475569' : '#B45309',
                        }}
                      >
                        {isApprovedPinned ? (
                          <>
                            <CheckCircle2 size={12} />
                            <span>{lang === 'ar' ? 'معروض بالسلايدر' : 'Live on Slider'}</span>
                          </>
                        ) : isApprovedHidden ? (
                          <>
                            <EyeOff size={12} />
                            <span>{lang === 'ar' ? 'معتمد (مخفي)' : 'Approved (Hidden)'}</span>
                          </>
                        ) : (
                          <>
                            <Clock size={12} />
                            <span>{lang === 'ar' ? 'بانتظار الموافقة' : 'Pending Approval'}</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Student Identity */}
                    <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '68px',
                          height: '68px',
                          borderRadius: '18px',
                          overflow: 'hidden',
                          border: `2.5px solid ${rankVis.ring}`,
                          backgroundColor: 'var(--bg-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '21px',
                          fontWeight: '800',
                          color: 'var(--primary)',
                        }}
                      >
                        {displayImg ? (
                          <img
                            src={displayImg}
                            alt={entry.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <span>{getInitials(entry.name)}</span>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {entry.name}
                        </div>
                        <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          <span style={{ fontFamily: 'monospace' }}>{entry.studentCode}</span>
                          {entry.trackAr ? ` • ${entry.trackAr}` : ''}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <School size={13} style={{ flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.schoolDisplay}</span>
                        </div>
                      </div>
                    </div>

                    {/* Score / Streak / Tier Row */}
                    <div
                      style={{
                        margin: '0 16px 12px',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-subtle)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '8px',
                        textAlign: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary)' }}>
                          {Number(entry.xpPoints || 0).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                          {lang === 'ar' ? 'نقطة XP' : 'XP Points'}
                        </div>
                      </div>
                      <div style={{ borderInline: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#D97706' }}>
                          {entry.streakDays || 0}
                        </div>
                        <div style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                          {lang === 'ar' ? 'يوم استريك' : 'Streak'}
                        </div>
                      </div>
                      <div>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 9px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '800',
                            backgroundColor: tierStyle.bg,
                            color: tierStyle.color,
                            border: `1px solid ${tierStyle.border}`,
                          }}
                        >
                          {entry.tierLabelAr}
                        </span>
                      </div>
                    </div>

                    {/* Direct Admin Contact Box (Email & Phone to request a clear photo!) */}
                    <div
                      style={{
                        margin: '0 16px 14px',
                        padding: '11px 13px',
                        borderRadius: '13px',
                        backgroundColor: 'rgba(21, 136, 199, 0.05)',
                        border: '1px solid rgba(21, 136, 199, 0.18)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{lang === 'ar' ? 'بيانات التواصل لطلب صورة شخصية مناسبة' : 'Direct Contact (Request Portrait)'}</span>
                      </div>

                      {/* Email Row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0, flex: 1 }}>
                          <Mail size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                          <span
                            dir="ltr"
                            style={{
                              fontSize: '12px',
                              fontWeight: '700',
                              color: entry.email ? 'var(--text-primary)' : 'var(--text-secondary)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {entry.email || (lang === 'ar' ? 'لا يوجد إيميل مسجل' : 'No email')}
                          </span>
                        </div>
                        {entry.email && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={() => handleCopy(entry.email, `email-${entry.studentId}`, lang === 'ar' ? 'البريد الإلكتروني' : 'Email')}
                              title={lang === 'ar' ? 'نسخ الإيميل' : 'Copy Email'}
                              style={{
                                width: '27px',
                                height: '27px',
                                borderRadius: '7px',
                                border: '1px solid var(--border-subtle)',
                                backgroundColor: 'var(--bg-surface)',
                                color: copiedKey === `email-${entry.studentId}` ? '#059669' : 'var(--text-secondary)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              {copiedKey === `email-${entry.studentId}` ? <Check size={13} /> : <Copy size={13} />}
                            </button>
                            {mailUrl && (
                              <a
                                href={mailUrl}
                                title={lang === 'ar' ? 'إرسال بريد بطلب صورة' : 'Send email'}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '7px',
                                  border: '1px solid rgba(21, 136, 199, 0.3)',
                                  backgroundColor: 'var(--bg-surface)',
                                  color: 'var(--primary)',
                                  fontSize: '11px',
                                  fontWeight: '800',
                                  textDecoration: 'none',
                                }}
                              >
                                {lang === 'ar' ? 'مراسلة' : 'Mail'}
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Phone Row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0, flex: 1 }}>
                          <Phone size={14} color="#059669" style={{ flexShrink: 0 }} />
                          <span
                            dir="ltr"
                            style={{
                              fontSize: '12.5px',
                              fontWeight: '800',
                              color: contactPhone ? 'var(--text-primary)' : 'var(--text-secondary)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {contactPhone || (lang === 'ar' ? 'لا يوجد رقم هاتف مسجل' : 'No phone')}
                          </span>
                          {isParentPhone && (
                            <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                              ({lang === 'ar' ? 'ولي الأمر' : 'Parent'})
                            </span>
                          )}
                        </div>
                        {contactPhone && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={() => handleCopy(contactPhone, `phone-${entry.studentId}`, lang === 'ar' ? 'رقم الهاتف' : 'Phone')}
                              title={lang === 'ar' ? 'نسخ الرقم' : 'Copy Phone'}
                              style={{
                                width: '27px',
                                height: '27px',
                                borderRadius: '7px',
                                border: '1px solid var(--border-subtle)',
                                backgroundColor: 'var(--bg-surface)',
                                color: copiedKey === `phone-${entry.studentId}` ? '#059669' : 'var(--text-secondary)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              {copiedKey === `phone-${entry.studentId}` ? <Check size={13} /> : <Copy size={13} />}
                            </button>
                            {waUrl && (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={lang === 'ar' ? 'طلب صورة عبر واتساب' : 'Request photo on WhatsApp'}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '4px 9px',
                                  borderRadius: '7px',
                                  backgroundColor: '#16A34A',
                                  color: '#FFFFFF',
                                  fontSize: '11px',
                                  fontWeight: '800',
                                  textDecoration: 'none',
                                }}
                              >
                                <MessageCircle size={12} />
                                <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div
                      style={{
                        marginTop: 'auto',
                        padding: '12px 16px',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => openApproveNomineeModal(entry)}
                        style={{
                          flex: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '7px',
                          padding: '10px 14px',
                          borderRadius: '11px',
                          border: 'none',
                          backgroundColor: isApprovedPinned ? 'rgba(21, 136, 199, 0.12)' : 'var(--primary)',
                          color: isApprovedPinned ? 'var(--primary)' : '#FFFFFF',
                          fontSize: '13px',
                          fontWeight: '800',
                          cursor: 'pointer',
                        }}
                      >
                        {isApprovedPinned ? <Edit3 size={14} /> : <CheckCircle size={15} />}
                        <span>
                          {isApprovedPinned
                            ? (lang === 'ar' ? 'تعديل البيانات والصورة' : 'Edit Card & Photo')
                            : (lang === 'ar' ? 'مراجعة وتعديل والموافقة للسلايدر' : 'Review, Edit & Approve')}
                        </span>
                      </button>

                      {entry.championUuid && (
                        <button
                          type="button"
                          onClick={() => handleTogglePin(entry.championUuid)}
                          title={isApprovedPinned ? (lang === 'ar' ? 'إخفاء من السلايدر' : 'Hide from Slider') : (lang === 'ar' ? 'إظهار بالسلايدر' : 'Show on Slider')}
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '11px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-subtle)',
                            color: isApprovedPinned ? '#047857' : 'var(--text-secondary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                        >
                          {isApprovedPinned ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <PaginationBar
            meta={nomineesMeta}
            onPageChange={setNomineesPage}
            perPage={nomineesPerPage}
            onPerPageChange={(n) => {
              setNomineesPerPage(n);
              setNomineesPage(1);
            }}
            perPageOptions={[6, 12, 24]}
            lang={lang}
            isRtl={isRtl}
          />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: LIVE REPUBLIC LEAGUE STANDINGS TABLE WITH CONTACT & PAGINATION  */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'leaderboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '14px 16px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '430px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: isRtl ? '12px' : 'auto',
                  left: isRtl ? 'auto' : '12px',
                  color: 'var(--text-secondary)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={lbSearchInput}
                onChange={(e) => setLbSearchInput(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث بالاسم، الكود، الإيميل، الهاتف، أو المدرسة...' : 'Search name, code, email, phone, or school...'}
                style={{
                  width: '100%',
                  padding: isRtl ? '10px 38px 10px 14px' : '10px 14px 10px 38px',
                  borderRadius: '11px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: lbOnlyScored ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: lbOnlyScored ? 'rgba(21, 136, 199, 0.1)' : 'var(--bg-subtle)',
                  color: lbOnlyScored ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={lbOnlyScored}
                  onChange={(e) => {
                    setLbOnlyScored(e.target.checked);
                    setLbPage(1);
                  }}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <span>{lang === 'ar' ? 'الحاصلون على نقاط فقط' : 'Scored only'}</span>
              </label>

              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {leaderboardMeta?.pagination?.total !== undefined
                  ? (lang === 'ar'
                    ? `${leaderboardMeta.pagination.total.toLocaleString('ar-EG')} طالب في الترتيب`
                    : `${leaderboardMeta.pagination.total.toLocaleString()} students ranked`)
                  : ''}
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '18px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '940px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                    {[
                      lang === 'ar' ? 'الترتيب' : 'Rank',
                      lang === 'ar' ? 'الطالب' : 'Student',
                      lang === 'ar' ? 'التواصل (إيميل / هاتف)' : 'Contact',
                      lang === 'ar' ? 'الصف الدراسي' : 'Grade',
                      lang === 'ar' ? 'المدرسة / المحافظة' : 'School',
                      lang === 'ar' ? 'النقاط والمستوى' : 'XP & Tier',
                      lang === 'ar' ? 'الامتحانات / الاستريك' : 'Exams / Streak',
                      lang === 'ar' ? 'إجراء' : 'Action',
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '13px 14px',
                          textAlign: isRtl ? 'right' : 'left',
                          fontSize: '12px',
                          fontWeight: '800',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaderboardLoading ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '44px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13.5px' }}>
                        {lang === 'ar' ? 'جاري تحميل جدول ترتيب دوري الجمهورية...' : 'Loading Republic League standings...'}
                      </td>
                    </tr>
                  ) : leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '44px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13.5px' }}>
                        {lang === 'ar' ? 'لا يوجد طلاب مطابقون لمعايير البحث أو الصف المحدد' : 'No students match the selected grade or search query'}
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((row) => {
                      const rankVis = getRankVisual(row.rank);
                      const tierStyle = TIER_STYLES[row.tier] || TIER_STYLES.bronze;
                      const isPinned = row.approvalStatus === 'approved_pinned';
                      const contactPhone = row.phone || row.parentPhone || null;

                      return (
                        <tr
                          key={row.studentId}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            backgroundColor: row.rank <= 2 ? 'rgba(245, 158, 11, 0.045)' : 'transparent',
                          }}
                        >
                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '34px',
                                height: '28px',
                                padding: '0 8px',
                                borderRadius: '9px',
                                background: rankVis.bg,
                                color: rankVis.color,
                                fontSize: '12px',
                                fontWeight: '800',
                              }}
                            >
                              {rankVis.label}
                            </span>
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div
                                style={{
                                  width: '38px',
                                  height: '38px',
                                  borderRadius: '11px',
                                  overflow: 'hidden',
                                  backgroundColor: 'var(--bg-subtle)',
                                  border: '1px solid var(--border-subtle)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '13px',
                                  fontWeight: '800',
                                  color: 'var(--primary)',
                                  flexShrink: 0,
                                }}
                              >
                                {row.avatar ? (
                                  <img
                                    src={row.avatar}
                                    alt={row.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <span>{getInitials(row.name)}</span>
                                )}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                                  {row.name}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                                  {row.studentCode}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '12px 14px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '215px' }}>
                              {row.email && (
                                <button
                                  type="button"
                                  onClick={() => handleCopy(row.email, `lb-email-${row.studentId}`, lang === 'ar' ? 'الإيميل' : 'Email')}
                                  title={lang === 'ar' ? 'اضغط للنسخ' : 'Click to copy'}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    color: 'var(--text-primary)',
                                    fontSize: '11.5px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textAlign: 'start',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  <Mail size={12} color="var(--primary)" style={{ flexShrink: 0 }} />
                                  <span dir="ltr" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.email}</span>
                                </button>
                              )}
                              {contactPhone && (
                                <button
                                  type="button"
                                  onClick={() => handleCopy(contactPhone, `lb-phone-${row.studentId}`, lang === 'ar' ? 'الهاتف' : 'Phone')}
                                  title={lang === 'ar' ? 'اضغط للنسخ' : 'Click to copy'}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    color: '#047857',
                                    fontSize: '11.5px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    textAlign: 'start',
                                  }}
                                >
                                  <Phone size={12} style={{ flexShrink: 0 }} />
                                  <span dir="ltr">{contactPhone}</span>
                                </button>
                              )}
                              {!row.email && !contactPhone && (
                                <span style={{ color: 'var(--text-secondary)', fontSize: '11.5px' }}>—</span>
                              )}
                            </div>
                          </td>

                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(21, 136, 199, 0.1)',
                                color: 'var(--primary)',
                                fontSize: '11.5px',
                                fontWeight: '700',
                              }}
                            >
                              {getShortGradeLabel(row.gradeAr)}
                            </span>
                          </td>

                          <td style={{ padding: '12px 14px', fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '175px' }}>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {row.schoolDisplay}
                            </div>
                          </td>

                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                              {Number(row.xpPoints || 0).toLocaleString()} <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>XP</span>
                            </div>
                            <span
                              style={{
                                display: 'inline-block',
                                marginTop: '3px',
                                padding: '2px 7px',
                                borderRadius: '6px',
                                fontSize: '10.5px',
                                fontWeight: '800',
                                backgroundColor: tierStyle.bg,
                                color: tierStyle.color,
                              }}
                            >
                              {row.tierLabelAr}
                            </span>
                          </td>

                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap', fontSize: '12px' }}>
                            <div style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
                              {row.examsSolved} {lang === 'ar' ? 'امتحان' : 'exams'}
                              {row.perfectExams > 0 && <span style={{ color: '#059669', marginInlineStart: '4px' }}>({row.perfectExams}★)</span>}
                            </div>
                            <div style={{ color: '#D97706', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                              <Flame size={12} />
                              <span>{row.streakDays} {lang === 'ar' ? 'يوم' : 'd'}</span>
                            </div>
                          </td>

                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            <button
                              type="button"
                              onClick={() => openApproveNomineeModal(row)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '7px 12px',
                                borderRadius: '9px',
                                border: isPinned ? '1px solid rgba(16, 185, 129, 0.35)' : 'none',
                                backgroundColor: isPinned ? 'rgba(16, 185, 129, 0.12)' : 'var(--primary)',
                                color: isPinned ? '#047857' : '#FFFFFF',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                              }}
                            >
                              {isPinned ? <Edit3 size={13} /> : <CheckCircle size={13} />}
                              <span>{isPinned ? (lang === 'ar' ? 'معروض • تعديل' : 'Live • Edit') : (lang === 'ar' ? 'اعتماد للسلايدر' : 'Approve')}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <PaginationBar
            meta={leaderboardMeta}
            onPageChange={setLbPage}
            perPage={lbPerPage}
            onPerPageChange={(n) => {
              setLbPerPage(n);
              setLbPage(1);
            }}
            perPageOptions={[15, 25, 50]}
            lang={lang}
            isRtl={isRtl}
          />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: APPROVED HOMEPAGE SLIDER CHAMPIONS WITH FILTERS & PAGINATION    */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'slider' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '14px 16px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '380px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: isRtl ? '12px' : 'auto',
                  left: isRtl ? 'auto' : '12px',
                  color: 'var(--text-secondary)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={champSearchInput}
                onChange={(e) => setChampSearchInput(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث باسم البطل أو المدرسة أو الدوري...' : 'Search champion name, school, or league...'}
                style={{
                  width: '100%',
                  padding: isRtl ? '10px 38px 10px 14px' : '10px 14px 10px 38px',
                  borderRadius: '11px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <SlidersHorizontal size={15} color="var(--text-secondary)" />
              <select
                value={champPinnedFilter}
                onChange={(e) => {
                  setChampPinnedFilter(e.target.value);
                  setChampPage(1);
                }}
                style={{
                  padding: '8px 11px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                }}
              >
                <option value="all">{lang === 'ar' ? 'كل الحالات' : 'All Visibility'}</option>
                <option value="pinned">{lang === 'ar' ? 'معروض في السلايدر' : 'Pinned (Live)'}</option>
                <option value="hidden">{lang === 'ar' ? 'مخفي' : 'Hidden'}</option>
              </select>

              <select
                value={champSourceFilter}
                onChange={(e) => {
                  setChampSourceFilter(e.target.value);
                  setChampPage(1);
                }}
                style={{
                  padding: '8px 11px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                }}
              >
                <option value="all">{lang === 'ar' ? 'كل المصادر' : 'All Sources'}</option>
                <option value="republic_league">{lang === 'ar' ? 'معتمد من دوري الجمهورية' : 'From Republic League'}</option>
                <option value="manual">{lang === 'ar' ? 'إضافة يدوية' : 'Manual Entry'}</option>
              </select>
            </div>
          </div>

          {championsLoading ? (
            <div style={{ padding: '44px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)', borderRadius: '18px', border: '1px solid var(--border-subtle)' }}>
              {lang === 'ar' ? 'جاري تحميل لوحة الشرف...' : 'Loading honor roll...'}
            </div>
          ) : champions.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)', borderRadius: '18px', border: '1px solid var(--border-subtle)' }}>
              <Trophy size={36} style={{ opacity: 0.35, marginBottom: '10px' }} />
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {lang === 'ar' ? 'لا يوجد أبطال مطابقون للفلتر الحالي' : 'No champions found'}
              </div>
              <div style={{ fontSize: '13px' }}>
                {lang === 'ar'
                  ? 'يمكنك اعتماد أحد أوائل دوري الجمهورية مباشرة أو الضغط على "إضافة بطل يدوياً".'
                  : 'Approve Top-2 Republic League nominees or click Add Champion to get started.'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '18px' }}>
              {champions.map((champ) => {
                const isPinned = champ.isPinned !== false;
                return (
                  <div
                    key={champ.id}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: isPinned ? '1.5px solid rgba(21, 136, 199, 0.35)' : '1px solid var(--border-subtle)',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      boxShadow: isPinned ? '0 6px 22px rgba(21, 136, 199, 0.08)' : 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 14px',
                        backgroundColor: isPinned ? 'rgba(21, 136, 199, 0.08)' : 'var(--bg-subtle)',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        fontSize: '11.5px',
                        fontWeight: '700',
                      }}
                    >
                      <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Award size={14} style={{ flexShrink: 0 }} />
                        <span>{(lang === 'ar' ? champ.badgeAr : champ.badgeEn) || (lang === 'ar' ? 'كأس التفوق الشهري' : 'Monthly Excellence Cup')}</span>
                      </span>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '999px',
                          backgroundColor: isPinned ? 'rgba(16, 185, 129, 0.14)' : 'rgba(148, 163, 184, 0.16)',
                          color: isPinned ? '#047857' : 'var(--text-secondary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          flexShrink: 0,
                        }}
                      >
                        {isPinned ? <Eye size={11} /> : <EyeOff size={11} />}
                        {isPinned ? (lang === 'ar' ? 'معروض بالسلايدر' : 'Live') : (lang === 'ar' ? 'مخفي' : 'Hidden')}
                      </span>
                    </div>

                    <div style={{ padding: '18px 16px 14px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div
                        style={{
                          position: 'relative',
                          width: '74px',
                          height: '74px',
                          borderRadius: '18px',
                          overflow: 'hidden',
                          border: '2px solid var(--primary)',
                          flexShrink: 0,
                          backgroundColor: 'var(--bg-subtle)',
                        }}
                      >
                        <img
                          src={champ.image || '/characters/real-male-champ-1.png'}
                          alt={lang === 'ar' ? champ.nameAr : (champ.nameEn || champ.nameAr)}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = '/characters/real-male-champ-1.png';
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: isRtl ? '2px' : 'auto',
                            left: isRtl ? 'auto' : '2px',
                            backgroundColor: '#EAB308',
                            color: '#000',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Trophy size={11} color="#000" />
                        </div>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ margin: '0 0 4px', fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lang === 'ar' ? champ.nameAr : (champ.nameEn || champ.nameAr)}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '5px' }}>
                          {champ.gradeAr && (
                            <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(21, 136, 199, 0.1)', color: 'var(--primary)' }}>
                              {getShortGradeLabel(champ.gradeAr)}
                            </span>
                          )}
                          {champ.source === 'republic_league' && (
                            <span style={{ fontSize: '10.5px', fontWeight: '700', padding: '2px 7px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.14)', color: '#B45309' }}>
                              {lang === 'ar' ? 'دوري الجمهورية' : 'Republic League'}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <School size={13} style={{ flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{lang === 'ar' ? champ.schoolAr : (champ.schoolEn || champ.schoolAr)}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        margin: '0 16px 14px',
                        padding: '9px 12px',
                        backgroundColor: 'var(--bg-subtle)',
                        borderRadius: '11px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: '700' }}>
                        <Sparkles size={13} />
                        <span>{lang === 'ar' ? (champ.scoreAr || '—') : (champ.scoreEn || champ.scoreAr || '—')}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D97706', fontWeight: '700' }}>
                        <Flame size={13} />
                        <span>{lang === 'ar' ? (champ.streakAr || '—') : (champ.streakEn || champ.streakAr || '—')}</span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }}>
                        {lang === 'ar' ? (champ.rankAr || champ.monthAr || '—') : (champ.rankEn || champ.monthEn || '—')}
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 'auto',
                        padding: '11px 16px',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleTogglePin(champ.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: isPinned ? 'rgba(21, 136, 199, 0.1)' : 'var(--bg-subtle)',
                          color: isPinned ? 'var(--primary)' : 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        <Pin size={13} style={{ transform: isPinned ? 'rotate(45deg)' : 'none' }} />
                        <span>{isPinned ? (lang === 'ar' ? 'مثبت بالسلايدر' : 'Pinned') : (lang === 'ar' ? 'عرض بالسلايدر' : 'Pin')}</span>
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => openEditChampionModal(champ)}
                          title={lang === 'ar' ? 'تعديل البيانات والصورة' : 'Edit'}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)',
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setChampionToDelete({ id: champ.id, name: lang === 'ar' ? champ.nameAr : (champ.nameEn || champ.nameAr) })}
                          title={lang === 'ar' ? 'حذف' : 'Delete'}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--color-danger)',
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <PaginationBar
            meta={championsMeta}
            onPageChange={setChampPage}
            perPage={champPerPage}
            onPerPageChange={(n) => {
              setChampPerPage(n);
              setChampPage(1);
            }}
            perPageOptions={[9, 12, 24]}
            lang={lang}
            isRtl={isRtl}
          />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 1: REVIEW / APPROVE / EDIT CHAMPION + CONTACT + PHOTO UPLOAD     */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 37, 78, 0.62)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '18px',
          }}
        >
          <div
            className="responsive-modal-box"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '790px',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '26px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(21, 136, 199, 0.12)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {modalMode === 'approve' ? <CheckCircle2 size={20} /> : <Trophy size={20} />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {modalMode === 'approve'
                      ? (lang === 'ar' ? 'مراجعة وتعديل واعتماد بطل دوري الجمهورية للسلايدر' : 'Review, Customize & Approve for Homepage Slider')
                      : modalMode === 'edit'
                        ? (lang === 'ar' ? 'تعديل بيانات وصورة البطل' : 'Edit Champion Details & Photo')
                        : (lang === 'ar' ? 'إضافة بطل متفوق يدوياً' : 'Add Champion Manually')}
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar'
                      ? 'يمكنك التواصل مع الطالب لطلب صورة جديدة، تعديل أي بيانات نصية، أو رفع صورة مناسبة قبل النشر'
                      : 'Contact the student for a portrait, edit text fields, or upload a clean photo before publishing'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Student Contact Strip inside Modal */}
            {modalContactInfo && (modalContactInfo.email || modalContactInfo.phone) && (
              <div
                style={{
                  marginBottom: '16px',
                  padding: '12px 15px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(21, 136, 199, 0.07)',
                  border: '1px solid rgba(21, 136, 199, 0.22)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '12.5px' }}>
                  {modalContactInfo.email && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      <Mail size={14} color="var(--primary)" />
                      <span dir="ltr">{modalContactInfo.email}</span>
                    </span>
                  )}
                  {modalContactInfo.phone && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '800', color: '#047857' }}>
                      <Phone size={14} />
                      <span dir="ltr">{modalContactInfo.phone}</span>
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {modalContactInfo.phone && (
                    <a
                      href={buildWhatsAppLink(modalContactInfo.phone, modalContactInfo.name, modalContactInfo.rank, modalContactInfo.gradeAr)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 11px',
                        borderRadius: '9px',
                        backgroundColor: '#16A34A',
                        color: '#FFFFFF',
                        fontSize: '11.5px',
                        fontWeight: '800',
                        textDecoration: 'none',
                      }}
                    >
                      <MessageCircle size={13} />
                      <span>{lang === 'ar' ? 'طلب صورة عبر واتساب' : 'Request Photo (WhatsApp)'}</span>
                    </a>
                  )}
                  {modalContactInfo.email && (
                    <a
                      href={buildMailtoLink(modalContactInfo.email, modalContactInfo.name, modalContactInfo.rank, modalContactInfo.gradeAr)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 11px',
                        borderRadius: '9px',
                        border: '1px solid rgba(21, 136, 199, 0.3)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--primary)',
                        fontSize: '11.5px',
                        fontWeight: '800',
                        textDecoration: 'none',
                      }}
                    >
                      <Mail size={13} />
                      <span>{lang === 'ar' ? 'إرسال إيميل' : 'Send Email'}</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveChampion} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Live Slider Card Preview + Photo Uploader */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: '18px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-subtle)',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--primary)' }}>
                    <span>{lang === 'ar' ? 'معاينة حية للسلايدر' : 'Live Slider Preview'}</span>
                    <span>{formData.monthAr || 'دوري الجمهورية'}</span>
                  </div>
                  <div
                    style={{
                      width: '118px',
                      height: '118px',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '2.5px solid var(--primary)',
                      backgroundColor: 'var(--bg-subtle)',
                      boxShadow: '0 8px 20px rgba(21, 136, 199, 0.16)',
                    }}
                  >
                    <img
                      src={formData.image || '/characters/real-male-champ-1.png'}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = '/characters/real-male-champ-1.png';
                      }}
                    />
                  </div>
                  <div style={{ width: '100%' }}>
                    <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {formData.nameAr || (lang === 'ar' ? 'اسم الطالب المتفوق' : 'Champion Name')}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {[formData.gradeAr ? getShortGradeLabel(formData.gradeAr) : '', formData.schoolAr].filter(Boolean).join(' • ')}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(21, 136, 199, 0.12)', color: 'var(--primary)' }}>
                        {formData.scoreAr || '0 نقطة'}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.14)', color: '#B45309' }}>
                        {formData.rankAr || 'المركز الأول'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                  <label style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ImageIcon size={15} color="var(--primary)" />
                    <span>{lang === 'ar' ? 'تخصيص صورة الطالب للعرض' : 'Customize Display Portrait'}</span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />

                  <button
                    type="button"
                    disabled={uploadingPhoto}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      border: '1.5px dashed var(--primary)',
                      backgroundColor: 'rgba(21, 136, 199, 0.08)',
                      color: 'var(--primary)',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: uploadingPhoto ? 'wait' : 'pointer',
                    }}
                  >
                    <Upload size={16} />
                    <span>
                      {uploadingPhoto
                        ? (lang === 'ar' ? 'جاري رفع وفحص الصورة...' : 'Uploading & verifying...')
                        : (lang === 'ar' ? 'رفع صورة مناسبة من جهازك (JPG / PNG / WebP)' : 'Upload Portrait from Device (Max 3MB)')}
                    </span>
                  </button>

                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/storage/champions/... أو /characters/real-male-champ-1.png"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      direction: 'ltr',
                    }}
                  />

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {PRESET_AVATARS.map((preset) => {
                      const isSelected = formData.image === preset.src;
                      return (
                        <button
                          type="button"
                          key={preset.id}
                          onClick={() => setFormData({ ...formData, image: preset.src })}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 8px',
                            borderRadius: '9px',
                            border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                            backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-surface)',
                            cursor: 'pointer',
                          }}
                        >
                          <img src={preset.src} alt={preset.label} style={{ width: '22px', height: '22px', borderRadius: '6px', objectFit: 'cover' }} />
                          <span style={{ fontSize: '11px', fontWeight: isSelected ? '800' : '600', color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                            {lang === 'ar' ? (preset.labelAr || preset.label) : (preset.labelEn || preset.label)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="responsive-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                    {lang === 'ar' ? 'اسم الطالب (عربي)' : 'Student Name (AR)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                    {lang === 'ar' ? 'اسم الطالب (إنجليزي)' : 'Student Name (EN)'}
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                    {lang === 'ar' ? 'الصف الدراسي' : 'Grade Level'}
                  </label>
                  <select
                    value={formData.gradeAr}
                    onChange={(e) => setFormData({ ...formData, gradeAr: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600' }}
                  >
                    <option value="">{lang === 'ar' ? 'عام (بدون صف محدد)' : 'General'}</option>
                    {CANONICAL_GRADES.map((g) => (
                      <option key={g.value} value={g.value}>{g.fullAr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                    {lang === 'ar' ? 'المدرسة والمحافظة' : 'School & Governorate'}
                  </label>
                  <input
                    type="text"
                    value={formData.schoolAr}
                    onChange={(e) => setFormData({ ...formData, schoolAr: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                    {lang === 'ar' ? 'اللقب التكريمي' : 'Honorific Title'}
                  </label>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div className="responsive-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'النقاط المعروضة' : 'Display Score'}
                  </label>
                  <input
                    type="text"
                    value={formData.scoreAr}
                    onChange={(e) => setFormData({ ...formData, scoreAr: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '9px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'الترتيب المعروض' : 'Display Rank'}
                  </label>
                  <input
                    type="text"
                    value={formData.rankAr}
                    onChange={(e) => setFormData({ ...formData, rankAr: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '9px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'أيام الاستريك' : 'Streak'}
                  </label>
                  <input
                    type="text"
                    value={formData.streakAr}
                    onChange={(e) => setFormData({ ...formData, streakAr: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '9px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                    {lang === 'ar' ? 'مسمى جولة الدوري / الشهر' : 'League Round / Month Label'}
                  </label>
                  <input
                    type="text"
                    value={formData.monthAr}
                    onChange={(e) => setFormData({ ...formData, monthAr: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                    {lang === 'ar' ? 'ترتيب الظهور بالسلايدر' : 'Slider Display Order'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={999}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'وسام / كأس التكريم' : 'Cup / Honor Badge'}
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PRESET_BADGES.map((badge) => {
                    const isSelected = formData.badgeAr === badge.labelAr;
                    const IconComponent = badge.icon === 'Trophy' ? Trophy : badge.icon === 'Shield' ? Shield : badge.icon === 'Crown' ? Crown : badge.icon === 'Sparkles' ? Sparkles : Award;
                    return (
                      <button
                        type="button"
                        key={badge.id}
                        onClick={() => setFormData({ ...formData, badgeAr: badge.labelAr, badgeEn: badge.labelEn })}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 12px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                          color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                          fontSize: '12px',
                          fontWeight: isSelected ? '800' : '600',
                          cursor: 'pointer',
                        }}
                      >
                        <IconComponent size={13} color={isSelected ? 'var(--primary)' : badge.color} />
                        <span>{lang === 'ar' ? badge.labelAr : (badge.labelEn || badge.labelAr)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '13px 16px',
                  backgroundColor: formData.isPinned ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-subtle)',
                  border: formData.isPinned ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'الموافقة والنشر الفوري في السلايدر الرئيسي بالصفحة الرئيسية' : 'Approve & Publish Directly to Landing Page Slider'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {lang === 'ar' ? 'يمكنك إخفاء أو تعديل البطاقة في أي وقت من تبويب لوحة الشرف' : 'You can hide or edit this card anytime from the Slider tab'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#059669' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    padding: '10px 18px',
                    borderRadius: '11px',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingPhoto}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    backgroundColor: modalMode === 'approve' ? '#059669' : 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '11px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: submitting || uploadingPhoto ? 'wait' : 'pointer',
                  }}
                >
                  <Star size={14} />
                  <span>
                    {submitting
                      ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                      : modalMode === 'approve'
                        ? (lang === 'ar' ? 'اعتماد ونشر في السلايدر' : 'Approve & Publish')
                        : modalMode === 'edit'
                          ? (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes')
                          : (lang === 'ar' ? 'إضافة إلى الأبطال' : 'Add Champion')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 2: ANNOUNCE LEAGUE END & EARLY HONORING CEREMONY                 */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {announceEndTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 37, 78, 0.58)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '18px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '580px',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '26px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Megaphone size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'إعلان انتهاء دوري الجمهورية وبدء التكريم' : 'Announce League Conclusion & Honoring'}
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {announceEndTarget.titleAr} • {lang === 'ar' ? announceEndTarget.dayProgressLabelAr : announceEndTarget.dayProgressLabelEn}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setAnnounceEndTarget(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmAnnounceEnd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {announceEndTarget.isActive && (
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={announceForm.end_now}
                    onChange={(e) => setAnnounceForm({ ...announceForm, end_now: e.target.checked })}
                    style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#D97706' }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {lang === 'ar'
                        ? `إنهاء الجولة الآن قبل الموعد (اليوم ${announceEndTarget.currentDay} من ${announceEndTarget.totalDays})`
                        : `End round early now (Day ${announceEndTarget.currentDay} of ${announceEndTarget.totalDays})`}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {lang === 'ar'
                        ? 'سيتم تثبيت الترتيب النهائي فوراً وإتاحة شهادات التفوق والتكريم الرسمي للأوائل'
                        : 'Locks final standings immediately and enables official honoring certificates'}
                    </div>
                  </div>
                </label>
              )}

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={announceForm.publish_announcement}
                  onChange={(e) => setAnnounceForm({ ...announceForm, publish_announcement: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'نشر إعلان رسمي في شريط إعلانات المنصة للطلاب بانتهاء الدوري والتكريم' : 'Broadcast live Platform Announcement to students'}
                </span>
              </label>

              {announceForm.publish_announcement && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                      {lang === 'ar' ? 'عنوان الإعلان الرسمي' : 'Announcement Title'}
                    </label>
                    <input
                      type="text"
                      required
                      value={announceForm.announcement_title_ar}
                      onChange={(e) => setAnnounceForm({ ...announceForm, announcement_title_ar: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                      {lang === 'ar' ? 'نص إعلان انتهاء الدوري والتكريم' : 'Announcement Message'}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={announceForm.announcement_content_ar}
                      onChange={(e) => setAnnounceForm({ ...announceForm, announcement_content_ar: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', lineHeight: 1.6, resize: 'vertical' }}
                    />
                  </div>

                  <div className="responsive-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                        {lang === 'ar' ? 'الجمهور المستهدف' : 'Audience'}
                      </label>
                      <select
                        value={announceForm.audience}
                        onChange={(e) => setAnnounceForm({ ...announceForm, audience: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '9px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: '700' }}
                      >
                        <option value="all">{lang === 'ar' ? 'جميع المستخدمين' : 'All Users'}</option>
                        <option value="students">{lang === 'ar' ? 'الطلاب فقط' : 'Students Only'}</option>
                        <option value="parents">{lang === 'ar' ? 'أولياء الأمور' : 'Parents'}</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                        {lang === 'ar' ? 'أولوية الإعلان' : 'Priority'}
                      </label>
                      <select
                        value={announceForm.priority}
                        onChange={(e) => setAnnounceForm({ ...announceForm, priority: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '9px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: '700' }}
                      >
                        <option value="urgent">{lang === 'ar' ? 'عاجل ومميز' : 'Urgent'}</option>
                        <option value="important">{lang === 'ar' ? 'مهم' : 'Important'}</option>
                        <option value="normal">{lang === 'ar' ? 'عادي' : 'Normal'}</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                        {lang === 'ar' ? 'مدة ظهور الإعلان' : 'Visible For'}
                      </label>
                      <select
                        value={announceForm.display_days}
                        onChange={(e) => setAnnounceForm({ ...announceForm, display_days: Number(e.target.value) })}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '9px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: '700' }}
                      >
                        <option value={3}>{lang === 'ar' ? '3 أيام' : '3 Days'}</option>
                        <option value={7}>{lang === 'ar' ? '7 أيام' : '7 Days'}</option>
                        <option value={14}>{lang === 'ar' ? '14 يوماً' : '14 Days'}</option>
                        <option value={30}>{lang === 'ar' ? '30 يوماً' : '30 Days'}</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setAnnounceEndTarget(null)}
                  style={{ backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', padding: '9px 18px', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={leagueBusy}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: leagueBusy ? 'wait' : 'pointer',
                  }}
                >
                  <Megaphone size={15} />
                  <span>{leagueBusy ? (lang === 'ar' ? 'جاري التنفيذ...' : 'Processing...') : (lang === 'ar' ? 'تأكيد إعلان الانتهاء والتكريم' : 'Confirm & Broadcast')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 3: LAUNCH REPUBLIC LEAGUE ROUND (ALL 6 GRADES OR SPECIFIC GRADE) */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {showLaunchModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 37, 78, 0.55)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '18px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '22px',
              width: '100%',
              maxWidth: '500px',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Crown size={20} color="#059669" />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'إطلاق جولة جديدة من دوري الجمهورية' : 'Launch Republic League Round'}
                </h3>
              </div>
              <button type="button" onClick={() => setShowLaunchModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleLaunchLeague} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'نطاق الصفوف الدراسية' : 'Grade Scope'}
                </label>
                <select
                  value={launchForm.grade_ar}
                  onChange={(e) => {
                    const nextGrade = e.target.value;
                    setLaunchForm((prev) => ({
                      ...prev,
                      grade_ar: nextGrade,
                      title_ar: nextGrade === 'all'
                        ? 'دوري الجمهورية العام (أولى إعدادي — ثالثة ثانوي)'
                        : `دوري الجمهورية — ${nextGrade}`,
                    }));
                  }}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '700' }}
                >
                  <option value="all">{lang === 'ar' ? 'جميع الصفوف (من أولى إعدادي حتى ثالثة ثانوي)' : 'All 6 Grades (1st Prep – 3rd Sec)'}</option>
                  {CANONICAL_GRADES.map((g) => (
                    <option key={g.value} value={g.value}>{g.fullAr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'اسم الجولة / الموسم' : 'Round Title'}
                </label>
                <input
                  type="text"
                  required
                  value={launchForm.title_ar}
                  onChange={(e) => setLaunchForm({ ...launchForm, title_ar: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'مدة جولة الدوري' : 'Round Duration'}
                </label>
                <select
                  value={launchForm.duration}
                  onChange={(e) => setLaunchForm({ ...launchForm, duration: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '700' }}
                >
                  <option value="weekly">{lang === 'ar' ? 'أسبوعي (7 أيام)' : 'Weekly (7 days)'}</option>
                  <option value="monthly">{lang === 'ar' ? 'شهري (30 يوماً)' : 'Monthly (30 days)'}</option>
                  <option value="half_year">{lang === 'ar' ? 'نصف سنوي (180 يوماً)' : 'Half-Year (180 days)'}</option>
                  <option value="full_year">{lang === 'ar' ? 'عام دراسي كامل (365 يوماً)' : 'Full Year (365 days)'}</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowLaunchModal(false)}
                  style={{ backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', padding: '9px 16px', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={leagueBusy}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#059669', color: '#FFFFFF', border: 'none', padding: '9px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '800', cursor: leagueBusy ? 'wait' : 'pointer' }}
                >
                  <Play size={14} />
                  <span>{leagueBusy ? (lang === 'ar' ? 'جاري التشغيل...' : 'Launching...') : (lang === 'ar' ? 'إطلاق الدوري الآن' : 'Launch Now')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 4: SILENT STOP ROUND CONFIRMATION                                */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {confirmStopRound && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 37, 78, 0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '18px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '22px',
              width: '100%',
              maxWidth: '430px',
              padding: '26px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Square size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: '17.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'إيقاف جولة دوري الجمهورية' : 'Stop League Round'}
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {lang === 'ar'
                ? `هل تريد إيقاف جولة «${confirmStopRound.titleAr}» الآن بدون بث إعلان؟ يمكنك استخدام زر "إعلان انتهاء الدوري والتكريم" إذا أردت إرسال تنبيه للطلاب.`
                : `Stop "${confirmStopRound.titleAr}" without broadcasting an announcement?`}
            </p>
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button type="button" onClick={() => setConfirmStopRound(null)} style={{ flex: 1, padding: '10px', borderRadius: '11px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer' }}>
                {lang === 'ar' ? 'تراجع' : 'Cancel'}
              </button>
              <button type="button" disabled={leagueBusy} onClick={handleConfirmStopLeague} style={{ flex: 1, padding: '10px', borderRadius: '11px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontWeight: '800', cursor: 'pointer' }}>
                {lang === 'ar' ? 'إيقاف الجولة' : 'Stop Round'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 5: DELETE CHAMPION CONFIRMATION                                  */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {championToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 37, 78, 0.45)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '430px',
              padding: '28px 24px',
              boxShadow: '0 25px 50px -12px rgba(6, 37, 78, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '16px',
            }}
          >
            <div style={{ width: '58px', height: '58px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trash2 size={26} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'تأكيد الحذف من لوحة الشرف' : 'Confirm Champion Removal'}
              </h3>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {lang === 'ar'
                  ? `هل أنت متأكد من حذف البطل (${championToDelete.name}) من لوحة الشرف والسلايدر؟`
                  : `Are you sure you want to remove (${championToDelete.name}) from the Honor Roll?`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button
                type="button"
                onClick={() => setChampionToDelete(null)}
                style={{ flex: 1, backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '11px 18px', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmDeleteChampion}
                style={{ flex: 1, backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', padding: '11px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
              >
                {lang === 'ar' ? 'تأكيد الحذف' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
