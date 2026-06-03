import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOrders } from '../api/orders.js';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import OrderModal from '../components/OrderModal.jsx';

const statusOptions = ['', 'PENDING', 'COMPLETED', 'CANCELLED'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadOrders = () => {
    setLoading(true);
    const params = { page, page_size: pageSize };
    if (search.trim()) {
      params.search = search.trim();
    }
    if (status) {
      params.status = status;
    }

    getOrders(params)
      .then((response) => {
        console.log('Orders response:', response);
        const payload = response.data;
        const ordersData = Array.isArray(payload.data) ? payload.data : payload.data?.data || [];
        setOrders(ordersData);
        setTotalPages(payload.total_pages ?? payload.totalPages ?? 1);
      })
      .catch((error) => {
        console.error('Failed to load orders:', error);
        toast.error('Unable to load orders');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, [page, status]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    loadOrders();
  };

  const statusClass = (value) => {
    if (value === 'COMPLETED') return 'badge-completed';
    if (value === 'CANCELLED') return 'badge-cancelled';
    return 'badge-pending';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p>View orders, filter by status, and create new orders.</p>
        </div>
        <button className="button" type="button" onClick={() => setIsModalOpen(true)}>Create order</button>
      </div>

      <div className="filter-panel">
        <form onSubmit={handleSubmit} className="field-row">
          <div className="field">
            <label htmlFor="search">Search</label>
            <input id="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by order id or customer" />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" value={status} onChange={(event) => setStatus(event.target.value)}>
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option || 'All'}</option>
              ))}
            </select>
          </div>
          <div className="field" style={{ alignSelf: 'end' }}>
            <button className="button" type="submit">Apply</button>
          </div>
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total Amount</th>
                  <th>Items</th>
                  <th>Weight</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/orders/${order.id}`)}>
                    <td>#{order.id}</td>
                    <td>{order.customer_name}</td>
                    <td><span className={`badge ${statusClass(order.status)}`}>{order.status}</span></td>
                    <td>{order.total_amount}</td>
                    <td>{order.total_items}</td>
                    <td>{order.total_weight}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!orders.length && (
                  <tr>
                    <td colSpan="7" style={{ padding: '1.2rem', textAlign: 'center' }}>No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <OrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={() => { setIsModalOpen(false); loadOrders(); }} />
    </div>
  );
}
