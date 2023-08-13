import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { App } from "konsta/react"
import { Inter } from 'next/font/google'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { useState } from 'react'
const inter = Inter({ subsets: ['latin'] })
export default function BeanCafe({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const path = useState(router.asPath)
  return (
    <App
      theme='material'
      className={inter.className}
      safeAreas
      dark>
      <AnimatePresence mode='wait'>
        <Component {...pageProps} key={path} />
      </AnimatePresence>
    </App>
  )
}
