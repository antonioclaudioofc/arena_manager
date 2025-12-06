from fastapi import APIRouter, Depends, Path
from dependencies import db_dependency
from starlette import status
from typing import Annotated
from services.auth_service import AuthService
from schemas.court import CourtCreate
from schemas.auth import UserResponse
from services.admin_service import AdminService

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

user_dependency = Annotated[dict, Depends(AuthService.get_current_user)]


@router.post("/court", status_code=status.HTTP_201_CREATED)
async def create_court(user: user_dependency,
                       db: db_dependency,
                       court_request: CourtCreate):
    await AdminService.create_court(user, db, court_request)


@router.put("/{court_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_court(user: user_dependency,
                       db: db_dependency,
                       court_request: CourtCreate,
                       court_id: int = Path(gt=0)):
    await AdminService.update_court(user, db, court_request, court_id)


@router.delete("/{court_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_court(user: user_dependency,
                       db: db_dependency,
                       court_id: int = Path(gt=0)):
    await AdminService.delete_court(user, db, court_id)


@router.get("/users", status_code=status.HTTP_200_OK, response_model=list[UserResponse])
async def list_users(user: user_dependency,
                     db: db_dependency):
    return await AdminService.get_all_users(user, db)


@router.get("/users/{user_id}", status_code=status.HTTP_200_OK, response_model=UserResponse)
async def get_user_by_id(user: user_dependency,
                         db: db_dependency,
                         user_id: int = Path(gt=0)):
    return await AdminService.get_user_by_id(user, db, user_id)


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_by_id(user: user_dependency,
                            db: db_dependency,
                            user_id: int = Path(gt=0)):
    await AdminService.delete_user_by_id(user, db, user_id)
