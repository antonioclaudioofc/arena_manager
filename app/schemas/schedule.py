from pydantic import BaseModel
from schemas.court import CourtCreate


class ScheduleCreate(BaseModel):
    date: str
    start_time: str
    end_time: str
    available: bool
    court: CourtCreate

    model_config = {"from_attributes": True}