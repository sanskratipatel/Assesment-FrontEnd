export default function ConfirmModal({ isOpen, title = 'Confirm', message, onConfirm, onCancel, confirmLabel = 'Confirm', loading = false }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" aria-modal="true">
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="close-button" onClick={onCancel} type="button">×</button>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ margin: 0, color: '#334155' }}>{message}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" className="button-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
            <button type="button" className="button" onClick={onConfirm} disabled={loading}>{loading ? 'Deleting...' : confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
