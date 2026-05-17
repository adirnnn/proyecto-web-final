CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY,
    nombre TEXT NOT NULL,
    categoriaId TEXT,
    estado TEXT,
    puntuacion REAL CHECK (puntuacion >= 0 AND puntuacion <= 10),
    fechaRegistro TIMESTAMPTZ DEFAULT NOW(),
    fechaActividad TIMESTAMPTZ DEFAULT NOW(),
    notas TEXT,
    atributos JSONB,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS registros (
    id UUID PRIMARY KEY,
    itemId UUID REFERENCES items(id) ON DELETE CASCADE,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    valor TEXT,
    notas TEXT
);
