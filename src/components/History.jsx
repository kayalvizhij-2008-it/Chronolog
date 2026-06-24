export default function History({ data }) {
  const text = data?.archaeology || '';
  const paragraphs = text.split(/\n+/).filter(Boolean);

  // Timeline milestones from commits
  const commits = data?.commits ?? [];
  const milestones = commits
    .filter((c) => {
      const msg = (c.commit?.message || '').toLowerCase();
      return (
        msg.includes('release') || msg.includes('launch') || msg.includes('v1') ||
        msg.includes('initial') || msg.includes('refactor') || msg.includes('milestone') ||
        msg.includes('version') || msg.includes('deploy')
      );
    })
    .slice(0, 8)
    .reverse();

  return (
    <div style={{ display: 'grid', gap: 20 }}>

      {/* Wikipedia-Style History */}
      <div className="card animate-fadeInUp" style={{
        background: 'linear-gradient(135deg, var(--bg-elevated), rgba(99,102,241,0.05))',
        border: '1px solid rgba(99,102,241,0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div className="card-title" style={{ margin: 0 }}>🏛️ Repository Archaeology</div>
          <span style={{
            fontSize: 11, padding: '3px 10px', borderRadius: 999,
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
            color: '#818cf8', fontWeight: 600, letterSpacing: '0.06em',
          }}>WIKIPEDIA STYLE</span>
        </div>

        {/* Infobox */}
        <div style={{
          float: 'right', margin: '0 0 16px 20px',
          background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)',
          borderRadius: 10, padding: '14px 16px', minWidth: 200, maxWidth: 240,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#818cf8', marginBottom: 10, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
            📦 {data?.repoInfo?.name}
          </div>
          {[
            { label: 'Created',   value: data?.repoInfo?.created_at?.split('T')[0] },
            { label: 'Stars',     value: data?.repoInfo?.stargazers_count },
            { label: 'Forks',     value: data?.repoInfo?.forks_count },
            { label: 'Language',  value: data?.repoInfo?.language },
            { label: 'Branch',    value: data?.repoInfo?.default_branch },
            { label: 'Issues',    value: data?.repoInfo?.open_issues_count },
          ].filter(r => r.value != null).map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>{r.label}</span>
              <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{String(r.value)}</span>
            </div>
          ))}
        </div>

        {paragraphs.length > 0 ? (
          paragraphs.map((para, i) => (
            <p key={i} style={{
              lineHeight: 1.9, color: '#cbd5e1', fontSize: 14,
              margin: i > 0 ? '12px 0 0' : 0,
            }}>
              {para}
            </p>
          ))
        ) : (
          <p className="empty">Archaeological history unavailable.</p>
        )}
        <div style={{ clear: 'both' }} />
      </div>

      {/* Key Milestones */}
      {milestones.length > 0 && (
        <div className="card animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="card-title">⚡ Detected Milestones</div>
          <div style={{ position: 'relative' }}>
            {/* Timeline line */}
            <div style={{ position: 'absolute', left: 18, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #6366f1, transparent)' }} />
            {milestones.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16, paddingLeft: 8 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  border: '2px solid #6366f1', marginTop: 2,
                  boxShadow: '0 0 8px rgba(99,102,241,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10,
                }}>⚡</div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>
                    {c.commit.message.split('\n')[0]}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono)' }}>
                    {c.commit.author.name} · {c.commit.author.date?.split('T')[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}