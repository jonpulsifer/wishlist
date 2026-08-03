'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

interface SnowfallBackgroundProps {
  className?: string;
  intensity?: 'light' | 'normal' | 'heavy';
  showBackground?: boolean;
  /**
   * Fall inside the nearest positioned ancestor instead of the viewport. The
   * viewport-fixed default sits *behind* an opaque page background, so the
   * flakes are invisible everywhere except a 1px gap.
   */
  contained?: boolean;
}

export function SnowfallBackground({
  className = '',
  intensity = 'normal',
  showBackground = true,
  contained = false,
}: SnowfallBackgroundProps) {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    // Adjust snowflake count based on intensity and theme
    let flakeCount = 50; // normal
    if (intensity === 'light') flakeCount = 25;
    if (intensity === 'heavy') flakeCount = 75;

    // Reduce intensity in dark mode to avoid being too aggressive
    if (isDark) {
      flakeCount = Math.floor(flakeCount * 0.6);
    }

    const flakes: Snowflake[] = Array.from({ length: flakeCount }).map(
      (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 1 + 0.2,
        duration: Math.random() * 5 + 5,
        delay: Math.random() * -10,
      }),
    );
    setSnowflakes(flakes);
  }, [intensity, isDark]);

  return (
    <>
      {/* Animated background */}
      {showBackground && (
        <div
          // Dark in both themes on purpose: the only screens that use this
          // backdrop put white text on it, and the old light variant started
          // at sky-200, which made the wordmark unreadable.
          className={`fixed inset-0 bg-gradient-to-br from-indigo-950 via-rose-950 to-slate-950 animate-gradient-shift ${className}`}
        />
      )}

      {/* Snowfall effect */}
      <div
        className={`${contained ? 'absolute' : 'fixed'} inset-0 pointer-events-none overflow-hidden z-0`}
      >
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className={`snow ${isDark ? 'opacity-40' : 'opacity-80'}`}
            style={{
              left: `${flake.left}%`,
              width: `${flake.size}rem`,
              height: `${flake.size}rem`,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
