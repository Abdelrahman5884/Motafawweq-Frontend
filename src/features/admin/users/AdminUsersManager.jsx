import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { MOCK_ADMIN_USERS } from '../../../data/mockAdminData';
import {
  Users,
  Search,
  UserCheck,
  UserX,
  ShieldCheck,
  Plus,
  CheckCircle2,
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
  MapPin,
  BookOpen
} from 'lucide-react';

export const AdminUsersManager = () => {
  const { lang, isRtl } = useLanguage();
  const [users, setUsers] = useState(MOCK_ADMIN_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus] = useState('all');
  const [selectedUserForVerification, setSelectedUserForVerification] = useState(null);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [activeDropdownUserId, setActiveDropdownUserId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

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

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    role: 'student',
    email: '',
    phone: '',
    nationalId: '',
    details: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenEditUser = (user) => {
    setSelectedUserForEdit({ ...user });
    setIsEditUserModalOpen(true);
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!selectedUserForEdit || !selectedUserForEdit.name.trim() || !selectedUserForEdit.email.trim()) return;

    setUsers(prev => prev.map(u => u.id === selectedUserForEdit.id ? selectedUserForEdit : u));
    setIsEditUserModalOpen(false);
    setSelectedUserForEdit(null);
    showToast(lang === 'ar' ? 'تم تحديث بيانات المستخدم بنجاح' : 'User data updated successfully');
  };

  const handleOpenDeleteConfirm = (user) => {
    setUserToDelete({
      id: user.id,
      name: lang === 'ar' ? (user.nameAr || user.name) : (user.nameEn || user.name)
    });
  };

  const handleConfirmDeleteUser = () => {
    if (!userToDelete) return;
    setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
    showToast(lang === 'ar' ? `تم حذف حساب (${userToDelete.name}) نهائياً بنجاح` : `Account (${userToDelete.name}) deleted successfully`);
    setUserToDelete(null);
  };

  const handleToggleStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    showToast(lang === 'ar' ? 'تم تحديث حالة الحساب بنجاح' : 'Account status updated');
  };

  const handleApproveTeacher = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: 'verified' };
      }
      return u;
    }));
    setSelectedUserForVerification(null);
    showToast(lang === 'ar' ? 'تم توثيق واعتماد المعلم بنجاح وإرسال إشعار له' : 'Teacher verified successfully');
  };

  const handleRejectTeacher = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: 'suspended' };
      }
      return u;
    }));
    setSelectedUserForVerification(null);
    showToast(lang === 'ar' ? 'تم رفض طلب التوثيق مع إشعار المعلم' : 'Verification request rejected');
  };

  const handleResetPassword = (userName) => {
    showToast(lang === 'ar' ? `تم إرسال رابط إعادة تعيين كلمة المرور إلى ${userName}` : `Password reset link sent to ${userName}`);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    const generatedStudentCode = `STU-${Math.floor(10000 + Math.random() * 90000)}`;
    const created = {
      ...newUser,
      id: `usr-${Date.now()}`,
      studentCode: newUser.role === 'student' ? generatedStudentCode : undefined,
      status: newUser.role === 'teacher' ? 'pending_verification' : 'active',
      avatar: newUser.role === 'student' ? '/characters/student.png' : newUser.role === 'teacher' ? '/characters/teacher.png' : '/characters/parent.png',
      joinDate: new Date().toISOString().split('T')[0],
      enrolledCourses: 0,
      walletBalance: 0
    };

    setUsers([created, ...users]);
    setIsAddUserModalOpen(false);
    setNewUser({ name: '', role: 'student', email: '', phone: '', nationalId: '', details: '' });
    showToast(lang === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'User account created');
  };

  // Filtered users
  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.nameAr && u.nameAr.toLowerCase().includes(q)) ||
      (u.nameEn && u.nameEn.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(searchQuery)) ||
      (u.studentCode && u.studentCode.toLowerCase().includes(q)) ||
      (u.nationalId && u.nationalId.includes(searchQuery));

    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || u.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleLabels = {
    all: lang === 'ar' ? 'جميع المستخدمين' : 'All Users',
    student: lang === 'ar' ? 'الطلاب' : 'Students',
    teacher: lang === 'ar' ? 'المعلمون' : 'Teachers',
    parent: lang === 'ar' ? 'أولياء الأمور' : 'Parents',
    center_admin: lang === 'ar' ? 'مسؤولو السناتر' : 'Center Admins'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: isRtl ? '24px' : 'auto',
          right: isRtl ? 'auto' : '24px',
          backgroundColor: 'var(--color-brand-dark)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: '600'
        }}>
          <CheckCircle2 size={18} color="var(--primary-light)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Summary Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {[
          { labelAr: 'إجمالي المستخدمين', labelEn: 'Total Users', count: users.length, icon: Users, color: 'var(--primary)', bg: 'rgba(21, 136, 199, 0.12)' },
          { labelAr: 'الطلاب المسجلين', labelEn: 'Enrolled Students', count: users.filter(u => u.role === 'student').length, icon: GraduationCap, color: 'var(--primary)', bg: 'rgba(21, 136, 199, 0.12)' },
          { labelAr: 'المعلمون والأساتذة', labelEn: 'Teachers & Tutors', count: users.filter(u => u.role === 'teacher').length, icon: Award, color: 'var(--primary-light, #5CB6DB)', bg: 'rgba(92, 182, 219, 0.15)' },
          { labelAr: 'أولياء الأمور', labelEn: 'Parents', count: users.filter(u => u.role === 'parent').length, icon: Users, color: 'var(--color-brand-dark, #06254E)', bg: 'rgba(6, 37, 78, 0.12)' },
          { labelAr: 'طلبات التوثيق المعلقة', labelEn: 'Pending Verifications', count: users.filter(u => u.status === 'pending_verification').length, icon: ShieldCheck, color: 'var(--primary)', bg: 'rgba(21, 136, 199, 0.18)' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color
              }}>
                <Icon size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                  {lang === 'ar' ? stat.labelAr : stat.labelEn}
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {stat.count}
                </div>
              </div>
            </div>
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
        gap: '14px'
      }}>
        {/* Search */}
        <div style={{
          position: 'relative',
          flex: '1 1 260px',
          maxWidth: '400px'
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
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
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
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', 'student', 'teacher', 'parent', 'center_admin'].map(role => {
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                style={{
                  padding: '7px 14px',
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
        </div>

        {/* Add User Action */}
        <button
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'لم يتم العثور على أي مستخدمين يطابقون معايير البحث' : 'No users match the search criteria'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => {
                  const isSuspended = u.status === 'suspended';
                  const isVerified = u.status === 'verified';
                  const isPending = u.status === 'pending_verification';

                  return (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedUserForDetails(u)}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* User Info (Concise & Clean without private data) */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={u.avatar}
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
                            u.role === 'center_admin' ? 'rgba(21, 136, 199, 0.12)' : 'rgba(139, 92, 246, 0.12)',
                          color:
                            u.role === 'teacher' ? '#B45309' :
                            u.role === 'student' ? '#047857' :
                            u.role === 'center_admin' ? 'var(--primary)' : '#6D28D9'
                        }}>
                          {roleLabels[u.role] || u.role}
                        </span>
                      </td>

                      {/* Details (Clean without National ID) */}
                      <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                        <div style={{ fontSize: '12.5px', lineHeight: '1.4', color: 'var(--text-primary)', fontWeight: '600' }}>
                          {lang === 'ar' ? (u.detailsAr || u.details) : (u.detailsEn || u.details)}
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
                            isPending ? 'rgba(239, 68, 68, 0.12)' :
                            isSuspended ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                          color:
                            isVerified ? '#047857' :
                            isPending ? '#B91C1C' :
                            isSuspended ? '#B91C1C' : '#047857'
                        }}>
                          {isVerified && <ShieldCheck size={13} />}
                          {isPending && <FileText size={13} />}
                          {isVerified ? (lang === 'ar' ? 'موثق ومعتمد' : 'Verified') :
                           isPending ? (lang === 'ar' ? 'بانتظار الاعتماد' : 'Pending Verification') :
                           isSuspended ? (lang === 'ar' ? 'حساب مجمد' : 'Suspended') : (lang === 'ar' ? 'نشط' : 'Active')}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                        {u.joinDate}
                      </td>

                      {/* Actions with 3 dots menu */}
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
                            onMouseEnter={e => {
                              e.currentTarget.style.backgroundColor = 'rgba(21, 136, 199, 0.12)';
                              e.currentTarget.style.color = 'var(--primary)';
                            }}
                            onMouseLeave={e => {
                              if (activeDropdownUserId !== u.id) {
                                e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                              }
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
                                top: index >= filteredUsers.length - 2 && filteredUsers.length > 2 ? 'auto' : 'calc(100% - 2px)',
                                bottom: index >= filteredUsers.length - 2 && filteredUsers.length > 2 ? 'calc(100% - 2px)' : 'auto',
                                right: isRtl ? 'auto' : '18px',
                                left: isRtl ? '18px' : 'auto',
                                backgroundColor: 'var(--bg-surface)',
                                border: '1.5px solid var(--border-subtle)',
                                borderRadius: '14px',
                                padding: '6px',
                                boxShadow: 'var(--shadow-xl)',
                                zIndex: 90,
                                minWidth: '190px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                textAlign: isRtl ? 'right' : 'left'
                              }}
                            >
                              {/* View Details Action */}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveDropdownUserId(null);
                                  setSelectedUserForDetails(u);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  color: 'var(--primary)',
                                  fontSize: '12.5px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  textAlign: 'inherit',
                                  transition: 'background-color 0.15s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(21, 136, 199, 0.08)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Eye size={14} color="var(--primary)" />
                                <span>{lang === 'ar' ? 'عرض كامل التفاصيل' : 'View Full Details'}</span>
                              </button>

                              {/* Edit Action */}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveDropdownUserId(null);
                                  handleOpenEditUser(u);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  color: 'var(--text-primary)',
                                  fontSize: '12.5px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  textAlign: 'inherit',
                                  transition: 'background-color 0.15s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Edit3 size={14} color="var(--primary)" />
                                <span>{lang === 'ar' ? 'تعديل البيانات' : 'Edit User'}</span>
                              </button>

                              {/* Verification Action if Pending */}
                              {isPending && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownUserId(null);
                                    setSelectedUserForVerification(u);
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: 'var(--color-success)',
                                    fontSize: '12.5px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    textAlign: 'inherit',
                                    transition: 'background-color 0.15s ease'
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)'}
                                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <ShieldCheck size={14} />
                                  <span>{lang === 'ar' ? 'فحص واعتماد التوثيق' : 'Review & Verify'}</span>
                                </button>
                              )}

                              {/* Status Toggle (Suspend / Activate) */}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveDropdownUserId(null);
                                  handleToggleStatus(u.id);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  color: 'var(--text-primary)',
                                  fontSize: '12.5px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  textAlign: 'inherit',
                                  transition: 'background-color 0.15s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                {isSuspended ? <UserCheck size={14} color="var(--color-success)" /> : <UserX size={14} color="#D97706" />}
                                <span>{isSuspended ? (lang === 'ar' ? 'تنشيط وتفعيل' : 'Activate Account') : (lang === 'ar' ? 'تجميد الحساب' : 'Suspend Account')}</span>
                              </button>

                              {/* Password Reset */}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveDropdownUserId(null);
                                  handleResetPassword(lang === 'ar' ? (u.nameAr || u.name) : (u.nameEn || u.name));
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  color: 'var(--text-primary)',
                                  fontSize: '12.5px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  textAlign: 'inherit',
                                  transition: 'background-color 0.15s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <KeyRound size={14} color="var(--primary)" />
                                <span>{lang === 'ar' ? 'إعادة ضبط كلمة المرور' : 'Reset Password'}</span>
                              </button>

                              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

                              {/* Delete Option */}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveDropdownUserId(null);
                                  handleOpenDeleteConfirm(u);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  color: 'var(--color-danger)',
                                  fontSize: '12.5px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  textAlign: 'inherit',
                                  transition: 'background-color 0.15s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Trash2 size={14} color="var(--color-danger)" />
                                <span>{lang === 'ar' ? 'حذف المستخدم' : 'Delete User'}</span>
                              </button>
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
      </div>

      {/* Teacher Verification Accreditation Modal */}
      {selectedUserForVerification && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(6, 37, 78, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div 
            className="responsive-modal-box"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '580px',
              padding: '26px',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={22} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'مراجعة وتوثيق اعتماد المعلم' : 'Teacher Accreditation Review'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUserForVerification(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '14px'
              }}>
                <img
                  src={selectedUserForVerification.avatar}
                  alt={selectedUserForVerification.name}
                  style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {selectedUserForVerification.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>
                    {selectedUserForVerification.details}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {selectedUserForVerification.email} | {selectedUserForVerification.phone}
                  </div>
                </div>
              </div>

              {/* Verified Documents details */}
              <div style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '16px',
                fontSize: '13px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الرقم القومي:' : 'National ID:'}</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{selectedUserForVerification.nationalId || '29204011204812'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'المؤهل الدراسي المقدم:' : 'Degree / Certificate:'}</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'بكالوريوس تربية / علوم - قسم الفيزياء' : 'B.Sc. in Education / Physics Department'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'حالة السجل الجنائي والتحقق:' : 'Background Check:'}</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-success)' }}>
                    {lang === 'ar' ? 'سليم ومطابق للشروط ✓' : 'Clean & Verified ✓'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  onClick={() => handleApproveTeacher(selectedUserForVerification.id)}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--color-success)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{lang === 'ar' ? 'اعتماد ومنح شارة التوثيق' : 'Approve & Verify'}</span>
                </button>
                <button
                  onClick={() => handleRejectTeacher(selectedUserForVerification.id)}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--color-danger)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
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
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(6, 37, 78, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div 
            className="responsive-modal-box"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '540px',
              padding: '26px',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '12px'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'إضافة مستخدم جديد للنظام' : 'Create New User Account'}
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
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
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                >
                  <option value="student">{lang === 'ar' ? 'طالب' : 'Student'}</option>
                  <option value="teacher">{lang === 'ar' ? 'معلم / أستاذ' : 'Teacher'}</option>
                  <option value="parent">{lang === 'ar' ? 'ولي أمر' : 'Parent'}</option>
                  <option value="center_admin">{lang === 'ar' ? 'مسؤول سنتر' : 'Center Admin'}</option>
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
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
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
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
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
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

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
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'إنشاء الحساب' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit User Modal */}
      {isEditUserModalOpen && selectedUserForEdit && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(6, 37, 78, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div 
            className="responsive-modal-box"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '560px',
              padding: '26px',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'تعديل بيانات المستخدم' : 'Edit User Profile'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditUserModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
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
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  >
                    <option value="student">{lang === 'ar' ? 'طالب' : 'Student'}</option>
                    <option value="teacher">{lang === 'ar' ? 'معلم' : 'Teacher'}</option>
                    <option value="parent">{lang === 'ar' ? 'ولي أمر' : 'Parent'}</option>
                    <option value="center_admin">{lang === 'ar' ? 'مسؤول سنتر' : 'Center Admin'}</option>
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
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
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
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
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
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'رقم الهاتف' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={selectedUserForEdit.phone || ''}
                    onChange={e => setSelectedUserForEdit({ ...selectedUserForEdit, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'الرقم القومي' : 'National ID'}
                </label>
                <input
                  type="text"
                  value={selectedUserForEdit.nationalId || ''}
                  onChange={e => setSelectedUserForEdit({ ...selectedUserForEdit, nationalId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'التفاصيل / المادة أو المرحلة الدراسية' : 'Stage / Subject / Details'}
                </label>
                <input
                  type="text"
                  value={selectedUserForEdit.details || ''}
                  onChange={e => setSelectedUserForEdit({ ...selectedUserForEdit, details: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Themed Delete Confirmation Dialog */}
      {userToDelete && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(6, 37, 78, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '440px',
            padding: '28px 24px',
            boxShadow: '0 25px 50px -12px rgba(6, 37, 78, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px',
            direction: isRtl ? 'rtl' : 'ltr'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(239, 68, 68, 0.2)'
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
                    هل أنت متأكد من حذف حساب <strong style={{ color: 'var(--text-primary)' }}>({userToDelete.name})</strong> نهائياً من المنصة؟ لن تتمكن من التراجع عن هذا الإجراء أو استعادة بياناته.
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
                  flex: 1,
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  padding: '11px 18px',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                style={{
                  flex: 1,
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '11px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)',
                  transition: 'all 0.15s ease'
                }}
              >
                {lang === 'ar' ? 'تأكيد الحذف' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive User Profile Details Modal (Triggered on Row Click) */}
      {selectedUserForDetails && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(6, 37, 78, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div 
            className="responsive-modal-box"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '580px',
              padding: '26px',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflowY: 'auto',
              direction: isRtl ? 'rtl' : 'ltr'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(21, 136, 199, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <Users size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'الملف التعريفي الشامل للمستخدم' : 'Comprehensive User Profile'}
                  </h3>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    ID: {selectedUserForDetails.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForDetails(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* User Main Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '18px'
            }}>
              <img
                src={selectedUserForDetails.avatar}
                alt={selectedUserForDetails.name}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  border: '2px solid var(--primary)'
                }}
                onError={(e) => { e.currentTarget.src = '/characters/student.png'; }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? (selectedUserForDetails.nameAr || selectedUserForDetails.name) : (selectedUserForDetails.nameEn || selectedUserForDetails.name)}
                  </h4>
                  {/* Status badge */}
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '700',
                    backgroundColor:
                      selectedUserForDetails.status === 'verified' ? 'rgba(16, 185, 129, 0.15)' :
                      selectedUserForDetails.status === 'pending_verification' ? 'rgba(239, 68, 68, 0.15)' :
                      selectedUserForDetails.status === 'suspended' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color:
                      selectedUserForDetails.status === 'verified' ? '#047857' :
                      selectedUserForDetails.status === 'pending_verification' ? '#B91C1C' :
                      selectedUserForDetails.status === 'suspended' ? '#B91C1C' : '#047857'
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
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '13px',
              marginBottom: '20px'
            }}>
              {/* If Student: Prominent Student ID / Linking Code */}
              {selectedUserForDetails.role === 'student' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(21, 136, 199, 0.08)',
                  border: '1.5px solid rgba(21, 136, 199, 0.28)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--primary)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <QrCode size={19} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '13.5px' }}>
                        {lang === 'ar' ? 'كود ربط الطالب (Student ID)' : 'Unified Student ID'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {lang === 'ar' ? 'الكود المعتمد لربط ولي الأمر بالمنصة وسجلات السناتر' : 'Official code to link parent app & center rosters'}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '16px',
                    fontWeight: '900',
                    color: 'var(--primary)',
                    letterSpacing: '1px',
                    backgroundColor: 'var(--bg-surface)',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid rgba(21, 136, 199, 0.35)',
                    fontFamily: 'monospace',
                    boxShadow: 'var(--shadow-xs)'
                  }}>
                    {selectedUserForDetails.studentCode || `STU-${selectedUserForDetails.id.replace('usr-', '')}`}
                  </span>
                </div>
              )}

              {/* National ID: Only for Teachers / Staff where national ID is required for accreditation */}
              {selectedUserForDetails.role !== 'student' && selectedUserForDetails.nationalId && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <ShieldCheck size={16} color="var(--primary)" />
                    <span style={{ fontWeight: '600' }}>
                      {selectedUserForDetails.role === 'teacher' ? (lang === 'ar' ? 'الرقم القومي (لتوثيق واعتماد المؤهل):' : 'National ID (Accreditation):') : (lang === 'ar' ? 'رقم السجل / الهوية:' : 'National / Reg ID:')}
                    </span>
                  </div>
                  <span style={{ fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '1px', fontFamily: 'monospace', fontSize: '14px' }}>
                    {selectedUserForDetails.nationalId}
                  </span>
                </div>
              )}

              {/* Email */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <Mail size={16} color="var(--primary)" />
                  <span style={{ fontWeight: '600' }}>{lang === 'ar' ? 'البريد الإلكتروني:' : 'Email Address:'}</span>
                </div>
                <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                  {selectedUserForDetails.email}
                </span>
              </div>

              {/* Phone */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <Phone size={16} color="var(--primary)" />
                  <span style={{ fontWeight: '600' }}>
                    {selectedUserForDetails.role === 'student' ? (lang === 'ar' ? 'رقم هاتف الطالب:' : 'Student Phone:') : (lang === 'ar' ? 'رقم الهاتف:' : 'Phone Number:')}
                  </span>
                </div>
                <span style={{ fontWeight: '800', color: 'var(--text-primary)', dir: 'ltr' }}>
                  {selectedUserForDetails.phone || '—'}
                </span>
              </div>

              {/* If Student: Parent Phone */}
              {selectedUserForDetails.role === 'student' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <Users size={16} color="var(--color-success)" />
                    <span style={{ fontWeight: '600' }}>{lang === 'ar' ? 'رقم ولي الأمر (المسجل للمتابعة):' : 'Parent Phone (Follow-up):'}</span>
                  </div>
                  <span style={{ fontWeight: '800', color: 'var(--text-primary)', dir: 'ltr' }}>
                    {selectedUserForDetails.parentPhone || '010 9988 7766'}
                  </span>
                </div>
              )}

              {/* If Student: Stage, Grade, Track, Governorate & Center */}
              {selectedUserForDetails.role === 'student' ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px'
                }}>
                  <div style={{
                    padding: '11px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      {lang === 'ar' ? 'المرحلة والصف الدراسي:' : 'Stage & Grade:'}
                    </div>
                    <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '13px' }}>
                      {selectedUserForDetails.grade || 'الصف الثالث الثانوي (الثانوية العامة)'}
                    </div>
                  </div>

                  <div style={{
                    padding: '11px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      {lang === 'ar' ? 'الشعبة والتخصص:' : 'Stream / Track:'}
                    </div>
                    <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '13px' }}>
                      {selectedUserForDetails.track || 'علمي علوم'}
                    </div>
                  </div>

                  <div style={{
                    padding: '11px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      {lang === 'ar' ? 'المحافظة / المدينة:' : 'Governorate:'}
                    </div>
                    <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '13px' }}>
                      {selectedUserForDetails.governorate || 'الجيزة'}
                    </div>
                  </div>

                  <div style={{
                    padding: '11px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      {lang === 'ar' ? 'كود السنتر أو المدرس:' : 'Center / Teacher Code:'}
                    </div>
                    <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '13px' }}>
                      {selectedUserForDetails.centerCode || 'ROWAD-301'}
                    </div>
                  </div>
                </div>
              ) : (
                /* Non-student: details box */
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {selectedUserForDetails.role === 'teacher' ? (lang === 'ar' ? 'المادة والتخصص الأكاديمي:' : 'Subject & Specialization:') : (lang === 'ar' ? 'بيانات الحساب:' : 'Account Details:')}
                  </div>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    {lang === 'ar' ? (selectedUserForDetails.detailsAr || selectedUserForDetails.details) : (selectedUserForDetails.detailsEn || selectedUserForDetails.details)}
                  </div>
                </div>
              )}

              {/* Joined Date */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <Calendar size={16} color="var(--primary)" />
                  <span style={{ fontWeight: '600' }}>{lang === 'ar' ? 'تاريخ إنشاء الحساب:' : 'Registration Date:'}</span>
                </div>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                  {selectedUserForDetails.joinDate}
                </span>
              </div>

              {/* Extra Stats if available */}
              {(selectedUserForDetails.enrolledCourses !== undefined || selectedUserForDetails.walletBalance !== undefined) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px'
                }}>
                  {selectedUserForDetails.enrolledCourses !== undefined && (
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(21, 136, 199, 0.08)',
                      border: '1px solid rgba(21, 136, 199, 0.2)'
                    }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {selectedUserForDetails.role === 'teacher' ? (lang === 'ar' ? 'المقررات التي يدرسها' : 'Teaching Courses') : (lang === 'ar' ? 'المقررات المشترك بها' : 'Enrolled Courses')}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)', marginTop: '2px' }}>
                        {selectedUserForDetails.enrolledCourses} {lang === 'ar' ? 'مقررات' : 'Courses'}
                      </div>
                    </div>
                  )}

                  {selectedUserForDetails.activeStudents !== undefined && (
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {lang === 'ar' ? 'الطلاب المشتركون' : 'Active Students'}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-success)', marginTop: '2px' }}>
                        {selectedUserForDetails.activeStudents.toLocaleString()} {lang === 'ar' ? 'طالب' : 'Students'}
                      </div>
                    </div>
                  )}

                  {selectedUserForDetails.walletBalance !== undefined && (
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {lang === 'ar' ? 'رصيد المحفظة' : 'Wallet Balance'}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                        {selectedUserForDetails.walletBalance.toLocaleString()} ج.م
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const u = selectedUserForDetails;
                    setSelectedUserForDetails(null);
                    handleOpenEditUser(u);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    padding: '9px 14px',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <Edit3 size={14} />
                  <span>{lang === 'ar' ? 'تعديل البيانات' : 'Edit'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const u = selectedUserForDetails;
                    handleToggleStatus(u.id);
                    setSelectedUserForDetails(prev => prev ? { ...prev, status: prev.status === 'active' ? 'suspended' : 'active' } : null);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '9px 14px',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {selectedUserForDetails.status === 'suspended' ? <UserCheck size={14} color="var(--color-success)" /> : <UserX size={14} color="#D97706" />}
                  <span>{selectedUserForDetails.status === 'suspended' ? (lang === 'ar' ? 'تنشيط الحساب' : 'Activate') : (lang === 'ar' ? 'تجميد الحساب' : 'Suspend')}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUserForDetails(null)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  color: 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer'
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

