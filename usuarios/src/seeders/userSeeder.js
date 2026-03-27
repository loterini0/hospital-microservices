const db = require('../models/db');
const { createTable } = require('../models/userModel');

const seed = async () => {
    await createTable();

    await db.execute('DELETE FROM users');

    await db.execute(`
        INSERT INTO users (name, email, phone, role) VALUES
        ('Doctor Juan',    'doctor@hospital.com',   '3001234567', 'doctor'),
        ('Paciente Maria', 'paciente@hospital.com', '3009876543', 'patient'),
        ('Admin Sistema',  'admin@hospital.com',    '3005555555', 'admin')
    `);

    console.log('Users seeded successfully');
    process.exit();
};

seed();