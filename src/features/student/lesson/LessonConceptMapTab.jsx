import React from 'react';
import {
  Brain,
  Layers,
  Network,
  Minimize2,
  Maximize2,
  Sparkles,
  Play,
  CheckCircle2,
  Lock,
  ChevronDown,
  CheckSquare,
  Square,
} from 'lucide-react';

export const LessonConceptMapTab = ({
  kmRef,
  courseInfo,
  lesson,
  roadmapViewMode,
  setRoadmapViewMode,
  isKMFS,
  toggleKMFS,
  progress,
  currentCh,
  currentTime,
  expandedConcept,
  setExpandedConcept,
  masteredConcepts,
  handleToggleMasteredClick,
  selectedGraphNode,
  setSelectedGraphNode,
  graphNodes = [],
  graphEdges = [],
  graphCanvas = { width: 1120, height: 360 },
  seekTo,
  setIsPlaying,
  fmt,
  lang,
}) => {
  const isAr = lang === 'ar';
  const activeGraphNodeObj =
    graphNodes.find((n) => n.id === selectedGraphNode) || graphNodes[0] || null;

  const viewBoxW = Math.max(920, Number(graphCanvas?.width || 1120));
  const viewBoxH = Math.max(320, Number(graphCanvas?.height || 360));

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
                ? 'خارطة المفاهيم وشبكة المعرفة التفاعلية'
                : 'Interactive Knowledge Roadmap & Graph'}
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
              className={`lv-roadmap-toggle-btn ${roadmapViewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setRoadmapViewMode('cards')}
            >
              <Layers size={13} />
              <span>{isAr ? 'محطات الشرح' : 'Chapters View'}</span>
            </button>

            <button
              type="button"
              className={`lv-roadmap-toggle-btn ${roadmapViewMode === 'graph' ? 'active' : ''}`}
              onClick={() => setRoadmapViewMode('graph')}
            >
              <Network size={13} />
              <span>{isAr ? 'خريطة المفاهيم (Graph)' : 'Concept Graph'}</span>
            </button>
          </div>

          <button
            type="button"
            className="lv-km__action"
            onClick={toggleKMFS}
            title={isAr ? 'شاشة كاملة' : 'Fullscreen'}
            aria-label={isAr ? 'شاشة كاملة' : 'Fullscreen'}
          >
            {isKMFS ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* ── SUB-MODE 1: Interactive Network Graph ── */}
      {roadmapViewMode === 'graph' &&
        (graphNodes.length === 0 ? (
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
                ? 'لم يتم إضافة شبكة مفاهيم بيانية لهذه الحصة بعد.'
                : 'No interactive concept graph available for this lesson yet.'}
            </div>
          </div>
        ) : (
          <div className="lv-graph-container">
            <div className="lv-graph-hint">
              <Sparkles size={14} />
              <span>
                {isAr
                  ? 'اضغط على أي عقدة لاستكشاف تفاصيلها والانتقال المباشر لتوقيتها في الشرح'
                  : 'Click any concept node to inspect details & jump directly in the video'}
              </span>
            </div>

            <div className="lv-graph-svg-wrap">
              <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} className="lv-graph-svg">
                <defs>
                  <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1588C7" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {graphEdges.map((e, idx) => {
                  const source = graphNodes.find((n) => n.id === e.from);
                  const target = graphNodes.find((n) => n.id === e.to);
                  if (!source || !target) return null;
                  const midX = (source.x + target.x) / 2;
                  const pathData = `M ${source.x} ${source.y} C ${midX} ${source.y}, ${midX} ${target.y}, ${target.x} ${target.y}`;
                  return (
                    <g key={`${e.from}-${e.to}-${idx}`}>
                      <path
                        d={pathData}
                        stroke="var(--border-subtle)"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        d={pathData}
                        stroke="url(#edgeGrad)"
                        strokeWidth="2.5"
                        strokeDasharray="8 6"
                        className="lv-graph-edge-flow"
                        fill="none"
                      />
                    </g>
                  );
                })}

                {graphNodes.map((node) => {
                  const isSelected = activeGraphNodeObj?.id === node.id;
                  const startSec = Number(node.startSec || 0);
                  const isCurrent =
                    startSec > 0 && currentTime >= startSec && currentTime < startSec + 300;
                  const displayLabel = String(
                    isAr ? node.label : node.labelEn || node.label || ''
                  );
                  const truncated =
                    displayLabel.length > 16 ? `${displayLabel.slice(0, 15)}…` : displayLabel;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className={`lv-graph-node ${isSelected ? 'selected' : ''} ${isCurrent ? 'current' : ''}`}
                      onClick={() => setSelectedGraphNode(node.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {isCurrent && (
                        <circle
                          r={(node.r || 40) + 10}
                          fill="none"
                          stroke={node.color || '#1588C7'}
                          strokeWidth="2"
                          className="lv-graph-node-pulse"
                        />
                      )}

                      <circle
                        r={node.r || 40}
                        fill="var(--bg-surface)"
                        stroke={isSelected ? '#1588C7' : node.color || '#1588C7'}
                        strokeWidth={isSelected ? 3.5 : 2}
                        filter="url(#glow)"
                      />

                      <circle
                        r={(node.r || 40) - 5}
                        fill={node.color || '#1588C7'}
                        fillOpacity="0.16"
                      />

                      <text
                        y="-4"
                        textAnchor="middle"
                        fill="var(--text-primary)"
                        fontSize="12"
                        fontWeight="800"
                        fontFamily="var(--font-heading)"
                      >
                        {truncated}
                      </text>

                      <text
                        y="14"
                        textAnchor="middle"
                        fill="var(--text-secondary)"
                        fontSize="9.5"
                        fontWeight="600"
                      >
                        {node.tag || fmt(startSec)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {activeGraphNodeObj && (
              <div className="lv-graph-card animate-pop">
                <div className="lv-graph-card__head">
                  <div className="lv-graph-card__title-group">
                    <span
                      className="lv-graph-card__dot"
                      style={{ backgroundColor: activeGraphNodeObj.color || '#1588C7' }}
                    />
                    <h4 className="lv-graph-card__title">
                      {isAr
                        ? activeGraphNodeObj.label
                        : activeGraphNodeObj.labelEn || activeGraphNodeObj.label}
                    </h4>
                    {activeGraphNodeObj.tag && (
                      <span className="lv-graph-card__tag">{activeGraphNodeObj.tag}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="lv-graph-card__jump-btn"
                    onClick={() => {
                      seekTo(Number(activeGraphNodeObj.startSec || 0));
                      setIsPlaying(true);
                    }}
                  >
                    <Play size={13} fill="currentColor" />
                    <span>
                      {isAr
                        ? `تشغيل من هذه النقطة (${fmt(Number(activeGraphNodeObj.startSec || 0))})`
                        : `Play from ${fmt(Number(activeGraphNodeObj.startSec || 0))}`}
                    </span>
                  </button>
                </div>

                {activeGraphNodeObj.desc && (
                  <p
                    className="lv-graph-card__desc"
                    style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                  >
                    {activeGraphNodeObj.desc}
                  </p>
                )}
              </div>
            )}
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
                            <p className="lv-concept__desc">{ch.descAr}</p>
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
