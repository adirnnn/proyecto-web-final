import { memo } from 'react';
import type { GymSession } from '../types/item';
import './ItemCard.css';

interface Props {
  session: GymSession;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onEdit: (item: GymSession) => void;
  onAddActivity: (id: string) => void;
}

import { CATEGORIAS } from '../utils/categorias';

export const ItemCard = memo(({ session, onDelete, onToggleStatus, onEdit, onAddActivity }: Props) => {
  const category = CATEGORIAS.find(c => c.id === session.categoriaId);
  const Icon = category?.icon;

  return (
    <div className={`item-card ${session.estado}`}>
      <h3>{session.nombre}</h3>
      <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: category?.color }}>
        <strong>Categoría:</strong> 
        {Icon && <Icon size={18} />} 
        {session.categoriaId}
      </p>
      <p><strong>Estado:</strong> {session.estado}</p>
      <p><strong>RPE:</strong> {session.puntuacion}/10</p>
      <p><strong>Volumen Total:</strong> {session.atributos.volumenTotal} kg</p>
      <p><strong>Fecha:</strong> {session.fechaRegistro ? new Date(session.fechaRegistro).toLocaleDateString() : 'Sin fecha'}</p>
      {session.notas && <p className="notes-preview"><strong>Notas:</strong> {session.notas}</p>}
      <div className="exercises-summary">
        <h4>Ejercicios ({session.atributos.ejercicios.length}):</h4>
        <ul>
          {session.atributos.ejercicios.map((ex) => (
            <li key={ex.id}>
              {ex.nombre}: {ex.sets}x{ex.reps} @ {ex.peso}kg
            </li>
          ))}
        </ul>
      </div>
      <div className="actions">
        <button onClick={() => onToggleStatus(session.id)}>
          {session.estado === 'pendiente' ? 'Completar' : 'Reabrir'}
        </button>
        <button onClick={() => onAddActivity(session.id)} className="activity-btn">
          + Nota
        </button>
        {session.estado !== 'completado' && (
          <button onClick={() => onEdit(session)}>
            Editar
          </button>
        )}
        <button onClick={() => onDelete(session.id)} className="delete-btn">
          Eliminar
        </button>
      </div>
    </div>
  );
});
