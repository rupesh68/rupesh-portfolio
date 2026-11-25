import { cacheLife } from 'next/cache';

export async function getGitHubStats(
  username = process.env.GITHUB_USERNAME || 'rupesh68',
) {
  'use cache';
  cacheLife('hours');

  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'github-activity-widget',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // 1. User profile (public_repos)
  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    headers,
  });
  if (!userRes.ok) {
    throw new Error(`Failed to fetch GitHub user "${username}"`);
  }
  const user = await userRes.json();

  // 2. Paginate owned repos to calculate total stars
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

  // 3. Daily contribution counts via GitHub GraphQL API
  let totalContributions = 0;
  let dailyCounts = [];
  const todayStr = new Date().toISOString().slice(0, 10);
  let endDate = todayStr;

  if (token) {
    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const gqlRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'github-activity-widget',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables: { login: username } }),
    });

    if (gqlRes.ok) {
      const gqlJson = await gqlRes.json();
      const cal =
        gqlJson?.data?.user?.contributionsCollection?.contributionCalendar;
      if (cal) {
        totalContributions = cal.totalContributions ?? 0;
        const flatDays = cal.weeks.flatMap((w) => w.contributionDays);
        const upToToday = flatDays.filter((d) => d.date <= todayStr);
        const series = upToToday.length > 0 ? upToToday : flatDays;
        dailyCounts = series.map((d) => d.contributionCount);
        if (series.length > 0) {
          endDate = series[series.length - 1].date;
        }
      }
    }
  }

  return {
    username,
    publicRepos: user.public_repos ?? 0,
    totalStars,
    totalContributions,
    dailyCounts,
    endDate,
  };
}
