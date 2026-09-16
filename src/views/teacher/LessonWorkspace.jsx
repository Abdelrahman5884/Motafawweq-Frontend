import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON } from '../../data/mockData';
import { AudioPlayer } from '../../components/audio/AudioPlayer';
import { KnowledgeMapCanvas } from '../../components/knowledge-map/KnowledgeMapCanvas';
import { 
  Sparkles, 
  Share2, 
  FileText, 
  Brain, 
  HelpCircle, 
  Layers, 
  Clock, 
  Users, 
  Award, 
  CheckCircle2, 
  Play, 
  ArrowRight,
  BookOpen,
  Send,
  Plus,
  Edit3
} from 'lucide-react';

export const LessonWorkspace = () => {
  const { navigate, switchRole } = useAuth();
  const { lang, isRtl } = useLanguage();

  const [activeTab, setActiveTab] = useState('map'); // 'overview' | 'map' | 'transcript' | 'summary' | 'quiz'
  const [currentTime, setCurrentTime] = useState(320); // starts at Chapter 2 (05:20)
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState('q-1');

  const lesson = MOCK_LESSON;

  // Jump to specific audio seconds
  const handleJumpToTimestamp = (seconds) => {
    setCurrentTime(seconds);
    setIsPlaying(true);
    // Switch to transcript tab if wanted, or stay on map
  };

  const handlePracticeQuiz = (conceptId) => {
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
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              border: '1px solid var(--primary-light)'
            }}>
              {lang === 'ar' ? lesson.subjectAr : lesson.subject}
            </span>

            <span style={{
              fontSize: '11px',
              fontWeight: '600',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)'
            }}>
              {lang === 'ar' ? lesson.gradeAr : lesson.grade}
            </span>

            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              • {lesson.durationFormatted} ({lang === 'ar' ? 'تفريغ كامل' : 'Full Transcript'})
            </span>
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
          }}>
            {lang === 'ar' ? lesson.titleAr : lesson.title}
          </h1>

          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? lesson.unitAr : lesson.unit}
          </div>
        </div>

        {/* Quick Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              switchRole('student');
              navigate('take-exam');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(108, 77, 255, 0.35)'
            }}
          >
            <Play size={14} fill="#FFFFFF" />
            <span>{lang === 'ar' ? 'تجربة الامتحان كطالب' : 'Take Exam as Student'}</span>
          </button>
        </div>
      </div>

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

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Key Metrics Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px'
          }}>
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'المفاهيم المستخرجة' : 'Concepts Extracted'}</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary)', marginTop: '4px' }}>{lesson.stats.conceptsCount}</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'فصول الحصة' : 'Chapters'}</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#06B6D4', marginTop: '4px' }}>{lesson.stats.chaptersCount}</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الأسئلة المولدة' : 'Quiz Questions'}</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#10B981', marginTop: '4px' }}>{lesson.stats.quizQuestionsCount}</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'متوسط استيعاب الطلاب' : 'Class Mastery Avg'}</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#F59E0B', marginTop: '4px' }}>{lesson.stats.avgQuizScore}%</div>
            </div>
          </div>

          {/* Chapters Table */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
              {lang === 'ar' ? 'فصول الحصة والتوقيتات الزمنية' : 'Lesson Chapters & Milestones'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lesson.chapters.map(ch => (
                <div
                  key={ch.id}
                  onClick={() => {
                    handleJumpToTimestamp(ch.startSeconds);
                    setActiveTab('transcript');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--primary-surface)',
                      color: 'var(--primary)'
                    }}>
                      {ch.timestamp}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? ch.titleAr : ch.title}
                    </span>
                  </div>
                  <Play size={14} color="var(--primary)" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. KNOWLEDGE MAP CANVAS */}
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

      {/* TAB CONTENT: 3. TRANSCRIPT & AUDIO PLAYER */}
      {activeTab === 'transcript' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Audio Player Component */}
          <AudioPlayer
            currentTime={currentTime}
            duration={lesson.durationSeconds}
            onSeek={setCurrentTime}
            isPlaying={isPlaying}
            onTogglePlay={setIsPlaying}
            activeChapter={lang === 'ar' ? lesson.chapters[1]?.titleAr : lesson.chapters[1]?.title}
          />

          {/* Transcript Paragraphs */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'التفريغ النصي المتزامن (اضغط للقفز للصوت)' : 'Synchronized Transcript (Click to seek)'}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>
                {lang === 'ar' ? 'مفعل: لهجة مصرية + مصطلحات إنجليزية' : 'Active: Egyptian Dialect & Terms'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lesson.transcript.map(tr => {
                const isActive = currentTime >= tr.startSeconds && currentTime < tr.startSeconds + 180;
                return (
                  <div
                    key={tr.id}
                    onClick={() => handleJumpToTimestamp(tr.startSeconds)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isActive ? 'var(--primary-surface)' : 'transparent',
                      border: isActive ? '1px solid var(--primary-light)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <button
                      style={{
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-subtle)',
                        color: isActive ? '#FFFFFF' : 'var(--primary)',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer',
                        marginTop: '2px',
                        flexShrink: 0
                      }}
                    >
                      {tr.timestamp}
                    </button>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '2px' }}>
                        {tr.speaker}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontWeight: isActive ? '600' : '400'
                      }}>
                        {lang === 'ar' ? tr.textAr : tr.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. CORNELL SUMMARY */}
      {activeTab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Overview */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
              {lang === 'ar' ? 'ملخص المحتوى العام' : 'Lesson Overview'}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              {lang === 'ar' ? lesson.summary.overviewAr : lesson.summary.overview}
            </p>
          </div>

          {/* Definitions */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
              {lang === 'ar' ? 'أهم المصطلحات والتعريفات' : 'Key Definitions'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {lesson.summary.keyDefinitions.map((def, idx) => (
                <div key={idx} style={{
                  padding: '14px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                    {lang === 'ar' ? def.termAr : def.term}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {lang === 'ar' ? def.defAr : def.def}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Formulas */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
              {lang === 'ar' ? 'المعادلات الكيميائية والحركية' : 'Chemical Equations & Formulas'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lesson.summary.keyFormulas.map((form, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {form.label}
                  </span>
                  <code style={{
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--primary)',
                    backgroundColor: 'var(--bg-surface)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {form.formula}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Takeaways and Traps */}
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.06)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#EF4444', marginBottom: '14px' }}>
              {lang === 'ar' ? '⚠️ مصائد امتحانات الثانوية العامة وأهم النقاط' : '⚠️ Thanawya Amma Exam Traps & Takeaways'}
            </h3>
            <ul style={{ paddingRight: isRtl ? '20px' : '0', paddingLeft: isRtl ? '0' : '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(lang === 'ar' ? lesson.summary.takeawaysAr : lesson.summary.takeaways).map((item, idx) => (
                <li key={idx} style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. QUIZ GENERATOR */}
      {activeTab === 'quiz' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'بنك أسئلة الحصة المولد بالذكاء الاصطناعي' : 'Generated Lesson Assessment'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                {lang === 'ar' ? '12 سؤالاً تمت صياغتها وفق معايير المركز القومي للامتحانات' : '12 Questions formulated with explanation rationale and audio links'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => alert(lang === 'ar' ? 'تم نشر الاختبار لجميع طلاب السنتر والأونلاين بنجاح!' : 'Quiz published to all enrolled students!')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <Send size={14} />
                <span>{lang === 'ar' ? 'نشر الاختبار للمجموعات' : 'Publish to Classes'}</span>
              </button>
            </div>
          </div>

          {/* Question List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {lesson.quizzes.map((q, idx) => (
              <div
                key={q.id}
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-surface)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '800'
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: q.difficulty === 'Easy' ? '#ECFDF5' : '#FFFBEB',
                      color: q.difficulty === 'Easy' ? '#10B981' : '#F59E0B'
                    }}>
                      {q.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      handleJumpToTimestamp(q.timestamp === '08:10' ? 490 : 680);
                      setActiveTab('transcript');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '11px',
                      color: 'var(--primary)',
                      fontWeight: '700',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer'
                    }}
                  >
                    <Play size={10} fill="var(--primary)" />
                    <span>{q.timestamp}</span>
                  </button>
                </div>

                <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.5 }}>
                  {lang === 'ar' ? q.questionAr : q.question}
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {(lang === 'ar' ? q.optionsAr : q.options).map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctIndex;
                    return (
                      <div
                        key={optIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-subtle)',
                          border: isCorrect ? '1.5px solid #10B981' : '1px solid var(--border-subtle)',
                          fontSize: '13.5px',
                          color: isCorrect ? '#10B981' : 'var(--text-primary)',
                          fontWeight: isCorrect ? '700' : '500'
                        }}
                      >
                        <span style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: `1.5px solid ${isCorrect ? '#10B981' : 'var(--text-muted)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: '700'
                        }}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                        {isCorrect && <CheckCircle2 size={16} color="#10B981" style={{ marginLeft: 'auto' }} />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  fontSize: '12.5px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5
                }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{lang === 'ar' ? 'التعليل النموذجي: ' : 'Rationale: '}</strong>
                  {lang === 'ar' ? q.explanationAr : q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
