import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Play, 
  HelpCircle, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  X,
  Layers,
  Compass
} from 'lucide-react';

export const KnowledgeMapCanvas = ({
  knowledgeMap,
  onJumpToTimestamp = () => {},
  onPracticeQuiz = () => {}
}) => {
  const { lang, isRtl } = useLanguage();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState('node-root');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDraggingNode, setIsDraggingNode] = useState(null);

  // Local state for draggable node coordinates
  const initialNodes = knowledgeMap?.nodes || [];
  const [nodes, setNodes] = useState(initialNodes);

  // Derive links/edges between nodes (hierarchical links based on level & category)
  const links = [
    { from: 'node-root', to: 'node-chloro' },
    { from: 'node-root', to: 'node-light' },
    { from: 'node-root', to: 'node-dark' },
    { from: 'node-root', to: 'node-factors' },
    { from: 'node-chloro', to: 'node-pigments' },
    { from: 'node-light', to: 'node-photolysis' },
    { from: 'node-light', to: 'node-nadph' },
    { from: 'node-dark', to: 'node-rubisco' },
    { from: 'node-dark', to: 'node-pgal' },
    { from: 'node-factors', to: 'node-blackman' }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const categoryColors = {
    core: 'var(--primary, #1588C7)',
    structure: '#4C8DFF',
    process: '#06B6D4',
    energy: '#F59E0B'
  };

  const handleZoom = (delta) => {
    setZoom(prev => Math.min(1.8, Math.max(0.6, prev + delta)));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Node Dragging Handler
  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setIsDraggingNode({
      id: nodeId,
      startX: e.clientX,
      startY: e.clientY
    });
  };

  const handleMouseMove = (e) => {
    if (!isDraggingNode) return;
    const dx = (e.clientX - isDraggingNode.startX) / zoom;
    const dy = (e.clientY - isDraggingNode.startY) / zoom;

    setNodes(prev => prev.map(node => {
      if (node.id === isDraggingNode.id) {
        return {
          ...node,
          x: node.x + dx,
          y: node.y + dy
        };
      }
      return node;
    }));

    setIsDraggingNode({
      id: isDraggingNode.id,
      startX: e.clientX,
      startY: e.clientY
    });
  };

  const handleMouseUp = () => {
    setIsDraggingNode(null);
  };

  // Filter nodes
  const filteredNodes = nodes.filter(n => {
    const matchesCat = filterCategory === 'all' || n.category === filterCategory;
    const matchesSearch = !searchQuery || 
      (n.label && n.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.labelAr && n.labelAr.includes(searchQuery));
    return matchesCat && matchesSearch;
  });

  return (
    <div 
      style={{
        position: 'relative',
        height: '620px',
        backgroundColor: 'var(--bg-app)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-medium)',
        overflow: 'hidden',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Floating Controls Bar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: isRtl ? 'auto' : '16px',
        right: isRtl ? '16px' : 'auto',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'var(--bg-surface-elevated)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { id: 'all', label: lang === 'ar' ? 'الكل' : 'All' },
            { id: 'structure', label: lang === 'ar' ? 'تراكيب' : 'Anatomy', color: categoryColors.structure },
            { id: 'process', label: lang === 'ar' ? 'تفاعلات' : 'Reactions', color: categoryColors.process },
            { id: 'energy', label: lang === 'ar' ? 'طاقة' : 'Energy', color: categoryColors.energy }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: filterCategory === tab.id ? (tab.color || 'var(--primary)') : 'transparent',
                color: filterCategory === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Zoom Controls */}
        <button
          onClick={() => handleZoom(0.15)}
          title="Zoom In"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={() => handleZoom(-0.15)}
          title="Zoom Out"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={handleReset}
          title="Reset View"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Concept Search inside Map */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: isRtl ? '16px' : 'auto',
        right: isRtl ? 'auto' : '16px',
        zIndex: 20,
        width: '220px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'بحث في الخريطة...' : 'Filter concept...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '12px',
              color: 'var(--text-primary)',
              width: '100%',
              fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-latin)'
            }}
          />
        </div>
      </div>

      {/* SVG Canvas for Draggable Graph */}
      <svg
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          cursor: isDraggingNode ? 'grabbing' : 'default'
        }}
      >
        <defs>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary, #1588C7)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4C8DFF" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Grid Pattern */}
        <g opacity="0.3">
          {Array.from({ length: 25 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 30} x2="100%" y2={i * 30} stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3 3" />
          ))}
          {Array.from({ length: 40 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 30} y1="0" x2={i * 30} y2="100%" stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3 3" />
          ))}
        </g>

        {/* Zoomed & Panned Group */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} transform-origin="center">
          {/* Connection Lines */}
          {links.map((link, idx) => {
            const source = nodes.find(n => n.id === link.from);
            const target = nodes.find(n => n.id === link.to);
            if (!source || !target) return null;

            const isHighlighted = selectedNodeId === source.id || selectedNodeId === target.id;

            return (
              <g key={`edge-${idx}`}>
                <path
                  d={`M ${source.x} ${source.y} Q ${(source.x + target.x) / 2} ${(source.y + target.y) / 2 - 30} ${target.x} ${target.y}`}
                  fill="none"
                  stroke={isHighlighted ? 'var(--primary)' : 'var(--border-medium)'}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  strokeDasharray={isHighlighted ? 'none' : '4 4'}
                  opacity={isHighlighted ? 1 : 0.6}
                  style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                />
              </g>
            );
          })}

          {/* Interactive Nodes */}
          {filteredNodes.map(node => {
            const isSelected = selectedNodeId === node.id;
            const nodeColor = categoryColors[node.category] || 'var(--primary)';
            const isRoot = node.level === 0;
            const radius = isRoot ? 32 : (node.level === 1 ? 24 : 18);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                onClick={() => setSelectedNodeId(node.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Node Outer Glow when selected */}
                {isSelected && (
                  <circle
                    r={radius + 8}
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    opacity="0.8"
                    className="animate-pulse"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  r={radius}
                  fill={isSelected ? nodeColor : 'var(--bg-surface)'}
                  stroke={nodeColor}
                  strokeWidth={isSelected ? 3 : 2}
                  filter={isSelected ? 'url(#glow)' : 'none'}
                  style={{ transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />

                {/* Node Center Dot or Icon */}
                <circle
                  r={radius * 0.4}
                  fill={isSelected ? '#FFFFFF' : nodeColor}
                />

                {/* Timestamp Pill above Node */}
                <g transform="translate(0, -28)">
                  <rect
                    x="-20"
                    y="-9"
                    width="40"
                    height="16"
                    rx="8"
                    fill="var(--bg-surface-elevated)"
                    stroke="var(--border-subtle)"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="700"
                    fill="var(--primary)"
                    fontFamily="var(--font-mono)"
                  >
                    {node.timestamp}
                  </text>
                </g>

                {/* Node Label Text */}
                <text
                  x="0"
                  y={radius + 16}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight={isSelected ? '800' : '600'}
                  fill="var(--text-primary)"
                  fontFamily={isRtl ? 'var(--font-arabic)' : 'var(--font-latin)'}
                  style={{ pointerEvents: 'none', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
                >
                  {lang === 'ar' ? node.labelAr : node.label}
                </text>

                {/* Mastery badge pill below label */}
                <text
                  x="0"
                  y={radius + 30}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill={node.mastery < 75 ? '#EF4444' : 'var(--text-muted)'}
                  style={{ pointerEvents: 'none' }}
                >
                  {node.mastery}% {lang === 'ar' ? 'إتقان' : 'mastery'}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Slide-out / Bottom Node Detail Card */}
      {selectedNode && (
        <div 
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: `1.5px solid ${categoryColors[selectedNode.category] || 'var(--primary)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-lg)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            zIndex: 30
          }}
          className="animate-slide-up"
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: `${categoryColors[selectedNode.category]}20`,
                color: categoryColors[selectedNode.category]
              }}>
                {selectedNode.category.toUpperCase()}
              </span>

              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: selectedNode.mastery < 75 ? '#FEF2F2' : '#ECFDF5',
                color: selectedNode.mastery < 75 ? '#EF4444' : '#10B981'
              }}>
                {lang === 'ar' ? `مستوى الفهم: ${selectedNode.mastery}%` : `Mastery: ${selectedNode.mastery}%`}
              </span>

              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                • {selectedNode.quizCount} {lang === 'ar' ? 'أسئلة مولدة' : 'Questions'}
              </span>
            </div>

            <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? selectedNode.labelAr : selectedNode.label}
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
              {lang === 'ar' ? selectedNode.summaryAr : selectedNode.summary}
            </p>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => onJumpToTimestamp(selectedNode.seconds)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(21, 136, 199, 0.3)'
              }}
            >
              <Play size={13} fill="#FFFFFF" />
              <span>{lang === 'ar' ? `سماع الشرح (${selectedNode.timestamp})` : `Listen at ${selectedNode.timestamp}`}</span>
            </button>

            <button
              onClick={() => onPracticeQuiz(selectedNode.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontWeight: '600',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <HelpCircle size={14} color="var(--primary)" />
              <span>{lang === 'ar' ? 'تدرب على هذا المفهوم' : 'Practice Concept'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
