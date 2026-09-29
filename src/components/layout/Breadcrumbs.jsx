import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, LayoutDashboard, Home } from 'lucide-react';
import { useBreadcrumbs } from '../../context/BreadcrumbContext';
import { useLanguage } from '../../context/LanguageContext';

export const Breadcrumbs = ({ className = '', style = {} }) => {
  const { breadcrumbs } = useBreadcrumbs();
  const { isRtl } = useLanguage();
  const navigate = useNavigate();

  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`breadcrumbs-nav ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        userSelect: 'none',
        ...style
      }}
    >
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1 || item.isCurrent;
        const SeparatorIcon = isRtl ? ChevronLeft : ChevronRight;

        return (
          <React.Fragment key={item.id || item.path || index}>
            {isLast ? (
              <span
                aria-current="page"
                title={item.label}
                style={{
                  fontSize: '13.5px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '260px',
                  display: 'inline-block'
                }}
              >
                {item.label}
              </span>
            ) : item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                title={item.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  padding: '3px 7px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 102, 204, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{item.label}</span>
              </button>
            ) : item.path ? (
              <Link
                to={item.path}
                title={item.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                  padding: '3px 7px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 102, 204, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{item.label}</span>
              </Link>
            ) : (
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: 'var(--text-muted)',
                  opacity: 0.45,
                  flexShrink: 0
                }}
              >
                <SeparatorIcon size={12} />
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
