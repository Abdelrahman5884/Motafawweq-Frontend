import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy, Component } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/adminApi';
import {
  AdminKpiCards,
  AdminAnalyticsCharts,
  AdminAiEconomicsPanel,
  AdminActiveUsersChart
} from '../../features/admin/dashboard';
import {
  ShieldCheck,
  Trophy,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  DollarSign,
  ArrowUpLeft,
  ArrowUpRight,
  Lock,
  Building2,
  Clock
} from 'lucide-react';

// Lazy-load secondary admin tab managers for optimal initial load & fast switching
const AdminChampionsManager = lazy(() =>
  import('../../features/admin/champions/AdminChampionsManager').then((m) => ({ default: m.AdminChampionsManager }))
);
const AdminUsersManager = lazy(() =>
  import('../../features/admin/users/AdminUsersManager').then((m) => ({ default: m.AdminUsersManager }))
);
const AdminCoursesManager = lazy(() =>
  import('../../features/admin/courses/AdminCoursesManager').then((m) => ({ default: m.AdminCoursesManager }))
);
const AdminFinancialsManager = lazy(() =>
  import('../../features/admin/financials/AdminFinancialsManager').then((m) => ({ default: m.AdminFinancialsManager }))
);
const AdminAttendanceManager = lazy(() =>
  import('../../features/admin/attendance/AdminAttendanceManager').then((m) => ({ default: m.AdminAttendanceManager }))
);
const AdminAnnouncementsManager = lazy(() =>
  import('../../features/admin/announcements/AdminAnnouncementsManager').then((m) => ({ default: m.AdminAnnouncementsManager }))
);
const AdminSystemSettings = lazy(() =>
  import('../../features/admin/system/AdminSystemSettings').then((m) => ({ default: m.AdminSystemSettings }))
);

class AdminTabErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      const isAr = this.props.lang === 'ar';
      return (
        <div style={{
          padding: '40px 24px',
          borderRadius: '20px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertTriangle size={32} color="#DC2626" />
          <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {isAr ? 'حدث خطأ غير متوقع في هذا القسم' : 'Unexpected error in this module'}
          </div>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {isAr ? 'إعادة تحميل القسم' : 'Reload Module'}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const TabLoadingSkeleton = ({ lang }) => (
  <div style={{
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '20px',
    padding: '48px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    color: 'var(--text-secondary)',
    fontSize: '13.5px',
    fontWeight: '700'
  }}>
    <RefreshCw size={24} color="var(--primary)" className="admin-spin-icon" />
    <span>{lang === 'ar' ? 'جاري تحميل بيانات القسم...' : 'Loading module...'}</span>
  </div>
);

const TAB_CONFIG = [
  {
    key: 'overview',
    titleAr: 'مركز القيادة والعمليات التنفيذية',
    titleEn: 'Executive Command Center',
    subAr: 'متابعة لحظية للمؤشرات المالية، نشاط المستخدمين، واقتصاديات الذكاء الاصطناعي عبر المنصة',
    subEn: 'Live telemetry across platform revenue, active learners, centers, and AI operations'
  },
  {
    key: 'users',
    titleAr: 'إدارة المستخدمين وتوثيق المعلمين',
    titleEn: 'Users, Roles & KYC Verification',
    subAr: 'إدارة حسابات الطلاب والمعلمين وأولياء الأمور والسناتر ومراجعة طلبات الاعتماد والأمان',
    subEn: 'Manage platform accounts, teacher KYC approvals, active sessions, and CSV exports'
  },
  {
    key: 'courses',
    titleAr: 'إشراف المقررات والمحتوى التعليمي',
    titleEn: 'Courses & Content Moderation',
    subAr: 'مراجعة واعتماد الكورسات التعليمية وتمييز المحتوى في واجهة المتجر الرئيسي',
    subEn: 'Review, publish, feature, and moderate courses across all academic stages'
  },
  {
    key: 'financials',
    titleAr: 'الشؤون المالية، تسعير الباقات والتسويات',
    titleEn: 'Financials, Pricing Plans & Payouts',
    subAr: 'تحكم مركزي في باقات الاشتراك الرسمية، تسوية أرباح المعلمين والسناتر، وكوبونات الخصم',
    subEn: 'Manage official subscription tiers, teacher/center payout settlements, and promo coupons'
  },
  {
    key: 'attendance',
    titleAr: 'مراقبة بوابات الحضور الذكية بالباركود',
    titleEn: 'Smart QR Gate Attendance Monitor',
    subAr: 'سجل فوري لعمليات المسح والدخول المصرح والمرفوض عبر جميع السناتر التعليمية المتصلة',
    subEn: 'Real-time gate check-in stream and payment enforcement logs across connected centers'
  },
  {
    key: 'champions',
    titleAr: 'لوحة الشرف وأبطال الكؤوس ودوري الجمهورية',
    titleEn: 'Honor Roll Champions & Republic League',
    subAr: 'إدارة أبطال التفوق المعروضين في الصفحة الرئيسية وإطلاق أو إيقاف موسم دوري الجمهورية العام',
    subEn: 'Curate homepage honor roll champions and manage the national Republic League season'
  },
  {
    key: 'announcements',
    titleAr: 'شريط الأخبار والإعلانات العاجلة',
    titleEn: 'Platform Announcements & Broadcasts',
    subAr: 'إرسال تنبيهات وبلاغات رسمية موجهة للطلاب أو المعلمين أو أولياء الأمور أو السناتر',
    subEn: 'Broadcast targeted notices and urgent platform alerts across user groups'
  },
  {
    key: 'system',
    titleAr: 'بنية النظام، سياسات التشغيل وسجل التدقيق الأمني',
    titleEn: 'System Telemetry, Policies & Audit Trail',
    subAr: 'فحص صحة السيرفر والكاش، تفعيل وضع الصيانة وسياسات التسجيل، واستعراض سجل الأمان غير القابل للتعديل',
    subEn: 'Inspect live infrastructure latency, toggle platform policies, and audit security events'
  },
];

const RANK_MEDALS = [
  { bg: 'linear-gradient(135deg, #F59E0B, #D97706)', text: '#FFFFFF', label: '#1' },
  { bg: 'linear-gradient(135deg, #94A3B8, #64748B)', text: '#FFFFFF', label: '#2' },
  { bg: 'linear-gradient(135deg, #D97706, #92400E)', text: '#FFFFFF', label: '#3' },
];

export const AdminDashboard = () => {
  const { lang, isRtl } = useLanguage();
  const { currentUser } = useAuth();
  const isAr = lang === 'ar';
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab') || 'overview';
  const activeTab = TAB_CONFIG.some((t) => t.key === rawTab) ? rawTab : 'overview';

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadOverview = useCallback(async (fresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.dashboard.get(fresh ? { fresh: 1 } : {});
      setOverview(res?.data || null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err?.message || (isAr ? 'تعذر تحميل بيانات لوحة المشرف.' : 'Failed to load admin overview.'));
    } finally {
      setLoading(false);
    }
  }, [isAr]);

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'system') {
      loadOverview(false);
    }
  }, [activeTab, loadOverview]);

  useEffect(() => {
    const handleSync = () => loadOverview(true);
    window.addEventListener('champions-updated', handleSync);
    window.addEventListener('admin-settings-updated', handleSync);
    return () => {
      window.removeEventListener('champions-updated', handleSync);
      window.removeEventListener('admin-settings-updated', handleSync);
    };
  }, [loadOverview]);

  const setTab = useCallback((tabKey) => {
    setSearchParams({ tab: tabKey });
  }, [setSearchParams]);

  const activeTabMeta = useMemo(
    () => TAB_CONFIG.find((t) => t.key === activeTab) || TAB_CONFIG[0],
    [activeTab]
  );

  const kpis = overview?.kpis || {};
  const aiEconomics = overview?.aiEconomics || {};
  const champions = overview?.championsSpotlight || [];
  const isMaintenance = Boolean(overview?.systemHealth?.maintenanceMode);
  const pendingVerifications = Number(kpis?.pendingVerificationCount || 0);
  const connectedCenters = Number(overview?.systemHealth?.connectedCentersCount || 0);
  const NavArrow = isRtl ? ArrowUpLeft : ArrowUpRight;

  return (
    <div
      className="responsive-container admin-dashboard-page"
      style={{
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '22px 20px 80px',
        direction: isRtl ? 'rtl' : 'ltr'
      }}
    >
      {/* ── Executive Hero Command Banner ── */}
      <section style={{
        position: 'relative',
        borderRadius: '24px',
        padding: '24px 26px',
        marginBottom: '18px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #041A36 0%, #093264 56%, #1588C7 100%)',
        boxShadow: '0 16px 38px rgba(6, 37, 78, 0.22)',
        border: '1px solid rgba(92, 182, 219, 0.24)',
        color: '#FFFFFF'
      }}>
        {/* Subtle Decorative Radial Highlight */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-60px',
            insetInlineEnd: '-40px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(92, 182, 219, 0.32) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '18px'
        }}>
          {/* Title & Breadcrumb Identity */}
          <div style={{ minWidth: 0, flex: '1 1 320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 11px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.14)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '11.5px',
                fontWeight: '800',
                letterSpacing: '0.3px',
                backdropFilter: 'blur(8px)'
              }}>
                <ShieldCheck size={14} color="#7DD3FC" />
                <span>{isAr ? 'الإدارة العليا للمنصة' : 'Platform SuperAdmin'}</span>
              </span>

              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 11px',
                borderRadius: '999px',
                backgroundColor: isMaintenance ? 'rgba(239, 68, 68, 0.22)' : 'rgba(16, 185, 129, 0.2)',
                border: isMaintenance ? '1px solid rgba(248, 113, 113, 0.45)' : '1px solid rgba(52, 211, 153, 0.4)',
                fontSize: '11.5px',
                fontWeight: '800',
                color: isMaintenance ? '#FECACA' : '#A7F3D0'
              }}>
                <span style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: isMaintenance ? '#EF4444' : '#34D399',
                  boxShadow: isMaintenance ? '0 0 8px #EF4444' : '0 0 8px #34D399'
                }} />
                <span>
                  {isMaintenance
                    ? (isAr ? 'وضع الصيانة مفعّل' : 'Maintenance Mode')
                    : (isAr ? 'جميع الأنظمة مستقرة' : 'Systems Operational')}
                </span>
              </span>

              {currentUser?.email && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11.5px',
                  color: 'rgba(226, 232, 240, 0.85)',
                  fontFamily: 'var(--font-mono)',
                  direction: 'ltr'
                }}>
                  <Lock size={11} />
                  <span>{currentUser.email}</span>
                </span>
              )}
            </div>

            <h1 style={{
              fontSize: 'clamp(20px, 2.5vw, 26px)',
              fontWeight: '900',
              color: '#FFFFFF',
              margin: '0 0 6px',
              lineHeight: 1.25,
              fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
            }}>
              {isAr ? activeTabMeta.titleAr : activeTabMeta.titleEn}
            </h1>

            <p style={{
              margin: 0,
              fontSize: '13px',
              color: 'rgba(226, 232, 240, 0.88)',
              maxWidth: '680px',
              lineHeight: 1.55
            }}>
              {isAr ? activeTabMeta.subAr : activeTabMeta.subEn}
            </p>
          </div>

          {/* Right Quick Actions & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {pendingVerifications > 0 && activeTab !== 'users' && (
              <button
                type="button"
                onClick={() => setTab('users')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '9px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(251, 191, 36, 0.45)',
                  color: '#FEF3C7',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                <AlertTriangle size={14} />
                <span>
                  {isAr
                    ? `${pendingVerifications} طلب توثيق معلّق`
                    : `${pendingVerifications} Pending KYC`}
                </span>
              </button>
            )}

            {(activeTab === 'overview' || activeTab === 'system') && (
              <button
                type="button"
                onClick={() => loadOverview(true)}
                disabled={loading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '9px 15px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.14)',
                  border: '1px solid rgba(255, 255, 255, 0.24)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: loading ? 'wait' : 'pointer',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <RefreshCw size={14} className={loading ? 'admin-spin-icon' : ''} />
                <span>{isAr ? 'تحديث البيانات' : 'Sync Live'}</span>
                {lastUpdated && !loading && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '10.5px',
                    opacity: 0.85,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    <Clock size={11} />
                    {lastUpdated.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Error Alert */}
      {error && activeTab === 'overview' && (
        <div
          role="alert"
          style={{
            padding: '14px 18px',
            borderRadius: '14px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.28)',
            color: '#B91C1C',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '13px',
            fontWeight: '700'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadOverview(true)}
            style={{
              backgroundColor: '#DC2626',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {isAr ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* ── Active Tab Views ── */}
      <AdminTabErrorBoundary resetKey={activeTab} lang={lang}>
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Global SaaS Platform KPIs */}
            <AdminKpiCards kpis={kpis} loading={loading && !overview} onNavigateTab={setTab} />

            {/* Interactive User Activity Spline Graph & Demographic Donut Chart */}
            <AdminAnalyticsCharts
              weeklyActivity={overview?.weeklyActivity}
              demographics={overview?.demographics}
              totalUsers={kpis?.totalUsers || 0}
            />

            {/* Live Hourly/Weekly Breakdown Traffic */}
            <AdminActiveUsersChart />

            {/* Highlights Split: Champions Spotlight + Operations & AI Pulse */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '22px'
            }}>
              {/* Cup Champions Mini Showcase */}
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '22px',
                padding: '22px 24px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '11px',
                      backgroundColor: 'rgba(245, 158, 11, 0.14)',
                      color: '#D97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Trophy size={19} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {isAr ? 'أبطال الكؤوس المتصدرون' : 'Top Cup Champions'}
                      </h3>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        {isAr ? 'المعروضون حالياً في الصفحة الرئيسية' : 'Pinned on platform landing page'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab('champions')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--primary)',
                      padding: '6px 11px',
                      borderRadius: '9px',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{isAr ? 'إدارة الأبطال' : 'Manage'}</span>
                    <NavArrow size={13} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {champions.length === 0 ? (
                    <div style={{
                      padding: '28px 20px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: '14px',
                      border: '1px dashed var(--border-medium)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span>
                        {loading
                          ? (isAr ? 'جاري تحميل أبطال لوحة الشرف...' : 'Loading champions...')
                          : (isAr ? 'لا يوجد أبطال مثبتون حالياً على الصفحة الرئيسية' : 'No pinned champions yet.')}
                      </span>
                      {!loading && (
                        <button
                          type="button"
                          onClick={() => setTab('champions')}
                          style={{
                            padding: '7px 14px',
                            borderRadius: '9px',
                            border: 'none',
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {isAr ? 'إضافة أول بطل الآن' : 'Add First Champion'}
                        </button>
                      )}
                    </div>
                  ) : (
                    champions.slice(0, 3).map((champ, idx) => {
                      const medal = RANK_MEDALS[idx] || RANK_MEDALS[2];
                      return (
                        <div
                          key={champ.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            borderRadius: '15px',
                            backgroundColor: 'var(--bg-subtle)',
                            border: '1px solid var(--border-subtle)',
                            gap: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                              <img
                                src={champ.image || '/characters/real-male-champ-1.png'}
                                alt={isAr ? champ.nameAr : (champ.nameEn || champ.nameAr)}
                                style={{
                                  width: '46px',
                                  height: '46px',
                                  borderRadius: '13px',
                                  objectFit: 'cover',
                                  border: '2px solid var(--primary)'
                                }}
                                onError={(e) => { e.currentTarget.src = '/characters/student.png'; }}
                              />
                              <span style={{
                                position: 'absolute',
                                top: '-6px',
                                insetInlineEnd: '-6px',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: medal.bg,
                                color: medal.text,
                                fontSize: '10px',
                                fontWeight: '900',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                              }}>
                                {medal.label}
                              </span>
                            </div>

                            <div style={{ minWidth: 0 }}>
                              <div style={{
                                fontWeight: '800',
                                color: 'var(--text-primary)',
                                fontSize: '14px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {isAr ? champ.nameAr : (champ.nameEn || champ.nameAr)}
                              </div>
                              <div style={{ fontSize: '11.5px', color: 'var(--primary)', fontWeight: '700' }}>
                                {(isAr ? champ.badgeAr : champ.badgeEn) || (isAr ? 'كأس التفوق الشهري' : 'Monthly Cup')}
                              </div>
                              <div style={{
                                fontSize: '11px',
                                color: 'var(--text-muted)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {isAr ? champ.schoolAr : (champ.schoolEn || champ.schoolAr)}
                              </div>
                            </div>
                          </div>

                          <div style={{ textAlign: isRtl ? 'left' : 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--primary)' }}>
                              {isAr ? champ.scoreAr : (champ.scoreEn || champ.scoreAr)}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                              {isAr ? champ.streakAr : (champ.streakEn || champ.streakAr)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Operations, AI & Quick Command Pulse */}
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '22px',
                padding: '22px 24px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '11px',
                        backgroundColor: 'rgba(21, 136, 199, 0.12)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Sparkles size={19} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {isAr ? 'نبض الذكاء الاصطناعي والعمليات' : 'AI & Operations Pulse'}
                        </h3>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                          {isAr ? 'مؤشرات المعالجة والربط اللحظي مع السناتر' : 'Processing efficiency & center node health'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setTab('system')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--primary)',
                        padding: '6px 11px',
                        borderRadius: '9px',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{isAr ? 'السيرفرات والأمان' : 'Telemetry'}</span>
                      <NavArrow size={13} />
                    </button>
                  </div>

                  {/* 3 Clean Operational Tiles */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ padding: '12px', borderRadius: '13px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        {isAr ? 'دقائق الصوت' : 'Audio Mins'}
                      </div>
                      <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                        {Number(aiEconomics.totalAudioMinutesProcessed || 0).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ padding: '12px', borderRadius: '13px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        {isAr ? 'هامش AI' : 'AI Margin'}
                      </div>
                      <div style={{ fontSize: '17px', fontWeight: '900', color: '#10B981', fontVariantNumeric: 'tabular-nums' }}>
                        {Number(aiEconomics.grossMarginPct || 0)}%
                      </div>
                    </div>
                    <div style={{ padding: '12px', borderRadius: '13px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        {isAr ? 'السناتر النشطة' : 'Active Centers'}
                      </div>
                      <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                        {connectedCenters.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Quick Command Shortcuts */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
                    {[
                      { tab: 'users', labelAr: 'توثيق المعلمين', labelEn: 'Verify KYC', icon: ShieldCheck },
                      { tab: 'financials', labelAr: 'إدارة الباقات', labelEn: 'Pricing Tiers', icon: DollarSign },
                      { tab: 'system', labelAr: 'سجل التدقيق', labelEn: 'Audit Trail', icon: Building2 },
                    ].map((shortcut) => {
                      const SIcon = shortcut.icon;
                      return (
                        <button
                          key={shortcut.tab}
                          type="button"
                          onClick={() => setTab(shortcut.tab)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '10px 8px',
                            borderRadius: '11px',
                            backgroundColor: 'var(--bg-subtle)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                            fontSize: '11.5px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <SIcon size={14} color="var(--primary)" />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {isAr ? shortcut.labelAr : shortcut.labelEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{
                  padding: '12px 14px',
                  borderRadius: '13px',
                  backgroundColor: 'rgba(21, 136, 199, 0.08)',
                  border: '1px solid rgba(21, 136, 199, 0.2)',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600'
                }}>
                  <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <span>
                    {isAr
                      ? `متصل مع ${connectedCenters} سنتر تعليمي • طلبات توثيق بانتظار المراجعة: ${pendingVerifications} • متوسط معالجة المحاضرة: ${Number(aiEconomics.avgLessonProcessingSeconds || 38)} ثانية`
                      : `Connected to ${connectedCenters} centers • Pending KYC: ${pendingVerifications} • Avg lecture latency: ${Number(aiEconomics.avgLessonProcessingSeconds || 38)}s`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <Suspense fallback={<TabLoadingSkeleton lang={lang} />}>
          {activeTab === 'champions' && <AdminChampionsManager />}
          {activeTab === 'users' && <AdminUsersManager />}
          {activeTab === 'courses' && <AdminCoursesManager />}
          {activeTab === 'financials' && <AdminFinancialsManager />}
          {activeTab === 'attendance' && <AdminAttendanceManager />}
          {activeTab === 'announcements' && <AdminAnnouncementsManager />}
          {activeTab === 'system' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <AdminAiEconomicsPanel aiEconomics={aiEconomics} />
              <AdminSystemSettings />
            </div>
          )}
        </Suspense>
      </AdminTabErrorBoundary>

      <style>{`
        .admin-dashboard-page {
          animation: adminFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes adminFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes adminSpin {
          to { transform: rotate(360deg); }
        }
        .admin-spin-icon {
          animation: adminSpin 0.9s linear infinite;
        }
      `}</style>
    </div>
  );
};
