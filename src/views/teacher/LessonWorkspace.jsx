import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON } from '../../data/mockData';
import { KnowledgeMapCanvas } from '../../components/knowledge-map/KnowledgeMapCanvas';
import { 
  Share2, 
  FileText, 
  Brain, 
  HelpCircle, 
  Layers
} from 'lucide-react';
import {
  WorkspaceHeader,
  WorkspaceOverviewTab,
  WorkspaceTranscriptTab,
  WorkspaceSummaryTab,
  WorkspaceQuizTab
} from '../../features/teacher/lesson-workspace';

export const LessonWorkspace = () => {
  const { navigate, switchRole } = useAuth();
  const { lang, isRtl } = useLanguage();

  const [activeTab, setActiveTab] = useState('map'); // 'overview' | 'map' | 'transcript' | 'summary' | 'quiz'
  const [currentTime, setCurrentTime] = useState(320); // starts at Chapter 2 (05:20)
  const [isPlaying, setIsPlaying] = useState(false);

  const lesson = MOCK_LESSON;

  // Jump to specific audio seconds
  const handleJumpToTimestamp = (seconds) => {
    setCurrentTime(seconds);
    setIsPlaying(true);
  };

  const handlePracticeQuiz = () => {
    setActiveTab('quiz');
  };

  const tabs = [
    { id: 'overview', label: lang === 'ar' ? 'نظرة عامة' : 'Overview', icon: Layers },
    { id: 'map', label: lang === 'ar' ? 'خريطة المعرفة التفاعلية' : 'Knowledge Map', icon: Share2, badge: '14 Nodes' },
    { id: 'transcript', label: lang === 'ar' ? 'التفريغ الصوتي المتزامن' : 'Synced Transcript', icon: FileText },
    { id: 'summary', label: lang === 'ar' ? 'ملخص كورنيل والمعادلات' : 'Cornell Summary', icon: Brain },
    { id: 'quiz', label: lang === 'ar' ? 'بنك الأسئلة والاختبار' : 'Adaptive Quizzes', icon: HelpCircle, badge: '12 Qs' }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px 80px'
    }}>
      {/* Lesson Header Banner */}
      <WorkspaceHeader
        lesson={lesson}
        lang={lang}
        isRtl={isRtl}
        onTakeExamAsStudent={() => {
          switchRole('student');
          navigate('take-exam');
        }}
      />

      {/* Navigation Tabs Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border-medium)',
        marginBottom: '24px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: isActive ? 'var(--primary-surface)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <TabIcon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: isActive ? '#FFFFFF' : 'var(--text-muted)'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <WorkspaceOverviewTab
          lesson={lesson}
          lang={lang}
          onJumpToChapter={(secs) => {
            handleJumpToTimestamp(secs);
            setActiveTab('transcript');
          }}
        />
      )}

      {/* TAB 2: KNOWLEDGE MAP CANVAS */}
      {activeTab === 'map' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <span>{lang === 'ar' ? '💡 يمكنك سحب العقد وتحريكها بالماوس، أو تكبير وتصغير الخريطة، والضغط على أي مفهوم لسماع شرحه.' : '💡 Drag nodes to rearrange, zoom in/out, or click any concept to inspect and jump directly to its audio.'}</span>
          </div>

          <KnowledgeMapCanvas
            knowledgeMap={lesson.knowledgeMap}
            onJumpToTimestamp={(secs) => {
              handleJumpToTimestamp(secs);
              setActiveTab('transcript');
            }}
            onPracticeQuiz={handlePracticeQuiz}
          />
        </div>
      )}

      {/* TAB 3: TRANSCRIPT & AUDIO PLAYER */}
      {activeTab === 'transcript' && (
        <WorkspaceTranscriptTab
          lesson={lesson}
          currentTime={currentTime}
          isPlaying={isPlaying}
          lang={lang}
          onSeek={setCurrentTime}
          onTogglePlay={setIsPlaying}
          onJumpToTimestamp={handleJumpToTimestamp}
        />
      )}

      {/* TAB 4: CORNELL SUMMARY */}
      {activeTab === 'summary' && (
        <WorkspaceSummaryTab
          lesson={lesson}
          lang={lang}
          isRtl={isRtl}
        />
      )}

      {/* TAB 5: QUIZ GENERATOR */}
      {activeTab === 'quiz' && (
        <WorkspaceQuizTab
          lesson={lesson}
          lang={lang}
          onJumpToTimestamp={(secs) => {
            handleJumpToTimestamp(secs);
            setActiveTab('transcript');
          }}
        />
      )}
    </div>
  );
};
