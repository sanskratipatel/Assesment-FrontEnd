import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOrderById, updateOrderStatus } from '../api/orders.js';
import Loader from '../components/Loader.jsx';

const statusOptions = [
  { value: 'COMPLETED', label: 'Mark Completed' },
  { value: 'CANCELLED', label: 'Cancel Order' }
];

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('COMPLETED');
  const [remarks, setRemarks] = useState('');

  const loadOrder = () => {
    setLoading(true);
    getOrderById(id)
      .then((response) => setOrder(response.data.data || response.data))
      .catch(() => {
        toast.error('Unable to load order details');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!order || ['COMPLETED', 'CANCELLED'].includes(order.status)) {
      toast.error('Order status cannot be updated');
      return;
    }

    if (status === 'CANCELLED' && !remarks.trim()) {
      toast.error('Remarks are required when cancelling an order');
      return;
    }

    setLoading(true);
    try {
      await updateOrderStatus(id, { status, remarks });
      toast.success('Order status updated');
      loadOrder();
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to update status';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (value) => {
    if (value === 'COMPLETED') return 'badge-completed';
    if (value === 'CANCELLED') return 'badge-cancelled';
    return 'badge-pending';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Order Details</h1>
          <p>Review customer, items, and status.</p>
        </div>
        <button className="button-secondary" type="button" onClick={() => navigate('/orders')}>Back to orders</button>
      </div>

      {loading && <Loader />}

      {!loading && order && (
        <>
          <div className="status-banner">
            <div className="status-left">
              <div>
                <h2 style={{ margin: 0 }}>Order #{order.id}</h2>
                <p style={{ margin: '0.4rem 0 0' }}>
                  <span className={`status-badge-large ${order.status === 'PENDING' ? 'pending' : order.status === 'COMPLETED' ? 'completed' : 'cancelled'}`}>
                    {order.status}
                  </span>
                </p>
              </div>
              <div style={{ minWidth: '180px', color: '#64748b' }}>
                <p style={{ margin: 0 }}><strong>Created:</strong> {new Date(order.created_at).toLocaleString()}</p>
                <p style={{ margin: '0.4rem 0 0' }}><strong>Total Amount:</strong> {order.total_amount}</p>
                <p style={{ margin: '0.4rem 0 0' }}><strong>Total Weight:</strong> {order.total_weight}</p>
              </div>
            </div>
            <div className="status-actions">
              <button className="button-secondary" type="button" onClick={() => navigate('/orders')}>Back</button>
              {order.status === 'PENDING' && (
                <button
                  className="button"
                  type="button"
                  onClick={() => document.getElementById('update-status-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                >
                  Update
                </button>
              )}
            </div>
          </div>

          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3>Customer</h3>
            <p><strong>ID:</strong> cus-{order.customer.id}</p>
            <p>{order.customer.first_name} {order.customer.last_name}</p>
            <p>{order.customer.phone}</p>
            <p>{order.customer.email}</p>
          </div>

          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3>Items</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.sku}</td>
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit_price}</td>
                      <td>{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {order.status === 'PENDING' && (
            <div className="card" id="update-status-card">
              <h3>Update Status</h3>
              <form onSubmit={handleSubmit} className="field-row">
                <div className="field">
                  <label htmlFor="status">New Status</label>
                  <select id="status" value={status} onChange={(event) => setStatus(event.target.value)}>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="field" style={{ minWidth: '280px' }}>
                  <label htmlFor="remarks">Remarks</label>
                  <textarea id="remarks" value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Optional remarks" />
                </div>
                <div style={{ alignSelf: 'end', display: 'flex', gap: '0.75rem' }}>
                  <button className="button" type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Status'}</button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
