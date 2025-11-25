from fastapi import APIRouter, Depends
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from dependencies import db_dependency
from schemas.auth import AuthCreate
from schemas.token import Token
from starlette import status
from services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency,
                      user_request: AuthCreate):
    await AuthService.create_user(db, user_request)


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                                 db: db_dependency):
    return await AuthService.login_for_access_token(form_data, db)
