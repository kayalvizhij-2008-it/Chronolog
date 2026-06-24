const scoreColor = (score) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

export default function Dashboard({ data }) {
  const a = data.analysis;
  return (
    <div>
      <div style={{ background: '#1e1b4b', border: '1px solid #312e81', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 12px', color: '#c084fc' }}>🤖 AI Smart Summary</h3>
        <p style={{ margin: 0, lineHeight: 1.8, color: '#cbd5e1' }}>{a?.summary}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Version', value: `v${a?.version?.recommended}`, sub: a?.version?.type, color: '#818cf8' },
          { label: 'Readiness Score', value: `${a?.readiness?.score}/100`, sub: a?.readiness?.grade, color: scoreColor(a?.readiness?.score) },
          { label: 'Total Commits', value: data.commits?.length, sub: 'analyzed', color: '#34d399' },
          { label: 'New Features', value: a?.categories?.features?.length || 0, sub: 'added', color: '#60a5fa' },
          { label: 'Bug Fixes', value: a?.categories?.bugfixes?.length || 0, sub: 'resolved', color: '#f472b6' },
          { label: 'Breaking Changes', value: a?.categories?.breaking?.length || 0, sub: 'detected', color: '#f87171' }
        ].map((m, i) => (
          <div key={i} style={{ background: '#0f0f1a', border: '1px solid #312e81', borderRadius: 10, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: '#475569' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#1e1b4b', border: `2px solid ${scoreColor(a?.readiness?.score)}`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, color: '#c084fc' }}>📊 Release Readiness</h3>
          <span style={{ padding: '6px 16px', borderRadius: 20, fontWeight: 700, background: scoreColor(a?.readiness?.score), color: 'white', fontSize: 14 }}>
            {a?.readiness?.recommendation}
          </span>
        </div>
        <div style={{ background: '#0f0f1a', borderRadius: 8, height: 12, marginBottom: 16 }}>
          <div style={{ height: '100%', borderRadius: 8, width: `${a?.readiness?.score}%`, background: `linear-gradient(to right, ${scoreColor(a?.readiness?.score)}, #a855f7)` }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <p style={{ color: '#34d399', margin: '0 0 8px', fontWeight: 600 }}>✅ Positives</p>
            {a?.readiness?.positives?.map((p, i) => <p key={i} style={{ margin: '0 0 4px', color: '#94a3b8', fontSize: 14 }}>• {p}</p>)}
          </div>
          <div>
            <p style={{ color: '#f87171', margin: '0 0 8px', fontWeight: 600 }}>⚠️ Risks</p>
            {a?.readiness?.risks?.map((r, i) => <p key={i} style={{ margin: '0 0 4px', color: '#94a3b8', fontSize: 14 }}>• {r}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}