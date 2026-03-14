const express = require('express');
const router = express.Router();
const {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    getQuizByPopulate,
    addQuestionToQuiz,
    addManyQuestionsToQuiz
} = require('../controllers/QuizController');
const { verifyUser, verifyAdmin } = require('../middleware/authenticate');

router.get('/quizzes', getAllQuizzes);
router.get('/quizzes/:quizId', getQuizById);
router.get('/quizzes/:quizId/populate', getQuizByPopulate);

router.post('/quizzes',verifyUser, verifyAdmin, createQuiz);
router.put('/quizzes/:quizId',verifyUser, verifyAdmin, updateQuiz);
router.delete('/quizzes/:quizId',verifyUser, verifyAdmin, deleteQuiz);

router.post('/quizzes/:quizId/question',verifyUser, addQuestionToQuiz);
router.post('/quizzes/:quizId/questions',verifyUser, addManyQuestionsToQuiz);

module.exports = router;