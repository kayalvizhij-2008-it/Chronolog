import { useState } from 'react';

const GROUPS = [
  {
    key: 'developer',
    label: 'Developer Notes',
    emoji: '👨‍💻',
    color: '#818cf8',
    border: 'rgba(129,140,248,0.3)',
    bg: 'rgba(129,140,248,0.06)',
    desc: 'Technical implementation details, API changes, dependencies',
  },
  {
    key: 'qa',
    label: 'QA Testing Guide',
    emoji: '🧪',
    color: '#34d399',
    border: 'rgba(52,211,153,0.3)',
    bg: 'rgba(52,211,153,0.06)',
    desc: 'Regression areas, new feature validation, edge cases',
  },
  {
    key: 'manager',
    label: 'Manager Summary',
    emoji: '📊',
    color: '#fbbf24',
    border: 'rgba(251,191,36,0.3)',
    bg: 'rgba(251,191,36,0.06)',
    desc: 'Business impact, team velocity, delivery timeline',
  },
  {
    key: 'user',
    label: 'User-Friendly Notes',
    emoji: '👤',
    color: '#f472b6',
    border: 'rgba(244,114,182,0.3)',
    bg: 'rgba(244,114,182,0.06)',
    desc: "What changed and why it's better for end users",
  },
];

export default function Stakeholders({ data }) {
  const [copied, setCopied] = useState('');
  const notes = data?.stakeholders ?? {};

  const copyToClipboard = (key, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-elevated), rgba(99,102,241,0.06))' }}>
        <div className="card-title">👥 Stakeholder Report Center</div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
          One release, four audiences. AI-tailored notes for every stakeholder — ready to copy and share.
        </p>
      </div>

      {GROUPS.map(({ key, label, emoji, color, border, bg, desc }, i) => {
        const text = notes[key];
        return (
          <div
            key={key}
            className="card animate-fadeInUp"
            style={{
              background: bg, border: `1px solid ${border}`,
              animationDelay: `${i * 0.06}s`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: 0, color, fontSize: 16, fontWeight: 700 }}>
                  {emoji} {label}
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{desc}</p>
              </div>
              {text && (
                <button
                  onClick={() => copyToClipboard(key, text)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                    background: copied === key ? 'rgba(52,211,153,0.15)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${copied === key ? 'rgba(52,211,153,0.4)' : border}`,
                    color: copied === key ? '#34d399' : color,
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                    transition: 'all 0.2s ease', flexShrink: 0,
                  }}
                >
                  {copied === key ? '✅ Copied!' : '📋 Copy'}
                </button>
              )}
            </div>
            {text ? (
              <p style={{
                margin: 0, lineHeight: 1.85, color: '#cbd5e1', fontSize: 14,
                padding: '14px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: 10,
                borderLeft: `3px solid ${color}60`,
                whiteSpace: 'pre-wrap',
              }}>
                {text}
              </p>
            ) : (
              <p className="empty">Stakeholder notes not available.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}