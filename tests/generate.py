import pandas as pd
from pathlib import Path

def generate_csv(path: Path,num_rows: int):
    df = pd.DataFrame({
        "id": range(1, num_rows+1),
        "title": [f"Movie {i}" for i in range(1, num_rows+1)],
        "vote_average": [7.5]*num_rows,
        "vote_count": [100]*num_rows,
        "status": ["Released"]*num_rows,
        "release_date": ["2026-01-01"]*num_rows,
        "revenue": [100000]*num_rows,
        "runtime": [120]*num_rows,
        "adult": [False]*num_rows,
        "backdrop_path": [""]*num_rows,
        "budget": [1000000]*num_rows,
        "homepage": [""]*num_rows,
        "tconst": [f"tt{i:07d}" for i in range(1, num_rows+1)],
        "original_language": ["en"]*num_rows,
        "original_title": [f"Movie {i}" for i in range(1, num_rows+1)],
        "overview": ["This is a test plot."]*num_rows,
        "popularity": [10.0]*num_rows,
        "poster_path": [""]*num_rows,
        "tagline": ["Test tagline"]*num_rows,
        "genres": ["Action"]*num_rows,
        "production_companies": [""]*num_rows,
        "production_countries": ["US"]*num_rows,
        "spoken_languages": ["en"]*num_rows,
        "keywords": [""]*num_rows,
        "directors": ["John Doe"]*num_rows,
        "writers": ["Jane Smith"]*num_rows,
        "averageRating": [7.5]*num_rows,
        "numVotes": [100]*num_rows,
        "cast": ["Actor A; Actor B"]*num_rows
    })
    df.to_csv(path, index=False)