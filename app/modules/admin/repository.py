from models.auth import Users
from models.court import Courts
from models.reservation import Reservations
from models.schedule import Schedules


class AdminRepository:

    @staticmethod
    def create_court(model, db):
        db.add(model)
        db.commit()
        db.refresh(model)

        return model

    @staticmethod
    def get_user_by_id(user_id: int, db):
        return db.query(Users).filter(Users.id == user_id).first()

    @staticmethod
    def delete_user(user_id: int, db):
        db.query(Reservations).filter(
            Reservations.owner_id == user_id).delete()
        db.query(Schedules).filter(Schedules.owner_id == user_id).delete()
        db.query(Courts).filter(Courts.owner_id == user_id).delete()
