import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  RotateCcw,
  Trash2,
  Sparkles,
  Award,
  X,
  Play,
  Circle,
} from 'lucide-react';

export const LessonModals = ({
  confirmDialog,
  setConfirmDialog,
  handleConfirmAction,
  showCelebrationModal,
  setShowCelebrationModal,
  lastEarnedXp = 0,
  nextLesson = null,
  onGoToNextLesson,
  courseInfo,
  mobilePlaylistOpen,
  setMobilePlaylistOpen,
  courseCompletionPct,
  completedCount,
  playlist,
  handlePlaylistLessonClick,
  lang,
}) => {
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  useEffect(() => {
    if (!confirmDialog.open && !showCelebrationModal && !mobilePlaylistOpen) {
      return undefined;
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setConfirmDialog((p) => ({ ...p, open: false }));
        setShowCelebrationModal(false);
        setMobilePlaylistOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [
    confirmDialog.open,
    showCelebrationModal,
    mobilePlaylistOpen,
    setConfirmDialog,
    setShowCelebrationModal,
    setMobilePlaylistOpen,
  ]);

  return (
    <>
      {/* ══════════ MOBILE PLAYLIST DRAWER ══════════ */}
      {mobilePlaylistOpen && (
        <div
          className="lv-mobile-drawer-overlay mobile-only"
          onClick={() => setMobilePlaylistOpen(false)}
        >
          <div className="lv-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="lv-mobile-drawer__head">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>
                    {isAr ? 'محتوى الدورة' : 'Course Content'}
                  </h3>
                  <span className="lv-sidebar__pct-badge">{courseCompletionPct}%</span>
                </div>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  {completedCount}{' '}
                  {isAr ? `من أصل ${playlist.length} درس مكتمل` : `of ${playlist.length} done`}
                </span>
              </div>
              <button
                type="button"
                className="lv-km__action"
                onClick={() => setMobilePlaylistOpen(false)}
                aria-label={isAr ? 'إغلاق' : 'Close'}
              >
                <X size={16} />
              </button>
            </div>

            <div className="lv-playlist" style={{ maxHeight: '60vh' }}>
              {playlist.map((item, i) => (
                <div
                  key={item.id}
                  className={`lv-playlist__item ${item.active ? 'active' : ''} ${item.completed ? 'done' : ''}`}
                  onClick={() => handlePlaylistLessonClick(item)}
                >
                  <div className="lv-playlist__icon">
                    {item.completed ? (
                      <CheckCircle2 size={16} />
                    ) : item.active ? (
                      <Play size={13} fill="currentColor" />
                    ) : (
                      <Circle size={14} />
                    )}
                  </div>
                  <div className="lv-playlist__body">
                    <div className="lv-playlist__top-line">
                      <span className="lv-playlist__num">.{i + 1}</span>
                      <span className="lv-playlist__title">{item.titleAr}</span>
                    </div>
                    <span className="lv-playlist__time">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ UNIVERSAL CONFIRMATION MODAL ══════════ */}
      {confirmDialog.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="lv-modal-bg"
          onClick={() => setConfirmDialog((p) => ({ ...p, open: false }))}
        >
          <div
            className="lv-modal lv-modal--confirm animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`lv-modal__icon lv-modal__icon--${confirmDialog.confirmColor}`}>
              {confirmDialog.confirmColor === 'emerald' ? (
                <CheckCircle2 size={34} />
              ) : confirmDialog.confirmColor === 'amber' ? (
                <RotateCcw size={34} />
              ) : confirmDialog.confirmColor === 'rose' || confirmDialog.confirmColor === 'red' ? (
                <Trash2 size={34} />
              ) : (
                <Sparkles size={34} />
              )}
            </div>

            <h3 className="lv-modal__title">{confirmDialog.title}</h3>
            <p className="lv-modal__desc">{confirmDialog.message}</p>

            <div className="lv-modal__buttons lv-modal__buttons--row">
              <button
                type="button"
                className={`lv-modal__action-btn lv-modal__action-btn--${confirmDialog.confirmColor}`}
                onClick={handleConfirmAction}
              >
                {confirmDialog.confirmText}
              </button>
              <button
                type="button"
                className="lv-modal__secondary"
                onClick={() => setConfirmDialog((p) => ({ ...p, open: false }))}
              >
                {confirmDialog.cancelText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ LESSON COMPLETION CELEBRATION MODAL ══════════ */}
      {showCelebrationModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="lv-modal-bg"
          onClick={() => setShowCelebrationModal(false)}
        >
          <div className="lv-modal animate-pop" onClick={(e) => e.stopPropagation()}>
            <div className="lv-modal__icon lv-modal__icon--emerald">
              <Award size={38} />
            </div>
            <div className="lv-modal__xp">
              {lastEarnedXp > 0
                ? isAr
                  ? `+${lastEarnedXp} XP مكتسبة`
                  : `+${lastEarnedXp} XP Earned`
                : isAr
                  ? 'تم تحديث تقدمك بنجاح'
                  : 'Progress Updated'}
            </div>
            <h3 className="lv-modal__title">
              {isAr ? 'أحسنت يا بطل! أتممت الحصة' : 'Outstanding Achievement!'}
            </h3>
            <p className="lv-modal__desc">
              {isAr
                ? `تم تحديث نسبة إنجازك في ${courseInfo.subjectAr || 'المقرر'}. يمكنك الانتقال للحصة التالية أو تثبيت معلوماتك بحل كويز فوري.`
                : 'Your course progress has been updated! Continue to the next lesson or take a quick quiz.'}
            </p>
            <div className="lv-modal__buttons">
              {nextLesson && onGoToNextLesson ? (
                <button
                  type="button"
                  className="lv-modal__primary"
                  onClick={() => {
                    setShowCelebrationModal(false);
                    onGoToNextLesson(nextLesson.id);
                  }}
                >
                  {isAr ? `الحصة التالية: ${nextLesson.titleAr}` : 'Continue to Next Lesson'}
                </button>
              ) : (
                <button
                  type="button"
                  className="lv-modal__primary"
                  onClick={() => {
                    setShowCelebrationModal(false);
                    navigate('/student/quiz');
                  }}
                >
                  {isAr ? 'حل كويز تثبيت الفهم' : 'Take Practice Quiz'}
                </button>
              )}
              <button
                type="button"
                className="lv-modal__secondary"
                onClick={() => setShowCelebrationModal(false)}
              >
                {isAr ? 'متابعة المذاكرة هنا' : 'Stay Here'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
