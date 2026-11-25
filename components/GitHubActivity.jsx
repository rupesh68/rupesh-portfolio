'use client';

import * as React from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
} from 'motion/react';
import { Activity, Flame, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const WEEKS = 53;
const GAP = 3;
const MAX_CELL = 14;
const NARROW = 420;
const DAY_LABEL_W = 28;
const LEVELS = [0, 1, 2, 3, 4];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EASE = [0.22, 1, 0.36, 1];
const EASE_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)';

const ACTIVITY_PALETTES = {
  ink: ['#d4d4d8', '#a1a1aa', '#52525b', '#18181b'],
  emerald: ['#a7f3d0', '#34d399', '#10b981', '#047857'],
};

function startOfDay(input) {
  const d =
    typeof input === 'string' ? new Date(`${input}T00:00:00`) : new Date(input);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function shortDate(d) {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function longDate(d) {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function Count({ value, run, still, delay = 0 }) {
  const [display, setDisplay] = React.useState(still ? value : 0);

  React.useEffect(() => {
    if (still) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }
    if (!run) return;
    const controls = animate(0, value, {
      duration: 0.85,
      delay,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, run, still, delay]);

  return <>{display.toLocaleString('en-US')}</>;
}

export const GitHubActivity = React.forwardRef(function GitHubActivity(
  {
    title = 'GitHub Activity',
    username,
    repos,

    data: dataProp = [],
    endDate,
    unit = 'contribution',
    palette = 'ink',
    colors: colorsProp,
    cellSize = 11,
    showStats = true,
    className,
  },
  forwardedRef,
) {
  const ref = React.useRef(null);
  React.useImperativeHandle(forwardedRef, () => ref.current);

  const colors =
    colorsProp ?? ACTIVITY_PALETTES[palette] ?? ACTIVITY_PALETTES.ink;
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const still = !!useReducedMotion();
  const shown = still || inView;

  const [fallbackDate, setFallbackDate] = React.useState(null);

  React.useEffect(() => {
    if (!endDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFallbackDate(startOfDay(new Date()));
    }
  }, [endDate]);

  const today = React.useMemo(
    () => (endDate ? startOfDay(endDate) : fallbackDate),
    [endDate, fallbackDate],
  );

  const todayRow = today ? (today.getDay() + 6) % 7 : 6;
  const totalDays = (WEEKS - 1) * 7 + todayRow + 1;

  const data = React.useMemo(() => {
    const src = Array.isArray(dataProp) ? dataProp : [];
    const tail = src.slice(-totalDays);
    return [...Array(Math.max(0, totalDays - tail.length)).fill(0), ...tail];
  }, [dataProp, totalDays]);

  const firstDay = React.useMemo(
    () => (today ? addDays(today, -(totalDays - 1)) : null),
    [today, totalDays],
  );

  const thresholds = React.useMemo(() => {
    const active = data.filter((v) => v > 0).sort((a, b) => a - b);
    if (!active.length) return [1, 1, 1];
    const q = (p) =>
      active[Math.min(active.length - 1, Math.floor(p * active.length))];
    return [q(0.25), q(0.5), q(0.75)];
  }, [data]);

  const levelOf = (v) =>
    v <= 0
      ? 0
      : v <= thresholds[0]
        ? 1
        : v <= thresholds[1]
          ? 2
          : v <= thresholds[2]
            ? 3
            : 4;

  const gridRef = React.useRef(null);
  const [width, setWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const area = Math.max(0, width - DAY_LABEL_W);
  const narrow = width > 0 && width < NARROW;
  const fit = Math.max(8, Math.floor((area + GAP) / (cellSize + GAP)));
  const cols = Math.min(WEEKS, fit);
  const cell =
    cols === WEEKS
      ? Math.max(
          cellSize,
          Math.min(MAX_CELL, Math.floor((area + GAP) / WEEKS) - GAP),
        )
      : cellSize;
  const firstCol = WEEKS - cols;

  const dayIndex = (col, row) => col * 7 + row;
  const windowStart = firstCol * 7;
  const windowValues = data.slice(windowStart);
  const total = windowValues.reduce((a, b) => a + b, 0);
  const prevStart = windowStart - windowValues.length;
  const prevTotal =
    prevStart >= 0
      ? data.slice(prevStart, windowStart).reduce((a, b) => a + b, 0)
      : null;
  const change = prevTotal
    ? Math.round(((total - prevTotal) / prevTotal) * 100)
    : null;

  const streaks = React.useMemo(() => {
    let best = 0;
    let bestEnd = -1;
    let run = 0;

    windowValues.forEach((v, i) => {
      run = v > 0 ? run + 1 : 0;
      if (run > best) {
        best = run;
        bestEnd = i;
      }
    });

    let current = 0;
    let idx = windowValues.length - 1;
    if (idx >= 0 && windowValues[idx] === 0) idx--;
    for (; idx >= 0 && windowValues[idx] > 0; idx--) {
      current++;
    }
    const currentStartIdx = idx + 1;

    const at = (i) =>
      firstDay ? addDays(firstDay, windowStart + i) : new Date(0);

    return {
      best,
      bestRange:
        best && firstDay
          ? `${longDate(at(bestEnd - best + 1))} to ${longDate(at(bestEnd))}`
          : 'No streak yet',
      current,
      currentRange:
        current && firstDay
          ? `Since ${longDate(at(currentStartIdx))}`
          : 'Start one today',
    };
  }, [windowValues, firstDay, windowStart]);

  const weeksLabel = cols >= 52 ? 'Last 12 months' : `Last ${cols} weeks`;
  const plural = (n) =>
    `${n.toLocaleString('en-US')} ${unit}${n === 1 ? '' : 's'}`;

  const months = React.useMemo(() => {
    if (!firstDay) return [];
    const out = [];
    let last = -1;
    let lastCol = -10;
    for (let c = 0; c < cols; c++) {
      const d = addDays(firstDay, dayIndex(firstCol + c, 0));
      if (d.getMonth() !== last) {
        if (c - lastCol >= 3 && !(c === 0 && d.getDate() > 20)) {
          out.push({ col: c, label: MONTHS[d.getMonth()] });
          lastCol = c;
        }
        last = d.getMonth();
      }
    }
    return out;
  }, [cols, firstCol, firstDay]);

  const [active, setActive] = React.useState(null);
  const [level, setLevel] = React.useState(null);
  const activeIdx = active ? dayIndex(firstCol + active.col, active.row) : -1;
  const activeDate = active && firstDay ? addDays(firstDay, activeIdx) : null;
  const tip =
    active && activeDate && activeIdx < totalDays
      ? `${plural(data[activeIdx] ?? 0)}, ${shortDate(activeDate)}`
      : '';

  const onKey = (e) => {
    const moves = {
      ArrowRight: [1, 0],
      ArrowLeft: [-1, 0],
      ArrowDown: [0, 1],
      ArrowUp: [0, -1],
    };
    const m = moves[e.key];
    if (e.key === 'Escape') return setActive(null);
    if (!m) return;
    e.preventDefault();
    setActive((a) => {
      const from = a ?? { col: cols - 1, row: todayRow };
      let col = Math.max(0, Math.min(cols - 1, from.col + m[0]));
      let row = Math.max(0, Math.min(6, from.row + m[1]));
      if (col === cols - 1 && row > todayRow) row = todayRow;
      return { col, row };
    });
  };

  const stats = [
    {
      label: `Total ${unit}s`,
      value: total,
      suffix: '',
      note: weeksLabel,
      Icon: Activity,
    },
    {
      label: 'Longest streak',
      value: streaks.best,
      suffix: streaks.best === 1 ? ' day' : ' days',
      note: streaks.bestRange,
      Icon: Flame,
    },
    {
      label: 'Current streak',
      value: streaks.current,
      suffix: streaks.current === 1 ? ' day' : ' days',
      note: streaks.currentRange,
      Icon: Zap,
    },
  ];

  const gridH = 7 * cell + 6 * GAP;

  return (
    <motion.section
      ref={ref}
      initial={still ? false : { opacity: 0, y: 16 }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: EASE }}
      style={{
        '--ag': colors[3],
        '--l1': colors[0],
        '--l2': colors[1],
        '--l3': colors[2],
        '--l4': colors[3],
      }}
      className={cn(
        !colorsProp &&
          palette === 'ink' &&
          'dark:[--ag:#e4e4e7] dark:[--l1:#3f3f46] dark:[--l2:#71717a] dark:[--l3:#a1a1aa] dark:[--l4:#e4e4e7]',
        'relative  text-foreground transition-colors duration-200 hover:border-border-hover ',
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0  ">
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-xs tracking-widest uppercase text-subtle">
              {title}
            </h3>
            {username && (
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noreferrer"
                className="link-dotted text-xs text-subtle"
              >
                @{username}
              </a>
            )}
          </div>
          {/* <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-[32px] font-semibold leading-none tracking-[-0.03em] text-foreground">
              <Count value={total} run={shown} still={still} delay={0.2} />
            </span>
            <span className="text-sm text-muted">{unit}s</span>
            {change !== null && (
              <span
                className={cn(
                  'inline-flex h-6 items-center gap-1 self-center rounded-full px-2 text-xs font-medium tabular-nums',
                  change >= 0
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'bg-surface-muted text-muted',
                )}
              >
                <TrendingUp
                  className={cn('size-3', change < 0 && '-scale-y-100')}
                  strokeWidth={2.5}
                />
                {change >= 0 ? '+' : ''}
                {change}%
              </span>
            )}
          </p> */}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {typeof repos === 'number' && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted tabular-nums">
              <strong className="font-semibold text-foreground">
                <Count value={repos} run={shown} still={still} delay={0.15} />
              </strong>
              repos
            </span>
          )}

          <p className=" flex flex-wrap items-center gap-2">
            {typeof total === 'number' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted tabular-nums">
                <strong className="font-semibold text-foreground">
                  <Count value={total} run={shown} still={still} delay={0.2} />
                </strong>
                {unit}s
              </span>
            )}
            {change !== null && (
              <span
                className={cn(
                  'inline-flex h-6 items-center gap-1 self-center rounded-full px-2 text-xs font-medium tabular-nums',
                  change >= 0
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'bg-surface-muted text-muted',
                )}
              >
                <TrendingUp
                  className={cn('size-3', change < 0 && '-scale-y-100')}
                  strokeWidth={2.5}
                />
                {change >= 0 ? '+' : ''}
                {change}%
              </span>
            )}
          </p>

          {/* {typeof stars === 'number' && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted tabular-nums">
              <strong className="font-semibold text-foreground">
                <Count value={stars} run={shown} still={still} delay={0.2} />
              </strong>
              stars
            </span>
          )} */}
          <span className="shrink-0 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
            {weeksLabel}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div ref={gridRef} className="relative mt-5 w-full">
        {width > 0 && (
          <>
            <div
              className="relative h-4 text-xs text-subtle"
              style={{ marginLeft: DAY_LABEL_W }}
            >
              {months.map((m) => (
                <span
                  key={`${m.col}-${m.label}`}
                  className="absolute top-0"
                  style={{ left: m.col * (cell + GAP) }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            <div className="mt-1.5 flex">
              <div
                className="relative shrink-0 text-xs text-subtle"
                style={{ width: DAY_LABEL_W, height: gridH }}
              >
                {[0, 2, 4].map((r) => (
                  <span
                    key={r}
                    className="absolute left-0 leading-none"
                    style={{ top: r * (cell + GAP) + cell / 2 - 6 }}
                  >
                    {WEEKDAYS[r]}
                  </span>
                ))}
              </div>

              <div
                role="grid"
                tabIndex={0}
                aria-label={`${title}: ${plural(total)} in the ${weeksLabel.toLowerCase()}. Use the arrow keys to read each day.`}
                onKeyDown={onKey}
                onBlur={() => setActive(null)}
                onPointerLeave={() => setActive(null)}
                className="focus-ring relative grid rounded-md"
                style={{
                  gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
                  gridTemplateRows: `repeat(7, ${cell}px)`,
                  gridAutoFlow: 'column',
                  gap: GAP,
                }}
              >
                {Array.from({ length: cols * 7 }, (_, i) => {
                  const col = Math.floor(i / 7);
                  const row = i % 7;
                  const idx = dayIndex(firstCol + col, row);
                  const isFuture = col === cols - 1 && row > todayRow;

                  if (isFuture || idx >= totalDays) {
                    return (
                      <span
                        key={i}
                        aria-hidden
                        style={{ width: cell, height: cell }}
                        className="rounded-[3px] bg-transparent"
                      />
                    );
                  }

                  const val = data[idx] ?? 0;
                  const lvl = levelOf(val);
                  const isSelected = active?.col === col && active?.row === row;
                  const dimmed = level !== null && lvl !== level;

                  return (
                    <motion.button
                      key={i}
                      type="button"
                      tabIndex={-1}
                      aria-label={
                        firstDay
                          ? `${plural(val)}, ${shortDate(addDays(firstDay, idx))}`
                          : plural(val)
                      }
                      onPointerEnter={() => setActive({ col, row })}
                      onFocus={() => setActive({ col, row })}
                      initial={still ? false : { scale: 0.4, opacity: 0 }}
                      animate={
                        shown
                          ? {
                              scale: isSelected ? 1.25 : 1,
                              opacity: dimmed ? 0.25 : 1,
                            }
                          : undefined
                      }
                      transition={{
                        duration: still ? 0 : 0.35,
                        delay: still
                          ? 0
                          : Math.min(0.6, (col * 7 + row) * 0.0012),
                        ease: EASE,
                      }}
                      style={{
                        width: cell,
                        height: cell,
                        backgroundColor:
                          lvl === 0 ? undefined : `var(--l${lvl})`,
                        transitionTimingFunction: EASE_CSS,
                      }}
                      className={cn(
                        'cursor-pointer rounded-[3px] outline-none',
                        lvl === 0 && 'bg-surface-muted',
                        isSelected && 'z-10 ring-2 ring-foreground',
                      )}
                    />
                  );
                })}
              </div>
            </div>

            {/* Tooltip & Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-subtle">
              <div className="min-h-5">
                <AnimatePresence mode="wait">
                  {tip ? (
                    <motion.span
                      key={tip}
                      initial={still ? false : { opacity: 0, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -2 }}
                      transition={{ duration: 0.15 }}
                      className="inline-block font-medium text-foreground"
                    >
                      {tip}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="hint"
                      initial={still ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {narrow ? 'Tap a square' : 'Hover or use arrow keys'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-1">
                <span>Less</span>
                {LEVELS.map((lvl) => {
                  const isLvlActive = level === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      aria-label={`Highlight level ${lvl}`}
                      onClick={() =>
                        setLevel((prev) => (prev === lvl ? null : lvl))
                      }
                      style={{
                        backgroundColor:
                          lvl === 0 ? undefined : `var(--l${lvl})`,
                      }}
                      className={cn(
                        'size-3 cursor-pointer rounded-xs transition-transform hover:scale-110',
                        lvl === 0 && 'bg-surface-muted',
                        isLvlActive && 'scale-110 ring-2 ring-foreground',
                      )}
                    />
                  );
                })}
                <span>More</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      {showStats && (
        <div className="mt-4 grid grid-cols-1 gap-2.5 border-t border-border pt-4 sm:grid-cols-3">
          {stats.map(({ label, value, suffix, note, Icon }, i) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-surface-muted/50 px-3.5 py-2.5"
            >
              <div className="flex items-center gap-1.5 text-xs text-subtle">
                <Icon className="size-3.5" strokeWidth={2} />
                <span>{label}</span>
              </div>
              <p className="mt-1 text-lg font-semibold leading-tight tracking-tight text-foreground tabular-nums">
                <Count
                  value={value}
                  run={shown}
                  still={still}
                  delay={0.25 + i * 0.06}
                />
                {suffix && (
                  <span className="text-xs font-normal text-muted">
                    {suffix}
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-subtle">{note}</p>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
});
