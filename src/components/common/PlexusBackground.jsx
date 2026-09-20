import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Clean, subtle educational platform ambient background.
 * Uses official Motafawweq colors (#5CB6DB, #1588C7, #06254E).
 * Free from AI-style neural/spiderweb constellation nodes.
 */
export const PlexusBackground = () => {
  const { isDark } = useTheme();

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: isDark
          ? 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(21, 136, 199, 0.15), transparent 70%), radial-gradient(ellipse 60% 40% at 90% 90%, rgba(92, 182, 219, 0.08), transparent 70%), #041427'
          : 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(92, 182, 219, 0.12), transparent 70%), radial-gradient(ellipse 60% 40% at 90% 90%, rgba(21, 136, 199, 0.06), transparent 70%), #F7FAFC',
        transition: 'background 0.3s ease'
      }}
    />
  );
};
