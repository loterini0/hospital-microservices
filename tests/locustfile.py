from locust import HttpUser, task, between

class HospitalUser(HttpUser):
    wait_time = between(1, 3)
    token = None

    def on_start(self):
        response = self.client.post("/api/auth/login", json={
            "email": "admin@hospital.com",
            "password": "password123"
        })
        self.token = response.json().get("access_token")

    def auth_headers(self):
        return {"Authorization": f"Bearer {self.token}"}

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
        self.client.post("/api/appointments/", headers=self.auth_headers(), json={
            "patient_id": 1,
            "doctor_id": 2,
            "date": "2026-04-10",
            "time": "10:00:00",
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