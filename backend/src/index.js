const express = require('express');
const cors = require('cors');
require('dotenv').config();

const itemsRouter = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS dinámica para despliegue en Render / Vercel
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (ej. Postman) o desde localhost
    if (!origin || origin.startsWith('http://localhost')) {
      return callback(null, true);
    }

    // Limpiar slash final si el usuario lo puso por accidente en Render
    const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null;
    
    // Permitir si coincide con la variable de entorno exacta o si viene de un dominio de Vercel
    if (origin === frontendUrl || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    callback(new Error('No permitido por CORS'));
  }
}));

app.use(express.json());

// rutas
app.use('/api/items', itemsRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: 'postgres' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
