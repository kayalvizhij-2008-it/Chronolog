const SDG_ICONS = {
  1: '🚫', 2: '🌾', 3: '💚', 4: '📚', 5: '⚤', 6: '💧',
  7: '☀️', 8: '💼', 9: '🏗️', 10: '⚖️', 11: '🏙️', 12: '♻️',
  13: '🌍', 14: '🐋', 15: '🌳', 16: '⚖️', 17: '🤝',
};

const SDG_COLORS = {
  1:'#e5243b', 2:'#dda63a', 3:'#4c9f38', 4:'#c5192d', 5:'#ff3a21',
  6:'#26bde2', 7:'#fcc30b', 8:'#a21942', 9:'#fd6925', 10:'#dd1367',
  11:'#fd9d24', 12:'#bf8b2e', 13:'#3f7e44', 14:'#0a97d9', 15:'#56c02b',
  16:'#00689d', 17:'#19486a',
};

const impactColor = (level) => {
  const l = (level || '').toLowerCase();
  if (l === 'high') return '#f87171';
  if (l === 'medium') return '#fbbf24';
  return '#34d399';
};

const impactBg = (level) => {
  const l = (level || '').toLowerCase();
  if (l === 'high') return 'rgba(248,113,113,0.1)';
  if (l === 'medium') return 'rgba(251,191,36,0.1)';
  return 'rgba(52,211,153,0.1)';
};

const GaugeBar = ({ value, color, label }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{value || 'N/A'}</span>
    </div>
    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 999,
        width: value?.toLowerCase() === 'high' ? '90%' : value?.toLowerCase() === 'medium' ? '55%' : '20%',
        background: `linear-gradient(90deg, ${color}, ${color}99)`,
        transition: 'width 1s ease',
        boxShadow: `0 0 6px ${color}60`,
      }} />
    </div>
  </div>
);

export default function Impact({ data }) {
  const imp = data?.impact;
  const bi = imp?.businessImpact;
  const sdgs = imp?.sdgContribution ?? [];

  return (
    <div style={{ display: 'grid', gap: 20 }}>

      {/* Business Impact Header */}
      <div className="card animate-fadeInUp" style={{ background: 'linear-gradient(135deg, var(--bg-elevated), rgba(99,102,241,0.06))' }}>
        <div className="card-title">🌍 Business Impact Analysis</div>

        {/* Impact Level Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { label: '👤 Customer Experience', value: bi?.customerExperience },
            { label: '💰 Revenue Impact',       value: bi?.revenueImpact },
            { label: '🔒 Security Impact',      value: bi?.securityImpact },
            { label: '⚡ Performance Impact',   value: bi?.performanceImpact },
          ].map((m, i) => (
            <div key={i} style={{
              background: impactBg(m.value),
              border: `1px solid ${impactColor(m.value)}40`,
              borderRadius: 12, padding: '14px 16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: impactColor(m.value), fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                {m.value || '—'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.3 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Gauge Bars */}
        <GaugeBar value={bi?.customerExperience} color={impactColor(bi?.customerExperience)} label="Customer Experience" />
        <GaugeBar value={bi?.revenueImpact}       color={impactColor(bi?.revenueImpact)}       label="Revenue Impact" />
        <GaugeBar value={bi?.securityImpact}      color={impactColor(bi?.securityImpact)}      label="Security Impact" />
        <GaugeBar value={bi?.performanceImpact}   color={impactColor(bi?.performanceImpact)}   label="Performance Impact" />

        {bi?.reasoning && (
          <div style={{
            marginTop: 16, padding: '14px 16px',
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: 10,
          }}>
            <p style={{ color: '#cbd5e1', lineHeight: 1.75, fontSize: 14, margin: 0 }}>{bi.reasoning}</p>
          </div>
        )}
      </div>

      {/* SDG Contribution */}
      <div className="card animate-fadeInUp" style={{ animationDelay: '0.1s', border: '1px solid rgba(52,211,153,0.2)', background: 'linear-gradient(135deg, var(--bg-elevated), rgba(52,211,153,0.04))' }}>
        <div className="card-title" style={{ color: '#34d399' }}>🎯 UN SDG Contribution</div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          Mapping this project's impact to the United Nations Sustainable Development Goals
        </p>

        {sdgs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {sdgs.map((s, i) => {
              const num = s.number || parseInt(s.goal?.match(/\d+/)?.[0]) || 9;
              const color = SDG_COLORS[num] || '#34d399';
              const icon = SDG_ICONS[num] || '🎯';
              return (
                <div key={i} style={{
                  background: color + '10',
                  border: `1px solid ${color}40`,
                  borderRadius: 12, padding: 16,
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 38, height: 38, borderRadius: 8,
                      background: color, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 20, flexShrink: 0,
                    }}>{icon}</span>
                    <strong style={{ fontSize: 13, color, lineHeight: 1.3 }}>{s.goal}</strong>
                  </div>
                  <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>{s.explanation}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="empty">No SDG contributions detected for this release.</p>
        )}
      </div>
    </div>
  );
}