const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

exports.createQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);
        if (!quiz) {
            return res.status(400).json({ message: 'Fail to create new Quiz' });
        }
        res.status(201).json({ message: 'Create Quiz successfully', data: quiz });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        if (!quizzes) {
            return res.status(404).json({ message: 'No Quiz found' })
        }
        res.status(200).json({ message: 'Get all quizzes successfully', data: quizzes })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' })
        }
        res.status(200).json({ message: 'Get quiz successfully', data: quiz })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, { new: true })
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' })
        }
        res.status(200).json({ message: 'Quiz updated successfully', updatedQuiz: quiz })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.quizId)
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' })
        }

        // Delete all questions associated with this quiz
        if (quiz.questions && quiz.questions.length > 0) {
            await Question.deleteMany({ _id: { $in: quiz.questions } });
        }

        res.status(200).json({ message: 'Quiz and associated questions deleted successfully', deletedData: quiz })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.getQuizByPopulate = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate({
            path: 'questions',
            match: { keywords: /capital/i }
        })
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' })
        }
        res.status(200).json({ message: `Matched questions:`, questions: quiz })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.addQuestionToQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let questionId = req.body._id;

        if (questionId) {
            const existingQuestion = await Question.findById(questionId);

            if (!existingQuestion) {
                return res.status(404).json({ message: 'Question not found' });
            }

            // Non-admin users can only attach questions they authored.
            if (!req.user.admin && existingQuestion.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'You can only attach your own questions to a quiz' });
            }

            questionId = existingQuestion._id;
        } else {
            const newQuestion = await Question.create({
                text: req.body.text,
                options: req.body.options || [],
                keywords: req.body.keywords || [],
                correctedAnswerIndex: parseInt(req.body.correctedAnswerIndex),
                author: req.user._id
            });

            questionId = newQuestion._id;
        }

        quiz.questions.push(questionId);
        const updatedQuiz = await quiz.save();

        res.status(201).json({
            message: 'Question added to quiz successfully',
            quiz: updatedQuiz
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.addManyQuestionsToQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId);
        const questionsData = req.body;

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' })
        }

        if (!Array.isArray(questionsData)) {
            return res.status(400).json({ message: 'Request body must be an array' })
        }

        if (!questionsData.length) {
            return res.status(400).json({ message: 'Questions array cannot be empty' })
        }

        const normalizedQuestions = questionsData.map(q => ({
            text: q.text,
            options: Array.isArray(q.options) ? q.options : [],
            keywords: Array.isArray(q.keywords) ? q.keywords : [],
            correctedAnswerIndex: parseInt(q.correctedAnswerIndex),
            author: req.user._id
        }));

        const newQuestions = await Question.insertMany(normalizedQuestions);

        const questionIds = newQuestions.map(q => q._id);

        quiz.questions.push(...questionIds);
        const updatedQuiz = await quiz.save();

        res.status(201).json({
            message: 'Questions added to quiz successfully',
            quiz: updatedQuiz
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}