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
}

export function SnowfallBackground({
  className = '',
  intensity = 'normal',
  showBackground = true,
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
          className={`fixed inset-0 bg-gradient-to-br from-slate-200 via-blue-300 to-blue-900 dark:from-blue-900 dark:via-slate-900 dark:to-black animate-gradient-shift ${className}`}
        />
      )}

      {/* Snowfall effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
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
