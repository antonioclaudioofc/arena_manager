from datetime import datetime, timezone
from typing import Annotated
from services.auth_service import AuthService
from dependencies import db_dependency
from fastapi import Depends, HTTPException, Path
from schemas.court import CourtCreate
from models.court import Courts
from models.auth import Users
from models.reservation import Reservations
from models.schedule import Schedules
from starlette import status


class AdminService:
    user_dependency = Annotated[dict, Depends(AuthService.get_current_user)]

    @staticmethod
    def _ensure_admin(user: dict):
        if user is None or user.get("user_role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication Failed"
            )

    async def create_court(user: user_dependency,
                           db: db_dependency,
                           court_request: CourtCreate):
        AdminService._ensure_admin(user)

        court_model = Courts(**court_request.model_dump(),
                             owner_id=user.get("id"), created_at=datetime.now(timezone.utc))

        db.add(court_model)
        db.commit()

    async def update_court(user: user_dependency,
                           db: db_dependency,
                           court_request: CourtCreate,
                           court_id: int = Path(gt=0)):
        AdminService._ensure_admin(user)

        court_model = db.query(Courts).filter(Courts.id == court_id).first()

        if court_model is None:
            return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Court not found")

        court_model.name = court_request.name
        court_model.sports_type = court_request.sports_type
        court_model.description = court_request.description
        court_model.updated_at = datetime.now(timezone.utc)

        db.add(court_model)
        db.commit()

    async def delete_court(user: user_dependency,
                           db: db_dependency,
                           court_id: int = Path(gt=0)):
        AdminService._ensure_admin(user)

        court_model = db.query(Courts).filter(Courts.id == court_id).first()

        if court_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Court not found")

        db.query(Courts).filter(Courts.id == court_id).delete()
        db.commit()

    async def get_all_users(user: user_dependency,
                            db: db_dependency):
        AdminService._ensure_admin(user)

        return db.query(Users).all()

    async def get_user_by_id(user: user_dependency,
                             db: db_dependency,
                             user_id: int = Path(gt=0)):
        AdminService._ensure_admin(user)

        user_model = db.query(Users).filter(Users.id == user_id).first()

        if user_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        return user_model

    async def delete_user_by_id(user: user_dependency,
                                db: db_dependency,
                                user_id: int = Path(gt=0)):
        AdminService._ensure_admin(user)

        user_model = db.query(Users).filter(Users.id == user_id).first()

        if user_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        db.query(Reservations).filter(
            Reservations.owner_id == user_id).delete()

        db.query(Schedules).filter(Schedules.owner_id == user_id).delete()

        db.query(Courts).filter(Courts.owner_id == user_id).delete()

        db.delete(user_model)
        db.commit()
