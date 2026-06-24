/**
 * utils.js — Data transformation utilities
 */

/**
 * Build a timeline from commits grouped by calendar date (not day-of-week)
 * @param {Array} commits
 * @returns {Array} [{date, dayLabel, count, msgs}]
 */
export const buildTimeline = (commits) => {
  const days = {};
  commits.forEach((c) => {
    const isoDate = c.commit?.author?.date?.split('T')[0];
    if (!isoDate) return;
    if (!days[isoDate]) {
      days[isoDate] = {
        date: isoDate,
        dayLabel: new Date(isoDate + 'T12:00:00').toLocaleDateString('en-US', {
          weekday: 'short', month: 'short', day: 'numeric',
        }),
        count: 0,
        msgs: [],
        authors: new Set(),
      };
    }
    days[isoDate].count += 1;
    days[isoDate].msgs.push(c.commit.message.split('\n')[0]);
    days[isoDate].authors.add(c.commit.author.name);
  });

  return Object.values(days)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({ ...d, authors: [...d.authors] }));
};

/**
 * Compute contributors stats from commits
 * @param {Array} commits
 * @returns {Array} [{name, count, avatar}]
 */
export const buildContributorStats = (commits) => {
  const map = {};
  commits.forEach((c) => {
    const name = c.commit?.author?.name || 'Unknown';
    const avatar = c.author?.avatar_url || null;
    if (!map[name]) map[name] = { name, count: 0, avatar };
    map[name].count += 1;
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
};

/**
 * Detect language stats percentages from GitHub languages object
 * @param {Object} langs — { JavaScript: 45123, Python: 12000 }
 */
export const buildLanguageStats = (langs) => {
  if (!langs || typeof langs !== 'object') return [];
  const total = Object.values(langs).reduce((s, v) => s + v, 0);
  if (total === 0) return [];
  return Object.entries(langs)
    .map(([lang, bytes]) => ({ lang, bytes, pct: Math.round((bytes / total) * 100) }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8);
};

/**
 * Generate a random color seeded by a string (deterministic)
 */
export const seededColor = (str) => {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#06b6d4', '#3b82f6', '#a855f7', '#d946ef',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Format a number with K/M suffix
 */
export const formatCount = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n ?? 0);
};

/**
 * Relative time string from ISO date
 */
export const relativeTime = (isoDate) => {
  const diff = Date.now() - new Date(isoDate).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
};