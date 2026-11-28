'use client';

import { ProjectIndex } from '../ProjectSection';
import { useGithubProjects } from '../../hooks/useGithubProjects';

export function GithubProjects({ includeForks, liveOnly, images, ...props }) {
  const { projects, loading, error, retry } = useGithubProjects({
    includeForks,
    liveOnly,
    images,
  });

  if (loading) {
    return (
      <p role="status" className="text-sm text-subtle">
        Loading projects…
      </p>
    );
  }
  if (error) {
    return (
      <p role="alert" className="text-sm text-subtle">
        {error}{' '}
        <button
          type="button"
          onClick={retry}
          className="cursor-pointer underline"
        >
          Retry
        </button>
      </p>
    );
  }
  if (!projects.length) {
    return <p className="text-sm text-subtle">No public projects found.</p>;
  }
  return <ProjectIndex {...props} projects={projects} />;
}
