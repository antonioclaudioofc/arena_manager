from pydantic import BaseModel, Field


class CourtCreate(BaseModel):
    name: str = Field(min_length=10)
    sport_type: str = Field(min_length=10)
    indoor_or_outdoor: str = Field(min_length=10)
    min_reservation_time: int = Field(gt=0)
    max_reservation_time: int = Field(gt=0)

