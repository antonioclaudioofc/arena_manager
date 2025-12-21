from models.auth import Users


class AuthRepository:

    @staticmethod
    def get_by_username(username: str, db):
        return db.query(Users).filter(Users.username == username).first()

    @staticmethod
    def create(user: Users, db):
        db.add(user)
        db.commit()
        db.refresh(user)

        return user
