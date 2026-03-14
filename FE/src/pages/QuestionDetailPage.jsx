import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchQuestionById } from '../features/questions/questionsSlice';

export default function QuestionDetailPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { questionId } = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const { selectedQuestion, detailStatus, error } = useAppSelector((state) => state.questions);

  useEffect(() => {
    dispatch(fetchQuestionById(questionId));
  }, [dispatch, questionId]);

  if (detailStatus === 'loading') {
    return <LoadingSpinner label="Loading question details" />;
  }

  if (!selectedQuestion) {
    return <div className="alert alert-warning">Question not found.</div>;
  }

  const canEdit = user?.id === selectedQuestion.author;
  const fromCreatedQuestions = Boolean(location.state?.fromCreatedQuestions);

  const handleBack = () => {
    if (fromCreatedQuestions) {
      navigate(-1);
      return;
    }
    navigate('/questions');
  };

  const handleBackQuizzes = () => {
    if (fromCreatedQuestions) {
      navigate(-1);
      return;
    }
    navigate('/quizzes');
  };

  return (
    <section>
      {error ? <div className="alert alert-danger">{error}</div> : null}

      <article className="glass-card p-4">
        <h1 className="h4 mb-3">{selectedQuestion.text}</h1>

        <h2 className="h6 text-light-emphasis mb-2">Available Options</h2>
        <ul className="list-group mb-4">
          {(selectedQuestion.options || []).map((option, index) => (
            <li className="list-group-item d-flex justify-content-between" key={`${selectedQuestion._id}-${index}`}>
              <span>{option}</span>
              {selectedQuestion.correctedAnswerIndex === index ? <span className="badge text-bg-success">Correct</span> : null}
            </li>
          ))}
        </ul>

        <div className="d-flex gap-2 flex-wrap">
          {selectedQuestion.keywords?.length ? (
            selectedQuestion.keywords.map((keyword) => (
              <span key={keyword} className="badge text-bg-secondary">{keyword}</span>
            ))
          ) : (
            <span className="text-light-emphasis">No keywords</span>
          )}
        </div>
      </article>

      <div className="mt-3">
        <button type="button" className="btn btn-outline-light" onClick={handleBack}>
          Back to List
        </button>
        <button type="button" className="btn btn-outline-light" onClick={handleBackQuizzes}>
          Back to Quizzes
        </button>
      </div>
    </section>
  );
}
