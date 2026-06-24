import { useState, useCallback } from 'react';
import './App.css';

import { fetchAllRepoData } from './services/github';
import {
  generateFullAnalysis,
  generateStakeholderNotes,
  generateStory,
  generateArchaeology,
  generateGraveyard,
  generateErrorPrediction,
  generateImpactAnalysis,
  generateMindmap,
} from './services/claude';
import { buildTimeline } from './services/utils';
import { useVoice } from './hooks/useVoice';
import { useDemo } from './hooks/useDemo';

import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './components/Dashboard';
import Categories from './components/Categories';
import Stakeholders from './components/Stakeholders';
import Story from './components/Story';
import History from './components/History';
import Graveyard from './components/Graveyard';
import Timeline from './components/Timeline';
import Mindmap from './components/Mindmap';
import Impact from './components/Impact';
import RiskForecast from './components/RiskForecast';
import Share from './components/Share';
import AccessibilityToolbar from './components/AccessibilityToolbar';

// ── Tab Definitions ───────────────────────────────────────────
const TABS = [
  { id: 'dashboard',    label: '📊 Dashboard' },
  { id: 'categories',  label: '📂 Categories' },
  { id: 'timeline',    label: '📅 Timeline' },
  { id: 'mindmap',     label: '🧠 Mindmap' },
  { id: 'impact',      label: '🌍 Impact' },
  { id: 'risks',       label: '⚠️ Risk Forecast' },
  { id: 'stakeholders',label: '👥 Stakeholders' },
  { id: 'story',       label: '📖 Story' },
  { id: 'history',     label: '🏛️ History' },
  { id: 'graveyard',   label: '🚫 Graveyard' },
  { id: 'share',       label: '🚀 Share' },
];

// Tab → readable content for voice narration
const TAB_NARRATION = (data) => ({
  dashboard:    data?.analysis?.summary,
  story:        data?.story,
  history:      data?.archaeology,
  impact:       data?.impact?.businessImpact?.reasoning,
  risks:        data?.risks?.predictions?.map((p) => `${p.area}: ${p.risk}`).join('. '),
  stakeholders: data?.stakeholders?.manager,
});

// ── Analysis Steps ────────────────────────────────────────────
const STEPS = [
  { label: '🔍 Fetching GitHub data…',        pct: 8  },
  { label: '🤖 Running AI analysis…',          pct: 22 },
  { label: '👥 Building stakeholder notes…',  pct: 35 },
  { label: '📖 Writing the release story…',   pct: 48 },
  { label: '🏛️ Digging through history…',     pct: 58 },
  { label: '🚫 Finding the graveyard…',       pct: 68 },
  { label: '🧠 Mapping the mind…',            pct: 78 },
  { label: '🌍 Measuring impact…',            pct: 87 },
  { label: '⚠️ Forecasting risk…',            pct: 95 },
  { label: '✅ Finalizing report…',            pct: 100 },
];

// ── Demo Mode Sample URLs ──────────────────────────────────────
const DEMO_URLS = [
  'https://github.com/facebook/react',
  'https://github.com/vercel/next.js',
  'https://github.com/vitejs/vite',
  'https://github.com/microsoft/vscode',
];

// ── App Component ─────────────────────────────────────────────
export default function App() {
  const [url, setUrl]           = useState('');
  const [loading, setLoading]   = useState(false);
  const [step, setStep]         = useState('');
  const [progress, setProgress] = useState(0);
  const [data, setData]         = useState(null);
  const [error, setError]       = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Accessibility state
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);

  const { speak, stop, speaking, startListening, listening } = useVoice();

  const {
    isRunning: isDemoRunning,
    startDemo,
    stopDemo,
    currentStepData,
    showTooltip,
    currentStep: demoStep,
    totalSteps,
  } = useDemo({ setActiveTab, speak, stop });

  // ── Analyze ──────────────────────────────────────────────────
  const analyze = useCallback(async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl || loading) return;

    setLoading(true);
    setData(null);
    setError('');
    setProgress(0);

    const tick = (i) => {
      setStep(STEPS[i].label);
      setProgress(STEPS[i].pct);
    };

    try {
      tick(0);
      const repoData = await fetchAllRepoData(trimmedUrl);

      tick(1);
      const analysis = await generateFullAnalysis(
        repoData.commits, repoData.prs, repoData.repoInfo
      );

      tick(2);
      const stakeholders = await generateStakeholderNotes(
        repoData.commits, analysis?.categories
      );

      tick(3);
      const story = await generateStory(
        repoData.commits, repoData.repoInfo.name
      );

      tick(4);
      const archaeology = await generateArchaeology(
        repoData.commits, repoData.repoInfo
      );

      tick(5);
      const graveyard = await generateGraveyard(
        repoData.prs, repoData.branches
      );

      tick(6);
      const mindmap = await generateMindmap(
        repoData.commits, analysis?.categories
      );

      tick(7);
      const impact = await generateImpactAnalysis(
        repoData.commits, repoData.repoInfo
      );

      tick(8);
      const risks = await generateErrorPrediction(
        repoData.commits, repoData.repoInfo
      );

      tick(9);
      const timeline = buildTimeline(repoData.commits);

      setData({
        analysis, stakeholders, story, archaeology, graveyard,
        mindmap, impact, risks, timeline,
        repoInfo: repoData.repoInfo,
        commits:  repoData.commits,
        languages: repoData.languages,
      });
      setActiveTab('dashboard');
    } catch (err) {
      console.error('[ChronoLog] analyze error:', err);
      setError(err.message || 'Something went wrong. Check the console for details.');
    } finally {
      setLoading(false);
      setStep('');
      setProgress(0);
    }
  }, [url, loading]);

  // ── Voice narration for current tab ──────────────────────────
  const readAloud = useCallback(() => {
    if (!data) return;
    const map = TAB_NARRATION(data);
    speak(map[activeTab] || 'No readable content on this tab.');
  }, [data, activeTab, speak]);

  // ── Tab renderer ──────────────────────────────────────────────
  const renderTab = () => {
    if (!data) return null;
    const props = { data };
    const map = {
      dashboard:    <Dashboard    {...props} />,
      categories:   <Categories   {...props} />,
      timeline:     <Timeline     {...props} />,
      mindmap:      <Mindmap      {...props} />,
      impact:       <Impact       {...props} />,
      risks:        <RiskForecast {...props} />,
      stakeholders: <Stakeholders {...props} />,
      story:        <Story        {...props} />,
      history:      <History      {...props} />,
      graveyard:    <Graveyard    {...props} />,
      share:        <Share        {...props} />,
    };
    return map[activeTab] ?? null;
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        color: 'var(--text-primary)',
        fontSize: `${fontScale}em`,
      }}
    >
      {/* ── Hero Header ── */}
      <header className="hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="hero-title">⚡ ChronoLog</h1>
          <p className="hero-sub">Every repo has a story. We tell it.</p>

          {/* Search Bar */}
          <div className="search-bar">
            <input
              id="repo-url-input"
              className="search-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyze()}
              placeholder="https://github.com/owner/repo"
              aria-label="GitHub repository URL"
              disabled={loading}
            />
            <button
              id="analyze-btn"
              className="btn-analyze"
              onClick={analyze}
              disabled={loading || !url.trim()}
              aria-label="Analyze repository"
            >
              {loading ? '⏳ Analyzing…' : '🚀 Analyze'}
            </button>
          </div>

          {/* Quick demo URLs */}
          {!data && !loading && (
            <div style={{ marginTop: 12, display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#475569', alignSelf: 'center' }}>Try:</span>
              {DEMO_URLS.map((u) => (
                <button
                  key={u}
                  onClick={() => setUrl(u)}
                  style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
                    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                    color: '#818cf8', fontFamily: 'inherit', fontWeight: 600,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; }}
                >
                  {u.replace('https://github.com/', '')}
                </button>
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {loading && (
            <div className="progress-wrap">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="progress-step">{step}</p>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div
              className="animate-fadeIn"
              style={{
                maxWidth: 680, margin: '14px auto 0',
                padding: '14px 18px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 12, color: '#fca5a5', fontSize: 14,
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}
            >
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <div>
                <strong>Analysis failed:</strong> {error}
                {!import.meta.env.VITE_ANTHROPIC_API_KEY && (
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: '#94a3b8' }}>
                    💡 Make sure you've created a <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: 3 }}>.env</code> file with your <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: 3 }}>VITE_ANTHROPIC_API_KEY</code>.
                    Copy <strong>.env.example</strong> to <strong>.env</strong> to get started.
                  </p>
                )}
              </div>
              <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 16, flexShrink: 0, padding: 0 }}>×</button>
            </div>
          )}
        </div>
      </header>

      {/* ── Main Content ── */}
      {data && (
        <main className="main-content">

          {/* Repo Info Bar */}
          <div className="repo-bar">
            <div>
              <div className="repo-name">📦 {data.repoInfo?.name}</div>
              <div className="repo-desc">{data.repoInfo?.description || 'No description'}</div>
            </div>
            <div className="repo-meta">
              <span className="version-badge">v{data.analysis?.version?.recommended || '?'}</span>
              <span className="repo-stat">⭐ {data.repoInfo?.stargazers_count?.toLocaleString()}</span>
              <span className="repo-stat">🍴 {data.repoInfo?.forks_count?.toLocaleString()}</span>
              {data.repoInfo?.language && (
                <span className="repo-stat">🔤 {data.repoInfo.language}</span>
              )}
              <a
                href={data.repoInfo?.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
                  color: '#818cf8', textDecoration: 'none', transition: 'all 0.15s',
                }}
              >
                GitHub ↗
              </a>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="nav-tabs" role="tablist" aria-label="Analysis sections">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                className={`nav-tab${activeTab === tab.id ? ' active' : ''}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Tab Panel */}
          <div
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="tab-content"
            key={activeTab}
          >
            <ErrorBoundary title={`${activeTab} panel failed to render`}>
              {renderTab()}
            </ErrorBoundary>
          </div>
        </main>
      )}

      {/* ── Demo Tour Tooltip ── */}
      {isDemoRunning && showTooltip && currentStepData && (
        <div
          className="animate-fadeInUp"
          style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(13,13,31,0.95)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,102,241,0.5)', borderRadius: 16,
            padding: '16px 20px', maxWidth: 520, width: '90vw',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.2)',
            zIndex: 500,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#818cf8' }}>
                {currentStepData.title}
              </span>
              <span style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono)' }}>
                {demoStep + 1}/{totalSteps}
              </span>
            </div>
            <button
              onClick={stopDemo}
              style={{
                background: 'none', border: 'none', color: '#475569',
                cursor: 'pointer', fontSize: 16, padding: 0,
              }}
            >×</button>
          </div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: 13, lineHeight: 1.7 }}>
            {currentStepData.narration}
          </p>
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 4, marginTop: 12, justifyContent: 'center' }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} style={{
                width: i === demoStep ? 16 : 6, height: 6, borderRadius: 999,
                background: i === demoStep ? '#6366f1' : 'rgba(99,102,241,0.2)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Accessibility Toolbar ── */}
      <AccessibilityToolbar
        onReadAloud={readAloud}
        speaking={speaking}
        onStop={stop}
        fontScale={fontScale}
        setFontScale={setFontScale}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        startListening={startListening}
        listening={listening}
        onStartDemo={data ? startDemo : null}
        isDemoRunning={isDemoRunning}
        onStopDemo={stopDemo}
      />
    </div>
  );
}