import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const THEMES = [
  { id: 'purple', label: 'Ungu',   primary: '#6750A4', primaryContainer: '#EADDFF' },
  { id: 'ocean',  label: 'Samudra',primary: '#006781', primaryContainer: '#B8EAFF' },
  { id: 'forest', label: 'Hutan',  primary: '#306A2E', primaryContainer: '#B1F0A7' },
  { id: 'sunset', label: 'Senja',  primary: '#9B4521', primaryContainer: '#FFDBD0' },
  { id: 'rose',   label: 'Mawar',  primary: '#904A53', primaryContainer: '#FFD9DC' },
  { id: 'dark',   label: 'Gelap',  primary: '#D0BCFF', primaryContainer: '#4F378B' },
];

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => localStorage.getItem('sudoku-theme') || 'purple');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('sudoku-theme', themeId);
  }, [themeId]);

  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, currentTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}
