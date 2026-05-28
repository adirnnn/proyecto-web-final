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
  | { type: 'CAMBIAR_ESTADO'; payload: { id: string; estado: 'pendiente' | 'completado' } }
  | { type: 'FILTRAR'; payload: { campo: 'filtroCategoria' | 'filtroEstado' | 'busqueda'; valor: string } }
  | { type: 'LIMPIAR_FILTROS' }
  | { type: 'REGISTRAR_PR'; payload: { sessionId: string; ejercicioId: string; nuevoPeso: number } };

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
        lista: accion.payload,
      };

    case 'AGREGAR':
      return {
        ...estado,
        lista: [accion.payload, ...estado.lista],
      };

    case 'ELIMINAR':
      // hacemos borrado logico para mantener consistencia con lo que podria esperar un backend, 
      // aunque el requerimiento dice eliminar de la lista.
      return {
        ...estado,
        lista: estado.lista.filter(item => item.id !== accion.payload),
      };

    case 'CAMBIAR_ESTADO':
      return {
        ...estado,
        lista: estado.lista.map(item =>
          item.id === accion.payload.id
            ? { ...item, estado: accion.payload.estado, fechaActividad: new Date().toISOString() }
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

    case 'REGISTRAR_PR':
      return {
        ...estado,
        lista: estado.lista.map(session => {
          if (session.id === accion.payload.sessionId) {
            const ejerciciosActualizados = session.atributos.ejercicios.map(ex => {
              if (ex.id === accion.payload.ejercicioId) {
                return { ...ex, peso: accion.payload.nuevoPeso };
              }
              return ex;
            });
            
            // recalculamos volumen total de la sesion
            const nuevoVolumen = ejerciciosActualizados.reduce((acc, curr) => acc + (curr.sets * curr.reps * curr.peso), 0);
            
            return {
              ...session,
              atributos: {
                ...session.atributos,
                ejercicios: ejerciciosActualizados,
                volumenTotal: nuevoVolumen
              }
            };
          }
          return session;
        })
      };

    default:
      return estado;
  }
}
