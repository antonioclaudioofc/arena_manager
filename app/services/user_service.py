from datetime import datetime, timezone
from typing import Annotated
from fastapi import Depends, HTTPException
from services.auth_service import AuthService
from dependencies import db_dependency
from starlette import status
from models.auth import Users
from models.reservation import Reservations
from models.schedule import Schedules
from models.court import Courts
from schemas.auth import UserVerification
from core.security import bcrypt_context


class UserService:

    user_dependency = Annotated[dict, Depends(AuthService.get_current_user)]

    async def get_user(user: user_dependency, db: db_dependency):
        if user is None:
            return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authenticated Failed")

        user_model = db.query(Users).filter(Users.id == user.get("id")).first()

        if not user_model:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        return user_model

    async def change_password(user: user_dependency, db: db_dependency, user_verification: UserVerification):
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Authenticated Failed")

        user_model = db.query(Users).filter(Users.id == user.get("id")).first()

        if not bcrypt_context.verify(user_verification.password, user_model.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Error on password change")

        user_model.hashed_password = bcrypt_context.hash(
            user_verification.new_password)
        user_model.updated_at = datetime.now(timezone.utc)

        db.add(user_model)
        db.commit()

    async def get_user_reservations(user: user_dependency, db: db_dependency):
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Authenticated Failed")

        user_id = user.get("id")
        return db.query(Reservations).filter(Reservations.owner_id == user_id).all()

    async def delete_self(user: user_dependency, db: db_dependency):
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Authenticated Failed")

        user_id = user.get("id")
        user_model = db.query(Users).filter(Users.id == user_id).first()

        if user_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        db.query(Reservations).filter(Reservations.owner_id == user_id).delete()

        db.delete(user_model)
        db.commit()
