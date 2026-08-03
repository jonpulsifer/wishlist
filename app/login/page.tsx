'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { PeekingSanta } from '@/components/peeking-santa';
import { SnowfallBackground } from '@/components/snowfall-background';
import { Loading } from '@/components/ui/loading';
import { daysUntilChristmas } from '@/lib/season';
import { WISHLIST_INVITE_COOKIE_NAME } from '@/lib/wishlist-invites';

import santa from '@/public/santaicon.png';

function getCookieValue(name: string) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replaceAll('.', '\\.')}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1] ?? '') : null;
}

function LoginPage() {
  const [showLoading, setShowLoading] = useState(false);
  const [inviteToken] = useState(() =>
    getCookieValue(WISHLIST_INVITE_COOKIE_NAME),
  );
  // After mount, not during render: the server counts in UTC and the browser
  // in local time, which is a hydration mismatch waiting to happen.
  const [sleeps, setSleeps] = useState<number | null>(null);
  useEffect(() => setSleeps(daysUntilChristmas()), []);

  if (showLoading) {
    return <Loading message="Signing in..." />;
  }

  const handleGoogle = (e: React.MouseEvent | React.FormEvent) => {
    setShowLoading(true);
    e.preventDefault();
    const callbackUrl =
      inviteToken && inviteToken.length > 0
        ? `/invite/${inviteToken}`
        : '/home';
    // No toast here: `redirect: true` navigates away, so anything raised on the
    // way out is unmounted before it can be shown.
    signIn('google', { redirect: true, callbackUrl });
  };

  return (
    <div className="relative flex min-h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 overflow-hidden">
      <SnowfallBackground intensity="normal" showBackground={true} />

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 flex w-full max-w-sm flex-col items-center"
      >
        <Image
          priority
          alt=""
          aria-hidden
          height={104}
          src={santa}
          width={104}
          className="float-gentle drop-shadow-2xl"
        />

        {/* The only h1 on the page — "Sign in to continue" used to be a second. */}
        <h1 className="mt-5 text-center text-5xl font-bold tracking-tight text-white drop-shadow-lg">
          wishin.app
        </h1>
        <p className="mt-2 text-center text-sm text-white/70">
          Wishlists for the people you love
        </p>

        <div className="mt-8 w-full rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
          <p className="text-center text-sm text-white/80">
            {inviteToken
              ? "You've been invited — sign in to accept 🎁"
              : "Sign in to see what everyone's wishing for"}
          </p>
          <form className="mt-5">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              // w-fit, so the button hugs its label and Santa still has an edge
              // to hide behind — anchoring him to a full-width wrapper would
              // leave him hanging off empty space.
              className="relative isolate mx-auto flex w-fit max-w-full flex-row items-center justify-center"
            >
              {/* 36×51 clears the 64px button by 6px top and bottom, and the
                  wider overhang works here because the card has room. */}
              <PeekingSanta className="top-1/2 -translate-x-8 -translate-y-1/2" />
              <button
                // Opaque and unblurred so Santa cannot ghost through, and h-16
                // keeps him inside it rather than clearing an edge.
                className="group flex h-16 max-w-full items-center justify-center rounded-lg bg-white px-6 font-semibold text-gray-900 shadow-lg transition-colors duration-200 hover:bg-neutral-100 sm:px-8"
                onClick={handleGoogle}
                type="button"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path
                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                        fill="#34A853"
                      />
                      <path
                        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                        fill="#EA4335"
                      />
                    </g>
                  </svg>
                  <span className="font-medium">Continue with Google</span>
                </div>
              </button>
            </motion.div>
          </form>
        </div>

        {sleeps !== null && (
          <p className="mt-6 text-center text-xs tracking-wide text-white/60">
            🎄 {sleeps} sleep{sleeps === 1 ? '' : 's'} till Christmas
          </p>
        )}
      </motion.main>
    </div>
  );
}

export default LoginPage;
