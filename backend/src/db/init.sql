CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY,
    nombre TEXT NOT NULL,
    categoriaId TEXT,
    estado TEXT,
    puntuacion REAL CHECK (puntuacion >= 0 AND puntuacion <= 10),
    fechaRegistro TEXT,
    fechaActividad TEXT,
    notas TEXT,
    atributos TEXT, -- JSON serializado
    activo INTEGER DEFAULT 1 -- 0 o 1
);

CREATE TABLE IF NOT EXISTS registros (
    id UUID PRIMARY KEY,
    itemId UUID REFERENCES items(id) ON DELETE CASCADE,
    fecha TEXT,
    valor TEXT,
    notas TEXT
);
