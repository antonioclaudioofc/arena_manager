from fastapi import FastAPI
from db.database import engine, Base
from routers import auth, court, admin, user, schedule

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user.router)
app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(court.router)
app.include_router(schedule.router)
