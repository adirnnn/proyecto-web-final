const express = require('express');
const router = express.Router();
const db = require('../db');

// GET
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM items WHERE activo = true ORDER BY fechaRegistro DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST
router.post('/', async (req, res) => {
  const { id, nombre, categoriaId, estado, puntuacion, fechaRegistro, fechaActividad, notas, atributos, activo } = req.body;
  try {
    const query = `
      INSERT INTO items (id, nombre, categoriaId, estado, puntuacion, fechaRegistro, fechaActividad, notas, atributos, activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`;
    const values = [id, nombre, categoriaId, estado, puntuacion, fechaRegistro, fechaActividad, notas, atributos, activo];
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, categoriaId, estado, puntuacion, fechaActividad, notas, atributos } = req.body;
  try {
    const query = `
      UPDATE items 
      SET nombre = $1, categoriaId = $2, estado = $3, puntuacion = $4, fechaActividad = $5, notas = $6, atributos = $7
      WHERE id = $8 RETURNING *`;
    const values = [nombre, categoriaId, estado, puntuacion, fechaActividad, notas, atributos, id];
    const result = await db.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('UPDATE items SET activo = false WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Item archived' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/items/:id/registro
router.post('/:id/registro', async (req, res) => {
  const { id } = req.params;
  const { regId, fecha, valor, notas } = req.body;
  try {
    const query = 'INSERT INTO registros (id, itemId, fecha, valor, notas) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [regId, id, fecha, valor, notas];
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
