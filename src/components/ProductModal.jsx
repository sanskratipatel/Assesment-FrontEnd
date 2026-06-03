import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createProduct, getUoms } from '../api/products.js';

export default function ProductModal({ isOpen, onClose, onCreated }) {
  const [uoms, setUoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    sku: '',
    product_name: '',
    uom_name: '',
    price: '',
    unit_weight: '',
    available_quantity: '',
    minimum_quantity: ''
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    getUoms()
      .then((response) => {
        setUoms(response.data.data || []);
      })
      .catch(() => {
        toast.error('Unable to load UOM list');
      });
  }, [isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.sku.startsWith('P-')) {
      toast.error('SKU must start with P-');
      return;
    }

    if (Number(form.available_quantity) < Number(form.minimum_quantity)) {
      toast.error('Available quantity should be greater than or equal to minimum quantity');
      return;
    }

    setLoading(true);

    try {
      await createProduct({
        sku: form.sku,
        product_name: form.product_name,
        uom_name: form.uom_name,
        price: Number(form.price),
        unit_weight: Number(form.unit_weight),
        available_quantity: Number(form.available_quantity),
        minimum_quantity: Number(form.minimum_quantity)
      });
      toast.success('Product created successfully');
      setForm({ sku: '', product_name: '', uom_name: '', price: '', unit_weight: '', available_quantity: '', minimum_quantity: '' });
      onCreated();
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to create product';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" aria-modal="true">
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Create Product</h2>
            <button className="close-button" onClick={onClose} type="button">×</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label htmlFor="sku">SKU</label>
                <input name="sku" id="sku" value={form.sku} onChange={handleChange} placeholder="P-101" required />
              </div>
              <div className="field">
                <label htmlFor="product_name">Product Name</label>
                <input name="product_name" id="product_name" value={form.product_name} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="uom_name">UOM</label>
                <select name="uom_name" id="uom_name" value={form.uom_name} onChange={handleChange} required>
                  <option value="">Select unit</option>
                  {uoms.map((uom) => (
                    <option key={uom.id} value={uom.uom_name}>{uom.uom_name}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="price">Price</label>
                <input name="price" id="price" type="number" min="0" value={form.price} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="unit_weight">Unit Weight</label>
                <input name="unit_weight" id="unit_weight" type="number" min="0" value={form.unit_weight} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="available_quantity">Available Quantity</label>
                <input name="available_quantity" id="available_quantity" type="number" min="0" value={form.available_quantity} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="minimum_quantity">Minimum Quantity</label>
                <input name="minimum_quantity" id="minimum_quantity" type="number" min="0" value={form.minimum_quantity} onChange={handleChange} required />
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <button type="submit" className="button" disabled={loading}>{loading ? 'Creating...' : 'Create Product'}</button>
              <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
