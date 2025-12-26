from fastapi import APIRouter, Path
from schemas.court import CourtResponse
from dependencies import db_dependency
from starlette import status
from modules.court.service import CourtService


router = APIRouter(
    prefix="/courts",
    tags=["courts"]
)


@router.get("/", status_code=status.HTTP_200_OK, response_model=list[CourtResponse])
def list_courts(db: db_dependency):
    return CourtService.list_all(db)


@router.get("/{court_id}", status_code=status.HTTP_200_OK, response_model=CourtResponse)
def get_court(
    db: db_dependency,
    court_id: int = Path(gt=0)
):
    return CourtService.get_by_id(db, court_id)
