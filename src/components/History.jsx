export default function History({ data }) {
  return (
    <div style={{ background: '#1e1b4b', border: '1px solid #312e81', borderRadius: 12, padding: 24 }}>
      <h3 style={{ color: '#c084fc', margin: '0 0 16px' }}>🏛️ Repository Archaeology</h3>
      <p style={{ lineHeight: 1.9, color: '#cbd5e1', margin: 0 }}>{data.archaeology}</p>
    </div>
  );
}