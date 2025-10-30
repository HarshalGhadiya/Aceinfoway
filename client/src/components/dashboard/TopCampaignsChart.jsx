import { useEffect, useState } from 'react';
import { getDashboard } from '../../api/http.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function TopCampaignsChart() {
  const [data, setData] = useState([]);
  useEffect(() => { getDashboard().then(d => setData(d.topCampaigns)); }, []);

  return (
    <div className="card chart-card">
      <h3>Campaign ROAS</h3>
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="campGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--chart-grid)" />
            <XAxis dataKey="name" stroke="var(--chart-axis)" />
            <YAxis stroke="var(--chart-axis)" />
            <Tooltip formatter={(v) => [`${Number(v).toFixed(2)}x`, 'ROAS']} contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', color: 'var(--text)' }} />
            <Bar dataKey="roas" fill="url(#campGradient)" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
