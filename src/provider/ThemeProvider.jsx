import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const ThemeContext = createContext(undefined);

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function readStoredTheme(storageKey, defaultTheme) {
  try {
    return localStorage.getItem(storageKey) || defaultTheme;
  } catch {
    return defaultTheme;
  }
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  enableSystem = true,
}) {
  const [theme, setThemeState] = useState(() =>
    readStoredTheme(storageKey, defaultTheme),
  );

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    const saved = readStoredTheme(storageKey, defaultTheme);
    return saved === 'system' && enableSystem ? getSystemTheme() : saved;
  });

  useEffect(() => {
    const root = document.documentElement;

    const apply = (nextTheme) => {
      const resolved =
        nextTheme === 'system' && enableSystem ? getSystemTheme() : nextTheme;
      root.classList.toggle('dark', resolved === 'dark');
      setResolvedTheme(resolved);
    };

    apply(theme);

    if (theme !== 'system' || !enableSystem) return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => apply('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme, enableSystem]);

  const setTheme = useCallback(
    (nextTheme) => {
      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch {}
      setThemeState(nextTheme);
    },
    [storageKey],
  );

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
