'use client';

import * as React from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useVelocity,
} from 'motion/react';
import { cn } from '../lib/utils';

const DEFAULT_ITEMS = [
  {
    id: 'full-stack-apps',
    title: 'Full-Stack Web Engineering',
    content:
      'Build, deploy, and scale production applications using React.js, Next.js (SSR/SSG), TypeScript, Node.js, Express.js, MySQL, PostgreSQL, Prisma ORM, and Drizzle ORM, managing 5–6 live platforms end-to-end.',
  },
  {
    id: 'devops-cicd',
    title: 'VPS, Nginx & CI/CD Pipelines',
    content:
      'Configure Nginx reverse proxies and automated GitHub Actions CI/CD workflows across multi-VPS setups for zero-downtime deployments, alongside Redis caching, WebSockets, and Vercel hosting.',
  },
  {
    id: 'realtime-automation',
    title: 'Real-Time Tools & Automation',
    content:
      'Architect email-automation and campaign-management platforms, Electron.js and React/Redux analytics dashboards with live WebSocket alerts, centralized Dropbox media services, and internal EMS tools.',
  },
  {
    id: 'seo-llm-optimization',
    title: 'Technical SEO & LLM Optimization',
    content:
      'Improve organic search visibility and AI discoverability through technical SEO enhancements and LLM-readable Markdown (llms.txt) documentation to drive targeted traffic.',
  },
  {
    id: 'cloud-auth-validation',
    title: 'Cloud Systems, Auth & Validation',
    content:
      'Engineer cloud file-management workflows like FileVerse with Next.js, TypeScript, and Neon PostgreSQL, integrating Clerk OTP authentication and strict Zod schema validation.',
  },
];

const MASS = 1;
const critical = (k) => 2 * Math.sqrt(k * MASS);

const PANEL_CONTENT = {
  closed: { opacity: 0, y: -6, filter: 'blur(4px)' },
  open: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

function Row({ item, open, onToggle, blur, stiffness, still, uid, headerRef }) {
  const filterId = `${uid}-blur-${item.id}`;
  const headerId = `${uid}-h-${item.id}`;
  const panelId = `${uid}-p-${item.id}`;
  const inner = React.useRef(null);
  const panel = React.useRef(null);
  const blurNode = React.useRef(null);
  const placed = React.useRef(false);

  const height = useMotionValue(0);
  const speed = useVelocity(height);

  useMotionValueEvent(speed, 'change', (v) => {
    const sd = blur > 0 && !still ? Math.min(blur, Math.abs(v) / 110) : 0;
    blurNode.current?.setAttribute('stdDeviation', `0 ${sd.toFixed(2)}`);
    if (panel.current)
      panel.current.style.filter = sd > 0.05 ? `url(#${filterId})` : 'none';
  });

  React.useLayoutEffect(() => {
    const target = open ? (inner.current?.offsetHeight ?? 0) : 0;
    if (!placed.current || still) {
      height.set(target);
      placed.current = true;
      return;
    }
    const controls = animate(height, target, {
      type: 'spring',
      stiffness,
      damping: critical(stiffness) * 0.92,
      mass: MASS,
    });
    return () => controls.stop();
  }, [open, still, stiffness, height]);

  React.useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (open && Math.abs(speed.get()) < 1) height.set(el.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, height, speed]);

  return (
    <motion.div
      initial={false}
      animate={open ? 'open' : 'closed'}
      className={cn(
        'rounded-[18px] transition-colors duration-300',
        open ? 'bg-surface-hover' : 'bg-transparent hover:bg-surface-hover/50',
      )}
    >
      <svg aria-hidden className="absolute size-0">
        <filter id={filterId} x="-5%" y="-20%" width="110%" height="140%">
          <feGaussianBlur ref={blurNode} stdDeviation="0 0" />
        </filter>
      </svg>
      <h3 className="m-0">
        <motion.button
          ref={headerRef}
          type="button"
          id={headerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          whileTap={still ? undefined : { scale: 0.985 }}
          className={cn(
            'focus-ring group flex w-full cursor-pointer items-center justify-between gap-4 rounded-[18px] px-5 py-4 text-left text-base font-medium transition-colors duration-200',
            open ? 'text-foreground' : 'text-muted hover:text-foreground',
          )}
        >
          {item.title}
          <span
            aria-hidden
            className={cn(
              'relative grid size-7 shrink-0 place-items-center rounded-full transition-colors duration-300',
              open
                ? 'bg-accent text-accent-foreground'
                : 'bg-surface-muted text-muted group-hover:bg-border group-hover:text-foreground',
            )}
          >
            <span className="absolute h-[1.75px] w-3 rounded-full bg-current" />
            <motion.span
              className="absolute h-3 w-[1.75px] rounded-full bg-current"
              variants={{
                closed: { rotate: 0, scaleY: 1 },
                open: { rotate: 90, scaleY: 0 },
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
        </motion.button>
      </h3>
      <motion.div
        ref={panel}
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        aria-hidden={!open}
        style={{ height }}
        className="overflow-hidden"
      >
        <motion.div
          ref={inner}
          variants={PANEL_CONTENT}
          transition={{
            duration: still ? 0 : 0.4,
            ease: [0.22, 1, 0.36, 1],
            delay: open && !still ? 0.06 : 0,
          }}
          className="px-5 pb-5 text-sm leading-relaxed text-muted"
        >
          {item.content}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export const BlurAccordion = React.forwardRef(function BlurAccordion(
  {
    label = 'Things I do',
    items = DEFAULT_ITEMS,
    multiple = false,
    defaultOpen,
    blur = 6,
    stiffness = 380,
    onOpenChange,
    className,
  },
  ref,
) {
  const still = !!useReducedMotion();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const [openIds, setOpenIds] = React.useState(
    defaultOpen ?? (items[0] ? [items[0].id] : []),
  );
  const headers = React.useRef([]);

  const toggle = (id) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      const next = isOpen
        ? prev.filter((x) => x !== id)
        : multiple
          ? [...prev, id]
          : [id];
      onOpenChange?.(next);
      return next;
    });
  };

  // const focusAt = (i) =>
  //   headers.current[(i + items.length) % items.length]?.focus();

  return (
    <div
      ref={ref}
      // onKeyDown={(e) => {
      //   const at = headers.current.indexOf(document.activeElement);
      //   if (at < 0) return;
      // if (e.key === 'ArrowDown') (e.preventDefault(), focusAt(at + 1));
      // if (e.key === 'ArrowUp') (e.preventDefault(), focusAt(at - 1));
      // if (e.key === 'Home') (e.preventDefault(), focusAt(0));
      // if (e.key === 'End') (e.preventDefault(), focusAt(items.length - 1));
      // }}
      className={cn(
        'flex   flex-col gap-1   text-foreground   transition-colors duration-200 hover:border-border-hover',
        className,
      )}
    >
      {label && (
        <p className=" pt-3 pb-2 font-mono text-xs tracking-widest uppercase text-subtle">
          {label}
        </p>
      )}
      {items.map((item, i) => (
        <Row
          key={item.id}
          item={item}
          open={openIds.includes(item.id)}
          onToggle={() => toggle(item.id)}
          blur={blur}
          stiffness={stiffness}
          still={still}
          uid={uid}
          headerRef={(el) => void (headers.current[i] = el)}
        />
      ))}
    </div>
  );
});
