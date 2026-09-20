import React from 'react';
import { Search } from 'lucide-react';

export const RosterFilterBar = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  lang,
  isRtl
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '14px',
      backgroundColor: 'var(--bg-surface-elevated)',
      padding: '16px',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-medium)',
      marginBottom: '24px',
      flexWrap: 'wrap'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'var(--bg-subtle)',
        padding: '8px 14px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        flex: 1,
        minWidth: '240px'
      }}>
        <Search size={16} color="var(--text-muted)" />
        <input
          type="text"
          placeholder={lang === 'ar' ? 'ابحث باسم الطالب أو رقم ولي الأمر...' : 'Search by student name or parent phone...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: '13px',
            color: 'var(--text-primary)',
            width: '100%',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-latin)'
          }}
        />
      </div>

      {/* Status Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {[
          { id: 'all', label: lang === 'ar' ? 'جميع الطلاب' : 'All Students' },
          { id: 'top performer', label: lang === 'ar' ? 'المتفوقون' : 'Top Performers' },
          { id: 'needs attention', label: lang === 'ar' ? 'يحتاج متابعة' : 'Needs Attention' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setStatusFilter(f.id)}
            style={{
              padding: '7px 12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: statusFilter === f.id ? 'var(--primary)' : 'var(--bg-subtle)',
              color: statusFilter === f.id ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
};
