import { useState } from 'react';

const CATS = [
  { key: 'features',     label: 'New Features',      emoji: '🚀', color: '#818cf8', bg: 'rgba(129,140,248,0.08)' },
  { key: 'bugfixes',     label: 'Bug Fixes',          emoji: '🐛', color: '#34d399', bg: 'rgba(52,211,153,0.08)' },
  { key: 'security',     label: 'Security',           emoji: '🔒', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)'  },
  { key: 'performance',  label: 'Performance',        emoji: '⚡', color: '#c084fc', bg: 'rgba(192,132,252,0.08)' },
  { key: 'breaking',     label: 'Breaking Changes',   emoji: '💥', color: '#f87171', bg: 'rgba(248,113,113,0.08)' },
  { key: 'docs',         label: 'Documentation',      emoji: '📝', color: '#38bdf8', bg: 'rgba(56,189,248,0.08)'  },
];

export default function Categories({ data }) {
  const [expanded, setExpanded] = useState(null);
  const cats = data?.analysis?.categories ?? {};

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Summary Bar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {CATS.map(({ key, emoji, label, color }) => {
          const count = cats[key]?.length ?? 0;
          return (
            <button
              key={key}
              onClick={() => setExpanded(expanded === key ? null : key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 999, cursor: 'pointer',
                background: expanded === key ? color + '30' : 'var(--bg-elevated)',
                border: `1px solid ${expanded === key ? color : 'var(--border-subtle)'}`,
                color: expanded === key ? color : 'var(--text-secondary)',
                fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{emoji}</span>
              <span>{label}</span>
              <span style={{
                background: expanded === key ? color : 'var(--bg-surface)',
                color: expanded === key ? 'white' : 'var(--text-muted)',
                borderRadius: 999, padding: '1px 7px', fontSize: 11, fontFamily: 'var(--font-mono)',
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Category Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {CATS.map(({ key, emoji, label, color, bg }) => {
          const items = cats[key] ?? [];
          const isExpanded = expanded === key;
          const displayItems = isExpanded ? items : items.slice(0, 3);

          return (
            <div
              key={key}
              className="card"
              style={{
                background: bg,
                border: `1px solid ${color}30`,
                transition: 'all 0.25s ease',
                cursor: 'default',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ margin: 0, color, fontSize: 15, fontWeight: 700 }}>
                  {emoji} {label}
                </h3>
                <span style={{
                  background: color + '25', color, borderRadius: 999,
                  padding: '2px 10px', fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 700,
                }}>{items.length}</span>
              </div>

              {items.length > 0 ? (
                <>
                  {displayItems.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: 8,
                        marginBottom: 6,
                        fontSize: 13,
                        color: '#cbd5e1',
                        borderLeft: `2px solid ${color}60`,
                        lineHeight: 1.5,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                  {items.length > 3 && (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : key)}
                      style={{
                        marginTop: 6, background: 'transparent', border: 'none',
                        color, fontSize: 13, cursor: 'pointer', fontWeight: 600,
                        padding: '4px 0',
                        fontFamily: 'inherit',
                      }}
                    >
                      {isExpanded ? '▲ Show less' : `▼ +${items.length - 3} more`}
                    </button>
                  )}
                </>
              ) : (
                <p className="empty">None detected in this release</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}