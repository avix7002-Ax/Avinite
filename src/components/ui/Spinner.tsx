import { cn } from '@/lib/utils';
import { AvixLogo } from '@/components/AvixLogo';

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent',
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LoadingPage({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      {/* Premium orbiting loader */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        {/* Center logo */}
        <AvixLogo size={24} />
        {/* Orbiting dots */}
        <div className="absolute inset-0">
          {[0, 120, 240].map((angle, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-primary"
              style={{
                animation: `orbit-loader 1.5s linear infinite`,
                animationDelay: `${i * 0.2}s`,
                transformOrigin: 'center',
                marginLeft: '-4px',
                marginTop: '-4px',
              }}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('shimmer-bg rounded-md bg-muted', className)}
      style={{ minHeight: '1rem' }}
    />
  );
}
