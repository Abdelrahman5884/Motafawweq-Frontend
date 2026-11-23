import React, { useEffect, useState } from 'react';
import {
  Check,
  ExternalLink,
  ListOrdered,
  RotateCcw,
  X,
} from 'lucide-react';
import { RenderQueueTimeRange } from './queueHelpers';
import { formatDurationLabel } from './queueUtils';

/**
 * Full-day chronological queue modal supporting status filtering, completion, restore, and reset.
 */
export const CenterFullQueueModal = ({
  isOpen = false,
  onClose,
  liveQueue = {},
  onCompleteItem,
  onRestoreItem,
  onResetQueue,
  busyItemId = null,
  resetting = false,
  onOpenGroup,
  isAr = true,
  isRtl = true,
  isDark = false,
  themeAccent = '#1588C7',
}) => {
  const [filterTab, setFilterTab] = useState('all');

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allItems = Array.isArray(liveQueue.allItems) ? liveQueue.allItems : [];
  const activeCount = Number(liveQueue.activeCount ?? 0);
  const completedCount = Number(liveQueue.completedCount ?? 0);

  const filteredItems = allItems.filter((item) => {
    if (filterTab === 'active') return !item.isCompleted;
    if (filterTab === 'completed') return Boolean(item.isCompleted);
    return true;
  });

  const tabs = [
    { key: 'all', labelAr: `الكل (${allItems.length})`, labelEn: `All (${allItems.length})` },
    { key: 'active', labelAr: `النشطة (${activeCount})`, labelEn: `Active (${activeCount})` },
    { key: 'completed', labelAr: `المكتملة (${completedCount})`, labelEn: `Completed (${completedCount})` },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isAr ? 'طابور اليوم الكامل' : 'Full Daily Queue'}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        backgroundColor: 'rgba(15, 23, 42, 0.62)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '760px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(56, 189, 248, 0.14)' : 'rgba(21, 136, 199, 0.1)',
                color: themeAccent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ListOrdered size={19} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {isAr ? 'الجدول المتسلسل الكامل لليوم' : 'Complete Chronological Day Queue'}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                {isAr
                  ? `${activeCount} نشط • ${completedCount} مكتمل`
                  : `${activeCount} active • ${completedCount} completed`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Filter Tabs */}
        <div
          style={{
            padding: '12px 22px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            backgroundColor: 'var(--bg-app)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {tabs.map((tab) => {
              const isTabActive = filterTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilterTab(tab.key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: isTabActive ? `1px solid ${themeAccent}` : '1px solid transparent',
                    backgroundColor: isTabActive
                      ? isDark
                        ? 'rgba(56, 189, 248, 0.14)'
                        : 'rgba(21, 136, 199, 0.1)'
                      : 'transparent',
                    color: isTabActive ? themeAccent : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                  }}
                >
                  {isAr ? tab.labelAr : tab.labelEn}
                </button>
              );
            })}
          </div>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={onResetQueue}
              disabled={resetting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: resetting ? 'wait' : 'pointer',
              }}
            >
              <RotateCcw size={13} />
              <span>{isAr ? 'إعادة تهيئة اليوم' : 'Reset Day'}</span>
            </button>
          )}
        </div>

        {/* Items List */}
        <div
          style={{
            padding: '16px 22px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {filteredItems.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {isAr ? 'لا توجد مجموعات مطابقة لهذا التصنيف.' : 'No cohorts match this filter.'}
            </div>
          ) : (
            filteredItems.map((item) => {
              const isBusy = busyItemId === item.uniqueId;
              return (
                <div
                  key={item.uniqueId}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: item.isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-app)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
                      {item.isCompleted && (
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'rgba(16, 185, 129, 0.14)',
                            color: '#10B981',
                            fontSize: '10.5px',
                            fontWeight: '800',
                          }}
                        >
                          {isAr ? 'مكتمل' : 'Done'}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: '14.5px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        textDecoration: item.isCompleted ? 'line-through' : 'none',
                        opacity: item.isCompleted ? 0.78 : 1,
                      }}
                    >
                      {isAr ? item.groupNameAr : item.groupNameEn || item.groupNameAr}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span>
                        {item.teacherNameAr}
                        {item.subjectAr ? ` • ${item.subjectAr}` : ''}
                      </span>
                      <span>
                        {isAr ? 'القاعة:' : 'Hall:'} <strong style={{ color: themeAccent }}>{item.hall}</strong>
                      </span>
                      <span>
                        {isAr ? 'الطلاب:' : 'Students:'}{' '}
                        <strong>
                          {item.studentCount ?? 0} / {item.capacity ?? 0}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        onClose?.();
                        onOpenGroup?.(item.groupId);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '7px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        backgroundColor: themeAccent,
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                      }}
                    >
                      <ExternalLink size={12} />
                      <span>{isAr ? 'المجموعة' : 'Group'}</span>
                    </button>

                    {item.isCompleted ? (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={(e) => onRestoreItem?.(item, e)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: isBusy ? 'wait' : 'pointer',
                          opacity: isBusy ? 0.65 : 1,
                        }}
                      >
                        <RotateCcw size={13} />
                        <span>{isAr ? 'إعادة للطابور' : 'Restore'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={(e) => onCompleteItem?.(item, e)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'rgba(16, 185, 129, 0.12)',
                          border: '1px solid rgba(16, 185, 129, 0.35)',
                          color: '#10B981',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: isBusy ? 'wait' : 'pointer',
                          opacity: isBusy ? 0.65 : 1,
                        }}
                      >
                        <Check size={14} />
                        <span>{isAr ? 'إتمام الحصة' : 'Finish'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
