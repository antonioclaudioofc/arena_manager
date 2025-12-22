from shared.exceptions import NotFoundException
from modules.court.repository import CourtRepository


class CourtService:

    @staticmethod
    def list_all(db):
        return CourtRepository.get_all(db)

    @staticmethod
    def get_by_id(db, court_id: int):
        court_model = CourtRepository.get_by_id(db, court_id)

        if not court_model:
            raise NotFoundException("Quadra não encontrada")

        return court_model
