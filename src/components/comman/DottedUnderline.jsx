import { useId } from 'react';
import { cn } from '../../lib/utils';

export function DottedUnderline({
  dotRadius = 1,
  patternWidth = 6,
  patternHeight = 4,
  height: stripHeight = 4,
  color,
  className,
}) {
  const patternId = useId().replace(/:/g, '');

  return (
    <svg
      className={cn(
        'pointer-events-none mx-auto my-7 w-full max-w-md px-10',
        color == null && 'text-neutral-400',
        className,
      )}
      style={{ height: stripHeight }}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id={patternId}
          width={patternWidth}
          height={patternHeight}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={patternWidth / 2}
            cy={patternHeight / 2}
            r={dotRadius}
            fill={color ?? 'currentColor'}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
