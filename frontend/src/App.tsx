import { useEffect, useContext, useReducer, useMemo, useCallback, useState } from 'react'
import type { GymSession } from './types/item'
import { FormularioItem } from './components/FormularioItem'
import { ListaItems } from './components/ListaItems'
import { Filtros } from './components/Filtros'
import { ThemeContext } from './context/ThemeContext'
import { StorageContext } from './context/StorageContext'
import { itemsReducer, estadoInicial } from './reducers/itemsReducer'
import { Sun, Moon, Database, HardDrive } from 'lucide-react'
import './App.css'

function App() {
  const [estado, dispatch] = useReducer(itemsReducer, estadoInicial);
  const [editingItem, setEditingItem] = useState<GymSession | null>(null);
  
  const themeCtx = useContext(ThemeContext);
  const storageCtx = useContext(StorageContext);

  useEffect(() => {
    if (storageCtx) {
      storageCtx.obtenerItems().then(items => {
        dispatch({ type: 'HIDRATAR', payload: items });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageCtx?.modo, storageCtx?.obtenerItems]);

  if (!storageCtx) return null;

  const { modo, setModo, guardarItem, eliminarItem, cargando, obtenerItems } = storageCtx;

  // useMemo para filtrar la lista en tiempo real
  const itemsVisibles = useMemo(() => {
    let res = [...estado.lista];

    if (estado.busqueda) {
      res = res.filter(i => 
        i.nombre.toLowerCase().includes(estado.busqueda.toLowerCase())
      );
    }

    if (estado.filtroCategoria !== 'todas') {
      res = res.filter(i => i.categoriaId === estado.filtroCategoria);
    }

    if (estado.filtroEstado !== 'todos') {
      res = res.filter(i => i.estado === estado.filtroEstado);
    }

    return res;
  }, [estado.lista, estado.busqueda, estado.filtroCategoria, estado.filtroEstado]);

  // Handlers con useCallback para optimización
  const handleSave = useCallback(async (session: GymSession) => {
    await guardarItem(session);
    setEditingItem(null);
    const itemsActualizados = await obtenerItems();
    dispatch({ type: 'HIDRATAR', payload: itemsActualizados });
  }, [guardarItem, obtenerItems]);

  const handleDelete = useCallback(async (id: string) => {
    await eliminarItem(id);
    if (editingItem?.id === id) setEditingItem(null);
    dispatch({ type: 'ELIMINAR', payload: id });
  }, [eliminarItem, editingItem?.id]);

  const handleEdit = useCallback((item: GymSession) => {
    setEditingItem(item);
  }, []);

  const handleToggleStatus = useCallback(async (id: string) => {
    const itemToUpdate = estado.lista.find(i => i.id === id);
    if (itemToUpdate) {
      const nuevoEstado = itemToUpdate.estado === 'pendiente' ? 'completado' : 'pendiente';
      const updatedItem = {
        ...itemToUpdate,
        estado: nuevoEstado,
        fechaActividad: new Date().toISOString()
      } as GymSession;
      await guardarItem(updatedItem);
      dispatch({ type: 'CAMBIAR_ESTADO', payload: { id, estado: nuevoEstado } });
    }
  }, [estado.lista, guardarItem]);

  const handleFilter = useCallback((campo: 'busqueda' | 'filtroCategoria' | 'filtroEstado', valor: string) => {
    dispatch({ type: 'FILTRAR', payload: { campo, valor } });
  }, []);

  const handleLimpiarFiltros = useCallback(() => {
    dispatch({ type: 'LIMPIAR_FILTROS' });
  }, []);

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Gym Tracker</h1>
          <p>Fase 3: useReducer, Filtros y Optimización</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => setModo(modo === 'local' ? 'api' : 'local')}
            style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            title="Cambiar Modo"
          >
            {modo === 'local' ? <><HardDrive size={18} /> Local</> : <><Database size={18} /> API</>}
          </button>

          {themeCtx && (
            <button 
              onClick={themeCtx.toggleTema} 
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}
              title="Cambiar Tema (T)"
            >
              {themeCtx.tema === 'claro' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
          )}
        </div>
      </header>

      {cargando && <p style={{ textAlign: 'center', color: 'var(--color-primary)' }}>Sincronizando...</p>}

      <main className="content">
        <section className="form-section">
          <FormularioItem 
            onSave={handleSave} 
            editingItem={editingItem} 
            onCancel={() => setEditingItem(null)}
          />
        </section>
        
        <section className="list-section">
          <h2>Tus Sesiones</h2>
          
          <Filtros 
            busqueda={estado.busqueda}
            filtroCategoria={estado.filtroCategoria}
            filtroEstado={estado.filtroEstado}
            onFilter={handleFilter}
            onLimpiar={handleLimpiarFiltros}
          />

          <ListaItems 
            items={itemsVisibles} 
            onDelete={handleDelete} 
            onToggleStatus={handleToggleStatus}
            onEdit={handleEdit}
          />
        </section>
      </main>
    </div>
  )
}

export default App
