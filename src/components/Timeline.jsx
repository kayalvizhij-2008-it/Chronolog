import { useState } from 'react';

const maxCountInTimeline = (timeline) =>
  Math.max(...timeline.map((d) => d.count), 1);

const heatColor = (count, max) => {
  const intensity = count / max;
  if (intensity === 0) return '#1a1a3a';
  if (intensity < 0.25) return '#2d2b7a';
  if (intensity < 0.5)  return '#4338ca';
  if (intensity < 0.75) return '#6366f1';
  return '#818cf8';
};

export default function Timeline({ data }) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const timeline = data?.timeline ?? [];

  if (timeline.length === 0) {
    return (
      <div className="card">
        <div className="card-title">📅 Commit Timeline</div>
        <p className="empty">No timeline data available.</p>
      </div>
    );
  }

  const max = maxCountInTimeline(timeline);
  const totalCommits = timeline.reduce((s, d) => s + d.count, 0);
  const peakDay = [...timeline].sort((a, b) => b.count - a.count)[0];
  const activeDays = timeline.filter((d) => d.count > 0).length;

  return (
    <div style={{ display: 'grid', gap: 20 }}>

      {/* Stats Row */}
      <div className="stat-grid">
        {[
          { label: 'Total Commits',  value: totalCommits,        color: '#818cf8' },
          { label: 'Active Days',    value: activeDays,          color: '#34d399' },
          { label: 'Peak Day',       value: peakDay?.dayLabel,   color: '#fbbf24' },
          { label: 'Peak Count',     value: peakDay?.count ?? 0, color: '#f87171' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-value" style={{ color: s.color, fontSize: 22 }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="card">
        <div className="card-title">🔥 Commit Heatmap</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))',
          gap: 5,
          marginBottom: 8,
        }}>
          {timeline.map((d, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredDay(d)}
              onMouseLeave={() => setHoveredDay(null)}
              title={`${d.dayLabel}: ${d.count} commit${d.count !== 1 ? 's' : ''}`}
              style={{
                height: 36,
                borderRadius: 6,
                background: heatColor(d.count, max),
                border: hoveredDay === d ? '2px solid #818cf8' : '1px solid rgba(99,102,241,0.15)',
                cursor: d.count > 0 ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
                transform: hoveredDay === d ? 'scale(1.15)' : 'scale(1)',
                boxShadow: hoveredDay === d ? '0 0 12px rgba(129,140,248,0.5)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {d.count > 0 && (
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
                  {d.count}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>Less</span>
          {['#1a1a3a', '#2d2b7a', '#4338ca', '#6366f1', '#818cf8'].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 3, background: c }} />
          ))}
          <span style={{ fontSize: 12, color: '#64748b' }}>More</span>
        </div>
      </div>

      {/* Hovered Day Details */}
      {hoveredDay && hoveredDay.count > 0 && (
        <div className="card animate-fadeIn" style={{ border: '1px solid var(--border-default)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="card-title" style={{ margin: 0 }}>📆 {hoveredDay.dayLabel}</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#818cf8', fontWeight: 700 }}>
              {hoveredDay.count} commit{hoveredDay.count !== 1 ? 's' : ''}
            </span>
          </div>
          {hoveredDay.authors?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {hoveredDay.authors.map((a) => (
                <span key={a} style={{ fontSize: 12, padding: '3px 10px', background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', borderRadius: 999, border: '1px solid rgba(99,102,241,0.2)' }}>
                  {a}
                </span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {hoveredDay.msgs.slice(0, 8).map((msg, i) => (
              <div key={i} style={{ fontSize: 13, color: '#94a3b8', padding: '5px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: 6, borderLeft: '2px solid #4338ca' }}>
                {msg}
              </div>
            ))}
            {hoveredDay.msgs.length > 8 && (
              <p style={{ fontSize: 12, color: '#475569', margin: '4px 0 0' }}>
                +{hoveredDay.msgs.length - 8} more commits
              </p>
            )}
          </div>
        </div>
      )}

      {/* Scrollable Log */}
      <div className="card">
        <div className="card-title">📋 Commit Log</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[...timeline].reverse().map((d, i) => (
            <div
              key={i}
              style={{
                display: 'flex', gap: 16, alignItems: 'flex-start',
                padding: '12px 0',
                borderBottom: i < timeline.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              <div style={{ minWidth: 110, paddingTop: 2 }}>
                <div style={{ fontSize: 12, color: '#6366f1', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{d.dayLabel}</div>
                <div style={{ display: 'inline-block', marginTop: 3, padding: '1px 8px', background: heatColor(d.count, max), borderRadius: 999, fontSize: 11, color: 'white', fontFamily: 'var(--font-mono)' }}>
                  {d.count}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                {d.msgs.slice(0, 3).map((m, j) => (
                  <p key={j} style={{ fontSize: 13, color: '#94a3b8', margin: j > 0 ? '4px 0 0' : 0 }}>• {m}</p>
                ))}
                {d.msgs.length > 3 && (
                  <p style={{ fontSize: 12, color: '#475569', margin: '4px 0 0' }}>+{d.msgs.length - 3} more</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}