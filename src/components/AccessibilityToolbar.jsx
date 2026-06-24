import { useState } from 'react';

const MODES = [
  { key: 'default',   label: '🎨 Default',        desc: 'Standard dark theme' },
  { key: 'contrast',  label: '◐ High Contrast',   desc: 'Enhanced visibility' },
  { key: 'dyslexia',  label: '🔡 Dyslexia',       desc: 'Reading-friendly font' },
  { key: 'large',     label: '🔍 Large Text',      desc: 'Bigger type size' },
];

export default function AccessibilityToolbar({
  onReadAloud, speaking, onStop,
  fontScale, setFontScale,
  highContrast, setHighContrast,
  startListening, listening,
  onStartDemo, isDemoRunning, onStopDemo,
}) {
  const [expanded, setExpanded] = useState(false);
  const [dyslexia, setDyslexia] = useState(false);

  const applyMode = (key) => {
    if (key === 'contrast') {
      setHighContrast(!highContrast);
      document.body.classList.toggle('high-contrast', !highContrast);
    }
    if (key === 'dyslexia') {
      setDyslexia(!dyslexia);
      document.body.classList.toggle('dyslexia-font', !dyslexia);
    }
    if (key === 'large') {
      const isLarge = fontScale > 1;
      setFontScale(isLarge ? 1 : 1.2);
    }
  };

  return (
    <div
      role="toolbar"
      aria-label="Accessibility and settings toolbar"
      style={{
        position: 'fixed', bottom: 24, right: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
        zIndex: 200,
      }}
    >
      {/* Expanded panel */}
      {expanded && (
        <div
          className="animate-fadeInUp"
          style={{
            background: 'rgba(13,13,31,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,102,241,0.35)',
            borderRadius: 16, padding: 16,
            minWidth: 220,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}
        >
          <p style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>
            ♿ Accessibility
          </p>

          {/* Font size */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 6px', fontWeight: 600 }}>Text Size</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0.85, 1, 1.15, 1.3].map((scale) => (
                <button
                  key={scale}
                  onClick={() => setFontScale(scale)}
                  aria-label={`Set font size ${Math.round(scale * 100)}%`}
                  style={{
                    flex: 1, padding: '6px 4px', borderRadius: 8, cursor: 'pointer',
                    background: Math.abs(fontScale - scale) < 0.05 ? '#6366f1' : 'rgba(99,102,241,0.1)',
                    border: `1px solid ${Math.abs(fontScale - scale) < 0.05 ? '#6366f1' : 'rgba(99,102,241,0.2)'}`,
                    color: 'white', fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {Math.round(scale * 100)}%
                </button>
              ))}
            </div>
          </div>

          {/* Vision modes */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 6px', fontWeight: 600 }}>Vision Mode</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                { label: '◐ High Contrast', active: highContrast, action: () => applyMode('contrast') },
                { label: '🔡 Dyslexia Font', active: dyslexia,     action: () => applyMode('dyslexia') },
              ].map(({ label, active, action }) => (
                <button
                  key={label}
                  onClick={action}
                  style={{
                    padding: '7px 12px', borderRadius: 8, cursor: 'pointer',
                    background: active ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.06)',
                    border: `1px solid ${active ? '#6366f1' : 'rgba(99,102,241,0.15)'}`,
                    color: active ? '#a5b4fc' : '#64748b',
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit', textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {label} {active ? '✓' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Voice */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 6px', fontWeight: 600 }}>Voice</p>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={speaking ? onStop : onReadAloud}
                aria-label={speaking ? 'Stop reading' : 'Read current tab aloud'}
                style={{
                  flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer',
                  background: speaking ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  color: speaking ? '#a5b4fc' : '#64748b',
                  fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  transition: 'all 0.15s ease',
                }}
              >
                {speaking ? '⏹ Stop' : '🔊 Read Aloud'}
              </button>
              {startListening && (
                <button
                  onClick={() => startListening?.((text) => {
                    if (text.includes('read') || text.includes('play')) onReadAloud?.();
                    if (text.includes('stop')) onStop?.();
                  })}
                  aria-label="Start voice commands"
                  style={{
                    padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                    background: listening ? 'rgba(248,113,113,0.2)' : 'rgba(99,102,241,0.1)',
                    border: `1px solid ${listening ? 'rgba(248,113,113,0.4)' : 'rgba(99,102,241,0.3)'}`,
                    color: listening ? '#fca5a5' : '#64748b',
                    fontSize: 14, fontFamily: 'inherit',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {listening ? '🎙️' : '🎤'}
                </button>
              )}
            </div>
          </div>

          {/* Demo Mode */}
          <div>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 6px', fontWeight: 600 }}>Demo Mode</p>
            <button
              onClick={isDemoRunning ? onStopDemo : onStartDemo}
              style={{
                width: '100%', padding: '8px', borderRadius: 8, cursor: 'pointer',
                background: isDemoRunning ? 'rgba(248,113,113,0.15)' : 'rgba(52,211,153,0.1)',
                border: `1px solid ${isDemoRunning ? 'rgba(248,113,113,0.3)' : 'rgba(52,211,153,0.3)'}`,
                color: isDemoRunning ? '#f87171' : '#34d399',
                fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              {isDemoRunning ? '⏹ Stop Demo' : '▶️ Start Demo Tour'}
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-label="Toggle accessibility toolbar"
        aria-expanded={expanded}
        className="animate-pulseGlow"
        style={{
          width: 48, height: 48, borderRadius: '50%', cursor: 'pointer',
          background: expanded ? '#6366f1' : 'rgba(13,13,31,0.9)',
          border: '2px solid rgba(99,102,241,0.5)',
          color: expanded ? 'white' : '#818cf8',
          fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
        }}
      >
        {expanded ? '×' : '♿'}
      </button>
    </div>
  );
}