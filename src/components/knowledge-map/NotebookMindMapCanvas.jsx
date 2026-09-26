import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Search, 
  Layers, 
  Sparkles, 
  X, 
  Check, 
  Info,
  Clock,
  BookOpen,
  Compass,
  Smartphone
} from 'lucide-react';

export const NotebookMindMapCanvas = ({
  treeData,
  onNodeClick,
  onJumpToTimestamp,
  lang = 'ar',
  isRtl = true
}) => {
  const containerRef = useRef(null);

  // Check if screen is mobile initially
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Zoom & Pan state
  const [zoom, setZoom] = useState(isMobile ? 0.72 : 0.95);
  const [pan, setPan] = useState(isMobile ? { x: 20, y: 160 } : { x: 60, y: 180 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mobile search drawer / toggle
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);

  // Touch tracking for pinch-to-zoom & mobile panning
  const touchStartRef = useRef({ x: 0, y: 0, dist: 0 });

  // Set of node IDs that are expanded
  const [expandedNodeIds, setExpandedNodeIds] = useState(() => {
    const defaultExpanded = new Set();
    if (treeData) {
      defaultExpanded.add(treeData.id);
      if (treeData.children) {
        // On mobile, expand fewer nodes by default so it's not overcrowded
        if (isMobile) {
          if (treeData.children[0]) defaultExpanded.add(treeData.children[0].id);
        } else {
          treeData.children.forEach(c => defaultExpanded.add(c.id));
        }
      }
    }
    return defaultExpanded;
  });

  // Recenter root node within the container
  const recenter = (customZoom = null) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cWidth = rect.width || window.innerWidth;
    const cHeight = rect.height || (isMobile ? 540 : 640);
    const isMob = cWidth < 768;
    const z = customZoom !== null ? customZoom : (isMob ? 0.72 : 0.95);

    const rootH = treeData?._height || 350;
    const rootY = rootH / 2;

    const targetX = isMob ? 16 : 40;
    const targetY = Math.max(60, (cHeight / 2) - (rootY * z));

    setZoom(z);
    setPan({ x: targetX, y: targetY });
  };

  // Recenter on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      recenter();
    }, 150);
    return () => clearTimeout(timer);
  }, [treeData]);

  // Recenter when fullscreen changes
  useEffect(() => {
    const timer = setTimeout(() => {
      recenter();
    }, 100);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

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
    recenter();
  };

  // Toggle fullscreen with Fullscreen API support + Fallback
  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (containerRef.current?.webkitRequestFullscreen) {
          await containerRef.current.webkitRequestFullscreen();
        }
      } catch (err) {
        // Fallback to overlay (already set via isFullscreen = true)
      }
    } else {
      setIsFullscreen(false);
      try {
        if (document.exitFullscreen && document.fullscreenElement) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen && document.webkitFullscreenElement) {
          await document.webkitFullscreenElement();
        }
      } catch (err) {
        // Fallback
      }
    }
  };

  // Sync with browser native fullscreen changes (e.g. Android back button or Esc)
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      if (!isFs && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, [isFullscreen]);

  // Close fullscreen on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.interactive-node-btn') || e.target.closest('.canvas-control-btn') || e.target.closest('.node-card-inner')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - dragStart.y || e.clientY - pan.y });
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

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (e.target.closest('.interactive-node-btn') || e.target.closest('.canvas-control-btn')) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    } else if (e.touches.length === 2) {
      // Pinch to zoom
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current = { dist, initialZoom: zoom };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    } else if (e.touches.length === 2 && touchStartRef.current.dist > 0) {
      // Pinch zoom calculation
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartRef.current.dist;
      const newZoom = Math.min(2.2, Math.max(0.35, touchStartRef.current.initialZoom * factor));
      setZoom(newZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current.dist = 0;
  };

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom(prev => Math.min(2.2, Math.max(0.35, prev * zoomFactor)));
  };

  // Layout calculation for horizontal tree
  const { renderedNodes, renderedEdges, canvasBounds } = useMemo(() => {
    if (!treeData) return { renderedNodes: [], renderedEdges: [], canvasBounds: { width: 1400, height: 900 } };

    const nodesList = [];
    const edgesList = [];
    let currentY = 0;

    const NODE_WIDTH = isMobile ? 210 : 250;
    const HORIZONTAL_GAP = isMobile ? 100 : 130;
    const ROW_HEIGHT = isMobile ? 64 : 70;

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

    const ROOT_OFFSET_X = (NODE_WIDTH / 2) + (isMobile ? 24 : 40);

    // Second pass: assign (X, Y) positions
    const layoutNode = (node, depth, topY) => {
      const isExpanded = expandedNodeIds.has(node.id);
      const x = ROOT_OFFSET_X + depth * (NODE_WIDTH + HORIZONTAL_GAP);
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
      canvasBounds: { width: 2600, height: Math.max(1200, currentY + 500) }
    };
  }, [treeData, expandedNodeIds, isMobile]);

  return (
    <div
      style={{
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 999999 : 1,
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : (isMobile ? '520px' : '640px'),
        backgroundColor: '#111317',
        borderRadius: isFullscreen ? 0 : '20px',
        overflow: 'hidden',
        border: isFullscreen ? 'none' : '1px solid #232730',
        userSelect: 'none',
        boxShadow: isFullscreen ? 'none' : '0 20px 50px rgba(0,0,0,0.5)',
        direction: 'ltr',
        touchAction: 'none' // Prevent browser default scrolling during canvas pan
      }}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Dot Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, #2A303C 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: 0.65,
        pointerEvents: 'none'
      }} />

      {/* Top Floating Control Bar - Fully Responsive */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20,
        pointerEvents: 'none',
        gap: '8px'
      }}>
        {/* Left: Search (Collapsible on Mobile) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#1E222B',
          border: '1px solid #323A48',
          borderRadius: '12px',
          padding: '6px 10px',
          pointerEvents: 'auto',
          boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          direction: isRtl ? 'rtl' : 'ltr'
        }}>
          <Search size={14} color="#94A3B8" />
          {(!isMobile || searchOpen) && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث...' : 'Search...'}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: '12px',
                width: isMobile ? '120px' : '170px',
                fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
              }}
            />
          )}
          {isMobile && !searchOpen && (
            <button
              onClick={() => setSearchOpen(true)}
              style={{ background: 'transparent', border: 'none', color: '#CBD5E1', fontSize: '11px', cursor: 'pointer', padding: 0 }}
            >
              {lang === 'ar' ? 'بحث' : 'Search'}
            </button>
          )}
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                if (isMobile) setSearchOpen(false);
              }}
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex' }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Right: Expand/Collapse, Zoom & Fullscreen buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'auto'
        }}>
          {/* Expand/Collapse pills */}
          {!isMobile && (
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
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
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
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'طي الكل' : 'Collapse'}
              </button>
            </div>
          )}

          {/* Zoom controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1E222B',
            border: '1px solid #323A48',
            borderRadius: '10px',
            padding: '3px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            gap: '1px'
          }}>
            <button
              onClick={() => setZoom(prev => Math.min(2.2, prev + 0.15))}
              className="canvas-control-btn"
              style={{
                width: '26px',
                height: '26px',
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
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(0.35, prev - 0.15))}
              className="canvas-control-btn"
              style={{
                width: '26px',
                height: '26px',
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
              <ZoomOut size={14} />
            </button>
            <button
              onClick={resetView}
              className="canvas-control-btn"
              style={{
                width: '26px',
                height: '26px',
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
              <RotateCcw size={13} />
            </button>
          </div>

          {/* FULLSCREEN BUTTON (Highlighted on Mobile) */}
          <button
            onClick={toggleFullscreen}
            className="canvas-control-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: isMobile ? '6px 10px' : '6px 12px',
              borderRadius: '10px',
              backgroundColor: isFullscreen ? '#EF4444' : '#0284C7',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
              transition: 'transform 0.15s ease'
            }}
            title={isFullscreen ? (lang === 'ar' ? 'تصغير' : 'Exit Fullscreen') : (lang === 'ar' ? 'ملء الشاشة' : 'Fullscreen')}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span>{isFullscreen ? (lang === 'ar' ? 'تصغير' : 'Exit') : (lang === 'ar' ? 'ملء الشاشة' : 'Full')}</span>
          </button>
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
            <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="glowUnder" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Render Smooth Cubic Bezier Curves */}
          {renderedEdges.map(edge => {
            const dx = edge.toX - edge.fromX;
            const c1x = edge.fromX + dx * 0.55;
            const c1y = edge.fromY;
            const c2x = edge.toX - dx * 0.55;
            const c2y = edge.toY;
            const pathD = `M ${edge.fromX} ${edge.fromY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${edge.toX} ${edge.toY}`;

            return (
              <g key={edge.id}>
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#glowUnder)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#curveGrad)"
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

          const cardWidth = isMobile ? (isRoot ? '230px' : '190px') : (isRoot ? '270px' : '220px');

          return (
            <div
              key={node.id}
              className="node-card-inner"
              onClick={() => {
                setSelectedNode(node);
                if (onNodeClick) onNodeClick(node);
              }}
              style={{
                position: 'absolute',
                left: `${node.x}px`,
                top: `${node.y}px`,
                transform: 'translate(-50%, -50%)',
                width: cardWidth,
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
                borderRadius: isRoot ? '14px' : '11px',
                padding: isMobile ? '8px 12px' : (isRoot ? '12px 16px' : '9px 12px'),
                boxShadow: isMatched
                  ? '0 0 20px rgba(245, 158, 11, 0.4)'
                  : isRoot
                    ? '0 10px 30px rgba(99, 102, 241, 0.35)'
                    : '0 6px 18px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                zIndex: isRoot ? 10 : 5,
                direction: isRtl ? 'rtl' : 'ltr'
              }}
            >
              {/* Node Title & Details */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  fontSize: isMobile ? (isRoot ? '12.5px' : '11.5px') : (isRoot ? '13.5px' : '12px'),
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
                    fontSize: '10px',
                    color: '#94A3B8',
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    <Clock size={10} color="#38BDF8" />
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
                    width: isMobile ? '22px' : '24px',
                    height: isMobile ? '22px' : '24px',
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
                  title={node.isExpanded ? (lang === 'ar' ? 'طي الفرع' : 'Collapse') : (lang === 'ar' ? 'توسيع' : 'Expand')}
                >
                  {node.isExpanded ? (
                    <ChevronLeft size={13} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
                  ) : (
                    <ChevronRight size={13} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
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
          bottom: '16px',
          right: isRtl ? '16px' : 'auto',
          left: isRtl ? 'auto' : '16px',
          maxWidth: isMobile ? 'calc(100% - 32px)' : '380px',
          width: isMobile ? 'calc(100% - 32px)' : '380px',
          backgroundColor: '#1E222B',
          border: '1px solid #384252',
          borderRadius: '16px',
          padding: '16px 18px',
          zIndex: 35,
          boxShadow: '0 16px 40px rgba(0,0,0,0.65)',
          direction: isRtl ? 'rtl' : 'ltr'
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
            fontSize: '14px',
            fontWeight: '800',
            color: '#FFFFFF',
            margin: '0 0 6px 0',
            lineHeight: 1.4,
            fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
          }}>
            {lang === 'ar' ? (selectedNode.labelAr || selectedNode.label) : (selectedNode.label || selectedNode.labelAr)}
          </h4>

          <p style={{
            fontSize: '12px',
            color: '#CBD5E1',
            lineHeight: 1.6,
            margin: '0 0 12px 0',
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
              <Clock size={12} />
              <span>{lang === 'ar' ? `الاستماع في الحصة (${selectedNode.timestamp})` : `Listen at ${selectedNode.timestamp}`}</span>
            </button>
          )}
        </div>
      )}

      {/* Landscape Hint in Fullscreen for Mobile */}
      {isFullscreen && isMobile && (
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid #334155',
          borderRadius: '20px',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#38BDF8',
          fontSize: '11px',
          fontWeight: '700',
          zIndex: 25,
          pointerEvents: 'none'
        }}>
          <Smartphone size={14} />
          <span>{lang === 'ar' ? 'اقلب هاتفك بالعرض (Landscape) لرؤية أوسع للشجرة' : 'Rotate phone to landscape for best view'}</span>
        </div>
      )}
    </div>
  );
};
export default NotebookMindMapCanvas;
