import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';
export type ThemeColor = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'pink' | 'teal';
export type AnimationMode = 'full' | 'reduced' | 'off';

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  animations: AnimationMode;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
  setAnimations: (a: AnimationMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY_MODE = 'app-theme-mode';
const STORAGE_KEY_COLOR = 'app-theme-color';
const STORAGE_KEY_ANIM = 'app-animations';

const themeColors: Record<ThemeColor, { light: { primary: string; accent: string; ring: string; chart1: string }; dark: { primary: string; accent: string; ring: string; chart1: string } }> = {
  blue: {
    light: { primary: '221 83% 53%', accent: '199 89% 48%', ring: '221 83% 53%', chart1: '221 83% 53%' },
    dark: { primary: '217 91% 60%', accent: '199 89% 55%', ring: '217 91% 60%', chart1: '217 91% 60%' },
  },
  green: {
    light: { primary: '142 71% 45%', accent: '160 84% 39%', ring: '142 71% 45%', chart1: '142 71% 45%' },
    dark: { primary: '142 69% 50%', accent: '160 84% 45%', ring: '142 69% 50%', chart1: '142 69% 50%' },
  },
  purple: {
    light: { primary: '262 83% 58%', accent: '280 65% 60%', ring: '262 83% 58%', chart1: '262 83% 58%' },
    dark: { primary: '262 83% 65%', accent: '280 65% 65%', ring: '262 83% 65%', chart1: '262 83% 65%' },
  },
  red: {
    light: { primary: '0 72% 51%', accent: '340 75% 55%', ring: '0 72% 51%', chart1: '0 72% 51%' },
    dark: { primary: '0 72% 60%', accent: '340 75% 60%', ring: '0 72% 60%', chart1: '0 72% 60%' },
  },
  orange: {
    light: { primary: '24 95% 53%', accent: '38 92% 50%', ring: '24 95% 53%', chart1: '24 95% 53%' },
    dark: { primary: '24 95% 58%', accent: '38 92% 55%', ring: '24 95% 58%', chart1: '24 95% 58%' },
  },
  pink: {
    light: { primary: '330 81% 60%', accent: '340 75% 55%', ring: '330 81% 60%', chart1: '330 81% 60%' },
    dark: { primary: '330 81% 65%', accent: '340 75% 65%', ring: '330 81% 65%', chart1: '330 81% 65%' },
  },
  teal: {
    light: { primary: '173 80% 40%', accent: '199 89% 48%', ring: '173 80% 40%', chart1: '173 80% 40%' },
    dark: { primary: '173 80% 45%', accent: '199 89% 55%', ring: '173 80% 45%', chart1: '173 80% 45%' },
  },
};

function applyTheme(mode: ThemeMode, color: ThemeColor, animations: AnimationMode) {
  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  root.classList.remove('reduce-motion', 'no-animations');
  if (animations === 'reduced') root.classList.add('reduce-motion');
  if (animations === 'off') root.classList.add('no-animations');

  const vars = themeColors[color][mode];
  root.style.setProperty('--primary', vars.primary);
  root.style.setProperty('--accent', vars.accent);
  root.style.setProperty('--ring', vars.ring);
  root.style.setProperty('--chart-1', vars.chart1);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem(STORAGE_KEY_MODE) as ThemeMode | null;
    return stored || 'light';
  });

  const [color, setColorState] = useState<ThemeColor>(() => {
    if (typeof window === 'undefined') return 'blue';
    const stored = localStorage.getItem(STORAGE_KEY_COLOR) as ThemeColor | null;
    return stored || 'blue';
  });

  const [animations, setAnimationsState] = useState<AnimationMode>(() => {
    if (typeof window === 'undefined') return 'full';
    const stored = localStorage.getItem(STORAGE_KEY_ANIM) as AnimationMode | null;
    if (stored) return stored;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return 'reduced';
    }
    return 'full';
  });

  useEffect(() => {
    applyTheme(mode, color, animations);
    localStorage.setItem(STORAGE_KEY_MODE, mode);
    localStorage.setItem(STORAGE_KEY_COLOR, color);
    localStorage.setItem(STORAGE_KEY_ANIM, animations);
  }, [mode, color, animations]);

  const setMode = useCallback((m: ThemeMode) => setModeState(m), []);
  const setColor = useCallback((c: ThemeColor) => setColorState(c), []);
  const setAnimations = useCallback((a: AnimationMode) => setAnimationsState(a), []);
  const toggleMode = useCallback(() => setModeState((prev) => (prev === 'light' ? 'dark' : 'light')), []);

  return (
    <ThemeContext.Provider value={{ mode, color, animations, setMode, setColor, setAnimations, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export const themeColorOptions: { name: ThemeColor; label: string; swatch: string }[] = [
  { name: 'blue', label: 'Blue', swatch: 'hsl(221 83% 53%)' },
  { name: 'green', label: 'Green', swatch: 'hsl(142 71% 45%)' },
  { name: 'purple', label: 'Purple', swatch: 'hsl(262 83% 58%)' },
  { name: 'red', label: 'Red', swatch: 'hsl(0 72% 51%)' },
  { name: 'orange', label: 'Orange', swatch: 'hsl(24 95% 53%)' },
  { name: 'pink', label: 'Pink', swatch: 'hsl(330 81% 60%)' },
  { name: 'teal', label: 'Teal', swatch: 'hsl(173 80% 40%)' },
];
