import { createContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAtajoTeclado } from '../hooks/useAtajoTeclado';

type Theme = 'claro' | 'oscuro';

interface ThemeContextType {
  tema: Theme;
  toggleTema: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [tema, setTema] = useLocalStorage<Theme>('theme', 'claro');

  useEffect(() => {
    document.body.setAttribute('data-theme', tema);
  }, [tema]);

  const toggleTema = () => {
    setTema(prev => prev === 'claro' ? 'oscuro' : 'claro');
  };

  // Refactorizado a custom hook useAtajoTeclado
  useAtajoTeclado('t', toggleTema);

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
};
