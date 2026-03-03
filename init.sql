CREATE USER admin WITH ENCRYPTED PASSWORD 'videoland';
CREATE DATABASE videoland OWNER admin;
GRANT ALL PRIVILEGES ON DATABASE videoland TO admin;
\connect videoland;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    tconst TEXT NOT NULL,
    title TEXT NOT NULL,
    plot TEXT NOT NULL,
    release_date INT NOT NULL,
    plot_vector VECTOR(768) NOT NULL
);

CREATE INDEX movies_plot_vector_idx
ON movies
USING ivfflat (plot_vector vector_cosine_ops)
WITH (lists = 500);

ANALYZE movies;