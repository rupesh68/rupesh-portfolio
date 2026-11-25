const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const statsCache = new Map();

export async function getGitHubStats(
  username = import.meta.env.VITE_GITHUB_USERNAME || 'rupesh68',
) {
  const cached = statsCache.get(username);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const headers = {
    Accept: 'application/vnd.github+json',
  };

  // 1. User profile (public_repos) & 2. Public contribution calendar (no token needed)
  const [userRes, contribRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`),
  ]);

  if (!userRes.ok) {
    throw new Error(`Failed to fetch GitHub user "${username}"`);
  }
  const user = await userRes.json();

  // 3. Paginate owned repos to calculate total stars
  let page = 1;
  let totalStars = 0;
  while (true) {
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&type=owner`,
      { headers },
    );
    if (!reposRes.ok) break;

    const repos = await reposRes.json();
    if (!Array.isArray(repos) || repos.length === 0) break;

    for (const repo of repos) {
      if (!repo.fork) {
        totalStars += repo.stargazers_count ?? 0;
      }
    }

    if (repos.length < 100) break;
    page += 1;
  }

  // 4. Parse daily contribution counts
  let totalContributions = 0;
  let dailyCounts = [];
  const todayStr = new Date().toISOString().slice(0, 10);
  let endDate = todayStr;

  if (contribRes.ok) {
    const contribJson = await contribRes.json();
    const list = Array.isArray(contribJson?.contributions)
      ? contribJson.contributions
      : [];
    const upToToday = list.filter((d) => d.date <= todayStr);
    const series = upToToday.length > 0 ? upToToday : list;

    dailyCounts = series.map((d) => d.count ?? 0);
    totalContributions = dailyCounts.reduce((sum, n) => sum + n, 0);
    if (series.length > 0) {
      endDate = series[series.length - 1].date;
    }
  }

  const result = {
    username,
    publicRepos: user.public_repos ?? 0,
    totalStars,
    totalContributions,
    dailyCounts,
    endDate,
  };

  statsCache.set(username, { data: result, timestamp: Date.now() });
  return result;
}
