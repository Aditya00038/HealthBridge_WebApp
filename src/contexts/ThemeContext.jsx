import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext(undefined);

const noop = () => {};
const STORAGE_KEY = 'hb-theme';
const LIGHT_THEME_VALUE = { theme: 'light', setTheme: noop, toggleTheme: noop };

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    document.body?.setAttribute('data-theme', 'light');

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Unable to clear stored theme preference:', error);
    }
  }, []);

  return <ThemeContext.Provider value={LIGHT_THEME_VALUE}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
