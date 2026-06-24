import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Missing VITE_GEMINI_API_KEY. Add your Gemini API key to .env"
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

const callClaude = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error(
      error.message || "Failed to generate AI response"
    );
  }
};
/**
 * Robustly extract and parse JSON from Claude's response.
 * Handles: raw JSON, ```json ... ```, ``` ... ```, partial objects.
 */
const safeParse = (raw, fallback = null) => {
  if (!raw) return fallback;
  // Try extracting from markdown code block first
  const codeBlock = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = codeBlock ? codeBlock[1].trim() : raw.trim();
  // Try extracting the first JSON object/array
  const jsonMatch = candidate.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  try {
    return JSON.parse(jsonMatch?.[1] ?? candidate);
  } catch {
    try {
      // Last resort: try the raw text directly
      return JSON.parse(raw.trim());
    } catch {
      console.warn('safeParse: could not parse Claude response as JSON', raw.slice(0, 200));
      return fallback;
    }
  }
};

// ─────────────────────────────────────────────────────────────
// Exported AI Analysis Functions
// ─────────────────────────────────────────────────────────────

export const generateFullAnalysis = async (commits, prs, repoInfo) => {
  const commitList = commits
    .slice(0, 50)
    .map(c => `${c.commit.message.split('\n')[0]} | ${c.commit.author.name} | ${c.commit.author.date.split('T')[0]}`)
    .join('\n');

  const raw = await callClaude(`
Analyze these GitHub commits for the repository "${repoInfo.name}".
Stars: ${repoInfo.stargazers_count} | Language: ${repoInfo.language || 'Unknown'} | Branch: ${repoInfo.default_branch}

COMMITS (newest first):
${commitList}

Return ONLY valid JSON, no explanation, no markdown:
{
  "summary": "2-3 sentence executive summary of what changed",
  "categories": {
    "features": ["feature description 1", "feature description 2"],
    "bugfixes": ["bug description 1"],
    "security": ["security improvement 1"],
    "performance": ["performance improvement 1"],
    "breaking": ["breaking change description 1"],
    "docs": ["documentation change 1"]
  },
  "version": {
    "recommended": "1.2.3",
    "type": "major|minor|patch",
    "reason": "short reason for the version bump"
  },
  "readiness": {
    "score": 85,
    "grade": "A",
    "risks": ["risk 1", "risk 2"],
    "positives": ["positive 1", "positive 2"],
    "recommendation": "Ready to ship / Needs review / Hold release"
  }
}`, 1500);

  return safeParse(raw, {
    summary: 'AI analysis completed. See individual sections for details.',
    categories: { features: [], bugfixes: [], security: [], performance: [], breaking: [], docs: [] },
    version: { recommended: '1.0.0', type: 'patch', reason: 'Initial analysis' },
    readiness: { score: 70, grade: 'B', risks: [], positives: [], recommendation: 'Review recommended' },
  });
};

export const generateStakeholderNotes = async (commits, categories) => {
  const msgs = commits.slice(0, 30).map(c => c.commit.message.split('\n')[0]).join('\n');

  const raw = await callClaude(`
Based on these git commits, write tailored release notes for each audience.

COMMITS:
${msgs}

CATEGORIES DETECTED:
${JSON.stringify(categories, null, 2)}

Return ONLY valid JSON:
{
  "developer": "Technical details for engineers: API changes, architecture decisions, new dependencies, migration steps",
  "qa": "What to test, regression areas, new features to validate, edge cases to consider",
  "manager": "Business impact, velocity metrics, what we shipped, team progress, timeline notes",
  "user": "Plain-English explanation of what changed and how it improves their experience"
}`);

  return safeParse(raw, {
    developer: 'See commit log for technical details.',
    qa: 'Run full regression suite on modified components.',
    manager: 'Team delivered scheduled features this sprint.',
    user: 'Bug fixes and performance improvements.',
  });
};

export const generateStory = async (commits, repoName) => {
  const list = commits
    .slice(0, 30)
    .map(c => `- ${c.commit.message.split('\n')[0]} by ${c.commit.author.name}`)
    .join('\n');

  const result = await callClaude(`
You are a creative technical writer and storyteller.

Write a SHORT, engaging narrative story (150-180 words) about what happened in the repository "${repoName}" based on these commits. 
Write in a compelling, human voice — like a chapter from a tech memoir. 
No bullet points. No headings. Just flowing prose.

COMMITS:
${list}`, 600);

  return result || 'The story of this repository is still being written...';
};

export const generateArchaeology = async (commits, repoInfo) => {
  const timeline = commits
    .slice(-40)
    .map(c => ({ date: c.commit.author.date.split('T')[0], msg: c.commit.message.split('\n')[0], author: c.commit.author.name }));

  const result = await callClaude(`
Write a 200-250 word Wikipedia-style history of this software project. 
Be factual but engaging. Cover origin, major development phases, key milestones, and current state.

PROJECT:
Name: ${repoInfo.name}
Description: ${repoInfo.description || 'No description provided'}
Created: ${repoInfo.created_at?.split('T')[0]}
Stars: ${repoInfo.stargazers_count}
Language: ${repoInfo.language || 'Unknown'}
Default Branch: ${repoInfo.default_branch}

COMMIT HISTORY SAMPLE:
${JSON.stringify(timeline.slice(0, 20), null, 2)}`, 800);

  return result || 'Repository history analysis unavailable.';
};

export const generateGraveyard = async (prs, branches) => {
  const deadPRs = (prs || [])
    .filter(pr => pr.state === 'closed' && !pr.merged_at)
    .slice(0, 20)
    .map(pr => `"${pr.title}" — opened ${pr.created_at?.split('T')[0]}, closed ${pr.closed_at?.split('T')[0]}`);

  const staleBranches = (branches || [])
    .filter(b => !['main', 'master', 'develop', 'dev', 'staging', 'production'].includes(b.name))
    .slice(0, 12)
    .map(b => b.name);

  const raw = await callClaude(`
Analyze abandoned pull requests and stale branches to identify "dead features" — work that was started but never shipped.

DEAD / CLOSED PRs (never merged):
${deadPRs.join('\n') || 'None found'}

STALE BRANCHES (not main/master/develop):
${staleBranches.join('\n') || 'None found'}

Return ONLY valid JSON:
{
  "graveyard": [
    {
      "name": "Feature or branch name",
      "reason": "Why this was likely abandoned (2 sentences)",
      "effort": "low|medium|high",
      "emoji": "⚰️"
    }
  ],
  "insight": "Overall insight about what these abandoned items reveal about the team or project"
}`);

  return safeParse(raw, {
    graveyard: [],
    insight: 'No abandoned features found — great shipping discipline! 🎉',
  });
};

export const generateErrorPrediction = async (commits, repoInfo) => {
  const commitList = commits
    .slice(0, 40)
    .map(c => `${c.commit.message.split('\n')[0]} | ${c.commit.author.date.split('T')[0]}`)
    .join('\n');

  const raw = await callClaude(`
You are a senior software architect performing a risk assessment based on commit patterns.

REPOSITORY: ${repoInfo.name}
LANGUAGE: ${repoInfo.language || 'Unknown'}
OPEN ISSUES: ${repoInfo.open_issues_count || 0}

RECENT COMMITS:
${commitList}

Analyze patterns to predict potential failures and technical debt. Look for: rapid changes to same files, frequent hotfixes, security-related commits, missing test commits, dependency updates.

Return ONLY valid JSON:
{
  "predictions": [
    {
      "area": "Area of the codebase at risk",
      "risk": "Specific risk description (1-2 sentences)",
      "severity": "low|medium|high",
      "confidence": "low|medium|high",
      "mitigation": "Suggested action to reduce this risk"
    }
  ],
  "technicalDebt": ["debt item 1", "debt item 2"],
  "overallRiskLevel": "low|medium|high",
  "riskScore": 45
}`);

  return safeParse(raw, {
    predictions: [],
    technicalDebt: [],
    overallRiskLevel: 'medium',
    riskScore: 50,
  });
};

export const generateImpactAnalysis = async (commits, repoInfo) => {
  const msgs = commits.slice(0, 40).map(c => c.commit.message.split('\n')[0]).join('\n');

  const raw = await callClaude(`
Analyze the business and social impact of changes in this software repository.

REPOSITORY: ${repoInfo.name}
DESCRIPTION: ${repoInfo.description || 'Not provided'}
LANGUAGE: ${repoInfo.language || 'Unknown'}

COMMITS:
${msgs}

Return ONLY valid JSON:
{
  "businessImpact": {
    "customerExperience": "Low|Medium|High",
    "revenueImpact": "Low|Medium|High",
    "securityImpact": "Low|Medium|High",
    "performanceImpact": "Low|Medium|High",
    "reasoning": "3-4 sentence business analysis of the changes"
  },
  "sdgContribution": [
    {
      "goal": "SDG 9: Industry, Innovation and Infrastructure",
      "number": 9,
      "explanation": "How this project contributes to this UN SDG"
    }
  ]
}`);

  return safeParse(raw, {
    businessImpact: {
      customerExperience: 'Medium',
      revenueImpact: 'Low',
      securityImpact: 'Low',
      performanceImpact: 'Medium',
      reasoning: 'Impact analysis based on commit patterns.',
    },
    sdgContribution: [],
  });
};

export const generateMindmap = async (commits, categories) => {
  const raw = await callClaude(`
Build a mindmap structure for this software release based on the categorized changes.

CATEGORIES:
${JSON.stringify(categories, null, 2)}

Return ONLY valid JSON:
{
  "root": "Release Name (e.g. v2.1 — The Performance Update)",
  "branches": [
    {
      "label": "🚀 Features",
      "color": "#6366f1",
      "nodes": ["node 1", "node 2", "node 3"]
    },
    {
      "label": "🐛 Bug Fixes",
      "color": "#10b981",
      "nodes": ["bug fix 1", "bug fix 2"]
    }
  ]
}

Include branches for Features, Bug Fixes, Security, Performance, Breaking Changes, and Documentation. Only include branches that have nodes.`);

  return safeParse(raw, {
    root: 'Latest Release',
    branches: [
      { label: '🚀 Features', color: '#6366f1', nodes: [] },
      { label: '🐛 Bug Fixes', color: '#10b981', nodes: [] },
    ],
  });
};

export const generateLinkedInPost = async (repoName, summary, version) => {
  const result = await callClaude(`
Write a professional, engaging LinkedIn post announcing a software release.

PRODUCT: ${repoName}
VERSION: v${version}
SUMMARY: ${summary}

Rules:
- Maximum 150 words
- Professional but genuinely excited tone
- Use 3-4 relevant emojis
- Include a clear call-to-action
- End with 3 relevant hashtags
- No generic filler phrases

Return ONLY the post text, ready to copy-paste.`, 600);

  return result || `🚀 Excited to announce v${version} of ${repoName}! ${summary} #OpenSource #SoftwareEngineering #Release`;
};

export const generateEmail = async (repoName, summary, stakeholderNotes, version) => {
  const raw = await callClaude(`
Write a professional release announcement email.

PRODUCT: ${repoName}
VERSION: v${version}
SUMMARY: ${summary}
KEY CHANGES FOR STAKEHOLDERS: ${stakeholderNotes?.manager || summary}

Return ONLY valid JSON:
{
  "subject": "Email subject line",
  "body": "Full email body with greeting, changes summary, and sign-off"
}`);

  return safeParse(raw, {
    subject: `${repoName} v${version} — Release Notes`,
    body: `Hi team,\n\nWe're excited to announce v${version} of ${repoName}.\n\n${summary}\n\nBest regards,\nThe Dev Team`,
  });
};
