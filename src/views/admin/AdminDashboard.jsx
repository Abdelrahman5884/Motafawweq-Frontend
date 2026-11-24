import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { adminApi } from '../../services/adminApi';
import {
  AdminKpiCards,
  AdminAnalyticsCharts,
  AdminAiEconomicsPanel,
  AdminActiveUsersChart
} from '../../features/admin/dashboard';
import { AdminChampionsManager } from '../../features/admin/champions/AdminChampionsManager';
import { AdminUsersManager } from '../../features/admin/users/AdminUsersManager';
import { AdminCoursesManager } from '../../features/admin/courses/AdminCoursesManager';
import { AdminFinancialsManager } from '../../features/admin/financials/AdminFinancialsManager';
import { AdminAttendanceManager } from '../../features/admin/attendance/AdminAttendanceManager';
import { AdminAnnouncementsManager } from '../../features/admin/announcements/AdminAnnouncementsManager';
import { AdminSystemSettings } from '../../features/admin/system/AdminSystemSettings';
import {
  ShieldCheck,
  Trophy,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard = () => {
  const { lang, isRtl } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOverview = useCallback(async (fresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.dashboard.get(fresh ? { fresh: 1 } : {});
      setOverview(res?.data || null);
    } catch (err) {
      setError(err?.message || (lang === 'ar' ? 'تعذر تحميل بيانات لوحة المشرف.' : 'Failed to load admin overview.'));
    } finally {
      setLoading(false);
    }
  }, [lang]);

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

  const setTab = (tabKey) => {
    setSearchParams({ tab: tabKey });
  };

  const kpis = overview?.kpis || {};
  const aiEconomics = overview?.aiEconomics || {};
  const champions = overview?.championsSpotlight || [];
  const isMaintenance = Boolean(overview?.systemHealth?.maintenanceMode);

  return (
    <div
      className="responsive-container admin-dashboard-page"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '28px 20px 80px',
        direction: isRtl ? 'rtl' : 'ltr'
      }}
    >
      {/* ── Top Header Banner ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: 'rgba(21, 136, 199, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <ShieldCheck size={18} />
            </div>
            <span style={{
              fontSize: '13px',
              fontWeight: '800',
              color: 'var(--primary)',
              letterSpacing: '0.5px'
            }}>
              {lang === 'ar' ? 'الإدارة العامة للمنصة' : 'Platform Administration'}
            </span>
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
          }}>
            {activeTab === 'champions' ? (lang === 'ar' ? 'لوحة الشرف وأبطال الكؤوس والتفوق' : 'Cup Champions & Honor Roll') :
             activeTab === 'users' ? (lang === 'ar' ? 'إدارة المستخدمين وتوثيق المعلمين' : 'User Management & Verifications') :
             activeTab === 'courses' ? (lang === 'ar' ? 'المقررات والمحتوى التعليمي' : 'Courses & Curriculums') :
             activeTab === 'financials' ? (lang === 'ar' ? 'المالية وتحديد أسعار الباقات وسحب الأرباح' : 'Financials, Pricing & Payouts') :
             activeTab === 'attendance' ? (lang === 'ar' ? 'سجلات بوابات الحضور والباركود' : 'Center Gate Attendance') :
             activeTab === 'announcements' ? (lang === 'ar' ? 'شريط الأخبار والإعلانات العاجلة' : 'Announcements & News') :
             activeTab === 'system' ? (lang === 'ar' ? 'الذكاء الاصطناعي وإعدادات المنظومة' : 'AI Telemetry & Settings') :
             (lang === 'ar' ? 'لوحة تحكم المشرف العام والعمليات' : 'Admin Command Center & Operations')}
          </h1>
        </div>

        {/* Status & Quick Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {activeTab !== 'overview' && (
            <button
              onClick={() => setTab('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              <span>{lang === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
            </button>
          )}

          {activeTab === 'overview' && (
            <button
              onClick={() => loadOverview(true)}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: loading ? 'wait' : 'pointer'
              }}
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              <span>{lang === 'ar' ? 'تحديث حي' : 'Refresh'}</span>
            </button>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '30px',
            backgroundColor: isMaintenance ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-surface)',
            border: isMaintenance ? '1.5px solid rgba(239, 68, 68, 0.35)' : '1.5px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isMaintenance ? '#EF4444' : 'var(--primary)',
              boxShadow: isMaintenance ? '0 0 10px rgba(239, 68, 68, 0.5)' : '0 0 10px rgba(21, 136, 199, 0.5)'
            }} />
            <span style={{ fontSize: '12px', fontWeight: '700', color: isMaintenance ? '#DC2626' : 'var(--text-primary)' }}>
              {isMaintenance
                ? (lang === 'ar' ? 'وضع الصيانة مفعّل حالياً' : 'Maintenance Mode Active')
                : (lang === 'ar' ? 'النظام متصل ويعمل بكفاءة' : 'System Healthy & Live')}
            </span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && activeTab === 'overview' && (
        <div style={{
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
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
          <button
            onClick={() => loadOverview(true)}
            style={{
              backgroundColor: '#DC2626',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* ── Tab Views ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Global SaaS Platform KPIs */}
          <AdminKpiCards kpis={kpis} />

          {/* Interactive User Activity Spline Graph & Demographic Donut Chart */}
          <AdminAnalyticsCharts
            weeklyActivity={overview?.weeklyActivity}
            demographics={overview?.demographics}
            totalUsers={kpis?.totalUsers || 0}
          />

          {/* Live Hourly/Weekly Breakdown Traffic */}
          <AdminActiveUsersChart />

          {/* Highlights Split: Champions Spotlight + Operations Telemetry */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '24px'
          }}>
            {/* Cup Champions Mini Showcase */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trophy size={20} color="var(--primary)" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'أبطال الكؤوس المتصدرون على المنصة' : 'Top Cup Champions Spotlight'}
                  </h3>
                </div>
                <button
                  onClick={() => setTab('champions')}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'عرض وتعديل الكل ←' : 'View all →'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {champions.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {loading
                      ? (lang === 'ar' ? 'جاري تحميل أبطال لوحة الشرف...' : 'Loading champions...')
                      : (lang === 'ar' ? 'لا يوجد أبطال مثبتون حالياً — يمكنك إضافة بطل جديد من تبويب أبطال الكؤوس' : 'No pinned champions yet.')}
                  </div>
                ) : (
                  champions.slice(0, 3).map((champ) => (
                    <div
                      key={champ.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: '14px',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={champ.image || '/characters/real-male-champ-1.png'}
                          alt={lang === 'ar' ? champ.nameAr : (champ.nameEn || champ.nameAr)}
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            objectFit: 'cover',
                            border: '2px solid var(--primary)'
                          }}
                          onError={(e) => { e.currentTarget.src = '/characters/student.png'; }}
                        />
                        <div>
                          <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '14px' }}>
                            {lang === 'ar' ? champ.nameAr : (champ.nameEn || champ.nameAr)}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700' }}>
                            {(lang === 'ar' ? champ.badgeAr : champ.badgeEn) || (lang === 'ar' ? 'كأس التفوق الشهري' : 'Monthly Excellence Cup')}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {lang === 'ar' ? champ.schoolAr : (champ.schoolEn || champ.schoolAr)}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>
                          {lang === 'ar' ? champ.scoreAr : (champ.scoreEn || champ.scoreAr)}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--primary-light, #5CB6DB)', fontWeight: '700' }}>
                          {lang === 'ar' ? champ.streakAr : (champ.streakEn || champ.streakAr)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Financials & Telemetry Summary */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={20} color="var(--primary)" />
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? 'كفاءة الذكاء الاصطناعي ومعالجة الصوت' : 'AI Processing & Economics'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setTab('system')}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {lang === 'ar' ? 'تفاصيل السيرفرات ←' : 'Details →'}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'دقائق الصوت المعالجة بنماذج الذكاء الاصطناعي:' : 'Audio Minutes Transcribed:'}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {Number(aiEconomics.totalAudioMinutesProcessed || 0).toLocaleString()} {lang === 'ar' ? 'دقيقة' : 'mins'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'هامش الربح التشغيلي للذكاء الاصطناعي:' : 'AI Operating Margin:'}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>
                      {Number(aiEconomics.grossMarginPct || 0)}% {lang === 'ar' ? 'هامش ربح' : 'Gross Margin'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'متوسط سرعة معالجة المحاضرة الكاملة:' : 'Avg Processing Latency per Lecture:'}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>
                      {Number(aiEconomics.avgLessonProcessingSeconds || 38)} {lang === 'ar' ? 'ثانية' : 'sec'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '12px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(21, 136, 199, 0.08)',
                border: '1px solid rgba(21, 136, 199, 0.18)',
                fontSize: '12px',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>
                  {lang === 'ar'
                    ? `متصل حالياً مع ${Number(overview?.systemHealth?.connectedCentersCount || 0)} سنتر تعليمي — طلبات التوثيق المعلقة: ${Number(kpis.pendingVerificationCount || 0)}`
                    : `Connected to ${Number(overview?.systemHealth?.connectedCentersCount || 0)} centers — Pending verifications: ${Number(kpis.pendingVerificationCount || 0)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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

      <style>{`
        .admin-dashboard-page {
          animation: adminFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes adminFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
