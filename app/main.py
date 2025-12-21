from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.modules.admin import router
from app.modules.auth import router
from app.modules.court import court
from app.modules.reservation import reservation
from app.modules.user import user
from app.modules.schedule import schedule

app = FastAPI()

oringins = ["*"]

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=oringins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(router.router)
app.include_router(router.router)
app.include_router(court.router)
app.include_router(schedule.router)
app.include_router(reservation.router)
