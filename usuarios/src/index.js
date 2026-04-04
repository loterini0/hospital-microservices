const express = require('express');
const dotenv  = require('dotenv');
const { createTable } = require('./models/userModel');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/users', userRoutes);

const start = async () => {
    await createTable();
    app.listen(PORT, () => {
        console.log(`Users service running on port ${PORT}`);
    });
};

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});
start();