import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import { deleteQuiz, fetchQuizzes } from '../features/quizzes/quizzesSlice';

export default function QuizListPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { items, status, error } = useAppSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const handleDelete = (quizId) => {
    const confirmed = window.confirm('Are you sure you want to delete this quiz and all associated questions?');
    if (confirmed) {
      dispatch(deleteQuiz(quizId));
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h1 className="h2 m-0">All Quizzes</h1>
        {user?.admin ? (
          <Link to="/quizzes/create" className="btn btn-warning">+ Create New Quiz</Link>
        ) : null}
      </div>

      {status === 'loading' ? <LoadingSpinner label="Fetching quizzes" /> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}

      {!items.length && status === 'succeeded' ? (
        <div className="glass-card p-4 text-center">
          <p className="text-light-emphasis mb-3">No quizzes have been created yet.</p>
          {user?.admin ? <Link to="/quizzes/create" className="btn btn-warning">Create Your First Quiz</Link> : null}
        </div>
      ) : null}

      <div className="row g-3">
        {items.map((quiz) => (
          <div key={quiz._id} className="col-md-6 col-xl-4">
            <article className="quiz-card h-100 p-4 d-flex flex-column">
              <h2 className="h5">{quiz.title}</h2>
              <p className="text-light-emphasis flex-grow-1 mb-3">{quiz.description || 'No description provided.'}</p>
              <div className="d-flex gap-2 flex-wrap">
                <Link to={`/quizzes/${quiz._id}`} className="btn btn-sm btn-light">View</Link>
                {user?.admin ? <Link to={`/quizzes/${quiz._id}/edit`} className="btn btn-sm btn-outline-warning">Edit</Link> : null}
                {user?.admin ? (
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(quiz._id)}>
                    Delete
                  </button>
                ) : null}
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
