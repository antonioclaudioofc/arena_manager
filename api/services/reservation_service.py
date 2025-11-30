from datetime import datetime, timezone
from typing import Annotated
from fastapi import Depends, Path, HTTPException, Query
from services.auth_service import AuthService
from dependencies import db_dependency
from models.reservation import Reservations
from starlette import status


class ReservationService:

    user_dependency = Annotated[dict, Depends(AuthService.get_current_user)]

    async def read_all_reservations(db: db_dependency):
        return db.query(Reservations).all()

    async def read_reservation(db: db_dependency,
                               reservation_id: int = Path(gt=0)):

        reservation_model = db.query(Reservations).filter(
            Reservations.id == reservation_id).first()

        if reservation_model is not None:
            return reservation_model

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")

    async def create_reservation(user: user_dependency,
                                 db: db_dependency,
                                 schedule_id: int = Query(gt=0)):

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Authenticated Failed")

        reservation_model = Reservations(owner_id=user.get(
            "id"), schedule_id=schedule_id, created_at=datetime.now(timezone.utc), status="Ocupado")

        db.add(reservation_model)
        db.commit()

    async def delete_reservation(user: user_dependency,
                                 db: db_dependency,
                                 reservation_id: int = Path(gt=0)):

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Authentication Failed")

        reservation_model = db.query(Reservations).filter(
            Reservations.id == reservation_id,
            Reservations.owner_id == user.get("id")
        ).first()

        if reservation_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")

        db.query(Reservations).filter(
            Reservations.id == reservation_id).delete()
        db.commit()
