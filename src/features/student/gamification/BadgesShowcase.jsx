import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Flame,
  Target,
  Shield,
  BookOpen,
  Lock,
  CheckCircle2,
  History,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

function renderBadgeIcon(iconName, unlocked) {
  const color = unlocked ? 'var(--primary)' : 'var(--text-muted)';
  switch (iconName) {
    case 'BookOpen':
      return <BookOpen size={22} color={unlocked ? '#0284C7' : color} />;
    case 'Flame':
      return <Flame size={22} color={unlocked ? '#F59E0B' : color} />;
    case 'Target':
      return <Target size={22} color={unlocked ? '#10B981' : color} />;
    case 'Shield':
      return <Shield size={22} color={unlocked ? '#8B5CF6' : color} />;
    case 'Trophy':
      return <Trophy size={22} color={unlocked ? '#F59E0B' : color} />;
    default:
      return <Award size={22} color={color} />;
  }
}

function formatEntryDate(iso, lang) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return String(iso).slice(0, 10);
  }
}

export const BadgesShowcase = ({ badges = [], recentLedger = [], lang = 'ar' }) => {
  const isAr = lang === 'ar';
  const [showLedger, setShowLedger] = useState(false);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '22px 24px',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={18} color="var(--primary)" />
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: 0,
              fontFamily: 'var(--font-arabic)',
            }}
          >
            {isAr ? 'معرض شارات التميز والأوسمة' : 'Achievement Badges & Honors'}
          </h3>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: '800',
              padding: '2px 9px',
              borderRadius: '999px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            {unlockedCount} / {badges.length}
          </span>
        </div>

        {recentLedger.length > 0 && (
          <button
            type="button"
            onClick={() => setShowLedger((prev) => !prev)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <History size={14} color="var(--primary)" />
            <span>{isAr ? `سجل نقاط الخبرة (${recentLedger.length})` : `XP History (${recentLedger.length})`}</span>
            {showLedger ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>

      {/* Badges Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '14px',
        }}
      >
        {badges.length === 0 && (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '13.5px',
              fontWeight: '700',
            }}
          >
            {isAr ? 'لا توجد شارات متاحة حالياً.' : 'No badges available yet.'}
          </div>
        )}

        {badges.map((b) => {
          const unlocked = Boolean(b.unlocked);
          const percent = Math.min(100, Math.max(0, Number(b.progressPercent ?? 0)));

          return (
            <div
              key={b.id}
              style={{
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: unlocked ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-subtle)',
                border: '1px solid',
                borderColor: unlocked ? 'rgba(16, 185, 129, 0.35)' : 'var(--border-subtle)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '13px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '13px',
                  backgroundColor: unlocked ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {renderBadgeIcon(b.icon, unlocked)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {isAr ? b.titleAr : b.titleEn || b.titleAr}
                </div>
                <div
                  style={{
                    fontSize: '11.5px',
                    color: 'var(--text-secondary)',
                    marginTop: '3px',
                    lineHeight: 1.45,
                  }}
                >
                  {isAr ? b.descAr : b.descEn || b.descAr}
                </div>

                {unlocked ? (
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--success)',
                      fontWeight: '800',
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CheckCircle2 size={13} />
                    <span>
                      {b.unlockedAt
                        ? isAr
                          ? `تم الإنجاز: ${b.unlockedAt}`
                          : `Unlocked: ${b.unlockedAt}`
                        : isAr
                          ? 'تم الإنجاز بنجاح'
                          : 'Unlocked'}
                    </span>
                  </div>
                ) : (
                  <div style={{ marginTop: '8px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        fontWeight: '700',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Lock size={11} />
                        <span>{isAr ? 'قيد الإنجاز' : 'In progress'}</span>
                      </span>
                      <span>
                        {b.current} / {b.target}
                      </span>
                    </div>
                    <div
                      style={{
                        height: '5px',
                        borderRadius: '999px',
                        backgroundColor: 'var(--bg-surface)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          backgroundColor: 'var(--primary)',
                          borderRadius: '999px',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapsible Recent XP Ledger */}
      {showLedger && recentLedger.length > 0 && (
        <div
          style={{
            marginTop: '18px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              marginBottom: '10px',
            }}
          >
            {isAr ? 'أحدث نقاط الخبرة المسجّلة في حسابك' : 'Recent Verified XP Entries'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentLedger.slice(0, 10).map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  fontSize: '12.5px',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                    {entry.reasonAr}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {formatEntryDate(entry.createdAt, lang)}
                  </div>
                </div>
                <span
                  style={{
                    fontWeight: '900',
                    color: 'var(--success)',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    padding: '3px 9px',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    fontSize: '12px',
                  }}
                >
                  +{entry.points} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
