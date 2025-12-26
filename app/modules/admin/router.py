from fastapi import APIRouter, Depends, Path, Query
from schemas.schedule import ScheduleCreate
from dependencies import db_dependency
from starlette import status
from typing import Annotated
from modules.auth.service import AuthService
from schemas.court import CourtCreate
from modules.admin.service import AdminService

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

user_dependency = Annotated[dict, Depends(AuthService.get_current_user)]


@router.post("/courts", status_code=status.HTTP_201_CREATED)
def create_court(
    user: user_dependency,
    court_request: CourtCreate,
    db: db_dependency
):
    AdminService.create_court(user, court_request, db)


@router.post("/schedules", status_code=status.HTTP_201_CREATED)
def create_schedule(
        user: user_dependency,
        schedule_request: ScheduleCreate,
        db: db_dependency
):
    AdminService.create_schedule(user, schedule_request, db)


@router.delete("/courts/{court_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_court(
    user: user_dependency,
    db: db_dependency,
    court_id: int = Path(gt=0)
):
    AdminService.delete_court(user, db, court_id)


@router.delete("/schedules/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(user: user_dependency, db: db_dependency, schedule_id: int = Path(gt=0)):
    AdminService.delete_schedule(user, db, schedule_id)


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user: user_dependency,
    db: db_dependency,
    user_id: int = Path(gt=0)
):
    AdminService.delete_user(user, db, user_id)
