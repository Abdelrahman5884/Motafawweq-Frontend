import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_ADMIN_ECONOMICS } from '../../data/mockData';
import { getChampions } from '../../services/championsStorage';
import {
  AdminKpiCards,
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
  LayoutDashboard,
  Trophy,
  Users,
  BookOpen,
  DollarSign,
  QrCode,
  Megaphone,
  Settings,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const AdminDashboard = () => {
  const { lang, isRtl } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [champions, setChampions] = useState([]);
  const econ = MOCK_ADMIN_ECONOMICS;

  useEffect(() => {
    setChampions(getChampions());
    const handleSync = () => setChampions(getChampions());
    window.addEventListener('champions-updated', handleSync);
    return () => window.removeEventListener('champions-updated', handleSync);
  }, []);

  const setTab = (tabKey) => {
    setSearchParams({ tab: tabKey });
  };

  return (
    <div 
      className="responsive-container"
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

        {/* Status & Quick Back Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '30px',
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              boxShadow: '0 0 10px rgba(21, 136, 199, 0.5)'
            }} />
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'النظام متصل ويعمل بكفاءة' : 'System Healthy & Live'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tab Views ── */}
      {activeTab === 'overview' && (
        <div className="admin-animated-view" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Global SaaS Platform KPIs */}
          <AdminKpiCards econ={econ} />

          {/* Real-Time Active Users Chart (Like Teacher Page) */}
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
                {champions.slice(0, 3).map((champ) => (
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
                ))}
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
                      {lang === 'ar' ? '184,500 دقيقة' : '184,500 mins'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'معدل استقرار الخوادم اللحظي:' : 'Real-time Server Uptime:'}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>
                      {lang === 'ar' ? '99.98% استقرار تام' : '99.98% Uptime'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'متوسط سرعة معالجة المحاضرة الكاملة:' : 'Avg Processing Latency per Lecture:'}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>
                      {lang === 'ar' ? '38 ثانية فقط' : '38s Average'}
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
                  {lang === 'ar' ? 'تمت مزامنة جميع بوابات السناتر وسيرفرات الصوت اللحظية بنجاح' : 'All center gates and audio clusters are fully synchronized'}
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
          <AdminAiEconomicsPanel econ={econ} />
          <AdminSystemSettings />
        </div>
      )}

      <style>{`
        @keyframes adminFadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .admin-animated-view {
          animation: adminFadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  );
};
