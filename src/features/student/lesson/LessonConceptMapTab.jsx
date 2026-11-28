import React, { useMemo } from 'react';
import {
  Brain,
  Layers,
  Network,
  Play,
  CheckCircle2,
  Lock,
  ChevronDown,
  CheckSquare,
  Square,
} from 'lucide-react';
import { NotebookMindMapCanvas } from '../../../components/knowledge-map/NotebookMindMapCanvas';

/**
 * Reconstruct a hierarchical NotebookLM tree if only flat graph nodes/edges are available.
 * Keeps Student Lesson 100% consistent with the Teacher's NotebookMindMapCanvas.
 */
function buildTreeFromFlatGraph(nodes, edges, fmt) {
  if (!Array.isArray(nodes) || nodes.length === 0) return null;

  const nodeById = new Map();
  const childIds = new Set();

  nodes.forEach((n, idx) => {
    const startSecs = Math.max(0, Number(n.startSec ?? n.startSeconds ?? 0));
    nodeById.set(n.id, {
      id: n.id || `node-${idx + 1}`,
      label: n.label || n.labelAr || '',
      labelAr: n.labelAr || n.label || '',
      labelEn: n.labelEn || n.label || n.labelAr || '',
      summaryAr: n.desc || n.summaryAr || null,
      startSeconds: startSecs,
      timestamp: n.tag || (fmt ? fmt(startSecs) : '00:00'),
      children: [],
    });
  });

  if (Array.isArray(edges)) {
    edges.forEach((e) => {
      const parent = nodeById.get(e.from);
      const child = nodeById.get(e.to);
      if (parent && child && parent !== child && !childIds.has(child.id)) {
        parent.children.push(child);
        childIds.add(child.id);
      }
    });
  }

  const root = nodes.map((n) => nodeById.get(n.id)).find((n) => n && !childIds.has(n.id));
  return root || nodeById.get(nodes[0].id) || null;
}

export const LessonConceptMapTab = ({
  kmRef,
  courseInfo,
  lesson,
  roadmapViewMode,
  setRoadmapViewMode,
  progress,
  currentCh,
  currentTime,
  expandedConcept,
  setExpandedConcept,
  masteredConcepts,
  handleToggleMasteredClick,
  notebookMindMap = null,
  graphNodes = [],
  graphEdges = [],
  seekTo,
  setIsPlaying,
  fmt,
  lang,
  isRtl = lang === 'ar',
}) => {
  const isAr = lang === 'ar';

  const effectiveMindMap = useMemo(
    () => notebookMindMap || buildTreeFromFlatGraph(graphNodes, graphEdges, fmt),
    [notebookMindMap, graphNodes, graphEdges, fmt]
  );

  const mindMapKey = useMemo(() => {
    if (!effectiveMindMap) return `${lesson.id || 'lesson'}-empty`;
    return `${lesson.id || 'lesson'}-${effectiveMindMap.id || 'root'}-${effectiveMindMap.labelAr || effectiveMindMap.label || ''}-${effectiveMindMap.children?.length || 0}`;
  }, [lesson.id, effectiveMindMap]);

  return (
    <div className="lv-roadmap-tab" ref={kmRef}>
      <div className="lv-km__header">
        <div className="lv-km__header-left">
          <div className="lv-km__header-icon">
            <Brain size={20} />
          </div>
          <div className="lv-km__header-text">
            <h2 className="lv-km__title">
              {isAr
                ? 'خريطة المفاهيم الشجرية ومحطات الشرح'
                : 'Interactive Concept Map & Chapters'}
            </h2>
            <p className="lv-km__sub">
              {courseInfo.subjectAr ? `${courseInfo.subjectAr} • ` : ''}
              {lesson.titleAr}
            </p>
          </div>
        </div>

        <div className="lv-km__header-actions">
          <div className="lv-roadmap-toggle-group">
            <button
              type="button"
              className={`lv-roadmap-toggle-btn ${roadmapViewMode === 'graph' ? 'active' : ''}`}
              onClick={() => setRoadmapViewMode('graph')}
            >
              <Network size={13} />
              <span>{isAr ? 'خريطة المفاهيم' : 'Mind Map'}</span>
            </button>

            <button
              type="button"
              className={`lv-roadmap-toggle-btn ${roadmapViewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setRoadmapViewMode('cards')}
            >
              <Layers size={13} />
              <span>{isAr ? 'محطات الشرح' : 'Chapters View'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── SUB-MODE 1: Exact Same Interactive NotebookLM Mind Map as Teacher ── */}
      {roadmapViewMode === 'graph' &&
        (!effectiveMindMap ? (
          <div
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '14px',
              border: '1px dashed var(--border-subtle)',
              fontSize: '13.5px',
              fontWeight: '700',
            }}
          >
            <Network size={28} color="var(--primary)" style={{ opacity: 0.6, marginBottom: '8px' }} />
            <div>
              {isAr
                ? 'لم يتم إضافة خريطة مفاهيم لهذه الحصة بعد.'
                : 'No interactive concept map available for this lesson yet.'}
            </div>
          </div>
        ) : (
          <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <NotebookMindMapCanvas
              key={mindMapKey}
              treeData={effectiveMindMap}
              lessonTitle={isAr ? lesson.titleAr : lesson.titleEn || lesson.titleAr}
              unitTitle={courseInfo.subjectAr || courseInfo.titleAr || ''}
              onJumpToTimestamp={(secs) => {
                seekTo(Math.max(0, Number(secs) || 0));
                setIsPlaying(true);
              }}
              lang={lang}
              isRtl={isRtl}
            />
          </div>
        ))}

      {/* ── SUB-MODE 2: Chapters Roadmap Cards ── */}
      {roadmapViewMode === 'cards' &&
        (!lesson.chapters || lesson.chapters.length === 0 ? (
          <div
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '14px',
              border: '1px dashed var(--border-subtle)',
              fontSize: '13.5px',
              fontWeight: '700',
            }}
          >
            <Layers size={28} color="var(--primary)" style={{ opacity: 0.6, marginBottom: '8px' }} />
            <div>
              {isAr
                ? 'لا توجد محطات أو فصول زمنية مضافة لهذه الحصة حالياً.'
                : 'No chapter timestamps added for this lesson yet.'}
            </div>
          </div>
        ) : (
          <>
            <div className="lv-km__progress">
              <div className="lv-km__progress-bar">
                <div className="lv-km__progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="lv-km__progress-text">
                {progress}%{' '}
                {isAr
                  ? 'مكتمل من التقدم الزمني لهذه الحصة'
                  : 'completed of lesson timeline'}
              </span>
            </div>

            <div className="lv-km__grid">
              {lesson.chapters.map((ch, i) => {
                const isDone = currentTime >= ch.endSec;
                const isCurrent = currentCh?.id === ch.id;
                const isExpanded = expandedConcept === ch.id;
                const isMastered = Boolean(masteredConcepts[ch.id]);
                const chProgress =
                  isCurrent && ch.endSec > ch.startSec
                    ? Math.min(
                        100,
                        Math.max(0, ((currentTime - ch.startSec) / (ch.endSec - ch.startSec)) * 100)
                      )
                    : isDone
                      ? 100
                      : 0;

                return (
                  <div
                    key={ch.id}
                    className={`lv-concept ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''} ${isExpanded ? 'expanded' : ''}`}
                    style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
                    onClick={() => setExpandedConcept(isExpanded ? null : ch.id)}
                  >
                    <div className="lv-concept__status">
                      {isDone || isMastered ? (
                        <CheckCircle2 size={18} />
                      ) : isCurrent ? (
                        <Play size={14} fill="currentColor" />
                      ) : (
                        <Lock size={14} />
                      )}
                    </div>

                    <div className="lv-concept__body" style={{ minWidth: 0 }}>
                      <div className="lv-concept__head">
                        <span className="lv-concept__num">
                          {isAr ? `المحطة ${ch.order || i + 1}` : `Chapter ${ch.order || i + 1}`}
                        </span>
                        <span className="lv-concept__time">
                          {fmt(ch.startSec)} — {fmt(ch.endSec)}
                        </span>
                      </div>
                      <h4
                        dir="auto"
                        className="lv-concept__title"
                        style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                      >
                        {isAr ? ch.titleAr : ch.titleEn || ch.titleAr}
                      </h4>

                      <div className="lv-concept__bar">
                        <div className="lv-concept__bar-fill" style={{ width: `${chProgress}%` }} />
                      </div>

                      {isExpanded && (
                        <div className="lv-concept__details" onClick={(e) => e.stopPropagation()}>
                          {ch.descAr && (
                            <p dir="auto" className="lv-concept__desc">{ch.descAr}</p>
                          )}
                          {Array.isArray(ch.keyTerms) && ch.keyTerms.length > 0 && (
                            <div className="lv-concept__terms">
                              <span className="lv-concept__terms-label">
                                {isAr ? 'المصطلحات المحورية:' : 'Key Terms:'}
                              </span>
                              {ch.keyTerms.map((t) => (
                                <span key={t} className="lv-concept__term">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="lv-concept__actions">
                            <button
                              type="button"
                              className="lv-concept__jump"
                              onClick={() => {
                                seekTo(ch.startSec);
                                setIsPlaying(true);
                              }}
                            >
                              <Play size={12} fill="currentColor" />
                              <span>
                                {isAr
                                  ? `انتقل لهذا الجزء في الحصة (${fmt(ch.startSec)})`
                                  : `Jump to ${fmt(ch.startSec)}`}
                              </span>
                            </button>

                            <button
                              type="button"
                              className={`lv-concept__mastery ${isMastered ? 'mastered' : ''}`}
                              onClick={() => handleToggleMasteredClick(ch)}
                            >
                              {isMastered ? <CheckSquare size={14} /> : <Square size={14} />}
                              <span>
                                {isMastered
                                  ? isAr
                                    ? 'تم استيعاب المحطة'
                                    : 'Mastered'
                                  : isAr
                                    ? 'تأكيد الاستيعاب'
                                    : 'Mark Mastered'}
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <ChevronDown
                      size={15}
                      className={`lv-concept__chevron ${isExpanded ? 'open' : ''}`}
                    />
                  </div>
                );
              })}
            </div>
          </>
        ))}
    </div>
  );
};
