from datetime import datetime, timezone

from fastapi import Depends
from modules.schedule.repository import ScheduleRepository
from models.schedule import Schedules
from modules.user.respository import UserRepository
from modules.auth.dependencies import get_current_user
from modules.court.repository import CourtRepository
from models.court import Courts
from modules.admin.exceptions import AdminOnlyException
from shared.exceptions import NotFoundException


class AdminService:

    @staticmethod
    def _ensure_admin(user: dict = Depends(get_current_user)):
        if not user or user.get("user_role") != "admin":
            raise AdminOnlyException()

    @staticmethod
    def create_court(user: dict, court_request, db):
        AdminService._ensure_admin(user)

        court_model = Courts(
            **court_request.model_dump(),
            owner_id=user["id"],
            created_at=datetime.now(timezone.utc)
        )

        return CourtRepository.create(court_model, db)

    @staticmethod
    def delete_court(user: dict, db, court_id: int):
        AdminService._ensure_admin(user)

        court_model = CourtRepository.get_by_id(db, court_id)
        if not court_model:
            raise NotFoundException("Quadra não encontrada")

        CourtRepository.delete(court_model, db)

    @staticmethod
    def delete_user(user: dict, db, user_id: int):
        AdminService._ensure_admin(user)

        user_model = UserRepository.get_by_id(user_id, db)
        if not user_model:
            raise NotFoundException("Usuário não encontrado!")

        UserRepository.delete(user_model, db)

    @staticmethod
    def create_schedule(user: dict, schedule_request, db):
        AdminService._ensure_admin(user)

        schedule_model = Schedules(
            **schedule_request.model_dump(),
            owner_id=user["id"],
            created_at=datetime.now(timezone.utc)
        )

        return ScheduleRepository.create(schedule_model, db)

    @staticmethod
    def delete_schedule(user: dict, db, schedule_id: int):
        AdminService._ensure_admin(user)

        schedule_model = ScheduleRepository.get_by_id(db, schedule_id)
        if not schedule_model:
            raise NotFoundException("Horário não encontrado")

        ScheduleRepository.delete(schedule_model, db)
