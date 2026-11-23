import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ExternalLink,
  ListOrdered,
  RotateCcw,
  Sparkles,
  Users,
} from 'lucide-react';
import { RenderQueueTimeRange } from './queueHelpers';
import { QUEUE_WEEKDAYS, formatDurationLabel } from './queueUtils';

/**
 * Interactive chronological queue management section synced with `/api/v1/center/queue`.
 */
export const CenterLiveQueueSection = ({
  liveQueue = {},
  queueDay = 'saturday',
  onChangeQueueDay,
  onCompleteItem,
  onResetQueue,
  busyItemId = null,
  resetting = false,
  onOpenFullQueue,
  onOpenGroup,
  isAr = true,
  isDark = false,
  themeAccent = '#1588C7',
}) => {
  const totalCount = Number(liveQueue.totalCount ?? 0);
  const activeCount = Number(liveQueue.activeCount ?? 0);
  const completedCount = Number(liveQueue.completedCount ?? 0);
  const currentActiveItem = liveQueue.currentActiveItem || null;
  const upcomingQueueItems = Array.isArray(liveQueue.upcomingQueueItems)
    ? liveQueue.upcomingQueueItems
    : [];

  return (
    <div
      className="executive-card"
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 24px',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}
    >
      {/* Header Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              backgroundColor: isDark ? 'rgba(56, 189, 248, 0.14)' : 'rgba(21, 136, 199, 0.1)',
              color: themeAccent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ListOrdered size={22} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'طابور مجموعات اليوم المتسلسل' : 'Today’s Cohorts Chronological Queue'}
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
              {isAr
                ? `${activeCount} نشط • ${completedCount} مكتمل من أصل ${totalCount}`
                : `${activeCount} active • ${completedCount} completed out of ${totalCount}`}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {completedCount > 0 && (
            <button
              type="button"
              onClick={onResetQueue}
              disabled={resetting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: resetting ? 'wait' : 'pointer',
              }}
            >
              <RotateCcw size={13} />
              <span>{isAr ? 'تصفير طابور اليوم' : 'Reset Day Queue'}</span>
            </button>
          )}

          {totalCount > 0 && (
            <button
              type="button"
              onClick={onOpenFullQueue}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: themeAccent,
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <span>{isAr ? `عرض الطابور الكامل (${totalCount})` : `View Full Queue (${totalCount})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Day Switcher Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {QUEUE_WEEKDAYS.map((day) => {
          const isSelected = queueDay === day.key;
          return (
            <button
              key={day.key}
              type="button"
              onClick={() => onChangeQueueDay?.(day.key)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? `1px solid ${themeAccent}` : '1px solid var(--border-subtle)',
                backgroundColor: isSelected
                  ? isDark
                    ? 'rgba(56, 189, 248, 0.16)'
                    : 'rgba(21, 136, 199, 0.1)'
                  : 'var(--bg-app)',
                color: isSelected ? themeAccent : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: isSelected ? '800' : '600',
                cursor: 'pointer',
              }}
            >
              {isAr ? day.labelAr : day.labelEn}
            </button>
          );
        })}
      </div>

      {/* Empty Queue */}
      {totalCount === 0 && (
        <div
          style={{
            padding: '32px 20px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-app)',
            border: '1px dashed var(--border-subtle)',
            textAlign: 'center',
          }}
        >
          <Calendar size={34} style={{ color: themeAccent, marginBottom: '10px', opacity: 0.75 }} />
          <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {isAr ? 'لا توجد حصص مجدولة لهذا اليوم' : 'No cohorts scheduled for this day'}
          </div>
          <p style={{ margin: '0 0 14px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            {isAr
              ? 'أضف مجموعات وحدد مواعيدها الأسبوعية ليظهر طابور التشغيل التلقائي هنا.'
              : 'Create study groups with weekly slots to populate the operational queue.'}
          </p>
          <Link
            to="/center/groups"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: themeAccent,
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: '800',
              textDecoration: 'none',
            }}
          >
            <span>{isAr ? 'إدارة وجدولة المجموعات' : 'Manage & Schedule Groups'}</span>
          </Link>
        </div>
      )}

      {/* All Sessions Completed State */}
      {totalCount > 0 && activeCount === 0 && (
        <div
          style={{
            padding: '26px 20px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.28)',
            textAlign: 'center',
          }}
        >
          <Sparkles size={28} style={{ color: '#10B981', marginBottom: '8px' }} />
          <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {isAr
              ? `أحسنت! تم إتمام جميع حصص اليوم (${completedCount})`
              : `All ${completedCount} sessions completed for this day!`}
          </div>
          <p style={{ margin: '0 0 14px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            {isAr
              ? 'يمكنك مراجعة السجل الكامل أو إعادة تهيئة طابور اليوم عند الحاجة.'
              : 'Review completed cohorts or reset today’s queue whenever ready.'}
          </p>
          <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={onOpenFullQueue}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                backgroundColor: 'var(--bg-surface)',
                color: '#10B981',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'استعراض الطابور الكامل' : 'Inspect Full Queue'}
            </button>
          </div>
        </div>
      )}

      {/* Active Spotlight Item */}
      {currentActiveItem && (
        <div
          style={{
            padding: '18px',
            borderRadius: 'var(--radius-lg)',
            border: `1.5px solid ${themeAccent}`,
            backgroundColor: isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(21, 136, 199, 0.05)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: themeAccent,
                  color: '#FFFFFF',
                  fontSize: '10.5px',
                  fontWeight: '800',
                }}
              >
                {isAr ? 'قيد التشغيل الآن' : 'Up Next'}
              </span>
              <RenderQueueTimeRange
                startTime={currentActiveItem.startTime}
                endTime={currentActiveItem.endTime}
                isAr={isAr}
                accentColor={themeAccent}
              />
              <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {formatDurationLabel(currentActiveItem.durationMinutes, isAr)}
              </span>
            </div>

            <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr
                ? currentActiveItem.groupNameAr
                : currentActiveItem.groupNameEn || currentActiveItem.groupNameAr}
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '12px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
              }}
            >
              <span>
                {currentActiveItem.teacherNameAr}
                {currentActiveItem.subjectAr ? ` • ${currentActiveItem.subjectAr}` : ''}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={13} style={{ color: themeAccent }} />
                <strong>{currentActiveItem.hall}</strong>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Users size={13} style={{ color: themeAccent }} />
                <strong>
                  {currentActiveItem.studentCount ?? 0} / {currentActiveItem.capacity ?? 0}{' '}
                  {isAr ? 'طالب' : 'students'}
                </strong>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onOpenGroup?.(currentActiveItem.groupId)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '9px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <ExternalLink size={13} />
              <span>{isAr ? 'تفاصيل المجموعة' : 'Open Group'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => onCompleteItem?.(currentActiveItem, e)}
              disabled={busyItemId === currentActiveItem.uniqueId}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: busyItemId === currentActiveItem.uniqueId ? 'wait' : 'pointer',
                opacity: busyItemId === currentActiveItem.uniqueId ? 0.65 : 1,
              }}
            >
              <Check size={14} />
              <span>
                {busyItemId === currentActiveItem.uniqueId
                  ? isAr
                    ? 'جاري الحفظ...'
                    : 'Saving...'
                  : isAr
                  ? 'إتمام الحصة'
                  : 'Complete Session'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Queue Grid */}
      {upcomingQueueItems.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '12px',
          }}
        >
          {upcomingQueueItems.map((item) => {
            const isBusy = busyItemId === item.uniqueId;
            return (
              <div
                key={item.uniqueId}
                onClick={() => onOpenGroup?.(item.groupId)}
                className="center-interactive-card"
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '8px' }}>
                    <RenderQueueTimeRange
                      startTime={item.startTime}
                      endTime={item.endTime}
                      isAr={isAr}
                      accentColor={themeAccent}
                      compact
                    />
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                      {formatDurationLabel(item.durationMinutes, isAr)}
                    </span>
                  </div>

                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {isAr ? item.groupNameAr : item.groupNameEn || item.groupNameAr}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {item.teacherNameAr} • {item.hall}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '11.5px', fontWeight: '700', color: themeAccent }}>
                    {item.studentCount ?? 0} / {item.capacity ?? 0} {isAr ? 'طالب' : 'students'}
                  </span>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCompleteItem?.(item, e);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      color: '#10B981',
                      fontSize: '11.5px',
                      fontWeight: '800',
                      cursor: isBusy ? 'wait' : 'pointer',
                      opacity: isBusy ? 0.65 : 1,
                    }}
                  >
                    <Check size={12} />
                    <span>{isBusy ? '...' : isAr ? 'إتمام' : 'Done'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completed Summary Strip */}
      {completedCount > 0 && activeCount > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '12px',
            color: 'var(--text-primary)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
            <CheckCircle2 size={15} style={{ color: '#10B981' }} />
            <span>
              {isAr
                ? `تم إتمام ${completedCount} حصص في طابور اليوم`
                : `${completedCount} session(s) completed today`}
            </span>
          </span>
          <button
            type="button"
            onClick={onOpenFullQueue}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: themeAccent,
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isAr ? 'مراجعة أو استعادة' : 'Review / Restore'}
          </button>
        </div>
      )}
    </div>
  );
};
