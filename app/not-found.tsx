'use client';

import santa from '@/public/santaicon.png';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

export default function NotFound() {
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
      <div className="fixed inset-0 bg-gradient-to-br from-slate-200 to-blue-900 dark:from-blue-900 dark:via-slate-900 dark:to-black animate-gradient-shift" />

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

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-center text-5xl font-bold tracking-tight text-white drop-shadow-lg"
        >
          404 Not Found
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-xl text-center text-white/80"
        >
          Ho ho ho! Looks like this page got lost in the North Pole!
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link href="/" className="mt-8 inline-block">
            <button
              className="group flex justify-center font-semibold px-6 h-12 p-3 rounded-xl 
                      bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white
                      shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]
                      transition-all duration-300 ease-out"
            >
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5" />
                <span className="font-medium">Back Home</span>
              </div>
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
