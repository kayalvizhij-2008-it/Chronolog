export default function Story({ data }) {
  const commits = data?.commits ?? [];
  const story = data?.story || '';

  // Build a release DNA fingerprint from commit hashes for visual uniqueness
  const fingerprint = commits.slice(0, 50).map((c, i) => {
    const heights = [12, 28, 16, 44, 22, 38, 18, 50, 10, 42, 32, 20, 45, 8, 36];
    const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#818cf8', '#7c3aed', '#4f46e5'];
    const sha = c.sha || '';
    const h = parseInt(sha.slice(0, 4), 16) || i * 37;
    return {
      height: heights[h % heights.length],
      color: colors[h % colors.length],
    };
  });

  // Chapter-style paragraph split
  const paragraphs = story.split(/\n+/).filter(Boolean);

  return (
    <div style={{ display: 'grid', gap: 20 }}>

      {/* Story Card */}
      <div className="card animate-fadeInUp" style={{
        background: 'linear-gradient(135deg, var(--bg-elevated), rgba(129,140,248,0.06))',
        border: '1px solid rgba(129,140,248,0.2)',
      }}>
        <div className="card-title">📖 The Story of This Release</div>
        <div style={{
          position: 'relative',
          paddingLeft: 24,
          borderLeft: '3px solid rgba(129,140,248,0.4)',
        }}>
          {/* Decorative quote mark */}
          <span style={{
            position: 'absolute', top: -8, left: -2,
            fontSize: 64, color: '#6366f1', opacity: 0.2,
            lineHeight: 1, fontFamily: 'Georgia, serif',
          }}>"</span>
          {paragraphs.length > 0 ? (
            paragraphs.map((para, i) => (
              <p key={i} style={{
                lineHeight: 1.9, fontSize: 16, color: '#e2e8f0',
                margin: i > 0 ? '14px 0 0' : 0,
                animationDelay: `${i * 0.1}s`,
              }}>
                {para}
              </p>
            ))
          ) : (
            <p className="empty">Story is being generated...</p>
          )}
        </div>
      </div>

      {/* Release DNA Fingerprint */}
      {fingerprint.length > 0 && (
        <div className="card animate-fadeInUp" style={{ animationDelay: '0.1s', border: '1px solid rgba(99,102,241,0.15)' }}>
          <div className="card-title">🧬 Release DNA Fingerprint</div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            A unique visual signature generated from the cryptographic commit hashes of this release — no two releases look alike.
          </p>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 3,
            height: 64, padding: '4px 0',
            overflow: 'hidden',
          }}>
            {fingerprint.map((bar, i) => (
              <div
                key={i}
                title={commits[i]?.sha?.slice(0, 7)}
                style={{
                  flex: 1,
                  height: bar.height,
                  background: bar.color,
                  borderRadius: '3px 3px 0 0',
                  opacity: 0.85,
                  transition: 'height 0.5s ease',
                  cursor: 'pointer',
                  minWidth: 4,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scaleY(1.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'scaleY(1)'; }}
              />
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#475569', margin: '10px 0 0', fontFamily: 'var(--font-mono)' }}>
            v{data?.analysis?.version?.recommended || '?'} — {data?.repoInfo?.name} — {commits.length} commits analyzed
          </p>
        </div>
      )}

      {/* Recent Commit Log */}
      {commits.length > 0 && (
        <div className="card animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
          <div className="card-title">🕐 Recent Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {commits.slice(0, 10).map((c, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '11px 0',
                borderBottom: i < 9 ? '1px solid var(--border-subtle)' : 'none',
              }}>
                {c.author?.avatar_url ? (
                  <img
                    src={c.author.avatar_url}
                    alt={c.commit.author.name}
                    style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--border-default)', flexShrink: 0, marginTop: 2 }}
                  />
                ) : (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#312e81', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#818cf8' }}>
                    {(c.commit.author.name || '?')[0]}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.commit.message.split('\n')[0]}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#475569' }}>
                    {c.commit.author.name} · {c.commit.author.date?.split('T')[0]}
                  </p>
                </div>
                <code style={{ fontSize: 11, color: '#6366f1', fontFamily: 'var(--font-mono)', flexShrink: 0, paddingTop: 2 }}>
                  {c.sha?.slice(0, 7)}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}