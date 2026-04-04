# Documentación de Endpoints - MediSystem

## Base URL
Todas las peticiones deben realizarse a través del API Gateway:
`http://localhost:8000/api`

## Autenticación
Los endpoints protegidos requieren el header:
`Authorization: Bearer {token}`

---

## API Gateway - Autenticación

### POST /auth/register
Registrar un nuevo usuario.

**Body:**
```json
{
    "name": "Juan Pérez",
    "email": "juan@hospital.com",
    "password": "password123",
    "role": "patient",
    "question": "¿Nombre de su mascota?",
    "answer": "Firulais"
}
```
**Respuesta 201:**
```json
{
    "user": { "id": 1, "name": "Juan Pérez", "email": "juan@hospital.com", "role": "patient" },
    "access_token": "token",
    "token_type": "Bearer"
}
```

---

### POST /auth/login
Iniciar sesión.

**Body:**
```json
{
    "email": "juan@hospital.com",
    "password": "password123"
}
```
**Respuesta 200:**
```json
{
    "access_token": "token",
    "token_type": "Bearer"
}
```

---

### POST /auth/logout
Cerrar sesión. Requiere token.

**Respuesta 200:**
```json
{ "message": "Logged out from all devices" }
```

---

### POST /auth/reset-password
Recuperar contraseña mediante pregunta de seguridad.

**Body:**
```json
{
    "email": "juan@hospital.com",
    "answer": "Firulais",
    "new_password": "newpassword123"
}
```
**Respuesta 200:**
```json
{ "message": "Password reset successfully" }
```

---

## Microservicio Usuarios (Express :3001)
Requiere token. Solo accesible para rol **admin**.

### GET /users
Listar todos los usuarios.

**Respuesta 200:**
```json
[
    { "id": 1, "name": "Juan Pérez", "email": "juan@hospital.com", "phone": "3001234567", "role": "patient" }
]
```

---

### GET /users/:id
Obtener un usuario por ID.

**Respuesta 200:**
```json
{ "id": 1, "name": "Juan Pérez", "email": "juan@hospital.com", "phone": "3001234567", "role": "patient" }
```
**Respuesta 404:**
```json
{ "message": "User not found" }
```

---

### POST /users
Crear un nuevo usuario.

**Body:**
```json
{
    "name": "Juan Pérez",
    "email": "juan@hospital.com",
    "phone": "3001234567",
    "role": "patient"
}
```
**Respuesta 201:**
```json
{ "id": 1, "name": "Juan Pérez", "email": "juan@hospital.com", "phone": "3001234567", "role": "patient" }
```

---

### PUT /users/:id
Actualizar un usuario.

**Body:**
```json
{
    "name": "Juan Pérez Actualizado",
    "phone": "3009876543"
}
```
**Respuesta 200:**
```json
{ "message": "User updated successfully" }
```

---

### DELETE /users/:id
Eliminar un usuario.

**Respuesta 200:**
```json
{ "message": "User deleted successfully" }
```

---

## Microservicio Citas (Django :8001)
Requiere token. **Patient y Admin** crean citas, todos pueden ver.

### GET /appointments
Listar todas las citas.

**Respuesta 200:**
```json
[
    { "id": 1, "patient_id": 1, "doctor_id": 2, "date": "2026-04-10", "time": "10:00:00", "reason": "Consulta general", "status": "scheduled" }
]
```

---

### GET /appointments/:id
Obtener una cita por ID.

**Respuesta 404:**
```json
{ "message": "Appointment not found" }
```

---

### GET /appointments/patient/:patient_id
Obtener citas de un paciente.

---

### POST /appointments
Crear una nueva cita.

**Body:**
```json
{
    "patient_id": 1,
    "doctor_id": 2,
    "date": "2026-04-10",
    "time": "10:00:00",
    "reason": "Consulta general",
    "status": "scheduled"
}
```
**Respuesta 201:**
```json
{ "id": 1, "patient_id": 1, "doctor_id": 2, "date": "2026-04-10", "time": "10:00:00", "reason": "Consulta general", "status": "scheduled" }
```

---

### PUT /appointments/:id
Actualizar una cita.

---

### DELETE /appointments/:id
Eliminar una cita.

**Respuesta 204:**
```json
{ "message": "Appointment deleted successfully" }
```

---

## Microservicio Historiales (Flask :8002)
Requiere token. Solo accesible para roles **doctor y admin**.

### GET /records
Listar todos los historiales.

### GET /records/:id
Obtener un historial por ID.

### GET /records/patient/:patient_id
Obtener historiales de un paciente.

### POST /records
Crear un historial clínico.

**Body:**
```json
{
    "patient_id": 1,
    "doctor_id": 2,
    "diagnosis": "Hipertensión arterial",
    "prescription": "Losartán 50mg cada 24 horas",
    "notes": "Paciente con presión alta"
}
```
**Respuesta 201:**
```json
{ "id": 1, "patient_id": 1, "doctor_id": 2, "diagnosis": "Hipertensión arterial", "prescription": "Losartán 50mg", "notes": "..." }
```

### PUT /records/:id
Actualizar un historial.

### DELETE /records/:id
Eliminar un historial.

---

## Microservicio Notificaciones (Express :3002)
Requiere token. Todos ven, solo **admin** crea y elimina.

### GET /notifications
Listar todas las notificaciones.

### GET /notifications/user/:user_id
Obtener notificaciones de un usuario.

### POST /notifications
Crear una notificación.

**Body:**
```json
{
    "user_id": 1,
    "type": "appointment",
    "message": "Recordatorio: cita médica mañana a las 10:00am"
}
```
**Tipos válidos:** `appointment`, `reminder`, `alert`

### PUT /notifications/:id/read
Marcar notificación como leída.

### DELETE /notifications/:id
Eliminar una notificación.

---

## Microservicio Medicamentos (Express :3003)
Requiere token. Todos ven, **admin** crea/edita/elimina, **doctor y admin** actualizan stock.

### GET /medications
Listar todos los medicamentos.

### GET /medications/:id
Obtener un medicamento por ID.

### POST /medications
Crear un medicamento.

**Body:**
```json
{
    "name": "Losartán",
    "description": "Antihipertensivo",
    "stock": 100,
    "unit": "mg",
    "price": 5500
}
```

### PUT /medications/:id
Actualizar un medicamento.

### PATCH /medications/:id/stock
Actualizar stock. Cantidad positiva suma, negativa resta.

**Body:**
```json
{ "quantity": -10 }
```
**Respuesta 200:**
```json
{ "message": "Stock updated successfully", "stock": 90 }
```

### DELETE /medications/:id
Eliminar un medicamento.