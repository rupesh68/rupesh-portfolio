import { useCallback, useEffect, useState } from 'react';

const USERNAME = import.meta.env.VITE_GITHUB_USERNAME;
const CACHE_MS = 10 * 60 * 1000;

async function fetchRepos(user, signal) {
  const repos = [];
  for (let page = 1; ; page += 1) {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=pushed&page=${page}`,
      { signal, headers: { Accept: 'application/vnd.github+json' } },
    );
    if (!res.ok) {
      if (res.headers.get('x-ratelimit-remaining') === '0') {
        throw new Error('GitHub rate limit reached. Try again later.');
      }
      throw new Error(`GitHub request failed (${res.status})`);
    }
    const batch = await res.json();
    repos.push(...batch);
    if (batch.length < 100) return repos;
  }
}

// Draws a cover image in the browser, so there are no CORS problems with WebGL.
function makeCover(title, language) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  const hue = [...title].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);
  const bg = ctx.createLinearGradient(0, 0, 800, 600);
  bg.addColorStop(0, `hsl(${hue}, 55%, 32%)`);
  bg.addColorStop(1, `hsl(${(hue + 50) % 360}, 60%, 14%)`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 600);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  let size = 72;
  do {
    ctx.font = `600 ${size}px system-ui, sans-serif`;
    size -= 4;
  } while (ctx.measureText(title).width > 640 && size > 28);
  ctx.fillText(title, 400, 270, 640);

  if (language) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '400 28px system-ui, sans-serif';
    ctx.fillText(language, 400, 345);
  }
  return canvas.toDataURL('image/jpeg', 0.9);
}

function liveUrl(repo, user) {
  const home = repo.homepage?.trim();
  if (home) return /^https?:\/\//i.test(home) ? home : `https://${home}`;
  if (!repo.has_pages) return null;
  const host = `${user.toLowerCase()}.github.io`;
  return repo.name.toLowerCase() === host
    ? `https://${host}/`
    : `https://${host}/${repo.name}/`;
}

export function toProjects(repos, { user, includeForks, liveOnly, images }) {
  return repos
    .filter((r) => includeForks || !r.fork)
    .filter((r) => r.name.toLowerCase() !== user.toLowerCase()) // profile README repo
    .filter((r) => !liveOnly || liveUrl(r, user))
    .map((r) => {
      const title = r.name.replace(/[-_]+/g, ' ');
      const year = new Date(r.pushed_at).getFullYear();
      return {
        title,
        meta: [r.language, year].filter(Boolean).join(', '),
        image: images?.[r.name] ?? makeCover(title, r.language),
        alt: r.description || title,
        href: liveUrl(r, user) ?? r.html_url,
        repoUrl: r.html_url,
      };
    });
}

export function useGithubProjects({
  user = USERNAME,
  includeForks = false,
  liveOnly = false,
  images,
} = {}) {
  const [state, setState] = useState({
    projects: [],
    loading: true,
    error: null,
  });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const imagesKey = JSON.stringify(images ?? {});

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ projects: [], loading: true, error: null });

    (async () => {
      try {
        if (!user) throw new Error('VITE_GITHUB_USERNAME is not set.');
        const key = `gh-repos:${user}`;
        let cached;
        try {
          cached = JSON.parse(localStorage.getItem(key));
        } catch {
          cached = null;
        }

        let repos =
          cached && Date.now() - cached.at < CACHE_MS ? cached.repos : null;
        if (!repos) {
          try {
            repos = await fetchRepos(user, controller.signal);
            try {
              localStorage.setItem(
                key,
                JSON.stringify({ at: Date.now(), repos }),
              );
            } catch {
              // storage unavailable: continue without caching
            }
          } catch (err) {
            if (!cached) throw err;
            repos = cached.repos; // show older data if GitHub is unavailable
          }
        }

        if (controller.signal.aborted) return;
        const projects = toProjects(repos, {
          user,
          includeForks,
          liveOnly,
          images: JSON.parse(imagesKey),
        });
        setState({ projects, loading: false, error: null });
      } catch (err) {
        if (controller.signal.aborted) return;
        setState({ projects: [], loading: false, error: err.message });
      }
    })();

    return () => controller.abort();
  }, [user, includeForks, liveOnly, imagesKey, attempt]);

  return { ...state, retry };
}
