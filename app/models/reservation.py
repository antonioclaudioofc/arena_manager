from sqlalchemy import Column, Integer, String, ForeignKey
from db.database import Base


class Reservations(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="Disponivel")
    created_at = Column(String)
    updated_at = Column(String)
    schedule_id = Column(Integer, ForeignKey("schedules.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))
