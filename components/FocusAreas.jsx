'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

const GLIDE = [0.22, 1, 0.36, 1];

const DEFAULT_EDUCATION_ITEMS = [
  {
    id: 'medicaps-university',
    title: 'Masters in Computer Application',
    university: 'Medicaps University - Indore',
    passedOut: 'Sep 2021 - May 2023',
    description:
      'A significant part of the education involves practical experience through labs and projects, which are designed to enhance problem-solving skills',
    logo: '/university-logo.svg',
  },
  {
    id: 'indore-institute-of-science-and-technology',
    title: 'Bachelors in Computer Application',
    university: 'DAVV University - Indore',
    passedOut: 'Sep 2018 - May 2021',
    description:
      'The curriculum is designed to provide a strong foundation in computer science, programming, and software development.',
    logo: '/davvLogo.png',
  },
];

export const FocusAreas = React.forwardRef(function FocusAreas(
  { label = 'EDUCATION', items = DEFAULT_EDUCATION_ITEMS, className },
  ref,
) {
  const still = !!useReducedMotion();

  return (
    <motion.section
      ref={ref}
      initial={still ? false : { opacity: 0, y: 14 }}
      whileInView={still ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: GLIDE }}
      className={cn(
        'text-foreground transition-colors duration-200',
        className,
      )}
    >
      <p className="font-mono text-xs tracking-widest uppercase text-subtle">
        {label}
      </p>

      <div className="mt-4 space-y-2">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={still ? false : { opacity: 0, y: 8 }}
            whileInView={still ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.4,
              delay: still ? 0 : idx * 0.06,
              ease: GLIDE,
            }}
            className="group flex items-start gap-3 rounded-2xl p-3 transition-colors duration-200 hover:bg-surface-hover"
          >
            <img
              src={item.logo}
              alt={item.university || item.title}
              className="mt-0.5 size-7 shrink-0 rounded-lg object-contain transition-transform duration-200 group-hover:scale-105"
            />

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                {item.passedOut && (
                  <span className="font-mono text-xs text-subtle">
                    {item.passedOut}
                  </span>
                )}
              </div>

              {item.university && (
                <p className="text-sm font-medium text-subtle">
                  {item.university}
                </p>
              )}

              {item.description && (
                <p className="pt-0.5 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
});
