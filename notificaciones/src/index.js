const express  = require('express');
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use('/api/notifications', notificationRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Notifications service running on port ${PORT}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));