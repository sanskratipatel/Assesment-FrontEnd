import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCustomers } from '../api/customers.js';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import CustomerModal from '../components/CustomerModal.jsx';
import CustomerDetailsModal from '../components/CustomerDetailsModal.jsx';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const loadCustomers = () => {
    setLoading(true);
    const params = { page, page_size: pageSize };
    if (search.trim()) {
      params.search = search.trim();
    }

    getCustomers(params)
      .then((response) => {
        console.log('Customers response:', response);
        const payload = response.data;
        const customersData = Array.isArray(payload.data) ? payload.data : payload.data?.data || [];
        setCustomers(customersData);
        setTotalPages(payload.total_pages ?? payload.totalPages ?? 1);
      })
      .catch((error) => {
        console.error('Failed to load customers:', error);
        toast.error('Unable to load customers');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers();
  }, [page]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    loadCustomers();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p>Manage customer records and add new contacts.</p>
        </div>
        <button className="button" type="button" onClick={() => setIsModalOpen(true)}>Create customer</button>
      </div>

      <div className="filter-panel">
        <form onSubmit={handleSearchSubmit} className="field-row">
          <div className="field">
            <label htmlFor="search">Search</label>
            <input id="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or phone" />
          </div>
          <div className="field" style={{ alignSelf: 'end' }}>
            <button className="button" type="submit">Search</button>
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
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Country Code</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>cus-{customer.id}</td>
                    <td>{customer.first_name} {customer.last_name}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.email}</td>
                    <td>{customer.country_code}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="button-secondary" type="button" onClick={() => { setSelectedCustomerId(customer.id); setIsDetailsOpen(true); }}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {!customers.length && (
                  <tr>
                    <td colSpan="6" style={{ padding: '1.2rem', textAlign: 'center' }}>No customers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <CustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={() => { setIsModalOpen(false); loadCustomers(); }} />
      <CustomerDetailsModal isOpen={isDetailsOpen} customerId={selectedCustomerId} onClose={() => setIsDetailsOpen(false)} />
    </div>
  );
}
