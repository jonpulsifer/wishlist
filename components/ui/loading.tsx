'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { SnowfallBackground } from '@/components/snowfall-background';
import santa from '@/public/santaicon.png';

interface LoadingProps {
  message?: string;
  showSanta?: boolean;
}

export function Loading({
  message = 'Loading...',
  showSanta = true,
}: LoadingProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 overflow-hidden">
      <SnowfallBackground intensity="normal" showBackground={true} />

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
