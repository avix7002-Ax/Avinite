import { useMemo } from 'react';

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export function FloatingParticles({ count = 20, className = '' }: FloatingParticlesProps) {
  const particles = useMemo(() => {
    const colors = ['rgba(99,102,241,0.15)', 'rgba(139,92,246,0.12)', 'rgba(59,130,246,0.1)', 'rgba(168,139,250,0.1)'];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: (Math.random() - 0.5) * 40,
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            filter: 'blur(1.5px)',
            animation: `ambient-float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
