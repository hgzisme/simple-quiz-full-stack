const Question = require('../models/Question');

exports.createQuestion = async (req, res) => {
    try {
        const questionData = { ...req.body, author: req.user._id };
        const question = await Question.create(questionData);
        res.status(201).json({ message: 'Question created successfully', data: question });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getAllQuestion = async (req, res) => {
    try {
        const question = await Question.find();
        if (!question) {
            return res.status(404).json({ message: 'No question found' })
        }
        res.status(200).json({ message: 'Questions fetched successfully', data: question })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json({ message: 'Question found successfully', data: question })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getQuestionByAuthor = async (req, res) => {
    try {
        const { authorId } = req.params;

        if (authorId !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only view your own created questions' });
        }

        const questions = await Question.find({ author: authorId });
        res.status(200).json({ message: 'Author questions fetched successfully', data: questions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateQuestion = async (req, res) => {
    try {
        const updateData = { ...req.body };
        delete updateData.author;

        const question = await Question.findOneAndUpdate(
            { _id: req.params.questionId, author: req.user._id },
            updateData,
            { new: true }
        );
        if (!question) {
            return res.status(403).json({ message: 'You are not allowed to update this question' });
        }
        res.status(200).json({ message: 'Question update successfully', updatedData: question })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findOneAndDelete({ _id: req.params.questionId, author: req.user._id });
        if (!question) {
            return res.status(403).json({ message: 'You are not allowed to delete this question' });
        }
        res.status(200).json({ message: 'Question deleted successfully', deletedData: question });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


// Deprecated: kept only to avoid breaking old imports/routes.
exports.deleteAllQuestions = async (req, res) => {
    res.status(405).json({ message: 'Bulk delete is not allowed' });
}

