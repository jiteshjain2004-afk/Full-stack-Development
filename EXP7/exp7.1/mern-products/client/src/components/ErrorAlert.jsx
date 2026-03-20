const ErrorAlert = ({ message, onRetry }) => (
  <div className="alert alert-danger d-flex align-items-start gap-3 shadow-sm" role="alert">
    <i className="bi bi-exclamation-triangle-fill fs-4 text-danger mt-1" />
    <div className="flex-grow-1">
      <h5 className="alert-heading mb-1">Failed to load products</h5>
      <p className="mb-2 small">{message}</p>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1" />
          Retry
        </button>
      )}
    </div>
  </div>
);

export default ErrorAlert;
