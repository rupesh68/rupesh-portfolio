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
          Full Stack Developer with 2+ years of experience building and scaling
          production apps with React.js, Next.js, Node.js, Express.js,
          TypeScript, MySQL, and Prisma ORM. Managed 5–6 live websites across
          VPS servers with Nginx, GitHub Actions CI/CD, Redis caching, and
          WebSockets while shipping email automation, real-time analytics, and
          internal EMS tools.
        </p>

        <p className="text-base leading-7 text-muted sm:text-lg sm:leading-8">
          Looking to join a high-ownership product team as a Full Stack or
          Next.js Engineer to build fast, reliable, and scalable web platforms
          with measurable impact.
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
