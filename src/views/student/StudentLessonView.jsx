import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON } from '../../data/mockData';
import { AudioPlayer } from '../../components/audio/AudioPlayer';
import { KnowledgeMapCanvas } from '../../components/knowledge-map/KnowledgeMapCanvas';
import { 
  BookOpen, 
  Share2, 
  FileText, 
  PenTool, 
  Sparkles, 
  Play, 
  Check, 
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export const StudentLessonView = () => {
  const { navigate } = useAuth();
  const { lang, isRtl } = useLanguage();

  const [viewMode, setViewMode] = useState('transcript'); // 'transcript' | 'map'
  const [currentTime, setCurrentTime] = useState(320); // starts at Light Reactions
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState(lang === 'ar' ? 'ملاحظة مهمة: تجربة فان نيل ببكتيريا الكبريت أثبتت أن الماء هو مصدر الأكسجين وليس CO2!' : 'Important: Van Niel sulfur bacteria proved H2O is the oxygen source!');
  const [notesSaved, setNotesSaved] = useState(false);

  const lesson = MOCK_LESSON;

  const handleJump = (secs) => {
    setCurrentTime(secs);
    setIsPlaying(true);
  };

  const handleSaveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px 80px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => navigate('student-dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            {isRtl ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          </button>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? lesson.titleAr : lesson.title}
            </h1>
            <div style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: '600', marginTop: '2px' }}>
              {lang === 'ar' ? lesson.teacher.nameAr : lesson.teacher.name} • {lesson.durationFormatted}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Switcher between Transcript & Knowledge Map */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setViewMode('transcript')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: viewMode === 'transcript' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'transcript' ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <FileText size={14} />
              <span>{lang === 'ar' ? 'النص المتزامن' : 'Transcript'}</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: viewMode === 'map' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'map' ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Share2 size={14} />
              <span>{lang === 'ar' ? 'خريطة المعرفة' : 'Knowledge Map'}</span>
            </button>
          </div>

          <button
            onClick={() => navigate('take-exam')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#06B6D4',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)'
            }}
          >
            <Sparkles size={14} />
            <span>{lang === 'ar' ? 'بدء الاختبار' : 'Take Exam'}</span>
          </button>
        </div>
      </div>

      {/* Main Study Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Synchronized Audio Player */}
        <AudioPlayer
          currentTime={currentTime}
          duration={lesson.durationSeconds}
          onSeek={setCurrentTime}
          isPlaying={isPlaying}
          onTogglePlay={setIsPlaying}
          activeChapter={lang === 'ar' ? lesson.chapters[1]?.titleAr : lesson.chapters[1]?.title}
        />

        {/* Dynamic Study Surface: Transcript or Knowledge Map */}
        {viewMode === 'transcript' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {/* Transcript Panel */}
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              maxHeight: '520px',
              overflowY: 'auto'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '14px' }}>
                {lang === 'ar' ? 'اضغط على أي جملة للقفز للحظة الشرح فوراً 🎧' : 'Click any sentence to jump straight to audio 🎧'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lesson.transcript.map(tr => {
                  const isActive = currentTime >= tr.startSeconds && currentTime < tr.startSeconds + 180;
                  return (
                    <div
                      key={tr.id}
                      onClick={() => handleJump(tr.startSeconds)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isActive ? 'var(--primary-surface)' : 'transparent',
                        border: isActive ? '1px solid var(--primary-light)' : '1px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: '700',
                          fontFamily: 'var(--font-mono)',
                          color: isActive ? 'var(--primary)' : 'var(--text-muted)'
                        }}>
                          [{tr.timestamp}]
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                          {tr.speaker}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '13.5px',
                        lineHeight: 1.6,
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontWeight: isActive ? '600' : '400'
                      }}>
                        {lang === 'ar' ? tr.textAr : tr.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Personal Study Notes Drawer */}
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <PenTool size={16} color="var(--primary)" />
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                    {lang === 'ar' ? 'ملاحظاتي وتلخيصاتي الشخصية' : 'My Personal Study Notes'}
                  </h3>
                </div>
                <button
                  onClick={handleSaveNotes}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: notesSaved ? '#10B981' : 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <Check size={12} />
                  <span>{notesSaved ? (lang === 'ar' ? 'تم الحفظ!' : 'Saved!') : (lang === 'ar' ? 'حفظ' : 'Save')}</span>
                </button>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={lang === 'ar' ? 'اكتب ملاحظاتك أثناء سماع الحصة...' : 'Jot down notes while listening...'}
                style={{
                  flex: 1,
                  width: '100%',
                  minHeight: '280px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '14px',
                  fontSize: '13.5px',
                  lineHeight: 1.6,
                  color: 'var(--text-primary)',
                  resize: 'none',
                  fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-latin)',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        ) : (
          /* Knowledge Map Canvas */
          <KnowledgeMapCanvas
            knowledgeMap={lesson.knowledgeMap}
            onJumpToTimestamp={handleJump}
            onPracticeQuiz={() => navigate('take-exam')}
          />
        )}
      </div>
    </div>
  );
};
