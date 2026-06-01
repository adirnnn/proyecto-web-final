import { Dumbbell, Activity, HeartPulse, Trophy, Timer } from 'lucide-react';

// nota: usamos iconos de lucide en vez de emojis pq la neta
// se ven mejor con la estetica crema y azul que me robe de indoek.com
console.log("cargando categorias personalizadas con lucide");

export const CATEGORIAS = [
  { id: 'Fuerza', nombre: 'Fuerza', icon: Dumbbell, color: '#135eab' },
  { id: 'Cardio', nombre: 'Cardio', icon: Activity, color: '#e07a5f' },
  { id: 'Flexibilidad', nombre: 'Flexibilidad', icon: HeartPulse, color: '#3a8c88' },
  { id: 'Deportes', nombre: 'Deportes', icon: Trophy, color: '#f2cc8f' },
  { id: 'Resistencia', nombre: 'Resistencia', icon: Timer, color: '#9b59b6' }
];
