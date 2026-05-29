import { createContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { GymSession } from '../types/item';

type Modo = 'api' | 'local';

interface StorageContextType {
  modo: Modo;
  setModo: (nuevoModo: Modo) => void;
  cargando: boolean;
  error: string | null;
  obtenerItems: () => Promise<GymSession[]>;
  guardarItem: (item: GymSession) => Promise<GymSession>;
  eliminarItem: (id: string) => Promise<void>;
}

export const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider = ({ children }: { children: ReactNode }) => {
  const [modo, setModoState] = useState<Modo>(() => {
    return (localStorage.getItem('modo') as Modo) || 'local';
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const setModo = useCallback((nuevoModo: Modo) => {
    setModoState(nuevoModo);
    localStorage.setItem('modo', nuevoModo);
  }, []);

  const obtenerItems = useCallback(async (): Promise<GymSession[]> => {
    setCargando(true);
    setError(null);
    try {
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("DEBUG: Data cruda del backend:", data[0]);
        return data.map((d: any) => {
          const itemMapeado = {
            ...d,
            categoriaId: d.categoriaid || d.categoriaId || d.categoria_id,
            fechaRegistro: d.fecharegistro || d.fechaRegistro || d.fecha_registro,
            fechaActividad: d.fechaactividad || d.fechaActividad || d.fecha_actividad,
            atributos: typeof d.atributos === 'string' ? JSON.parse(d.atributos) : (d.atributos || { duracionMinutos: 0, volumenTotal: 0, ejercicios: [] }),
            activo: d.activo === 1 || d.activo === true || d.activo === undefined
          };
          return itemMapeado;
        });
      } else {
        const data = localStorage.getItem('gym_sessions');
        return data ? JSON.parse(data) : [];
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return [];
    } finally {
      setCargando(false);
    }
  }, [modo, API_URL]);

  const guardarItem = useCallback(async (item: GymSession): Promise<GymSession> => {
    setCargando(true);
    setError(null);
    try {
      if (modo === 'api') {
        const payload = {
          ...item,
          atributos: typeof item.atributos === 'object' ? JSON.stringify(item.atributos) : item.atributos,
          activo: item.activo ? 1 : 0
        };

        const putRes = await fetch(`${API_URL}/api/items/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (putRes.status === 404) {
          const postRes = await fetch(`${API_URL}/api/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!postRes.ok) throw new Error(`HTTP ${postRes.status}`);
          return await postRes.json();
        } else if (!putRes.ok) {
          throw new Error(`HTTP ${putRes.status}`);
        }
        return await putRes.json();
      } else {
        const currentData = localStorage.getItem('gym_sessions');
        const items: GymSession[] = currentData ? JSON.parse(currentData) : [];
        const index = items.findIndex(i => i.id === item.id);
        if (index >= 0) {
          items[index] = item;
        } else {
          items.unshift(item);
        }
        localStorage.setItem('gym_sessions', JSON.stringify(items));
        return item;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setCargando(false);
    }
  }, [modo, API_URL]);

  const eliminarItem = useCallback(async (id: string): Promise<void> => {
    setCargando(true);
    setError(null);
    try {
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        const currentData = localStorage.getItem('gym_sessions');
        const items: GymSession[] = currentData ? JSON.parse(currentData) : [];
        const filtered = items.filter(i => i.id !== id);
        localStorage.setItem('gym_sessions', JSON.stringify(filtered));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setCargando(false);
    }
  }, [modo, API_URL]);

  const value = useMemo(() => ({
    modo,
    setModo,
    cargando,
    error,
    obtenerItems,
    guardarItem,
    eliminarItem
  }), [modo, setModo, cargando, error, obtenerItems, guardarItem, eliminarItem]);

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
};
