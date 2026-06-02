const express = require('express');
const cors = require('cors');
require('dotenv').config();

const itemsRouter = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS hiper-relajada para asegurar que la defensa del proyecto funcione
app.use(cors({
  origin: '*'
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
