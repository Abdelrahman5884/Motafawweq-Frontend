/**
 * Motafawweq — Utility Functions
 * Pure helper functions with no side effects.
 */

// ─── Time & Date ──────────────────────────────────────────────────────────────

/**
 * Format seconds into MM:SS string
 * @param {number} secs
 * @returns {string} e.g. "09:45"
 */
export const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

/**
 * Format a date string or Date object to Arabic-friendly display
 * @param {string|Date} date
 * @param {string} lang 'ar' | 'en'
 */
export const formatDate = (date, lang = 'ar') => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// ─── Math & Scoring ───────────────────────────────────────────────────────────

/**
 * Clamp a number between min and max
 */
export const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

/**
 * Calculate percentage
 */
export const calcPercent = (value, total) =>
  total === 0 ? 0 : Math.round((value / total) * 100);

/**
 * Calculate quiz score data
 * @param {Array} questions
 * @param {Object} answers - { [questionIdx]: selectedOptionIdx }
 * @returns {{ correctCount, scorePercent, isPerfect }}
 */
export const calcQuizScore = (questions, answers) => {
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (answers[idx] === q.correctIndex) correctCount++;
  });
  const scorePercent = calcPercent(correctCount, questions.length);
  return { correctCount, scorePercent, isPerfect: scorePercent === 100 };
};

// ─── String Helpers ───────────────────────────────────────────────────────────

/**
 * Truncate text to maxLength with ellipsis
 */
export const truncate = (text, maxLength = 80) => {
  if (!text) return '';
  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}…`;
};

/**
 * Get initials from a name (for Avatar fallback)
 * @param {string} name
 * @returns {string} e.g. "عمر طارق" → "عط"
 */
export const getInitials = (name = '') =>
  name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

// ─── Array Helpers ────────────────────────────────────────────────────────────

/**
 * Group array items by a key
 */
export const groupBy = (arr, keyFn) =>
  arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

// ─── Smooth SVG Spline ────────────────────────────────────────────────────────

/**
 * Generate smooth cubic spline SVG path from points
 * Used in StudyActivityChart
 * @param {Array<{x:number,y:number}>} points
 * @param {number} baseline
 */
export const generateSplinePaths = (points, baseline = 165) => {
  if (!points || points.length === 0) return { linePath: '', areaPath: '' };
  let linePath = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 >= points.length ? points.length - 1 : i + 2];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    linePath += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  const areaPath = `${linePath} L ${points[points.length - 1].x},${baseline} L ${points[0].x},${baseline} Z`;
  return { linePath, areaPath };
};
