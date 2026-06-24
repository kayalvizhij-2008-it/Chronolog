const CATS = [
  { key: 'features', label: '🚀 New Features', color: '#3b82f6' },
  { key: 'bugfixes', label: '🐛 Bug Fixes', color: '#10b981' },
  { key: 'security', label: '🔒 Security', color: '#f59e0b' },
  { key: 'performance', label: '⚡ Performance', color: '#8b5cf6' },
  { key: 'breaking', label: '💥 Breaking Changes', color: '#ef4444' },
  { key: 'docs', label: '📝 Documentation', color: '#06b6d4' }
];

export default function Categories({ data }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16
      }}
    >
      {CATS.map(({ key, label, color }) => (
        <div
          key={key}
          style={{
            background: '#1e1b4b',
            border: `1px solid ${color}40`,
            borderRadius: 12,
            padding: 16
          }}
        >
          <h3
            style={{
              margin: '0 0 12px',
              color: color
            }}
          >
            {label}
          </h3>

          {data?.analysis?.categories?.[key]?.length > 0 ? (
            data.analysis.categories[key].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '6px 10px',
                  background: '#0f0f1a',
                  borderRadius: 6,
                  marginBottom: 6,
                  fontSize: 13,
                  color: '#cbd5e1'
                }}
              >
                {item}
              </div>
            ))
          ) : (
            <p
              style={{
                color: '#475569',
                fontSize: 13,
                margin: 0
              }}
            >
              None detected
            </p>
          )}
        </div>
      ))}
    </div>
  );
}