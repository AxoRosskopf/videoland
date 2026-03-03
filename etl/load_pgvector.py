from shared.db import get_session
from shared.models import Movie

def save_movie(
        tconst: str,
        title: str,
        plot: str,
        release_date: str,
        plot_vector: list[float],
        db_session=None
    ):
    db = db_session or get_session()
    created_locally = db_session is None

    try:
        movie = Movie(
            tconst=tconst,
            title=title,
            plot=plot,
            release_date=release_date,
            plot_vector=plot_vector
        )
        db.add(movie)
        db.commit()
        db.refresh(movie)
        return movie
    except Exception:
        db.rollback()
        raise
    finally:
        if created_locally:
            db.close()