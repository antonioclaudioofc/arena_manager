from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Path
from schemas.court import CourtCreate
from dependencies import db_dependency
from starlette import status
from typing import Annotated
from routers.auth import get_current_user
from models.court import Courts
from schemas.court import CourtCreate

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

user_dependency = Annotated[dict, Depends(get_current_user)]


@router.post("/court", status_code=status.HTTP_201_CREATED)
async def create_user(user: user_dependency, db: db_dependency, court_request: CourtCreate):
    if user is None or user.get("user_role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    court_model = Courts(**court_request.model_dump(),
                         owner_id=user.get("id"), created_at=datetime.now(timezone.utc))

    db.add(court_model)
    db.commit()


@router.put("/{court_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_court(user: user_dependency, db: db_dependency, court_request: CourtCreate, court_id: int = Path(gt=0)):
    if user is None or user.get("user_role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    court_model = db.query(Courts).filter(Courts.id == court_id).first()

    if court_model is None:
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Court not Found")

    court_model.name = court_request.name
    court_model.sports_type = court_request.sports_type
    court_model.description = court_request.description
    court_model.updated_at = datetime.now(timezone.utc)

    db.add(court_model)
    db.commit()


@router.delete("/{court_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_court(user: user_dependency, db: db_dependency, court_id: int = Path(gt=0)):
    if user is None or user.get("user_role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")

    court_model = db.query(Courts).filter(Courts.id == court_id).first()

    if court_model is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Court not found")
    
    db.query(Courts).filter(Courts.id == court_id).delete()
    db.commit()
