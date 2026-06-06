import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Smart Healthcare Dashboard',
  description:
    'Monitoring real-time Detak Jantung (BPM) dan Saturasi Oksigen (SpO₂)',

  applicationName: 'Smart Healthcare',

  keywords: [
    'healthcare',
    'iot',
    'bpm',
    'spo2',
    'monitoring',
    'dashboard',
    'smart healthcare',
  ],

  authors: [
    {
      name: 'Smart Healthcare Team',
    },
  ],

  themeColor: '#F8FAFC',
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="id"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
      `}
    >
      <body
        className="
          min-h-screen
          bg-slate-50
          text-slate-800
          antialiased
        "
      >
        {children}
      </body>
    </html>
  );
}