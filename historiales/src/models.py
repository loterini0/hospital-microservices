from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

class MedicalRecord(db.Model):
    __tablename__ = "medical_records"

    id             = db.Column(db.Integer, primary_key=True)
    patient_id     = db.Column(db.Integer, nullable=False)
    doctor_id      = db.Column(db.Integer, nullable=False)
    appointment_id = db.Column(db.Integer, nullable=True)
    diagnosis      = db.Column(db.Text, nullable=False)
    prescription   = db.Column(db.Text)
    notes          = db.Column(db.Text)
    created_at     = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at     = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id":             self.id,
            "patient_id":     self.patient_id,
            "doctor_id":      self.doctor_id,
            "appointment_id": self.appointment_id,
            "diagnosis":      self.diagnosis,
            "prescription":   self.prescription,
            "notes":          self.notes,
            "created_at":     self.created_at.isoformat(),
            "updated_at":     self.updated_at.isoformat(),
        }
