const db = require('./db');

const createTable = async () => {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS medications (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            name        VARCHAR(255) NOT NULL,
            description TEXT,
            stock       INT NOT NULL DEFAULT 0,
            unit        VARCHAR(50) NOT NULL,
            price       DECIMAL(10,2) NOT NULL,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
};

module.exports = { createTable };