const db = require('../models/db');

const getMedications = async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM medications');
    res.json(rows);
};

const getMedicationById = async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM medications WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Medication not found' });
    res.json(rows[0]);
};

const createMedication = async (req, res) => {
    const { name, description, stock, unit, price } = req.body;
    const [result] = await db.execute(
        'INSERT INTO medications (name, description, stock, unit, price) VALUES (?, ?, ?, ?, ?)',
        [name, description ?? null, stock ?? 0, unit, price]
    );
    res.status(201).json({ id: result.insertId, name, description, stock, unit, price });
};

const updateStock = async (req, res) => {
    const { quantity } = req.body;
    const [rows] = await db.execute('SELECT * FROM medications WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Medication not found' });

    const newStock = rows[0].stock + parseInt(quantity);
    if (newStock < 0) return res.status(400).json({ message: 'Insufficient stock' });

    await db.execute('UPDATE medications SET stock = ? WHERE id = ?', [newStock, req.params.id]);
    res.json({ message: 'Stock updated successfully', stock: newStock });
};

const updateMedication = async (req, res) => {
    const { name, description, unit, price } = req.body;
    const [rows] = await db.execute('SELECT * FROM medications WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Medication not found' });

    await db.execute(
        'UPDATE medications SET name = ?, description = ?, unit = ?, price = ? WHERE id = ?',
        [name, description, unit, price, req.params.id]
    );
    res.json({ message: 'Medication updated successfully' });
};

const deleteMedication = async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM medications WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Medication not found' });
    await db.execute('DELETE FROM medications WHERE id = ?', [req.params.id]);
    res.json({ message: 'Medication deleted successfully' });
};

module.exports = { getMedications, getMedicationById, createMedication, updateStock, updateMedication, deleteMedication };