export interface Exercise {
  id: string;
  nombre: string;
  sets: number;
  reps: number;
  peso: number;
}

export interface GymAtributos {
  duracionMinutos: number;
  volumenTotal: number;
  ejercicios: Exercise[];
}

export interface GymSession {
  id: string;
  nombre: string;
  categoriaId: 'Fuerza' | 'Cardio' | 'Flexibilidad' | 'Deportes';
  estado: 'pendiente' | 'completado';
  puntuacion: number | null; // RPE 0-10
  fechaRegistro: string;
  fechaActividad: string;
  notas: string;
  atributos: GymAtributos;
  activo: boolean;
}
