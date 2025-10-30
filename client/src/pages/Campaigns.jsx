const DUMMY_CAMPAIGNS = [
  { id: 'C-01', name: 'Black Friday', spend: 12000, revenue: 42000, impressions: 1200000, clicks: 52000 },
  { id: 'C-02', name: 'Holiday Gifts', spend: 8000, revenue: 21000, impressions: 760000, clicks: 28000 },
  { id: 'C-03', name: 'Back to School', spend: 5000, revenue: 9000, impressions: 310000, clicks: 11000 },
];

function calcROAS(c) { return c.revenue / Math.max(1, c.spend); }
function calcCTR(c) { return (c.clicks / Math.max(1, c.impressions)) * 100; }

export default function Campaigns() {
  return (
    <div className="content">
      <h2 style={{ marginTop: 0 }}>Campaigns</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        {DUMMY_CAMPAIGNS.map((c) => (
          <div key={c.id} className="card">
            <h3>{c.name}</h3>
            <div className="value">ROAS {calcROAS(c).toFixed(2)}x</div>
            <div className="muted" style={{ marginTop: 8 }}>CTR {calcCTR(c).toFixed(2)}%</div>
            <div className="muted" style={{ marginTop: 8 }}>Impressions {c.impressions.toLocaleString()}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <span className="badge green">Spend $ {c.spend.toLocaleString()}</span>
              <span className="badge green">Revenue $ {c.revenue.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }} className="card">
        <h3>All Campaigns</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Spend</th>
              <th>Revenue</th>
              <th>ROAS</th>
              <th>CTR</th>
            </tr>
          </thead>
          <tbody>
            {DUMMY_CAMPAIGNS.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>$ {c.spend.toLocaleString()}</td>
                <td>$ {c.revenue.toLocaleString()}</td>
                <td>{calcROAS(c).toFixed(2)}x</td>
                <td>{calcCTR(c).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


