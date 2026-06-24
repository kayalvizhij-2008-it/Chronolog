const CLAUDE_API = 'https://api.anthropic.com/v1/messages';

const callClaude = async (prompt) => {
const response = await fetch(CLAUDE_API, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
'anthropic-version': '2023-06-01'
},
body: JSON.stringify({
model: 'claude-sonnet-4-20250514',
max_tokens: 1000,
messages: [
{
role: 'user',
content: prompt
}
]
})
});

const data = await response.json();
return data?.content?.[0]?.text || '';
};

const safeParse = (raw, fallback = null) => {
try {
return JSON.parse(
raw
.replace(/`json/g, '')
        .replace(/`/g, '')
.trim()
);
} catch {
return fallback;
}
};

export const generateFullAnalysis = async (commits, prs, repoInfo) => {
const commitList = commits
.slice(0, 50)
.map(
c =>
`${c.commit.message} | author: ${c.commit.author.name} | date: ${c.commit.author.date}`
)
.join('\n');

const result = await callClaude(`
Analyze these GitHub commits for repo "${repoInfo.name}".
Current version: ${repoInfo.default_branch}

Commits:
${commitList}

Return ONLY valid JSON:
{
"summary": "",
"categories": {
"features": [],
"bugfixes": [],
"security": [],
"performance": [],
"breaking": [],
"docs": []
},
"version": {
"recommended": "",
"type": "major/minor/patch",
"reason": ""
},
"readiness": {
"score": 85,
"grade": "A",
"risks": [],
"positives": [],
"recommendation": ""
}
}
`);

return safeParse(result);
};

export const generateStakeholderNotes = async (commits, categories) => {
const data = commits
.slice(0, 30)
.map(c => c.commit.message)
.join('\n');

const result = await callClaude(`
Based on these commits:
${data}

Categories:
${JSON.stringify(categories)}

Return ONLY valid JSON:
{
"developer": "",
"qa": "",
"manager": "",
"user": ""
}
`);

return safeParse(result);
};

export const generateStory = async (commits, repoName) => {
const commitList = commits
.slice(0, 30)
.map(c => `- ${c.commit.message} by ${c.commit.author.name}`)
.join('\n');

return callClaude(`
You are a storyteller.

Write a SHORT engaging story (150 words max)
about what happened in repo "${repoName}"
based on these commits:

${commitList}

Human narrative style.
No bullet points.
`);
};

export const generateArchaeology = async (commits, repoInfo) => {
const timeline = commits.slice(-50).map(c => ({
date: c.commit.author.date.split('T')[0],
message: c.commit.message,
author: c.commit.author.name
}));

return callClaude(`
Write a 200 word Wikipedia-style history of this project.

Repo: ${repoInfo.name}
Description: ${repoInfo.description || 'No description'}
Created: ${repoInfo.created_at}
Stars: ${repoInfo.stargazers_count}

Commits:
${JSON.stringify(timeline.slice(0, 20))}

Cover:

* origin
* major phases
* key moments
* current state
  `);
  };

export const generateGraveyard = async (prs, branches) => {
const deadPRs = prs
.filter(pr => pr.state === 'closed' && !pr.merged_at)
.slice(0, 20)
.map(
pr =>
`"${pr.title}" - opened ${pr.created_at?.split('T')[0]}`
);

const staleBranches = branches
.filter(
b => !['main', 'master', 'develop', 'dev'].includes(b.name)
)
.slice(0, 10)
.map(b => b.name);

const result = await callClaude(`
Analyze abandoned PRs and stale branches.

Dead PRs:
${deadPRs.join('\n') || 'None'}

Stale branches:
${staleBranches.join('\n') || 'None'}

Return ONLY valid JSON:
{
"graveyard": [
{
"name": "",
"reason": "",
"effort": "low/medium/high",
"emoji": ""
}
],
"insight": ""
}
`);

return safeParse(result, {
graveyard: [],
insight: 'Could not analyze patterns'
});
};

export const generateLinkedInPost = async (
repoName,
summary,
version
) => {
return callClaude(`
Write a professional LinkedIn post.

Product: ${repoName}
Version: ${version}
Summary: ${summary}

Rules:

* max 150 words
* professional but excited
* 3-4 emojis
* CTA
* 3 hashtags

Return only the post text.
`);
};

export const generateEmail = async (
repoName,
summary,
stakeholderNotes,
version
) => {
const result = await callClaude(`
Write a professional release email.

Product: ${repoName}
Version: ${version}
Summary: ${summary}

Key changes:
${stakeholderNotes?.manager || summary}

Return ONLY valid JSON:
{
"subject": "",
"body": ""
}
`);

return safeParse(result, {
subject: 'Release Update',
body: result
});
};

export const generateErrorPrediction = async (
commits,
repoInfo
) => {
const commitList = commits
.slice(0, 40)
.map(
c =>
`${c.commit.message} | ${c.commit.author.date}`
)
.join('\n');

const result = await callClaude(`
You are a senior code reviewer.

Repo:
${repoInfo.name}

Commits:
${commitList}

Return ONLY valid JSON:
{
"predictions": [
{
"area": "",
"risk": "",
"severity": "low/medium/high",
"confidence": "low/medium/high"
}
],
"technicalDebt": [],
"overallRiskLevel": "low/medium/high"
}
`);

return safeParse(result);
};

export const generateImpactAnalysis = async (
commits,
repoInfo
) => {
const commitList = commits
.slice(0, 40)
.map(c => c.commit.message)
.join('\n');

const result = await callClaude(`
Analyze business and social impact.

Repo:
${repoInfo.name}

Commits:
${commitList}

Return ONLY valid JSON:
{
"businessImpact": {
"customerExperience": "Low/Medium/High",
"revenueImpact": "Low/Medium/High",
"securityImpact": "Low/Medium/High",
"reasoning": ""
},
"sdgContribution": [
{
"goal": "",
"explanation": ""
}
]
}
`);

return safeParse(result);
};

export const generateMindmap = async (
commits,
categories
) => {
const result = await callClaude(`
Build a mindmap structure.

Categories:
${JSON.stringify(categories)}

Return ONLY valid JSON:
{
"root": "Release Name",
"branches": [
{
"label": "",
"color": "#3b82f6",
"nodes": []
}
]
}
`);

return safeParse(result);
};
