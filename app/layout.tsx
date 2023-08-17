"use client"
import "@/styles/globals.css"
import { Inter } from 'next/font/google'
import LayoutMain from "@/components/Layout"
const inter = Inter({ subsets: ['latin'] })
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className=" scroll-smooth">
      <head key={"index"}>
        <title>Welcome to Bean Cafe</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#cc9c68" />
      </head>
      <body>
        <LayoutMain>
          {children}
        </LayoutMain>
      </body>
    </html>
  )
}
