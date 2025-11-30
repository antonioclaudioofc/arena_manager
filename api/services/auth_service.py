from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from models.auth import Users
from schemas.auth import AuthCreate
from core.security import bcrypt_context, hash_password
from datetime import datetime, timezone, timedelta
from jose import jwt, JWTError
from core.config import ALGORITHM, SECRET_KEY
from typing import Annotated
from fastapi import Depends, HTTPException
from starlette import status
from dependencies import db_dependency


class AuthService:
    oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")

    @staticmethod
    def autheticate_user(username: str,
                         password: str,
                         db):

        user = db.query(Users).filter(Users.username == username).first()

        if not user:
            return False
        if not bcrypt_context.verify(password, user.hashed_password):
            return False

        return user

    @staticmethod
    def create_access_token(username: str,
                            user_id: int,
                            role: str,
                            expires_delta: timedelta):

        encode = {"sub": username, "id": user_id, "role": role}
        expires = datetime.now(timezone.utc) + expires_delta
        encode.update({"exp": expires})

        return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

    async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            user_id: int = payload.get("id")
            role: str = payload.get("role")

            if username is None or user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user")

            return {"username": username,
                    "id": user_id,
                    "user_role": role}

        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_201_CREATED, detail="Could not found")

    async def create_user(db: db_dependency,
                          user_request: AuthCreate):

        auth_model = Users(
            email=user_request.email,
            username=user_request.username,
            first_name=user_request.first_name,
            last_name=user_request.last_name,
            hashed_password=hash_password(user_request.password),
            role=user_request.role,
            created_at=datetime.now(timezone.utc)
        )

        db.add(auth_model)
        db.commit()

    async def login_for_access_token(
            form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
            db: db_dependency):

        user = AuthService.autheticate_user(
            form_data.username, form_data.password, db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Coul not validate user")

        token = AuthService.create_access_token(
            user.username, user.id, user.role, timedelta(minutes=20))

        return {"access_token": token,
                "token_type": "bearer"}
