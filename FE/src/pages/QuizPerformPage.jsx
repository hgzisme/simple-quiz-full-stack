import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchQuizById } from '../features/quizzes/quizzesSlice';

export default function QuizPerformPage() {
  const dispatch = useAppDispatch();
  const { quizId } = useParams();
  const { selectedQuiz, detailStatus, error } = useAppSelector((state) => state.quizzes);

  const [answers, setAnswers] = useState({});
  const [scoreResult, setScoreResult] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizById(quizId));
  }, [dispatch, quizId]);

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    const questions = selectedQuiz?.questions || [];
    const score = questions.reduce((total, question) => {
      const chosen = answers[question._id];
      return chosen === question.correctedAnswerIndex ? total + 1 : total;
    }, 0);

    setScoreResult({ score, total: questions.length });
  };

  const getFeedbackClass = (question, optionIndex) => {
    if (!scoreResult) return '';

    const chosen = answers[question._id];
    if (chosen === optionIndex && optionIndex === question.correctedAnswerIndex) {
      return 'option-correct';
    }

    if (chosen === optionIndex && optionIndex !== question.correctedAnswerIndex) {
      return 'option-wrong';
    }

    if (optionIndex === question.correctedAnswerIndex) {
      return 'option-answer';
    }

    return '';
  };

  if (detailStatus === 'loading') {
    return <LoadingSpinner label="Preparing quiz" />;
  }

  if (!selectedQuiz) {
    return <div className="alert alert-warning">Quiz not found.</div>;
  }

  return (
    <section>
      <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <Link to={`/quizzes/${quizId}`} className="link-light">Back to View Quiz</Link>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <article className="glass-card p-4 mb-4">
        <h1 className="h3 mb-2">Perform Quiz: {selectedQuiz.title}</h1>
        <p className="text-light-emphasis mb-0">Choose one answer per question, then submit to see your result.</p>
      </article>

      <div className="row g-3 mb-4">
        {(selectedQuiz.questions || []).map((question, index) => (
          <div key={question._id} className="col-md-6">
            <article className="quiz-card p-4 h-100">
              <h2 className="h6 mb-3">Q{index + 1}. {question.text}</h2>
              <div className="d-grid gap-2">
                {(question.options || []).map((option, optionIndex) => (
                  <button
                    key={`${question._id}-${optionIndex}`}
                    type="button"
                    className={`option-row option-review ${getFeedbackClass(question, optionIndex)}`}
                    onClick={() => handleAnswerSelect(question._id, optionIndex)}
                  >
                    <span className="fw-semibold me-2">{String.fromCharCode(65 + optionIndex)}.</span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </article>
          </div>
        ))}
      </div>

      <div className="glass-card p-4">
        <button type="button" className="btn btn-warning" onClick={handleSubmit}>
          Submit Answers
        </button>
        {scoreResult ? (
          <>
            <div className="alert alert-success mt-3 mb-2">
              Score: {scoreResult.score}/{scoreResult.total}
            </div>
            <div className="text-light-emphasis small">
              Accuracy: {scoreResult.total ? Math.round((scoreResult.score / scoreResult.total) * 100) : 0}%
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
