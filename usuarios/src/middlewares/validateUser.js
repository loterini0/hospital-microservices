const validateCreateUser = (req, res, next) => {
    const { name, email, role } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    const validRoles = ['patient', 'doctor', 'admin'];
    if (role && !validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    next();
};

const validateUpdateUser = (req, res, next) => {
    const { name, phone } = req.body;

    if (!name && !phone) {
        return res.status(400).json({ message: 'At least one field is required' });
    }

    next();
};

module.exports = { validateCreateUser, validateUpdateUser };