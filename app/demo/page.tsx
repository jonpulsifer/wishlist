'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Snowflake, Loader2 } from 'lucide-react';

export default function DemoPage() {
  const demos = [
    {
      title: '404 Page',
      description: 'Beautiful 404 page with snowfall animation and Santa icon',
      href: '/demo/404',
      icon: Snowflake,
      color: 'text-red-500',
    },
    {
      title: 'Loading Page',
      description: 'Festive loading page with animated spinner and snowfall',
      href: '/demo/loading',
      icon: Loader2,
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Demo Pages
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore the beautiful pages we've created with festive animations and modern design
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Link href={demo.href}>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <demo.icon className={`w-8 h-8 ${demo.color} mr-3`} />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {demo.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {demo.description}
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    <span className="font-medium">View Demo</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/">
            <button className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium">
              Back to Home
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}