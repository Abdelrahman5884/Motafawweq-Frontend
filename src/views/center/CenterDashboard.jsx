import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCenter } from '../../context/CenterContext';
import { 
  Building2, 
  Users, 
  BookOpen, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Activity,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  HelpCircle,
  Calendar,
  Layers,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileText,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CenterDashboard = () => {
  const { lang, isRtl } = useLanguage();
  const { 
    branches, 
    selectedBranchId, 
    setSelectedBranchId, 
    rooms, 
    financialSummary, 
    attendanceRecords,
    auditLogs 
  } = useCenter();

  // Natural Language Center AI Query State
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Time filter: 'today' | 'month' | 'year'
  const [timePeriod, setTimePeriod] = useState('month');

  const selectedBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  const periodMetrics = useMemo(() => {
    if (timePeriod === 'today') {
      return {
        students: 142,
        studentsLabel: lang === 'ar' ? 'طلاب حضروا اليوم' : 'Attended Today',
        revenue: 14200,
        revenueGrowth: lang === 'ar' ? 'تحصيل اليوم الفعلي' : 'Daily Collection',
        netProfit: 4100,
        utilization: 86,
        growthRate: '+12%'
      };
    } else if (timePeriod === 'year') {
      return {
        students: 1840,
        studentsLabel: lang === 'ar' ? 'إجمالي الطلاب المسجلين' : 'Total Registered',
        revenue: 2450000,
        revenueGrowth: lang === 'ar' ? '+24% نمو سنوي تراكمي' : '+24% Annual Growth',
        netProfit: 680000,
        utilization: 84,
        growthRate: '+24%'
      };
    } else {
      return {
        students: selectedBranch.activeStudents,
        studentsLabel: lang === 'ar' ? 'الطلاب النشطون' : 'Active Students',
        revenue: financialSummary.grossCollectedRevenue,
        revenueGrowth: lang === 'ar' ? '+14% نمو شهري' : '+14% Monthly Growth',
        netProfit: financialSummary.netProfit,
        utilization: selectedBranch.utilizationRate,
        growthRate: '+8.5%'
      };
    }
  }, [timePeriod, selectedBranch, financialSummary, lang]);

  const handleAskAi = (presetQuestion = null) => {
    const query = presetQuestion || aiQuery;
    if (!query.trim()) return;

    setIsAiLoading(true);
    setAiResponse(null);

    setTimeout(() => {
      let answer = '';
      const q = query.toLowerCase();

      if (q.includes('إيراد') || q.includes('فلوس') || q.includes('revenue') || q.includes('ارباح')) {
        answer = `إجمالي إيرادات شهر سبتمبر المسجلة حتى الآن هي ${financialSummary.grossCollectedRevenue.toLocaleString()} ج.م، بصافي أرباح تقديرية للسنتر قدرها ${financialSummary.netProfit.toLocaleString()} ج.م بعد خصم المصروفات ومستحقات المعلمين.`;
      } else if (q.includes('فرع') || q.includes('اعلى') || q.includes('نمو') || q.includes('branch')) {
        answer = `فرع الدقي هو الأعلى نمواً وإيراداً هذا الشهر بمعدل تشغيل 88% وإجمالي إيراد 235,000 ج.م، يليه فرع مدينة نصر بمعدل تشغيل 82%.`;
      } else if (q.includes('مصروف') || q.includes('تكلفة') || q.includes('expense')) {
        answer = `أكبر بند مصروفات حالياً هو إيجار المقرات (45,000 ج.م بفرع الدقي)، يليه رواتب موظفي الاستقبال والخدمات الإدارية.`;
      } else if (q.includes('اتغير') || q.includes('changed') || q.includes('جديد')) {
        answer = `خلال آخر 48 ساعة: تم تسجيل 18 عملية حضور عبر الباركود الذكي، وانضمام 4 طلاب جدد، وسداد قسط متأخر بقيمة 900 ج.م بدون أي تعارض في جدول القاعات.`;
      } else {
        answer = `بناءً على تحليل بيانات السنتر: جميع الفروع تعمل بكفاءة تشغيلية 82%، والحضور مستقر بنسبة 93.4% مع انعدام أي تعارضات زمنية في القاعات لليوم الحالي.`;
      }

      setAiResponse(answer);
      setIsAiLoading(false);
    }, 450);
  };

  const sampleAiQuestions = [
    'إيرادات الشهر كام؟',
    'أي فرع نموه أعلى؟',
    'فين أكبر مصروف؟',
    'إيه اللي اتغير الأسبوع ده؟'
  ];

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
    }}>
      {/* Top Bar: Center Identity & Branch Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        backgroundColor: 'var(--bg-surface)',
        padding: '18px 24px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'rgba(21, 136, 199, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                color: 'var(--primary)',
                letterSpacing: '0.6px',
                textTransform: 'uppercase'
              }}>
                {lang === 'ar' ? 'غرفة العمليات الرئيسية للسنتر' : 'Center Command Center'}
              </span>
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                fontWeight: '700'
              }}>
                {lang === 'ar' ? 'مباشر • تشغيل مستقر' : 'LIVE • Nominal'}
              </span>
            </div>
            <h1 style={{
              fontSize: '22px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: '2px 0 0 0'
            }}>
              {lang === 'ar' ? 'أكاديمية الرواد التعليمية' : 'Al-Rowad Educational Academy'}
            </h1>
          </div>
        </div>

        {/* Branch Selector + Period Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {branches.map(b => (
              <option key={b.id} value={b.id}>
                {lang === 'ar' ? b.nameAr : b.nameEn}
              </option>
            ))}
          </select>

          {/* Time Filter Pills */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-subtle)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            {[
              { id: 'today', labelAr: 'اليوم', labelEn: 'Today' },
              { id: 'month', labelAr: 'الشهر الحالي', labelEn: 'This Month' },
              { id: 'year', labelAr: 'السنة', labelEn: 'Year' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setTimePeriod(p.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: timePeriod === p.id ? 'var(--primary)' : 'transparent',
                  color: timePeriod === p.id ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {lang === 'ar' ? p.labelAr : p.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* KPI 1: Total Active Students */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {periodMetrics.studentsLabel}
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <Users size={16} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {periodMetrics.students.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--success)', fontWeight: '700' }}>
            <ArrowUpRight size={14} />
            <span>{periodMetrics.growthRate} {lang === 'ar' ? 'مقارنة بالفترة السابقة' : 'vs previous period'}</span>
          </div>
        </div>

        {/* KPI 2: Gross Revenue */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {lang === 'ar' ? 'إجمالي التحصيل المالي' : 'Collected Revenue'}
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--success-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--success)'
            }}>
              <DollarSign size={16} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {periodMetrics.revenue.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: '600' }}>ج.م</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--success)', fontWeight: '700' }}>
            <ArrowUpRight size={14} />
            <span>{periodMetrics.revenueGrowth}</span>
          </div>
        </div>

        {/* KPI 3: Net Profit */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {lang === 'ar' ? 'صافي دخل السنتر' : 'Center Net Profit'}
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
            {periodMetrics.netProfit.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: '600' }}>ج.م</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {lang === 'ar' ? 'بعد اقتطاع المصاريف والمدرسين' : 'After expenses & payouts'}
          </div>
        </div>

        {/* KPI 4: Room Utilization */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {lang === 'ar' ? 'معدل إشغال القاعات' : 'Room Utilization Rate'}
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--warning-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--warning)'
            }}>
              <Activity size={16} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {periodMetrics.utilization}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {selectedBranch.roomsCount} {lang === 'ar' ? 'قاعات دراسية مجهزة' : 'equipped rooms'}
          </div>
        </div>
      </div>

      {/* Center Pulse & What Changed Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Center Pulse (Feature 84) */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '22px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'مؤشر نبض السنتر الحي (Center Pulse)' : 'Center Live Pulse'}
              </h2>
            </div>
            <span style={{
              fontSize: '14px',
              fontWeight: '800',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)'
            }}>
              94 / 100
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'استقرار التشغيل وانعدام التعارضات' : 'Schedule Integrity'}</span>
                <span style={{ color: 'var(--success)' }}>100%</span>
              </div>
              <div style={{ height: '6px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--success)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'نسبة حضور الطلاب بالباركود اليوم' : 'Today Attendance Rate'}</span>
                <span style={{ color: 'var(--primary)' }}>92.8%</span>
              </div>
              <div style={{ height: '6px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                <div style={{ width: '92.8%', height: '100%', backgroundColor: 'var(--primary)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'كفاءة تحصيل الاشتراكات' : 'Collection Efficiency'}</span>
                <span style={{ color: 'var(--warning)' }}>89.2%</span>
              </div>
              <div style={{ height: '6px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                <div style={{ width: '89.2%', height: '100%', backgroundColor: 'var(--warning)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* What Changed Report (Feature 83) */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '22px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'تقرير: ما الذي تغير منذ آخر تسجيل دخول؟' : 'What Changed Since Last Visit?'}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)'
            }}>
              <CheckCircle2 size={16} color="var(--success)" />
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}>
                {lang === 'ar' ? 'تسجيل 24 طالب جديد في مجموعات الدقي ومدينة نصر' : '24 new students enrolled in Dokki & Nasr City'}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)'
            }}>
              <DollarSign size={16} color="var(--primary)" />
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}>
                {lang === 'ar' ? 'تحصيل 18,400 ج.م اشتراكات جديدة عبر بوابة الدفع' : '18,400 EGP collected via payment gateway'}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)'
            }}>
              <Clock size={16} color="var(--primary)" />
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}>
                {lang === 'ar' ? 'اعتماد تسوية مستحقات الأسبوع الماضي لـ 3 مدرسين' : 'Approved settlements for 3 teachers'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 64: What Needs Attention? & Anomaly Detection */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '22px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="var(--warning)" />
            <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'ما الذي يحتاج إلى انتباهك الآن؟ (What Needs Attention?)' : 'What Needs Attention?'}
            </h2>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {lang === 'ar' ? '3 تنبيهات تتطلب إجراء إداري' : '3 items require action'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
          {/* Action 1 */}
          <div style={{
            padding: '14px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(245, 158, 11, 0.06)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {lang === 'ar' ? 'سعة قاعة 1 بفرع الدقي وصلت إلى 95%' : 'Hall 1 Dokki reached 95% capacity'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'مجموعة الفيزياء للثانوية العامة تضم 62 طالب من أصل 65 مقعد متاح.' : 'Physics cohort has 62 enrolled out of 65 seats.'}
              </div>
            </div>
            <Link
              to="/center/halls"
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--primary)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{lang === 'ar' ? 'مراجعة توزيع القاعات' : 'Manage Rooms'}</span>
              <ChevronLeft size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
            </Link>
          </div>

          {/* Action 2 */}
          <div style={{
            padding: '14px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--error-light)',
            border: '1px solid rgba(220, 38, 38, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {lang === 'ar' ? 'مستحقات معلقة للمدرسين بانتظار الاعتماد' : 'Pending Teacher Settlements'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'توجد تسوية أسبوعية للمستر أحمد جلال بقيمة 18,200 ج.م جاهزة للتحويل.' : 'Weekly settlement for Ahmed Galal (18,200 EGP) ready.'}
              </div>
            </div>
            <Link
              to="/center/financials"
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--danger)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{lang === 'ar' ? 'اعتماد الصرف المالي' : 'Approve Payout'}</span>
              <ChevronLeft size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
            </Link>
          </div>

          {/* Action 3 */}
          <div style={{
            padding: '14px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--primary-light)',
            border: '1px solid rgba(21, 136, 199, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {lang === 'ar' ? '5 طلبات تجربة جديدة في مسار التسجيل' : '5 New Trial Class Inquiries'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'عملاء محتملون في انتظار التواصل وتأكيد الحصة التجريبية.' : 'Prospective students waiting for trial confirmation.'}
              </div>
            </div>
            <Link
              to="/center/operations"
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--primary)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{lang === 'ar' ? 'فتح مسار العملاء CRM' : 'View CRM Pipeline'}</span>
              <ChevronLeft size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
            </Link>
          </div>
        </div>
      </div>

      {/* Feature 92: Ask Your Center Data (Natural Language AI Query) */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Sparkles size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
            {lang === 'ar' ? 'اسأل بيانات السنتر الذكية (Ask Your Center Data)' : 'Ask Your Center Data'}
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
          {lang === 'ar'
            ? 'تحدث مع نظام ذكاء الأعمال بلغتك الطبيعية للاستفسار اللحظي عن الإيرادات، الإشغال، الفروع، والمصروفات.'
            : 'Query your center business intelligence instantly using natural language.'}
        </p>

        {/* Input Bar */}
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          marginBottom: '14px'
        }}>
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
            placeholder={lang === 'ar' ? 'مثال: إيرادات الشهر كام؟ أو أي فرع نموه أعلى؟' : 'e.g., What are the total revenues this month?'}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleAskAi()}
            disabled={isAiLoading || !aiQuery.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 20px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: '700',
              fontSize: '13px',
              cursor: isAiLoading || !aiQuery.trim() ? 'not-allowed' : 'pointer',
              opacity: isAiLoading || !aiQuery.trim() ? 0.6 : 1
            }}
          >
            <Send size={15} />
            <span>{lang === 'ar' ? 'استعلام' : 'Query'}</span>
          </button>
        </div>

        {/* Preset Pill Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {lang === 'ar' ? 'أسئلة سريعة مقترحة:' : 'Quick Questions:'}
          </span>
          {sampleAiQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => {
                setAiQuery(sq);
                handleAskAi(sq);
              }}
              style={{
                fontSize: '12px',
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.15s ease'
              }}
            >
              {sq}
            </button>
          ))}
        </div>

        {/* AI Answer Box */}
        {(isAiLoading || aiResponse) && (
          <div style={{
            marginTop: '16px',
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(21, 136, 199, 0.05)',
            border: '1px solid rgba(21, 136, 199, 0.2)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <Sparkles size={18} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                {lang === 'ar' ? 'تحليل محرك ذكاء الأعمال' : 'BI Engine Analysis'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6', fontWeight: '500' }}>
                {isAiLoading ? (lang === 'ar' ? 'جاري استخراج وتحليل البيانات...' : 'Analyzing center data...') : aiResponse}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards to Center Sub-Modules */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px'
      }}>
        {/* Module: Cohorts & Groups */}
        <Link
          to="/center/groups"
          style={{
            textDecoration: 'none',
            backgroundColor: 'var(--bg-surface)',
            padding: '20px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            flexShrink: 0
          }}>
            <Users size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'المجموعات والصفوف وإدارة الباركود' : 'Cohorts & Barcode'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              {lang === 'ar' ? 'ربط المجموعات بالقاعات والمدرسين وسجلات الطلاب مع مسح باركود الحضور.' : 'Manage cohorts, room capacity, enrolled students and barcode scanner.'}
            </p>
          </div>
        </Link>

        {/* Module 1: Smart Attendance Scanner */}
        <Link
          to="/center/attendance"
          style={{
            textDecoration: 'none',
            backgroundColor: 'var(--bg-surface)',
            padding: '20px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--success-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--success)',
            flexShrink: 0
          }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'الباركود الذكي وتسجيل الحضور' : 'Smart QR Attendance'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              {lang === 'ar' ? 'المطابقة التلقائية لموعد الحصة وقاعة الطالب وسجل الحضور اللحظي.' : 'Auto-match time slot, room, and live student attendance register.'}
            </p>
          </div>
        </Link>

        {/* Module 2: Halls & Schedule */}
        <Link
          to="/center/halls"
          style={{
            textDecoration: 'none',
            backgroundColor: 'var(--bg-surface)',
            padding: '20px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            flexShrink: 0
          }}>
            <Calendar size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'إدارة القاعات ومنع التعارضات' : 'Rooms & Master Schedule'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              {lang === 'ar' ? 'جدول تشغيل القاعات وسعاتها واكتشاف أي تداخل زمني تلقائياً.' : 'Room capacities, teacher cohorts, and automated conflict detection.'}
            </p>
          </div>
        </Link>

        {/* Module 3: Financials & Teacher Settlements */}
        <Link
          to="/center/financials"
          style={{
            textDecoration: 'none',
            backgroundColor: 'var(--bg-surface)',
            padding: '20px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--warning-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--warning)',
            flexShrink: 0
          }}>
            <DollarSign size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'المالية ومستحقات المدرسين' : 'Financials & Settlements'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              {lang === 'ar' ? 'حساب نسب المدرسين والمصروفات والأرباح وصافي دخل السنتر.' : 'Automated teacher payout splits, P&L, expenses, and debts.'}
            </p>
          </div>
        </Link>

        {/* Module 4: Multi-Branch & CRM Operations */}
        <Link
          to="/center/operations"
          style={{
            textDecoration: 'none',
            backgroundColor: 'var(--bg-surface)',
            padding: '20px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            flexShrink: 0
          }}>
            <Layers size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'الفروع والعمليات والـ CRM' : 'Branches & CRM Pipeline'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              {lang === 'ar' ? 'مقارنة أداء الفروع، مسار تحويل الطلاب، وسجل العمليات والأمان.' : 'Branch comparisons, leads pipeline, and audit security trail.'}
            </p>
          </div>
        </Link>

        {/* Module 5: Settings, Tasks & Cloud Backup */}
        <Link
          to="/center/settings"
          style={{
            textDecoration: 'none',
            backgroundColor: 'var(--bg-surface)',
            padding: '20px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            flexShrink: 0
          }}>
            <Settings size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'إعدادات المنظومة والمهام' : 'Settings, Tasks & Backup'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              {lang === 'ar' ? 'سياسات المركز وسماحية التأخير، مهام الفريق، استيراد إكسيل والنسخ السحابي.' : 'Center policies, staff task checklists, Excel import, and cloud sync.'}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};
