import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Hash,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services/studentApi';
import {
  OfficialCertificateDocument,
  normalizeStudentCertificate,
} from '../../features/student/certificates';

export const CertificateVerifyView = () => {
  const { serialNumber = '' } = useParams();
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [inputSerial, setInputSerial] = useState(serialNumber);
  const [prevSerialParam, setPrevSerialParam] = useState(serialNumber);
  const [loading, setLoading] = useState(Boolean(serialNumber));
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (serialNumber !== prevSerialParam) {
    setPrevSerialParam(serialNumber);
    setInputSerial(serialNumber);
    setLoading(Boolean(serialNumber));
    setResult(null);
    setErrorMsg(null);
  }

  const runVerify = useCallback(
    async (rawCode) => {
      const code = String(rawCode || '').trim().toUpperCase();
      if (!code) {
        setResult(null);
        setErrorMsg(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await studentApi.gamification.verifyCertificate(code);
        setResult(res?.data || null);
      } catch (err) {
        setResult(null);
        setErrorMsg(
          err?.message ||
            (isAr
              ? 'الشهادة المطلوبة غير مسجلة في قاعدة بيانات منصة متفوّق الرسمية.'
              : 'No certificate found with this serial number in our official registry.')
        );
      } finally {
        setLoading(false);
      }
    },
    [isAr]
  );

  useEffect(() => {
    if (!serialNumber) return undefined;
    let active = true;
    const code = String(serialNumber).trim().toUpperCase();

    studentApi.gamification
      .verifyCertificate(code)
      .then((res) => {
        if (!active) return;
        setResult(res?.data || null);
        setErrorMsg(null);
      })
      .catch((err) => {
        if (!active) return;
        setResult(null);
        setErrorMsg(
          err?.message ||
            (isAr
              ? 'الشهادة المطلوبة غير مسجلة في قاعدة بيانات منصة متفوّق الرسمية.'
              : 'No certificate found with this serial number in our official registry.')
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [serialNumber, isAr]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = inputSerial.trim().toUpperCase();
    if (!clean) return;
    if (clean === String(serialNumber || '').trim().toUpperCase()) {
      runVerify(clean);
    } else {
      navigate(`/verify/${encodeURIComponent(clean)}`);
    }
  };

  const normalizedCert = result ? normalizeStudentCertificate(result) : null;
  const isVerified = Boolean(result?.isValid && result?.status === 'verified');
  const isRevoked = result?.status === 'revoked';
  const isTampered = Boolean(result?.tampered || result?.status === 'tampered');

  return (
    <div
      style={{
        maxWidth: '980px',
        margin: '0 auto',
        padding: '36px 20px 80px',
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily: isRtl ? 'var(--font-arabic, sans-serif)' : 'var(--font-sans, sans-serif)',
      }}
    >
      {/* Header & Search Form */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '22px',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: 'rgba(21, 136, 199, 0.12)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'التحقق الرسمي من شهادات منصة متفوّق' : 'Official Motafawweq Certificate Verification'}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              {isAr
                ? 'أدخل الرقم التسلسلي للشهادة (مثل MTF-CRS-2026-1234) للتحقق من صحتها وتوقيعها الرقمي فوراً'
                : 'Enter a certificate serial number to cryptographically verify its authenticity'}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginTop: '18px',
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search
              size={16}
              color="var(--text-muted)"
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                insetInlineStart: '14px',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={inputSerial}
              onChange={(e) => setInputSerial(e.target.value)}
              placeholder={isAr ? 'مثال: MTF-CRS-2026-4821' : 'e.g. MTF-CRS-2026-4821'}
              style={{
                width: '100%',
                padding: '12px 14px',
                paddingInlineStart: '40px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'var(--font-mono), monospace',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !inputSerial.trim()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '12px 22px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: '800',
              cursor: loading ? 'wait' : 'pointer',
              opacity: !inputSerial.trim() ? 0.6 : 1,
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            <span>{isAr ? 'تحقق الآن' : 'Verify Now'}</span>
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div
          style={{
            padding: '48px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontWeight: '700',
          }}
        >
          <Loader2 size={28} color="var(--primary)" className="animate-spin" style={{ marginBottom: '10px' }} />
          <div>{isAr ? 'جاري فحص التوقيع الرقمي للشهادة...' : 'Verifying certificate cryptographic signature...'}</div>
        </div>
      )}

      {/* Not Found State */}
      {!loading && errorMsg && (
        <div
          role="alert"
          style={{
            padding: '28px 24px',
            borderRadius: '20px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1.5px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <XCircle size={28} color="#DC2626" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '16px', fontWeight: '900', color: '#DC2626', marginBottom: '4px' }}>
              {isAr ? 'تعذر العثور على الشهادة' : 'Certificate Not Found'}
            </div>
            <div style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{errorMsg}</div>
          </div>
        </div>
      )}

      {/* Result Display */}
      {!loading && result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Status Banner */}
          <div
            style={{
              padding: '20px 22px',
              borderRadius: '18px',
              backgroundColor: isVerified
                ? 'rgba(16, 185, 129, 0.1)'
                : isRevoked
                  ? 'rgba(245, 158, 11, 0.12)'
                  : 'rgba(239, 68, 68, 0.1)',
              border: `1.5px solid ${
                isVerified
                  ? 'rgba(16, 185, 129, 0.35)'
                  : isRevoked
                    ? 'rgba(245, 158, 11, 0.4)'
                    : 'rgba(239, 68, 68, 0.4)'
              }`,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              {isVerified ? (
                <CheckCircle2 size={26} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              ) : isRevoked ? (
                <AlertTriangle size={26} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <ShieldAlert size={26} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              )}
              <div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '900',
                    color: isVerified ? '#059669' : isRevoked ? '#B45309' : '#DC2626',
                  }}
                >
                  {isVerified
                    ? isAr
                      ? 'شهادة صحيحة وموثّقة رسمياً'
                      : 'Authentic & Officially Verified Certificate'
                    : isRevoked
                      ? isAr
                        ? 'هذه الشهادة ملغاة من الجهة المُصدِرة'
                        : 'This Certificate Has Been Revoked'
                      : isAr
                        ? 'تحذير أمني: فشل التحقق من التوقيع الرقمي للشهادة'
                        : 'Security Warning: Signature Verification Failed'}
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {isVerified
                    ? isAr
                      ? `تم التحقق من الرقم التسلسلي ${result.serialId} والتوقيع المشفّر بنجاح.`
                      : `Serial ${result.serialId} and HMAC-SHA256 signature verified.`
                    : isRevoked
                      ? result.revocationReason ||
                        (isAr ? 'تم إلغاء الشهادة من قِبل المعلم المسؤول.' : 'Revoked by issuing instructor.')
                      : isAr
                        ? 'بيانات هذه الشهادة لا تتطابق مع التوقيع الرقمي المسجل.'
                        : 'Certificate payload does not match its recorded cryptographic signature.'}
                </div>
              </div>
            </div>

            {result.signatureHash && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'var(--text-secondary)',
                }}
              >
                <Hash size={12} color="var(--primary)" />
                <span>{String(result.signatureHash).slice(0, 18)}…</span>
              </div>
            )}
          </div>

          {/* Live Official Document Preview for Verified Certificates */}
          {isVerified && normalizedCert && !isTampered && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <OfficialCertificateDocument cert={normalizedCert} lang={lang} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
