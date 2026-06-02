import { useState, useEffect } from 'react';

/**
 * hook personalizado para realizar peticiones fetch de forma segura
 * implementa AbortController para cancelar peticiones pendientes al desmontar
 * 
 * @param {string} url - la URL a la que se realizara la peticion
 * @param {RequestInit} [options] - opciones opcionales para la configuracion de fetch
 * @returns {Object} un objeto que contiene:
 *   - data: los datos devueltos por la API (o null)
 *   - loading: boolean que indica si la petición está en curso
 *   - error: error capturado durante la petición (o null)
 */

export function useFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // si no hay URL, no returna nada
    if (!url) return;

    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, { ...options, signal });
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        // solo se actualiza el error si no fue una cancelacion manual
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // se aborta la peticion si el componente se desmonta o la URL cambia
    return () => {
      controller.abort();
    };
  }, [url]); // re ejecutar si la URL cambia

  return { data, loading, error };
}
