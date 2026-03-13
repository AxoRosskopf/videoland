from fastapi import FastAPI
from pydantic import BaseModel
from shared.embedder import Embedder
from shared.db import get_session
from shared.models import Movie
from transformers import pipeline

pipe = pipeline(
    "text-generation",
    model="Qwen/Qwen2.5-1.5B-Instruct",
    device="mps",
)

app = FastAPI()

# DTO
class ThoughtsDTO(BaseModel):
    text: str


#Services
def generate_hypothetical_plot(input: str):
    messages = [
        {
            "role": "user",
            "content": (
                f"You are a movie recommendation assistant. A user said: \"{input}\"\n\n"
                "Your task:\n"
                "1. If the user describes a mood, feeling, or situation (e.g. sad, bored, heartbreak), infer what kind of movie would suit them.\n"
                "2. If the user describes a movie concept or genre directly, use that.\n"
                "3. Write a short hypothetical movie plot (under 130 words) that represents the ideal movie for this user.\n\n"
                "Rules: raw plain text only, no markdown, no explanations, just the plot."
            )
        }
    ]
    result = pipe(messages, max_new_tokens=180)
    return result[0]["generated_text"][-1]["content"]

def search_similar_movies(
        plot_vector: list[float],
        limit: int = 20,
        db_session=None
    ):
    db = db_session or get_session()
    created_locally = db_session is None
    try:
        similar_movies = db.query(Movie).order_by(
            Movie.plot_vector.cosine_distance(plot_vector)
        ).limit(limit).all()
        return similar_movies
    finally:
        if created_locally:
            db.close()

#Endpoint

@app.post("/hypo/")
async def gen_recommendations(user_thoughts: ThoughtsDTO):
    print(f"\n[1/4] Query recibida: '{user_thoughts.text}'")

    print("[2/4] Generando plot hipotetico con LLM...")
    hypothesis = generate_hypothetical_plot(user_thoughts.text)
    print(f"      Plot: {hypothesis[:100]}...")

    print("[3/4] Embeddando plot y buscando en base de datos...")
    embedder = Embedder()
    vector_hypo = embedder.embed(hypothesis)[0].tolist()
    movies = search_similar_movies(plot_vector=vector_hypo, limit=20)
    print(f"      {len(movies)} peliculas encontradas")

    recommendations = [
        {
            "id": movie.id,
            "title": movie.title,
            "plot": movie.plot,
            "release_date": movie.release_date
        }
        for movie in movies
    ]

    print(f"[4/4] Devolviendo recomendaciones: {[m['title'] for m in recommendations]}\n")
    return {
        "recommendations": recommendations
    }
