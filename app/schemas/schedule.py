from pydantic import BaseModel, ConfigDict
from schemas.court import CourtCreate


class ScheduleCreate(BaseModel):
    date: str
    start_time: str
    end_time: str
    available: bool
    court_id: int


class ScheduleResponse(BaseModel):
    id: int
    date: str
    start_time: str
    end_time: str
    available: bool
    court: CourtCreate
    created_at: str
    updated_at: str | None  

    model_config = ConfigDict(from_attributes=True)
