import { useState, useEffect } from 'react';

/**
 * hook para manejar estado persistente en LocalStorage
 * 
 * @param {string} key - La clave bajo la cual se guardara el valor en LocalStorage
 * @param {T} initialValue - El valor inicial si no existe nada en LocalStorage
 * @returns {[T, (value: T | ((val: T) => T)) => void]} Un array con el valor actual y una funcion para actualizarlo
 * 
 * @example
 * const [name, setName] = useLocalStorage('name', 'Juan');
 */

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // estado para almacenar nuestro valor
  // se pasa la función de inicializacion a useState para que solo se ejecute una vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // devolvemos el item parseado o el valor inicial si no existe
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error leyendo localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // useEffect para actualizar localStorage cuando el estado cambie
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error guardando en localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
