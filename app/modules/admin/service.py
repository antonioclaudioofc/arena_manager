from datetime import datetime, timezone
from models.court import Courts
from modules.admin.exceptions import AdminOnlyException
from modules.admin.repository import AdminRepository
from shared.exceptions import NotFoundException


class AdminService:

    @staticmethod
    def _ensure_admin(user: dict):
        if not user or user.get("user_role") != "admin":
            raise AdminOnlyException()

    @staticmethod
    def create_court(user: dict, db, court_request):
        AdminService._ensure_admin(user)

        court_model = Courts(**court_request.model_dump(),
                             owner_id=user["id"],
                             created_at=datetime.now(datetime.timezone.utc))

        return AdminRepository.create(db, court_model)

    @staticmethod
    def delete_user(user: dict, db, user_id: int):
        AdminService._ensure_admin(user)

        user_model = AdminRepository.get_user_by_id(db, user_id)
        if not user_model:
            raise NotFoundException("Usuário não encontrado!")

        AdminRepository.delete_user(db, user_id)
