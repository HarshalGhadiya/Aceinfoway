import { useEffect, useState } from 'react';
import { getDashboard } from '../api/http.js';
import DashboardCard from '../components/dashboard/DashboardCard.jsx';
import OrdersTable from '../components/dashboard/OrdersTable.jsx';
import RevenueChart from '../components/dashboard/RevenueChart.jsx';
import TopProductsChart from '../components/dashboard/TopProductsChart.jsx';
import TopCampaignsChart from '../components/dashboard/TopCampaignsChart.jsx';
import OrdersPerCustomerChart from '../components/dashboard/OrdersPerCustomerChart.jsx';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ revenue: 0, orders: 0, aov: 0, roas: 0 });

  useEffect(() => {
    getDashboard().then(setMetrics);
  }, []);

  return (
    <div className="content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Overview</div>
          <div className="muted" style={{ fontSize: 13 }}>Performance at a glance</div>
        </div>
        <div className="controls">
          <select className="select" defaultValue="last-30">
            <option value="today">Today</option>
            <option value="last-7">Last 7 days</option>
            <option value="last-30">Last 30 days</option>
            <option value="this-month">This month</option>
          </select>
        </div>
      </div>
      <div className="grid cols-4">
        <DashboardCard title="Revenue" value={`$ ${metrics.revenue?.toFixed ? metrics.revenue.toFixed(2) : metrics.revenue}`} />
        <DashboardCard title="Orders" value={metrics.orders} />
        <DashboardCard title="Avg Order Value" value={`$ ${metrics.aov?.toFixed ? metrics.aov.toFixed(2) : metrics.aov}`} />
        <DashboardCard title="ROAS" value={`${metrics.roas?.toFixed ? metrics.roas.toFixed(2) : metrics.roas}x`} roas={metrics.roas} hint="ROAS < 1 in red, > 3 in green" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', marginTop: 16 }}>
        <RevenueChart />
        <TopCampaignsChart />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 16 }}>
        <TopProductsChart />
        <OrdersPerCustomerChart />
      </div>

      <div style={{ marginTop: 16 }}>
        <OrdersTable />
      </div>
    </div>
  );
}
