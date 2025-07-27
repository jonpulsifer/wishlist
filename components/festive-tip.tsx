'use client';

import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const festiveTips = [
  {
    icon: '🎄',
    tip: 'The best gifts are those that come from the heart!',
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: '🎁',
    tip: "Remember: it's not about the price, it's about the thought!",
    color: 'from-red-400 to-pink-500',
  },
  {
    icon: '❄️',
    tip: 'Make a wishlist - help others help you create magic!',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    icon: '⭐',
    tip: 'Gift experiences, not just things. Memories last forever!',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: '🎅',
    tip: 'Secret Santa tip: Pay attention to what people mention casually!',
    color: 'from-purple-400 to-violet-500',
  },
  {
    icon: '🤗',
    tip: 'The joy is in the giving - watch their face light up!',
    color: 'from-pink-400 to-rose-500',
  },
  {
    icon: '✨',
    tip: 'Start early, stress less! Your future self will thank you.',
    color: 'from-indigo-400 to-blue-500',
  },
];

export function FestiveTip() {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    // Change tip based on day of year to keep it consistent per day
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000,
    );
    setCurrentTip(dayOfYear % festiveTips.length);
  }, []);

  const tip = festiveTips[currentTip];

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-sm border-white/20 dark:border-gray-700/30">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${tip.color} opacity-10`}
      />
      <CardContent className="p-4 relative">
        <div className="flex items-start gap-3">
          <div className="text-2xl animate-bounce">{tip.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Holiday Tip of the Day
              </span>
            </div>
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {tip.tip}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
