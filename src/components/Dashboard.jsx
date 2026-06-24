import { buildContributorStats, buildLanguageStats, formatCount } from '../services/utils';

const LANG_COLORS = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3776ab',
  Rust: '#dea584', Go: '#00add8', Java: '#b07219', 'C++': '#f34b7d',
  C: '#555', Ruby: '#cc342d', PHP: '#4f5d95', Swift: '#fa7343',
  Kotlin: '#7f52ff', Dart: '#00b4ab', HTML: '#e34c26', CSS: '#563d7c',
  Vue: '#41b883', Shell: '#89e051',
};

const scoreColor = (score) => {
  if (score >= 80) return '#34d399';
  if (score >= 60) return '#fbbf24';
  return '#f87171';
};

const gradeColor = (grade) => {
  const map = { A: '#34d399', B: '#60a5fa', C: '#fbbf24', D: '#f87171', F: '#ef4444' };
  return map[grade?.[0]] || '#94a3b8';
};

export default function Dashboard({ data }) {
  const a = data.analysis;
  const contributors = buildContributorStats(data.commits || []);
  const languages = buildLanguageStats(data.languages || {});
  const score = a?.readiness?.score ?? 0;

  return (
    <div style={{ display: 'grid', gap: 20 }}>

      {/* AI Summary */}
      <div className="card animate-fadeInUp">
        <div className="card-title">🤖 AI Executive Summary</div>
        <p style={{ lineHeight: 1.85, color: '#cbd5e1', fontSize: 15 }}>{a?.summary || 'Loading AI summary...'}</p>
        <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(99,102,241,0.08)', borderRadius: 8, borderLeft: '3px solid #6366f1' }}>
          <span style={{ fontSize: 13, color: '#a5b4fc', fontWeight: 600 }}>
            📦 Version Recommendation: </span>
          <span style={{ fontFamily: 'var(--font-mono)', color: '#818cf8', fontWeight: 700 }}>
            v{a?.version?.recommended}
          </span>
          <span style={{ marginLeft: 10, fontSize: 12, color: '#64748b' }}>
            ({a?.version?.type} — {a?.version?.reason})
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
        {[
          { label: 'Readiness Score', value: `${score}`, sub: `Grade ${a?.readiness?.grade || '—'}`, color: scoreColor(score), mono: true },
          { label: 'Total Commits', value: formatCount(data.commits?.length ?? 0), sub: 'analyzed', color: '#60a5fa', mono: true },
          { label: 'New Features', value: String(a?.categories?.features?.length ?? 0), sub: 'shipped', color: '#818cf8', mono: true },
          { label: 'Bug Fixes', value: String(a?.categories?.bugfixes?.length ?? 0), sub: 'resolved', color: '#34d399', mono: true },
          { label: 'Security Fixes', value: String(a?.categories?.security?.length ?? 0), sub: 'patches', color: '#fbbf24', mono: true },
          { label: 'Breaking Changes', value: String(a?.categories?.breaking?.length ?? 0), sub: 'detected', color: '#f87171', mono: true },
        ].map((m, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.04}s` }}>
            <div className="stat-value" style={{ color: m.color, fontFamily: m.mono ? 'var(--font-mono)' : undefined }}>
              {m.value}
            </div>
            <div className="stat-label">{m.label}</div>
            <div className="stat-sub">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Readiness Bar */}
      <div className="card animate-fadeInUp" style={{
        animationDelay: '0.1s',
        border: `1px solid ${scoreColor(score)}40`,
        background: `linear-gradient(135deg, var(--bg-elevated), rgba(${score >= 80 ? '52,211,153' : score >= 60 ? '251,191,36' : '248,113,113'},0.04))`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="card-title" style={{ margin: 0 }}>📊 Release Readiness</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontSize: 32, fontWeight: 900, color: gradeColor(a?.readiness?.grade),
              fontFamily: 'var(--font-mono)', lineHeight: 1,
            }}>{a?.readiness?.grade || '—'}</span>
            <span style={{
              padding: '5px 14px', borderRadius: 999, fontWeight: 700, fontSize: 13,
              background: scoreColor(score), color: 'white',
            }}>
              {a?.readiness?.recommendation || 'Pending'}
            </span>
          </div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 999, height: 10, marginBottom: 16, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 999, width: `${score}%`,
            background: `linear-gradient(90deg, ${scoreColor(score)}, var(--neon-purple))`,
            transition: 'width 1s ease',
            boxShadow: `0 0 10px ${scoreColor(score)}60`,
          }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <p style={{ color: '#34d399', margin: '0 0 8px', fontWeight: 700, fontSize: 13 }}>✅ Positives</p>
            {(a?.readiness?.positives?.length > 0) ? (
              a.readiness.positives.map((p, i) => (
                <p key={i} style={{ margin: '0 0 5px', color: '#94a3b8', fontSize: 13 }}>• {p}</p>
              ))
            ) : <p className="empty">No data</p>}
          </div>
          <div>
            <p style={{ color: '#f87171', margin: '0 0 8px', fontWeight: 700, fontSize: 13 }}>⚠️ Risks</p>
            {(a?.readiness?.risks?.length > 0) ? (
              a.readiness.risks.map((r, i) => (
                <p key={i} style={{ margin: '0 0 5px', color: '#94a3b8', fontSize: 13 }}>• {r}</p>
              ))
            ) : <p className="empty">None detected</p>}
          </div>
        </div>
      </div>

      {/* Languages + Contributors Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Languages */}
        {languages.length > 0 && (
          <div className="card animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
            <div className="card-title">🔤 Languages</div>
            <div style={{ display: 'flex', height: 8, borderRadius: 999, overflow: 'hidden', marginBottom: 14 }}>
              {languages.map((l) => (
                <div key={l.lang} title={`${l.lang}: ${l.pct}%`}
                  style={{ width: `${l.pct}%`, background: LANG_COLORS[l.lang] || '#6366f1', transition: 'width 1s ease' }} />
              ))}
            </div>
            {languages.slice(0, 5).map((l) => (
              <div key={l.lang} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: LANG_COLORS[l.lang] || '#6366f1', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#cbd5e1', flex: 1 }}>{l.lang}</span>
                <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-mono)' }}>{l.pct}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Contributors */}
        {contributors.length > 0 && (
          <div className="card animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="card-title">👥 Top Contributors</div>
            {contributors.slice(0, 6).map((c, i) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#475569', width: 16, flexShrink: 0 }}>#{i + 1}</span>
                {c.avatar ? (
                  <img src={c.avatar} alt={c.name} style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--border-default)', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
                    {c.name[0]}
                  </div>
                )}
                <span style={{ fontSize: 13, color: '#cbd5e1', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                <span style={{ fontSize: 12, color: '#6366f1', fontFamily: 'var(--font-mono)', fontWeight: 700, flexShrink: 0 }}>{c.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}