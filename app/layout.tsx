"use client"
import "@/styles/globals.css"
import { Inter } from 'next/font/google'
import LayoutMain from "@/components/Layout"
const inter = Inter({ subsets: ['latin'] })
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" href="/logo.png" />
      <link rel="apple-touch-icon" href="/logo.png" />
      <meta name="theme-color" content="#cc9c68" />
      <body className={inter.className}>
        <LayoutMain>
          {children}
        </LayoutMain>
      </body>
    </html>
  )
}
