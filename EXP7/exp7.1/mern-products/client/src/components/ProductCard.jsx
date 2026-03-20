const ProductCard = ({ product }) => {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="col-sm-6 col-md-4 col-lg-3">
      <div className="card h-100 shadow-sm border-0 product-card">
        {/* Icon banner */}
        <div
          className="card-img-top d-flex align-items-center justify-content-center bg-primary bg-opacity-10"
          style={{ height: '140px' }}
        >
          <i className="bi bi-box-seam text-primary" style={{ fontSize: '3.5rem' }} />
        </div>

        <div className="card-body d-flex flex-column">
          <h6 className="card-title fw-bold text-dark mb-1">{product.name}</h6>
          <p className="text-muted small mb-3">
            ID: <span className="font-monospace">{product._id.slice(-6).toUpperCase()}</span>
          </p>

          <div className="mt-auto d-flex align-items-center justify-content-between">
            <span className="badge bg-primary fs-6 px-3 py-2">{formattedPrice}</span>
            <span className="badge bg-success-subtle text-success border border-success-subtle">
              <i className="bi bi-check-circle me-1" />
              In Stock
            </span>
          </div>
        </div>

        <div className="card-footer bg-transparent border-0 pb-3 px-3">
          <small className="text-muted d-flex align-items-center gap-1">
            <i className="bi bi-calendar3" />
            {new Date(product.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
            })}
          </small>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
