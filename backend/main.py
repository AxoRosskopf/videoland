from fastapi import FastAPI
from pydantic import BaseModel
from shared.embedder import Embedder
from shared.db import get_session
from shared.models import Movie
from transformers import pipeline



pipe = pipeline(
    "text-generation",
    model="Qwen/Qwen2.5-0.5B-Instruct",
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
            "role": "system",
            "content": (
                "You are a movie recommendation assistant. "
                "When given a user message, write a short hypothetical movie plot (under 130 words) that represents the ideal movie for that user. "
                "If the user describes a mood, feeling, or situation, infer what kind of movie would suit them. "
                "If the user describes a concept or genre directly, use that. "
                "Output raw plain text only: no markdown, no explanations, no preamble. Just the plot."
            )
        },
        {
            "role": "user",
            "content": input
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
        distance = Movie.plot_vector.cosine_distance(plot_vector).label("distance")
        similar_movies = db.query(Movie, distance).order_by(distance).limit(limit).all()
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

    print(f"      Plot: {hypothesis}")

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
            "release_date": movie.release_date,
            "score": round(1 - distance, 4),
        }
        for movie, distance in movies
    ]

    scores = [r["score"] for r in recommendations]
    average_score = round(sum(scores) / len(scores), 4) if scores else 0
    variance = round(sum((s - average_score) ** 2 for s in scores) / len(scores), 4) if scores else 0

    print(f"[4/4] Devolviendo recomendaciones || Avg: {average_score}, Var: {variance}")
    return {
        "gen_hypothesis": hypothesis,
        "recommendations": recommendations,
        "average": average_score,
        "variance": variance
    }
