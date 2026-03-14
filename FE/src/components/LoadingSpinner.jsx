export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="d-flex align-items-center gap-2 text-light-emphasis">
      <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
