import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { 
  Camera, 
  CameraOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Maximize2, 
  Minimize2, 
  Sparkles,
  Zap,
  Volume2
} from 'lucide-react';

export const CameraBarcodeScanner = ({
  onScanSuccess,
  isScanningActive = true,
  onClose,
  showControls = true
}) => {
  const [scannerReady, setScannerReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [isSuccessCooldown, setIsSuccessCooldown] = useState(false);
  const [lastScannedText, setLastScannedText] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);
  const containerId = useRef(`qr-scanner-${Math.random().toString(36).substring(2, 9)}`).current;
  const isRunningRef = useRef(false);
  const cooldownRef = useRef(false);

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

  // Enumerate cameras
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer environment/back camera if available
          const backCam = devices.find(d => 
            d.label.toLowerCase().includes('back') || 
            d.label.toLowerCase().includes('rear') || 
            d.label.toLowerCase().includes('environment')
          );
          setSelectedCameraId(backCam ? backCam.id : devices[0].id);
        }
      })
      .catch((err) => {
        console.warn('Could not enumerate cameras:', err);
      });
  }, []);

  // Initialize and start scanner
  useEffect(() => {
    if (!isScanningActive) {
      stopScanner();
      return;
    }

    let isMounted = true;

    const startScanner = async () => {
      try {
        setErrorMessage(null);

        // Ensure container exists in DOM
        const elem = document.getElementById(containerId);
        if (!elem) return;

        // If instance already running, stop it first
        if (scannerInstanceRef.current && isRunningRef.current) {
          await scannerInstanceRef.current.stop();
          isRunningRef.current = false;
        }

        const html5QrCode = new Html5Qrcode(containerId, {
          formatsToSupport,
          verbose: false
        });
        scannerInstanceRef.current = html5QrCode;

        // Configuration
        const config = {
          fps: 15,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minDim = Math.min(viewfinderWidth, viewfinderHeight);
            const size = Math.floor(minDim * 0.75);
            return { width: size, height: Math.floor(size * 0.7) }; // Wide rectangle suitable for 1D barcodes and QR
          },
          aspectRatio: 1.333333
        };

        const cameraConfig = selectedCameraId 
          ? { deviceId: { exact: selectedCameraId } } 
          : { facingMode };

        await html5QrCode.start(
          cameraConfig,
          config,
          (decodedText, decodedResult) => {
            if (cooldownRef.current) return;
            handleDetectedCode(decodedText);
          },
          (errorMessage) => {
            // Frame parse error - normal on every frame without a barcode
          }
        );

        if (isMounted) {
          isRunningRef.current = true;
          setScannerReady(true);
        }
      } catch (err) {
        console.error('Camera Scanner start error:', err);
        if (isMounted) {
          isRunningRef.current = false;
          setScannerReady(false);
          let userMsg = 'تعذر تشغيل الكاميرا. يرجى التأكد من توصيل الكاميرا ومنح المتصفح صلاحية الوصول إليها.';
          if (err?.name === 'NotAllowedError' || err?.includes?.('NotAllowedError')) {
            userMsg = 'تم رفض الإذن بالوصول للكاميرا من إعدادات المتصفح. يرجى السماح بالوصول وإعادة المحاولة.';
          } else if (err?.name === 'NotFoundError' || err?.includes?.('NotFoundError')) {
            userMsg = 'لم يتم العثور على أي كاميرا متصلة بالجهاز.';
          }
          setErrorMessage(userMsg);
        }
      }
    };

    const timer = setTimeout(() => {
      startScanner();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, [isScanningActive, selectedCameraId, facingMode]);

  const stopScanner = async () => {
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
    cooldownRef.current = true;
    setIsSuccessCooldown(true);
    setLastScannedText(rawText);

    // Call success handler
    if (onScanSuccess) {
      onScanSuccess(rawText);
    }

    // Cooldown 2.2s before accepting next scan
    setTimeout(() => {
      cooldownRef.current = false;
      setIsSuccessCooldown(false);
    }, 2200);
  };

  // Flip camera between front / back
  const handleToggleFacingMode = () => {
    if (cameras.length > 1) {
      const currentIndex = cameras.findIndex(c => c.id === selectedCameraId);
      const nextIndex = (currentIndex + 1) % cameras.length;
      setSelectedCameraId(cameras[nextIndex].id);
    } else {
      setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    }
  };

  return (
    <div style={{
      position: 'relative',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      backgroundColor: '#030D1A',
      border: isSuccessCooldown ? '2px solid var(--success)' : '2px solid var(--primary)',
      boxShadow: isSuccessCooldown 
        ? '0 0 25px rgba(22, 163, 74, 0.4)' 
        : '0 8px 30px rgba(21, 136, 199, 0.25)',
      transition: 'all 0.3s ease'
    }}>
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
        padding: '12px 16px',
        background: 'linear-gradient(180deg, rgba(3, 13, 26, 0.85) 0%, rgba(3, 13, 26, 0) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: scannerReady ? 'var(--success)' : 'var(--warning)',
            boxShadow: scannerReady ? '0 0 8px var(--success)' : 'none'
          }} />
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.3px' }}>
            {scannerReady ? 'الكاميرا نشطة وجاهزة للمسح' : 'جاري تشغيل الكاميرا...'}
          </span>
        </div>

        {showControls && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Flip Camera button if multiple cameras */}
            {cameras.length > 1 && (
              <button
                type="button"
                onClick={handleToggleFacingMode}
                title="تبديل الكاميرا (الأمامية / الخلفية)"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={13} />
                <span>تبديل</span>
              </button>
            )}

            {/* Close button if provided */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                title="إغلاق الكاميرا"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                إغلاق
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
          minHeight: '320px',
          maxHeight: '440px',
          backgroundColor: '#030D1A',
          overflow: 'hidden'
        }} 
      />

      {/* Futuristic Cyber Reticle Overlay */}
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
            width: '74%',
            maxWidth: '320px',
            height: '210px',
            position: 'relative',
            borderRadius: '16px',
            boxShadow: isSuccessCooldown 
              ? '0 0 0 9999px rgba(3, 13, 26, 0.45), 0 0 20px var(--success)' 
              : '0 0 0 9999px rgba(3, 13, 26, 0.55)'
          }}>
            {/* 4 Cyber Corner Brackets */}
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '24px',
              height: '24px',
              borderTop: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderRight: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderTopRightRadius: '12px'
            }} />
            <div style={{
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              width: '24px',
              height: '24px',
              borderTop: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderLeft: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderTopLeftRadius: '12px'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '24px',
              height: '24px',
              borderBottom: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderRight: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderBottomRightRadius: '12px'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              left: '-2px',
              width: '24px',
              height: '24px',
              borderBottom: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderLeft: `4px solid ${isSuccessCooldown ? 'var(--success)' : 'var(--primary)'}`,
              borderBottomLeftRadius: '12px'
            }} />

            {/* Moving Laser Scan Line */}
            {!isSuccessCooldown && (
              <div 
                className="animated-laser-line"
                style={{
                  position: 'absolute',
                  left: '6px',
                  right: '6px',
                  height: '2px',
                  backgroundColor: 'var(--primary)',
                  boxShadow: '0 0 10px var(--primary), 0 0 4px #FFFFFF',
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
                backgroundColor: 'rgba(22, 163, 74, 0.25)',
                borderRadius: '14px',
                backdropFilter: 'blur(2px)',
                animation: 'fadeIn 0.2s ease'
              }}>
                <CheckCircle2 size={44} color="#FFFFFF" style={{ filter: 'drop-shadow(0 0 8px var(--success))' }} />
                <span style={{ color: '#FFFFFF', fontWeight: '900', fontSize: '14px', marginTop: '6px' }}>
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
        padding: '12px 16px',
        background: 'linear-gradient(0deg, rgba(3, 13, 26, 0.9) 0%, rgba(3, 13, 26, 0) 100%)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '800', color: isSuccessCooldown ? 'var(--success)' : 'rgba(255, 255, 255, 0.85)' }}>
          {isSuccessCooldown 
            ? `تم التعرف: ${lastScannedText}` 
            : 'وجّه باركود أو كود QR للطالب داخل المربع لمسحه فوراً'}
        </div>
      </div>

      {/* Error Fallback Notice */}
      {errorMessage && (
        <div style={{
          padding: '30px 20px',
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
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgba(220, 38, 38, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--danger)'
          }}>
            <CameraOff size={26} />
          </div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--danger)', maxWidth: '380px' }}>
            {errorMessage}
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', maxWidth: '360px', margin: 0 }}>
            يمكنك استخدام الإدخال اليدوي أو قارئ الباركود اللاسلكي USB أو أزرار التجربة السريعة للطلاب بالأسفل.
          </p>
        </div>
      )}

      {/* Global CSS style for laser animation */}
      <style>{`
        @keyframes laserSweep {
          0% { top: 6%; opacity: 0.7; }
          50% { top: 92%; opacity: 1; }
          100% { top: 6%; opacity: 0.7; }
        }
        .animated-laser-line {
          animation: laserSweep 2s ease-in-out infinite;
        }
        #${containerId} video {
          object-fit: cover !important;
          border-radius: var(--radius-xl);
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
};
export default CameraBarcodeScanner;
