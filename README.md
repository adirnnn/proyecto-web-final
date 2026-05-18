# Gym Tracker - Proyecto Final Fase 1 🏋️‍♂️
**Sistemas y Tecnologías Web - Universidad del Valle de Guatemala**

## Descripción del Proyecto
Bitácora digital para el registro y seguimiento de sesiones de entrenamiento físico. Permite gestionar rutinas (fuerza, cardio, etc.), registrar ejercicios con sus respectivos sets/reps/peso y calcular el volumen total de cada sesión.

Esta entrega comprende la **Fase 1**, con un Frontend CRUD reactivo y un Backend funcional con persistencia en PostgreSQL.

---

## Estructura de la Solución

### 1. Frontend (React + Vite + TS)
- **Estado**: Manejo de sesiones mediante `useState` con *lazy initialization*.
- **Persistencia**: Sincronización automática con `LocalStorage` usando `useEffect`.
- **Componentes**: 
  - `FormularioItem`: Creación dinámica de sesiones con filas de ejercicios.
  - `ListaItems`: Renderizado del historial de entrenamientos.
  - `ItemCard`: Visualización detallada y acciones (completar/eliminar).

### 2. Backend (Node.js + Express)
- **API REST**: 5 endpoints para gestión de items y registros.
- **Base de Datos**: PostgreSQL para persistencia real.
- **CORS**: Configurado para comunicación segura con el frontend.

---

## Cómo Ejecutar

### Base de Datos
1. Crear una base de datos en PostgreSQL llamada `gym_tracker`.
2. Ejecutar el script `backend/src/db/init.sql` para crear las tablas `items` y `registros`.

### Backend
1. Ir a la carpeta `backend/`.
2. Crear un archivo `.env` basado en `.env.example` con tus credenciales de PostgreSQL.
3. Instalar dependencias: `npm install`
4. Iniciar servidor: `npm run dev` (puerto 3000).

### Frontend
1. Ir a la carpeta `frontend/`.
2. Instalar dependencias: `npm install`
3. Iniciar aplicación: `npm run dev` (puerto 5173).

---

## Mis primeros Items (Evidencia Real)

A continuación se muestra la aplicación funcionando con datos reales de entrenamiento (no placeholders).

### Captura de 3 Items Reales
![Mis primeros Items](./screenshots/3items.jpg)

### Interfaz de Usuario (Modern Theme)
![Frontend Post-CSS](./screenshots/frontendfase1postcss.jpg)

### Estructura de Base de Datos (PostgreSQL)
![Diagrama/BD](./screenshots/fase1DER.jpg)

---

## Requerimientos Técnicos Cumplidos
- [x] **Vite + Express Setup**: Proyectos independientes y funcionales.
- [x] **CRUD Completo**: Crear, leer, actualizar (estado) y archivar (soft delete).
- [x] **LocalStorage**: Persistencia garantizada en el navegador.
- [x] **API 5 Endpoints**: GET, POST, PUT, DELETE y POST /registro.
- [x] **Base de Datos**: Tablas normalizadas en PostgreSQL.
- [x] **Git**: Historial de commits detallado y organizado.
