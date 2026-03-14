import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchQuizById } from '../features/quizzes/quizzesSlice';

export default function QuizDetailPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { quizId } = useParams();

  const user = useAppSelector((state) => state.auth.user);
  const { selectedQuiz, detailStatus, error } = useAppSelector((state) => state.quizzes);

  const [reviewAnswers, setReviewAnswers] = useState({});

  useEffect(() => {
    dispatch(fetchQuizById(quizId));
  }, [dispatch, quizId]);

  const handleReviewSelect = (questionId, optionIndex) => {
    setReviewAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const getFeedbackClass = (question, optionIndex) => {
    const chosen = reviewAnswers[question._id];
    if (chosen === undefined) return '';

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
    return <LoadingSpinner label="Loading quiz details" />;
  }

  if (!selectedQuiz) {
    return (
      <div className="alert alert-warning">
        Quiz not found.
      </div>
    );
  }

  return (
    <section>
      {error ? <div className="alert alert-danger">{error}</div> : null}

      <article className="glass-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h1 className="h3 m-0">{selectedQuiz.title}</h1>
          <div className="d-flex gap-2 flex-wrap">
            {user?.admin ? (
              <Link to={`/quizzes/${quizId}/edit`} className="btn btn-sm btn-outline-warning">Edit Settings</Link>
            ) : null}
            <Link to={`/quizzes/${quizId}/perform`} className="btn btn-sm btn-warning">Perform Quiz</Link>
          </div>
        </div>
        <p className="text-light-emphasis mb-0">{selectedQuiz.description || 'No description provided.'}</p>
      </article>

      <article className="glass-card p-4 mb-4">
        <h2 className="h5 mb-3">Question Controls</h2>
        <div className="d-flex gap-2 flex-wrap mb-3">
          <Link to={`/questions/create?quizId=${quizId}`} className="btn btn-warning btn-sm">+ Add Question</Link>
          <Link to={`/quizzes/${quizId}/batch`} className="btn btn-outline-light btn-sm">+ Add Batch</Link>
        </div>

      </article>

      <h2 className="h4 mb-3">Questions Grid (Review Mode)</h2>
      {!selectedQuiz.questions?.length ? (
        <div className="alert alert-info">No questions are attached to this quiz yet.</div>
      ) : (
        <div className="row g-3 mb-4">
          {selectedQuiz.questions.map((question, index) => (
            <div key={question._id} className="col-md-6">
              <article className="quiz-card p-4 h-100">
                <div className="question-grid-header mb-3">
                  <h3 className="h6 m-0 question-grid-text">Q{index + 1}. {question.text}</h3>
                  <Link to={`/questions/${question._id}`} className="btn btn-sm btn-outline-light question-grid-detail">Details</Link>
                </div>
                <div className="d-grid gap-2">
                  {(question.options || []).map((option, optionIndex) => (
                    <button
                      key={`${question._id}-${optionIndex}`}
                      type="button"
                      className={`option-row option-review ${getFeedbackClass(question, optionIndex)}`}
                      onClick={() => handleReviewSelect(question._id, optionIndex)}
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
      )}

      <div className="mt-4">
        <button type="button" className="btn btn-outline-light" onClick={() => navigate('/quizzes')}>
          Back to Quizzes
        </button>
      </div>
    </section>
  );
}
