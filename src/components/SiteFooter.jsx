import { forwardRef, useState } from 'react';
import { cn } from '../lib/utils';
import { SocialIcon } from './comman/SocialIcons';
import { DottedUnderline } from './comman/DottedUnderline';

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

async function defaultSubscribeRequest(email) {
  const res = await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Request failed');
  }
}

export const SiteFooter = forwardRef(function SiteFooter(
  { onSubscribe, className, ...props },
  ref,
) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    try {
      setStatus('submitting');
      const handler = onSubscribe ?? defaultSubscribeRequest;
      await handler(trimmed);
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer
      ref={ref}
      className={cn('w-full text-center', className)}
      {...props}
    >
      <div className="flex justify-center">
        <img
          src="/sign.png"
          alt="Rupesh Mahajan signature"
          height={100}
          width={100}
          className="object-contain dark:invert"
        />
      </div>

      <div className="mx-auto mt-6 max-w-md">
        <p className="text-sm font-medium text-foreground">Hire me :)</p>

        <form
          onSubmit={handleSubmit}
          className="mt-3.5 flex items-center gap-2 rounded-2xl border border-border bg-surface p-1.5 shadow-xs transition-colors duration-200 focus-within:border-border-hover focus-within:shadow-sm"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== 'idle') setStatus('idle');
            }}
            placeholder="you@youremail.com"
            aria-label="Email address"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-subtle focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="focus-ring shrink-0 cursor-pointer rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold tracking-wider text-accent-foreground uppercase transition-all duration-150 hover:bg-accent-hover active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting' ? '...' : 'CONNECT'}
          </button>
        </form>

        {status === 'done' ? (
          <p className="mt-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Sent! Check your inbox for the resume.
          </p>
        ) : status === 'error' ? (
          <p className="mt-2.5 text-xs font-medium text-rose-600 dark:text-rose-400">
            Something went wrong. Please try again.
          </p>
        ) : (
          <p className="mt-2.5 text-xs text-subtle">
            Powered by{' '}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="link-dotted"
            >
              NodeMailer
            </a>
          </p>
        )}
      </div>

      <DottedUnderline />

      <nav
        aria-label="Social links"
        className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-sm text-muted"
      >
        {DEFAULT_SOCIALS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="focus-ring group inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 transition-colors duration-150 hover:text-foreground"
          >
            <span className="inline-flex items-center transition-transform duration-200 group-hover:-translate-y-0.5">
              <SocialIcon kind={item.icon} className="size-4" />
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <p className="my-6 text-balance text-sm text-foreground/40">
        Website heavily inspired by{' '}
        <a
          className="group relative overflow-visible text-foreground hover:underline"
          href="https://www.manuarora.in"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="relative inline-block underline">
            Manu Arora aka Paaji
          </span>
        </a>
      </p>
    </footer>
  );
});
