from pydantic import BaseModel, Field


class AuthCreate(BaseModel):
    email: str
    username: str
    first_name: str
    last_name: str
    password: str
    role: str
