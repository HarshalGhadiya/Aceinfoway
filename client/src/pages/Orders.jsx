import { useMemo, useState } from 'react';

const DUMMY_ORDERS = [
  { id: 'ORD-1001', date: '2025-10-01', customer: 'Jane Cooper', status: 'Shipped', total: 129.99 },
  { id: 'ORD-1002', date: '2025-10-02', customer: 'Guy Hawkins', status: 'Processing', total: 89.5 },
  { id: 'ORD-1003', date: '2025-10-03', customer: 'Devon Lane', status: 'Delivered', total: 219.0 },
  { id: 'ORD-1004', date: '2025-10-04', customer: 'Cody Fisher', status: 'Cancelled', total: 42.25 },
  { id: 'ORD-1005', date: '2025-10-05', customer: 'Bessie Cooper', status: 'Delivered', total: 512.0 },
  { id: 'ORD-1006', date: '2025-10-06', customer: 'Jacob Jones', status: 'Processing', total: 74.95 },
  { id: 'ORD-1007', date: '2025-10-06', customer: 'Theresa Webb', status: 'Shipped', total: 303.2 },
];

export default function Orders() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    return DUMMY_ORDERS.filter((o) => {
      const matchText = `${o.id} ${o.customer}`.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === 'all' ? true : o.status.toLowerCase() === status;
      return matchText && matchStatus;
    });
  }, [search, status]);

  return (
    <div className="content">
      <h2 style={{ marginTop: 0 }}>Orders</h2>
      <div className="controls">
        <input className="input" placeholder="Search orders or customers" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="card">
        <h3>Recent Orders</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.date}</td>
                <td>{o.customer}</td>
                <td>
                  <span className={`badge ${o.status === 'Cancelled' ? 'red' : 'green'}`}>{o.status}</span>
                </td>
                <td>$ {o.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


