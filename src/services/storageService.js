/**
 * Motafawweq — Supabase Storage & Direct Upload Service
 * Enterprise-grade client for secure direct uploads to Supabase Storage via S3 presigned URLs.
 * Strictly adheres to the Supabase Free Plan constraints (50 MB max per upload).
 */

import { apiPost, apiGet, ApiError } from './api';

export const MAX_STORAGE_FILE_SIZE_BYTES = 52428800; // 50 MB hard limit on Supabase Free Plan

/**
 * Returns optimized MediaRecorder audio settings to ensure 1-hour recordings
 * remain high quality while comfortably staying below the 50 MB Supabase Free limit (~21 MB).
 */
export const getOptimalAudioConfig = () => {
  const mimeTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/aac',
  ];

  let selectedMimeType = '';
  if (typeof window !== 'undefined' && window.MediaRecorder) {
    for (const mime of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mime)) {
        selectedMimeType = mime;
        break;
      }
    }
  }

  return {
    mimeType: selectedMimeType || 'audio/webm',
    audioBitsPerSecond: 48000, // 48 kbps produces ~21.6 MB for 60 minutes
  };
};

/**
 * Request an upload authorization & S3 presigned URL from Laravel backend.
 */
export const requestPresignedUpload = async ({
  entityType,
  entityId = null,
  file,
  title = '',
  caption = '',
  duration = null,
}) => {
  if (!file) {
    throw new Error('يرجى تحديد ملف للرفع.');
  }

  // Client-side guard for Supabase Free Plan limit
  if (file.size > MAX_STORAGE_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `حجم الملف (${sizeMb} ميجابايت) يتجاوز الحد الأقصى المسموح به (50 ميجابايت) على المنصة. يرجى ضغط الملف أو تقليل مدة التسجيل.`
    );
  }

  const normalizedMime = (file.type || 'application/octet-stream').split(';')[0].trim().toLowerCase();

  const payload = {
    entity_type: entityType,
    entity_id: entityId,
    filename: file.name || 'unnamed_file',
    mime_type: normalizedMime,
    file_size: file.size,
    metadata: {
      title: title || file.name,
      caption,
      ...(duration ? { duration } : {}),
    },
  };

  const response = await apiPost('/storage/presign-upload', payload);
  return response.data;
};

/**
 * Direct HTTP PUT upload from the browser to Supabase Storage via S3 Presigned URL.
 * Reports granular real-time progress and supports cancellation.
 */
export const uploadDirectToPresignedUrl = (
  uploadUrl,
  file,
  mimeType,
  onProgress = null,
  abortSignal = null
) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.timeout = 45000;
    const cleanMime = (mimeType || file.type || 'application/octet-stream').split(';')[0].trim();
    xhr.setRequestHeader('Content-Type', cleanMime);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const percent = Math.min(100, Math.round((evt.loaded / evt.total) * 100));
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      // S3 / Supabase presigned PUT returns 200 or 204 on success
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100);
        resolve(true);
      } else {
        reject(
          new Error(`فشل رفع الملف إلى وحدة التخزين السحابي (كود الحالة: ${xhr.status}).`)
        );
      }
    };

    xhr.onerror = () => {
      reject(new Error('انقطع الاتصال بوحدة التخزين السحابي أثناء الرفع. يرجى التحقق من اتصال الإنترنت.'));
    };

    xhr.ontimeout = () => {
      reject(new Error('انتهت مهلة رفع الملف. يرجى المحاولة مرة أخرى.'));
    };

    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        xhr.abort();
        reject(new Error('تم إلغاء عملية الرفع من قبل المستخدم.'));
      });
    }

    xhr.send(file);
  });
};

/**
 * Confirm upload completion with Laravel backend so it verifies the object and updates MySQL metadata.
 */
export const confirmUpload = async (fileId) => {
  const response = await apiPost('/storage/confirm-upload', { file_id: fileId });
  return response.data;
};

/**
 * High-level orchestration function:
 * 1. Presign with Laravel
 * 2. Upload directly to Supabase S3
 * 3. Confirm with Laravel
 */
export const uploadFile = async ({
  entityType,
  entityId = null,
  file,
  title = '',
  caption = '',
  duration = null,
  onProgress = null,
  abortSignal = null,
}) => {
  // 1. Authorize & Presign
  const presignData = await requestPresignedUpload({
    entityType,
    entityId,
    file,
    title,
    caption,
    duration,
  });

  // 2. Direct S3 Upload
  await uploadDirectToPresignedUrl(
    presignData.upload_url,
    file,
    presignData.mime_type,
    onProgress,
    abortSignal
  );

  // 3. Confirm & Verify in DB
  const confirmedFile = await confirmUpload(presignData.file_id);
  return confirmedFile;
};

/**
 * Request a short-lived temporary signed download URL for private files.
 */
export const getSecureDownloadUrl = async (fileUuid) => {
  const response = await apiGet(`/storage/download-url/${fileUuid}`);
  return response.data;
};

export default {
  uploadFile,
  requestPresignedUpload,
  uploadDirectToPresignedUrl,
  confirmUpload,
  getSecureDownloadUrl,
  getOptimalAudioConfig,
  MAX_STORAGE_FILE_SIZE_BYTES,
};

