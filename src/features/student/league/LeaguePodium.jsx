import React from 'react';
import { Trophy, Crown } from 'lucide-react';
import { LeagueAvatar } from './LeagueAvatar';

const handleCardKeyDown = (e, onSelect, student) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onSelect?.(student);
  }
};

export const LeaguePodium = ({ top1, top2, top3, lang = 'ar', onSelectStudent, leagueSubtitle }) => {
  const isAr = lang === 'ar';

  if (!top1 && !top2 && !top3) return null;

  const renderDesktopSpot = (student, place) => {
    if (!student) return null;
    const isFirst = place === 1;
    const isSecond = place === 2;
    const accent = isFirst ? '#F59E0B' : isSecond ? 'var(--primary)' : '#B45309';
    const pedestalHeight = isFirst ? '96px' : isSecond ? '72px' : '58px';
    const avatarSize = isFirst ? 60 : 50;
    const rankLabel = isFirst
      ? isAr
        ? 'المركز الأول'
        : '1st Place'
      : isSecond
        ? isAr
          ? 'المركز الثاني'
          : '2nd Place'
        : isAr
          ? 'المركز الثالث'
          : '3rd Place';

    return (
      <div
        className="league-podium-card"
        onClick={() => onSelectStudent?.(student)}
        onKeyDown={(e) => handleCardKeyDown(e, onSelectStudent, student)}
        role="button"
        tabIndex={0}
        style={{
          flex: 1,
          maxWidth: isFirst ? '210px' : '185px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          minWidth: 0,
        }}
      >
        <div style={{ position: 'relative', marginBottom: '8px' }}>
          {isFirst && (
            <Crown
              size={20}
              color="#F59E0B"
              fill="#F59E0B"
              style={{
                position: 'absolute',
                top: '-18px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          )}
          <LeagueAvatar
            src={student.avatar}
            name={student.nameAr}
            size={avatarSize}
            borderColor={student.isMe ? 'var(--primary)' : accent}
            borderWidth={isFirst ? 3 : 2}
            boxShadow={isFirst ? '0 4px 14px rgba(245, 158, 11, 0.28)' : 'none'}
          />
        </div>

        <div
          title={student.nameAr}
          style={{
            fontSize: isFirst ? '13.5px' : '13px',
            fontWeight: '800',
            color: student.isMe ? 'var(--primary)' : 'var(--text-primary)',
            marginBottom: '2px',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {student.nameAr}
        </div>

        <div style={{ fontSize: '13px', fontWeight: '900', color: accent, marginBottom: '8px' }}>
          {student.score.toLocaleString()} XP
        </div>

        <div
          style={{
            width: '100%',
            height: pedestalHeight,
            borderRadius: '14px 14px 0 0',
            backgroundColor: isFirst ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-subtle)',
            border: `1.5px solid ${isFirst ? 'rgba(245, 158, 11, 0.6)' : 'var(--border-medium)'}`,
            borderBottom: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: isFirst ? '22px' : '18px', fontWeight: '900', color: accent }}>{place}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>{rankLabel}</div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '20px',
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
          gap: '8px',
          paddingBottom: '12px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {isAr ? 'منصة التتويج والمراكز الأولى' : 'Top 3 Podium'}
          </h3>
        </div>
        {leagueSubtitle && (
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {leagueSubtitle}
          </span>
        )}
      </div>

      {/* Desktop Olympic Podium */}
      <div className="league-podium-desktop">
        {renderDesktopSpot(top2, 2)}
        {renderDesktopSpot(top1, 1)}
        {renderDesktopSpot(top3, 3)}
      </div>

      {/* Mobile Stacked Podium */}
      <div className="league-podium-mobile">
        {[
          { student: top1, place: 1, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)' },
          { student: top2, place: 2, color: 'var(--primary)', bg: 'var(--bg-subtle)' },
          { student: top3, place: 3, color: '#B45309', bg: 'var(--bg-subtle)' },
        ]
          .filter((x) => Boolean(x.student))
          .map(({ student, place, color, bg }) => (
            <div
              key={place}
              onClick={() => onSelectStudent?.(student)}
              onKeyDown={(e) => handleCardKeyDown(e, onSelectStudent, student)}
              role="button"
              tabIndex={0}
              style={{
                padding: '12px 14px',
                borderRadius: '14px',
                backgroundColor: bg,
                border: `1px solid ${place === 1 ? 'rgba(245, 158, 11, 0.5)' : 'var(--border-subtle)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                marginBottom: place < 3 ? '8px' : 0,
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '9px',
                  backgroundColor: color,
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '900',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {place}
              </div>
              <LeagueAvatar src={student.avatar} name={student.nameAr} size={42} borderColor={color} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '13.5px',
                    fontWeight: '800',
                    color: student.isMe ? 'var(--primary)' : 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {student.nameAr}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                  {student.badgeTitleAr} • {student.tierLabelAr}
                </div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '900', color, flexShrink: 0 }}>
                {student.score.toLocaleString()} XP
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
