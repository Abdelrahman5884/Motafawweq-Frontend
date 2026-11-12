import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, RotateCcw, Check, Move } from 'lucide-react';

/**
 * WhatsApp-style Circular Avatar Cropper Modal
 * Zero-dependency HTML5 Canvas cropper supporting drag/pan, zoom, wheel zoom, and 90-degree rotation.
 */
export const AvatarCropperModal = ({
  isOpen,
  imageSrc,
  isAr = true,
  onClose,
  onConfirm,
  isUploading = false,
}) => {
  const CROP_SIZE = 280;
  const OUTPUT_SIZE = 512;

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetStartRef = useRef({ x: 0, y: 0 });
  const imgRef = useRef(null);

  // Reset state when a new image is opened
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isUploading) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isUploading, onClose]);

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImgDimensions({ width: naturalWidth, height: naturalHeight });
  };

  // Base scale so that the image fits nicely inside the crop circle at zoom = 1
  const getBaseScale = useCallback(() => {
    if (!imgDimensions.width || !imgDimensions.height) return 1;
    const isRotated = rotation % 180 !== 0;
    const w = isRotated ? imgDimensions.height : imgDimensions.width;
    const h = isRotated ? imgDimensions.width : imgDimensions.height;
    // Fit the smaller dimension to CROP_SIZE so it covers by default, while minZoom=0.5 lets user zoom out fully
    return CROP_SIZE / Math.min(w, h);
  }, [imgDimensions, rotation]);

  const handlePointerDown = (clientX, clientY) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
    offsetStartRef.current = { ...offset };
  };

  const handlePointerMove = (clientX, clientY) => {
    if (!isDragging) return;
    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;
    setOffset({
      x: offsetStartRef.current.x + dx,
      y: offsetStartRef.current.y + dy,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((z) => Math.min(3.5, Math.max(0.5, Number((z + delta).toFixed(2)))));
  };

  const handleConfirmCrop = () => {
    if (!imgRef.current || !imgDimensions.width) return;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');

    // Fill background (in case user zoomed out below 1x)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    const ratio = OUTPUT_SIZE / CROP_SIZE;
    const baseScale = getBaseScale();
    const effectiveScale = baseScale * zoom * ratio;

    ctx.save();
    ctx.translate(OUTPUT_SIZE / 2 + offset.x * ratio, OUTPUT_SIZE / 2 + offset.y * ratio);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(effectiveScale, effectiveScale);

    ctx.drawImage(
      imgRef.current,
      -imgDimensions.width / 2,
      -imgDimensions.height / 2,
      imgDimensions.width,
      imgDimensions.height
    );
    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], `avatar_${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });
        const previewUrl = canvas.toDataURL('image/jpeg', 0.92);
        onConfirm(croppedFile, previewUrl);
      },
      'image/jpeg',
      0.92
    );
  };

  if (!isOpen || !imageSrc) return null;

  const baseScale = getBaseScale();
  const displayScale = baseScale * zoom;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(10, 15, 28, 0.82)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-card, #ffffff)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          direction: isAr ? 'rtl' : 'ltr',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '800',
                color: 'var(--text-primary, #0f172a)',
              }}
            >
              {isAr ? 'ضبط وتحديد الصورة الشخصية' : 'Adjust Profile Picture'}
            </h3>
            <p
              style={{
                margin: '2px 0 0',
                fontSize: '12px',
                color: 'var(--text-secondary, #64748b)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Move size={12} />
              {isAr ? 'اسحب الصورة وحركها أو استخدم التكبير والتصغير' : 'Drag to reposition or zoom in/out'}
            </p>
          </div>
          <button
            type="button"
            disabled={isUploading}
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'var(--bg-subtle, #f1f5f9)',
              color: 'var(--text-secondary, #64748b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isUploading ? 'not-allowed' : 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Crop Viewport */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '320px',
            backgroundColor: '#0f172a',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            touchAction: 'none',
          }}
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onWheel={handleWheel}
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Crop preview"
            onLoad={handleImageLoad}
            draggable={false}
            style={{
              position: 'absolute',
              maxWidth: 'none',
              maxHeight: 'none',
              transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${displayScale})`,
              transformOrigin: 'center center',
              pointerEvents: 'none',
            }}
          />

          {/* Circular Cutout Overlay Mask (WhatsApp style) */}
          <div
            style={{
              position: 'absolute',
              width: `${CROP_SIZE}px`,
              height: `${CROP_SIZE}px`,
              borderRadius: '50%',
              boxShadow: '0 0 0 9999px rgba(10, 15, 28, 0.65)',
              border: '2px solid rgba(255, 255, 255, 0.85)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Controls: Zoom & Rotate */}
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            backgroundColor: 'var(--bg-subtle, #f8fafc)',
            borderTop: '1px solid var(--border-subtle, #e2e8f0)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.15).toFixed(2))))}
              style={{
                border: '1px solid var(--border-subtle, #cbd5e1)',
                backgroundColor: 'var(--bg-card, #ffffff)',
                color: 'var(--text-primary, #0f172a)',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title={isAr ? 'تصغير' : 'Zoom Out'}
            >
              <ZoomOut size={16} />
            </button>

            <input
              type="range"
              min="0.5"
              max="3.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--primary, #1588c7)', cursor: 'pointer' }}
            />

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3.5, Number((z + 0.15).toFixed(2))))}
              style={{
                border: '1px solid var(--border-subtle, #cbd5e1)',
                backgroundColor: 'var(--bg-card, #ffffff)',
                color: 'var(--text-primary, #0f172a)',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title={isAr ? 'تكبير' : 'Zoom In'}
            >
              <ZoomIn size={16} />
            </button>

            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              style={{
                border: '1px solid var(--border-subtle, #cbd5e1)',
                backgroundColor: 'var(--bg-card, #ffffff)',
                color: 'var(--text-primary, #0f172a)',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title={isAr ? 'تدوير 90 درجة' : 'Rotate 90°'}
            >
              <RotateCw size={16} />
            </button>

            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setOffset({ x: 0, y: 0 });
              }}
              style={{
                border: '1px solid var(--border-subtle, #cbd5e1)',
                backgroundColor: 'var(--bg-card, #ffffff)',
                color: 'var(--text-secondary, #64748b)',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title={isAr ? 'إعادة ضبط' : 'Reset'}
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              disabled={isUploading}
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle, #cbd5e1)',
                backgroundColor: 'var(--bg-card, #ffffff)',
                color: 'var(--text-secondary, #475569)',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: isUploading ? 'not-allowed' : 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="button"
              disabled={isUploading}
              onClick={handleConfirmCrop}
              style={{
                padding: '9px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--primary, #1588c7)',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: isUploading ? 'wait' : 'pointer',
                opacity: isUploading ? 0.7 : 1,
              }}
            >
              <Check size={16} />
              {isUploading
                ? (isAr ? 'جاري الرفع...' : 'Uploading...')
                : (isAr ? 'حفظ ورفع الصورة' : 'Save & Upload')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Fullscreen Lightbox Modal to view the profile picture in full size.
 */
export const AvatarLightboxModal = ({ isOpen, imageSrc, altText = 'Profile Picture', isAr = true, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(10, 15, 28, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        cursor: 'zoom-out',
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={isAr ? 'إغلاق' : 'Close'}
        style={{
          position: 'absolute',
          top: '20px',
          insetInlineEnd: '20px',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.2)',
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <X size={20} />
      </button>

      <img
        src={imageSrc}
        alt={altText}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: '85vh',
          objectFit: 'contain',
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
          cursor: 'default',
        }}
      />
    </div>
  );
};

export default AvatarCropperModal;
