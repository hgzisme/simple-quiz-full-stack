import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import { createQuiz, fetchQuizById, updateQuiz } from '../features/quizzes/quizzesSlice';

export default function QuizFormPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { quizId } = useParams();
  const isEdit = Boolean(quizId);

  const { selectedQuiz, detailStatus, mutateStatus, error } = useAppSelector((state) => state.quizzes);
  const [formState, setFormState] = useState({ title: undefined, description: undefined });

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchQuizById(quizId));
    }
  }, [dispatch, isEdit, quizId]);

  const isBusy = useMemo(
    () => detailStatus === 'loading' || mutateStatus === 'loading',
    [detailStatus, mutateStatus]
  );

  const resolvedTitle = formState.title ?? (isEdit ? selectedQuiz?.title : '') ?? '';
  const resolvedDescription = formState.description ?? (isEdit ? selectedQuiz?.description : '') ?? '';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title: resolvedTitle,
      description: resolvedDescription,
    };

    if (isEdit) {
      const result = await dispatch(updateQuiz({ quizId, payload }));
      if (!result.error) {
        navigate(`/quizzes/${quizId}`);
      }
      return;
    }

    const result = await dispatch(createQuiz(payload));
    if (!result.error) {
      navigate('/quizzes');
    }
  };

  return (
    <section className="glass-card p-4 p-md-5">
      <h1 className="h3 mb-4">{isEdit ? 'Edit Quiz' : 'Create New Quiz'}</h1>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <form onSubmit={handleSubmit} className="d-grid gap-3">
        <div>
          <label className="form-label">Quiz Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={resolvedTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="4"
            name="description"
            value={resolvedDescription}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex gap-2">
          <Link to={isEdit ? `/quizzes/${quizId}` : '/quizzes'} className="btn btn-outline-light">Cancel</Link>
          <button type="submit" className="btn btn-warning" disabled={isBusy}>
            {isBusy ? <LoadingSpinner label="Saving" /> : isEdit ? 'Update Quiz' : 'Save Quiz'}
          </button>
        </div>
      </form>
    </section>
  );
}
