import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Theme = 'claro' | 'oscuro';

interface ThemeContextType {
  tema: Theme;
  toggleTema: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [tema, setTema] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'claro';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', tema);
    localStorage.setItem('theme', tema);
  }, [tema]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // atajo T para cambiar tema
      if (e.key.toLowerCase() === 't' && e.target === document.body) {
        setTema(prev => prev === 'claro' ? 'oscuro' : 'claro');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggleTema = () => {
    setTema(prev => prev === 'claro' ? 'oscuro' : 'claro');
  };

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
};
