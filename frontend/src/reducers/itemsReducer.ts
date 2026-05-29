import type { GymSession } from '../types/item';

export interface ItemsEstado {
  lista: GymSession[];
  filtroCategoria: string;
  filtroEstado: string;
  busqueda: string;
}

export type ItemsAccion =
  | { type: 'HIDRATAR'; payload: GymSession[] }
  | { type: 'AGREGAR'; payload: GymSession }
  | { type: 'ELIMINAR'; payload: string }
  | { type: 'CAMBIAR_ESTADO'; payload: { id: string; estado: 'pendiente' | 'completado'; fechaActividad: string } }
  | { type: 'FILTRAR'; payload: { campo: 'filtroCategoria' | 'filtroEstado' | 'busqueda'; valor: string } }
  | { type: 'LIMPIAR_FILTROS' }
  | { type: 'REGISTRAR_ACTIVIDAD'; payload: { sessionId: string; registro: string } };

export const estadoInicial: ItemsEstado = {
  lista: [],
  filtroCategoria: 'todas',
  filtroEstado: 'todos',
  busqueda: '',
};

export function itemsReducer(estado: ItemsEstado, accion: ItemsAccion): ItemsEstado {
  switch (accion.type) {
    case 'HIDRATAR':
      return {
        ...estado,
        lista: Array.isArray(accion.payload) ? accion.payload : [],
      };

    case 'AGREGAR':
      return {
        ...estado,
        lista: [accion.payload, ...estado.lista],
      };

    case 'ELIMINAR':
      return {
        ...estado,
        lista: estado.lista.map(item =>
          item.id === accion.payload ? { ...item, activo: false } : item
        ),
      };

    case 'CAMBIAR_ESTADO':
      return {
        ...estado,
        lista: estado.lista.map(item =>
          item.id === accion.payload.id
            ? { ...item, estado: accion.payload.estado, fechaActividad: accion.payload.fechaActividad }
            : item
        ),
      };

    case 'FILTRAR':
      return {
        ...estado,
        [accion.payload.campo]: accion.payload.valor,
      };

    case 'LIMPIAR_FILTROS':
      return {
        ...estado,
        filtroCategoria: 'todas',
        filtroEstado: 'todos',
        busqueda: '',
      };

    case 'REGISTRAR_ACTIVIDAD':
      return {
        ...estado,
        lista: estado.lista.map(item =>
          item.id === accion.payload.sessionId
            ? { ...item, notas: (item.notas || "") + " | " + accion.payload.registro }
            : item
        ),
      };

    default:
      return estado;
  }
}
