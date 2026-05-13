from locust import HttpUser, task, between
from datetime import datetime, timedelta
import random

class HospitalUser(HttpUser):
    wait_time = between(1, 3)
    token = None

    def on_start(self):
        response = self.client.post("/api/auth/login", json={
            "email": "admin@hospital.com",
            "password": "password123"
        }, headers={"Accept": "application/json"})
        self.token = response.json().get("access_token")

    def auth_headers(self):
        return {
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/json"
        }

    def random_future_date(self):
        days = random.randint(1, 365)
        dt = datetime.now() + timedelta(days=days)
        return dt.strftime("%Y-%m-%d"), f"{random.randint(8,17):02d}:{random.choice(['00','30'])}:00"

    @task(3)
    def get_users(self):
        self.client.get("/api/users/", headers=self.auth_headers())

    @task(3)
    def get_appointments(self):
        self.client.get("/api/appointments/", headers=self.auth_headers())

    @task(3)
    def get_records(self):
        self.client.get("/api/records/", headers=self.auth_headers())

    @task(3)
    def get_notifications(self):
        self.client.get("/api/notifications/", headers=self.auth_headers())

    @task(1)
    def create_appointment(self):
        date, time = self.random_future_date()
        self.client.post("/api/appointments/", headers=self.auth_headers(), json={
            "patient_id": random.randint(1, 3),
            "doctor_id": random.randint(1, 3),
            "date": date,
            "time": time,
            "reason": "Consulta de prueba",
            "status": "scheduled"
        })

    @task(1)
    def create_notification(self):
        self.client.post("/api/notifications/", headers=self.auth_headers(), json={
            "user_id": 1,
            "type": "appointment",
            "message": "Prueba de carga"
        })

    @task(2)
    def get_medications(self):
        self.client.get("/api/medications/", headers=self.auth_headers())

    @task(1)
    def create_medication(self):
        self.client.post("/api/medications/", headers=self.auth_headers(), json={
            "name": f"Medicamento {random.randint(1,9999)}",
            "unit": "mg",
            "stock": random.randint(10, 100),
            "price": random.randint(1000, 50000)
        })

    @task(2)
    def get_user_by_id(self):
        self.client.get("/api/users/1", headers=self.auth_headers())

    @task(1)
    def get_appointment_by_patient(self):
        self.client.get("/api/appointments/patient/1", headers=self.auth_headers())
