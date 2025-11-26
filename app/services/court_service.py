from dependencies import db_dependency
from models.court import Courts
from fastapi import Path, HTTPException
from starlette import status


class CourtService:

    async def read_all_courts(db: db_dependency):
        return db.query(Courts).all()

    async def read_court(db: db_dependency, 
                         court_id: int = Path(gt=0)):
        
        court_model = db.query(Courts).filter(Courts.id == court_id).first()

        if court_model is not None:
            return court_model

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Court not found")
