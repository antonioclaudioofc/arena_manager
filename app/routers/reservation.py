from fastapi import APIRouter, Depends, Query, Path
from dependencies import db_dependency
from typing import Annotated
from starlette import status
from services.auth_service import AuthService
from services.reservation_service import ReservationService

router = APIRouter(
    prefix="/reservation",
    tags=["reservation"]
)

user_dependency = Annotated[dict, Depends(AuthService.get_current_user)]


@router.get("/", status_code=status.HTTP_200_OK)
async def read_all_reservations(db: db_dependency):
    return await ReservationService.read_all_reservations(db)


@router.get("/{reservation_id}", status_code=status.HTTP_200_OK)
async def read_reservation(db: db_dependency):
    return await ReservationService.read_reservation(db)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_reservation(user: user_dependency,
                             db: db_dependency,
                             schedule_id: int = Query(gt=0)):
    await ReservationService.create_reservation(user, db, schedule_id)


@router.delete("/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reservation(user: user_dependency,
                             db: db_dependency,
                             reservation_id: int = Path(gt=0)):
    await ReservationService.delete_reservation(user, db, reservation_id)
