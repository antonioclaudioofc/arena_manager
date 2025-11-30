from fastapi import APIRouter, Depends
from dependencies import db_dependency
from typing import Annotated
from services.auth_service import AuthService
from starlette import status
from schemas.auth import UserVerification
from services.user_service import UserService


router = APIRouter(
    prefix="/user",
    tags=["user"]
)

user_dependency = Annotated[dict, Depends(AuthService.get_current_user)]


@router.get("/", status_code=status.HTTP_200_OK)
async def get_user(user: user_dependency,
                   db: db_dependency):
    return await UserService.get_user(user, db)


@router.put("/password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(user: user_dependency,
                          db: db_dependency,
                          user_verification: UserVerification):
    await UserService.change_password(user, db, user_verification)
