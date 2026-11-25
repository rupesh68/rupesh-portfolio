import { forwardRef } from 'react';
import { SocialIcon } from './comman/SocialIcons';
import { Tooltip, TooltipContent, TooltipTrigger } from './comman/Tooltip';

const DEFAULT_SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/rupesh68', icon: 'github' },
  { label: 'X', href: 'https://x.com/rupesh6847', icon: 'x' },
  { label: 'Email', href: 'mailto:rupeshmahajan516@gmail.com', icon: 'email' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/rupesh6847',
    icon: 'linkedin',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/rupesh6847',
    icon: 'instagram',
  },
  { label: 'Resume', href: '/resume.pdf', icon: 'link' },
];

export const HeroSection = forwardRef(function HeroSection(props, ref) {
  return (
    <section ref={ref} {...props}>
      <div className="flex flex-col gap-4">
        <img
          src="/profile.jpg"
          alt="Rupesh Mahajan"
          width={112}
          height={112}
          fetchPriority="high"
          className="size-24 rounded-full object-cover ring-1 ring-border shadow-sm sm:size-28"
        />

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Rupesh Mahajan
          </h1>
          <p className="text-base font-medium text-muted sm:text-lg">
            Full Stack Developer
          </p>
        </div>

        <p className="text-base leading-7 text-muted sm:text-lg sm:leading-8">
          Software engineer with 2+ years of experience building scalable,
          API-driven applications in Agile teams, with a focus on code quality,
          automation and reliable delivery. Hands-on with REST APIs,
          event-driven real-time features, SQL and NoSQL databases, Docker and
          Git-based CI/CD workflows. Built internal automation tools that
          removed manual work. MCA graduate and published researcher, keen to
          apply engineering and quality practices to large-scale transaction
          platforms.
        </p>

        <p className="text-base leading-7 text-muted sm:text-lg sm:leading-8">
          Redis caching, Nginx/PM2 deployments, and execution in Agile
          environments to deliver reliable, high-impact software.
        </p>
      </div>

      <nav
        aria-label="Social profiles"
        className="mt-6 flex flex-wrap items-center gap-2"
      >
        {DEFAULT_SOCIALS.map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger asChild>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                title={item.label}
                className="focus-ring inline-flex size-10 items-center justify-center rounded-xl border border-transparent text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-surface hover:text-foreground hover:shadow-xs"
              >
                <SocialIcon kind={item.icon} className="size-5" />
              </a>
            </TooltipTrigger>
            <TooltipContent theme="default" side="bottom">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </section>
  );
});
