const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Signup - Create new user
exports.signup = async (req, res) => {
    try {
        const { username, email, password, adminCode } = req.body;
        const wantsAdmin = req.body.admin === true || req.body.admin === 'true' || req.body.admin === 'on';

        let isAdmin = false;
        if (wantsAdmin) {
            const expectedAdminCode = process.env.ADMIN_SIGNUP_CODE;

            if (!expectedAdminCode) {
                return res.status(500).json({ message: 'Admin signup is not configured.' });
            }

            if (!adminCode || adminCode !== expectedAdminCode) {
                return res.status(403).json({ message: 'Invalid admin verification code.' });
            }

            isAdmin = true;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password,
            admin: isAdmin
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, admin: user.admin },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            user: { id: user._id, username: user.username, email: user.email, admin: user.admin },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login - Authenticate user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, admin: user.admin },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful',
            user: { id: user._id, username: user.username, email: user.email, admin: user.admin },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Users - Only Admin can access
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json({
            message: 'Users fetched successfully',
            data: users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};