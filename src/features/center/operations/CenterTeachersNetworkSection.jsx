import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Copy,
  GraduationCap,
  Link2,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Unlink,
  X,
  XCircle,
} from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { SBadge, SButton, SCard, SSection } from '../../../components/student/ui';
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
  const [connectRoleFilter, setConnectRoleFilter] = useState('teacher'); // 'teacher' | 'all'
  const [selectedBranchForConnect, setSelectedBranchForConnect] = useState(
    () => branches[0]?.id || ''
  );
  const [connectFeedback, setConnectFeedback] = useState(null);
  const [connectingUserId, setConnectingUserId] = useState(null);
  const [disconnectingId, setDisconnectingId] = useState(null);

  // Teachers Table Filter & Modals
  const [teacherSearch, setTeacherSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'invited' | 'declined'
  const [modalTeacher, setModalTeacher] = useState(null); // null | { mode: 'create' | 'edit', teacher }
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const q = connectSearchQuery.trim();
    if (!isBackendCenter || !searchGlobalUsersRemote || q.length < 2) return undefined;
    const roleParam = connectRoleFilter === 'teacher' ? 'teacher' : null;
    const timer = setTimeout(() => {
      searchGlobalUsersRemote(q, roleParam);
    }, 250);
    return () => clearTimeout(timer);
  }, [isBackendCenter, searchGlobalUsersRemote, connectSearchQuery, connectRoleFilter]);

  const searchResults = useMemo(() => {
    const list = searchGlobalUsers ? searchGlobalUsers(connectSearchQuery) : [];
    if (connectRoleFilter === 'teacher') {
      return list.filter((u) => u.role === 'teacher');
    }
    return list;
  }, [searchGlobalUsers, connectSearchQuery, connectRoleFilter]);

  const statusCounts = useMemo(() => {
    let active = 0;
    let invited = 0;
    let declined = 0;
    centerTeachers.forEach((t) => {
      if (t.status === 'active') active += 1;
      else if (t.status === 'invited') invited += 1;
      else if (t.status === 'declined') declined += 1;
    });
    return { all: centerTeachers.length, active, invited, declined };
  }, [centerTeachers]);

  const filteredTeachers = useMemo(() => {
    const q = teacherSearch.trim().toLowerCase();
    return centerTeachers.filter((t) => {
      if (branchFilter !== 'all' && String(t.branchId) !== String(branchFilter)) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (!q) return true;
      return (
        (t.nameAr || '').toLowerCase().includes(q) ||
        (t.subjectAr || '').toLowerCase().includes(q) ||
        (t.phone || '').includes(q) ||
        (t.email || '').toLowerCase().includes(q) ||
        (t.branchNameAr || '').toLowerCase().includes(q)
      );
    });
  }, [centerTeachers, teacherSearch, branchFilter, statusFilter]);

  const handleConnect = async (user) => {
    if (connectingUserId) return;
    setConnectingUserId(user.id);
    try {
      const targetBranchId = selectedBranchForConnect || branches[0]?.id || undefined;
      const result = await onConnectUser(user, targetBranchId);
      setConnectFeedback(result);
      setTimeout(() => setConnectFeedback(null), 5000);
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

  const renderStatusBadge = (tch) => {
    if (tch.status === 'invited') {
      return (
        <SBadge variant="warning" size="xs">
          <Clock size={11} />
          <span>
            {tch.statusAr ||
              (tch.isPlatformLinked
                ? isAr
                  ? 'بانتظار موافقة المعلم'
                  : 'Awaiting Teacher'
                : isAr
                  ? 'بانتظار التفعيل'
                  : 'Invited')}
          </span>
        </SBadge>
      );
    }

    if (tch.status === 'declined') {
      return (
        <SBadge variant="danger" size="xs">
          <XCircle size={11} />
          <span>{tch.statusAr || (isAr ? 'رفض المعلم الدعوة' : 'Declined')}</span>
        </SBadge>
      );
    }

    if (tch.status === 'suspended') {
      return (
        <SBadge variant="danger" size="xs">
          <AlertCircle size={11} />
          <span>{tch.statusAr || (isAr ? 'موقوف مؤقتاً' : 'Suspended')}</span>
        </SBadge>
      );
    }

    return (
      <SBadge variant="success" size="xs">
        <CheckCircle2 size={11} />
        <span>{tch.statusAr || (isAr ? 'معتمد ونشط' : 'Active')}</span>
      </SBadge>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── 1. Motafawweq Connect: Invite Existing Platform Teacher ── */}
      <SCard padding={22} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Link2 size={18} color="var(--primary)" />
              <span>
                {isAr
                  ? 'دعوة معلم مسجل على منصة متفوّق (Motafawweq Connect)'
                  : 'Invite Existing Platform Teacher (Motafawweq Connect)'}
              </span>
            </span>
          }
          action={
            <SButton
              variant="primary"
              size="sm"
              icon={<Plus size={15} />}
              onClick={() => setModalTeacher({ mode: 'create', teacher: null })}
            >
              {isAr ? 'إضافة معلم خارجي بالإيميل' : 'Add External Teacher'}
            </SButton>
          }
          style={{ marginBottom: 0 }}
        >
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 14px', lineHeight: 1.55 }}>
            {isAr
              ? 'ابحث بالاسم أو الهاتف أو البريد عن معلم مسجل على المنصة لإرسال دعوة انضمام رسمية — يتم اعتماده تلقائياً فور موافقته من حسابه.'
              : 'Search registered platform teachers by name, phone, or email to send an invitation — activated automatically once approved by the teacher.'}
          </p>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <input
                type="text"
                className="co-input"
                placeholder={
                  isAr
                    ? 'ابحث باسم المعلم أو رقم الهاتف أو البريد الإلكتروني...'
                    : 'Search teacher by name, phone, or email...'
                }
                value={connectSearchQuery}
                onChange={(e) => setConnectSearchQuery(e.target.value)}
                style={{ paddingInlineStart: '38px' }}
              />
              <Search
                size={15}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  insetInlineStart: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            <div style={{ display: 'inline-flex', gap: '6px' }}>
              <button
                type="button"
                className={`co-pill-filter${connectRoleFilter === 'teacher' ? ' active' : ''}`}
                onClick={() => setConnectRoleFilter('teacher')}
              >
                {isAr ? 'المعلمون فقط' : 'Teachers'}
              </button>
              <button
                type="button"
                className={`co-pill-filter${connectRoleFilter === 'all' ? ' active' : ''}`}
                onClick={() => setConnectRoleFilter('all')}
              >
                {isAr ? 'الكل' : 'All'}
              </button>
            </div>

            {branches.length > 0 && (
              <select
                className="co-input"
                value={selectedBranchForConnect}
                onChange={(e) => setSelectedBranchForConnect(e.target.value)}
                style={{ width: 'auto', minWidth: '170px', fontWeight: '700' }}
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {isAr ? `الفرع: ${b.nameAr}` : `Branch: ${b.nameEn || b.nameAr}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          {connectFeedback && (
            <div
              role="status"
              style={{
                marginTop: '12px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: !connectFeedback.success
                  ? 'var(--error-light)'
                  : connectFeedback.awaitingApproval
                    ? 'rgba(245, 158, 11, 0.12)'
                    : 'var(--success-light)',
                border: `1px solid ${
                  !connectFeedback.success
                    ? 'rgba(220, 38, 38, 0.3)'
                    : connectFeedback.awaitingApproval
                      ? 'rgba(245, 158, 11, 0.35)'
                      : 'rgba(22, 163, 74, 0.3)'
                }`,
                fontSize: '12.5px',
                fontWeight: '700',
                color: !connectFeedback.success
                  ? 'var(--danger, #DC2626)'
                  : connectFeedback.awaitingApproval
                    ? '#B45309'
                    : 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {!connectFeedback.success ? (
                <AlertCircle size={16} />
              ) : connectFeedback.awaitingApproval ? (
                <Clock size={16} />
              ) : (
                <CheckCircle2 size={16} />
              )}
              <span>{connectFeedback.messageAr}</span>
            </div>
          )}

          {/* Platform Search Results */}
          {connectSearchQuery.trim().length >= 2 && (
            <div style={{ marginTop: '14px' }}>
              {searchResults.length === 0 ? (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px dashed var(--border-medium)',
                    textAlign: 'center',
                    fontSize: '12.5px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {isAr
                    ? 'لا توجد حسابات مطابقة على المنصة. يمكنك إضافته كمعلم خارجي عبر زر «إضافة معلم خارجي بالإيميل».'
                    : 'No matching platform account found.'}
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '10px',
                  }}
                >
                  {searchResults.map((user) => {
                    const existingConn = connectedUsers.find(
                      (c) => Number(c.userId) === Number(user.id)
                    );
                    const existingTeacher = centerTeachers.find(
                      (t) => Number(t.teacherUserId) === Number(user.id)
                    );
                    const status =
                      existingTeacher?.status === 'invited' ||
                      user.connectionStatus === 'pending' ||
                      existingConn?.status === 'pending'
                        ? 'pending'
                        : existingTeacher?.status === 'active' ||
                            user.connectionStatus === 'active' ||
                            existingConn?.status === 'active'
                          ? 'active'
                          : existingTeacher?.status === 'declined' ||
                              user.connectionStatus === 'declined'
                            ? 'declined'
                            : null;
                    const isBusy = connectingUserId === user.id;
                    const isTeacher = user.role === 'teacher';

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
                          <Avatar src={user.avatar} name={user.nameAr} size={40} />
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: '13.5px',
                                fontWeight: '800',
                                color: 'var(--text-primary)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {user.nameAr}
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                              {user.roleAr}
                              {user.subjectAr ? ` • ${user.subjectAr}` : ''}
                              {user.phone ? ` • ${user.phone}` : ''}
                            </div>
                          </div>
                        </div>

                        {status === 'pending' ? (
                          <SBadge variant="warning" size="xs">
                            <Clock size={11} />
                            <span>{isAr ? 'بانتظار الموافقة' : 'Pending'}</span>
                          </SBadge>
                        ) : status === 'active' ? (
                          <SBadge variant="success" size="xs">
                            <CheckCircle2 size={11} />
                            <span>{isAr ? 'معتمد ✓' : 'Connected'}</span>
                          </SBadge>
                        ) : (
                          <SButton
                            variant="primary"
                            size="sm"
                            icon={<Send size={12} />}
                            disabled={isBusy}
                            onClick={() => handleConnect(user)}
                          >
                            {isBusy
                              ? isAr
                                ? 'جاري...'
                                : 'Sending...'
                              : isTeacher
                                ? isAr
                                  ? 'إرسال دعوة'
                                  : 'Send Invite'
                                : isAr
                                  ? 'ربط بالسنتر'
                                  : 'Connect'}
                          </SButton>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Active & Pending Platform Connections Strip */}
          {connectedUsers.length > 0 && (
            <div
              style={{
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                {isAr
                  ? `الدعوات والحسابات المربوطة بالمنصة (${connectedUsers.length}):`
                  : `Platform Invitations & Connected Accounts (${connectedUsers.length}):`}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {connectedUsers.map((conn) => {
                  const isPending = conn.status === 'pending' || conn.awaitingTeacherApproval;
                  return (
                    <div
                      key={conn.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '5px 10px',
                        borderRadius: '999px',
                        backgroundColor: isPending ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-app)',
                        border: `1px solid ${isPending ? 'rgba(245, 158, 11, 0.35)' : 'var(--border-subtle)'}`,
                        fontSize: '12px',
                      }}
                    >
                      <Avatar src={conn.avatar} name={conn.nameAr} size={24} />
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                        {conn.nameAr}
                      </span>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '700',
                          color: isPending ? '#B45309' : 'var(--success)',
                        }}
                      >
                        {isPending
                          ? isAr
                            ? '• بانتظار موافقته'
                            : '• Pending'
                          : isAr
                            ? '• معتمد'
                            : '• Active'}
                      </span>
                      <button
                        type="button"
                        disabled={disconnectingId === conn.id}
                        onClick={() => handleDisconnect(conn)}
                        title={
                          isPending
                            ? isAr
                              ? 'إلغاء الدعوة'
                              : 'Cancel invitation'
                            : isAr
                              ? 'فك ربط الحساب'
                              : 'Disconnect account'
                        }
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--danger, #DC2626)',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        {isPending ? <X size={13} /> : <Unlink size={12} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </SSection>
      </SCard>

      {/* ── 2. Center Teachers Roster Table ── */}
      <SCard padding={0} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden' }}>
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? 'قائمة هيئة التدريس بالسنتر' : 'Center Teaching Faculty'}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {isAr
                  ? `${statusCounts.active} معتمد ونشط • ${statusCounts.invited} بانتظار الموافقة`
                  : `${statusCounts.active} active • ${statusCounts.invited} awaiting approval`}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="co-input"
                  placeholder={isAr ? 'بحث في المعلمين...' : 'Search teachers...'}
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  style={{ height: '36px', paddingInlineStart: '34px', width: '210px', fontSize: '12.5px' }}
                />
                <Search
                  size={14}
                  color="var(--text-muted)"
                  style={{
                    position: 'absolute',
                    insetInlineStart: '11px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {branches.length > 0 && (
                <select
                  className="co-input"
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  style={{ height: '36px', width: 'auto', paddingBlock: 0, fontSize: '12.5px', fontWeight: '700' }}
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

          {/* Status Filter Pills */}
          {centerTeachers.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: isAr ? `الكل (${statusCounts.all})` : `All (${statusCounts.all})` },
                { id: 'active', label: isAr ? `معتمد ونشط (${statusCounts.active})` : `Active (${statusCounts.active})` },
                { id: 'invited', label: isAr ? `بانتظار الموافقة (${statusCounts.invited})` : `Pending (${statusCounts.invited})` },
                ...(statusCounts.declined > 0
                  ? [{ id: 'declined', label: isAr ? `مرفوضة (${statusCounts.declined})` : `Declined (${statusCounts.declined})` }]
                  : []),
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  className={`co-pill-filter${statusFilter === pill.id ? ' active' : ''}`}
                  onClick={() => setStatusFilter(pill.id)}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {centerTeachers.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <GraduationCap size={34} color="var(--primary)" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.85 }} />
            <h4 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
              {isAr ? 'لم يتم إضافة معلمين لشبكة السنتر بعد' : 'No teachers added yet'}
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 16px' }}>
              {isAr
                ? 'ابحث عن معلم مسجل بمنصة متفوّق أعلاه لإرسال دعوة انضمام، أو أضف معلماً خارجياً بالبريد الإلكتروني.'
                : 'Invite an existing platform teacher above or add an external teacher by email.'}
            </p>
            <SButton
              variant="primary"
              size="sm"
              icon={<Plus size={15} />}
              onClick={() => setModalTeacher({ mode: 'create', teacher: null })}
            >
              {isAr ? 'إضافة أول معلم للسنتر' : 'Add First Teacher'}
            </SButton>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            {isAr ? 'لا يوجد معلمون يطابقون التصفية الحالية.' : 'No teachers match the current filter.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="co-table" style={{ minWidth: '800px', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr>
                  <th>{isAr ? 'المعلم' : 'Teacher'}</th>
                  <th>{isAr ? 'التخصص' : 'Subject'}</th>
                  <th>{isAr ? 'الفرع' : 'Branch'}</th>
                  <th>{isAr ? 'التواصل' : 'Contact'}</th>
                  <th>{isAr ? 'النسبة' : 'Share'}</th>
                  <th>{isAr ? 'الحالة' : 'Status'}</th>
                  <th style={{ textAlign: 'center' }}>{isAr ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((tch) => {
                  const sharePct = Math.round(Number(tch.settlementRate ?? 0.75) * 100);
                  const isPendingPlatform = Boolean(tch.isPlatformLinked && tch.status === 'invited');
                  const isDeclinedPlatform = Boolean(tch.isPlatformLinked && tch.status === 'declined');

                  return (
                    <tr key={tch.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Avatar src={tch.avatar} name={tch.nameAr || 'معلم'} size={38} />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                                {tch.nameAr}
                              </span>
                              {tch.isPlatformLinked && (
                                <span
                                  title={isAr ? 'حساب موثّق على منصة متفوّق' : 'Motafawweq Platform Account'}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    fontSize: '10px',
                                    fontWeight: '800',
                                    padding: '1px 6px',
                                    borderRadius: '999px',
                                    backgroundColor: 'var(--primary-surface)',
                                    color: 'var(--primary)',
                                  }}
                                >
                                  <BadgeCheck size={11} />
                                  <span>{isAr ? 'متفوّق' : 'Platform'}</span>
                                </span>
                              )}
                            </div>
                            {Number(tch.enrolledGroupsCount) > 0 && (
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                {tch.enrolledGroupsCount} {isAr ? 'مجموعات نشطة' : 'active cohorts'}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            padding: '3px 9px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-subtle)',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {tch.subjectAr}
                        </span>
                      </td>

                      <td style={{ color: 'var(--primary)', fontWeight: '700' }}>
                        {tch.branchNameAr || (isAr ? 'الفرع الرئيسي' : 'Main Branch')}
                      </td>

                      <td>
                        <div dir="ltr" style={{ fontFamily: 'monospace', fontWeight: '600', color: 'var(--text-primary)', display: 'inline-block' }}>
                          {tch.phone || '—'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{tch.email}</div>
                      </td>

                      <td style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{sharePct}%</td>

                      <td>{renderStatusBadge(tch)}</td>

                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {(isPendingPlatform || isDeclinedPlatform) && (
                            <SButton
                              variant="ghost"
                              size="sm"
                              icon={<RefreshCw size={12} />}
                              onClick={() => onResendInvite(tch)}
                              title={isAr ? 'إعادة إرسال الدعوة للمعلم' : 'Resend Invitation'}
                            >
                              {isDeclinedPlatform
                                ? isAr
                                  ? 'إعادة الدعوة'
                                  : 'Re-invite'
                                : isAr
                                  ? 'تذكير'
                                  : 'Remind'}
                            </SButton>
                          )}

                          {!tch.isPlatformLinked && (
                            <SButton
                              variant="ghost"
                              size="sm"
                              icon={<Copy size={12} />}
                              onClick={() => onResendInvite(tch)}
                              title={isAr ? 'نسخ رابط التفعيل للمدرس' : 'Copy Invite Link'}
                            >
                              {isAr ? 'رابط التفعيل' : 'Link'}
                            </SButton>
                          )}

                          <button
                            type="button"
                            onClick={() => setModalTeacher({ mode: 'edit', teacher: tch })}
                            title={isAr ? 'تعديل بيانات المعلم' : 'Edit Teacher'}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-surface)',
                              color: 'var(--text-secondary)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Pencil size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(tch)}
                            title={
                              isPendingPlatform
                                ? isAr
                                  ? 'إلغاء الدعوة'
                                  : 'Cancel Invite'
                                : isAr
                                  ? 'حذف المعلم'
                                  : 'Remove Teacher'
                            }
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid rgba(220, 38, 38, 0.25)',
                              backgroundColor: 'var(--error-light)',
                              color: 'var(--danger, #DC2626)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={13} />
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
      </SCard>

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
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
              border: '1px solid var(--border-medium)',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--error-light)',
                color: 'var(--danger, #DC2626)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <Trash2 size={22} />
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>
              {deleteTarget.awaitingTeacherApproval
                ? isAr
                  ? 'تأكيد إلغاء دعوة المعلم'
                  : 'Cancel Invitation'
                : isAr
                  ? 'تأكيد حذف المعلم من السنتر'
                  : 'Remove Teacher'}
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.55 }}>
              {isAr
                ? `هل أنت متأكد من إزالة «${deleteTarget.nameAr}» (${deleteTarget.subjectAr}) من قائمة معلمي السنتر؟`
                : `Are you sure you want to remove "${deleteTarget.nameAr}" from the center?`}
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <SButton
                variant="danger"
                size="sm"
                onClick={async () => {
                  const target = deleteTarget;
                  setDeleteTarget(null);
                  await onDeleteTeacher(target);
                }}
              >
                {isAr ? 'نعم، تأكيد الحذف' : 'Yes, Remove'}
              </SButton>
              <SButton variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </SButton>
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

  const lockPlatformStatus =
    mode === 'edit' &&
    Boolean(teacher?.isPlatformLinked) &&
    (teacher?.status === 'invited' || teacher?.status === 'declined');

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
        ...(mode === 'edit' && !lockPlatformStatus ? { status } : {}),
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
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
          border: '1px solid var(--border-medium)',
          maxWidth: '520px',
          width: '100%',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
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
            <GraduationCap size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '16.5px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              {mode === 'edit'
                ? isAr
                  ? `تعديل بيانات «${teacher?.nameAr}»`
                  : 'Edit Teacher'
                : isAr
                  ? 'إضافة معلم جديد بالبريد الإلكتروني'
                  : 'Add New Teacher'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
              {isAr ? 'اسم المعلم بالكامل *' : 'Teacher Full Name *'}
            </label>
            <input
              type="text"
              className="co-input"
              required
              autoFocus
              placeholder={isAr ? 'اكتب اسم المعلم...' : 'Enter teacher full name...'}
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                {isAr ? 'المادة والتخصص *' : 'Subject *'}
              </label>
              <input
                type="text"
                className="co-input"
                list="center-teacher-subjects"
                required
                value={subjectAr}
                onChange={(e) => setSubjectAr(e.target.value)}
              />
              <datalist id="center-teacher-subjects">
                {SUBJECT_SUGGESTIONS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                {isAr ? 'الفرع التابع له' : 'Branch'}
              </label>
              <select
                className="co-input"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
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
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
              {isAr ? 'البريد الإلكتروني للمعلم *' : 'Teacher Email *'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                dir="ltr"
                className="co-input"
                required
                placeholder="teacher@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingInlineStart: '36px' }}
              />
              <Mail
                size={15}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: isRtl ? '12px' : 'auto',
                  left: isRtl ? 'auto' : '12px',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: mode === 'edit' && !lockPlatformStatus ? '1fr 1fr 1fr' : '1fr 1fr',
              gap: '12px',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                {isAr ? 'رقم الهاتف *' : 'Phone *'}
              </label>
              <input
                type="tel"
                dir="ltr"
                className="co-input"
                required
                placeholder="010XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                {isAr ? 'نسبة المعلم (%)' : 'Teacher Share (%)'}
              </label>
              <input
                type="number"
                className="co-input"
                min="5"
                max="95"
                value={settlementPct}
                onChange={(e) => setSettlementPct(e.target.value)}
              />
            </div>

            {mode === 'edit' && !lockPlatformStatus && (
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px' }}>
                  {isAr ? 'الحالة' : 'Status'}
                </label>
                <select
                  className="co-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">{isAr ? 'معتمد ونشط' : 'Active'}</option>
                  <option value="suspended">{isAr ? 'موقوف مؤقتاً' : 'Suspended'}</option>
                </select>
              </div>
            )}
          </div>

          <div
            style={{
              padding: '11px 13px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-surface)',
              border: '1px solid var(--primary-light)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.55,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <Clock size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>
              {isAr
                ? 'إذا كان البريد الإلكتروني أو الهاتف مسجلاً بالفعل لمعلم على منصة متفوّق، سيتم إرسال دعوة انضمام رسمية لحسابه ولن يُفعّل إلا بعد موافقته.'
                : 'If this email or phone belongs to an existing Motafawweq teacher, an official invitation will be sent and requires their approval before activation.'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <SButton type="button" variant="ghost" size="sm" onClick={onClose}>
              {isAr ? 'إلغاء' : 'Cancel'}
            </SButton>
            <SButton
              type="submit"
              variant="primary"
              size="sm"
              disabled={submitting || !nameAr.trim() || !email.trim()}
            >
              {submitting
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : mode === 'edit'
                  ? isAr
                    ? 'حفظ التعديلات'
                    : 'Save Changes'
                  : isAr
                    ? 'إضافة وإرسال الدعوة'
                    : 'Add & Send Invite'}
            </SButton>
          </div>
        </form>
      </div>
    </div>
  );
};
