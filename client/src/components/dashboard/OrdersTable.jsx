import { useEffect, useMemo, useState } from 'react';
import { getOrders } from '../../api/http.js';

export default function OrdersTable() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ from: '', to: '', campaign: '', product: '' });
  const [sortBy, setSortBy] = useState({ field: 'placedAt', dir: 'desc' });

  useEffect(() => { load(); }, [page, limit, filters]);

  async function load() {
    setLoading(true);
    const { data, total } = await getOrders({ page, limit, ...filters });
    setRows(data);
    setTotal(total);
    setLoading(false);
  }

  const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Orders</h3>
        <div className="controls">
          <input className="input" type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} />
          <input className="input" type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} />
          <input className="input" placeholder="Campaign Id" value={filters.campaign} onChange={e => setFilters(f => ({ ...f, campaign: e.target.value }))} />
          <input className="input" placeholder="Product Id" value={filters.product} onChange={e => setFilters(f => ({ ...f, product: e.target.value }))} />
          <select className="select" value={limit} onChange={e => { setLimit(parseInt(e.target.value)); setPage(1); }}>
            {[10,20,50].map(n => <option key={n} value={n}>{n}/page</option>)}
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => setSortBy(s => ({ field: 'placedAt', dir: s.field==='placedAt' && s.dir==='asc' ? 'desc' : 'asc' }))}>Date</th>
              <th style={{ cursor: 'pointer' }} onClick={() => setSortBy(s => ({ field: 'customer.name', dir: s.field==='customer.name' && s.dir==='asc' ? 'desc' : 'asc' }))}>Customer</th>
              <th>Items</th>
              <th>Discounts</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan="4">No data</td></tr>
            ) : [...rows].sort((a,b) => {
                const dir = sortBy.dir === 'asc' ? 1 : -1;
                if (sortBy.field === 'placedAt') return (new Date(a.placedAt) - new Date(b.placedAt)) * dir;
                if (sortBy.field === 'customer.name') return ((a.customer?.name||'').localeCompare(b.customer?.name||'')) * dir;
                return 0;
              }).map(o => (
              <tr key={o._id}>
                <td>
                  <div>{new Date(o.placedAt).toLocaleDateString()}</div>
                  <div className="cell-muted">{new Date(o.placedAt).toLocaleTimeString()}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{o.customer?.name || '—'}</div>
                  {o.customer?.email && <div className="cell-muted">{o.customer.email}</div>}
                </td>
                <td>
                  <div className="cell-muted">
                    {o.items?.map(it => `${it.product?.name} x${it.quantity}`).join(', ') || '—'}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {o.discounts?.length ? (
                      o.discounts.map((d, idx) => (
                        <span key={idx} className={`badge ${d.type?.toLowerCase() === 'coupon' ? 'green' : 'red'}`}>
                          {d.type}{d.campaign ? ` (${d.campaign.name})` : ''}: {d.value}
                        </span>
                      ))
                    ) : (
                      <span className="cell-muted">None</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <div>Page {page} of {pages}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="input" disabled={page<=1} onClick={() => setPage(p => p-1)}>Prev</button>
          <button className="input" disabled={page>=pages} onClick={() => setPage(p => p+1)}>Next</button>
        </div>
      </div>
    </div>
  );
}
