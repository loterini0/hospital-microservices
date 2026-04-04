const express = require('express');
const dotenv  = require('dotenv');
const { createTable } = require('./models/medicationModel');
const medicationRoutes = require('./routes/medicationRoutes');

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use('/api/medications', medicationRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

const start = async () => {
    await createTable();
    app.listen(PORT, () => {
        console.log(`Medications service running on port ${PORT}`);
    });
};

start();