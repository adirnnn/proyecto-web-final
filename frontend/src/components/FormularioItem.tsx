/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';
import type { GymSession, Exercise } from '../types/item';
import { generateUUID } from '../utils/uuid';
import { CATEGORIAS } from '../utils/categorias';
import './FormularioItem.css';

interface Props {
  onSave: (session: GymSession) => void;
  editingItem: GymSession | null;
  onCancel: () => void;
}

export const FormularioItem = ({ onSave, editingItem, onCancel }: Props) => {
  const nombreInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [nombre, setNombre] = useState('');
  const [categoriaId, setCategoriaId] = useState<GymSession['categoriaId']>('Fuerza');
  const [puntuacion, setPuntuacion] = useState(5);
  const [notas, setNotas] = useState('');
  const [duracionMinutos, setDuracionMinutos] = useState(60);
  const [ejercicios, setEjercicios] = useState<Exercise[]>([]);

  const resetForm = () => {
    setNombre('');
    setCategoriaId('Fuerza');
    setPuntuacion(5);
    setNotas('');
    setDuracionMinutos(60);
    setEjercicios([]);
  };

  useEffect(() => {
    if (editingItem) {
      setNombre(editingItem.nombre);
      setCategoriaId(editingItem.categoriaId);
      setPuntuacion(editingItem.puntuacion ?? 5);
      setNotas(editingItem.notas);
      setDuracionMinutos(editingItem.atributos.duracionMinutos);
      setEjercicios(editingItem.atributos.ejercicios);
    } else {
      resetForm();
    }
  }, [editingItem]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        onCancel();
        nombreInputRef.current?.focus();
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

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
    
    const sessionData: GymSession = {
      id: editingItem ? editingItem.id : generateUUID(),
      nombre,
      categoriaId,
      estado: editingItem ? editingItem.estado : 'pendiente',
      puntuacion,
      fechaRegistro: editingItem ? editingItem.fechaRegistro : now,
      fechaActividad: now,
      notas,
      atributos: {
        duracionMinutos,
        volumenTotal,
        ejercicios
      },
      activo: true
    };

    onSave(sessionData);
    resetForm();
    
    // usamos los refs acá! (1. focus, 2. scroll)
    nombreInputRef.current?.focus();
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="gym-form">
      <h2>{editingItem ? 'Editar Sesión' : 'Nueva Sesión (Ctrl+N)'}</h2>
      <div className="form-group">
        <label>Nombre Rutina:</label>
        <input 
          ref={nombreInputRef}
          value={nombre} 
          onChange={e => setNombre(e.target.value)} 
          placeholder="Ej: Pierna, Empuje..." 
          required 
        />
      </div>
      
      <div className="form-group">
        <label>Categoría:</label>
        <select value={categoriaId} onChange={e => setCategoriaId(e.target.value as GymSession['categoriaId'])}>
          {CATEGORIAS.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
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
        <div className="exercise-header">
          <span>Ejercicio</span>
          <span>Sets</span>
          <span>Reps</span>
          <span>Peso (kg)</span>
          <span></span>
        </div>
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

      <div className="form-actions">
        <button type="submit" className="save-btn">
          {editingItem ? 'Actualizar Sesión' : 'Guardar Sesión'}
        </button>
        {editingItem && (
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancelar Edición
          </button>
        )}
      </div>
    </form>
  );
};
