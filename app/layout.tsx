import { Inter } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';

// Define Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});


export const metadata: Metadata = {
  title: 'Batu Vespa Fest',
  description: 'Batu Vespa Fest 2025',
  icons: {
    icon: [
      { url: '/icon-scooter.png', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-scooter.png', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
