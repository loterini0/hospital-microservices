# MediSystem - Sistema de Gestión Hospitalaria

Sistema basado en arquitectura de microservicios para la gestión de pacientes, citas médicas, historiales clínicos, notificaciones y medicamentos.

Usuarios  Citas  Historiales  Notificaciones  Medicamentos
Express   Django  Flask        Express         Express
:3001     :8001   :8002        :3002           :3003
MySQL   PostgreSQL PostgreSQL  MongoDB         MySQL

## Requisitos previos

- PHP 8.3 y Composer
- Node.js 20+
- Python 3.11+
- MySQL 8.0
- PostgreSQL 15+
- MongoDB 7+
- Git

## Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/hospital-microservices.git
cd hospital-microservices
```

### 2. Crear las bases de datos

**MySQL:**
```sql
CREATE DATABASE hospital_gateway;
CREATE DATABASE hospital_usuarios;
CREATE DATABASE hospital_medicamentos;
```

**PostgreSQL:**
```sql
CREATE DATABASE hospital_citas;
CREATE DATABASE hospital_historiales;
```

**MongoDB:** Se crea automáticamente al iniciar el servicio.

### 3. Configurar variables de entorno

Cada microservicio tiene su propio `.env`. Copia los ejemplos y ajusta las credenciales:

**gateway/.env**
```env
APP_NAME=HospitalGateway
APP_KEY=base64:...
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hospital_gateway
DB_USERNAME=root
DB_PASSWORD=tu_password
USERS_SERVICE_URL=http://localhost:3001
APPOINTMENTS_SERVICE_URL=http://localhost:8001
RECORDS_SERVICE_URL=http://localhost:8002
NOTIFICATIONS_SERVICE_URL=http://localhost:3002
MEDICATIONS_SERVICE_URL=http://localhost:3003
GATEWAY_SECRET=
```

**usuarios/.env**
```env
PORT=3001
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=hospital_usuarios
DB_USER=root
DB_PASSWORD=tu_password
GATEWAY_SECRET=
```

**citas/.env**
```env
DEBUG=True
DB_NAME=hospital_citas
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=127.0.0.1
DB_PORT=5432
GATEWAY_SECRET=
```

**historiales/.env**
```env
FLASK_ENV=development
PORT=8002
DB_NAME=hospital_historiales
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=127.0.0.1
DB_PORT=5432
GATEWAY_SECRET=
```

**notificaciones/.env**
```env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/hospital_notificaciones
GATEWAY_SECRET=
```

**medicamentos/.env**
```env
PORT=3003
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=hospital_medicamentos
DB_USER=root
DB_PASSWORD=tu_password
GATEWAY_SECRET=
```

### 4. Instalar dependencias

**Gateway (Laravel):**
```bash
cd gateway
composer install
php artisan key:generate
php artisan migrate --seed
cd ..
```

**Usuarios:**
```bash
cd usuarios
npm install
cd ..
```

**Citas (Django):**
```bash
cd citas
python -m venv .venv
source .venv/Scripts/activate  # Windows
python manage.py migrate
cd ..
```

**Historiales (Flask):**
```bash
cd historiales
python -m venv .venv
source .venv/Scripts/activate  # Windows
pip install flask flask-sqlalchemy psycopg2-binary python-dotenv
cd ..
```

**Notificaciones:**
```bash
cd notificaciones
npm install
cd ..
```

**Medicamentos:**
```bash
cd medicamentos
npm install
cd ..
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

## Ejecución

Abrir una terminal por cada servicio:

**Terminal 1 - Gateway:**
```bash
cd gateway
php artisan serve
```

**Terminal 2 - Usuarios:**
```bash
cd usuarios
npm run dev
```

**Terminal 3 - Citas:**
```bash
cd citas
source .venv/Scripts/activate
python manage.py runserver 8001
```

**Terminal 4 - Historiales:**
```bash
cd historiales
source .venv/Scripts/activate
python app.py
```

**Terminal 5 - Notificaciones:**
```bash
cd notificaciones
npm run dev
```

**Terminal 6 - Medicamentos:**
```bash
cd medicamentos
npm run dev
```

**Terminal 7 - Frontend: En desarrollo**
```bash
cd frontend
npm run dev
```

## Servicios y puertos

| Servicio       | Framework | Puerto | Base de datos |
|----------------|-----------|--------|---------------|
| API Gateway    | Laravel   | 8000   | MySQL         |
| Usuarios       | Express   | 3001   | MySQL         |
| Citas          | Django    | 8001   | PostgreSQL    |
| Historiales    | Flask     | 8002   | PostgreSQL    |
| Notificaciones | Express   | 3002   | MongoDB       |
| Medicamentos   | Express   | 3003   | MySQL         |
| Frontend       | React     | 5173   | —             | En desarrollo

## Pruebas de rendimiento

Con todos los servicios corriendo:
```bash
cd tests
locust -f locustfile.py --host=http://localhost:8000
```

Abrir `http://localhost:8089` y configurar:

| Tipo de prueba | Usuarios | Spawn rate | Duración |
|----------------|----------|------------|----------|
| Carga          | 20       | 2          | 3 min    |
| Capacidad      | 50       | 5          | 2 min    |
| Estrés         | 200      | 20         | 2 min    |

## Roles y permisos

| Recurso        | Patient | Doctor | Admin |
|----------------|---------|--------|-------|
| Usuarios       | —       | —      | CRUD  |
| Citas          | CR      | R      | CRUD  |
| Historiales    | —       | CRUD   | CRUD  |
| Notificaciones | R       | R      | CRUD  |
| Medicamentos   | R       | R+Stock| CRUD  |

## Usuarios de prueba

| Email                    | Password    | Rol   |
|--------------------------|-------------|-------|
| admin@hospital.com       | password123 | Admin |
| doctor@hospital.com      | password123 | Doctor|
| paciente@hospital.com    | password123 | Patient|

## Documentación de endpoints

Ver [docs/endpoints.md](docs/endpoints.md)

## Diagrama de arquitectura

Ver [docs/architecture.drawio](docs/architecture.drawio)

## Estructura del repositorio
hospital-microservices/
├── gateway/          # API Gateway - Laravel
├── usuarios/         # Microservicio Usuarios - Express
├── citas/            # Microservicio Citas - Django
├── historiales/      # Microservicio Historiales - Flask
├── notificaciones/   # Microservicio Notificaciones - Express
├── medicamentos/     # Microservicio Medicamentos - Express
├── frontend/         # Interfaz web - React Desarrollo
├── tests/            # Pruebas de rendimiento - Locust
└── docs/             # Documentación y diagramas