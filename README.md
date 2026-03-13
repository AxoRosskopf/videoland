# Videoland

A movie recommendation engine that understands natural language. You can describe a mood, a feeling, or a situation — and Videoland finds movies that match.

> *"I had a really bad day at work, I need to laugh"*
> *"something that makes me think for days"*
> *"I want action but with actual substance"*

## How it works

Videoland uses **HyDE** (Hypothetical Document Embeddings): instead of searching for your query directly, a local LLM generates a hypothetical movie plot that represents what you're looking for. That plot is embedded and matched against a vector database of real movie plots via cosine similarity.

```
user input → LLM (Qwen 2.5 1.5B) → hypothetical plot → embeddings → pgvector search → TMDB lookup → results
```

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) |
| Backend | FastAPI |
| LLM | Qwen/Qwen2.5-1.5B-Instruct (local, via MPS) |
| Embeddings | sentence-transformers |
| Vector DB | PostgreSQL + pgvector (Docker) |
| Movie metadata | TMDB API |

---

## Setup

### Prerequisites

- Docker
- Python 3.10+
- Node.js + pnpm
- A [TMDB API key](https://www.themoviedb.org/settings/api) (Bearer token)

### 1. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure environment variables

Create `front/.env.local`:

```env
TMDB_API_KEY=your_tmdb_bearer_token
BACKEND_URL=http://127.0.0.1:8000
```

### 3. Prepare the movie CSV

Create a `data/` folder at the project root and place a `movies.csv` file inside with at least these columns:

| Column | Description |
|--------|-------------|
| `title` | Movie title |
| `overview` | Plot summary |

```csv
title,overview
Inception,"A thief who steals corporate secrets through dream-sharing technology."
Interstellar,"A team of explorers travel through a wormhole in space."
```

### 4. Start the database

```bash
docker build -t videoland-db .

docker run -d \
  --name videoland-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=videoland \
  -e POSTGRES_DB=videoland \
  -p 5432:5432 \
  videoland-db
```

Wait until `docker logs videoland-postgres` shows `database system is ready to accept connections`.

### 5. Run the ETL

Reads the CSV, generates embeddings, and loads them into pgvector:

```bash
python -m etl.ingest_csv
```

### 6. Start the backend

```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

The first startup downloads the Qwen model (~1GB). Subsequent starts are fast.

### 7. Start the frontend

```bash
cd front
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), type something in the input and press Enter.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `connection refused` on ETL | Wait for the container to finish initializing (step 4) |
| `KeyError: 'title'` or `KeyError: 'overview'` | Check that the CSV has exactly those column names |
| Container already exists | `docker rm -f videoland-postgres` and repeat step 4 |
| Port 5432 in use | Stop the conflicting process or change `-p 5432:5432` to `-p 5433:5432` |
| Slow first query | Normal — the LLM runs locally and takes 10-30s on first inference |
