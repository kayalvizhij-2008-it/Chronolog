export const buildTimeline = (commits) => {
  const days = {};
  commits.forEach(c => {
    const date = c.commit.author.date.split('T')[0];
    const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    days[day] = days[day] || [];
    days[day].push(c.commit.message.split('\n')[0]);
  });
  return Object.entries(days).map(([day, msgs]) => ({ day, count: msgs.length, msgs }));
};