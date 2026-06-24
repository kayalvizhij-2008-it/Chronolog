export default function AccessibilityToolbar({
  onReadAloud, speaking, onStop, fontScale, setFontScale, highContrast, setHighContrast
}) {
  return (
    <div role="toolbar" aria-label="Accessibility controls" style={{
      position: 'fixed', bottom: 20, right: 20, background: '#1e1b4b',
      border: '1px solid #6366f1', borderRadius: 12, padding: 10,
      display: 'flex', gap: 8, zIndex: 100
    }}>
      <button aria-label="Read current tab aloud" onClick={onReadAloud} style={{
        padding: 8, borderRadius: 8, border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer'
      }}>
        {speaking ? '🔊' : '🔈'} Read
      </button>
      {speaking && (
        <button aria-label="Stop reading" onClick={onStop} style={{
          padding: 8, borderRadius: 8, border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer'
        }}>⏹</button>
      )}
      <button aria-label="Increase text size" onClick={() => setFontScale(f => Math.min(f + 0.1, 1.5))} style={{
        padding: 8, borderRadius: 8, border: 'none', background: '#374151', color: 'white', cursor: 'pointer'
      }}>A+</button>
      <button aria-label="Decrease text size" onClick={() => setFontScale(f => Math.max(f - 0.1, 0.8))} style={{
        padding: 8, borderRadius: 8, border: 'none', background: '#374151', color: 'white', cursor: 'pointer'
      }}>A-</button>
      <button aria-label="Toggle high contrast mode" onClick={() => setHighContrast(h => !h)} style={{
        padding: 8, borderRadius: 8, border: 'none',
        background: highContrast ? '#f59e0b' : '#374151', color: 'white', cursor: 'pointer'
      }}>◐</button>
    </div>
  );
}