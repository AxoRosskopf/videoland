import pandas as pd
from etl.load_pgvector import save_movie
from shared.embedder import Embedder

def run_etl(path_csv: str = 'data/movies.csv', save_fn=save_movie):
    df = pd.read_csv(path_csv)
    if df.empty:
        print(f"[WARNING] The CSV '{path_csv}' is empty. No movies to process.")
        return 
    embedder = Embedder()
    for _, row in df.iterrows():
        plot = row['overview']
        embedding = embedder.embed(plot)
        save_fn(
            tconst=row['tconst'],
            title=row['title'],
            plot=plot,
            release_date=row['release_date'],
            plot_vector=embedding[0].tolist()
        )

if __name__ == '__main__':
    run_etl()