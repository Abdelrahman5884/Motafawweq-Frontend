import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { 
  Camera, 
  CameraOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Zap,
  Volume2,
  Image,
  Upload,
  ShieldAlert
} from 'lucide-react';

export const CameraBarcodeScanner = ({
  onScanSuccess,
  isScanningActive = true,
  onClose,
  showControls = true
}) => {
  const [scannerReady, setScannerReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSecureWarning, setIsSecureWarning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [isSuccessCooldown, setIsSuccessCooldown] = useState(false);
  const [lastScannedText, setLastScannedText] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const scannerInstanceRef = useRef(null);
  const containerId = useRef(`qr-scanner-${Math.random().toString(36).substring(2, 9)}`).current;
  const isRunningRef = useRef(false);
  const cooldownRef = useRef(false);
  const nativeLoopRef = useRef(false);
  const fileInputRef = useRef(null);

  // Supported barcode & QR formats
  const formatsToSupport = [
    Html5QrcodeSupportedFormats.QR_CODE,
    Html5QrcodeSupportedFormats.CODE_128,
    Html5QrcodeSupportedFormats.CODE_39,
    Html5QrcodeSupportedFormats.CODE_93,
    Html5QrcodeSupportedFormats.EAN_13,
    Html5QrcodeSupportedFormats.EAN_8,
    Html5QrcodeSupportedFormats.UPC_A,
    Html5QrcodeSupportedFormats.UPC_E,
    Html5QrcodeSupportedFormats.ITF,
    Html5QrcodeSupportedFormats.DATA_MATRIX
  ];

  // Check secure context (HTTP vs HTTPS on mobile Wi-Fi)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isSecure = window.isSecureContext || window.location.protocol === 'https:' || isLocalhost;
      if (!isSecure && !isLocalhost) {
        setIsSecureWarning(true);
      }
    }
  }, []);

  // Enumerate cameras (safely without breaking on empty labels or ungranted permissions)
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length > 0) {
            setCameras(devices);
            // Only set specific camera ID if label explicitly mentions rear/back camera
            const backCam = devices.find(d => 
              d.label && (
                d.label.toLowerCase().includes('back') || 
                d.label.toLowerCase().includes('rear') || 
                d.label.toLowerCase().includes('environment')
              )
            );
            if (backCam) {
              setSelectedCameraId(backCam.id);
            }
          }
        })
        .catch((err) => {
          console.warn('Could not enumerate cameras:', err);
        });
    }
  }, []);

  // Initialize and start scanner
  useEffect(() => {
    if (!isScanningActive) {
      stopScanner();
      return;
    }

    let isMounted = true;
    nativeLoopRef.current = true;

    const startScanner = async () => {
      try {
        setErrorMessage(null);

        const elem = document.getElementById(containerId);
        if (!elem) return;

        // If instance already running, stop it first
        if (scannerInstanceRef.current && isRunningRef.current) {
          try {
            await scannerInstanceRef.current.stop();
          } catch (e) {}
          isRunningRef.current = false;
        }

        const html5QrCode = new Html5Qrcode(containerId, {
          formatsToSupport,
          verbose: false,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          }
        });
        scannerInstanceRef.current = html5QrCode;

        // Mobile-safe config: balanced FPS and responsive qrbox
        const config = {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            return {
              width: Math.floor(Math.min(viewfinderWidth * 0.88, 380)),
              height: Math.floor(Math.min(viewfinderHeight * 0.65, 260))
            };
          },
          aspectRatio: 1.777778,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          }
        };

        // Mobile-safe camera config without rigid min pixel constraints
        const cameraConfig = selectedCameraId 
          ? { deviceId: { exact: selectedCameraId } } 
          : { facingMode: { ideal: facingMode || 'environment' } };

        await html5QrCode.start(
          cameraConfig,
          config,
          (decodedText, decodedResult) => {
            if (cooldownRef.current) return;
            handleDetectedCode(decodedText);
          },
          (errorMessage) => {
            // Normal scan frame without barcode
          }
        );

        if (isMounted) {
          isRunningRef.current = true;
          setScannerReady(true);

          // Apply continuous autofocus if supported on device
          try {
            const videoElem = document.querySelector(`#${containerId} video`);
            if (videoElem && videoElem.srcObject) {
              const track = videoElem.srcObject.getVideoTracks()?.[0];
              if (track) {
                const capabilities = track.getCapabilities ? track.getCapabilities() : {};
                if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
                  track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] }).catch(() => {});
                }
              }
            }
          } catch (e) {}

          // Dual-Engine: Native BarcodeDetector parallel loop for ultra-fast GPU scanning (if supported)
          if ('BarcodeDetector' in window) {
            try {
              const supported = typeof window.BarcodeDetector.getSupportedFormats === 'function'
                ? await window.BarcodeDetector.getSupportedFormats()
                : ['qr_code', 'code_128', 'code_39', 'ean_13', 'upc_a'];

              const validFormats = ['qr_code', 'code_128', 'code_39', 'ean_13', 'upc_a']
                .filter(f => supported.includes(f));

              if (validFormats.length > 0) {
                const nativeDetector = new window.BarcodeDetector({ formats: validFormats });

                const scanNativeFrame = async () => {
                  if (!nativeLoopRef.current || !isMounted) return;
                  const video = document.querySelector(`#${containerId} video`);
                  if (video && video.readyState >= 2 && !cooldownRef.current) {
                    try {
                      const barcodes = await nativeDetector.detect(video);
                      if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                        handleDetectedCode(barcodes[0].rawValue);
                      }
                    } catch (err) {}
                  }
                  if (nativeLoopRef.current && isMounted) {
                    requestAnimationFrame(scanNativeFrame);
                  }
                };
                requestAnimationFrame(scanNativeFrame);
              }
            } catch (e) {}
          }
        }
      } catch (err) {
        console.error('Camera Scanner start error:', err);
        if (isMounted) {
          isRunningRef.current = false;
          setScannerReady(false);
          let userMsg = 'تعذر فتح بث الكاميرا المباشر على هذا الجهاز.';
          if (err?.name === 'NotAllowedError' || String(err).includes('NotAllowedError')) {
            userMsg = 'تم رفض الإذن بالوصول للكاميرا من إعدادات المتصفح. يرجى السماح بالوصول للكاميرا أو استخدام زر «التقاط صورة للباركود».';
          } else if (err?.name === 'NotFoundError' || String(err).includes('NotFoundError')) {
            userMsg = 'لم يتم العثور على كاميرا نشطة متصلة بالجهاز.';
          } else if (err?.name === 'OverconstrainedError') {
            userMsg = 'دقة الكاميرا غير متوافقة مع هذا المتصفح. يمكنك استخدام خيار «التقاط صورة للباركود» للعمل فوراً.';
          }
          setErrorMessage(userMsg);
        }
      }
    };

    const timer = setTimeout(() => {
      startScanner();
    }, 150);

    return () => {
      isMounted = false;
      nativeLoopRef.current = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, [isScanningActive, selectedCameraId, facingMode]);

  const stopScanner = async () => {
    nativeLoopRef.current = false;
    if (scannerInstanceRef.current && isRunningRef.current) {
      try {
        await scannerInstanceRef.current.stop();
        isRunningRef.current = false;
        setScannerReady(false);
      } catch (err) {
        // Ignored during cleanup
      }
    }
  };

  const handleDetectedCode = (rawText) => {
    if (cooldownRef.current) return;
    cooldownRef.current = true;
    setIsSuccessCooldown(true);
    setLastScannedText(rawText);

    if (onScanSuccess) {
      onScanSuccess(rawText);
    }

    // Cooldown 2s before accepting next scan
    setTimeout(() => {
      cooldownRef.current = false;
      setIsSuccessCooldown(false);
    }, 2000);
  };

  // Toggle front / back camera
  const handleToggleFacingMode = () => {
    if (cameras.length > 1) {
      const currentIndex = cameras.findIndex(c => c.id === selectedCameraId);
      const nextIndex = (currentIndex + 1) % cameras.length;
      setSelectedCameraId(cameras[nextIndex].id);
    } else {
      setSelectedCameraId(null);
      setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    }
  };

  // Handle Snapshot / Image File Scan (Works 100% on every mobile phone even over local HTTP)
  const handleFileChosen = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    try {
      // Create a temporary decoder instance if current instance is active or stopped
      const fileDecoder = new Html5Qrcode(`file-decoder-temp-${Date.now()}`, {
        formatsToSupport,
        verbose: false
      });
      const decodedText = await fileDecoder.scanFile(file, true);
      if (decodedText) {
        handleDetectedCode(decodedText);
      } else {
        alert('لم يتم العثور على باركود أو كود QR في الصورة. يرجى التأكد من وضوح الصورة وتكرار المحاولة.');
      }
    } catch (err) {
      console.warn('File barcode scan error:', err);
      alert('تعذر قراءة الباركود من هذه الصورة. يرجى تقريب الكاميرا وضبط الإضاءة على الباركود جيداً.');
    } finally {
      setIsProcessingFile(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div style={{
      position: 'relative',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      backgroundColor: '#030D1A',
      border: isSuccessCooldown ? '2.5px solid var(--success)' : '2px solid var(--primary)',
      boxShadow: isSuccessCooldown 
        ? '0 0 25px rgba(22, 163, 74, 0.4)' 
        : '0 8px 30px rgba(21, 136, 199, 0.25)',
      transition: 'all 0.3s ease'
    }}>
      {/* Hidden file input for native camera snapshot / gallery upload */}
      <input 
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChosen}
        style={{ display: 'none' }}
      />
      <div id={`file-decoder-temp-${Date.now()}`} style={{ display: 'none' }} />

      {/* Top Header / Scanner Controls */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '10px 14px',
        background: 'linear-gradient(180deg, rgba(3, 13, 26, 0.95) 0%, rgba(3, 13, 26, 0) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            backgroundColor: scannerReady ? 'var(--success)' : 'var(--warning)',
            boxShadow: scannerReady ? '0 0 8px var(--success)' : 'none'
          }} />
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.3px' }}>
            {scannerReady ? 'الكاميرا نشطة — وجّه البطاقة للمسح' : 'جاري إعداد الكاميرا...'}
          </span>
        </div>

        {showControls && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Native Snapshot button (always reliable fallback) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="التقاط صورة للباركود بكاميرا الهاتف"
              style={{
                background: 'rgba(21, 136, 199, 0.25)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--primary)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              <Camera size={13} color="var(--primary)" />
              <span>{isProcessingFile ? 'جاري التحليل...' : 'التقاط صورة'}</span>
            </button>

            {cameras.length > 1 && (
              <button
                type="button"
                onClick={handleToggleFacingMode}
                title="تبديل الكاميرا (الأمامية / الخلفية)"
                style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={12} />
                <span>تبديل</span>
              </button>
            )}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                title="إيقاف الكاميرا"
                style={{
                  background: 'rgba(220, 38, 38, 0.35)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(220, 38, 38, 0.5)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                إغلاق ✕
              </button>
            )}
          </div>
        )}
      </div>

      {/* Video Container Target for Html5Qrcode */}
      <div 
        id={containerId} 
        style={{
          width: '100%',
          minHeight: '280px',
          maxHeight: '440px',
          backgroundColor: '#030D1A',
          overflow: 'hidden'
        }} 
      />

      {/* Cyber Reticle Guide Overlay */}
      {scannerReady && !errorMessage && (
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}>
          {/* Target Reticle Box */}
          <div style={{
            width: '84%',
            maxWidth: '360px',
            height: '240px',
            position: 'relative',
            borderRadius: '16px'
          }}>
            {/* 4 Cyber Corner Brackets */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '28px',
              height: '28px',
              borderTop: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderRight: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderTopRightRadius: '14px'
            }} />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '28px',
              height: '28px',
              borderTop: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderLeft: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderTopLeftRadius: '14px'
            }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '28px',
              height: '28px',
              borderBottom: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderRight: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderBottomRightRadius: '14px'
            }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '28px',
              height: '28px',
              borderBottom: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderLeft: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderBottomLeftRadius: '14px'
            }} />

            {/* Moving Laser Scan Line */}
            {!isSuccessCooldown && (
              <div 
                className="animated-scanner-laser"
                style={{
                  position: 'absolute',
                  left: '8px',
                  right: '8px',
                  height: '2.5px',
                  backgroundColor: 'var(--primary)',
                  boxShadow: '0 0 12px var(--primary), 0 0 4px #FFFFFF',
                  borderRadius: '2px'
                }} 
              />
            )}

            {/* Success Celebration Overlay */}
            {isSuccessCooldown && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(22, 163, 74, 0.35)',
                borderRadius: '14px',
                backdropFilter: 'blur(3px)',
                animation: 'fadeIn 0.2s ease'
              }}>
                <CheckCircle2 size={46} color="#FFFFFF" style={{ filter: 'drop-shadow(0 0 10px var(--success))' }} />
                <span style={{ color: '#FFFFFF', fontWeight: '900', fontSize: '15px', marginTop: '8px' }}>
                  تم مسح الباركود بنجاح! ✓
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Hint Banner */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        padding: '10px 14px',
        background: 'linear-gradient(0deg, rgba(3, 13, 26, 0.94) 0%, rgba(3, 13, 26, 0) 100%)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '800', color: isSuccessCooldown ? 'var(--success)' : 'rgba(255, 255, 255, 0.9)' }}>
          {isSuccessCooldown 
            ? `تم قراءة الكود بنجاح: ${lastScannedText}` 
            : 'وجّه بطاقة الطالب أو شاشة الهاتف أمام الكاميرا للمسح الفوري'}
        </div>
      </div>

      {/* Insecure Context (HTTP on Wi-Fi) or Camera Error Fallback View */}
      {(errorMessage || isSecureWarning) && !scannerReady && (
        <div style={{
          padding: '28px 18px',
          textAlign: 'center',
          backgroundColor: '#030D1A',
          color: '#FFFFFF',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: 'rgba(220, 38, 38, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--danger)'
          }}>
            <CameraOff size={26} />
          </div>

          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--danger)', maxWidth: '420px', lineHeight: '1.5' }}>
            {errorMessage || 'المتصفح يقيد تشغيل الكاميرا المباشرة عبر شبكة Wi-Fi المحلية (HTTP).'}
          </div>

          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.75)', maxWidth: '400px', margin: 0, lineHeight: '1.6' }}>
            لا تقلق! يمكنك استخدام زر <strong>«التقاط صورة للباركود»</strong> أدناه لالتقاط صورة بكاميرا الهاتف وقراءتها فوراً بدون قيود، أو استخدام قارئ الباركود اليدوي USB.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Camera size={16} />
              <span>التقاط صورة للباركود بكاميرا الهاتف</span>
            </button>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes scannerLaserSweep {
          0% { top: 5%; opacity: 0.8; }
          50% { top: 92%; opacity: 1; }
          100% { top: 5%; opacity: 0.8; }
        }
        .animated-scanner-laser {
          animation: scannerLaserSweep 2.2s ease-in-out infinite;
        }
        #${containerId} video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
        #${containerId} img {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default CameraBarcodeScanner;
