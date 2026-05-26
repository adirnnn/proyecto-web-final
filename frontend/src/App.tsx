import { useState, useEffect, useContext } from 'react'
import type { GymSession } from './types/item'
import { FormularioItem } from './components/FormularioItem'
import { ListaItems } from './components/ListaItems'
import { ThemeContext } from './context/ThemeContext'
import { StorageContext } from './context/StorageContext'
import { Sun, Moon, Database, HardDrive } from 'lucide-react'
import './App.css'

function App() {
  const [items, setItems] = useState<GymSession[]>([]);
  const [editingItem, setEditingItem] = useState<GymSession | null>(null);
  
  const themeCtx = useContext(ThemeContext);
  const storageCtx = useContext(StorageContext);

  useEffect(() => {
    if (storageCtx) {
      storageCtx.obtenerItems().then(setItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageCtx?.modo, storageCtx?.obtenerItems]);

  if (!storageCtx) return null;

  const { modo, setModo, guardarItem, eliminarItem, cargando, obtenerItems } = storageCtx;

  const handleSave = async (session: GymSession) => {
    await guardarItem(session);
    setEditingItem(null);
    obtenerItems().then(setItems);
  };

  const handleDelete = async (id: string) => {
    await eliminarItem(id);
    if (editingItem?.id === id) setEditingItem(null);
    obtenerItems().then(setItems);
  };

  const handleEdit = (item: GymSession) => {
    setEditingItem(item);
  };

  const handleToggleStatus = async (id: string) => {
    const itemToUpdate = items.find(i => i.id === id);
    if (itemToUpdate) {
      const updatedItem = {
        ...itemToUpdate,
        estado: itemToUpdate.estado === 'pendiente' ? 'completado' : 'pendiente',
        fechaActividad: new Date().toISOString()
      } as GymSession;
      await guardarItem(updatedItem);
      obtenerItems().then(setItems);
    }
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Gym Tracker</h1>
          <p>Fase 2: StorageContext, ThemeContext y useRef</p>
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
          <ListaItems 
            items={items} 
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
