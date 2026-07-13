import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

export type AppTheme = 'light' | 'dark' | 'amoled' | 'blue' | 'purple' | 'green' | 'high-contrast';
export type AccentColor = 'indigo' | 'teal' | 'purple' | 'pink' | 'emerald';
export type FontSize = 'sm' | 'base' | 'lg';
export type SpacingDensity = 'compact' | 'comfortable';

interface ThemeContextProps {
  theme: AppTheme;
  accent: AccentColor;
  fontSize: FontSize;
  density: SpacingDensity;
  glassmorphism: boolean;
  setTheme: (t: AppTheme) => void;
  setAccent: (a: AccentColor) => void;
  setFontSize: (s: FontSize) => void;
  setDensity: (d: SpacingDensity) => void;
  setGlassmorphism: (g: boolean) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'dark',
  accent: 'indigo',
  fontSize: 'base',
  density: 'comfortable',
  glassmorphism: true,
  setTheme: () => {},
  setAccent: () => {},
  setFontSize: () => {},
  setDensity: () => {},
  setGlassmorphism: () => {},
});

export const useAppTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Initialize states
  const [theme, setThemeState] = useState<AppTheme>(() => (localStorage.getItem('theme') as AppTheme) || 'dark');
  const [accent, setAccentState] = useState<AccentColor>(() => (localStorage.getItem('accent') as AccentColor) || 'indigo');
  const [fontSize, setFontSizeState] = useState<FontSize>(() => (localStorage.getItem('fontSize') as FontSize) || 'base');
  const [density, setDensityState] = useState<SpacingDensity>(() => (localStorage.getItem('density') as SpacingDensity) || 'comfortable');
  const [glassmorphism, setGlassmorphismState] = useState<boolean>(() => localStorage.getItem('glassmorphism') !== 'false');

  // Load settings from backend if logged in
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/auth/settings');
        const settings = res.data.settings;
        if (settings) {
          if (settings.theme) setThemeState(settings.theme);
          if (settings.accent) setAccentState(settings.accent);
          if (settings.fontSize) setFontSizeState(settings.fontSize);
          if (settings.density) setDensityState(settings.density);
          if (settings.glassmorphism !== undefined) setGlassmorphismState(settings.glassmorphism);
        }
      } catch (err) {
        console.error('Failed to sync backend theme settings:', err);
      }
    };
    fetchSettings();
  }, [isAuthenticated]);

  // Sync state to localstorage & backend
  const syncSettings = async (updates: Partial<{ theme: AppTheme; accent: AccentColor; fontSize: FontSize; density: SpacingDensity; glassmorphism: boolean }>) => {
    if (isAuthenticated) {
      try {
        await axios.put('/api/auth/settings', updates);
      } catch (err) {
        console.error('Failed to update settings in db:', err);
      }
    }
  };

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
    localStorage.setItem('theme', t);
    syncSettings({ theme: t });
  };

  const setAccent = (a: AccentColor) => {
    setAccentState(a);
    localStorage.setItem('accent', a);
    syncSettings({ accent: a });
  };

  const setFontSize = (s: FontSize) => {
    setFontSizeState(s);
    localStorage.setItem('fontSize', s);
    syncSettings({ fontSize: s });
  };

  const setDensity = (d: SpacingDensity) => {
    setDensityState(d);
    localStorage.setItem('density', d);
    syncSettings({ density: d });
  };

  const setGlassmorphism = (g: boolean) => {
    setGlassmorphismState(g);
    localStorage.setItem('glassmorphism', String(g));
    syncSettings({ glassmorphism: g });
  };

  // Apply root DOM attributes whenever layout attributes modify
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous classes
    root.classList.remove(
      'dark', 'light', 'theme-amoled', 'theme-blue', 'theme-purple', 'theme-green', 'theme-high-contrast',
      'accent-indigo', 'accent-teal', 'accent-purple', 'accent-pink', 'accent-emerald',
      'text-sm', 'text-base', 'text-lg',
      'density-compact', 'density-comfortable',
      'glassmorphism-active'
    );

    // Apply dark class for tailwind darkMode config
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.add('dark');
    }

    // Apply specific theme class
    root.classList.add(`theme-${theme}`);
    root.classList.add(`accent-${accent}`);
    root.classList.add(`text-${fontSize}`);
    root.classList.add(`density-${density}`);
    if (glassmorphism) {
      root.classList.add('glassmorphism-active');
    }
  }, [theme, accent, fontSize, density, glassmorphism]);

  return (
    <ThemeContext.Provider value={{
      theme, accent, fontSize, density, glassmorphism,
      setTheme, setAccent, setFontSize, setDensity, setGlassmorphism
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
