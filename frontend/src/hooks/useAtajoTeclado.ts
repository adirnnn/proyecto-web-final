import { useEffect } from 'react';

/**
 * hook para manejar atajos de teclado globales
 * 
 * @param {string} key - la tecla que dispara la accion
 * @param {() => void} callback - la funcion a ejecutar cuando se presiona la tecla
 * @param {boolean} [ctrlKey=false] - si se requiere presionar Ctrl junto con la tecla
 * 
 * @example
 * useAtajoTeclado('t', () => toggleTheme());
 * useAtajoTeclado('n', () => focusInput(), true);
 */

export function useAtajoTeclado(key: string, callback: () => void, ctrlKey: boolean = false): void {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isTargetBody = event.target === document.body;
      const isCorrectKey = event.key.toLowerCase() === key.toLowerCase();
      const isCtrlMatch = ctrlKey ? event.ctrlKey : true;

      if (isTargetBody && isCorrectKey && isCtrlMatch) {
        if (ctrlKey) event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    
    // limpieza automatica del listener
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [key, callback, ctrlKey]);
}
