import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 'sage' | 'navy' | 'terracotta' | 'matcha' | 'midnight';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  description: string;
  previewBg: string;
  previewPrimary: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'sage',
    name: 'Warm Sage',
    description: 'Earthy, warm olive editorial theme',
    previewBg: '#f5f5f0',
    previewPrimary: '#5a5a40',
  },
  {
    id: 'navy',
    name: 'Royal Navy',
    description: 'Crisp classic blue & slate navy',
    previewBg: '#f8fafc',
    previewPrimary: '#1e3a8a',
  },
  {
    id: 'terracotta',
    name: 'Sunset Terracotta',
    description: 'Warm spice & autumn clay tones',
    previewBg: '#faf6f0',
    previewPrimary: '#9a3412',
  },
  {
    id: 'matcha',
    name: 'Forest Matcha',
    description: 'Fresh botanical forest green',
    previewBg: '#f2f6f2',
    previewPrimary: '#166534',
  },
  {
    id: 'midnight',
    name: 'Midnight Slate',
    description: 'Deep warm dark mode with amber accent',
    previewBg: '#0f172a',
    previewPrimary: '#f59e0b',
  },
];

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  activeThemeOption: ThemeOption;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('campusbite_theme');
    if (saved && THEME_OPTIONS.some(t => t.id === saved)) {
      return saved as ThemeId;
    }
    return 'sage';
  });

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    localStorage.setItem('campusbite_theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const activeThemeOption = THEME_OPTIONS.find(t => t.id === theme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, activeThemeOption }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
