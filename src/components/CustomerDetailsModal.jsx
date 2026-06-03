import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCustomerById } from '../api/customers.js';
import Loader from './Loader.jsx';

export default function CustomerDetailsModal({ isOpen, customerId, onClose }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !customerId) {
      setCustomer(null);
      return;
    }

    setLoading(true);
    getCustomerById(customerId)
      .then((response) => setCustomer(response.data.data || response.data))
      .catch((error) => {
        const message = error?.response?.data?.message || 'Unable to load customer details';
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, [isOpen, customerId]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" aria-modal="true">
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Customer Details</h2>
            <button className="close-button" onClick={onClose} type="button">×</button>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="field-row">
              <div className="field">
                <label>ID</label>
                <div>{customer ? `cus-${customer.id}` : '-'}</div>
              </div>
              <div className="field">
                <label>First Name</label>
                <div>{customer?.first_name ?? '-'}</div>
              </div>
              <div className="field">
                <label>Last Name</label>
                <div>{customer?.last_name ?? '-'}</div>
              </div>
              <div className="field">
                <label>Phone</label>
                <div>{customer?.phone ?? '-'}</div>
              </div>
              <div className="field">
                <label>Email</label>
                <div>{customer?.email ?? '-'}</div>
              </div>
              <div className="field">
                <label>Country Code</label>
                <div>{customer?.country_code ?? '-'}</div>
              </div>
              <div className="field">
                <label>Total Orders</label>
                <div>{customer?.total_orders ?? 0}</div>
              </div>
              <div className="field">
                <label>Created At</label>
                <div>{customer?.created_at ? new Date(customer.created_at).toLocaleString() : '-'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
