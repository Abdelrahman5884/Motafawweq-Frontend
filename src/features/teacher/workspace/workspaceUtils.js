export function mapLesson(l) {
  return {
    id: l.id || l.uuid,
    uuid: l.id || l.uuid,
    courseId: l.courseId || '',
    title: l.titleEn || l.titleAr || l.title || '',
    titleAr: l.titleAr || l.title || '',
    descriptionAr: l.descriptionAr || l.description || '',
    unitAr: l.unitAr || l.courseTitleAr || l.subjectAr || '',
    courseTitleAr: l.courseTitleAr || '',
    subjectAr: l.subjectAr || l.subject || '',
    gradeAr: l.gradeAr || l.grade || '',
    classGroup: l.classGroup || '',
    mode: l.mode || 'audio',
    mediaType: l.mediaType || (l.mode === 'video' || l.mode === 'embed' ? 'video' : 'audio'),
    mediaDisk: l.mediaDisk || null,
    mediaStreamUrl: l.mediaStreamUrl || null,
    mediaOriginalName: l.mediaOriginalName || '',
    mediaSizeBytes: l.mediaSizeBytes || 0,
    embedUrl: l.embedUrl || '',
    videoUrl: l.videoUrl || l.embedUrl || l.mediaStreamUrl || '',
    isYoutube: Boolean(l.isYoutube),
    durationFormatted: l.durationFormatted || l.durationLabel || '00:00',
    durationSeconds: Number(l.durationSeconds || 0),
    recordedDate: (l.publishedAt || l.createdAt || '').slice(0, 10) || '',
    aiFeatures: l.aiFeatures || { speechToText: false, conceptGraph: false, chapterIndexing: false },
    chapters: Array.isArray(l.chapters) ? l.chapters : [],
    transcript: Array.isArray(l.transcript) ? l.transcript : [],
    aiSttJob: l.aiSttJob || null,
    notebookMindMap: l.notebookMindMap || null,
    lessonPdfs: Array.isArray(l.lessonPdfs) ? l.lessonPdfs : [],
    lessonImages: Array.isArray(l.lessonImages) ? l.lessonImages : [],
  };
}

export function formatBytesLabel(bytes) {
  const num = Number(bytes || 0);
  if (!num || num <= 0) return '';
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatSecondsToTimestamp(seconds) {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function parseTimestampToSeconds(input) {
  const raw = String(input || '').trim();
  if (!raw) return 0;
  if (/^\d+$/.test(raw)) return Math.max(0, parseInt(raw, 10));
  const parts = raw.split(':').map((p) => parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n) || n < 0)) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

export function getEmbedIframeSrc(url) {
  const trimmed = String(url || '').trim();
  if (!trimmed) return '';

  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|live\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,20})/i
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d{5,15})/i);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return trimmed;
}

export function isIframeEmbedUrl(url) {
  const src = getEmbedIframeSrc(url);
  return src.includes('youtube.com/embed/') || src.includes('player.vimeo.com/video/');
}

export function extractMediaDurationSeconds(file) {
  return new Promise((resolve) => {
    if (!(file instanceof File || file instanceof Blob)) {
      resolve(0);
      return;
    }
    const isVideo =
      file.type?.startsWith('video/') || /\.(mp4|webm|mov|ogv|mkv|avi)$/i.test(file.name || '');
    const el = document.createElement(isVideo ? 'video' : 'audio');
    const objectUrl = URL.createObjectURL(file);
    let settled = false;

    const cleanup = (val) => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(objectUrl);
      el.removeAttribute('src');
      resolve(val);
    };

    const timer = setTimeout(() => cleanup(0), 6000);
    el.preload = 'metadata';
    el.onloadedmetadata = () => {
      clearTimeout(timer);
      const dur = Number.isFinite(el.duration) && el.duration > 0 ? Math.round(el.duration) : 0;
      cleanup(dur);
    };
    el.onerror = () => {
      clearTimeout(timer);
      cleanup(0);
    };
    el.src = objectUrl;
  });
}
