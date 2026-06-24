import { useState } from "react";
import { fetchAllRepoData } from "./services/github";
import {
  generateFullAnalysis, generateStakeholderNotes, generateStory,
  generateArchaeology, generateGraveyard, generateErrorPrediction,
  generateImpactAnalysis, generateMindmap
} from "./services/claude";
import { buildTimeline } from "./services/utils";
import { useVoice } from "./hooks/useVoice";

import Dashboard from "./components/Dashboard";
import Categories from "./components/Categories";
import Stakeholders from "./components/Stakeholders";
import Story from "./components/Story";
import History from "./components/History";
import Graveyard from "./components/Graveyard";
import Timeline from "./components/Timeline";
import Mindmap from "./components/Mindmap";
import Impact from "./components/Impact";
import RiskForecast from "./components/RiskForecast";
import Share from "./components/Share";
import AccessibilityToolbar from "./components/AccessibilityToolbar";

const TABS = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'categories', label: '📂 Categories' },
  { id: 'stakeholders', label: '👥 Stakeholders' },
  { id: 'story', label: '📖 Story' },
  { id: 'history', label: '🏛️ History' },
  { id: 'graveyard', label: '🚫 Graveyard' },
  { id: 'timeline', label: '📅 Timeline' },
  { id: 'mindmap', label: '🧠 Mindmap' },
  { id: 'impact', label: '🌍 Impact' },
  { id: 'risks', label: '⚠️ Risk Forecast' },
  { id: 'share', label: '🚀 Share' }
];

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const { speak, stop, speaking } = useVoice();

  const analyze = async () => {
    if (!url) return;
    setLoading(true);
    setData(null);
    setProgress(0);

    try {
      setStep('🔍 Fetching GitHub data...'); setProgress(10);
      const repoData = await fetchAllRepoData(url);

      setStep('🤖 Running AI analysis...'); setProgress(25);
      const analysis = await generateFullAnalysis(repoData.commits, repoData.prs, repoData.repoInfo);

      setStep('👥 Building stakeholder reports...'); setProgress(40);
      const stakeholders = await generateStakeholderNotes(repoData.commits, analysis?.categories);

      setStep('📖 Writing the story...'); setProgress(50);
      const story = await generateStory(repoData.commits, repoData.repoInfo.name);

      setStep('🏛️ Digging through history...'); setProgress(60);
      const archaeology = await generateArchaeology(repoData.commits, repoData.repoInfo);

      setStep('🚫 Finding the graveyard...'); setProgress(70);
      const graveyard = await generateGraveyard(repoData.prs, repoData.branches);

      setStep('🧠 Mapping the mind...'); setProgress(80);
      const mindmap = await generateMindmap(repoData.commits, analysis?.categories);

      setStep('🌍 Measuring impact...'); setProgress(88);
      const impact = await generateImpactAnalysis(repoData.commits, repoData.repoInfo);

      setStep('⚠️ Forecasting risk...'); setProgress(95);
      const risks = await generateErrorPrediction(repoData.commits, repoData.repoInfo);

      const timeline = buildTimeline(repoData.commits);

      setProgress(100);
      setData({
        analysis, stakeholders, story, archaeology, graveyard,
        mindmap, impact, risks, timeline,
        repoInfo: repoData.repoInfo, commits: repoData.commits
      });
      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Check console for details.');
    }
    setLoading(false);
    setStep('');
  };

  const downloadReport = () => {
    const content = `# ${data.repoInfo.name} — ChronoLog Report

## Version: ${data.analysis?.version?.recommended}
## Summary
${data.analysis?.summary}

## Risk Forecast: ${data.risks?.overallRiskLevel}
${data.risks?.predictions?.map(p => `- ${p.area}: ${p.risk} (${p.severity})`).join('\n')}

## Business & SDG Impact
${data.impact?.businessImpact?.reasoning}

## For Developers
${data.stakeholders?.developer}

## Project Story
${data.story}

## Project History
${data.archaeology}
`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${data.repoInfo.name}-chronolog.md`;
    a.click();
  };

  const readAloud = () => {
    const map = {
      dashboard: data?.analysis?.summary,
      story: data?.story,
      history: data?.archaeology,
      impact: data?.impact?.businessImpact?.reasoning,
      risks: data?.risks?.predictions?.map(p => `${p.area}: ${p.risk}`).join('. ')
    };
    speak(map[activeTab] || 'No readable content on this tab.');
  };

  const renderTab = () => {
    if (!data) return null;
    switch (activeTab) {
      case 'dashboard': return <Dashboard data={data} />;
      case 'categories': return <Categories data={data} />;
      case 'stakeholders': return <Stakeholders data={data} />;
      case 'story': return <Story data={data} />;
      case 'history': return <History data={data} />;
      case 'graveyard': return <Graveyard data={data} />;
      case 'timeline': return <Timeline data={data} />;
      case 'mindmap': return <Mindmap data={data} />;
      case 'impact': return <Impact data={data} />;
      case 'risks': return <RiskForecast data={data} />;
      case 'share': return <Share data={data} />;
      default: return null;
    }
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh',
      background: '#0f0f1a', color: '#e2e8f0', fontSize: `${fontScale}em`,
      filter: highContrast ? 'contrast(1.4) brightness(1.1)' : 'none'
    }}>
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', padding: '32px 24px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 42, background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ⚡ ChronoLog
        </h1>
        <p style={{ color: '#a5b4fc', margin: '8px 0 24px', fontSize: 16 }}>Every repo has a story. We tell it.</p>

        <div style={{ display: 'flex', gap: 12, maxWidth: 700, margin: '0 auto' }}>
          <input
            value={url} onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && analyze()}
            placeholder="https://github.com/owner/repo"
            style={{ flex: 1, padding: '14px 16px', fontSize: 15, borderRadius: 10, border: '2px solid #4338ca', background: '#1e1b4b', color: 'white', outline: 'none' }}
          />
          <button onClick={analyze} disabled={loading || !url} style={{
            padding: '14px 28px', background: loading ? '#4338ca' : '#6366f1', color: 'white',
            border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 600
          }}>
            {loading ? '⏳ Analyzing...' : '🚀 Analyze'}
          </button>
        </div>

        {loading && (
          <div style={{ maxWidth: 700, margin: '16px auto 0' }}>
            <div style={{ background: '#1e1b4b', borderRadius: 8, height: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(to right, #6366f1, #a855f7)', transition: 'width 0.5s ease', borderRadius: 8 }} />
            </div>
            <p style={{ color: '#a5b4fc', margin: '8px 0 0', fontSize: 14 }}>{step}</p>
          </div>
        )}
      </div>

      {data && (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
          <div style={{ background: '#1e1b4b', border: '1px solid #312e81', borderRadius: 12, padding: 20, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ margin: 0, color: '#a5b4fc' }}>📦 {data.repoInfo.name}</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b' }}>{data.repoInfo.description || 'No description'}</p>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ background: '#312e81', padding: '6px 14px', borderRadius: 20, color: '#818cf8', fontWeight: 700, fontSize: 18 }}>
                v{data.analysis?.version?.recommended}
              </span>
              <span>⭐ {data.repoInfo.stargazers_count}</span>
              <span>🍴 {data.repoInfo.forks_count}</span>
              <button onClick={downloadReport} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                ⬇️ Download
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: activeTab === tab.id ? '#6366f1' : '#1e1b4b',
                color: activeTab === tab.id ? 'white' : '#94a3b8',
                border: activeTab === tab.id ? 'none' : '1px solid #312e81'
              }}>
                {tab.label}
              </button>
            ))}
          </div>

          {renderTab()}
        </div>
      )}

      <AccessibilityToolbar
        onReadAloud={readAloud} speaking={speaking} onStop={stop}
        fontScale={fontScale} setFontScale={setFontScale}
        highContrast={highContrast} setHighContrast={setHighContrast}
      />
    </div>
  );
}