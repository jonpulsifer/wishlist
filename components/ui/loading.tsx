'use client';

import santa from '@/public/santaicon.png';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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

export function Loading({ message = "Loading...", showSanta = true }: LoadingProps) {
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
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-red-500 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
          </div>
        </motion.div>

        {/* Pulsing dots */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-white rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}