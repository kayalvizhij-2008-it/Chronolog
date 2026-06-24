/**
 * github.js — Real GitHub REST API Service
 *
 * Fixes: empty stub, no URL parsing, no token support, no error handling
 */

const GH_BASE = 'https://api.github.com';

/** Build headers — include token if provided */
const ghHeaders = () => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  return token
    ? { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
    : { Accept: 'application/vnd.github+json' };
};

/** Parse owner/repo from a GitHub URL */
const parseGitHubUrl = (url) => {
  const clean = url.trim().replace(/\/$/, '');
  const match = clean.match(/github\.com\/([^/\s]+)\/([^/\s#?]+)/);
  if (!match) throw new Error(`Invalid GitHub URL: "${url}". Expected format: https://github.com/owner/repo`);
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
};

/** Fetch with rate-limit awareness */
const ghFetch = async (path) => {
  const res = await fetch(`${GH_BASE}${path}`, { headers: ghHeaders() });
  if (res.status === 403) {
    const data = await res.json().catch(() => ({}));
    const resetAt = res.headers.get('x-ratelimit-reset');
    const resetTime = resetAt ? new Date(Number(resetAt) * 1000).toLocaleTimeString() : 'soon';
    throw new Error(`GitHub rate limit exceeded. Try again at ${resetTime}. Add VITE_GITHUB_TOKEN to .env for higher limits. (${data.message || ''})`);
  }
  if (res.status === 404) throw new Error(`Repository not found. Check the URL is correct and the repo is public.`);
  if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${res.statusText}`);
  return res.json();
};

/** Fetch paginated resources (up to maxPages pages) */
const fetchPaginated = async (path, perPage = 100, maxPages = 3) => {
  const results = [];
  for (let page = 1; page <= maxPages; page++) {
    const sep = path.includes('?') ? '&' : '?';
    const batch = await ghFetch(`${path}${sep}per_page=${perPage}&page=${page}`);
    if (!Array.isArray(batch) || batch.length === 0) break;
    results.push(...batch);
    if (batch.length < perPage) break;
  }
  return results;
};

/**
 * Main entry point — fetches all repo data in parallel
 * @param {string} url — GitHub repo URL
 */
export const fetchAllRepoData = async (url) => {
  const { owner, repo } = parseGitHubUrl(url);
  const base = `/repos/${owner}/${repo}`;

  // Fetch repo info first (validates access)
  const repoInfo = await ghFetch(base);

  // Fetch everything else in parallel
  const [commits, prs, branches, contributors, releases, languages] = await Promise.allSettled([
    fetchPaginated(`${base}/commits`, 100, 2),
    fetchPaginated(`${base}/pulls?state=all`, 100, 2),
    fetchPaginated(`${base}/branches`, 100, 1),
    fetchPaginated(`${base}/contributors`, 100, 1),
    fetchPaginated(`${base}/releases`, 30, 1),
    ghFetch(`${base}/languages`),
  ]);

  const safeValue = (result, fallback) =>
    result.status === 'fulfilled' ? result.value : fallback;

  return {
    repoInfo,
    commits:      safeValue(commits, []),
    prs:          safeValue(prs, []),
    branches:     safeValue(branches, []),
    contributors: safeValue(contributors, []),
    releases:     safeValue(releases, []),
    languages:    safeValue(languages, {}),
  };
};