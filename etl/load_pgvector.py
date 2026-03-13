from shared.db import get_session
from shared.models import Movie

def save_movie(
        title: str,
        plot: str,
        plot_vector: list[float],
        release_date: str = None,
        db_session=None
    ):
    db = db_session or get_session()
    created_locally = db_session is None

    try:
        movie = Movie(
            title=title,
            plot=plot,
            plot_vector=plot_vector,
            release_date=release_date
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