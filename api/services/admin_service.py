from datetime import datetime, timezone
from typing import Annotated
from services.auth_service import AuthService
from dependencies import db_dependency
from fastapi import Depends, HTTPException, Path
from schemas.court import CourtCreate
from models.court import Courts
from starlette import status


class AdminService:
    user_dependency = Annotated[dict, Depends(AuthService.get_current_user)]

    async def create_court(user: user_dependency,
                           db: db_dependency,
                           court_request: CourtCreate):

        if user is None or user.get("user_role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")

        court_model = Courts(**court_request.model_dump(),
                             owner_id=user.get("id"), created_at=datetime.now(timezone.utc))

        db.add(court_model)
        db.commit()

    async def update_court(user: user_dependency,
                           db: db_dependency,
                           court_request: CourtCreate,
                           court_id: int = Path(gt=0)):

        if user is None or user.get("user_role") != "admin":
            raise HTTPException(status.HTTP_401_UNAUTHORIZED,
                                detail="Authentication Failed")

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

        if user is None or user.get("user_role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")

        court_model = db.query(Courts).filter(Courts.id == court_id).first()

        if court_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Court not found")

        db.query(Courts).filter(Courts.id == court_id).delete()
        db.commit()
