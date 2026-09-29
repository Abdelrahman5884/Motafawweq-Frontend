import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCenter } from '../../context/CenterContext';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Layers, 
  Search, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Phone, 
  ArrowRight, 
  Lock, 
  Activity, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Check, 
  X,
  UserPlus,
  Compass,
  Link2,
  Download,
  Printer,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const CenterOperationsView = () => {
  const { lang, isRtl } = useLanguage();
  const { 
    branches, 
    staff, 
    addStaff, 
    leads, 
    addLead, 
    updateLeadStatus, 
    auditLogs,
    connectedUsers,
    searchGlobalUsers,
    connectUserToCenter,
    exportToCsv,
    financialSummary
  } = useCenter();

  const [activeTab, setActiveTab] = useState('branches'); // 'branches' | 'crm' | 'connect' | 'staff' | 'audit'
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('weekly'); // 'weekly' | 'monthly'

  // User Connect (Feature 9) State
  const [connectSearchQuery, setConnectSearchQuery] = useState('');
  const [selectedBranchForConnect, setSelectedBranchForConnect] = useState(branches[0]?.id || 'br-dokki');
  const [connectFeedback, setConnectFeedback] = useState(null);

  // New Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSubject, setLeadSubject] = useState('الفيزياء');
  const [leadSource, setLeadSource] = useState('Facebook Ads');

  // New Staff Form State
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('سكرتارية واستقبال');
  const [staffBranch, setStaffBranch] = useState('br-dokki');
  const [staffPhone, setStaffPhone] = useState('');

  // Search results for User Connect
  const searchResults = searchGlobalUsers(connectSearchQuery);

  const handleConnectUser = (user) => {
    const branchObj = branches.find(b => b.id === selectedBranchForConnect);
    const result = connectUserToCenter(user, selectedBranchForConnect, branchObj?.nameAr);
    setConnectFeedback(result);
    setTimeout(() => {
      setConnectFeedback(null);
    }, 3500);
  };

  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) return;

    addLead({
      nameAr: leadName,
      phone: leadPhone,
      targetSubjectAr: leadSubject,
      source: leadSource
    });

    setLeadName('');
    setLeadPhone('');
    setIsAddLeadOpen(false);
  };

  const handleCreateStaff = (e) => {
    e.preventDefault();
    if (!staffName.trim()) return;

    addStaff({
      nameAr: staffName,
      roleAr: staffRole,
      branchId: staffBranch,
      branchNameAr: branches.find(b => b.id === staffBranch)?.nameAr || 'فرع الدقي',
      phone: staffPhone || '+20 100 000 0000',
      permissions: ['إدارة الحضور بالباركود', 'تسجيل الطلاب', 'تحصيل الرسوم']
    });

    setStaffName('');
    setStaffPhone('');
    setIsAddStaffOpen(false);
  };

  const handleExportBranchesCsv = () => {
    const headers = ['اسم الفرع', 'العنوان', 'المدير', 'الهاتف', 'الطلاب النشطون', 'القاعات', 'الإيراد الشهري (ج.م)', 'المصروفات (ج.م)', 'نسبة الإشغال'];
    const rows = branches.map(b => [
      b.nameAr,
      b.addressAr,
      b.managerNameAr,
      b.phone,
      b.activeStudents,
      b.roomsCount,
      b.monthlyRevenueEgp,
      b.monthlyExpensesEgp,
      `${b.utilizationRate}%`
    ]);
    exportToCsv('تقرير_مقارنة_فروع_السنتر', headers, rows);
  };

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
    }}>
      {/* Header */}
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
            backgroundColor: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                {lang === 'ar' ? 'العمليات والنمو والربط الذكي' : 'Multi-Branch Operations & Connect'}
              </span>
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                fontWeight: '700'
              }}>
                {branches.length} {lang === 'ar' ? 'فروع نشطة' : 'Branches'}
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
              {lang === 'ar' ? 'مقارنة الفروع، خط تحويل العملاء، والربط بالمنصة' : 'Branch Intelligence, CRM & Global User Connect'}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Executive Report Generator Button (Features 69 & 70) */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 15px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              color: 'var(--primary)',
              border: '1px solid rgba(21, 136, 199, 0.25)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <FileText size={16} />
            <span>{lang === 'ar' ? 'التقرير الإداري التنفيذي' : 'Executive Report'}</span>
          </button>

          {/* Export to Excel (Feature 78) */}
          <button
            onClick={handleExportBranchesCsv}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 15px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Download size={16} />
            <span>{lang === 'ar' ? 'تصدير Excel' : 'Export Excel'}</span>
          </button>

          <button
            onClick={() => setIsAddLeadOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <UserPlus size={16} />
            <span>{lang === 'ar' ? 'إضافة عميل (Lead)' : 'Add Lead'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '24px',
        gap: '24px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {[
          { id: 'branches', labelAr: 'مقارنة الفروع والأداء التشغيلي', labelEn: 'Branch Benchmarks', icon: Building2 },
          { id: 'crm', labelAr: 'مسار العملاء والتسجيل (CRM Pipeline)', labelEn: 'CRM Pipeline', icon: Compass },
          { id: 'connect', labelAr: 'ربط مستخدم بالسنتر (User Connect)', labelEn: 'User Connect', icon: Link2 },
          { id: 'staff', labelAr: 'إدارة الموظفين والصلاحيات', labelEn: 'Staff & Roles', icon: ShieldCheck },
          { id: 'audit', labelAr: 'سجل العمليات والأمان (Audit Log)', labelEn: 'Audit Trail', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 4px',
                border: 'none',
                background: 'none',
                fontSize: '14px',
                fontWeight: '700',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Branch Comparison (Feature 3 & 4) */}
      {activeTab === 'branches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {branches.map(branch => {
              const netBranchIncome = branch.monthlyRevenueEgp - branch.monthlyExpensesEgp;
              return (
                <div
                  key={branch.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-subtle)',
                    padding: '22px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                        {branch.addressAr}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--success-light)',
                        color: 'var(--success)',
                        fontWeight: '700'
                      }}>
                        {branch.utilizationRate}% إشغال
                      </span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                      {branch.nameAr}
                    </h3>

                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      مدير الفرع: {branch.managerNameAr} • هاتف: {branch.phone}
                    </div>

                    {/* Performance Metrics */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                      backgroundColor: 'var(--bg-app)',
                      padding: '12px',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '12px'
                    }}>
                      <div>
                        <div style={{ color: 'var(--text-secondary)' }}>الطلاب النشطون:</div>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {branch.activeStudents} طالب
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-secondary)' }}>القاعات المجهزة:</div>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary)' }}>
                          {branch.roomsCount} قاعات
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-secondary)' }}>الإيراد الشهري:</div>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--success)' }}>
                          {branch.monthlyRevenueEgp.toLocaleString()} ج.م
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-secondary)' }}>المصروفات:</div>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--danger)' }}>
                          {branch.monthlyExpensesEgp.toLocaleString()} ج.م
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Contribution */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                      صافي مساهمة الفرع:
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary)' }}>
                      +{netBranchIncome.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CRM Pipeline (Features 39 - 43) */}
      {activeTab === 'crm' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            {[
              { id: 'new', labelAr: '1. استفسار جديد', color: 'var(--primary)' },
              { id: 'contacted', labelAr: '2. تم التواصل والمتابعة', color: 'var(--warning)' },
              { id: 'trial', labelAr: '3. حجز حصة تجريبية', color: 'var(--color-primary-light)' },
              { id: 'registered', labelAr: '4. تم التسجيل وسداد الرسوم', color: 'var(--success)' }
            ].map(col => {
              const colLeads = leads.filter(l => l.status === col.id);
              return (
                <div
                  key={col.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: col.color }}>
                      {col.labelAr}
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-secondary)'
                    }}>
                      {colLeads.length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {colLeads.length === 0 ? (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>
                        {lang === 'ar' ? 'لا توجد طلبات في هذه المرحلة' : 'No items'}
                      </div>
                    ) : (
                      colLeads.map(lead => (
                        <div
                          key={lead.id}
                          style={{
                            padding: '12px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-app)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                              {lead.nameAr}
                            </div>
                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                              {lead.createdAt}
                            </span>
                          </div>

                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            الهاتف: {lead.phone} • المادة: {lead.targetSubjectAr}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                            <span style={{
                              fontSize: '10px',
                              padding: '2px 6px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'rgba(21, 136, 199, 0.1)',
                              color: 'var(--primary)',
                              fontWeight: '600'
                            }}>
                              {lead.source}
                            </span>

                            {col.id === 'new' && (
                              <button
                                onClick={() => updateLeadStatus(lead.id, 'contacted', 'تم التواصل')}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: 'var(--primary)',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  cursor: 'pointer'
                                }}
                              >
                                {lang === 'ar' ? 'تواصل الآن' : 'Contact'}
                              </button>
                            )}

                            {col.id === 'contacted' && (
                              <button
                                onClick={() => updateLeadStatus(lead.id, 'trial', 'حجز تجربة')}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: 'var(--primary)',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  cursor: 'pointer'
                                }}
                              >
                                {lang === 'ar' ? 'حجز تجربة' : 'Book Trial'}
                              </button>
                            )}

                            {col.id === 'trial' && (
                              <button
                                onClick={() => updateLeadStatus(lead.id, 'registered', 'تم التسجيل')}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: 'var(--success)',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  cursor: 'pointer'
                                }}
                              >
                                {lang === 'ar' ? 'تأكيد التسجيل' : 'Register'}
                              </button>
                            )}

                            {col.id === 'registered' && (
                              <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '700' }}>
                                تم التحويل بنجاح
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: User Search & Connect (Feature 9) */}
      {activeTab === 'connect' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Search Box Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Link2 size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'البحث عن مستخدم وربطه بالسنتر (Motafawweq Connect)' : 'User Search & Connect'}
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px 0', lineHeight: '1.5' }}>
              {lang === 'ar'
                ? 'ابحث عن مدرس أو طالب مسجل بالفعل على منصة متفوق باستخدام رقم الهاتف، اسم المستخدم، أو البريد الإلكتروني وقم بربطه بالسنتر فوراً دون إنشاء حساب جديد.'
                : 'Search existing students or teachers on Motafawweq by phone, email, or username and bind them to the center.'}
            </p>

            {/* Inputs Bar */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'ابحث برقم الهاتف (مثال: 01001122334) أو الاسم أو البريد...' : 'Search by phone, username, or email...'}
                  value={connectSearchQuery}
                  onChange={(e) => setConnectSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <select
                value={selectedBranchForConnect}
                onChange={(e) => setSelectedBranchForConnect(e.target.value)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    ربط بـ {b.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Feedback Alert */}
            {connectFeedback && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: connectFeedback.success ? 'var(--success-light)' : 'var(--error-light)',
                border: `1px solid ${connectFeedback.success ? 'var(--success)' : 'var(--danger)'}`,
                fontSize: '13px',
                fontWeight: '700',
                color: connectFeedback.success ? 'var(--success)' : 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px'
              }}>
                {connectFeedback.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{connectFeedback.messageAr}</span>
              </div>
            )}

            {/* Results Grid */}
            {connectSearchQuery.trim() && (
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {lang === 'ar' ? `نتائج البحث في منصة متفوق (${searchResults.length}):` : 'Search Results:'}
                </div>

                {searchResults.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {lang === 'ar' ? 'لا يوجد مستخدم مسجل يطابق هذا البحث' : 'No users found'}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    {searchResults.map(user => (
                      <div
                        key={user.id}
                        style={{
                          padding: '14px',
                          borderRadius: 'var(--radius-lg)',
                          backgroundColor: 'var(--bg-app)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '10px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                              {user.nameAr}
                            </div>
                            <span style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: user.role === 'teacher' ? 'rgba(21, 136, 199, 0.1)' : 'var(--success-light)',
                              color: user.role === 'teacher' ? 'var(--primary)' : 'var(--success)',
                              fontWeight: '700'
                            }}>
                              {user.roleAr}
                            </span>
                          </div>

                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            الهاتف: {user.phone} • {user.email}
                          </div>
                          {user.subjectAr && (
                            <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '600', marginTop: '2px' }}>
                              المادة: {user.subjectAr}
                            </div>
                          )}
                          {user.gradeAr && (
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                              المرحلة: {user.gradeAr}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleConnectUser(user)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <Link2 size={13} />
                          <span>{lang === 'ar' ? 'ربط الحساب بالسنتر' : 'Connect to Center'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Currently Connected Users Table */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'الحسابات المربوطة بالسنتر عبر منصة متفوق' : 'Connected Platform Accounts'}
              </h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>الاسم</th>
                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>الدور</th>
                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>الهاتف</th>
                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>الفرع المربوط به</th>
                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>تاريخ الربط</th>
                  </tr>
                </thead>
                <tbody>
                  {connectedUsers.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{u.nameAr}</td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>{u.roleAr}</td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>{u.phone}</td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-primary)' }}>{u.branchNameAr}</td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>{u.connectedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Staff & Roles (Feature 10) */}
      {activeTab === 'staff' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            padding: '16px 20px',
            backgroundColor: 'var(--bg-app)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'قائمة موظفي ومسؤولي السنتر' : 'Center Staff & Roles'}
            </h3>
            <button
              onClick={() => setIsAddStaffOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>{lang === 'ar' ? 'إضافة موظف' : 'Add Staff'}</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>اسم الموظف</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>الدور</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>الفرع</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>الصلاحيات</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(member => (
                  <tr key={member.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{member.nameAr}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{member.phone}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>{member.roleAr}</td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-primary)' }}>{member.branchNameAr}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {member.permissions?.map((p, idx) => (
                          <span key={idx} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
                        نشط
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Activity & Audit Trail (Feature 12) */}
      {activeTab === 'audit' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '22px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Activity size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'سجل العمليات الإدارية والأمان (Audit Log)' : 'Security & Activity Audit Log'}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {auditLogs.map(log => (
              <div
                key={log.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  fontSize: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                    {log.actionAr} — <span style={{ color: 'var(--primary)' }}>{log.userAr}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {log.detailsAr}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  <Clock size={12} />
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Executive Report Modal (Features 69 & 70) */}
      {isReportModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--border-subtle)',
            maxWidth: '600px',
            width: '100%',
            padding: '28px',
            boxShadow: 'var(--shadow-xl)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'التقرير الإداري التنفيذي للسنتر' : 'Executive Management Digest'}
                </h3>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Toggle Weekly vs Monthly */}
            <div style={{
              display: 'inline-flex',
              backgroundColor: 'var(--bg-subtle)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setReportType('weekly')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: reportType === 'weekly' ? 'var(--primary)' : 'transparent',
                  color: reportType === 'weekly' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'التقرير الأسبوعي (Weekly Report)' : 'Weekly'}
              </button>
              <button
                onClick={() => setReportType('monthly')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: reportType === 'monthly' ? 'var(--primary)' : 'transparent',
                  color: reportType === 'monthly' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'التقرير الشهري التنفيذي (Monthly Digest)' : 'Monthly'}
              </button>
            </div>

            {/* Report Document Content */}
            <div style={{
              backgroundColor: 'var(--bg-app)',
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              fontSize: '13px'
            }}>
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '15px' }}>
                  أكاديمية الرواد التعليمية — {reportType === 'weekly' ? 'ملخص الأسبوع الأخير من سبتمبر 2026' : 'الملخص المالي والتشغيلي لشهر سبتمبر 2026'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  تم التوليد آلياً بواسطة محرك ذكاء الأعمال لمنصة متفوق
                </div>
              </div>

              <div>
                <div style={{ fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
                  1. الأداء المالي والربحية:
                </div>
                <div style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  بلغ إجمالي تحصيل الاشتراكات {financialSummary.grossCollectedRevenue.toLocaleString()} ج.م، تم سداد {financialSummary.teacherPayouts.toLocaleString()} ج.م منها كحصص تسوية للمعلمين، وصافي ربح السنتر التشغيلي هو {financialSummary.netProfit.toLocaleString()} ج.م.
                </div>
              </div>

              <div>
                <div style={{ fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
                  2. التشغيل واستغلال القاعات:
                </div>
                <div style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  كفاءة التشغيل بلغت 84% عبر 15 قاعة مجهزة في 3 فروع. نسبة الحضور عبر الباركود التلقائي وصلت إلى 93.4% مع انعدام تام لأي تعارضات زمنية في الجداول.
                </div>
              </div>

              <div>
                <div style={{ fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
                  3. توصيات الإدارة الذكية:
                </div>
                <div style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  يوصى بنقل مجموعة الفيزياء للثانوية العامة للقاعة الكبرى لتجنب تجاوز السعة، مع إمكانية استغلال الفترات الصباحية لأيام الأحد والثلاثاء لطرح مجموعات لغات إضافية.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button
                onClick={() => window.print()}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={15} />
                <span>{lang === 'ar' ? 'طباعة التقرير (Print / PDF)' : 'Print / Save PDF'}</span>
              </button>
              <button
                onClick={() => setIsReportModalOpen(false)}
                style={{
                  padding: '11px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Lead */}
      {isAddLeadOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            maxWidth: '460px',
            width: '100%',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'إضافة عميل محتمل جديد' : 'New CRM Lead'}
              </h3>
              <button onClick={() => setIsAddLeadOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateLead} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>اسم الطالب أو ولي الأمر</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>رقم الهاتف / واتساب</label>
                <input
                  type="tel"
                  required
                  placeholder="010..."
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>المادة المستهدفة</label>
                <input
                  type="text"
                  required
                  value={leadSubject}
                  onChange={(e) => setLeadSubject(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>مصدر الاستفسار</label>
                <select
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                >
                  <option value="Facebook Ads">إعلانات فيسبوك</option>
                  <option value="Instagram">إنستجرام</option>
                  <option value="Walk-in">زيارة مباشرة للسنتر</option>
                  <option value="Referral">ترشيح من صديق أو طالب</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                >
                  حفظ العميل
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddLeadOpen(false)}
                  style={{ padding: '12px 18px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Staff */}
      {isAddStaffOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            maxWidth: '460px',
            width: '100%',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'إضافة موظف وتحديد صلاحياته' : 'Add Staff Member'}
              </h3>
              <button onClick={() => setIsAddStaffOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>اسم الموظف</label>
                <input
                  type="text"
                  required
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>المسمى الوظيفي والدور</label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                >
                  <option value="سكرتارية واستقبال">سكرتارية واستقبال</option>
                  <option value="مدير فرع">مدير فرع</option>
                  <option value="محاسب مالي">محاسب مالي</option>
                  <option value="مشرف قاعات">مشرف قاعات</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>الفرع المخصص له</label>
                <select
                  value={staffBranch}
                  onChange={(e) => setStaffBranch(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.nameAr}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                >
                  حفظ الموظف
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  style={{ padding: '12px 18px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
