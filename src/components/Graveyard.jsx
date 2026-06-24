const effortColor = (effort) => {
  if (effort === 'high')   return { text: '#f87171', bg: 'rgba(127,29,29,0.6)' };
  if (effort === 'medium') return { text: '#fbbf24', bg: 'rgba(120,53,15,0.6)' };
  return { text: '#60a5fa', bg: 'rgba(30,58,138,0.6)' };
};

export default function Graveyard({ data }) {
  const g = data?.graveyard ?? {};
  const items = g?.graveyard ?? [];

  return (
    <div style={{ display: 'grid', gap: 20 }}>

      {/* Header */}
      <div className="card animate-fadeInUp" style={{
        background: 'linear-gradient(135deg, #1a0808, rgba(127,29,29,0.3))',
        border: '1px solid rgba(127,29,29,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <span style={{ fontSize: 32 }}>🪦</span>
          <div>
            <h2 style={{ margin: 0, color: '#fca5a5', fontSize: 22 }}>Feature Graveyard</h2>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#94a3b8' }}>
              Where ideas came to rest — abandoned PRs, stale branches, unshipped work
            </p>
          </div>
        </div>

        {g?.insight && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(127,29,29,0.3)',
            borderRadius: 10, borderLeft: '3px solid #7f1d1d',
          }}>
            <p style={{ margin: 0, color: '#fca5a5', fontStyle: 'italic', fontSize: 14, lineHeight: 1.7 }}>
              💡 {g.insight}
            </p>
          </div>
        )}
      </div>

      {/* Tombstones Grid */}
      {items.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {items.map((item, i) => {
            const effort = effortColor(item.effort);
            return (
              <div
                key={i}
                className="animate-fadeInUp"
                style={{
                  background: 'linear-gradient(135deg, #1a0a0a, rgba(127,29,29,0.15))',
                  border: '1px solid rgba(127,29,29,0.35)',
                  borderRadius: 14, padding: 18,
                  animationDelay: `${i * 0.06}s`,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(248,113,113,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(127,29,29,0.35)'; e.currentTarget.style.transform = 'none'; }}
              >
                {/* Tombstone Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 22 }}>{item.emoji || '⚰️'}</span>
                    <strong style={{ color: '#fca5a5', fontSize: 14, lineHeight: 1.3 }}>{item.name}</strong>
                  </div>
                  <span style={{
                    fontSize: 10, padding: '2px 9px', borderRadius: 999, flexShrink: 0,
                    background: effort.bg, color: effort.text, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {item.effort} effort
                  </span>
                </div>

                {/* Epitaph */}
                <div style={{
                  padding: '10px 12px',
                  background: 'rgba(0,0,0,0.4)', borderRadius: 8,
                  borderLeft: '2px solid rgba(127,29,29,0.5)',
                }}>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>{item.reason}</p>
                </div>

                {/* RIP footer */}
                <div style={{ marginTop: 10, textAlign: 'center' }}>
                  <span style={{ fontSize: 11, color: '#7f1d1d', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>
                    ✝ R.I.P ✝
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h3 style={{ color: '#34d399', marginBottom: 8 }}>Graveyard is Empty!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            No abandoned features found — this team ships everything they start. Excellent execution discipline!
          </p>
        </div>
      )}
    </div>
  );
}