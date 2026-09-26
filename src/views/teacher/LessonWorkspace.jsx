import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ALL_PUBLISHED_LESSONS, MOCK_LESSON } from '../../data/mockData';
import { NotebookMindMapCanvas } from '../../components/knowledge-map/NotebookMindMapCanvas';
import { 
  Video, 
  Mic, 
  FileText, 
  Share2, 
  Layers, 
  Play, 
  Pause, 
  RotateCcw, 
  Search, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft,
  Volume2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink,
  Sparkles,
  Calendar
} from 'lucide-react';

export const LessonWorkspace = () => {
  const { navigate, switchRole } = useAuth();
  const { lang, isRtl } = useLanguage();

  const lessons = ALL_PUBLISHED_LESSONS || [MOCK_LESSON];

  // Currently selected lesson (defaults to first lesson)
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0]?.id || 'les-bio-301');

  // Active view: 'overview' | 'media' | 'text' | 'graph'
  const [activeTab, setActiveTab] = useState('overview');

  // Search filter for lessons list in overview
  const [lessonSearch, setLessonSearch] = useState('');
  const [mediaFilter, setMediaFilter] = useState('all'); // 'all' | 'video' | 'audio'

  // Transcript search in Text tab
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  // Audio / Video player playback simulation
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Active selected lesson object
  const currentLesson = useMemo(() => {
    return lessons.find(l => l.id === selectedLessonId) || lessons[0];
  }, [lessons, selectedLessonId]);

  // Jump to specific audio seconds
  const handleJumpToTimestamp = (seconds) => {
    setCurrentTime(seconds);
    setIsPlaying(true);
  };

  const handleOpenLesson = (lessonId, targetTab = 'media') => {
    setSelectedLessonId(lessonId);
    setActiveTab(targetTab);
    setCurrentTime(0);
    setIsPlaying(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter lessons for Overview tab
  const filteredLessons = useMemo(() => {
    return lessons.filter(l => {
      const matchQuery = !lessonSearch || 
        l.titleAr.includes(lessonSearch) || 
        l.title.toLowerCase().includes(lessonSearch.toLowerCase()) ||
        l.subjectAr.includes(lessonSearch);
      const matchMedia = mediaFilter === 'all' || l.mediaType === mediaFilter;
      return matchQuery && matchMedia;
    });
  }, [lessons, lessonSearch, mediaFilter]);

  // Copy full transcript text
  const handleCopyTranscript = () => {
    if (!currentLesson.transcript) return;
    const fullText = currentLesson.transcript
      .map(t => `[${t.timestamp}] ${t.speaker || 'المعلم'}: ${t.textAr || t.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    });
  };

  // 4 Top Navigation Tabs
  const navTabs = [
    { id: 'overview', label: lang === 'ar' ? 'نظرة عامة (كل الحصص)' : 'Overview (All Lessons)', icon: Layers, count: lessons.length },
    { 
      id: 'media', 
      label: currentLesson.mediaType === 'video' 
        ? (lang === 'ar' ? 'فيديو الحصة' : 'Lesson Video') 
        : (lang === 'ar' ? 'تسجيل الحصة الصوتي' : 'Audio Player'), 
      icon: currentLesson.mediaType === 'video' ? Video : Mic,
      disabled: false 
    },
    { id: 'text', label: lang === 'ar' ? 'النص المفرغ (Speech-to-Text)' : 'Text Transcript', icon: FileText, disabled: false },
    { id: 'graph', label: lang === 'ar' ? 'خريطة المفاهيم (NotebookLM)' : 'Concept Graph', icon: Share2, badge: 'NotebookLM' }
  ];

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '32px 24px 80px',
      fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
    }}>
      {/* Top Banner & Header */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '3px 10px',
                borderRadius: '6px',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                textTransform: 'uppercase'
              }}>
                {currentLesson.subjectAr}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {currentLesson.gradeAr} • {currentLesson.durationFormatted}
              </span>
              {currentLesson.mediaType === 'video' ? (
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                  🎥 فيديو تفاعلي
                </span>
              ) : (
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                  🎙️ تسجيل صوتي
                </span>
              )}
            </div>

            <h1 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              lineHeight: 1.3
            }}>
              {lang === 'ar' ? currentLesson.titleAr : currentLesson.title}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              {currentLesson.unitAr}
            </p>
          </div>

          {/* Action: Switch to student exam */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                switchRole('student');
                navigate('take-exam');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(21, 136, 199, 0.3)'
              }}
            >
              <Play size={14} fill="#FFFFFF" />
              <span>{lang === 'ar' ? 'تجربة الامتحان كطالب' : 'Take Exam as Student'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar: Overview + The 3 Core Modes (Video/Audio, Text, Graph) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border-medium)',
        marginBottom: '28px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {navTabs.map(tab => {
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
                padding: '11px 20px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: isActive ? 'var(--primary-surface)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? '800' : '600',
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <TabIcon size={16} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '1px 7px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: isActive ? '#FFFFFF' : 'var(--text-muted)'
                }}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '2px 7px',
                  borderRadius: '6px',
                  backgroundColor: isActive ? 'var(--primary)' : 'rgba(56, 189, 248, 0.15)',
                  color: isActive ? '#FFFFFF' : '#0284C7'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW (ALL LESSONS & KPI SUMMARY)
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* KPI Summary Card: ONLY Total Lessons Count & Core Totals */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '22px 24px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'عدد الحصص الموجودة' : 'Total Published Lessons'}
              </div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary)', marginTop: '4px' }}>
                {lessons.length} {lang === 'ar' ? 'حصص' : 'Lessons'}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {lang === 'ar' ? 'مفهرسة بالذكاء الاصطناعي وجاهزة للطلاب' : 'Fully AI-indexed and ready'}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '22px 24px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'إجمالي ساعات الشرح' : 'Total Lecture Hours'}
              </div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--success)', marginTop: '4px' }}>
                3.8 {lang === 'ar' ? 'ساعات' : 'Hours'}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {lang === 'ar' ? 'تفريغ صوتي متزامن بالثواني' : 'Synced transcripts & timestamps'}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '22px 24px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'حصص الفيديو والتسجيلات' : 'Media Distribution'}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '6px' }}>
                {lessons.filter(l => l.mediaType === 'video').length} فيديو • {lessons.filter(l => l.mediaType === 'audio').length} صوت
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {lang === 'ar' ? 'مدعومة بالخرائط الذهنية التفاعلية' : 'With NotebookLM Mind Maps'}
              </div>
            </div>
          </div>

          {/* Filter Bar & All Lessons Grid */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* Header & Search */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '20px'
            }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                  {lang === 'ar' ? 'قائمة الحصص والمحاضرات المسجلة' : 'Published Lessons Directory'}
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
                  {lang === 'ar' ? 'اضغط على أي حصة لفتحها واستعراض الفيديو أو التفريغ النصي أو خريطة المفاهيم (NotebookLM)' : 'Click any lesson to view video/audio, transcript text, or NotebookLM graph'}
                </p>
              </div>

              {/* Search & Media filter pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  padding: '6px 12px'
                }}>
                  <Search size={14} color="var(--text-secondary)" />
                  <input
                    type="text"
                    value={lessonSearch}
                    onChange={(e) => setLessonSearch(e.target.value)}
                    placeholder={lang === 'ar' ? 'بحث في الحصص...' : 'Search lessons...'}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '12.5px',
                      color: 'var(--text-primary)',
                      width: '160px',
                      fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '10px',
                  padding: '3px',
                  gap: '3px'
                }}>
                  {[
                    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                    { id: 'video', labelAr: 'فيديو', labelEn: 'Video' },
                    { id: 'audio', labelAr: 'صوت', labelEn: 'Audio' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setMediaFilter(tab.id)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '7px',
                        border: 'none',
                        backgroundColor: mediaFilter === tab.id ? 'var(--primary)' : 'transparent',
                        color: mediaFilter === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {lang === 'ar' ? tab.labelAr : tab.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Lessons List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredLessons.map((l) => {
                const isCurrent = l.id === selectedLessonId;
                return (
                  <div
                    key={l.id}
                    onClick={() => handleOpenLesson(l.id, 'media')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      backgroundColor: isCurrent ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                      border: `1.5px solid ${isCurrent ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      gap: '16px',
                      flexWrap: 'wrap'
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrent) e.currentTarget.style.borderColor = 'var(--border-medium)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrent) e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    {/* Left: Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: l.mediaType === 'video' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                        color: l.mediaType === 'video' ? '#EF4444' : '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {l.mediaType === 'video' ? <Video size={22} /> : <Mic size={22} />}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-surface-elevated)',
                            color: 'var(--text-secondary)'
                          }}>
                            {l.subjectAr}
                          </span>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            {l.gradeAr}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />
                            <span>{l.durationFormatted}</span>
                          </span>
                        </div>

                        <div style={{
                          fontSize: '15px',
                          fontWeight: '800',
                          color: 'var(--text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {lang === 'ar' ? l.titleAr : l.title}
                        </div>
                      </div>
                    </div>

                    {/* Right: Badges & Open Action */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenLesson(l.id, 'graph');
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(56, 189, 248, 0.1)',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          color: '#0284C7',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        <Share2 size={13} />
                        <span>{lang === 'ar' ? 'خريطة المفاهيم' : 'Mind Map'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenLesson(l.id, 'text');
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        <FileText size={13} />
                        <span>{lang === 'ar' ? 'النص المفرغ' : 'Text'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenLesson(l.id, 'media');
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 18px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '12.5px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(21, 136, 199, 0.25)'
                        }}
                      >
                        <span>{lang === 'ar' ? 'فتح الحصة' : 'Open Lesson'}</span>
                        <ArrowLeft size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: MEDIA PLAYER (VIDEO OR AUDIO ONLY)
          ========================================================================= */}
      {activeTab === 'media' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Subbar: Back to Overview */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <ArrowRight size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
              <span>{lang === 'ar' ? 'العودة لقائمة الحصص' : 'Back to Lessons List'}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('text')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <FileText size={14} />
                <span>{lang === 'ar' ? 'عرض النص المفرغ' : 'View Text Transcript'}</span>
              </button>
              <button
                onClick={() => setActiveTab('graph')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Share2 size={14} />
                <span>{lang === 'ar' ? 'عرض خريطة NotebookLM' : 'View NotebookLM Graph'}</span>
              </button>
            </div>
          </div>

          {/* Media Player Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {currentLesson.mediaType === 'video' ? (
              <div>
                {/* 16:9 Video Embed Player */}
                <div style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: '16px',
                  backgroundColor: '#000000',
                  boxShadow: 'var(--shadow-md)',
                  marginBottom: '20px'
                }}>
                  <iframe
                    src={
                      currentLesson.videoUrl?.includes('youtube.com/watch?v=')
                        ? currentLesson.videoUrl.replace('watch?v=', 'embed/')
                        : currentLesson.videoUrl?.includes('youtu.be/')
                          ? currentLesson.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/')
                          : 'https://www.youtube.com/embed/sQK3Yr4Sc_k'
                    }
                    title={currentLesson.titleAr}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Video Chapters bar */}
                {currentLesson.chapters && currentLesson.chapters.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
                      {lang === 'ar' ? 'فصول الحصة والتوقيتات الزمنية:' : 'Lesson Milestones & Chapters:'}
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                      {currentLesson.chapters.map(ch => (
                        <div
                          key={ch.id}
                          onClick={() => handleJumpToTimestamp(ch.startSeconds)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            backgroundColor: 'var(--bg-subtle)',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                            {lang === 'ar' ? ch.titleAr : ch.title}
                          </span>
                          <span style={{
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--primary)',
                            padding: '2px 6px',
                            backgroundColor: 'var(--primary-surface)',
                            borderRadius: '4px',
                            fontWeight: '700'
                          }}>
                            {ch.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Audio Only Player */
              <div style={{ textAlign: 'center', padding: '30px 16px' }}>
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Volume2 size={36} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {lang === 'ar' ? currentLesson.titleAr : currentLesson.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  {lang === 'ar' ? 'تسجيل صوتي بجودة استوديو وتصفية متقدمة للضوضاء' : 'Studio audio recording with classroom noise suppression'}
                </p>

                {/* Animated Waveform Visualizer */}
                <div style={{
                  height: '70px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  marginBottom: '24px',
                  padding: '0 20px'
                }}>
                  {Array.from({ length: 48 }).map((_, idx) => {
                    const height = isPlaying
                      ? Math.max(10, Math.sin(idx * 0.4 + currentTime * 2) * 50 + 20)
                      : 14;
                    return (
                      <div
                        key={idx}
                        style={{
                          width: '4px',
                          height: `${height}px`,
                          borderRadius: '3px',
                          backgroundColor: isPlaying ? 'var(--primary)' : 'var(--border-subtle)',
                          transition: 'height 0.12s ease'
                        }}
                      />
                    );
                  })}
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 6px 18px rgba(21, 136, 199, 0.4)'
                    }}
                  >
                    {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ transform: 'translateX(1px)' }} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: SPEECH-TO-TEXT TRANSCRIPT (TEXT ONLY)
          ========================================================================= */}
      {activeTab === 'text' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Bar for Text */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <ArrowRight size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
              <span>{lang === 'ar' ? 'العودة لقائمة الحصص' : 'Back to Lessons List'}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Search Inside Transcript */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '6px 12px'
              }}>
                <Search size={14} color="var(--text-secondary)" />
                <input
                  type="text"
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  placeholder={lang === 'ar' ? 'بحث في النص المفرغ...' : 'Search transcript...'}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '12.5px',
                    color: 'var(--text-primary)',
                    width: '180px',
                    fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
                  }}
                />
              </div>

              {/* Copy Full Text */}
              <button
                type="button"
                onClick={handleCopyTranscript}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {copiedText ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                <span>{copiedText ? (lang === 'ar' ? 'تم نسخ النص!' : 'Copied!') : (lang === 'ar' ? 'نسخ النص كاملاً' : 'Copy All')}</span>
              </button>
            </div>
          </div>

          {/* Transcript Content Box */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                  {lang === 'ar' ? 'التفريغ الصوتي الدقيق للحصة (Speech-to-Text)' : 'Accurate Speech-to-Text Transcript'}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'مفهرس بالثواني ومقسم بالفقرات مع تمييز المصطلحات العلمية' : 'Timestamp indexed and segmented with terminology recognition'}
                </span>
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981'
              }}>
                ASR Whisper AI
              </span>
            </div>

            {/* Paragraphs List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(currentLesson.transcript || []).map((seg) => {
                const text = lang === 'ar' ? (seg.textAr || seg.text) : (seg.text || seg.textAr);
                const isMatch = transcriptSearch && text.toLowerCase().includes(transcriptSearch.toLowerCase());

                return (
                  <div
                    key={seg.id}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      backgroundColor: isMatch ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-subtle)',
                      border: `1px solid ${isMatch ? '#F59E0B' : 'var(--border-subtle)'}`,
                      lineHeight: 1.7,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px'
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)' }}>
                        {seg.speaker || 'د. سلمى السيد'}
                      </span>
                      <button
                        onClick={() => {
                          handleJumpToTimestamp(seg.startSeconds);
                          setActiveTab('media');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--primary-surface)',
                          border: 'none',
                          color: 'var(--primary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                        title={lang === 'ar' ? 'الاستماع لهذا المقطع في المشغل' : 'Jump to this timestamp'}
                      >
                        <Play size={10} fill="var(--primary)" />
                        <span>{seg.timestamp}</span>
                      </button>
                    </div>

                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-line'
                    }}>
                      {text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: GRAPH - NOTEBOOKLM HIERARCHICAL MIND MAP
          ========================================================================= */}
      {activeTab === 'graph' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Subbar: Back to Overview & Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <ArrowRight size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
              <span>{lang === 'ar' ? 'العودة لقائمة الحصص' : 'Back to Lessons List'}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontSize: '11.5px',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Sparkles size={14} color="#38BDF8" />
                <span>{lang === 'ar' ? 'خريطة مفاهيم تفاعلية مطابقة لـ Google NotebookLM' : 'Google NotebookLM-style Concept Tree'}</span>
              </span>
            </div>
          </div>

          {/* NotebookLM Mind Map Canvas Component */}
          <NotebookMindMapCanvas
            treeData={currentLesson.notebookMindMap || MOCK_LESSON.notebookMindMap}
            onJumpToTimestamp={(secs) => {
              handleJumpToTimestamp(secs);
              setActiveTab('media');
            }}
            lang={lang}
            isRtl={isRtl}
          />
        </div>
      )}
    </div>
  );
};
export default LessonWorkspace;
