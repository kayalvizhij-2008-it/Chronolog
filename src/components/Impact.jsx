const levelColor = (level) => {
  if (level === 'High') return '#ef4444';
  if (level === 'Medium') return '#f59e0b';
  return '#10b981';
};

export default function Impact({ data }) {
  const imp = data.impact;
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ background: '#1e1b4b', border: '1px solid #312e81', borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', color: '#c084fc' }}>🌍 Business Impact</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Customer Experience', value: imp?.businessImpact?.customerExperience },
            { label: 'Revenue Impact', value: imp?.businessImpact?.revenueImpact },
            { label: 'Security Impact', value: imp?.businessImpact?.securityImpact }
          ].map((m, i) => (
            <div key={i} style={{ background: '#0f0f1a', border: `1px solid ${levelColor(m.value)}60`, borderRadius: 10, padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: levelColor(m.value) }}>{m.value || '—'}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#94a3b8', margin: 0, lineHeight: 1.7 }}>{imp?.businessImpact?.reasoning}</p>
      </div>

      <div style={{ background: '#0f1f1a', border: '1px solid #14532d', borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', color: '#34d399' }}>🎯 SDG Contribution</h3>
        {imp?.sdgContribution?.map((s, i) => (
          <div key={i} style={{ marginBottom: 10, padding: 12, background: '#0f0f1a', borderRadius: 8 }}>
            <strong style={{ color: '#6ee7b7' }}>{s.goal}</strong>
            <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: 13 }}>{s.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}