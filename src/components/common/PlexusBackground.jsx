import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const PlexusBackground = () => {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Mouse / Touch tracking for interactive spiderweb attraction
    const mouse = {
      x: null,
      y: null,
      radius: 180
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Particle count according to screen size
    const getParticleCount = () => {
      if (window.innerWidth < 768) return 40;
      if (window.innerWidth < 1100) return 70;
      return 100;
    };

    const connectionDistance = window.innerWidth < 768 ? 100 : 140;
    const connectionDistSq = connectionDistance * connectionDistance;
    const mouseDistSq = mouse.radius * mouse.radius;

    // Official Motafawweq platform palette
    const colors = isDark
      ? ['#1588C7', '#5CB6DB', '#38BDF8', '#0EA5E9', '#60A5FA']
      : ['#1588C7', '#5CB6DB', '#0284C7', '#0369A1', '#2563EB'];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = init ? Math.random() * width : (Math.random() < 0.5 ? 0 : width);
        this.y = init ? Math.random() * height : Math.random() * height;

        // Smooth gentle floating movement
        const speed = 0.35 + Math.random() * 0.65;
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.isHub = Math.random() < 0.18; // 18% larger hub nodes
        this.radius = this.isHub ? (2.8 + Math.random() * 1.6) : (1.3 + Math.random() * 1.2);
        this.baseAlpha = this.isHub ? 0.85 : 0.45;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
        this.pulse = Math.random() * Math.PI;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += this.pulseSpeed;

        // Bounce gently off borders
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction (spiderweb attraction towards cursor)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseDistSq) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / mouse.radius) * 0.016;
            this.vx += (dx / dist) * force;
            this.vy += (dy / dist) * force;
          }
        }

        // Limit velocity to keep motion buttery smooth
        const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (currentSpeed > 1.3) {
          this.vx = (this.vx / currentSpeed) * 1.3;
          this.vy = (this.vy / currentSpeed) * 1.3;
        }
      }

      draw() {
        const pulseFactor = 0.85 + Math.sin(this.pulse) * 0.25;
        const currentAlpha = this.baseAlpha * pulseFactor;

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = isDark ? currentAlpha : currentAlpha * 0.7;

        if (this.isHub) {
          ctx.shadowColor = this.color;
          ctx.shadowBlur = isDark ? 14 : 7;
        }

        ctx.fill();
        ctx.restore();
      }
    }

    let particles = [];
    const initParticles = () => {
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Spiderweb Connections between nearby particles
      const count = particles.length;
      for (let i = 0; i < count; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / connectionDistance) * (isDark ? 0.35 : 0.2);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark ? '#1588C7' : '#5CB6DB';
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // 2. Draw Connection from Particle to Mouse Cursor (interactive spiderweb)
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = p1.x - mouse.x;
          const mdy = p1.y - mouse.y;
          const mdistSq = mdx * mdx + mdy * mdy;

          if (mdistSq < mouseDistSq) {
            const mdist = Math.sqrt(mdistSq);
            const mAlpha = (1 - mdist / mouse.radius) * (isDark ? 0.65 : 0.38);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = isDark ? '#5CB6DB' : '#1588C7';
            ctx.globalAlpha = mAlpha;
            ctx.lineWidth = 1.25;
            ctx.stroke();
          }
        }
      }

      // Draw glowing focus point at mouse position
      if (mouse.x !== null && mouse.y !== null) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#5CB6DB' : '#1588C7';
        ctx.shadowColor = isDark ? '#5CB6DB' : '#1588C7';
        ctx.shadowBlur = isDark ? 16 : 8;
        ctx.globalAlpha = isDark ? 0.8 : 0.55;
        ctx.fill();
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: isDark ? 0.85 : 0.65,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
};
