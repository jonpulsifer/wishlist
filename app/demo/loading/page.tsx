'use client';

import { useEffect, useState } from 'react';
import { Loading } from '@/components/ui/loading';

export default function DemoLoadingPage() {
  const [showLoading, setShowLoading] = useState(true);

  // Simulate loading for 5 seconds then show a message
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (showLoading) {
    return <Loading message="Demo Loading..." />;
  }

  return (
    <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Loading Demo Complete!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          This demonstrates the beautiful loading page with snowfall animation.
        </p>
        <button
          onClick={() => setShowLoading(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Show Loading Again
        </button>
      </div>
    </div>
  );
}
