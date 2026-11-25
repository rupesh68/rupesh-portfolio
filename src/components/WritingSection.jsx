'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../lib/utils';

const GLIDE = [0.22, 1, 0.36, 1];

const DEFAULT_ESSAYS = [
  {
    id: 'taste-cant-be-prompted',
    title:
      'React.js over Angular: Architectural Comparison and Performance Analysis',
    date: '31.OCT.2026',
    href: 'https://medium.com/@rupesh6847/react-js-over-angular-architectural-comparison-and-performance-analysis-5e02d13a89db',
  },
];

export const WritingSection = React.forwardRef(function WritingSection(
  {
    intro = 'An in-depth architectural comparison and performance analysis between React JS and Angular, examining their core structures, rendering mechanics, and use cases.',
    essays = DEFAULT_ESSAYS,
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
      transition={{ duration: 0.55, ease: GLIDE }}
      className={cn(
        ' text-foreground transition-colors duration-200 hover:border-border-hover',
        className,
      )}
    >
      <p className=" text-sm leading-relaxed text-muted sm:text-[15px]">
        {intro}
      </p>

      <ul className="mt-8 space-y-1">
        {essays.map((essay, idx) => {
          const row = (
            <motion.div
              initial={still ? false : { opacity: 0, y: 6 }}
              whileInView={still ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.35,
                delay: still ? 0 : Math.min(0.35, idx * 0.03),
                ease: GLIDE,
              }}
              className="flex items-baseline justify-between gap-4 rounded-xl py-2.5 transition-colors duration-200 "
            >
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground transition-transform duration-200 group-hover:translate-x-0.5 sm:text-[15px] hover:underline">
                {essay.title}
              </span>
              <time className="shrink-0 font-mono text-xs tracking-wider text-subtle uppercase tabular-nums">
                {essay.date}
              </time>
            </motion.div>
          );

          return (
            <li key={essay.id} className="group">
              {essay.href ? (
                <a href={essay.href} className="focus-ring block rounded-xl">
                  {row}
                </a>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
});
