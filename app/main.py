from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine, Base
from routers import auth, court, admin, user, schedule, reservation

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
app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(court.router)
app.include_router(schedule.router)
app.include_router(reservation.router)
