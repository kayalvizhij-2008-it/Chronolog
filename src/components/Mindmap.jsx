import { useState } from 'react';

/**
 * Interactive SVG Mindmap with hover tooltips and animated connections
 */
export default function Mindmap({ data }) {
  const [hoveredBranch, setHoveredBranch] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const m = data?.mindmap;

  if (!m || !m.branches?.length) {
    return (
      <div className="card">
        <div className="card-title">🧠 AI Mindmap</div>
        <p className="empty">Mindmap data not available.</p>
      </div>
    );
  }

  const CX = 500, CY = 300;
  const BRANCH_RADIUS = 220;
  const NODE_RADIUS = 80;
  const ROOT_R = 62;

  const branches = m.branches ?? [];

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div className="card">
        <div className="card-title">🧠 Release Architecture Mindmap</div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          Hover over branches and nodes to explore the release structure
        </p>

        <div style={{ overflowX: 'auto' }}>
          <svg
            viewBox="0 0 1000 600"
            width="100%"
            style={{ maxHeight: 520, minHeight: 320 }}
            aria-label="Release mindmap visualization"
          >
            <defs>
              {branches.map((b, i) => (
                <filter key={i} id={`glow-${i}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
              <filter id="root-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Background grid */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(99,102,241,0.06)" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Branches */}
            {branches.map((branch, i) => {
              const angle = (i / branches.length) * 2 * Math.PI - Math.PI / 2;
              const bx = CX + Math.cos(angle) * BRANCH_RADIUS;
              const by = CY + Math.sin(angle) * BRANCH_RADIUS;
              const isHovered = hoveredBranch === i;
              const nodes = branch.nodes ?? [];

              return (
                <g key={i}>
                  {/* Connection to root */}
                  <line
                    x1={CX} y1={CY} x2={bx} y2={by}
                    stroke={branch.color || '#6366f1'}
                    strokeWidth={isHovered ? 3 : 1.5}
                    strokeDasharray={isHovered ? 'none' : '6,3'}
                    opacity={isHovered ? 1 : 0.5}
                    style={{ transition: 'all 0.2s ease' }}
                  />

                  {/* Branch nodes (mini) */}
                  {nodes.slice(0, 4).map((node, j) => {
                    const nodeAngle = angle + ((j - (Math.min(nodes.length, 4) - 1) / 2) * 0.35);
                    const dist = BRANCH_RADIUS + NODE_RADIUS;
                    const nx = CX + Math.cos(nodeAngle) * dist;
                    const ny = CY + Math.sin(nodeAngle) * dist;
                    const nodeId = `${i}-${j}`;
                    return (
                      <g key={j}>
                        <line
                          x1={bx} y1={by} x2={nx} y2={ny}
                          stroke={branch.color || '#6366f1'}
                          strokeWidth={1} opacity={isHovered ? 0.5 : 0.25}
                        />
                        <circle
                          cx={nx} cy={ny} r={18}
                          fill={branch.color + '25'}
                          stroke={branch.color || '#6366f1'}
                          strokeWidth={1}
                          opacity={isHovered ? 1 : 0.4}
                          onMouseEnter={() => setHoveredNode({ text: node, color: branch.color })}
                          onMouseLeave={() => setHoveredNode(null)}
                          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        />
                        <text
                          x={nx} y={ny}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize={8}
                          opacity={isHovered ? 0.9 : 0.5}
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                          •
                        </text>
                      </g>
                    );
                  })}

                  {/* Branch circle */}
                  <circle
                    cx={bx} cy={by}
                    r={isHovered ? 46 : 42}
                    fill={branch.color + (isHovered ? '30' : '18')}
                    stroke={branch.color || '#6366f1'}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    filter={isHovered ? `url(#glow-${i})` : undefined}
                    onMouseEnter={() => setHoveredBranch(i)}
                    onMouseLeave={() => setHoveredBranch(null)}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  />

                  {/* Branch label */}
                  {branch.label?.split(' ').map((word, w) => (
                    <text
                      key={w}
                      x={bx} y={by - 6 + (w * 14)}
                      textAnchor="middle"
                      fill="white"
                      fontSize={11}
                      fontWeight="700"
                      opacity={isHovered ? 1 : 0.85}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {word}
                    </text>
                  ))}

                  {/* Node count badge */}
                  {nodes.length > 0 && (
                    <text
                      x={bx + 30} y={by - 28}
                      fill={branch.color}
                      fontSize={10}
                      fontWeight="800"
                      fontFamily="var(--font-mono)"
                      style={{ pointerEvents: 'none' }}
                    >
                      {nodes.length}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Root node */}
            <circle
              cx={CX} cy={CY} r={ROOT_R + 8}
              fill="rgba(99,102,241,0.1)"
              stroke="rgba(99,102,241,0.3)"
              strokeWidth={1}
            />
            <circle
              cx={CX} cy={CY} r={ROOT_R}
              fill="url(#rootGrad)"
              stroke="#6366f1"
              strokeWidth={2}
              filter="url(#root-glow)"
            />
            <defs>
              <radialGradient id="rootGrad" cx="40%" cy="40%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4338ca" />
              </radialGradient>
            </defs>
            {(m.root || 'Release').split(' ').map((word, i, arr) => (
              <text
                key={i}
                x={CX} y={CY - ((arr.length - 1) * 8) + (i * 16)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={12}
                fontWeight="800"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {word}
              </text>
            ))}
          </svg>
        </div>

        {/* Hovered node tooltip */}
        {hoveredNode && (
          <div className="animate-fadeIn" style={{
            marginTop: 12, padding: '10px 14px',
            background: hoveredNode.color + '15',
            border: `1px solid ${hoveredNode.color}40`,
            borderRadius: 10, fontSize: 13, color: '#cbd5e1',
          }}>
            💡 {hoveredNode.text}
          </div>
        )}
      </div>

      {/* Branch Detail Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        {branches.map((branch, i) => (
          <div
            key={i}
            className="card"
            onMouseEnter={() => setHoveredBranch(i)}
            onMouseLeave={() => setHoveredBranch(null)}
            style={{
              border: `1px solid ${branch.color}30`,
              background: hoveredBranch === i ? branch.color + '10' : 'var(--bg-elevated)',
              transition: 'all 0.2s ease',
              cursor: 'default',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: branch.color }}>{branch.label}</h3>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: branch.color, fontWeight: 700 }}>
                {branch.nodes?.length ?? 0}
              </span>
            </div>
            {(branch.nodes?.length > 0) ? (
              branch.nodes.slice(0, 4).map((node, j) => (
                <p key={j} style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 5px', borderLeft: `2px solid ${branch.color}50`, paddingLeft: 8 }}>
                  {node}
                </p>
              ))
            ) : <p className="empty">No items</p>}
          </div>
        ))}
      </div>
    </div>
  );
}