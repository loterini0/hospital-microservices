const validateCreateMedication = (req, res, next) => {
    const { name, stock, unit, price } = req.body;

    if (!name || !unit || !price) {
        return res.status(400).json({ message: 'Name, unit and price are required' });
    }

    if (stock < 0) {
        return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    if (price <= 0) {
        return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    next();
};

const validateUpdateStock = (req, res, next) => {
    const { quantity } = req.body;

    if (quantity === undefined || quantity === null) {
        return res.status(400).json({ message: 'Quantity is required' });
    }

    next();
};

module.exports = { validateCreateMedication, validateUpdateStock };