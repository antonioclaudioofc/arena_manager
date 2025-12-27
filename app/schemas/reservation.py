from pydantic import BaseModel, ConfigDict
from schemas.auth import UserResponse
from schemas.schedule import ScheduleResponse


class ReservationCreate(BaseModel):
    status: str
    schedule_id: int
    owner_id: int

    created_at: str
    updated_at: str | None


class ReservationResponse(BaseModel):
    id: int
    status: str
    schedule: ScheduleResponse
    created_at: str
    updated_at: str | None

    model_config = ConfigDict(from_attributes=True)


class ReservationResponseAdmin(BaseModel):
    id: int
    status: str
    schedule: ScheduleResponse
    user: UserResponse
    created_at: str
    updated_at: str | None

    model_config = ConfigDict(from_attributes=True)
