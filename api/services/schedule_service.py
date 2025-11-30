from datetime import datetime, timezone
from typing import Annotated
from fastapi import Depends, HTTPException, Path
from services.auth_service import AuthService
from dependencies import db_dependency
from schemas.schedule import ScheduleCreate
from starlette import status
from models.schedule import Schedules


class ScheduleService:
    user_dependency = Annotated[dict, Depends(AuthService.get_current_user)]

    async def read_all_schedules(user: user_dependency,
                                 db: db_dependency):

        if user is None or user.get("user_role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")

        return db.query(Schedules).all()

    async def read_schedule(user: user_dependency,
                            db: db_dependency,
                            schedule_id: int = Path(gt=0)):

        if user is None or user.get("user_role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")

        schedule_model = db.query(Schedules).filter(
            Schedules.id == schedule_id).first()

        if schedule_model is not None:
            return schedule_model

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedules not found")

    async def create_schedule(user: user_dependency,
                              db: db_dependency,
                              schedule_request: ScheduleCreate,
                              court_id: int = Path(gt=0)
                              ):

        if user is None or user.get("user_role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")

        schedule_model = Schedules(
            **schedule_request.model_dump(), owner_id=user.get("id"), court_id=court_id, created_at=datetime.now(timezone.utc))

        db.add(schedule_model)
        db.commit()

    async def update_schedule(user: user_dependency,
                              db: db_dependency,
                              schedule_request: ScheduleCreate,
                              schedule_id: int = Path(gt=0)):

        if user is None or user.get("user_role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")

        schedule_model = db.query(Schedules).filter(
            Schedules.id == schedule_id).first()

        if schedule_model is None:
            return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found")

        schedule_model.date = schedule_request.date
        schedule_model.start_time = schedule_request.start_time
        schedule_model.end_time = schedule_request.end_time
        schedule_model.available = schedule_request.available
        schedule_model.updated_at = datetime.now(timezone.utc)

        db.add(schedule_model)
        db.commit()

    async def delete_schedule(user: user_dependency,
                              db: db_dependency,
                              schedule_id: int = Path(gt=0)):

        if user is None or user.get("user_role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")

        schedule_model = db.query(Schedules).filter(
            Schedules.id == schedule_id).first()

        if schedule_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found")

        db.query(Schedules).filter(Schedules.id == schedule_id).delete()
        db.commit()
