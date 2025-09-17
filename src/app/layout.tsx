import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GigsUniverse",
  description: "A platform to discover and manage worldwide gigs.",
  manifest: '/manifest.json',
  applicationName: 'GigsUniverse',
  appleWebApp: {
    title: 'GigsUniverse',
    capable: true,
    statusBarStyle: 'default',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        
        <link rel="icon" href="/favicon.ico" />

        <link rel="preload" href="/manifest.json" as="fetch" crossOrigin="anonymous" />

        {/* Apple Mobile Section */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GigsUniverse" />
        <meta name ="background-color" content="#ffffff" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/Universe-Apple.png" />

      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased light`}>
        <Suspense>
          {children}
        </Suspense>
      </body>

    </html>
  );
}
