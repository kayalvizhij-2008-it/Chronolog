const sevColor = (s) => s === 'high' ? '#ef4444' : s === 'medium' ? '#f59e0b' : '#10b981';

export default function RiskForecast({ data }) {
  const r = data.risks;
  return (
    <div>
      <div style={{
        background: '#1e1b4b', border: `2px solid ${sevColor(r?.overallRiskLevel)}`,
        borderRadius: 12, padding: 20, marginBottom: 16, display: 'flex',
        justifyContent: 'space-between', alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, color: '#c084fc' }}>⚠️ Future Error Forecast</h3>
        <span style={{ padding: '6px 16px', borderRadius: 20, fontWeight: 700, background: sevColor(r?.overallRiskLevel), color: 'white' }}>
          {r?.overallRiskLevel?.toUpperCase()} RISK
        </span>
      </div>

      {r?.predictions?.map((p, i) => (
        <div key={i} style={{ background: '#1e1b4b', border: `1px solid ${sevColor(p.severity)}40`, borderRadius: 10, padding: 16, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong style={{ color: '#e2e8f0' }}>{p.area}</strong>
            <span style={{ fontSize: 11, color: sevColor(p.severity) }}>{p.severity} severity · {p.confidence} confidence</span>
          </div>
          <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: 13 }}>{p.risk}</p>
        </div>
      ))}

      {r?.technicalDebt?.length > 0 && (
        <div style={{ background: '#0f0f1a', border: '1px solid #312e81', borderRadius: 10, padding: 16, marginTop: 8 }}>
          <p style={{ color: '#a5b4fc', margin: '0 0 8px', fontWeight: 600 }}>Technical Debt Signals</p>
          {r.technicalDebt.map((t, i) => <p key={i} style={{ margin: '0 0 4px', color: '#64748b', fontSize: 13 }}>• {t}</p>)}
        </div>
      )}
    </div>
  );
}