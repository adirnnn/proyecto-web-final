import { useFetch } from '../hooks/useFetch';
import { Activity } from 'lucide-react';

// componente que muestra el estado de conexión con el backend utilizando el custom hook useFetch
export function BackendStatus() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const { data, loading, error } = useFetch<{ status: string }>(`${API_URL}/health`);

  if (loading) return <span className="status-label">Verificando...</span>;
  
  if (error) return (
    <div className="status-indicator offline">
      <Activity size={14} />
      <span>Offline</span>
    </div>
  );

  return (
    <div className={`status-indicator ${data?.status === 'ok' ? 'online' : 'error'}`}>
      <Activity size={14} />
      <span>{data?.status === 'ok' ? 'Servidor Online' : 'Problema Server'}</span>
    </div>
  );
}
