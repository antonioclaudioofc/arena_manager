from pydantic import BaseModel, Field


class CourtCreate(BaseModel):
    name: str = Field(min_length=6)
    sports_type: str = Field(min_length=3)
    description: str = Field(min_length=6)
