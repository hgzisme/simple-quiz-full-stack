import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  createQuestion,
  fetchQuestionById,
  updateQuestion,
} from '../features/questions/questionsSlice';
import { addQuestionToQuiz } from '../features/quizzes/quizzesSlice';

const initialState = {
  text: undefined,
  options: undefined,
  correctedAnswerIndex: undefined,
  keywords: undefined,
};

export default function QuestionFormPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { questionId } = useParams();
  const [searchParams] = useSearchParams();

  const quizId = searchParams.get('quizId');
  const isEdit = Boolean(questionId);
  const [formState, setFormState] = useState(initialState);

  const { selectedQuestion, detailStatus, mutateStatus, error } = useAppSelector((state) => state.questions);

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchQuestionById(questionId));
    }
  }, [dispatch, isEdit, questionId]);

  const isBusy = useMemo(
    () => detailStatus === 'loading' || mutateStatus === 'loading',
    [detailStatus, mutateStatus]
  );

  const resolvedText = formState.text ?? (isEdit ? selectedQuestion?.text : '') ?? '';
  const resolvedOptions =
    formState.options ??
    (isEdit
      ? [
          selectedQuestion?.options?.[0] || '',
          selectedQuestion?.options?.[1] || '',
          selectedQuestion?.options?.[2] || '',
          selectedQuestion?.options?.[3] || '',
        ]
      : ['', '', '', '']);
  const resolvedCorrectedAnswerIndex =
    formState.correctedAnswerIndex ?? (isEdit ? selectedQuestion?.correctedAnswerIndex : 0) ?? 0;
  const resolvedKeywords = formState.keywords ?? (isEdit ? selectedQuestion?.keywords?.join(', ') : '') ?? '';

  const handleOptionChange = (index, value) => {
    setFormState((prev) => {
      const options = [...(prev.options || resolvedOptions)];
      options[index] = value;
      return { ...prev, options };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      text: resolvedText,
      options: resolvedOptions.filter((option) => option.trim() !== ''),
      correctedAnswerIndex: Number(resolvedCorrectedAnswerIndex),
      keywords: resolvedKeywords
        ? resolvedKeywords.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
    };

    if (isEdit) {
      const result = await dispatch(updateQuestion({ questionId, payload }));
      if (!result.error) {
        navigate(`/questions/${questionId}`);
      }
      return;
    }

    const result = await dispatch(createQuestion(payload));
    if (result.error) return;

    const newQuestionId = result.payload?._id;

    if (quizId && newQuestionId) {
      const attachResult = await dispatch(addQuestionToQuiz({ quizId, payload: { _id: newQuestionId } }));
      if (!attachResult.error) {
        navigate(`/quizzes/${quizId}`);
      }
      return;
    }

    navigate('/questions');
  };

  return (
    <section className="glass-card p-4 p-md-5">
      <h1 className="h3 mb-2">{isEdit ? 'Edit Question' : 'Draft New Question'}</h1>
      {quizId && !isEdit ? (
        <p className="text-light-emphasis">Attaching to quiz: {quizId}</p>
      ) : null}

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <form onSubmit={handleSubmit} className="d-grid gap-3">
        <div>
          <label className="form-label">Question Text</label>
          <textarea
            className="form-control"
            rows="3"
            value={resolvedText}
            onChange={(event) => setFormState((prev) => ({ ...prev, text: event.target.value }))}
            required
          />
        </div>

        <div className="row g-2">
          {resolvedOptions.map((option, index) => (
            <div className="col-md-6" key={`form-option-${index}`}>
              <label className="form-label">Option {String.fromCharCode(65 + index)}</label>
              <input
                type="text"
                className="form-control"
                value={option}
                onChange={(event) => handleOptionChange(index, event.target.value)}
                required={index < 2}
              />
            </div>
          ))}
        </div>

        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label">Correct Option Index (0-3)</label>
            <input
              type="number"
              min="0"
              max="3"
              className="form-control"
              value={resolvedCorrectedAnswerIndex}
              onChange={(event) => setFormState((prev) => ({ ...prev, correctedAnswerIndex: event.target.value }))}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Keywords</label>
            <input
              type="text"
              className="form-control"
              value={resolvedKeywords}
              onChange={(event) => setFormState((prev) => ({ ...prev, keywords: event.target.value }))}
              placeholder="Science, Biology"
            />
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <Link to={quizId ? `/quizzes/${quizId}` : '/questions'} className="btn btn-outline-light">
            Cancel
          </Link>
          <button type="submit" className="btn btn-warning" disabled={isBusy}>
            {isBusy ? <LoadingSpinner label="Saving" /> : isEdit ? 'Update Question' : 'Save Question'}
          </button>
        </div>
      </form>
    </section>
  );
}
