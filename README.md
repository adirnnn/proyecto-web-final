# Gym Tracker - Bitácora Personal (Fase 1)
**UVG - Sistemas y Tecnologías Web**

Este es mi proyecto para la primera fase. Decidí hacer un tracker de gimnasio porque me sirve para llevar el control de lo que levanto en cada sesión, en lugar de anotarlo en el celular o en papel.

En esta parte logré que el frontend guarde todo en el navegador y que el backend ya tenga las tablas listas para cuando nos toque conectarlos en la Fase 2.

---

## Lo que hice en esta Fase

### Frontend
Armé la interfaz con **React y Vite**. Lo más importante es que las sesiones no se borran al recargar la página porque usé `LocalStorage`.
- El formulario permite agregar varios ejercicios a la misma sesión.
- Calculo el volumen total (sets x reps x peso) automáticamente.
- Dividí todo en componentes: `FormularioItem`, `ListaItems` e `ItemCard`.
- Agregué la funcionalidad de **Editar Sesión** para corregir datos antes de completarlas.

### Backend
Hice un servidor con **Express** que ya se conecta a **PostgreSQL**.
- Creé las tablas `items` (para las sesiones) y `registros`.
- Los 5 endpoints ya están programados y listos para recibir datos.

---

## Decisiones de Diseño (Fase 2)

**Iconos en vez de emojis:**
Las instrucciones pedían usar emojis para las categorías, pero decidí usar la librería `lucide-react` para los iconos. Siento que los emojis rompen la estética (crema y azul) que llevo hasta ahora. Toda la vibra visual, incluyendo la paleta de colores, la tomé inspirándome en **indoek.com** (una página de surf que vi en siteinspire). Por eso no usé el típico negro/rojo de gym, quería algo más chill.

---

## Capturas de mi progreso

Aquí se puede ver cómo quedó la interfaz y que ya la estoy probando con mis propios entrenamientos:

### Mis entrenamientos (Datos reales)
![Entrenamientos Reales 1](./screenshots/itemsreales1.jpg)
![Entrenamientos Reales 2](./screenshots/itemsreales2.jpg)

### Diseño de la App (Modern Theme)
![Vista del Frontend](./screenshots/frontendfase1postcss.jpg)

### Tablas en PostgreSQL
![Tablas en pgAdmin](./screenshots/fase1DER.jpg)

---

## Cómo correr el proyecto

### Para el Backend:
1. Tener PostgreSQL instalado y una base de datos llamada `gym_tracker`.
2. Correr el script de `backend/src/db/init.sql`.
3. Crear un `.env` dentro de `backend/` con los datos de tu base de datos (puedes ver el `.env.example`).
4. `npm install` y luego `npm run dev`.

### Para el Frontend:
1. `cd frontend`
2. `npm install`
3. `npm run dev` y abrir el link de Localhost.
