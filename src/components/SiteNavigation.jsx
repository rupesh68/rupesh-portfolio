import { forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { ThemeToggle } from './comman/ThemeToggle';

const DEFAULT_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Writing', href: '/writing' },
];

export const SiteNavigation = forwardRef(function SiteNavigation(
  { className, ...props },
  ref,
) {
  const { pathname } = useLocation();

  return (
    <header ref={ref} className={cn('py-5 sm:py-6', className)} {...props}>
      <nav
        aria-label="Primary navigation"
        className="flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-1 sm:gap-2">
          {DEFAULT_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'focus-ring rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 sm:text-base',
                  isActive
                    ? 'bg-surface-muted text-foreground'
                    : 'text-muted hover:bg-surface-hover hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <ThemeToggle />
      </nav>
    </header>
  );
});
