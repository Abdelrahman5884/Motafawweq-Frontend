import React from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { getDurationMeta } from './leagueConstants';

export const LeagueSwitcherBar = ({
  leagues,
  activeLeagueKey,
  onSelect,
  onCreateNew,
  onEdit,
  onDelete,
  lang,
  isDark,
  isMobile,
}) => {
  const isAr = lang === 'ar';

  return (
    <div style={{ marginBottom: '22px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {isAr ? 'دورياتك المنشأة' : 'Your Leagues'}
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {isAr ? `${leagues.length} دوري` : `${leagues.length} leagues`}
          </span>
        </div>

        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
          {isAr ? 'اضغط على أي دوري للتبديل الفوري وعرض نتائجه' : 'Click any league to switch leaderboard'}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
        }}
      >
        {leagues.map((lg) => {
          const isSelected = lg.key === activeLeagueKey;
          const durMeta = getDurationMeta(lg.durationType);

          return (
            <div
              key={lg.key}
              onClick={() => onSelect(lg.key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(lg.key);
                }
              }}
              role="button"
              tabIndex={0}
              style={{
                flex: isMobile ? '0 0 225px' : '0 0 265px',
                padding: '12px 14px',
                borderRadius: '14px',
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                backgroundColor: isSelected
                  ? (isDark ? 'rgba(21, 136, 199, 0.16)' : 'rgba(21, 136, 199, 0.08)')
                  : 'var(--bg-surface)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 4px 14px rgba(21, 136, 199, 0.2)' : 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                    marginBottom: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '2px 7px',
                        borderRadius: '6px',
                        backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-subtle)',
                        color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      }}
                    >
                      {isAr ? durMeta.shortAr : durMeta.shortEn}
                    </span>

                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        backgroundColor: lg.isCrowned
                          ? 'rgba(245, 158, 11, 0.16)'
                          : lg.isActive
                            ? 'rgba(16, 185, 129, 0.14)'
                            : 'rgba(148, 163, 184, 0.18)',
                        color: lg.isCrowned ? '#D97706' : lg.isActive ? '#10B981' : 'var(--text-muted)',
                      }}
                    >
                      {lg.isCrowned
                        ? (isAr ? 'تم التتويج' : 'Crowned')
                        : lg.isActive
                          ? (isAr ? 'نشط' : 'Active')
                          : (isAr ? 'منتهي' : 'Ended')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(lg);
                      }}
                      title={isAr ? 'تعديل الدوري' : 'Edit League'}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        borderRadius: '6px',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(lg);
                      }}
                      title={isAr ? 'حذف الدوري' : 'Delete League'}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        borderRadius: '6px',
                        color: '#EF4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '13.5px',
                    fontWeight: '800',
                    color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                    lineHeight: 1.35,
                    marginBottom: '3px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {lg.leagueTitle}
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '8px',
                  }}
                >
                  {lg.courseNameAr} • {lg.groupNameAr}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: isSelected
                    ? '1px solid rgba(21, 136, 199, 0.25)'
                    : '1px solid var(--border-subtle)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>
                  {Number(lg.totalCompetitors || 0).toLocaleString()}{' '}
                  {isAr ? 'طالب' : 'students'}
                </span>
                <span
                  style={{
                    color: lg.isActive && lg.roundDaysRemaining > 0 ? '#10B981' : 'var(--text-muted)',
                    fontWeight: '700',
                  }}
                >
                  {lg.isActive && lg.roundDaysRemaining > 0
                    ? (isAr ? `${lg.roundDaysRemaining} يوم متبقي` : `${lg.roundDaysRemaining}d left`)
                    : (isAr ? 'انتهت الجولة' : 'Ended')}
                </span>
              </div>
            </div>
          );
        })}

        {/* Quick Add League Card */}
        <div
          onClick={onCreateNew}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onCreateNew();
            }
          }}
          role="button"
          tabIndex={0}
          style={{
            flex: isMobile ? '0 0 140px' : '0 0 160px',
            padding: '12px',
            borderRadius: '14px',
            border: '1.5px dashed var(--primary)',
            backgroundColor: isDark ? 'rgba(21, 136, 199, 0.06)' : 'rgba(21, 136, 199, 0.03)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={16} />
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--primary)' }}>
            {isAr ? 'إضافة دوري جديد' : 'New League'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeagueSwitcherBar;
