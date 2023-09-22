import "@/styles/globals.css"
import 'react-loading-skeleton/dist/skeleton.css'
import LayoutMain from "@/app/KonstaProvider"
import NextAuthSessionProvider from "./NextAuthProvider"
import { NoticationProvider } from "@components/notification"
import { DialogProvider } from '@components/dialog'
import { Metadata } from "next"
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
export const metadata: Metadata = {
  title: "Bean Cafe",
  manifest: "/manifest.json",
  themeColor: "#cc9c68",
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/logo.png',
    },
    {
      rel: 'icon',
      url: '/logo.png',
    },
  ]
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className=" scroll-smooth">
      <body>
        <Toaster toastOptions={{
          className: "toast_custom_style"
        }} />
        <NextAuthSessionProvider>
          <LayoutMain>
            <NoticationProvider>
              <DialogProvider>
                {children}
              </DialogProvider>
            </NoticationProvider>
          </LayoutMain>
        </NextAuthSessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
