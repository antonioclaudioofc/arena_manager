from sqlalchemy.orm import selectinload
from models.auth import Users
from models.reservation import Reservations
from models.schedule import Schedules


class AdminRepository:

    @staticmethod
    def list_all_users(db):
        return db.query(Users).all()

    @staticmethod
    def list_all_reservations(db):
        return (
            db.query(Reservations)
            .options(
                selectinload(Reservations.user),
                selectinload(Reservations.schedule)
                .selectinload(Schedules.court)
            )
            .all()
        )
