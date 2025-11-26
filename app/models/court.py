from db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey


class Courts(Base):
    __tablename__ = "courts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    sports_type = Column(String)
    description = Column(String)
    created_at = Column(String)
    updated_at = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
