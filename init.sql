DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin') THEN
    CREATE USER admin WITH ENCRYPTED PASSWORD 'videoland';
  END IF;
END
$$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_database WHERE datname = 'videoland') THEN
    CREATE DATABASE videoland OWNER admin;
  END IF;
END
$$;
GRANT ALL PRIVILEGES ON DATABASE videoland TO admin;
\connect videoland;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    plot TEXT NOT NULL,
    plot_vector VECTOR(768) NOT NULL,
    release_date TEXT
);

CREATE INDEX movies_plot_vector_idx
ON movies
USING ivfflat (plot_vector vector_cosine_ops)
WITH (lists = 500);

ANALYZE movies;