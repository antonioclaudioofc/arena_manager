from pydantic import BaseModel, Field, ConfigDict


class AuthCreate(BaseModel):
    email: str
    username: str
    first_name: str
    last_name: str
    password: str
    role: str


class UserVerification(BaseModel):
    password: str
    new_password: str = Field(min_length=6)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    username: str
    first_name: str
    last_name: str
    role: str
    created_at: str | None = None
    updated_at: str | None = None
