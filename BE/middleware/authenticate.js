const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Verify User - Check if the token is valid
exports.verifyUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token) return res.status(401).json({message: 'No token provided'});

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.id);

        if(!user) return res.status(401).json({message: 'User not found'});

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({message: 'Invalid token', error: error.message})
    }
}

// Verify Admin - Check if user is admin
exports.verifyAdmin = async (req, res, next) => {
    try {
        // verifyUser should run first to set req.user
        if (!req.user || !req.user.admin) {
            const error = new Error('You are not authorized to perform this operation!');
            error.status = 403;
            return next(error);
        }
        next();
    } catch (error) {
        res.status(403).json({ message: 'You are not authorized to perform this operation!' });
    }
};

// Verify Author - Check if user is the author of the question
exports.verifyAuthor = async (req, res, next) => {
    try {
        const { questionId } = req.params;
        const Question = require('../models/Question');
        
        const question = await Question.findById(questionId);
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Compare author ID with current user ID
        if (question.author.toString() !== req.user._id.toString()) {
            const error = new Error('You are not the author of this question');
            error.status = 403;
            return next(error);
        }

        next();
    } catch (error) {
        res.status(403).json({ message: 'You are not the author of this question' });
    }
};