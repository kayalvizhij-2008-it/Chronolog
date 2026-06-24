export default function Mindmap({ data }) {
  const m = data.mindmap;
  if (!m) return <p style={{ color: '#64748b' }}>No mindmap data.</p>;

  return (
    <div style={{ background: '#1e1b4b', border: '1px solid #312e81', borderRadius: 12, padding: 24 }}>
      <h3 style={{ color: '#c084fc', margin: '0 0 16px' }}>🧠 Release Mindmap</h3>
      <svg viewBox="0 0 800 500" width="100%" height="500">
        <circle cx="400" cy="250" r="50" fill="#6366f1" />
        <text x="400" y="255" textAnchor="middle" fill="white" fontWeight="700" fontSize="14">
          {m.root}
        </text>
        {m.branches?.map((branch, i) => {
          const angle = (i / m.branches.length) * 2 * Math.PI;
          const bx = 400 + Math.cos(angle) * 220;
          const by = 250 + Math.sin(angle) * 180;
          return (
            <g key={i}>
              <line x1="400" y1="250" x2={bx} y2={by} stroke={branch.color} strokeWidth="2" />
              <circle cx={bx} cy={by} r="40" fill={branch.color} opacity="0.85" />
              <text x={bx} y={by} textAnchor="middle" fill="white" fontSize="11">{branch.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}