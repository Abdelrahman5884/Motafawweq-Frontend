import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Search, 
  Layers, 
  Sparkles, 
  X, 
  Check, 
  Info,
  Clock,
  BookOpen
} from 'lucide-react';

export const NotebookMindMapCanvas = ({
  treeData,
  onNodeClick,
  onJumpToTimestamp,
  lang = 'ar',
  isRtl = true
}) => {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 60, y: 180 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);

  // Set of node IDs that are expanded
  // By default, expand root and level-1 children
  const [expandedNodeIds, setExpandedNodeIds] = useState(() => {
    const defaultExpanded = new Set();
    if (treeData) {
      defaultExpanded.add(treeData.id);
      if (treeData.children) {
        treeData.children.forEach(c => defaultExpanded.add(c.id));
      }
    }
    return defaultExpanded;
  });

  const toggleExpand = (nodeId, e) => {
    if (e) e.stopPropagation();
    setExpandedNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allIds = new Set();
    const traverse = (node) => {
      allIds.add(node.id);
      if (node.children) node.children.forEach(traverse);
    };
    if (treeData) traverse(treeData);
    setExpandedNodeIds(allIds);
  };

  const collapseAll = () => {
    const rootOnly = new Set();
    if (treeData) rootOnly.add(treeData.id);
    setExpandedNodeIds(rootOnly);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: isRtl ? 100 : 80, y: 200 });
  };

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.interactive-node-btn') || e.target.closest('.canvas-control-btn')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom(prev => Math.min(2.0, Math.max(0.4, prev * zoomFactor)));
  };

  // Layout calculation for horizontal tree
  const { renderedNodes, renderedEdges, canvasBounds } = useMemo(() => {
    if (!treeData) return { renderedNodes: [], renderedEdges: [], canvasBounds: { width: 1200, height: 800 } };

    const nodesList = [];
    const edgesList = [];
    let currentY = 0;

    const NODE_WIDTH = 240;
    const HORIZONTAL_GAP = 140;
    const ROW_HEIGHT = 68;

    // First pass: calculate subtree heights
    const calculateHeights = (node) => {
      const isExpanded = expandedNodeIds.has(node.id);
      if (!isExpanded || !node.children || node.children.length === 0) {
        node._height = ROW_HEIGHT;
        return ROW_HEIGHT;
      }
      let totalH = 0;
      node.children.forEach(child => {
        totalH += calculateHeights(child);
      });
      node._height = Math.max(ROW_HEIGHT, totalH);
      return node._height;
    };

    calculateHeights(treeData);

    // Second pass: assign (X, Y) positions
    const layoutNode = (node, depth, topY) => {
      const isExpanded = expandedNodeIds.has(node.id);
      const x = depth * (NODE_WIDTH + HORIZONTAL_GAP);
      const y = topY + (node._height / 2);

      const nodeObj = {
        ...node,
        x,
        y,
        depth,
        isExpanded,
        hasChildren: Boolean(node.children && node.children.length > 0)
      };
      nodesList.push(nodeObj);

      if (isExpanded && node.children) {
        let childTopY = topY;
        node.children.forEach(child => {
          layoutNode(child, depth + 1, childTopY);
          
          // Edge from parent to child
          const childX = (depth + 1) * (NODE_WIDTH + HORIZONTAL_GAP);
          const childY = childTopY + (child._height / 2);

          edgesList.push({
            id: `edge-${node.id}-${child.id}`,
            fromX: x + (NODE_WIDTH / 2),
            fromY: y,
            toX: childX - (NODE_WIDTH / 2),
            toY: childY
          });

          childTopY += child._height;
        });
      }
    };

    layoutNode(treeData, 0, 0);

    return {
      renderedNodes: nodesList,
      renderedEdges: edgesList,
      canvasBounds: { width: 2200, height: Math.max(1000, currentY + 400) }
    };
  }, [treeData, expandedNodeIds]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '620px',
        backgroundColor: '#131518',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #232730',
        userSelect: 'none',
        boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
        direction: 'ltr' // Always LTR coordinates for SVG geometry, RTL styling inside text cards
      }}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Background Dot Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, #2A303C 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: 0.7,
        pointerEvents: 'none'
      }} />

      {/* Top Floating Control Bar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20,
        pointerEvents: 'none',
        gap: '12px'
      }}>
        {/* Left: Search filter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#1E222B',
          border: '1px solid #323A48',
          borderRadius: '12px',
          padding: '6px 14px',
          pointerEvents: 'auto',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          direction: isRtl ? 'rtl' : 'ltr'
        }}>
          <Search size={15} color="#94A3B8" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث في مفاهيم الخريطة...' : 'Search mind map concepts...'}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFFFFF',
              fontSize: '12.5px',
              width: '180px',
              fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex' }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Right: Expand/Collapse & Zoom controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'auto'
        }}>
          {/* Expand All / Collapse All */}
          <div style={{
            display: 'flex',
            backgroundColor: '#1E222B',
            border: '1px solid #323A48',
            borderRadius: '10px',
            padding: '3px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
          }}>
            <button
              onClick={expandAll}
              className="canvas-control-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#CBD5E1',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
              }}
              title={lang === 'ar' ? 'توسيع كل العقد' : 'Expand All'}
            >
              {lang === 'ar' ? 'توسيع الكل' : 'Expand All'}
            </button>
            <button
              onClick={collapseAll}
              className="canvas-control-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
              }}
              title={lang === 'ar' ? 'طي كل الفروع' : 'Collapse All'}
            >
              {lang === 'ar' ? 'طي الكل' : 'Collapse'}
            </button>
          </div>

          {/* Zoom controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1E222B',
            border: '1px solid #323A48',
            borderRadius: '10px',
            padding: '4px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            gap: '2px'
          }}>
            <button
              onClick={() => setZoom(prev => Math.min(2.0, prev + 0.15))}
              className="canvas-control-btn"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#CBD5E1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(0.4, prev - 0.15))}
              className="canvas-control-btn"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#CBD5E1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={resetView}
              className="canvas-control-btn"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#CBD5E1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Reset View"
            >
              <RotateCcw size={14} />
            </button>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', padding: '0 6px' }}>
              {Math.round(zoom * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* SVG Canvas with Zoom & Pan */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          position: 'absolute',
          top: 0,
          left: 0,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <svg
          width={canvasBounds.width}
          height={canvasBounds.height}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Render Smooth Cubic Bezier Curves */}
          {renderedEdges.map(edge => {
            const dx = edge.toX - edge.fromX;
            // Control points for organic S-curve
            const c1x = edge.fromX + dx * 0.55;
            const c1y = edge.fromY;
            const c2x = edge.toX - dx * 0.55;
            const c2y = edge.toY;
            const pathD = `M ${edge.fromX} ${edge.fromY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${edge.toX} ${edge.toY}`;

            return (
              <g key={edge.id}>
                {/* Glow under-path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#edgeGlow)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* Main line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#curveGradient)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        {/* Render Node HTML Elements */}
        {renderedNodes.map(node => {
          const isRoot = node.depth === 0;
          const isL1 = node.depth === 1;
          const isMatched = searchQuery && (
            (node.label && node.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (node.labelAr && node.labelAr.toLowerCase().includes(searchQuery.toLowerCase()))
          );

          return (
            <div
              key={node.id}
              onClick={() => {
                setSelectedNode(node);
                if (onNodeClick) onNodeClick(node);
              }}
              style={{
                position: 'absolute',
                left: `${node.x}px`,
                top: `${node.y}px`,
                transform: 'translate(-50%, -50%)',
                width: isRoot ? '280px' : '230px',
                backgroundColor: isRoot 
                  ? '#1E1B4B' 
                  : isL1 
                    ? '#1E2430' 
                    : '#151922',
                border: isMatched
                  ? '2px solid #F59E0B'
                  : isRoot
                    ? '1.5px solid #6366F1'
                    : selectedNode?.id === node.id
                      ? '1.5px solid #38BDF8'
                      : isL1
                        ? '1px solid #333F51'
                        : '1px solid #242D3D',
                borderRadius: isRoot ? '16px' : '12px',
                padding: isRoot ? '14px 18px' : '10px 14px',
                boxShadow: isMatched
                  ? '0 0 20px rgba(245, 158, 11, 0.4)'
                  : isRoot
                    ? '0 10px 30px rgba(99, 102, 241, 0.35)'
                    : '0 6px 18px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                zIndex: isRoot ? 10 : 5,
                direction: isRtl ? 'rtl' : 'ltr'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                e.currentTarget.style.boxShadow = isRoot
                  ? '0 10px 30px rgba(99, 102, 241, 0.35)'
                  : '0 6px 18px rgba(0,0,0,0.3)';
              }}
            >
              {/* Node Title & Details */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  fontSize: isRoot ? '14px' : '12.5px',
                  fontWeight: isRoot ? '800' : '700',
                  color: isRoot ? '#FFFFFF' : '#E2E8F0',
                  lineHeight: 1.35,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
                }}>
                  {lang === 'ar' ? (node.labelAr || node.label) : (node.label || node.labelAr)}
                </div>
                {node.timestamp && (
                  <div style={{
                    fontSize: '10.5px',
                    color: '#94A3B8',
                    marginTop: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    <Clock size={11} color="#38BDF8" />
                    <span>{node.timestamp}</span>
                  </div>
                )}
              </div>

              {/* Expand / Collapse Chevron Button */}
              {node.hasChildren && (
                <button
                  type="button"
                  className="interactive-node-btn"
                  onClick={(e) => toggleExpand(node.id, e)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: node.isExpanded ? '#38BDF8' : '#2A3342',
                    color: node.isExpanded ? '#0F172A' : '#CBD5E1',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                    boxShadow: node.isExpanded ? '0 0 8px rgba(56, 189, 248, 0.6)' : 'none'
                  }}
                  title={node.isExpanded ? (lang === 'ar' ? 'طي الفرع' : 'Collapse') : (lang === 'ar' ? 'توسيع وإظهار المفاهيم' : 'Expand')}
                >
                  {node.isExpanded ? (
                    <ChevronLeft size={14} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
                  ) : (
                    <ChevronRight size={14} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Node Inspector Modal / Drawer */}
      {selectedNode && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: isRtl ? '20px' : 'auto',
          left: isRtl ? 'auto' : '20px',
          maxWidth: '380px',
          width: '90%',
          backgroundColor: '#1E222B',
          border: '1px solid #384252',
          borderRadius: '16px',
          padding: '18px 20px',
          zIndex: 30,
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
          direction: isRtl ? 'rtl' : 'ltr',
          animation: 'fadeScale 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '10.5px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38BDF8'
              }}>
                {selectedNode.depth === 0 ? (lang === 'ar' ? 'المفهوم الجذري' : 'Root Concept') : (lang === 'ar' ? `مستوى ${selectedNode.depth}` : `Level ${selectedNode.depth}`)}
              </span>
              {selectedNode.timestamp && (
                <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                  {selectedNode.timestamp}
                </span>
              )}
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#2A303C',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={13} />
            </button>
          </div>

          <h4 style={{
            fontSize: '15px',
            fontWeight: '800',
            color: '#FFFFFF',
            margin: '0 0 6px 0',
            lineHeight: 1.4,
            fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
          }}>
            {lang === 'ar' ? (selectedNode.labelAr || selectedNode.label) : (selectedNode.label || selectedNode.labelAr)}
          </h4>

          <p style={{
            fontSize: '12.5px',
            color: '#CBD5E1',
            lineHeight: 1.6,
            margin: '0 0 14px 0',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
          }}>
            {selectedNode.summaryAr || selectedNode.summary || (
              lang === 'ar' 
                ? 'مفهوم رئيسي تم استخلاصه وتحليله آلياً من تسجيل الحصة وتصنيفه ضمن شجرة المفاهيم المترابطة.'
                : 'Key core concept automatically extracted and mapped from the lesson lecture.'
            )}
          </p>

          {selectedNode.timestamp && (
            <button
              onClick={() => {
                if (onJumpToTimestamp && selectedNode.seconds !== undefined) {
                  onJumpToTimestamp(selectedNode.seconds);
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: '#0284C7',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Clock size={13} />
              <span>{lang === 'ar' ? `الاستماع في الحصة (${selectedNode.timestamp})` : `Listen at ${selectedNode.timestamp}`}</span>
            </button>
          )}
        </div>
      )}

      {/* Bottom Hint */}
      <div style={{
        position: 'absolute',
        bottom: '14px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '11px',
        color: '#64748B',
        pointerEvents: 'none',
        backgroundColor: 'rgba(19, 21, 24, 0.85)',
        padding: '4px 12px',
        borderRadius: '20px',
        backdropFilter: 'blur(4px)',
        zIndex: 10,
        fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
      }}>
        {lang === 'ar' 
          ? '💡 اسحب للتحريك • استخدم العجلة للتكبير والتصغير • اضغط > لتوسيع وطي الفروع'
          : '💡 Drag canvas to pan • Scroll to zoom • Click > to toggle branches'}
      </div>
    </div>
  );
};
export default NotebookMindMapCanvas;
