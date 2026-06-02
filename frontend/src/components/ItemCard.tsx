import { memo } from 'react';
import type { GymSession } from '../types/item';
import { Trash2, Edit2, Plus, Check, RotateCcw, Calendar } from 'lucide-react';
import { CATEGORIAS } from '../utils/categorias';
import './ItemCard.css';

interface Props {
  session: GymSession;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onEdit: (item: GymSession) => void;
  onAddActivity: (id: string) => void;
}

export const ItemCard = memo(({ session, onDelete, onToggleStatus, onEdit, onAddActivity }: Props) => {
  const category = CATEGORIAS.find(c => c.id === session.categoriaId);
  const CatIcon = category?.icon;

  return (
    <div className={`item-card ${session.estado}`}>
      <div className="status-badge">{session.estado}</div>
      
      <div className="card-inner">
        <div className="card-header">
          <div className="card-title">
            <span className="categoria-badge" style={{ '--cat-color': category?.color } as React.CSSProperties}>
              {CatIcon && <CatIcon size={14} />}
              {session.categoriaId}
            </span>
            <h3>{session.nombre}</h3>
          </div>
          <div className="puntuacion-circle" title="RPE (Esfuerzo)" style={{ marginTop: '1rem' }}>
            {session.puntuacion || 0}
          </div>
        </div>

        <div className="exercises-summary">
          <h4>Ejercicios ({session.atributos.ejercicios.length})</h4>
          <ul>
            {session.atributos.ejercicios.slice(0, 3).map((ex) => (
              <li key={ex.id}>
                {ex.nombre}: {ex.sets}x{ex.reps} @ {ex.peso}kg
              </li>
            ))}
            {session.atributos.ejercicios.length > 3 && (
              <li style={{ opacity: 0.5, fontSize: '0.8rem' }}>
                + {session.atributos.ejercicios.length - 3} más...
              </li>
            )}
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', opacity: 0.6, fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={14} />
            {session.fechaRegistro ? new Date(session.fechaRegistro).toLocaleDateString() : 'Sin fecha'}
          </div>
          <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
            {session.atributos.volumenTotal} kg total
          </div>
        </div>

        <div className="actions">
          <button onClick={() => onToggleStatus(session.id)} title={session.estado === 'pendiente' ? 'Completar' : 'Reabrir'}>
            {session.estado === 'pendiente' ? <Check size={16} /> : <RotateCcw size={16} />}
          </button>
          
          <button onClick={() => onAddActivity(session.id)} title="Agregar Nota">
            <Plus size={16} />
          </button>

          {session.estado !== 'completado' && (
            <button onClick={() => onEdit(session)} title="Editar Sesión">
              <Edit2 size={16} />
            </button>
          )}
          
          <button onClick={() => onDelete(session.id)} className="delete-btn" title="Eliminar">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});
