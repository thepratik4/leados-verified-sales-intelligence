import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'LeadOS - Executive B2B Lead Intelligence & Prospecting',
  description: 'Discover, rank, and analyze high-fit corporate accounts with AI-powered firmographics and real-time business signals.',
  openGraph: {
    title: 'LeadOS - Executive B2B Lead Intelligence & Prospecting',
    description: 'Discover, rank, and analyze high-fit corporate accounts with AI-powered firmographics and real-time business signals.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LeadOS - Executive B2B Lead Intelligence & Prospecting',
    description: 'Discover, rank, and analyze high-fit corporate accounts with AI-powered firmographics and real-time business signals.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
