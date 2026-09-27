import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useGroups } from '../../context/GroupsContext';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  BookOpen,
  Calendar,
  MapPin,
  Coins,
  QrCode,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Search,
  UserCheck
} from 'lucide-react';
import { ClassQrModal } from '../../features/teacher/classes/ClassQrModal';

export const StudentGroupsView = () => {
  const { lang, isRtl } = useLanguage();
  const { currentUser } = useAuth();
  const {
    groups,
    enrolledStudents,
    pendingStudents,
    studentJoinByCode
  } = useGroups();

  const [inputCode, setInputCode] = useState('');
  const [joinResult, setJoinResult] = useState(null);
  const [selectedGroupForQr, setSelectedGroupForQr] = useState(null);

  const studentNameAr = currentUser?.nameAr || 'عمر طارق القاضي';
  const studentPhone = currentUser?.phone || '+20 102 458 9912';

  // Identify which groups this student is enrolled in or pending
  const studentGroups = groups.map(g => {
    const isEnrolled = (enrolledStudents[g.id] || []).some(
      s => s.nameAr === studentNameAr || s.phone === studentPhone || s.name === currentUser?.name
    );
    const isPending = (pendingStudents[g.id] || []).some(
      s => s.nameAr === studentNameAr || s.phone === studentPhone || s.name === currentUser?.name
    );

    return {
      ...g,
      isEnrolled,
      isPending,
      enrolledData: isEnrolled ? (enrolledStudents[g.id] || []).find(s => s.nameAr === studentNameAr || s.phone === studentPhone) : null
    };
  }).filter(g => g.isEnrolled || g.isPending);

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = studentJoinByCode(inputCode, {
      nameAr: studentNameAr,
      name: currentUser?.name || studentNameAr,
      phone: studentPhone,
      parentNameAr: currentUser?.parentNameAr || 'م. طارق القاضي',
      parentPhone: currentUser?.parentPhone || '+20 100 123 4567'
    });
    setJoinResult(res);
    if (res.success) {
      setInputCode('');
    }
  };

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '28px 20px 80px',
      fontFamily: 'var(--font-arabic)',
      direction: isRtl ? 'rtl' : 'ltr'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '900',
          color: 'var(--text-primary)',
          margin: '0 0 6px 0',
          letterSpacing: '-0.3px'
        }}>
          {lang === 'ar' ? 'مجموعاتي الدراسية ومجموعات السنتر' : 'My Study Groups & Cohorts'}
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          {lang === 'ar'
            ? 'متابعة المجموعات والقاعات المسجل بها مع معلميك، مواعيد الحصص، والانضمام لمجموعات جديدة عبر الباركود'
            : 'Track your enrolled cohorts, class timings, and join new study groups via code or QR scan'}
        </p>
      </div>

      {/* Join Group Input Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '18px',
        border: '1px solid var(--border-subtle)',
        padding: '20px 24px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Building2 size={18} color="var(--primary)" />
          <h2 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'الانضمام إلى مجموعة دراسية بكود أو باركود' : 'Join a Study Group via Code'}
          </h2>
        </div>

        <form onSubmit={handleJoinSubmit} style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          alignItems: 'stretch'
        }}>
          <input
            type="text"
            placeholder={lang === 'ar' ? 'أدخل كود المجموعة (مثال: BIO-DK-2026)...' : 'Enter group code...'}
            value={inputCode}
            onChange={(e) => {
              setInputCode(e.target.value.toUpperCase());
              setJoinResult(null);
            }}
            style={{
              flex: '1 1 240px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '700',
              fontFamily: 'monospace',
              letterSpacing: '1px',
              outline: 'none'
            }}
          />

          <button
            type="submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 22px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 8px var(--primary-glow)'
            }}
          >
            <Plus size={15} />
            <span>{lang === 'ar' ? 'انضمام للمجموعة' : 'Join Cohort'}</span>
          </button>
        </form>

        {/* Quick Suggestion Chips for Available Groups */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {lang === 'ar' ? 'أكواد مجموعات متوفرة للتجربة:' : 'Available codes to test:'}
          </span>
          {groups.map(g => (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setInputCode(g.joinCode);
                setJoinResult(null);
              }}
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-subtle)',
                padding: '3px 8px',
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: '700',
                color: 'var(--primary)',
                cursor: 'pointer'
              }}
            >
              {g.joinCode} ({lang === 'ar' ? g.subjectAr.split(' ')[0] : g.subjectEn})
            </button>
          ))}
        </div>

        {/* Join Result Feedback */}
        {joinResult && (
          <div style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: joinResult.success ? 'var(--primary-surface)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${joinResult.success ? 'rgba(21, 136, 199, 0.25)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: joinResult.success ? 'var(--primary)' : '#EF4444',
            fontSize: '12.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {joinResult.success ? <CheckCircle2 size={16} /> : null}
            <span>
              {joinResult.success
                ? (lang === 'ar' ? 'تم إرسال طلب الانضمام بنجاح! بانتظار موافقة المعلم.' : 'Join request sent successfully!')
                : joinResult.error}
            </span>
          </div>
        )}
      </div>

      {/* Student's Cohorts Grid */}
      <h2 style={{
        fontSize: '17px',
        fontWeight: '900',
        color: 'var(--text-primary)',
        margin: '0 0 16px 0'
      }}>
        {lang === 'ar' ? 'المجموعات التي تدرس بها حالياً' : 'Your Enrolled Cohorts'}
      </h2>

      {studentGroups.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <Building2 size={36} color="var(--primary)" style={{ margin: '0 auto 10px', opacity: 0.6 }} />
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
            {lang === 'ar' ? 'لم تنضم إلى أي مجموعة سنتر بعد' : 'Not joined to any cohort yet'}
          </h3>
          <p style={{ fontSize: '12.5px', margin: 0 }}>
            {lang === 'ar'
              ? 'احصل على كود المجموعة من معلمك أو امسح الباركود بهاتفك للانضمام فوراً'
              : 'Enter your teacher group code above to enroll'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '20px'
        }}>
          {studentGroups.map(g => (
            <div
              key={g.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '18px',
                border: '1px solid var(--border-subtle)',
                padding: '22px',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                {/* Status Badge & Subject */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 9px',
                    borderRadius: '8px',
                    backgroundColor: g.isEnrolled ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                    color: g.isEnrolled ? 'var(--primary)' : 'var(--text-secondary)',
                    border: `1px solid ${g.isEnrolled ? 'rgba(21, 136, 199, 0.2)' : 'var(--border-subtle)'}`,
                    fontSize: '11px',
                    fontWeight: '800'
                  }}>
                    {g.isEnrolled ? <UserCheck size={12} /> : <Clock size={12} />}
                    <span>{g.isEnrolled ? (lang === 'ar' ? 'مقيد ومعتمد في المجموعة' : 'Active Enrolled') : (lang === 'ar' ? 'طلب انضمام قيد الانتظار' : 'Pending Approval')}</span>
                  </span>

                  <button
                    onClick={() => setSelectedGroupForQr(g)}
                    title={lang === 'ar' ? 'عرض الباركود' : 'Show QR'}
                    style={{
                      border: 'none',
                      background: 'var(--bg-subtle)',
                      borderRadius: '8px',
                      padding: '5px',
                      cursor: 'pointer',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <QrCode size={16} />
                  </button>
                </div>

                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '900',
                  color: 'var(--text-primary)',
                  margin: '0 0 6px 0',
                  lineHeight: 1.35
                }}>
                  {lang === 'ar' ? g.nameAr : g.nameEn || g.name}
                </h3>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  fontSize: '11.5px',
                  fontWeight: '800',
                  marginBottom: '12px'
                }}>
                  <BookOpen size={12} />
                  <span>{lang === 'ar' ? g.subjectAr : g.subjectEn}</span>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <div>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? `المعلم: ${g.teacherNameAr || 'د. سلمى السيد'}` : `Teacher: ${g.teacherNameEn || 'Dr. Salma El-Sayed'}`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} color="var(--primary)" />
                    <span>{lang === 'ar' ? g.scheduleAr : g.scheduleEn}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} color="var(--primary)" />
                    <span>{g.centerName}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Coins size={13} color="var(--primary)" />
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                      {g.priceEgp} {lang === 'ar' ? 'ج.م / شهرياً' : 'EGP / mo'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer with Group Code */}
              <div style={{
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11.5px'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'كود المجموعة:' : 'Group Code:'}
                </span>
                <span style={{ fontFamily: 'monospace', fontWeight: '800', color: 'var(--primary)' }}>
                  {g.joinCode}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal for Selected Group */}
      <ClassQrModal
        showQrModal={Boolean(selectedGroupForQr)}
        selectedClass={selectedGroupForQr}
        lang={lang}
        onClose={() => setSelectedGroupForQr(null)}
      />
    </div>
  );
};
