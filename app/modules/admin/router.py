from fastapi import APIRouter, Depends, Path
from dependencies import db_dependency
from starlette import status
from typing import Annotated
from app.modules.auth.service import AuthService
from schemas.court import CourtCreate
from schemas.auth import UserResponse
from app.modules.admin.service import AdminService

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

user_dependency = Annotated[dict, Depends(AuthService.get_current_user)]


@router.post(
    "/courts",
    status_code=status.HTTP_201_CREATED
)
async def create_court(
    user: user_dependency,
    court_request: CourtCreate,  db: db_dependency
):
    await AdminService.create_court(user, court_request, db)


@router.delete("users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user: user_dependency,
    db: db_dependency,
    user_id: int = Path(gt=0)
):
    await AdminService.delete_user(user, user_id, db)
