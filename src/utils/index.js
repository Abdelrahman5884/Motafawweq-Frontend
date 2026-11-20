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
  const safe = Math.max(0, Math.floor(Number(secs) || 0));
  const m = Math.floor(safe / 60).toString().padStart(2, '0');
  const s = (safe % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

/**
 * Format live elapsed platform time as MM:SS (or H:MM:SS when >= 1 hour)
 * @param {number} totalSeconds
 * @returns {string}
 */
export const formatLiveDuration = (totalSeconds) => {
  const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const hours = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Get the current local calendar date string (YYYY-MM-DD) without UTC drift.
 * @param {Date} date
 * @returns {string}
 */
export const getLocalDateKey = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Safely resolve the client's IANA timezone name (defaults to Africa/Cairo).
 * @returns {string}
 */
export const getClientTimezone = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz || 'Africa/Cairo';
  } catch {
    return 'Africa/Cairo';
  }
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

/**
 * Extract a clean uppercase group join code from either a raw code or a full QR join URL.
 * @param {string} raw
 * @returns {string}
 */
export const extractGroupJoinCode = (raw = '') => {
  const trimmed = String(raw || '').trim();
  const urlMatch = trimmed.match(/(?:join-group\/|joinCode=|code=)([A-Za-z0-9\-_]{4,32})/i);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1].trim().toUpperCase();
  }
  return trimmed.toUpperCase();
};

/**
 * Copy text to clipboard with safe execCommand fallback.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export const copyTextToClipboard = async (text) => {
  const value = String(text || '');
  if (!value) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // fallback below
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = value;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
};

// ─── Smooth SVG Spline ────────────────────────────────────────────────────────

/**
 * Generate smooth cubic spline SVG path from points with vertical clamping
 * so curves never overshoot below the 0-minute baseline or above the chart top.
 * Used in StudyActivityChart
 * @param {Array<{x:number,y:number}>} points
 * @param {number} baseline
 * @param {number} minY
 */
export const generateSplinePaths = (points, baseline = 165, minY = 0) => {
  if (!points || points.length === 0) return { linePath: '', areaPath: '' };
  const clampY = (y) => Math.min(baseline, Math.max(minY, y));
  let linePath = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 >= points.length ? points.length - 1 : i + 2];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = clampY(p1.y + (p2.y - p0.y) / 6);
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = clampY(p2.y - (p3.y - p1.y) / 6);
    linePath += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)},${baseline} L ${points[0].x.toFixed(1)},${baseline} Z`;
  return { linePath, areaPath };
};
