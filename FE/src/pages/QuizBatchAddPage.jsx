import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import { addManyQuestionsToQuiz } from '../features/quizzes/quizzesSlice';

const createQuestionDraft = () => ({
  text: '',
  options: ['', '', '', ''],
  correctedAnswerIndex: 0,
  keywords: '',
});

export default function QuizBatchAddPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { quizId } = useParams();
  const mutateStatus = useAppSelector((state) => state.quizzes.mutateStatus);
  const [questions, setQuestions] = useState([createQuestionDraft()]);

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((question, qIndex) => (qIndex === index ? { ...question, [field]: value } : question))
    );
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== qIndex) return question;
        const nextOptions = [...question.options];
        nextOptions[optIndex] = value;
        return { ...question, options: nextOptions };
      })
    );
  };

  const addBlock = () => setQuestions((prev) => [...prev, createQuestionDraft()]);

  const removeBlock = (index) => {
    setQuestions((prev) => prev.filter((_, qIndex) => qIndex !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = questions.map((question) => ({
      text: question.text,
      options: question.options.filter((opt) => opt.trim() !== ''),
      correctedAnswerIndex: Number(question.correctedAnswerIndex),
      keywords: question.keywords
        ? question.keywords.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
    }));

    const result = await dispatch(addManyQuestionsToQuiz({ quizId, payload }));
    if (!result.error) {
      navigate(`/quizzes/${quizId}`);
    }
  };

  return (
    <section className="glass-card p-4 p-md-5">
      <h1 className="h3 mb-4">Quickly Add Multiple Questions</h1>
      <p className="text-light-emphasis">You are adding a batch of questions to quiz: {quizId}</p>

      <form onSubmit={handleSubmit} className="d-grid gap-3">
        {questions.map((question, index) => (
          <article key={`question-${index}`} className="quiz-card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 m-0">Question #{index + 1}</h2>
              {index > 0 ? (
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeBlock(index)}>
                  Remove
                </button>
              ) : null}
            </div>

            <div className="mb-3">
              <label className="form-label">Question Text</label>
              <textarea
                className="form-control"
                rows="2"
                value={question.text}
                onChange={(event) => handleQuestionChange(index, 'text', event.target.value)}
                required
              />
            </div>

            <div className="row g-2 mb-3">
              {question.options.map((option, optIndex) => (
                <div className="col-md-6" key={`option-${optIndex}`}>
                  <label className="form-label">Option {String.fromCharCode(65 + optIndex)}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={option}
                    onChange={(event) => handleOptionChange(index, optIndex, event.target.value)}
                    required={optIndex < 2}
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
                  value={question.correctedAnswerIndex}
                  onChange={(event) => handleQuestionChange(index, 'correctedAnswerIndex', event.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Keywords (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={question.keywords}
                  onChange={(event) => handleQuestionChange(index, 'keywords', event.target.value)}
                />
              </div>
            </div>
          </article>
        ))}

        <button type="button" className="btn btn-outline-light" onClick={addBlock}>
          + Add Another Question Block
        </button>

        <div className="d-flex gap-2">
          <Link to={`/quizzes/${quizId}`} className="btn btn-outline-light">Cancel</Link>
          <button type="submit" className="btn btn-warning" disabled={mutateStatus === 'loading'}>
            {mutateStatus === 'loading' ? <LoadingSpinner label="Saving batch" /> : 'Save Entire Batch'}
          </button>
        </div>
      </form>
    </section>
  );
}
