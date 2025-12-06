from db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean


class Schedules(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    start_time = Column(String)
    end_time = Column(String)
    available = Column(Boolean)
    created_at = Column(String)
    updated_at = Column(String)
    court_id = Column(Integer, ForeignKey("courts.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))
