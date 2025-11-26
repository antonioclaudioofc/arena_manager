from fastapi import APIRouter, Path
from dependencies import db_dependency
from starlette import status
from services.court_service import CourtService


router = APIRouter()


@router.get("/", status_code=status.HTTP_200_OK)
async def read_all_courts(db: db_dependency):
    return await CourtService.read_all_courts(db)


@router.get("/court/{court_id}", status_code=status.HTTP_200_OK)
async def read_court(db: db_dependency,
                     court_id: int = Path(gt=0)):
    return await CourtService.read_court(db, court_id)
