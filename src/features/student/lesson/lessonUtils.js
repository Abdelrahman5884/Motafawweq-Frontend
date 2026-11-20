/**
 * Pure formatting, embed URL, and storage utilities for the Student Lesson workspace.
 */

export function formatSeconds(sec) {
  const safeSec = Number.isFinite(sec) && sec > 0 ? Math.floor(sec) : 0;
  const hrs = Math.floor(safeSec / 3600);
  const mins = Math.floor((safeSec % 3600) / 60);
  const secs = safeSec % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatDurationDisplay(rawFmt, durationSec = 0, lang = 'ar') {
  const isAr = lang === 'ar';
  let totalSec = Number.isFinite(durationSec) && durationSec > 0 ? Math.round(durationSec) : 0;

  if (!totalSec && rawFmt && /^\d{1,3}:\d{2}(:\d{2})?$/.test(String(rawFmt).trim())) {
    const parts = String(rawFmt).trim().split(':').map(Number);
    if (parts.length === 3) {
      totalSec = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      totalSec = parts[0] * 60 + parts[1];
    }
  }

  if (totalSec <= 0) return rawFmt || '';

  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  if (isAr) {
    if (hrs > 0 && mins > 0) return `${hrs} ساعة و ${mins} دقيقة`;
    if (hrs > 0) return hrs === 1 ? 'ساعة واحدة' : `${hrs} ساعات`;
    if (mins > 0 && secs > 0) return `${mins} دقيقة و ${secs} ثانية`;
    if (mins > 0) return `${mins} دقيقة`;
    return `${secs} ثانية`;
  }

  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0 && secs > 0) return `${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m`;
  return `${secs}s`;
}

export function isEmbedVideoUrl(lesson) {
  if (!lesson) return false;
  if (lesson.isYoutube) return true;
  const candidate = String(lesson.embedUrl || lesson.videoUrl || '').toLowerCase();
  return (
    candidate.includes('youtube.com') ||
    candidate.includes('youtu.be') ||
    candidate.includes('vimeo.com')
  );
}

/**
 * Convert YouTube / Vimeo URLs into clean embed URLs with optional start-time jump support.
 */
export function toEmbedPlayerUrl(rawUrl = '', startSec = 0) {
  if (!rawUrl) return '';
  const safeStart = Math.max(0, Math.floor(Number(startSec) || 0));

  // Extract YouTube video ID from /embed/, watch?v=, youtu.be/, /shorts/, /live/
  const ytMatch =
    rawUrl.match(/youtube\.com\/embed\/([^?&#/]+)/i) ||
    rawUrl.match(/[?&]v=([^&#]+)/i) ||
    rawUrl.match(/youtu\.be\/([^?&#/]+)/i) ||
    rawUrl.match(/youtube\.com\/shorts\/([^?&#/]+)/i) ||
    rawUrl.match(/youtube\.com\/live\/([^?&#/]+)/i);

  if (ytMatch?.[1]) {
    const params = new URLSearchParams({ rel: '0', modestbranding: '1' });
    if (safeStart > 0) {
      params.set('start', String(safeStart));
      params.set('autoplay', '1');
    }
    return `https://www.youtube.com/embed/${ytMatch[1]}?${params.toString()}`;
  }

  // Vimeo embed support
  const vimeoMatch = rawUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeoMatch?.[1]) {
    const hash = safeStart > 0 ? `#t=${safeStart}s` : '';
    return `https://player.vimeo.com/video/${vimeoMatch[1]}${hash}`;
  }

  return rawUrl;
}

export function readScopedJson(key, fallback) {
  if (!key) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeScopedJson(key, value) {
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota errors
  }
}
