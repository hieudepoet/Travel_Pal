'use client';

import { Inter } from 'next/font/google'
import './globals.css'
import GlobalPopupWrapper from '@/components/GlobalPopupWrapper'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <GlobalPopupWrapper>
          {children}
        </GlobalPopupWrapper>
      </body>
    </html>
  );
}