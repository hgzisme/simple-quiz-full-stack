import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuthError, signupUser } from '../features/auth/authSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, token } = useAppSelector((state) => state.auth);
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    admin: false,
    adminCode: '',
  });

  useEffect(() => {
    if (token) {
      navigate('/quizzes', { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(signupUser(formState));
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-10 col-lg-6">
        <div className="glass-card p-4 p-md-5">
          <h1 className="h3 mb-3">Create an Account</h1>
          <p className="text-light-emphasis">Admins can manage quizzes and questions. Learners can take quizzes.</p>

          {error ? <div className="alert alert-danger">{error}</div> : null}

          <form onSubmit={handleSubmit} className="d-grid gap-3">
            <div>
              <label className="form-label">Username</label>
              <input type="text" name="username" className="form-control" value={formState.username} onChange={handleChange} required />
            </div>

            <div>
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={formState.email} onChange={handleChange} required />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input type="password" name="password" minLength="6" className="form-control" value={formState.password} onChange={handleChange} required />
            </div>

            <div className="form-check mt-2">
              <input className="form-check-input" type="checkbox" name="admin" id="admin" checked={formState.admin} onChange={handleChange} />
              <label className="form-check-label" htmlFor="admin">Create as Admin Account</label>
            </div>

            <div>
              <label className="form-label">Admin Verification Code</label>
              <input
                type="password"
                name="adminCode"
                className="form-control"
                value={formState.adminCode}
                onChange={handleChange}
                placeholder="Required only for admin signup"
              />
            </div>

            <button type="submit" className="btn btn-warning" disabled={status === 'loading'}>
              {status === 'loading' ? <LoadingSpinner label="Creating account" /> : 'Create Account'}
            </button>
          </form>

          <p className="mt-3 mb-0 text-light-emphasis">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
