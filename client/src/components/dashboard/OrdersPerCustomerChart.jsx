import { useEffect, useState } from 'react';
import { getOrdersPerCustomer } from '../../api/http.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function OrdersPerCustomerChart() {
  const [data, setData] = useState([]);
  useEffect(() => { getOrdersPerCustomer().then(setData); }, []);

  return (
    <div className="card chart-card">
      <h3>Orders per Customer</h3>
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="var(--chart-grid)" />
            <XAxis dataKey="name" stroke="var(--chart-axis)" interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis stroke="var(--chart-axis)" />
            <Tooltip contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', color: 'var(--text)' }} />
            <Bar dataKey="orders" fill="#a78bfa" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


