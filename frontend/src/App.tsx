import { useState, useEffect } from 'react'
import type { GymSession } from './types/item'
import { storageService } from './services/storage'
import './App.css'

function App() {
  const [items, _setItems] = useState<GymSession[]>(() => storageService.getItems());

  useEffect(() => {
    storageService.saveItems(items);
  }, [items]);

  return (
    <>
      <section id="center">
        <div>
          <h1>Gym Tracker</h1>
          <p>Fase 1: useState + useEffect + LocalStorage</p>
        </div>
        <div className="card">
          <p>Sesiones registradas: {items.length}</p>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
