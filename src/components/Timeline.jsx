export default function Timeline({ data }) {
  return (
    <div style={{ background: '#1e1b4b', border: '1px solid #312e81', borderRadius: 12, padding: 24 }}>
      <h3 style={{ color: '#c084fc', margin: '0 0 16px' }}>📅 Timeline View</h3>
      {data.timeline?.map((d, i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          <p style={{ color: '#94a3b8', margin: '0 0 4px', fontSize: 13 }}>{d.day}</p>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {Array.from({ length: d.count }).map((_, j) => (
              <div key={j} title={d.msgs[j]} style={{ width: 20, height: 20, background: '#6366f1', borderRadius: 4 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}