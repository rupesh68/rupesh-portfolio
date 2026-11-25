'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

const GLIDE = [0.22, 1, 0.36, 1];

const DEFAULT_POSTS = [
  {
    id: 'taste-cant-be-prompted',
    title:
      'React.js over Angular: Architectural Comparison and Performance Analysis',
    date: '31.Oct.2026',
    href: 'https://medium.com/@rupesh6847/react-js-over-angular-architectural-comparison-and-performance-analysis-5e02d13a89db',
  },
];

export const WritingList = React.forwardRef(function WritingList(
  { label = 'WRITING', posts = DEFAULT_POSTS, className },
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
        '  text-foreground   transition-colors duration-200 hover:border-border-hover',
        className,
      )}
    >
      <p className="font-mono text-xs tracking-widest uppercase text-subtle">
        {label}
      </p>

      <ul className="mt-4 divide-y divide-border">
        {posts.map((post) => {
          const rowContent = (
            <div className="flex items-baseline justify-between gap-4 rounded-xl px-2 py-3 transition-colors duration-200 hover:bg-surface-hover">
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-foreground">
                {post.title}
              </span>
              <time className="shrink-0 font-mono text-xs text-subtle tabular-nums">
                {post.date}
              </time>
            </div>
          );

          return (
            <li key={post.id} className="group">
              {post.href ? (
                <Link href={post.href} className="focus-ring block rounded-xl">
                  {rowContent}
                </Link>
              ) : (
                rowContent
              )}
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
});
