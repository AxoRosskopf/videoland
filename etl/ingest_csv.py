import os
import psutil
import pandas as pd
from tqdm import tqdm
from etl.load_pgvector import save_movie
from shared.embedder import Embedder

def run_etl(path_csv: str = 'data/movies.csv', save_fn=save_movie):
    df = pd.read_csv(path_csv)
    if df.empty:
        print(f"[WARNING] The CSV '{path_csv}' is empty. No movies to process.")
        return
    embedder = Embedder()
    process = psutil.Process(os.getpid())

    with tqdm(df.iterrows(), total=len(df), desc="Ingesting movies", unit="movie") as pbar:
        for _, row in pbar:
            plot = row['overview']
            embedding = embedder.embed(plot)
            save_fn(
                title=row['title'],
                plot=plot,
                plot_vector=embedding[0].tolist(),
                release_date=row.get('release_date')
            )
            mem_mb = process.memory_info().rss / 1024 / 1024
            pbar.set_postfix(mem=f"{mem_mb:.1f} MB")

if __name__ == '__main__':
    run_etl()
