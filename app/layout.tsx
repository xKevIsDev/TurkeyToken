import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] });

// Update these values with your actual deployment URL and image paths
const baseUrl = 'https://byteblitz.vercel.app'; // Replace with your actual URL

export const metadata: Metadata = {
  title: 'Byte Blitz',
  description: 'A fast-paced browser game where you catch bytes to collect tokens and advance through increasingly challenging levels!',
  
  // Basic metadata
  keywords: ['game', 'browser game', 'code game', 'arcade', 'next.js game'],
  authors: [{ name: 'KevIsDev' }],
  
  // Open Graph metadata
  openGraph: {
    title: 'Byte Blitz',
    description: 'Catch bytes, collect tokens, level up! Can you catch them all?',
    url: baseUrl,
    siteName: 'Byte Blitz',
    images: [
      {
        url: `${baseUrl}/screenshot.png`, // Replace with your actual image path
        width: 1200,
        height: 630,
        alt: 'Byte Blitz Screenshot',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter specific metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Byte Blitz',
    description: 'Catch bytes, collect tokens, level up! Can you catch them all?',
    creator: '@KevIsDev', // Replace with your Twitter handle
    images: [`${baseUrl}/screenshot.png`], // Replace with your actual image path
  },
  
  // Viewport
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
