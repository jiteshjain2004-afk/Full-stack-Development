import { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { fetchProducts } from './api';
import Loader from './components/Loader';
import ErrorAlert from './components/ErrorAlert';
import ProductCard from './components/ProductCard';
import AddProductModal from './components/AddProductModal';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchProducts();
      setProducts(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to reach server. Make sure the backend is running on port 5000.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-vh-100 bg-light">
      {/* ── Navbar ── */}
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2">
            <i className="bi bi-shop" />
            ProductHub
          </span>
          <span className="badge bg-light text-primary fs-6">
            {products.length} Products
          </span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="bg-primary text-white py-4 mb-4">
        <div className="container">
          <h2 className="fw-bold mb-1">Product Catalogue</h2>
          <p className="mb-0 opacity-75">
            Fetched live from MongoDB via Express REST API
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container pb-5">

        {/* Toolbar */}
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
          <div className="input-group" style={{ maxWidth: '340px' }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={loadProducts}>
              <i className="bi bi-arrow-clockwise" />
              Refresh
            </button>
            <AddProductModal onProductAdded={handleProductAdded} />
          </div>
        </div>

        {/* States */}
        {loading && <Loader />}
        {!loading && error && <ErrorAlert message={error} onRetry={loadProducts} />}

        {/* Grid */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox fs-1 d-block mb-3" />
                <h5>No products found</h5>
                <p className="small">
                  {search ? 'Try a different search term.' : 'Add your first product using the button above.'}
                </p>
              </div>
            ) : (
              <>
                <p className="text-muted small mb-3">
                  Showing <strong>{filtered.length}</strong> of <strong>{products.length}</strong> products
                </p>
                <div className="row g-4">
                  {filtered.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="border-top py-3 bg-white text-center text-muted small mt-auto">
        <div className="container">
          Experiment 2.3.1 — MERN Full Stack Integration &nbsp;|&nbsp;
          <span className="text-primary fw-semibold">React + Express + MongoDB</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
