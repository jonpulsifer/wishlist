'use client';

import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { SnowfallBackground } from '@/components/snowfall-background';
import santa from '@/public/santaicon.png';

export default function NotFound() {
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
          <Link href="/home" className="mt-8 inline-block">
            <button
              className="group flex justify-center font-semibold px-6 h-12 p-3 rounded-xl 
                      bg-white/90 backdrop-blur-xs text-gray-900 hover:bg-white
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
