import React, { useState, useRef, useEffect, useMemo, useCallback, useId } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Search, 
  X, 
  Check, 
  Clock, 
  Download, 
  Loader2, 
  Smartphone,
  FolderTree
} from 'lucide-react';
import { exportMindMapToPng } from '../../utils/mindMapExporter';

export const NotebookMindMapCanvas = ({
  treeData,
  lessonTitle = '',
  unitTitle = '',
  onNodeClick,
  onJumpToTimestamp,
  lang = 'ar',
  isRtl = true
}) => {
  const containerRef = useRef(null);
  const isFirstRender = useRef(true);
  const rawUid = useId();
  const svgUid = rawUid.replace(/[^a-zA-Z0-9_-]/g, '');

  // Check if screen is mobile
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      const mob = window.innerWidth < 768;
      setIsMobile(mob);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Zoom & Pan state
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mobile search drawer / toggle
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);

  // PNG Export state & toast
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [exportFeedback, setExportFeedback] = useState(null);

  // Touch tracking for pinch-to-zoom & mobile panning
  const touchStartRef = useRef({ x: 0, y: 0, dist: 0 });

  // Set of node IDs that are expanded (expand rich multi-level branches up to depth 2, or ALL when <= 36 nodes)
  const [expandedNodeIds, setExpandedNodeIds] = useState(() => {
    const defaultExpanded = new Set();
    if (!treeData) return defaultExpanded;

    let totalNodes = 0;
    const countNodes = (n) => {
      totalNodes += 1;
      if (Array.isArray(n.children)) n.children.forEach(countNodes);
    };
    countNodes(treeData);

    const maxDefaultDepth = totalNodes <= 36 ? 6 : 2;
    const collect = (n, depth) => {
      if (depth <= maxDefaultDepth) {
        defaultExpanded.add(n.id);
        if (Array.isArray(n.children)) {
          n.children.forEach((c) => collect(c, depth + 1));
        }
      }
    };
    collect(treeData, 0);
    return defaultExpanded;
  });

  // Dynamic Card sizing (room for full 2-line Arabic branch titles without truncation)
  const getCardWidth = useCallback((depth) => {
    if (depth === 0) return isMobile ? 210 : 265;
    if (depth === 1) return isMobile ? 190 : 235;
    return isMobile ? 175 : 220;
  }, [isMobile]);

  const getCardHeight = useCallback((depth) => {
    if (depth === 0) return isMobile ? 60 : 68;
    return isMobile ? 56 : 64;
  }, [isMobile]);

  const GAP_X = isMobile ? 55 : 88;
  const ROW_HEIGHT = isMobile ? 66 : 78;

  // Layout calculation for horizontal tree
  const { renderedNodes, renderedEdges, treeBounds, canvasBounds } = useMemo(() => {
    if (!treeData) {
      return { 
        renderedNodes: [], 
        renderedEdges: [], 
        treeBounds: { minX: 0, maxX: 100, minY: 0, maxY: 100, width: 100, height: 100 },
        canvasBounds: { width: 1400, height: 900 } 
      };
    }

    const nodesList = [];
    const edgesList = [];

    // Precalculate depth X coordinates
    const depthX = [getCardWidth(0) / 2 + (isMobile ? 24 : 40)];
    for (let d = 1; d <= 12; d++) {
      const prevW = getCardWidth(d - 1);
      const currW = getCardWidth(d);
      depthX[d] = depthX[d - 1] + prevW / 2 + GAP_X + currW / 2;
    }

    // Pure first pass: calculate subtree heights without mutating treeData props
    const subtreeHeights = new Map();
    const calculateHeights = (node) => {
      const isExpanded = expandedNodeIds.has(node.id);
      if (!isExpanded || !node.children || node.children.length === 0) {
        subtreeHeights.set(node, ROW_HEIGHT);
        return ROW_HEIGHT;
      }
      let totalH = 0;
      node.children.forEach(child => {
        totalH += calculateHeights(child);
      });
      const h = Math.max(ROW_HEIGHT, totalH);
      subtreeHeights.set(node, h);
      return h;
    };

    calculateHeights(treeData);

    // Second pass: assign (X, Y) positions
    const layoutNode = (node, depth, topY) => {
      const isExpanded = expandedNodeIds.has(node.id);
      const cardW = getCardWidth(depth);
      const cardH = getCardHeight(depth);
      const nodeH = subtreeHeights.get(node) ?? ROW_HEIGHT;
      const x = depthX[depth] || (depthX[depth - 1] + cardW + GAP_X);
      const y = topY + (nodeH / 2);

      const nodeObj = {
        ...node,
        x,
        y,
        depth,
        cardW,
        cardH,
        isExpanded,
        hasChildren: Boolean(node.children && node.children.length > 0)
      };
      nodesList.push(nodeObj);

      if (isExpanded && node.children && node.children.length > 0) {
        let childTopY = topY;
        node.children.forEach(child => {
          const childH = subtreeHeights.get(child) ?? ROW_HEIGHT;
          layoutNode(child, depth + 1, childTopY);

          const childX = depthX[depth + 1] || (x + cardW / 2 + GAP_X + getCardWidth(depth + 1) / 2);
          const childY = childTopY + (childH / 2);
          const childW = getCardWidth(depth + 1);

          // Bezier curve starts at parent right edge and ends at child left edge
          edgesList.push({
            id: `edge-${node.id}-${child.id}`,
            fromX: x + (cardW / 2),
            fromY: y,
            toX: childX - (childW / 2),
            toY: childY
          });

          childTopY += childH;
        });
      }
    };

    layoutNode(treeData, 0, 0);

    // Compute exact bounding box of all rendered nodes
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    nodesList.forEach(n => {
      minX = Math.min(minX, n.x - n.cardW / 2);
      maxX = Math.max(maxX, n.x + n.cardW / 2);
      minY = Math.min(minY, n.y - n.cardH / 2);
      maxY = Math.max(maxY, n.y + n.cardH / 2);
    });

    const tb = {
      minX: minX === Infinity ? 0 : minX,
      maxX: maxX === -Infinity ? 500 : maxX,
      minY: minY === Infinity ? 0 : minY,
      maxY: maxY === -Infinity ? 400 : maxY,
      width: Math.max(10, maxX - minX),
      height: Math.max(10, maxY - minY)
    };

    return {
      renderedNodes: nodesList,
      renderedEdges: edgesList,
      treeBounds: tb,
      canvasBounds: { 
        width: Math.max(2600, tb.maxX + 400), 
        height: Math.max(1600, tb.maxY + 400) 
      }
    };
  }, [treeData, expandedNodeIds, isMobile, getCardWidth, getCardHeight, GAP_X, ROW_HEIGHT]);

  // Recenter & Auto-Fit to container view
  const fitToView = useCallback((customZoom = null, animate = false) => {
    if (!containerRef.current || !treeBounds || treeBounds.width <= 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cWidth = rect.width || window.innerWidth;
    const cHeight = rect.height || (isMobile ? 520 : 640);
    const isMob = cWidth < 768;

    const padX = isMob ? 16 : 36;
    const padTop = isMob ? 68 : 76;   // Clear top floating toolbar
    const padBottom = isMob ? 20 : 28;

    const availW = Math.max(100, cWidth - padX * 2);
    const availH = Math.max(100, cHeight - padTop - padBottom);

    let targetZoom;
    if (customZoom !== null) {
      targetZoom = customZoom;
    } else {
      const scaleX = availW / treeBounds.width;
      const scaleY = availH / treeBounds.height;
      const optimalScale = Math.min(scaleX, scaleY);
      targetZoom = isMob 
        ? Math.min(0.92, Math.max(0.36, optimalScale))
        : Math.min(1.05, Math.max(0.42, optimalScale));
    }

    const contentCenterX = (treeBounds.minX + treeBounds.maxX) / 2;
    const contentCenterY = (treeBounds.minY + treeBounds.maxY) / 2;

    const screenCenterX = cWidth / 2;
    const screenCenterY = padTop + (availH / 2);

    const targetPanX = screenCenterX - (contentCenterX * targetZoom);
    const targetPanY = screenCenterY - (contentCenterY * targetZoom);

    if (animate) {
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 250);
    }

    setZoom(targetZoom);
    setPan({ x: targetPanX, y: targetPanY });
  }, [treeBounds, isMobile]);

  // Recenter on mount or treeData change
  useEffect(() => {
    const timer = setTimeout(() => {
      fitToView(null, !isFirstRender.current);
      isFirstRender.current = false;
    }, 120);
    return () => clearTimeout(timer);
  }, [fitToView]);

  // Recenter when fullscreen changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fitToView(null, true);
    }, 150);
    return () => clearTimeout(timer);
  }, [isFullscreen, fitToView]);

  // Recenter when orientation/window resize occurs
  useEffect(() => {
    const handleResize = () => {
      fitToView(null, false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitToView]);

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
    // Smoothly re-fit full tree into view
    setTimeout(() => {
      fitToView(null, true);
    }, 50);
  };

  const collapseAll = () => {
    const rootOnly = new Set();
    if (treeData) rootOnly.add(treeData.id);
    setExpandedNodeIds(rootOnly);
    setTimeout(() => {
      fitToView(null, true);
    }, 50);
  };

  const resetView = () => {
    fitToView(null, true);
  };

  // Toggle fullscreen with Fullscreen API support + Fallback
  const toggleFullscreen = useCallback(async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (containerRef.current?.webkitRequestFullscreen) {
          await containerRef.current.webkitRequestFullscreen();
        }
      } catch {
        // Fallback overlay mode
      }
    } else {
      setIsFullscreen(false);
      try {
        if (document.exitFullscreen && document.fullscreenElement) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen && document.webkitFullscreenElement) {
          await document.webkitExitFullscreen();
        }
      } catch {
        // Fallback
      }
    }
  }, [isFullscreen]);

  // Sync with browser native fullscreen events
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
  }, [isFullscreen, toggleFullscreen]);

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.interactive-node-btn') || e.target.closest('.canvas-control-btn') || e.target.closest('.node-card-inner')) return;
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

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (e.target.closest('.interactive-node-btn') || e.target.closest('.canvas-control-btn') || e.target.closest('.node-card-inner')) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    } else if (e.touches.length === 2) {
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
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartRef.current.dist;
      const newZoom = Math.min(2.2, Math.max(0.32, touchStartRef.current.initialZoom * factor));
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
    setZoom(prev => Math.min(2.2, Math.max(0.32, prev * zoomFactor)));
  };

  // Export mind map as high-res PNG with ALL nodes expanded
  const handleExportPng = async () => {
    if (isExportingPng || !treeData) return;
    setIsExportingPng(true);
    setExportFeedback({ status: 'loading', msg: lang === 'ar' ? 'جارِ تجهيز خريطة المفاهيم بدقة فائقة...' : 'Generating high-res PNG...' });

    try {
      await exportMindMapToPng({
        treeData,
        title: lessonTitle || (lang === 'ar' ? treeData.labelAr : treeData.label),
        unitTitle,
        lang,
        isRtl
      });
      setExportFeedback({ status: 'success', msg: lang === 'ar' ? 'تم تنزيل خريطة المفاهيم كاملة كـ صورة PNG بنجاح!' : 'PNG downloaded successfully!' });
      setTimeout(() => setExportFeedback(null), 3500);
    } catch (err) {
      console.error('PNG export failed:', err);
      setExportFeedback({ status: 'error', msg: lang === 'ar' ? 'حدث خطأ أثناء تحميل الصورة' : 'Failed to export PNG' });
      setTimeout(() => setExportFeedback(null), 3000);
    } finally {
      setIsExportingPng(false);
    }
  };

  return (
    <div
      style={{
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 999999 : 1,
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : (isMobile ? '520px' : '640px'),
        backgroundColor: '#0F1218',
        borderRadius: isFullscreen ? 0 : '20px',
        overflow: 'hidden',
        border: isFullscreen ? 'none' : '1px solid #232B3A',
        userSelect: 'none',
        boxShadow: isFullscreen ? 'none' : '0 20px 50px rgba(0,0,0,0.55)',
        direction: 'ltr',
        touchAction: 'none'
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
        backgroundImage: 'radial-gradient(circle, #2A3344 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: 0.7,
        pointerEvents: 'none'
      }} />

      {/* Export / Action Toast Notification */}
      {exportFeedback && (
        <div style={{
          position: 'absolute',
          top: '64px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          borderRadius: '30px',
          backgroundColor: exportFeedback.status === 'success' ? '#065F46' : exportFeedback.status === 'error' ? '#991B1B' : '#1E293B',
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: '700',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.15)',
          animation: 'fadeIn 0.2s ease',
          direction: isRtl ? 'rtl' : 'ltr',
          pointerEvents: 'none'
        }}>
          {exportFeedback.status === 'loading' && <Loader2 size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} />}
          {exportFeedback.status === 'success' && <Check size={14} color="#34D399" />}
          {exportFeedback.status === 'error' && <X size={14} color="#F87171" />}
          <span>{exportFeedback.msg}</span>
        </div>
      )}

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
        gap: '8px',
        flexWrap: 'nowrap'
      }}>
        {/* Left: Search (Collapsible on Mobile) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#181E29',
          border: '1px solid #2C3647',
          borderRadius: '12px',
          padding: isMobile ? '5px 8px' : '6px 12px',
          pointerEvents: 'auto',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          direction: isRtl ? 'rtl' : 'ltr'
        }}>
          <Search size={14} color="#94A3B8" />
          {(!isMobile || searchOpen) && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث في المفاهيم...' : 'Search concepts...'}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: '12px',
                width: isMobile ? '110px' : '160px',
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

        {/* Right: Expand/Collapse, PNG Download, Zoom & Fullscreen */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'auto'
        }}>
          {/* Expand / Collapse All buttons */}
          <div style={{
            display: 'flex',
            backgroundColor: '#181E29',
            border: '1px solid #2C3647',
            borderRadius: '10px',
            padding: '3px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)'
          }}>
            <button
              onClick={expandAll}
              className="canvas-control-btn"
              title={lang === 'ar' ? 'توسيع كامل الشجرة' : 'Expand All'}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#CBD5E1',
                padding: isMobile ? '4px 6px' : '4px 8px',
                borderRadius: '6px',
                fontSize: isMobile ? '10px' : '11px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <FolderTree size={12} color="#38BDF8" />
              <span>{lang === 'ar' ? (isMobile ? 'توسيع' : 'توسيع الكل') : 'Expand'}</span>
            </button>
            <button
              onClick={collapseAll}
              className="canvas-control-btn"
              title={lang === 'ar' ? 'طي الفروع والعودة للمفهوم الجذري' : 'Collapse All'}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                padding: isMobile ? '4px 6px' : '4px 8px',
                borderRadius: '6px',
                fontSize: isMobile ? '10px' : '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {lang === 'ar' ? (isMobile ? 'طي' : 'طي الكل') : 'Collapse'}
            </button>
          </div>

          {/* PRIMARY ACTION: Download as High-Res PNG (All nodes expanded) */}
          <button
            onClick={handleExportPng}
            disabled={isExportingPng}
            className="canvas-control-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: isMobile ? '5px 8px' : '6px 12px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #059669 0%, #0284C7 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: isMobile ? '10.5px' : '11.5px',
              fontWeight: '800',
              cursor: isExportingPng ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.45)',
              transition: 'transform 0.15s ease',
              whiteSpace: 'nowrap'
            }}
            title={lang === 'ar' ? 'تحميل خريطة المفاهيم كاملة كـ صورة عالية الدقة PNG (كامل الشجرة مفتوحة ومتسنترة)' : 'Download Full Mind Map as High-Res PNG'}
          >
            {isExportingPng ? (
              <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Download size={13} />
            )}
            <span>
              {isExportingPng 
                ? (lang === 'ar' ? 'جارِ التحميل...' : 'Exporting...') 
                : (isMobile 
                    ? 'PNG' 
                    : (lang === 'ar' ? 'تحميل PNG (الشجرة كاملة)' : 'Download PNG'))
              }
            </span>
          </button>

          {/* Zoom controls & Fit to View */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#181E29',
            border: '1px solid #2C3647',
            borderRadius: '10px',
            padding: '3px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
            gap: '1px'
          }}>
            <button
              onClick={() => setZoom(prev => Math.min(2.2, prev + 0.15))}
              className="canvas-control-btn"
              style={{
                width: isMobile ? '24px' : '26px',
                height: isMobile ? '24px' : '26px',
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
              <ZoomIn size={13} />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(0.32, prev - 0.15))}
              className="canvas-control-btn"
              style={{
                width: isMobile ? '24px' : '26px',
                height: isMobile ? '24px' : '26px',
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
              <ZoomOut size={13} />
            </button>
            {/* Recenter & Fit-to-screen button */}
            <button
              onClick={resetView}
              className="canvas-control-btn"
              style={{
                width: isMobile ? '24px' : '26px',
                height: isMobile ? '24px' : '26px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#38BDF8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={lang === 'ar' ? 'توسيع وضبط تلقائي في منتصف الشاشة' : 'Recenter & Fit to Screen'}
            >
              <RotateCcw size={12} />
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="canvas-control-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: isMobile ? '5px 8px' : '6px 10px',
              borderRadius: '10px',
              backgroundColor: isFullscreen ? '#EF4444' : '#181E29',
              border: isFullscreen ? 'none' : '1px solid #2C3647',
              color: isFullscreen ? '#FFFFFF' : '#CBD5E1',
              fontSize: isMobile ? '10.5px' : '11px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
              transition: 'transform 0.15s ease'
            }}
            title={isFullscreen ? (lang === 'ar' ? 'تصغير' : 'Exit Fullscreen') : (lang === 'ar' ? 'ملء الشاشة' : 'Fullscreen')}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            {!isMobile && <span>{isFullscreen ? (lang === 'ar' ? 'تصغير' : 'Exit') : (lang === 'ar' ? 'ملء الشاشة' : 'Full')}</span>}
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
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isTransitioning ? 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
        }}
      >
        <svg
          width={canvasBounds.width}
          height={canvasBounds.height}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          <defs>
            {/* userSpaceOnUse guarantees horizontal single-child curves (height=0 bbox) ALWAYS render */}
            <linearGradient
              id={`notebookCurveGrad-${svgUid}`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2={canvasBounds.width}
              y2="0"
            >
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="1" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient
              id={`notebookGlowUnder-${svgUid}`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2={canvasBounds.width}
              y2="0"
            >
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.38" />
            </linearGradient>
          </defs>

          {/* Render Smooth Cubic Bezier Curves connecting parent right edge to child left edge */}
          {renderedEdges.map(edge => {
            const dx = edge.toX - edge.fromX;
            const c1x = edge.fromX + dx * 0.52;
            const c1y = edge.fromY;
            const c2x = edge.toX - dx * 0.52;
            const c2y = edge.toY;
            const pathD = `M ${edge.fromX} ${edge.fromY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${edge.toX} ${edge.toY}`;

            return (
              <g key={edge.id}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={`url(#notebookGlowUnder-${svgUid})`}
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d={pathD}
                  fill="none"
                  stroke={`url(#notebookCurveGrad-${svgUid})`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Connector dots on both parent exit and child entry */}
                <circle cx={edge.fromX} cy={edge.fromY} r="3.2" fill="#6366F1" />
                <circle cx={edge.toX} cy={edge.toY} r="3.5" fill="#38BDF8" />
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
            (node.labelAr && node.labelAr.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (node.summaryAr && node.summaryAr.toLowerCase().includes(searchQuery.toLowerCase()))
          );

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
                width: `${node.cardW}px`,
                height: `${node.cardH}px`,
                backgroundColor: isRoot 
                  ? '#1E1B4B' 
                  : isL1 
                    ? '#1C2331' 
                    : '#141822',
                border: isMatched
                  ? '2px solid #F59E0B'
                  : isRoot
                    ? '1.5px solid #6366F1'
                    : selectedNode?.id === node.id
                      ? '1.5px solid #38BDF8'
                      : isL1
                        ? '1px solid #334155'
                        : '1px solid #242D3D',
                borderRadius: isRoot ? '14px' : '10px',
                padding: isMobile ? '6px 10px' : (isRoot ? '10px 14px' : '8px 12px'),
                boxShadow: isMatched
                  ? '0 0 20px rgba(245, 158, 11, 0.45)'
                  : isRoot
                    ? '0 10px 30px rgba(99, 102, 241, 0.38)'
                    : '0 6px 18px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                zIndex: isRoot ? 10 : 5,
                direction: 'ltr', // horizontal tree layout flow
                boxSizing: 'border-box'
              }}
            >
              {/* Node Title & Timestamp Content (RTL support inside) */}
              <div style={{
                minWidth: 0,
                flex: 1,
                direction: isRtl ? 'rtl' : 'ltr',
                textAlign: isRtl ? 'right' : 'left'
              }}>
                <div
                  dir="auto"
                  title={lang === 'ar' ? (node.labelAr || node.label) : (node.labelEn || node.label || node.labelAr)}
                  style={{
                  fontSize: isMobile ? (isRoot ? '11.5px' : '10.8px') : (isRoot ? '12.8px' : '11.8px'),
                  fontWeight: isRoot ? '800' : '700',
                  color: isRoot ? '#FFFFFF' : '#E2E8F0',
                  lineHeight: 1.32,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
                }}>
                  {lang === 'ar' ? (node.labelAr || node.label) : (node.labelEn || node.label || node.labelAr)}
                </div>
                {node.timestamp && (
                  <div style={{
                    fontSize: '9.5px',
                    color: isRoot ? '#A5B4FC' : '#38BDF8',
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    <Clock size={9} color={isRoot ? '#A5B4FC' : '#38BDF8'} />
                    <span>{node.timestamp}</span>
                  </div>
                )}
              </div>

              {/* Expand / Collapse Chevron Button (on the right side leading to its children) */}
              {node.hasChildren && (
                <button
                  type="button"
                  className="interactive-node-btn"
                  onClick={(e) => toggleExpand(node.id, e)}
                  style={{
                    width: isMobile ? '20px' : '22px',
                    height: isMobile ? '20px' : '22px',
                    borderRadius: '50%',
                    backgroundColor: node.isExpanded ? '#38BDF8' : '#273142',
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
                    <ChevronLeft size={12} />
                  ) : (
                    <ChevronRight size={12} />
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
          backgroundColor: '#181E29',
          border: '1px solid #334155',
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

          <h4 dir="auto" style={{
            fontSize: '14px',
            fontWeight: '800',
            color: '#FFFFFF',
            margin: '0 0 6px 0',
            lineHeight: 1.4,
            fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
          }}>
            {lang === 'ar' ? (selectedNode.labelAr || selectedNode.label) : (selectedNode.labelEn || selectedNode.label || selectedNode.labelAr)}
          </h4>

          <div style={{
            fontSize: '10.5px',
            fontWeight: '800',
            color: '#38BDF8',
            marginBottom: '4px',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
          }}>
            {lang === 'ar' ? 'معنى المفهوم والشرح:' : 'Concept Meaning:'}
          </div>
          <p dir="auto" style={{
            fontSize: '12.5px',
            color: '#CBD5E1',
            lineHeight: 1.65,
            margin: '0 0 12px 0',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
          }}>
            {selectedNode.summaryAr || selectedNode.summary || (
              lang === 'ar' 
                ? 'مفهوم مستخرج مباشرة من محتوى المحاضرة ومصنّف ضمن شجرة المفاهيم.'
                : 'Concept extracted directly from the lecture content.'
            )}
          </p>
          {selectedNode.hasChildren && (
            <div style={{
              fontSize: '11px',
              color: '#94A3B8',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}>
              <span>
                {lang === 'ar'
                  ? `يتفرع منه ${selectedNode.children?.length || 0} فروع داخل الخريطة`
                  : `Branches into ${selectedNode.children?.length || 0} sub-nodes on the map`}
              </span>
              <button
                type="button"
                onClick={() => toggleExpand(selectedNode.id)}
                style={{
                  padding: '3px 9px',
                  borderRadius: '7px',
                  border: '1px solid #334155',
                  backgroundColor: '#0F172A',
                  color: '#38BDF8',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {expandedNodeIds.has(selectedNode.id)
                  ? (lang === 'ar' ? 'طي الفروع' : 'Collapse')
                  : (lang === 'ar' ? 'إظهار الفروع' : 'Expand')}
              </button>
            </div>
          )}

          {selectedNode.timestamp && onJumpToTimestamp && (
            <button
              onClick={() => {
                const rawSecs = selectedNode.startSeconds ?? selectedNode.seconds;
                if (rawSecs !== undefined && rawSecs !== null && Number.isFinite(Number(rawSecs))) {
                  onJumpToTimestamp(Number(rawSecs));
                  return;
                }
                const parts = String(selectedNode.timestamp || '00:00').split(':').map((n) => parseInt(n, 10));
                if (parts.length === 2 && !parts.some(Number.isNaN)) {
                  onJumpToTimestamp(parts[0] * 60 + parts[1]);
                } else if (parts.length === 3 && !parts.some(Number.isNaN)) {
                  onJumpToTimestamp(parts[0] * 3600 + parts[1] * 60 + parts[2]);
                } else {
                  onJumpToTimestamp(0);
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
