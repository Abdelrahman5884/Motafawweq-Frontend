import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON } from '../../data/mockData';
import { AudioPlayer } from '../../components/audio/AudioPlayer';
import { KnowledgeMapCanvas } from '../../components/knowledge-map/KnowledgeMapCanvas';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  Play, 
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Volume2,
  FileText, 
  Download, 
  Bookmark, 
  BookmarkCheck,
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Send,
  HelpCircle,
  AlertOctagon,
  Settings,
  Maximize2,
  ListOrdered,
  Layers,
  Clock
} from 'lucide-react';

export const StudentLessonView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const lesson = MOCK_LESSON;

  // Media & Study state (US-19, US-20, US-21, US-22, US-23)
  const [mediaMode, setMediaMode] = useState('video'); // 'video' | 'audio' | 'map'
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => {
    const saved = localStorage.getItem(`lesson_time_${lesson.id}`);
    return saved ? parseInt(saved, 10) : 320; // 05:20
  });
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isCompleted, setIsCompleted] = useState(() => {
    return localStorage.getItem(`lesson_completed_${lesson.id}`) === 'true';
  });
  const [isBookmarked, setIsBookmarked] = useState(() => {
    return localStorage.getItem(`lesson_bookmarked_${lesson.id}`) === 'true';
  });

  // Tabs: 'overview' | 'notes' | 'attachments' | 'discussions'
  const [activeTab, setActiveTab] = useState('overview');

  // Notes state (US-27, US-30)
  const [newNoteText, setNewNoteText] = useState('');
  const [notesList, setNotesList] = useState([
    {
      id: 'note-1',
      timestamp: '05:20',
      timeSeconds: 320,
      textAr: 'التفاعلات الضوئية تحدث على أغشية الثيلاكويد حيث يمتص كلوروفيل أ الفوتونات.',
      createdAt: 'اليوم 03:15 م'
    },
    {
      id: 'note-2',
      timestamp: '08:10',
      timeSeconds: 490,
      textAr: 'سؤال امتحان مهم: تجربة فان نيل ببكتيريا الكبريت أثبتت أن الماء هو مصدر الأكسجين وليس CO2!',
      createdAt: 'أمس 06:40 م'
    }
  ]);

  // Discussion / Ask Teacher state (US-90, US-91, US-92, US-93)
  const [newCommentText, setNewCommentText] = useState('');
  const [commentType, setCommentType] = useState('question'); // 'question' | 'comment'
  const [commentsList, setCommentsList] = useState([
    {
      id: 'comm-1',
      authorNameAr: 'عمر طارق (أنت)',
      authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80',
      isTeacher: false,
      textAr: 'يا دكتورة، هل انشطار الماء بيحدث في التفاعلات الضوئية فقط ولا بيستمر في اللاضوئية؟',
      timestamp: '08:10',
      timeAgo: 'منذ ساعتين',
      replies: [
        {
          id: 'rep-1',
          authorNameAr: 'د. سلمى السيد (المعلمة)',
          authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80',
          isTeacher: true,
          textAr: 'أهلاً يا عمر، انشطار الماء الضوئي (Photolysis) يحدث حصراً على أغشية الثيلاكويد أثناء التفاعلات الضوئية بوجود الطاقة الضوئية والكلوروفيل المثار، ولا يحدث إطلاقاً في الستروما.',
          timeAgo: 'منذ ساعة'
        }
      ]
    }
  ]);

  // Report Issue Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Attachments List (US-24, US-25)
  const attachments = [
    { id: 'att-1', nameAr: 'مذكرة شرح البناء الضوئي وحركية الطاقة (PDF ملون)', size: '4.8 MB', pages: '18 صفحة' },
    { id: 'att-2', nameAr: 'مخطط كورنيل التلخيصي للثيلاكويد ودورة كالفن (High Res)', size: '2.1 MB', pages: '3 صفحات' },
    { id: 'att-3', nameAr: 'بنك أسئلة الوزارة ومصائد الثانوية العامة للدرس', size: '3.4 MB', pages: '12 صفحة' }
  ];

  // Save playback time to localStorage (US-23)
  useEffect(() => {
    localStorage.setItem(`lesson_time_${lesson.id}`, currentTime.toString());
  }, [currentTime, lesson.id]);

  // Handle Mark Lesson as Complete (US-26)
  const handleToggleComplete = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    localStorage.setItem(`lesson_completed_${lesson.id}`, nextState ? 'true' : 'false');

    if (nextState) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Handle Bookmark (US-28)
  const handleToggleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    localStorage.setItem(`lesson_bookmarked_${lesson.id}`, next ? 'true' : 'false');
  };

  // Add note (US-27)
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const mins = Math.floor(currentTime / 60).toString().padStart(2, '0');
    const secs = (currentTime % 60).toString().padStart(2, '0');
    const timeFormatted = `${mins}:${secs}`;

    const newNote = {
      id: `note-${Date.now()}`,
      timestamp: timeFormatted,
      timeSeconds: currentTime,
      textAr: newNoteText.trim(),
      createdAt: 'الآن'
    };

    setNotesList([newNote, ...notesList]);
    setNewNoteText('');
  };

  // Add Comment / Question (US-90, US-91)
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const mins = Math.floor(currentTime / 60).toString().padStart(2, '0');
    const secs = (currentTime % 60).toString().padStart(2, '0');

    const newComm = {
      id: `comm-${Date.now()}`,
      authorNameAr: 'عمر طارق (أنت)',
      authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80',
      isTeacher: false,
      textAr: newCommentText.trim(),
      timestamp: `${mins}:${secs}`,
      timeAgo: 'الآن',
      replies: []
    };

    setCommentsList([newComm, ...commentsList]);
    setNewCommentText('');
  };

  // Format seconds into MM:SS
  const formatSecs = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '24px 20px 80px'
    }}>
      {/* Top Breadcrumb & Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/student/dashboard')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            {isRtl ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          </button>

          <div>
            <div style={{ fontSize: '11.5px', color: 'var(--primary)', fontWeight: '800' }}>
              {lesson.subjectAr} • {lesson.gradeAr}
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
              {lesson.titleAr}
            </h1>
          </div>
        </div>

        {/* Action Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Bookmark Button (US-28) */}
          <button
            onClick={handleToggleBookmark}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '12px',
              backgroundColor: isBookmarked ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface)',
              border: '1px solid',
              borderColor: isBookmarked ? '#F59E0B' : 'var(--border-subtle)',
              color: isBookmarked ? '#D97706' : 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            <span>{isBookmarked ? (lang === 'ar' ? 'محفوظ للمراجعة ⭐' : 'Bookmarked') : (lang === 'ar' ? 'حفظ للمراجعة' : 'Bookmark')}</span>
          </button>

          {/* Mark Complete Button (US-26) */}
          <button
            onClick={handleToggleComplete}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '12px',
              backgroundColor: isCompleted ? '#10B981' : 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: isCompleted ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 4px 12px rgba(108, 77, 255, 0.3)'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{isCompleted ? (lang === 'ar' ? 'مكتمل بنجاح (+50 XP)' : 'Completed') : (lang === 'ar' ? 'تسجيل كدرس مكتمل' : 'Mark Complete')}</span>
          </button>

          {/* Report Issue Button (US-94) */}
          <button
            onClick={() => setReportModalOpen(true)}
            title={lang === 'ar' ? 'إبلاغ عن مشكلة في الحصة' : 'Report an issue'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <AlertOctagon size={16} />
          </button>
        </div>
      </div>

      {/* Media Player Container (US-20, US-21, US-22) */}
      <div style={{
        backgroundColor: '#0F172A',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1.5px solid var(--border-medium)',
        marginBottom: '24px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.4)'
      }}>
        {/* Media Switcher Bar: Video vs Audio Mode vs Knowledge Map */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: '#090D16'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setMediaMode('video')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: mediaMode === 'video' ? 'var(--primary)' : 'transparent',
                color: mediaMode === 'video' ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              🎥 {lang === 'ar' ? 'مشغل الفيديو (HD)' : 'Video Mode'}
            </button>

            <button
              onClick={() => setMediaMode('audio')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: mediaMode === 'audio' ? '#06B6D4' : 'transparent',
                color: mediaMode === 'audio' ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              🎧 {lang === 'ar' ? 'وضع الاستماع الصوتي (Podcast)' : 'Audio Mode'}
            </button>

            <button
              onClick={() => setMediaMode('map')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: mediaMode === 'map' ? '#8B5CF6' : 'transparent',
                color: mediaMode === 'map' ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              🧠 {lang === 'ar' ? 'خريطة المفاهيم التفاعلية' : 'Mindmap'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Speed selector (US-22) */}
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="0.75">0.75x</option>
              <option value="1">1.0x (طبيعي)</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="1.75">1.75x</option>
              <option value="2">2.0x (مضاعف)</option>
            </select>
          </div>
        </div>

        {/* Media Viewport */}
        {mediaMode === 'video' && (
          <div style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(280px, 50vw, 500px)',
            backgroundColor: '#000000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&auto=format&fit=crop&q=80"
              alt="Lecture Stream"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
            />

            {/* Simulated Live Blackboard overlay */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: isRtl ? '24px' : 'auto',
              left: isRtl ? 'auto' : '24px',
              backgroundColor: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              padding: '10px 16px',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#38BDF8' }}>
                {lesson.chapters.find(c => currentTime >= c.startSeconds)?.titleAr || lesson.chapters[0].titleAr}
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                المعادلة: 6CO2 + 12H2O + Light ➔ C6H12O6 + 6H2O + 6O2
              </div>
            </div>

            {/* Play / Pause Big Center Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                position: 'absolute',
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(108, 77, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(108, 77, 255, 0.6)',
                color: '#FFFFFF'
              }}
            >
              {isPlaying ? <Pause size={32} fill="#FFFFFF" /> : <Play size={32} fill="#FFFFFF" style={{ marginLeft: isRtl ? 0 : '4px', marginRight: isRtl ? '4px' : 0 }} />}
            </button>

            {/* Video Controls Bar (US-22) */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(9, 13, 22, 0.95)',
              backdropFilter: 'blur(12px)',
              padding: '12px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {/* Progress scrubber */}
              <input
                type="range"
                min="0"
                max={lesson.durationSeconds}
                value={currentTime}
                onChange={(e) => setCurrentTime(parseInt(e.target.value, 10))}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  accentColor: 'var(--primary)'
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#FFFFFF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>

                  <button
                    onClick={() => setCurrentTime(prev => Math.max(0, prev - 10))}
                    title={lang === 'ar' ? 'تأخير 10 ثوانٍ' : 'Rewind 10s'}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11.5px' }}
                  >
                    <Rewind size={16} /> 10s
                  </button>

                  <button
                    onClick={() => setCurrentTime(prev => Math.min(lesson.durationSeconds, prev + 10))}
                    title={lang === 'ar' ? 'تقديم 10 ثوانٍ' : 'Fast forward 10s'}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11.5px' }}
                  >
                    <FastForward size={16} /> 10s
                  </button>

                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#E2E8F0' }}>
                    {formatSecs(currentTime)} / {lesson.durationFormatted}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: '700' }}>
                    ⚡ {playbackSpeed}x
                  </span>
                  <Volume2 size={18} color="#94A3B8" />
                  <Maximize2 size={18} color="#94A3B8" style={{ cursor: 'pointer' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {mediaMode === 'audio' && (
          <div style={{ padding: '32px 24px', backgroundColor: '#090D16' }}>
            <AudioPlayer
              title={lesson.titleAr}
              teacherName={lesson.teacher.nameAr}
              currentTime={currentTime}
              duration={lesson.durationSeconds}
              onSeek={(s) => setCurrentTime(s)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        )}

        {mediaMode === 'map' && (
          <div style={{ height: '420px', width: '100%', backgroundColor: 'var(--bg-app)' }}>
            <KnowledgeMapCanvas
              knowledgeMap={lesson.knowledgeMap}
              onNodeSelect={(node) => {
                if (node.seconds) {
                  setCurrentTime(node.seconds);
                  setMediaMode('video');
                  setIsPlaying(true);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Chapters Quick Jump Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '14px',
        marginBottom: '24px'
      }}>
        {lesson.chapters.map((ch, idx) => {
          const isActive = currentTime >= ch.startSeconds && (idx === lesson.chapters.length - 1 || currentTime < lesson.chapters[idx + 1].startSeconds);
          return (
            <button
              key={ch.id}
              onClick={() => {
                setCurrentTime(ch.startSeconds);
                setIsPlaying(true);
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '14px',
                backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: isActive ? 'var(--primary)' : 'var(--border-subtle)',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{ch.timestamp}</span>
              <span>{ch.titleAr}</span>
            </button>
          );
        })}
      </div>

      {/* Lesson Details & Interactive Work Area Tabs (US-24, US-27, US-30, US-90, US-91) */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: '24px',
        overflow: 'hidden'
      }}>
        {/* Tabs Bar */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 20px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'overview', labelAr: 'ملخص الحصة وأهم النقاط', icon: BookOpen },
            { id: 'notes', labelAr: `ملاحظاتي على الدرس (${notesList.length})`, icon: FileText },
            { id: 'attachments', labelAr: `الملازم والملفات (${attachments.length})`, icon: Download },
            { id: 'discussions', labelAr: `أسئلة ومناقشات الطلاب (${commentsList.length})`, icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 20px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: activeTab === tab.id ? '800' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <tab.icon size={16} />
              <span>{tab.labelAr}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
              {lang === 'ar' ? 'فكرة الحصة ونقاط الفهم الأساسية:' : 'Lecture Overview:'}
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
              {lesson.summary.overviewAr}
            </p>

            {/* Key Definitions Grid */}
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
              {lang === 'ar' ? 'المفاهيم المحورية في البابل شيت:' : 'Key Concepts:'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '28px' }}>
              {lesson.summary.keyDefinitions.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
                    {item.termAr}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {item.defAr}
                  </div>
                </div>
              ))}
            </div>

            {/* Action CTA: Go to Quiz */}
            <div style={{
              backgroundColor: 'rgba(108, 77, 255, 0.08)',
              border: '1.5px solid rgba(108, 77, 255, 0.3)',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--primary)' }}>
                  {lang === 'ar' ? 'هل أنهيت استيعاب الحصة؟ اختبر نفسك الآن!' : 'Finished this lesson? Test your mastery!'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {lang === 'ar' ? 'كويز سريع مكون من 12 سؤالاً بنظام البابل شيت الحديث مع نقاط XP ودوري المتفوقين.' : 'Take a 12-question quiz to lock in your score and earn league XP.'}
                </div>
              </div>

              <button
                onClick={() => navigate('/student/quiz')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(108, 77, 255, 0.35)'
                }}
              >
                <Sparkles size={16} />
                <span>{lang === 'ar' ? 'بدء كويز الحصة' : 'Start Quiz'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Notes (US-27, US-30) */}
        {activeTab === 'notes' && (
          <div style={{ padding: '28px' }}>
            {/* Add Note Form */}
            <form onSubmit={handleAddNote} style={{ marginBottom: '24px' }}>
              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1.5px solid var(--border-medium)',
                borderRadius: '16px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px', color: 'var(--primary)', fontWeight: '800' }}>
                  <Clock size={14} />
                  <span>{lang === 'ar' ? `تسجيل ملاحظة عند التوقيت: ${formatSecs(currentTime)}` : `Note at ${formatSecs(currentTime)}`}</span>
                </div>

                <textarea
                  rows="3"
                  placeholder={lang === 'ar' ? 'اكتب ملاحظتك الخاصة هنا لحفظها مع توقيت الحصة...' : 'Write your private note with timestamp...'}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    resize: 'none'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 18px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {lang === 'ar' ? 'حفظ الملاحظة' : 'Save Note'}
                  </button>
                </div>
              </div>
            </form>

            {/* Notes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notesList.map((note) => (
                <div
                  key={note.id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div>
                    <button
                      onClick={() => {
                        setCurrentTime(note.timeSeconds);
                        setIsPlaying(true);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--primary-surface)',
                        color: 'var(--primary)',
                        border: 'none',
                        fontSize: '11.5px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        marginBottom: '6px'
                      }}
                    >
                      <Play size={10} fill="var(--primary)" />
                      {note.timestamp}
                    </button>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {note.textAr}
                    </p>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {note.createdAt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Attachments & Handouts (US-24, US-25) */}
        {activeTab === 'attachments' && (
          <div style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
              {lang === 'ar' ? 'المذكرات والملفات المرفقة للدرس:' : 'Lesson Attachments & PDFs:'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {attachments.map((file) => (
                <div
                  key={file.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#EF4444'
                    }}>
                      <FileText size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {file.nameAr}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {file.size} • {file.pages}
                      </div>
                    </div>
                  </div>

                  <a
                    href={`#download-${file.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(lang === 'ar' ? `جاري تحميل ملف: ${file.nameAr}` : `Downloading ${file.nameAr}...`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--primary)',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      textDecoration: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={14} />
                    <span>{lang === 'ar' ? 'تحميل الملزمة' : 'Download'}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Discussions & Ask Teacher (US-90, US-91, US-92, US-93) */}
        {activeTab === 'discussions' && (
          <div style={{ padding: '28px' }}>
            {/* New Comment / Question Input */}
            <form onSubmit={handleAddComment} style={{ marginBottom: '28px' }}>
              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1.5px solid var(--border-medium)',
                borderRadius: '16px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'نوع المشاركة:' : 'Type:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCommentType('question')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: commentType === 'question' ? 'var(--primary)' : 'transparent',
                      color: commentType === 'question' ? '#FFFFFF' : 'var(--text-secondary)',
                      border: 'none',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    ❓ {lang === 'ar' ? 'سؤال للمعلم' : 'Ask Teacher'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommentType('comment')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: commentType === 'comment' ? 'var(--primary)' : 'transparent',
                      color: commentType === 'comment' ? '#FFFFFF' : 'var(--text-secondary)',
                      border: 'none',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    💬 {lang === 'ar' ? 'تعليق عام' : 'Comment'}
                  </button>
                </div>

                <textarea
                  rows="3"
                  placeholder={commentType === 'question' ? (lang === 'ar' ? 'اكتب سؤالك بوضوح وسيقوم المعلم بالرد عليك...' : 'Ask the instructor...') : (lang === 'ar' ? 'شارك رأيك أو استفسارك مع زملائك...' : 'Share a thought...')}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    resize: 'none'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    type="submit"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 18px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    <Send size={14} />
                    <span>{lang === 'ar' ? 'إرسال السؤال' : 'Post'}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Comments Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {commentsList.map((comm) => (
                <div
                  key={comm.id}
                  style={{
                    padding: '18px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={comm.authorAvatar}
                        alt={comm.authorNameAr}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {comm.authorNameAr}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {comm.timeAgo} • توقيت: {comm.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p style={{ margin: '0 0 14px 0', fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {comm.textAr}
                  </p>

                  {/* Teacher Replies (US-93) */}
                  {comm.replies && comm.replies.length > 0 && (
                    <div style={{
                      backgroundColor: 'rgba(108, 77, 255, 0.08)',
                      borderRight: isRtl ? '3px solid var(--primary)' : 'none',
                      borderLeft: isRtl ? 'none' : '3px solid var(--primary)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      marginTop: '10px'
                    }}>
                      {comm.replies.map((rep) => (
                        <div key={rep.id}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <img
                              src={rep.authorAvatar}
                              alt={rep.authorNameAr}
                              style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)' }}>
                              {rep.authorNameAr}
                            </span>
                            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                              • {rep.timeAgo}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                            {rep.textAr}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Report Issue Modal (US-94) */}
      {reportModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1.5px solid var(--border-medium)',
            borderRadius: '24px',
            maxWidth: '480px',
            width: '100%',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {lang === 'ar' ? 'الإبلاغ عن مشكلة في الحصة' : 'Report an Issue'}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {lang === 'ar' ? 'هل لاحظت أي خلل في الصوت أو الفيديو أو خطأ في الأسئلة؟ سيقوم فريق الدعم الفني بمراجعته فوراً.' : 'Report video, audio or quiz issues to our technical team.'}
            </p>

            <select style={{ width: '100%', padding: '10px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', marginBottom: '12px', outline: 'none' }}>
              <option>{lang === 'ar' ? 'مشكلة في تشغيل الفيديو أو الصوت' : 'Video/Audio playback issue'}</option>
              <option>{lang === 'ar' ? 'خطأ في صياغة سؤال أو معلومة علمية' : 'Scientific or question error'}</option>
              <option>{lang === 'ar' ? 'الملف المرفق لا يفتح' : 'Attachment won\'t open'}</option>
              <option>{lang === 'ar' ? 'أخرى' : 'Other'}</option>
            </select>

            <textarea
              rows="3"
              placeholder={lang === 'ar' ? 'صف المشكلة بالتفصيل...' : 'Describe the issue...'}
              style={{ width: '100%', padding: '10px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none', resize: 'none', marginBottom: '18px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setReportModalOpen(false)}
                style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  alert(lang === 'ar' ? 'تم استلام بلاغك وسيقوم الدعم بالرد خلال دقائق!' : 'Report submitted!');
                  setReportModalOpen(false);
                }}
                style={{ padding: '8px 20px', borderRadius: '10px', backgroundColor: '#EF4444', border: 'none', color: '#FFFFFF', fontWeight: '800', cursor: 'pointer' }}
              >
                {lang === 'ar' ? 'إرسال البلاغ' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
