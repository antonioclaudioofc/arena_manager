from datetime import datetime, timezone
from models.reservation import Reservations
from modules.reservation.repository import ReservationRepository
from shared.exceptions import NotFoundException, UnathorizedException


class ReservationService:

    @staticmethod
    def list_my_reservations(user: dict, db):
        if not user:
            raise UnathorizedException("Usuário não autenticado")

        return ReservationRepository.get_by_user(user["id"], db)

    @staticmethod
    def list_all(db):
        return ReservationRepository.get_all(db)

    @staticmethod
    def get(db, reservation_id: int):
        reservation_model = ReservationRepository.get_by_id(
            db,
            reservation_id
        )

        if not reservation_model:
            raise NotFoundException("Reserva não encontrada")

        return reservation_model

    @staticmethod
    def create(user: dict, db, schedule_id: int):
        if not user:
            raise UnathorizedException("Usuário não autenticado")

        reservation_model = Reservations(
            owner_id=user["id"],
            schedule_id=schedule_id,
            status="Ocupado",
            created_at=datetime.now(timezone.utc)
        )

        return ReservationRepository.create(reservation_model, db)

    @staticmethod
    def delete(user: dict, db, reservation_id: int):
        if not user:
            raise UnathorizedException("Usuário não autenticado")

        reservation_model = ReservationRepository.get_by_owner(
            user["id"],
            db,
            reservation_id
        )

        if not reservation_model:
            raise NotFoundException("Reserva não encontrada")

        ReservationRepository.delete(reservation_model, db)
