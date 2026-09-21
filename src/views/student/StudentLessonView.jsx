import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  FileText, AlignLeft, Map, Folder, HelpCircle,
  ChevronRight, ChevronLeft, ArrowLeft, ArrowRight, CheckCircle2,
  BookOpen, X
} from 'lucide-react';
import {
  LessonVideoPlayer,
  LessonPlaylistSidebar,
  LessonHeaderActions,
  LessonNotesTab,
  LessonTranscriptTab,
  LessonConceptMapTab,
  LessonMaterialsTab,
  LessonQuestionsTab,
  LessonModals,
  LessonTodayCard,
  useLesson
} from '../../features/student/lesson';

export const StudentLessonView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const lessonState = useLesson(lang);

  const {
    courseInfo,
    lesson,
    playlist,
    completedCount,
    courseCompletionPct,
    currentCh,
    progress,
    mediaMode,
    setMediaMode,
    isPlaying,
    setIsPlaying,
    currentTime,
    seekTo,
    seekBy,
    speed,
    setSpeed,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    isPlayerFS,
    setIsPlayerFS,
    isLandscape,
    setIsLandscape,
    isCompleted,
    isBookmarked,
    showCelebrationModal,
    setShowCelebrationModal,
    lessonChecklist,
    toggleChecklistItem,
    confirmDialog,
    setConfirmDialog,
    triggerConfirm,
    handleConfirmAction,
    activeTab,
    setActiveTab,
    mobileSubpage,
    setMobileSubpage,
    roadmapViewMode,
    setRoadmapViewMode,
    isKMFS,
    setIsKMFS,
    expandedConcept,
    setExpandedConcept,
    masteredConcepts,
    toggleConceptMastered,
    selectedGraphNode,
    setSelectedGraphNode,
    graphNodes,
    graphEdges,
    transcriptSearch,
    setTranscriptSearch,
    transcriptSegments,
    notes,
    noteInput,
    setNoteInput,
    handleAddNote,
    handleDeleteNote,
    questions,
    savedQ,
    setSavedQ,
    revealedA,
    setRevealedA,
    attachments,
    dlId,
    dlToast,
    handleDL,
    handlePlaylistLessonClick,
    handleCompleteButtonClick,
    handleBookmarkClick,
    fmt,
    playerRef,
    kmRef,
    activeLessonId,
    mobilePlaylistOpen,
    setMobilePlaylistOpen
  } = lessonState;

  // 5 Clean Tabs
  const tabs = [
    { id: 'notes', label: lang === 'ar' ? 'ملاحظات الدرس' : 'Lesson Notes', icon: FileText },
    { id: 'transcript', label: lang === 'ar' ? 'نص الحصة' : 'Transcript', icon: AlignLeft },
    { id: 'roadmap', label: lang === 'ar' ? 'خريطة الحصة' : 'Lesson Map', icon: Map },
    { id: 'materials', label: lang === 'ar' ? 'الملفات' : 'Files', icon: Folder },
    { id: 'questions', label: lang === 'ar' ? 'الأسئلة' : 'Questions', icon: HelpCircle },
  ];

  const toggleLandscape = async () => {
    if (!playerRef.current) return;
    try {
      if (!isLandscape) {
        if (playerRef.current.requestFullscreen) {
          await playerRef.current.requestFullscreen();
        }
        if (window.screen?.orientation?.lock) {
          await window.screen.orientation.lock('landscape').catch(() => {});
        }
        setIsLandscape(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen().catch(() => {});
        }
        if (window.screen?.orientation?.unlock) {
          window.screen.orientation.unlock();
        }
        setIsLandscape(false);
      }
    } catch (e) {
      setIsLandscape(!isLandscape);
    }
  };

  const togglePlayerFS = async () => {
    if (!playerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await playerRef.current.requestFullscreen();
        setIsPlayerFS(true);
      } else {
        await document.exitFullscreen();
        setIsPlayerFS(false);
      }
    } catch (e) {
      setIsPlayerFS(!isPlayerFS);
    }
  };

  const toggleKMFS = async () => {
    if (!kmRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await kmRef.current.requestFullscreen();
        setIsKMFS(true);
      } else {
        await document.exitFullscreen();
        setIsKMFS(false);
      }
    } catch (e) {
      setIsKMFS(!isKMFS);
    }
  };

  const handleSummaryClick = () => {
    triggerConfirm({
      title: lang === 'ar' ? 'تأكيد تحميل ملخص الحصة' : 'Download Summary PDF',
      message: lang === 'ar'
        ? `هل تريد بدء تحميل ملخص المحاضرة الشامل بصيغة PDF (${courseInfo.summaryPdf})؟`
        : 'Do you want to download the comprehensive lesson summary PDF?',
      confirmText: lang === 'ar' ? 'نعم، ابدأ التحميل' : 'Yes, Download',
      confirmColor: 'primary',
      onConfirm: () => handleDL({ id: 'summary', titleAr: courseInfo.summaryPdf })
    });
  };

  const handleAttachmentDownloadClick = (att) => {
    triggerConfirm({
      title: lang === 'ar' ? `تحميل ملف: ${att.titleAr}` : `Download: ${att.titleAr}`,
      message: lang === 'ar'
        ? `هل تريد تحميل ملف "${att.titleAr}" (${att.size} • ${att.pages}) إلى جهازك؟`
        : `Download "${att.titleAr}" (${att.size})?`,
      confirmText: lang === 'ar' ? 'بدء التنزيل' : 'Download Now',
      confirmColor: 'emerald',
      onConfirm: () => handleDL(att)
    });
  };

  const handleSaveQuestionClick = (q) => {
    const isSaved = savedQ[q.id];
    triggerConfirm({
      title: isSaved ? (lang === 'ar' ? 'إلغاء حفظ السؤال' : 'Unsave Question') : (lang === 'ar' ? 'حفظ السؤال للمراجعة' : 'Save Question'),
      message: isSaved
        ? (lang === 'ar' ? 'هل تريد إزالة هذا السؤال من بنك أسئلتك المحفوظة؟' : 'Remove this question from saved list?')
        : (lang === 'ar' ? 'سيتم حفظ هذا السؤال في بنك أسئلتك المخصصة للتدريب الذكي قبل الامتحانات.' : 'Save this question to your practice bank?'),
      confirmText: isSaved ? (lang === 'ar' ? 'نعم، إزالة' : 'Remove') : (lang === 'ar' ? 'تأكيد الحفظ' : 'Save'),
      confirmColor: isSaved ? 'amber' : 'emerald',
      onConfirm: () => setSavedQ(p => ({ ...p, [q.id]: !p[q.id] }))
    });
  };

  const handleToggleMasteredClick = (ch) => {
    const isMastered = !!masteredConcepts[ch.id];
    triggerConfirm({
      title: isMastered
        ? (lang === 'ar' ? 'إلغاء تأكيد استيعاب المفهوم' : 'Unmark Concept')
        : (lang === 'ar' ? `تأكيد استيعاب: ${ch.titleAr}` : 'Confirm Concept Mastery'),
      message: isMastered
        ? (lang === 'ar' ? 'هل تريد إرجاع هذا المفهوم إلى قائمة المفاهيم الجاري مراجعتها؟' : 'Revert this concept to review status?')
        : (lang === 'ar' ? 'سيتم تسجيل هذا المفهوم ضمن المفاهيم المتقنة في سجلك التعليمي لرفع نسبة التحصيل.' : 'Mark this concept as mastered in your learning report?'),
      confirmText: isMastered ? (lang === 'ar' ? 'نعم، إلغاء التأكيد' : 'Unmark') : (lang === 'ar' ? 'نعم، أتقنت المفهوم' : 'Confirm Mastery'),
      confirmColor: isMastered ? 'amber' : 'emerald',
      onConfirm: () => toggleConceptMastered(ch.id)
    });
  };

  const renderTabContent = (targetTab) => {
    switch (targetTab) {
      case 'notes':
        return (
          <LessonNotesTab
            notes={notes}
            noteInput={noteInput}
            setNoteInput={setNoteInput}
            handleAddNote={handleAddNote}
            handleDeleteNote={handleDeleteNote}
            seekTo={seekTo}
            currentTime={currentTime}
            fmt={fmt}
            lang={lang}
          />
        );
      case 'transcript':
        return (
          <LessonTranscriptTab
            transcriptSegments={transcriptSegments}
            transcriptSearch={transcriptSearch}
            setTranscriptSearch={setTranscriptSearch}
            currentTime={currentTime}
            seekTo={seekTo}
            fmt={fmt}
            lang={lang}
          />
        );
      case 'roadmap':
        return (
          <LessonConceptMapTab
            kmRef={kmRef}
            courseInfo={courseInfo}
            lesson={lesson}
            roadmapViewMode={roadmapViewMode}
            setRoadmapViewMode={setRoadmapViewMode}
            isKMFS={isKMFS}
            toggleKMFS={toggleKMFS}
            progress={progress}
            currentCh={currentCh}
            currentTime={currentTime}
            expandedConcept={expandedConcept}
            setExpandedConcept={setExpandedConcept}
            masteredConcepts={masteredConcepts}
            handleToggleMasteredClick={handleToggleMasteredClick}
            selectedGraphNode={selectedGraphNode}
            setSelectedGraphNode={setSelectedGraphNode}
            graphNodes={graphNodes}
            graphEdges={graphEdges}
            seekTo={seekTo}
            setIsPlaying={setIsPlaying}
            fmt={fmt}
            lang={lang}
          />
        );
      case 'materials':
        return (
          <LessonMaterialsTab
            attachments={attachments}
            handleAttachmentDownloadClick={handleAttachmentDownloadClick}
            dlId={dlId}
            lang={lang}
          />
        );
      case 'questions':
        return (
          <LessonQuestionsTab
            questions={questions}
            savedQ={savedQ}
            handleSaveQuestionClick={handleSaveQuestionClick}
            revealedA={revealedA}
            setRevealedA={setRevealedA}
            lang={lang}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="lv">
      {/* Feedback Toast */}
      {dlToast && (
        <div className="lv-toast">
          <CheckCircle2 size={16} />
          <span>{dlToast}</span>
        </div>
      )}

      {/* BREADCRUMB BAR */}
      <div className="lv-top-bar">
        <nav className="lv-crumb" aria-label="Breadcrumb">
          <button className="lv-crumb-link" onClick={() => navigate('/student/courses')}>
            {lang === 'ar' ? 'مقرراتي (حصصي)' : 'My Courses'}
          </button>
          <ChevronRight size={13} className="lv-crumb-sep" />
          <span className="lv-crumb-item">{courseInfo.subjectAr}</span>
          <ChevronRight size={13} className="lv-crumb-sep" />
          <span className="lv-crumb-current">{lesson.titleAr}</span>
        </nav>
      </div>

      {/* WORKSPACE GRID (2-Column Layout: Main Content + Sticky Playlist Sidebar) */}
      <div className="lv-layout">
        {/* MAIN COLUMN: Video Player + Actions + Tabs */}
        <main className="lv-content">
          {/* Video / Audio Player Container */}
          <LessonVideoPlayer
            playerRef={playerRef}
            lesson={lesson}
            courseInfo={courseInfo}
            currentCh={currentCh}
            mediaMode={mediaMode}
            setMediaMode={setMediaMode}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentTime={currentTime}
            seekTo={seekTo}
            seekBy={seekBy}
            speed={speed}
            setSpeed={setSpeed}
            volume={volume}
            setVolume={setVolume}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            isPlayerFS={isPlayerFS}
            togglePlayerFS={togglePlayerFS}
            toggleLandscape={toggleLandscape}
            isLandscape={isLandscape}
            progress={progress}
            fmt={fmt}
            lang={lang}
          />

          {/* Lesson Header Details & Actions */}
          <LessonHeaderActions
            lesson={lesson}
            courseInfo={courseInfo}
            isCompleted={isCompleted}
            isBookmarked={isBookmarked}
            handleCompleteButtonClick={handleCompleteButtonClick}
            handleSummaryClick={handleSummaryClick}
            handleBookmarkClick={handleBookmarkClick}
            lang={lang}
          />

          {/* Mobile "درس اليوم" Card with Live Sync Timer & Checklist */}
          <LessonTodayCard
            className="mobile-only"
            lessonChecklist={lessonChecklist}
            toggleChecklistItem={toggleChecklistItem}
            progress={progress}
            isCompleted={isCompleted}
            currentTime={currentTime}
            durationFmt={lesson.durationFmt}
            fmt={fmt}
            lang={lang}
          />

          {/* Mobile In-flow Course Playlist Card (Never overlaps content) */}
          <button
            type="button"
            className="lv-mobile-playlist-card mobile-only"
            onClick={() => setMobilePlaylistOpen(true)}
          >
            <div className="lv-mobile-playlist-card__info">
              <div className="lv-mobile-playlist-card__icon">
                <BookOpen size={18} />
              </div>
              <div className="lv-mobile-playlist-card__text">
                <span className="lv-mobile-playlist-card__title">
                  {lang === 'ar' ? 'فهرس حصص المنهج ومحتوى الدورة' : 'Course Modules & Lessons'}
                </span>
                <span className="lv-mobile-playlist-card__sub">
                  {lang === 'ar' ? `${completedCount} من ${playlist.length} حصص مكتملة` : `${completedCount} of ${playlist.length} completed`}
                </span>
              </div>
            </div>
            <div className="lv-mobile-playlist-card__action">
              <span className="lv-mobile-playlist-card__pct">{courseCompletionPct}%</span>
              {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </div>
          </button>

          {/* Tabs Navigation & Content */}
          <div className="lv-tabs">
            <div className="lv-tabs__header" role="tablist">
              {tabs.map(t => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={isActive}
                    className={`lv-tabs__btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(t.id);
                      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                        setMobileSubpage(t.id);
                      }
                    }}
                  >
                    <Icon size={16} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Inline Tabs Body */}
            <div className="lv-tabs__body">
              {renderTabContent(activeTab)}
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Course Playlist Sidebar */}
        <aside className="lv-sidebar">
          <LessonPlaylistSidebar
            courseInfo={courseInfo}
            playlist={playlist}
            completedCount={completedCount}
            courseCompletionPct={courseCompletionPct}
            activeLessonId={activeLessonId}
            isCompleted={isCompleted}
            progress={progress}
            currentTime={currentTime}
            durationFmt={lesson.durationFmt}
            fmt={fmt}
            lessonChecklist={lessonChecklist}
            toggleChecklistItem={toggleChecklistItem}
            handlePlaylistLessonClick={handlePlaylistLessonClick}
            lang={lang}
            isRtl={isRtl}
          />
        </aside>
      </div>

      {/* MOBILE FLOATING PLAYLIST TRIGGER */}
      <div className="lv-mobile-bar mobile-only">
        <button
          className="lv-mobile-bar__btn"
          onClick={() => setMobilePlaylistOpen(true)}
        >
          <BookOpen size={16} />
          <span>{lang === 'ar' ? 'محتوى الدورة' : 'Course Content'}</span>
          <span className="lv-mobile-bar__count">{courseCompletionPct}%</span>
        </button>
      </div>

      {/* Modals: Confirmation, Celebration, Mobile Drawer */}
      <LessonModals
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
        handleConfirmAction={handleConfirmAction}
        showCelebrationModal={showCelebrationModal}
        setShowCelebrationModal={setShowCelebrationModal}
        courseInfo={courseInfo}
        mobilePlaylistOpen={mobilePlaylistOpen}
        setMobilePlaylistOpen={setMobilePlaylistOpen}
        courseCompletionPct={courseCompletionPct}
        completedCount={completedCount}
        playlist={playlist}
        handlePlaylistLessonClick={handlePlaylistLessonClick}
        lang={lang}
      />

      {/* DEDICATED FULL-SCREEN MOBILE SUBPAGE */}
      {mobileSubpage && (
        <div className="lv-mobile-subpage" role="dialog" aria-modal="true">
          <div className="lv-mobile-subpage__header">
            <button
              type="button"
              className="lv-mobile-subpage__back-btn"
              onClick={() => setMobileSubpage(null)}
              title={lang === 'ar' ? 'العودة للحصة' : 'Back to Lesson'}
            >
              {isRtl ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
              <span>{lang === 'ar' ? 'العودة للحصة' : 'Back to Lesson'}</span>
            </button>

            <div className="lv-mobile-subpage__title">
              {(() => {
                const currentT = tabs.find(t => t.id === mobileSubpage);
                if (!currentT) return null;
                const TabIcon = currentT.icon;
                return (
                  <>
                    <TabIcon size={16} />
                    <span>{currentT.label}</span>
                  </>
                );
              })()}
            </div>

            <button
              type="button"
              className="lv-mobile-subpage__close-btn"
              onClick={() => setMobileSubpage(null)}
              title={lang === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X size={18} />
            </button>
          </div>

          <div className="lv-mobile-subpage__pills">
            {tabs.map(t => {
              const Icon = t.icon;
              const isActive = mobileSubpage === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`lv-mobile-subpage__pill ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setMobileSubpage(t.id);
                    setActiveTab(t.id);
                  }}
                >
                  <Icon size={14} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="lv-mobile-subpage__body">
            {renderTabContent(mobileSubpage)}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLessonView;
