def validate_create_record(data):
    errors = []
    if not data.get("patient_id"):
        errors.append("patient_id is required")
    if not data.get("doctor_id"):
        errors.append("doctor_id is required")
    if not data.get("diagnosis"):
        errors.append("diagnosis is required")
    return errors

def validate_update_record(data):
    errors = []
    if not data.get("diagnosis") and not data.get("prescription") and not data.get("notes"):
        errors.append("At least one field is required")
    return errors
