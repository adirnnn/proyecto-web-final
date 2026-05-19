import { useState, useEffect } from 'react'
import type { GymSession } from './types/item'
import { storageService } from './services/storage'
import { FormularioItem } from './components/FormularioItem'
import { ListaItems } from './components/ListaItems'
import './App.css'

function App() {
  const [items, setItems] = useState<GymSession[]>(() => storageService.getItems());

  useEffect(() => {
    storageService.saveItems(items);
  }, [items]);

  const handleSave = (session: GymSession) => {
    setItems([session, ...items]);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, estado: item.estado === 'pendiente' ? 'completado' : 'pendiente', fechaActividad: new Date().toISOString() } 
        : item
    ));
  };

  return (
    <div className="container">
      <header>
        <h1>Gym Tracker</h1>
        <p>Fase 1: useState + useEffect + LocalStorage</p>
      </header>

      <main className="content">
        <section className="form-section">
          <FormularioItem onSave={handleSave} />
        </section>
        
        <section className="list-section">
          <h2>Tus Sesiones</h2>
          <ListaItems 
            items={items} 
            onDelete={handleDelete} 
            onToggleStatus={handleToggleStatus} 
          />
        </section>
      </main>
    </div>
  )
}

export default App
