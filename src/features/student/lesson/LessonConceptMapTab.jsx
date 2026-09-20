import React from 'react';
import {
  Brain, Layers, Network, Minimize2, Maximize2, Sparkles,
  Play, CheckCircle2, Lock, ChevronDown, CheckSquare, Square, Check, Target
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
  graphNodes,
  graphEdges,
  seekTo,
  setIsPlaying,
  fmt,
  lang
}) => {
  const activeGraphNodeObj = graphNodes.find(n => n.id === selectedGraphNode) || graphNodes[3];

  return (
    <div className="lv-roadmap-tab" ref={kmRef}>
      <div className="lv-km__header">
        <div className="lv-km__header-left">
          <div className="lv-km__header-icon"><Brain size={20} /></div>
          <div className="lv-km__header-text">
            <h2 className="lv-km__title">
              {lang === 'ar' ? 'خارطة المفاهيم وشبكة المعرفة التفاعلية' : 'Interactive Knowledge Roadmap & Graph'}
            </h2>
            <p className="lv-km__sub">
              {courseInfo.subjectAr} • {lesson.titleAr}
            </p>
          </div>
        </div>

        <div className="lv-km__header-actions">
          {/* Sub-mode Switcher: Cards vs Graph */}
          <div className="lv-roadmap-toggle-group">
            <button
              className={`lv-roadmap-toggle-btn ${roadmapViewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setRoadmapViewMode('cards')}
            >
              <Layers size={13} />
              <span>{lang === 'ar' ? 'بطاقات الشرح' : 'Cards View'}</span>
            </button>

            <button
              className={`lv-roadmap-toggle-btn ${roadmapViewMode === 'graph' ? 'active' : ''}`}
              onClick={() => setRoadmapViewMode('graph')}
            >
              <Network size={13} />
              <span>{lang === 'ar' ? 'الرسم البياني (Graph)' : 'Network Graph'}</span>
            </button>
          </div>

          <button className="lv-km__action" onClick={toggleKMFS} title="شاشة كاملة">
            {isKMFS ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* ── SUB-MODE 1: Interactive Network Graph (خريطة ك جراف) ── */}
      {roadmapViewMode === 'graph' && (
        <div className="lv-graph-container">
          <div className="lv-graph-hint">
            <Sparkles size={14} />
            <span>{lang === 'ar' ? 'اضغط على أي عقدة (Node) لاستكشاف العلاقات والانتقال المباشر لتوقيتها (اسحب يميناً ويساراً ↔)' : 'Click any node to explore connections & jump in video (swipe to pan ↔)'}</span>
          </div>

          {/* SVG Network Graph */}
          <div className="lv-graph-svg-wrap">
            <svg viewBox="0 0 1260 360" className="lv-graph-svg">
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

              {/* Render Connecting Edges */}
              {graphEdges.map((e, idx) => {
                const source = graphNodes.find(n => n.id === e.from);
                const target = graphNodes.find(n => n.id === e.to);
                if (!source || !target) return null;
                const midX = (source.x + target.x) / 2;
                const pathData = `M ${source.x} ${source.y} C ${midX} ${source.y}, ${midX} ${target.y}, ${target.x} ${target.y}`;
                return (
                  <g key={idx}>
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

              {/* Render Graph Nodes */}
              {graphNodes.map(node => {
                const isSelected = selectedGraphNode === node.id;
                const isCurrent = currentTime >= node.startSec && currentTime < (node.startSec + 300);
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className={`lv-graph-node ${isSelected ? 'selected' : ''} ${isCurrent ? 'current' : ''}`}
                    onClick={() => setSelectedGraphNode(node.id)}
                  >
                    {isCurrent && (
                      <circle
                        r={node.r + 10}
                        fill="none"
                        stroke={node.color}
                        strokeWidth="2"
                        className="lv-graph-node-pulse"
                      />
                    )}

                    <circle
                      r={node.r}
                      fill="var(--bg-surface)"
                      stroke={isSelected ? '#1588C7' : node.color}
                      strokeWidth={isSelected ? 3.5 : 2}
                      filter="url(#glow)"
                    />

                    <circle
                      r={node.r - 5}
                      fill={node.color}
                      fillOpacity="0.16"
                    />

                    <text
                      y="-6"
                      textAnchor="middle"
                      fill="var(--text-primary)"
                      fontSize="12.5"
                      fontWeight="800"
                      fontFamily="var(--font-heading)"
                    >
                      {node.label}
                    </text>

                    <text
                      y="12"
                      textAnchor="middle"
                      fill="var(--text-secondary)"
                      fontSize="9.5"
                      fontWeight="600"
                    >
                      {node.tag}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Node Details Bar */}
          {activeGraphNodeObj && (
            <div className="lv-graph-card animate-pop">
              <div className="lv-graph-card__head">
                <div className="lv-graph-card__title-group">
                  <span
                    className="lv-graph-card__dot"
                    style={{ backgroundColor: activeGraphNodeObj.color }}
                  />
                  <h4 className="lv-graph-card__title">{activeGraphNodeObj.label}</h4>
                  <span className="lv-graph-card__tag">{activeGraphNodeObj.tag}</span>
                </div>

                <button
                  className="lv-graph-card__jump-btn"
                  onClick={() => {
                    seekTo(activeGraphNodeObj.startSec);
                    setIsPlaying(true);
                  }}
                >
                  <Play size={13} fill="currentColor" />
                  <span>{lang === 'ar' ? `تشغيل الحصة من هذه النقطة (${fmt(activeGraphNodeObj.startSec)})` : `Play from ${fmt(activeGraphNodeObj.startSec)}`}</span>
                </button>
              </div>

              <p className="lv-graph-card__desc">{activeGraphNodeObj.desc}</p>
            </div>
          )}
        </div>
      )}

      {/* ── SUB-MODE 2: Concept Cards Roadmap (خريطة البطاقات) ── */}
      {roadmapViewMode === 'cards' && (
        <>
          {/* Overall Lesson Progress */}
          <div className="lv-km__progress">
            <div className="lv-km__progress-bar">
              <div className="lv-km__progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="lv-km__progress-text">
              {progress}% {lang === 'ar' ? 'مكتمل من المعرفة التراكمية لهذه الحصة' : 'completed of roadmap'}
            </span>
          </div>

          {/* Central Node Badge */}
          <div className="lv-km__center-badge">
            <Sparkles size={14} />
            <span>{lang === 'ar' ? 'المفهوم الجوهري: حركية الطاقة وانشطار الماء وتثبيت الكربون' : 'Core Concept: Photosynthesis Energy Transfer'}</span>
          </div>

          {/* Concept Roadmap Cards */}
          <div className="lv-km__grid">
            {lesson.chapters.map((ch, i) => {
              const isDone = currentTime >= ch.endSec;
              const isCurrent = currentCh.id === ch.id;
              const isExpanded = expandedConcept === ch.id;
              const isMastered = !!masteredConcepts[ch.id];
              const chProgress = isCurrent
                ? Math.min(100, Math.max(0, ((currentTime - ch.startSec) / (ch.endSec - ch.startSec)) * 100))
                : isDone ? 100 : 0;

              return (
                <div
                  key={ch.id}
                  className={`lv-concept ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''} ${isExpanded ? 'expanded' : ''}`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                  onClick={() => setExpandedConcept(isExpanded ? null : ch.id)}
                >
                  <div className="lv-concept__status">
                    {isDone ? (
                      <CheckCircle2 size={18} />
                    ) : isCurrent ? (
                      <Play size={14} fill="currentColor" />
                    ) : (
                      <Lock size={14} />
                    )}
                  </div>

                  <div className="lv-concept__body">
                    <div className="lv-concept__head">
                      <span className="lv-concept__num">{lang === 'ar' ? `المحطة ${ch.id}` : `Node ${ch.id}`}</span>
                      <span className="lv-concept__time">{fmt(ch.startSec)} — {fmt(ch.endSec)}</span>
                    </div>
                    <h4 className="lv-concept__title">{ch.titleAr}</h4>

                    <div className="lv-concept__bar">
                      <div className="lv-concept__bar-fill" style={{ width: `${chProgress}%` }} />
                    </div>

                    {isExpanded && (
                      <div className="lv-concept__details" onClick={e => e.stopPropagation()}>
                        <p className="lv-concept__desc">{ch.descAr}</p>
                        <div className="lv-concept__terms">
                          <span className="lv-concept__terms-label">
                            {lang === 'ar' ? 'المصطلحات المحورية:' : 'Key Terms:'}
                          </span>
                          {ch.keyTerms.map(t => (
                            <span key={t} className="lv-concept__term">{t}</span>
                          ))}
                        </div>
                        <div className="lv-concept__actions">
                          <button
                            className="lv-concept__jump"
                            onClick={() => {
                              seekTo(ch.startSec);
                              setIsPlaying(true);
                            }}
                          >
                            <Play size={12} fill="currentColor" />
                            <span>{lang === 'ar' ? `انتقل لهذا الجزء في الحصة (${fmt(ch.startSec)})` : `Jump to ${fmt(ch.startSec)}`}</span>
                          </button>

                          <button
                            className={`lv-concept__mastery ${isMastered ? 'mastered' : ''}`}
                            onClick={() => handleToggleMasteredClick(ch)}
                          >
                            {isMastered ? <CheckSquare size={14} /> : <Square size={14} />}
                            <span>{isMastered ? (lang === 'ar' ? 'تم استيعاب المفهوم' : 'Mastered') : (lang === 'ar' ? 'تأكيد الاستيعاب' : 'Mark Mastered')}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <ChevronDown size={15} className={`lv-concept__chevron ${isExpanded ? 'open' : ''}`} />
                </div>
              );
            })}
          </div>

          {/* Learning Outcomes Checklist */}
          <div className="lv-km__outcomes">
            <h3 className="lv-km__outcomes-title">
              <Target size={16} />
              <span>{lang === 'ar' ? 'نواتج التعلم المستهدفة طبقاً لمواصفات الوزارة' : 'Target Learning Outcomes'}</span>
            </h3>
            {[
              'تفسير معادلة البناء الضوئي وحركية انتقال الإلكترونات المستثارة عبر أغشية الثيلاكويد.',
              'البرهنة بالدليل التجريبي على دور الماء كمصدر للأكسجين المتصاعد باستخدام نظائر O18 المشعة.',
              'الربط بين مركبات الطاقة المختزنة NADPH2 و ATP وتفاعلات تثبيت غاز CO2 في ستروما البلاستيدة وتكوين PGAL.',
            ].map((outcome, i) => (
              <div key={i} className="lv-km__outcome" style={{ animationDelay: `${i * 0.1}s` }}>
                <Check size={14} className="lv-km__outcome-icon" />
                <span>{outcome}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
