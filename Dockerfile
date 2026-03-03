FROM postgres:latest
FROM pgvector/pgvector:pg16

COPY init.sql /docker-entrypoint-initdb.d/
