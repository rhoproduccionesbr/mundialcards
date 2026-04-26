import React, { useMemo } from 'react';

interface ParticlesProps {
  type: 'none' | 'snow' | 'sparks' | 'confetti' | 'glimmers';
  density?: number;
  speed?: number;
}

const Particles: React.FC<ParticlesProps> = ({ type, density = 50, speed = 1.0 }) => {
  const particles = useMemo(() => {
    if (type === 'none') return [];
    
    // Scale count by density (0 to 100)
    let baseCount = type === 'snow' ? 50 : type === 'sparks' ? 30 : type === 'glimmers' ? 40 : 60;
    const count = Math.max(5, Math.floor(baseCount * (density / 50)));

    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // %
      top: Math.random() * 100, // %
      size: Math.random() * 2 + 1, // base size multiplier
      duration: (Math.random() * 4 + 3) / Math.max(0.1, speed), // Apply speed modifier
      delay: Math.random() * -10, // random start offset
      opacity: Math.random() * 0.6 + 0.4,
      color: type === 'confetti' 
        ? ['#fbbf24', '#ef4444', '#3b82f6', '#10b981', '#a855f7'][Math.floor(Math.random() * 5)] 
        : type === 'glimmers'
        ? ['#ffffff', '#a5f3fc', '#fef08a', '#e879f9'][Math.floor(Math.random() * 4)]
        : undefined,
      xOffset: Math.random() * 20 - 10, // random horizontal drift
    }));
  }, [type, density, speed]);

  if (type === 'none') return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" style={{ transformStyle: 'preserve-3d' }}>
      {particles.map(p => {
        if (type === 'glimmers') {
          return (
            <div
              key={p.id}
              className="absolute particle-anim"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size * 6}px`,
                height: `${p.size * 6}px`,
                backgroundColor: p.color,
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', // Star shape
                animationName: 'glimmerFade',
                animationDuration: `${p.duration * 0.5}s`,
                animationDelay: `${p.delay}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                boxShadow: `0 0 15px ${p.color}`,
              } as React.CSSProperties}
            />
          );
        }
        if (type === 'snow') {
          return (
            <div
              key={p.id}
              className="absolute bg-white rounded-full particle-anim"
              style={{
                left: `${p.left}%`,
                top: `-10%`,
                width: `${p.size * 4}px`,
                height: `${p.size * 4}px`,
                opacity: p.opacity,
                animationName: 'snowFall',
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                filter: `blur(${Math.random() * 2}px)`,
                '--x-offset': `${p.xOffset}vw`,
              } as React.CSSProperties}
            />
          );
        }
        if (type === 'sparks') {
          return (
            <div
              key={p.id}
              className="absolute rounded-full particle-anim"
              style={{
                left: `${p.left}%`,
                bottom: `-10%`,
                width: `${p.size * 2}px`,
                height: `${p.size * 6}px`,
                opacity: p.opacity,
                backgroundColor: '#fbbf24',
                boxShadow: '0 0 10px 2px #f59e0b',
                animationName: 'sparkRise',
                animationDuration: `${p.duration * 0.6}s`,
                animationDelay: `${p.delay}s`,
                animationTimingFunction: 'ease-in',
                animationIterationCount: 'infinite',
                '--x-offset': `${p.xOffset}vw`,
              } as React.CSSProperties}
            />
          );
        }
        if (type === 'confetti') {
          return (
            <div
              key={p.id}
              className="absolute particle-anim"
              style={{
                left: `${p.left}%`,
                top: `-10%`,
                width: `${p.size * 6}px`,
                height: `${p.size * 10}px`,
                backgroundColor: p.color,
                animationName: 'confettiFall',
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                '--x-offset': `${p.xOffset}vw`,
              } as React.CSSProperties}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default Particles;
