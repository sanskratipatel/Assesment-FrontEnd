import { useState } from 'react';
import { toast } from 'react-toastify';
import { createCustomer } from '../api/customers.js';

export default function CustomerModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    country_code: '+91'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const phoneValue = form.phone.trim();
    const emailValue = form.email.trim().toLowerCase();
    const countryCode = form.country_code.trim() || '+91';

    if (!form.first_name.trim() || !form.last_name.trim()) {
      toast.error('First name and last name are required');
      setLoading(false);
      return;
    }

    if (!/^[0-9]{10}$/.test(phoneValue)) {
      toast.error('Phone number must be 10 digits');
      setLoading(false);
      return;
    }

    if (!emailValue) {
      toast.error('Email is required');
      setLoading(false);
      return;
    }

    try {
      await createCustomer({
        ...form,
        phone: phoneValue,
        email: emailValue,
        country_code: countryCode
      });
      toast.success('Customer created successfully');
      setForm({ first_name: '', last_name: '', phone: '', email: '', country_code: '+91' });
      onCreated();
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to create customer';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" aria-modal="true">
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Create Customer</h2>
            <button className="close-button" onClick={onClose} type="button">×</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label htmlFor="first_name">First Name</label>
                <input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="last_name">Last Name</label>
                <input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="country_code">Country Code</label>
                <input id="country_code" name="country_code" value={form.country_code} onChange={handleChange} required />
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <button type="submit" className="button" disabled={loading}>{loading ? 'Creating...' : 'Create Customer'}</button>
              <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
