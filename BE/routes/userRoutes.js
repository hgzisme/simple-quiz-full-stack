const express = require('express');
const router = express.Router();
const { signup, login, getAllUsers } = require('../controllers/UserController');
const { verifyUser, verifyAdmin } = require('../middleware/authenticate');

// Public routes
router.post('/auth/signup', signup);
router.post('/auth/login', login);

// Protected routes
router.get('/users', verifyUser, verifyAdmin, getAllUsers);

module.exports = router;