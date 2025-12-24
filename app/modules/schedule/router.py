from fastapi import APIRouter, Depends, Path
from modules.schedule.service import ScheduleService
from dependencies import db_dependency
from starlette import status
from typing import Annotated
from modules.auth.service import AuthService
from dependencies import db_dependency

router = APIRouter(
    prefix="/schedules",
    tags=["schedules"]
)

user_dependency = Annotated[dict, Depends(AuthService.get_current_user)]


@router.get("/", status_code=status.HTTP_200_OK)
def list_schedules(
    db: db_dependency,
):
    return ScheduleService.list_all(db)


@router.get("/{schedule_id}", status_code=status.HTTP_200_OK)
def get_schedule(
        db: db_dependency,
        schedule_id: int = Path(gt=0)
):
    return ScheduleService.get_by_id(db, schedule_id)
