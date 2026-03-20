const Loader = () => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5">
    <div
      className="spinner-border text-primary"
      style={{ width: '3.5rem', height: '3.5rem' }}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="mt-3 text-muted fw-semibold">Fetching products from server…</p>
  </div>
);

export default Loader;
