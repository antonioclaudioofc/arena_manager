from models.court import Courts


class CourtRepository:

    @staticmethod
    def create(court_request, db):
        db.add(court_request)
        db.commit()
        db.refresh(court_request)
        
        return court_request

    @staticmethod
    def get_all(db):
        return db.query(Courts).all()

    @staticmethod
    def get_by_id(db, court_id):
        return db.query(Courts).filter(Courts.id == court_id).first()

    @staticmethod
    def delete(court_model, db):
        db.delete(court_model)
        db.commit()
