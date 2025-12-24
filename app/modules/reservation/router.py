from fastapi import APIRouter, Depends, Query, Path
from modules.auth.service import AuthService
from modules.reservation.service import ReservationService
from dependencies import db_dependency
from typing import Annotated
from starlette import status

router = APIRouter(
    prefix="/reservations",
    tags=["reservations"]
)

user_dependency = Annotated[dict, Depends(AuthService.get_current_user)]


@router.get("/", status_code=status.HTTP_200_OK)
def list_reservations(
    db: db_dependency
):
    return ReservationService.list_all(db)


@router.get("/{reservation_id}", status_code=status.HTTP_200_OK)
def get_reservation(
    db: db_dependency,
    reservation_id: int = Path(gt=0)
):
    return ReservationService.get(db, reservation_id)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_reservation(
    user: user_dependency,
    db: db_dependency,
    schedule_id: int = Query(gt=0)
):
    ReservationService.create(user, db, schedule_id)


@router.delete("/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reservation(
    user: user_dependency,
    db: db_dependency,
    reservation_id: int = Path(gt=0)
):
    ReservationService.delete(user, db, reservation_id)
