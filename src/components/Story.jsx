export default function Story({ data }) {
  return (
    <div>
      <div style={{ background: '#1e1b4b', border: '1px solid #312e81', borderRadius: 12, padding: 24, lineHeight: 2, fontSize: 16, color: '#e2e8f0' }}>
        <h3 style={{ color: '#c084fc', margin: '0 0 16px' }}>📖 The Story of This Release</h3>
        <p style={{ margin: 0 }}>{data.story}</p>
      </div>

      <div style={{ background: '#0f0f1a', border: '1px solid #312e81', borderRadius: 12, padding: 20, marginTop: 16 }}>
        <h3 style={{ color: '#818cf8', margin: '0 0 16px' }}>🧬 Release DNA Fingerprint</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60 }}>
          {Array.from({ length: 50 }).map((_, i) => {
            const heights = [20, 35, 15, 50, 30, 45, 25, 40, 10, 55];
            const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#818cf8'];
            return (
              <div key={i} style={{
                flex: 1, height: heights[i % 10], background: colors[i % 5],
                borderRadius: '2px 2px 0 0', opacity: 0.8
              }} />
            );
          })}
        </div>
        <p style={{ color: '#475569', fontSize: 12, margin: '8px 0 0' }}>
          Unique visual fingerprint for v{data.analysis?.version?.recommended} — {data.repoInfo.name}
        </p>
      </div>
    </div>
  );
}