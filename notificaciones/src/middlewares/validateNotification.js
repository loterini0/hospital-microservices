const validateCreateNotification = (req, res, next) => {
    const { user_id, type, message } = req.body;

    if (!user_id || !type || !message) {
        return res.status(400).json({ message: 'user_id, type and message are required' });
    }

    const validTypes = ['appointment', 'reminder', 'alert'];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ message: 'Invalid type. Must be appointment, reminder or alert' });
    }

    next();
};

module.exports = { validateCreateNotification };