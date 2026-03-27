const db = require('../models/db');

const getUsers = async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM users');
    res.json(rows);
};

const getUserById = async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
};

const createUser = async (req, res) => {
    const { name, email, phone, role } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    const [result] = await db.execute(
        'INSERT INTO users (name, email, phone, role) VALUES (?, ?, ?, ?)',
        [name, email, phone ?? null, role ?? 'patient']
    );

    res.status(201).json({ id: result.insertId, name, email, phone, role });
};

const updateUser = async (req, res) => {
    const { name, phone } = req.body;

    await db.execute(
        'UPDATE users SET name = ?, phone = ? WHERE id = ?',
        [name, phone, req.params.id]
    );

    res.json({ message: 'User updated successfully' });
};

const deleteUser = async (req, res) => {
    await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };