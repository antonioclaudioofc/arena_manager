from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
from modules.auth.repository import AuthRepository
from modules.auth.secutiry import create_access_token, decode_token
from shared.exceptions import UnathorizedException
from models.auth import Users
from core.security import bcrypt_context, hash_password
from datetime import datetime, timedelta, timezone
from .secutiry import oauth2_bearer


class AuthService:

    @staticmethod
    def authenticate(username: str, password: str, db):

        user = AuthRepository.get_by_username(username, db)

        if not user or not bcrypt_context.verify(password, user.hashed_password):
            raise UnathorizedException("Credenciais inválidas!")

        return user

    @staticmethod
    def login(form_data: OAuth2PasswordRequestForm, db):
        user = AuthService.authenticate(
            form_data.username,
            form_data.password,
            db
        )

        token = create_access_token(
            data={
                "sub": user.username,
                "id": user.id,
                "role": user.role
            },
            expires_delta=timedelta(minutes=20)
        )

        return {"access_token": token, "token_type": "bearer"}

    @staticmethod
    def register(data, db):
        user_model = Users(
            **data.model_dump(exclude={"password"}),
            hashed_password=hash_password(data.password),
            created_at=datetime.now(timezone.utc)
        )

        return AuthRepository.create(user_model, db)

    @staticmethod
    def get_current_user(token: str = Depends(oauth2_bearer)):
        try:
            payload = decode_token(token)
            return {
                "id": payload["id"],
                "username": payload["sub"],
                "user_role": payload["role"]
            }
        except JWTError:
            raise UnathorizedException("Token inválido!")
