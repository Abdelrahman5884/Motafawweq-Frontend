import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UserPlus, Search, X, AlertCircle } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { teacherApi } from '../../../services/teacherApi';

export const AddParticipantModal = ({
  league,
  onAddParticipant,
  onClose,
  lang,
  isRtl,
  isMobile,
}) => {
  const isAr = lang === 'ar';
  const [query, setQuery] = useState('');
  const [initialXp, setInitialXp] = useState('0');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [error, setError] = useState('');
  const seqRef = useRef(0);

  const existingIds = useMemo(() => {
    const set = new Set();
    (league?.leaderboard || []).forEach((p) => {
      if (p.studentId) set.add(String(p.studentId));
      if (p.studentCode) set.add(String(p.studentCode).toLowerCase());
    });
    return set;
  }, [league?.leaderboard]);

  // Debounced search with stale-response protection
  useEffect(() => {
    const seq = ++seqRef.current;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await teacherApi.roster.searchStudents(query.trim());
        if (seq !== seqRef.current) return;
        setResults(Array.isArray(res?.data) ? res.data : []);
      } catch {
        if (seq !== seqRef.current) return;
        setResults([]);
      } finally {
        if (seq === seqRef.current) {
          setIsSearching(false);
        }
      }
    }, query ? 300 : 0);

    return () => clearTimeout(timer);
  }, [query]);

  const handleAdd = async (studentOrCode) => {
    if (addingId) return;
    const isObj = typeof studentOrCode === 'object' && studentOrCode !== null;
    const identifier = isObj
      ? String(studentOrCode.id || studentOrCode.studentCode || '')
      : String(studentOrCode || '').trim();
    if (!identifier) return;

    const parsedXp = Math.max(0, Math.min(1000000, Number.parseInt(initialXp, 10) || 0));
    setAddingId(identifier);
    setError('');
    try {
      const displayName = isObj
        ? (studentOrCode.nameAr || studentOrCode.name || identifier)
        : identifier;
      await onAddParticipant(identifier, parsedXp, displayName);
    } catch (err) {
      setError(err?.message || (isAr ? 'تعذر إضافة الطالب إلى الدوري.' : 'Failed to add student.'));
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: isMobile ? '20px 16px' : '26px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserPlus size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? 'إضافة طالب إلى الدوري' : 'Add Student to League'}
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>
                {isAr ? 'ابحث بالاسم أو كود الطالب لإضافته للمنافسة الحالية' : 'Search by name or student code'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '12.5px',
              fontWeight: '700',
              marginBottom: '12px',
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 140px', gap: '10px', marginBottom: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
              {isAr ? 'بحث عن طالب (الاسم / الكود / البريد)' : 'Search Student'}
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                borderRadius: '10px',
                padding: '8px 10px',
              }}
            >
              <Search size={14} color="var(--text-secondary)" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError('');
                }}
                placeholder={isAr ? 'اكتب اسم الطالب أو كوده...' : 'Student name or code...'}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
              {isAr ? 'نقاط البداية (XP)' : 'Initial XP'}
            </label>
            <input
              type="number"
              min={0}
              max={1000000}
              value={initialXp}
              onChange={(e) => setInitialXp(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div
          style={{
            maxHeight: '290px',
            overflowY: 'auto',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-subtle)',
            padding: '8px',
          }}
        >
          {isSearching ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)', fontSize: '13px' }}>
              {isAr ? 'جاري البحث عن الطلاب...' : 'Searching students...'}
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)', fontSize: '13px' }}>
              {isAr ? 'لا توجد نتائج مطابقة.' : 'No matching students found.'}
              {query.trim() && (
                <div style={{ marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleAdd(query.trim())}
                    disabled={Boolean(addingId)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: addingId ? 'wait' : 'pointer',
                    }}
                  >
                    {isAr ? `إضافة بالكود "${query.trim()}" مباشرة` : `Add "${query.trim()}" directly`}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {results.map((stu) => {
                const stuId = String(stu.id || '');
                const stuCode = String(stu.studentCode || '').toLowerCase();
                const alreadyIn =
                  (stuId && existingIds.has(stuId)) || (stuCode && existingIds.has(stuCode));
                const isBusy = addingId === (stu.id ? String(stu.id) : String(stu.studentCode));
                const displayName = stu.nameAr || stu.name || 'طالب';

                return (
                  <div
                    key={stu.id || stu.uuid || stu.studentCode}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <Avatar src={stu.avatar} name={displayName} size={36} />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: '800',
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {displayName}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                          {stu.studentCode ? `${isAr ? 'كود:' : 'Code:'} ${stu.studentCode}` : stu.email}
                        </div>
                      </div>
                    </div>

                    {alreadyIn ? (
                      <span
                        style={{
                          padding: '5px 10px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(16, 185, 129, 0.12)',
                          color: '#10B981',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          flexShrink: 0,
                        }}
                      >
                        {isAr ? 'مشترك بالفعل' : 'Enrolled'}
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={Boolean(addingId)}
                        onClick={() => handleAdd(stu)}
                        style={{
                          padding: '7px 12px',
                          borderRadius: '10px',
                          border: 'none',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: isBusy ? 'wait' : 'pointer',
                          opacity: addingId && !isBusy ? 0.6 : 1,
                          flexShrink: 0,
                        }}
                      >
                        {isBusy
                          ? (isAr ? 'جاري الإضافة...' : 'Adding...')
                          : (isAr ? '+ إضافة' : '+ Add')}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddParticipantModal;
