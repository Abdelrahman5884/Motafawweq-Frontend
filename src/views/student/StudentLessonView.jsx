import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  FileText,
  AlignLeft,
  Map,
  Folder,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  X,
  AlertCircle,
  RefreshCw,
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
  useLesson,
} from '../../features/student/lesson';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';

export const StudentLessonView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';
  const lessonState = useLesson(lang);

  const {
    loadingLesson,
    switchingLesson,
    lessonError,
    retryLoad,
    courseInfo,
    lesson,
    playlist,
    prevLesson,
    nextLesson,
    switchLesson,
    completedCount,
    courseCompletionPct,
    currentCh,
    progress,
    mediaMode,
    setMediaMode,
    isPlaying,
    setIsPlaying,
    currentTime,
    embedSeekSec,
    embedSeekNonce,
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
    isTogglingComplete,
    isBookmarked,
    isTogglingBookmark,
    showCelebrationModal,
    setShowCelebrationModal,
    lastEarnedXp,
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
    expandedConcept,
    setExpandedConcept,
    masteredConcepts,
    toggleConceptMastered,
    notebookMindMap,
    graphNodes,
    graphEdges,
    transcriptSearch,
    setTranscriptSearch,
    transcriptSegments,
    notes,
    noteInput,
    setNoteInput,
    isSavingNote,
    handleAddNote,
    handleUpdateNote,
    handleDeleteNote,
    relatedExams,
    questions,
    savedQ,
    toggleSavedQuestion,
    revealedA,
    setRevealedA,
    attachments,
    whiteboardImages,
    dlId,
    dlToast,
    handleDL,
    handlePlaylistLessonClick,
    handleCompleteButtonClick,
    handleBookmarkClick,
    fmt,
    playerRef,
    mediaElRef,
    onMediaTimeUpdate,
    onMediaLoadedMetadata,
    kmRef,
    activeLessonId,
    mobilePlaylistOpen,
    setMobilePlaylistOpen,
  } = lessonState;

  // Keep fullscreen state strictly in sync even when user exits via Escape
  useEffect(() => {
    const onFullscreenChange = () => {
      const fsEl = document.fullscreenElement;
      setIsPlayerFS(Boolean(fsEl && playerRef.current && fsEl === playerRef.current));
      if (!fsEl) {
        setIsLandscape(false);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, [playerRef, setIsPlayerFS, setIsLandscape]);

  const lessonTitleAr = lesson?.titleAr || '';
  const lessonTitleEn = lesson?.titleEn || lessonTitleAr;
  const courseSubjectAr = courseInfo?.subjectAr || 'المقررات الدراسية';
  const courseSubjectEn = courseInfo?.subjectEn || 'Courses';

  const breadcrumbItems = useMemo(
    () =>
      lessonTitleAr
        ? [
            {
              labelAr: courseSubjectAr,
              labelEn: courseSubjectEn,
              path: '/student/courses',
            },
            {
              labelAr: lessonTitleAr,
              labelEn: lessonTitleEn,
            },
          ]
        : [],
    [courseSubjectAr, courseSubjectEn, lessonTitleAr, lessonTitleEn]
  );

  useSetBreadcrumbs(breadcrumbItems);

  const materialsCount = attachments.length + whiteboardImages.length;
  const questionsBadgeCount = questions.length + relatedExams.length;

  const tabs = useMemo(
    () => [
      { id: 'notes', label: isAr ? 'ملاحظات الدرس' : 'Lesson Notes', icon: FileText, count: notes.length },
      { id: 'transcript', label: isAr ? 'نص الحصة' : 'Transcript', icon: AlignLeft, count: transcriptSegments.length },
      { id: 'roadmap', label: isAr ? 'خريطة الحصة' : 'Lesson Map', icon: Map, count: (lesson.chapters || []).length || graphNodes.length },
      { id: 'materials', label: isAr ? 'الملفات' : 'Files', icon: Folder, count: materialsCount },
      { id: 'questions', label: isAr ? 'الأسئلة' : 'Questions', icon: HelpCircle, count: questionsBadgeCount },
    ],
    [isAr, notes.length, transcriptSegments.length, lesson.chapters, graphNodes.length, materialsCount, questionsBadgeCount]
  );

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
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen().catch(() => {});
        }
        if (window.screen?.orientation?.unlock) {
          window.screen.orientation.unlock();
        }
        setIsLandscape(false);
      }
    } catch {
      setIsLandscape((v) => !v);
    }
  };

  const togglePlayerFS = async () => {
    if (!playerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await playerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setIsPlayerFS((v) => !v);
    }
  };

  const handleSummaryClick = () => {
    const firstPdf = attachments[0];
    if (!firstPdf) return;
    triggerConfirm({
      title: isAr ? 'تأكيد تحميل ملخص الحصة' : 'Download Summary PDF',
      message: isAr
        ? `هل تريد بدء تحميل ملف "${firstPdf.titleAr || 'ملخص الحصة'}"؟`
        : `Do you want to download "${firstPdf.titleAr || 'Lesson Summary PDF'}"?`,
      confirmText: isAr ? 'نعم، ابدأ التحميل' : 'Yes, Download',
      confirmColor: 'primary',
      onConfirm: () => handleDL(firstPdf),
    });
  };

  const handleAttachmentDownloadClick = (att) => {
    triggerConfirm({
      title: isAr ? `تحميل ملف: ${att.titleAr}` : `Download: ${att.titleAr}`,
      message: isAr
        ? `هل تريد تحميل ملف "${att.titleAr}" (${att.size || ''}${att.pages ? ` • ${att.pages}` : ''}) إلى جهازك؟`
        : `Download "${att.titleAr}" (${att.size || ''})?`,
      confirmText: isAr ? 'بدء التنزيل' : 'Download Now',
      confirmColor: 'emerald',
      onConfirm: () => handleDL(att),
    });
  };

  const handleSaveQuestionClick = (q) => {
    const isSaved = Boolean(savedQ[q.id]);
    triggerConfirm({
      title: isSaved
        ? isAr
          ? 'إلغاء حفظ السؤال'
          : 'Unsave Question'
        : isAr
          ? 'حفظ السؤال للمراجعة'
          : 'Save Question',
      message: isSaved
        ? isAr
          ? 'هل تريد إزالة هذا السؤال من قائمة أسئلتك المحفوظة؟'
          : 'Remove this question from saved list?'
        : isAr
          ? 'سيتم حفظ هذا السؤال في قائمتك المخصصة للمراجعة السريعة قبل الامتحانات.'
          : 'Save this question to your revision list?',
      confirmText: isSaved ? (isAr ? 'نعم، إزالة' : 'Remove') : isAr ? 'تأكيد الحفظ' : 'Save',
      confirmColor: isSaved ? 'amber' : 'emerald',
      onConfirm: () => toggleSavedQuestion(q.id),
    });
  };

  const handleToggleMasteredClick = (ch) => {
    const isMastered = Boolean(masteredConcepts[ch.id]);
    triggerConfirm({
      title: isMastered
        ? isAr
          ? 'إلغاء تأكيد استيعاب المحطة'
          : 'Unmark Chapter'
        : isAr
          ? `تأكيد استيعاب: ${ch.titleAr}`
          : 'Confirm Chapter Mastery',
      message: isMastered
        ? isAr
          ? 'هل تريد إرجاع هذه المحطة إلى قائمة المحطات الجاري مراجعتها؟'
          : 'Revert this chapter to review status?'
        : isAr
          ? 'سيتم تسجيل هذه المحطة ضمن المفاهيم المتقنة في خطة مذاكرتك.'
          : 'Mark this chapter as mastered in your study plan?',
      confirmText: isMastered
        ? isAr
          ? 'نعم، إلغاء التأكيد'
          : 'Unmark'
        : isAr
          ? 'نعم، أتقنت المحطة'
          : 'Confirm Mastery',
      confirmColor: isMastered ? 'amber' : 'emerald',
      onConfirm: () => toggleConceptMastered(ch.id),
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
            isSavingNote={isSavingNote}
            handleAddNote={handleAddNote}
            handleUpdateNote={handleUpdateNote}
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
            progress={progress}
            currentCh={currentCh}
            currentTime={currentTime}
            expandedConcept={expandedConcept}
            setExpandedConcept={setExpandedConcept}
            masteredConcepts={masteredConcepts}
            handleToggleMasteredClick={handleToggleMasteredClick}
            notebookMindMap={notebookMindMap}
            graphNodes={graphNodes}
            graphEdges={graphEdges}
            seekTo={seekTo}
            setIsPlaying={setIsPlaying}
            fmt={fmt}
            lang={lang}
            isRtl={isRtl}
          />
        );
      case 'materials':
        return (
          <LessonMaterialsTab
            attachments={attachments}
            whiteboardImages={whiteboardImages}
            handleAttachmentDownloadClick={handleAttachmentDownloadClick}
            dlId={dlId}
            lang={lang}
          />
        );
      case 'questions':
        return (
          <LessonQuestionsTab
            lessonId={activeLessonId}
            lessonTitleAr={lesson.titleAr}
            hasTranscript={transcriptSegments.length > 0}
            relatedExams={relatedExams}
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

  if (loadingLesson) {
    return (
      <div className="lv">
        <div className="lv-layout">
          <div className="lv-content">
            <div className="lv-skeleton-player" />
            <div className="lv-skeleton-bar" style={{ width: '60%', height: '26px' }} />
            <div className="lv-skeleton-bar" style={{ width: '40%', height: '16px' }} />
          </div>
          <aside className="lv-sidebar">
            <div className="lv-skeleton-card" style={{ height: '190px' }} />
            <div className="lv-skeleton-card" style={{ height: '320px' }} />
          </aside>
        </div>
      </div>
    );
  }

  if (lessonError && playlist.length === 0 && !lesson?.titleAr) {
    return (
      <div
        style={{
          maxWidth: '640px',
          margin: '48px auto',
          padding: '40px 24px',
          textAlign: 'center',
          borderRadius: '20px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          fontFamily: 'var(--font-arabic)',
        }}
      >
        <AlertCircle size={38} color="#DC2626" style={{ marginBottom: '12px' }} />
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>
          {isAr ? 'تعذر تحميل الحصة الدراسية' : 'Unable to Load Lesson'}
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
          {lessonError}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={retryLoad}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} />
            <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/student/courses')}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'العودة للمقررات' : 'Back to Courses'}
          </button>
        </div>
      </div>
    );
  }

  if (!loadingLesson && playlist.length === 0 && !lesson?.titleAr) {
    return (
      <div
        style={{
          maxWidth: '720px',
          margin: '48px auto',
          padding: '48px 24px',
          textAlign: 'center',
          borderRadius: '20px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px dashed var(--border-subtle)',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-arabic)',
        }}
      >
        <BookOpen size={40} color="var(--primary)" style={{ marginBottom: '12px', opacity: 0.7 }} />
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>
          {isAr ? 'لا توجد حصص متاحة للمشاهدة حالياً' : 'No Lessons Available Yet'}
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
          {isAr
            ? 'انضم إلى مجموعة دراسية بكود المعلم أو استعرض المقررات المتاحة لتظهر حصصك هنا.'
            : 'Join a study group or browse available courses to access lessons here.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/student/courses')}
          style={{
            padding: '10px 22px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: '800',
            cursor: 'pointer',
          }}
        >
          {isAr ? 'الذهاب إلى المقررات' : 'Go to Courses'}
        </button>
      </div>
    );
  }

  return (
    <div className="lv">
      {/* Feedback Toast */}
      {dlToast && (
        <div className="lv-toast" role="status" aria-live="polite">
          <CheckCircle2 size={16} />
          <span>{dlToast}</span>
        </div>
      )}

      {/* Non-blocking Error Banner when switching fails */}
      {lessonError && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            padding: '10px 14px',
            marginBottom: '12px',
            borderRadius: '12px',
            backgroundColor: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            color: '#DC2626',
            fontSize: '12.5px',
            fontWeight: '700',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            {lessonError}
          </span>
          <button
            type="button"
            onClick={retryLoad}
            style={{
              padding: '4px 10px',
              borderRadius: '7px',
              border: '1px solid rgba(220, 38, 38, 0.35)',
              backgroundColor: 'var(--bg-surface)',
              color: '#DC2626',
              fontSize: '11.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* BREADCRUMB BAR */}
      <div className="lv-top-bar">
        <nav className="lv-crumb" aria-label="Breadcrumb">
          <button
            type="button"
            className="lv-crumb-link"
            onClick={() => navigate('/student/courses')}
          >
            {isAr ? 'مقرراتي (حصصي)' : 'My Courses'}
          </button>
          {isRtl ? (
            <ChevronLeft size={13} className="lv-crumb-sep" />
          ) : (
            <ChevronRight size={13} className="lv-crumb-sep" />
          )}
          <span className="lv-crumb-item">{courseInfo.subjectAr}</span>
          {isRtl ? (
            <ChevronLeft size={13} className="lv-crumb-sep" />
          ) : (
            <ChevronRight size={13} className="lv-crumb-sep" />
          )}
          <span className="lv-crumb-current">{lesson.titleAr}</span>
        </nav>
      </div>

      {/* WORKSPACE GRID */}
      <div className="lv-layout" style={{ opacity: switchingLesson ? 0.72 : 1, transition: 'opacity 0.2s ease' }}>
        {/* MAIN COLUMN */}
        <main className="lv-content">
          <LessonVideoPlayer
            playerRef={playerRef}
            mediaElRef={mediaElRef}
            onMediaTimeUpdate={onMediaTimeUpdate}
            onMediaLoadedMetadata={onMediaLoadedMetadata}
            lesson={lesson}
            courseInfo={courseInfo}
            currentCh={currentCh}
            mediaMode={mediaMode}
            setMediaMode={setMediaMode}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentTime={currentTime}
            embedSeekSec={embedSeekSec}
            embedSeekNonce={embedSeekNonce}
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

          <LessonHeaderActions
            lesson={lesson}
            courseInfo={courseInfo}
            hasSummaryPdf={attachments.length > 0}
            isCompleted={isCompleted}
            isTogglingComplete={isTogglingComplete}
            isBookmarked={isBookmarked}
            isTogglingBookmark={isTogglingBookmark}
            prevLesson={prevLesson}
            nextLesson={nextLesson}
            onSelectLesson={handlePlaylistLessonClick}
            handleCompleteButtonClick={handleCompleteButtonClick}
            handleSummaryClick={handleSummaryClick}
            handleBookmarkClick={handleBookmarkClick}
            lang={lang}
          />

          <LessonTodayCard
            className="mobile-only"
            lessonChecklist={lessonChecklist}
            toggleChecklistItem={toggleChecklistItem}
            progress={progress}
            isCompleted={isCompleted}
            currentTime={currentTime}
            durationSec={lesson.durationSec}
            durationFmt={lesson.durationFmt}
            fmt={fmt}
            lang={lang}
          />

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
                  {isAr ? 'فهرس حصص المنهج ومحتوى الدورة' : 'Course Modules & Lessons'}
                </span>
                <span className="lv-mobile-playlist-card__sub">
                  {isAr
                    ? `${completedCount} من ${playlist.length} حصص مكتملة`
                    : `${completedCount} of ${playlist.length} completed`}
                </span>
              </div>
            </div>
            <div className="lv-mobile-playlist-card__action">
              <span className="lv-mobile-playlist-card__pct">{courseCompletionPct}%</span>
              {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </div>
          </button>

          {/* 5 Workspace Tabs */}
          <div className="lv-tabs">
            <div className="lv-tabs__header" role="tablist">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
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
                    {t.count > 0 && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '1px 6px',
                          borderRadius: '999px',
                          backgroundColor: isActive
                            ? 'rgba(255,255,255,0.22)'
                            : 'var(--bg-subtle)',
                          color: isActive ? 'inherit' : 'var(--text-muted)',
                        }}
                      >
                        {t.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="lv-tabs__body">{renderTabContent(activeTab)}</div>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
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
            durationSec={lesson.durationSec}
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
          type="button"
          className="lv-mobile-bar__btn"
          onClick={() => setMobilePlaylistOpen(true)}
        >
          <BookOpen size={16} />
          <span>{isAr ? 'محتوى الدورة' : 'Course Content'}</span>
          <span className="lv-mobile-bar__count">{courseCompletionPct}%</span>
        </button>
      </div>

      {/* Modals */}
      <LessonModals
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
        handleConfirmAction={handleConfirmAction}
        showCelebrationModal={showCelebrationModal}
        setShowCelebrationModal={setShowCelebrationModal}
        lastEarnedXp={lastEarnedXp}
        nextLesson={nextLesson}
        onGoToNextLesson={switchLesson}
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
              title={isAr ? 'العودة للحصة' : 'Back to Lesson'}
            >
              {isRtl ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
              <span>{isAr ? 'العودة للحصة' : 'Back to Lesson'}</span>
            </button>

            <div className="lv-mobile-subpage__title">
              {(() => {
                const currentT = tabs.find((t) => t.id === mobileSubpage);
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
              title={isAr ? 'إغلاق' : 'Close'}
              aria-label={isAr ? 'إغلاق' : 'Close'}
            >
              <X size={18} />
            </button>
          </div>

          <div className="lv-mobile-subpage__pills">
            {tabs.map((t) => {
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

          <div className="lv-mobile-subpage__body">{renderTabContent(mobileSubpage)}</div>
        </div>
      )}
    </div>
  );
};

export default StudentLessonView;
