import { useFetch } from '../hooks/useFetch';

// componente que muestra el estado de conexión con el backend utilizando el custom hook useFetch
export function BackendStatus() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const { data, loading, error } = useFetch<{ status: string }>(`${API_URL}/health`);

  if (loading) return (
    <div className="status-indicator warning">
      <div className="status-dot-inner warning"></div>
      <span>Verificando...</span>
    </div>
  );
  
  if (error) return (
    <div className="status-indicator offline">
      <div className="status-dot-inner offline"></div>
      <span>Servidor Offline</span>
    </div>
  );

  return (
    <div className={`status-indicator ${data?.status === 'ok' ? 'online' : 'error'}`}>
      <div className={`status-dot-inner ${data?.status === 'ok' ? 'online' : 'offline'}`}></div>
      <span>{data?.status === 'ok' ? 'Servidor Online' : 'Problema Server'}</span>
    </div>
  );
}
