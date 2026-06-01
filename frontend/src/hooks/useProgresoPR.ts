import { useMemo } from 'react';
import type { GymSession } from '../types/item';

/**
 * hook de dominio especifico para calcular el progreso de los PRs y otras stats
 * 
 * @param {GymSession[]} sessions - array de sesiones de entrenamiento
 * @returns {Object} Un objeto con las estadisticas calculadas:
 *   - volumenHistorico: suma total de kilos movidos en todas las sesiones
 *   - recordsPersonales: un mapa de los pesos maximos alcanzados por ejercicio
 *   - totalSesiones: cantidad de sesiones marcadas como completadas
 *   - promedioRPE: el promedio del esfuerzo percibido del usuario
 */

export function useProgresoPR(sessions: GymSession[]) {
  const stats = useMemo(() => {
    const completedSessions = sessions.filter(s => s.estado === 'completado' && s.activo);
    
    // 1. volumen histórico total
    const volumenHistorico = completedSessions.reduce((acc, s) => {
      return acc + (s.atributos?.volumenTotal || 0);
    }, 0);
    
    // 2. PRs por ejercicio
    const recordsPersonales: Record<string, number> = {};
    
    completedSessions.forEach(session => {
      session.atributos?.ejercicios?.forEach(ejercicio => {
        const nombre = ejercicio.nombre.toLowerCase().trim();
        const peso = ejercicio.peso;
        
        if (!recordsPersonales[nombre] || peso > recordsPersonales[nombre]) {
          recordsPersonales[nombre] = peso;
        }
      });
    });

    // 3. promedio de RPE (Puntuación de esfuerzo 0-10)
    const sesionesConPuntuacion = completedSessions.filter(s => s.puntuacion !== null);
    const sumaRPE = sesionesConPuntuacion.reduce((acc, s) => acc + (s.puntuacion || 0), 0);
    const promedioRPE = sesionesConPuntuacion.length > 0 
      ? parseFloat((sumaRPE / sesionesConPuntuacion.length).toFixed(1)) 
      : 0;

    return {
      volumenHistorico,
      recordsPersonales,
      totalSesiones: completedSessions.length,
      promedioRPE
    };
  }, [sessions]);

  return stats;
}
