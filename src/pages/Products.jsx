import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getProducts, deleteProduct } from '../api/products.js';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import ProductModal from '../components/ProductModal.jsx';
import ProductDetailsModal from '../components/ProductDetailsModal.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isAvailable, setIsAvailable] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    const availability = isAvailable === 'true' ? true : isAvailable === 'false' ? false : undefined;
    getProducts({ page, page_size: pageSize, search: search || undefined, is_available: availability })
      .then((response) => {
        const payload = response.data;
        setProducts(payload.data || []);
        setTotalPages(payload.total_pages || 1);
      })
      .catch((error) => {
        const message = error?.response?.data?.message || 'Unable to load products';
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, [page, isAvailable]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    loadProducts();
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteId);
      toast.success('Product deleted');
      setDeleteId(null);
      loadProducts();
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to delete product';
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p>Manage inventory and add new products.</p>
        </div>
        <button className="button" type="button" onClick={() => setIsModalOpen(true)}>Create product</button>
      </div>

      <div className="filter-panel">
        <form onSubmit={handleSearchSubmit} className="field-row">
          <div className="field">
            <label htmlFor="search">Search</label>
            <input id="search" value={search} onChange={handleSearch} placeholder="Search by SKU or product name" />
          </div>
          <div className="field">
            <label htmlFor="availability">Availability</label>
            <select id="availability" value={isAvailable} onChange={(event) => setIsAvailable(event.target.value)}>
              <option value="">All</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
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
                  <th>SKU</th>
                  <th>Name</th>
                  <th>UOM</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.sku}</td>
                    <td>{product.product_name}</td>
                    <td>{product.uom_name}</td>
                    <td>{product.price}</td>
                    <td>{product.available_quantity}</td>
                    <td>
                      <span className={`badge ${product.is_available ? 'badge-completed' : 'badge-cancelled'}`}>
                        {product.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>{new Date(product.created_at).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="button-secondary" type="button" onClick={() => { setSelectedProductId(product.id); setIsDetailsOpen(true); }}>
                        Details
                      </button>
                      <button className="button-secondary" type="button" onClick={() => handleDelete(product.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {!products.length && (
                  <tr>
                    <td colSpan="8" style={{ padding: '1.2rem', textAlign: 'center' }}>No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={() => { setIsModalOpen(false); loadProducts(); }} />
      <ProductDetailsModal isOpen={isDetailsOpen} productId={selectedProductId} onClose={() => setIsDetailsOpen(false)} />
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
