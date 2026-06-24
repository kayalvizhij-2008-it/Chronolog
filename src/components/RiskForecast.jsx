import { useState } from 'react';

const sevColor = (s) => {
  const v = (s || '').toLowerCase();
  if (v === 'high')   return '#f87171';
  if (v === 'medium') return '#fbbf24';
  return '#34d399';
};

const sevBg = (s) => {
  const v = (s || '').toLowerCase();
  if (v === 'high')   return 'rgba(248,113,113,0.08)';
  if (v === 'medium') return 'rgba(251,191,36,0.08)';
  return 'rgba(52,211,153,0.08)';
};

const RiskGauge = ({ score = 50 }) => {
  const clamped = Math.max(0, Math.min(100, score));
  const angle = -135 + (clamped / 100) * 270;
  const color = clamped >= 70 ? '#f87171' : clamped >= 40 ? '#fbbf24' : '#34d399';
  const label = clamped >= 70 ? 'HIGH' : clamped >= 40 ? 'MEDIUM' : 'LOW';

  return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <svg viewBox="0 0 200 130" width="200" style={{ overflow: 'visible' }}>
        {/* Track arc */}
        <path
          d="M 20 110 A 80 80 0 1 1 180 110"
          fill="none"
          stroke="rgba(99,102,241,0.15)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Fill arc using stroke-dasharray trick */}
        <path
          d="M 20 110 A 80 80 0 1 1 180 110"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${(clamped / 100) * 251.2} 251.2`}
          style={{ filter: `drop-shadow(0 0 6px ${color}80)`, transition: 'stroke-dasharray 1s ease' }}
        />
        {/* Needle */}
        <g transform={`rotate(${angle}, 100, 110)`}>
          <line x1="100" y1="110" x2="100" y2="42" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="110" r="6" fill={color} />
        </g>
        {/* Center label */}
        <text x="100" y="102" textAnchor="middle" fill={color} fontSize="26" fontWeight="900" fontFamily="var(--font-mono)">{clamped}</text>
        <text x="100" y="120" textAnchor="middle" fill={color} fontSize="11" fontWeight="700" opacity="0.8">{label} RISK</text>
      </svg>
    </div>
  );
};

export default function RiskForecast({ data }) {
  const [selected, setSelected] = useState(null);
  const r = data?.risks;
  const predictions = r?.predictions ?? [];
  const debtItems = r?.technicalDebt ?? [];
  const riskScore = r?.riskScore ?? 50;

  return (
    <div style={{ display: 'grid', gap: 20 }}>

      {/* Header with Gauge */}
      <div className="card animate-fadeInUp" style={{
        background: 'linear-gradient(135deg, var(--bg-elevated), rgba(248,113,113,0.04))',
        border: `1px solid ${sevColor(r?.overallRiskLevel)}40`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="card-title">⚠️ Future Error Forecast</div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
              AI-powered risk analysis based on commit pattern recognition, velocity changes, and historical hotspot detection.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['high', 'medium', 'low'].map((level) => {
                const count = predictions.filter(p => (p.severity || '').toLowerCase() === level).length;
                return (
                  <div key={level} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px', borderRadius: 999,
                    background: sevBg(level), border: `1px solid ${sevColor(level)}40`,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: sevColor(level) }} />
                    <span style={{ fontSize: 12, color: sevColor(level), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{level}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <RiskGauge score={riskScore} />
        </div>
      </div>

      {/* Predictions List */}
      <div className="card animate-fadeInUp" style={{ animationDelay: '0.08s' }}>
        <div className="card-title">🎯 Risk Predictions</div>
        {predictions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {predictions.map((p, i) => {
              const isSelected = selected === i;
              const color = sevColor(p.severity);
              return (
                <div
                  key={i}
                  onClick={() => setSelected(isSelected ? null : i)}
                  style={{
                    background: isSelected ? sevBg(p.severity) : 'var(--bg-surface)',
                    border: `1px solid ${isSelected ? color + '60' : 'var(--border-subtle)'}`,
                    borderRadius: 12, padding: 16, cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderLeft: `4px solid ${color}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <strong style={{ color: 'var(--text-primary)', fontSize: 14 }}>
                      {p.area || 'Unknown Area'}
                    </strong>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 999, background: color + '25', color, fontWeight: 700, textTransform: 'uppercase' }}>
                        {p.severity}
                      </span>
                      <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 999, background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontWeight: 600 }}>
                        {p.confidence} confidence
                      </span>
                    </div>
                  </div>
                  <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>{p.risk}</p>
                  {isSelected && p.mitigation && (
                    <div className="animate-fadeIn" style={{
                      marginTop: 10, padding: '10px 14px',
                      background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)',
                      borderRadius: 8,
                    }}>
                      <p style={{ margin: 0, color: '#6ee7b7', fontSize: 13 }}>
                        💡 <strong>Mitigation:</strong> {p.mitigation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
            <p style={{ color: '#34d399', fontWeight: 700 }}>No significant risks detected!</p>
            <p className="empty">This release appears low-risk based on commit patterns.</p>
          </div>
        )}
      </div>

      {/* Technical Debt */}
      {debtItems.length > 0 && (
        <div className="card animate-fadeInUp" style={{ animationDelay: '0.16s', border: '1px solid rgba(251,191,36,0.2)' }}>
          <div className="card-title" style={{ color: '#fbbf24' }}>💳 Technical Debt Signals</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {debtItems.map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 14px', background: 'rgba(251,191,36,0.05)',
                border: '1px solid rgba(251,191,36,0.15)', borderRadius: 8,
              }}>
                <span style={{ color: '#fbbf24', fontSize: 16, flexShrink: 0 }}>⚡</span>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: 13, lineHeight: 1.5 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}