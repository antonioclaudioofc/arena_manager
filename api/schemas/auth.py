from pydantic import BaseModel, Field


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