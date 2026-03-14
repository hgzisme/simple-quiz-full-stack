import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

export default function Layout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="site-header py-3">
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3">
          <Link to="/" className="brand-mark text-decoration-none">
            <span className="brand-dot" />
            <div>
              <p className="m-0 brand-title">Quiz Atlas</p>
              <small className="brand-subtitle">Full-stack learning arena</small>
            </div>
          </Link>

          {user ? (
            <div className="d-flex align-items-center gap-3 flex-wrap justify-content-end">
              <nav className="d-flex gap-2 flex-wrap">
                <NavLink to="/" className="btn btn-sm btn-outline-light">Home</NavLink>
                <NavLink to="/quizzes" className="btn btn-sm btn-outline-light">Quizzes</NavLink>
                <NavLink to="/questions" className="btn btn-sm btn-outline-light">Question Bank</NavLink>
                {user.admin ? (
                  <NavLink to="/admin/users" className="btn btn-sm btn-outline-warning">Users</NavLink>
                ) : null}
              </nav>

              <div className="user-chip">
                <i className="bi bi-person-circle me-2" />
                {user.username}
                {user.admin ? <span className="badge text-bg-warning ms-2">Admin</span> : null}
              </div>

              <button type="button" className="btn btn-sm btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <nav className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-warning btn-sm">Sign Up</Link>
            </nav>
          )}
        </div>
      </header>

      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  );
}
