from fastapi import FastAPI, HTTPException, Path
from db.database import engine, Base
from dependencies import db_dependency
from models.court import Court
from starlette import status
from schemas.court import CourtCreate
from datetime import datetime, timezone


app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.get('/', status_code=status.HTTP_200_OK)
async def read_all_courts(db: db_dependency):
    return db.query(Court).all()


@app.get('/court/{court_id}', status_code=status.HTTP_200_OK)
async def read_court(db: db_dependency, court_id: int = Path(gt=0)):
    court_model = db.query(Court).filter(Court.id == court_id).first()
    if court_model is not None:
        return court_model
    raise HTTPException(status_code=404, detail='Court not found')


@app.post('/court', status_code=status.HTTP_201_CREATED)
async def create_court(db: db_dependency, court_request: CourtCreate):

    court_model = Court(**court_request.model_dump())
    court_model.created_at = datetime.now(timezone.utc)

    db.add(court_model)
    db.commit()


@app.put('/court/{court_id}', status_code=status.HTTP_204_NO_CONTENT)
async def update_court(db: db_dependency, court_request: CourtCreate, court_id: int = Path(gt=0)):
    court_model = db.query(Court).filter(Court.id == court_id).first()
    if court_model is None:
        return HTTPException(status_code=404, detail='Court not found')

    court_model.name = court_request.name
    court_model.sport_type = court_request.sport_type
    court_model.indoor_or_outdoor = court_request.indoor_or_outdoor
    court_model.min_reservation_time = court_request.min_reservation_time
    court_model.max_reservation_time = court_model.max_reservation_time
    court_model.updated_at = datetime.now(timezone.utc)

    db.add(court_model)
    db.commit()


@app.delete('/court/{court_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_court(db: db_dependency, court_id: int = Path(gt=0)):
    court_model = db.query(Court).filter(Court.id == court_id).first()

    if court_model is None:
        return HTTPException(status_code=404, detail='Court not found')

    db.query(Court).filter(Court.id == court_id).delete()
    db.commit()
