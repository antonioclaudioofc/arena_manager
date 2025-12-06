from pydantic import BaseModel


class ScheduleCreate(BaseModel):
    date: str
    start_time: str
    end_time: str
    available: bool
