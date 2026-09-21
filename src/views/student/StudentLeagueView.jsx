import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ALL_LEAGUES } from '../../data/leagueData';
import { LEAGUE_TIERS } from '../../data/studentData';
import { 
  ClipboardList, 
  HelpCircle, 
  Gift, 
  Trophy, 
  GraduationCap, 
  BookOpen, 
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import {
  LeagueHeroBanner,
  LeaguePodium,
  LeagueLeaderboardTable,
  LeagueRulesTab,
  LeaguePrizesTab,
  StudentAchievementModal
} from '../../features/student/league';

export const StudentLeagueView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();

  // League category: 'general' (وزارة التربية والتعليم) or 'teachers' (دوريات المدرسين)
  const [leagueCategory, setLeagueCategory] = useState('general');
  const [selectedLeagueId, setSelectedLeagueId] = useState('general-bio');
  const [selectedTier, setSelectedTier] = useState('Diamond');
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'rules' | 'prizes'
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Available leagues in current category
  const categoryLeagues = ALL_LEAGUES.filter(l => l.category === leagueCategory);

  // Currently active league object
  const activeLeague = ALL_LEAGUES.find(l => l.id === selectedLeagueId) || categoryLeagues[0] || ALL_LEAGUES[0];

  // Students of current league
  const leagueStudents = activeLeague.students || [];

  // Filter students by selected tier if tier exists, or fallback to all
  const filteredStudents = leagueStudents.filter(s => !selectedTier || s.tier === selectedTier);
  const displayStudents = filteredStudents.length > 0 ? filteredStudents : leagueStudents;

  // Top 3 for podium
  const top1 = leagueStudents.find(s => s.rank === 1) || leagueStudents[0];
  const top2 = leagueStudents.find(s => s.rank === 2) || leagueStudents[1];
  const top3 = leagueStudents.find(s => s.rank === 3) || leagueStudents[2];

  // Handler for category switch
  const handleCategorySwitch = (category) => {
    setLeagueCategory(category);
    const firstInCat = ALL_LEAGUES.find(l => l.category === category);
    if (firstInCat) {
      setSelectedLeagueId(firstInCat.id);
    }
  };

  return (
    <div style={{
      maxWidth: '1140px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: 'var(--font-arabic, sans-serif)',
      color: 'var(--text-primary)'
    }}>
      {/* 1. Header Navigation & Quick Link to Gamification / Achievements */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <div>
          <h1 style={{
            fontSize: '22px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 4px 0'
          }}>
            {lang === 'ar' ? 'دوريات المتفوقين' : 'Student Leagues'}
          </h1>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            {lang === 'ar' 
              ? 'تنافس على مستوى الجمهورية في دوريات المواد الوزارية ودوريات كورسات المعلمين' 
              : 'Compete in national curriculum leagues and teacher course leagues'}
          </p>
        </div>

        {/* Direct Link to Achievements Page */}
        <button
          onClick={() => navigate('/student/gamification')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.color = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
        >
          <Trophy size={16} color="var(--primary)" />
          <span>{lang === 'ar' ? 'لوحة إنجازاتي وجوائزي' : 'My Achievements'}</span>
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* 2. Unified League Switcher Box */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px',
        padding: '16px 20px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        {/* Main Category Selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '14px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginInlineEnd: '4px' }}>
            نوع الدوري:
          </span>

          {/* Ministry General Subject Leagues */}
          <button
            onClick={() => handleCategorySwitch('general')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '12px',
              border: '1.5px solid',
              borderColor: leagueCategory === 'general' ? 'var(--primary)' : 'transparent',
              backgroundColor: leagueCategory === 'general' ? 'rgba(21, 136, 199, 0.08)' : 'var(--bg-subtle)',
              color: leagueCategory === 'general' ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <GraduationCap size={16} />
            <span>دوريات المواد العامة (التربية والتعليم)</span>
          </button>

          {/* Teacher Course Leagues */}
          <button
            onClick={() => handleCategorySwitch('teachers')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '12px',
              border: '1.5px solid',
              borderColor: leagueCategory === 'teachers' ? 'var(--primary)' : 'transparent',
              backgroundColor: leagueCategory === 'teachers' ? 'rgba(21, 136, 199, 0.08)' : 'var(--bg-subtle)',
              color: leagueCategory === 'teachers' ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <BookOpen size={16} />
            <span>دوريات كورسات المعلمين</span>
          </button>
        </div>

        {/* Sub-leagues Pills - NO EMOJIS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginInlineEnd: '4px' }}>
            اختر الدوري:
          </span>

          {categoryLeagues.map((lg) => {
            const isSelected = lg.id === selectedLeagueId;
            return (
              <button
                key={lg.id}
                onClick={() => setSelectedLeagueId(lg.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: isSelected ? '800' : '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{lg.nameAr}</span>
                {lg.myRank && (
                  <span style={{
                    fontSize: '10.5px',
                    padding: '1px 6px',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.22)' : 'rgba(21, 136, 199, 0.12)',
                    color: isSelected ? '#FFFFFF' : 'var(--primary)',
                    fontWeight: '700'
                  }}>
                    #{lg.myRank}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Hero & League Status Banner with Dynamic activeLeague */}
      <LeagueHeroBanner
        lang={lang}
        isRtl={isRtl}
        activeLeague={activeLeague}
        onGoToAchievements={() => navigate('/student/gamification')}
        onStartQuiz={() => navigate('/student/quiz')}
        onStartExam={() => navigate('/student/exam')}
      />

      {/* 4. Top 3 Podium with onSelectStudent handler */}
      <LeaguePodium 
        top1={top1} 
        top2={top2} 
        top3={top3} 
        lang={lang} 
        leagueBadge={activeLeague.badge}
        onSelectStudent={(student) => setSelectedStudent(student)}
      />

      {/* 5. Navigation Tabs & Tier Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '16px'
      }}>
        {/* Tier switcher */}
        <div style={{
          display: 'inline-flex',
          backgroundColor: 'var(--bg-surface)',
          padding: '3px',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)'
        }}>
          {LEAGUE_TIERS.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              style={{
                padding: '7px 14px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: selectedTier === tier.id ? 'var(--primary)' : 'transparent',
                color: selectedTier === tier.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tier.nameAr}
            </button>
          ))}
        </div>

        {/* View Mode Tabs */}
        <div style={{
          display: 'inline-flex',
          backgroundColor: 'var(--bg-surface)',
          padding: '3px',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('leaderboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'leaderboard' ? 'var(--bg-subtle)' : 'transparent',
              color: activeTab === 'leaderboard' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <ClipboardList size={14} />
            <span>{lang === 'ar' ? 'جدول الترتيب' : 'Leaderboard'}</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'rules' ? 'var(--bg-subtle)' : 'transparent',
              color: activeTab === 'rules' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <HelpCircle size={14} />
            <span>{lang === 'ar' ? 'قواعد النقاط' : 'Rules'}</span>
          </button>

          <button
            onClick={() => setActiveTab('prizes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'prizes' ? 'var(--bg-subtle)' : 'transparent',
              color: activeTab === 'prizes' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Gift size={14} />
            <span>{lang === 'ar' ? 'جوائز الدوري' : 'Prizes'}</span>
          </button>
        </div>
      </div>

      {/* 6. Tab Contents */}
      {activeTab === 'leaderboard' && (
        <LeagueLeaderboardTable 
          students={displayStudents} 
          lang={lang} 
          isRtl={isRtl} 
          onSelectStudent={(student) => setSelectedStudent(student)}
        />
      )}

      {activeTab === 'rules' && (
        <LeagueRulesTab lang={lang} />
      )}

      {activeTab === 'prizes' && (
        <LeaguePrizesTab lang={lang} />
      )}

      {/* 7. Student Achievement Modal */}
      {selectedStudent && (
        <StudentAchievementModal
          student={selectedStudent}
          leagueTitle={activeLeague.titleAr}
          onClose={() => setSelectedStudent(null)}
          lang={lang}
        />
      )}
    </div>
  );
};
