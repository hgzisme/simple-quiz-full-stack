import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import { deleteQuestion, fetchQuestions } from '../features/questions/questionsSlice';

export default function QuestionListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { items, status, error } = useAppSelector((state) => state.questions);

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  const handleDelete = async (questionId) => {
    const confirmed = window.confirm('Delete this question permanently from the bank?');
    if (!confirmed) return;

    const result = await dispatch(deleteQuestion(questionId));
    if (!result.error) {
      dispatch(fetchQuestions());
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h1 className="h2 m-0">{user?.admin ? 'Global Question Bank' : 'My Questions'}</h1>
        <Link to="/questions/create" className="btn btn-warning">+ Create Question</Link>
      </div>

      {status === 'loading' ? <LoadingSpinner label="Fetching questions" /> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}

      {!items.length && status === 'succeeded' ? (
        <div className="glass-card p-4 text-center">
          <p className="text-light-emphasis mb-3">The question bank is empty.</p>
          {user?.admin ? <Link to="/questions/create" className="btn btn-warning">Draft First Question</Link> : null}
        </div>
      ) : null}

      <div className="d-grid gap-3">
        {items.map((question) => {
          const canEdit = user?.id === question.author;
          return (
            <article key={question._id} className="quiz-card p-3">
              <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
                <div>
                  <h2 className="h6 mb-2">{question.text}</h2>
                  {question.keywords?.length ? (
                    <span className="badge text-bg-secondary">{question.keywords.join(', ')}</span>
                  ) : null}
                </div>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-sm btn-light" onClick={() => navigate(`/questions/${question._id}`)}>
                    View
                  </button>
                  {canEdit ? <button type="button" className="btn btn-sm btn-outline-warning" onClick={() => navigate(`/questions/${question._id}/edit`)}>Edit</button> : null}
                  {canEdit ? <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(question._id)}>Delete</button> : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
