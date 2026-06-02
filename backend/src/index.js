const express = require('express');
const cors = require('cors');
require('dotenv').config();

const itemsRouter = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS dinámica para despliegue en Render / Vercel
const allowedOrigins = [
  'http://localhost:5173', // Desarrollo local
  process.env.FRONTEND_URL // Producción (Vercel)
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
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
