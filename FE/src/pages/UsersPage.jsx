import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchUsers } from '../features/users/usersSlice';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 m-0">All Users</h1>
      </div>

      {status === 'loading' ? <LoadingSpinner label="Fetching users" /> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="glass-card p-3 p-md-4">
        {items.length ? (
          <div className="table-responsive">
            <table className="table table-dark table-striped table-borderless align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>User ID</th>
                </tr>
              </thead>
              <tbody>
                {items.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.admin ? <span className="badge text-bg-warning">Admin</span> : <span className="badge text-bg-secondary">User</span>}
                    </td>
                    <td><small>{user._id}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-light-emphasis m-0">No users found.</p>
        )}
      </div>
    </section>
  );
}
