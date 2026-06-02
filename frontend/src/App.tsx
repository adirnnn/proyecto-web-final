import { useEffect, useContext, useReducer, useMemo, useCallback, useState, memo } from 'react'
import type { GymSession } from './types/item'
import { itemsReducer, estadoInicial } from './reducers/itemsReducer'
import { StorageContext } from './context/StorageContext'
import { ThemeContext } from './context/ThemeContext'
import { FormularioItem } from './components/FormularioItem'
import { Filtros } from './components/Filtros'
import { ListaItems } from './components/ListaItems'
import { GraficasGym } from './components/GraficasGym'
import { BackendStatus } from './components/BackendStatus'
import { Sun, Moon, Cloud, Database } from 'lucide-react'
import { useProgresoPR } from './hooks/useProgresoPR'
import './App.css'

function App() {
  const [estado, dispatch] = useReducer(itemsReducer, estadoInicial);
  const [editingItem, setEditingItem] = useState<GymSession | null>(null);
  
  const storageCtx = useContext(StorageContext);
  const themeCtx = useContext(ThemeContext);

  // estadisticas del dominio usando custom hook
  const { volumenHistorico, totalSesiones, promedioRPE } = useProgresoPR(estado.lista);

  useEffect(() => {
    if (storageCtx) {
      storageCtx.obtenerItems().then(items => {
        dispatch({ type: 'HIDRATAR', payload: items });
      }).catch(err => console.error("Error al hidratar:", err));
    }
    // solo dependemos de obtenerItems (estable) y el modo
  }, [storageCtx?.obtenerItems, storageCtx?.modo]);

  const itemsVisibles = useMemo(() => {
    const lista = estado.lista || [];
    let res = lista.filter(i => i.activo !== false);

    if (estado.busqueda) {
      res = res.filter(i => i.nombre.toLowerCase().includes(estado.busqueda.toLowerCase()));
    }
    if (estado.filtroCategoria !== 'todas') {
      res = res.filter(i => i.categoriaId === estado.filtroCategoria);
    }
    if (estado.filtroEstado !== 'todos') {
      res = res.filter(i => i.estado === estado.filtroEstado);
    }
    return res;
  }, [estado.lista, estado.busqueda, estado.filtroCategoria, estado.filtroEstado]);

  const handleSave = useCallback(async (session: GymSession) => {
    if (storageCtx) {
      await storageCtx.guardarItem(session);
      setEditingItem(null);
      const itemsActualizados = await storageCtx.obtenerItems();
      dispatch({ type: 'HIDRATAR', payload: itemsActualizados });
    }
  }, [storageCtx]);

  const handleDelete = useCallback(async (id: string) => {
    if (storageCtx) {
      await storageCtx.eliminarItem(id);
      dispatch({ type: 'ELIMINAR', payload: id });
    }
  }, [storageCtx]);

  const handleToggle = useCallback(async (id: string) => {
    const item = estado.lista.find(i => i.id === id);
    if (item && storageCtx) {
      const nuevoEstado = item.estado === 'pendiente' ? 'completado' : 'pendiente';
      const fechaActividad = new Date().toISOString();
      const updatedItem = { ...item, estado: nuevoEstado, fechaActividad } as GymSession;
      await storageCtx.guardarItem(updatedItem);
      dispatch({ type: 'CAMBIAR_ESTADO', payload: { id, estado: nuevoEstado, fechaActividad } });
    }
  }, [estado.lista, storageCtx]);

  const handleAddActivity = useCallback((sessionId: string) => {
    const note = prompt("Nota de actividad:");
    if (note) {
      dispatch({ type: 'REGISTRAR_ACTIVIDAD', payload: { sessionId, registro: note } });
    }
  }, []);

  const handleEdit = useCallback((item: GymSession) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFilter = useCallback((campo: 'filtroCategoria' | 'filtroEstado' | 'busqueda', valor: string) => {
    dispatch({ type: 'FILTRAR', payload: { campo, valor } });
  }, []);

  const handleLimpiar = useCallback(() => {
    dispatch({ type: 'LIMPIAR_FILTROS' });
  }, []);

  if (!storageCtx || !themeCtx) return <div className="loading-screen">Cargando Gym Tracker...</div>;

  return (
    <div className="container">
      <header>
        <div className="header-top">
          <div>
            <h1>Gym Tracker</h1>
            <p className="subtitle">High-End Performance Tracking</p>
          </div>
          <div className="header-actions">
            <button 
              className={`mode-toggle ${storageCtx.modo}`}
              onClick={() => storageCtx.setModo(storageCtx.modo === 'api' ? 'local' : 'api')}
              title={`Cambiando a modo ${storageCtx.modo === 'api' ? 'Local' : 'API'}`}
            >
              {storageCtx.modo === 'api' ? <Cloud size={18} /> : <Database size={18} />}
              <span>{storageCtx.modo === 'api' ? 'Cloud' : 'Local'}</span>
            </button>
            <BackendStatus />
            <button className="theme-toggle" onClick={themeCtx.toggleTema}>
              {themeCtx.tema === 'claro' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span>Sesiones</span>
            {totalSesiones}
          </div>
          <div className="stat-item">
            <span>Volumen</span>
            {volumenHistorico.toLocaleString()} kg
          </div>
          <div className="stat-item">
            <span>RPE Promedio</span>
            {promedioRPE}
          </div>
        </div>
      </header>
      
      <main className="content">
        <section className="form-section">
          <FormularioItem onSave={handleSave} editingItem={editingItem} onCancel={() => setEditingItem(null)} />
        </section>
        
        <section className="list-section">
          <div className="list-header">
            <h2>Tus Sesiones</h2>
            <Filtros 
              busqueda={estado.busqueda}
              filtroCategoria={estado.filtroCategoria}
              filtroEstado={estado.filtroEstado}
              onFilter={handleFilter}
              onLimpiar={handleLimpiar}
            />
          </div>
          <ListaItems 
            items={itemsVisibles} 
            onDelete={handleDelete}
            onToggleStatus={handleToggle}
            onEdit={handleEdit}
            onAddActivity={handleAddActivity}
          />
        </section>

        <section className="dashboard-section">
          <div className="list-header">
            <h2>Métricas de Progreso</h2>
          </div>
          <GraficasGym items={itemsVisibles} />
        </section>
      </main>
    </div>
  )
}

export default memo(App)
