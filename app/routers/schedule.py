from fastapi import APIRouter, Depends, Path, Query
from dependencies import db_dependency
from starlette import status
from services.schedule_service import ScheduleService
from typing import Annotated
from services.auth_service import AuthService
from dependencies import db_dependency
from schemas.schedule import ScheduleCreate

router = APIRouter(
    prefix="/schedule",
    tags=["schedule"]
)

user_dependency = Annotated[dict, Depends(AuthService.get_current_user)]


@router.get("/", status_code=status.HTTP_200_OK)
async def read_all_schedules(
        db: db_dependency):
    return await ScheduleService.read_all_schedules(db)


@router.get("/{schedule_id}", status_code=status.HTTP_200_OK)
async def read_schedule(
        db: db_dependency,
        schedule_id: int = Path(gt=0)):
    return await ScheduleService.read_schedule(db, schedule_id)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_schedule(user:  user_dependency,
                          db: db_dependency,
                          schedule_request: ScheduleCreate,
                          court_id: int = Query(gt=0)):
    await ScheduleService.create_schedule(user, db, schedule_request, court_id)


@router.put("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_schedule(user: user_dependency,
                          db: db_dependency,
                          schedule_request: ScheduleCreate,
                          schedule_id: int = Path(gt=0)):
    await ScheduleService.update_schedule(user, db, schedule_request, schedule_id)


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_schedule(user: user_dependency,
                          db: db_dependency,
                          schedule_id: int = Path(gt=0)):
    await ScheduleService.delete_schedule(user, db, schedule_id)
