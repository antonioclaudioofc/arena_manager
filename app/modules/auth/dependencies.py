from typing import Annotated
from modules.auth.service import AuthService
from secutiry import oauth2_bearer
from fastapi import Depends


def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    return AuthService.get_current_user(token)
