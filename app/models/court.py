from db.database import Base
from sqlalchemy import Column, Integer, String


class Court(Base):
    __tablename__ = 'court'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    sport_type = Column(String)
    indoor_or_outdoor = Column(String)
    min_reservation_time = Column(Integer)
    max_reservation_time = Column(Integer)
    created_at = Column(String)
    updated_at = Column(String)
