export default function Sidebar({ active = 'dashboard' }) {
  const linkClass = (key) => `nav-link ${active === key ? 'active' : ''}`;
  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #22c55e, #06b6d4)' }} />
        <h2 style={{ margin: 0, fontSize: 16 }}>Ace Analytics</h2>
      </div>
      <nav className="nav">
        <a href="#/dashboard" className={linkClass('dashboard')}>Overview</a>
        <a href="#/orders" className={linkClass('orders')}>Orders</a>
        <a href="#/products" className={linkClass('products')}>Products</a>
        <a href="#/campaigns" className={linkClass('campaigns')}>Campaigns</a>
      </nav>
      <div style={{ marginTop: 24, fontSize: 12, color: '#64748b' }}>© {new Date().getFullYear()} Ace</div>
    </aside>
  );
}
