import type { Metadata, Viewport } from 'next';
import { Fredoka, Geist_Mono, Nunito } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

// Nunito reads warm at body sizes; Fredoka carries the headings.
const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
});

const fredoka = Fredoka({
  variable: '--font-fredoka',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const title = 'wishin.app';
const description = 'A wishlist app for not everyone';

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
  title: {
    template: `%s | ${title}`,
    default: title,
  },
  description: description,
  openGraph: {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: description,
    url: '/',
    siteName: title,
    locale: 'en_CA',
    type: 'website',
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/santaicon.png',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // The chrome paints edge to edge and pads itself back off the notch.
  viewportFit: 'cover',
  // Hex, not the oklch tokens: the meta tag is read by the OS chrome, which
  // has no stylesheet to resolve a variable against.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fef9f1' },
    { media: '(prefers-color-scheme: dark)', color: '#071221' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${fredoka.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
