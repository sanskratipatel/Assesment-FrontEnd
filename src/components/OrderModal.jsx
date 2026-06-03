import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { customerSuggestions, createOrder, productSuggestions } from '../api/orders.js';

export default function OrderModal({ isOpen, onClose, onCreated }) {
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [customerOptions, setCustomerOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [items, setItems] = useState([]);
  const [itemQty, setItemQty] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCustomerSearch('');
      setProductSearch('');
      setCustomerOptions([]);
      setProductOptions([]);
      setSelectedCustomer(null);
      setItems([]);
      setItemQty(1);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!customerSearch || customerSearch.length < 2) {
      setCustomerOptions([]);
      return;
    }

    const timeout = setTimeout(() => {
      customerSuggestions(customerSearch)
        .then((response) => setCustomerOptions(response.data.data || []))
        .catch(() => setCustomerOptions([]));
    }, 250);

    return () => clearTimeout(timeout);
  }, [customerSearch]);

  useEffect(() => {
    if (!productSearch || productSearch.length < 2) {
      setProductOptions([]);
      return;
    }

    const timeout = setTimeout(() => {
      productSuggestions(productSearch)
        .then((response) => setProductOptions(response.data.data || []))
        .catch(() => setProductOptions([]));
    }, 250);

    return () => clearTimeout(timeout);
  }, [productSearch]);

  const handleAddItem = (product) => {
    if (!product) {
      return;
    }

    const quantityToAdd = Math.max(1, itemQty);
    const existing = items.find((item) => item.product_id === product.id);
    if (existing) {
      setItems((prev) => prev.map((item) => item.product_id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item));
    } else {
      setItems((prev) => [...prev, { product_id: product.id, product_name: product.product_name || product.sku, sku: product.sku, quantity: quantityToAdd }]);
    }
    setProductSearch('');
    setProductOptions([]);
    setItemQty(1);
  };

  const updateItemQuantity = (productId, newQty) => {
    setItems((prev) => prev.map((item) => (item.product_id === productId ? { ...item, quantity: Math.max(1, newQty) } : item)));
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const statusText = useMemo(() => {
    if (!selectedCustomer) {
      return 'Select a customer from suggestions or type at least 2 characters.';
    }
    if (!items.length) {
      return 'Add at least one product to create an order.';
    }
    return 'Ready to submit order.';
  }, [items.length, selectedCustomer]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }
    if (!items.length) {
      toast.error('Please add at least one item');
      return;
    }

    setLoading(true);
    try {
      await createOrder({
        customer_id: selectedCustomer.id,
        items: items.map((item) => ({ product_id: item.product_id, quantity: item.quantity }))
      });
      toast.success('Order created successfully');
      onCreated();
      onClose();
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to create order';
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
            <h2>Create Order</h2>
            <button className="close-button" onClick={onClose} type="button">×</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field" style={{ minWidth: '300px' }}>
                <label htmlFor="customerSearch">Customer</label>
                <input
                  id="customerSearch"
                  value={selectedCustomer ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}` : customerSearch}
                  onChange={(event) => {
                    setSelectedCustomer(null);
                    setCustomerSearch(event.target.value);
                  }}
                  placeholder="Search customer by name or phone"
                />
                {customerOptions.length > 0 && !selectedCustomer && (
                  <ul className="suggestion-list">
                    {customerOptions.map((customer) => (
                      <li
                        key={customer.id}
                        className="suggestion-item"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setCustomerOptions([]);
                          setCustomerSearch('');
                        }}
                      >
                        {customer.first_name} {customer.last_name} · {customer.phone}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="field" style={{ minWidth: '300px' }}>
                <label htmlFor="productSearch">Product</label>
                <input
                  id="productSearch"
                  value={productSearch}
                  onChange={(event) => setProductSearch(event.target.value)}
                  placeholder="Search product by SKU or name"
                />
                {productOptions.length > 0 && (
                  <ul className="suggestion-list">
                    {productOptions.map((product) => (
                      <li
                        key={product.id}
                        className="suggestion-item"
                        onClick={() => handleAddItem(product)}
                      >
                        {product.sku} · {product.product_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="field" style={{ minWidth: '180px' }}>
                <label htmlFor="itemQty">Quantity</label>
                <input
                  id="itemQty"
                  type="number"
                  min="1"
                  value={itemQty}
                  onChange={(event) => setItemQty(Number(event.target.value))}
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: '0.75rem', fontWeight: 700, color: '#334155' }}>Order Items</div>
              {items.length === 0 && <p style={{ margin: 0, color: '#475569' }}>No items added yet.</p>}
              {items.map((item) => (
                <div key={item.product_id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem', padding: '0.95rem', border: '1px solid rgba(148, 163, 184, 0.25)', borderRadius: '16px' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.product_name}</div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{item.sku}</div>
                  </div>
                  <input type="number" min="1" value={item.quantity} onChange={(event) => updateItemQuantity(item.product_id, Number(event.target.value))} />
                  <button type="button" className="button-secondary" style={{ padding: '0.65rem 0.95rem' }} onClick={() => removeItem(item.product_id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="status-banner">
              <p style={{ margin: 0 }}>{statusText}</p>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <button type="submit" className="button" disabled={loading}>{loading ? 'Creating...' : 'Create Order'}</button>
              <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
