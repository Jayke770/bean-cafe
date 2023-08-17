"use client"
import "@/styles/globals.css"
import { Inter } from 'next/font/google'
import LayoutMain from "@/components/Layout"
const inter = Inter({ subsets: ['latin'] })
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutMain>
          {children}
        </LayoutMain>
      </body>
    </html>
  )
}
