import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { App } from "konsta/react"
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
export default function BeanCafe({ Component, pageProps }: AppProps) {
  return (
    <App
      className={inter.className}
      safeAreas
      dark>
      <Component {...pageProps} />
    </App>
  )
}
