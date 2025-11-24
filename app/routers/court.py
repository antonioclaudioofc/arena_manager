from fastapi import APIRouter, HTTPException, Path, Depends
from db.database import engine, Base
from dependencies import db_dependency
from models.court import Courts
from starlette import status
from schemas.court import CourtCreate
from datetime import datetime, timezone
from typing import Annotated
from routers.auth import get_current_user


router = APIRouter()

user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/", status_code=status.HTTP_200_OK)
async def read_all_courts(db: db_dependency):
    return db.query(Courts).all()


@router.get("/court/{court_id}", status_code=status.HTTP_200_OK)
async def read_court(db: db_dependency, court_id: int = Path(gt=0)):
    court_model = db.query(Courts).filter(Courts.id == court_id).first()
    if court_model is not None:
        return court_model
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Court not found")
