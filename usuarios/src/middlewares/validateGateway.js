const validateGateway = (req, res, next) => {
    const secret = req.headers['x-gateway-secret'];
    if (secret !== process.env.GATEWAY_SECRET) {
        return res.status(403).json({ message: 'Access denied. Use the API Gateway.' });
    }
    next();
};

module.exports = { validateGateway };
