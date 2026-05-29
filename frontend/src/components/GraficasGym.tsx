import { useMemo, memo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import type { GymSession } from '../types/item';
import { CATEGORIAS } from '../utils/categorias';
import './GraficasGym.css';

interface Props {
  items: GymSession[];
}

export const GraficasGym = memo(({ items }: Props) => {
  const datosActividad = useMemo(() => {
    const diasLabels = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const hoy = new Date();
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(hoy.getDate() - i);
      const diaStr = d.toISOString().split('T')[0];

      const mins = (items || [])
        .filter(item => {
          if (!item?.fechaRegistro) return false;
          // Normalizamos a YYYY-MM-DD para comparar
          try {
            const itemFecha = new Date(item.fechaRegistro).toISOString().split('T')[0];
            return itemFecha === diaStr;
          } catch (e) {
            return false;
          }
        })
        .reduce((acc, curr) => acc + (curr?.atributos?.duracionMinutos || 0), 0);
      result.push({ name: diasLabels[d.getDay()], value: mins });
    }
    return result;
  }, [items]);

  // 2. Categorías (Pie)
  const datosCategorias = useMemo(() => {
    return CATEGORIAS.map(cat => ({
      name: cat.nombre,
      count: (items || []).filter(i => i?.categoriaId === cat.id && i?.activo !== false).length,
      color: cat.color
    })).filter(d => d.count > 0);
  }, [items]);

  // 3. PRs (Línea) - Tu Gráfica Original
  const datosPRs = useMemo(() => {
    const registros: { [key: string]: number } = {};
    (items || []).forEach(s => {
      if (!s?.fechaRegistro) return;
      try {
        const f = new Date(s.fechaRegistro).toISOString().split('T')[0];
        const max = (s.atributos?.ejercicios || []).reduce((m, ex) => Math.max(m, ex?.peso || 0), 0);
        if (!registros[f] || max > registros[f]) registros[f] = max;
      } catch (e) {
        console.error("Error procesando fecha en PRs:", s.fechaRegistro);
      }
    });
    return Object.keys(registros).sort().map(f => ({
      date: f.split('-').slice(1).reverse().join('/'),
      val: registros[f]
    }));
  }, [items]);

  if (!items || items.length === 0) {
    return (
      <div className="no-data-card">
        <p>Registra un par de sesiones para ver tus estadísticas.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      <div className="chart-card">
        <h3>Actividad Semanal</h3>
        <BarChart width={340} height={220} data={datosActividad} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-text)" opacity={0.1} />
          <XAxis dataKey="name" fontSize={12} tick={{ fill: 'var(--color-text)' }} axisLine={false} tickLine={false} />
          <YAxis fontSize={12} tick={{ fill: 'var(--color-text)' }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--color-surface)', border: 'none', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}
            itemStyle={{ color: 'var(--color-primary)' }}
          />
          <Legend iconType="circle" />
          <Bar dataKey="value" name="Minutos" fill="var(--color-primary)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </div>

      <div className="chart-card">
        <h3>Distribución por Tipo</h3>
        <PieChart width={340} height={220}>
          <Pie
            data={datosCategorias}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="count"
            nameKey="name"
            isAnimationActive={false}
          >
            {datosCategorias.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--color-surface)', border: 'none', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </div>

      <div className="chart-card full-width">
        <h3>Evolución de PRs (Peso Máximo)</h3>
        <LineChart width={720} height={220} data={datosPRs} margin={{ top: 5, right: 30, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-text)" opacity={0.1} />
          <XAxis dataKey="date" fontSize={12} tick={{ fill: 'var(--color-text)' }} axisLine={false} tickLine={false} />
          <YAxis fontSize={12} tick={{ fill: 'var(--color-text)' }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--color-surface)', border: 'none', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}
          />
          <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
          <Line 
            type="monotone" 
            dataKey="val" 
            name="Peso (kg)" 
            stroke="var(--color-danger)" 
            strokeWidth={3} 
            dot={{ r: 4, fill: 'var(--color-danger)', strokeWidth: 0 }} 
            activeDot={{ r: 6 }}
            isAnimationActive={false}
          />
        </LineChart>
      </div>
    </div>
  );
});
