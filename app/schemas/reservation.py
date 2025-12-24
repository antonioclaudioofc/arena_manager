from pydantic import BaseModel, ConfigDict
from schemas.schedule import ScheduleCreate


class ReservationCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    schedule_id: int
    owner_id: int
    created_at: str | None = None
    updated_at: str | None = None
    schedule: ScheduleCreate

    model_config = {"from_attributes": True}
