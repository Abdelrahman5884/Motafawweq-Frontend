import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useGroups } from '../../context/GroupsContext';
import {
  Users,
  Clock,
  ArrowRight,
  BookOpen,
  Calendar,
  MapPin,
  Search,
  X,
  UserPlus,
  ChevronDown
} from 'lucide-react';
import {
  RosterTable,
  PendingStudentsTable,
  InviteStudentModal
} from '../../features/teacher/roster';

export const StudentRoster = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const {
    groups,
    activeGroupId,
    setActiveGroupId,
    getActiveGroup,
    enrolledStudents,
    pendingStudents
  } = useGroups();

  const [activeTab, setActiveTab] = useState('enrolled'); // 'enrolled' | 'pending'
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const activeGroup = getActiveGroup();

  const currentEnrolled = activeGroup ? (enrolledStudents[activeGroup.id] || []) : [];
  const currentPending = activeGroup ? (pendingStudents[activeGroup.id] || []) : [];

  // Filter students by name or parent phone
  const filteredEnrolled = currentEnrolled.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (s.nameAr && s.nameAr.toLowerCase().includes(q)) ||
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.phone && s.phone.includes(q)) ||
      (s.parentNameAr && s.parentNameAr.toLowerCase().includes(q)) ||
      (s.parentPhone && s.parentPhone.includes(q))
    );
  });

  const filteredPending = currentPending.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (s.nameAr && s.nameAr.toLowerCase().includes(q)) ||
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.phone && s.phone.includes(q)) ||
      (s.parentNameAr && s.parentNameAr.toLowerCase().includes(q)) ||
      (s.parentPhone && s.parentPhone.includes(q))
    );
  });

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '28px 24px 80px',
      fontFamily: 'var(--font-arabic)',
      direction: isRtl ? 'rtl' : 'ltr'
    }}>
      {/* Top Breadcrumb & Navigation Back */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <button
          onClick={() => navigate('/teacher/classes')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-surface)';
            e.currentTarget.style.color = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <ArrowRight size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
          <span>{lang === 'ar' ? 'العودة للمجموعات والقاعات' : 'Back to Cohorts'}</span>
        </button>

        {/* Group Selector Dropdown */}
        {groups.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>
              {lang === 'ar' ? 'تبديل المجموعة:' : 'Switch Cohort:'}
            </span>
            <select
              value={activeGroup?.id || ''}
              onChange={(e) => setActiveGroupId(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>
                  {lang === 'ar' ? g.nameAr : g.nameEn || g.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Prominent Header Banner with Group Name at the Top */}
      {activeGroup && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          padding: '24px 26px',
          marginBottom: '26px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              fontSize: '12px',
              fontWeight: '800'
            }}>
              <BookOpen size={13} />
              <span>{lang === 'ar' ? activeGroup.subjectAr : activeGroup.subjectEn || 'Biology'}</span>
            </span>

            <span style={{
              fontSize: '11.5px',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)'
            }}>
              {lang === 'ar' ? activeGroup.gradeAr : activeGroup.gradeEn}
            </span>

            <span style={{
              fontSize: '11.5px',
              fontWeight: '800',
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--primary)',
              fontFamily: 'monospace'
            }}>
              {lang === 'ar' ? `كود المجموعة: ${activeGroup.joinCode}` : `Code: ${activeGroup.joinCode}`}
            </span>
          </div>

          {/* Group Name Displayed Prominently */}
          <h1 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0 0 10px 0',
            letterSpacing: '-0.3px'
          }}>
            {lang === 'ar' ? `سجل طلاب: ${activeGroup.nameAr}` : `Cohort Roster: ${activeGroup.nameEn || activeGroup.name}`}
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="var(--primary)" />
              <span>{lang === 'ar' ? activeGroup.scheduleAr : activeGroup.scheduleEn}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="var(--primary)" />
              <span>{activeGroup.centerName}</span>
            </div>
          </div>
        </div>
      )}

      {/* Two Main Tabs & Search Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Two Main Mode Buttons ("زرارين Button فوق كدة") */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          {/* Tab 1: Accepted Enrolled Students */}
          <button
            onClick={() => setActiveTab('enrolled')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 18px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: activeTab === 'enrolled' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'enrolled' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: activeTab === 'enrolled' ? '0 2px 8px var(--primary-glow)' : 'none'
            }}
          >
            <Users size={15} />
            <span>{lang === 'ar' ? 'الطلاب المقبولون' : 'Active Students'}</span>
            <span style={{
              padding: '1px 6px',
              borderRadius: '6px',
              backgroundColor: activeTab === 'enrolled' ? 'rgba(255,255,255,0.25)' : 'var(--bg-subtle)',
              color: activeTab === 'enrolled' ? '#FFFFFF' : 'var(--primary)',
              fontSize: '11px',
              fontWeight: '900'
            }}>
              {currentEnrolled.length}
            </span>
          </button>

          {/* Tab 2: Pending Join Requests & Invitations */}
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 18px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: activeTab === 'pending' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'pending' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: activeTab === 'pending' ? '0 2px 8px var(--primary-glow)' : 'none'
            }}
          >
            <Clock size={15} />
            <span>{lang === 'ar' ? 'طلبات الانضمام والدعوات' : 'Pending & Invites'}</span>
            <span style={{
              padding: '1px 6px',
              borderRadius: '6px',
              backgroundColor: activeTab === 'pending' ? 'rgba(255,255,255,0.25)' : 'var(--bg-subtle)',
              color: activeTab === 'pending' ? '#FFFFFF' : 'var(--primary)',
              fontSize: '11px',
              fontWeight: '900'
            }}>
              {currentPending.length}
            </span>
          </button>
        </div>

        {/* Search Input Filter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          minWidth: '280px',
          flex: '1 1 280px',
          maxWidth: '460px'
        }}>
          <Search size={15} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'ابحث باسم الطالب أو رقم ولي الأمر...' : 'Search student or parent phone...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '13px',
              color: 'var(--text-primary)',
              width: '100%',
              fontFamily: 'inherit'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'enrolled' ? (
        <RosterTable
          groupId={activeGroup?.id}
          students={filteredEnrolled}
          lang={lang}
          isRtl={isRtl}
        />
      ) : (
        <PendingStudentsTable
          groupId={activeGroup?.id}
          pendingStudents={filteredPending}
          lang={lang}
          isRtl={isRtl}
          onOpenInviteModal={() => setInviteModalOpen(true)}
        />
      )}

      {/* Invite Student Modal */}
      {activeGroup && (
        <InviteStudentModal
          isOpen={inviteModalOpen}
          groupId={activeGroup.id}
          groupName={lang === 'ar' ? activeGroup.nameAr : activeGroup.nameEn}
          lang={lang}
          onClose={() => setInviteModalOpen(false)}
        />
      )}
    </div>
  );
};
