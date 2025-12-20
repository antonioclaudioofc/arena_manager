from shared.exceptions import ForbiddenException


class AdminOnlyException(ForbiddenException):
    def __init__(self):
        super().__init__("Acesso restrito para administradores")
