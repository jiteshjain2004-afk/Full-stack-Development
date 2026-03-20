import { useState } from 'react';
import { createProduct } from '../api';

const AddProductModal = ({ onProductAdded }) => {
  const [form, setForm] = useState({ name: '', price: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.price) {
      setError('Both name and price are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await createProduct({ name: form.name.trim(), price: Number(form.price) });
      onProductAdded(res.data.data);
      setForm({ name: '', price: '' });
      // close modal programmatically
      document.getElementById('closeAddModal').click();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        className="btn btn-primary d-flex align-items-center gap-2"
        data-bs-toggle="modal"
        data-bs-target="#addProductModal"
      >
        <i className="bi bi-plus-circle" />
        Add Product
      </button>

      {/* Modal */}
      <div className="modal fade" id="addProductModal" tabIndex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="addProductModalLabel">
                <i className="bi bi-plus-circle me-2" />
                New Product
              </h5>
              <button
                id="closeAddModal"
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                {error && (
                  <div className="alert alert-danger py-2 small">
                    <i className="bi bi-exclamation-circle me-2" />
                    {error}
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="e.g. Wireless Mouse"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Price (₹)</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      placeholder="0"
                      min="0"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Saving…</>
                  ) : (
                    <><i className="bi bi-check-lg me-2" />Save Product</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProductModal;
