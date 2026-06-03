import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getDashboardStats } from '../api/dashboard.js';
import Loader from '../components/Loader.jsx';

const stats = [
  { key: 'total_products', label: 'Total Products' },
  { key: 'total_customers', label: 'Total Customers' },
  { key: 'total_orders', label: 'Total Orders' },
  { key: 'pending_orders', label: 'Pending Orders' },
  { key: 'completed_orders', label: 'Completed Orders' },
  { key: 'cancelled_orders', label: 'Cancelled Orders' },
  { key: 'low_stock_products', label: 'Low Stock Products' }
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDashboardStats()
      .then((response) => {
        console.log('Dashboard response:', response);
        setData(response.data.data);
      })
      .catch((error) => {
        console.error('Dashboard error:', error);
        toast.error('Unable to load dashboard stats');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p>Overview of inventory, customers, and orders.</p>
        </div>
      </div>

      {loading && <Loader />}

      {!loading && !data && (
        <div className="alert" style={{ marginTop: '1rem' }}>
          No data available. Please check the console for errors.
        </div>
      )}

      {!loading && data && (
        <>
          <div className="card-grid">
            {stats.map((stat) => (
              <div key={stat.key} className="card">
                <h3>{stat.label}</h3>
                <p>{data[stat.key] ?? 0}</p>
              </div>
            ))}
          </div>

          <div className="chart-card card">
            <div className="chart-card__content">
              <div className="round-chart" style={{ background: data.total_orders > 0 ? `conic-gradient(#f59e0b 0 ${Math.round((data.pending_orders / data.total_orders) * 360)}deg, #22c55e ${Math.round((data.pending_orders / data.total_orders) * 360)}deg ${Math.round(((data.pending_orders + data.completed_orders) / data.total_orders) * 360)}deg, #ef4444 ${Math.round(((data.pending_orders + data.completed_orders) / data.total_orders) * 360)}deg 360deg)` : '#e2e8f0' }}>
                <div className="round-chart__center">
                  <span>{data.total_orders}</span>
                  <small>Orders</small>
                </div>
              </div>
              <div className="chart-legend">
                <div><span className="legend-dot pending" /> Pending</div>
                <div><span className="legend-dot completed" /> Completed</div>
                <div><span className="legend-dot cancelled" /> Cancelled</div>
              </div>
            </div>
          </div>

          {data.low_stock_products > 0 && (
            <div className="alert" style={{ marginTop: '1rem' }}>
              There are {data.low_stock_products} low stock product(s). Please review your inventory.
            </div>
          )}
        </>
      )}
    </div>
  );
}
