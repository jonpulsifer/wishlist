'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import santa from '@/public/santaicon.png';

interface Snowflake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

interface LoadingProps {
  message?: string;
  showSanta?: boolean;
}

export function Loading({
  message = 'Loading...',
  showSanta = true,
}: LoadingProps) {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const flakes: Snowflake[] = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 1 + 0.2,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * -10,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-linear-to-br from-slate-200 to-blue-900 dark:from-blue-900 dark:via-slate-900 dark:to-black animate-gradient-shift" />

      {/* Snowfall effect */}
      <div className="absolute inset-0 pointer-events-none">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="snow"
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

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="relative sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center"
      >
        {showSanta && (
          <motion.div
            animate={{ rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0 }}
            transition={{ duration: 0.5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <Image
              priority
              alt="Santa"
              height={120}
              src={santa}
              width={120}
              className="drop-shadow-2xl"
            />
          </motion.div>
        )}

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-center text-5xl font-bold tracking-tight text-white drop-shadow-lg"
        >
          {message}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-xl text-center text-white/80"
        >
          Ho ho ho! Getting everything ready for you!
        </motion.p>

        {/* Loading spinner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-red-500 rounded-full animate-spin"
              style={{ animationDelay: '-0.5s' }}
            ></div>
          </div>
        </motion.div>

        {/* Pulsing snowflakes */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex space-x-3"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="text-white"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="drop-shadow-lg"
              >
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
              </svg>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
