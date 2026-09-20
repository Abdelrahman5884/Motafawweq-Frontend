import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { Sparkles } from 'lucide-react';

export const AuthSidePanel = ({ activeChar, charKey }) => {
  const { isRtl } = useLanguage();
  const { isDark } = useTheme();

  return (
    <div className="auth-split-side">
      {/* Top Brand Logo with Orbital Animation */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <div className="auth-side-logo-box">
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="auth-orbital-wrapper" style={{ width: '110px', height: '110px' }}>
              <div className="auth-orbital-ring1" />
              <div className="auth-orbital-ring2">
                <div className="auth-orbital-dot" style={{
                  top: '-4px', left: '50%', marginLeft: '-4px',
                  width: '7px', height: '7px',
                  backgroundColor: 'var(--primary)',
                  boxShadow: '0 0 10px 3px rgba(21, 136, 199, 0.85)'
                }} />
              </div>
              <div className="auth-orbital-ring3">
                <div className="auth-orbital-dot" style={{
                  top: '8%', right: '-4px',
                  width: '5px', height: '5px',
                  backgroundColor: 'var(--primary-light, #5CB6DB)',
                  boxShadow: '0 0 8px 3px rgba(92, 182, 219, 0.85)',
                  animationDelay: '0.6s'
                }} />
                <div className="auth-orbital-dot" style={{
                  bottom: '10%', left: '-3px',
                  width: '5px', height: '5px',
                  backgroundColor: 'var(--primary)',
                  boxShadow: '0 0 7px 3px rgba(21, 136, 199, 0.85)',
                  animationDelay: '1.2s'
                }} />
              </div>
              <div className="auth-orbital-ring4" />
              <img
                src={isDark ? '/logo-dark.png' : '/logo-light.png'}
                alt="متفوّق – Motafawweq"
                className="auth-orbital-img"
                style={{ width: '64px', height: '64px' }}
              />
            </div>
          </Link>
        </div>

        {/* Dynamic Welcome Heading for Role */}
        <div key={charKey + '-head'} style={{ animation: 'authSpeechPop 0.4s ease-out', position: 'relative', zIndex: 10 }}>
          <div className="auth-role-badge">
            <Sparkles size={12} />
            <span>{activeChar.badge}</span>
          </div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            marginBottom: '6px',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
          }}>
            {activeChar.title}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>
            {activeChar.quote}
          </p>
        </div>
      </div>

      {/* Bottom: Emerging 3D Character */}
      <div key={charKey + '-img'} className="auth-side-character-wrap">
        <div className="auth-character-glow" />
        <img
          src={activeChar.img}
          alt={activeChar.title}
          className="auth-character-img"
        />
      </div>
    </div>
  );
};
