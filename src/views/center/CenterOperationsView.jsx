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
  Check, 
  X,
  UserPlus,
  Link2,
  Download,
  Printer,
  Sparkles,
  Calendar,
  AlertCircle,
  Pencil,
  Trash2,
  Mail,
  GraduationCap,
  Copy,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CenterOperationsView = () => {
  const { lang, isRtl } = useLanguage();
  const { 
    branches = [], 
    addBranch,
    updateBranch,
    deleteBranch,
    centerTeachers = [],
    addCenterTeacher,
    updateCenterTeacher,
    deleteCenterTeacher,
    resendTeacherInvite,
    rooms = [],
    staff = [], 
    addStaff, 
    auditLogs = [],
    connectedUsers = [],
    searchGlobalUsers,
    connectUserToCenter,
    exportToCsv
  } = useCenter();

  // Active Tab: 'branches' | 'teachers' | 'staff' | 'audit' (CRM removed as requested!)
  const [activeTab, setActiveTab] = useState('branches');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── BRANCHES STATE & MODALS ──
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [deleteConfirmBranch, setDeleteConfirmBranch] = useState(null);

  const [branchNameAr, setBranchNameAr] = useState('');
  const [branchNameEn, setBranchNameEn] = useState('');
  const [branchAddressAr, setBranchAddressAr] = useState('');
  const [branchPhone, setBranchPhone] = useState('');
  const [branchManagerAr, setBranchManagerAr] = useState('');

  const handleOpenAddBranch = () => {
    setBranchNameAr('');
    setBranchNameEn('');
    setBranchAddressAr('');
    setBranchPhone('+20 2 ');
    setBranchManagerAr('');
    setIsAddBranchOpen(true);
  };

  const handleOpenEditBranch = (b) => {
    setEditingBranch(b);
    setBranchNameAr(b.nameAr || '');
    setBranchNameEn(b.nameEn || '');
    setBranchAddressAr(b.addressAr || '');
    setBranchPhone(b.phone || '');
    setBranchManagerAr(b.managerNameAr || '');
  };

  const handleSaveBranch = (e) => {
    e.preventDefault();
    if (!branchNameAr.trim()) return;

    if (editingBranch) {
      updateBranch(editingBranch.id, {
        nameAr: branchNameAr,
        nameEn: branchNameEn || branchNameAr,
        addressAr: branchAddressAr,
        phone: branchPhone,
        managerNameAr: branchManagerAr
      });
      showToast(`تم تحديث بيانات الفرع «${branchNameAr}» بنجاح!`);
      setEditingBranch(null);
    } else {
      addBranch({
        nameAr: branchNameAr,
        nameEn: branchNameEn || branchNameAr,
        addressAr: branchAddressAr,
        phone: branchPhone,
        managerNameAr: branchManagerAr
      });
      showToast(`تم إنشاء وتدشين الفرع «${branchNameAr}» بنجاح!`);
      setIsAddBranchOpen(false);
    }
  };

  const handleConfirmDeleteBranch = () => {
    if (!deleteConfirmBranch) return;
    deleteBranch(deleteConfirmBranch.id);
    showToast(`تم حذف وإغلاق فرع «${deleteConfirmBranch.nameAr}».`);
    setDeleteConfirmBranch(null);
  };

  // ── TEACHERS STATE & MODALS ──
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [deleteConfirmTeacher, setDeleteConfirmTeacher] = useState(null);

  const [tchNameAr, setTchNameAr] = useState('');
  const [tchSubjectAr, setTchSubjectAr] = useState('الفيزياء');
  const [tchPhone, setTchPhone] = useState('');
  const [tchEmail, setTchEmail] = useState('');
  const [tchBranchId, setTchBranchId] = useState(branches[0]?.id || 'br-dokki');

  const handleOpenAddTeacher = () => {
    setTchNameAr('');
    setTchSubjectAr('الفيزياء');
    setTchPhone('01');
    setTchEmail('');
    setTchBranchId(branches[0]?.id || 'br-dokki');
    setIsAddTeacherOpen(true);
  };

  const handleSaveTeacher = (e) => {
    e.preventDefault();
    if (!tchNameAr.trim() || !tchEmail.trim()) return;

    addCenterTeacher({
      nameAr: tchNameAr,
      subjectAr: tchSubjectAr,
      phone: tchPhone,
      email: tchEmail,
      branchId: tchBranchId
    });

    showToast(`تمت إضافة المعلم «${tchNameAr}» وإرسال رابط التفعيل لمنصة متفوق على بريده بنجاح!`);
    setIsAddTeacherOpen(false);
  };

  const handleConfirmDeleteTeacher = () => {
    if (!deleteConfirmTeacher) return;
    deleteCenterTeacher(deleteConfirmTeacher.id);
    showToast(`تم حذف وفك اعتماد المعلم «${deleteConfirmTeacher.nameAr}» من السنتر.`);
    setDeleteConfirmTeacher(null);
  };

  const handleResendTeacherInvite = (tch) => {
    resendTeacherInvite(tch.id);
    navigator.clipboard?.writeText?.(tch.activationLink || 'https://motafawweq.edu.eg/teacher/activate');
    showToast(`تم نسخ وإعادة إرسال رابط تفعيل المنصة للمعلم «${tch.nameAr}»!`);
  };

  // ── USER CONNECT SEARCH (Platform Search) ──
  const [connectSearchQuery, setConnectSearchQuery] = useState('');
  const [selectedBranchForConnect, setSelectedBranchForConnect] = useState(branches[0]?.id || 'br-dokki');
  const [connectFeedback, setConnectFeedback] = useState(null);
  const searchResults = searchGlobalUsers ? searchGlobalUsers(connectSearchQuery) : [];

  const handleConnectUser = (user) => {
    const branchObj = branches.find(b => b.id === selectedBranchForConnect);
    const result = connectUserToCenter(user, selectedBranchForConnect, branchObj?.nameAr);
    setConnectFeedback(result);
    setTimeout(() => setConnectFeedback(null), 3500);
  };

  // ── STAFF STATE ──
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('سكرتارية واستقبال');
  const [staffBranch, setStaffBranch] = useState(branches[0]?.id || 'br-dokki');
  const [staffPhone, setStaffPhone] = useState('');

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
    showToast(`تمت إضافة الموظف «${staffName}» بنجاح!`);
  };

  // ── EXECUTIVE REPORT (Zero finances) ──
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('weekly');

  const handleExportBranchesCsv = () => {
    const headers = ['اسم الفرع', 'العنوان', 'المدير', 'الهاتف', 'عدد القاعات', 'عدد الطلاب', 'عدد المدرسين', 'نسبة الإشغال'];
    const rows = branches.map(b => {
      const rCount = rooms.filter(r => r.branchId === b.id).length;
      const tCount = centerTeachers.filter(t => t.branchId === b.id).length;
      return [
        b.nameAr,
        b.addressAr,
        b.managerNameAr,
        b.phone,
        rCount,
        b.activeStudents || 0,
        tCount,
        `${b.utilizationRate || 0}%`
      ];
    });
    exportToCsv('مقارنة_فروع_السنتر_التشغيلية', headers, rows);
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
                {lang === 'ar' ? 'العمليات والانتشار وشبكة المعلمين' : 'Operations & Teachers Network'}
              </span>
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                fontWeight: '700'
              }}>
                {branches.length} {lang === 'ar' ? 'فروع نشطة' : 'Branches'} • {centerTeachers.length} {lang === 'ar' ? 'معلمين معتمدين' : 'Teachers'}
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
              {lang === 'ar' ? 'مقارنة وإدارة الفروع، وشبكة المعلمين المعتمدين' : 'Branches Management & Certified Teachers Network'}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Executive Report Generator Button (Zero Financials) */}
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

          {/* Export to Excel */}
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

          {/* Add Branch Button (When in branches tab) */}
          {activeTab === 'branches' && (
            <button
              onClick={handleOpenAddBranch}
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
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(21, 136, 199, 0.25)'
              }}
            >
              <Plus size={16} />
              <span>{lang === 'ar' ? 'إنشاء فرع جديد' : 'New Branch'}</span>
            </button>
          )}

          {/* Add Teacher Button (When in teachers tab) */}
          {activeTab === 'teachers' && (
            <button
              onClick={handleOpenAddTeacher}
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
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(21, 136, 199, 0.25)'
              }}
            >
              <UserPlus size={16} />
              <span>{lang === 'ar' ? 'إضافة مدرس جديد واعتماده' : 'Add Teacher'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation (CRM removed!) */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '24px',
        gap: '24px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {[
          { id: 'branches', labelAr: 'مقارنة وإدارة الفروع', labelEn: 'Branch Benchmarks & Management', icon: Building2 },
          { id: 'teachers', labelAr: 'شبكة وإدارة المعلمين والربط بالمنصة', labelEn: 'Teachers Network & Connect', icon: GraduationCap },
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

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 1: BRANCH BENCHMARKS & MANAGEMENT (مقارنة وإدارة الفروع)
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'branches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
            gap: '20px'
          }}>
            {branches.map(branch => {
              const bRoomsCount = rooms.filter(r => r.branchId === branch.id).length;
              const bTeachersCount = centerTeachers.filter(t => t.branchId === branch.id).length;
              const bStudentsCount = branch.activeStudents || 0;

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
                    gap: '16px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    {/* Top Row: Address & Utilization Badge */}
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
                        {branch.utilizationRate || 80}% إشغال
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                      {branch.nameAr}
                    </h3>

                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      مدير الفرع: <strong>{branch.managerNameAr}</strong> • هاتف: <strong>{branch.phone}</strong>
                    </div>

                    {/* ── THE 3 REQUIRED COMPARISON METRICS (عدد القاعات، عدد الطلاب، عدد المدرسين) ── */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '10px',
                      backgroundColor: 'var(--bg-app)',
                      padding: '14px 10px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-subtle)',
                      textAlign: 'center'
                    }}>
                      <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '700', marginBottom: '3px' }}>
                          عدد القاعات
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--primary)' }}>
                          {bRoomsCount} قاعات
                        </div>
                      </div>

                      <div style={{ borderInlineStart: '1px solid var(--border-subtle)', borderInlineEnd: '1px solid var(--border-subtle)' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '700', marginBottom: '3px' }}>
                          عدد الطلاب
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
                          {bStudentsCount} طالب
                        </div>
                      </div>

                      <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '700', marginBottom: '3px' }}>
                          عدد المدرسين
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--success)' }}>
                          {bTeachersCount} مدرس
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Branch Action Buttons: Edit, Delete, View Halls */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--border-subtle)',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => handleOpenEditBranch(branch)}
                        title={lang === 'ar' ? 'تعديل بيانات الفرع' : 'Edit Branch'}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '7px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-app)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        <Pencil size={13} style={{ color: 'var(--primary)' }} />
                        <span>{lang === 'ar' ? 'تعديل' : 'Edit'}</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmBranch(branch)}
                        title={lang === 'ar' ? 'حذف الفرع' : 'Delete Branch'}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '7px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          backgroundColor: 'rgba(239, 68, 68, 0.06)',
                          color: 'var(--danger)',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={13} />
                        <span>{lang === 'ar' ? 'مسح' : 'Delete'}</span>
                      </button>
                    </div>

                    <Link
                      to="/center/halls"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        fontWeight: '800',
                        color: 'var(--primary)',
                        textDecoration: 'none'
                      }}
                    >
                      <span>{lang === 'ar' ? 'القاعات' : 'Halls'}</span>
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 2: TEACHERS NETWORK & CONNECT (شبكة وإدارة المعلمين والربط بالمنصة)
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'teachers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Search & Connect on Platform (Motafawweq Connect) */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '22px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Link2 size={20} color="var(--primary)" />
                  <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'البحث عن معلم مسجل بالمنصة لربطه بالسنتر فوراً' : 'Quick Connect Existing Teacher'}
                  </h3>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
                  {lang === 'ar'
                    ? 'ابحث برقم الهاتف أو الاسم لأي معلم مسجل على منصة متفوق لاعتماده وربطه بفرع السنتر دون الحاجة لتسجيل جديد.'
                    : 'Search existing teachers on the platform and link them to a center branch.'}
                </p>
              </div>

              <button
                onClick={handleOpenAddTeacher}
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
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                <Plus size={15} />
                <span>{lang === 'ar' ? 'إضافة مدرس جديد ودعوته بالإيميل' : 'New Teacher via Email'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'ابحث برقم الهاتف (مثال: 010...) أو الاسم...' : 'Search by phone or name...'}
                  value={connectSearchQuery}
                  onChange={(e) => setConnectSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 16px',
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
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700'
                }}
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    ربط بـ {b.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {connectFeedback && (
              <div style={{
                marginTop: '12px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: connectFeedback.success ? 'var(--success-light)' : 'var(--error-light)',
                border: `1px solid ${connectFeedback.success ? 'var(--success)' : 'var(--danger)'}`,
                fontSize: '12.5px',
                fontWeight: '700',
                color: connectFeedback.success ? 'var(--success)' : 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {connectFeedback.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{connectFeedback.messageAr}</span>
              </div>
            )}

            {/* Platform Search Results */}
            {connectSearchQuery.trim() && searchResults.length > 0 && (
              <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {searchResults.map(user => (
                  <div
                    key={user.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {user.nameAr}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        {user.phone} • {user.subjectAr || user.roleAr}
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnectUser(user)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {lang === 'ar' ? 'ربط الآن' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Center Teachers Table */}
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
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
                  {lang === 'ar' ? 'قائمة المعلمين المعتمدين والمربوطين بالسنتر' : 'Certified Teachers Network'}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {centerTeachers.length} {lang === 'ar' ? 'مدرسين متاحين للربط بالمجموعات الدراسية' : 'teachers available for cohorts'}
                </span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 18px' }}>اسم المدرس</th>
                    <th style={{ padding: '12px 18px' }}>التخصص والمادة</th>
                    <th style={{ padding: '12px 18px' }}>الفرع التابع له</th>
                    <th style={{ padding: '12px 18px' }}>الهاتف والبريد الإلكتروني</th>
                    <th style={{ padding: '12px 18px' }}>حالة المنصة والدعوة</th>
                    <th style={{ padding: '12px 18px', textAlign: 'center' }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {centerTeachers.map(tch => (
                    <tr key={tch.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                      <td style={{ padding: '14px 18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(21, 136, 199, 0.12)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '900',
                            fontSize: '13px'
                          }}>
                            {tch.nameAr.charAt(0)}
                          </div>
                          <span>{tch.nameAr}</span>
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px', color: 'var(--text-primary)', fontWeight: '700' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-app)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '12px'
                        }}>
                          {tch.subjectAr}
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px', color: 'var(--primary)', fontWeight: '700' }}>
                        {tch.branchNameAr || 'فرع الدقي'}
                      </td>

                      <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                        <div>{tch.phone}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{tch.email}</div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '11px',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'rgba(16, 185, 129, 0.12)',
                          color: '#10B981',
                          fontWeight: '800'
                        }}>
                          <CheckCircle2 size={13} />
                          <span>{tch.statusAr || 'معتمد ونشط'}</span>
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleResendTeacherInvite(tch)}
                            title={lang === 'ar' ? 'نسخ وإعادة إرسال رابط التفعيل للمدرس' : 'Resend Invite Link'}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-app)',
                              color: 'var(--primary)',
                              fontSize: '11.5px',
                              fontWeight: '800',
                              cursor: 'pointer'
                            }}
                          >
                            <Copy size={12} />
                            <span>{lang === 'ar' ? 'رابط التفعيل' : 'Link'}</span>
                          </button>

                          <button
                            onClick={() => setDeleteConfirmTeacher(tch)}
                            title={lang === 'ar' ? 'حذف المعلم من السنتر' : 'Remove Teacher'}
                            style={{
                              padding: '6px 8px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              backgroundColor: 'rgba(239, 68, 68, 0.06)',
                              color: 'var(--danger)',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 3: STAFF & ROLES (الموظفون والصلاحيات)
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'staff' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'إدارة الموظفين الإداريين وفريق الاستقبال' : 'Admin & Staff Roles'}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {staff.length} {lang === 'ar' ? 'موظفين معينين بالفروع' : 'active staff members'}
              </span>
            </div>

            <button
              onClick={() => setIsAddStaffOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <UserPlus size={14} />
              <span>{lang === 'ar' ? 'إضافة موظف جديد' : 'Add Staff'}</span>
            </button>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 18px' }}>الاسم</th>
                  <th style={{ padding: '12px 18px' }}>المسمى الوظيفي</th>
                  <th style={{ padding: '12px 18px' }}>الفرع المخصص</th>
                  <th style={{ padding: '12px 18px' }}>الهاتف</th>
                  <th style={{ padding: '12px 18px' }}>الصلاحيات الرئيسية</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                    <td style={{ padding: '14px 18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {s.nameAr}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-primary)',
                        fontWeight: '700'
                      }}>
                        {s.roleAr}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--primary)', fontWeight: '600' }}>
                      {s.branchNameAr}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                      {s.phone}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {s.permissions.map((p, i) => (
                          <span key={i} style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)' }}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 4: AUDIT LOG (سجل العمليات والأمان)
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'audit' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'سجل العمليات والرقابة والأمان (Audit Log)' : 'Audit Trail & Activity Log'}
            </h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 18px' }}>التوقيت</th>
                  <th style={{ padding: '12px 18px' }}>العملية</th>
                  <th style={{ padding: '12px 18px' }}>المنفذ</th>
                  <th style={{ padding: '12px 18px' }}>التفاصيل والملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '12.5px' }}>
                    <td style={{ padding: '12px 18px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {log.timestamp}
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: '800', color: 'var(--primary)' }}>
                      {log.actionAr}
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {log.userAr}
                    </td>
                    <td style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>
                      {log.detailsAr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: ADD NEW BRANCH (إنشاء فرع كامل)
          ═══════════════════════════════════════════════════════════════════ */}
      {isAddBranchOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--border-medium)',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'إنشاء وتدشين فرع جديد للسنتر' : 'Create New Branch'}
                </h3>
              </div>
              <button onClick={() => setIsAddBranchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>اسم الفرع *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فرع التجمع الخامس (الفرع الرابع)"
                  value={branchNameAr}
                  onChange={(e) => setBranchNameAr(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '700' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>العنوان والموقع الجغرافي *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شارع التسعين الجنوبي، التجمع الخامس"
                  value={branchAddressAr}
                  onChange={(e) => setBranchAddressAr(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>مدير الفرع *</label>
                  <input
                    type="text"
                    required
                    placeholder="أ. حسام فؤاد"
                    value={branchManagerAr}
                    onChange={(e) => setBranchManagerAr(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>رقم هاتف الفرع *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+20 2 2789 0011"
                    value={branchPhone}
                    onChange={(e) => setBranchPhone(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'تدشين الفرع وحفظه' : 'Create Branch'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddBranchOpen(false)}
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
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: EDIT BRANCH (تعديل بيانات الفرع)
          ═══════════════════════════════════════════════════════════════════ */}
      {editingBranch && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--border-medium)',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Pencil size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? `تعديل بيانات «${editingBranch.nameAr}»` : 'Edit Branch'}
                </h3>
              </div>
              <button onClick={() => setEditingBranch(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>اسم الفرع *</label>
                <input
                  type="text"
                  required
                  value={branchNameAr}
                  onChange={(e) => setBranchNameAr(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '700' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>العنوان *</label>
                <input
                  type="text"
                  required
                  value={branchAddressAr}
                  onChange={(e) => setBranchAddressAr(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>مدير الفرع *</label>
                  <input
                    type="text"
                    required
                    value={branchManagerAr}
                    onChange={(e) => setBranchManagerAr(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>رقم هاتف الفرع *</label>
                  <input
                    type="tel"
                    required
                    value={branchPhone}
                    onChange={(e) => setBranchPhone(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  حفظ التعديلات
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
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
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: DELETE BRANCH CONFIRMATION (مسح الفرع)
          ═══════════════════════════════════════════════════════════════════ */}
      {deleteConfirmBranch && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid rgba(239, 68, 68, 0.4)',
            maxWidth: '440px',
            width: '100%',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto'
            }}>
              <Trash2 size={26} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              {lang === 'ar' ? 'تأكيد مسح وحذف الفرع' : 'Delete Branch'}
            </h3>

            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              {lang === 'ar'
                ? `هل أنت متأكد من مسح الفرع «${deleteConfirmBranch.nameAr}» نهائياً من السنتر؟ لن يتم حذف القاعات أو الحصص التاريخية.`
                : `Are you sure you want to delete branch "${deleteConfirmBranch.nameAr}"?`}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleConfirmDeleteBranch}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--danger)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'نعم، احذف الفرع' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setDeleteConfirmBranch(null)}
                style={{
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: ADD NEW TEACHER (إضافة مدرس جديد ودعوته بالإيميل)
          ═══════════════════════════════════════════════════════════════════ */}
      {isAddTeacherOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--border-medium)',
            maxWidth: '500px',
            width: '100%',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={22} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'إضافة مدرس جديد واعتماده بالسنتر' : 'Add New Teacher'}
                </h3>
              </div>
              <button onClick={() => setIsAddTeacherOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                  اسم المدرس بالكامل *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: د. حسام فاروق طاهر"
                  value={tchNameAr}
                  onChange={(e) => setTchNameAr(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '700' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                    المادة والتخصص *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: الفيزياء، الكيمياء..."
                    value={tchSubjectAr}
                    onChange={(e) => setTchSubjectAr(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                    الفرع الأساسي المربوط به
                  </label>
                  <select
                    value={tchBranchId}
                    onChange={(e) => setTchBranchId(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '700' }}
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.nameAr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                  البريد الإلكتروني للمدرس (لإرسال رابط فتح المنصة) *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="teacher@motafawweq.com"
                    value={tchEmail}
                    onChange={(e) => setTchEmail(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', paddingInlineStart: '38px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                  <Mail size={16} style={{ position: 'absolute', top: '13px', right: isRtl ? '12px' : 'auto', left: isRtl ? 'auto' : '12px', color: 'var(--primary)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01012345678"
                  value={tchPhone}
                  onChange={(e) => setTchPhone(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              {/* Informative Activation Note */}
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(21, 136, 199, 0.08)',
                border: '1px solid rgba(21, 136, 199, 0.25)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5
              }}>
                <Sparkles size={14} style={{ color: 'var(--primary)', marginInlineEnd: '6px' }} />
                <span>
                  {lang === 'ar'
                    ? 'سيتم توليد رابط تفعيل خاص للمعلم وإرساله إلى بريده الإلكتروني لكي يفتح منصة متفوق ويبدأ بتدريس مجموعاته، وسيظهر فوراً في قائمة المدرسين عند إنشاء أي مجموعة جديدة.'
                    : 'An invitation link will be sent to the teacher email so they can activate their account on Motafawweq.'}
                </span>
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
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'إضافة المدرس وإرسال الرابط فوراً ✓' : 'Add Teacher & Send Invite'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddTeacherOpen(false)}
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
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: DELETE TEACHER CONFIRMATION (مسح مدرس)
          ═══════════════════════════════════════════════════════════════════ */}
      {deleteConfirmTeacher && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid rgba(239, 68, 68, 0.4)',
            maxWidth: '440px',
            width: '100%',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto'
            }}>
              <Trash2 size={26} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              {lang === 'ar' ? 'تأكيد مسح وفك ربط المعلم' : 'Delete Teacher'}
            </h3>

            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              {lang === 'ar'
                ? `هل أنت متأكد من مسح المعلم «${deleteConfirmTeacher.nameAr}» (${deleteConfirmTeacher.subjectAr}) من السنتر؟ لن يظهر في قائمة اختيار المدرسين عند إنشاء المجموعات.`
                : `Are you sure you want to remove teacher "${deleteConfirmTeacher.nameAr}"?`}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleConfirmDeleteTeacher}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--danger)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'نعم، مسح المعلم' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setDeleteConfirmTeacher(null)}
                style={{
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: ADD STAFF
          ═══════════════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: EXECUTIVE OPERATIONAL REPORT (بدون أي أرقام مالية!)
          ═══════════════════════════════════════════════════════════════════ */}
      {isReportModalOpen && (
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
            maxWidth: '600px',
            width: '100%',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'التقرير الإداري والتشغيلي للسنتر' : 'Executive Operational Report'}
                </h3>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Frequency Selector */}
            <div style={{
              display: 'flex',
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

            {/* Report Document Content (No Finances!) */}
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
                  أكاديمية الرواد التعليمية — {reportType === 'weekly' ? 'ملخص الأداء والتشغيل الأسبوعي' : 'الملخص الإداري والتشغيلي لشهر سبتمبر 2026'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  تم التوليد آلياً بواسطة محرك ذكاء الأعمال لمنصة متفوق
                </div>
              </div>

              <div>
                <div style={{ fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
                  1. الطاقة الاستيعابية والانتشار الجغرافي:
                </div>
                <div style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  يضم السنتر حالياً {branches.length} فروع تشغيلية، بعدد إجمالي {rooms.length} قاعة تدريسية مجهزة بالكامل بالصوتيات والشاشات الذكية، مع بطاقة استيعابية تتجاوز 850 مقعداً ومعدل إشغال متزن.
                </div>
              </div>

              <div>
                <div style={{ fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
                  2. شبكة المعلمين والتشغيل الأكاديمي:
                </div>
                <div style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  تضم الشبكة {centerTeachers.length} معلماً معتمداً مربوطين بالمنصة. نسبة الحضور عبر الباركود التلقائي وصلت إلى 93.8% مع انعدام تام لأي تعارضات زمنية في جداول القاعات بين المدرسين.
                </div>
              </div>

              <div>
                <div style={{ fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
                  3. توصيات الإدارة الذكية:
                </div>
                <div style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  يوصى بنقل المجموعات ذات الكثافة العالية إلى القاعات الكبرى، والاستفادة من الفترات الصباحية لأيام الأحد والثلاثاء لطرح ورش عمل ومراجعات إضافية للثانوية العامة.
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

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: isRtl ? '24px' : 'auto',
          left: isRtl ? 'auto' : '24px',
          zIndex: 100000,
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(21, 136, 199, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: '700',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <Sparkles size={16} style={{ color: '#38BDF8' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
