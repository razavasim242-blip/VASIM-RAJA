import React, { useEffect, useRef, useState } from 'react';

interface LiquidBackgroundProps {
  darkMode: boolean;
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({ darkMode }) => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('piyush_liquid_fx');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const mousePos = useRef({ x: 0.5, y: 0.3 });
  const targetPos = useRef({ x: 0.5, y: 0.3 });
  const interactiveBlobRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Toggle liquid FX
  const toggleLiquid = () => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('piyush_liquid_fx', String(next));
      return next;
    });
  };

  // Mouse tracking for gentle fluid parallax & ripple effect
  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId: number;

    const updateInteractiveBlob = () => {
      // Smooth lerp interpolation
      mousePos.current.x += (targetPos.current.x - mousePos.current.x) * 0.05;
      mousePos.current.y += (targetPos.current.y - mousePos.current.y) * 0.05;

      if (interactiveBlobRef.current) {
        const xPercent = mousePos.current.x * 100;
        const yPercent = mousePos.current.y * 100;
        interactiveBlobRef.current.style.transform = `translate3d(${xPercent * 0.4 - 20}vw, ${
          yPercent * 0.4 - 20
        }vh, 0) scale(${1 + Math.sin(Date.now() * 0.0015) * 0.1})`;
      }

      animationFrameId = requestAnimationFrame(updateInteractiveBlob);
    };

    animationFrameId = requestAnimationFrame(updateInteractiveBlob);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  // Subtle interactive canvas liquid ripples / fluid droplets
  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Floating fluid droplets
    interface FluidDrop {
      x: number;
      y: number;
      radius: number;
      baseRadius: number;
      vx: number;
      vy: number;
      angle: number;
      speed: number;
      color: string;
      alpha: number;
    }

    const dropColorsDark = [
      'rgba(245, 158, 11, ', // amber
      'rgba(217, 119, 6, ', // deep amber
      'rgba(14, 165, 233, ', // sky cyan
      'rgba(16, 185, 129, ', // emerald
      'rgba(249, 115, 22, ', // orange
    ];

    const dropColorsLight = [
      'rgba(251, 191, 36, ', // light amber
      'rgba(249, 115, 22, ', // orange
      'rgba(56, 189, 248, ', // sky
      'rgba(52, 211, 153, ', // emerald
    ];

    const drops: FluidDrop[] = Array.from({ length: 14 }, () => {
      const radius = Math.random() * 45 + 30;
      const palette = darkMode ? dropColorsDark : dropColorsLight;
      const color = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        baseRadius: radius,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01,
        color,
        alpha: darkMode ? Math.random() * 0.08 + 0.03 : Math.random() * 0.07 + 0.02,
      };
    });

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      drops.forEach((drop) => {
        drop.x += drop.vx;
        drop.y += drop.vy;
        drop.angle += drop.speed;

        // Fluid pulsing
        drop.radius = drop.baseRadius + Math.sin(drop.angle) * 12;

        // Wrap around boundaries smoothly
        if (drop.x < -100) drop.x = width + 100;
        if (drop.x > width + 100) drop.x = -100;
        if (drop.y < -100) drop.y = height + 100;
        if (drop.y > height + 100) drop.y = -100;

        // Draw soft blurred fluid droplet
        const grad = ctx.createRadialGradient(
          drop.x,
          drop.y,
          0,
          drop.x,
          drop.y,
          drop.radius
        );
        grad.addColorStop(0, `${drop.color}${drop.alpha * 1.5})`);
        grad.addColorStop(0.6, `${drop.color}${drop.alpha * 0.8})`);
        grad.addColorStop(1, `${drop.color}0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [enabled, darkMode]);

  if (!enabled) {
    return (
      <div className="fixed bottom-24 left-4 z-40 no-print">
        <button
          type="button"
          onClick={toggleLiquid}
          id="btn-toggle-liquid-fx"
          title="Enable Liquid Background Animation"
          className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>Liquid UI: OFF</span>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Liquid Background Root Canvas & Organic Mesh Container */}
      <div
        id="liquid-ui-background"
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      >
        {/* SVG Gooey filter for authentic liquid droplet blending */}
        <svg className="absolute w-0 h-0 invisible pointer-events-none" aria-hidden="true">
          <defs>
            <filter id="liquid-goo-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -12"
                result="liquid"
              />
              <feBlend in="SourceGraphic" in2="liquid" />
            </filter>
          </defs>
        </svg>

        {/* Primary Ambient Gradient Base Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50/20 dark:via-amber-950/10 to-transparent" />

        {/* Liquid Organic Morphing Blobs Layer */}
        <div
          className="absolute inset-0 w-full h-full filter-[url(#liquid-goo-filter)] opacity-70 dark:opacity-60 will-change-transform"
        >
          {/* Liquid Blob 1: Vibrant Golden Amber (Top Left) */}
          <div
            className="absolute -top-24 -left-24 w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-br from-amber-400/35 via-amber-500/25 to-yellow-300/15 dark:from-amber-500/30 dark:via-amber-600/20 dark:to-yellow-500/10 blur-[60px] animate-liquid-morph-1 animate-liquid-float-1"
          />

          {/* Liquid Blob 2: Warm Saffron / Coral Glow (Top Right) */}
          <div
            className="absolute top-1/4 -right-28 w-[350px] h-[350px] sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-tr from-orange-500/30 via-amber-600/20 to-rose-400/15 dark:from-orange-500/25 dark:via-amber-700/20 dark:to-rose-600/10 blur-[65px] animate-liquid-morph-2 animate-liquid-float-2"
          />

          {/* Liquid Blob 3: Deep Azure Sky / Cyan Stream (Center Left / Middle) */}
          <div
            className="absolute top-1/2 -left-32 w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full bg-gradient-to-r from-sky-400/25 via-cyan-500/20 to-blue-400/15 dark:from-sky-600/25 dark:via-cyan-600/15 dark:to-indigo-600/15 blur-[70px] animate-liquid-morph-3 animate-liquid-float-3"
          />

          {/* Liquid Blob 4: Emerald / Green Agriculture & Welfare Flare (Bottom Right) */}
          <div
            className="absolute bottom-10 -right-20 w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] rounded-full bg-gradient-to-bl from-emerald-400/25 via-teal-500/20 to-amber-400/15 dark:from-emerald-600/20 dark:via-teal-700/15 dark:to-amber-500/10 blur-[70px] animate-liquid-morph-1 animate-liquid-float-2"
          />

          {/* Liquid Blob 5: Bottom Center Deep Amber River */}
          <div
            className="absolute -bottom-28 left-1/3 w-[400px] h-[400px] sm:w-[540px] sm:h-[540px] rounded-full bg-gradient-to-t from-amber-500/30 via-orange-400/20 to-yellow-300/10 dark:from-amber-600/25 dark:via-amber-800/15 dark:to-orange-600/10 blur-[75px] animate-liquid-morph-2 animate-liquid-float-1"
          />

          {/* Interactive Mouse-Linked Liquid Ripple Blob */}
          <div
            ref={interactiveBlobRef}
            className="absolute top-1/3 left-1/3 w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] rounded-full bg-gradient-to-r from-amber-400/30 via-orange-400/25 to-yellow-300/20 dark:from-amber-400/20 dark:via-orange-500/20 dark:to-amber-600/15 blur-[55px] transition-transform ease-out duration-300 pointer-events-none"
          />
        </div>

        {/* Canvas Fluid Droplet Particle Field */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-60 dark:opacity-50"
        />

        {/* Ambient Fluid Waves SVG Overlay (Organic Liquid Ribbons) */}
        <div className="absolute inset-x-0 bottom-0 h-48 opacity-25 dark:opacity-20 overflow-hidden">
          <svg
            className="w-full h-full text-amber-500 dark:text-amber-400 animate-liquid-wave"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              fillOpacity="0.4"
              d="M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,138.7C672,139,768,181,864,197.3C960,213,1056,203,1152,181.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        {/* Subtle Caustic Micro-Grid for Tactile Liquid Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] dark:bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.035] dark:opacity-[0.05]" />
      </div>

      {/* Floating Mini Controller Badge for Liquid UI toggle */}
      <div className="fixed bottom-24 left-4 z-40 no-print">
        <button
          type="button"
          onClick={toggleLiquid}
          id="btn-toggle-liquid-fx"
          title="Toggle Liquid Background Animation (तरल एनिमेशन चालू/बंद करें)"
          className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Liquid UI: ON</span>
        </button>
      </div>
    </>
  );
};
