/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react';
import type { GymSession, Exercise } from '../types/item';
import { generateUUID } from '../utils/uuid';
import { CATEGORIAS } from '../utils/categorias';
import { X, Plus, Save } from 'lucide-react';
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
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [duracionMinutos, setDuracionMinutos] = useState<number | ''>(60);
  const [ejercicios, setEjercicios] = useState<Exercise[]>([]);

  const resetForm = () => {
    setNombre('');
    setCategoriaId('Fuerza');
    setPuntuacion(5);
    setNotas('');
    setFechaSeleccionada(new Date().toISOString().split('T')[0]);
    setDuracionMinutos(60);
    setEjercicios([]);
  };

  useEffect(() => {
    if (editingItem) {
      setNombre(editingItem.nombre);
      setCategoriaId(editingItem.categoriaId);
      setPuntuacion(editingItem.puntuacion ?? 5);
      setNotas(editingItem.notas);
      setFechaSeleccionada(new Date(editingItem.fechaRegistro).toISOString().split('T')[0]);
      setDuracionMinutos(editingItem.atributos.duracionMinutos);
      setEjercicios(editingItem.atributos.ejercicios);
    } else {
      resetForm();
    }
  }, [editingItem]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'n') {
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
      sets: '' as any,
      reps: '' as any,
      peso: '' as any
    };
    setEjercicios([...ejercicios, newEx]);
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    let parsedValue = value;
    if (field !== 'nombre') {
      parsedValue = value === '' ? '' : Number(value);
    }
    setEjercicios(ejercicios.map(ex => 
      ex.id === id ? { ...ex, [field]: parsedValue } : ex
    ));
  };

  const removeExercise = (id: string) => {
    setEjercicios(ejercicios.filter(ex => ex.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const volumenTotal = ejercicios.reduce((acc, ex) => acc + ((Number(ex.sets) || 0) * (Number(ex.reps) || 0) * (Number(ex.peso) || 0)), 0);
    
    let fechaISO = new Date().toISOString();
    try {
      if (fechaSeleccionada) {
        fechaISO = new Date(fechaSeleccionada + "T12:00:00Z").toISOString();
      }
    } catch (e) {
      console.error("Error al procesar fecha seleccionada:", e);
    }
    
    const now = new Date().toISOString();
    
    const sessionData: GymSession = {
      id: editingItem ? editingItem.id : generateUUID(),
      nombre,
      categoriaId,
      estado: editingItem ? editingItem.estado : 'pendiente',
      puntuacion,
      fechaRegistro: fechaISO,
      fechaActividad: now,
      notas,
      atributos: {
        duracionMinutos: Number(duracionMinutos) || 0,
        volumenTotal,
        ejercicios: ejercicios.map(ex => ({
          ...ex,
          sets: Number(ex.sets) || 0,
          reps: Number(ex.reps) || 0,
          peso: Number(ex.peso) || 0
        }))
      },
      activo: true
    };

    onSave(sessionData);
    resetForm();
    
    // usamos los refs acá (1. focus, 2. scroll)
    nombreInputRef.current?.focus();
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="formulario-item">
      <form ref={formRef} onSubmit={handleSubmit} className="form-inner">
        <h2>{editingItem ? 'Editar Sesión' : 'Nueva Sesión'}</h2>
        
        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="nombre">Nombre del Entrenamiento</label>
            <input
              ref={nombreInputRef}
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Empuje A, Día de Pierna..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoría</label>
            <select
              id="categoria"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value as GymSession['categoriaId'])}
            >
              {CATEGORIAS.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fecha">Fecha de Sesión</label>
            <input
              type="date"
              id="fecha"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duracion">Duración (min)</label>
            <input
              type="number"
              id="duracion"
              value={duracionMinutos}
              onChange={(e) => setDuracionMinutos(e.target.value === '' ? '' : Number(e.target.value))}
            />

          </div>

          <div className="form-group">
            <label htmlFor="puntuacion">RPE (Esfuerzo 1-10): {puntuacion}</label>
            <input
              type="range"
              id="puntuacion"
              min="0"
              max="10"
              value={puntuacion}
              onChange={(e) => setPuntuacion(Number(e.target.value))}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="notas">Notas</label>
            <textarea
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="¿Cómo te sentiste hoy?"
              rows={3}
            />
          </div>
        </div>

        <div className="exercises-section">
          <div className="exercise-header">
            <span>Ejercicio</span>
            <span>Sets</span>
            <span>Reps</span>
            <span>Peso (kg)</span>
            <span></span>
          </div>

          {ejercicios.map((ex) => (
            <div key={ex.id} className="exercise-row">
              <input
                type="text"
                placeholder="Ejercicio"
                value={ex.nombre}
                onChange={(e) => updateExercise(ex.id, 'nombre', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Sets"
                value={ex.sets}
                onChange={(e) => updateExercise(ex.id, 'sets', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Reps"
                value={ex.reps}
                onChange={(e) => updateExercise(ex.id, 'reps', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Peso"
                value={ex.peso}
                onChange={(e) => updateExercise(ex.id, 'peso', e.target.value)}
                required
              />
              <button type="button" className="remove-ex-btn" onClick={() => removeExercise(ex.id)}>
                <X size={18} />
              </button>
            </div>
          ))}

          <button type="button" className="btn-add-exercise" onClick={addExercise}>
            <Plus size={18} style={{ marginRight: '8px' }} />
            Agregar Ejercicio
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save">
            <Save size={18} style={{ marginRight: '8px' }} />
            {editingItem ? 'Guardar Cambios' : 'Registrar Sesión'}
          </button>
          <button type="button" className="btn-cancel" onClick={onCancel}>
            {editingItem ? 'Cancelar Edición' : 'Limpiar'}
          </button>
        </div>
      </form>
    </div>
  );
};
