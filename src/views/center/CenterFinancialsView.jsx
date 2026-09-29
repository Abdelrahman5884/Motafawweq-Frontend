import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCenter } from '../../context/CenterContext';
import { useGroups } from '../../context/GroupsContext';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Plus, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ArrowUpRight, 
  ShieldCheck, 
  Building2, 
  Users, 
  Percent, 
  Check, 
  X,
  CreditCard,
  Send,
  Download
} from 'lucide-react';

export const CenterFinancialsView = () => {
  const { lang, isRtl } = useLanguage();
  const { 
    expenses, 
    addExpense, 
    financialSummary, 
    branches, 
    selectedBranchId,
    exportToCsv
  } = useCenter();
  const { groups, enrolledStudents } = useGroups();

  const [activeTab, setActiveTab] = useState('pl'); // 'pl' | 'settlements' | 'expenses' | 'dues'
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [approvedPayoutId, setApprovedPayoutId] = useState(null);

  // New Expense Form State
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('rent');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseBranch, setExpenseBranch] = useState(selectedBranchId);

  // Calculate teacher settlements dynamically per teacher
  const teacherSettlementList = [
    {
      id: 't-1',
      teacherNameAr: 'أ. سامح عبدالحميد',
      subjectAr: 'الرياضيات البحتة',
      groupsCount: 3,
      studentsCount: 142,
      grossCollectedEgp: 71000,
      settlementRate: 0.75, // 75% for teacher, 25% for center
      teacherShareEgp: 53250,
      centerShareEgp: 17750,
      status: 'pending',
      statusAr: 'بانتظار الاعتماد'
    },
    {
      id: 't-2',
      teacherNameAr: 'د. سلمى السيد',
      subjectAr: 'الفيزياء للثانوية',
      groupsCount: 2,
      studentsCount: 110,
      grossCollectedEgp: 55000,
      settlementRate: 0.75,
      teacherShareEgp: 41250,
      centerShareEgp: 13750,
      status: 'approved',
      statusAr: 'تم الصرف والتحويل'
    },
    {
      id: 't-3',
      teacherNameAr: 'أ. أحمد جلال',
      subjectAr: 'الكيمياء للغات',
      groupsCount: 2,
      studentsCount: 78,
      grossCollectedEgp: 39000,
      settlementRate: 0.70, // 70%
      teacherShareEgp: 27300,
      centerShareEgp: 11700,
      status: 'pending',
      statusAr: 'بانتظار الاعتماد'
    }
  ];

  const handleCreateExpense = (e) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount) return;

    const categoryNames = {
      rent: 'إيجار المقرات',
      utilities: 'المرافق والخدمات',
      salaries: 'رواتب الموظفين',
      marketing: 'التسويق والدعاية',
      maintenance: 'الصيانة والتجهيزات'
    };

    addExpense({
      titleAr: expenseTitle,
      titleEn: expenseTitle,
      category: expenseCategory,
      categoryAr: categoryNames[expenseCategory] || 'مصروفات عامة',
      amountEgp: parseFloat(expenseAmount) || 0,
      branchId: expenseBranch,
      branchNameAr: branches.find(b => b.id === expenseBranch)?.nameAr || 'الفرع الرئيسي'
    });

    setExpenseTitle('');
    setExpenseAmount('');
    setIsAddExpenseOpen(false);
  };

  const handleApprovePayout = (id) => {
    setApprovedPayoutId(id);
    setTimeout(() => {
      setApprovedPayoutId(null);
    }, 3000);
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
            backgroundColor: 'rgba(21, 136, 199, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                {lang === 'ar' ? 'الإدارة المالية ومستحقات الشركاء' : 'Financials & Teacher Settlements'}
              </span>
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                fontWeight: '700'
              }}>
                {lang === 'ar' ? 'فترة سبتمبر 2026' : 'September 2026'}
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
              {lang === 'ar' ? 'الأرباح، المصروفات، وتسويات نسب المدرسين التلقائية' : 'P&L, Expenses & Automated Teacher Payouts'}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              const headers = ['رقم السند', 'بيان المصروف', 'التصنيف', 'الفرع', 'المبلغ (ج.م)', 'التاريخ', 'الحالة'];
              const rows = expenses.map(e => [
                e.receiptNumber,
                e.titleAr,
                e.categoryAr,
                e.branchNameAr,
                e.amountEgp,
                e.date,
                e.status === 'paid' ? 'مدفوع' : 'معلق'
              ]);
              exportToCsv('سجل_مصروفات_السنتر', headers, rows);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Download size={15} />
            <span>{lang === 'ar' ? 'تصدير المصروفات Excel' : 'Export Excel'}</span>
          </button>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            <span>{lang === 'ar' ? 'تسجيل مصروف جديد' : 'Log Expense'}</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Card 1: Gross Revenue */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px' }}>
            {lang === 'ar' ? 'إجمالي التحصيل من الطلاب' : 'Gross Student Tuition'}
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {financialSummary.grossCollectedRevenue.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: '600' }}>ج.م</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={13} />
            <span>{lang === 'ar' ? 'تحصيل اشتراكات المجموعات' : 'Tuition collected'}</span>
          </div>
        </div>

        {/* Card 2: Teacher Settlements */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px' }}>
            {lang === 'ar' ? 'مستحقات المدرسين (75%)' : 'Teacher Payouts'}
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
            {financialSummary.teacherPayouts.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: '600' }}>ج.م</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {lang === 'ar' ? 'محسوبة تلقائياً بناءً على الحصص' : 'Calculated by cohort split'}
          </div>
        </div>

        {/* Card 3: Total Expenses */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px' }}>
            {lang === 'ar' ? 'إجمالي المصروفات التشغيلية' : 'Operating Expenses'}
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--danger)', marginBottom: '4px' }}>
            {financialSummary.totalExpenses.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: '600' }}>ج.م</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {lang === 'ar' ? 'إيجار، كهرباء، رواتب، وصيانة' : 'Rent, bills, staff, marketing'}
          </div>
        </div>

        {/* Card 4: Net Profit */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px' }}>
            {lang === 'ar' ? 'صافي أرباح السنتر' : 'Center Net Profit'}
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
            {financialSummary.netProfit.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: '600' }}>ج.م</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '700' }}>
            {lang === 'ar' ? 'هامش ربح تشغيلي 38.2%' : '38.2% operating margin'}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '24px',
        gap: '24px'
      }}>
        {[
          { id: 'pl', labelAr: 'قائمة الأرباح والخسائر (P&L)', labelEn: 'Profit & Loss', icon: TrendingUp },
          { id: 'settlements', labelAr: 'مستحقات وتسويات المدرسين', labelEn: 'Teacher Settlements', icon: Users },
          { id: 'expenses', labelAr: 'سجل المصروفات وفواتير التشغيل', labelEn: 'Expense Register', icon: FileText },
          { id: 'dues', labelAr: 'المتأخرات والتحصيلات المعلقة', labelEn: 'Outstanding Dues', icon: AlertCircle }
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
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: P&L (Feature 28 & 86) */}
      {activeTab === 'pl' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
            {lang === 'ar' ? 'التحليل المالي الشامل وحساب الأرباح' : 'Comprehensive Financial P&L Breakdown'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--success-light)',
              border: '1px solid rgba(22, 163, 74, 0.25)'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--success)' }}>
                  {lang === 'ar' ? '(+) إجمالي الإيرادات المحصلة من الاشتراكات' : '(+) Gross Subscription Revenue'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'حصيلة اشتراكات الطلاب بجميع الفروع' : 'Collected from all student enrollments'}
                </div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--success)' }}>
                +{financialSummary.grossCollectedRevenue.toLocaleString()} ج.م
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              border: '1px solid rgba(21, 136, 199, 0.25)'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>
                  {lang === 'ar' ? '(-) نصيب المدرسين المستحق (حصة الشركاء 75%)' : '(-) Teacher Payout Share (75%)'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'تسويات نسب الحصص المباشرة للمدرسين' : 'Direct teacher revenue share'}
                </div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>
                -{financialSummary.teacherPayouts.toLocaleString()} ج.م
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--error-light)',
              border: '1px solid rgba(220, 38, 38, 0.25)'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--danger)' }}>
                  {lang === 'ar' ? '(-) المصروفات التشغيلية للمقرات والفروع' : '(-) Operating Center Expenses'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'إيجارات، فواتير كهرباء، صيانة، ورواتب' : 'Rent, utilities, staff salaries'}
                </div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--danger)' }}>
                -{financialSummary.totalExpenses.toLocaleString()} ج.م
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-app)',
              border: '2px solid var(--primary)',
              marginTop: '10px'
            }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>
                  {lang === 'ar' ? '(=) صافي أرباح إدارة السنتر المتبقية' : '(=) Center Net Operating Profit'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'العائد الصافي القابل للتوزيع أو الاستثمار' : 'Net distributable cash profit'}
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--primary)' }}>
                {financialSummary.netProfit.toLocaleString()} ج.م
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Teacher Settlements (Feature 21) */}
      {activeTab === 'settlements' && (
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
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'تسويات مستحقات المدرسين التلقائية' : 'Automated Teacher Settlements'}
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {lang === 'ar' ? 'حساب تلقائي للنسبة المئوية بناءً على الطلاب المسجلين والتحصيل الفعلي' : 'Automatic percentage split based on active student enrollments'}
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'اسم المدرس' : 'Teacher'}
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'المادة والمجموعات' : 'Subject & Groups'}
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'الطلاب المحصل منهم' : 'Paying Students'}
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'إجمالي المحصل' : 'Gross Collected'}
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'نسبة المدرس' : 'Teacher Split'}
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'مستحق الصرف' : 'Net Teacher Share'}
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'الإجراء والاعتماد' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {teacherSettlementList.map(t => {
                  const isApproved = t.status === 'approved' || approvedPayoutId === t.id;
                  return (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {t.teacherNameAr}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{t.subjectAr}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{t.groupsCount} مجموعات نشطة</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {t.studentsCount} طالب
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: 'var(--success)' }}>
                        {t.grossCollectedEgp.toLocaleString()} ج.م
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {t.settlementRate * 100}%
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>
                        {t.teacherShareEgp.toLocaleString()} ج.م
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {isApproved ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--success-light)',
                            color: 'var(--success)',
                            fontSize: '12px',
                            fontWeight: '700'
                          }}>
                            <CheckCircle2 size={13} />
                            {lang === 'ar' ? 'تم اعتماد الصرف' : 'Approved & Paid'}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApprovePayout(t.id)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'var(--primary)',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            {lang === 'ar' ? 'اعتماد وصرف التسوية' : 'Approve Payout'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Expenses Register (Feature 19 & 20) */}
      {activeTab === 'expenses' && (
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
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'سجل مصروفات وتشغيل الفروع' : 'Branch Expenses Ledger'}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {expenses.length} {lang === 'ar' ? 'سندات صرف مسجلة' : 'receipts logged'}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'رقم السند والتاريخ' : 'Receipt & Date'}
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'بيان المصروف' : 'Description'}
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'التصنيف' : 'Category'}
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'الفرع' : 'Branch'}
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'المبلغ' : 'Amount'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {exp.receiptNumber}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {exp.date}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {exp.titleAr}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-secondary)'
                      }}>
                        {exp.categoryAr}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {exp.branchNameAr}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '800', color: 'var(--danger)' }}>
                      {Number(exp.amountEgp).toLocaleString()} ج.م
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Outstanding Dues (Feature 29) */}
      {activeTab === 'dues' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} color="var(--warning)" />
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'سجل الأقساط والمتأخرات غير المحصلة' : 'Outstanding Receivables'}
              </h3>
            </div>
            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--warning)' }}>
              {lang === 'ar' ? 'إجمالي المتبقي: 38,500 ج.م' : 'Total: 38,500 EGP'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'عمر شريف الدسوقي', phone: '01022334455', group: 'فيزياء الثانوية العامة', amount: 450, daysDue: 8 },
              { name: 'ندى وائل الحسيني', phone: '01199887766', group: 'كيمياء اللغات', amount: 500, daysDue: 14 },
              { name: 'ياسين محمود كامل', phone: '01233445566', group: 'الرياضيات البحتة', amount: 450, daysDue: 21 }
            ].map((due, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {due.name} — {due.phone}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {due.group} • متأخر منذ {due.daysDue} يوم
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--danger)' }}>
                    {due.amount} ج.م
                  </span>
                  <button
                    onClick={() => alert(`تم إرسال رسالة تذكير بالسداد للطالب: ${due.name}`)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)',
                      color: 'var(--primary)',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Send size={12} />
                    <span>{lang === 'ar' ? 'إرسال تذكير سداد' : 'Remind'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Log Expense */}
      {isAddExpenseOpen && (
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
            maxWidth: '480px',
            width: '100%',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'تسجيل سند صرف مصروف' : 'Log Center Expense'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'بيان المصروف' : 'Description'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: صيانة أجهزة التكييف المركزي - فرع الدقي' : 'e.g. AC Maintenance'}
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'المبلغ (ج.م)' : 'Amount (EGP)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="1500"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'التصنيف' : 'Category'}
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  >
                    <option value="rent">إيجار المقرات</option>
                    <option value="utilities">المرافق والخدمات</option>
                    <option value="salaries">رواتب الموظفين</option>
                    <option value="marketing">التسويق والدعاية</option>
                    <option value="maintenance">الصيانة والتجهيزات</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'الفرع' : 'Branch'}
                </label>
                <select
                  value={expenseBranch}
                  onChange={(e) => setExpenseBranch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'حفظ السند المالي' : 'Save Expense'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
