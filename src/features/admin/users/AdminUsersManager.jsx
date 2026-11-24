import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { adminApi } from '../../../services/adminApi';
import {
  Users,
  Search,
  UserCheck,
  UserX,
  ShieldCheck,
  Plus,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  FileText,
  GraduationCap,
  Award,
  X,
  Edit3,
  Trash2,
  MoreVertical,
  Eye,
  Mail,
  Phone,
  Calendar,
  QrCode,
  Download,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building,
  Lock
} from 'lucide-react';

const DEFAULT_AVATAR_BY_ROLE = {
  student: '/characters/student.png',
  teacher: '/characters/teacher.png',
  parent: '/characters/parent.png',
  center: '/characters/teacher.png',
  admin: '/characters/teacher.png',
};

export const AdminUsersManager = () => {
  const { lang, isRtl } = useLanguage();

  // List & Pagination State
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    students: 0,
    teachers: 0,
    parents: 0,
    centers: 0,
    admins: 0,
    pendingVerifications: 0,
    suspended: 0,
  });
  const [meta, setMeta] = useState({ current_page: 1, per_page: 15, total: 0, last_page: 1, has_more: false });

  // Filters
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [page, setPage] = useState(1);

  // Loading & Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionBusyId, setActionBusyId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);

  // Modals & Popovers
  const [selectedUserForVerification, setSelectedUserForVerification] = useState(null);
  const [verificationNote, setVerificationNote] = useState('');
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [activeDropdownUserId, setActiveDropdownUserId] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    role: 'student',
    email: '',
    phone: '',
    nationalId: '',
    details: '',
  });

  const showToast = useCallback((text, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ text, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch users from live API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.users.list({
        search: debouncedSearch || undefined,
        role: selectedRole !== 'all' ? selectedRole : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        page,
        per_page: 15,
      });
      setUsers(Array.isArray(res?.data) ? res.data : []);
      if (res?.meta?.summary) {
        setSummary(res.meta.summary);
      }
      if (res?.meta) {
        setMeta({
          current_page: res.meta.current_page ?? 1,
          per_page: res.meta.per_page ?? 15,
          total: res.meta.total ?? 0,
          last_page: res.meta.last_page ?? 1,
          has_more: Boolean(res.meta.has_more),
        });
      }
    } catch (err) {
      setError(err?.message || (lang === 'ar' ? 'تعذر تحميل قائمة المستخدمين' : 'Failed to load users'));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedRole, selectedStatus, page, lang]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.user-action-menu-container')) {
        setActiveDropdownUserId(null);
      }
    };
    if (activeDropdownUserId) {
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [activeDropdownUserId]);

  const roleLabels = {
    all: lang === 'ar' ? 'جميع المستخدمين' : 'All Users',
    student: lang === 'ar' ? 'الطلاب' : 'Students',
    teacher: lang === 'ar' ? 'المعلمون' : 'Teachers',
    parent: lang === 'ar' ? 'أولياء الأمور' : 'Parents',
    center: lang === 'ar' ? 'السناتر التعليمية' : 'Centers',
    center_admin: lang === 'ar' ? 'السناتر التعليمية' : 'Centers',
    admin: lang === 'ar' ? 'مشرف المنصة' : 'Platform Admin',
  };

  const getAvatar = (u) => u?.avatar || DEFAULT_AVATAR_BY_ROLE[u?.role] || '/characters/student.png';

  const handleOpenDetails = async (userRow) => {
    setSelectedUserForDetails(userRow);
    setLoadingDetails(true);
    try {
      const res = await adminApi.users.get(userRow.id);
      if (res?.data) {
        setSelectedUserForDetails(res.data);
      }
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر جلب التفاصيل الكاملة للمستخدم' : 'Failed to fetch full profile'), 'error');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleOpenEditUser = (user) => {
    if (user.role === 'admin') {
      showToast(lang === 'ar' ? 'لا يمكن تعديل حساب مشرف منصة من هذه الشاشة' : 'Platform admin accounts are protected', 'error');
      return;
    }
    setSelectedUserForEdit({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role === 'center_admin' ? 'center' : (user.role || 'student'),
      status: user.status || 'active',
      details: user.detailsAr || user.details || '',
      nationalIdMasked: user.nationalIdMasked || user.nationalId || '',
      newNationalId: '',
    });
    setIsEditUserModalOpen(true);
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!selectedUserForEdit || !selectedUserForEdit.name.trim() || !selectedUserForEdit.email.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: selectedUserForEdit.name.trim(),
        email: selectedUserForEdit.email.trim(),
        phone: selectedUserForEdit.phone?.trim() || null,
        role: selectedUserForEdit.role,
        status: selectedUserForEdit.status,
        details_ar: selectedUserForEdit.details?.trim() || null,
      };
      if (selectedUserForEdit.newNationalId.trim()) {
        payload.national_id = selectedUserForEdit.newNationalId.trim();
      }

      const res = await adminApi.users.update(selectedUserForEdit.id, payload);
      const updated = res?.data;
      if (updated) {
        setUsers(prev => prev.map(u => (u.id === updated.id ? { ...u, ...updated } : u)));
        setSelectedUserForDetails(prev => (prev && prev.id === updated.id ? { ...prev, ...updated } : prev));
      } else {
        fetchUsers();
      }
      setIsEditUserModalOpen(false);
      setSelectedUserForEdit(null);
      showToast(lang === 'ar' ? 'تم تحديث بيانات المستخدم بنجاح' : 'User data updated successfully');
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'فشل تحديث بيانات المستخدم' : 'Failed to update user'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeleteConfirm = (user) => {
    if (user.role === 'admin') {
      showToast(lang === 'ar' ? 'لا يمكن حذف حساب مشرف المنصة' : 'Cannot delete platform admin', 'error');
      return;
    }
    setUserToDelete({
      id: user.id,
      name: lang === 'ar' ? (user.nameAr || user.name) : (user.nameEn || user.name),
    });
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    setSubmitting(true);
    try {
      await adminApi.users.delete(userToDelete.id);
      const deletedName = userToDelete.name;
      setUserToDelete(null);
      setSelectedUserForDetails(prev => (prev && prev.id === userToDelete.id ? null : prev));
      showToast(lang === 'ar' ? `تم حذف حساب (${deletedName}) نهائياً بنجاح` : `Account (${deletedName}) deleted successfully`);
      fetchUsers();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'فشل حذف الحساب' : 'Failed to delete account'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    setActionBusyId(userId);
    try {
      const res = await adminApi.users.toggleStatus(userId);
      const updated = res?.data;
      if (updated) {
        setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...updated } : u)));
        setSelectedUserForDetails(prev => (prev && prev.id === userId ? { ...prev, ...updated } : prev));
      }
      showToast(
        updated?.status === 'suspended'
          ? (lang === 'ar' ? 'تم تجميد الحساب وإلغاء جميع جلساته النشطة' : 'Account suspended and active sessions revoked')
          : (lang === 'ar' ? 'تم إعادة تنشيط الحساب بنجاح' : 'Account reactivated successfully')
      );
      fetchUsers();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'فشل تغيير حالة الحساب' : 'Failed to toggle status'), 'error');
    } finally {
      setActionBusyId(null);
    }
  };

  const handleApproveTeacher = async (userId) => {
    setSubmitting(true);
    try {
      const res = await adminApi.users.verify(userId, { notes: verificationNote.trim() || undefined });
      const updated = res?.data;
      if (updated) {
        setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...updated } : u)));
      }
      setSelectedUserForVerification(null);
      setVerificationNote('');
      showToast(lang === 'ar' ? 'تم توثيق واعتماد الحساب بنجاح' : 'Account verified & approved successfully');
      fetchUsers();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر اعتماد الحساب' : 'Verification failed'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectTeacher = async (userId) => {
    setSubmitting(true);
    try {
      const res = await adminApi.users.rejectVerification(userId, { reason: verificationNote.trim() || undefined });
      const updated = res?.data;
      if (updated) {
        setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...updated } : u)));
      }
      setSelectedUserForVerification(null);
      setVerificationNote('');
      showToast(lang === 'ar' ? 'تم رفض طلب التوثيق وتجميد الحساب' : 'Verification rejected and account suspended');
      fetchUsers();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر رفض طلب التوثيق' : 'Rejection failed'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (user) => {
    setActionBusyId(user.id);
    try {
      await adminApi.users.resetPassword(user.id);
      const displayName = lang === 'ar' ? (user.nameAr || user.name) : (user.nameEn || user.name);
      showToast(
        lang === 'ar'
          ? `تم إرسال رمز إعادة تعيين كلمة المرور إلى (${displayName}) وإنهاء جلساته النشطة`
          : `Password reset OTP dispatched to ${displayName} and sessions revoked`
      );
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر إرسال رابط إعادة التعيين' : 'Failed to trigger password reset'), 'error');
    } finally {
      setActionBusyId(null);
    }
  };

  const handleRevokeSessions = async (user) => {
    setActionBusyId(user.id);
    try {
      const res = await adminApi.users.revokeSessions(user.id);
      const count = res?.data?.revokedCount ?? 0;
      setSelectedUserForDetails(prev => (prev && prev.id === user.id ? { ...prev, activeSessionsCount: 0 } : prev));
      showToast(
        lang === 'ar'
          ? `تم تسجيل خروج المستخدم من جميع الأجهزة (${count} جلسة نشطة)`
          : `Revoked ${count} active session(s) for user`
      );
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر إنهاء جلسات المستخدم' : 'Failed to revoke sessions'), 'error');
    } finally {
      setActionBusyId(null);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: newUser.name.trim(),
        role: newUser.role,
        email: newUser.email.trim(),
        ...(newUser.phone.trim() ? { phone: newUser.phone.trim() } : {}),
        ...(newUser.nationalId.trim() ? { national_id: newUser.nationalId.trim() } : {}),
        ...(newUser.details.trim() ? { details_ar: newUser.details.trim() } : {}),
      };
      await adminApi.users.create(payload);
      setIsAddUserModalOpen(false);
      setNewUser({ name: '', role: 'student', email: '', phone: '', nationalId: '', details: '' });
      showToast(lang === 'ar' ? 'تم إنشاء الحساب بنجاح وإرسال رمز التفعيل للبريد' : 'User account created successfully');
      setPage(1);
      fetchUsers();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر إنشاء الحساب، راجع البيانات المدخلة' : 'Failed to create user'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCsv = async () => {
    setExportingCsv(true);
    try {
      await adminApi.users.exportCsv(
        {
          search: debouncedSearch || undefined,
          role: selectedRole !== 'all' ? selectedRole : undefined,
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
        },
        `motafawweq-users-${new Date().toISOString().slice(0, 10)}.csv`
      );
      showToast(lang === 'ar' ? 'تم تصدير ملف CSV للمستخدمين بنجاح' : 'Users CSV exported successfully');
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'فشل تصدير ملف CSV' : 'CSV export failed'), 'error');
    } finally {
      setExportingCsv(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: isRtl ? '24px' : 'auto',
          right: isRtl ? 'auto' : '24px',
          backgroundColor: toast.type === 'error' ? '#991B1B' : 'var(--color-brand-dark)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: '600',
          maxWidth: '420px',
        }}>
          {toast.type === 'error'
            ? <AlertCircle size={18} color="#FCA5A5" style={{ flexShrink: 0 }} />
            : <CheckCircle2 size={18} color="var(--primary-light)" style={{ flexShrink: 0 }} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Summary Stats Row (Live from DB) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))',
        gap: '14px'
      }}>
        {[
          {
            labelAr: 'إجمالي المستخدمين',
            labelEn: 'Total Users',
            count: summary.total,
            icon: Users,
            color: 'var(--primary)',
            bg: 'rgba(21, 136, 199, 0.12)',
            onClick: () => { setSelectedRole('all'); setSelectedStatus('all'); setPage(1); },
          },
          {
            labelAr: 'الطلاب المسجلون',
            labelEn: 'Students',
            count: summary.students,
            icon: GraduationCap,
            color: '#047857',
            bg: 'rgba(16, 185, 129, 0.12)',
            onClick: () => { setSelectedRole('student'); setSelectedStatus('all'); setPage(1); },
          },
          {
            labelAr: 'المعلمون والأساتذة',
            labelEn: 'Teachers',
            count: summary.teachers,
            icon: Award,
            color: '#B45309',
            bg: 'rgba(245, 158, 11, 0.12)',
            onClick: () => { setSelectedRole('teacher'); setSelectedStatus('all'); setPage(1); },
          },
          {
            labelAr: 'أولياء الأمور',
            labelEn: 'Parents',
            count: summary.parents,
            icon: Users,
            color: '#6D28D9',
            bg: 'rgba(139, 92, 246, 0.12)',
            onClick: () => { setSelectedRole('parent'); setSelectedStatus('all'); setPage(1); },
          },
          {
            labelAr: 'السناتر التعليمية',
            labelEn: 'Centers',
            count: summary.centers,
            icon: Building,
            color: 'var(--primary)',
            bg: 'rgba(92, 182, 219, 0.16)',
            onClick: () => { setSelectedRole('center'); setSelectedStatus('all'); setPage(1); },
          },
          {
            labelAr: 'طلبات التوثيق المعلقة',
            labelEn: 'Pending KYC',
            count: summary.pendingVerifications,
            icon: ShieldCheck,
            color: '#B91C1C',
            bg: 'rgba(239, 68, 68, 0.12)',
            onClick: () => { setSelectedRole('all'); setSelectedStatus('pending_verification'); setPage(1); },
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <button
              key={i}
              type="button"
              onClick={stat.onClick}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '15px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                textAlign: isRtl ? 'right' : 'left',
                transition: 'border-color 0.15s ease',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
                flexShrink: 0,
              }}>
                <Icon size={19} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                  {lang === 'ar' ? stat.labelAr : stat.labelEn}
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {Number(stat.count || 0).toLocaleString()}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        {/* Search */}
        <div style={{
          position: 'relative',
          flex: '1 1 240px',
          maxWidth: '340px'
        }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              insetInlineStart: '12px',
              color: 'var(--text-secondary)'
            }}
          />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث بالاسم، البريد، الهاتف أو الرقم القومي...' : 'Search by name, email, phone, or ID...'}
            style={{
              width: '100%',
              padding: '9px 14px',
              paddingInlineStart: '36px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px'
            }}
          />
        </div>

        {/* Role Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {['all', 'student', 'teacher', 'parent', 'center'].map(role => {
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => { setSelectedRole(role); setPage(1); }}
                style={{
                  padding: '7px 12px',
                  borderRadius: '10px',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                  color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: isSelected ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {roleLabels[role]}
              </button>
            );
          })}

          <select
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value); setPage(1); }}
            style={{
              padding: '7px 10px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <option value="all">{lang === 'ar' ? 'كل الحالات' : 'All Statuses'}</option>
            <option value="active">{lang === 'ar' ? 'نشط' : 'Active'}</option>
            <option value="verified">{lang === 'ar' ? 'موثق ومعتمد' : 'Verified'}</option>
            <option value="pending_verification">{lang === 'ar' ? 'بانتظار الاعتماد' : 'Pending KYC'}</option>
            <option value="suspended">{lang === 'ar' ? 'حساب مجمد' : 'Suspended'}</option>
          </select>
        </div>

        {/* Actions: Refresh, Export CSV, Add User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            title={lang === 'ar' ? 'تحديث القائمة' : 'Refresh'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exportingCsv}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              padding: '8px 13px',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: exportingCsv ? 'wait' : 'pointer',
            }}
          >
            <Download size={15} />
            <span>{exportingCsv ? (lang === 'ar' ? 'جاري التصدير...' : 'Exporting...') : (lang === 'ar' ? 'تصدير CSV' : 'Export CSV')}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddUserModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              padding: '9px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            <span>{lang === 'ar' ? 'إضافة مستخدم جديد' : 'New User'}</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '14px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          color: '#B91C1C',
          fontSize: '13px',
          fontWeight: '600',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchUsers}
            style={{
              backgroundColor: '#B91C1C',
              color: '#fff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* Users Table */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="responsive-table-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', minHeight: activeDropdownUserId ? '360px' : 'auto', transition: 'min-height 0.2s ease' }}>
          <table className="responsive-table" style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
            <thead>
              <tr style={{
                backgroundColor: 'var(--bg-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--text-secondary)'
              }}>
                <th style={{ padding: '14px 18px' }}>{lang === 'ar' ? 'المستخدم' : 'User'}</th>
                <th style={{ padding: '14px 18px' }}>{lang === 'ar' ? 'الدور' : 'Role'}</th>
                <th style={{ padding: '14px 18px' }}>{lang === 'ar' ? 'التفاصيل / التخصص' : 'Details'}</th>
                <th style={{ padding: '14px 18px' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                <th style={{ padding: '14px 18px' }}>{lang === 'ar' ? 'تاريخ الانضمام' : 'Joined'}</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '44px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13.5px' }}>
                    {lang === 'ar' ? 'جاري تحميل حسابات المنصة...' : 'Loading platform accounts...'}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '44px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'لم يتم العثور على أي مستخدمين يطابقون معايير البحث' : 'No users match the search criteria'}
                  </td>
                </tr>
              ) : (
                users.map((u, index) => {
                  const isSuspended = u.status === 'suspended';
                  const isVerified = u.status === 'verified';
                  const isPending = u.status === 'pending_verification';
                  const isAdminRow = u.role === 'admin';
                  const isRowBusy = actionBusyId === u.id;

                  return (
                    <tr
                      key={u.id}
                      onClick={() => handleOpenDetails(u)}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '13px',
                        cursor: 'pointer',
                        opacity: isRowBusy ? 0.6 : 1,
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {/* User Info */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={getAvatar(u)}
                            alt={u.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '12px',
                              objectFit: 'cover',
                              border: '1.5px solid var(--border-subtle)'
                            }}
                            onError={(e) => { e.currentTarget.src = '/characters/student.png'; }}
                          />
                          <div>
                            <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '13.5px' }}>
                              {lang === 'ar' ? (u.nameAr || u.name) : (u.nameEn || u.name)}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              color: 'var(--primary)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginTop: '2px',
                              fontWeight: '600'
                            }}>
                              <Eye size={11} />
                              <span>{lang === 'ar' ? 'عرض التفاصيل الكاملة' : 'View Full Profile'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor:
                            u.role === 'teacher' ? 'rgba(245, 158, 11, 0.12)' :
                            u.role === 'student' ? 'rgba(16, 185, 129, 0.12)' :
                            u.role === 'center' ? 'rgba(21, 136, 199, 0.12)' :
                            u.role === 'admin' ? 'rgba(6, 37, 78, 0.14)' : 'rgba(139, 92, 246, 0.12)',
                          color:
                            u.role === 'teacher' ? '#B45309' :
                            u.role === 'student' ? '#047857' :
                            u.role === 'center' ? 'var(--primary)' :
                            u.role === 'admin' ? 'var(--text-primary)' : '#6D28D9'
                        }}>
                          {roleLabels[u.role] || u.role}
                        </span>
                      </td>

                      {/* Details */}
                      <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                        <div style={{ fontSize: '12.5px', lineHeight: '1.4', color: 'var(--text-primary)', fontWeight: '600' }}>
                          {(lang === 'ar' ? (u.detailsAr || u.details) : (u.detailsEn || u.details)) || u.email}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor:
                            isVerified ? 'rgba(16, 185, 129, 0.12)' :
                            isPending ? 'rgba(245, 158, 11, 0.15)' :
                            isSuspended ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                          color:
                            isVerified ? '#047857' :
                            isPending ? '#B45309' :
                            isSuspended ? '#B91C1C' : '#047857'
                        }}>
                          {isVerified && <ShieldCheck size={13} />}
                          {isPending && <FileText size={13} />}
                          {isVerified ? (lang === 'ar' ? 'موثق ومعتمد' : 'Verified') :
                           isPending ? (lang === 'ar' ? 'بانتظار الاعتماد' : 'Pending KYC') :
                           isSuspended ? (lang === 'ar' ? 'حساب مجمد' : 'Suspended') : (lang === 'ar' ? 'نشط' : 'Active')}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                        {u.joinDate || '—'}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 18px', textAlign: 'center', position: 'relative' }} className="user-action-menu-container">
                        <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownUserId(activeDropdownUserId === u.id ? null : u.id);
                            }}
                            title={lang === 'ar' ? 'خيارات وإجراءات' : 'Actions'}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              border: activeDropdownUserId === u.id ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                              backgroundColor: activeDropdownUserId === u.id ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                              color: activeDropdownUserId === u.id ? 'var(--primary)' : 'var(--text-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <MoreVertical size={16} />
                          </button>

                          {/* Dropdown Menu */}
                          {activeDropdownUserId === u.id && (
                            <div
                              onClick={e => e.stopPropagation()}
                              style={{
                                position: 'absolute',
                                top: index >= users.length - 2 && users.length > 2 ? 'auto' : 'calc(100% - 2px)',
                                bottom: index >= users.length - 2 && users.length > 2 ? 'calc(100% - 2px)' : 'auto',
                                right: isRtl ? 'auto' : '18px',
                                left: isRtl ? '18px' : 'auto',
                                backgroundColor: 'var(--bg-surface)',
                                border: '1.5px solid var(--border-subtle)',
                                borderRadius: '14px',
                                padding: '6px',
                                boxShadow: 'var(--shadow-xl)',
                                zIndex: 90,
                                minWidth: '205px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                textAlign: isRtl ? 'right' : 'left'
                              }}
                            >
                              {/* View Details */}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveDropdownUserId(null);
                                  handleOpenDetails(u);
                                }}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px',
                                  borderRadius: '8px', border: 'none', backgroundColor: 'transparent',
                                  color: 'var(--primary)', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', textAlign: 'inherit'
                                }}
                              >
                                <Eye size={14} color="var(--primary)" />
                                <span>{lang === 'ar' ? 'عرض كامل التفاصيل' : 'View Full Details'}</span>
                              </button>

                              {isAdminRow ? (
                                <div style={{
                                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px',
                                  fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '600',
                                }}>
                                  <Lock size={13} />
                                  <span>{lang === 'ar' ? 'حساب مشرف محمي' : 'Protected Admin'}</span>
                                </div>
                              ) : (
                                <>
                                  {/* Edit */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveDropdownUserId(null);
                                      handleOpenEditUser(u);
                                    }}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px',
                                      borderRadius: '8px', border: 'none', backgroundColor: 'transparent',
                                      color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', textAlign: 'inherit'
                                    }}
                                  >
                                    <Edit3 size={14} color="var(--primary)" />
                                    <span>{lang === 'ar' ? 'تعديل البيانات' : 'Edit User'}</span>
                                  </button>

                                  {/* KYC Verification if Teacher/Center Pending */}
                                  {isPending && (u.role === 'teacher' || u.role === 'center') && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveDropdownUserId(null);
                                        setVerificationNote('');
                                        setSelectedUserForVerification(u);
                                      }}
                                      style={{
                                        display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px',
                                        borderRadius: '8px', border: 'none', backgroundColor: 'transparent',
                                        color: 'var(--color-success)', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', textAlign: 'inherit'
                                      }}
                                    >
                                      <ShieldCheck size={14} />
                                      <span>{lang === 'ar' ? 'فحص واعتماد التوثيق' : 'Review & Verify'}</span>
                                    </button>
                                  )}

                                  {/* Status Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveDropdownUserId(null);
                                      handleToggleStatus(u.id);
                                    }}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px',
                                      borderRadius: '8px', border: 'none', backgroundColor: 'transparent',
                                      color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', textAlign: 'inherit'
                                    }}
                                  >
                                    {isSuspended ? <UserCheck size={14} color="var(--color-success)" /> : <UserX size={14} color="#D97706" />}
                                    <span>{isSuspended ? (lang === 'ar' ? 'تنشيط وتفعيل' : 'Activate Account') : (lang === 'ar' ? 'تجميد الحساب' : 'Suspend Account')}</span>
                                  </button>

                                  {/* Password Reset */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveDropdownUserId(null);
                                      handleResetPassword(u);
                                    }}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px',
                                      borderRadius: '8px', border: 'none', backgroundColor: 'transparent',
                                      color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', textAlign: 'inherit'
                                    }}
                                  >
                                    <KeyRound size={14} color="var(--primary)" />
                                    <span>{lang === 'ar' ? 'إعادة ضبط كلمة المرور' : 'Reset Password'}</span>
                                  </button>

                                  {/* Revoke Sessions */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveDropdownUserId(null);
                                      handleRevokeSessions(u);
                                    }}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px',
                                      borderRadius: '8px', border: 'none', backgroundColor: 'transparent',
                                      color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', textAlign: 'inherit'
                                    }}
                                  >
                                    <LogOut size={14} color="#D97706" />
                                    <span>{lang === 'ar' ? 'إنهاء جميع الجلسات' : 'Revoke Sessions'}</span>
                                  </button>

                                  <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

                                  {/* Delete */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveDropdownUserId(null);
                                      handleOpenDeleteConfirm(u);
                                    }}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px',
                                      borderRadius: '8px', border: 'none', backgroundColor: 'transparent',
                                      color: 'var(--color-danger)', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', textAlign: 'inherit'
                                    }}
                                  >
                                    <Trash2 size={14} color="var(--color-danger)" />
                                    <span>{lang === 'ar' ? 'حذف المستخدم' : 'Delete User'}</span>
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {meta.total > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <span>
              {lang === 'ar'
                ? `عرض الصفحة ${meta.current_page} من ${meta.last_page} — إجمالي ${meta.total.toLocaleString()} حساب`
                : `Page ${meta.current_page} of ${meta.last_page} — ${meta.total.toLocaleString()} accounts`}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                disabled={meta.current_page <= 1 || loading}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)',
                  fontSize: '12px', fontWeight: '700',
                  cursor: meta.current_page <= 1 ? 'not-allowed' : 'pointer',
                  opacity: meta.current_page <= 1 ? 0.5 : 1,
                }}
              >
                {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                <span>{lang === 'ar' ? 'السابق' : 'Prev'}</span>
              </button>
              <button
                type="button"
                disabled={meta.current_page >= meta.last_page || loading}
                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)',
                  fontSize: '12px', fontWeight: '700',
                  cursor: meta.current_page >= meta.last_page ? 'not-allowed' : 'pointer',
                  opacity: meta.current_page >= meta.last_page ? 0.5 : 1,
                }}
              >
                <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
                {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Teacher / Center Verification Accreditation Modal */}
      {selectedUserForVerification && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div className="responsive-modal-box" style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '24px',
            width: '100%', maxWidth: '580px', padding: '26px', boxShadow: 'var(--shadow-xl)', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px',
              borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={22} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'مراجعة وتوثيق اعتماد الحساب' : 'Account Accreditation Review'}
                </h3>
              </div>
              <button onClick={() => setSelectedUserForVerification(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: '14px' }}>
                <img
                  src={getAvatar(selectedUserForVerification)}
                  alt={selectedUserForVerification.name}
                  style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = '/characters/teacher.png'; }}
                />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {selectedUserForVerification.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>
                    {selectedUserForVerification.details || roleLabels[selectedUserForVerification.role]}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {selectedUserForVerification.email}{selectedUserForVerification.phone ? ` | ${selectedUserForVerification.phone}` : ''}
                  </div>
                </div>
              </div>

              <div style={{
                border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '16px',
                fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الرقم القومي (مقنّع):' : 'National ID (Masked):'}</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {selectedUserForVerification.nationalIdMasked || (lang === 'ar' ? 'غير مسجل' : 'Not provided')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'المؤهل / التخصص:' : 'Degree / Specialty:'}</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                    {selectedUserForVerification.degreeAr || selectedUserForVerification.details || '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'حالة التحقق الأمني:' : 'Background Check:'}</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-success)' }}>
                    {selectedUserForVerification.backgroundCheckStatus || (lang === 'ar' ? 'سليم وجاهز للاعتماد' : 'Clean & Ready')}
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'ملاحظات الاعتماد أو سبب الرفض (اختياري):' : 'Review Notes / Rejection Reason (Optional):'}
                </label>
                <textarea
                  rows={2}
                  value={verificationNote}
                  onChange={e => setVerificationNote(e.target.value)}
                  placeholder={lang === 'ar' ? 'أضف ملاحظة توثق قرار المراجعة في سجل الأمان...' : 'Add an audit note for this KYC decision...'}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleApproveTeacher(selectedUserForVerification.id)}
                  style={{
                    flex: 1, backgroundColor: 'var(--color-success)', color: '#FFFFFF', border: 'none', padding: '12px',
                    borderRadius: '12px', fontSize: '13px', fontWeight: '700', cursor: submitting ? 'wait' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{lang === 'ar' ? 'اعتماد ومنح شارة التوثيق' : 'Approve & Verify'}</span>
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleRejectTeacher(selectedUserForVerification.id)}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)',
                    border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 18px', borderRadius: '12px',
                    fontSize: '13px', fontWeight: '700', cursor: submitting ? 'wait' : 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'رفض الطلب' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div className="responsive-modal-box" style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '24px',
            width: '100%', maxWidth: '540px', padding: '26px', boxShadow: 'var(--shadow-xl)', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px',
              borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'إضافة مستخدم جديد للنظام' : 'Create New User Account'}
              </h3>
              <button onClick={() => setIsAddUserModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'نوع الحساب / الدور' : 'Account Role'}
                </label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px'
                  }}
                >
                  <option value="student">{lang === 'ar' ? 'طالب' : 'Student'}</option>
                  <option value="teacher">{lang === 'ar' ? 'معلم / أستاذ' : 'Teacher'}</option>
                  <option value="parent">{lang === 'ar' ? 'ولي أمر' : 'Parent'}</option>
                  <option value="center">{lang === 'ar' ? 'مسؤول سنتر تعليمي' : 'Center Admin'}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder={lang === 'ar' ? 'مثال: يوسف حسام الدين' : 'e.g. Youssef Hossam'}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px'
                  }}
                />
              </div>

              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="user@example.com"
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'رقم الهاتف' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="010XXXXXXXX"
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              {newUser.role !== 'student' && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'الرقم القومي / السجل (يُخزّن مشفراً)' : 'National / Reg ID (Encrypted)'}
                  </label>
                  <input
                    type="text"
                    value={newUser.nationalId}
                    onChange={e => setNewUser({ ...newUser, nationalId: e.target.value })}
                    placeholder="29501011234567"
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'التفاصيل / المادة أو المرحلة الدراسية' : 'Stage / Subject / Details'}
                </label>
                <input
                  type="text"
                  value={newUser.details}
                  onChange={e => setNewUser({ ...newUser, details: e.target.value })}
                  placeholder={lang === 'ar' ? 'الصف الثالث الثانوي - علمي علوم' : 'e.g. 3rd Secondary - Science'}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  style={{
                    backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', padding: '10px 18px',
                    borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', padding: '10px 24px',
                    borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: submitting ? 'wait' : 'pointer'
                  }}
                >
                  {submitting ? (lang === 'ar' ? 'جاري الإنشاء...' : 'Creating...') : (lang === 'ar' ? 'إنشاء الحساب' : 'Create Account')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && selectedUserForEdit && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div className="responsive-modal-box" style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '24px',
            width: '100%', maxWidth: '560px', padding: '26px', boxShadow: 'var(--shadow-xl)', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px',
              borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'تعديل بيانات المستخدم' : 'Edit User Profile'}
                </h3>
              </div>
              <button onClick={() => setIsEditUserModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'نوع الحساب / الدور' : 'Account Role'}
                  </label>
                  <select
                    value={selectedUserForEdit.role}
                    onChange={e => setSelectedUserForEdit({ ...selectedUserForEdit, role: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px'
                    }}
                  >
                    <option value="student">{lang === 'ar' ? 'طالب' : 'Student'}</option>
                    <option value="teacher">{lang === 'ar' ? 'معلم' : 'Teacher'}</option>
                    <option value="parent">{lang === 'ar' ? 'ولي أمر' : 'Parent'}</option>
                    <option value="center">{lang === 'ar' ? 'مسؤول سنتر' : 'Center Admin'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'حالة الحساب' : 'Account Status'}
                  </label>
                  <select
                    value={selectedUserForEdit.status}
                    onChange={e => setSelectedUserForEdit({ ...selectedUserForEdit, status: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px'
                    }}
                  >
                    <option value="active">{lang === 'ar' ? 'نشط' : 'Active'}</option>
                    <option value="suspended">{lang === 'ar' ? 'حساب مجمد' : 'Suspended'}</option>
                    <option value="verified">{lang === 'ar' ? 'موثق ومعتمد' : 'Verified'}</option>
                    <option value="pending_verification">{lang === 'ar' ? 'بانتظار الاعتماد' : 'Pending Verification'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={selectedUserForEdit.name}
                  onChange={e => setSelectedUserForEdit({ ...selectedUserForEdit, name: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px'
                  }}
                />
              </div>

              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    required
                    value={selectedUserForEdit.email}
                    onChange={e => setSelectedUserForEdit({ ...selectedUserForEdit, email: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'رقم الهاتف' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={selectedUserForEdit.phone}
                    onChange={e => setSelectedUserForEdit({ ...selectedUserForEdit, phone: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'تحديث الرقم القومي (اختياري)' : 'Update National ID (Optional)'}
                </label>
                <input
                  type="text"
                  value={selectedUserForEdit.newNationalId}
                  onChange={e => setSelectedUserForEdit({ ...selectedUserForEdit, newNationalId: e.target.value })}
                  placeholder={
                    selectedUserForEdit.nationalIdMasked
                      ? `${lang === 'ar' ? 'الحالي:' : 'Current:'} ${selectedUserForEdit.nationalIdMasked} (${lang === 'ar' ? 'اتركه فارغاً للإبقاء عليه' : 'leave blank to keep'})`
                      : (lang === 'ar' ? 'أدخل رقماً قومياً جديداً...' : 'Enter new National ID...')
                  }
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'التفاصيل / المادة أو المرحلة الدراسية' : 'Stage / Subject / Details'}
                </label>
                <input
                  type="text"
                  value={selectedUserForEdit.details}
                  onChange={e => setSelectedUserForEdit({ ...selectedUserForEdit, details: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  style={{
                    backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', padding: '10px 18px',
                    borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', padding: '10px 24px',
                    borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: submitting ? 'wait' : 'pointer'
                  }}
                >
                  {submitting ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {userToDelete && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.45)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '24px',
            width: '100%', maxWidth: '440px', padding: '28px 24px', boxShadow: '0 25px 50px -12px rgba(6, 37, 78, 0.25)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', direction: isRtl ? 'rtl' : 'ltr'
          }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <Trash2 size={28} />
            </div>

            <div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'تأكيد حذف الحساب' : 'Confirm Account Deletion'}
              </h3>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {lang === 'ar' ? (
                  <>
                    هل أنت متأكد من حذف حساب <strong style={{ color: 'var(--text-primary)' }}>({userToDelete.name})</strong> نهائياً من المنصة؟ لن تتمكن من التراجع عن هذا الإجراء.
                  </>
                ) : (
                  <>
                    Are you sure you want to permanently delete the account of <strong style={{ color: 'var(--text-primary)' }}>({userToDelete.name})</strong>? This action cannot be undone.
                  </>
                )}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                style={{
                  flex: 1, backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '11px 18px',
                  borderRadius: '12px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmDeleteUser}
                style={{
                  flex: 1, backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', padding: '11px 18px',
                  borderRadius: '12px', fontSize: '13px', fontWeight: '700', cursor: submitting ? 'wait' : 'pointer',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)'
                }}
              >
                {submitting ? (lang === 'ar' ? 'جاري الحذف...' : 'Deleting...') : (lang === 'ar' ? 'تأكيد الحذف' : 'Delete Account')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive User Profile Details Modal */}
      {selectedUserForDetails && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div className="responsive-modal-box" style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '24px',
            width: '100%', maxWidth: '600px', padding: '26px', boxShadow: 'var(--shadow-xl)',
            maxHeight: '90vh', overflowY: 'auto', direction: isRtl ? 'rtl' : 'ltr'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px',
              borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(21, 136, 199, 0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                }}>
                  <Users size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'الملف التعريفي الشامل للمستخدم' : 'Comprehensive User Profile'}
                  </h3>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    ID: #{selectedUserForDetails.id}
                    {loadingDetails ? (lang === 'ar' ? ' — جاري تحديث السجل الأمني...' : ' — Refreshing security info...') : ''}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedUserForDetails(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* User Main Card */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'var(--bg-subtle)',
              borderRadius: '16px', border: '1px solid var(--border-subtle)', marginBottom: '18px'
            }}>
              <img
                src={getAvatar(selectedUserForDetails)}
                alt={selectedUserForDetails.name}
                style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover', border: '2px solid var(--primary)' }}
                onError={(e) => { e.currentTarget.src = '/characters/student.png'; }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? (selectedUserForDetails.nameAr || selectedUserForDetails.name) : (selectedUserForDetails.nameEn || selectedUserForDetails.name)}
                  </h4>
                  <span style={{
                    padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                    backgroundColor: selectedUserForDetails.status === 'suspended' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: selectedUserForDetails.status === 'suspended' ? '#B91C1C' : '#047857'
                  }}>
                    {selectedUserForDetails.status === 'verified' ? (lang === 'ar' ? 'موثق ومعتمد' : 'Verified') :
                     selectedUserForDetails.status === 'pending_verification' ? (lang === 'ar' ? 'بانتظار الاعتماد' : 'Pending') :
                     selectedUserForDetails.status === 'suspended' ? (lang === 'ar' ? 'مجمد' : 'Suspended') : (lang === 'ar' ? 'نشط' : 'Active')}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {roleLabels[selectedUserForDetails.role] || selectedUserForDetails.role}
                </div>
              </div>
            </div>

            {/* Detailed Data List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', marginBottom: '20px' }}>
              {selectedUserForDetails.role === 'student' && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px',
                  borderRadius: '14px', backgroundColor: 'rgba(21, 136, 199, 0.08)', border: '1.5px solid rgba(21, 136, 199, 0.28)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--primary)',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <QrCode size={19} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '13.5px' }}>
                        {lang === 'ar' ? 'كود ربط الطالب (Student ID)' : 'Unified Student ID'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {lang === 'ar' ? 'الكود المعتمد لربط ولي الأمر وسجلات السناتر' : 'Official code to link parent & centers'}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '15px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '1px',
                    backgroundColor: 'var(--bg-surface)', padding: '6px 12px', borderRadius: '10px',
                    border: '1.5px solid rgba(21, 136, 199, 0.35)', fontFamily: 'monospace'
                  }}>
                    {selectedUserForDetails.studentCode || `STU-${String(selectedUserForDetails.id)}`}
                  </span>
                </div>
              )}

              {selectedUserForDetails.role !== 'student' && (selectedUserForDetails.nationalId || selectedUserForDetails.nationalIdMasked) && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px',
                  borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <ShieldCheck size={16} color="var(--primary)" />
                    <span style={{ fontWeight: '600' }}>
                      {lang === 'ar' ? 'الرقم القومي (مشفّر ومقنّع):' : 'National ID (Masked):'}
                    </span>
                  </div>
                  <span style={{ fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '1px', fontFamily: 'monospace', fontSize: '14px' }}>
                    {selectedUserForDetails.nationalId || selectedUserForDetails.nationalIdMasked}
                  </span>
                </div>
              )}

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px',
                borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <Mail size={16} color="var(--primary)" />
                  <span style={{ fontWeight: '600' }}>{lang === 'ar' ? 'البريد الإلكتروني:' : 'Email Address:'}</span>
                </div>
                <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{selectedUserForDetails.email}</span>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px',
                borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <Phone size={16} color="var(--primary)" />
                  <span style={{ fontWeight: '600' }}>{lang === 'ar' ? 'رقم الهاتف:' : 'Phone Number:'}</span>
                </div>
                <span style={{ fontWeight: '800', color: 'var(--text-primary)' }} dir="ltr">
                  {selectedUserForDetails.phone || '—'}
                </span>
              </div>

              {selectedUserForDetails.role === 'student' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ padding: '11px 14px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      {lang === 'ar' ? 'المرحلة والصف:' : 'Grade:'}
                    </div>
                    <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '13px' }}>
                      {selectedUserForDetails.grade || '—'}
                    </div>
                  </div>
                  <div style={{ padding: '11px 14px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      {lang === 'ar' ? 'الشعبة / المحافظة:' : 'Track / Governorate:'}
                    </div>
                    <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '13px' }}>
                      {[selectedUserForDetails.track, selectedUserForDetails.governorate].filter(Boolean).join(' • ') || '—'}
                    </div>
                  </div>
                </div>
              )}

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px',
                borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <Calendar size={16} color="var(--primary)" />
                  <span style={{ fontWeight: '600' }}>{lang === 'ar' ? 'تاريخ إنشاء الحساب:' : 'Registration Date:'}</span>
                </div>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{selectedUserForDetails.joinDate || '—'}</span>
              </div>

              {/* Live Security & Activity Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: 'rgba(21, 136, 199, 0.08)', border: '1px solid rgba(21, 136, 199, 0.2)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {selectedUserForDetails.role === 'teacher' ? (lang === 'ar' ? 'المقررات' : 'Courses') : (lang === 'ar' ? 'الاشتراكات' : 'Enrollments')}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)', marginTop: '2px' }}>
                    {selectedUserForDetails.enrolledCourses ?? 0}
                  </div>
                </div>

                <div style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'الجلسات النشطة' : 'Active Sessions'}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedUserForDetails.activeSessionsCount ?? '—'}
                  </div>
                </div>

                <div style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'المدفوعات / المحفظة' : 'Wallet Volume'}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {Number(selectedUserForDetails.walletBalance || 0).toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
                  </div>
                </div>
              </div>

              {/* Recent Login Telemetry */}
              {Array.isArray(selectedUserForDetails.recentLogins) && selectedUserForDetails.recentLogins.length > 0 && (
                <div style={{ padding: '12px 14px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {lang === 'ar' ? 'آخر محاولات تسجيل الدخول:' : 'Recent Login Activity:'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedUserForDetails.recentLogins.slice(0, 4).map((lg, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        <span>{lg.deviceName || 'Web'} • <code style={{ fontFamily: 'monospace' }}>{lg.ipAddress || '—'}</code></span>
                        <span style={{ fontWeight: '700', color: lg.status === 'success' ? '#047857' : '#B91C1C' }}>
                          {lg.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
              borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', flexWrap: 'wrap'
            }}>
              {selectedUserForDetails.role !== 'admin' ? (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const u = selectedUserForDetails;
                      setSelectedUserForDetails(null);
                      handleOpenEditUser(u);
                    }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', color: '#fff',
                      border: 'none', padding: '9px 14px', borderRadius: '10px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer'
                    }}
                  >
                    <Edit3 size={14} />
                    <span>{lang === 'ar' ? 'تعديل البيانات' : 'Edit'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(selectedUserForDetails.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', padding: '9px 14px',
                      borderRadius: '10px', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer'
                    }}
                  >
                    {selectedUserForDetails.status === 'suspended' ? <UserCheck size={14} color="var(--color-success)" /> : <UserX size={14} color="#D97706" />}
                    <span>{selectedUserForDetails.status === 'suspended' ? (lang === 'ar' ? 'تنشيط الحساب' : 'Activate') : (lang === 'ar' ? 'تجميد الحساب' : 'Suspend')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRevokeSessions(selectedUserForDetails)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', padding: '9px 14px',
                      borderRadius: '10px', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer'
                    }}
                  >
                    <LogOut size={14} color="#D97706" />
                    <span>{lang === 'ar' ? 'إنهاء الجلسات' : 'Revoke Sessions'}</span>
                  </button>
                </div>
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  {lang === 'ar' ? 'حساب مشرف منصة محمي ضد التعديل الجماعي' : 'Protected platform administrator account'}
                </span>
              )}

              <button
                type="button"
                onClick={() => setSelectedUserForDetails(null)}
                style={{
                  backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', padding: '9px 18px',
                  borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
