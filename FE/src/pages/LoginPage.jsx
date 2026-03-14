import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuthError, loginUser } from '../features/auth/authSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, token } = useAppSelector((state) => state.auth);
  const [formState, setFormState] = useState({ username: '', password: '' });

  useEffect(() => {
    if (token) {
      const destination = location.state?.from?.pathname || '/quizzes';
      navigate(destination, { replace: true });
    }
  }, [token, navigate, location]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginUser(formState));
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-5">
        <div className="glass-card p-4 p-md-5">
          <h1 className="h3 mb-3">Sign In to Quiz Atlas</h1>
          <p className="text-light-emphasis">Use your account to access quizzes and question bank features.</p>

          {error ? <div className="alert alert-danger">{error}</div> : null}

          <form onSubmit={handleSubmit} className="d-grid gap-3">
            <div>
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                value={formState.username}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formState.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-warning" disabled={status === 'loading'}>
              {status === 'loading' ? <LoadingSpinner label="Signing in" /> : 'Sign In'}
            </button>
          </form>

          <p className="mt-3 mb-0 text-light-emphasis">
            No account yet? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
