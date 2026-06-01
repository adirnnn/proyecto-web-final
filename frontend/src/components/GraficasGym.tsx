import { memo, useMemo, useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar, LineChart, Line
} from 'recharts';
import type { GymSession } from '../types/item';
import './GraficasGym.css';

interface Props {
  items: GymSession[];
}

const COLORS = ['#135eab', '#3a8c88', '#e74c3c', '#f39c12', '#9b59b6'];

export const GraficasGym = memo(({ items }: Props) => {
  // se filtran solo sesiones completadas y activas
  const completed = useMemo(() => {
    return (items || []).filter(i => i.estado === 'completado' && i.activo);
  }, [items]);

  // 1. lista segura de ejercicios
  const listaEjercicios = useMemo(() => {
    const nombres = new Set<string>();
    completed.forEach(s => {
      (s.atributos?.ejercicios || []).forEach(e => {
        if (e && e.nombre) {
          const n = e.nombre.trim();
          if (n) nombres.add(n);
        }
      });
    });
    return Array.from(nombres).sort();
  }, [completed]);

  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState<string>('');

  // efecto seguro para inicializar el select
  useEffect(() => {
    if (listaEjercicios.length > 0 && !listaEjercicios.includes(ejercicioSeleccionado)) {
      setEjercicioSeleccionado(listaEjercicios[0]);
    }
  }, [listaEjercicios, ejercicioSeleccionado]);

  // data para PRs
  const datosPRs = useMemo(() => {
    if (!ejercicioSeleccionado) return [];
    
    return completed
      .sort((a, b) => new Date(a.fechaRegistro).getTime() - new Date(b.fechaRegistro).getTime())
      .map(s => {
        const ejs = (s.atributos?.ejercicios || []).filter(
          e => e.nombre && e.nombre.trim().toLowerCase() === ejercicioSeleccionado.toLowerCase()
        );
        if (ejs.length === 0) return null;
        
        const maxPeso = Math.max(...ejs.map(e => e.peso || 0));
        
        let dateStr = '';
        try {
          const d = new Date(s.fechaRegistro);
          dateStr = isNaN(d.getTime()) ? '' : `${d.getDate()}/${d.getMonth() + 1}`;
        } catch { /* ignore */ }

        return {
          date: dateStr,
          peso: maxPeso
        };
      })
      .filter((d): d is NonNullable<typeof d> => d !== null);
  }, [completed, ejercicioSeleccionado]);

  // Data para volumen histórico (Area)
  const dataVolumen = useMemo(() => {
    return [...completed]
      .sort((a, b) => new Date(a.fechaRegistro).getTime() - new Date(b.fechaRegistro).getTime())
      .map(i => {
        let dateStr = '';
        try {
          const d = new Date(i.fechaRegistro);
          dateStr = isNaN(d.getTime()) ? '' : `${d.getDate()}/${d.getMonth() + 1}`;
        } catch { /* ignore */ }

        return {
          fecha: dateStr,
          volumen: i.atributos?.volumenTotal || 0,
          nombre: i.nombre
        };
      });
  }, [completed]);

  // data para chart pie
  const dataCategorias = useMemo(() => {
    const counts: Record<string, number> = {};
    completed.forEach(i => {
      if (i.categoriaId) {
        counts[i.categoriaId] = (counts[i.categoriaId] || 0) + 1;
      }
    });
    return Object.keys(counts).map(cat => ({ name: cat, value: counts[cat] }));
  }, [completed]);

  // data para RPE bars
  const dataRPE = useMemo(() => {
    return completed.slice(-10).map(i => ({
      name: (i.nombre || 'Sesión').slice(0, 10),
      rpe: i.puntuacion || 0
    }));
  }, [completed]);

  if (completed.length === 0) {
    return (
      <div className="dashboard-grid">
        <div className="no-data-card">
          <p>Registra al menos una sesión completada para visualizar tus estadísticas de progreso.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      <div className="chart-card full-width">
        <div className="chart-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Evolución de PR: {ejercicioSeleccionado || 'Selecciona un ejercicio'}</h3>
            {listaEjercicios.length > 0 && (
              <select 
                className="exercise-select"
                value={ejercicioSeleccionado}
                onChange={(e) => setEjercicioSeleccionado(e.target.value)}
              >
                {listaEjercicios.map(nombre => (
                  <option key={nombre} value={nombre}>{nombre}</option>
                ))}
              </select>
            )}
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosPRs} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-text)" opacity={0.1} />
              <XAxis dataKey="date" fontSize={12} stroke="var(--color-text)" axisLine={false} tickLine={false} />
              <YAxis fontSize={12} stroke="var(--color-text)" axisLine={false} tickLine={false} label={{ value: 'kg', angle: -90, position: 'insideLeft', offset: 10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--glass-border)', borderRadius: '12px', boxShadow: 'var(--shadow)' }}
                formatter={(value: number) => [`${value} kg`, 'Peso Máximo']}
              />
              <Line 
                type="monotone" 
                dataKey="peso" 
                stroke="var(--color-danger)" 
                strokeWidth={4} 
                dot={{ r: 5, fill: 'var(--color-danger)', strokeWidth: 0 }} 
                activeDot={{ r: 8 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card full-width">
        <div className="chart-inner">
          <h3>Volumen Total por Sesión</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataVolumen} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-text)" opacity={0.1} />
              <XAxis 
                dataKey="fecha" 
                stroke="var(--color-text)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis stroke="var(--color-text)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-surface)', 
                  borderRadius: '12px', 
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--shadow)' 
                }} 
              />
              <Area type="monotone" dataKey="volumen" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-inner">
          <h3>Distribución de Entrenamientos</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataCategorias}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {dataCategorias.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-surface)', 
                  borderRadius: '12px', 
                  border: '1px solid var(--glass-border)' 
                }} 
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-inner">
          <h3>Intensidad RPE Reciente</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataRPE}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-text)" opacity={0.1} />
              <XAxis dataKey="name" stroke="var(--color-text)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-text)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--color-surface)', 
                  borderRadius: '12px', 
                  border: '1px solid var(--glass-border)' 
                }} 
              />
              <Bar dataKey="rpe" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});
