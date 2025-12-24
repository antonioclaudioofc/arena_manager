from models.reservation import Reservations


class ReservationRepository:

    @staticmethod
    def get_all(db):
        return db.query(Reservations).all()

    @staticmethod
    def get_by_id(db, reservation_id: int):
        return db.query(Reservations).filter(Reservations.id == reservation_id).first()

    @staticmethod
    def get_by_owner(owner_id: id, db, reservation_id: int):
        return db.query(Reservations).filter(Reservations.id == reservation_id, Reservations.owner_id == owner_id).first()

    @staticmethod
    def create(reservation_request, db):
        db.add(reservation_request)
        db.commit()
        db.refresh(reservation_request)

        return reservation_request

    @staticmethod
    def delete(reservation_request, db):
        db.delete(reservation_request)
        db.commit()
