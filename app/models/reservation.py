from sqlalchemy import Column, Integer, String, ForeignKey
from core.database import Base
from sqlalchemy.orm import relationship


class Reservations(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="Disponivel")
    schedule_id = Column(Integer, ForeignKey("schedules.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))

    created_at = Column(String)
    updated_at = Column(String)

    schedule = relationship("Schedules", back_populates="reservations")
    user = relationship("Users", back_populates="reservations")
