'use client';

import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '../lib/utils';

const GLIDE = [0.22, 1, 0.36, 1];
const API_BASE = 'https://vedicscriptures.github.io';

// Standard verse counts per chapter (1 to 18) for instant random selection
const CHAPTER_VERSES = [
  47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78,
];

const FALLBACK_QUOTE = {
  id: 'BG 2.47',
  sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।',
  text: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.',
  author: 'Bhagavad Gita • Chapter 2, Verse 47',
};

function cleanTranslation(raw = '') {
  // Strips leading verse numbers like "1.1 " or "2.47 " from API translations
  return raw.replace(/^\d+\.\d+\s*/, '').trim();
}

export const DailyQuoteSection = React.forwardRef(function DailyQuoteSection(
  {
    label = 'DAILY GITA WISDOM',
    buttonLabel = "Get Today's Shloka",
    translator = 'siva', // Options: 'siva' | 'purohit' | 'san' | 'tej' (Hindi)
    showSanskrit = true,
    className,
  },
  ref,
) {
  const still = !!useReducedMotion();
  const [quote, setQuote] = React.useState(null);
  const [revealed, setRevealed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const abortRef = React.useRef(null);

  React.useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const fetchRandomSlok = React.useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setRevealed(true);

    const chapter = Math.floor(Math.random() * CHAPTER_VERSES.length) + 1;
    const maxVerses = CHAPTER_VERSES[chapter - 1];
    const verse = Math.floor(Math.random() * maxVerses) + 1;

    try {
      const res = await fetch(`${API_BASE}/slok/${chapter}/${verse}`, {
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch verse (${res.status})`);
      }

      const data = await res.json();

      const selectedTranslation =
        data?.[translator]?.et ||
        data?.[translator]?.ht ||
        data?.siva?.et ||
        data?.purohit?.et ||
        FALLBACK_QUOTE.text;

      const translatorName =
        data?.[translator]?.author || data?.siva?.author || 'Swami Sivananda';

      setQuote({
        id: `BG ${data.chapter}.${data.verse}`,
        sanskrit: data.slok,
        text: cleanTranslation(selectedTranslation),
        author: `Bhagavad Gita ${data.chapter}.${data.verse} — ${translatorName}`,
      });
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(
        'Unable to reach the Gita API. Showing a timeless verse instead.',
      );
      setQuote(FALLBACK_QUOTE);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [translator]);

  return (
    <motion.section
      ref={ref}
      initial={still ? false : { opacity: 0, y: 14 }}
      whileInView={still ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: GLIDE }}
      className={cn(
        ' text-foreground transition-colors duration-200 hover:border-border-hover   ',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs tracking-widest uppercase text-subtle">
          {label}
        </p>

        <motion.button
          type="button"
          onClick={fetchRandomSlok}
          disabled={loading}
          whileTap={still || loading ? undefined : { scale: 0.97 }}
          className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold tracking-wide text-accent-foreground shadow-xs transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            viewBox="0 0 24 24"
            className={cn('size-3.5', loading && 'animate-spin')}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
          </svg>
          <span>
            {loading
              ? 'Loading Shloka...'
              : revealed
                ? 'Another Shloka'
                : buttonLabel}
          </span>
        </motion.button>
      </div>

      <div className="mt-5 min-h-18">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.p
              key="placeholder"
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={still ? undefined : { opacity: 0 }}
              className="text-sm text-muted"
            >
              Click{' '}
              <span className="font-medium text-foreground">{buttonLabel}</span>{' '}
              for a verse of timeless wisdom from the Shreemad Bhagavad Gita.
            </motion.p>
          ) : loading && !quote ? (
            <motion.div
              key="skeleton"
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={still ? undefined : { opacity: 0 }}
              className="space-y-2.5"
              aria-busy="true"
            >
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted/20" />
              <div className="h-4 w-full animate-pulse rounded bg-muted/20" />
              <div className="h-3 w-40 animate-pulse rounded bg-muted/20" />
            </motion.div>
          ) : (
            quote && (
              <motion.blockquote
                key={quote.id}
                initial={
                  still ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }
                }
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={
                  still ? undefined : { opacity: 0, y: -6, filter: 'blur(4px)' }
                }
                transition={{ duration: 0.35, ease: GLIDE }}
                className="space-y-3"
              >
                {showSanskrit && quote.sanskrit && (
                  <p className="whitespace-pre-line font-serif text-sm leading-relaxed text-subtle">
                    {quote.sanskrit}
                  </p>
                )}

                <p className="text-base font-medium leading-relaxed text-foreground sm:text-lg">
                  &ldquo;{quote.text}&rdquo;
                </p>

                <footer className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted">
                  <span>— {quote.author}</span>
                  {error && <span className="text-amber-500">{error}</span>}
                </footer>
              </motion.blockquote>
            )
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
});
