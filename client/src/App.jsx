import { useEffect, useState } from 'react';
import Header from './components/layout/Header.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Footer from './components/layout/Footer.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Orders from './pages/Orders.jsx';
import Products from './pages/Products.jsx';
import Campaigns from './pages/Campaigns.jsx';
import './index.css';

function getRouteFromHash() {
  const hash = window.location.hash || '#/dashboard';
  const normalized = hash.toLowerCase();
  if (normalized.startsWith('#/orders')) return 'orders';
  if (normalized.startsWith('#/products')) return 'products';
  if (normalized.startsWith('#/campaigns')) return 'campaigns';
  return 'dashboard';
}

export default function App() {
  const [route, setRoute] = useState(getRouteFromHash());

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className="app">
      <Sidebar active={route} />
      <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto' }}>
        <Header />
        {route === 'dashboard' && <Dashboard />}
        {route === 'orders' && <Orders />}
        {route === 'products' && <Products />}
        {route === 'campaigns' && <Campaigns />}
        <Footer />
      </div>
    </div>
  );
}
