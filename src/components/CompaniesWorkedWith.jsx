'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../lib/utils';

const GLIDE = [0.22, 1, 0.36, 1];

const DEFAULT_COMPANIES = [
  {
    id: 'revvknew',
    name: 'Revvknew Technologies Private Limited',
    description:
      'Automated internal workflows with a Next.js template generator and a secure Dropbox file management system.',
    href: 'https://revvknewmediatech.com',
    iconBgClassName:
      'bg-zinc-950 text-white dark:bg-surface-muted dark:text-foreground dark:border dark:border-border',
    logo: '/revvknew-logo.png',
    status: true,
  },
  {
    id: 'indvibe',
    name: 'Frontend Developer',
    description:
      'Engineered dynamic, component-based user interfaces in React.js, building a library of reusable components',
    href: 'https://indvibeinfotechpvt.in',
    iconBgClassName:
      'bg-zinc-950 text-white dark:bg-surface-muted dark:text-foreground dark:border dark:border-border',
    logo: '/indvibe-logo.jpg',
    status: false,
  },
];

export const CompaniesWorkedWith = React.forwardRef(
  function CompaniesWorkedWith(
    {
      label = "COMPANIES I'VE WORKED WITH",
      companies = DEFAULT_COMPANIES,
      className,
    },
    ref,
  ) {
    const still = !!useReducedMotion();

    return (
      <motion.section
        ref={ref}
        initial={still ? false : { opacity: 0, y: 14 }}
        whileInView={still ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: GLIDE }}
        className={cn(
          ' text-foreground transition-colors duration-200 hover:border-border-hover',
          className,
        )}
      >
        <p className="font-mono text-xs tracking-widest uppercase text-subtle">
          {label}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2">
          {companies.map((company, idx) => {
            const cardBody = (
              <motion.div
                initial={still ? false : { opacity: 0, y: 8 }}
                whileInView={still ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.35,
                  delay: still ? 0 : idx * 0.04,
                  ease: GLIDE,
                }}
                className="group space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  {/* <span
                    className={cn(
                      'grid size-7 shrink-0 place-items-center rounded-lg transition-transform duration-200 group-hover:scale-105',
                      company.iconBgClassName ??
                        'bg-accent text-accent-foreground',
                    )}
                  >
                    {company.icon}
                  </span> */}
                  <div className="relative inline-flex shrink-0">
                    <picture>
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </picture>

                    {company.status && (
                      <span className="absolute -right-0.5 -top-0.5 flex size-2.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    {company.name}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed text-muted">
                  {company.description}
                </p>
              </motion.div>
            );

            if (company.href) {
              return (
                <a
                  key={company.id}
                  href={company.href}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring rounded-2xl p-3 transition-colors duration-200 hover:bg-surface-hover"
                >
                  {cardBody}
                </a>
              );
            }

            return (
              <div key={company.id} className="rounded-2xl p-3">
                {cardBody}
              </div>
            );
          })}
        </div>
      </motion.section>
    );
  },
);
