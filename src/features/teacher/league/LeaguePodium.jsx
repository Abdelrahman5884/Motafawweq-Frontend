import React from 'react';
import { Trophy, Crown, UserPlus } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';

const PodiumSpot = ({
  student,
  place,
  onSelect,
  isDark,
  isMobile,
  isAr,
}) => {
  if (!student) return null;

  const isFirst = place === 1;
  const isSecond = place === 2;

  const palette = isFirst
    ? {
        border: '#F59E0B',
        badgeBg: '#F59E0B',
        pillBg: 'rgba(245, 158, 11, 0.22)',
        pillColor: isDark ? '#FDE68A' : '#B45309',
        pedestalBg: isDark
          ? 'linear-gradient(180deg, rgba(245, 158, 11, 0.35) 0%, rgba(15, 23, 42, 0.95) 100%)'
          : 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)',
        numColor: '#D97706',
        titleColor: isDark ? '#FDE68A' : '#92400E',
        shadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
        pedestalHeight: isMobile ? '110px' : '140px',
        avatarSize: isMobile ? 56 : 76,
        title: isAr ? 'بطل الكورس' : 'Champion',
        subTitle: isAr ? 'المركز الأول' : '1st Place',
      }
    : isSecond
    ? {
        border: '#38BDF8',
        badgeBg: '#0284C7',
        pillBg: 'rgba(56, 189, 248, 0.15)',
        pillColor: isDark ? '#38BDF8' : '#0284C7',
        pedestalBg: isDark
          ? 'linear-gradient(180deg, rgba(56, 189, 248, 0.28) 0%, rgba(15, 23, 42, 0.95) 100%)'
          : 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 100%)',
        numColor: '#0284C7',
        titleColor: isDark ? '#BAE6FD' : '#0369A1',
        shadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
        pedestalHeight: isMobile ? '82px' : '102px',
        avatarSize: isMobile ? 46 : 62,
        title: isAr ? 'وصيف الكورس' : 'Runner-Up',
        subTitle: null,
      }
    : {
        border: '#EA580C',
        badgeBg: '#EA580C',
        pillBg: 'rgba(234, 88, 12, 0.15)',
        pillColor: isDark ? '#FDBA74' : '#C2410C',
        pedestalBg: isDark
          ? 'linear-gradient(180deg, rgba(234, 88, 12, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)'
          : 'linear-gradient(180deg, #FFEDD5 0%, #FED7AA 100%)',
        numColor: '#C2410C',
        titleColor: isDark ? '#FED7AA' : '#9A3412',
        shadow: '0 4px 14px rgba(234, 88, 12, 0.3)',
        pedestalHeight: isMobile ? '64px' : '78px',
        avatarSize: isMobile ? 42 : 56,
        title: isAr ? 'المركز الثالث' : '3rd Place',
        subTitle: null,
      };

  return (
    <div
      onClick={() => onSelect(student)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(student);
        }
      }}
      role="button"
      tabIndex={0}
      style={{
        flex: isMobile ? (isFirst ? '1.15 1 0' : '1 1 0') : `1 1 ${isFirst ? 260 : 225}px`,
        minWidth: 0,
        maxWidth: isMobile ? (isFirst ? '138px' : '118px') : (isFirst ? '275px' : '235px'),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.15s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ position: 'relative', marginBottom: isMobile ? '5px' : '8px', paddingTop: isFirst ? '18px' : '0' }}>
        {isFirst && (
          <Crown
            size={isMobile ? 20 : 26}
            color="#F59E0B"
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              filter: 'drop-shadow(0 2px 6px rgba(245, 158, 11, 0.5))',
            }}
          />
        )}
        <Avatar
          src={student.avatar}
          name={student.nameAr}
          size={palette.avatarSize}
          border={`${isFirst ? 3 : 2.5}px solid ${palette.border}`}
          boxShadow={palette.shadow}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-3px',
            right: '-3px',
            width: isMobile ? '19px' : '23px',
            height: isMobile ? '19px' : '23px',
            borderRadius: '50%',
            backgroundColor: palette.badgeBg,
            color: '#FFFFFF',
            fontSize: isMobile ? '10px' : '11px',
            fontWeight: '900',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid #FFFFFF',
          }}
        >
          #{place}
        </div>
      </div>

      <div
        style={{
          fontSize: isMobile ? (isFirst ? '12px' : '11px') : (isFirst ? '15px' : '13.5px'),
          fontWeight: '900',
          color: isDark ? '#FFFFFF' : '#0F172A',
          marginBottom: '2px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}
      >
        {student.nameAr}
      </div>

      {!isMobile && student.schoolAr ? (
        <div
          style={{
            fontSize: '10.5px',
            color: isDark ? '#94A3B8' : '#64748B',
            marginBottom: '4px',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {student.schoolAr}
        </div>
      ) : null}

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: isMobile ? '2px 7px' : '3px 11px',
          borderRadius: '7px',
          backgroundColor: palette.pillBg,
          color: palette.pillColor,
          fontSize: isMobile ? '10px' : (isFirst ? '12.5px' : '11.5px'),
          fontWeight: '900',
          marginBottom: isMobile ? '6px' : '10px',
          border: isFirst ? '1px solid rgba(245, 158, 11, 0.4)' : 'none',
        }}
      >
        <span>{Number(student.score || 0).toLocaleString()} XP</span>
      </div>

      <div
        style={{
          width: '100%',
          height: palette.pedestalHeight,
          borderRadius: isMobile ? '12px 12px 0 0' : '16px 16px 0 0',
          background: palette.pedestalBg,
          border: `${isFirst ? 2 : 1.5}px solid ${palette.border}`,
          borderBottom: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 -4px 18px ${palette.pillBg}`,
        }}
      >
        <div
          style={{
            fontSize: isMobile ? (isFirst ? '26px' : '20px') : (isFirst ? '36px' : '28px'),
            fontWeight: '900',
            color: palette.numColor,
            lineHeight: 1,
          }}
        >
          {place}
        </div>
        <div
          style={{
            fontSize: isMobile ? '9.5px' : '12px',
            color: palette.titleColor,
            fontWeight: '900',
            marginTop: '3px',
          }}
        >
          {palette.title}
        </div>
        {palette.subTitle && (
          <div
            style={{
              fontSize: isMobile ? '8.5px' : '10.5px',
              color: isDark ? '#CBD5E1' : '#B45309',
              fontWeight: '700',
            }}
          >
            {palette.subTitle}
          </div>
        )}
      </div>
    </div>
  );
};

export const LeaguePodium = ({
  league,
  isLoadingDetails,
  onSelectStudent,
  onAddStudent,
  lang,
  isDark,
  isMobile,
}) => {
  const isAr = lang === 'ar';
  const top1 = league?.podium?.[0] || null;
  const top2 = league?.podium?.[1] || null;
  const top3 = league?.podium?.[2] || null;
  const hasAny = Boolean(top1 || top2 || top3);

  return (
    <div
      style={{
        position: 'relative',
        background: isDark
          ? 'radial-gradient(ellipse at 50% 15%, #182845 0%, #0B1322 65%, #060A13 100%)'
          : 'radial-gradient(ellipse at 50% 15%, #FEF9C3 0%, #FFFBEB 30%, #F8FAFC 80%)',
        border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : '1.5px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '24px',
        padding: isMobile ? '18px 12px 14px' : '26px 24px 20px',
        boxShadow: isDark
          ? '0 20px 50px -10px rgba(0, 0, 0, 0.65)'
          : '0 16px 40px -8px rgba(245, 158, 11, 0.14)',
        overflow: 'hidden',
        marginBottom: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: isMobile ? '16px' : '22px',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11.5px',
              fontWeight: '800',
              color: '#D97706',
              marginBottom: '2px',
              flexWrap: 'wrap',
            }}
          >
            <Trophy size={13} />
            <span>{isAr ? 'منصة التتويج الرسمية' : 'Official Winners Podium'}</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span style={{ color: isDark ? '#38BDF8' : '#0284C7' }}>
              {league.leagueTitle}
            </span>
          </div>
          <h2
            style={{
              fontSize: isMobile ? '16px' : '19px',
              fontWeight: '900',
              color: isDark ? '#FFFFFF' : '#0F172A',
              margin: 0,
            }}
          >
            {isAr ? 'المراكز الثلاثة الأولى' : 'Top 3 Competitors'}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '4px 11px',
              borderRadius: '16px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.07)',
              color: isDark ? '#E2E8F0' : '#1E293B',
              fontSize: '11px',
              fontWeight: '800',
            }}
          >
            {Number(league.totalCompetitors || 0).toLocaleString()}{' '}
            {isAr ? 'طالب في المنافسة' : 'competitors'}
          </span>
        </div>
      </div>

      {isLoadingDetails ? (
        <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '700' }}>
          {isAr ? 'جاري تحميل منصة التتويج...' : 'Loading podium...'}
        </div>
      ) : !hasAny ? (
        <div
          style={{
            textAlign: 'center',
            padding: '28px 16px',
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
            border: '1px dashed rgba(245, 158, 11, 0.35)',
          }}
        >
          <Trophy size={32} color="#D97706" style={{ marginBottom: '8px', opacity: 0.85 }} />
          <div style={{ fontSize: '14px', fontWeight: '800', color: isDark ? '#F8FAFC' : '#0F172A', marginBottom: '4px' }}>
            {isAr ? 'منصة التتويج تنتظر أبطال هذا الدوري' : 'The podium is waiting for competitors'}
          </div>
          <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', marginBottom: '14px' }}>
            {isAr
              ? 'أضف طلاباً إلى الدوري أو اربطه بمجموعة بها طلاب مسجلون لبدء المنافسة.'
              : 'Add students to this league or link an enrolled study group to kick off the competition.'}
          </div>
          <button
            type="button"
            onClick={onAddStudent}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <UserPlus size={14} />
            <span>{isAr ? 'إضافة طالب للدوري' : 'Add Student'}</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: isMobile ? '8px' : '16px',
            maxWidth: '860px',
            margin: '0 auto',
            paddingBottom: '4px',
          }}
        >
          <PodiumSpot student={top2} place={2} onSelect={onSelectStudent} isDark={isDark} isMobile={isMobile} isAr={isAr} />
          <PodiumSpot student={top1} place={1} onSelect={onSelectStudent} isDark={isDark} isMobile={isMobile} isAr={isAr} />
          <PodiumSpot student={top3} place={3} onSelect={onSelectStudent} isDark={isDark} isMobile={isMobile} isAr={isAr} />
        </div>
      )}
    </div>
  );
};

export default LeaguePodium;
