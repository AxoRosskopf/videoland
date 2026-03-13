from sqlalchemy import Column, Integer, Text, Index
from sqlalchemy.orm import declarative_base
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class Movie(Base):
    __tablename__ = 'movies'
    id = Column(Integer, primary_key=True)
    title = Column(Text, nullable=False)
    plot = Column(Text, nullable=False)
    plot_vector = Column(Vector(768), nullable=False)
    release_date = Column(Text, nullable=True)

    __table_args__ = (
        Index(
            'movies_plot_vector_idx',
            'plot_vector',
            postgresql_using='ivfflat',
            postgresql_with={'lists': 500},
            postgresql_ops={'plot_vector': 'vector_cosine_ops'}
        ),
    )