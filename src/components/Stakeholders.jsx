const GROUPS = [
  { key: 'developer', label: '👨‍💻 Developer Notes', color: '#3b82f6', bg: '#1e3a5f' },
  { key: 'qa', label: '🧪 QA Testing Guide', color: '#10b981', bg: '#1a3a2a' },
  { key: 'manager', label: '📊 Manager Summary', color: '#f59e0b', bg: '#3a2f1a' },
  { key: 'user', label: '👤 User-Friendly Notes', color: '#a855f7', bg: '#2d1a3a' }
];

export default function Stakeholders({ data }) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {GROUPS.map(({ key, label, color, bg }) => (
        <div key={key} style={{ background: bg, border: `1px solid ${color}40`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: '0 0 12px', color }}>{label}</h3>
          <p style={{ margin: 0, lineHeight: 1.8, color: '#cbd5e1' }}>{data.stakeholders?.[key]}</p>
        </div>
      ))}
    </div>
  );
}