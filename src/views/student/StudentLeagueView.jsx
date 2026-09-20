import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LEAGUE_LEADERBOARD, LEAGUE_TIERS } from '../../data/studentData';
import { ClipboardList, HelpCircle, Gift } from 'lucide-react';
import {
  LeagueHeroBanner,
  LeaguePodium,
  LeagueLeaderboardTable,
  LeagueRulesTab,
  LeaguePrizesTab
} from '../../features/student/league';

export const StudentLeagueView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const [selectedTier, setSelectedTier] = useState('Diamond');
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'rules' | 'prizes'

  // Filter students by selected tier
  const filteredStudents = LEAGUE_LEADERBOARD.filter(s => s.tier === selectedTier);

  // Top 3 for podium
  const top1 = LEAGUE_LEADERBOARD.find(s => s.rank === 1);
  const top2 = LEAGUE_LEADERBOARD.find(s => s.rank === 2);
  const top3 = LEAGUE_LEADERBOARD.find(s => s.rank === 3);

  return (
    <div style={{
      maxWidth: '1140px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: 'var(--font-arabic, sans-serif)',
      color: 'var(--text-primary)'
    }}>
      {/* Hero & League Status Banner */}
      <LeagueHeroBanner
        lang={lang}
        isRtl={isRtl}
        onStartQuiz={() => navigate('/student/quiz')}
        onStartExam={() => navigate('/student/exam')}
      />

      {/* Top 3 Podium */}
      <LeaguePodium top1={top1} top2={top2} top3={top3} lang={lang} />

      {/* Navigation Tabs & Tier Selector */}
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

      {/* Tab Contents */}
      {activeTab === 'leaderboard' && (
        <LeagueLeaderboardTable students={filteredStudents} lang={lang} isRtl={isRtl} />
      )}

      {activeTab === 'rules' && (
        <LeagueRulesTab lang={lang} />
      )}

      {activeTab === 'prizes' && (
        <LeaguePrizesTab lang={lang} />
      )}
    </div>
  );
};
