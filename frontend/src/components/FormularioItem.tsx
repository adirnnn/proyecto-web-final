import { useState } from 'react';
import type { GymSession, Exercise } from '../types/item';
import { generateUUID } from '../utils/uuid';

interface Props {
  onSave: (session: GymSession) => void;
}

export const FormularioItem = ({ onSave }: Props) => {
  const [nombre, setNombre] = useState('');
  const [categoriaId, setCategoriaId] = useState<GymSession['categoriaId']>('Fuerza');
  const [puntuacion, setPuntuacion] = useState(5);
  const [notas, setNotas] = useState('');
  const [duracionMinutos, setDuracionMinutos] = useState(60);
  const [ejercicios, setEjercicios] = useState<Exercise[]>([]);

  const addExercise = () => {
    const newEx: Exercise = {
      id: generateUUID(),
      nombre: '',
      sets: 3,
      reps: 10,
      peso: 0
    };
    setEjercicios([...ejercicios, newEx]);
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    setEjercicios(ejercicios.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const removeExercise = (id: string) => {
    setEjercicios(ejercicios.filter(ex => ex.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const volumenTotal = ejercicios.reduce((acc, ex) => acc + (ex.sets * ex.reps * ex.peso), 0);
    
    const now = new Date().toISOString();
    
    const newSession: GymSession = {
      id: generateUUID(),
      nombre,
      categoriaId,
      estado: 'pendiente',
      puntuacion,
      fechaRegistro: now,
      fechaActividad: now,
      notas,
      atributos: {
        duracionMinutos,
        volumenTotal,
        ejercicios
      },
      activo: true
    };

    onSave(newSession);
    // para resetear el form
    setNombre('');
    setNotas('');
    setEjercicios([]);
    setDuracionMinutos(60);
    setPuntuacion(5);
  };

  return (
    <form onSubmit={handleSubmit} className="gym-form">
      <h2>Nueva Sesión</h2>
      <div className="form-group">
        <label>Nombre Rutina:</label>
        <input 
          value={nombre} 
          onChange={e => setNombre(e.target.value)} 
          placeholder="Ej: Pierna, Empuje..." 
          required 
        />
      </div>
      
      <div className="form-group">
        <label>Categoría:</label>
        <select value={categoriaId} onChange={e => setCategoriaId(e.target.value as any)}>
          <option value="Fuerza">Fuerza</option>
          <option value="Cardio">Cardio</option>
          <option value="Flexibilidad">Flexibilidad</option>
          <option value="Deportes">Deportes</option>
        </select>
      </div>

      <div className="form-group">
        <label>Duración (min):</label>
        <input 
          type="number" 
          value={duracionMinutos} 
          onChange={e => setDuracionMinutos(Number(e.target.value))} 
        />
      </div>

      <div className="form-group">
        <label>RPE (0-10): {puntuacion}</label>
        <input 
          type="range" min="0" max="10" 
          value={puntuacion} 
          onChange={e => setPuntuacion(Number(e.target.value))} 
        />
      </div>

      <div className="form-group">
        <label>Notas:</label>
        <textarea 
          value={notas} 
          onChange={e => setNotas(e.target.value)} 
          placeholder="Comentarios..." 
        />
      </div>

      <div className="exercises-section">
        <h3>Ejercicios</h3>
        {ejercicios.map(ex => (
          <div key={ex.id} className="exercise-row">
            <input 
              placeholder="Ejercicio" 
              value={ex.nombre} 
              onChange={e => updateExercise(ex.id, 'nombre', e.target.value)} 
              required
            />
            <input 
              type="number" placeholder="Sets" 
              value={ex.sets} 
              onChange={e => updateExercise(ex.id, 'sets', Number(e.target.value))} 
              required
            />
            <input 
              type="number" placeholder="Reps" 
              value={ex.reps} 
              onChange={e => updateExercise(ex.id, 'reps', Number(e.target.value))} 
              required
            />
            <input 
              type="number" placeholder="Peso (kg)" 
              value={ex.peso} 
              onChange={e => updateExercise(ex.id, 'peso', Number(e.target.value))} 
              required
            />
            <button type="button" onClick={() => removeExercise(ex.id)}>x</button>
          </div>
        ))}
        <button type="button" className="add-ex-btn" onClick={addExercise}>+ Agregar Ejercicio</button>
      </div>

      <button type="submit" className="save-btn">Guardar Sesión</button>
    </form>
  );
};
