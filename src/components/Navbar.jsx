import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Products', path: '/products' },
  { label: 'Customers', path: '/customers' },
  { label: 'Orders', path: '/orders' }
];

export default function Navbar() {
  return (
    <header className="card" style={{ margin: '1rem', borderRadius: '24px' }}>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Inventory Management</div>
        <div style={{ flex: 1 }} />
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              padding: '0.75rem 1rem',
              borderRadius: '14px',
              textDecoration: 'none',
              color: isActive ? '#ffffff' : '#0f172a',
              background: isActive ? '#0f172a' : 'transparent'
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
