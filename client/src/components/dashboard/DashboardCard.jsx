export default function DashboardCard({ title, value, hint, roas }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="value">{value}</div>
      {typeof roas === 'number' && (
        <div className={`badge ${roas < 1 ? 'red' : roas > 3 ? 'green' : ''}`} style={{ marginTop: 8 }}>
          ROAS: {roas.toFixed(2)}x
        </div>
      )}
      {hint && <div style={{ color: 'var(--muted)', marginTop: 6, fontSize: 12 }}>{hint}</div>}
    </div>
  );
}
