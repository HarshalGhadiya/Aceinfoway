import { useMemo, useState } from 'react';

const DUMMY_PRODUCTS = [
  { id: 'P-100', name: 'Wireless Headphones', price: 129, stock: 42, category: 'Audio', sales: 1220 },
  { id: 'P-101', name: 'Smart Watch', price: 199, stock: 18, category: 'Wearables', sales: 930 },
  { id: 'P-102', name: 'Gaming Mouse', price: 59, stock: 75, category: 'Accessories', sales: 1470 },
  { id: 'P-103', name: '4K Monitor', price: 399, stock: 7, category: 'Displays', sales: 310 },
  { id: 'P-104', name: 'Mechanical Keyboard', price: 149, stock: 23, category: 'Accessories', sales: 860 },
];

export default function Products() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('sales_desc');

  const categories = useMemo(() => ['all', ...Array.from(new Set(DUMMY_PRODUCTS.map(p => p.category))).map(c => c.toLowerCase())], []);

  const filtered = useMemo(() => {
    let items = DUMMY_PRODUCTS.filter((p) => {
      const matchText = `${p.name} ${p.id}`.toLowerCase().includes(query.toLowerCase());
      const matchCat = category === 'all' ? true : p.category.toLowerCase() === category;
      return matchText && matchCat;
    });
    if (sort === 'sales_desc') items.sort((a, b) => b.sales - a.sales);
    if (sort === 'price_asc') items.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') items.sort((a, b) => b.price - a.price);
    return items;
  }, [query, category, sort]);

  return (
    <div className="content">
      <h2 style={{ marginTop: 0 }}>Products</h2>
      <div className="controls">
        <input className="input" placeholder="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="sales_desc">Best Sellers</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        {filtered.map((p) => (
          <div key={p.id} className="card">
            <h3>{p.name}</h3>
            <div className="muted">{p.category}</div>
            <div className="spacer" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><strong>$ {p.price.toFixed(2)}</strong></div>
              <div className={`badge ${p.stock < 10 ? 'red' : 'green'}`}>{p.stock < 10 ? 'Low stock' : `${p.stock} in stock`}</div>
            </div>
            <div className="muted" style={{ marginTop: 8 }}>Sales: {p.sales}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


