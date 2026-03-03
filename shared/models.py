from sqlalchemy import Column, Integer, Text
from sqlalchemy.orm import declarative_base
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class Movie(Base):
    __tablename__ = 'movies'
    id = Column(Integer, primary_key=True)
    tconst = Column(Text, unique=True, nullable=False)
    title = Column(Text, nullable=False)
    plot = Column(Text, nullable=False)
    release_date = Column(Integer, nullable=False)
    plot_vector = Column(Vector(768), nullable=False)