import { useCallback } from 'react';

const INTRO_KEY = 'avix-intro-played';

export function useIntro() {
  const hasPlayedIntro = useCallback(() => {
    return localStorage.getItem(INTRO_KEY) === 'true';
  }, []);

  const markIntroPlayed = useCallback(() => {
    localStorage.setItem(INTRO_KEY, 'true');
  }, []);

  const resetIntro = useCallback(() => {
    localStorage.removeItem(INTRO_KEY);
  }, []);

  return { hasPlayedIntro, markIntroPlayed, resetIntro };
}
