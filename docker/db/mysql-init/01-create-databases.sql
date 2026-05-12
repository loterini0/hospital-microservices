-- Crear bases de datos para los servicios que usan MySQL
CREATE DATABASE IF NOT EXISTS hospital_gateway CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS hospital_usuarios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS hospital_medicamentos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Garantizar permisos al usuario de la aplicación
GRANT ALL PRIVILEGES ON hospital_gateway.* TO 'hospital_user'@'%';
GRANT ALL PRIVILEGES ON hospital_usuarios.* TO 'hospital_user'@'%';
GRANT ALL PRIVILEGES ON hospital_medicamentos.* TO 'hospital_user'@'%';

FLUSH PRIVILEGES;
