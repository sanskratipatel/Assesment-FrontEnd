import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getProductById } from '../api/products.js';
import Loader from './Loader.jsx';

export default function ProductDetailsModal({ isOpen, productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !productId) {
      setProduct(null);
      return;
    }

    setLoading(true);
    getProductById(productId)
      .then((response) => setProduct(response.data.data || response.data))
      .catch((error) => {
        const message = error?.response?.data?.message || 'Unable to load product details';
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, [isOpen, productId]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" aria-modal="true">
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Product Details</h2>
            <button className="close-button" onClick={onClose} type="button">×</button>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="field-row">
              <div className="field">
                <label>ID</label>
                <div>{product?.id ?? '-'}</div>
              </div>
              <div className="field">
                <label>SKU</label>
                <div>{product?.sku ?? '-'}</div>
              </div>
              <div className="field">
                <label>Product Name</label>
                <div>{product?.product_name ?? '-'}</div>
              </div>
              <div className="field">
                <label>UOM</label>
                <div>{product?.uom_name ?? 'N/A'}</div>
              </div>
              <div className="field">
                <label>Price</label>
                <div>{product?.price ?? '-'}</div>
              </div>
              <div className="field">
                <label>Unit Weight</label>
                <div>{product?.unit_weight ?? '-'}</div>
              </div>
              <div className="field">
                <label>Available Quantity</label>
                <div>{product?.available_quantity ?? '-'}</div>
              </div>
              <div className="field">
                <label>Minimum Quantity</label>
                <div>{product?.minimum_quantity ?? '-'}</div>
              </div>
              <div className="field">
                <label>Status</label>
                <div>{product?.is_available ? 'Available' : 'Unavailable'}</div>
              </div>
              <div className="field">
                <label>Created at</label>
                <div>{product?.created_at ? new Date(product.created_at).toLocaleString() : '-'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
