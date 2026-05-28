import { CATEGORIAS } from '../utils/categorias';
import './Filtros.css';

interface FiltrosProps {
  busqueda: string;
  filtroCategoria: string;
  filtroEstado: string;
  onFilter: (campo: 'busqueda' | 'filtroCategoria' | 'filtroEstado', valor: string) => void;
  onLimpiar: () => void;
}

export const Filtros = ({ busqueda, filtroCategoria, filtroEstado, onFilter, onLimpiar }: FiltrosProps) => {
  return (
    <div className="filtros-container">
      <div className="filtro-group">
        <label>Buscar:</label>
        <input 
          type="text" 
          value={busqueda} 
          onChange={(e) => onFilter('busqueda', e.target.value)} 
          placeholder="Nombre de rutina..."
        />
      </div>

      <div className="filtro-group">
        <label>Categoría:</label>
        <select value={filtroCategoria} onChange={(e) => onFilter('filtroCategoria', e.target.value)}>
          <option value="todas">Todas</option>
          {CATEGORIAS.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      <div className="filtro-group">
        <label>Estado:</label>
        <select value={filtroEstado} onChange={(e) => onFilter('filtroEstado', e.target.value)}>
          <option value="todos">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="completado">Completado</option>
        </select>
      </div>

      <button className="limpiar-btn" onClick={onLimpiar}>
        Limpiar Filtros
      </button>
    </div>
  );
};
