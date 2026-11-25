import React from 'react';
import { Calendar, RefreshCw, ShieldCheck } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';

export const TeacherWelcomeBanner = ({
  currentUser,
  welcomeData,
  lang,
  refreshing = false,
  onRefresh,
}) => {
  const isAr = lang === 'ar';

  const displayName = isAr
    ? (welcomeData?.nameAr || welcomeData?.teacherName || currentUser?.nameAr || currentUser?.name || 'المعلم')
    : (welcomeData?.nameEn || welcomeData?.teacherName || currentUser?.name || 'Educator');

  const avatarSrc = welcomeData && Object.prototype.hasOwnProperty.call(welcomeData, 'avatar')
    ? welcomeData.avatar
    : (currentUser?.avatar || null);

  const titleText = isAr
    ? (welcomeData?.titleAr || welcomeData?.subjectAr || currentUser?.roleLabelAr || '')
    : (welcomeData?.titleEn || welcomeData?.subjectEn || currentUser?.roleLabel || '');

  const subjectText = isAr ? welcomeData?.subjectAr : welcomeData?.subjectEn;
  const centersList = Array.isArray(welcomeData?.centers) ? welcomeData.centers : [];
  const centersSummary = centersList.length > 0
    ? centersList.slice(0, 2).join(' • ') + (centersList.length > 2 ? ` (+${centersList.length - 2})` : '')
    : '';

  const subtitleParts = [];
  if (titleText) subtitleParts.push(titleText);
  if (subjectText && !titleText.includes(subjectText)) subtitleParts.push(subjectText);
  if (centersSummary) subtitleParts.push(centersSummary);
  if (welcomeData?.teacherCode) subtitleParts.push(welcomeData.teacherCode);

  const planLabel = isAr ? welcomeData?.planLabelAr : welcomeData?.planLabelEn;
  const isVerified = welcomeData ? Boolean(welcomeData.isVerified) : true;

  const currentDateFormatted = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      padding: '20px 24px',
      boxShadow: 'var(--shadow-xs)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
        <Avatar
          src={avatarSrc}
          name={displayName}
          size={58}
          border="2.5px solid var(--primary)"
          online
        />

        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: '0 0 2px 0',
              fontFamily: 'var(--font-heading), var(--font-arabic)',
            }}>
              {isAr ? `مرحباً، ${displayName}` : `Welcome back, ${displayName}`}
            </h1>

            {isVerified && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(21, 136, 199, 0.1)',
                color: 'var(--primary)',
              }}>
                <ShieldCheck size={12} />
                <span>{isAr ? 'معلم معتمد' : 'Verified Educator'}</span>
              </span>
            )}

            {planLabel && (
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
              }}>
                {planLabel}
              </span>
            )}
          </div>

          {subtitleParts.length > 0 && (
            <div style={{
              fontSize: '12.5px',
              color: 'var(--text-secondary)',
              marginTop: '3px',
              wordBreak: 'break-word',
            }}>
              {subtitleParts.join(' • ')}
            </div>
          )}
        </div>
      </div>

      {/* Date & live refresh */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-subtle)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
        }}>
          <Calendar size={13} color="var(--primary)" />
          <span>{currentDateFormatted}</span>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            title={isAr ? 'تحديث بيانات اللوحة' : 'Refresh dashboard'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '12px',
              fontWeight: '700',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-subtle)',
              padding: '6px 11px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              cursor: refreshing ? 'wait' : 'pointer',
              opacity: refreshing ? 0.65 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            <RefreshCw size={13} color="var(--primary)" />
            <span>{isAr ? (refreshing ? 'جاري التحديث...' : 'تحديث') : (refreshing ? 'Refreshing...' : 'Refresh')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
