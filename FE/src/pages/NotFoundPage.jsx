import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="glass-card p-5 text-center">
      <h1 className="display-6">Page Not Found</h1>
      <p className="text-light-emphasis">The page you requested does not exist.</p>
      <Link className="btn btn-warning" to="/">Back to Home</Link>
    </div>
  );
}
