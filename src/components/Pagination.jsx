export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let number = start; number <= end; number += 1) {
    pageNumbers.push(number);
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
      <button className="button-secondary" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        Previous
      </button>
      {start > 1 && (
        <button className="button-secondary" onClick={() => onPageChange(1)}>1</button>
      )}
      {start > 2 && <span style={{ alignSelf: 'center' }}>...</span>}
      {pageNumbers.map((page) => (
        <button
          key={page}
          className="button-secondary"
          style={page === currentPage ? { background: '#0f172a', color: '#fff' } : {}}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      {end < totalPages - 1 && <span style={{ alignSelf: 'center' }}>...</span>}
      {end < totalPages && (
        <button className="button-secondary" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
      )}
      <button className="button-secondary" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Next
      </button>
    </div>
  );
}
