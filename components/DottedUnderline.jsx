import { cn } from '@/lib/utils';
import * as React from 'react';

export function DottedUnderline({
  dotRadius = 1,
  patternWidth = 6,
  patternHeight = 4,
  height: stripHeight = 4,
  color,
  className,
}) {
  const patternId = React.useId().replace(/:/g, '');

  return (
    <svg
      className={cn(
        'pointer-events-none w-full px-10 mx-auto my-7 max-w-md',
        color == null && 'text-neutral-400',
        className,
      )}
      style={{ height: stripHeight }}
      aria-hidden
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
