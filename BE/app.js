require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const quizRouter = require('./routes/quizRoutes');
const questionRouter = require('./routes/questionRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//connect DB
connectDB();

//Middleware
app.use(cors({
    origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'http://localhost:5174'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/', userRouter);
app.use('/', quizRouter);
app.use('/', questionRouter);

// Basic API status route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Simple Quiz API is running' });
});

// Not found handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Centralized JSON error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
        message: err.message || 'Internal server error'
    });
});


module.exports = app;
