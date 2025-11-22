from fastapi import FastAPI
from db.database import engine, Base

app = FastAPI()

Base.metadata.create_all(bind=engine)
