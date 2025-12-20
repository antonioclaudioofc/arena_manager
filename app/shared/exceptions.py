from fastapi import HTTPException, status


class UnathorizedException(HTTPException):
    def __init__(self, detail="Unathorized"):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)


class ForbiddenException(HTTPException):
    def __init__(self, detail="Forbidden"):
        super.__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class NotFoundException(HTTPException):
    def __init__(self, detail="Resource not found"):
        super.__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class BadRequestException(HTTPException):
    def __init__(self, detail="Bad request"):
        super.__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
