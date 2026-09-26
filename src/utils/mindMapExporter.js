/**
 * Mind Map PNG Exporter - Google NotebookLM Style
 * Generates an ultra-crisp, high-DPI (Retina 2x) PNG image of the entire expanded mind map.
 */

// Helper to safely round-rect on any Canvas 2D context
function drawRoundedRect(ctx, x, y, width, height, radius) {
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    return;
  }
  // Fallback for older environments
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Truncate text to fit within maxWidth in canvas
 */
function fitText(ctx, text, maxWidth) {
  if (!text) return '';
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 3 && ctx.measureText(truncated + '...').width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '...';
}

/**
 * Exports the complete expanded tree into a high-res PNG file.
 */
export async function exportMindMapToPng({
  treeData,
  title = 'خريطة المفاهيم التفاعلية',
  unitTitle = '',
  lang = 'ar',
  isRtl = true
}) {
  if (!treeData) {
    throw new Error('No tree data provided for export.');
  }

  // 1. Traverse and compute positions for ALL nodes (fully expanded)
  const ROW_HEIGHT = 76; // vertical slot for each leaf
  const GAP_X = 95;      // horizontal gap between columns
  
  const getCardWidth = (depth) => {
    if (depth === 0) return 260;
    if (depth === 1) return 230;
    if (depth === 2) return 210;
    return 195;
  };

  const getCardHeight = (depth) => {
    if (depth === 0) return 60;
    if (depth === 1) return 54;
    return 50;
  };

  // First pass: compute subtree heights for all nodes
  const calculateHeights = (node) => {
    if (!node.children || node.children.length === 0) {
      node._subtreeH = ROW_HEIGHT;
      return ROW_HEIGHT;
    }
    let sum = 0;
    node.children.forEach(child => {
      sum += calculateHeights(child);
    });
    node._subtreeH = Math.max(ROW_HEIGHT, sum);
    return node._subtreeH;
  };

  calculateHeights(treeData);

  // Depth X coordinate table
  const depthX = [getCardWidth(0) / 2 + 50];
  for (let d = 1; d <= 12; d++) {
    const prevW = getCardWidth(d - 1);
    const currW = getCardWidth(d);
    depthX[d] = depthX[d - 1] + prevW / 2 + GAP_X + currW / 2;
  }

  const nodesList = [];
  const edgesList = [];
  let totalConceptsCount = 0;

  // Second pass: assign (X, Y) coordinates
  const layout = (node, depth, topY) => {
    totalConceptsCount++;
    const cardW = getCardWidth(depth);
    const cardH = getCardHeight(depth);
    const x = depthX[depth];
    const y = topY + node._subtreeH / 2;

    const nodeItem = {
      ...node,
      x,
      y,
      depth,
      cardW,
      cardH,
      hasChildren: Boolean(node.children && node.children.length > 0)
    };
    nodesList.push(nodeItem);

    if (node.children && node.children.length > 0) {
      let childTop = topY;
      node.children.forEach(child => {
        layout(child, depth + 1, childTop);

        const childX = depthX[depth + 1];
        const childY = childTop + child._subtreeH / 2;
        const childW = getCardWidth(depth + 1);

        edgesList.push({
          id: `edge-${node.id}-${child.id}`,
          fromX: x + cardW / 2,
          fromY: y,
          toX: childX - childW / 2,
          toY: childY
        });

        childTop += child._subtreeH;
      });
    }
  };

  layout(treeData, 0, 0);

  // 2. Calculate content bounding box
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  nodesList.forEach(n => {
    minX = Math.min(minX, n.x - n.cardW / 2);
    maxX = Math.max(maxX, n.x + n.cardW / 2);
    minY = Math.min(minY, n.y - n.cardH / 2);
    maxY = Math.max(maxY, n.y + n.cardH / 2);
  });

  const contentW = maxX - minX;
  const contentH = maxY - minY;

  // 3. Setup Canvas dimensions
  const HEADER_H = 150;
  const FOOTER_H = 70;
  const PAD_X = 90;
  const PAD_Y = 60;

  const canvasWidth = Math.max(1400, Math.ceil(contentW + PAD_X * 2));
  const canvasHeight = Math.max(880, Math.ceil(contentH + HEADER_H + FOOTER_H + PAD_Y * 2));

  // High-DPI 2x scale for crystal-clear retina rendering
  const SCALE = 2;
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth * SCALE;
  canvas.height = canvasHeight * SCALE;
  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);

  // Center alignment offsets
  const offsetX = (canvasWidth - contentW) / 2 - minX;
  const offsetY = HEADER_H + PAD_Y + (canvasHeight - HEADER_H - FOOTER_H - PAD_Y * 2 - contentH) / 2 - minY;

  // 4. DRAW BACKGROUND
  // Rich sleek dark background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  bgGrad.addColorStop(0, '#0E121A');
  bgGrad.addColorStop(0.5, '#121722');
  bgGrad.addColorStop(1, '#0A0D14');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Background Dot Grid
  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
  const gridStep = 24;
  for (let gx = 0; gx < canvasWidth; gx += gridStep) {
    for (let gy = 0; gy < canvasHeight; gy += gridStep) {
      ctx.beginPath();
      ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 5. DRAW HEADER BANNER
  const bannerMargin = 40;
  const bannerW = canvasWidth - bannerMargin * 2;
  const bannerH = 100;
  const bannerX = bannerMargin;
  const bannerY = 28;

  // Header Card
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;
  drawRoundedRect(ctx, bannerX, bannerY, bannerW, bannerH, 16);
  ctx.fillStyle = '#161D2A';
  ctx.fill();
  ctx.strokeStyle = '#293547';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Branding chip (Top right in Arabic, top left in English)
  const isArabic = lang === 'ar' || isRtl;
  ctx.save();
  ctx.direction = isArabic ? 'rtl' : 'ltr';

  // Platform Brand Badge
  const badgeX = isArabic ? bannerX + bannerW - 20 : bannerX + 20;
  const badgeY = bannerY + 28;
  ctx.font = 'bold 11.5px "Cairo", "Tajawal", "Segoe UI", sans-serif';
  ctx.fillStyle = '#38BDF8';
  ctx.textAlign = isArabic ? 'right' : 'left';
  ctx.fillText(
    isArabic ? 'منصة متفوق الذكية • خريطة مفاهيم معتمدة بالذكاء الاصطناعي (Google NotebookLM)' : 'Motafawweq AI • Google NotebookLM Mind Map',
    badgeX,
    badgeY
  );

  // Lesson Title
  ctx.font = '800 22px "Cairo", "Tajawal", "Segoe UI", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  const displayTitle = isArabic ? (treeData.labelAr || title) : (treeData.label || title);
  ctx.fillText(displayTitle, badgeX, badgeY + 28);

  // Subtitle / Unit info
  ctx.font = '600 12.5px "Cairo", "Tajawal", "Segoe UI", sans-serif';
  ctx.fillStyle = '#94A3B8';
  const displaySub = unitTitle 
    ? (isArabic ? `${unitTitle} • شجرة مفاهيم تفاعلية متكاملة وشاملة` : `${unitTitle} • Comprehensive Concept Tree`)
    : (isArabic ? 'شجرة مفاهيم تفاعلية متكاملة مستخلصة آلياً من تسجيل الحصة' : 'Interactive full concept tree extracted from lesson');
  ctx.fillText(displaySub, badgeX, badgeY + 49);

  // Left stat pill (Total nodes)
  const statPillW = 160;
  const statPillH = 42;
  const statPillX = isArabic ? bannerX + 20 : bannerX + bannerW - statPillW - 20;
  const statPillY = bannerY + 28;

  ctx.save();
  drawRoundedRect(ctx, statPillX, statPillY, statPillW, statPillH, 10);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.direction = isArabic ? 'rtl' : 'ltr';
  ctx.font = 'bold 12px "Cairo", "Tajawal", "Segoe UI", sans-serif';
  ctx.fillStyle = '#38BDF8';
  ctx.fillText(
    isArabic ? `${totalConceptsCount} مفهوماً مترابطاً` : `${totalConceptsCount} Concepts Mapped`,
    statPillX + statPillW / 2,
    statPillY + statPillH / 2 - 8
  );
  ctx.font = '600 10px "Cairo", "Tajawal", "Segoe UI", sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText(
    isArabic ? 'كامل الشجرة مفتوحة' : 'Full Tree Expanded',
    statPillX + statPillW / 2,
    statPillY + statPillH / 2 + 10
  );
  ctx.restore();
  ctx.restore();

  // 6. DRAW CONNECTING CURVES
  edgesList.forEach(edge => {
    const fx = edge.fromX + offsetX;
    const fy = edge.fromY + offsetY;
    const tx = edge.toX + offsetX;
    const ty = edge.toY + offsetY;

    const dx = tx - fx;
    const c1x = fx + dx * 0.52;
    const c1y = fy;
    const c2x = tx - dx * 0.52;
    const c2y = ty;

    // Glowing under-stroke
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, tx, ty);
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.22)';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Vibrant gradient stroke
    const grad = ctx.createLinearGradient(fx, fy, tx, ty);
    grad.addColorStop(0, '#4F46E5');
    grad.addColorStop(1, '#38BDF8');
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, tx, ty);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Small connector dot at target
    ctx.beginPath();
    ctx.arc(tx, ty, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#38BDF8';
    ctx.fill();
    ctx.restore();
  });

  // 7. DRAW NODE CARDS
  nodesList.forEach(node => {
    const cx = node.x + offsetX;
    const cy = node.y + offsetY;
    const w = node.cardW;
    const h = node.cardH;
    const left = cx - w / 2;
    const top = cy - h / 2;

    const isRoot = node.depth === 0;
    const isL1 = node.depth === 1;

    // Card drop shadow
    ctx.save();
    ctx.shadowColor = isRoot 
      ? 'rgba(99, 102, 241, 0.45)' 
      : isL1 
        ? 'rgba(56, 189, 248, 0.25)' 
        : 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = isRoot ? 16 : 10;
    ctx.shadowOffsetY = isRoot ? 6 : 4;

    // Background fill & border
    drawRoundedRect(ctx, left, top, w, h, isRoot ? 14 : 10);
    ctx.fillStyle = isRoot 
      ? '#1E1B4B' 
      : isL1 
        ? '#1C2331' 
        : '#141822';
    ctx.fill();

    ctx.strokeStyle = isRoot 
      ? '#6366F1' 
      : isL1 
        ? '#38BDF8' 
        : '#2A3649';
    ctx.lineWidth = isRoot ? 2 : (isL1 ? 1.5 : 1);
    ctx.stroke();
    ctx.restore();

    // Node content (RTL aware)
    ctx.save();
    ctx.direction = isArabic ? 'rtl' : 'ltr';

    // Label
    const rawLabel = isArabic ? (node.labelAr || node.label) : (node.label || node.labelAr);
    ctx.font = isRoot 
      ? 'bold 13.5px "Cairo", "Tajawal", "Segoe UI", sans-serif'
      : isL1 
        ? 'bold 12px "Cairo", "Tajawal", "Segoe UI", sans-serif' 
        : '600 11px "Cairo", "Tajawal", "Segoe UI", sans-serif';
    ctx.fillStyle = isRoot ? '#FFFFFF' : (isL1 ? '#F1F5F9' : '#E2E8F0');

    // Right-aligned for Arabic inside card
    const textPadX = 14;
    const textX = isArabic ? left + w - textPadX : left + textPadX;
    const textMaxW = w - (textPadX * 2) - (node.hasChildren ? 20 : 0);
    const fittedText = fitText(ctx, rawLabel, textMaxW);

    ctx.textAlign = isArabic ? 'right' : 'left';
    ctx.textBaseline = 'middle';

    const hasTimestamp = Boolean(node.timestamp);
    const labelY = hasTimestamp ? top + 20 : cy;
    ctx.fillText(fittedText, textX, labelY);

    // Timestamp & Depth tag
    if (hasTimestamp) {
      ctx.font = '600 9.5px "JetBrains Mono", monospace, sans-serif';
      ctx.fillStyle = isRoot ? '#A5B4FC' : '#38BDF8';
      const metaY = top + h - 14;
      ctx.fillText(`⏱ ${node.timestamp}`, textX, metaY);
    }

    // Expand indicator dot / chevron on right edge if it has children
    if (node.hasChildren) {
      const dotX = left + w - 4;
      const dotY = cy;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#38BDF8';
      ctx.fill();
    }
    ctx.restore();
  });

  // 8. DRAW FOOTER WATERMARK
  ctx.save();
  const footerY = canvasHeight - 35;
  ctx.strokeStyle = '#222B3A';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(bannerMargin, footerY - 14);
  ctx.lineTo(canvasWidth - bannerMargin, footerY - 14);
  ctx.stroke();

  ctx.direction = isArabic ? 'rtl' : 'ltr';
  ctx.font = '600 11px "Cairo", "Tajawal", "Segoe UI", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.textAlign = isArabic ? 'right' : 'left';
  const footRightX = isArabic ? canvasWidth - bannerMargin : bannerMargin;
  ctx.fillText(
    isArabic 
      ? 'منصة متفوق التعليمية • تم استخراج وتحليل خريطة المفاهيم آلياً بواسطة محرك الذكاء الاصطناعي Motafawweq AI'
      : 'Motafawweq AI Learning Platform • Concepts automatically extracted and organized via NotebookLM Engine',
    footRightX,
    footerY
  );

  ctx.font = '600 10.5px monospace';
  ctx.fillStyle = '#475569';
  ctx.textAlign = isArabic ? 'left' : 'right';
  const footLeftX = isArabic ? bannerMargin : canvasWidth - bannerMargin;
  const now = new Date().toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  ctx.fillText(`High-Res Export (2x Retina) • ${now}`, footLeftX, footerY);
  ctx.restore();

  // 9. TRIGGER PNG DOWNLOAD
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create PNG blob.'));
        return;
      }
      try {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const cleanTitle = (treeData.labelAr || title || 'خريطة_المفاهيم')
          .trim()
          .replace(/[\\/:*?"<>| ]+/g, '_');
        a.download = `خريطة_مفاهيم_${cleanTitle}.png`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve(true);
        }, 300);
      } catch (err) {
        reject(err);
      }
    }, 'image/png', 1.0);
  });
}
