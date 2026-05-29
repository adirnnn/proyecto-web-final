import type { GymSession } from '../types/item';
import { ItemCard } from './ItemCard';

interface Props {
  items: GymSession[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onEdit: (item: GymSession) => void;
  onAddActivity: (id: string) => void;
}

export const ListaItems = ({ items, onDelete, onToggleStatus, onEdit, onAddActivity }: Props) => {
  if (items.length === 0) return <p>No hay sesiones registradas.</p>;

  return (
    <div className="lista-items">
      {items.map((item) => (
        <ItemCard 
          key={item.id} 
          session={item} 
          onDelete={onDelete} 
          onToggleStatus={onToggleStatus} 
          onEdit={onEdit}
          onAddActivity={onAddActivity}
        />
      ))}
    </div>
  );
};
