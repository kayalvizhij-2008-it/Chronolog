export default function Graveyard({ data }) {
  const g = data.graveyard;
  return (
    <div style={{ background: '#2d0f0f', border: '1px solid #7f1d1d', borderRadius: 12, padding: 20 }}>
      <h3 style={{ color: '#f87171', margin: '0 0 8px' }}>🚫 Feature Graveyard</h3>
      <p style={{ color: '#94a3b8', margin: '0 0 16px', fontStyle: 'italic' }}>💡 {g?.insight}</p>
      {g?.graveyard?.length > 0 ? (
        g.graveyard.map((item, i) => (
          <div key={i} style={{ background: '#1a0a0a', border: '1px solid #7f1d1d', borderRadius: 8, padding: 14, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#fca5a5' }}>{item.emoji} {item.name}</strong>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 10,
                background: item.effort === 'high' ? '#7f1d1d' : item.effort === 'medium' ? '#78350f' : '#1e3a5f',
                color: '#e2e8f0'
              }}>{item.effort} effort lost</span>
            </div>
            <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: 13 }}>{item.reason}</p>
          </div>
        ))
      ) : (
        <p style={{ color: '#475569' }}>No abandoned features found — great job shipping! 🎉</p>
      )}
    </div>
  );
}