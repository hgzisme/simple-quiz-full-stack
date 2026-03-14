import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchQuestions, fetchQuestionsByAuthor } from '../features/questions/questionsSlice';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const questions = useAppSelector((state) => state.questions.items);

  useEffect(() => {
    if (user) {
      if (user.admin) {
        dispatch(fetchQuestions());
      } else {
        dispatch(fetchQuestionsByAuthor());
      }
    }
  }, [dispatch, user]);

  return (
    <section className="hero-panel p-4 p-md-5">
      <div className="row g-4 align-items-stretch">
        <div className="col-lg-7">
          <h1 className="display-5 fw-bold mb-3">Welcome to the Question Bank Management System</h1>
          <p className="lead text-light mb-4">
            Build quizzes, draft reusable question banks, and run smooth assessment sessions from one place.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/quizzes" className="btn btn-warning btn-lg">Go to Quizzes</Link>
            {user ? <Link to="/questions" className="btn btn-outline-light btn-lg">Go to Question Bank</Link> : null}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="glass-card h-100 p-4">
            <h2 className="h4 mb-3">Current Session</h2>
            {user ? (
              <>
                <p className="mb-2"><strong>User:</strong> {user.username}</p>
                <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                <p className="mb-0"><strong>Role:</strong> {user.admin ? 'Admin' : 'Learner'}</p>
              </>
            ) : (
              <>
                <p className="mb-3">Sign in to unlock quizzes and question management.</p>
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-sm btn-light">Login</Link>
                  <Link to="/signup" className="btn btn-sm btn-outline-light">Create account</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {user ? (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 m-0">{user.admin ? 'All Questions' : 'Your Created Questions'}</h2>
            <Link to="/questions/create" className="btn btn-sm btn-warning">+ Add Question</Link>
          </div>

          {questions.length ? (
            <div className="row g-3">
              {questions.map((question) => (
                <div className="col-md-6" key={question._id}>
                  <article className="quiz-card p-3 h-100">
                    <h3 className="h6 mb-2">{question.text}</h3>
                    <p className="small text-light-emphasis mb-2">Correct index: {question.correctedAnswerIndex}</p>
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {(question.keywords || []).map((keyword) => (
                        <span key={`${question._id}-${keyword}`} className="badge text-bg-secondary">{keyword}</span>
                      ))}
                    </div>
                    <Link to={`/questions/${question._id}`} state={{ fromCreatedQuestions: !user.admin }} className="btn btn-sm btn-outline-light">Open</Link>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-3">No questions to show.</div>
          )}
        </div>
      ) : null}
    </section>
  );
}
