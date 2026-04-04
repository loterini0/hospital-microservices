from flask import Blueprint, request, jsonify
from src.models import db, MedicalRecord
from src.validators import validate_create_record, validate_update_record
import requests
import os

records_bp = Blueprint("records", __name__)

def update_medication_stock(medication_id, quantity):
    try:
        requests.patch(
            f"http://localhost:3003/api/medications/{medication_id}/stock",
            json={"quantity": quantity},
            headers={"X-Gateway-Secret": os.getenv("GATEWAY_SECRET")},
            timeout=3
        )
    except Exception:
        pass

@records_bp.route("/", methods=["GET"])
def get_records():
    records = MedicalRecord.query.all()
    return jsonify([r.to_dict() for r in records])

@records_bp.route("/<int:record_id>", methods=["GET"])
def get_record(record_id):
    record = MedicalRecord.query.get(record_id)
    if not record:
        return jsonify({"message": "Record not found"}), 404
    return jsonify(record.to_dict())

@records_bp.route("/patient/<int:patient_id>", methods=["GET"])
def get_records_by_patient(patient_id):
    records = MedicalRecord.query.filter_by(patient_id=patient_id).all()
    return jsonify([r.to_dict() for r in records])

@records_bp.route("/", methods=["POST"])
def create_record():
    data = request.get_json()
    errors = validate_create_record(data)
    if errors:
        return jsonify({"errors": errors}), 400

    record = MedicalRecord(
        patient_id     = data["patient_id"],
        doctor_id      = data["doctor_id"],
        appointment_id = data.get("appointment_id"),
        diagnosis      = data["diagnosis"],
        prescription   = data.get("prescription"),
        notes          = data.get("notes"),
    )
    db.session.add(record)
    db.session.commit()

    if data.get("medication_id") and data.get("medication_quantity"):
        update_medication_stock(
            data["medication_id"],
            -abs(data["medication_quantity"])
        )

    return jsonify(record.to_dict()), 201

@records_bp.route("/<int:record_id>", methods=["PUT"])
def update_record(record_id):
    record = MedicalRecord.query.get(record_id)
    if not record:
        return jsonify({"message": "Record not found"}), 404

    data = request.get_json()
    errors = validate_update_record(data)
    if errors:
        return jsonify({"errors": errors}), 400

    if data.get("diagnosis"):
        record.diagnosis = data["diagnosis"]
    if data.get("prescription"):
        record.prescription = data["prescription"]
    if data.get("notes"):
        record.notes = data["notes"]
    if data.get("appointment_id"):
        record.appointment_id = data["appointment_id"]

    db.session.commit()
    return jsonify(record.to_dict())

@records_bp.route("/<int:record_id>", methods=["DELETE"])
def delete_record(record_id):
    record = MedicalRecord.query.get(record_id)
    if not record:
        return jsonify({"message": "Record not found"}), 404
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Record deleted successfully"})
