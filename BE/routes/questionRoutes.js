const express = require('express');
const router = express.Router();
const {
    createQuestion,
    getAllQuestion,
    getQuestionByAuthor,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    deleteAllQuestions
} = require('../controllers/QuestionController');
const { verifyUser, verifyAuthor } = require('../middleware/authenticate');

router.get('/question', verifyUser, getAllQuestion);
router.get('/question/createdQuestions/:authorId', verifyUser, getQuestionByAuthor);
router.get('/question/:questionId', verifyUser, getQuestionById);

router.post('/question', verifyUser, createQuestion);

router.put('/question/:questionId', verifyUser, verifyAuthor, updateQuestion);

router.delete('/question/:questionId', verifyUser, verifyAuthor, deleteQuestion);

// Deprecated endpoint kept for compatibility. Bulk deletion is not allowed.
router.delete('/question', verifyUser, deleteAllQuestions);

module.exports = router;
