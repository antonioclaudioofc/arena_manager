from pydantic import BaseModel, ConfigDict


class CourtCreate(BaseModel):
    name: str
    sports_type: str
    description: str


class CourtResponse(BaseModel):
    id: int
    name: str
    sports_type: str
    description: str
    created_at: str
    updated_at: str | None

    model_config = ConfigDict(from_attributes=True)
