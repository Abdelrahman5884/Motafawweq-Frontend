import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  GraduationCap,
  Link2,
  Mail,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Unlink,
  X,
} from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { SUBJECT_SUGGESTIONS } from './centerOperationsUtils';

export const CenterTeachersNetworkSection = ({
  centerTeachers = [],
  branches = [],
  connectedUsers = [],
  searchGlobalUsers,
  searchGlobalUsersRemote,
  onConnectUser,
  onDisconnectUser,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onResendInvite,
  isBackendCenter = true,
  lang = 'ar',
  isRtl = true,
}) => {
  const isAr = lang === 'ar';

  // Motafawweq Connect State
  const [connectSearchQuery, setConnectSearchQuery] = useState('');
  const [selectedBranchForConnect, setSelectedBranchForConnect] = useState(
    () => branches[0]?.id || ''
  );
  const [connectFeedback, setConnectFeedback] = useState(null);
  const [connectingUserId, setConnectingUserId] = useState(null);
  const [disconnectingId, setDisconnectingId] = useState(null);

  // Teachers Table Filter & Modals
  const [teacherSearch, setTeacherSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [modalTeacher, setModalTeacher] = useState(null); // null | { mode: 'create' | 'edit', teacher }
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const q = connectSearchQuery.trim();
    if (!isBackendCenter || !searchGlobalUsersRemote || q.length < 2) return undefined;
    const timer = setTimeout(() => {
      searchGlobalUsersRemote(q);
    }, 250);
    return () => clearTimeout(timer);
  }, [isBackendCenter, searchGlobalUsersRemote, connectSearchQuery]);

  const searchResults = useMemo(() => {
    return searchGlobalUsers ? searchGlobalUsers(connectSearchQuery) : [];
  }, [searchGlobalUsers, connectSearchQuery]);

  const filteredTeachers = useMemo(() => {
    const q = teacherSearch.trim().toLowerCase();
    return centerTeachers.filter((t) => {
      if (branchFilter !== 'all' && String(t.branchId) !== String(branchFilter)) return false;
      if (!q) return true;
      return (
        (t.nameAr || '').toLowerCase().includes(q) ||
        (t.subjectAr || '').toLowerCase().includes(q) ||
        (t.phone || '').includes(q) ||
        (t.email || '').toLowerCase().includes(q) ||
        (t.branchNameAr || '').toLowerCase().includes(q)
      );
    });
  }, [centerTeachers, teacherSearch, branchFilter]);

  const handleConnect = async (user) => {
    if (connectingUserId) return;
    setConnectingUserId(user.id);
    try {
      const targetBranchId = selectedBranchForConnect || branches[0]?.id || undefined;
      const result = await onConnectUser(user, targetBranchId);
      setConnectFeedback(result);
      setTimeout(() => setConnectFeedback(null), 4000);
    } finally {
      setConnectingUserId(null);
    }
  };

  const handleDisconnect = async (conn) => {
    if (!onDisconnectUser || disconnectingId) return;
    setDisconnectingId(conn.id);
    try {
      await onDisconnectUser(conn);
    } finally {
      setDisconnectingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Motafawweq Connect Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '22px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '14px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Link2 size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                {isAr
                  ? 'ربط حساب معلم أو طالب مسجل بمنصة متفوّق (Motafawweq Connect)'
                  : 'Quick Connect Existing Platform Account'}
              </h3>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
              {isAr
                ? 'ابحث بالاسم أو رقم الهاتف أو الكود لأي معلم أو طالب مسجل على المنصة لاعتماده وربطه بفرع السنتر فوراً.'
                : 'Search existing teachers or students on the platform and link them to your center branch.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalTeacher({ mode: 'create', teacher: null })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Plus size={15} />
            <span>{isAr ? '+ إضافة معلم جديد ودعوته بالإيميل' : '+ New Teacher via Email'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <input
              type="text"
              placeholder={
                isAr
                  ? 'ابحث باسم المعلم/الطالب أو رقم الهاتف أو البريد...'
                  : 'Search by name, phone, or email...'
              }
              value={connectSearchQuery}
              onChange={(e) => setConnectSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 16px 11px 38px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '700',
                outline: 'none',
              }}
            />
            <Search
              size={16}
              color="var(--text-secondary)"
              style={{ position: 'absolute', left: '12px', top: '13px' }}
            />
          </div>

          <select
            value={selectedBranchForConnect}
            onChange={(e) => setSelectedBranchForConnect(e.target.value)}
            style={{
              padding: '11px 14px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '700',
            }}
          >
            {branches.length === 0 ? (
              <option value="">{isAr ? 'الفرع الرئيسي' : 'Main Branch'}</option>
            ) : (
              branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {isAr ? `ربط بـ ${b.nameAr}` : `Link to ${b.nameEn || b.nameAr}`}
                </option>
              ))
            )}
          </select>
        </div>

        {connectFeedback && (
          <div
            style={{
              marginTop: '12px',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: connectFeedback.success
                ? 'rgba(16, 185, 129, 0.12)'
                : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${
                connectFeedback.success ? 'var(--success, #10B981)' : 'var(--danger, #EF4444)'
              }`,
              fontSize: '12.5px',
              fontWeight: '700',
              color: connectFeedback.success ? 'var(--success, #10B981)' : 'var(--danger, #EF4444)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {connectFeedback.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{connectFeedback.messageAr}</span>
          </div>
        )}

        {/* Platform Search Results */}
        {connectSearchQuery.trim().length >= 2 && (
          <div style={{ marginTop: '14px' }}>
            {searchResults.length === 0 ? (
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px dashed var(--border-subtle)',
                  textAlign: 'center',
                  fontSize: '12.5px',
                  color: 'var(--text-secondary)',
                }}
              >
                {isAr
                  ? 'لا توجد حسابات مطابقة على المنصة. يمكنك إضافة المعلم مباشرةً عبر زر «+ إضافة معلم جديد».'
                  : 'No matching platform account found.'}
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '10px',
                }}
              >
                {searchResults.map((user) => {
                  const alreadyLinked =
                    Boolean(user.isAlreadyConnected) ||
                    connectedUsers.some((c) => Number(c.userId) === Number(user.id));
                  const isBusy = connectingUserId === user.id;

                  return (
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
                        gap: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <Avatar src={user.avatar} name={user.nameAr} size={38} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                            {user.nameAr}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                            {user.roleAr}
                            {user.subjectAr ? ` • ${user.subjectAr}` : ''}
                            {user.phone ? ` • ${user.phone}` : ''}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={alreadyLinked || isBusy}
                        onClick={() => handleConnect(user)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: alreadyLinked ? 'var(--bg-subtle)' : 'var(--primary)',
                          color: alreadyLinked ? 'var(--text-secondary)' : '#FFFFFF',
                          border: 'none',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          cursor: alreadyLinked ? 'default' : isBusy ? 'wait' : 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        {alreadyLinked
                          ? isAr
                            ? 'مربوط بالفعل'
                            : 'Connected'
                          : isBusy
                            ? isAr
                              ? 'جاري...'
                              : 'Linking...'
                            : isAr
                              ? 'ربط بالسنتر'
                              : 'Connect'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Currently Connected Platform Accounts Strip */}
        {connectedUsers.length > 0 && (
          <div
            style={{
              marginTop: '16px',
              paddingTop: '14px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              {isAr
                ? `حسابات المنصة المربوطة بالسنتر (${connectedUsers.length}):`
                : `Linked Platform Accounts (${connectedUsers.length}):`}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {connectedUsers.map((conn) => (
                <div
                  key={conn.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                  }}
                >
                  <Avatar src={conn.avatar} name={conn.nameAr} size={24} />
                  <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                    {conn.nameAr}
                  </span>
                  <span style={{ fontSize: '10.5px', color: 'var(--primary)', fontWeight: '700' }}>
                    ({conn.roleAr})
                  </span>
                  <button
                    type="button"
                    disabled={disconnectingId === conn.id}
                    onClick={() => handleDisconnect(conn)}
                    title={isAr ? 'فك ربط الحساب' : 'Disconnect account'}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--danger, #EF4444)',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    <Unlink size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Center Teachers Network Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: 'var(--bg-app)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
              {isAr ? 'قائمة المعلمين المعتمدين والمربوطين بالسنتر' : 'Certified Teachers Network'}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {filteredTeachers.length} {isAr ? 'مدرسين متاحين للربط بالمجموعات الدراسية' : 'teachers available for cohorts'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={isAr ? 'بحث في المعلمين...' : 'Search teachers...'}
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                style={{
                  height: '36px',
                  padding: '0 12px 0 32px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                }}
              />
              <Search
                size={14}
                color="var(--text-secondary)"
                style={{ position: 'absolute', left: '10px', top: '11px' }}
              />
            </div>

            {branches.length > 0 && (
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                style={{
                  height: '36px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                }}
              >
                <option value="all">{isAr ? 'كل الفروع' : 'All Branches'}</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {isAr ? b.nameAr : b.nameEn || b.nameAr}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {centerTeachers.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <GraduationCap
              size={36}
              color="var(--primary)"
              style={{ margin: '0 auto 12px', display: 'block', opacity: 0.8 }}
            />
            <h4 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
              {isAr ? 'لم يتم إضافة معلمين لشبكة السنتر بعد' : 'No teachers added to the center network yet'}
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 16px' }}>
              {isAr
                ? 'أضف المعلمين المعتمدين بالسنتر لتوليد روابط التفعيل وإسناد المجموعات والقاعات لهم بدون تعارض.'
                : 'Add certified teachers to generate activation links and assign cohorts.'}
            </p>
            <button
              type="button"
              onClick={() => setModalTeacher({ mode: 'create', teacher: null })}
              style={{
                padding: '9px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {isAr ? '+ إضافة أول معلم للسنتر' : '+ Add First Teacher'}
            </button>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            {isAr ? 'لا يوجد معلمون يطابقون البحث الحالي.' : 'No teachers match the current filter.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '780px', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <th style={{ padding: '12px 18px' }}>{isAr ? 'اسم المدرس' : 'Teacher'}</th>
                  <th style={{ padding: '12px 18px' }}>{isAr ? 'التخصص والمادة' : 'Subject'}</th>
                  <th style={{ padding: '12px 18px' }}>{isAr ? 'الفرع التابع له' : 'Branch'}</th>
                  <th style={{ padding: '12px 18px' }}>{isAr ? 'الهاتف والبريد الإلكتروني' : 'Contact'}</th>
                  <th style={{ padding: '12px 18px' }}>{isAr ? 'نسبة التسوية' : 'Share'}</th>
                  <th style={{ padding: '12px 18px' }}>{isAr ? 'الحالة' : 'Status'}</th>
                  <th style={{ padding: '12px 18px', textAlign: 'center' }}>{isAr ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((tch) => {
                  const sharePct = Math.round(Number(tch.settlementRate ?? 0.75) * 100);
                  const isSuspended = tch.status === 'suspended';

                  return (
                    <tr key={tch.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                      <td style={{ padding: '14px 18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Avatar src={tch.avatar} name={tch.nameAr || 'معلم'} size={36} />
                          <div>
                            <div>{tch.nameAr}</div>
                            {Number(tch.enrolledGroupsCount) > 0 && (
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                {tch.enrolledGroupsCount} {isAr ? 'مجموعات نشطة' : 'active cohorts'}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px', color: 'var(--text-primary)', fontWeight: '700' }}>
                        <span
                          style={{
                            padding: '3px 9px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-app)',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '12px',
                          }}
                        >
                          {tch.subjectAr}
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px', color: 'var(--primary)', fontWeight: '700' }}>
                        {tch.branchNameAr || (isAr ? 'الفرع الرئيسي' : 'Main Branch')}
                      </td>

                      <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                        <div dir="ltr" style={{ fontFamily: 'monospace', fontWeight: '700', display: 'inline-block' }}>
                          {tch.phone || '—'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{tch.email}</div>
                      </td>

                      <td style={{ padding: '14px 18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {sharePct}%
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '11px',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: isSuspended
                              ? 'rgba(239, 68, 68, 0.12)'
                              : 'rgba(16, 185, 129, 0.12)',
                            color: isSuspended ? 'var(--danger, #EF4444)' : '#10B981',
                            fontWeight: '800',
                          }}
                        >
                          <CheckCircle2 size={13} />
                          <span>{tch.statusAr || (isAr ? 'معتمد ونشط' : 'Active')}</span>
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => onResendInvite(tch)}
                            title={isAr ? 'نسخ وإعادة إرسال رابط التفعيل للمدرس' : 'Copy & Resend Invite Link'}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-app)',
                              color: 'var(--primary)',
                              fontSize: '11.5px',
                              fontWeight: '800',
                              cursor: 'pointer',
                            }}
                          >
                            <Copy size={12} />
                            <span>{isAr ? 'رابط التفعيل' : 'Invite'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setModalTeacher({ mode: 'edit', teacher: tch })}
                            title={isAr ? 'تعديل بيانات المعلم' : 'Edit Teacher'}
                            style={{
                              padding: '6px 8px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-app)',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                            }}
                          >
                            <Pencil size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(tch)}
                            title={isAr ? 'حذف المعلم من السنتر' : 'Remove Teacher'}
                            style={{
                              padding: '6px 8px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              backgroundColor: 'rgba(239, 68, 68, 0.06)',
                              color: 'var(--danger, #EF4444)',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Teacher Modal */}
      {modalTeacher && (
        <TeacherFormModal
          key={modalTeacher.teacher?.id || 'create-teacher'}
          mode={modalTeacher.mode}
          teacher={modalTeacher.teacher}
          branches={branches}
          onClose={() => setModalTeacher(null)}
          onSave={async (payload) => {
            if (modalTeacher.mode === 'edit' && modalTeacher.teacher) {
              await onUpdateTeacher(modalTeacher.teacher.id, payload);
            } else {
              await onAddTeacher(payload);
            }
            setModalTeacher(null);
          }}
          lang={lang}
          isRtl={isRtl}
        />
      )}

      {/* Delete Teacher Confirm Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setDeleteTarget(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.68)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid rgba(239, 68, 68, 0.4)',
              maxWidth: '440px',
              width: '100%',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                color: 'var(--danger, #EF4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto',
              }}
            >
              <Trash2 size={26} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              {isAr ? 'تأكيد فك ارتباط وحذف المعلم' : 'Remove Teacher'}
            </h3>

            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              {isAr
                ? `هل أنت متأكد من حذف المعلم «${deleteTarget.nameAr}» (${deleteTarget.subjectAr}) من شبكة السنتر؟`
                : `Are you sure you want to remove teacher "${deleteTarget.nameAr}"?`}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={async () => {
                  const target = deleteTarget;
                  setDeleteTarget(null);
                  await onDeleteTeacher(target);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--danger, #EF4444)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'نعم، حذف المعلم' : 'Yes, Remove'}
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                style={{
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TeacherFormModal = ({
  mode,
  teacher,
  branches = [],
  onClose,
  onSave,
  lang = 'ar',
  isRtl = true,
}) => {
  const isAr = lang === 'ar';
  const [nameAr, setNameAr] = useState(teacher?.nameAr || '');
  const [subjectAr, setSubjectAr] = useState(teacher?.subjectAr || SUBJECT_SUGGESTIONS[0]);
  const [branchId, setBranchId] = useState(teacher?.branchId || branches[0]?.id || '');
  const [email, setEmail] = useState(teacher?.email || '');
  const [phone, setPhone] = useState(teacher?.phone || '');
  const [settlementPct, setSettlementPct] = useState(
    String(Math.round(Number(teacher?.settlementRate ?? 0.75) * 100))
  );
  const [status, setStatus] = useState(teacher?.status || 'active');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameAr.trim() || !email.trim() || submitting) return;
    const rate = Math.max(5, Math.min(95, Number(settlementPct) || 75)) / 100;

    setSubmitting(true);
    try {
      await onSave({
        nameAr: nameAr.trim(),
        subjectAr: subjectAr.trim(),
        branchId: branchId || undefined,
        email: email.trim(),
        phone: phone.trim(),
        settlementRate: rate,
        status,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.68)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          maxWidth: '520px',
          width: '100%',
          padding: '24px',
          boxShadow: 'var(--shadow-xl)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '17px', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>
              {mode === 'edit'
                ? isAr
                  ? `تعديل بيانات المعلم «${teacher?.nameAr}»`
                  : 'Edit Certified Teacher'
                : isAr
                  ? 'إضافة مدرس جديد واعتماده بالسنتر'
                  : 'Add New Certified Teacher'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
              {isAr ? 'اسم المدرس بالكامل *' : 'Teacher Full Name *'}
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder={isAr ? 'اكتب اسم المدرس...' : 'Enter teacher full name...'}
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '700',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                {isAr ? 'المادة والتخصص *' : 'Subject *'}
              </label>
              <input
                type="text"
                list="center-teacher-subjects"
                required
                value={subjectAr}
                onChange={(e) => setSubjectAr(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
              <datalist id="center-teacher-subjects">
                {SUBJECT_SUGGESTIONS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                {isAr ? 'الفرع التابع له' : 'Branch'}
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                }}
              >
                {branches.length === 0 ? (
                  <option value="">{isAr ? 'الفرع الرئيسي' : 'Main Branch'}</option>
                ) : (
                  branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {isAr ? b.nameAr : b.nameEn || b.nameAr}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
              {isAr
                ? 'البريد الإلكتروني للمدرس (لإرسال رابط تفعيل المنصة) *'
                : 'Teacher Email (for activation link) *'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="teacher@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  paddingInlineStart: '38px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  top: '13px',
                  right: isRtl ? '12px' : 'auto',
                  left: isRtl ? 'auto' : '12px',
                  color: 'var(--primary)',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: mode === 'edit' ? '1fr 1fr 1fr' : '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                {isAr ? 'رقم الهاتف *' : 'Phone *'}
              </label>
              <input
                type="tel"
                required
                placeholder="010XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                {isAr ? 'نسبة المدرس (%)' : 'Teacher Share (%)'}
              </label>
              <input
                type="number"
                min="5"
                max="95"
                value={settlementPct}
                onChange={(e) => setSettlementPct(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                }}
              />
            </div>

            {mode === 'edit' && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                  {isAr ? 'الحالة' : 'Status'}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700',
                  }}
                >
                  <option value="active">{isAr ? 'معتمد ونشط' : 'Active'}</option>
                  <option value="invited">{isAr ? 'بانتظار التفعيل' : 'Invited'}</option>
                  <option value="suspended">{isAr ? 'موقوف مؤقتاً' : 'Suspended'}</option>
                </select>
              </div>
            )}
          </div>

          <div
            style={{
              padding: '11px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(21, 136, 199, 0.08)',
              border: '1px solid rgba(21, 136, 199, 0.25)',
              fontSize: '11.5px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <Sparkles size={14} style={{ color: 'var(--primary)', marginInlineEnd: '6px' }} />
            <span>
              {isAr
                ? 'إذا كان البريد الإلكتروني أو الهاتف مسجلاً بالفعل لمعلم على منصة متفوّق، يتم ربط حسابه تلقائياً بالسنتر فوراً.'
                : 'If the email or phone belongs to an existing platform teacher, their account is auto-linked immediately.'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="submit"
              disabled={submitting || !nameAr.trim() || !email.trim()}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '800',
                fontSize: '13px',
                cursor: submitting ? 'wait' : 'pointer',
              }}
            >
              {submitting
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : mode === 'edit'
                  ? isAr
                    ? 'حفظ تعديلات المعلم'
                    : 'Save Changes'
                  : isAr
                    ? 'إضافة المدرس وإصدار رابط التفعيل'
                    : 'Add Teacher & Generate Invite'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
