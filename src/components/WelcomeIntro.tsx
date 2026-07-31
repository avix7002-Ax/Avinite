import { lazy, Suspense, useCallback, useState } from 'react';
import { LoadingPage } from '@/components/ui/Spinner';

const CinematicIntro = lazy(() => import('@/components/CinematicIntro').then(m => ({ default: m.CinematicIntro })));

interface WelcomeIntroProps {
  onComplete: () => void;
  skipAllowed?: boolean;
}

export function WelcomeIntro({ onComplete, skipAllowed = true }: WelcomeIntroProps) {
  const [skipIntro, setSkipIntro] = useState(false);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // While the heavy Three.js bundle loads, show a minimal loader
  if (skipIntro) {
    onComplete();
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030014]">
          <LoadingPage />
        </div>
      }
    >
      <CinematicIntro onComplete={handleComplete} skipAllowed={skipAllowed} />
    </Suspense>
  );
}
